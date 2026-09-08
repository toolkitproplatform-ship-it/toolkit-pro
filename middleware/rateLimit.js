// ============================================
// Toolkit Pro - Rate Limiting Middleware
// ============================================
// API রেট লিমিটিং ও DDoS প্রোটেকশন
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const rateLimit = require("express-rate-limit");
const redisClient = require("../redis");
const { errorResponse } = require("../utils/response");

// ----------------------------------------------
// সাধারণ API রেট লিমিটার
// ----------------------------------------------
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // ১৫ মিনিট
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // সর্বোচ্চ ১০০ রিকোয়েস্ট
  message: {
    success: false,
    message: "Too many requests, please try again later",
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutes",
    },
  },
  standardHeaders: true, // RateLimit-* হেডার
  legacyHeaders: false, // X-RateLimit-* হেডার ডিসএবল
  handler: (req, res) => {
    return errorResponse(res, 429, "Too many requests", {
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      window: "15 minutes",
    });
  },
  keyGenerator: (req) => {
    // IP + User ID (যদি লগইন করা থাকে)
    const userId = req.user ? req.user.id : "anonymous";
    return `${req.ip}:${userId}`;
  },
  skip: (req) => {
    // হেলথ চেক স্কিপ
    return req.path === "/health" || req.path === "/api/v1/health";
  },
});

// ----------------------------------------------
// অথেনটিকেশন রেট লিমিটার (কঠোর)
// ----------------------------------------------
const authLimiter = rateLimit({
  windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // ১৫ মিনিট
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5, // সর্বোচ্চ ৫ রিকোয়েস্ট
  message: {
    success: false,
    message: "Too many authentication attempts, please try again later",
    error: {
      code: "AUTH_RATE_LIMIT_EXCEEDED",
      retryAfter: "15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, "Too many authentication attempts", {
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      window: "15 minutes",
    });
  },
  keyGenerator: (req) => {
    // IP + Email (যদি থাকে)
    const email = req.body?.email || "unknown";
    return `${req.ip}:${email}`;
  },
});

// ----------------------------------------------
// টুল এক্সিকিউশন রেট লিমিটার
// ----------------------------------------------
const toolExecutionLimiter = rateLimit({
  windowMs: 60 * 1000, // ১ মিনিট
  max: 30, // সর্বোচ্চ ৩০ এক্সিকিউশন
  message: {
    success: false,
    message: "Tool execution limit reached",
    error: {
      code: "TOOL_EXECUTION_LIMIT",
      retryAfter: "1 minute",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, "Tool execution limit reached", {
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      window: "1 minute",
    });
  },
  keyGenerator: (req) => {
    const toolSlug = req.params?.slug || "unknown";
    return `${req.ip}:${toolSlug}`;
  },
});

// ----------------------------------------------
// সার্চ রেট লিমিটার
// ----------------------------------------------
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // ১ মিনিট
  max: 20, // সর্বোচ্চ ২০ সার্চ
  message: {
    success: false,
    message: "Search limit reached",
    error: {
      code: "SEARCH_LIMIT_EXCEEDED",
      retryAfter: "1 minute",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 429, "Search limit reached", {
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      window: "1 minute",
    });
  },
});

// ----------------------------------------------
// কাস্টম Redis-বেসড রেট লিমিটার
// ----------------------------------------------
async function redisRateLimiter(req, res, next) {
  try {
    const key = `ratelimit:${req.ip}:${req.originalUrl}`;
    const limit = parseInt(process.env.API_RATE_LIMIT_MAX_REQUESTS) || 30;
    const windowSeconds = parseInt(process.env.API_RATE_LIMIT_WINDOW_MS) / 1000 || 60;
    
    const result = await redisClient.rateLimit(key, limit, windowSeconds);
    
    if (!result.allowed) {
      return errorResponse(res, 429, "Too many requests", {
        retryAfter: result.resetAt,
        limit,
        window: `${windowSeconds} seconds`,
        current: result.current,
      });
    }
    
    // রেট লিমিট হেডার
    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", result.remaining);
    res.setHeader("X-RateLimit-Reset", result.resetAt);
    
    next();
  } catch (error) {
    console.error("Redis rate limiter error:", error);
    next(); // এরর হলে এগিয়ে যান
  }
}

// ----------------------------------------------
// IP-ভিত্তিক ব্লকলিস্ট
// ----------------------------------------------
const blockedIPs = new Set();

async function blockIP(ip, duration = 3600) {
  try {
    blockedIPs.add(ip);
    await redisClient.setCache(`blocked:ip:${ip}`, true, duration);
    
    // অটো-আনব্লক
    setTimeout(() => {
      blockedIPs.delete(ip);
      redisClient.deleteCache(`blocked:ip:${ip}`);
    }, duration * 1000);
    
    return true;
  } catch (error) {
    console.error("Block IP error:", error);
    return false;
  }
}

