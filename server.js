// ============================================
// Toolkit Pro - Main Server File
// ============================================
// All-in-One Online Tools Platform
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

// কাস্টম মডিউল
const database = require("./database");
const redisClient = require("./redis");
const { apiLimiter, authLimiter } = require("./middleware/rateLimit");
const { standardResponse, errorResponse } = require("./utils/response");

// ----------------------------------------------
// এনভায়রনমেন্ট ভেরিয়েবল লোড
// ----------------------------------------------
dotenv.config();

// ----------------------------------------------
// Express অ্যাপ তৈরি
// ----------------------------------------------
const app = express();
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || "development";

// ----------------------------------------------
// বেসিক মিডলওয়্যার
// ----------------------------------------------

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://pagead2.googlesyndication.com",
          "https://www.googletagmanager.com",
          "https://www.google-analytics.com",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          "data:",
          "https:",
          "https://pagead2.googlesyndication.com",
        ],
        connectSrc: [
          "'self'",
          "https://pagead2.googlesyndication.com",
          "https://www.google-analytics.com",
        ],
        frameSrc: ["'self'", "https://googleads.g.doubleclick.net"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "X-API-Key"],
    credentials: true,
    maxAge: 86400,
  })
);

// Compression (Gzip)
app.use(compression());

// JSON Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ----------------------------------------------
// স্ট্যাটিক ফাইল সার্ভিং
// ----------------------------------------------
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "1d",
  etag: true,
  lastModified: true,
}));

// ----------------------------------------------
// রাউট মাউন্টিং
// ----------------------------------------------

// হেলথ চেক (সবার জন্য উন্মুক্ত)
app.get("/health", async (req, res) => {
  try {
    const dbStatus = await database.checkConnection();
    const redisStatus = await redisClient.checkConnection();
    
    return standardResponse(res, 200, true, "Server is healthy", {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus ? "connected" : "disconnected",
      redis: redisStatus ? "connected" : "disconnected",
      memory: process.memoryUsage(),
      environment: NODE_ENV,
    });
  } catch (error) {
    return errorResponse(res, 500, "Health check failed", error.message);
  }
});

// Root Route
app.get("/", (req, res) => {
  return standardResponse(res, 200, true, "Toolkit Pro API Server", {
    name: "Toolkit Pro",
    version: "1.0.0",
    description: "All-in-One Online Tools Platform",
    documentation: "https://toolkit-pro.onrender.com/api/v1",
    health: "/health",
    status: "running",
  });
});

// API রাউটস
app.use("/api/v1", require("./routes/api"));
app.use("/api/v1/tools", require("./routes/tools"));
app.use("/api/v1/auth", authLimiter, require("./routes/auth"));

// ----------------------------------------------
// 404 Handler
// ----------------------------------------------
app.use((req, res, next) => {
  return errorResponse(res, 404, "Route not found", {
    path: req.originalUrl,
    method: req.method,
    suggestion: "Check API documentation at /api/v1",
  });
});

// ----------------------------------------------
// গ্লোবাল এরর হ্যান্ডলার
// ----------------------------------------------
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  
  // Validation এরর
  if (err.name === "ValidationError") {
    return errorResponse(res, 422, "Validation error", err.message);
  }
  
  // JWT এরর
  if (err.name === "JsonWebTokenError") {
    return errorResponse(res, 401, "Invalid token", err.message);
  }
  
  if (err.name === "TokenExpiredError") {
    return errorResponse(res, 401, "Token expired", err.message);
  }
  
  // Rate limit এরর
  if (err.name === "RateLimitError") {
    return errorResponse(res, 429, "Too many requests", err.message);
  }
  
  // Database এরর
  if (err.code === "23505") {
    return errorResponse(res, 409, "Duplicate entry", err.detail);
  }
  
  if (err.code === "23503") {
    return errorResponse(res, 409, "Foreign key violation", err.detail);
  }
  
  // Default এরর
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  
  return errorResponse(res, statusCode, message, {
    stack: NODE_ENV === "development" ? err.stack : undefined,
  });
});

