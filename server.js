// ============================================
// Toolkit Pro - Main Server File
// Complete Updated Version
// ============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const database = require("./database");

dotenv.config();

const app = express();

// ⚠️ Render.com-এর জন্য গুরুত্বপূর্ণ
const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

// ============================================
// Security Middleware
// ============================================
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Compression
app.use(compression());

// Body Parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ============================================
// স্ট্যাটিক ফাইল সার্ভিং
// ============================================
const publicPath = path.join(__dirname, "public");

if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
  console.log("📁 public folder created");
}

app.use(express.static(publicPath, {
  maxAge: "1d",
  etag: true,
  lastModified: true,
  index: "index.html",
}));

// ============================================
// API রাউটস
// ============================================

// হেলথ চেক (Render.com-এর জন্য গুরুত্বপূর্ণ)
app.get("/health", async (req, res) => {
  try {
    let dbStatus = false;
    try {
      dbStatus = await database.checkConnection();
    } catch (dbError) {
      dbStatus = false;
    }
    
    res.status(200).json({
      success: true,
      message: "Server is healthy",
      data: {
        status: "healthy",
        uptime: process.uptime(),
        database: dbStatus ? "connected" : "disconnected",
        environment: process.env.NODE_ENV || "production",
        port: PORT,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

// Root Route
app.get("/", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  res.json({
    success: true,
    message: "Toolkit Pro API Server",
    data: {
      name: "Toolkit Pro",
      version: "1.0.0",
      status: "running",
      health: "/health",
    },
  });
});

// API রাউটস
try {
  app.use("/api/v1/tools", require("./routes/tools"));
  app.use("/api/v1/auth", require("./routes/auth"));
  app.use("/api/v1", require("./routes/api"));
  console.log("✅ API routes loaded");
} catch (error) {
  console.warn("⚠️ API routes loading failed:", error.message);
}

// ============================================
// HTML পেজ রাউটস
// ============================================
const htmlPages = [
  { route: "/tools", file: "tools.html" },
  { route: "/tool", file: "tool.html" },
  { route: "/categories", file: "categories.html" },
  { route: "/about", file: "about.html" },
  { route: "/contact", file: "contact.html" },
  { route: "/privacy", file: "privacy.html" },
  { route: "/terms", file: "terms.html" },
];

htmlPages.forEach(page => {
  app.get(page.route, (req, res) => {
    const filePath = path.join(publicPath, page.file);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    res.redirect("/");
  });
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  const notFoundPath = path.join(publicPath, "404.html");
  
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// ============================================
// Error Handler
// ============================================
app.use((err, req, res, next) => {
  console.error("Global Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// ============================================
// সার্ভার স্টার্টআপ
// ============================================
async function startServer() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 Toolkit Pro Server Starting...");
    console.log("=".repeat(60));
    console.log(`📡 Environment: ${process.env.NODE_ENV || "production"}`);
    console.log(`🔧 PORT from env: ${process.env.PORT || "not set"}`);
    console.log(`🔧 Using PORT: ${PORT}`);
    console.log(`🔧 Host: ${HOST}`);
    console.log(`📁 Public folder: ${fs.existsSync(publicPath) ? "exists" : "missing"}`);
    console.log("=".repeat(60));
    
    // ডাটাবেস কানেকশন (অপারেশনাল - এরর হলে চালিয়ে যান)
    try {
      console.log("📦 Connecting to PostgreSQL...");
      await database.connect(3);
      console.log("✅ PostgreSQL connected");
      
      // টেবিল তৈরি
      console.log("📦 Setting up tables...");
      await database.setupTables();
      console.log("✅ Tables ready");
      
      // ডিফল্ট ডাটা
      console.log("📦 Seeding data...");
      await database.seedDefaultTools();
      console.log("✅ Data seeded");
      
    } catch (dbError) {
      console.warn("⚠️ Database setup failed (continuing without DB):", dbError.message);
    }
    
    // সার্ভার লিসেন - Render.com-এর জন্য গুরুত্বপূর্ণ
    app.listen(PORT, HOST, () => {
      console.log("=".repeat(60));
      console.log("🎉 Toolkit Pro Server Started Successfully!");
      console.log("=".repeat(60));
      console.log(`🌐 Website URL: http://${HOST}:${PORT}`);
      console.log(`❤️ Health Check: http://${HOST}:${PORT}/health`);
      console.log(`📚 API Base: http://${HOST}:${PORT}/api/v1`);
      console.log("=".repeat(60));
      console.log("✅ Server is ready to receive traffic!");
      console.log("=".repeat(60));
    });
    
  } catch (error) {
    console.error("=".repeat(60));
    console.error("❌ Server startup failed!");
    console.error("=".repeat(60));
    console.error(`Error: ${error.message}`);
    console.error(`Stack: ${error.stack}`);
    console.error("=".repeat(60));
    process.exit(1);
  }
}

// ============================================
// Graceful Shutdown
// ============================================
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Closing server...");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Closing server...");
  process.exit(0);
});

// ============================================
// Start Server
// ============================================
startServer();

module.exports = app;
