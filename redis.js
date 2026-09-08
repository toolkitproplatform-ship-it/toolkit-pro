// ============================================
// Toolkit Pro - Redis Cache Connection
// ============================================
// Redis ক্যাশে ম্যানেজমেন্ট ও হেল্পার ফাংশন
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const { createClient } = require("redis");
const dotenv = require("dotenv");

// ----------------------------------------------
// এনভায়রনমেন্ট ভেরিয়েবল লোড
// ----------------------------------------------
dotenv.config();

// ----------------------------------------------
// Redis ক্লায়েন্ট তৈরি
// ----------------------------------------------
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    connectTimeout: 10000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("❌ Redis max retries reached");
        return new Error("Redis connection failed");
      }
      return Math.min(retries * 100, 3000);
    },
  },
});

// ----------------------------------------------
// Redis এরর হ্যান্ডলিং
// ----------------------------------------------
redisClient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log("📦 Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("✅ Redis is ready");
});

redisClient.on("reconnecting", () => {
  console.log("🔄 Redis reconnecting...");
});

redisClient.on("end", () => {
  console.log("📦 Redis connection ended");
});

// ----------------------------------------------
// Redis কানেকশন ফাংশন
// ----------------------------------------------
async function connect() {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
    console.log("✅ Redis connection successful");
    return true;
  } catch (error) {
    console.error("❌ Redis connection failed:", error.message);
    throw error;
  }
}

// ----------------------------------------------
// হেলথ চেক
// ----------------------------------------------
async function checkConnection() {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    const result = await redisClient.ping();
    return result === "PONG";
  } catch (error) {
    console.error("Redis health check failed:", error.message);
    return false;
  }
}

