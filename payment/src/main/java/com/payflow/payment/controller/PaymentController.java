package com.payflow.payment.controller;

import com.payflow.payment.dto.PaymentRequestResponse;
import com.payflow.payment.dto.PaymentSimulationRequest;
import com.payflow.payment.model.PaymentRequest;
import com.payflow.payment.dto.RequestDTO;
import com.payflow.payment.service.PaymentService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private static final Logger log = LoggerFactory.getLogger(PaymentController.class);

    private final PaymentService paymentService;

    @PostMapping("/simulate")
    public ResponseEntity<?> simulatePayment(
            @Valid @RequestBody PaymentSimulationRequest request,
            Principal principal) {
        log.debug("Payment simulation request by user: {}", principal.getName());
        try {
            paymentService.processSimulation(
                    principal.getName(),
                    request.getAmount(),
                    request.getMethod());
            return ResponseEntity.ok("Payment Successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/request")
    public ResponseEntity<?> createRequest(
            @Valid @RequestBody RequestDTO dto,
            Principal principal) {
        try {
            PaymentRequest req = paymentService.createRequest(
                    principal.getName(),
                    dto.getAmount(),
                    dto.getNote());
            return ResponseEntity.ok(Map.of(
                    "requestId", req.getId(),
                    "paymentLink", "http://localhost:5173/pay?requestId=" + req.getId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/request/{id}")
    public ResponseEntity<?> getRequest(@PathVariable String id) {
        try {
            PaymentRequest req = paymentService.getRequest(id);
            return ResponseEntity.ok(new PaymentRequestResponse(
                    req.getId(),
                    req.getAmount(),
                    req.getNote(),
                    req.getStatus(),
                    req.getRequester().getEmail()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/pay/{id}")
    public ResponseEntity<?> payRequest(
            @PathVariable String id,
            Principal principal) {
        try {
            paymentService.payRequest(principal.getName(), id);
            return ResponseEntity.ok(Map.of("message", "Payment Completed"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
