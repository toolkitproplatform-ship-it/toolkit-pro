// ============================================
// Toolkit Pro - Main Server File (Redis Optional)
// ============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const dotenv = require("dotenv");
const database = require("./database");
const { standardResponse, errorResponse } = require("./utils/response");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || "production";

// Security
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Compression
app.use(compression());

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ----------------------------------------------
// হেলথ চেক
// ----------------------------------------------
app.get("/health", async (req, res) => {
  try {
    const dbStatus = await database.checkConnection();
    
    return standardResponse(res, 200, true, "Server is healthy", {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      database: dbStatus ? "connected" : "disconnected",
      environment: NODE_ENV,
    });
  } catch (error) {
    return errorResponse(res, 500, "Health check failed", error.message);
  }
});

// ----------------------------------------------
// Root Route
// ----------------------------------------------
app.get("/", (req, res) => {
  return standardResponse(res, 200, true, "Toolkit Pro API Server", {
    name: "Toolkit Pro",
    version: "1.0.0",
    status: "running",
    health: "/health",
  });
});

// ----------------------------------------------
// API রাউটস
// ----------------------------------------------
app.use("/api/v1/tools", require("./routes/tools"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1", require("./routes/api"));

// ----------------------------------------------
// 404 Handler
// ----------------------------------------------
app.use((req, res) => {
  return errorResponse(res, 404, "Route not found");
});

// ----------------------------------------------
// এরর হ্যান্ডলার
// ----------------------------------------------
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  return errorResponse(res, 500, err.message || "Internal server error");
});

// ----------------------------------------------
// সার্ভার স্টার্টআপ
// ----------------------------------------------
async function startServer() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 Toolkit Pro Server Starting...");
    console.log("=".repeat(60));
    
    // ডাটাবেস কানেকশন
    console.log("📦 Connecting to PostgreSQL...");
    await database.connect(3);
    console.log("✅ PostgreSQL connected successfully");
    
    // টেবিল তৈরি
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
      console.log("=".repeat(60));
    });
    
  } catch (error) {
    console.error("❌ Server startup failed:", error.message);
    process.exit(1);
  }
}

// Start
startServer();

module.exports = app;
