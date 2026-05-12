package com.payflow.payment.controller;

import com.payflow.payment.dto.RecurringPaymentRequest;
import com.payflow.payment.model.RecurringPayment;
import com.payflow.payment.model.User;
import com.payflow.payment.repository.RecurringPaymentRepository;
import com.payflow.payment.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/recurring")
@RequiredArgsConstructor
public class RecurringPaymentController {

    private final UserRepository userRepository;

    private final RecurringPaymentRepository recurringRepo;

    @PostMapping("/create")
    public ResponseEntity<?> createRecurringPayment(
            @RequestBody RecurringPaymentRequest req,
            Authentication auth
    ) {

        User sender =
                userRepository
                        .findByEmail(auth.getName())
                        .orElseThrow();

        User receiver =
                userRepository
                        .findByEmail(req.getReceiverEmail())
                        .orElseThrow();

        RecurringPayment rp =
                new RecurringPayment();

        rp.setSender(sender);

        rp.setReceiver(receiver);

        rp.setAmount(req.getAmount());

        rp.setFrequency(req.getFrequency());

        rp.setNextPaymentDate(
                LocalDateTime.now()
        );

        recurringRepo.save(rp);

        return ResponseEntity.ok(
                "Recurring payment created"
        );
    }
}