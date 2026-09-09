// ============================================
// General API Routes
// ============================================

const express = require("express");
const router = express.Router();
const database = require("../database");

// GET /api/v1/stats - স্ট্যাটস
router.get("/stats", async (req, res) => {
  try {
    const toolCount = await database.getOne(
      "SELECT COUNT(*) as total FROM tools WHERE is_active = true"
    );
    const categoryCount = await database.getOne(
      "SELECT COUNT(*) as total FROM tool_categories WHERE is_active = true"
    );
    const totalUsage = await database.getOne(
      "SELECT COALESCE(SUM(usage_count), 0) as total FROM tools"
    );
    
    res.status(200).json({
      success: true,
      message: "Stats retrieved successfully",
      data: {
        total_tools: parseInt(toolCount?.total || 0),
        total_categories: parseInt(categoryCount?.total || 0),
        total_usage: parseInt(totalUsage?.total || 0)
      }
    });
    
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stats",
      error: error.message
    });
  }
});

// GET /api/v1/featured - ফিচার্ড টুলস
router.get("/featured", async (req, res) => {
  try {
    const tools = await database.getMany(`
      SELECT * FROM tools 
      WHERE is_active = true AND is_featured = true 
      ORDER BY usage_count DESC 
      LIMIT 10
    `);
    
    res.status(200).json({
      success: true,
      message: "Featured tools retrieved successfully",
      data: tools
    });
    
  } catch (error) {
    console.error("❌ Error fetching featured tools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch featured tools",
      error: error.message
    });
  }
});

// GET /api/v1/popular - জনপ্রিয় টুলস
router.get("/popular", async (req, res) => {
  try {
    const tools = await database.getMany(`
      SELECT * FROM tools 
      WHERE is_active = true AND is_popular = true 
      ORDER BY usage_count DESC 
      LIMIT 10
    `);
    
    res.status(200).json({
      success: true,
      message: "Popular tools retrieved successfully",
      data: tools
    });
    
  } catch (error) {
    console.error("❌ Error fetching popular tools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular tools",
      error: error.message
    });
  }
});

// GET /api/v1/new - নতুন টুলস
router.get("/new", async (req, res) => {
  try {
    const tools = await database.getMany(`
      SELECT * FROM tools 
      WHERE is_active = true AND is_new = true 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    res.status(200).json({
      success: true,
      message: "New tools retrieved successfully",
      data: tools
    });
    
  } catch (error) {
    console.error("❌ Error fetching new tools:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch new tools",
      error: error.message
    });
  }
});

module.exports = router;
