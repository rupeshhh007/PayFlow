package com.payflow.payment.service;

import com.payflow.payment.model.Transaction;
import com.payflow.payment.model.User;
import com.payflow.payment.model.Wallet;
import com.payflow.payment.repository.TransactionRepository;
import com.payflow.payment.repository.UserRepository;
import com.payflow.payment.repository.WalletRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

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
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found: " + email));

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Wallet not found for user: " + email));

        return wallet.getBalance();
    }

    @Transactional
    public Double deposit(String email, Double amount) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "User not found: " + email));

        Wallet wallet = walletRepository.findByUser(user)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Wallet not found for user: " + email));

        wallet.setBalance(wallet.getBalance() + amount);
        walletRepository.save(wallet);

        Transaction tx = new Transaction(amount, "DEPOSIT", user);
        transactionRepository.save(tx);

        return wallet.getBalance();
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public void transfer(String senderEmail, String receiverEmail, Double amount) {
        if (amount == null || amount <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount must be positive");
        }

        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sender not found: " + senderEmail));

        Wallet senderWallet = walletRepository.findByUser(sender)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Sender wallet not found"));

        User receiver = userRepository.findByEmail(receiverEmail)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receiver not found: " + receiverEmail));

        Wallet receiverWallet = walletRepository.findByUser(receiver)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Receiver wallet not found"));

        if (senderWallet.getBalance() < amount) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Insufficient balance");
        }

        senderWallet.setBalance(senderWallet.getBalance() - amount);
        receiverWallet.setBalance(receiverWallet.getBalance() + amount);

        walletRepository.save(senderWallet);
        walletRepository.save(receiverWallet);

        transactionRepository.save(new Transaction(amount, "TRANSFER_SENT", sender));
        transactionRepository.save(new Transaction(amount, "TRANSFER_RECEIVED", receiver));
    }
}
