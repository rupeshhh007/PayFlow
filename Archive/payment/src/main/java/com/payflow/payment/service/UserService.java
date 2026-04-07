package com.payflow.payment.service;

import com.payflow.payment.model.User;
import com.payflow.payment.model.Wallet;
import com.payflow.payment.repository.UserRepository;
import com.payflow.payment.repository.WalletRepository;
import com.payflow.payment.security.JwtUtil;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final WalletRepository walletRepository;

    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       WalletRepository walletRepository) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.walletRepository = walletRepository;
    }

    // ✅ REGISTER USER + AUTO CREATE WALLET
    public User registerUser(User user) {

        // encrypt password
        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        // save user first
        User savedUser = userRepository.save(user);

        // create wallet
        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(0.0);

        walletRepository.save(wallet);

        return savedUser;
    }

    // ✅ GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ LOGIN + JWT GENERATION
    public String login(String email, String password) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        // Generate JWT
        return jwtUtil.generateToken(user.getEmail());
    }
}