package com.payflow.payment.security;

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
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    // ✅ SKIP FILTER FOR PUBLIC ROUTES
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {

        String path = request.getServletPath();

        return path.equals("/api/users/login") ||
                path.equals("/api/users/register");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        System.out.println("➡️ JWT FILTER HIT: " + request.getMethod()
                + " " + request.getServletPath());

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {

            System.out.println("✅ Authorization header found");

            String token = header.substring(7);

            if (jwtUtil.validateToken(token)) {

                System.out.println("✅ TOKEN VALID");

                String email = jwtUtil.extractEmail(token);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                Collections.emptyList()
                        );

                auth.setDetails(
                        new org.springframework.security.web.authentication
                                .WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(auth);
            } else {
                System.out.println("❌ TOKEN INVALID");
            }

        } else {
            System.out.println("❌ NO AUTH HEADER");
        }

        filterChain.doFilter(request, response);
    }
}