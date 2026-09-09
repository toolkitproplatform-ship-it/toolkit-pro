// ============================================
// Tools API Routes
// ============================================

const express = require("express");
const router = express.Router();
const database = require("../database");

// ============================================
// GET /api/v1/tools - সব টুলস লিস্ট
// ============================================
router.get("/", async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0, 
      category = "", 
      search = "",
      sort = "name",
      order = "asc",
      featured = false,
      popular = false,
      is_new = false
    } = req.query;

    // SQL কোয়েরি তৈরি
    let sql = `
      SELECT 
        t.*,
        tc.name as category_name,
        tc.icon as category_icon
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.slug
      WHERE t.is_active = true
    `;
    
    const params = [];
    
    // ফিল্টার যোগ
    if (category) {
      params.push(category);
      sql += ` AND t.category = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      sql += ` AND (t.name ILIKE $${params.length} OR t.description ILIKE $${params.length})`;
    }
    
    if (featured === "true") {
      sql += ` AND t.is_featured = true`;
    }
    
    if (popular === "true") {
      sql += ` AND t.is_popular = true`;
    }
    
    if (is_new === "true") {
      sql += ` AND t.is_new = true`;
    }
    
    // সর্টিং
    const validSortFields = ["name", "usage_count", "rating", "created_at"];
    const sortField = validSortFields.includes(sort) ? sort : "name";
    const sortOrder = order.toLowerCase() === "desc" ? "DESC" : "ASC";
    sql += ` ORDER BY t.${sortField} ${sortOrder}`;
    
    // পেজিনেশন
    sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit));
    params.push(parseInt(offset));
    
    const tools = await database.getMany(sql, params);
    
    // মোট কাউন্ট
    let countSql = `
      SELECT COUNT(*) as total 
      FROM tools t 
      WHERE t.is_active = true
    `;
    const countParams = [];
    
    if (category) {
      countParams.push(category);
      countSql += ` AND t.category = $${countParams.length}`;
    }
    
    if (search) {
      countParams.push(`%${search}%`);
      countSql += ` AND (t.name ILIKE $${countParams.length} OR t.description ILIKE $${countParams.length})`;
    }
    
    const countResult = await database.getOne(countSql, countParams);
    
    res.status(200).json({
      success: true,
      message: "Tools retrieved successfully",
      data: tools,
      pagination: {
        total: parseInt(countResult?.total || 0),
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + tools.length < parseInt(countResult?.total || 0)
      }
    });
    
  } catch (error) {
    console.error("❌ Error fetching tools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tools",
      error: error.message
    });
  }
});

// ============================================
// GET /api/v1/tools/categories - সব ক্যাটাগরি
// ============================================
router.get("/categories", async (req, res) => {
  try {
    const categories = await database.getMany(`
      SELECT 
        tc.*,
        (SELECT COUNT(*) FROM tools t WHERE t.category = tc.slug AND t.is_active = true) as actual_tool_count
      FROM tool_categories tc
      WHERE tc.is_active = true
      ORDER BY tc.sort_order ASC
    `);
    
    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: categories
    });
    
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message
    });
  }
});

// ============================================
// GET /api/v1/tools/:slug - নির্দিষ্ট টুল
// ============================================
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const tool = await database.getOne(`
      SELECT 
        t.*,
        tc.name as category_name,
        tc.icon as category_icon
      FROM tools t
      LEFT JOIN tool_categories tc ON t.category = tc.slug
      WHERE t.slug = $1 AND t.is_active = true
    `, [slug]);
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
        data: null
      });
    }
    
    // ব্যবহার কাউন্ট বাড়ান
    await database.query(`
      UPDATE tools 
      SET usage_count = usage_count + 1 
      WHERE slug = $1
    `, [slug]);
    
    res.status(200).json({
      success: true,
      message: "Tool retrieved successfully",
      data: tool
    });
    
  } catch (error) {
    console.error("❌ Error fetching tool:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tool",
      error: error.message
    });
  }
});

// ============================================
// POST /api/v1/tools/:slug/rate - টুল রেটিং
// ============================================
router.post("/:slug/rate", async (req, res) => {
  try {
    const { slug } = req.params;
    const { rating } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Invalid rating value"
      });
    }
    
    const tool = await database.getOne(
      "SELECT * FROM tools WHERE slug = $1",
      [slug]
    );
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found"
      });
    }
    
    // নতুন রেটিং হিসাব
    const newRatingCount = tool.rating_count + 1;
    const newRating = ((tool.rating * tool.rating_count) + rating) / newRatingCount;
    
    await database.query(`
      UPDATE tools 
      SET rating = $1, rating_count = $2 
      WHERE slug = $3
    `, [newRating, newRatingCount, slug]);
    
    res.status(200).json({
      success: true,
      message: "Rating submitted successfully"
    });
    
  } catch (error) {
    console.error("❌ Error rating tool:", error);
    res.status(500).json({
      success: false,
      message: "Failed to rate tool",
      error: error.message
    });
  }
});

module.exports = router;
