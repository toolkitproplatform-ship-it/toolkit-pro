// ============================================
// Toolkit Pro - Database Connection
// আরও টুলস সহ সম্পূর্ণ আপডেটেড
// ============================================

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://toolkit_admin:PwqP3lux8QCvRlXxKPJJOVZlS8GB7NKU@dpg-dagamoeq1p3s73b86sq0-a/toolkit_pro",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err);
});

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

async function checkConnection() {
  try {
    const result = await pool.query("SELECT NOW() as now");
    return result.rows[0].now;
  } catch (error) {
    return false;
  }
}

async function setupTables() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    
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
    
    await client.query("COMMIT");
    console.log("✅ Database tables ready");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error setting up tables:", error);
    throw error;
  } finally {
    client.release();
  }
}

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
    // ============================================
    // TEXT TOOLS
    // ============================================
    { slug: "word-counter", name: "Word Counter", category: "text-tools", icon: "📝", description: "Count words, characters, sentences and paragraphs", is_featured: true, is_popular: true, is_new: true },
    { slug: "character-counter", name: "Character Counter", category: "text-tools", icon: "🔤", description: "Count characters, words, spaces and lines", is_popular: true },
    { slug: "case-converter", name: "Case Converter", category: "text-tools", icon: "🔠", description: "Convert text to UPPERCASE, lowercase, Title Case", is_popular: true },
    { slug: "lorem-ipsum-generator", name: "Lorem Ipsum Generator", category: "text-tools", icon: "📄", description: "Generate placeholder text for designs", is_new: true },
    { slug: "text-reverser", name: "Text Reverser", category: "text-tools", icon: "🔄", description: "Reverse your text instantly", is_new: true },
    { slug: "word-frequency-counter", name: "Word Frequency Counter", category: "text-tools", icon: "📊", description: "Count how many times each word appears" },
    { slug: "palindrome-checker", name: "Palindrome Checker", category: "text-tools", icon: "🔁", description: "Check if text reads the same backwards" },
    { slug: "text-to-slug", name: "Text to Slug", category: "text-tools", icon: "🔗", description: "Convert text to URL-friendly slug" },
    { slug: "remove-duplicate-lines", name: "Remove Duplicate Lines", category: "text-tools", icon: "📋", description: "Remove duplicate lines from text" },
    { slug: "text-sorter", name: "Text Sorter", category: "text-tools", icon: "🔢", description: "Sort lines alphabetically or numerically" },

    // ============================================
    // IMAGE TOOLS
    // ============================================
    { slug: "image-compressor", name: "Image Compressor", category: "image-tools", icon: "🗜️", description: "Compress images without losing quality", is_featured: true, is_popular: true },
    { slug: "image-resizer", name: "Image Resizer", category: "image-tools", icon: "📐", description: "Resize images to any dimension", is_popular: true },
    { slug: "image-to-base64", name: "Image to Base64", category: "image-tools", icon: "🔐", description: "Convert images to Base64 encoded string", is_new: true },
    { slug: "color-picker", name: "Color Picker", category: "image-tools", icon: "🎨", description: "Pick colors and get HEX, RGB, HSL values", is_popular: true },
    { slug: "favicon-generator", name: "Favicon Generator", category: "image-tools", icon: "⭐", description: "Generate favicon from any image", is_new: true },
    { slug: "image-cropper", name: "Image Cropper", category: "image-tools", icon: "✂️", description: "Crop images to specific dimensions" },

    // ============================================
    // DEVELOPER TOOLS
    // ============================================
    { slug: "json-formatter", name: "JSON Formatter", category: "developer-tools", icon: "💻", description: "Format, validate and beautify JSON data", is_featured: true, is_popular: true },
    { slug: "json-validator", name: "JSON Validator", category: "developer-tools", icon: "✅", description: "Validate JSON syntax", is_popular: true },
    { slug: "css-minifier", name: "CSS Minifier", category: "developer-tools", icon: "🎨", description: "Minify CSS code", is_new: true },
    { slug: "html-formatter", name: "HTML Formatter", category: "developer-tools", icon: "📄", description: "Format and beautify HTML code", is_new: true },
    { slug: "js-minifier", name: "JavaScript Minifier", category: "developer-tools", icon: "⚡", description: "Minify JavaScript code" },
    { slug: "regex-tester", name: "Regex Tester", category: "developer-tools", icon: "🔍", description: "Test regular expressions", is_popular: true },
    { slug: "uuid-generator", name: "UUID Generator", category: "developer-tools", icon: "🆔", description: "Generate unique identifiers", is_popular: true },
    { slug: "url-encoder", name: "URL Encoder/Decoder", category: "developer-tools", icon: "🔗", description: "Encode or decode URLs" },
    { slug: "base64-encoder", name: "Base64 Encoder/Decoder", category: "developer-tools", icon: "🔐", description: "Encode or decode Base64" },
    { slug: "color-converter", name: "Color Converter", category: "developer-tools", icon: "🎨", description: "Convert HEX, RGB, HSL colors" },

    // ============================================
    // SECURITY TOOLS
    // ============================================
    { slug: "password-generator", name: "Password Generator", category: "security-tools", icon: "🔐", description: "Generate strong and secure passwords", is_featured: true, is_popular: true },
    { slug: "password-strength-checker", name: "Password Strength Checker", category: "security-tools", icon: "💪", description: "Check how strong your password is", is_popular: true },
    { slug: "hash-generator", name: "Hash Generator", category: "security-tools", icon: "🔢", description: "Generate MD5, SHA1, SHA256 hashes", is_popular: true },
    { slug: "md5-generator", name: "MD5 Generator", category: "security-tools", icon: "🔑", description: "Generate MD5 hash from text", is_new: true },

    // ============================================
    // SEO TOOLS
    // ============================================
    { slug: "meta-tag-generator", name: "Meta Tag Generator", category: "seo-tools", icon: "🏷️", description: "Generate meta tags for SEO", is_popular: true },
    { slug: "keyword-density-checker", name: "Keyword Density Checker", category: "seo-tools", icon: "📊", description: "Check keyword density in text", is_new: true },
    { slug: "robots-txt-generator", name: "Robots.txt Generator", category: "seo-tools", icon: "🤖", description: "Generate robots.txt file", is_new: true },
    { slug: "sitemap-generator", name: "Sitemap Generator", category: "seo-tools", icon: "🗺️", description: "Generate XML sitemap" },

    // ============================================
    // CONVERTER TOOLS
    // ============================================
    { slug: "qr-code-generator", name: "QR Code Generator", category: "converter-tools", icon: "📱", description: "Create QR codes for URLs, text and more", is_popular: true },
    { slug: "unit-converter", name: "Unit Converter", category: "converter-tools", icon: "📏", description: "Convert length, weight, temperature units", is_popular: true },
    { slug: "currency-converter", name: "Currency Converter", category: "converter-tools", icon: "💱", description: "Convert between different currencies", is_new: true },
    { slug: "temperature-converter", name: "Temperature Converter", category: "converter-tools", icon: "🌡️", description: "Convert Celsius, Fahrenheit, Kelvin" },
    { slug: "binary-to-text", name: "Binary to Text", category: "converter-tools", icon: "🔢", description: "Convert binary to text and vice versa", is_new: true },

    // ============================================
    // CALCULATOR TOOLS
    // ============================================
    { slug: "bmi-calculator", name: "BMI Calculator", category: "calculator-tools", icon: "⚖️", description: "Calculate your Body Mass Index", is_popular: true },
    { slug: "age-calculator", name: "Age Calculator", category: "calculator-tools", icon: "🎂", description: "Calculate your exact age", is_popular: true },
    { slug: "percentage-calculator", name: "Percentage Calculator", category: "calculator-tools", icon: "💯", description: "Calculate percentages easily", is_new: true },
    { slug: "loan-calculator", name: "Loan Calculator", category: "calculator-tools", icon: "🏦", description: "Calculate loan EMI and interest", is_new: true },
    { slug: "tip-calculator", name: "Tip Calculator", category: "calculator-tools", icon: "💵", description: "Calculate tips for restaurants" },
    { slug: "discount-calculator", name: "Discount Calculator", category: "calculator-tools", icon: "🏷️", description: "Calculate discounts and final price" },

    // ============================================
    // UTILITY TOOLS
    // ============================================
    { slug: "random-number-generator", name: "Random Number Generator", category: "utility-tools", icon: "🎲", description: "Generate random numbers", is_popular: true },
    { slug: "time-zone-converter", name: "Time Zone Converter", category: "utility-tools", icon: "🕐", description: "Convert time between time zones", is_new: true },
    { slug: "date-calculator", name: "Date Calculator", category: "utility-tools", icon: "📅", description: "Calculate days between dates", is_new: true },
    { slug: "stopwatch", name: "Online Stopwatch", category: "utility-tools", icon: "⏱️", description: "Online stopwatch and timer" },
    { slug: "counter", name: "Online Counter", category: "utility-tools", icon: "🔢", description: "Simple online counter" }
  ];

  try {
    // ক্যাটাগরি সিড
    for (const category of defaultCategories) {
      await query(`
        INSERT INTO tool_categories (slug, name, icon, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO NOTHING
      `, [category.slug, category.name, category.icon, category.sort_order]);
    }
    console.log("✅ Categories seeded");

    // টুলস সিড
    for (const tool of defaultTools) {
      await query(`
        INSERT INTO tools (slug, name, category, icon, description, is_featured, is_popular, is_new)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          icon = EXCLUDED.icon,
          description = EXCLUDED.description,
          is_featured = EXCLUDED.is_featured,
          is_popular = EXCLUDED.is_popular,
          is_new = EXCLUDED.is_new
      `, [
        tool.slug, tool.name, tool.category, tool.icon,
        tool.description, tool.is_featured || false, 
        tool.is_popular || false, tool.is_new || false
      ]);
    }
    console.log(`✅ ${defaultTools.length} tools seeded`);

    // ক্যাটাগরি টুল কাউন্ট আপডেট
    await query(`
      UPDATE tool_categories tc
      SET tool_count = (SELECT COUNT(*) FROM tools t WHERE t.category = tc.slug AND t.is_active = true)
    `);
    console.log("✅ Category counts updated");

  } catch (error) {
    console.error("Error seeding data:", error);
  }
}

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
