package com.iade.vyt.controlers;

import com.iade.vyt.Constants;
import com.iade.vyt.models.User;
import com.iade.vyt.services.UserService;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
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

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, Object> userMap) {
        String email = (String) userMap.get("email");
        String password = (String) userMap.get("password_hash");
        User user = userService.validateUser(email, password);
        return new ResponseEntity<>(generateJWTToken(user), HttpStatus.OK);
    }

    @PostMapping("/register")
    public final ResponseEntity<Map<String, String >> registerUser(@RequestBody Map<String, Object> userMap) {
        String user_name = (String) userMap.get("user_name");
        String email = (String) userMap.get("email");
        String password_hash = (String) userMap.get("password_hash");
        User user = userService.registerUser(user_name, email, password_hash);
        return new ResponseEntity<>(generateJWTToken(user), HttpStatus.OK);
    }

    private Map<String, String> generateJWTToken(User user) {
        long timestamp = System.currentTimeMillis();
        String token = Jwts.builder()
                .signWith(Constants.API_SECRET_KEY) // Use the secure key
                .setIssuedAt(new Date(timestamp))
                .setExpiration(new Date(timestamp + Constants.TOKEN_VALIDITY))
                .claim("user_id", user.getUserId())
                .claim("email", user.getEmail())
                .claim("user_name", user.getUserName())
                .compact();
        Map<String, String> map = new HashMap<>();
        map.put("token", token);
        return map;
    }


    @GetMapping("/test")
    public String test() {
        return "Controller is working!";
    }

}
