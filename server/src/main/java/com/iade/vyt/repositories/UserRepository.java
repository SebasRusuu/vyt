package com.iade.vyt.repositories;

import com.iade.vyt.exceptions.EtAuthException;
import com.iade.vyt.models.User;

import java.util.Optional;

public interface UserRepository {
    Integer create(String user_name, String email, String password_hash) throws EtAuthException;

    User findByEmailAndPassword(String email, String password) throws EtAuthException;

    Integer getCountByEmail(String email);

    Optional<User> findById(Integer userId);
}