// ----------------------------------------------
// সার্ভার স্টার্টআপ
// ----------------------------------------------
async function startServer() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 Toolkit Pro Server Starting...");
    console.log("=".repeat(60));
    console.log(`📡 Environment: ${NODE_ENV}`);
    console.log(`🔧 Port: ${PORT}`);
    console.log(`🗄️ Database URL: ${maskURL(process.env.DATABASE_URL)}`);
    console.log(`💾 Redis URL: ${maskURL(process.env.REDIS_URL)}`);
    console.log("=".repeat(60));
    
    // ডাটাবেস কানেকশন (৫ বার রিট্রাই সহ)
    console.log("📦 Connecting to PostgreSQL...");
    await database.connect(5);
    console.log("✅ PostgreSQL connected successfully");
    
    // Redis কানেকশন (অপশনাল)
    try {
      console.log("📦 Connecting to Redis...");
      await redisClient.connect();
      console.log("✅ Redis connected successfully");
    } catch (redisError) {
      console.warn("⚠️ Redis connection failed (continuing without cache):", redisError.message);
      console.warn("ℹ️ Cache features will be disabled");
    }
    
    // ডাটাবেস টেবিল তৈরি
    console.log("📦 Setting up database tables...");
    await database.setupTables();
    console.log("✅ Database tables ready");
    
    // ডিফল্ট ডাটা সিড
    console.log("📦 Seeding default data...");
    await database.seedDefaultTools();
    console.log("✅ Default data seeded");
    
    // সার্ভার লিসেন
    app.listen(PORT, "0.0.0.0", () => {
      console.log("=".repeat(60));
      console.log("🎉 Toolkit Pro Server Started Successfully!");
      console.log("=".repeat(60));
      console.log(`🔗 Server URL: http://0.0.0.0:${PORT}`);
      console.log(`❤️ Health Check: http://0.0.0.0:${PORT}/health`);
      console.log(`📚 API Base: http://0.0.0.0:${PORT}/api/v1`);
      console.log(`📊 AdSense: ${process.env.ADSENSE_ENABLED === "true" ? "✅ Enabled" : "❌ Disabled"}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? "✅ Configured" : "❌ Not set"}`);
      console.log("=".repeat(60));
      console.log("🌟 Toolkit Pro is ready to serve!");
      console.log("=".repeat(60));
    });
    
  } catch (error) {
    console.error("=".repeat(60));
    console.error("❌ Server startup failed!");
    console.error("=".repeat(60));
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error("=".repeat(60));
    console.error("Troubleshooting tips:");
    console.error("1. Check if DATABASE_URL is set correctly");
    console.error("2. Ensure PostgreSQL service is running");
    console.error("3. Check Render.com environment variables");
    console.error("4. Visit https://render.com/docs/troubleshooting-deploys");
    console.error("=".repeat(60));
    process.exit(1);
  }
}

// ----------------------------------------------
// URL মাস্ক হেল্পার (সিকিউরিটির জন্য)
// ----------------------------------------------
function maskURL(url) {
  if (!url) return "Not set";
  
  try {
    const parsed = new URL(url);
    const username = parsed.username ? `${parsed.username}:****@` : "";
    return `${parsed.protocol}//${username}${parsed.hostname}:${parsed.port || "default"}${parsed.pathname}`;
  } catch {
    return "Invalid URL";
  }
}

// ----------------------------------------------
// গ্রেসফুল শাটডাউন
// ----------------------------------------------
async function gracefulShutdown(signal) {
  console.log(`\n${signal} received. Closing server gracefully...`);
  
  try {
    // সার্ভার বন্ধ করুন
    if (server) {
      server.close(() => {
        console.log("✅ HTTP server closed");
      });
    }
    
    // ডাটাবেস কানেকশন বন্ধ
    await database.close();
    console.log("✅ Database connection closed");
    
    // Redis কানেকশন বন্ধ
    await redisClient.close();
    console.log("✅ Redis connection closed");
    
    console.log("👋 Server shutdown complete");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
}

// সিগন্যাল হ্যান্ডলার
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// ----------------------------------------------
// আনহ্যান্ডলড এরর হ্যান্ডলার
// ----------------------------------------------
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise);
  console.error("Reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  console.error("Stack:", error.stack);
});

// ----------------------------------------------
// সার্ভার ভেরিয়েবল (শাটডাউনের জন্য)
// ----------------------------------------------
let server;

// ----------------------------------------------
// সার্ভার শুরু করুন
// ----------------------------------------------
startServer();

// ----------------------------------------------
// এক্সপোর্ট (টেস্টিংয়ের জন্য)
// ----------------------------------------------
module.exports = app;
