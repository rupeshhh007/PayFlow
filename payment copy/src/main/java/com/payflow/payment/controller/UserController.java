package com.payflow.payment.controller;

import com.payflow.payment.model.User;
import com.payflow.payment.service.UserService;
import com.payflow.payment.dto.LoginRequest;
import com.payflow.payment.dto.LoginResponse;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ REGISTER USER
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.registerUser(user);
    }

    // ✅ LOGIN → RETURNS JWT TOKEN
    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        String token = userService.login(
                request.getEmail(),
                request.getPassword()
        );

        return new LoginResponse(token);
    }

    // ✅ GET ALL USERS
    @GetMapping
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}