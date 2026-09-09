<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Toolkit Pro - টুল</title>
    <meta name="description" content="Toolkit Pro-তে ৬০০+ ফ্রি অনলাইন টুল ব্যবহার করুন। আপনার প্রয়োজনীয় টুলটি এখনই খুঁজুন।">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="#0ea5e9">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Google Fonts (Inter) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <!-- Font Awesome Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <style>
        * { font-family: 'Inter', sans-serif; }
        body { background-color: #f8fafc; }
        .bg-gradient-primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .text-gradient { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 0.5s ease-out; }
        .tool-card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
        .tool-card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
        .result-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.5rem; padding: 1rem; min-height: 100px; }
        .copy-btn { cursor: pointer; transition: all 0.3s ease; }
        .copy-btn:hover { background: #e2e8f0; }
        .loading-spinner { border: 3px solid #f3f3f3; border-top: 3px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .debug-info { background: #fef3c7; border: 1px solid #f59e0b; border-radius: 0.5rem; padding: 0.5rem; margin-top: 0.5rem; font-size: 0.75rem; color: #92400e; }
    </style>
</head>
<body class="antialiased">

    <!-- ========================================== -->
    <!-- নেভিগেশন বার -->
    <!-- ========================================== -->
    <nav class="bg-white shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
                <a href="/" class="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition">
                    <span class="text-3xl">🧰</span>
                    <span>Toolkit <span class="text-blue-600">Pro</span></span>
                </a>
                <div class="hidden md:flex items-center gap-6">
                    <a href="/" class="text-gray-700 hover:text-blue-600 font-medium transition">হোম</a>
                    <a href="/tools.html" class="text-gray-700 hover:text-blue-600 font-medium transition">সব টুলস</a>
                    <a href="/categories.html" class="text-gray-700 hover:text-blue-600 font-medium transition">ক্যাটাগরি</a>
                    <a href="/about.html" class="text-gray-700 hover:text-blue-600 font-medium transition">আমাদের সম্পর্কে</a>
                </div>
                <button id="mobileMenuBtn" class="md:hidden text-gray-700 hover:text-blue-600 text-2xl">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
        </div>
        <div id="mobileMenu" class="hidden md:hidden bg-white border-t border-gray-200">
            <a href="/" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">হোম</a>
            <a href="/tools.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">সব টুলস</a>
            <a href="/categories.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">ক্যাটাগরি</a>
            <a href="/about.html" class="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium">আমাদের সম্পর্কে</a>
        </div>
    </nav>

    <!-- ========================================== -->
    <!-- মূল কন্টেন্ট -->
    <!-- ========================================== -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <!-- লোডিং স্পিনার -->
        <div id="loadingSpinner" class="text-center py-20">
            <div class="loading-spinner mx-auto mb-4"></div>
            <p class="text-gray-600">টুল লোড হচ্ছে...</p>
            <p class="text-gray-400 text-sm mt-2" id="loadingStatus">API কল করা হচ্ছে...</p>
        </div>

        <!-- টুল কন্টেন্ট -->
        <div id="toolContent" class="hidden">
            <!-- ব্রেডক্রাম্ব -->
            <nav class="text-sm text-gray-500 mb-6">
                <a href="/" class="hover:text-blue-600 transition">হোম</a>
                <span class="mx-2">›</span>
                <a href="/tools.html" class="hover:text-blue-600 transition">সব টুলস</a>
                <span class="mx-2">›</span>
                <span id="breadcrumbCategory" class="text-gray-700 font-medium">ক্যাটাগরি</span>
                <span class="mx-2">›</span>
                <span id="breadcrumbTool" class="text-gray-900 font-semibold">টুল</span>
            </nav>

            <!-- টুল হেডার -->
            <div class="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up mb-8">
                <div class="bg-gradient-primary text-white p-8">
                    <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <span id="toolIcon" class="text-5xl bg-white/20 rounded-xl p-4">🔧</span>
                            <div>
                                <h1 id="toolName" class="text-3xl font-bold">টুল</h1>
                                <p id="toolDescription" class="text-white/80 mt-1">বিবরণ</p>
                            </div>
                        </div>
                        <div id="toolBadges" class="flex gap-2">
                            <!-- ব্যাজ এখানে -->
                        </div>
                    </div>
                </div>

                <!-- টুল মেটা -->
                <div class="px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center border-b border-gray-100">
                    <div>
                        <p class="text-2xl font-bold text-gray-900" id="usageCount">0</p>
                        <p class="text-xs text-gray-500 uppercase tracking-wider">ব্যবহার</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-gray-900" id="ratingValue">0.0</p>
                        <p class="text-xs text-gray-500 uppercase tracking-wider">রেটিং</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-gray-900" id="isFree">ফ্রি</p>
                        <p class="text-xs text-gray-500 uppercase tracking-wider">মূল্য</p>
                    </div>
                    <div>
                        <p class="text-2xl font-bold text-gray-900" id="isActive">সক্রিয়</p>
                        <p class="text-xs text-gray-500 uppercase tracking-wider">স্ট্যাটাস</p>
                    </div>
                </div>
            </div>

            <!-- টুল ফাংশনালিটি এরিয়া -->
            <div class="bg-white rounded-2xl shadow-lg p-6 md:p-8 animate-fade-in-up">
                <div id="toolFunctionality">
                    <!-- ডাইনামিক টুল ফাংশনালিটি এখানে লোড হবে -->
                </div>
            </div>

            <!-- সম্পর্কিত টুলস -->
            <div class="mt-12">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">সম্পর্কিত টুলস</h2>
                <div id="relatedTools" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- সম্পর্কিত টুলস -->
                </div>
            </div>
        </div>

        <!-- এরর মেসেজ -->
        <div id="errorMessage" class="hidden text-center py-20">
            <i class="fas fa-exclamation-triangle text-6xl text-gray-400 mb-4"></i>
            <h2 class="text-2xl font-bold text-gray-700">টুল খুঁজে পাওয়া যায়নি!</h2>
            <p class="text-gray-500 mt-2" id="errorDetails">দুঃখিত, আপনি যে টুলটি খুঁজছেন সেটি বিদ্যমান নেই বা সরিয়ে ফেলা হয়েছে।</p>
            <div class="debug-info max-w-md mx-auto mt-4 text-left" id="debugInfo"></div>
            <a href="/tools.html" class="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition">
                <i class="fas fa-tools mr-2"></i>সব টুল দেখুন
            </a>
        </div>
    </main>

    <!-- ========================================== -->
    <!-- ফুটার -->
    <!-- ========================================== -->
    <footer class="bg-white border-t border-gray-200 mt-12">
        <div class="max-w-7xl mx-auto px-4 py-6 text-center text-gray-600">
            <p>© ২০২৪ Toolkit Pro. সর্বস্বত্ব সংরক্ষিত।</p>
        </div>
    </footer>

    <script>
        // ============================================
        // গ্লোবাল কনফিগারেশন
        // ============================================
        const API_BASE_URL = window.location.origin;
        const DEBUG_MODE = true; // ডিবাগিং এর জন্য true রাখুন

        // ============================================
        // ডিবাগ লগিং
        // ============================================
        function debugLog(message, data = null) {
            if (DEBUG_MODE) {
                console.log(`[Toolkit Pro] ${message}`, data || '');
            }
        }

        function debugError(message, error = null) {
            if (DEBUG_MODE) {
                console.error(`[Toolkit Pro Error] ${message}`, error || '');
            }
        }

        // ============================================
        // মোবাইল মেনু টগল
        // ============================================
        document.getElementById('mobileMenuBtn').addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.toggle('hidden');
        });

        // ============================================
        // ইউটিলিটি ফাংশন
        // ============================================
        function getToolSlugFromUrl() {
            const params = new URLSearchParams(window.location.search);
            const slug = params.get('slug') || params.get('tool') || '';
            debugLog('URL থেকে স্লাগ:', slug);
            return slug;
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('কপি করা হয়েছে!', 'success');
            }).catch(() => {
                showToast('কপি করা যায়নি!', 'error');
            });
        }

        function showToast(message, type = 'success') {
            const toast = document.createElement('div');
            toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg text-white font-semibold z-50 ${
                type === 'success' ? 'bg-green-500' : 'bg-red-500'
            }`;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
        }

        function updateLoadingStatus(message) {
            const statusElement = document.getElementById('loadingStatus');
            if (statusElement) {
                statusElement.textContent = message;
            }
        }

        // ============================================
        // API কল ফাংশন
        // ============================================
        async function fetchToolFromAPI(slug) {
            const url = `${API_BASE_URL}/api/v1/tools/${slug}`;
            debugLog('API URL:', url);
            updateLoadingStatus('API কল করা হচ্ছে...');
            
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    credentials: 'same-origin'
                });
                
                debugLog('API Response Status:', response.status);
                debugLog('API Response OK:', response.ok);
                
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
                }
                
                const data = await response.json();
                debugLog('API Response Data:', data);
                
                if (!data.success) {
                    throw new Error(data.message || 'API returned unsuccessful response');
                }
                
                if (!data.data) {
                    throw new Error('API response missing data field');
                }
                
                return data.data;
                
            } catch (error) {
                debugError('API কল ব্যর্থ হয়েছে:', error);
                throw error;
            }
        }

        async function fetchRelatedTools(category, limit = 3) {
            const url = `${API_BASE_URL}/api/v1/tools?category=${encodeURIComponent(category)}&limit=${limit}`;
            debugLog('Related Tools API URL:', url);
            
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });
                
                debugLog('Related Tools Response Status:', response.status);
                
                if (!response.ok) {
                    throw new Error(`HTTP Error: ${response.status}`);
                }
                
                const data = await response.json();
                debugLog('Related Tools Data:', data);
                
                if (data.success && data.data) {
                    return data.data;
                }
                
                return [];
                
            } catch (error) {
                debugError('Related tools API কল ব্যর্থ:', error);
                return [];
            }
        }

        // ============================================
        // টুল ডেটা লোড করা (ফিক্সড ভার্সন)
        // ============================================
        async function loadTool(slug) {
            debugLog('টুল লোড করা হচ্ছে:', slug);
            updateLoadingStatus(`'${slug}' টুলটি লোড হচ্ছে...`);
            
            try {
                // API থেকে টুল ডেটা আনা
                const tool = await fetchToolFromAPI(slug);
                
                debugLog('টুল লোড সফল:', tool.name);
                updateLoadingStatus('টুল ডেটা লোড হয়েছে!');
                
                // পেজ আপডেট
                document.title = `Toolkit Pro - ${tool.name}`;
                document.getElementById('toolName').textContent = tool.name;
                document.getElementById('toolDescription').textContent = tool.description || 'কোনো বিবরণ নেই';
                document.getElementById('toolIcon').textContent = tool.icon || '🔧';
                document.getElementById('breadcrumbTool').textContent = tool.name;
                document.getElementById('breadcrumbCategory').textContent = tool.category_name || tool.category || 'সাধারণ';
                
                // ব্যাজ তৈরি
                const badgesContainer = document.getElementById('toolBadges');
                badgesContainer.innerHTML = '';
                
                if (tool.is_featured) {
                    const badge = document.createElement('span');
                    badge.className = 'bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold';
                    badge.textContent = '★ ফিচার্ড';
                    badgesContainer.appendChild(badge);
                }
                
                if (tool.is_popular) {
                    const badge = document.createElement('span');
                    badge.className = 'bg-green-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold';
                    badge.textContent = '🔥 জনপ্রিয়';
                    badgesContainer.appendChild(badge);
                }
                
                if (tool.is_new) {
                    const badge = document.createElement('span');
                    badge.className = 'bg-blue-400 text-white px-3 py-1 rounded-full text-xs font-bold';
                    badge.textContent = 'নতুন';
                    badgesContainer.appendChild(badge);
                }
                
                // মেটা তথ্য আপডেট
                document.getElementById('usageCount').textContent = tool.usage_count || 0;
                document.getElementById('ratingValue').textContent = (tool.rating || 0).toFixed(1);
                document.getElementById('isFree').textContent = tool.is_free !== false ? 'ফ্রি' : 'প্রিমিয়াম';
                document.getElementById('isActive').textContent = tool.is_active !== false ? 'সক্রিয়' : 'নিষ্ক্রিয়';
                
                // ফাংশনালিটি লোড
                loadToolFunctionality(tool);
                
                // সম্পর্কিত টুলস লোড
                await loadRelatedTools(tool.category);
                
                // লোডিং স্পিনার হাইড এবং কন্টেন্ট দেখান
                document.getElementById('loadingSpinner').classList.add('hidden');
                document.getElementById('toolContent').classList.remove('hidden');
                
                debugLog('টুল সম্পূর্ণ লোড হয়েছে:', tool.name);
                
            } catch (error) {
                debugError('টুল লোড করতে ব্যর্থ:', error);
                
                // এরর মেসেজ দেখান
                document.getElementById('loadingSpinner').classList.add('hidden');
                document.getElementById('errorMessage').classList.remove('hidden');
                
                const errorDetails = document.getElementById('errorDetails');
                errorDetails.textContent = `ত্রুটি: ${error.message}`;
                
                // ডিবাগ তথ্য
                const debugInfo = document.getElementById('debugInfo');
                debugInfo.innerHTML = `
                    <strong>ডিবাগ তথ্য:</strong><br>
                    টুল স্লাগ: ${slug}<br>
                    API URL: ${API_BASE_URL}/api/v1/tools/${slug}<br>
                    এরর: ${error.message}<br>
                    সময়: ${new Date().toLocaleString()}
                `;
                
                // কনসোলে সম্পূর্ণ এরর
                console.error('সম্পূর্ণ এরর অবজেক্ট:', error);
            }
        }

        // ============================================
        // টুল ফাংশনালিটি সিস্টেম
        // ============================================
        function loadToolFunctionality(tool) {
            const container = document.getElementById('toolFunctionality');
            const slug = tool.slug;
            
            debugLog('ফাংশনালিটি লোড হচ্ছে:', slug);
            
            // টুল ক্যাটাগরি অনুযায়ী ফাংশনালিটি লোড
            const toolFunctions = {
                // TEXT TOOLS
                'word-counter': createWordCounter,
                'character-counter': createCharacterCounter,
                'case-converter': createCaseConverter,
                'text-reverser': createTextReverser,
                'lorem-ipsum-generator': createLoremIpsumGenerator,
                'word-frequency-counter': createWordFrequencyCounter,
                'palindrome-checker': createPalindromeChecker,
                'text-to-slug': createTextToSlug,
                'remove-duplicate-lines': createRemoveDuplicates,
                'text-sorter': createTextSorter,
                'text-comparer': createTextComparer,
                'find-and-replace': createFindReplace,
                'text-splitter': createTextSplitter,
                'text-joiner': createTextJoiner,
                'line-number-adder': createLineNumberAdder,
                'whitespace-remover': createWhitespaceRemover,
                'html-to-text': createHtmlToText,
                'text-to-html': createTextToHtml,
                'morse-code-converter': createMorseCodeConverter,
                'binary-to-text': createBinaryToText,
                'text-to-binary': createTextToBinary,
                'hex-to-text': createHexToText,
                'text-to-hex': createTextToHex,
                'emoji-remover': createEmojiRemover,
                'reading-time-calculator': createReadingTimeCalculator,
                
                // DEVELOPER TOOLS
                'json-formatter': createJsonFormatter,
                'json-validator': createJsonValidator,
                'json-minifier': createJsonMinifier,
                'json-to-xml': createJsonToXml,
                'xml-to-json': createXmlToJson,
                'css-minifier': createCssMinifier,
                'css-formatter': createCssFormatter,
                'html-formatter': createHtmlFormatter,
                'html-minifier': createHtmlMinifier,
                'js-minifier': createJsMinifier,
                'js-formatter': createJsFormatter,
                'regex-tester': createRegexTester,
                'uuid-generator': createUuidGenerator,
                'guid-generator': createGuidGenerator,
                'random-string-generator': createRandomStringGenerator,
                'url-encoder': createUrlEncoder,
                'url-decoder': createUrlDecoder,
                'base64-encoder': createBase64Encoder,
                'base64-decoder': createBase64Decoder,
                
                // SECURITY TOOLS
                'password-generator': createPasswordGenerator,
                'password-strength-checker': createPasswordStrengthChecker,
                'hash-generator': createHashGenerator,
                'md5-generator': createMd5Generator,
                'sha1-generator': createSha1Generator,
                'sha256-generator': createSha256Generator,
                'sha512-generator': createSha512Generator,
                'email-validator': createEmailValidator,
                'phone-validator': createPhoneValidator,
                'url-validator': createUrlValidator,
                'ip-validator': createIpValidator,
                
                // CONVERTER TOOLS
                'qr-code-generator': createQrCodeGenerator,
                'unit-converter': createUnitConverter,
                'temperature-converter': createTemperatureConverter,
                'currency-converter': createCurrencyConverter,
                'binary-to-decimal': createBinaryToDecimal,
                'decimal-to-binary': createDecimalToBinary,
                'decimal-to-hex': createDecimalToHex,
                'hex-to-decimal': createHexToDecimal,
                'roman-numerals': createRomanNumerals,
                
                // CALCULATOR TOOLS
                'bmi-calculator': createBmiCalculator,
                'age-calculator': createAgeCalculator,
                'percentage-calculator': createPercentageCalculator,
                'loan-calculator': createLoanCalculator,
                'tip-calculator': createTipCalculator,
                'discount-calculator': createDiscountCalculator,
                'compound-interest': createCompoundInterestCalculator,
                'simple-interest': createSimpleInterestCalculator,
                'gpa-calculator': createGpaCalculator,
                'factorial-calculator': createFactorialCalculator,
                'square-root-calculator': createSquareRootCalculator,
                
                // UTILITY TOOLS
                'random-number-generator': createRandomNumberGenerator,
                'random-name-generator': createRandomNameGenerator,
                'random-password': createRandomPasswordGenerator,
                'time-zone-converter': createTimeZoneConverter,
                'date-calculator': createDateCalculator,
                'days-between-dates': createDaysBetweenDates,
                'stopwatch': createStopwatch,
                'countdown-timer': createCountdownTimer,
                'world-clock': createWorldClock,
                'counter': createCounter,
                'link-shortener': createLinkShortener,
                'url-expander': createUrlExpander,
                'email-extractor': createEmailExtractor,
                'phone-extractor': createPhoneExtractor,
                'hashtag-generator': createHashtagGenerator,
                'username-generator': createUsernameGenerator,
                
                // COLOR TOOLS
                'color-picker': createColorPicker,
                'color-converter': createColorConverter,
                'hex-to-rgb': createHexToRgb,
                'rgb-to-hex': createRgbToHex,
                'color-palette': createColorPalette,
                'gradient-generator': createGradientGenerator,
                'random-color': createRandomColor,
                
                // DATE & TIME TOOLS
                'unix-timestamp': createUnixTimestamp,
                'epoch-converter': createEpochConverter,
                'date-to-timestamp': createDateToTimestamp,
                'timestamp-to-date': createTimestampToDate,
                'leap-year-checker': createLeapYearChecker,
                'week-number': createWeekNumber,
                
                // MATH TOOLS
                'scientific-calculator': createScientificCalculator,
                'prime-checker': createPrimeChecker,
                'prime-factorization': createPrimeFactorization,
                'gcd-calculator': createGcdCalculator,
                'lcm-calculator': createLcmCalculator,
                'percentage-change': createPercentageChange,
                'ratio-simplifier': createRatioSimplifier,
                
                // STRING TOOLS
                'string-length': createStringLength,
                'string-reverse': createStringReverse,
                'string-uppercase': createStringUppercase,
                'string-lowercase': createStringLowercase,
                'string-title-case': createStringTitleCase,
                'string-camel-case': createStringCamelCase,
                'string-snake-case': createStringSnakeCase,
                'string-kebab-case': createStringKebabCase,
                'string-trim': createStringTrim,
                
                // NETWORK TOOLS
                'ip-lookup': createIpLookup,
                'dns-lookup': createDnsLookup,
                'whois-lookup': createWhoisLookup,
                'ping-tester': createPingTester,
                'subnet-calculator': createSubnetCalculator,
                
                // ENCODING TOOLS
                'base64-encode': createBase64Encode,
                'base64-decode': createBase64Decode,
                'url-encode': createUrlEncode,
                'url-decode': createUrlDecode,
                'html-encode': createHtmlEncode,
                'html-decode': createHtmlDecode,
                'utf8-encode': createUtf8Encode,
                'utf8-decode': createUtf8Decode,
                'ascii-encode': createAsciiEncode,
                'ascii-decode': createAsciiDecode,
                'rot13-encode': createRot13Encode,
                'rot13-decode': createRot13Decode
            };
            
            // ফাংশন খুঁজে বের করা
            const toolFunction = toolFunctions[slug];
            
            if (toolFunction) {
                debugLog('নির্দিষ্ট ফাংশন পাওয়া গেছে:', slug);
                container.innerHTML = toolFunction(tool);
            } else {
                debugLog('ডিফল্ট ফাংশনালিটি ব্যবহার করা হচ্ছে:', slug);
                container.innerHTML = createDefaultFunctionality(tool);
            }
        }

        // ============================================
        // ডিফল্ট ফাংশনালিটি (যদি নির্দিষ্ট ফাংশন না থাকে)
        // ============================================
        function createDefaultFunctionality(tool) {
            return `
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">${tool.icon || '🔧'}</div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-2">${tool.name}</h3>
                    <p class="text-gray-600 mb-6">${tool.description || 'এই টুলটির বিবরণ শীঘ্রই যোগ করা হবে।'}</p>
                    <div class="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto">
                        <p class="text-gray-500 mb-4">এই টুলটির সম্পূর্ণ ফাংশনালিটি শীঘ্রই যোগ করা হবে।</p>
                        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p class="text-yellow-800">
                                <i class="fas fa-info-circle mr-2"></i>
                                এই টুলটি বর্তমানে ডেভেলপমেন্ট পর্যায়ে রয়েছে।
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }

        // ============================================
        // TEXT TOOLS ফাংশনালিটি
        // ============================================
        function createWordCounter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📝 Word Counter</h3>
                    <textarea id="inputText" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="আপনার টেক্সট এখানে লিখুন..."></textarea>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-blue-600" id="wordCount">0</p>
                            <p class="text-sm text-gray-600">শব্দ</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-green-600" id="charCount">0</p>
                            <p class="text-sm text-gray-600">অক্ষর</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-purple-600" id="sentenceCount">0</p>
                            <p class="text-sm text-gray-600">বাক্য</p>
                        </div>
                        <div class="bg-orange-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-orange-600" id="paragraphCount">0</p>
                            <p class="text-sm text-gray-600">প্যারাগ্রাফ</p>
                        </div>
                    </div>
                    <script>
                        document.getElementById('inputText').addEventListener('input', function() {
                            const text = this.value;
                            document.getElementById('wordCount').textContent = text.trim() ? text.trim().split(/\\s+/).length : 0;
                            document.getElementById('charCount').textContent = text.length;
                            document.getElementById('sentenceCount').textContent = text.split(/[.!?]+/).filter(s => s.trim()).length;
                            document.getElementById('paragraphCount').textContent = text.split(/\\n\\n+/).filter(p => p.trim()).length;
                        });
                    <\/script>
                </div>
            `;
        }

        function createCharacterCounter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔤 Character Counter</h3>
                    <textarea id="charInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="আপনার টেক্সট এখানে লিখুন..."></textarea>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-blue-600" id="totalChars">0</p>
                            <p class="text-sm text-gray-600">মোট অক্ষর</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-green-600" id="noSpaceChars">0</p>
                            <p class="text-sm text-gray-600">স্পেস ছাড়া</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-purple-600" id="lineCount">0</p>
                            <p class="text-sm text-gray-600">লাইন</p>
                        </div>
                    </div>
                    <script>
                        document.getElementById('charInput').addEventListener('input', function() {
                            const text = this.value;
                            document.getElementById('totalChars').textContent = text.length;
                            document.getElementById('noSpaceChars').textContent = text.replace(/\\s/g, '').length;
                            document.getElementById('lineCount').textContent = text.split('\\n').length;
                        });
                    <\/script>
                </div>
            `;
        }

        function createCaseConverter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔠 Case Converter</h3>
                    <textarea id="caseInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="convertCase('upper')" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">UPPERCASE</button>
                        <button onclick="convertCase('lower')" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">lowercase</button>
                        <button onclick="convertCase('title')" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">Title Case</button>
                        <button onclick="convertCase('sentence')" class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">Sentence case</button>
                        <button onclick="convertCase('camel')" class="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">camelCase</button>
                        <button onclick="convertCase('snake')" class="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition">snake_case</button>
                    </div>
                    <div class="result-box">
                        <p class="font-semibold text-gray-700 mb-2">রেজাল্ট:</p>
                        <p id="caseResult" class="text-gray-600">এখানে রেজাল্ট দেখানো হবে...</p>
                    </div>
                    <script>
                        window.convertCase = function(type) {
                            const text = document.getElementById('caseInput').value;
                            let result = '';
                            switch(type) {
                                case 'upper': result = text.toUpperCase(); break;
                                case 'lower': result = text.toLowerCase(); break;
                                case 'title': result = text.replace(/\\w\\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()); break;
                                case 'sentence': result = text.toLowerCase().replace(/(^\\s*\\w|[.!?]\\s*\\w)/g, c => c.toUpperCase()); break;
                                case 'camel': result = text.replace(/[-_\\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''); break;
                                case 'snake': result = text.replace(/\\s+/g, '_').toLowerCase(); break;
                            }
                            document.getElementById('caseResult').textContent = result;
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextReverser() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔄 Text Reverser</h3>
                    <textarea id="reverseInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="reverseText()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রিভার্স করুন</button>
                    <div class="result-box">
                        <p class="font-semibold text-gray-700 mb-2">রেজাল্ট:</p>
                        <p id="reverseResult" class="text-gray-600">এখানে রেজাল্ট দেখানো হবে...</p>
                    </div>
                    <script>
                        window.reverseText = function() {
                            const text = document.getElementById('reverseInput').value;
                            document.getElementById('reverseResult').textContent = text.split('').reverse().join('');
                        };
                    <\/script>
                </div>
            `;
        }

        function createLoremIpsumGenerator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📄 Lorem Ipsum Generator</h3>
                    <div class="flex gap-4 items-end">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">প্যারাগ্রাফ সংখ্যা</label>
                            <input type="number" id="paragraphNum" value="3" min="1" max="20" class="w-32 px-4 py-2 border rounded-lg">
                        </div>
                        <button onclick="generateLorem()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">জেনারেট করুন</button>
                    </div>
                    <div class="result-box">
                        <p id="loremResult" class="text-gray-600">এখানে রেজাল্ট দেখানো হবে...</p>
                    </div>
                    <script>
                        window.generateLorem = function() {
                            const paragraphs = parseInt(document.getElementById('paragraphNum').value);
                            const lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
                            document.getElementById('loremResult').innerHTML = Array(paragraphs).fill(lorem).join('<br><br>');
                        };
                    <\/script>
                </div>
            `;
        }

        function createWordFrequencyCounter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📊 Word Frequency Counter</h3>
                    <textarea id="freqInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="countFrequency()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">গণনা করুন</button>
                    <div class="result-box">
                        <p class="font-semibold text-gray-700 mb-2">ফলাফল:</p>
                        <div id="freqResult" class="space-y-1"></div>
                    </div>
                    <script>
                        window.countFrequency = function() {
                            const text = document.getElementById('freqInput').value.toLowerCase();
                            const words = text.match(/\\w+/g) || [];
                            const freq = {};
                            words.forEach(word => freq[word] = (freq[word] || 0) + 1);
                            const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
                            const resultDiv = document.getElementById('freqResult');
                            resultDiv.innerHTML = sorted.slice(0, 50).map(([word, count]) => 
                                \`<div class="flex justify-between bg-gray-50 px-3 py-1 rounded"><span>\${word}</span><span class="font-semibold">\${count}</span></div>\`
                            ).join('');
                        };
                    <\/script>
                </div>
            `;
        }

        function createPalindromeChecker() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔍 Palindrome Checker</h3>
                    <input type="text" id="palindromeInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="টেক্সট লিখুন...">
                    <button onclick="checkPalindrome()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">চেক করুন</button>
                    <div class="result-box">
                        <p id="palindromeResult" class="font-semibold text-center text-lg"></p>
                    </div>
                    <script>
                        window.checkPalindrome = function() {
                            const text = document.getElementById('palindromeInput').value.toLowerCase().replace(/[^a-z0-9]/g, '');
                            const reversed = text.split('').reverse().join('');
                            const result = document.getElementById('palindromeResult');
                            if (text === reversed && text.length > 0) {
                                result.textContent = '✅ এটি একটি প্যালিনড্রোম!';
                                result.className = 'text-green-600 font-semibold text-center text-lg';
                            } else {
                                result.textContent = '❌ এটি প্যালিনড্রোম নয়!';
                                result.className = 'text-red-600 font-semibold text-center text-lg';
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextToSlug() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔗 Text to Slug</h3>
                    <input type="text" id="slugInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="টেক্সট লিখুন...">
                    <button onclick="generateSlug()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">স্লাগ তৈরি করুন</button>
                    <div class="result-box flex items-center justify-between">
                        <p id="slugResult" class="text-gray-600 font-mono">এখানে স্লাগ দেখানো হবে...</p>
                        <button onclick="copySlug()" class="copy-btn bg-gray-200 px-3 py-1 rounded text-sm">কপি</button>
                    </div>
                    <script>
                        window.generateSlug = function() {
                            const text = document.getElementById('slugInput').value;
                            const slug = text.toLowerCase()
                                .replace(/[^\\w\\s-]/g, '')
                                .replace(/\\s+/g, '-')
                                .replace(/-+/g, '-')
                                .replace(/^-|-$/g, '');
                            document.getElementById('slugResult').textContent = slug;
                        };
                        window.copySlug = function() {
                            const slug = document.getElementById('slugResult').textContent;
                            copyToClipboard(slug);
                        };
                    <\/script>
                </div>
            `;
        }

        function createRemoveDuplicates() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🗑️ Remove Duplicate Lines</h3>
                    <textarea id="duplicateInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="প্রতিটি লাইন আলাদা করে লিখুন..."></textarea>
                    <button onclick="removeDuplicates()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ডুপ্লিকেট সরান</button>
                    <div class="result-box">
                        <p class="font-semibold text-gray-700 mb-2">রেজাল্ট:</p>
                        <textarea id="duplicateResult" class="w-full p-2 border rounded" rows="6" readonly></textarea>
                    </div>
                    <script>
                        window.removeDuplicates = function() {
                            const lines = document.getElementById('duplicateInput').value.split('\\n');
                            const unique = [...new Set(lines.filter(line => line.trim()))];
                            document.getElementById('duplicateResult').value = unique.join('\\n');
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextSorter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📑 Text Sorter</h3>
                    <textarea id="sortInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="প্রতিটি লাইন আলাদা করে লিখুন..."></textarea>
                    <div class="flex gap-3">
                        <button onclick="sortText('asc')" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">A-Z সাজান</button>
                        <button onclick="sortText('desc')" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Z-A সাজান</button>
                    </div>
                    <div class="result-box">
                        <textarea id="sortResult" class="w-full p-2 border rounded" rows="6" readonly></textarea>
                    </div>
                    <script>
                        window.sortText = function(type) {
                            const lines = document.getElementById('sortInput').value.split('\\n').filter(line => line.trim());
                            if (type === 'asc') lines.sort();
                            else lines.sort().reverse();
                            document.getElementById('sortResult').value = lines.join('\\n');
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextComparer() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔍 Text Comparer</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">প্রথম টেক্সট</label>
                            <textarea id="compare1" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="5"></textarea>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">দ্বিতীয় টেক্সট</label>
                            <textarea id="compare2" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="5"></textarea>
                        </div>
                    </div>
                    <button onclick="compareTexts()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">তুলনা করুন</button>
                    <div class="result-box">
                        <p id="compareResult" class="font-semibold text-center text-lg"></p>
                    </div>
                    <script>
                        window.compareTexts = function() {
                            const text1 = document.getElementById('compare1').value;
                            const text2 = document.getElementById('compare2').value;
                            const result = document.getElementById('compareResult');
                            if (text1 === text2) {
                                result.textContent = '✅ দুটি টেক্সট সম্পূর্ণ একই!';
                                result.className = 'text-green-600 font-semibold text-center text-lg';
                            } else {
                                result.textContent = '❌ দুটি টেক্সট আলাদা!';
                                result.className = 'text-red-600 font-semibold text-center text-lg';
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        function createFindReplace() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔍 Find and Replace</h3>
                    <textarea id="frInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="4" placeholder="মূল টেক্সট..."></textarea>
                    <div class="grid md:grid-cols-2 gap-4">
                        <input type="text" id="findText" class="w-full p-3 border rounded-lg" placeholder="খুঁজুন...">
                        <input type="text" id="replaceText" class="w-full p-3 border rounded-lg" placeholder="প্রতিস্থাপন করুন...">
                    </div>
                    <button onclick="findReplace()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">প্রতিস্থাপন করুন</button>
                    <div class="result-box">
                        <textarea id="frResult" class="w-full p-2 border rounded" rows="4" readonly></textarea>
                    </div>
                    <script>
                        window.findReplace = function() {
                            const text = document.getElementById('frInput').value;
                            const find = document.getElementById('findText').value;
                            const replace = document.getElementById('replaceText').value;
                            document.getElementById('frResult').value = text.split(find).join(replace);
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextSplitter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">✂️ Text Splitter</h3>
                    <textarea id="splitInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <div class="flex gap-4 items-end">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ডেলিমিটার</label>
                            <input type="text" id="delimiter" class="w-full p-3 border rounded-lg" placeholder="যেমন: কমা, স্পেস">
                        </div>
                        <button onclick="splitText()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ভাগ করুন</button>
                    </div>
                    <div class="result-box">
                        <div id="splitResult" class="space-y-1"></div>
                    </div>
                    <script>
                        window.splitText = function() {
                            const text = document.getElementById('splitInput').value;
                            const delimiter = document.getElementById('delimiter').value || ',';
                            const parts = text.split(delimiter).filter(p => p.trim());
                            document.getElementById('splitResult').innerHTML = parts.map((part, i) => 
                                \`<div class="bg-gray-50 px-3 py-1 rounded">\${i + 1}. \${part.trim()}</div>\`
                            ).join('');
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextJoiner() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔗 Text Joiner</h3>
                    <textarea id="joinInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="প্রতিটি লাইন আলাদা করে লিখুন..."></textarea>
                    <div class="flex gap-4 items-end">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">জয়েন ক্যারেক্টার</label>
                            <input type="text" id="joinChar" class="w-full p-3 border rounded-lg" placeholder="যেমন: , - space">
                        </div>
                        <button onclick="joinText()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">জয়েন করুন</button>
                    </div>
                    <div class="result-box">
                        <p id="joinResult" class="text-gray-600"></p>
                    </div>
                    <script>
                        window.joinText = function() {
                            const lines = document.getElementById('joinInput').value.split('\\n').filter(l => l.trim());
                            const char = document.getElementById('joinChar').value || ', ';
                            document.getElementById('joinResult').textContent = lines.join(char);
                        };
                    <\/script>
                </div>
            `;
        }

        function createLineNumberAdder() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔢 Line Number Adder</h3>
                    <textarea id="lineInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="প্রতিটি লাইন আলাদা করে লিখুন..."></textarea>
                    <button onclick="addLineNumbers()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">নম্বর যোগ করুন</button>
                    <div class="result-box">
                        <textarea id="lineResult" class="w-full p-2 border rounded font-mono" rows="6" readonly></textarea>
                    </div>
                    <script>
                        window.addLineNumbers = function() {
                            const lines = document.getElementById('lineInput').value.split('\\n');
                            document.getElementById('lineResult').value = lines.map((line, i) => \`\${i + 1}. \${line}\`).join('\\n');
                        };
                    <\/script>
                </div>
            `;
        }

        function createWhitespaceRemover() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🧹 Whitespace Remover</h3>
                    <textarea id="wsInput" class="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows="6" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="removeWhitespace()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">স্পেস সরান</button>
                    <div class="result-box">
                        <textarea id="wsResult" class="w-full p-2 border rounded" rows="6" readonly></textarea>
                    </div>
                    <script>
                        window.removeWhitespace = function() {
                            const text = document.getElementById('wsInput').value;
                            document.getElementById('wsResult').value = text.replace(/\\s+/g, ' ').trim();
                        };
                    <\/script>
                </div>
            `;
        }

        function createHtmlToText() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📄 HTML to Text</h3>
                    <textarea id="htmlInput" class="w-full p-4 border rounded-lg font-mono" rows="6" placeholder="HTML কোড লিখুন..."></textarea>
                    <button onclick="convertHtmlToText()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রূপান্তর করুন</button>
                    <div class="result-box">
                        <textarea id="htmlResult" class="w-full p-2 border rounded" rows="6" readonly></textarea>
                    </div>
                    <script>
                        window.convertHtmlToText = function() {
                            const html = document.getElementById('htmlInput').value;
                            const div = document.createElement('div');
                            div.innerHTML = html;
                            document.getElementById('htmlResult').value = div.textContent || div.innerText || '';
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextToHtml() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📝 Text to HTML</h3>
                    <textarea id="textInput" class="w-full p-4 border rounded-lg" rows="6" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="convertTextToHtml()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রূপান্তর করুন</button>
                    <div class="result-box">
                        <textarea id="textResult" class="w-full p-2 border rounded font-mono" rows="6" readonly></textarea>
                    </div>
                    <script>
                        window.convertTextToHtml = function() {
                            const text = document.getElementById('textInput').value;
                            const html = text.split('\\n\\n').map(p => \`<p>\${p.replace(/\\n/g, '<br>')}</p>\`).join('');
                            document.getElementById('textResult').value = html;
                        };
                    <\/script>
                </div>
            `;
        }

        function createMorseCodeConverter() {
            const morseCode = {
                'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
                'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
                'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
                'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
                'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---',
                '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...',
                '8': '---..', '9': '----.', ' ': '/'
            };
            
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📡 Morse Code Converter</h3>
                    <textarea id="morseInput" class="w-full p-4 border rounded-lg" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <div class="flex gap-3">
                        <button onclick="textToMorse()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Text → Morse</button>
                        <button onclick="morseToText()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">Morse → Text</button>
                    </div>
                    <div class="result-box">
                        <textarea id="morseResult" class="w-full p-2 border rounded font-mono" rows="4" readonly></textarea>
                    </div>
                    <script>
                        const morseMap = ${JSON.stringify(morseCode)};
                        window.textToMorse = function() {
                            const text = document.getElementById('morseInput').value.toUpperCase();
                            document.getElementById('morseResult').value = text.split('').map(ch => morseMap[ch] || ch).join(' ');
                        };
                        window.morseToText = function() {
                            const morse = document.getElementById('morseInput').value.trim();
                            const reverseMap = Object.fromEntries(Object.entries(morseMap).map(([k, v]) => [v, k]));
                            document.getElementById('morseResult').value = morse.split(' ').map(code => reverseMap[code] || code).join('');
                        };
                    <\/script>
                </div>
            `;
        }

        function createBinaryToText() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔢 Binary to Text</h3>
                    <textarea id="binaryInput" class="w-full p-4 border rounded-lg font-mono" rows="4" placeholder="01001000 01101001"></textarea>
                    <button onclick="binaryToText()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রূপান্তর করুন</button>
                    <div class="result-box">
                        <p id="binaryResult" class="text-gray-600 font-mono"></p>
                    </div>
                    <script>
                        window.binaryToText = function() {
                            const binary = document.getElementById('binaryInput').value;
                            const text = binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
                            document.getElementById('binaryResult').textContent = text;
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextToBinary() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔤 Text to Binary</h3>
                    <textarea id="textToBinaryInput" class="w-full p-4 border rounded-lg" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="textToBinary()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রূপান্তর করুন</button>
                    <div class="result-box">
                        <p id="textToBinaryResult" class="text-gray-600 font-mono"></p>
                    </div>
                    <script>
                        window.textToBinary = function() {
                            const text = document.getElementById('textToBinaryInput').value;
                            const binary = text.split('').map(ch => ch.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
                            document.getElementById('textToBinaryResult').textContent = binary;
                        };
                    <\/script>
                </div>
            `;
        }

        function createHexToText() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔢 Hex to Text</h3>
                    <textarea id="hexInput" class="w-full p-4 border rounded-lg font-mono" rows="4" placeholder="48656c6c6f"></textarea>
                    <button onclick="hexToText()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রূপান্তর করুন</button>
                    <div class="result-box">
                        <p id="hexResult" class="text-gray-600 font-mono"></p>
                    </div>
                    <script>
                        window.hexToText = function() {
                            const hex = document.getElementById('hexInput').value.replace(/\\s/g, '');
                            const text = hex.match(/.{1,2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join('');
                            document.getElementById('hexResult').textContent = text;
                        };
                    <\/script>
                </div>
            `;
        }

        function createTextToHex() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔤 Text to Hex</h3>
                    <textarea id="textToHexInput" class="w-full p-4 border rounded-lg" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="textToHex()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">রূপান্তর করুন</button>
                    <div class="result-box">
                        <p id="textToHexResult" class="text-gray-600 font-mono"></p>
                    </div>
                    <script>
                        window.textToHex = function() {
                            const text = document.getElementById('textToHexInput').value;
                            const hex = text.split('').map(ch => ch.charCodeAt(0).toString(16).padStart(2, '0')).join('');
                            document.getElementById('textToHexResult').textContent = hex;
                        };
                    <\/script>
                </div>
            `;
        }

        function createEmojiRemover() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🚫 Emoji Remover</h3>
                    <textarea id="emojiInput" class="w-full p-4 border rounded-lg" rows="4" placeholder="টেক্সট লিখুন... 😀🎉"></textarea>
                    <button onclick="removeEmojis()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ইমোজি সরান</button>
                    <div class="result-box">
                        <p id="emojiResult" class="text-gray-600"></p>
                    </div>
                    <script>
                        window.removeEmojis = function() {
                            const text = document.getElementById('emojiInput').value;
                            const noEmoji = text.replace(/[\\u{1F600}-\\u{1F64F}\\u{1F300}-\\u{1F5FF}\\u{1F680}-\\u{1F6FF}\\u{1F1E0}-\\u{1F1FF}\\u{2600}-\\u{26FF}\\u{2700}-\\u{27BF}]/gu, '');
                            document.getElementById('emojiResult').textContent = noEmoji;
                        };
                    <\/script>
                </div>
            `;
        }

        function createReadingTimeCalculator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">⏱️ Reading Time Calculator</h3>
                    <textarea id="readingInput" class="w-full p-4 border rounded-lg" rows="6" placeholder="টেক্সট লিখুন..."></textarea>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="bg-blue-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-blue-600" id="wordsCount">0</p>
                            <p class="text-sm text-gray-600">শব্দ</p>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-green-600" id="readMinutes">0</p>
                            <p class="text-sm text-gray-600">মিনিট (গড়)</p>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg text-center">
                            <p class="text-2xl font-bold text-purple-600" id="readSlow">0</p>
                            <p class="text-sm text-gray-600">মিনিট (ধীরে)</p>
                        </div>
                    </div>
                    <script>
                        document.getElementById('readingInput').addEventListener('input', function() {
                            const words = this.value.trim() ? this.value.trim().split(/\\s+/).length : 0;
                            document.getElementById('wordsCount').textContent = words;
                            document.getElementById('readMinutes').textContent = Math.ceil(words / 200);
                            document.getElementById('readSlow').textContent = Math.ceil(words / 150);
                        });
                    <\/script>
                </div>
            `;
        }

        // ============================================
        // DEVELOPER TOOLS ফাংশনালিটি
        // ============================================
        function createJsonFormatter() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">💻 JSON Formatter</h3>
                    <textarea id="jsonInput" class="w-full p-4 border rounded-lg font-mono" rows="8" placeholder='{"key": "value"}'></textarea>
                    <div class="flex gap-3">
                        <button onclick="formatJson(2)" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">2 Spaces</button>
                        <button onclick="formatJson(4)" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">4 Spaces</button>
                        <button onclick="minifyJson()" class="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">Minify</button>
                    </div>
                    <div class="result-box">
                        <pre id="jsonResult" class="text-gray-600 font-mono text-sm overflow-auto"></pre>
                    </div>
                    <script>
                        window.formatJson = function(spaces) {
                            try {
                                const json = JSON.parse(document.getElementById('jsonInput').value);
                                document.getElementById('jsonResult').textContent = JSON.stringify(json, null, spaces);
                                document.getElementById('jsonResult').className = 'text-green-600 font-mono text-sm overflow-auto';
                            } catch (e) {
                                document.getElementById('jsonResult').textContent = '❌ ইনভ্যালিড JSON: ' + e.message;
                                document.getElementById('jsonResult').className = 'text-red-600 font-mono text-sm overflow-auto';
                            }
                        };
                        window.minifyJson = function() {
                            try {
                                const json = JSON.parse(document.getElementById('jsonInput').value);
                                document.getElementById('jsonResult').textContent = JSON.stringify(json);
                                document.getElementById('jsonResult').className = 'text-green-600 font-mono text-sm overflow-auto';
                            } catch (e) {
                                document.getElementById('jsonResult').textContent = '❌ ইনভ্যালিড JSON: ' + e.message;
                                document.getElementById('jsonResult').className = 'text-red-600 font-mono text-sm overflow-auto';
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        function createJsonValidator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">✅ JSON Validator</h3>
                    <textarea id="jsonValidateInput" class="w-full p-4 border rounded-lg font-mono" rows="8" placeholder='{"key": "value"}'></textarea>
                    <button onclick="validateJson()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ভ্যালিডেট করুন</button>
                    <div class="result-box">
                        <p id="jsonValidateResult" class="font-semibold text-center text-lg"></p>
                    </div>
                    <script>
                        window.validateJson = function() {
                            try {
                                JSON.parse(document.getElementById('jsonValidateInput').value);
                                document.getElementById('jsonValidateResult').textContent = '✅ ভ্যালিড JSON!';
                                document.getElementById('jsonValidateResult').className = 'text-green-600 font-semibold text-center text-lg';
                            } catch (e) {
                                document.getElementById('jsonValidateResult').textContent = '❌ ইনভ্যালিড JSON: ' + e.message;
                                document.getElementById('jsonValidateResult').className = 'text-red-600 font-semibold text-center text-lg';
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        function createJsonMinifier() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📦 JSON Minifier</h3>
                    <textarea id="jsonMinInput" class="w-full p-4 border rounded-lg font-mono" rows="8" placeholder='{"key": "value"}'></textarea>
                    <button onclick="minifyJsonTool()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Minify করুন</button>
                    <div class="result-box">
                        <textarea id="jsonMinResult" class="w-full p-2 border rounded font-mono" rows="4" readonly></textarea>
                    </div>
                    <script>
                        window.minifyJsonTool = function() {
                            try {
                                const json = JSON.parse(document.getElementById('jsonMinInput').value);
                                document.getElementById('jsonMinResult').value = JSON.stringify(json);
                            } catch (e) {
                                document.getElementById('jsonMinResult').value = 'Error: ' + e.message;
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        function createUuidGenerator() {
            return `
                <div class="space-y-4 text-center">
                    <h3 class="text-xl font-bold text-gray-900">🔑 UUID Generator</h3>
                    <div class="result-box">
                        <p id="uuidResult" class="text-gray-600 font-mono text-lg">ক্লিক করে UUID তৈরি করুন</p>
                    </div>
                    <div class="flex gap-3 justify-center">
                        <button onclick="generateUuid()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">জেনারেট করুন</button>
                        <button onclick="copyUuid()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">কপি করুন</button>
                    </div>
                    <script>
                        window.generateUuid = function() {
                            const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                                const r = Math.random() * 16 | 0;
                                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                                return v.toString(16);
                            });
                            document.getElementById('uuidResult').textContent = uuid;
                        };
                        window.copyUuid = function() {
                            copyToClipboard(document.getElementById('uuidResult').textContent);
                        };
                    <\/script>
                </div>
            `;
        }

        function createGuidGenerator() {
            return createUuidGenerator();
        }

        function createRandomStringGenerator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔤 Random String Generator</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">দৈর্ঘ্য</label>
                            <input type="number" id="strLength" value="10" min="1" max="100" class="w-full p-3 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">অক্ষর</label>
                            <select id="strType" class="w-full p-3 border rounded-lg">
                                <option value="all">সব অক্ষর</option>
                                <option value="alpha">শুধু বর্ণ</option>
                                <option value="numeric">শুধু সংখ্যা</option>
                                <option value="alphanumeric">বর্ণ + সংখ্যা</option>
                                <option value="special">বিশেষ অক্ষর সহ</option>
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button onclick="generateRandomString()" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">জেনারেট করুন</button>
                        </div>
                    </div>
                    <div class="result-box">
                        <p id="randomStrResult" class="text-gray-600 font-mono text-lg text-center"></p>
                    </div>
                    <script>
                        window.generateRandomString = function() {
                            const length = parseInt(document.getElementById('strLength').value);
                            const type = document.getElementById('strType').value;
                            let chars = '';
                            if (type === 'alpha') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                            else if (type === 'numeric') chars = '0123456789';
                            else if (type === 'alphanumeric') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                            else if (type === 'special') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
                            else chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                            
                            let result = '';
                            for (let i = 0; i < length; i++) {
                                result += chars.charAt(Math.floor(Math.random() * chars.length));
                            }
                            document.getElementById('randomStrResult').textContent = result;
                        };
                    <\/script>
                </div>
            `;
        }

        function createUrlEncoder() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔗 URL Encoder</h3>
                    <textarea id="urlEncodeInput" class="w-full p-4 border rounded-lg" rows="4" placeholder="URL বা টেক্সট লিখুন..."></textarea>
                    <button onclick="encodeUrl()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">এনকোড করুন</button>
                    <div class="result-box">
                        <p id="urlEncodeResult" class="text-gray-600 font-mono break-all"></p>
                    </div>
                    <script>
                        window.encodeUrl = function() {
                            const url = document.getElementById('urlEncodeInput').value;
                            document.getElementById('urlEncodeResult').textContent = encodeURIComponent(url);
                        };
                    <\/script>
                </div>
            `;
        }

        function createUrlDecoder() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔓 URL Decoder</h3>
                    <textarea id="urlDecodeInput" class="w-full p-4 border rounded-lg font-mono" rows="4" placeholder="এনকোডেড URL লিখুন..."></textarea>
                    <button onclick="decodeUrl()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ডিকোড করুন</button>
                    <div class="result-box">
                        <p id="urlDecodeResult" class="text-gray-600 font-mono break-all"></p>
                    </div>
                    <script>
                        window.decodeUrl = function() {
                            const url = document.getElementById('urlDecodeInput').value;
                            try {
                                document.getElementById('urlDecodeResult').textContent = decodeURIComponent(url);
                            } catch (e) {
                                document.getElementById('urlDecodeResult').textContent = 'Error: ' + e.message;
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        function createBase64Encoder() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔐 Base64 Encoder</h3>
                    <textarea id="base64EncodeInput" class="w-full p-4 border rounded-lg" rows="4" placeholder="টেক্সট লিখুন..."></textarea>
                    <button onclick="encodeBase64()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">এনকোড করুন</button>
                    <div class="result-box">
                        <p id="base64EncodeResult" class="text-gray-600 font-mono break-all"></p>
                    </div>
                    <script>
                        window.encodeBase64 = function() {
                            const text = document.getElementById('base64EncodeInput').value;
                            document.getElementById('base64EncodeResult').textContent = btoa(unescape(encodeURIComponent(text)));
                        };
                    <\/script>
                </div>
            `;
        }

        function createBase64Decoder() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔓 Base64 Decoder</h3>
                    <textarea id="base64DecodeInput" class="w-full p-4 border rounded-lg font-mono" rows="4" placeholder="Base64 স্ট্রিং লিখুন..."></textarea>
                    <button onclick="decodeBase64()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ডিকোড করুন</button>
                    <div class="result-box">
                        <p id="base64DecodeResult" class="text-gray-600 font-mono break-all"></p>
                    </div>
                    <script>
                        window.decodeBase64 = function() {
                            const base64 = document.getElementById('base64DecodeInput').value;
                            try {
                                document.getElementById('base64DecodeResult').textContent = decodeURIComponent(escape(atob(base64)));
                            } catch (e) {
                                document.getElementById('base64DecodeResult').textContent = 'Error: ' + e.message;
                            }
                        };
                    <\/script>
                </div>
            `;
        }

        // ============================================
        // SECURITY TOOLS ফাংশনালিটি
        // ============================================
        function createPasswordGenerator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🔐 Password Generator</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">দৈর্ঘ্য</label>
                            <input type="number" id="passLength" value="12" min="4" max="50" class="w-full p-3 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">অক্ষর</label>
                            <select id="passType" class="w-full p-3 border rounded-lg">
                                <option value="all">সব অক্ষর</option>
                                <option value="alpha">শুধু বর্ণ</option>
                                <option value="alphanumeric">বর্ণ + সংখ্যা</option>
                                <option value="complex">জটিল (বিশেষ অক্ষর সহ)</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button onclick="generatePassword()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">জেনারেট করুন</button>
                        <button onclick="copyPassword()" class="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition">কপি করুন</button>
                    </div>
                    <div class="result-box text-center">
                        <p id="passwordResult" class="text-gray-600 font-mono text-2xl font-bold"></p>
                    </div>
                    <script>
                        window.generatePassword = function() {
                            const length = parseInt(document.getElementById('passLength').value);
                            const type = document.getElementById('passType').value;
                            let chars = '';
                            if (type === 'alpha') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                            else if (type === 'alphanumeric') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                            else if (type === 'complex') chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                            else chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
                            
                            let password = '';
                            for (let i = 0; i < length; i++) {
                                password += chars.charAt(Math.floor(Math.random() * chars.length));
                            }
                            document.getElementById('passwordResult').textContent = password;
                        };
                        window.copyPassword = function() {
                            copyToClipboard(document.getElementById('passwordResult').textContent);
                        };
                    <\/script>
                </div>
            `;
        }

        function createPasswordStrengthChecker() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">💪 Password Strength Checker</h3>
                    <input type="password" id="passCheckInput" class="w-full p-4 border rounded-lg" placeholder="পাসওয়ার্ড লিখুন...">
                    <div id="passStrengthBar" class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div id="passStrengthFill" class="h-full bg-red-500 transition-all" style="width: 0%"></div>
                    </div>
                    <p id="passStrengthText" class="text-center font-semibold"></p>
                    <script>
                        document.getElementById('passCheckInput').addEventListener('input', function() {
                            const password = this.value;
                            let score = 0;
                            if (password.length >= 8) score++;
                            if (password.length >= 12) score++;
                            if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
                            if (/\\d/.test(password)) score++;
                            if (/[^a-zA-Z0-9]/.test(password)) score++;
                            
                            const fill = document.getElementById('passStrengthFill');
                            const text = document.getElementById('passStrengthText');
                            
                            if (score <= 1) {
                                fill.style.width = '20%';
                                fill.className = 'h-full bg-red-500 transition-all';
                                text.textContent = 'খুব দুর্বল';
                                text.className = 'text-red-600 font-semibold text-center';
                            } else if (score <= 2) {
                                fill.style.width = '40%';
                                fill.className = 'h-full bg-orange-500 transition-all';
                                text.textContent = 'দুর্বল';
                                text.className = 'text-orange-600 font-semibold text-center';
                            } else if (score <= 3) {
                                fill.style.width = '60%';
                                fill.className = 'h-full bg-yellow-500 transition-all';
                                text.textContent = 'মোটামুটি';
                                text.className = 'text-yellow-600 font-semibold text-center';
                            } else if (score <= 4) {
                                fill.style.width = '80%';
                                fill.className = 'h-full bg-green-500 transition-all';
                                text.textContent = 'শক্তিশালী';
                                text.className = 'text-green-600 font-semibold text-center';
                            } else {
                                fill.style.width = '100%';
                                fill.className = 'h-full bg-blue-500 transition-all';
                                text.textContent = 'খুব শক্তিশালী';
                                text.className = 'text-blue-600 font-semibold text-center';
                            }
                        });
                    <\/script>
                </div>
            `;
        }

        function createEmailValidator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📧 Email Validator</h3>
                    <input type="text" id="emailValidateInput" class="w-full p-4 border rounded-lg" placeholder="ইমেইল লিখুন...">
                    <button onclick="validateEmail()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">ভ্যালিডেট করুন</button>
                    <div class="result-box">
                        <p id="emailValidateResult" class="font-semibold text-center text-lg"></p>
                    </div>
                    <script>
                        window.validateEmail = function() {
                            const email = document.getElementById('emailValidateInput').value;
                            const regex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                            const result = regex.test(email);
                            document.getElementById('emailValidateResult').textContent = result ? '✅ ভ্যালিড ইমেইল!' : '❌ ইনভ্যালিড ইমেইল!';
                            document.getElementById('emailValidateResult').className = result ? 'text-green-600 font-semibold text-center text-lg' : 'text-red-600 font-semibold text-center text-lg';
                        };
                    <\/script>
                </div>
            `;
        }

        // ============================================
        // CALCULATOR TOOLS ফাংশনালিটি
        // ============================================
        function createBmiCalculator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">⚖️ BMI Calculator</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">ওজন (কেজি)</label>
                            <input type="number" id="bmiWeight" class="w-full p-3 border rounded-lg" placeholder="যেমন: 70">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">উচ্চতা (সেমি)</label>
                            <input type="number" id="bmiHeight" class="w-full p-3 border rounded-lg" placeholder="যেমন: 170">
                        </div>
                        <div class="flex items-end">
                            <button onclick="calculateBmi()" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">গণনা করুন</button>
                        </div>
                    </div>
                    <div class="result-box text-center">
                        <p id="bmiResult" class="text-2xl font-bold text-gray-900"></p>
                        <p id="bmiCategory" class="text-gray-600 mt-2"></p>
                    </div>
                    <script>
                        window.calculateBmi = function() {
                            const weight = parseFloat(document.getElementById('bmiWeight').value);
                            const heightCm = parseFloat(document.getElementById('bmiHeight').value);
                            const heightM = heightCm / 100;
                            const bmi = weight / (heightM * heightM);
                            
                            let category;
                            if (bmi < 18.5) category = 'কম ওজন';
                            else if (bmi < 25) category = 'স্বাভাবিক ওজন';
                            else if (bmi < 30) category = 'অতিরিক্ত ওজন';
                            else category = 'স্থূলতা';
                            
                            document.getElementById('bmiResult').textContent = 'BMI: ' + bmi.toFixed(1);
                            document.getElementById('bmiCategory').textContent = 'ক্যাটাগরি: ' + category;
                        };
                    <\/script>
                </div>
            `;
        }

        function createAgeCalculator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">🎂 Age Calculator</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">জন্ম তারিখ</label>
                            <input type="date" id="birthDate" class="w-full p-3 border rounded-lg">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">বর্তমান তারিখ</label>
                            <input type="date" id="currentDate" class="w-full p-3 border rounded-lg" value="${new Date().toISOString().split('T')[0]}">
                        </div>
                    </div>
                    <button onclick="calculateAge()" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">গণনা করুন</button>
                    <div class="result-box text-center">
                        <p id="ageResult" class="text-2xl font-bold text-gray-900"></p>
                    </div>
                    <script>
                        window.calculateAge = function() {
                            const birth = new Date(document.getElementById('birthDate').value);
                            const current = new Date(document.getElementById('currentDate').value);
                            
                            let years = current.getFullYear() - birth.getFullYear();
                            let months = current.getMonth() - birth.getMonth();
                            let days = current.getDate() - birth.getDate();
                            
                            if (days < 0) {
                                months--;
                                days += new Date(current.getFullYear(), current.getMonth(), 0).getDate();
                            }
                            if (months < 0) {
                                years--;
                                months += 12;
                            }
                            
                            document.getElementById('ageResult').textContent = years + ' বছর, ' + months + ' মাস, ' + days + ' দিন';
                        };
                    <\/script>
                </div>
            `;
        }

        function createPercentageCalculator() {
            return `
                <div class="space-y-4">
                    <h3 class="text-xl font-bold text-gray-900">📊 Percentage Calculator</h3>
                    <div class="grid md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">মোট মান</label>
                            <input type="number" id="percentTotal" class="w-full p-3 border rounded-lg" placeholder="যেমন: 500">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">শতাংশ (%)</label>
                            <input type="number" id="percentValue" class="w-full p-3 border rounded-lg" placeholder="যেমন: 25">
                        </div>
                        <div class="flex items-end">
                            <button onclick="calculatePercentage()" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">গণনা করুন</button>
                        </div>
                    </div>
                    <div class="result-box text-center">
                        <p id="percentResult" class="text-2xl font-bold text-gray-900"></p>
                    </div>
                    <script>
                        window.calculatePercentage = function() {
                            const total = parseFloat(document.getElementById('percentTotal').value);
                            const percent = parseFloat(document.getElementById('percentValue').value);
                            const result = (total * percent) / 100;
                            document.getElementById('percentResult').textContent = percent + '% of ' + total + ' = ' + result;
                        };
                    <\/script>
                </div>
            `;
        }

        // ============================================
        // সম্পর্কিত টুলস লোড (ফিক্সড)
        // ============================================
        async function loadRelatedTools(category) {
            try {
                debugLog('সম্পর্কিত টুলস লোড হচ্ছে:', category);
                
                const relatedTools = await fetchRelatedTools(category, 3);
                
                const relatedContainer = document.getElementById('relatedTools');
                relatedContainer.innerHTML = '';
                
                if (relatedTools.length === 0) {
                    relatedContainer.innerHTML = '<p class="text-gray-500">কোনো সম্পর্কিত টুল পাওয়া যায়নি</p>';
                    return;
                }
                
                relatedTools.forEach(tool => {
                    const card = document.createElement('a');
                    card.href = `/tool.html?slug=${tool.slug}`;
                    card.className = 'bg-white rounded-xl shadow-sm border border-gray-100 p-5 tool-card-hover block';
                    card.innerHTML = `
                        <span class="text-3xl mb-3 block">${tool.icon || '🔧'}</span>
                        <h3 class="font-semibold text-gray-900">${tool.name}</h3>
                        <p class="text-sm text-gray-500 mt-1 line-clamp-2">${tool.description || ''}</p>
                    `;
                    relatedContainer.appendChild(card);
                });
                
                debugLog('সম্পর্কিত টুলস লোড হয়েছে:', relatedTools.length);
                
            } catch (error) {
                debugError('সম্পর্কিত টুলস লোড করতে ব্যর্থ:', error);
            }
        }

        // ============================================
        // পেজ লোড হলে টুল লোড করা
        // ============================================
        document.addEventListener('DOMContentLoaded', () => {
            debugLog('পেজ লোড হয়েছে');
            
            const slug = getToolSlugFromUrl();
            
            if (slug) {
                debugLog('টুল স্লাগ পাওয়া গেছে:', slug);
                loadTool(slug);
            } else {
                debugLog('কোনো স্লাগ পাওয়া যায়নি, সব টুল পেজে রিডাইরেক্ট');
                window.location.href = '/tools.html';
            }
        });

        // গ্লোবাল এরর হ্যান্ডলিং
        window.addEventListener('error', (event) => {
            debugError('গ্লোবাল এরর:', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            debugError('আনহ্যান্ডেল্ড প্রমিজ রিজেকশন:', event.reason);
        });
    </script>
</body>
</html>
