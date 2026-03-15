package com.example.demo.controller;

import com.example.demo.repository.*;
import com.example.demo.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reports")
@CrossOrigin("*")
public class ReportController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AlertRepository alertRepo;

    @Autowired
    private StockRequestRepository stockRequestRepo;

    /* ===============================
       PRODUCT REPORT
    =============================== */

    @GetMapping("/product-summary")
    public Map<String, Long> productSummary() {

        long totalProducts = productRepo.count();

        long lowStock = productRepo.findAll()
                .stream()
                .filter(p -> p.getStockQuantity() < p.getMinStockLevel()
                        && p.getStockQuantity() > 0)
                .count();

        long outOfStock = productRepo.findAll()
                .stream()
                .filter(p -> p.getStockQuantity() <= 0)
                .count();

        return Map.of(
                "totalProducts", totalProducts,
                "lowStock", lowStock,
                "outOfStock", outOfStock
        );
    }

    /* ===============================
       USER REPORT
    =============================== */

    @GetMapping("/user-summary")
    public Map<String, Long> userSummary() {

        long totalUsers = userRepo.count();

        long lockedUsers = userRepo.findAll()
                .stream()
                .filter(User::isAccountLocked)
                .count();

        return Map.of(
                "totalUsers", totalUsers,
                "lockedUsers", lockedUsers
        );
    }

    /* ===============================
       ALERT REPORT
    =============================== */

    @GetMapping("/alert-summary")
    public Map<String, Long> alertSummary() {

        long activeAlerts = alertRepo.findAll()
                .stream()
                .filter(a -> a.getStatus().equals("ACTIVE"))
                .count();

        long highAlerts = alertRepo.findAll()
                .stream()
                .filter(a -> a.getSeverity().equals("HIGH")
                        && a.getStatus().equals("ACTIVE"))
                .count();

        return Map.of(
                "activeAlerts", activeAlerts,
                "highSeverityAlerts", highAlerts
        );
    }

    /* ===============================
       STOCK REQUEST REPORT
    =============================== */

    @GetMapping("/stock-request-summary")
    public Map<String, Long> stockRequestSummary() {

        long totalRequests = stockRequestRepo.count();

        long pending = stockRequestRepo.findAll()
                .stream()
                .filter(r -> r.getStatus().equals("PENDING"))
                .count();

        long approved = stockRequestRepo.findAll()
                .stream()
                .filter(r -> r.getStatus().equals("APPROVED"))
                .count();

        return Map.of(
                "totalRequests", totalRequests,
                "pendingRequests", pending,
                "approvedRequests", approved
        );
    }
}