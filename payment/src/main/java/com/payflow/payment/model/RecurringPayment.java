package com.payflow.payment.model;


import jakarta.persistence.*;

import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class RecurringPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private User sender;

    @ManyToOne
    private User receiver;

    private Double amount;

    private String frequency;
    // DAILY
    // WEEKLY
    // MONTHLY

    private LocalDateTime nextPaymentDate;

    private boolean active = true;
}
