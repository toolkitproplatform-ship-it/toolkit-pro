# core/Response.php ফাইল তৈরি করুন
cat > core/Response.php << 'EOF'
<?php
namespace Core;

/**
 * HTTP Response Class
 */
class Response
{
    private $statusCode = 200;
    private $headers = [];
    private $content;
    
    public function __construct($content = '', $statusCode = 200)
    {
        $this->content = $content;
        $this->statusCode = $statusCode;
        
        $this->setHeader('Content-Type', 'text/html; charset=utf-8');
    }
    
    public function setStatusCode($code)
    {
        $this->statusCode = $code;
        return $this;
    }
    
    public function getStatusCode()
    {
        return $this->statusCode;
    }
    
    public function setHeader($key, $value)
    {
        $this->headers[$key] = $value;
        return $this;
    }
    
    public function getHeaders()
    {
        return $this->headers;
    }
    
    public function setContent($content)
    {
        $this->content = $content;
        return $this;
    }
    
    public function getContent()
    {
        return $this->content;
    }
    
    public function json($data, $statusCode = 200)
    {
        $this->setHeader('Content-Type', 'application/json; charset=utf-8');
        $this->statusCode = $statusCode;
        $this->content = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        
        return $this;
    }
    
    public function redirect($url, $statusCode = 302)
    {
        $this->setHeader('Location', $url);
        $this->statusCode = $statusCode;
        
        return $this;
    }
    
    public function send()
    {
        http_response_code($this->statusCode);
        
        foreach ($this->headers as $key => $value) {
            header("{$key}: {$value}");
        }
        
        echo $this->content;
    }
    
    public static function success($data = [], $message = 'Success', $statusCode = 200)
    {
        $response = new self();
        return $response->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $statusCode);
    }
    
    public static function error($message = 'Error', $statusCode = 400, $errors = [])
    {
        $response = new self();
        return $response->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], $statusCode);
    }
}
EOF

echo "✅ core/Response.php ফাইল তৈরি হয়েছে"
