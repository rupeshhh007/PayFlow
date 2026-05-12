package com.payflow.payment.dto;

public class PaymentRequestResponse {

    private String id;
    private double amount;
    private String note;
    private String status;
    private String requesterEmail;

    public PaymentRequestResponse(
            String id,
            double amount,
            String note,
            String status,
            String requesterEmail
    ) {
        this.id = id;
        this.amount = amount;
        this.note = note;
        this.status = status;
        this.requesterEmail = requesterEmail;
    }

    public String getId() { return id; }
    public double getAmount() { return amount; }
    public String getNote() { return note; }
    public String getStatus() { return status; }
    public String getRequesterEmail() { return requesterEmail; }
}
