package com.payflow.payment.service;

import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class TokenBlocklistService {

    private final Set<String> blocklist = ConcurrentHashMap.newKeySet();

    public void block(String token) {
        blocklist.add(token);
    }

    public boolean isBlocked(String token) {
        return blocklist.contains(token);
    }
}
