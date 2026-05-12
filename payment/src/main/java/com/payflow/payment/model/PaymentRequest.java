package com.payflow.payment.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment_requests")
public class PaymentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private Double amount;

    private String note;

    private String status; // PENDING / PAID

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    public String getId() { return id; }
    public Double getAmount() { return amount; }
    public String getNote() { return note; }
    public String getStatus() { return status; }
    public User getRequester() { return requester; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(String id) { this.id = id; }
    public void setAmount(Double amount) { this.amount = amount; }
    public void setNote(String note) { this.note = note; }
    public void setStatus(String status) { this.status = status; }
    public void setRequester(User requester) { this.requester = requester; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
