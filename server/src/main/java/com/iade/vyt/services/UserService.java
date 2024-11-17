package com.iade.vyt.services;

import com.iade.vyt.exceptions.EtAuthException;
import com.iade.vyt.models.User;

public interface UserService {
    User validateUser(String email, String password)throws EtAuthException;
    User registerUser(String user_name, String email, String password_hash) throws EtAuthException;
}