async function checkBlockedIP(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    
    // লোকাল চেক
    if (blockedIPs.has(ip)) {
      return errorResponse(res, 403, "Your IP has been blocked", {
        solution: "Contact administrator if this is a mistake",
      });
    }
    
    // Redis চেক
    const isBlocked = await redisClient.getCache(`blocked:ip:${ip}`);
    if (isBlocked) {
      return errorResponse(res, 403, "Your IP has been blocked", {
        solution: "Contact administrator if this is a mistake",
      });
    }
    
    next();
  } catch (error) {
    console.error("Check blocked IP error:", error);
    next();
  }
}

// ----------------------------------------------
// DDoS প্রোটেকশন
// ----------------------------------------------
const ddosProtection = rateLimit({
  windowMs: 10 * 1000, // ১০ সেকেন্ড
  max: 50, // সর্বোচ্চ ৫০ রিকোয়েস্ট
  message: {
    success: false,
    message: "Too many requests detected",
    error: {
      code: "DDOS_PROTECTION",
      retryAfter: "10 seconds",
    },
  },
  handler: async (req, res) => {
    // অটো-ব্লক
    const ip = req.ip || req.connection.remoteAddress;
    await blockIP(ip, 3600); // ১ ঘন্টার জন্য ব্লক
    
    return errorResponse(res, 429, "Too many requests detected", {
      blocked: true,
      duration: "1 hour",
      solution: "Your IP has been temporarily blocked",
    });
  },
});

// ----------------------------------------------
// স্লোডাউন প্রোটেকশন
// ----------------------------------------------
const slowDownLimiter = rateLimit({
  windowMs: 60 * 1000, // ১ মিনিট
  max: 60, // সর্বোচ্চ ৬০ রিকোয়েস্ট
  delayAfter: 30, // ৩০ রিকোয়েস্টের পর ডিলে
  delayMs: 500, // ৫০০ms ডিলে
  message: {
    success: false,
    message: "Request rate is too high",
    error: {
      code: "SLOW_DOWN",
    },
  },
});

// ----------------------------------------------
// ইউজার-ভিত্তিক রেট লিমিটার
// ----------------------------------------------
async function userRateLimiter(req, res, next) {
  try {
    const userId = req.user ? req.user.id : req.ip;
    const endpoint = req.originalUrl.split("?")[0];
    const key = `user:${userId}:${endpoint}`;
    
    const limit = 50;
    const windowSeconds = 60;
    
    const result = await redisClient.rateLimit(key, limit, windowSeconds);
    
    if (!result.allowed) {
      return errorResponse(res, 429, "User rate limit exceeded", {
        retryAfter: result.resetAt,
        limit,
        window: `${windowSeconds} seconds`,
      });
    }
    
    res.setHeader("X-User-RateLimit-Limit", limit);
    res.setHeader("X-User-RateLimit-Remaining", result.remaining);
    
    next();
  } catch (error) {
    console.error("User rate limiter error:", error);
    next();
  }
}

// ----------------------------------------------
// ব্যয়বহুল অপারেশন লিমিটার
// ----------------------------------------------
const expensiveOperationLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // ৫ মিনিট
  max: 10, // সর্বোচ্চ ১০ অপারেশন
  message: {
    success: false,
    message: "Operation limit reached",
    error: {
      code: "OPERATION_LIMIT",
      retryAfter: "5 minutes",
    },
  },
  handler: (req, res) => {
    return errorResponse(res, 429, "Operation limit reached", {
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
      limit: req.rateLimit.limit,
      window: "5 minutes",
    });
  },
});

// ----------------------------------------------
// রেট লিমিট স্ট্যাটস
// ----------------------------------------------
async function getRateLimitStats(req, res, next) {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const stats = await redisClient.getCacheStats();
    
    req.rateLimitStats = {
      ip,
      cacheStats: stats,
    };
    
    next();
  } catch (error) {
    console.error("Rate limit stats error:", error);
    next();
  }
}

// ----------------------------------------------
// ক্লিনআপ ফাংশন
// ----------------------------------------------
async function cleanupRateLimitKeys() {
  try {
    const pattern = "ratelimit:*";
    await redisClient.clearCacheByPattern(pattern);
    console.log("✅ Rate limit keys cleaned");
    return true;
  } catch (error) {
    console.error("Rate limit cleanup error:", error);
    return false;
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = {
  apiLimiter,
  authLimiter,
  toolExecutionLimiter,
  searchLimiter,
  redisRateLimiter,
  blockIP,
  checkBlockedIP,
  ddosProtection,
  slowDownLimiter,
  userRateLimiter,
  expensiveOperationLimiter,
  getRateLimitStats,
  cleanupRateLimitKeys,
};
