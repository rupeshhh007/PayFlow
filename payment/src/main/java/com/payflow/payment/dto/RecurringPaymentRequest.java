package com.payflow.payment.dto;

import lombok.Data;

@Data
public class RecurringPaymentRequest {

    private String receiverEmail;

    private Double amount;

    private String frequency;
}
