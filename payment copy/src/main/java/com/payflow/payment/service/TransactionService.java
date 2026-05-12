package com.payflow.payment.service;

import com.payflow.payment.dto.TransactionResponse;
import com.payflow.payment.model.Transaction;
import com.payflow.payment.model.User;
import com.payflow.payment.repository.TransactionRepository;
import com.payflow.payment.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionService(
            TransactionRepository transactionRepository,
            UserRepository userRepository) {

        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public List<TransactionResponse> getUserTransactions(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Transaction> transactions =
                transactionRepository.findByUser(user);

        return transactions.stream()
                .map(tx -> new TransactionResponse(
                        tx.getId(),
                        tx.getAmount(),
                        tx.getType(),
                        tx.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }
}