// ----------------------------------------------
// ক্যাশে সেট ফাংশন
// ----------------------------------------------
async function setCache(key, value, ttl = 300) {
  try {
    const stringValue = typeof value === "string" 
      ? value 
      : JSON.stringify(value);
    
    if (ttl > 0) {
      await redisClient.setEx(key, ttl, stringValue);
    } else {
      await redisClient.set(key, stringValue);
    }
    return true;
  } catch (error) {
    console.error("Redis set error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// ক্যাশে গেট ফাংশন
// ----------------------------------------------
async function getCache(key) {
  try {
    const value = await redisClient.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error("Redis get error:", error.message);
    return null;
  }
}

// ----------------------------------------------
// ক্যাশে ডিলিট ফাংশন
// ----------------------------------------------
async function deleteCache(key) {
  try {
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.error("Redis delete error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// ক্যাশে ক্লিয়ার ফাংশন (প্যাটার্ন অনুযায়ী)
// ----------------------------------------------
async function clearCacheByPattern(pattern) {
  try {
    const keys = await redisClient.keys(pattern);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`✅ Cleared ${keys.length} cache keys matching: ${pattern}`);
    }
    return true;
  } catch (error) {
    console.error("Redis clear pattern error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// ক্যাশে TTL চেক
// ----------------------------------------------
async function getTTL(key) {
  try {
    return await redisClient.ttl(key);
  } catch (error) {
    console.error("Redis TTL error:", error.message);
    return -2;
  }
}

// ----------------------------------------------
// ক্যাশে ইনক্রিমেন্ট
// ----------------------------------------------
async function increment(key, amount = 1) {
  try {
    if (amount === 1) {
      return await redisClient.incr(key);
    }
    return await redisClient.incrBy(key, amount);
  } catch (error) {
    console.error("Redis increment error:", error.message);
    return 0;
  }
}

// ----------------------------------------------
// ক্যাশে ডিক্রিমেন্ট
// ----------------------------------------------
async function decrement(key, amount = 1) {
  try {
    if (amount === 1) {
      return await redisClient.decr(key);
    }
    return await redisClient.decrBy(key, amount);
  } catch (error) {
    console.error("Redis decrement error:", error.message);
    return 0;
  }
}

// ----------------------------------------------
// হ্যাশ সেট
// ----------------------------------------------
async function setHash(key, field, value) {
  try {
    const stringValue = typeof value === "string" 
      ? value 
      : JSON.stringify(value);
    await redisClient.hSet(key, field, stringValue);
    return true;
  } catch (error) {
    console.error("Redis hash set error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// হ্যাশ গেট
// ----------------------------------------------
async function getHash(key, field) {
  try {
    const value = await redisClient.hGet(key, field);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error("Redis hash get error:", error.message);
    return null;
  }
}

// ----------------------------------------------
// হ্যাশ গেট অল
// ----------------------------------------------
async function getAllHash(key) {
  try {
    const result = await redisClient.hGetAll(key);
    if (!result) return {};
    
    // JSON প্যার্স করার চেষ্টা
    const parsed = {};
    for (const [field, value] of Object.entries(result)) {
      try {
        parsed[field] = JSON.parse(value);
      } catch {
        parsed[field] = value;
      }
    }
    return parsed;
  } catch (error) {
    console.error("Redis hash get all error:", error.message);
    return {};
  }
}

// ----------------------------------------------
// লিস্ট পুশ (কিউ)
// ----------------------------------------------
async function pushToList(key, value) {
  try {
    const stringValue = typeof value === "string" 
      ? value 
      : JSON.stringify(value);
    await redisClient.rPush(key, stringValue);
    return true;
  } catch (error) {
    console.error("Redis list push error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// লিস্ট পপ (কিউ)
// ----------------------------------------------
async function popFromList(key) {
  try {
    const value = await redisClient.lPop(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error("Redis list pop error:", error.message);
    return null;
  }
}

// ----------------------------------------------
// সেট মেম্বার
// ----------------------------------------------
async function addToSet(key, value) {
  try {
    await redisClient.sAdd(key, value);
    return true;
  } catch (error) {
    console.error("Redis set add error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// চেক সেট মেম্বার
// ----------------------------------------------
async function isInSet(key, value) {
  try {
    return await redisClient.sIsMember(key, value);
  } catch (error) {
    console.error("Redis set check error:", error.message);
    return false;
  }
}

// ----------------------------------------------
// রেট লিমিটিং হেল্পার
// ----------------------------------------------
async function rateLimit(key, limit, windowSeconds) {
  try {
    const current = await increment(key);
    
    if (current === 1) {
      // প্রথম রিকোয়েস্টে TTL সেট করুন
      await redisClient.expire(key, windowSeconds);
    }
    
    return {
      allowed: current <= limit,
      current,
      remaining: Math.max(0, limit - current),
      resetAt: await getTTL(key),
    };
  } catch (error) {
    console.error("Redis rate limit error:", error.message);
    return {
      allowed: true,
      current: 0,
      remaining: limit,
      resetAt: windowSeconds,
    };
  }
}

// ----------------------------------------------
// সেশন স্টোর
// ----------------------------------------------
async function setSession(sessionId, data, ttl = 86400) {
  const key = `session:${sessionId}`;
  return await setCache(key, data, ttl);
}

async function getSession(sessionId) {
  const key = `session:${sessionId}`;
  return await getCache(key);
}

async function deleteSession(sessionId) {
  const key = `session:${sessionId}`;
  return await deleteCache(key);
}

// ----------------------------------------------
// ইউজার ক্যাশে
// ----------------------------------------------
async function cacheUser(userId, userData, ttl = 3600) {
  const key = `user:${userId}`;
  return await setCache(key, userData, ttl);
}

async function getCachedUser(userId) {
  const key = `user:${userId}`;
  return await getCache(key);
}

async function deleteCachedUser(userId) {
  const key = `user:${userId}`;
  return await deleteCache(key);
}

// ----------------------------------------------
// টুল ক্যাশে
// ----------------------------------------------
async function cacheTool(toolSlug, toolData, ttl = 600) {
  const key = `tool:${toolSlug}`;
  return await setCache(key, toolData, ttl);
}

async function getCachedTool(toolSlug) {
  const key = `tool:${toolSlug}`;
  return await getCache(key);
}

async function deleteCachedTool(toolSlug) {
  const key = `tool:${toolSlug}`;
  return await deleteCache(key);
}

// ----------------------------------------------
// ক্যাশে স্ট্যাটস
// ----------------------------------------------
async function getCacheStats() {
  try {
    const info = await redisClient.info();
    const stats = {};
    
    // গুরুত্বপূর্ণ তথ্য পার্স করুন
    const lines = info.split("\r\n");
    for (const line of lines) {
      if (line.includes("used_memory_human")) {
        stats.memoryUsage = line.split(":")[1];
      }
      if (line.includes("connected_clients")) {
        stats.connectedClients = line.split(":")[1];
      }
      if (line.includes("total_connections_received")) {
        stats.totalConnections = line.split(":")[1];
      }
      if (line.includes("keyspace_hits")) {
        stats.cacheHits = line.split(":")[1];
      }
      if (line.includes("keyspace_misses")) {
        stats.cacheMisses = line.split(":")[1];
      }
      if (line.includes("uptime_in_seconds")) {
        stats.uptime = line.split(":")[1];
      }
    }
    
    // হিট রেট ক্যালকুলেশন
    const hits = parseInt(stats.cacheHits) || 0;
    const misses = parseInt(stats.cacheMisses) || 0;
    const total = hits + misses;
    stats.hitRate = total > 0 ? ((hits / total) * 100).toFixed(2) + "%" : "0%";
    
    return stats;
  } catch (error) {
    console.error("Redis stats error:", error.message);
    return {};
  }
}

// ----------------------------------------------
// কানেকশন ক্লোজ
// ----------------------------------------------
async function close() {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
    }
    console.log("✅ Redis connection closed");
    return true;
  } catch (error) {
    console.error("Error closing Redis:", error.message);
    return false;
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = {
  redisClient,
  connect,
  checkConnection,
  setCache,
  getCache,
  deleteCache,
  clearCacheByPattern,
  getTTL,
  increment,
  decrement,
  setHash,
  getHash,
  getAllHash,
  pushToList,
  popFromList,
  addToSet,
  isInSet,
  rateLimit,
  setSession,
  getSession,
  deleteSession,
  cacheUser,
  getCachedUser,
  deleteCachedUser,
  cacheTool,
  getCachedTool,
  deleteCachedTool,
  getCacheStats,
  close
};
