// ============================================
// Toolkit Pro - Tools Routes
// ============================================
// ৫০০+ টুলস এন্ডপয়েন্ট ও এক্সিকিউশন লজিক
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
// সব টুলস লিস্ট (পেজিনেশন সহ)
// ----------------------------------------------
router.get("/", apiLimiter, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      sort = "popular",
      search = "" 
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // ক্যাশে চেক
    const cacheKey = `tools:list:${page}:${limit}:${category || "all"}:${sort}:${search}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      return paginatedResponse(res, 200, true, "Tools retrieved from cache", 
        cachedData.data, cachedData.pagination);
    }
    
    let queryText = `
      SELECT 
        id, slug, name, name_bn, name_hi, name_es, 
        name_fr, name_de, name_ja, name_ko, name_zh, name_ar,
        category, icon, description, usage_count, rating, rating_count,
        is_featured, is_popular, is_new
      FROM tools 
      WHERE is_active = true
    `;
    
    const params = [];
    
    // ক্যাটাগরি ফিল্টার
    if (category && category !== "all") {
      queryText += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    // সার্চ ফিল্টার
    if (search) {
      queryText += ` AND (
        name ILIKE $${params.length + 1} 
        OR description ILIKE $${params.length + 1}
        OR slug ILIKE $${params.length + 1}
      )`;
      params.push(`%${search}%`);
    }
    
    // কাউন্ট কোয়েরি
    const countResult = await database.getOne(`
      SELECT COUNT(*) as total FROM tools WHERE is_active = true
      ${category && category !== "all" ? `AND category = $1` : ""}
      ${search ? `AND (name ILIKE $${category && category !== "all" ? "2" : "1"} OR description ILIKE $${category && category !== "all" ? "2" : "1"} OR slug ILIKE $${category && category !== "all" ? "2" : "1"})` : ""}
    `, params);
    
    // সর্টিং
    switch (sort) {
      case "newest":
        queryText += ` ORDER BY created_at DESC`;
        break;
      case "rating":
        queryText += ` ORDER BY rating DESC, rating_count DESC`;
        break;
      case "alphabetical":
        queryText += ` ORDER BY name ASC`;
        break;
      case "popular":
      default:
        queryText += ` ORDER BY usage_count DESC, rating DESC`;
        break;
    }
    
    // পেজিনেশন
    queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);
    
    const tools = await database.getMany(queryText, params);
    
    const result = {
      data: tools,
      pagination: {
        total: parseInt(countResult.total),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(countResult.total) / parseInt(limit)),
        hasNext: parseInt(page) < Math.ceil(parseInt(countResult.total) / parseInt(limit)),
        hasPrev: parseInt(page) > 1,
      },
    };
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, result, 600);
    
    return paginatedResponse(res, 200, true, "Tools retrieved", 
      result.data, result.pagination);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch tools", error.message);
  }
});

// ----------------------------------------------
// সিঙ্গেল টুল (slug অনুযায়ী)
// ----------------------------------------------
router.get("/:slug", apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    
    // ক্যাশে চেক
    const cacheKey = `tool:${slug}`;
    const cachedData = await redisClient.getCache(cacheKey);
    
    if (cachedData) {
      // ভিউ কাউন্ট বাড়ান (অ্যাসিনক্রোনাস)
      incrementToolView(slug, req).catch(console.error);
      
      return standardResponse(res, 200, true, "Tool retrieved from cache", cachedData);
    }
    
    // ডাটাবেস থেকে ফেচ
    const tool = await database.getOne(`
      SELECT 
        t.*,
        tc.name as category_name,
        tc.icon as category_icon,
        (
          SELECT COALESCE(AVG(rating), 0) 
          FROM tool_reviews 
          WHERE tool_id = t.id AND is_approved = true
        ) as average_rating,
        (
          SELECT COUNT(*) 
          FROM tool_reviews 
          WHERE tool_id = t.id AND is_approved = true
        ) as review_count
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.slug
      WHERE t.slug = $1 AND t.is_active = true
    `, [slug]);
    
    if (!tool) {
      return errorResponse(res, 404, "Tool not found");
    }
    
    // সম্পর্কিত টুলস
    const relatedTools = await database.getMany(`
      SELECT 
        id, slug, name, category, icon, description,
        usage_count, rating
      FROM tools 
      WHERE category = $1 AND slug != $2 AND is_active = true 
      ORDER BY usage_count DESC 
      LIMIT 6
    `, [tool.category, slug]);
    
    // রিভিউস
    const reviews = await database.getMany(`
      SELECT 
        tr.id, tr.rating, tr.review_text, tr.created_at,
        u.name as user_name, u.avatar_url as user_avatar
      FROM tool_reviews tr
      LEFT JOIN users u ON tr.user_id = u.id
      WHERE tr.tool_id = $1 AND tr.is_approved = true 
      ORDER BY tr.created_at DESC 
      LIMIT 10
    `, [tool.id]);
    
    const result = {
      ...tool,
      related_tools: relatedTools,
      reviews,
    };
    
    // ক্যাশে সেভ
    await redisClient.setCache(cacheKey, result, 600);
    
    // ভিউ কাউন্ট বাড়ান
    incrementToolView(slug, req).catch(console.error);
    
    return standardResponse(res, 200, true, "Tool retrieved", result);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch tool", error.message);
  }
});

// ----------------------------------------------
// টুল এক্সিকিউট (POST)
// ----------------------------------------------
router.post("/:slug/execute", apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    const input = req.body;
    
    // টুল খুঁজুন
    const tool = await database.getOne(`
      SELECT * FROM tools WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    if (!tool) {
      return errorResponse(res, 404, "Tool not found");
    }
    
    // টুল এক্সিকিউশন লজিক (ক্যাটাগরি অনুযায়ী)
    const result = await executeTool(tool, input);
    
    // ইউজ কাউন্ট আপডেট
    await database.query(`
      UPDATE tools SET usage_count = usage_count + 1 WHERE id = $1
    `, [tool.id]);
    
    // ক্যাশে আপডেট
    await redisClient.increment(`tool:usage:${slug}`);
    
    return standardResponse(res, 200, true, "Tool executed successfully", {
      tool: tool.name,
      slug: tool.slug,
      input: input,
      output: result,
      execution_time: result.executionTime || 0,
    });
  } catch (error) {
    return errorResponse(res, 500, "Tool execution failed", error.message);
  }
});

