package com.payflow.payment.controller;

import com.payflow.payment.dto.TransactionResponse;
import com.payflow.payment.service.TransactionService;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponse> getTransactions(
            Authentication authentication) {

        String email = authentication.getName();

        return transactionService
                .getUserTransactions(email);
    }
}