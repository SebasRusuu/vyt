package com.iade.vyt.services;

import com.iade.vyt.models.User;
import com.iade.vyt.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User validateUser(String email, String rawPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verifica a senha usando BCrypt
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Senha incorreta");
        }

        return user;
    }



    public User registerUser(String userName, String email, String rawPassword) {
        if (rawPassword == null || rawPassword.isEmpty()) {
            throw new IllegalArgumentException("A senha não pode ser nula ou vazia");
        }

        String encryptedPassword = passwordEncoder.encode(rawPassword);

        User newUser = new User();
        newUser.setUserName(userName);
        newUser.setEmail(email);
        newUser.setPassword(encryptedPassword);
        newUser.setProvider("local");

        return userRepository.save(newUser);
    }

}
