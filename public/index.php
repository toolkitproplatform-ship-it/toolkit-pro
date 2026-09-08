# public/index.php ফাইল তৈরি করুন
cat > public/index.php << 'EOF'
<?php
/**
 * Toolkit Pro - Application Entry Point
 */

// Error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Load environment variables
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

// Load configuration
require_once __DIR__ . '/../config/app.php';

// Load core classes
require_once __DIR__ . '/../core/Application.php';
require_once __DIR__ . '/../core/Router.php';
require_once __DIR__ . '/../core/Request.php';
require_once __DIR__ . '/../core/Response.php';

// Initialize application
$app = new Core\Application();

// Load routes
require_once __DIR__ . '/../routes/web.php';
require_once __DIR__ . '/../routes/api.php';

// Run application
$app->run();
EOF

echo "✅ public/index.php ফাইল তৈরি হয়েছে"
