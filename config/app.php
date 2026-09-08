# config/app.php ফাইল তৈরি করুন
cat > config/app.php << 'EOF'
<?php
/**
 * Application Configuration
 */

return [
    'name' => $_ENV['APP_NAME'] ?? 'Toolkit Pro',
    'env' => $_ENV['APP_ENV'] ?? 'production',
    'debug' => filter_var($_ENV['APP_DEBUG'] ?? false, FILTER_VALIDATE_BOOLEAN),
    'url' => $_ENV['APP_URL'] ?? 'http://localhost:8000',
    'timezone' => $_ENV['APP_TIMEZONE'] ?? 'UTC',
    'key' => $_ENV['APP_KEY'] ?? '',
    
    'providers' => [
        // Service Providers
    ],
    
    'aliases' => [
        // Class Aliases
    ],
];
EOF

echo "✅ config/app.php ফাইল তৈরি হয়েছে"
