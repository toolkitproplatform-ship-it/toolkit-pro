// ============================================
// Toolkit Pro - Tools Routes
// Complete Updated Version
// ============================================

const express = require("express");
const router = express.Router();
const database = require("../database");

// সব টুলস লিস্ট
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search, sort = "popular" } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    let queryText = `
      SELECT 
        id, slug, name, category, description, icon,
        usage_count, rating, rating_count,
        is_featured, is_popular, is_new,
        created_at
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
      queryText += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 1} OR slug ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    
    // কাউন্ট
    const countResult = await database.getOne(`
      SELECT COUNT(*) as total FROM tools WHERE is_active = true
      ${category && category !== "all" ? `AND category = $1` : ""}
      ${search ? `AND (name ILIKE $${category && category !== "all" ? "2" : "1"} OR description ILIKE $${category && category !== "all" ? "2" : "1"})` : ""}
    `, params);
    
    // সর্টিং
    switch (sort) {
      case "newest": queryText += ` ORDER BY created_at DESC`; break;
      case "rating": queryText += ` ORDER BY rating DESC`; break;
      case "alphabetical": queryText += ` ORDER BY name ASC`; break;
      default: queryText += ` ORDER BY usage_count DESC, rating DESC`;
    }
    
    // পেজিনেশন
    queryText += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(parseInt(limit), offset);
    
    const tools = await database.getMany(queryText, params);
    
    const totalPages = Math.ceil(parseInt(countResult.total) / parseInt(limit));
    
    res.json({
      success: true,
      message: "Tools retrieved",
      data: tools,
      pagination: {
        total: parseInt(countResult.total),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
      },
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error("Tools list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tools",
      error: error.message,
    });
  }
});

// সিঙ্গেল টুল
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    
    const tool = await database.getOne(`
      SELECT * FROM tools WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }
    
    res.json({
      success: true,
      message: "Tool retrieved",
      data: tool,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tool",
      error: error.message,
    });
  }
});

// টুল এক্সিকিউট
router.post("/:slug/execute", async (req, res) => {
  try {
    const { slug } = req.params;
    const input = req.body;
    
    const tool = await database.getOne(`
      SELECT * FROM tools WHERE slug = $1 AND is_active = true
    `, [slug]);
    
    if (!tool) {
      return res.status(404).json({
        success: false,
        message: "Tool not found",
      });
    }
    
    // ইউজ কাউন্ট আপডেট
    await database.query(`
      UPDATE tools SET usage_count = usage_count + 1 WHERE id = $1
    `, [tool.id]);
    
    // টুল এক্সিকিউশন লজিক
    let output = {};
    
    switch (tool.category) {
      case "text-tools":
        output = executeTextTool(tool.slug, input);
        break;
      case "developer-tools":
        output = executeDeveloperTool(tool.slug, input);
        break;
      case "security-tools":
        output = executeSecurityTool(tool.slug, input);
        break;
      default:
        output = { message: "Tool execution not implemented", input };
    }
    
    res.json({
      success: true,
      message: "Tool executed",
      data: {
        tool: tool.name,
        slug: tool.slug,
        output: output,
      },
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Execution failed",
      error: error.message,
    });
  }
});

// টেক্সট টুল এক্সিকিউশন
function executeTextTool(slug, input) {
  const text = input.text || input.input || "";
  
  switch (slug) {
    case "word-counter":
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      return {
        words,
        characters: text.length,
        charactersNoSpaces: text.replace(/\s/g, "").length,
        sentences: text.split(/[.!?]+/).filter(s => s.trim()).length,
        paragraphs: text.split(/\n\s*\n/).filter(p => p.trim()).length,
      };
      
    case "case-converter":
      return {
        uppercase: text.toUpperCase(),
        lowercase: text.toLowerCase(),
        titleCase: text.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
      };
      
    default:
      return { message: "Text processed", length: text.length };
  }
}

// ডেভেলপার টুল এক্সিকিউশন
function executeDeveloperTool(slug, input) {
  const text = input.text || input.input || "";
  
  switch (slug) {
    case "json-formatter":
      try {
        const parsed = JSON.parse(text);
        return { formatted: JSON.stringify(parsed, null, 2), valid: true };
      } catch (e) {
        return { valid: false, error: e.message };
      }
      
    case "json-validator":
      try {
        JSON.parse(text);
        return { valid: true };
      } catch (e) {
        return { valid: false, error: e.message };
      }
      
    default:
      return { message: "Processed", length: text.length };
  }
}

// সিকিউরিটি টুল এক্সিকিউশন
function executeSecurityTool(slug, input) {
  const text = input.text || input.input || "";
  
  switch (slug) {
    case "password-generator":
      const length = input.length || 12;
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return { password, length: password.length };
      
    case "hash-generator":
      const crypto = require("crypto");
      return {
        md5: crypto.createHash("md5").update(text).digest("hex"),
        sha1: crypto.createHash("sha1").update(text).digest("hex"),
        sha256: crypto.createHash("sha256").update(text).digest("hex"),
      };
      
    default:
      return { message: "Security processed" };
  }
}

// পপুলার টুলস
router.get("/popular", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const tools = await database.getMany(`
      SELECT id, slug, name, category, description, icon, usage_count, rating
      FROM tools 
      WHERE is_active = true 
      ORDER BY usage_count DESC, rating DESC 
      LIMIT $1
    `, [limit]);
    
    res.json({
      success: true,
      data: tools,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
