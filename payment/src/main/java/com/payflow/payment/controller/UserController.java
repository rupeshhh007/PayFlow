package com.payflow.payment.controller;

import com.payflow.payment.model.User;
import com.payflow.payment.service.UserService;
import com.payflow.payment.service.TokenBlocklistService;
import com.payflow.payment.dto.LoginRequest;
import com.payflow.payment.dto.LoginResponse;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final TokenBlocklistService tokenBlocklistService;

    public UserController(UserService userService,
                          TokenBlocklistService tokenBlocklistService) {
        this.userService = userService;
        this.tokenBlocklistService = tokenBlocklistService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> register(@Valid @RequestBody User user) {
        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        String token = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(
            @RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlocklistService.block(token);
        }
        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}
