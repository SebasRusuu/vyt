package com.iade.vyt;

import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;

public class Constants {
    public final static SecretKey API_SECRET_KEY = Keys.secretKeyFor(io.jsonwebtoken.SignatureAlgorithm.HS256);

    public final static long TOKEN_VALIDITY = 2 * 60 * 60 * 1000; // 2 hours
}
