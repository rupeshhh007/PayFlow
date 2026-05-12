package com.payflow.payment.repository;

import com.payflow.payment.model.RecurringPayment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface RecurringPaymentRepository
        extends JpaRepository<RecurringPayment, Long> {

    List<RecurringPayment>
    findByActiveTrueAndNextPaymentDateBefore(
            LocalDateTime now
    );
}