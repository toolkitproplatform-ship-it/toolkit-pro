// ============================================
// Toolkit Pro - Database Connection
// ============================================
// PostgreSQL কানেকশন ও টেবিল ম্যানেজমেন্ট
// ============================================

// ----------------------------------------------
// ডিপেন্ডেন্সি ইমপোর্ট
// ----------------------------------------------
const { Pool } = require("pg");
const dotenv = require("dotenv");

// ----------------------------------------------
// এনভায়রনমেন্ট ভেরিয়েবল লোড
// ----------------------------------------------
dotenv.config();

// ----------------------------------------------
// PostgreSQL কানেকশন পুল
// ----------------------------------------------
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.DATABASE_URL_INTERNAL,
  max: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT) || 30000,
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 10000,
  ssl: process.env.NODE_ENV === "production" ? {
    rejectUnauthorized: false
  } : false
});

// ----------------------------------------------
// এরর হ্যান্ডলিং
// ----------------------------------------------
pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
});

pool.on("connect", () => {
  console.log("📦 New database connection established");
});

// ----------------------------------------------
// ডাটাবেস কানেকশন ফাংশন (রিট্রাই সহ)
// ----------------------------------------------
async function connect(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ PostgreSQL connection successful");
      console.log(`📊 Database URL: ${maskConnectionString(process.env.DATABASE_URL)}`);
      client.release();
      return true;
    } catch (error) {
      console.error(`❌ PostgreSQL connection attempt ${i + 1}/${retries} failed:`, error.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 5 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        throw error;
      }
    }
  }
}

// ----------------------------------------------
// কানেকশন স্ট্রিং মাস্ক হেল্পার
// ----------------------------------------------
function maskConnectionString(connectionString) {
  if (!connectionString) return "Not set";
  
  try {
    const url = new URL(connectionString);
    return `${url.protocol}//${url.username}:****@${url.hostname}:${url.port}${url.pathname}`;
  } catch {
    return "Invalid URL format";
  }
}

// ----------------------------------------------
// হেলথ চেক
// ----------------------------------------------
async function checkConnection() {
  try {
    const result = await pool.query("SELECT NOW() as now");
    return result.rows[0].now;
  } catch (error) {
    console.error("Database health check failed:", error.message);
    return false;
  }
}

// ----------------------------------------------
// টেবিল সেটআপ (এরর হ্যান্ডলিং সহ)
// ----------------------------------------------
async function setupTables() {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // Users টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE,
        password_hash VARCHAR(255),
        name VARCHAR(100),
        avatar_url TEXT,
        language VARCHAR(10) DEFAULT 'en',
        country VARCHAR(50),
        timezone VARCHAR(50) DEFAULT 'UTC',
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Users table ready");
    
    // Tools টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS tools (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(200) UNIQUE NOT NULL,
        name VARCHAR(200) NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(50) DEFAULT '🔧',
        url VARCHAR(500),
        api_endpoint VARCHAR(500),
        is_free BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_popular BOOLEAN DEFAULT FALSE,
        is_new BOOLEAN DEFAULT FALSE,
        usage_count INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
        tags TEXT[],
        keywords TEXT[],
        seo_title VARCHAR(300),
        seo_description TEXT,
        seo_keywords TEXT[],
        ads_enabled BOOLEAN DEFAULT TRUE,
        ads_slots JSONB,
        config JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tools table ready");
    
    // Tool Categories টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS tool_categories (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        icon VARCHAR(50) DEFAULT '📁',
        tool_count INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tool categories table ready");
    
    // Tool Views টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS tool_views (
        id SERIAL PRIMARY KEY,
        tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        referrer TEXT,
        country VARCHAR(50),
        language VARCHAR(10),
        device_type VARCHAR(20),
        view_date DATE DEFAULT CURRENT_DATE,
        view_count INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tool_id, view_date, ip_address)
      )
    `);
    console.log("✅ Tool views table ready");
    
    // Ad Placements টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS ad_placements (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        location VARCHAR(50) NOT NULL,
        size VARCHAR(50),
        format VARCHAR(20) DEFAULT 'auto',
        is_active BOOLEAN DEFAULT TRUE,
        adsense_slot_id VARCHAR(50),
        custom_code TEXT,
        display_rules JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Ad placements table ready");
    
    // Ad Impressions টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS ad_impressions (
        id SERIAL PRIMARY KEY,
        placement_id INTEGER REFERENCES ad_placements(id) ON DELETE CASCADE,
        tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
        page_url TEXT,
        impression_count INTEGER DEFAULT 1,
        click_count INTEGER DEFAULT 0,
        revenue DECIMAL(10,4) DEFAULT 0,
        impression_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(placement_id, tool_id, impression_date)
      )
    `);
    console.log("✅ Ad impressions table ready");
    
    // User Favorites টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, tool_id)
      )
    `);
    console.log("✅ User favorites table ready");
    
    // Tool Reviews টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS tool_reviews (
        id SERIAL PRIMARY KEY,
        tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT,
        is_approved BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(tool_id, user_id)
      )
    `);
    console.log("✅ Tool reviews table ready");
    
    // Sessions টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(500) UNIQUE NOT NULL,
        ip_address VARCHAR(45),
        user_agent TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Sessions table ready");
    
    await client.query("COMMIT");
    console.log("✅ All database tables created successfully");
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error setting up tables:", error);
    throw error;
  } finally {
    client.release();
  }
}

