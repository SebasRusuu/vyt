package com.iade.vyt.utils;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import javax.crypto.SecretKey;
import java.util.Base64;

public class GenerateJwtKey {
    public static void main(String[] args) {
        // Gera uma chave secreta para o algoritmo HS512
        SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

        // Converte a chave para Base64
        String encodedKey = Base64.getEncoder().encodeToString(key.getEncoded());

        // Imprime a chave gerada
        System.out.println("Generated Key: " + encodedKey);
    }
}

//Para compilar faz:
//mvn compile
//javac
