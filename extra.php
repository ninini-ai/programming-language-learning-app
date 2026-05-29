<?php
declare(strict_types=1);

/*
|--------------------------------------------------------------------------
| CONFIG
|--------------------------------------------------------------------------
*/
define('DB_HOST', 'localhost');
define('DB_NAME', 'test_db');
define('DB_USER', 'root');
define('DB_PASS', '');
session_start();

/*
|--------------------------------------------------------------------------
| AUTOLOADER
|--------------------------------------------------------------------------
*/
spl_autoload_register(function ($class) {
    if (class_exists($class)) return;
});

/*
|--------------------------------------------------------------------------
| DATABASE (Singleton)
|--------------------------------------------------------------------------
*/
class Database {
    private static ?PDO $instance = null;

    private function __construct() {}

    public static function getInstance(): PDO {
        if (self::$instance === null) {
            self::$instance = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME,
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]
            );
        }
        return self::$instance;
    }
}

/*
|--------------------------------------------------------------------------
| REQUEST & RESPONSE
|--------------------------------------------------------------------------
*/
class Request {
    public function method(): string {
        return $_SERVER['REQUEST_METHOD'];
    }

    public function uri(): string {
        return parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    }

    public function input(string $key, $default = null) {
        return $_POST[$key] ?? $_GET[$key] ?? $default;
    }
}

class Response {
    public static function json(array $data, int $code = 200): void {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}

/*
|--------------------------------------------------------------------------
| CSRF PROTECTION
|--------------------------------------------------------------------------
*/
class CSRF {
    public static function token(): string {
        if (!isset($_SESSION['_csrf'])) {
            $_SESSION['_csrf'] = bin2hex(random_bytes(32));
        }
        return $_SESSION['_csrf'];
    }

    public static function verify(string $token): bool {
        return hash_equals($_SESSION['_csrf'] ?? '', $token);
    }
}

/*
|--------------------------------------------------------------------------
| AUTH SERVICE
|--------------------------------------------------------------------------
*/
class AuthService {
    private PDO $db;
    public function __construct(PDO $db) {
        $this->db = $db;
    }
    public function register(string $email, string $password): bool {
        $stmt = $this->db->prepare(
            "INSERT INTO users (email, password) VALUES (?, ?)"
        );
        return $stmt->execute([
            $email,
            password_hash($password, PASSWORD_BCRYPT)]);
    }
    public function login(string $email, string $password): bool {
        $stmt = $this->db->prepare(
            "SELECT * FROM users WHERE email = ?" );
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            return true;
        }
        return false;
    }
    public function check(): bool {
        return isset($_SESSION['user_id']);
    }
}
class AuthMiddleware {
    public function handle(): void {
        if (!isset($_SESSION['user_id'])) {
            Response::json(['error' => 'Unauthorized'], 401);
        }
    }}
class UserController {
    private AuthService $auth;

    public function __construct(AuthService $auth) {
        $this->auth = $auth;
    }
    public function register(Request $request): void {
        if (!CSRF::verify($request->input('_csrf'))) {
            Response::json(['error' => 'Invalid CSRF token'], 403);
        }
        $success = $this->auth->register(
            $request->input('email'),
            $request->input('password')
        );
        Response::json(['registered' => $success]);
    }
    public function login(Request $request): void {
        $success = $this->auth->login(
            $request->input('email'),
            $request->input('password')
        );
        Response::json(['logged_in' => $success]);
    }
    public function dashboard(): void {
        Response::json(['message' => 'Welcome to dashboard']);
    }
}

class Router {
    private array $routes = [];

    public function add(string $method, string $uri, callable $action, array $middleware = []): void {
        $this->routes[] = compact('method', 'uri', 'action', 'middleware');
    }

    public function dispatch(Request $request): void {
        foreach ($this->routes as $route) {
            if (
                $route['method'] === $request->method() &&
                $route['uri'] === $request->uri()
            ) {
                foreach ($route['middleware'] as $mw) {
                    (new $mw())->handle();
                }
                call_user_func($route['action'], $request);
                return;
            }
        }
        Response::json(['error' => 'Route not found'], 404);
    }
}

$db = Database::getInstance();
$authService = new AuthService($db);
$userController = new UserController($authService);
$request = new Request();
$router = new Router();

$router->add('POST', '/register', [$userController, 'register']);
$router->add('POST', '/login', [$userController, 'login']);
$router->add(
    'GET',
    '/dashboard',
    [$userController, 'dashboard'],
    [AuthMiddleware::class]
);

$router->dispatch($request);
