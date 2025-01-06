package com.iade.vyt.services;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        // Extraia os atributos do usuário
        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Exemplo de atributos retornados pelo Google
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        System.out.println("Email: " + email);
        System.out.println("Name: " + name);

        return oAuth2User;
    }
}
