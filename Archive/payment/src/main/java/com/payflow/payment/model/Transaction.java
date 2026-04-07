package com.payflow.payment.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double amount;

    private String type; // DEPOSIT / WITHDRAW

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Transaction() {}

    public Transaction(Double amount, String type, User user) {
        this.amount = amount;
        this.type = type;
        this.user = user;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public Double getAmount() {
        return amount;
    }

    public String getType() {
        return type;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public User getUser() {
        return user;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setUser(User user) {
        this.user = user;
    }
}