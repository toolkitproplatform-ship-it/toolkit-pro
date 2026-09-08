# core/Router.php ফাইল তৈরি করুন
cat > core/Router.php << 'EOF'
<?php
namespace Core;

/**
 * Router Class
 */
class Router
{
    private $routes = [];
    private $middleware = [];
    private $groupPrefix = '';
    private $groupMiddleware = [];
    
    public function get($path, $handler, $middleware = [])
    {
        $this->addRoute('GET', $path, $handler, $middleware);
    }
    
    public function post($path, $handler, $middleware = [])
    {
        $this->addRoute('POST', $path, $handler, $middleware);
    }
    
    public function put($path, $handler, $middleware = [])
    {
        $this->addRoute('PUT', $path, $handler, $middleware);
    }
    
    public function delete($path, $handler, $middleware = [])
    {
        $this->addRoute('DELETE', $path, $handler, $middleware);
    }
    
    public function patch($path, $handler, $middleware = [])
    {
        $this->addRoute('PATCH', $path, $handler, $middleware);
    }
    
    private function addRoute($method, $path, $handler, $middleware = [])
    {
        $path = $this->groupPrefix . $path;
        $middleware = array_merge($this->groupMiddleware, $middleware);
        
        $this->routes[] = [
            'method' => $method,
            'path' => $path,
            'handler' => $handler,
            'middleware' => $middleware
        ];
    }
    
    public function group($prefix, $callback, $middleware = [])
    {
        $previousPrefix = $this->groupPrefix;
        $previousMiddleware = $this->groupMiddleware;
        
        $this->groupPrefix .= $prefix;
        $this->groupMiddleware = array_merge($this->groupMiddleware, $middleware);
        
        $callback($this);
        
        $this->groupPrefix = $previousPrefix;
        $this->groupMiddleware = $previousMiddleware;
    }
    
    public function resolve(Request $request)
    {
        $method = $request->getMethod();
        $path = $request->getPath();
        
        foreach ($this->routes as $route) {
            $pattern = $this->convertToPattern($route['path']);
            
            if ($route['method'] === $method && preg_match($pattern, $path, $matches)) {
                // Extract parameters
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                
                // Run middleware
                foreach ($route['middleware'] as $middlewareClass) {
                    $middleware = new $middlewareClass();
                    $result = $middleware->handle($request);
                    
                    if ($result !== true) {
                        return $result;
                    }
                }
                
                return [
                    'handler' => $route['handler'],
                    'params' => $params
                ];
            }
        }
        
        throw new \Exception('Route not found', 404);
    }
    
    private function convertToPattern($path)
    {
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $path);
        return '#^' . $pattern . '$#';
    }
    
    public function getRoutes()
    {
        return $this->routes;
    }
}
EOF

echo "✅ core/Router.php ফাইল তৈরি হয়েছে"
