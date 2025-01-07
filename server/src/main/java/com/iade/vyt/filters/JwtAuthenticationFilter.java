package com.iade.vyt.filters;

import com.iade.vyt.models.User;
import com.iade.vyt.repositories.UserRepository;
import com.iade.vyt.services.JwtTokenProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, UserRepository userRepository) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String path = request.getRequestURI();

        // Ignorar endpoints do OAuth2
        if (path.startsWith("/oauth2/") || path.equals("/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = getTokenFromRequest(request);
        System.out.println("Token recebido no filtro: " + token);

        if (token != null && jwtTokenProvider.validateToken(token)) {
            String email = jwtTokenProvider.getUsernameFromToken(token);
            System.out.println("Token válido. Email extraído: " + email);

            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                System.out.println("Usuário encontrado. ID: " + user.getUserId());
                request.setAttribute("user_id", user.getUserId()); // Adicionar user_id ao request

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authentication); // Associar ao SecurityContext
            } else {
                System.out.println("Usuário não encontrado no banco de dados.");
            }
        } else {
            System.out.println("Token inválido ou não encontrado.");
        }

        filterChain.doFilter(request, response);
    }



    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (bearerToken != null && bearerToken.startsWith("Bearer ")) ? bearerToken.substring(7) : null;
    }
}
