# core/Request.php ফাইল তৈরি করুন
cat > core/Request.php << 'EOF'
<?php
namespace Core;

/**
 * HTTP Request Class
 */
class Request
{
    private $method;
    private $path;
    private $query;
    private $body;
    private $headers;
    private $files;
    private $params;
    
    public function __construct()
    {
        $this->method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
        $this->path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
        $this->query = $_GET;
        $this->body = $this->parseBody();
        $this->headers = $this->parseHeaders();
        $this->files = $_FILES;
        $this->params = [];
    }
    
    private function parseBody()
    {
        $rawBody = file_get_contents('php://input');
        
        if (empty($rawBody)) {
            return $_POST;
        }
        
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (strpos($contentType, 'application/json') !== false) {
            $json = json_decode($rawBody, true);
            return $json ?? [];
        }
        
        if (strpos($contentType, 'application/x-www-form-urlencoded') !== false) {
            parse_str($rawBody, $data);
            return $data;
        }
        
        return $rawBody;
    }
    
    private function parseHeaders()
    {
        $headers = [];
        
        foreach ($_SERVER as $key => $value) {
            if (strpos($key, 'HTTP_') === 0) {
                $header = str_replace('_', '-', substr($key, 5));
                $headers[$header] = $value;
            }
        }
        
        return $headers;
    }
    
    public function getMethod()
    {
        return $this->method;
    }
    
    public function getPath()
    {
        return $this->path;
    }
    
    public function getQuery($key = null, $default = null)
    {
        if ($key === null) {
            return $this->query;
        }
        
        return $this->query[$key] ?? $default;
    }
    
    public function getBody($key = null, $default = null)
    {
        if ($key === null) {
            return $this->body;
        }
        
        return $this->body[$key] ?? $default;
    }
    
    public function getHeader($key, $default = null)
    {
        return $this->headers[$key] ?? $default;
    }
    
    public function getFile($key)
    {
        return $this->files[$key] ?? null;
    }
    
    public function setParam($key, $value)
    {
        $this->params[$key] = $value;
    }
    
    public function getParam($key, $default = null)
    {
        return $this->params[$key] ?? $default;
    }
    
    public function getToken()
    {
        $authorization = $this->getHeader('Authorization');
        
        if ($authorization && strpos($authorization, 'Bearer ') === 0) {
            return substr($authorization, 7);
        }
        
        return null;
    }
    
    public function getIp()
    {
        return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    }
    
    public function getUserAgent()
    {
        return $_SERVER['HTTP_USER_AGENT'] ?? '';
    }
    
    public function isAjax()
    {
        return $this->getHeader('X-Requested-With') === 'XMLHttpRequest';
    }
    
    public function isSecure()
    {
        return isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    }
}
EOF

echo "✅ core/Request.php ফাইল তৈরি হয়েছে"
