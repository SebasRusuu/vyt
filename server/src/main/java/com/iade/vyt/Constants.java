package com.iade.vyt;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.concurrent.TimeUnit;

@Component
public class Constants {
    @Getter
    private SecretKey apiSecretKey;

    @Getter
    private long tokenValidity;

    @Value("${token.validity.hours:2}")
    private long validityHours;

    @PostConstruct
    public void init() {
        apiSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        tokenValidity = TimeUnit.HOURS.toMillis(validityHours);
    }
}