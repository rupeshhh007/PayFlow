package com.payflow.payment.dto;

public class BalanceResponse {

    private Double balance;

    public BalanceResponse(Double balance) {
        this.balance = balance;
    }

    public Double getBalance() {
        return balance;
    }
}