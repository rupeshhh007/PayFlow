package com.payflow.payment.controller;

import com.payflow.payment.dto.PaymentRequestResponse;
import com.payflow.payment.dto.PaymentSimulationRequest;
import com.payflow.payment.model.PaymentRequest;
import com.payflow.payment.dto.RequestDTO;
import com.payflow.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;


@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/simulate")
    public ResponseEntity<?> simulatePayment(
            @RequestBody PaymentSimulationRequest request,
            Principal principal
    ) {

        System.out.println("=== PAYMENT HIT ===");
        System.out.println("USER: " + principal);
        System.out.println("AMOUNT: " + request.getAmount());

        paymentService.processSimulation(
                principal.getName(),
                request.getAmount(),
                request.getMethod()
        );

        return ResponseEntity.ok("Payment Successful");
    }
    @PostMapping("/request")
    public ResponseEntity<?> createRequest(
            @RequestBody RequestDTO dto,
            Principal principal
    ) {

        PaymentRequest req =
                paymentService.createRequest(
                        principal.getName(),
                        dto.getAmount(),
                        dto.getNote()
                );

        return ResponseEntity.ok(Map.of(
                "requestId", req.getId(),
                "paymentLink",
                "http://localhost:5173/pay?requestId=" + req.getId()
        ));
    }
    @GetMapping("/request/{id}")
    public ResponseEntity<?> getRequest(@PathVariable String id) {

        PaymentRequest req = paymentService.getRequest(id);

        return ResponseEntity.ok(
                new PaymentRequestResponse(
                        req.getId(),
                        req.getAmount(),
                        req.getNote(),
                        req.getStatus(),
                        req.getRequester().getEmail()
                )
        );
    }
    @PostMapping("/pay/{id}")
    public ResponseEntity<?> payRequest(
            @PathVariable String id,
            Principal principal
    ) {

        try {

            paymentService.payRequest(
                    principal.getName(),
                    id
            );

            return ResponseEntity.ok(
                    Map.of("message", "Payment Completed")
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", e.getMessage()
                    ));
        }
    }
}


