package com.iade.vyt.services;

import com.iade.vyt.exceptions.EtAuthException;
import com.iade.vyt.models.User;
import com.iade.vyt.repositories.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public User validateUser(String email, String password) throws EtAuthException {
        try {
            if (email != null) email = email.toLowerCase();
            return userRepository.findByEmailAndPassword(email, password);
        } catch (DataAccessException e) {
            // Handle database connection exception
            throw new EtAuthException("Database connection error", e);
        }
    }

    @Override
    public User registerUser(String user_name, String email, String password_hash) throws EtAuthException {
        try {

            Pattern pattern = Pattern.compile("^(.+)@(.+)$");
            if (email != null) email = email.toLowerCase();
            if (!pattern.matcher(email).matches())
                throw new EtAuthException("Invalid email format");

            Integer count = userRepository.getCountByEmail(email);
            if (count != null && count > 0)
                throw new EtAuthException("Email already in use");

            Integer userId = userRepository.create(user_name, email, password_hash);
            // logger.info("User created with ID: {}", userId);

            return userRepository.findById(userId);
        } catch (DataAccessException e) {
            // Handle database connection exception
            throw new EtAuthException("Database connection error", e);
        }
    }
}
