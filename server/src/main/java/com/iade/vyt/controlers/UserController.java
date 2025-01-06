package com.iade.vyt.controlers;

import com.iade.vyt.exceptions.InvalidCredentialsException;
import com.iade.vyt.models.AuthResponse;
import com.iade.vyt.models.LoginRequest;
import com.iade.vyt.models.User;
import com.iade.vyt.repositories.UserRepository;
import com.iade.vyt.services.JwtTokenProvider;
import com.iade.vyt.services.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletResponse;


import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class UserController {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final UserRepository userRepository;


    public UserController(JwtTokenProvider jwtTokenProvider, UserService userService, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.validateUser(loginRequest.getEmail(), loginRequest.getPassword());
            String token = jwtTokenProvider.generateToken(user.getEmail(), user.getUserName()); // Passa o nome do usuário
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (InvalidCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }




    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody Map<String, String> userMap) {
        try {
            // Verifique se os campos estão sendo enviados
            String userName = userMap.get("userName");
            String email = userMap.get("email");
            String password = userMap.get("password");

            if (userName == null || email == null || password == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Todos os campos (userName, email, password) são obrigatórios.");
            }

            userService.registerUser(userName, email, password);
            return ResponseEntity.status(HttpStatus.CREATED).body("Usuário registrado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro no registro: " + e.getMessage());
        }
    }



    @GetMapping("/oauth2-success")
    public ResponseEntity<Void> oauth2Success(Authentication authentication, HttpServletResponse response) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = authentication.getName();
        String name = null;

        if (authentication instanceof OAuth2AuthenticationToken) {
            OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
            Map<String, Object> attributes = oauthToken.getPrincipal().getAttributes();
            email = (String) attributes.get("email");
            name = (String) attributes.get("name");
        }

        // Verifique ou registre o usuário
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setUserName(name != null ? name : email);
            user.setPassword(null); // Login Google não precisa de senha
            user.setProvider("google");
            userRepository.save(user);
        }

        // Gere o token JWT com o nome do usuário
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getUserName());

        try {
            response.sendRedirect("http://localhost:3000/?token=" + token);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        return ResponseEntity.ok().build();
    }


}
