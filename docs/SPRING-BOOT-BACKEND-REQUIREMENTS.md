# Spring Boot Backend Requirements for Axiom-frontend Branch

This document outlines the exact requirements the Spring Boot backend must meet for the `Axiom-frontend` branch to work correctly.

## Base Configuration

### Server Port
```properties
# application.properties
server.port=8080
```

### API Prefix
All endpoints must be prefixed with `/api`:
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // endpoints here
}
```

## CORS Configuration

The backend MUST allow CORS with credentials from the frontend:

```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:3000") // Frontend URL
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowCredentials(true)
                    .allowedHeaders("*")
                    .exposedHeaders("Set-Cookie");
            }
        };
    }
}
```

For production, update `allowedOrigins` to include production frontend URL.

## Response Format

### Standard Success Response
```java
public class ApiResponse<T> {
    private String status;  // "success" or "error"
    private T data;
    private String message;
    private LocalDateTime timestamp;
    
    // Constructor for success
    public static <T> ApiResponse<T> success(T data, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setStatus("success");
        response.setData(data);
        response.setMessage(message);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }
}
```

### Standard Error Response
```java
public class ErrorResponse {
    private String status = "error";
    private String message;
    private List<String> errors;
    private LocalDateTime timestamp;
    private String path;
    
    // Constructor
    public ErrorResponse(String message, List<String> errors, String path) {
        this.message = message;
        this.errors = errors;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
```

### Global Exception Handler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleException(
            Exception ex, 
            HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
            ex.getMessage(),
            Arrays.asList(ex.getMessage()),
            request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        List<String> errors = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .collect(Collectors.toList());
            
        ErrorResponse error = new ErrorResponse(
            "Validation failed",
            errors,
            request.getRequestURI()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

## Required Authentication Endpoints

### 1. Get Current User
```java
@GetMapping("/api/auth/me")
public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(HttpSession session) {
    User user = (User) session.getAttribute("user");
    if (user == null) {
        return ResponseEntity.ok(ApiResponse.success(null, "No user authenticated"));
    }
    return ResponseEntity.ok(ApiResponse.success(userToDTO(user), "User retrieved"));
}
```

**Response Format:**
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "university": "Example University"
  },
  "message": "User retrieved",
  "timestamp": "2024-01-01T00:00:00"
}
```

### 2. Login with Email/Password
```java
@PostMapping("/api/auth/login")
public ResponseEntity<ApiResponse<UserDTO>> login(@RequestBody LoginRequest request, HttpSession session) {
    // Validate credentials
    User user = authService.authenticate(request.getEmail(), request.getPassword());
    
    if (user == null) {
        throw new BadCredentialsException("Invalid email or password");
    }
    
    // Store user in session
    session.setAttribute("user", user);
    
    return ResponseEntity.ok(ApiResponse.success(userToDTO(user), "Login successful"));
}
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response Format:**
```json
{
  "status": "success",
  "data": {
    "id": "123",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "message": "Login successful",
  "timestamp": "2024-01-01T00:00:00"
}
```

### 3. Register
```java
@PostMapping("/api/auth/register")
public ResponseEntity<ApiResponse<UserDTO>> register(@Valid @RequestBody RegisterRequest request, HttpSession session) {
    // Check if user exists
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new UserAlreadyExistsException("User with this email already exists");
    }
    
    // Create user
    User user = authService.createUser(request);
    
    // Auto-login after registration
    session.setAttribute("user", user);
    
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(ApiResponse.success(userToDTO(user), "Registration successful"));
}
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "user@example.com",
  "password": "password123",
  "university": "Example University"
}
```

### 4. Logout
```java
@PostMapping("/api/auth/logout")
public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
    session.invalidate();
    return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
}
```

**Response Format:**
```json
{
  "status": "success",
  "data": null,
  "message": "Logged out successfully",
  "timestamp": "2024-01-01T00:00:00"
}
```

### 5. Google OAuth - Start Flow
```java
@GetMapping("/api/auth/google")
public void googleLogin(HttpServletResponse response) throws IOException {
    String googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth?" +
        "client_id=" + googleClientId +
        "&redirect_uri=" + googleRedirectUri +
        "&response_type=code" +
        "&scope=openid%20email%20profile";
    
    response.sendRedirect(googleAuthUrl);
}
```

### 6. Google OAuth - Callback
```java
@GetMapping("/api/auth/google/callback")
public void googleCallback(
        @RequestParam String code,
        HttpSession session,
        HttpServletResponse response) throws IOException {
    
    // Exchange code for tokens
    GoogleTokenResponse tokenResponse = exchangeCodeForTokens(code);
    
    // Get user info from Google
    GoogleUserInfo userInfo = getUserInfoFromGoogle(tokenResponse.getAccessToken());
    
    // Find or create user
    User user = authService.findOrCreateGoogleUser(userInfo);
    
    // Store in session
    session.setAttribute("user", user);
    
    // Redirect back to frontend
    response.sendRedirect("http://localhost:3000/");
}
```

### 7. Forgot Password
```java
@PostMapping("/api/auth/forgot-password")
public ResponseEntity<ApiResponse<Void>> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    authService.sendPasswordResetEmail(request.getEmail());
    return ResponseEntity.ok(ApiResponse.success(null, "Password reset email sent"));
}
```

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### 8. Reset Password
```java
@PostMapping("/api/auth/reset-password")
public ResponseEntity<ApiResponse<Void>> resetPassword(@RequestBody ResetPasswordRequest request) {
    authService.resetPassword(request.getToken(), request.getPassword());
    return ResponseEntity.ok(ApiResponse.success(null, "Password reset successful"));
}
```

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "password": "newpassword123"
}
```

## Session Configuration

```java
@Configuration
public class SessionConfig {
    @Bean
    public HttpSessionIdResolver httpSessionIdResolver() {
        return HeaderHttpSessionIdResolver.xAuthToken();
    }
}
```

Or use cookie-based sessions (recommended):
```properties
# application.properties
server.servlet.session.cookie.http-only=true
server.servlet.session.cookie.secure=true # For production HTTPS
server.servlet.session.cookie.same-site=lax
server.servlet.session.timeout=30m
```

## Security Configuration

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable() // Or configure CSRF for Spring Boot
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            );
        
        return http.build();
    }
}
```

## Testing Checklist

- [ ] Backend runs on port 8080
- [ ] All endpoints have `/api` prefix
- [ ] CORS allows `http://localhost:3000` with credentials
- [ ] GET `/api/auth/me` returns current user or null
- [ ] POST `/api/auth/login` accepts email/password and returns user
- [ ] POST `/api/auth/register` creates user and returns user
- [ ] POST `/api/auth/logout` invalidates session
- [ ] GET `/api/auth/google` redirects to Google OAuth
- [ ] GET `/api/auth/google/callback` handles OAuth code and redirects to frontend
- [ ] POST `/api/auth/forgot-password` sends reset email
- [ ] POST `/api/auth/reset-password` resets password
- [ ] Sessions persist across requests
- [ ] Error responses follow standard format

## Environment Variables

```properties
# Google OAuth
google.client.id=your-client-id
google.client.secret=your-client-secret
google.redirect.uri=http://localhost:8080/api/auth/google/callback

# Frontend URL
frontend.url=http://localhost:3000

# Email (for password reset)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

## Example Test with cURL

```bash
# Test login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Test getting current user (with session cookie)
curl http://localhost:8080/api/auth/me \
  -b cookies.txt

# Test logout
curl -X POST http://localhost:8080/api/auth/logout \
  -b cookies.txt
```

## Contact

If you have questions about these requirements, contact the frontend team working on the `Axiom-frontend` branch.
