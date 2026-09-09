// ============================================
// Toolkit Pro - API Routes
// Complete Updated Version
// ============================================

const express = require("express");
const router = express.Router();
const database = require("../database");

// API Root
router.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Toolkit Pro API v1",
    endpoints: [
      "/api/v1/tools",
      "/api/v1/tools/:slug",
      "/api/v1/categories",
      "/api/v1/popular",
      "/api/v1/featured",
      "/api/v1/new",
      "/api/v1/search",
    ],
  });
});

// ক্যাটাগরি
router.get("/categories", async (req, res) => {
  try {
    const categories = await database.getMany(`
      SELECT * FROM tool_categories WHERE is_active = true ORDER BY sort_order ASC
    `);
    
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// পপুলার টুলস
router.get("/popular", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const tools = await database.getMany(`
      SELECT id, slug, name, category, description, icon, usage_count, rating
      FROM tools WHERE is_active = true AND is_popular = true
      ORDER BY usage_count DESC LIMIT $1
    `, [limit]);
    
    res.json({ success: true, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ফিচার্ড টুলস
router.get("/featured", async (req, res) => {
  try {
    const tools = await database.getMany(`
      SELECT id, slug, name, category, description, icon, usage_count, rating
      FROM tools WHERE is_active = true AND is_featured = true
      ORDER BY usage_count DESC LIMIT 20
    `);
    
    res.json({ success: true, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// নতুন টুলস
router.get("/new", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 12;
    const tools = await database.getMany(`
      SELECT id, slug, name, category, description, icon, usage_count, rating
      FROM tools WHERE is_active = true AND is_new = true
      ORDER BY created_at DESC LIMIT $1
    `, [limit]);
    
    res.json({ success: true, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// সার্চ
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ success: false, error: "Query required" });
    }
    
    const tools = await database.getMany(`
      SELECT id, slug, name, category, description, icon, usage_count, rating
      FROM tools 
      WHERE is_active = true 
        AND (name ILIKE $1 OR description ILIKE $1 OR slug ILIKE $1)
      ORDER BY usage_count DESC LIMIT 20
    `, [`%${q}%`]);
    
    res.json({ success: true, data: tools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// স্ট্যাটস
router.get("/stats", async (req, res) => {
  try {
    const toolCount = await database.getOne("SELECT COUNT(*) as total FROM tools WHERE is_active = true");
    const categoryCount = await database.getOne("SELECT COUNT(*) as total FROM tool_categories WHERE is_active = true");
    
    res.json({
      success: true,
      data: {
        tools: parseInt(toolCount.total),
        categories: parseInt(categoryCount.total),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
