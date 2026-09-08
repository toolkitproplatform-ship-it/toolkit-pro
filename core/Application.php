# core/Application.php ফাইল তৈরি করুন
cat > core/Application.php << 'EOF'
<?php
namespace Core;

/**
 * Main Application Class
 */
class Application
{
    private static $instance = null;
    private $router;
    private $request;
    private $response;
    private $database;
    
    private function __construct()
    {
        $this->router = new Router();
        $this->request = new Request();
        $this->response = new Response();
        $this->database = Database::getInstance();
    }
    
    public static function getInstance()
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    public function run()
    {
        try {
            $route = $this->router->resolve($this->request);
            $response = $route->execute();
            $this->response->send($response);
        } catch (\Exception $e) {
            $this->handleException($e);
        }
    }
    
    public function getRouter()
    {
        return $this->router;
    }
    
    public function getRequest()
    {
        return $this->request;
    }
    
    public function getResponse()
    {
        return $this->response;
    }
    
    public function getDatabase()
    {
        return $this->database;
    }
    
    private function handleException(\Exception $e)
    {
        if ($_ENV['APP_DEBUG'] === 'true') {
            echo '<h1>Error: ' . $e->getMessage() . '</h1>';
            echo '<pre>' . $e->getTraceAsString() . '</pre>';
        } else {
            $this->response->json([
                'error' => 'Internal Server Error'
            ], 500);
        }
        
        // Log error
        Logger::error($e->getMessage(), [
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]);
    }
}
EOF

echo "✅ core/Application.php ফাইল তৈরি হয়েছে"
