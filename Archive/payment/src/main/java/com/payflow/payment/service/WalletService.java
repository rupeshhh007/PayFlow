package com.payflow.payment.service;

import com.payflow.payment.model.Transaction;
import com.payflow.payment.model.User;
import com.payflow.payment.model.Wallet;
import com.payflow.payment.repository.TransactionRepository;
import com.payflow.payment.repository.UserRepository;
import com.payflow.payment.repository.WalletRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(
            WalletRepository walletRepository,
            UserRepository userRepository,
            TransactionRepository transactionRepository) {

        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    public Double getBalance(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow();

        return wallet.getBalance();
    }

    // ✅ DEPOSIT MONEY
    @Transactional
    public Double deposit(String email, Double amount) {

        User user = userRepository.findByEmail(email)
                .orElseThrow();

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow();

        // update balance
        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        // record transaction
        Transaction tx =
                new Transaction(amount, "DEPOSIT", user);

        transactionRepository.save(tx);

        return wallet.getBalance();
    }
    // ✅ TRANSFER MONEY
    @Transactional
    public void transfer(
            String senderEmail,
            String receiverEmail,
            Double amount) {

        if (amount == null || amount <= 0) {
            throw new RuntimeException("Invalid amount");
        }

        // sender
        User sender = userRepository
                .findByEmail(senderEmail)
                .orElseThrow();

        Wallet senderWallet =
                walletRepository.findByUser(sender)
                        .orElseThrow();

        // receiver
        User receiver = userRepository
                .findByEmail(receiverEmail)
                .orElseThrow();

        Wallet receiverWallet =
                walletRepository.findByUser(receiver)
                        .orElseThrow();

        // balance check
        if (senderWallet.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // update balances
        senderWallet.setBalance(
                senderWallet.getBalance() - amount
        );

        receiverWallet.setBalance(
                receiverWallet.getBalance() + amount
        );

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        // sender transaction
        Transaction debit =
                new Transaction(amount, "TRANSFER_SENT", sender);

        transactionRepository.save(debit);

        // receiver transaction
        Transaction credit =
                new Transaction(amount, "TRANSFER_RECEIVED", receiver);

        transactionRepository.save(credit);
    }
}