// ----------------------------------------------
// টুল রিভিউ (POST)
// ----------------------------------------------
router.post("/:slug/review", apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating, review_text, user_id } = req.body;
    
    // ভ্যালিডেশন
    if (!rating || rating < 1 || rating > 5) {
      return errorResponse(res, 400, "Rating must be between 1 and 5");
    }
    
    // টুল খুঁজুন
    const tool = await database.getOne(`
      SELECT id FROM tools WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    if (!tool) {
      return errorResponse(res, 404, "Tool not found");
    }
    
    // রিভিউ ইনসার্ট
    const review = await database.getOne(`
      INSERT INTO tool_reviews (tool_id, user_id, rating, review_text)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [tool.id, user_id || null, rating, review_text]);
    
    // রেটিং আপডেট
    const ratingResult = await database.getOne(`
      SELECT 
        COALESCE(AVG(rating), 0) as avg_rating,
        COUNT(*) as rating_count
      FROM tool_reviews 
      WHERE tool_id = $1 AND is_approved = true
    `, [tool.id]);
    
    await database.query(`
      UPDATE tools 
      SET rating = $1, rating_count = $2 
      WHERE id = $3
    `, [ratingResult.avg_rating, ratingResult.rating_count, tool.id]);
    
    // ক্যাশে ক্লিয়ার
    await redisClient.deleteCache(`tool:${slug}`);
    
    return standardResponse(res, 201, true, "Review submitted", review);
  } catch (error) {
    return errorResponse(res, 500, "Failed to submit review", error.message);
  }
});

