package com.iade.vyt.controlers;

import com.iade.vyt.models.User;
import com.iade.vyt.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;
    @PostMapping("/register")
    public final ResponseEntity<Map<String, String >> registerUser(@RequestBody Map<String, Object> userMap) {
        String user_name = (String) userMap.get("user_name");
        String email = (String) userMap.get("email");
        String password_hash = (String) userMap.get("password_hash");
        User user = userService.registerUser(user_name, email, password_hash);
        Map<String, String> map = new HashMap<>();
        map.put("message", "User registered successfully");
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
    @GetMapping("/test")
    public String test() {
        return "Controller is working!";
    }

}
