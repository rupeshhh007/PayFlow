package com.payflow.payment.repository;

import com.payflow.payment.model.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRequestRepository
        extends JpaRepository<PaymentRequest, String> {}
