// ============================================
// Toolkit Pro - Authentication Middleware
// ============================================
// JWT টোকেন ভেরিফিকেশন ও ইউজার অথরাইজেশন
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const jwt = require("jsonwebtoken");
const database = require("../database");
const redisClient = require("../redis");
const { errorResponse } = require("../utils/response");

// ----------------------------------------------
// JWT টোকেন ভেরিফিকেশন মিডলওয়্যার
// ----------------------------------------------
async function authenticateToken(req, res, next) {
  try {
    // হেডার থেকে টোকেন বের করুন
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    
    if (!token) {
      return errorResponse(res, 401, "Access token is required", {
        solution: "Add 'Authorization: Bearer <token>' header",
      });
    }
    
    // টোকেন ভেরিফাই করুন
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // ক্যাশে থেকে ইউজার চেক
      let user = await redisClient.getCachedUser(decoded.userId);
      
      if (!user) {
        // ডাটাবেস থেকে ইউজার ফেচ
        user = await database.getOne(`
          SELECT 
            id, uuid, email, name, avatar_url,
            language, country, is_active, is_verified
          FROM users 
          WHERE id = $1 AND is_active = true
        `, [decoded.userId]);
        
        if (!user) {
          return errorResponse(res, 401, "User not found or inactive");
        }
        
        // ক্যাশে সেভ
        await redisClient.cacheUser(user.id, user, 3600);
      }
      
      // সেশন চেক (অপশনাল)
      const sessionValid = await checkSession(decoded.userId, token);
      
      if (!sessionValid) {
        return errorResponse(res, 401, "Session expired or invalidated", {
          solution: "Please login again",
        });
      }
      
      // রিকোয়েস্টে ইউজার যোগ করুন
      req.user = user;
      req.token = token;
      req.userId = user.id;
      
      // অডিট লগ (অপশনাল)
      await logAuthActivity(user.id, "token_verified", req);
      
      next();
      
    } catch (jwtError) {
      // JWT এরর হ্যান্ডলিং
      if (jwtError.name === "TokenExpiredError") {
        return errorResponse(res, 401, "Token has expired", {
          solution: "Refresh your token or login again",
          expiredAt: jwtError.expiredAt,
        });
      }
      
      if (jwtError.name === "JsonWebTokenError") {
        return errorResponse(res, 401, "Invalid token", {
          solution: "Provide a valid JWT token",
        });
      }
      
      return errorResponse(res, 401, "Token verification failed", jwtError.message);
    }
    
  } catch (error) {
    console.error("Auth middleware error:", error);
    return errorResponse(res, 500, "Authentication failed", error.message);
  }
}

// ----------------------------------------------
// অপশনাল অথেনটিকেশন (ইউজার লগইন করলে ইউজার ডাটা)
// ----------------------------------------------
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await database.getOne(`
          SELECT id, uuid, email, name, is_active
          FROM users 
          WHERE id = $1 AND is_active = true
        `, [decoded.userId]);
        
        if (user) {
          req.user = user;
          req.userId = user.id;
        }
      } catch (error) {
        // টোকেন ইনভ্যালিড হলে চুপচাপ এগিয়ে যান
        console.log("Optional auth: Invalid token");
      }
    }
    
    next();
  } catch (error) {
    console.error("Optional auth error:", error);
    next();
  }
}

// ----------------------------------------------
// অ্যাডমিন অথরাইজেশন
// ----------------------------------------------
async function requireAdmin(req, res, next) {
  try {
    // আগে authenticateToken চেক হবে
    if (!req.user) {
      return errorResponse(res, 401, "Authentication required");
    }
    
    // অ্যাডমিন রোল চেক
    const userRole = await database.getOne(`
      SELECT role FROM users WHERE id = $1
    `, [req.user.id]);
    
    if (!userRole || userRole.role !== "admin") {
      return errorResponse(res, 403, "Admin access required", {
        solution: "This endpoint is restricted to administrators",
      });
    }
    
    req.isAdmin = true;
    next();
  } catch (error) {
    console.error("Admin auth error:", error);
    return errorResponse(res, 500, "Authorization failed", error.message);
  }
}

// ----------------------------------------------
// প্রিমিয়াম ইউজার অথরাইজেশন
// ----------------------------------------------
async function requirePremium(req, res, next) {
  try {
    if (!req.user) {
      return errorResponse(res, 401, "Authentication required");
    }
    
    // প্রিমিয়াম স্ট্যাটাস চেক
    const userPlan = await database.getOne(`
      SELECT plan FROM users WHERE id = $1
    `, [req.user.id]);
    
    if (!userPlan || !["premium", "enterprise"].includes(userPlan.plan)) {
      return errorResponse(res, 403, "Premium access required", {
        solution: "Upgrade to premium plan",
      });
    }
    
    req.isPremium = true;
    next();
  } catch (error) {
    console.error("Premium auth error:", error);
    return errorResponse(res, 500, "Authorization failed", error.message);
  }
}

