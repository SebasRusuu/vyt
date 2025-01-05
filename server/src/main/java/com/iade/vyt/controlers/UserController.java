    package com.iade.vyt.controlers;

    import com.iade.vyt.Constants;
    import com.iade.vyt.exceptions.EtAuthException;
    import com.iade.vyt.models.User;
    import com.iade.vyt.services.UserService;
    import io.jsonwebtoken.Claims;
    import io.jsonwebtoken.Jwts;
    import io.jsonwebtoken.SignatureAlgorithm;
    import jakarta.servlet.http.HttpServletRequest;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.util.Date;
    import java.util.HashMap;
    import java.util.Map;

    @RestController
    @RequestMapping("/api/user")
    public class UserController {

        @Autowired
        private UserService userService;

        @Autowired
        private Constants constants;

        @PostMapping("/login")
        public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, Object> userMap) {
            String email = (String) userMap.get("email");
            String password = (String) userMap.get("password_hash");
            User user = userService.validateUser(email, password);
            return new ResponseEntity<>(generateJWTToken(user), HttpStatus.OK);
        }

        @PostMapping("/register")
        public ResponseEntity<String> registerUser(@RequestBody Map<String, Object> userMap) {
            try {
                String email = (String) userMap.get("email");
                String user_name = (String) userMap.get("user_name");
                String password_hash = (String) userMap.get("password_hash");

                userService.registerUser(user_name, email, password_hash);
                return new ResponseEntity<>("Usuário registrado com sucesso", HttpStatus.CREATED);
            } catch (EtAuthException e) {
                return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
            } catch (Exception e) {
                return new ResponseEntity<>("Erro no registo: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }




        private Map<String, String> generateJWTToken(User user) {
            long timestamp = System.currentTimeMillis();
            String token = Jwts.builder()
                    .signWith(constants.getApiSecretKey(), SignatureAlgorithm.HS256) // Certifique-se de que o algoritmo está correto
                    .setIssuedAt(new Date(timestamp))
                    .setExpiration(new Date(timestamp + constants.getTokenValidity()))
                    .claim("user_id", user.getUserId())
                    .claim("email", user.getEmail())
                    .claim("user_name", user.getUserName())
                    .compact();
            Map<String, String> map = new HashMap<>();
            map.put("token", token);
            return map;
        }

        @GetMapping("/validate-token")
        public ResponseEntity<?> validateToken(HttpServletRequest request) {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    Claims claims = Jwts.parserBuilder()
                            .setSigningKey(constants.getApiSecretKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody();

                    Integer userId = claims.get("user_id", Integer.class);
                    User user = userService.findById(userId);
                    if (user != null) {
                        return new ResponseEntity<>(HttpStatus.OK);
                    } else {
                        return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                    }
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
            }
        }


        @GetMapping("/test")
        public String test() {
            return "Controller is working!";
        }
    }