// ============================================
// Toolkit Pro - Authentication Routes
// ============================================
// ইউজার রেজিস্ট্রেশন, লগইন, প্রোফাইল ম্যানেজমেন্ট
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const database = require("../database");
const redisClient = require("../redis");
const { authLimiter } = require("../middleware/rateLimit");
const { authenticateToken } = require("../middleware/auth");
const { standardResponse, errorResponse } = require("../utils/response");

// ----------------------------------------------
// ইউজার রেজিস্ট্রেশন
// ----------------------------------------------
router.post("/register", authLimiter, async (req, res) => {
  try {
    const { email, password, name, language = "en", country } = req.body;
    
    // ভ্যালিডেশন
    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }
    
    // ইমেইল ফরম্যাট চেক
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, "Invalid email format");
    }
    
    // পাসওয়ার্ড স্ট্রেংথ চেক
    if (password.length < 8) {
      return errorResponse(res, 400, "Password must be at least 8 characters");
    }
    
    // ইউজার আছে কিনা চেক
    const existingUser = await database.getOne(`
      SELECT id FROM users WHERE email = $1
    `, [email.toLowerCase()]);
    
    if (existingUser) {
      return errorResponse(res, 409, "User with this email already exists");
    }
    
    // পাসওয়ার্ড হ্যাশ
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // ইউজার তৈরি
    const newUser = await database.getOne(`
      INSERT INTO users (uuid, email, password_hash, name, language, country)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, uuid, email, name, language, country, created_at
    `, [uuidv4(), email.toLowerCase(), passwordHash, name || email.split("@")[0], language, country]);
    
    // JWT টোকেন জেনারেট
    const token = generateToken(newUser);
    
    // সেশনে সেভ
    await saveSession(newUser.id, token, req);
    
    // রেসপন্স
    return standardResponse(res, 201, true, "User registered successfully", {
      user: {
        id: newUser.id,
        uuid: newUser.uuid,
        email: newUser.email,
        name: newUser.name,
        language: newUser.language,
        country: newUser.country,
      },
      token,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (error) {
    return errorResponse(res, 500, "Registration failed", error.message);
  }
});

// ----------------------------------------------
// ইউজার লগইন
// ----------------------------------------------
router.post("/login", authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // ভ্যালিডেশন
    if (!email || !password) {
      return errorResponse(res, 400, "Email and password are required");
    }
    
    // ইউজার খুঁজুন
    const user = await database.getOne(`
      SELECT * FROM users WHERE email = $1 AND is_active = true
    `, [email.toLowerCase()]);
    
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }
    
    // পাসওয়ার্ড ভেরিফাই
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Invalid email or password");
    }
    
    // JWT টোকেন জেনারেট
    const token = generateToken(user);
    
    // সেশনে সেভ
    await saveSession(user.id, token, req);
    
    // লাস্ট লগইন আপডেট
    await database.query(`
      UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1
    `, [user.id]);
    
    // ইউজার ক্যাশে
    await redisClient.cacheUser(user.id, {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      name: user.name,
      language: user.language,
      country: user.country,
    }, 3600);
    
    return standardResponse(res, 200, true, "Login successful", {
      user: {
        id: user.id,
        uuid: user.uuid,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        language: user.language,
        country: user.country,
      },
      token,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN || "7d",
    });
  } catch (error) {
    return errorResponse(res, 500, "Login failed", error.message);
  }
});

// ----------------------------------------------
// ইউজার লগআউট
// ----------------------------------------------
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    // সেশন ডিলিট
    await database.query(`
      DELETE FROM sessions WHERE token = $1
    `, [token]);
    
    // ক্যাশে ক্লিয়ার
    await redisClient.deleteSession(req.user.id);
    await redisClient.deleteCachedUser(req.user.id);
    
    return standardResponse(res, 200, true, "Logout successful");
  } catch (error) {
    return errorResponse(res, 500, "Logout failed", error.message);
  }
});

// ----------------------------------------------
// ইউজার প্রোফাইল (GET)
// ----------------------------------------------
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // ক্যাশে চেক
    const cachedUser = await redisClient.getCachedUser(userId);
    if (cachedUser) {
      return standardResponse(res, 200, true, "Profile retrieved from cache", cachedUser);
    }
    
    // ডাটাবেস থেকে ফেচ
    const user = await database.getOne(`
      SELECT 
        id, uuid, email, name, avatar_url, 
        language, country, timezone,
        is_verified, created_at, last_login_at
      FROM users 
      WHERE id = $1 AND is_active = true
    `, [userId]);
    
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    
    // ইউজার স্ট্যাটস
    const stats = await database.getOne(`
      SELECT 
        (SELECT COUNT(*) FROM user_favorites WHERE user_id = $1) as favorite_count,
        (SELECT COUNT(*) FROM tool_reviews WHERE user_id = $1) as review_count
    `, [userId]);
    
    const result = {
      ...user,
      stats: {
        favorites: parseInt(stats.favorite_count),
        reviews: parseInt(stats.review_count),
      },
    };
    
    // ক্যাশে সেভ
    await redisClient.cacheUser(userId, result, 3600);
    
    return standardResponse(res, 200, true, "Profile retrieved", result);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch profile", error.message);
  }
});

