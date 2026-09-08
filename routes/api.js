// ============================================
// Toolkit Pro - Main API Routes
// ============================================
// API রাউটিং ও অ্যাডসেন্স এন্ডপয়েন্ট
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const express = require("express");
const router = express.Router();
const database = require("../database");
const redisClient = require("../redis");
const { apiLimiter } = require("../middleware/rateLimit");
const { standardResponse, errorResponse, paginatedResponse } = require("../utils/response");

// ----------------------------------------------
// API হেলথ চেক
// ----------------------------------------------
router.get("/", (req, res) => {
  return standardResponse(res, 200, true, "Toolkit Pro API v1", {
    version: "1.0.0",
    status: "operational",
    endpoints: [
      "/api/v1/tools",
      "/api/v1/tools/:slug",
      "/api/v1/categories",
      "/api/v1/search",
      "/api/v1/ads/placements",
      "/api/v1/stats",
    ],
    documentation: "https://toolkit-pro.onrender.com/api/v1",
  });
});

// ----------------------------------------------
// API হেলথ চেক (ডিটেইলড)
// ----------------------------------------------
router.get("/health", async (req, res) => {
  try {
    const dbStatus = await database.checkConnection();
    const redisStatus = await redisClient.checkConnection();
    
    return standardResponse(res, 200, true, "API is healthy", {
      status: "healthy",
      database: dbStatus ? "connected" : "disconnected",
      redis: redisStatus ? "connected" : "disconnected",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return errorResponse(res, 500, "Health check failed", error.message);
  }
});

// ----------------------------------------------
// ক্যাটাগরি লিস্ট
// ----------------------------------------------
router.get("/categories", apiLimiter, async (req, res) => {
  try {
    // ক্যাশে চেক
    const cacheKey = "categories:all";
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Categories retrieved from cache", cachedData);
    }
    
    // ডাটাবেস থেকে ফেচ
    const categories = await database.getMany(`
      SELECT 
        id, slug, name, name_bn, name_hi, name_es, 
        name_fr, name_de, name_ja, name_ko, name_zh, name_ar,
        description, icon, tool_count, sort_order
      FROM tool_categories 
      WHERE is_active = true 
      ORDER BY sort_order ASC, name ASC
    `);
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, categories, 600);
    
    return standardResponse(res, 200, true, "Categories retrieved", categories);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch categories", error.message);
  }
});

// ----------------------------------------------
// সিঙ্গেল ক্যাটাগরি
// ----------------------------------------------
router.get("/categories/:slug", apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    
    // ক্যাশে চেক
    const cacheKey = `category:${slug}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Category retrieved from cache", cachedData);
    }
    
    const category = await database.getOne(`
      SELECT 
        id, slug, name, name_bn, name_hi, name_es, 
        name_fr, name_de, name_ja, name_ko, name_zh, name_ar,
        description, icon, tool_count, sort_order
      FROM tool_categories 
      WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    if (!category) {
      return errorResponse(res, 404, "Category not found");
    }
    
    // ক্যাটাগরির টুলস
    const tools = await database.getMany(`
      SELECT 
        id, slug, name, category, icon, description,
        usage_count, rating, is_featured, is_popular, is_new
      FROM tools 
      WHERE category = $1 AND is_active = true 
      ORDER BY usage_count DESC 
      LIMIT 20
    `, [slug]);
    
    const result = {
      ...category,
      tools,
    };
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, result, 600);
    
    return standardResponse(res, 200, true, "Category retrieved", result);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch category", error.message);
  }
});

// ----------------------------------------------
// সার্চ টুলস
// ----------------------------------------------
router.get("/search", apiLimiter, async (req, res) => {
  try {
    const { q, category, limit = 20, page = 1 } = req.query;
    
    if (!q) {
      return errorResponse(res, 400, "Search query is required");
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // ক্যাশে চেক
    const cacheKey = `search:${q}:${category || "all"}:${page}:${limit}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Search results from cache", cachedData);
    }
    
    let queryText = `
      SELECT 
        id, slug, name, name_bn, name_hi, name_es, 
        name_fr, name_de, name_ja, name_ko, name_zh, name_ar,
        category, icon, description, usage_count, rating
      FROM tools 
      WHERE is_active = true 
        AND (
          name ILIKE $1 
          OR description ILIKE $1
          OR slug ILIKE $1
          OR tags::text ILIKE $1
          OR keywords::text ILIKE $1
        )
    `;
    
    const params = [`%${q}%`];
    
    if (category && category !== "all") {
      queryText += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    // টোটাল কাউন্ট
    const countResult = await database.getOne(`
      SELECT COUNT(*) as total 
      FROM tools 
      WHERE is_active = true 
        AND (
          name ILIKE $1 
          OR description ILIKE $1
          OR slug ILIKE $1
          OR tags::text ILIKE $1
          OR keywords::text ILIKE $1
        )
      ${category && category !== "all" ? `AND category = $${params.length + 1}` : ""}
    `, category && category !== "all" ? [...params, category] : params);
    
    queryText += ` ORDER BY usage_count DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);
    
    const tools = await database.getMany(queryText, params);
    
    const result = {
      results: tools,
      pagination: {
        total: parseInt(countResult.total),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult.total) / parseInt(limit)),
      },
    };
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, result, 300);
    
    return standardResponse(res, 200, true, "Search completed", result);
  } catch (error) {
    return errorResponse(res, 500, "Search failed", error.message);
  }
});