// ----------------------------------------------
// সিড ডাটা (প্রাথমিক টুলস)
// ----------------------------------------------
async function seedDefaultTools() {
  const defaultCategories = [
    { slug: "text-tools", name: "Text Tools", icon: "📝", sort_order: 1 },
    { slug: "image-tools", name: "Image Tools", icon: "🖼️", sort_order: 2 },
    { slug: "developer-tools", name: "Developer Tools", icon: "💻", sort_order: 3 },
    { slug: "data-tools", name: "Data Tools", icon: "📊", sort_order: 4 },
    { slug: "security-tools", name: "Security Tools", icon: "🔐", sort_order: 5 },
    { slug: "multimedia-tools", name: "Multimedia Tools", icon: "🎥", sort_order: 6 },
    { slug: "seo-tools", name: "SEO Tools", icon: "🌐", sort_order: 7 },
    { slug: "converter-tools", name: "Converter Tools", icon: "📱", sort_order: 8 },
    { slug: "calculator-tools", name: "Calculator Tools", icon: "🧮", sort_order: 9 },
    { slug: "utility-tools", name: "Utility Tools", icon: "⚡", sort_order: 10 }
  ];
  
  const defaultTools = [
    {
      slug: "word-counter",
      name: "Word Counter",
      category: "text-tools",
      icon: "📝",
      description: "Count words, characters, sentences and paragraphs",
      is_featured: true,
      is_popular: true,
      is_new: true
    },
    {
      slug: "password-generator",
      name: "Password Generator",
      category: "security-tools",
      icon: "🔐",
      description: "Generate strong and secure passwords",
      is_featured: true,
      is_popular: true
    },
    {
      slug: "json-formatter",
      name: "JSON Formatter",
      category: "developer-tools",
      icon: "💻",
      description: "Format, validate and beautify JSON data",
      is_featured: true,
      is_popular: true
    },
    {
      slug: "image-compressor",
      name: "Image Compressor",
      category: "image-tools",
      icon: "🖼️",
      description: "Compress images without losing quality",
      is_featured: true
    },
    {
      slug: "qr-code-generator",
      name: "QR Code Generator",
      category: "converter-tools",
      icon: "📱",
      description: "Create QR codes for URLs, text and more",
      is_popular: true
    }
  ];
  
  try {
    for (const category of defaultCategories) {
      await query(`
        INSERT INTO tool_categories (slug, name, icon, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO NOTHING
      `, [category.slug, category.name, category.icon, category.sort_order]);
    }
    console.log("✅ Default categories seeded");
    
    for (const tool of defaultTools) {
      await query(`
        INSERT INTO tools (slug, name, category, icon, description, is_featured, is_popular, is_new)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO NOTHING
      `, [
        tool.slug, tool.name, tool.category, tool.icon, 
        tool.description, tool.is_featured, tool.is_popular, tool.is_new
      ]);
    }
    console.log("✅ Default tools seeded");
    
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

// ----------------------------------------------
// কোয়েরি হেল্পার ফাংশন
// ----------------------------------------------
async function query(text, params) {
  const start = Date.now();
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log(`📊 Query executed in ${duration}ms`);
    return result;
  } catch (error) {
    console.error("❌ Query error:", error.message);
    throw error;
  }
}

async function getOne(text, params) {
  const result = await query(text, params);
  return result.rows[0] || null;
}

async function getMany(text, params) {
  const result = await query(text, params);
  return result.rows;
}

// ----------------------------------------------
// কানেকশন ক্লোজ
// ----------------------------------------------
async function close() {
  try {
    await pool.end();
    console.log("✅ Database connection closed");
    return true;
  } catch (error) {
    console.error("Error closing database:", error);
    return false;
  }
}

// ----------------------------------------------
// এক্সপোর্ট
// ----------------------------------------------
module.exports = {
  pool,
  connect,
  checkConnection,
  setupTables,
  seedDefaultTools,
  query,
  getOne,
  getMany,
  close
};
