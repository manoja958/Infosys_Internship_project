package com.example.demo.controller;

import com.example.demo.entity.Alert;
import com.example.demo.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alerts")
@CrossOrigin("*")
public class AlertController {

    @Autowired
    private AlertRepository alertRepo;

    @GetMapping("/all")
    public List<Alert> getAllAlerts() {
        return alertRepo.findAll();
    }

    @PostMapping("/resolve/{id}")
    public String resolveAlert(@PathVariable Long id) {

        Alert alert = alertRepo.findById(id).orElse(null);

        if (alert == null)
            return "Alert not found";

        alert.setStatus("RESOLVED");
        alertRepo.save(alert);

        return "Alert resolved";
    }
    @GetMapping("/filter")
    public List<Alert> filterAlerts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) String type) {

        if (status != null)
            return alertRepo.findByStatus(status);

        if (severity != null)
            return alertRepo.findBySeverity(severity);

        if (type != null)
            return alertRepo.findByAlertType(type);

        return alertRepo.findAll();
    }
    @GetMapping("/active-count")
    public long getActiveAlertCount() {

        return alertRepo.findAll()
                .stream()
                .filter(a -> a.getStatus().equals("ACTIVE"))
                .count();
    }

}