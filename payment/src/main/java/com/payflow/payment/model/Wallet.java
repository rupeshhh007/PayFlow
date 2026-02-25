package com.payflow.payment.model;

import jakarta.persistence.*;

@Entity
@Table(name = "wallets")
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double balance = 0.0;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    public Wallet() {}

    public Wallet(User user) {
        this.user = user;
        this.balance = 0.0;
    }

    public Long getId() {
        return id;
    }

    public Double getBalance() {
        return balance;
    }

    public User getUser() {
        return user;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }

    public void setUser(User user) {
        this.user = user;
    }
}