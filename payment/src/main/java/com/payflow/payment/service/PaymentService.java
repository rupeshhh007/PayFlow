package com.payflow.payment.service;

import com.payflow.payment.model.PaymentRequest;
import com.payflow.payment.model.Transaction;
import com.payflow.payment.model.User;
import com.payflow.payment.model.Wallet;
import com.payflow.payment.repository.PaymentRequestRepository;
import com.payflow.payment.repository.TransactionRepository;
import com.payflow.payment.repository.UserRepository;
import com.payflow.payment.repository.WalletRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Transactional
public class PaymentService {

    private final UserRepository userRepo;
    private final WalletRepository walletRepo;
    private final TransactionRepository txRepo;
    private final PaymentRequestRepository requestRepo;

    // =====================================================
    // PAYMENT SIMULATOR (ADD MONEY)
    // =====================================================
    public void processSimulation(
            String email,
            double amount,
            String method
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Wallet wallet = walletRepo
                .findByUser(user)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));

        // ✅ Update balance
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepo.save(wallet);

        // ✅ Save transaction
        Transaction tx = new Transaction();
        tx.setUser(user);
        tx.setAmount(amount);
        tx.setType("DEPOSIT");
        tx.setCreatedAt(LocalDateTime.now());

        txRepo.save(tx);
    }

    // =====================================================
    // CREATE PAYMENT REQUEST LINK
    // =====================================================
    public PaymentRequest createRequest(
            String email,
            double amount,
            String note
    ) {

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ ENTITY (NOT DTO)
        PaymentRequest req = new PaymentRequest();

        req.setAmount(amount);
        req.setNote(note);
        req.setRequester(user);
        req.setStatus("PENDING");
        req.setCreatedAt(LocalDateTime.now());

        return requestRepo.save(req);
    }
    public PaymentRequest getRequest(String id) {

        return requestRepo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Request not found"));
    }
    public void payRequest(
            String payerEmail,
            String requestId
    ) {

        // =============================
        // FETCH REQUEST
        // =============================
        PaymentRequest request =
                requestRepo.findById(requestId)
                        .orElseThrow(() ->
                                new RuntimeException("Invalid request"));

        if ("PAID".equals(request.getStatus())) {
            throw new RuntimeException("Request already paid");
        }

        // =============================
        // USERS
        // =============================
        User payer = userRepo.findByEmail(payerEmail)
                .orElseThrow(() ->
                        new RuntimeException("Payer not found"));

        User receiver = request.getRequester();

        if (payer.getId().equals(receiver.getId())) {
            throw new RuntimeException("Cannot pay yourself");
        }

        // =============================
        // WALLETS
        // =============================
        Wallet payerWallet =
                walletRepo.findByUser(payer)
                        .orElseThrow();

        Wallet receiverWallet =
                walletRepo.findByUser(receiver)
                        .orElseThrow();

        double amount = request.getAmount();

        // =============================
        // BALANCE CHECK
        // =============================
        if (payerWallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // =============================
        // TRANSFER MONEY
        // =============================
        payerWallet.setBalance(
                payerWallet.getBalance() - amount
        );

        receiverWallet.setBalance(
                receiverWallet.getBalance() + amount
        );

        walletRepo.save(payerWallet);
        walletRepo.save(receiverWallet);

        // =============================
        // TRANSACTIONS
        // =============================

        // Sender record
        Transaction sent = new Transaction();
        sent.setUser(payer);
        sent.setAmount(amount);
        sent.setType("TRANSFER_SENT");
        sent.setCreatedAt(LocalDateTime.now());
        txRepo.save(sent);

        // Receiver record
        Transaction received = new Transaction();
        received.setUser(receiver);
        received.setAmount(amount);
        received.setType("TRANSFER_RECEIVED");
        received.setCreatedAt(LocalDateTime.now());
        txRepo.save(received);

        // =============================
        // COMPLETE REQUEST
        // =============================
        request.setStatus("PAID");
        requestRepo.save(request);
    }
}