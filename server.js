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
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    credentials: true,
    maxAge: 86400,
  })
);

// Compression (Gzip)
app.use(compression());

// JSON Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging (Development only)
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

// 404 Handler
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
  
  // MongoDB/Mongoose এরর
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
    // ডাটাবেস কানেকশন
    console.log("Connecting to PostgreSQL...");
    await database.connect();
    console.log("✅ PostgreSQL connected successfully");
    
    // Redis কানেকশন
    console.log("Connecting to Redis...");
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
    
    // ডাটাবেস টেবিল তৈরি
    console.log("Setting up database tables...");
    await database.setupTables();
    console.log("✅ Database tables ready");
    
    // সার্ভার লিসেন
    app.listen(PORT, () => {
      console.log("=".repeat(50));
      console.log("🚀 Toolkit Pro Server Started");
      console.log("=".repeat(50));
      console.log(`📡 Environment: ${NODE_ENV}`);
      console.log(`🔗 URL: http://localhost:${PORT}`);
      console.log(`❤️ Health: http://localhost:${PORT}/health`);
      console.log(`📚 API: http://localhost:${PORT}/api/v1`);
      console.log(`📊 AdSense: ${process.env.ADSENSE_ENABLED === "true" ? "Enabled" : "Disabled"}`);
      console.log("=".repeat(50));
    });
    
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

// ----------------------------------------------
// গ্রেসফুল শাটডাউন
// ----------------------------------------------
process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing server gracefully...");
  
  try {
    await database.close();
    await redisClient.close();
    console.log("✅ Connections closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing server...");
  process.exit(0);
});

// Unhandled এরর
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// ----------------------------------------------
// সার্ভার শুরু করুন
// ----------------------------------------------
startServer();

// ----------------------------------------------
// এক্সপোর্ট (টেস্টিংয়ের জন্য)
// ----------------------------------------------
module.exports = app;