// ----------------------------------------------
// সেশন চেক হেল্পার
// ----------------------------------------------
async function checkSession(userId, token) {
  try {
    // Redis থেকে সেশন চেক
    const cachedSession = await redisClient.getSession(userId);
    
    if (cachedSession && cachedSession.token === token) {
      return true;
    }
    
    // ডাটাবেস থেকে সেশন চেক
    const session = await database.getOne(`
      SELECT id FROM sessions 
      WHERE user_id = $1 AND token = $2 AND expires_at > CURRENT_TIMESTAMP
    `, [userId, token]);
    
    return !!session;
  } catch (error) {
    console.error("Session check error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// অডিট লগ হেল্পার
// ----------------------------------------------
async function logAuthActivity(userId, action, req) {
  try {
    const activity = {
      userId,
      action,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent") || "",
      path: req.originalUrl,
      method: req.method,
      timestamp: new Date().toISOString(),
    };
    
    // Redis লগ (টেম্পোরারি)
    const logKey = `auth:log:${userId}`;
    await redisClient.pushToList(logKey, activity);
    
    // লগ ১০০ এন্ট্রির বেশি হলে পুরনো ডিলিট
    const logLength = await redisClient.redisClient.lLen(logKey);
    if (logLength > 100) {
      await redisClient.redisClient.lTrim(logKey, 0, 99);
    }
    
  } catch (error) {
    console.error("Auth activity log error:", error.message);
  }
}

// ----------------------------------------------
// রেট লিমিট হেল্পার (স্পেসিফিক এন্ডপয়েন্টের জন্য)
// ----------------------------------------------
async function rateLimitByUser(req, res, next) {
  try {
    const userId = req.user ? req.user.id : req.ip;
    const key = `user:${userId}:${req.originalUrl}`;
    
    const result = await redisClient.rateLimit(key, 30, 60); // ৩০ রিকোয়েস্ট/মিনিট
    
    if (!result.allowed) {
      return errorResponse(res, 429, "Too many requests", {
        retryAfter: result.resetAt,
        limit: 30,
        window: "60 seconds",
      });
    }
    
    // রেট লিমিট হেডার
    res.setHeader("X-RateLimit-Limit", 30);
    res.setHeader("X-RateLimit-Remaining", result.remaining);
    res.setHeader("X-RateLimit-Reset", result.resetAt);
    
    next();
  } catch (error) {
    console.error("User rate limit error:", error);
    next();
  }
}

// ----------------------------------------------
// টোকেন ব্ল্যাকলিস্ট চেক
// ----------------------------------------------
async function checkTokenBlacklist(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (token) {
      const isBlacklisted = await redisClient.isInSet("blacklist:tokens", token);
      
      if (isBlacklisted) {
        return errorResponse(res, 401, "Token has been revoked", {
          solution: "Please login again",
        });
      }
    }
    
    next();
  } catch (error) {
    console.error("Token blacklist check error:", error);
    next();
  }
}

// ----------------------------------------------
// IP হোয়াইটলিস্ট (অপশনাল)
// ----------------------------------------------
async function ipWhitelist(allowedIPs) {
  return async (req, res, next) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress;
      
      if (!allowedIPs.includes(clientIP)) {
        return errorResponse(res, 403, "Access denied from this IP", {
          solution: "Contact administrator for access",
        });
      }
      
      next();
    } catch (error) {
      console.error("IP whitelist error:", error);
      next();
    }
  };
}

// ----------------------------------------------
// API কী ভেরিফিকেশন (সার্ভার-টু-সার্ভার)
// ----------------------------------------------
async function verifyAPIKey(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    
    if (!apiKey) {
      return errorResponse(res, 401, "API key is required", {
        solution: "Add 'X-API-Key: <your-api-key>' header",
      });
    }
    
    // API কী ভেরিফাই (এখানে সিম্পল চেক)
    const validKeys = process.env.API_KEYS ? process.env.API_KEYS.split(",") : [];
    
    if (!validKeys.includes(apiKey)) {
      return errorResponse(res, 403, "Invalid API key");
    }
    
    req.apiKey = apiKey;
    next();
  } catch (error) {
    console.error("API key verification error:", error);
    return errorResponse(res, 500, "API key verification failed", error.message);
  }
}

// ----------------------------------------------
// কম্বাইন্ড অথেনটিকেশন (JWT অথবা API কী)
// ----------------------------------------------
async function combinedAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const apiKey = req.headers["x-api-key"];
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      // JWT অথেনটিকেশন
      return authenticateToken(req, res, next);
    } else if (apiKey) {
      // API কী অথেনটিকেশন
      return verifyAPIKey(req, res, next);
    } else {
      return errorResponse(res, 401, "Authentication required", {
        solution: "Use either JWT token or API key",
      });
    }
  } catch (error) {
    console.error("Combined auth error:", error);
    return errorResponse(res, 500, "Authentication failed", error.message);
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = {
  authenticateToken,
  optionalAuth,
  requireAdmin,
  requirePremium,
  rateLimitByUser,
  checkTokenBlacklist,
  ipWhitelist,
  verifyAPIKey,
  combinedAuth,
};
