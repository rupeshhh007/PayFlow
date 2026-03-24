package com.payflow.payment.config;

import com.payflow.payment.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // ✅ VERY IMPORTANT
                .csrf(csrf -> csrf.disable())

                // ✅ ENABLE CORS PROPERLY
                .cors(Customizer.withDefaults())

                // ✅ AUTHORIZE ROUTES
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/users/register",
                                "/api/users/login"
                        ).permitAll()

                        .anyRequest().authenticated()
                )

                // ✅ JWT FILTER POSITION
                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build(); //testing some features
    }
}