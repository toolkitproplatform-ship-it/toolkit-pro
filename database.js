// ============================================
// Toolkit Pro - Database Connection
// ============================================
// PostgreSQL কানেকশন (Redis ছাড়া কাজ করবে)
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
  connectionString: process.env.DATABASE_URL || "postgresql://toolkit_admin:PwqP3lux8QCvRlXxKPJJOVZlS8GB7NKU@dpg-dagamoeq1p3s73b86sq0-a/toolkit_pro",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false
  }
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
// ডাটাবেস কানেকশন ফাংশন
// ----------------------------------------------
async function connect(retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ PostgreSQL connection successful");
      client.release();
      return true;
    } catch (error) {
      console.error(`❌ PostgreSQL connection attempt ${i + 1}/${retries} failed:`, error.message);
      
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw error;
      }
    }
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
// টেবিল সেটআপ
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
        is_free BOOLEAN DEFAULT TRUE,
        is_active BOOLEAN DEFAULT TRUE,
        is_featured BOOLEAN DEFAULT FALSE,
        is_popular BOOLEAN DEFAULT FALSE,
        is_new BOOLEAN DEFAULT FALSE,
        usage_count INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        rating_count INTEGER DEFAULT 0,
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
        ip_address VARCHAR(45),
        view_date DATE DEFAULT CURRENT_DATE,
        view_count INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tool views table ready");
    
    // User Favorites টেবিল
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Tool reviews table ready");
    
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
  try {
    const result = await pool.query(text, params);
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
