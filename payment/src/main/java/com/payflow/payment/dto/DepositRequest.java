package com.payflow.payment.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class DepositRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    public DepositRequest() {}

    public Double getAmount() { return amount; }
    public void setAmount(Double amount) { this.amount = amount; }
}
