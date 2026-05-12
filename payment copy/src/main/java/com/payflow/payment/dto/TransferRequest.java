package com.payflow.payment.dto;

public class TransferRequest {

    private String receiverEmail;
    private Double amount;   // ✅ use wrapper

    // ✅ REQUIRED FOR JACKSON
    public TransferRequest() {}

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}