// ============================================
// Toolkit Pro - Database Connection
// 500+ Tools Complete Database
// ============================================

const { Pool } = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://toolkit_admin:PwqP3lux8QCvRlXxKPJJOVZlS8GB7NKU@dpg-dagamoeq1p3s73b86sq0-a/toolkit_pro",
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }
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
      console.error(`❌ Connection attempt ${i + 1}/${retries} failed:`, error.message);
      if (i < retries - 1) {
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
  } catch (error) { return false; }
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
    throw error;
  } finally {
    client.release();
  }
}

async function seedDefaultTools() {
  const categories = [
    { slug: "text-tools", name: "Text Tools", icon: "📝", sort_order: 1 },
    { slug: "image-tools", name: "Image Tools", icon: "🖼️", sort_order: 2 },
    { slug: "developer-tools", name: "Developer Tools", icon: "💻", sort_order: 3 },
    { slug: "data-tools", name: "Data Tools", icon: "📊", sort_order: 4 },
    { slug: "security-tools", name: "Security Tools", icon: "🔐", sort_order: 5 },
    { slug: "multimedia-tools", name: "Multimedia Tools", icon: "🎥", sort_order: 6 },
    { slug: "seo-tools", name: "SEO Tools", icon: "🌐", sort_order: 7 },
    { slug: "converter-tools", name: "Converter Tools", icon: "📱", sort_order: 8 },
    { slug: "calculator-tools", name: "Calculator Tools", icon: "🧮", sort_order: 9 },
    { slug: "utility-tools", name: "Utility Tools", icon: "⚡", sort_order: 10 },
    { slug: "network-tools", name: "Network Tools", icon: "🌐", sort_order: 11 },
    { slug: "math-tools", name: "Math Tools", icon: "📐", sort_order: 12 },
    { slug: "string-tools", name: "String Tools", icon: "🔤", sort_order: 13 },
    { slug: "date-time-tools", name: "Date & Time Tools", icon: "📅", sort_order: 14 },
    { slug: "color-tools", name: "Color Tools", icon: "🎨", sort_order: 15 },
    { slug: "file-tools", name: "File Tools", icon: "📁", sort_order: 16 },
    { slug: "web-tools", name: "Web Tools", icon: "🌍", sort_order: 17 },
    { slug: "encoding-tools", name: "Encoding Tools", icon: "🔐", sort_order: 18 },
    { slug: "hash-tools", name: "Hash Tools", icon: "🔢", sort_order: 19 },
    { slug: "crypto-tools", name: "Crypto Tools", icon: "💰", sort_order: 20 }
  ];

  // ৫০০+ টুলস জেনারেট করা হবে
  const tools = [];
  
  // ============================================
  // TEXT TOOLS (৫০টি)
  // ============================================
  const textTools = [
    ["word-counter", "Word Counter", "Count words, characters, sentences and paragraphs"],
    ["character-counter", "Character Counter", "Count characters, words, spaces and lines"],
    ["case-converter", "Case Converter", "Convert text to UPPERCASE, lowercase, Title Case"],
    ["lorem-ipsum-generator", "Lorem Ipsum Generator", "Generate placeholder text"],
    ["text-reverser", "Text Reverser", "Reverse your text instantly"],
    ["word-frequency-counter", "Word Frequency Counter", "Count word frequency"],
    ["palindrome-checker", "Palindrome Checker", "Check palindrome text"],
    ["text-to-slug", "Text to Slug", "Convert text to URL slug"],
    ["remove-duplicate-lines", "Remove Duplicate Lines", "Remove duplicate lines"],
    ["text-sorter", "Text Sorter", "Sort lines alphabetically"],
    ["text-comparer", "Text Comparer", "Compare two texts"],
    ["text-diff-checker", "Text Diff Checker", "Find differences between texts"],
    ["find-and-replace", "Find and Replace", "Find and replace text"],
    ["regex-replacer", "Regex Replacer", "Replace text using regex"],
    ["text-splitter", "Text Splitter", "Split text by delimiter"],
    ["text-joiner", "Text Joiner", "Join multiple texts"],
    ["line-number-adder", "Line Number Adder", "Add line numbers to text"],
    ["whitespace-remover", "Whitespace Remover", "Remove extra whitespace"],
    ["html-to-text", "HTML to Text", "Convert HTML to plain text"],
    ["text-to-html", "Text to HTML", "Convert plain text to HTML"],
    ["markdown-to-html", "Markdown to HTML", "Convert Markdown to HTML"],
    ["html-to-markdown", "HTML to Markdown", "Convert HTML to Markdown"],
    ["text-encryptor", "Text Encryptor", "Encrypt text"],
    ["text-decryptor", "Text Decryptor", "Decrypt text"],
    ["morse-code-converter", "Morse Code Converter", "Convert text to Morse code"],
    ["leet-speak-converter", "Leet Speak Converter", "Convert text to leet speak"],
    ["pig-latin-converter", "Pig Latin Converter", "Convert text to Pig Latin"],
    ["binary-text-converter", "Binary to Text", "Convert binary to text"],
    ["text-to-binary", "Text to Binary", "Convert text to binary"],
    ["hex-to-text", "Hex to Text", "Convert hex to text"],
    ["text-to-hex", "Text to Hex", "Convert text to hex"],
    ["octal-converter", "Octal Converter", "Convert octal to text"],
    ["ascii-converter", "ASCII Converter", "Convert ASCII codes"],
    ["unicode-converter", "Unicode Converter", "Convert Unicode characters"],
    ["emoji-remover", "Emoji Remover", "Remove emojis from text"],
    ["emoji-counter", "Emoji Counter", "Count emojis in text"],
    ["word-scrambler", "Word Scrambler", "Scramble words in text"],
    ["acronym-generator", "Acronym Generator", "Generate acronyms"],
    ["abbreviation-finder", "Abbreviation Finder", "Find abbreviations"],
    ["text-summarizer", "Text Summarizer", "Summarize long text"],
    ["keyword-extractor", "Keyword Extractor", "Extract keywords from text"],
    ["sentence-counter", "Sentence Counter", "Count sentences in text"],
    ["paragraph-counter", "Paragraph Counter", "Count paragraphs"],
    ["reading-time-calculator", "Reading Time Calculator", "Calculate reading time"],
    ["speaking-time-calculator", "Speaking Time Calculator", "Calculate speaking time"],
    ["text-density-analyzer", "Text Density Analyzer", "Analyze text density"],
    ["flesch-reading-score", "Flesch Reading Score", "Calculate readability score"],
    ["gunning-fog-index", "Gunning Fog Index", "Calculate fog index"],
    ["text-to-list", "Text to List", "Convert text to list"],
    ["list-to-text", "List to Text", "Convert list to text"]
  ];
  textTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "text-tools", icon: "📝", description: desc, is_popular: i < 10, is_new: i < 5, is_featured: i < 3 });
  });

  // ============================================
  // IMAGE TOOLS (৩০টি)
  // ============================================
  const imageTools = [
    ["image-compressor", "Image Compressor", "Compress images"],
    ["image-resizer", "Image Resizer", "Resize images"],
    ["image-cropper", "Image Cropper", "Crop images"],
    ["image-rotator", "Image Rotator", "Rotate images"],
    ["image-flipper", "Image Flipper", "Flip images"],
    ["image-to-base64", "Image to Base64", "Convert image to Base64"],
    ["base64-to-image", "Base64 to Image", "Convert Base64 to image"],
    ["color-picker", "Color Picker", "Pick colors"],
    ["favicon-generator", "Favicon Generator", "Generate favicons"],
    ["image-to-text", "Image to Text (OCR)", "Extract text from image"],
    ["image-format-converter", "Image Format Converter", "Convert image formats"],
    ["image-watermark", "Image Watermark", "Add watermark to image"],
    ["image-blur", "Image Blur", "Blur images"],
    ["image-sharpen", "Image Sharpen", "Sharpen images"],
    ["image-grayscale", "Image Grayscale", "Convert to grayscale"],
    ["image-negative", "Image Negative", "Create negative image"],
    ["image-sepia", "Image Sepia", "Add sepia effect"],
    ["image-brightness", "Image Brightness", "Adjust brightness"],
    ["image-contrast", "Image Contrast", "Adjust contrast"],
    ["image-saturation", "Image Saturation", "Adjust saturation"],
    ["image-hue", "Image Hue", "Adjust hue"],
    ["pixelate-image", "Pixelate Image", "Pixelate images"],
    ["image-mirror", "Image Mirror", "Mirror images"],
    ["image-border", "Image Border", "Add border to image"],
    ["image-rounded", "Image Rounded Corners", "Round image corners"],
    ["screenshot-generator", "Screenshot Generator", "Generate screenshots"],
    ["qr-image-generator", "QR Code Image", "Generate QR images"],
    ["barcode-generator", "Barcode Generator", "Generate barcodes"],
    ["image-placeholder", "Placeholder Generator", "Generate placeholder images"],
    ["svg-to-png", "SVG to PNG", "Convert SVG to PNG"]
  ];
  imageTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "image-tools", icon: "🖼️", description: desc, is_popular: i < 8, is_new: i < 4, is_featured: i < 2 });
  });

  // ============================================
  // DEVELOPER TOOLS (৫০টি)
  // ============================================
  const developerTools = [
    ["json-formatter", "JSON Formatter", "Format JSON"],
    ["json-validator", "JSON Validator", "Validate JSON"],
    ["json-to-xml", "JSON to XML", "Convert JSON to XML"],
    ["xml-to-json", "XML to JSON", "Convert XML to JSON"],
    ["json-to-csv", "JSON to CSV", "Convert JSON to CSV"],
    ["csv-to-json", "CSV to JSON", "Convert CSV to JSON"],
    ["json-minifier", "JSON Minifier", "Minify JSON"],
    ["json-diff", "JSON Diff", "Compare JSON objects"],
    ["json-path-tester", "JSON Path Tester", "Test JSON paths"],
    ["css-minifier", "CSS Minifier", "Minify CSS"],
    ["css-formatter", "CSS Formatter", "Format CSS"],
    ["css-validator", "CSS Validator", "Validate CSS"],
    ["html-formatter", "HTML Formatter", "Format HTML"],
    ["html-minifier", "HTML Minifier", "Minify HTML"],
    ["html-validator", "HTML Validator", "Validate HTML"],
    ["js-minifier", "JS Minifier", "Minify JavaScript"],
    ["js-formatter", "JS Formatter", "Format JavaScript"],
    ["js-validator", "JS Validator", "Validate JavaScript"],
    ["regex-tester", "Regex Tester", "Test regular expressions"],
    ["regex-generator", "Regex Generator", "Generate regex patterns"],
    ["uuid-generator", "UUID Generator", "Generate UUIDs"],
    ["guid-generator", "GUID Generator", "Generate GUIDs"],
    ["random-string-generator", "Random String Generator", "Generate random strings"],
    ["url-encoder", "URL Encoder", "Encode URLs"],
    ["url-decoder", "URL Decoder", "Decode URLs"],
    ["base64-encoder", "Base64 Encoder", "Encode Base64"],
    ["base64-decoder", "Base64 Decoder", "Decode Base64"],
    ["color-converter", "Color Converter", "Convert colors"],
    ["hex-to-rgb", "HEX to RGB", "Convert HEX to RGB"],
    ["rgb-to-hex", "RGB to HEX", "Convert RGB to HEX"],
    ["code-beautifier", "Code Beautifier", "Beautify code"],
    ["code-minifier", "Code Minifier", "Minify code"],
    ["sql-formatter", "SQL Formatter", "Format SQL"],
    ["yaml-validator", "YAML Validator", "Validate YAML"],
    ["yaml-to-json", "YAML to JSON", "Convert YAML to JSON"],
    ["json-to-yaml", "JSON to YAML", "Convert JSON to YAML"],
    ["markdown-preview", "Markdown Preview", "Preview Markdown"],
    ["markdown-to-html", "Markdown to HTML", "Convert Markdown to HTML"],
    ["api-tester", "API Tester", "Test API endpoints"],
    ["http-status-checker", "HTTP Status Checker", "Check HTTP status"],
    ["ssl-checker", "SSL Checker", "Check SSL certificates"],
    ["dns-lookup", "DNS Lookup", "DNS lookup tool"],
    ["ip-lookup", "IP Lookup", "IP address lookup"],
    ["whois-lookup", "WHOIS Lookup", "Domain WHOIS lookup"],
    ["ping-tester", "Ping Tester", "Test ping"],
    ["traceroute", "Traceroute", "Trace network route"],
    ["port-scanner", "Port Scanner", "Scan ports"],
    ["git-command-helper", "Git Command Helper", "Git commands reference"],
    ["npm-package-search", "NPM Package Search", "Search npm packages"],
    ["docker-command-helper", "Docker Command Helper", "Docker commands reference"]
  ];
  developerTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "developer-tools", icon: "💻", description: desc, is_popular: i < 12, is_new: i < 6, is_featured: i < 4 });
  });

  // ============================================
  // DATA TOOLS (৩০টি)
  // ============================================
  const dataTools = [
    ["csv-viewer", "CSV Viewer", "View CSV files"],
    ["csv-editor", "CSV Editor", "Edit CSV files"],
    ["excel-to-csv", "Excel to CSV", "Convert Excel to CSV"],
    ["csv-to-excel", "CSV to Excel", "Convert CSV to Excel"],
    ["data-generator", "Data Generator", "Generate sample data"],
    ["random-data-generator", "Random Data Generator", "Generate random data"],
    ["chart-generator", "Chart Generator", "Generate charts"],
    ["bar-chart-generator", "Bar Chart Generator", "Generate bar charts"],
    ["pie-chart-generator", "Pie Chart Generator", "Generate pie charts"],
    ["line-chart-generator", "Line Chart Generator", "Generate line charts"],
    ["scatter-plot-generator", "Scatter Plot Generator", "Generate scatter plots"],
    ["data-visualizer", "Data Visualizer", "Visualize data"],
    ["statistics-calculator", "Statistics Calculator", "Calculate statistics"],
    ["mean-calculator", "Mean Calculator", "Calculate mean"],
    ["median-calculator", "Median Calculator", "Calculate median"],
    ["mode-calculator", "Mode Calculator", "Calculate mode"],
    ["standard-deviation", "Standard Deviation", "Calculate standard deviation"],
    ["variance-calculator", "Variance Calculator", "Calculate variance"],
    ["correlation-calculator", "Correlation Calculator", "Calculate correlation"],
    ["regression-calculator", "Regression Calculator", "Calculate regression"],
    ["probability-calculator", "Probability Calculator", "Calculate probability"],
    ["sample-size-calculator", "Sample Size Calculator", "Calculate sample size"],
    ["survey-generator", "Survey Generator", "Generate surveys"],
    ["poll-generator", "Poll Generator", "Generate polls"],
    ["form-generator", "Form Generator", "Generate forms"],
    ["table-generator", "Table Generator", "Generate tables"],
    ["data-validator", "Data Validator", "Validate data"],
    ["data-cleaner", "Data Cleaner", "Clean data"],
    ["data-transformer", "Data Transformer", "Transform data"],
    ["data-mapper", "Data Mapper", "Map data fields"]
  ];
  dataTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "data-tools", icon: "📊", description: desc, is_popular: i < 6, is_new: i < 3 });
  });

  // ============================================
  // SECURITY TOOLS (৩০টি)
  // ============================================
  const securityTools = [
    ["password-generator", "Password Generator", "Generate secure passwords"],
    ["password-strength-checker", "Password Strength Checker", "Check password strength"],
    ["hash-generator", "Hash Generator", "Generate hashes"],
    ["md5-generator", "MD5 Generator", "Generate MD5 hash"],
    ["sha1-generator", "SHA1 Generator", "Generate SHA1 hash"],
    ["sha256-generator", "SHA256 Generator", "Generate SHA256 hash"],
    ["sha512-generator", "SHA512 Generator", "Generate SHA512 hash"],
    ["bcrypt-generator", "Bcrypt Generator", "Generate bcrypt hash"],
    ["encryption-tool", "Encryption Tool", "Encrypt text"],
    ["decryption-tool", "Decryption Tool", "Decrypt text"],
    ["aes-encryptor", "AES Encryptor", "AES encryption"],
    ["rsa-encryptor", "RSA Encryptor", "RSA encryption"],
    ["ssl-certificate-checker", "SSL Certificate Checker", "Check SSL certificates"],
    ["security-headers-checker", "Security Headers Checker", "Check security headers"],
    ["csp-generator", "CSP Generator", "Generate Content Security Policy"],
    ["htaccess-generator", ".htaccess Generator", "Generate .htaccess"],
    ["robots-txt-validator", "Robots.txt Validator", "Validate robots.txt"],
    ["email-validator", "Email Validator", "Validate email addresses"],
    ["phone-validator", "Phone Validator", "Validate phone numbers"],
    ["credit-card-validator", "Credit Card Validator", "Validate credit cards"],
    ["ip-validator", "IP Validator", "Validate IP addresses"],
    ["domain-validator", "Domain Validator", "Validate domains"],
    ["url-validator", "URL Validator", "Validate URLs"],
    ["virus-total-scanner", "VirusTotal Scanner", "Scan files for viruses"],
    ["malware-scanner", "Malware Scanner", "Scan for malware"],
    ["sql-injection-tester", "SQL Injection Tester", "Test SQL injection"],
    ["xss-tester", "XSS Tester", "Test XSS vulnerabilities"],
    ["csrf-tester", "CSRF Tester", "Test CSRF"],
    ["password-manager", "Password Manager", "Manage passwords"],
    ["two-factor-generator", "2FA Generator", "Generate 2FA codes"]
  ];
  securityTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "security-tools", icon: "🔐", description: desc, is_popular: i < 8, is_new: i < 3, is_featured: i < 2 });
  });

  // ============================================
  // MULTIMEDIA TOOLS (২০টি)
  // ============================================
  const multimediaTools = [
    ["video-compressor", "Video Compressor", "Compress videos"],
    ["video-resizer", "Video Resizer", "Resize videos"],
    ["video-converter", "Video Converter", "Convert video formats"],
    ["video-to-gif", "Video to GIF", "Convert video to GIF"],
    ["gif-maker", "GIF Maker", "Create GIFs"],
    ["gif-compressor", "GIF Compressor", "Compress GIFs"],
    ["audio-converter", "Audio Converter", "Convert audio formats"],
    ["audio-compressor", "Audio Compressor", "Compress audio"],
    ["text-to-speech", "Text to Speech", "Convert text to speech"],
    ["speech-to-text", "Speech to Text", "Convert speech to text"],
    ["subtitle-generator", "Subtitle Generator", "Generate subtitles"],
    ["video-cutter", "Video Cutter", "Cut videos"],
    ["video-merger", "Video Merger", "Merge videos"],
    ["audio-cutter", "Audio Cutter", "Cut audio"],
    ["audio-merger", "Audio Merger", "Merge audio"],
    ["waveform-generator", "Waveform Generator", "Generate waveforms"],
    ["spectrogram-generator", "Spectrogram Generator", "Generate spectrograms"],
    ["sound-effects-generator", "Sound Effects Generator", "Generate sound effects"],
    ["ringtone-maker", "Ringtone Maker", "Create ringtones"],
    ["meme-generator", "Meme Generator", "Create memes"]
  ];
  multimediaTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "multimedia-tools", icon: "🎥", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // SEO TOOLS (৩০টি)
  // ============================================
  const seoTools = [
    ["meta-tag-generator", "Meta Tag Generator", "Generate meta tags"],
    ["meta-tag-analyzer", "Meta Tag Analyzer", "Analyze meta tags"],
    ["keyword-research", "Keyword Research", "Research keywords"],
    ["keyword-density-checker", "Keyword Density Checker", "Check keyword density"],
    ["keyword-suggestion", "Keyword Suggestion", "Get keyword suggestions"],
    ["long-tail-keyword-generator", "Long Tail Keywords", "Generate long tail keywords"],
    ["robots-txt-generator", "Robots.txt Generator", "Generate robots.txt"],
    ["sitemap-generator", "Sitemap Generator", "Generate XML sitemap"],
    ["sitemap-validator", "Sitemap Validator", "Validate sitemap"],
    ["backlink-checker", "Backlink Checker", "Check backlinks"],
    ["backlink-generator", "Backlink Generator", "Generate backlinks"],
    ["domain-authority-checker", "Domain Authority", "Check domain authority"],
    ["page-authority-checker", "Page Authority", "Check page authority"],
    ["alexa-rank-checker", "Alexa Rank", "Check Alexa rank"],
    ["google-index-checker", "Google Index Checker", "Check Google indexing"],
    ["bing-index-checker", "Bing Index Checker", "Check Bing indexing"],
    ["serp-preview", "SERP Preview", "Preview search results"],
    ["title-tag-preview", "Title Tag Preview", "Preview title tags"],
    ["open-graph-generator", "Open Graph Generator", "Generate Open Graph tags"],
    ["twitter-card-generator", "Twitter Card Generator", "Generate Twitter cards"],
    ["schema-generator", "Schema Generator", "Generate schema markup"],
    ["rich-snippet-tester", "Rich Snippet Tester", "Test rich snippets"],
    ["page-speed-checker", "Page Speed Checker", "Check page speed"],
    ["mobile-friendly-test", "Mobile Friendly Test", "Test mobile friendliness"],
    ["seo-audit", "SEO Audit", "Complete SEO audit"],
    ["competitor-analysis", "Competitor Analysis", "Analyze competitors"],
    ["content-optimizer", "Content Optimizer", "Optimize content"],
    ["internal-link-analyzer", "Internal Link Analyzer", "Analyze internal links"],
    ["broken-link-checker", "Broken Link Checker", "Find broken links"],
    ["redirect-checker", "Redirect Checker", "Check redirects"]
  ];
  seoTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "seo-tools", icon: "🌐", description: desc, is_popular: i < 8, is_new: i < 3, is_featured: i < 2 });
  });

  // ============================================
  // CONVERTER TOOLS (৪০টি)
  // ============================================
  const converterTools = [
    ["qr-code-generator", "QR Code Generator", "Generate QR codes"],
    ["unit-converter", "Unit Converter", "Convert units"],
    ["currency-converter", "Currency Converter", "Convert currencies"],
    ["temperature-converter", "Temperature Converter", "Convert temperatures"],
    ["binary-to-text", "Binary to Text", "Binary to text"],
    ["text-to-binary", "Text to Binary", "Text to binary"],
    ["hex-to-text", "Hex to Text", "Hex to text"],
    ["text-to-hex", "Text to Hex", "Text to hex"],
    ["base64-to-text", "Base64 to Text", "Base64 to text"],
    ["text-to-base64", "Text to Base64", "Text to Base64"],
    ["decimal-to-binary", "Decimal to Binary", "Decimal to binary"],
    ["binary-to-decimal", "Binary to Decimal", "Binary to decimal"],
    ["decimal-to-hex", "Decimal to HEX", "Decimal to HEX"],
    ["hex-to-decimal", "HEX to Decimal", "HEX to decimal"],
    ["octal-to-decimal", "Octal to Decimal", "Octal to decimal"],
    ["decimal-to-octal", "Decimal to Octal", "Decimal to octal"],
    ["roman-numeral-converter", "Roman Numeral Converter", "Convert to Roman numerals"],
    ["scientific-notation", "Scientific Notation", "Convert to scientific notation"],
    ["fraction-to-decimal", "Fraction to Decimal", "Fraction to decimal"],
    ["decimal-to-fraction", "Decimal to Fraction", "Decimal to fraction"],
    ["percent-to-decimal", "Percent to Decimal", "Percent to decimal"],
    ["decimal-to-percent", "Decimal to Percent", "Decimal to percent"],
    ["time-converter", "Time Converter", "Convert time units"],
    ["speed-converter", "Speed Converter", "Convert speed units"],
    ["weight-converter", "Weight Converter", "Convert weight units"],
    ["length-converter", "Length Converter", "Convert length units"],
    ["area-converter", "Area Converter", "Convert area units"],
    ["volume-converter", "Volume Converter", "Convert volume units"],
    ["pressure-converter", "Pressure Converter", "Convert pressure units"],
    ["energy-converter", "Energy Converter", "Convert energy units"],
    ["power-converter", "Power Converter", "Convert power units"],
    ["data-storage-converter", "Data Storage Converter", "Convert data units"],
    ["angle-converter", "Angle Converter", "Convert angles"],
    ["frequency-converter", "Frequency Converter", "Convert frequency"],
    ["force-converter", "Force Converter", "Convert force"],
    ["torque-converter", "Torque Converter", "Convert torque"],
    ["density-converter", "Density Converter", "Convert density"],
    ["viscosity-converter", "Viscosity Converter", "Convert viscosity"],
    ["flow-rate-converter", "Flow Rate Converter", "Convert flow rate"],
    ["radiation-converter", "Radiation Converter", "Convert radiation"]
  ];
  converterTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "converter-tools", icon: "📱", description: desc, is_popular: i < 6, is_new: i < 3, is_featured: i < 2 });
  });

  // ============================================
  // CALCULATOR TOOLS (৪০টি)
  // ============================================
  const calculatorTools = [
    ["bmi-calculator", "BMI Calculator", "Calculate BMI"],
    ["age-calculator", "Age Calculator", "Calculate age"],
    ["percentage-calculator", "Percentage Calculator", "Calculate percentages"],
    ["loan-calculator", "Loan Calculator", "Calculate loans"],
    ["tip-calculator", "Tip Calculator", "Calculate tips"],
    ["discount-calculator", "Discount Calculator", "Calculate discounts"],
    ["mortgage-calculator", "Mortgage Calculator", "Calculate mortgages"],
    ["compound-interest-calculator", "Compound Interest", "Calculate compound interest"],
    ["simple-interest-calculator", "Simple Interest", "Calculate simple interest"],
    ["savings-calculator", "Savings Calculator", "Calculate savings"],
    ["retirement-calculator", "Retirement Calculator", "Plan retirement"],
    ["tax-calculator", "Tax Calculator", "Calculate taxes"],
    ["salary-calculator", "Salary Calculator", "Calculate salary"],
    ["hourly-rate-calculator", "Hourly Rate Calculator", "Calculate hourly rate"],
    ["calorie-calculator", "Calorie Calculator", "Calculate calories"],
    ["body-fat-calculator", "Body Fat Calculator", "Calculate body fat"],
    ["ideal-weight-calculator", "Ideal Weight", "Calculate ideal weight"],
    ["pregnancy-calculator", "Pregnancy Calculator", "Calculate due date"],
    ["ovulation-calculator", "Ovulation Calculator", "Calculate ovulation"],
    ["gpa-calculator", "GPA Calculator", "Calculate GPA"],
    ["cgpa-calculator", "CGPA Calculator", "Calculate CGPA"],
    ["grade-calculator", "Grade Calculator", "Calculate grades"],
    ["final-grade-calculator", "Final Grade Calculator", "Calculate final grade"],
    ["attendance-calculator", "Attendance Calculator", "Calculate attendance"],
    ["probability-calculator", "Probability Calculator", "Calculate probability"],
    ["permutation-calculator", "Permutation Calculator", "Calculate permutations"],
    ["combination-calculator", "Combination Calculator", "Calculate combinations"],
    ["factorial-calculator", "Factorial Calculator", "Calculate factorial"],
    ["logarithm-calculator", "Logarithm Calculator", "Calculate logarithms"],
    ["square-root-calculator", "Square Root Calculator", "Calculate square root"],
    ["exponent-calculator", "Exponent Calculator", "Calculate exponents"],
    ["fraction-calculator", "Fraction Calculator", "Calculate fractions"],
    ["ratio-calculator", "Ratio Calculator", "Calculate ratios"],
    ["proportion-calculator", "Proportion Calculator", "Calculate proportions"],
    ["average-calculator", "Average Calculator", "Calculate average"],
    ["median-calculator", "Median Calculator", "Calculate median"],
    ["mode-calculator", "Mode Calculator", "Calculate mode"],
    ["range-calculator", "Range Calculator", "Calculate range"],
    ["z-score-calculator", "Z-Score Calculator", "Calculate z-score"],
    ["confidence-interval-calculator", "Confidence Interval", "Calculate confidence interval"]
  ];
  calculatorTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "calculator-tools", icon: "🧮", description: desc, is_popular: i < 8, is_new: i < 4, is_featured: i < 2 });
  });

  // ============================================
  // UTILITY TOOLS (৫০টি)
  // ============================================
  const utilityTools = [
    ["random-number-generator", "Random Number Generator", "Generate random numbers"],
    ["random-name-generator", "Random Name Generator", "Generate random names"],
    ["random-password-generator", "Random Password", "Generate random passwords"],
    ["random-email-generator", "Random Email", "Generate random emails"],
    ["random-address-generator", "Random Address", "Generate random addresses"],
    ["random-phone-generator", "Random Phone", "Generate random phones"],
    ["random-date-generator", "Random Date", "Generate random dates"],
    ["time-zone-converter", "Time Zone Converter", "Convert time zones"],
    ["date-calculator", "Date Calculator", "Calculate dates"],
    ["date-difference", "Date Difference", "Calculate date difference"],
    ["days-between-dates", "Days Between Dates", "Days between dates"],
    ["add-days-to-date", "Add Days to Date", "Add days to date"],
    ["day-of-week", "Day of Week", "Find day of week"],
    ["week-number", "Week Number", "Find week number"],
    ["leap-year-checker", "Leap Year Checker", "Check leap year"],
    ["stopwatch", "Stopwatch", "Online stopwatch"],
    ["countdown-timer", "Countdown Timer", "Countdown timer"],
    ["world-clock", "World Clock", "World clock"],
    ["counter", "Counter", "Online counter"],
    ["click-counter", "Click Counter", "Count clicks"],
    ["tally-counter", "Tally Counter", "Tally counter"],
    ["note-taker", "Note Taker", "Take notes"],
    ["todo-list", "To-Do List", "Create to-do lists"],
    ["checklist-generator", "Checklist Generator", "Generate checklists"],
    ["habit-tracker", "Habit Tracker", "Track habits"],
    ["goal-tracker", "Goal Tracker", "Track goals"],
    ["budget-planner", "Budget Planner", "Plan budget"],
    ["expense-tracker", "Expense Tracker", "Track expenses"],
    ["invoice-generator", "Invoice Generator", "Generate invoices"],
    ["receipt-generator", "Receipt Generator", "Generate receipts"],
    ["qr-scanner", "QR Scanner", "Scan QR codes"],
    ["barcode-generator", "Barcode Generator", "Generate barcodes"],
    ["password-vault", "Password Vault", "Store passwords"],
    ["bookmark-manager", "Bookmark Manager", "Manage bookmarks"],
    ["link-shortener", "Link Shortener", "Shorten links"],
    ["url-expander", "URL Expander", "Expand URLs"],
    ["email-extractor", "Email Extractor", "Extract emails"],
    ["phone-extractor", "Phone Extractor", "Extract phones"],
    ["url-extractor", "URL Extractor", "Extract URLs"],
    ["hashtag-generator", "Hashtag Generator", "Generate hashtags"],
    ["username-generator", "Username Generator", "Generate usernames"],
    ["password-vault-generator", "Vault Generator", "Generate vault"],
    ["color-name-finder", "Color Name Finder", "Find color names"],
    ["gradient-generator", "Gradient Generator", "Generate gradients"],
    ["palette-generator", "Palette Generator", "Generate palettes"],
    ["font-pairing", "Font Pairing", "Pair fonts"],
    ["emojis-list", "Emoji List", "Browse emojis"],
    ["symbols-list", "Symbol List", "Browse symbols"],
    ["unicode-characters", "Unicode Characters", "Browse Unicode"],
    ["special-characters", "Special Characters", "Browse special characters"]
  ];
  utilityTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "utility-tools", icon: "⚡", description: desc, is_popular: i < 10, is_new: i < 5, is_featured: i < 2 });
  });

  // ============================================
  // NETWORK TOOLS (৩০টি)
  // ============================================
  const networkTools = [
    ["ip-lookup", "IP Lookup", "Lookup IP address"],
    ["ip-geolocation", "IP Geolocation", "Find IP location"],
    ["domain-lookup", "Domain Lookup", "Lookup domain"],
    ["dns-lookup", "DNS Lookup", "DNS lookup"],
    ["reverse-dns", "Reverse DNS", "Reverse DNS lookup"],
    ["whois-lookup", "WHOIS Lookup", "WHOIS lookup"],
    ["ping-tester", "Ping Tester", "Test ping"],
    ["traceroute", "Traceroute", "Trace route"],
    ["port-scanner", "Port Scanner", "Scan ports"],
    ["subnet-calculator", "Subnet Calculator", "Calculate subnets"],
    ["network-calculator", "Network Calculator", "Calculate networks"],
    ["bandwidth-calculator", "Bandwidth Calculator", "Calculate bandwidth"],
    ["latency-tester", "Latency Tester", "Test latency"],
    ["packet-loss-tester", "Packet Loss Tester", "Test packet loss"],
    ["speed-test", "Speed Test", "Test internet speed"],
    ["firewall-tester", "Firewall Tester", "Test firewall"],
    ["vpn-detector", "VPN Detector", "Detect VPN"],
    ["proxy-detector", "Proxy Detector", "Detect proxy"],
    ["tor-detector", "Tor Detector", "Detect Tor"],
    ["mac-address-lookup", "MAC Address Lookup", "Lookup MAC address"],
    ["mac-address-generator", "MAC Address Generator", "Generate MAC addresses"],
    ["ipv4-to-ipv6", "IPv4 to IPv6", "Convert IPv4 to IPv6"],
    ["ipv6-to-ipv4", "IPv6 to IPv4", "Convert IPv6 to IPv4"],
    ["ip-range-calculator", "IP Range Calculator", "Calculate IP range"],
    ["cidr-calculator", "CIDR Calculator", "Calculate CIDR"],
    ["network-mapper", "Network Mapper", "Map network"],
    ["wifi-analyzer", "WiFi Analyzer", "Analyze WiFi"],
    ["signal-strength", "Signal Strength", "Check signal strength"],
    ["data-usage-calculator", "Data Usage Calculator", "Calculate data usage"],
    ["internet-outage-checker", "Outage Checker", "Check outages"]
  ];
  networkTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "network-tools", icon: "🌐", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // MATH TOOLS (৩০টি)
  // ============================================
  const mathTools = [
    ["scientific-calculator", "Scientific Calculator", "Scientific calculations"],
    ["graphing-calculator", "Graphing Calculator", "Graph functions"],
    ["matrix-calculator", "Matrix Calculator", "Matrix operations"],
    ["vector-calculator", "Vector Calculator", "Vector operations"],
    ["trigonometry-calculator", "Trigonometry Calculator", "Trig calculations"],
    ["geometry-calculator", "Geometry Calculator", "Geometry calculations"],
    ["algebra-calculator", "Algebra Calculator", "Algebra calculations"],
    ["calculus-calculator", "Calculus Calculator", "Calculus calculations"],
    ["derivative-calculator", "Derivative Calculator", "Calculate derivatives"],
    ["integral-calculator", "Integral Calculator", "Calculate integrals"],
    ["limit-calculator", "Limit Calculator", "Calculate limits"],
    ["equation-solver", "Equation Solver", "Solve equations"],
    ["quadratic-solver", "Quadratic Solver", "Solve quadratic equations"],
    ["linear-solver", "Linear Solver", "Solve linear equations"],
    ["system-of-equations", "System of Equations", "Solve systems"],
    ["polynomial-solver", "Polynomial Solver", "Solve polynomials"],
    ["prime-number-checker", "Prime Number Checker", "Check prime numbers"],
    ["prime-factorization", "Prime Factorization", "Factorize primes"],
    ["gcd-calculator", "GCD Calculator", "Calculate GCD"],
    ["lcm-calculator", "LCM Calculator", "Calculate LCM"],
    ["divisibility-test", "Divisibility Test", "Test divisibility"],
    ["modulo-calculator", "Modulo Calculator", "Calculate modulo"],
    ["percentage-change", "Percentage Change", "Calculate % change"],
    ["ratio-simplifier", "Ratio Simplifier", "Simplify ratios"],
    ["rounding-calculator", "Rounding Calculator", "Round numbers"],
    ["significant-figures", "Significant Figures", "Count significant figures"],
    ["scientific-notation-converter", "Scientific Notation", "Convert notation"],
    ["complex-number-calculator", "Complex Numbers", "Complex calculations"],
    ["binary-calculator", "Binary Calculator", "Binary calculations"],
    ["hex-calculator", "HEX Calculator", "HEX calculations"]
  ];
  mathTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "math-tools", icon: "📐", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // STRING TOOLS (৩০টি)
  // ============================================
  const stringTools = [
    ["string-length", "String Length", "Calculate string length"],
    ["string-reverse", "String Reverse", "Reverse string"],
    ["string-uppercase", "String Uppercase", "Convert to uppercase"],
    ["string-lowercase", "String Lowercase", "Convert to lowercase"],
    ["string-title-case", "String Title Case", "Convert to title case"],
    ["string-camel-case", "String Camel Case", "Convert to camelCase"],
    ["string-snake-case", "String Snake Case", "Convert to snake_case"],
    ["string-kebab-case", "String Kebab Case", "Convert to kebab-case"],
    ["string-pascal-case", "String Pascal Case", "Convert to PascalCase"],
    ["string-trim", "String Trim", "Trim whitespace"],
    ["string-pad", "String Pad", "Pad string"],
    ["string-repeat", "String Repeat", "Repeat string"],
    ["string-split", "String Split", "Split string"],
    ["string-join", "String Join", "Join strings"],
    ["string-replace", "String Replace", "Replace in string"],
    ["string-search", "String Search", "Search in string"],
    ["string-extract", "String Extract", "Extract substring"],
    ["string-count", "String Count", "Count occurrences"],
    ["string-compare", "String Compare", "Compare strings"],
    ["string-hash", "String Hash", "Hash string"],
    ["string-encrypt", "String Encrypt", "Encrypt string"],
    ["string-decrypt", "String Decrypt", "Decrypt string"],
    ["string-encode", "String Encode", "Encode string"],
    ["string-decode", "String Decode", "Decode string"],
    ["string-escape", "String Escape", "Escape string"],
    ["string-unescape", "String Unescape", "Unescape string"],
    ["string-slugify", "String Slugify", "Slugify string"],
    ["string-truncate", "String Truncate", "Truncate string"],
    ["string-wrap", "String Wrap", "Wrap string"],
    ["string-format", "String Format", "Format string"]
  ];
  stringTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "string-tools", icon: "🔤", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // DATE & TIME TOOLS (৩০টি)
  // ============================================
  const dateTimeTools = [
    ["date-calculator", "Date Calculator", "Calculate dates"],
    ["date-difference", "Date Difference", "Date difference"],
    ["days-between-dates", "Days Between Dates", "Days between"],
    ["add-days", "Add Days", "Add days to date"],
    ["subtract-days", "Subtract Days", "Subtract days"],
    ["day-of-week", "Day of Week", "Find day of week"],
    ["week-number", "Week Number", "Find week number"],
    ["month-name", "Month Name", "Find month name"],
    ["time-zone-converter", "Time Zone Converter", "Convert time zones"],
    ["world-clock", "World Clock", "World clock"],
    ["unix-timestamp", "Unix Timestamp", "Convert Unix timestamp"],
    ["epoch-converter", "Epoch Converter", "Convert epoch"],
    ["milliseconds-converter", "Milliseconds Converter", "Convert milliseconds"],
    ["date-to-timestamp", "Date to Timestamp", "Date to timestamp"],
    ["timestamp-to-date", "Timestamp to Date", "Timestamp to date"],
    ["leap-year-checker", "Leap Year Checker", "Check leap year"],
    ["century-calculator", "Century Calculator", "Calculate century"],
    ["decade-calculator", "Decade Calculator", "Calculate decade"],
    ["age-in-days", "Age in Days", "Calculate age in days"],
    ["age-in-months", "Age in Months", "Calculate age in months"],
    ["age-in-hours", "Age in Hours", "Calculate age in hours"],
    ["countdown", "Countdown", "Countdown timer"],
    ["stopwatch", "Stopwatch", "Stopwatch"],
    ["alarm-clock", "Alarm Clock", "Alarm clock"],
    ["pomodoro-timer", "Pomodoro Timer", "Pomodoro timer"],
    ["meeting-planner", "Meeting Planner", "Plan meetings"],
    ["event-countdown", "Event Countdown", "Event countdown"],
    ["holiday-calculator", "Holiday Calculator", "Calculate holidays"],
    ["weekday-calculator", "Weekday Calculator", "Calculate weekdays"],
    ["weekend-calculator", "Weekend Calculator", "Calculate weekends"]
  ];
  dateTimeTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "date-time-tools", icon: "📅", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // COLOR TOOLS (২০টি)
  // ============================================
  const colorTools = [
    ["color-picker", "Color Picker", "Pick colors"],
    ["color-converter", "Color Converter", "Convert colors"],
    ["hex-to-rgb", "HEX to RGB", "HEX to RGB"],
    ["rgb-to-hex", "RGB to HEX", "RGB to HEX"],
    ["hex-to-hsl", "HEX to HSL", "HEX to HSL"],
    ["hsl-to-hex", "HSL to HEX", "HSL to HEX"],
    ["color-palette-generator", "Palette Generator", "Generate palettes"],
    ["color-gradient-generator", "Gradient Generator", "Generate gradients"],
    ["color-scheme-generator", "Scheme Generator", "Generate schemes"],
    ["color-blindness-simulator", "Color Blindness", "Simulate color blindness"],
    ["color-contrast-checker", "Contrast Checker", "Check contrast"],
    ["color-name-finder", "Color Name Finder", "Find color names"],
    ["random-color-generator", "Random Color", "Generate random colors"],
    ["color-harmony", "Color Harmony", "Find harmonious colors"],
    ["color-shades", "Color Shades", "Generate shades"],
    ["color-tints", "Color Tints", "Generate tints"],
    ["color-mixer", "Color Mixer", "Mix colors"],
    ["color-inverter", "Color Inverter", "Invert colors"],
    ["color-grayscale", "Color Grayscale", "Convert to grayscale"],
    ["color-temperature", "Color Temperature", "Check color temperature"]
  ];
  colorTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "color-tools", icon: "🎨", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // FILE TOOLS (২০টি)
  // ============================================
  const fileTools = [
    ["file-converter", "File Converter", "Convert files"],
    ["file-compressor", "File Compressor", "Compress files"],
    ["file-decompressor", "File Decompressor", "Decompress files"],
    ["zip-creator", "ZIP Creator", "Create ZIP files"],
    ["zip-extractor", "ZIP Extractor", "Extract ZIP files"],
    ["pdf-converter", "PDF Converter", "Convert PDF"],
    ["pdf-merger", "PDF Merger", "Merge PDFs"],
    ["pdf-splitter", "PDF Splitter", "Split PDFs"],
    ["pdf-compressor", "PDF Compressor", "Compress PDFs"],
    ["image-to-pdf", "Image to PDF", "Convert image to PDF"],
    ["pdf-to-image", "PDF to Image", "Convert PDF to image"],
    ["word-to-pdf", "Word to PDF", "Convert Word to PDF"],
    ["pdf-to-word", "PDF to Word", "Convert PDF to Word"],
    ["excel-to-pdf", "Excel to PDF", "Convert Excel to PDF"],
    ["pdf-to-excel", "PDF to Excel", "Convert PDF to Excel"],
    ["ppt-to-pdf", "PPT to PDF", "Convert PPT to PDF"],
    ["pdf-to-ppt", "PDF to PPT", "Convert PDF to PPT"],
    ["file-renamer", "File Renamer", "Rename files"],
    ["file-organizer", "File Organizer", "Organize files"],
    ["file-encryptor", "File Encryptor", "Encrypt files"]
  ];
  fileTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "file-tools", icon: "📁", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // WEB TOOLS (২০টি)
  // ============================================
  const webTools = [
    ["url-shortener", "URL Shortener", "Shorten URLs"],
    ["url-expander", "URL Expander", "Expand URLs"],
    ["link-preview", "Link Preview", "Preview links"],
    ["website-screenshot", "Website Screenshot", "Screenshot websites"],
    ["website-speed-test", "Speed Test", "Test website speed"],
    ["website-uptime", "Uptime Monitor", "Monitor uptime"],
    ["http-header-checker", "HTTP Header Checker", "Check HTTP headers"],
    ["cookie-analyzer", "Cookie Analyzer", "Analyze cookies"],
    ["javascript-validator", "JS Validator", "Validate JavaScript"],
    ["css-validator", "CSS Validator", "Validate CSS"],
    ["html-validator", "HTML Validator", "Validate HTML"],
    ["xml-validator", "XML Validator", "Validate XML"],
    ["json-validator", "JSON Validator", "Validate JSON"],
    ["api-tester", "API Tester", "Test APIs"],
    ["webhook-tester", "Webhook Tester", "Test webhooks"],
    ["cors-tester", "CORS Tester", "Test CORS"],
    ["redirect-checker", "Redirect Checker", "Check redirects"],
    ["broken-link-checker", "Broken Link Checker", "Find broken links"],
    ["sitemap-validator", "Sitemap Validator", "Validate sitemap"],
    ["robots-txt-validator", "Robots Validator", "Validate robots.txt"]
  ];
  webTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "web-tools", icon: "🌍", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // ENCODING TOOLS (২০টি)
  // ============================================
  const encodingTools = [
    ["base64-encode", "Base64 Encode", "Encode Base64"],
    ["base64-decode", "Base64 Decode", "Decode Base64"],
    ["url-encode", "URL Encode", "Encode URL"],
    ["url-decode", "URL Decode", "Decode URL"],
    ["html-encode", "HTML Encode", "Encode HTML"],
    ["html-decode", "HTML Decode", "Decode HTML"],
    ["utf8-encode", "UTF-8 Encode", "Encode UTF-8"],
    ["utf8-decode", "UTF-8 Decode", "Decode UTF-8"],
    ["ascii-encode", "ASCII Encode", "Encode ASCII"],
    ["ascii-decode", "ASCII Decode", "Decode ASCII"],
    ["hex-encode", "HEX Encode", "Encode HEX"],
    ["hex-decode", "HEX Decode", "Decode HEX"],
    ["binary-encode", "Binary Encode", "Encode binary"],
    ["binary-decode", "Binary Decode", "Decode binary"],
    ["morse-encode", "Morse Encode", "Encode Morse"],
    ["morse-decode", "Morse Decode", "Decode Morse"],
    ["rot13-encode", "ROT13 Encode", "Encode ROT13"],
    ["rot13-decode", "ROT13 Decode", "Decode ROT13"],
    ["punycode-encode", "Punycode Encode", "Encode Punycode"],
    ["punycode-decode", "Punycode Decode", "Decode Punycode"]
  ];
  encodingTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "encoding-tools", icon: "🔐", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // HASH TOOLS (২০টি)
  // ============================================
  const hashTools = [
    ["md5-hash", "MD5 Hash", "Generate MD5"],
    ["sha1-hash", "SHA1 Hash", "Generate SHA1"],
    ["sha256-hash", "SHA256 Hash", "Generate SHA256"],
    ["sha384-hash", "SHA384 Hash", "Generate SHA384"],
    ["sha512-hash", "SHA512 Hash", "Generate SHA512"],
    ["crc32-hash", "CRC32 Hash", "Generate CRC32"],
    ["adler32-hash", "Adler32 Hash", "Generate Adler32"],
    ["bcrypt-hash", "Bcrypt Hash", "Generate Bcrypt"],
    ["argon2-hash", "Argon2 Hash", "Generate Argon2"],
    ["ripemd160-hash", "RIPEMD160", "Generate RIPEMD160"],
    ["whirlpool-hash", "Whirlpool", "Generate Whirlpool"],
    ["tiger-hash", "Tiger Hash", "Generate Tiger"],
    ["haval-hash", "HAVAL Hash", "Generate HAVAL"],
    ["gost-hash", "GOST Hash", "Generate GOST"],
    ["snefru-hash", "Snefru Hash", "Generate Snefru"],
    ["blake2-hash", "BLAKE2 Hash", "Generate BLAKE2"],
    ["keccak-hash", "Keccak Hash", "Generate Keccak"],
    ["sha3-hash", "SHA3 Hash", "Generate SHA3"],
    ["xxhash", "xxHash", "Generate xxHash"],
    ["murmurhash", "MurmurHash", "Generate MurmurHash"]
  ];
  hashTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "hash-tools", icon: "🔢", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  // ============================================
  // CRYPTO TOOLS (২০টি)
  // ============================================
  const cryptoTools = [
    ["bitcoin-converter", "Bitcoin Converter", "Convert Bitcoin"],
    ["ethereum-converter", "Ethereum Converter", "Convert Ethereum"],
    ["crypto-price-tracker", "Price Tracker", "Track crypto prices"],
    ["crypto-market-cap", "Market Cap", "Check market cap"],
    ["crypto-volume", "Volume Tracker", "Track volume"],
    ["wallet-address-generator", "Wallet Generator", "Generate wallet"],
    ["bitcoin-address-validator", "BTC Validator", "Validate BTC address"],
    ["ethereum-address-validator", "ETH Validator", "Validate ETH address"],
    ["private-key-generator", "Private Key", "Generate private key"],
    ["public-key-generator", "Public Key", "Generate public key"],
    ["mnemonic-generator", "Mnemonic Generator", "Generate mnemonic"],
    ["seed-phrase-generator", "Seed Phrase", "Generate seed phrase"],
    ["gas-fee-calculator", "Gas Fee Calculator", "Calculate gas fees"],
    ["transaction-fee-calculator", "Fee Calculator", "Calculate fees"],
    ["profit-calculator", "Profit Calculator", "Calculate profit"],
    ["loss-calculator", "Loss Calculator", "Calculate loss"],
    ["roi-calculator", "ROI Calculator", "Calculate ROI"],
    ["staking-calculator", "Staking Calculator", "Calculate staking"],
    ["mining-calculator", "Mining Calculator", "Calculate mining"],
    ["portfolio-tracker", "Portfolio Tracker", "Track portfolio"]
  ];
  cryptoTools.forEach(([slug, name, desc], i) => {
    tools.push({ slug, name, category: "crypto-tools", icon: "💰", description: desc, is_popular: i < 5, is_new: i < 2 });
  });

  try {
    // ক্যাটাগরি সিড
    for (const category of categories) {
      await query(`
        INSERT INTO tool_categories (slug, name, icon, sort_order)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (slug) DO NOTHING
      `, [category.slug, category.name, category.icon, category.sort_order]);
    }
    console.log(`✅ ${categories.length} categories seeded`);

    // টুলস সিড (৫০০+)
    for (const tool of tools) {
      await query(`
        INSERT INTO tools (slug, name, category, icon, description, is_featured, is_popular, is_new)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (slug) DO UPDATE SET
          name = EXCLUDED.name,
          category = EXCLUDED.category,
          icon = EXCLUDED.icon,
          description = EXCLUDED.description
      `, [
        tool.slug, tool.name, tool.category, tool.icon,
        tool.description, tool.is_featured || false,
        tool.is_popular || false, tool.is_new || false
      ]);
    }
    console.log(`✅ ${tools.length} tools seeded successfully!`);

    // ক্যাটাগরি কাউন্ট আপডেট
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
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { pool, connect, checkConnection, setupTables, seedDefaultTools, query, getOne, getMany, close };
