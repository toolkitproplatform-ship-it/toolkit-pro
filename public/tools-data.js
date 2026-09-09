// ============================================
// Toolkit Pro - Complete Tools Database
// 320+ High Demand Tools
// ============================================

const toolsDatabase = {
    // ============================================
    // 📝 TEXT & WRITING TOOLS (২০টি)
    // ============================================
    'ai-text-summarizer': { name: 'AI Text Summarizer', icon: '📝', category: 'text-tools', description: 'AI-powered text summarization tool', demand: 5, popular: true },
    'grammar-checker': { name: 'Grammar Checker', icon: '✅', category: 'text-tools', description: 'Check grammar and spelling errors', demand: 5, popular: true },
    'plagiarism-checker': { name: 'Plagiarism Checker', icon: '🔍', category: 'text-tools', description: 'Check content for plagiarism', demand: 5, popular: true },
    'paraphrasing-tool': { name: 'Paraphrasing Tool', icon: '🔄', category: 'text-tools', description: 'Rewrite and paraphrase text', demand: 5, popular: true },
    'word-counter': { name: 'Word Counter', icon: '📊', category: 'text-tools', description: 'Count words, characters, sentences', demand: 5, popular: true },
    'article-rewriter': { name: 'Article Rewriter', icon: '✍️', category: 'text-tools', description: 'Rewrite articles automatically', demand: 4, popular: true },
    'keyword-extractor': { name: 'Keyword Extractor', icon: '🔑', category: 'text-tools', description: 'Extract keywords from text', demand: 4, popular: false },
    'text-to-speech': { name: 'Text to Speech', icon: '🎤', category: 'text-tools', description: 'Convert text to speech', demand: 5, popular: true },
    'sentence-rewriter': { name: 'Sentence Rewriter', icon: '📝', category: 'text-tools', description: 'Rewrite sentences differently', demand: 4, popular: false },
    'content-generator': { name: 'AI Content Generator', icon: '🤖', category: 'text-tools', description: 'Generate content with AI', demand: 5, popular: true },
    'case-converter': { name: 'Case Converter', icon: '🔠', category: 'text-tools', description: 'Convert text case', demand: 4, popular: true },
    'text-to-slug': { name: 'Text to Slug', icon: '🔗', category: 'text-tools', description: 'Convert text to URL slug', demand: 4, popular: false },
    'character-counter': { name: 'Character Counter', icon: '🔤', category: 'text-tools', description: 'Count characters in text', demand: 4, popular: true },
    'essay-generator': { name: 'Essay Generator', icon: '📄', category: 'text-tools', description: 'Generate essays automatically', demand: 4, popular: false },
    'readability-checker': { name: 'Readability Checker', icon: '📖', category: 'text-tools', description: 'Check text readability score', demand: 3, popular: false },
    'speech-to-text': { name: 'Speech to Text', icon: '🎙️', category: 'text-tools', description: 'Convert speech to text', demand: 4, popular: false },
    'translate-tool': { name: 'Language Translator', icon: '🌍', category: 'text-tools', description: 'Translate text between languages', demand: 4, popular: true },
    'citation-generator': { name: 'Citation Generator', icon: '📚', category: 'text-tools', description: 'Generate citations', demand: 3, popular: false },
    'text-compare': { name: 'Text Compare Tool', icon: '🔍', category: 'text-tools', description: 'Compare two texts', demand: 3, popular: false },
    'word-scrambler': { name: 'Word Scrambler', icon: '🔀', category: 'text-tools', description: 'Scramble words randomly', demand: 2, popular: false },

    // ============================================
    // 💻 DEVELOPER TOOLS (২৫টি)
    // ============================================
    'json-formatter': { name: 'JSON Formatter', icon: '💻', category: 'developer-tools', description: 'Format and validate JSON', demand: 5, popular: true },
    'code-minifier': { name: 'Code Minifier', icon: '📦', category: 'developer-tools', description: 'Minify CSS, JS, HTML', demand: 5, popular: true },
    'api-tester': { name: 'API Tester', icon: '🔌', category: 'developer-tools', description: 'Test API endpoints', demand: 5, popular: true },
    'regex-tester': { name: 'Regex Tester', icon: '🔍', category: 'developer-tools', description: 'Test regular expressions', demand: 5, popular: true },
    'base64-encoder': { name: 'Base64 Encoder/Decoder', icon: '🔐', category: 'developer-tools', description: 'Encode/decode Base64', demand: 5, popular: true },
    'url-encoder': { name: 'URL Encoder/Decoder', icon: '🔗', category: 'developer-tools', description: 'Encode/decode URLs', demand: 5, popular: true },
    'uuid-generator': { name: 'UUID Generator', icon: '🔑', category: 'developer-tools', description: 'Generate UUIDs', demand: 5, popular: true },
    'code-beautifier': { name: 'Code Beautifier', icon: '✨', category: 'developer-tools', description: 'Beautify code', demand: 4, popular: false },
    'sql-formatter': { name: 'SQL Formatter', icon: '🗄️', category: 'developer-tools', description: 'Format SQL queries', demand: 4, popular: false },
    'json-to-csv': { name: 'JSON to CSV', icon: '📊', category: 'developer-tools', description: 'Convert JSON to CSV', demand: 4, popular: false },
    'css-gradient-generator': { name: 'CSS Gradient Generator', icon: '🎨', category: 'developer-tools', description: 'Generate CSS gradients', demand: 4, popular: true },
    'html-formatter': { name: 'HTML Formatter', icon: '📄', category: 'developer-tools', description: 'Format HTML code', demand: 4, popular: false },
    'js-minifier': { name: 'JS Minifier', icon: '📦', category: 'developer-tools', description: 'Minify JavaScript', demand: 4, popular: false },
    'docker-compose-generator': { name: 'Docker Compose Generator', icon: '🐳', category: 'developer-tools', description: 'Generate Docker Compose files', demand: 3, popular: false },
    'git-command-helper': { name: 'Git Command Helper', icon: '📝', category: 'developer-tools', description: 'Git commands reference', demand: 3, popular: false },
    'npm-package-finder': { name: 'NPM Package Finder', icon: '📦', category: 'developer-tools', description: 'Search npm packages', demand: 3, popular: false },
    'python-formatter': { name: 'Python Formatter', icon: '🐍', category: 'developer-tools', description: 'Format Python code', demand: 3, popular: false },
    'typescript-compiler': { name: 'TypeScript Compiler', icon: '📘', category: 'developer-tools', description: 'Compile TypeScript', demand: 3, popular: false },
    'webhook-tester': { name: 'Webhook Tester', icon: '🔗', category: 'developer-tools', description: 'Test webhooks', demand: 3, popular: false },
    'ssl-checker': { name: 'SSL Checker', icon: '🔒', category: 'developer-tools', description: 'Check SSL certificates', demand: 4, popular: true },
    'markdown-preview': { name: 'Markdown Preview', icon: '📝', category: 'developer-tools', description: 'Preview markdown', demand: 3, popular: false },
    'yaml-validator': { name: 'YAML Validator', icon: '✅', category: 'developer-tools', description: 'Validate YAML', demand: 3, popular: false },
    'cron-expression-generator': { name: 'Cron Expression Generator', icon: '⏰', category: 'developer-tools', description: 'Generate cron expressions', demand: 3, popular: false },
    'jwt-debugger': { name: 'JWT Debugger', icon: '🔐', category: 'developer-tools', description: 'Debug JWT tokens', demand: 3, popular: false },
    'color-converter': { name: 'Color Code Converter', icon: '🎨', category: 'developer-tools', description: 'Convert color codes', demand: 3, popular: false },

    // ============================================
    // 🔐 SECURITY TOOLS (১৫টি)
    // ============================================
    'password-generator': { name: 'Password Generator', icon: '🔐', category: 'security-tools', description: 'Generate secure passwords', demand: 5, popular: true },
    'password-manager': { name: 'Password Manager', icon: '🔑', category: 'security-tools', description: 'Manage passwords securely', demand: 5, popular: true },
    '2fa-authenticator': { name: '2FA Authenticator', icon: '🔐', category: 'security-tools', description: 'Generate 2FA codes', demand: 5, popular: true },
    'md5-generator': { name: 'MD5 Hash Generator', icon: '🔢', category: 'security-tools', description: 'Generate MD5 hash', demand: 5, popular: true },
    'sha256-generator': { name: 'SHA256 Hash Generator', icon: '🔢', category: 'security-tools', description: 'Generate SHA256 hash', demand: 4, popular: false },
    'password-strength-checker': { name: 'Password Strength Checker', icon: '💪', category: 'security-tools', description: 'Check password strength', demand: 4, popular: true },
    'email-validator': { name: 'Email Validator', icon: '📧', category: 'security-tools', description: 'Validate email addresses', demand: 4, popular: true },
    'ssl-cert-checker': { name: 'SSL Certificate Checker', icon: '🔒', category: 'security-tools', description: 'Check SSL certificates', demand: 4, popular: false },
    'data-encryption': { name: 'Data Encryption Tool', icon: '🔐', category: 'security-tools', description: 'Encrypt data securely', demand: 4, popular: false },
    'vpn-detector': { name: 'VPN Detector', icon: '🛡️', category: 'security-tools', description: 'Detect VPN usage', demand: 3, popular: false },
    'credit-card-validator': { name: 'Credit Card Validator', icon: '💳', category: 'security-tools', description: 'Validate credit cards', demand: 3, popular: false },
    'security-headers': { name: 'Security Headers Checker', icon: '🛡️', category: 'security-tools', description: 'Check security headers', demand: 3, popular: false },
    'bcrypt-generator': { name: 'Bcrypt Hash Generator', icon: '🔢', category: 'security-tools', description: 'Generate bcrypt hash', demand: 3, popular: false },
    'url-scanner': { name: 'URL Safety Checker', icon: '🔍', category: 'security-tools', description: 'Check URL safety', demand: 3, popular: false },
    'file-encryptor': { name: 'File Encryption Tool', icon: '🔐', category: 'security-tools', description: 'Encrypt files', demand: 3, popular: false },

    // ============================================
    // 📱 CONVERTER TOOLS (২০টি)
    // ============================================
    'qr-code-generator': { name: 'QR Code Generator', icon: '📱', category: 'converter-tools', description: 'Generate QR codes', demand: 5, popular: true },
    'unit-converter': { name: 'Unit Converter', icon: '📏', category: 'converter-tools', description: 'Convert units', demand: 5, popular: true },
    'currency-converter': { name: 'Currency Converter', icon: '💰', category: 'converter-tools', description: 'Convert currencies', demand: 5, popular: true },
    'temperature-converter': { name: 'Temperature Converter', icon: '🌡️', category: 'converter-tools', description: 'Convert temperatures', demand: 5, popular: true },
    'pdf-to-word': { name: 'PDF to Word', icon: '📄', category: 'converter-tools', description: 'Convert PDF to Word', demand: 5, popular: true },
    'word-to-pdf': { name: 'Word to PDF', icon: '📄', category: 'converter-tools', description: 'Convert Word to PDF', demand: 5, popular: true },
    'image-to-pdf': { name: 'Image to PDF', icon: '🖼️', category: 'converter-tools', description: 'Convert images to PDF', demand: 4, popular: false },
    'hex-to-rgb': { name: 'HEX to RGB', icon: '🎨', category: 'converter-tools', description: 'Convert HEX to RGB', demand: 4, popular: true },
    'binary-to-text': { name: 'Binary to Text', icon: '🔢', category: 'converter-tools', description: 'Convert binary to text', demand: 4, popular: false },
    'json-to-xml': { name: 'JSON to XML', icon: '🔄', category: 'converter-tools', description: 'Convert JSON to XML', demand: 4, popular: false },
    'csv-to-json': { name: 'CSV to JSON', icon: '📊', category: 'converter-tools', description: 'Convert CSV to JSON', demand: 4, popular: false },
    'morse-converter': { name: 'Morse Code Converter', icon: '📡', category: 'converter-tools', description: 'Convert to/from Morse code', demand: 3, popular: false },
    'roman-numerals': { name: 'Roman Numerals', icon: '🏛️', category: 'converter-tools', description: 'Convert to Roman numerals', demand: 3, popular: false },
    'time-zone-converter': { name: 'Time Zone Converter', icon: '🌍', category: 'converter-tools', description: 'Convert time zones', demand: 4, popular: true },
    'data-converter': { name: 'Data Storage Converter', icon: '💾', category: 'converter-tools', description: 'Convert data units', demand: 3, popular: false },
    'video-to-audio': { name: 'Video to Audio', icon: '🎵', category: 'converter-tools', description: 'Extract audio from video', demand: 3, popular: false },
    'image-to-text': { name: 'Image to Text (OCR)', icon: '📝', category: 'converter-tools', description: 'Extract text from images', demand: 4, popular: false },
    'html-to-pdf': { name: 'HTML to PDF', icon: '📄', category: 'converter-tools', description: 'Convert HTML to PDF', demand: 3, popular: false },
    'mp3-converter': { name: 'MP3 Converter', icon: '🎵', category: 'converter-tools', description: 'Convert to MP3', demand: 3, popular: false },
    'epub-converter': { name: 'EPUB Converter', icon: '📚', category: 'converter-tools', description: 'Convert to EPUB', demand: 2, popular: false },

    // ============================================
    // 🧮 CALCULATOR TOOLS (২০টি)
    // ============================================
    'bmi-calculator': { name: 'BMI Calculator', icon: '⚖️', category: 'calculator-tools', description: 'Calculate BMI', demand: 5, popular: true },
    'percentage-calculator': { name: 'Percentage Calculator', icon: '📊', category: 'calculator-tools', description: 'Calculate percentages', demand: 5, popular: true },
    'age-calculator': { name: 'Age Calculator', icon: '🎂', category: 'calculator-tools', description: 'Calculate age', demand: 5, popular: true },
    'loan-calculator': { name: 'Loan EMI Calculator', icon: '🏦', category: 'calculator-tools', description: 'Calculate loan EMI', demand: 5, popular: true },
    'compound-interest': { name: 'Compound Interest Calculator', icon: '📈', category: 'calculator-tools', description: 'Calculate compound interest', demand: 5, popular: true },
    'discount-calculator': { name: 'Discount Calculator', icon: '🏷️', category: 'calculator-tools', description: 'Calculate discounts', demand: 5, popular: true },
    'salary-calculator': { name: 'Salary Calculator', icon: '💰', category: 'calculator-tools', description: 'Calculate salary', demand: 4, popular: false },
    'tax-calculator': { name: 'Tax Calculator', icon: '📋', category: 'calculator-tools', description: 'Calculate taxes', demand: 4, popular: false },
    'gpa-calculator': { name: 'GPA Calculator', icon: '🎓', category: 'calculator-tools', description: 'Calculate GPA', demand: 4, popular: true },
    'calorie-calculator': { name: 'Calorie Calculator', icon: '🔥', category: 'calculator-tools', description: 'Calculate calories', demand: 4, popular: false },
    'mortgage-calculator': { name: 'Mortgage Calculator', icon: '🏠', category: 'calculator-tools', description: 'Calculate mortgage', demand: 4, popular: false },
    'retirement-calculator': { name: 'Retirement Calculator', icon: '👴', category: 'calculator-tools', description: 'Plan retirement', demand: 3, popular: false },
    'investment-calculator': { name: 'Investment Calculator', icon: '📈', category: 'calculator-tools', description: 'Calculate investments', demand: 3, popular: false },
    'tip-calculator': { name: 'Tip Calculator', icon: '💝', category: 'calculator-tools', description: 'Calculate tips', demand: 3, popular: false },
    'square-root-calculator': { name: 'Square Root Calculator', icon: '√', category: 'calculator-tools', description: 'Calculate square root', demand: 3, popular: false },
    'scientific-calculator': { name: 'Scientific Calculator', icon: '🧮', category: 'calculator-tools', description: 'Scientific calculations', demand: 4, popular: true },
    'fraction-calculator': { name: 'Fraction Calculator', icon: '🔢', category: 'calculator-tools', description: 'Calculate fractions', demand: 3, popular: false },
    'probability-calculator': { name: 'Probability Calculator', icon: '🎲', category: 'calculator-tools', description: 'Calculate probability', demand: 3, popular: false },
    'ovulation-calculator': { name: 'Ovulation Calculator', icon: '🌸', category: 'calculator-tools', description: 'Calculate ovulation', demand: 3, popular: false },
    'pregnancy-calculator': { name: 'Pregnancy Calculator', icon: '🤰', category: 'calculator-tools', description: 'Calculate pregnancy', demand: 3, popular: false },

    // ============================================
    // 🖼️ IMAGE TOOLS (১৫টি)
    // ============================================
    'image-compressor': { name: 'Image Compressor', icon: '🖼️', category: 'image-tools', description: 'Compress images', demand: 5, popular: true },
    'image-resizer': { name: 'Image Resizer', icon: '📐', category: 'image-tools', description: 'Resize images', demand: 5, popular: true },
    'background-remover': { name: 'Background Remover', icon: '✂️', category: 'image-tools', description: 'Remove image background', demand: 5, popular: true },
    'image-cropper': { name: 'Image Cropper', icon: '✂️', category: 'image-tools', description: 'Crop images', demand: 5, popular: true },
    'color-picker': { name: 'Color Picker', icon: '🎨', category: 'image-tools', description: 'Pick colors', demand: 5, popular: true },
    'image-to-base64': { name: 'Image to Base64', icon: '🔐', category: 'image-tools', description: 'Convert image to Base64', demand: 4, popular: false },
    'png-to-jpg': { name: 'PNG to JPG', icon: '🔄', category: 'image-tools', description: 'Convert PNG to JPG', demand: 4, popular: true },
    'favicon-generator': { name: 'Favicon Generator', icon: '🔖', category: 'image-tools', description: 'Generate favicons', demand: 4, popular: false },
    'image-watermark': { name: 'Image Watermark', icon: '💧', category: 'image-tools', description: 'Add watermark to images', demand: 3, popular: false },
    'qr-image-generator': { name: 'QR Image Generator', icon: '📱', category: 'image-tools', description: 'Generate QR images', demand: 4, popular: false },
    'image-editor': { name: 'Image Editor', icon: '🎨', category: 'image-tools', description: 'Edit images online', demand: 4, popular: false },
    'image-format-converter': { name: 'Image Format Converter', icon: '🔄', category: 'image-tools', description: 'Convert image formats', demand: 3, popular: false },
    'image-grayscale': { name: 'Image Grayscale', icon: '⚫', category: 'image-tools', description: 'Convert to grayscale', demand: 3, popular: false },
    'image-blur': { name: 'Image Blur', icon: '🌫️', category: 'image-tools', description: 'Blur images', demand: 2, popular: false },
    'image-sharpener': { name: 'Image Sharpener', icon: '🔪', category: 'image-tools', description: 'Sharpen images', demand: 3, popular: false },

    // ============================================
    // 🎥 VIDEO & MULTIMEDIA (১৫টি)
    // ============================================
    'youtube-downloader': { name: 'YouTube Downloader', icon: '📹', category: 'multimedia-tools', description: 'Download YouTube videos', demand: 5, popular: true },
    'video-compressor': { name: 'Video Compressor', icon: '🎥', category: 'multimedia-tools', description: 'Compress videos', demand: 5, popular: true },
    'video-converter': { name: 'Video Converter', icon: '🔄', category: 'multimedia-tools', description: 'Convert video formats', demand: 5, popular: true },
    'text-to-speech': { name: 'Text to Speech', icon: '🎤', category: 'multimedia-tools', description: 'Convert text to speech', demand: 5, popular: true },
    'speech-to-text': { name: 'Speech to Text', icon: '🎙️', category: 'multimedia-tools', description: 'Convert speech to text', demand: 5, popular: true },
    'video-to-gif': { name: 'Video to GIF', icon: '🎬', category: 'multimedia-tools', description: 'Convert video to GIF', demand: 4, popular: false },
    'meme-generator': { name: 'Meme Generator', icon: '😂', category: 'multimedia-tools', description: 'Create memes', demand: 4, popular: true },
    'gif-maker': { name: 'GIF Maker', icon: '🎞️', category: 'multimedia-tools', description: 'Create GIFs', demand: 4, popular: false },
    'subtitle-generator': { name: 'Subtitle Generator', icon: '📝', category: 'multimedia-tools', description: 'Generate subtitles', demand: 4, popular: false },
    'video-cutter': { name: 'Video Cutter', icon: '✂️', category: 'multimedia-tools', description: 'Cut videos', demand: 3, popular: false },
    'video-merger': { name: 'Video Merger', icon: '🔗', category: 'multimedia-tools', description: 'Merge videos', demand: 3, popular: false },
    'audio-converter': { name: 'Audio Converter', icon: '🎵', category: 'multimedia-tools', description: 'Convert audio formats', demand: 3, popular: false },
    'video-resizer': { name: 'Video Resizer', icon: '📐', category: 'multimedia-tools', description: 'Resize videos', demand: 3, popular: false },
    'screen-recorder': { name: 'Screen Recorder', icon: '🖥️', category: 'multimedia-tools', description: 'Record screen', demand: 4, popular: false },
    'video-watermark': { name: 'Video Watermark', icon: '💧', category: 'multimedia-tools', description: 'Add watermark to videos', demand: 2, popular: false },

    // ============================================
    // 🌐 SEO TOOLS (১৫টি)
    // ============================================
    'keyword-research': { name: 'Keyword Research', icon: '🔑', category: 'seo-tools', description: 'Research keywords', demand: 5, popular: true },
    'meta-tag-generator': { name: 'Meta Tag Generator', icon: '🏷️', category: 'seo-tools', description: 'Generate meta tags', demand: 5, popular: true },
    'sitemap-generator': { name: 'Sitemap Generator', icon: '🗺️', category: 'seo-tools', description: 'Generate sitemaps', demand: 4, popular: false },
    'keyword-density-checker': { name: 'Keyword Density Checker', icon: '📊', category: 'seo-tools', description: 'Check keyword density', demand: 4, popular: false },
    'domain-authority': { name: 'Domain Authority Checker', icon: '📈', category: 'seo-tools', description: 'Check domain authority', demand: 4, popular: false },
    'page-speed-checker': { name: 'Page Speed Checker', icon: '⚡', category: 'seo-tools', description: 'Check page speed', demand: 4, popular: false },
    'broken-link-checker': { name: 'Broken Link Checker', icon: '🔗', category: 'seo-tools', description: 'Find broken links', demand: 3, popular: false },
    'seo-audit': { name: 'SEO Audit Tool', icon: '📋', category: 'seo-tools', description: 'Complete SEO audit', demand: 4, popular: false },
    'backlink-checker': { name: 'Backlink Checker', icon: '🔗', category: 'seo-tools', description: 'Check backlinks', demand: 3, popular: false },
    'serp-preview': { name: 'SERP Preview', icon: '🔍', category: 'seo-tools', description: 'Preview search results', demand: 3, popular: false },
    'robots-txt-generator': { name: 'Robots.txt Generator', icon: '🤖', category: 'seo-tools', description: 'Generate robots.txt', demand: 3, popular: false },
    'schema-generator': { name: 'Schema Generator', icon: '📊', category: 'seo-tools', description: 'Generate schema markup', demand: 3, popular: false },
    'open-graph-generator': { name: 'Open Graph Generator', icon: '📊', category: 'seo-tools', description: 'Generate OG tags', demand: 2, popular: false },
    'xml-sitemap-validator': { name: 'XML Sitemap Validator', icon: '✅', category: 'seo-tools', description: 'Validate sitemaps', demand: 2, popular: false },
    'google-index-checker': { name: 'Google Index Checker', icon: '🔍', category: 'seo-tools', description: 'Check Google indexing', demand: 3, popular: false },

    // ============================================
    // 📁 FILE & PDF TOOLS (১৫টি)
    // ============================================
    'pdf-compressor': { name: 'PDF Compressor', icon: '📄', category: 'file-tools', description: 'Compress PDF files', demand: 5, popular: true },
    'pdf-merger': { name: 'PDF Merger', icon: '📄', category: 'file-tools', description: 'Merge PDF files', demand: 5, popular: true },
    'pdf-splitter': { name: 'PDF Splitter', icon: '✂️', category: 'file-tools', description: 'Split PDF files', demand: 4, popular: false },
    'pdf-to-word': { name: 'PDF to Word', icon: '📄', category: 'file-tools', description: 'Convert PDF to Word', demand: 5, popular: true },
    'word-to-pdf': { name: 'Word to PDF', icon: '📄', category: 'file-tools', description: 'Convert Word to PDF', demand: 5, popular: true },
    'image-to-pdf': { name: 'Image to PDF', icon: '🖼️', category: 'file-tools', description: 'Convert images to PDF', demand: 4, popular: false },
    'zip-creator': { name: 'ZIP File Creator', icon: '🗜️', category: 'file-tools', description: 'Create ZIP files', demand: 4, popular: false },
    'zip-extractor': { name: 'ZIP File Extractor', icon: '📦', category: 'file-tools', description: 'Extract ZIP files', demand: 4, popular: false },
    'pdf-to-excel': { name: 'PDF to Excel', icon: '📊', category: 'file-tools', description: 'Convert PDF to Excel', demand: 3, popular: false },
    'file-converter': { name: 'File Converter', icon: '🔄', category: 'file-tools', description: 'Convert file formats', demand: 4, popular: false },
    'pdf-editor': { name: 'PDF Editor', icon: '✏️', category: 'file-tools', description: 'Edit PDF files', demand: 4, popular: false },
    'pdf-to-image': { name: 'PDF to Image', icon: '🖼️', category: 'file-tools', description: 'Convert PDF to images', demand: 3, popular: false },
    'excel-to-pdf': { name: 'Excel to PDF', icon: '📊', category: 'file-tools', description: 'Convert Excel to PDF', demand: 3, popular: false },
    'file-encryptor': { name: 'File Encryptor', icon: '🔐', category: 'file-tools', description: 'Encrypt files', demand: 3, popular: false },
    'pdf-unlocker': { name: 'PDF Unlocker', icon: '🔓', category: 'file-tools', description: 'Unlock PDF files', demand: 3, popular: false },

    // ============================================
    // 📱 SOCIAL MEDIA TOOLS (১৫টি)
    // ============================================
    'instagram-downloader': { name: 'Instagram Downloader', icon: '📸', category: 'social-media-tools', description: 'Download Instagram content', demand: 5, popular: true },
    'tiktok-downloader': { name: 'TikTok Downloader', icon: '🎵', category: 'social-media-tools', description: 'Download TikTok videos', demand: 5, popular: true },
    'youtube-thumbnail': { name: 'YouTube Thumbnail Downloader', icon: '🖼️', category: 'social-media-tools', description: 'Download YouTube thumbnails', demand: 5, popular: true },
    'facebook-video-downloader': { name: 'Facebook Video Downloader', icon: '📹', category: 'social-media-tools', description: 'Download Facebook videos', demand: 4, popular: false },
    'youtube-tag-generator': { name: 'YouTube Tag Generator', icon: '🏷️', category: 'social-media-tools', description: 'Generate YouTube tags', demand: 4, popular: false },
    'youtube-title-generator': { name: 'YouTube Title Generator', icon: '📝', category: 'social-media-tools', description: 'Generate YouTube titles', demand: 4, popular: false },
    'whatsapp-link-generator': { name: 'WhatsApp Link Generator', icon: '💬', category: 'social-media-tools', description: 'Generate WhatsApp links', demand: 4, popular: false },
    'twitter-downloader': { name: 'Twitter Video Downloader', icon: '🐦', category: 'social-media-tools', description: 'Download Twitter videos', demand: 3, popular: false },
    'hashtag-generator': { name: 'Hashtag Generator', icon: '#️⃣', category: 'social-media-tools', description: 'Generate hashtags', demand: 4, popular: false },
    'social-media-scheduler': { name: 'Social Media Scheduler', icon: '📅', category: 'social-media-tools', description: 'Schedule social media posts', demand: 3, popular: false },
    'instagram-caption-generator': { name: 'Instagram Caption Generator', icon: '📝', category: 'social-media-tools', description: 'Generate Instagram captions', demand: 3, popular: false },
    'youtube-description-generator': { name: 'YouTube Description Generator', icon: '📝', category: 'social-media-tools', description: 'Generate YouTube descriptions', demand: 3, popular: false },
    'pinterest-downloader': { name: 'Pinterest Downloader', icon: '📌', category: 'social-media-tools', description: 'Download Pinterest content', demand: 3, popular: false },
    'linkedin-post-generator': { name: 'LinkedIn Post Generator', icon: '💼', category: 'social-media-tools', description: 'Generate LinkedIn posts', demand: 2, popular: false },
    'social-media-analyzer': { name: 'Social Media Analyzer', icon: '📊', category: 'social-media-tools', description: 'Analyze social media', demand: 2, popular: false },

    // ============================================
    // 💼 BUSINESS TOOLS (১৫টি)
    // ============================================
    'resume-builder': { name: 'Resume Builder', icon: '📄', category: 'business-tools', description: 'Build professional resumes', demand: 5, popular: true },
    'invoice-generator': { name: 'Invoice Generator', icon: '🧾', category: 'business-tools', description: 'Generate invoices', demand: 5, popular: true },
    'business-card': { name: 'Business Card Generator', icon: '💳', category: 'business-tools', description: 'Generate business cards', demand: 4, popular: false },
    'cv-maker': { name: 'CV Maker', icon: '📄', category: 'business-tools', description: 'Create CVs', demand: 4, popular: false },
    'cover-letter': { name: 'Cover Letter Generator', icon: '📝', category: 'business-tools', description: 'Generate cover letters', demand: 4, popular: false },
    'logo-generator': { name: 'Logo Generator', icon: '🎨', category: 'business-tools', description: 'Generate logos', demand: 4, popular: false },
    'certificate-generator': { name: 'Certificate Generator', icon: '📜', category: 'business-tools', description: 'Generate certificates', demand: 3, popular: false },
    'business-name': { name: 'Business Name Generator', icon: '💡', category: 'business-tools', description: 'Generate business names', demand: 3, popular: false },
    'receipt-generator': { name: 'Receipt Generator', icon: '🧾', category: 'business-tools', description: 'Generate receipts', demand: 3, popular: false },
    'meeting-scheduler': { name: 'Meeting Scheduler', icon: '📅', category: 'business-tools', description: 'Schedule meetings', demand: 3, popular: false },
    'budget-planner': { name: 'Budget Planner', icon: '💰', category: 'business-tools', description: 'Plan budgets', demand: 3, popular: false },
    'expense-tracker': { name: 'Expense Tracker', icon: '💸', category: 'business-tools', description: 'Track expenses', demand: 3, popular: false },
    'project-planner': { name: 'Project Planner', icon: '📋', category: 'business-tools', description: 'Plan projects', demand: 3, popular: false },
    'time-tracker': { name: 'Time Tracker', icon: '⏱️', category: 'business-tools', description: 'Track time', demand: 3, popular: false },
    'goal-tracker': { name: 'Goal Tracker', icon: '🎯', category: 'business-tools', description: 'Track goals', demand: 2, popular: false },

    // ============================================
    // 🎨 DESIGN TOOLS (১০টি)
    // ============================================
    'gradient-generator': { name: 'Gradient Generator', icon: '🌈', category: 'design-tools', description: 'Generate gradients', demand: 4, popular: true },
    'color-palette': { name: 'Color Palette Generator', icon: '🎨', category: 'design-tools', description: 'Generate color palettes', demand: 4, popular: false },
    'avatar-generator': { name: 'Avatar Generator', icon: '👤', category: 'design-tools', description: 'Generate avatars', demand: 3, popular: false },
    'favicon-maker': { name: 'Favicon Maker', icon: '🔖', category: 'design-tools', description: 'Make favicons', demand: 3, popular: false },
    'meme-creator': { name: 'Meme Creator', icon: '😂', category: 'design-tools', description: 'Create memes', demand: 4, popular: false },
    'wallpaper-generator': { name: 'Wallpaper Generator', icon: '🖼️', category: 'design-tools', description: 'Generate wallpapers', demand: 3, popular: false },
    'icon-generator': { name: 'Icon Generator', icon: '🔣', category: 'design-tools', description: 'Generate icons', demand: 3, popular: false },
    'font-pairing': { name: 'Font Pairing Tool', icon: '🔤', category: 'design-tools', description: 'Pair fonts', demand: 3, popular: false },
    'banner-generator': { name: 'Banner Generator', icon: '🏳️', category: 'design-tools', description: 'Generate banners', demand: 3, popular: false },
    'thumbnail-generator': { name: 'Thumbnail Generator', icon: '🖼️', category: 'design-tools', description: 'Generate thumbnails', demand: 3, popular: false },

    // ============================================
    // 💰 CRYPTO TOOLS (১০টি)
    // ============================================
    'bitcoin-converter': { name: 'Bitcoin Converter', icon: '₿', category: 'crypto-tools', description: 'Convert Bitcoin', demand: 4, popular: false },
    'crypto-price': { name: 'Crypto Price Tracker', icon: '📈', category: 'crypto-tools', description: 'Track crypto prices', demand: 4, popular: false },
    'profit-calculator': { name: 'Crypto Profit Calculator', icon: '💰', category: 'crypto-tools', description: 'Calculate crypto profits', demand: 3, popular: false },
    'roi-calculator': { name: 'ROI Calculator', icon: '📊', category: 'crypto-tools', description: 'Calculate ROI', demand: 3, popular: false },
    'portfolio-tracker': { name: 'Portfolio Tracker', icon: '💼', category: 'crypto-tools', description: 'Track portfolio', demand: 3, popular: false },
    'staking-calculator': { name: 'Staking Calculator', icon: '💰', category: 'crypto-tools', description: 'Calculate staking rewards', demand: 2, popular: false },
    'mining-calculator': { name: 'Mining Calculator', icon: '⛏️', category: 'crypto-tools', description: 'Calculate mining profits', demand: 2, popular: false },
    'gas-fee-calculator': { name: 'Gas Fee Calculator', icon: '⛽', category: 'crypto-tools', description: 'Calculate gas fees', demand: 2, popular: false },
    'crypto-tax-calculator': { name: 'Crypto Tax Calculator', icon: '📋', category: 'crypto-tools', description: 'Calculate crypto taxes', demand: 3, popular: false },
    'wallet-generator': { name: 'Wallet Generator', icon: '👛', category: 'crypto-tools', description: 'Generate crypto wallets', demand: 2, popular: false },

    // ============================================
    // 🏥 HEALTH TOOLS (১৫টি)
    // ============================================
    'water-intake-calculator': { name: 'Water Intake Calculator', icon: '💧', category: 'health-tools', description: 'Calculate water intake', demand: 4, popular: false },
    'protein-calculator': { name: 'Protein Intake Calculator', icon: '🥩', category: 'health-tools', description: 'Calculate protein needs', demand: 4, popular: false },
    'bmr-calculator': { name: 'BMR Calculator', icon: '🔥', category: 'health-tools', description: 'Calculate BMR', demand: 4, popular: false },
    'tdee-calculator': { name: 'TDEE Calculator', icon: '⚡', category: 'health-tools', description: 'Calculate TDEE', demand: 4, popular: false },
    'macro-calculator': { name: 'Macro Calculator', icon: '🥗', category: 'health-tools', description: 'Calculate macros', demand: 4, popular: false },
    'body-fat-percentage': { name: 'Body Fat Calculator', icon: '⚖️', category: 'health-tools', description: 'Calculate body fat', demand: 4, popular: false },
    'ideal-weight-calculator': { name: 'Ideal Weight Calculator', icon: '⚖️', category: 'health-tools', description: 'Calculate ideal weight', demand: 3, popular: false },
    'pregnancy-due-date': { name: 'Pregnancy Due Date Calculator', icon: '🤰', category: 'health-tools', description: 'Calculate due date', demand: 3, popular: false },
    'blood-pressure-checker': { name: 'Blood Pressure Checker', icon: '🩺', category: 'health-tools', description: 'Check blood pressure', demand: 4, popular: false },
    'heart-rate-calculator': { name: 'Heart Rate Calculator', icon: '❤️', category: 'health-tools', description: 'Calculate heart rate', demand: 3, popular: false },
    'sleep-calculator': { name: 'Sleep Cycle Calculator', icon: '😴', category: 'health-tools', description: 'Calculate sleep cycles', demand: 4, popular: false },
    'steps-to-km': { name: 'Steps to KM Converter', icon: '🚶', category: 'health-tools', description: 'Convert steps to km', demand: 3, popular: false },
    'bmi-children': { name: 'Children BMI Calculator', icon: '👶', category: 'health-tools', description: 'Calculate children BMI', demand: 2, popular: false },
    'diet-planner': { name: 'Diet Plan Generator', icon: '🥗', category: 'health-tools', description: 'Generate diet plans', demand: 3, popular: false },
    'workout-planner': { name: 'Workout Plan Generator', icon: '💪', category: 'health-tools', description: 'Generate workout plans', demand: 3, popular: false },

    // ============================================
    // 🎓 EDUCATION TOOLS (১৫টি)
    // ============================================
    'grade-calculator': { name: 'Grade Calculator', icon: '📊', category: 'education-tools', description: 'Calculate grades', demand: 4, popular: false },
    'gpa-calculator': { name: 'GPA Calculator', icon: '🎓', category: 'education-tools', description: 'Calculate GPA', demand: 4, popular: true },
    'cgpa-calculator': { name: 'CGPA Calculator', icon: '🎓', category: 'education-tools', description: 'Calculate CGPA', demand: 4, popular: false },
    'final-grade-calculator': { name: 'Final Grade Calculator', icon: '📝', category: 'education-tools', description: 'Calculate final grade', demand: 3, popular: false },
    'attendance-calculator': { name: 'Attendance Calculator', icon: '📋', category: 'education-tools', description: 'Calculate attendance', demand: 3, popular: false },
    'study-timer': { name: 'Study Timer', icon: '⏱️', category: 'education-tools', description: 'Study timer (Pomodoro)', demand: 4, popular: false },
    'flashcard-generator': { name: 'Flashcard Generator', icon: '🃏', category: 'education-tools', description: 'Generate flashcards', demand: 3, popular: false },
    'quiz-maker': { name: 'Quiz Maker', icon: '❓', category: 'education-tools', description: 'Create quizzes', demand: 3, popular: false },
    'exam-countdown': { name: 'Exam Countdown Timer', icon: '⏳', category: 'education-tools', description: 'Countdown to exams', demand: 3, popular: false },
    'citation-generator': { name: 'Citation Generator', icon: '📚', category: 'education-tools', description: 'Generate citations', demand: 3, popular: false },
    'bibliography-generator': { name: 'Bibliography Generator', icon: '📚', category: 'education-tools', description: 'Generate bibliography', demand: 2, popular: false },
    'plagiarism-checker': { name: 'Plagiarism Checker', icon: '🔍', category: 'education-tools', description: 'Check plagiarism', demand: 4, popular: false },
    'essay-word-counter': { name: 'Essay Word Counter', icon: '📝', category: 'education-tools', description: 'Count essay words', demand: 2, popular: false },
    'reading-level-checker': { name: 'Reading Level Checker', icon: '📖', category: 'education-tools', description: 'Check reading level', demand: 2, popular: false },
    'homework-planner': { name: 'Homework Planner', icon: '📋', category: 'education-tools', description: 'Plan homework', demand: 2, popular: false },

    // ============================================
    // 💝 LIFESTYLE TOOLS (১০টি)
    // ============================================
    'love-calculator': { name: 'Love Calculator', icon: '❤️', category: 'lifestyle-tools', description: 'Calculate love compatibility', demand: 4, popular: true },
    'zodiac-compatibility': { name: 'Zodiac Compatibility', icon: '⭐', category: 'lifestyle-tools', description: 'Check zodiac compatibility', demand: 4, popular: false },
    'baby-name-generator': { name: 'Baby Name Generator', icon: '👶', category: 'lifestyle-tools', description: 'Generate baby names', demand: 4, popular: false },
    'pet-name-generator': { name: 'Pet Name Generator', icon: '🐾', category: 'lifestyle-tools', description: 'Generate pet names', demand: 3, popular: false },
    'wedding-date-calculator': { name: 'Wedding Date Calculator', icon: '💍', category: 'lifestyle-tools', description: 'Calculate wedding date', demand: 3, popular: false },
    'anniversary-calculator': { name: 'Anniversary Calculator', icon: '🎉', category: 'lifestyle-tools', description: 'Calculate anniversaries', demand: 3, popular: false },
    'chinese-zodiac': { name: 'Chinese Zodiac Finder', icon: '🐉', category: 'lifestyle-tools', description: 'Find Chinese zodiac', demand: 3, popular: false },
    'numerology-calculator': { name: 'Numerology Calculator', icon: '🔢', category: 'lifestyle-tools', description: 'Calculate numerology', demand: 3, popular: false },
    'love-letter-generator': { name: 'Love Letter Generator', icon: '💌', category: 'lifestyle-tools', description: 'Generate love letters', demand: 3, popular: false },
    'breakup-recovery': { name: 'Breakup Recovery Calculator', icon: '💔', category: 'lifestyle-tools', description: 'Calculate recovery time', demand: 2, popular: false },

    // ============================================
    // 🌦️ WEATHER TOOLS (১০টি)
    // ============================================
    'weather-forecast': { name: 'Weather Forecast', icon: '🌤️', category: 'weather-tools', description: 'Weather forecast tool', demand: 5, popular: true },
    'sunrise-sunset': { name: 'Sunrise Sunset Calculator', icon: '🌅', category: 'weather-tools', description: 'Calculate sunrise/sunset', demand: 4, popular: false },
    'moon-phase': { name: 'Moon Phase Calculator', icon: '🌙', category: 'weather-tools', description: 'Calculate moon phases', demand: 4, popular: false },
    'uv-index': { name: 'UV Index Checker', icon: '☀️', category: 'weather-tools', description: 'Check UV index', demand: 3, popular: false },
    'air-quality-index': { name: 'Air Quality Index', icon: '🌫️', category: 'weather-tools', description: 'Check air quality', demand: 4, popular: false },
    'humidity-calculator': { name: 'Humidity Calculator', icon: '💧', category: 'weather-tools', description: 'Calculate humidity', demand: 3, popular: false },
    'wind-chill': { name: 'Wind Chill Calculator', icon: '🌬️', category: 'weather-tools', description: 'Calculate wind chill', demand: 3, popular: false },
    'heat-index': { name: 'Heat Index Calculator', icon: '🌡️', category: 'weather-tools', description: 'Calculate heat index', demand: 2, popular: false },
    'dew-point': { name: 'Dew Point Calculator', icon: '💧', category: 'weather-tools', description: 'Calculate dew point', demand: 2, popular: false },
    'pollen-count': { name: 'Pollen Count Checker', icon: '🌸', category: 'weather-tools', description: 'Check pollen count', demand: 2, popular: false },

    // ============================================
    // 🎮 GAMING TOOLS (১৫টি)
    // ============================================
    'random-game-generator': { name: 'Random Game Generator', icon: '🎮', category: 'gaming-tools', description: 'Generate random games', demand: 4, popular: false },
    'minecraft-seed': { name: 'Minecraft Seed Generator', icon: '⛏️', category: 'gaming-tools', description: 'Generate Minecraft seeds', demand: 4, popular: false },
    'roblox-name-generator': { name: 'Roblox Name Generator', icon: '🎮', category: 'gaming-tools', description: 'Generate Roblox names', demand: 4, popular: false },
    'gamertag-generator': { name: 'Gamertag Generator', icon: '🎯', category: 'gaming-tools', description: 'Generate gamertags', demand: 4, popular: false },
    'dice-roller': { name: 'Dice Roller', icon: '🎲', category: 'gaming-tools', description: 'Roll dice', demand: 3, popular: false },
    'random-picker': { name: 'Random Picker Wheel', icon: '🎡', category: 'gaming-tools', description: 'Random picker wheel', demand: 4, popular: false },
    'coin-flip': { name: 'Coin Flip Simulator', icon: '🪙', category: 'gaming-tools', description: 'Flip coins', demand: 3, popular: false },
    'card-deck-shuffler': { name: 'Card Deck Shuffler', icon: '🃏', category: 'gaming-tools', description: 'Shuffle cards', demand: 2, popular: false },
    'lottery-number-generator': { name: 'Lottery Number Generator', icon: '🎰', category: 'gaming-tools', description: 'Generate lottery numbers', demand: 3, popular: false },
    'pubg-name-generator': { name: 'PUBG Name Generator', icon: '🔫', category: 'gaming-tools', description: 'Generate PUBG names', demand: 3, popular: false },
    'fortnite-name-generator': { name: 'Fortnite Name Generator', icon: '🎮', category: 'gaming-tools', description: 'Generate Fortnite names', demand: 2, popular: false },
    'pokemon-generator': { name: 'Pokemon Generator', icon: '🐉', category: 'gaming-tools', description: 'Generate Pokemon', demand: 3, popular: false },
    'dnd-character': { name: 'D&D Character Generator', icon: '🐲', category: 'gaming-tools', description: 'Generate D&D characters', demand: 2, popular: false },
    'word-search-puzzle': { name: 'Word Search Puzzle Maker', icon: '🔍', category: 'gaming-tools', description: 'Make word search puzzles', demand: 2, popular: false },
    'crossword-puzzle': { name: 'Crossword Puzzle Maker', icon: '📝', category: 'gaming-tools', description: 'Make crossword puzzles', demand: 2, popular: false },

    // ============================================
    // 🏠 REAL ESTATE TOOLS (১০টি)
    // ============================================
    'mortgage-calculator': { name: 'Mortgage Calculator', icon: '🏠', category: 'real-estate-tools', description: 'Calculate mortgage', demand: 5, popular: true },
    'rent-calculator': { name: 'Rent Affordability Calculator', icon: '💰', category: 'real-estate-tools', description: 'Calculate rent affordability', demand: 4, popular: false },
    'property-tax-calculator': { name: 'Property Tax Calculator', icon: '📋', category: 'real-estate-tools', description: 'Calculate property tax', demand: 3, popular: false },
    'square-footage': { name: 'Square Footage Calculator', icon: '📐', category: 'real-estate-tools', description: 'Calculate square footage', demand: 4, popular: false },
    'paint-calculator': { name: 'Paint Calculator', icon: '🎨', category: 'real-estate-tools', description: 'Calculate paint needed', demand: 3, popular: false },
    'flooring-calculator': { name: 'Flooring Calculator', icon: '📏', category: 'real-estate-tools', description: 'Calculate flooring', demand: 3, popular: false },
    'concrete-calculator': { name: 'Concrete Calculator', icon: '🧱', category: 'real-estate-tools', description: 'Calculate concrete', demand: 3, popular: false },
    'moving-cost': { name: 'Moving Cost Calculator', icon: '🚚', category: 'real-estate-tools', description: 'Calculate moving costs', demand: 3, popular: false },
    'home-value': { name: 'Home Value Estimator', icon: '🏠', category: 'real-estate-tools', description: 'Estimate home value', demand: 3, popular: false },
    'renovation-cost': { name: 'Renovation Cost Calculator', icon: '🔨', category: 'real-estate-tools', description: 'Calculate renovation costs', demand: 3, popular: false },

    // ============================================
    // 🚗 TRAVEL TOOLS (১৫টি)
    // ============================================
    'fuel-cost-calculator': { name: 'Fuel Cost Calculator', icon: '⛽', category: 'travel-tools', description: 'Calculate fuel costs', demand: 4, popular: false },
    'mpg-calculator': { name: 'MPG Calculator', icon: '🚗', category: 'travel-tools', description: 'Calculate MPG', demand: 4, popular: false },
    'car-loan-calculator': { name: 'Car Loan Calculator', icon: '🚗', category: 'travel-tools', description: 'Calculate car loans', demand: 4, popular: false },
    'tire-size-calculator': { name: 'Tire Size Calculator', icon: '🛞', category: 'travel-tools', description: 'Calculate tire size', demand: 3, popular: false },
    'currency-converter-travel': { name: 'Travel Currency Converter', icon: '💱', category: 'travel-tools', description: 'Convert travel currency', demand: 4, popular: false },
    'time-zone-travel': { name: 'Travel Time Zone Converter', icon: '🌍', category: 'travel-tools', description: 'Convert travel time zones', demand: 3, popular: false },
    'packing-list': { name: 'Packing List Generator', icon: '🧳', category: 'travel-tools', description: 'Generate packing lists', demand: 3, popular: false },
    'flight-distance': { name: 'Flight Distance Calculator', icon: '✈️', category: 'travel-tools', description: 'Calculate flight distances', demand: 3, popular: false },
    'road-trip-planner': { name: 'Road Trip Planner', icon: '🛣️', category: 'travel-tools', description: 'Plan road trips', demand: 3, popular: false },
    'toll-calculator': { name: 'Toll Calculator', icon: '💰', category: 'travel-tools', description: 'Calculate tolls', demand: 2, popular: false },
    'parking-fee-calculator': { name: 'Parking Fee Calculator', icon: '🅿️', category: 'travel-tools', description: 'Calculate parking fees', demand: 2, popular: false },
    'speed-distance-time': { name: 'Speed Distance Time Calculator', icon: '⏱️', category: 'travel-tools', description: 'Calculate speed/distance/time', demand: 3, popular: false },
    'gas-mileage-tracker': { name: 'Gas Mileage Tracker', icon: '📊', category: 'travel-tools', description: 'Track gas mileage', demand: 2, popular: false },
    'car-depreciation': { name: 'Car Depreciation Calculator', icon: '📉', category: 'travel-tools', description: 'Calculate car depreciation', demand: 2, popular: false },
    'ev-charging-calculator': { name: 'EV Charging Calculator', icon: '🔌', category: 'travel-tools', description: 'Calculate EV charging', demand: 2, popular: false },

    // ============================================
    // 🎵 MUSIC TOOLS (১০টি)
    // ============================================
    'bpm-finder': { name: 'BPM Finder', icon: '🎵', category: 'music-tools', description: 'Find BPM', demand: 4, popular: false },
    'song-key-finder': { name: 'Song Key Finder', icon: '🎹', category: 'music-tools', description: 'Find song keys', demand: 4, popular: false },
    'metronome': { name: 'Online Metronome', icon: '⏱️', category: 'music-tools', description: 'Online metronome', demand: 4, popular: false },
    'guitar-tuner': { name: 'Online Guitar Tuner', icon: '🎸', category: 'music-tools', description: 'Tune guitar online', demand: 4, popular: false },
    'chord-finder': { name: 'Chord Finder', icon: '🎼', category: 'music-tools', description: 'Find chords', demand: 3, popular: false },
    'lyrics-generator': { name: 'Lyrics Generator', icon: '📝', category: 'music-tools', description: 'Generate lyrics', demand: 3, popular: false },
    'rap-name-generator': { name: 'Rap Name Generator', icon: '🎤', category: 'music-tools', description: 'Generate rap names', demand: 2, popular: false },
    'band-name-generator': { name: 'Band Name Generator', icon: '🎸', category: 'music-tools', description: 'Generate band names', demand: 2, popular: false },
    'audio-converter': { name: 'Audio Converter', icon: '🔄', category: 'music-tools', description: 'Convert audio', demand: 4, popular: false },
    'ringtone-maker': { name: 'Ringtone Maker', icon: '📱', category: 'music-tools', description: 'Make ringtones', demand: 2, popular: false },

    // ============================================
    // 📊 BUSINESS ANALYTICS (১০টি)
    // ============================================
    'break-even-calculator': { name: 'Break-Even Calculator', icon: '📊', category: 'analytics-tools', description: 'Calculate break-even point', demand: 4, popular: false },
    'profit-margin-calculator': { name: 'Profit Margin Calculator', icon: '💰', category: 'analytics-tools', description: 'Calculate profit margins', demand: 4, popular: false },
    'markup-calculator': { name: 'Markup Calculator', icon: '📈', category: 'analytics-tools', description: 'Calculate markup', demand: 3, popular: false },
    'sales-tax-calculator': { name: 'Sales Tax Calculator', icon: '📋', category: 'analytics-tools', description: 'Calculate sales tax', demand: 4, popular: false },
    'roi-calculator-business': { name: 'Business ROI Calculator', icon: '📊', category: 'analytics-tools', description: 'Calculate business ROI', demand: 3, popular: false },
    'customer-lifetime-value': { name: 'Customer Lifetime Value', icon: '👥', category: 'analytics-tools', description: 'Calculate CLV', demand: 3, popular: false },
    'conversion-rate': { name: 'Conversion Rate Calculator', icon: '📈', category: 'analytics-tools', description: 'Calculate conversion rates', demand: 3, popular: false },
    'churn-rate': { name: 'Churn Rate Calculator', icon: '📉', category: 'analytics-tools', description: 'Calculate churn rate', demand: 2, popular: false },
    'employee-cost': { name: 'Employee Cost Calculator', icon: '👥', category: 'analytics-tools', description: 'Calculate employee costs', demand: 2, popular: false },
    'inventory-turnover': { name: 'Inventory Turnover Calculator', icon: '📦', category: 'analytics-tools', description: 'Calculate inventory turnover', demand: 2, popular: false }
};

