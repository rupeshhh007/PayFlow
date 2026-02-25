package com.payflow.payment.controller;

import com.payflow.payment.dto.BalanceResponse;
import com.payflow.payment.dto.DepositRequest;
import com.payflow.payment.service.WalletService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.payflow.payment.dto.TransferRequest;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    @Autowired
    private WalletService walletService;

    @GetMapping("/balance")
    public BalanceResponse getBalance(Authentication authentication) {

        String email = authentication.getName();

        Double balance =
                walletService.getBalance(email);

        return new BalanceResponse(balance);
    }
    @PostMapping("/deposit")
    public BalanceResponse deposit(
            @RequestBody DepositRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        Double balance =
                walletService.deposit(email, request.getAmount());

        return new BalanceResponse(balance);
    }

    @PostMapping("/transfer")
    public String transfer(
            @RequestBody TransferRequest request,
            Authentication authentication) {

        System.out.println("🔥 TRANSFER API HIT");

        String senderEmail = authentication.getName();

        walletService.transfer(
                senderEmail,
                request.getReceiverEmail(),
                request.getAmount()
        );

        return "Transfer successful";
    }

}