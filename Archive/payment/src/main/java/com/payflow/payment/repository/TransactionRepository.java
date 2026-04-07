package com.payflow.payment.repository;

import com.payflow.payment.model.Transaction;
import com.payflow.payment.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository
        extends JpaRepository<Transaction, Long> {

    List<Transaction> findByUser(User user);
}