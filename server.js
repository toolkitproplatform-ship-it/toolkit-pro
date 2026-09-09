// ============================================
// Toolkit Pro - Main Server File
// ============================================

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const database = require("./database");
const { standardResponse, errorResponse } = require("./utils/response");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 10000;
const NODE_ENV = process.env.NODE_ENV || "production";

// ============================================
// Security (সরলীকৃত)
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
// স্ট্যাটিক ফাইল সার্ভিং (গুরুত্বপূর্ণ)
// ============================================
const publicPath = path.join(__dirname, "public");

// চেক করুন public ফোল্ডার আছে কিনা
if (!fs.existsSync(publicPath)) {
  console.warn("⚠️ public folder not found, creating...");
  fs.mkdirSync(publicPath, { recursive: true });
}

// স্ট্যাটিক ফাইল সার্ভ করুন
app.use(express.static(publicPath, {
  maxAge: "1d",
  etag: true,
  lastModified: true,
  index: "index.html",
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Content-Type", "text/html; charset=UTF-8");
    } else if (filePath.endsWith(".css")) {
      res.setHeader("Content-Type", "text/css; charset=UTF-8");
    } else if (filePath.endsWith(".js")) {
      res.setHeader("Content-Type", "application/javascript; charset=UTF-8");
    } else if (filePath.endsWith(".svg")) {
      res.setHeader("Content-Type", "image/svg+xml");
    } else if (filePath.endsWith(".png")) {
      res.setHeader("Content-Type", "image/png");
    } else if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) {
      res.setHeader("Content-Type", "image/jpeg");
    }
  },
}));

// ============================================
// API রাউটস (আগে রাখুন)
// ============================================

// হেলথ চেক
app.get("/health", async (req, res) => {
  try {
    const dbStatus = await database.checkConnection();
    
    return res.json({
      success: true,
      message: "Server is healthy",
      data: {
        status: "healthy",
        uptime: process.uptime(),
        database: dbStatus ? "connected" : "disconnected",
        environment: NODE_ENV,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Health check failed",
      error: error.message,
    });
  }
});

// API রাউটস
app.use("/api/v1/tools", require("./routes/tools"));
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1", require("./routes/api"));

// ============================================
// HTML পেজ রাউটস (API-র পরে)
// ============================================

// হোমপেজ - সবচেয়ে গুরুত্বপূর্ণ
app.get("/", (req, res) => {
  const indexPath = path.join(publicPath, "index.html");
  
  // ফাইল আছে কিনা চেক
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // ফাইল না থাকলে সাধারণ HTML দেখান
  return res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Toolkit Pro - Free Online Tools</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
        h1 { color: #2563eb; font-size: 3rem; }
        p { font-size: 1.2rem; color: #4b5563; }
        a { color: #2563eb; }
      </style>
    </head>
    <body>
      <h1>🛠️ Toolkit Pro</h1>
      <p>500+ Free Online Tools Platform</p>
      <p>Server is running!</p>
      <p><a href="/api/v1">API Documentation</a> | <a href="/health">Health Check</a></p>
    </body>
    </html>
  `);
});

// অন্যান্য পেজ (ফাইল থাকলে দেখাবে)
app.get("/tools.html", (req, res) => {
  const filePath = path.join(publicPath, "tools.html");
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.redirect("/");
});

app.get("/tool.html", (req, res) => {
  const filePath = path.join(publicPath, "tool.html");
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.redirect("/");
});

app.get("/categories.html", (req, res) => {
  const filePath = path.join(publicPath, "categories.html");
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  return res.redirect("/");
});

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  const notFoundPath = path.join(publicPath, "404.html");
  if (fs.existsSync(notFoundPath)) {
    return res.status(404).sendFile(notFoundPath);
  }
  
  return res.status(404).send(`
    <!DOCTYPE html>
    <html>
    <head><title>404 - Not Found</title></head>
    <body style="text-align:center;padding:50px;font-family:Arial;">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <a href="/">Go to Homepage</a>
    </body>
    </html>
  `);
});

// ============================================
// সার্ভার স্টার্টআপ
// ============================================
async function startServer() {
  try {
    console.log("=".repeat(60));
    console.log("🚀 Toolkit Pro Server Starting...");
    console.log("=".repeat(60));
    
    // চেক করুন public ফোল্ডারে কি কি আছে
    console.log("📁 Checking public folder...");
    if (fs.existsSync(publicPath)) {
      const files = fs.readdirSync(publicPath);
      console.log(`📁 Public folder contains: ${files.join(", ")}`);
      
      // সাবফোল্ডার চেক
      const cssPath = path.join(publicPath, "css");
      const jsPath = path.join(publicPath, "js");
      
      if (fs.existsSync(cssPath)) {
        console.log(`📁 CSS folder: ${fs.readdirSync(cssPath).join(", ")}`);
      }
      if (fs.existsSync(jsPath)) {
        console.log(`📁 JS folder: ${fs.readdirSync(jsPath).join(", ")}`);
      }
    } else {
      console.warn("⚠️ public folder does not exist");
    }
    
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
      console.log(`🌐 Website: http://0.0.0.0:${PORT}`);
      console.log(`❤️ Health: http://0.0.0.0:${PORT}/health`);
      console.log(`📚 API: http://0.0.0.0:${PORT}/api/v1`);
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
