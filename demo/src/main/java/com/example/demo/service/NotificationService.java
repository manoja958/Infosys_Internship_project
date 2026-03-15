package com.example.demo.service;

import com.example.demo.entity.Alert;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    public void sendAlert(Alert alert) {

        System.out.println("ALERT: " + alert.getMessage());

        // Later:
        // send email
        // send dashboard notification
    }
}