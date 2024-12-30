// Constants.java
package com.iade.vyt;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.concurrent.TimeUnit;

@Component
@Getter
public class Constants {

    private final SecretKey apiSecretKey;
    private final long tokenValidity;

    public Constants(
            @Value("${TOKEN_VALIDITY_HOURS:2}") long validityHours
    ) {
        this.apiSecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
        this.tokenValidity = TimeUnit.HOURS.toMillis(validityHours);
    }
}