// ----------------------------------------------
// ইউজার প্রোফাইল (PUT - আপডেট)
// ----------------------------------------------
router.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar_url, language, country, timezone } = req.body;
    
    // আপডেট কোয়েরি
    const updatedUser = await database.getOne(`
      UPDATE users 
      SET 
        name = COALESCE($1, name),
        avatar_url = COALESCE($2, avatar_url),
        language = COALESCE($3, language),
        country = COALESCE($4, country),
        timezone = COALESCE($5, timezone),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $6 AND is_active = true
      RETURNING id, uuid, email, name, avatar_url, language, country, timezone
    `, [name, avatar_url, language, country, timezone, userId]);
    
    if (!updatedUser) {
      return errorResponse(res, 404, "User not found");
    }
    
    // ক্যাশে আপডেট
    await redisClient.cacheUser(userId, updatedUser, 3600);
    
    return standardResponse(res, 200, true, "Profile updated", updatedUser);
  } catch (error) {
    return errorResponse(res, 500, "Failed to update profile", error.message);
  }
});

// ----------------------------------------------
// পাসওয়ার্ড চেঞ্জ
// ----------------------------------------------
router.put("/password", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;
    
    if (!current_password || !new_password) {
      return errorResponse(res, 400, "Current and new password are required");
    }
    
    if (new_password.length < 8) {
      return errorResponse(res, 400, "New password must be at least 8 characters");
    }
    
    // ইউজার ফেচ
    const user = await database.getOne(`
      SELECT password_hash FROM users WHERE id = $1
    `, [userId]);
    
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    
    // কারেন্ট পাসওয়ার্ড ভেরিফাই
    const isPasswordValid = await bcrypt.compare(current_password, user.password_hash);
    
    if (!isPasswordValid) {
      return errorResponse(res, 401, "Current password is incorrect");
    }
    
    // নতুন পাসওয়ার্ড হ্যাশ
    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);
    
    // আপডেট
    await database.query(`
      UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [newPasswordHash, userId]);
    
    // সব সেশন ক্লিয়ার
    await database.query(`
      DELETE FROM sessions WHERE user_id = $1
    `, [userId]);
    
    return standardResponse(res, 200, true, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, 500, "Failed to change password", error.message);
  }
});

// ----------------------------------------------
// ইউজার ফেভারিটস (GET)
// ----------------------------------------------
router.get("/favorites", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const favorites = await database.getMany(`
      SELECT 
        t.id, t.slug, t.name, t.category, t.icon, 
        t.description, t.usage_count, t.rating,
        uf.created_at as favorited_at
      FROM user_favorites uf
      JOIN tools t ON uf.tool_id = t.id
      WHERE uf.user_id = $1 AND t.is_active = true
      ORDER BY uf.created_at DESC
    `, [userId]);
    
    return standardResponse(res, 200, true, "Favorites retrieved", favorites);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch favorites", error.message);
  }
});

// ----------------------------------------------
// টোকেন রিফ্রেশ
// ----------------------------------------------
router.post("/refresh", async (req, res) => {
  try {
    const { refresh_token } = req.body;
    
    if (!refresh_token) {
      return errorResponse(res, 400, "Refresh token is required");
    }
    
    // টোকেন ভেরিফাই
    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);
      
      // ইউজার ফেচ
      const user = await database.getOne(`
        SELECT id, uuid, email, name, is_active FROM users WHERE id = $1
      `, [decoded.userId]);
      
      if (!user || !user.is_active) {
        return errorResponse(res, 401, "Invalid refresh token");
      }
      
      // নতুন টোকেন জেনারেট
      const newToken = generateToken(user);
      
      return standardResponse(res, 200, true, "Token refreshed", {
        token: newToken,
        token_type: "Bearer",
        expires_in: process.env.JWT_EXPIRES_IN || "7d",
      });
      
    } catch (error) {
      return errorResponse(res, 401, "Invalid refresh token");
    }
  } catch (error) {
    return errorResponse(res, 500, "Token refresh failed", error.message);
  }
});

// ----------------------------------------------
// হেল্পার ফাংশন: JWT টোকেন জেনারেট
// ----------------------------------------------
function generateToken(user) {
  const payload = {
    userId: user.id,
    uuid: user.uuid,
    email: user.email,
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// ----------------------------------------------
// হেল্পার ফাংশন: সেশন সেভ
// ----------------------------------------------
async function saveSession(userId, token, req) {
  try {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 দিন
    
    await database.query(`
      INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at)
      VALUES ($1, $2, $3, $4, $5)
    `, [
      userId,
      token,
      req.ip || req.connection.remoteAddress,
      req.get("user-agent") || "",
      expiresAt,
    ]);
    
    // Redis সেশন
    await redisClient.setSession(userId, {
      userId,
      token,
      createdAt: new Date().toISOString(),
    }, 604800); // 7 দিন
  } catch (error) {
    console.error("Failed to save session:", error.message);
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = router;
