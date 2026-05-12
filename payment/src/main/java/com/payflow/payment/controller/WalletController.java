package com.payflow.payment.controller;

import com.payflow.payment.dto.BalanceResponse;
import com.payflow.payment.dto.DepositRequest;
import com.payflow.payment.dto.TransferRequest;
import com.payflow.payment.service.WalletService;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/balance")
    public ResponseEntity<BalanceResponse> getBalance(Authentication authentication) {
        String email = authentication.getName();
        Double balance = walletService.getBalance(email);
        return ResponseEntity.ok(new BalanceResponse(balance));
    }

    @PostMapping("/deposit")
    public ResponseEntity<BalanceResponse> deposit(
            @Valid @RequestBody DepositRequest request,
            Authentication authentication) {
        String email = authentication.getName();
        Double balance = walletService.deposit(email, request.getAmount());
        return ResponseEntity.ok(new BalanceResponse(balance));
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(
            @Valid @RequestBody TransferRequest request,
            Authentication authentication) {
        try {
            String senderEmail = authentication.getName();
            walletService.transfer(senderEmail, request.getReceiverEmail(), request.getAmount());
            return ResponseEntity.ok(Map.of("message", "Transfer successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