// ----------------------------------------------
// টুল ফেভারিট (POST)
// ----------------------------------------------
router.post("/:slug/favorite", apiLimiter, async (req, res) => {
  try {
    const { slug } = req.params;
    const { user_id } = req.body;
    
    if (!user_id) {
      return errorResponse(res, 400, "User ID is required");
    }
    
    // টুল খুঁজুন
    const tool = await database.getOne(`
      SELECT id FROM tools WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    if (!tool) {
      return errorResponse(res, 404, "Tool not found");
    }
    
    // ফেভারিট চেক
    const existing = await database.getOne(`
      SELECT id FROM user_favorites 
      WHERE user_id = $1 AND tool_id = $2
    `, [user_id, tool.id]);
    
    if (existing) {
      // আনফেভারিট
      await database.query(`
        DELETE FROM user_favorites WHERE id = $1
      `, [existing.id]);
      
      return standardResponse(res, 200, true, "Tool removed from favorites");
    } else {
      // ফেভারিট যোগ
      await database.query(`
        INSERT INTO user_favorites (user_id, tool_id)
        VALUES ($1, $2)
      `, [user_id, tool.id]);
      
      return standardResponse(res, 201, true, "Tool added to favorites");
    }
  } catch (error) {
    return errorResponse(res, 500, "Failed to update favorite", error.message);
  }
});

// ----------------------------------------------
// হেল্পার ফাংশন: ভিউ কাউন্ট বাড়ান
// ----------------------------------------------
async function incrementToolView(slug, req) {
  try {
    const tool = await database.getOne(`
      SELECT id FROM tools WHERE slug = $1
    `, [slug]);
    
    if (!tool) return;
    
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get("user-agent") || "";
    const referrer = req.get("referrer") || "";
    const today = new Date().toISOString().split("T")[0];
    
    // ভিউ আপডেট
    await database.query(`
      INSERT INTO tool_views (tool_id, ip_address, user_agent, referrer, view_date, view_count)
      VALUES ($1, $2, $3, $4, $5, 1)
      ON CONFLICT (tool_id, view_date, ip_address)
      DO UPDATE SET view_count = tool_views.view_count + 1
    `, [tool.id, ipAddress, userAgent, referrer, today]);
    
    // টুল ইউজ কাউন্ট আপডেট
    await database.query(`
      UPDATE tools SET usage_count = usage_count + 1 WHERE id = $1
    `, [tool.id]);
    
  } catch (error) {
    console.error("Failed to increment view:", error.message);
  }
}

// ----------------------------------------------
// হেল্পার ফাংশন: টুল এক্সিকিউট
// ----------------------------------------------
async function executeTool(tool, input) {
  const startTime = Date.now();
  let result;
  
  switch (tool.category) {
    case "text-tools":
      result = executeTextTool(tool.slug, input);
      break;
      
    case "developer-tools":
      result = executeDeveloperTool(tool.slug, input);
      break;
      
    case "security-tools":
      result = executeSecurityTool(tool.slug, input);
      break;
      
    case "data-tools":
      result = executeDataTool(tool.slug, input);
      break;
      
    case "converter-tools":
      result = executeConverterTool(tool.slug, input);
      break;
      
    case "calculator-tools":
      result = executeCalculatorTool(tool.slug, input);
      break;
      
    default:
      result = { message: "Tool execution not implemented yet" };
  }
  
  result.executionTime = Date.now() - startTime;
  return result;
}

// ----------------------------------------------
// টেক্সট টুলস এক্সিকিউশন
// ----------------------------------------------
function executeTextTool(slug, input) {
  switch (slug) {
    case "word-counter":
      const text = input.text || "";
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, "").length;
      const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
      const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
      
      return {
        words,
        characters,
        charactersNoSpaces,
        sentences,
        paragraphs,
        readingTime: Math.ceil(words / 200),
        speakingTime: Math.ceil(words / 130),
      };
      
    case "case-converter":
      const text2 = input.text || "";
      return {
        uppercase: text2.toUpperCase(),
        lowercase: text2.toLowerCase(),
        titleCase: text2.replace(/\w\S*/g, txt => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        ),
        sentenceCase: text2.charAt(0).toUpperCase() + text2.slice(1).toLowerCase(),
      };
      
    default:
      return { message: "Text tool not implemented" };
  }
}

// ----------------------------------------------
// ডেভেলপার টুলস এক্সিকিউশন
// ----------------------------------------------
function executeDeveloperTool(slug, input) {
  switch (slug) {
    case "json-formatter":
      try {
        const jsonObj = typeof input.json === "string" 
          ? JSON.parse(input.json) 
          : input.json;
        return {
          formatted: JSON.stringify(jsonObj, null, 2),
          valid: true,
        };
      } catch (error) {
        return {
          valid: false,
          error: error.message,
        };
      }
      
    case "json-validator":
      try {
        JSON.parse(input.json);
        return { valid: true };
      } catch (error) {
        return { 
          valid: false, 
          error: error.message 
        };
      }
      
    default:
      return { message: "Developer tool not implemented" };
  }
}

// ----------------------------------------------
// সিকিউরিটি টুলস এক্সিকিউশন
// ----------------------------------------------
function executeSecurityTool(slug, input) {
  switch (slug) {
    case "password-generator":
      const length = input.length || 12;
      const includeUpper = input.includeUpper !== false;
      const includeLower = input.includeLower !== false;
      const includeNumbers = input.includeNumbers !== false;
      const includeSymbols = input.includeSymbols !== false;
      
      let chars = "";
      if (includeUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      if (includeLower) chars += "abcdefghijklmnopqrstuvwxyz";
      if (includeNumbers) chars += "0123456789";
      if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";
      
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      return {
        password,
        length: password.length,
        strength: calculatePasswordStrength(password),
      };
      
    case "hash-generator":
      const crypto = require("crypto");
      const text = input.text || "";
      return {
        md5: crypto.createHash("md5").update(text).digest("hex"),
        sha1: crypto.createHash("sha1").update(text).digest("hex"),
        sha256: crypto.createHash("sha256").update(text).digest("hex"),
        sha512: crypto.createHash("sha512").update(text).digest("hex"),
      };
      
    default:
      return { message: "Security tool not implemented" };
  }
}

// ----------------------------------------------
// পাসওয়ার্ড স্ট্রেংথ ক্যালকুলেটর
// ----------------------------------------------
function calculatePasswordStrength(password) {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  if (score <= 2) return "Weak";
  if (score <= 4) return "Medium";
  if (score <= 5) return "Strong";
  return "Very Strong";
}

// ----------------------------------------------
// ডেটা টুলস এক্সিকিউশন
// ----------------------------------------------
function executeDataTool(slug, input) {
  switch (slug) {
    case "csv-to-json":
      try {
        const csv = input.csv || "";
        const lines = csv.trim().split("\n");
        const headers = lines[0].split(",").map(h => h.trim());
        
        const json = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(",");
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = values[index] ? values[index].trim() : "";
          });
          json.push(obj);
        }
        
        return { json };
      } catch (error) {
        return { error: error.message };
      }
      
    default:
      return { message: "Data tool not implemented" };
  }
}

// ----------------------------------------------
// কনভার্টার টুলস এক্সিকিউশন
// ----------------------------------------------
function executeConverterTool(slug, input) {
  switch (slug) {
    case "unit-converter":
      const { value, from, to } = input;
      
      // সাধারণ দৈর্ঘ্য কনভার্শন
      const conversions = {
        m: { ft: 3.28084, km: 0.001, cm: 100, mi: 0.000621371 },
        ft: { m: 0.3048, km: 0.0003048, cm: 30.48, mi: 0.000189394 },
        km: { m: 1000, ft: 3280.84, cm: 100000, mi: 0.621371 },
        mi: { m: 1609.34, km: 1.60934, ft: 5280, cm: 160934 },
        cm: { m: 0.01, ft: 0.0328084, km: 0.00001, mi: 0.00000621371 },
      };
      
      if (conversions[from] && conversions[from][to]) {
        return {
          result: value * conversions[from][to],
          from: `${value}${from}`,
          to: `${value * conversions[from][to]}${to}`,
        };
      }
      
      return { error: "Conversion not supported" };
      
    default:
      return { message: "Converter tool not implemented" };
  }
}

// ----------------------------------------------
// ক্যালকুলেটর টুলস এক্সিকিউশন
// ----------------------------------------------
function executeCalculatorTool(slug, input) {
  switch (slug) {
    case "bmi-calculator":
      const { weight, height } = input; // kg, cm
      const heightM = height / 100;
      const bmi = weight / (heightM * heightM);
      
      let category;
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";
      
      return {
        bmi: bmi.toFixed(2),
        category,
        healthyWeightRange: {
          min: (18.5 * heightM * heightM).toFixed(1),
          max: (24.9 * heightM * heightM).toFixed(1),
        },
      };
      
    default:
      return { message: "Calculator tool not implemented" };
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = router;
