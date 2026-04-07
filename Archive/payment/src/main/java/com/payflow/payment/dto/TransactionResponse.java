package com.payflow.payment.dto;

import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private Double amount;
    private String type;
    private LocalDateTime createdAt;

    public TransactionResponse(
            Long id,
            Double amount,
            String type,
            LocalDateTime createdAt) {

        this.id = id;
        this.amount = amount;
        this.type = type;
        this.createdAt = createdAt;
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
}