// ----------------------------------------------
// অ্যাড প্লেসমেন্ট
// ----------------------------------------------
router.get("/ads/placements", apiLimiter, async (req, res) => {
  try {
    const { location, tool } = req.query;
    
    // ক্যাশে চেক
    const cacheKey = `ads:${location || "all"}:${tool || "all"}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Ad placements from cache", cachedData);
    }
    
    let queryText = `
      SELECT 
        id, slug, name, location, size, format, 
        is_active, adsense_slot_id
      FROM ad_placements 
      WHERE is_active = true
    `;
    
    const params = [];
    
    if (location) {
      queryText += ` AND location = $${params.length + 1}`;
      params.push(location);
    }
    
    queryText += ` ORDER BY id ASC`;
    
    const placements = await database.getMany(queryText, params);
    
    // অ্যাডসেন্স কনফিগারেশন
    const adsenseConfig = {
      enabled: process.env.ADSENSE_ENABLED === "true",
      publisher_id: process.env.ADSENSE_PUBLISHER_ID || null,
      auto_ads: process.env.ADSENSE_AUTO_ADS === "true",
      placements: placements.map(p => ({
        slug: p.slug,
        name: p.name,
        location: p.location,
        size: p.size,
        format: p.format,
        slot_id: p.adsense_slot_id,
      })),
    };
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, adsenseConfig, 1800);
    
    return standardResponse(res, 200, true, "Ad placements retrieved", adsenseConfig);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch ad placements", error.message);
  }
});

// ----------------------------------------------
// সাইট স্ট্যাটস
// ----------------------------------------------
router.get("/stats", apiLimiter, async (req, res) => {
  try {
    // ক্যাশে চেক
    const cacheKey = "stats:site";
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Stats from cache", cachedData);
    }
    
    // টুল কাউন্ট
    const toolCount = await database.getOne(`
      SELECT COUNT(*) as total FROM tools WHERE is_active = true
    `);
    
    // ক্যাটাগরি কাউন্ট
    const categoryCount = await database.getOne(`
      SELECT COUNT(*) as total FROM tool_categories WHERE is_active = true
    `);
    
    // মোট ভিউ
    const totalViews = await database.getOne(`
      SELECT COALESCE(SUM(view_count), 0) as total FROM tool_views
    `);
    
    // ইউজার কাউন্ট
    const userCount = await database.getOne(`
      SELECT COUNT(*) as total FROM users WHERE is_active = true
    `);
    
    const stats = {
      tools: parseInt(toolCount.total),
      categories: parseInt(categoryCount.total),
      totalViews: parseInt(totalViews.total),
      users: parseInt(userCount.total),
      adsense: {
        enabled: process.env.ADSENSE_ENABLED === "true",
        publisher_id: process.env.ADSENSE_PUBLISHER_ID || null,
      },
    };
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, stats, 300);
    
    return standardResponse(res, 200, true, "Site stats retrieved", stats);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch stats", error.message);
  }
});

// ----------------------------------------------
// পপুলার টুলস
// ----------------------------------------------
router.get("/popular", apiLimiter, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // ক্যাশে চেক
    const cacheKey = `tools:popular:${limit}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Popular tools from cache", cachedData);
    }
    
    const tools = await database.getMany(`
      SELECT 
        id, slug, name, category, icon, description,
        usage_count, rating, rating_count
      FROM tools 
      WHERE is_active = true 
      ORDER BY usage_count DESC, rating DESC 
      LIMIT $1
    `, [parseInt(limit)]);
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, tools, 600);
    
    return standardResponse(res, 200, true, "Popular tools retrieved", tools);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch popular tools", error.message);
  }
});

// ----------------------------------------------
// ফিচার্ড টুলস
// ----------------------------------------------
router.get("/featured", apiLimiter, async (req, res) => {
  try {
    // ক্যাশে চেক
    const cacheKey = "tools:featured";
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "Featured tools from cache", cachedData);
    }
    
    const tools = await database.getMany(`
      SELECT 
        id, slug, name, category, icon, description,
        usage_count, rating, rating_count
      FROM tools 
      WHERE is_active = true AND is_featured = true 
      ORDER BY usage_count DESC 
      LIMIT 20
    `);
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, tools, 600);
    
    return standardResponse(res, 200, true, "Featured tools retrieved", tools);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch featured tools", error.message);
  }
});

// ----------------------------------------------
// নতুন টুলস
// ----------------------------------------------
router.get("/new", apiLimiter, async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    // ক্যাশে চেক
    const cacheKey = `tools:new:${limit}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return standardResponse(res, 200, true, "New tools from cache", cachedData);
    }
    
    const tools = await database.getMany(`
      SELECT 
        id, slug, name, category, icon, description,
        usage_count, rating, created_at
      FROM tools 
      WHERE is_active = true AND is_new = true 
      ORDER BY created_at DESC 
      LIMIT $1
    `, [parseInt(limit)]);
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, tools, 600);
    
    return standardResponse(res, 200, true, "New tools retrieved", tools);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch new tools", error.message);
  }
});

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = router;
