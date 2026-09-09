// ============================================
// Toolkit Pro - Database Connection
// Final Version - 600+ Tools Complete Seeding
// ============================================

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

// ============================================
// PostgreSQL কানেকশন পুল
// ============================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://toolkit_admin:PwqP3lux8QCvRlXxKPJJOVZlS8GB7NKU@dpg-dagamoeq1p3s73b86sq0-a/toolkit_pro",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }
});

// এরর হ্যান্ডলিং
pool.on("error", (err) => {
  console.error("❌ Unexpected database error:", err.message);
});

pool.on("connect", () => {
  console.log("📦 New database connection established");
});

// ============================================
// কানেকশন ফাংশন
// ============================================
async function connect(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      const client = await pool.connect();
      console.log("✅ PostgreSQL connection successful");
      client.release();
      return true;
    } catch (error) {
      console.error(`❌ Connection attempt ${i + 1}/${retries} failed:`, error.message);
      if (i < retries - 1) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        throw error;
      }
    }
  }
}

// ============================================
// হেলথ চেক
// ============================================
async function checkConnection() {
  try {
    const result = await pool.query("SELECT NOW() as now");
    return result.rows[0].now;
  } catch (error) {
    return false;
  }
}

// ============================================
// টেবিল সেটআপ
// ============================================
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
        is_active BOOLEAN DEFAULT TRUE,
        last_login_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
    
    await client.query("COMMIT");
    console.log("✅ All database tables created successfully");
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Error setting up tables:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// ৬০০+ টুলস সিড ফাংশন
// ============================================
async function seedAllTools() {
  const client = await pool.connect();
  
  try {
    await client.query("BEGIN");
    
    // ============================================
    // ক্যাটাগরি সিড (২০টি)
    // ============================================
    const categories = [
      { slug: "text-tools", name: "Text Tools", icon: "📝", sort: 1 },
      { slug: "image-tools", name: "Image Tools", icon: "🖼️", sort: 2 },
      { slug: "developer-tools", name: "Developer Tools", icon: "💻", sort: 3 },
      { slug: "data-tools", name: "Data Tools", icon: "📊", sort: 4 },
      { slug: "security-tools", name: "Security Tools", icon: "🔐", sort: 5 },
      { slug: "multimedia-tools", name: "Multimedia Tools", icon: "🎥", sort: 6 },
      { slug: "seo-tools", name: "SEO Tools", icon: "🌐", sort: 7 },
      { slug: "converter-tools", name: "Converter Tools", icon: "📱", sort: 8 },
      { slug: "calculator-tools", name: "Calculator Tools", icon: "🧮", sort: 9 },
      { slug: "utility-tools", name: "Utility Tools", icon: "⚡", sort: 10 },
      { slug: "network-tools", name: "Network Tools", icon: "🌍", sort: 11 },
      { slug: "math-tools", name: "Math Tools", icon: "📐", sort: 12 },
      { slug: "string-tools", name: "String Tools", icon: "🔤", sort: 13 },
      { slug: "date-time-tools", name: "Date & Time Tools", icon: "📅", sort: 14 },
      { slug: "color-tools", name: "Color Tools", icon: "🎨", sort: 15 },
      { slug: "file-tools", name: "File Tools", icon: "📁", sort: 16 },
      { slug: "web-tools", name: "Web Tools", icon: "🌐", sort: 17 },
      { slug: "encoding-tools", name: "Encoding Tools", icon: "🔐", sort: 18 },
      { slug: "hash-tools", name: "Hash Tools", icon: "🔢", sort: 19 },
      { slug: "crypto-tools", name: "Crypto Tools", icon: "💰", sort: 20 }
    ];
    
    for (const cat of categories) {
      await client.query(`
        INSERT INTO tool_categories (slug, name, icon, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO UPDATE SET 
          name = EXCLUDED.name, 
          icon = EXCLUDED.icon,
          sort_order = EXCLUDED.sort_order
      `, [cat.slug, cat.name, cat.icon, cat.sort]);
    }
    console.log(`✅ ${categories.length} categories seeded`);
    
    // ============================================
    // টুলস ডেটা (৬০০+)
    // ============================================
    const toolsData = [];
    
    // ---- TEXT TOOLS (৫০টি) ----
    const textTools = [
      ["word-counter", "Word Counter", "Count words, characters, sentences and paragraphs", true, true, false],
      ["character-counter", "Character Counter", "Count characters, words and lines", true, false, false],
      ["case-converter", "Case Converter", "Convert text to UPPERCASE, lowercase, Title Case", true, false, false],
      ["lorem-ipsum-generator", "Lorem Ipsum Generator", "Generate placeholder text for designs", false, false, true],
      ["text-reverser", "Text Reverser", "Reverse your text instantly", false, false, true],
      ["word-frequency-counter", "Word Frequency Counter", "Count how many times each word appears", false, false, false],
      ["palindrome-checker", "Palindrome Checker", "Check if text reads the same backwards", false, false, false],
      ["text-to-slug", "Text to Slug", "Convert text to URL-friendly slug", false, false, false],
      ["remove-duplicate-lines", "Remove Duplicate Lines", "Remove duplicate lines from text", false, false, false],
      ["text-sorter", "Text Sorter", "Sort lines alphabetically or numerically", false, false, false],
      ["text-comparer", "Text Comparer", "Compare two texts side by side", false, false, false],
      ["find-and-replace", "Find and Replace", "Find and replace text content", false, false, false],
      ["text-splitter", "Text Splitter", "Split text by delimiter", false, false, false],
      ["text-joiner", "Text Joiner", "Join multiple texts together", false, false, false],
      ["line-number-adder", "Line Number Adder", "Add line numbers to text", false, false, false],
      ["whitespace-remover", "Whitespace Remover", "Remove extra whitespace from text", false, false, false],
      ["html-to-text", "HTML to Text", "Convert HTML to plain text", false, false, false],
      ["text-to-html", "Text to HTML", "Convert plain text to HTML", false, false, false],
      ["markdown-to-html", "Markdown to HTML", "Convert Markdown to HTML", false, false, false],
      ["morse-code-converter", "Morse Code Converter", "Convert text to Morse code", false, false, false],
      ["text-encryptor", "Text Encryptor", "Encrypt text content", false, false, false],
      ["text-decryptor", "Text Decryptor", "Decrypt text content", false, false, false],
      ["binary-to-text", "Binary to Text", "Convert binary to text", false, false, false],
      ["text-to-binary", "Text to Binary", "Convert text to binary", false, false, false],
      ["hex-to-text", "Hex to Text", "Convert hex to text", false, false, false],
      ["text-to-hex", "Text to Hex", "Convert text to hex", false, false, false],
      ["emoji-remover", "Emoji Remover", "Remove emojis from text", false, false, false],
      ["word-scrambler", "Word Scrambler", "Scramble words in text", false, false, false],
      ["acronym-generator", "Acronym Generator", "Generate acronyms from text", false, false, false],
      ["text-summarizer", "Text Summarizer", "Summarize long text content", false, false, false],
      ["keyword-extractor", "Keyword Extractor", "Extract keywords from text", false, false, false],
      ["sentence-counter", "Sentence Counter", "Count sentences in text", false, false, false],
      ["paragraph-counter", "Paragraph Counter", "Count paragraphs in text", false, false, false],
      ["reading-time-calculator", "Reading Time Calculator", "Calculate reading time", false, false, false],
      ["text-to-list", "Text to List", "Convert text to list format", false, false, false],
      ["list-to-text", "List to Text", "Convert list to text format", false, false, false],
      ["text-shuffler", "Text Shuffler", "Shuffle text lines randomly", false, false, false],
      ["text-deduplicator", "Text Deduplicator", "Remove duplicate words", false, false, false],
      ["text-analyzer", "Text Analyzer", "Analyze text content and structure", false, false, false],
      ["text-cleaner", "Text Cleaner", "Clean text formatting", false, false, false],
      ["text-formatter", "Text Formatter", "Format text alignment", false, false, false],
      ["text-wrap", "Text Wrap", "Wrap text to specified width", false, false, false],
      ["text-unwrap", "Text Unwrap", "Unwrap text lines", false, false, false],
      ["text-indent", "Text Indent", "Indent text lines", false, false, false],
      ["text-outdent", "Text Outdent", "Outdent text lines", false, false, false],
      ["text-prefix", "Text Prefix", "Add prefix to text lines", false, false, false],
      ["text-suffix", "Text Suffix", "Add suffix to text lines", false, false, false],
      ["text-numbering", "Text Numbering", "Number text lines", false, false, false],
      ["text-bullet", "Text Bullet Points", "Add bullets to text lines", false, false, false],
      ["text-quote", "Text Quote", "Add quotes to text lines", false, false, false]
    ];
    textTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "text-tools", description: desc, icon: "📝", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- IMAGE TOOLS (৩০টি) ----
    const imageTools = [
      ["image-compressor", "Image Compressor", "Compress images without losing quality", true, true, false],
      ["image-resizer", "Image Resizer", "Resize images to any dimension", true, false, false],
      ["image-cropper", "Image Cropper", "Crop images to specific dimensions", true, false, false],
      ["image-rotator", "Image Rotator", "Rotate images by degrees", false, false, false],
      ["image-flipper", "Image Flipper", "Flip images horizontally or vertically", false, false, false],
      ["image-to-base64", "Image to Base64", "Convert image to Base64 string", false, false, true],
      ["base64-to-image", "Base64 to Image", "Convert Base64 to image", false, false, false],
      ["color-picker", "Color Picker", "Pick colors from images", true, false, false],
      ["favicon-generator", "Favicon Generator", "Generate favicons from images", false, false, true],
      ["image-watermark", "Image Watermark", "Add watermark to images", false, false, false],
      ["image-blur", "Image Blur", "Blur images for effect", false, false, false],
      ["image-grayscale", "Image Grayscale", "Convert images to grayscale", false, false, false],
      ["image-sepia", "Image Sepia", "Add sepia effect to images", false, false, false],
      ["image-brightness", "Image Brightness", "Adjust image brightness", false, false, false],
      ["image-contrast", "Image Contrast", "Adjust image contrast", false, false, false],
      ["image-saturation", "Image Saturation", "Adjust image saturation", false, false, false],
      ["pixelate-image", "Pixelate Image", "Pixelate images", false, false, false],
      ["image-border", "Image Border", "Add border to images", false, false, false],
      ["image-rounded", "Image Rounded Corners", "Round image corners", false, false, false],
      ["image-placeholder", "Placeholder Generator", "Generate placeholder images", false, false, false],
      ["svg-to-png", "SVG to PNG", "Convert SVG to PNG format", false, false, false],
      ["png-to-jpg", "PNG to JPG", "Convert PNG to JPG format", false, false, false],
      ["jpg-to-png", "JPG to PNG", "Convert JPG to PNG format", false, false, false],
      ["image-mirror", "Image Mirror", "Mirror images horizontally", false, false, false],
      ["image-negative", "Image Negative", "Create negative of images", false, false, false],
      ["image-hue", "Image Hue", "Adjust image hue", false, false, false],
      ["image-sharpen", "Image Sharpen", "Sharpen images", false, false, false],
      ["barcode-generator", "Barcode Generator", "Generate barcodes", false, false, false],
      ["qr-image-generator", "QR Image Generator", "Generate QR code images", false, false, false],
      ["screenshot-generator", "Screenshot Generator", "Generate screenshots", false, false, false]
    ];
    imageTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "image-tools", description: desc, icon: "🖼️", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- DEVELOPER TOOLS (৫০টি) ----
    const devTools = [
      ["json-formatter", "JSON Formatter", "Format and beautify JSON data", true, true, false],
      ["json-validator", "JSON Validator", "Validate JSON syntax", true, false, false],
      ["json-to-xml", "JSON to XML", "Convert JSON to XML format", false, false, false],
      ["xml-to-json", "XML to JSON", "Convert XML to JSON format", false, false, false],
      ["json-to-csv", "JSON to CSV", "Convert JSON to CSV", false, false, false],
      ["csv-to-json", "CSV to JSON", "Convert CSV to JSON", false, false, false],
      ["json-minifier", "JSON Minifier", "Minify JSON data", false, false, false],
      ["css-minifier", "CSS Minifier", "Minify CSS code", false, false, true],
      ["css-formatter", "CSS Formatter", "Format CSS code", false, false, false],
      ["html-formatter", "HTML Formatter", "Format HTML code", false, false, true],
      ["html-minifier", "HTML Minifier", "Minify HTML code", false, false, false],
      ["js-minifier", "JS Minifier", "Minify JavaScript code", false, false, false],
      ["js-formatter", "JS Formatter", "Format JavaScript code", false, false, false],
      ["regex-tester", "Regex Tester", "Test regular expressions", true, false, false],
      ["uuid-generator", "UUID Generator", "Generate unique UUIDs", true, false, false],
      ["guid-generator", "GUID Generator", "Generate GUIDs", false, false, false],
      ["random-string-generator", "Random String Generator", "Generate random strings", false, false, false],
      ["url-encoder", "URL Encoder", "Encode URLs", false, false, false],
      ["url-decoder", "URL Decoder", "Decode URLs", false, false, false],
      ["base64-encoder", "Base64 Encoder", "Encode to Base64", false, false, false],
      ["base64-decoder", "Base64 Decoder", "Decode from Base64", false, false, false],
      ["color-converter", "Color Converter", "Convert color formats", false, false, false],
      ["hex-to-rgb", "HEX to RGB", "Convert HEX to RGB colors", false, false, false],
      ["rgb-to-hex", "RGB to HEX", "Convert RGB to HEX colors", false, false, false],
      ["code-beautifier", "Code Beautifier", "Beautify source code", false, false, false],
      ["sql-formatter", "SQL Formatter", "Format SQL queries", false, false, false],
      ["yaml-validator", "YAML Validator", "Validate YAML syntax", false, false, false],
      ["markdown-preview", "Markdown Preview", "Preview Markdown content", false, false, false],
      ["api-tester", "API Tester", "Test API endpoints", false, false, false],
      ["http-status-checker", "HTTP Status Checker", "Check HTTP status codes", false, false, false],
      ["ssl-checker", "SSL Checker", "Check SSL certificates", false, false, false],
      ["dns-lookup", "DNS Lookup", "DNS lookup tool", false, false, false],
      ["ip-lookup", "IP Lookup", "IP address lookup", false, false, false],
      ["whois-lookup", "WHOIS Lookup", "Domain WHOIS lookup", false, false, false],
      ["ping-tester", "Ping Tester", "Test network ping", false, false, false],
      ["traceroute", "Traceroute", "Trace network route", false, false, false],
      ["port-scanner", "Port Scanner", "Scan network ports", false, false, false],
      ["git-helper", "Git Helper", "Git commands reference", false, false, false],
      ["npm-search", "NPM Search", "Search npm packages", false, false, false],
      ["docker-helper", "Docker Helper", "Docker commands reference", false, false, false],
      ["xml-formatter", "XML Formatter", "Format XML code", false, false, false],
      ["xml-validator", "XML Validator", "Validate XML syntax", false, false, false],
      ["csv-viewer", "CSV Viewer", "View CSV files", false, false, false],
      ["ts-formatter", "TypeScript Formatter", "Format TypeScript code", false, false, false],
      ["php-formatter", "PHP Formatter", "Format PHP code", false, false, false],
      ["python-formatter", "Python Formatter", "Format Python code", false, false, false],
      ["ruby-formatter", "Ruby Formatter", "Format Ruby code", false, false, false],
      ["go-formatter", "Go Formatter", "Format Go code", false, false, false],
      ["rust-formatter", "Rust Formatter", "Format Rust code", false, false, false],
      ["java-formatter", "Java Formatter", "Format Java code", false, false, false]
    ];
    devTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "developer-tools", description: desc, icon: "💻", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- SECURITY TOOLS (৩০টি) ----
    const securityTools = [
      ["password-generator", "Password Generator", "Generate strong secure passwords", true, true, false],
      ["password-strength-checker", "Password Strength Checker", "Check password strength", true, false, false],
      ["hash-generator", "Hash Generator", "Generate various hashes", true, false, false],
      ["md5-generator", "MD5 Generator", "Generate MD5 hash", false, false, false],
      ["sha1-generator", "SHA1 Generator", "Generate SHA1 hash", false, false, false],
      ["sha256-generator", "SHA256 Generator", "Generate SHA256 hash", false, false, false],
      ["sha512-generator", "SHA512 Generator", "Generate SHA512 hash", false, false, false],
      ["bcrypt-generator", "Bcrypt Generator", "Generate bcrypt hash", false, false, false],
      ["encryption-tool", "Encryption Tool", "Encrypt text content", false, false, false],
      ["decryption-tool", "Decryption Tool", "Decrypt text content", false, false, false],
      ["aes-encryptor", "AES Encryptor", "AES encryption tool", false, false, false],
      ["ssl-cert-checker", "SSL Certificate Checker", "Check SSL certificates", false, false, false],
      ["security-headers", "Security Headers Checker", "Check security headers", false, false, false],
      ["csp-generator", "CSP Generator", "Generate Content Security Policy", false, false, false],
      ["htaccess-generator", ".htaccess Generator", "Generate .htaccess files", false, false, false],
      ["email-validator", "Email Validator", "Validate email addresses", true, false, false],
      ["phone-validator", "Phone Validator", "Validate phone numbers", false, false, false],
      ["credit-card-validator", "Credit Card Validator", "Validate credit cards", false, false, false],
      ["ip-validator", "IP Validator", "Validate IP addresses", false, false, false],
      ["domain-validator", "Domain Validator", "Validate domain names", false, false, false],
      ["url-validator", "URL Validator", "Validate URLs", false, false, false],
      ["sql-injection-tester", "SQL Injection Tester", "Test SQL injection", false, false, false],
      ["xss-tester", "XSS Tester", "Test XSS vulnerabilities", false, false, false],
      ["csrf-tester", "CSRF Tester", "Test CSRF vulnerabilities", false, false, false],
      ["password-manager", "Password Manager", "Manage passwords securely", false, false, false],
      ["2fa-generator", "2FA Generator", "Generate 2FA codes", false, false, false],
      ["virus-scanner", "Virus Scanner", "Scan for viruses", false, false, false],
      ["malware-scanner", "Malware Scanner", "Scan for malware", false, false, false],
      ["data-encryptor", "Data Encryptor", "Encrypt data files", false, false, false],
      ["data-decryptor", "Data Decryptor", "Decrypt data files", false, false, false]
    ];
    securityTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "security-tools", description: desc, icon: "🔐", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- SEO TOOLS (৩০টি) ----
    const seoTools = [
      ["meta-tag-generator", "Meta Tag Generator", "Generate meta tags for SEO", true, false, false],
      ["keyword-density-checker", "Keyword Density Checker", "Check keyword density", false, false, true],
      ["robots-txt-generator", "Robots.txt Generator", "Generate robots.txt", false, false, true],
      ["sitemap-generator", "Sitemap Generator", "Generate XML sitemap", false, false, false],
      ["keyword-research", "Keyword Research", "Research keywords", false, false, false],
      ["backlink-checker", "Backlink Checker", "Check backlinks", false, false, false],
      ["domain-authority", "Domain Authority Checker", "Check domain authority", false, false, false],
      ["page-authority", "Page Authority Checker", "Check page authority", false, false, false],
      ["serp-preview", "SERP Preview", "Preview search results", false, false, false],
      ["title-tag-preview", "Title Tag Preview", "Preview title tags", false, false, false],
      ["open-graph-generator", "Open Graph Generator", "Generate OG tags", false, false, false],
      ["twitter-card-generator", "Twitter Card Generator", "Generate Twitter cards", false, false, false],
      ["schema-generator", "Schema Generator", "Generate schema markup", false, false, false],
      ["page-speed-checker", "Page Speed Checker", "Check page speed", false, false, false],
      ["mobile-friendly", "Mobile Friendly Test", "Test mobile friendliness", false, false, false],
      ["seo-audit", "SEO Audit", "Complete SEO audit", false, false, false],
      ["competitor-analysis", "Competitor Analysis", "Analyze competitors", false, false, false],
      ["content-optimizer", "Content Optimizer", "Optimize content", false, false, false],
      ["broken-link-checker", "Broken Link Checker", "Find broken links", false, false, false],
      ["redirect-checker", "Redirect Checker", "Check redirects", false, false, false],
      ["alexa-rank", "Alexa Rank Checker", "Check Alexa rank", false, false, false],
      ["google-index", "Google Index Checker", "Check Google indexing", false, false, false],
      ["bing-index", "Bing Index Checker", "Check Bing indexing", false, false, false],
      ["rich-snippet", "Rich Snippet Tester", "Test rich snippets", false, false, false],
      ["internal-link", "Internal Link Analyzer", "Analyze internal links", false, false, false],
      ["keyword-suggestion", "Keyword Suggestion", "Get keyword suggestions", false, false, false],
      ["long-tail-keywords", "Long Tail Keywords", "Generate long tail keywords", false, false, false],
      ["sitemap-validator", "Sitemap Validator", "Validate sitemap", false, false, false],
      ["meta-analyzer", "Meta Analyzer", "Analyze meta tags", false, false, false],
      ["content-analyzer", "Content Analyzer", "Analyze content quality", false, false, false]
    ];
    seoTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "seo-tools", description: desc, icon: "🌐", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- CONVERTER TOOLS (৪০টি) ----
    const converterTools = [
      ["qr-code-generator", "QR Code Generator", "Generate QR codes", true, false, false],
      ["unit-converter", "Unit Converter", "Convert various units", true, false, false],
      ["currency-converter", "Currency Converter", "Convert currencies", false, false, true],
      ["temperature-converter", "Temperature Converter", "Convert temperatures", false, false, false],
      ["binary-to-text", "Binary to Text", "Convert binary to text", false, false, false],
      ["text-to-binary", "Text to Binary", "Convert text to binary", false, false, false],
      ["hex-to-text", "Hex to Text", "Convert hex to text", false, false, false],
      ["text-to-hex", "Text to Hex", "Convert text to hex", false, false, false],
      ["base64-to-text", "Base64 to Text", "Convert Base64 to text", false, false, false],
      ["text-to-base64", "Text to Base64", "Convert text to Base64", false, false, false],
      ["decimal-to-binary", "Decimal to Binary", "Convert decimal to binary", false, false, false],
      ["binary-to-decimal", "Binary to Decimal", "Convert binary to decimal", false, false, false],
      ["decimal-to-hex", "Decimal to HEX", "Convert decimal to HEX", false, false, false],
      ["hex-to-decimal", "HEX to Decimal", "Convert HEX to decimal", false, false, false],
      ["roman-numerals", "Roman Numerals Converter", "Convert to Roman numerals", false, false, false],
      ["time-converter", "Time Converter", "Convert time units", false, false, false],
      ["speed-converter", "Speed Converter", "Convert speed units", false, false, false],
      ["weight-converter", "Weight Converter", "Convert weight units", false, false, false],
      ["length-converter", "Length Converter", "Convert length units", false, false, false],
      ["area-converter", "Area Converter", "Convert area units", false, false, false],
      ["volume-converter", "Volume Converter", "Convert volume units", false, false, false],
      ["pressure-converter", "Pressure Converter", "Convert pressure units", false, false, false],
      ["energy-converter", "Energy Converter", "Convert energy units", false, false, false],
      ["power-converter", "Power Converter", "Convert power units", false, false, false],
      ["data-converter", "Data Converter", "Convert data storage units", false, false, false],
      ["angle-converter", "Angle Converter", "Convert angle units", false, false, false],
      ["frequency-converter", "Frequency Converter", "Convert frequency units", false, false, false],
      ["force-converter", "Force Converter", "Convert force units", false, false, false],
      ["density-converter", "Density Converter", "Convert density units", false, false, false],
      ["flow-converter", "Flow Rate Converter", "Convert flow rate units", false, false, false],
      ["fraction-to-decimal", "Fraction to Decimal", "Convert fraction to decimal", false, false, false],
      ["decimal-to-fraction", "Decimal to Fraction", "Convert decimal to fraction", false, false, false],
      ["percent-to-decimal", "Percent to Decimal", "Convert percent to decimal", false, false, false],
      ["decimal-to-percent", "Decimal to Percent", "Convert decimal to percent", false, false, false],
      ["octal-converter", "Octal Converter", "Convert octal numbers", false, false, false],
      ["scientific-notation", "Scientific Notation", "Convert to scientific notation", false, false, false],
      ["ascii-converter", "ASCII Converter", "Convert ASCII codes", false, false, false],
      ["unicode-converter", "Unicode Converter", "Convert Unicode characters", false, false, false],
      ["morse-converter", "Morse Code Converter", "Convert Morse code", false, false, false],
      ["leet-converter", "Leet Speak Converter", "Convert to Leet Speak", false, false, false]
    ];
    converterTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "converter-tools", description: desc, icon: "📱", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- CALCULATOR TOOLS (৪০টি) ----
    const calcTools = [
      ["bmi-calculator", "BMI Calculator", "Calculate Body Mass Index", true, false, false],
      ["age-calculator", "Age Calculator", "Calculate exact age", true, false, false],
      ["percentage-calculator", "Percentage Calculator", "Calculate percentages", true, false, true],
      ["loan-calculator", "Loan Calculator", "Calculate loan EMI", false, false, true],
      ["tip-calculator", "Tip Calculator", "Calculate restaurant tips", false, false, false],
      ["discount-calculator", "Discount Calculator", "Calculate discounts", false, false, false],
      ["mortgage-calculator", "Mortgage Calculator", "Calculate mortgages", false, false, false],
      ["compound-interest", "Compound Interest Calculator", "Calculate compound interest", false, false, false],
      ["simple-interest", "Simple Interest Calculator", "Calculate simple interest", false, false, false],
      ["savings-calculator", "Savings Calculator", "Calculate savings growth", false, false, false],
      ["retirement-calculator", "Retirement Calculator", "Plan retirement savings", false, false, false],
      ["tax-calculator", "Tax Calculator", "Calculate taxes", false, false, false],
      ["salary-calculator", "Salary Calculator", "Calculate salary", false, false, false],
      ["calorie-calculator", "Calorie Calculator", "Calculate daily calories", false, false, false],
      ["body-fat-calculator", "Body Fat Calculator", "Calculate body fat percentage", false, false, false],
      ["ideal-weight", "Ideal Weight Calculator", "Calculate ideal weight", false, false, false],
      ["gpa-calculator", "GPA Calculator", "Calculate GPA", false, false, false],
      ["cgpa-calculator", "CGPA Calculator", "Calculate CGPA", false, false, false],
      ["grade-calculator", "Grade Calculator", "Calculate grades", false, false, false],
      ["probability-calculator", "Probability Calculator", "Calculate probability", false, false, false],
      ["factorial-calculator", "Factorial Calculator", "Calculate factorial", false, false, false],
      ["logarithm-calculator", "Logarithm Calculator", "Calculate logarithms", false, false, false],
      ["square-root-calculator", "Square Root Calculator", "Calculate square root", false, false, false],
      ["exponent-calculator", "Exponent Calculator", "Calculate exponents", false, false, false],
      ["fraction-calculator", "Fraction Calculator", "Calculate fractions", false, false, false],
      ["ratio-calculator", "Ratio Calculator", "Calculate ratios", false, false, false],
      ["average-calculator", "Average Calculator", "Calculate average", false, false, false],
      ["median-calculator", "Median Calculator", "Calculate median", false, false, false],
      ["mode-calculator", "Mode Calculator", "Calculate mode", false, false, false],
      ["range-calculator", "Range Calculator", "Calculate range", false, false, false],
      ["z-score-calculator", "Z-Score Calculator", "Calculate z-score", false, false, false],
      ["permutation-calculator", "Permutation Calculator", "Calculate permutations", false, false, false],
      ["combination-calculator", "Combination Calculator", "Calculate combinations", false, false, false],
      ["attendance-calculator", "Attendance Calculator", "Calculate attendance", false, false, false],
      ["final-grade-calculator", "Final Grade Calculator", "Calculate final grade", false, false, false],
      ["hourly-rate-calculator", "Hourly Rate Calculator", "Calculate hourly rate", false, false, false],
      ["pregnancy-calculator", "Pregnancy Calculator", "Calculate due date", false, false, false],
      ["ovulation-calculator", "Ovulation Calculator", "Calculate ovulation", false, false, false],
      ["confidence-interval", "Confidence Interval Calculator", "Calculate confidence interval", false, false, false],
      ["proportion-calculator", "Proportion Calculator", "Calculate proportions", false, false, false]
    ];
    calcTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "calculator-tools", description: desc, icon: "🧮", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- UTILITY TOOLS (৫০টি) ----
    const utilityTools = [
      ["random-number-generator", "Random Number Generator", "Generate random numbers", true, false, false],
      ["random-name-generator", "Random Name Generator", "Generate random names", false, false, false],
      ["random-password", "Random Password Generator", "Generate random passwords", false, false, false],
      ["time-zone-converter", "Time Zone Converter", "Convert time zones", false, false, true],
      ["date-calculator", "Date Calculator", "Calculate dates", false, false, true],
      ["days-between-dates", "Days Between Dates", "Calculate days between dates", false, false, false],
      ["stopwatch", "Stopwatch", "Online stopwatch", false, false, false],
      ["countdown-timer", "Countdown Timer", "Countdown timer", false, false, false],
      ["world-clock", "World Clock", "View world times", false, false, false],
      ["counter", "Counter", "Online counter", false, false, false],
      ["note-taker", "Note Taker", "Take notes online", false, false, false],
      ["todo-list", "To-Do List", "Create to-do lists", false, false, false],
      ["checklist-generator", "Checklist Generator", "Generate checklists", false, false, false],
      ["habit-tracker", "Habit Tracker", "Track daily habits", false, false, false],
      ["goal-tracker", "Goal Tracker", "Track goals", false, false, false],
      ["budget-planner", "Budget Planner", "Plan monthly budget", false, false, false],
      ["expense-tracker", "Expense Tracker", "Track expenses", false, false, false],
      ["invoice-generator", "Invoice Generator", "Generate invoices", false, false, false],
      ["link-shortener", "Link Shortener", "Shorten URLs", false, false, false],
      ["url-expander", "URL Expander", "Expand short URLs", false, false, false],
      ["email-extractor", "Email Extractor", "Extract email addresses", false, false, false],
      ["phone-extractor", "Phone Extractor", "Extract phone numbers", false, false, false],
      ["url-extractor", "URL Extractor", "Extract URLs from text", false, false, false],
      ["hashtag-generator", "Hashtag Generator", "Generate hashtags", false, false, false],
      ["username-generator", "Username Generator", "Generate usernames", false, false, false],
      ["gradient-generator", "Gradient Generator", "Generate CSS gradients", false, false, false],
      ["palette-generator", "Palette Generator", "Generate color palettes", false, false, false],
      ["font-pairing", "Font Pairing Tool", "Pair Google fonts", false, false, false],
      ["emoji-list", "Emoji List", "Browse emoji list", false, false, false],
      ["symbol-list", "Symbol List", "Browse symbols", false, false, false],
      ["password-vault", "Password Vault", "Store passwords", false, false, false],
      ["bookmark-manager", "Bookmark Manager", "Manage bookmarks", false, false, false],
      ["qr-scanner", "QR Scanner", "Scan QR codes", false, false, false],
      ["receipt-generator", "Receipt Generator", "Generate receipts", false, false, false],
      ["click-counter", "Click Counter", "Count clicks", false, false, false],
      ["tally-counter", "Tally Counter", "Tally counter", false, false, false],
      ["day-of-week", "Day of Week Finder", "Find day of week", false, false, false],
      ["week-number", "Week Number Finder", "Find week number", false, false, false],
      ["leap-year-checker", "Leap Year Checker", "Check leap year", false, false, false],
      ["random-date", "Random Date Generator", "Generate random dates", false, false, false],
      ["random-email", "Random Email Generator", "Generate random emails", false, false, false],
      ["random-address", "Random Address Generator", "Generate random addresses", false, false, false],
      ["random-phone", "Random Phone Generator", "Generate random phones", false, false, false],
      ["color-name-finder", "Color Name Finder", "Find color names", false, false, false],
      ["special-characters", "Special Characters", "Browse special characters", false, false, false],
      ["unicode-characters", "Unicode Characters", "Browse Unicode characters", false, false, false],
      ["add-days", "Add Days Calculator", "Add days to date", false, false, false],
      ["date-difference", "Date Difference Calculator", "Calculate date difference", false, false, false],
      ["pomodoro-timer", "Pomodoro Timer", "Pomodoro technique timer", false, false, false],
      ["meeting-planner", "Meeting Planner", "Plan meetings across zones", false, false, false]
    ];
    utilityTools.forEach(([slug, name, desc, popular, featured, isNew]) => {
      toolsData.push({ slug, name, category: "utility-tools", description: desc, icon: "⚡", is_popular: popular, is_featured: featured, is_new: isNew });
    });
    
    // ---- অন্যান্য ক্যাটাগরি (সংক্ষিপ্ত) ----
    const otherCategories = {
      "data-tools": ["csv-viewer", "data-generator", "chart-generator", "statistics-calculator", "mean-calculator", "median-calculator", "mode-calculator", "standard-deviation", "variance-calculator", "probability-calculator", "survey-generator", "poll-generator", "table-generator", "data-validator", "data-cleaner", "data-transformer", "data-visualizer", "bar-chart-generator", "pie-chart-generator", "line-chart-generator"],
      "multimedia-tools": ["video-compressor", "video-converter", "video-to-gif", "gif-maker", "audio-converter", "text-to-speech", "speech-to-text", "subtitle-generator", "video-cutter", "video-merger", "audio-cutter", "audio-merger", "meme-generator", "ringtone-maker", "waveform-generator", "spectrogram-generator", "sound-effects", "video-resizer", "gif-compressor", "audio-compressor"],
      "network-tools": ["ip-lookup", "dns-lookup", "whois-lookup", "ping-tester", "traceroute", "port-scanner", "subnet-calculator", "speed-test", "vpn-detector", "proxy-detector", "mac-generator", "ipv4-to-ipv6", "cidr-calculator", "data-usage", "wifi-analyzer", "signal-strength", "firewall-tester", "latency-tester", "packet-loss", "bandwidth-calculator"],
      "math-tools": ["scientific-calculator", "graphing-calculator", "matrix-calculator", "trigonometry-calculator", "geometry-calculator", "algebra-calculator", "derivative-calculator", "integral-calculator", "equation-solver", "quadratic-solver", "prime-checker", "prime-factorization", "gcd-calculator", "lcm-calculator", "modulo-calculator", "percentage-change", "ratio-simplifier", "rounding-calculator", "significant-figures", "complex-calculator"],
      "string-tools": ["string-length", "string-reverse", "string-uppercase", "string-lowercase", "string-title-case", "string-camel-case", "string-snake-case", "string-kebab-case", "string-trim", "string-split", "string-join", "string-replace", "string-search", "string-count", "string-compare", "string-hash", "string-encrypt", "string-decrypt", "string-escape", "string-truncate"],
      "date-time-tools": ["unix-timestamp", "epoch-converter", "milliseconds-converter", "date-to-timestamp", "timestamp-to-date", "age-in-days", "age-in-months", "age-in-hours", "countdown", "alarm-clock", "event-countdown", "holiday-calculator", "weekday-calculator", "weekend-calculator", "century-calculator", "decade-calculator", "month-name", "time-duration", "time-calculator", "calendar-generator"],
      "color-tools": ["color-picker", "color-converter", "hex-to-rgb", "rgb-to-hex", "color-palette", "gradient-generator", "color-scheme", "contrast-checker", "random-color", "color-shades", "color-tints", "color-mixer", "color-inverter", "color-grayscale", "color-temperature", "color-harmony", "color-blindness", "color-extractor", "color-matcher", "color-analyzer"],
      "file-tools": ["file-converter", "file-compressor", "zip-creator", "zip-extractor", "pdf-converter", "pdf-merger", "pdf-splitter", "pdf-compressor", "image-to-pdf", "pdf-to-image", "word-to-pdf", "pdf-to-word", "excel-to-pdf", "pdf-to-excel", "file-renamer", "file-organizer", "file-encryptor", "file-decryptor", "file-hash", "file-validator"],
      "web-tools": ["url-shortener", "url-expander", "link-preview", "website-screenshot", "website-speed", "website-uptime", "http-header", "cookie-analyzer", "api-tester", "webhook-tester", "cors-tester", "redirect-checker", "broken-links", "sitemap-validator", "robots-validator", "xml-validator", "html-validator", "css-validator", "js-validator", "json-validator"],
      "encoding-tools": ["base64-encode", "base64-decode", "url-encode", "url-decode", "html-encode", "html-decode", "utf8-encode", "utf8-decode", "ascii-encode", "ascii-decode", "hex-encode", "hex-decode", "binary-encode", "binary-decode", "morse-encode", "morse-decode", "rot13-encode", "rot13-decode", "punycode-encode", "punycode-decode"],
      "hash-tools": ["md5-hash", "sha1-hash", "sha256-hash", "sha384-hash", "sha512-hash", "crc32-hash", "bcrypt-hash", "argon2-hash", "ripemd160-hash", "whirlpool-hash", "tiger-hash", "gost-hash", "blake2-hash", "keccak-hash", "sha3-hash", "xxhash", "murmurhash", "adler32-hash", "haval-hash", "snefru-hash"],
      "crypto-tools": ["bitcoin-converter", "ethereum-converter", "crypto-price", "crypto-market", "crypto-volume", "wallet-generator", "btc-validator", "eth-validator", "private-key", "public-key", "mnemonic-generator", "gas-fee", "profit-calculator", "roi-calculator", "portfolio-tracker", "staking-calculator", "mining-calculator", "transaction-fee", "seed-phrase", "crypto-alerts"]
    };
    
    const categoryIcons = {
      "data-tools": "📊", "multimedia-tools": "🎥", "network-tools": "🌍",
      "math-tools": "📐", "string-tools": "🔤", "date-time-tools": "📅",
      "color-tools": "🎨", "file-tools": "📁", "web-tools": "🌐",
      "encoding-tools": "🔐", "hash-tools": "🔢", "crypto-tools": "💰"
    };
    
    for (const [category, slugs] of Object.entries(otherCategories)) {
      slugs.forEach((slug, index) => {
        const name = slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        toolsData.push({
          slug,
          name,
          category,
          description: name + " - free online tool",
          icon: categoryIcons[category] || "🔧",
          is_popular: index < 3,
          is_featured: false,
          is_new: index < 2
        });
      });
    }
    
    // ---- সব টুলস ইনসার্ট ----
    for (const tool of toolsData) {
      await client.query(`
        INSERT INTO tools (slug, name, category, description, icon, is_featured, is_popular, is_new)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          icon = EXCLUDED.icon,
          is_featured = EXCLUDED.is_featured,
          is_popular = EXCLUDED.is_popular,
          is_new = EXCLUDED.is_new,
          updated_at = CURRENT_TIMESTAMP
      `, [
        tool.slug, tool.name, tool.category, tool.description,
        tool.icon, tool.is_featured || false, tool.is_popular || false, tool.is_new || false
      ]);
    }
    
    // ---- ক্যাটাগরি কাউন্ট আপডেট ----
    await client.query(`
      UPDATE tool_categories tc
      SET tool_count = (SELECT COUNT(*) FROM tools t WHERE t.category = tc.slug AND t.is_active = true)
    `);
    
    await client.query("COMMIT");
    console.log(`✅ Total ${toolsData.length} tools seeded successfully!`);
    return toolsData.length;
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ Seeding error:", error.message);
    throw error;
  } finally {
    client.release();
  }
}

// ============================================
// কোয়েরি হেল্পার ফাংশন
// ============================================
async function query(text, params) {
  try {
    return await pool.query(text, params);
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

// ============================================
// এক্সপোর্ট
// ============================================
module.exports = {
  pool,
  connect,
  checkConnection,
  setupTables,
  seedAllTools,
  query,
  getOne,
  getMany,
  close
};