// ============================================
// ক্যাটাগরি ডেটা
// ============================================
const categoriesDatabase = [
    { slug: 'text-tools', name: 'Text & Writing', icon: '📝', description: 'Text processing and writing tools', toolCount: 20 },
    { slug: 'developer-tools', name: 'Developer Tools', icon: '💻', description: 'Coding and development tools', toolCount: 25 },
    { slug: 'security-tools', name: 'Security & Privacy', icon: '🔐', description: 'Security and privacy tools', toolCount: 15 },
    { slug: 'converter-tools', name: 'Converter Tools', icon: '📱', description: 'Format conversion tools', toolCount: 20 },
    { slug: 'calculator-tools', name: 'Calculator & Finance', icon: '🧮', description: 'Financial calculators', toolCount: 20 },
    { slug: 'image-tools', name: 'Image & Design', icon: '🖼️', description: 'Image processing tools', toolCount: 15 },
    { slug: 'multimedia-tools', name: 'Video & Multimedia', icon: '🎥', description: 'Video and multimedia tools', toolCount: 15 },
    { slug: 'seo-tools', name: 'SEO & Marketing', icon: '🌐', description: 'SEO and marketing tools', toolCount: 15 },
    { slug: 'file-tools', name: 'File & PDF', icon: '📁', description: 'File and PDF tools', toolCount: 15 },
    { slug: 'social-media-tools', name: 'Social Media', icon: '📱', description: 'Social media tools', toolCount: 15 },
    { slug: 'business-tools', name: 'Business & Productivity', icon: '💼', description: 'Business tools', toolCount: 15 },
    { slug: 'design-tools', name: 'Design & Creative', icon: '🎨', description: 'Design tools', toolCount: 10 },
    { slug: 'crypto-tools', name: 'Crypto & Finance', icon: '💰', description: 'Cryptocurrency tools', toolCount: 10 },
    { slug: 'health-tools', name: 'Health & Fitness', icon: '🏥', description: 'Health and fitness tools', toolCount: 15 },
    { slug: 'education-tools', name: 'Education & Learning', icon: '🎓', description: 'Education tools', toolCount: 15 },
    { slug: 'lifestyle-tools', name: 'Relationship & Lifestyle', icon: '💝', description: 'Lifestyle tools', toolCount: 10 },
    { slug: 'weather-tools', name: 'Weather & Environment', icon: '🌦️', description: 'Weather tools', toolCount: 10 },
    { slug: 'gaming-tools', name: 'Gaming & Entertainment', icon: '🎮', description: 'Gaming tools', toolCount: 15 },
    { slug: 'real-estate-tools', name: 'Home & Real Estate', icon: '🏠', description: 'Real estate tools', toolCount: 10 },
    { slug: 'travel-tools', name: 'Automotive & Travel', icon: '🚗', description: 'Travel tools', toolCount: 15 },
    { slug: 'music-tools', name: 'Music & Audio', icon: '🎵', description: 'Music tools', toolCount: 10 },
    { slug: 'analytics-tools', name: 'Business Analytics', icon: '📊', description: 'Business analytics tools', toolCount: 10 }
];

// ============================================
// হেল্পার ফাংশন
// ============================================
function getAllTools() {
    return Object.entries(toolsDatabase).map(([slug, tool]) => ({
        slug,
        ...tool
    }));
}

function getToolsByCategory(category) {
    return getAllTools().filter(tool => tool.category === category);
}

function getToolBySlug(slug) {
    return toolsDatabase[slug] || null;
}

function getPopularTools(limit = 10) {
    return getAllTools()
        .filter(tool => tool.popular)
        .sort((a, b) => b.demand - a.demand)
        .slice(0, limit);
}

function searchTools(query) {
    const searchTerm = query.toLowerCase();
    return getAllTools().filter(tool => 
        tool.name.toLowerCase().includes(searchTerm) ||
        tool.description.toLowerCase().includes(searchTerm) ||
        tool.category.includes(searchTerm)
    );
}
