package com.iade.vyt.services;

import com.iade.vyt.exceptions.EtAuthException;
import com.iade.vyt.models.User;
import com.iade.vyt.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public User validateUser(String email, String password) throws EtAuthException {
        if (email != null) email = email.toLowerCase();
        return userRepository.findByEmailAndPassword(email, password);
    }

    @Override
    public User registerUser(String user_name, String email, String password_hash) throws EtAuthException {
        System.out.println("Registering user: " + user_name + ", Email: " + email);
        Pattern pattern = Pattern.compile("^(.+)@(.+)$");
        if (email != null) email = email.toLowerCase();
        if (!pattern.matcher(email).matches())
            throw new EtAuthException("Invalid email format");
        Integer count = userRepository.getCountByEmail(email);
        if (count > 0)
            throw new EtAuthException("Email already in use");
        Integer userId = userRepository.create(user_name, email, password_hash);
        System.out.println("User created with ID: " + userId);
        return userRepository.findById(userId);
    }

}

