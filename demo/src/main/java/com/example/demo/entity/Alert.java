package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long alertId;
    private Long productId;

    private String ProductName;

    private String alertType;   // LOW_STOCK, OUT_OF_STOCK
    private String severity;    // HIGH, MEDIUM

    private String message;

    private LocalDateTime createdDate;

    private String status;      // ACTIVE, RESOLVED


    // ================= GETTERS =================

    public Long getAlertId() {
        return alertId;
    }

    public Long getProductId() {
        return productId;
    }

    public String getProductName() {
        return ProductName;
    }

    public String getAlertType() {
        return alertType;
    }

    public String getSeverity() {
        return severity;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public String getStatus() {
        return status;
    }


    // ================= SETTERS =================

    public void setAlertId(Long alertId) {
        this.alertId = alertId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public void setProductName(String productName) {
        this.ProductName = productName;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

//package com.example.demo.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//public class Alert {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long alertId;
//
//    private Long productId;
//private String productName;
//
//    private String alertType;   // LOW_STOCK, OUT_OF_STOCK
//    private String severity;    // HIGH, MEDIUM
//
//    private String message;
//
//    private LocalDateTime createdDate;
//
//    private String status;      // ACTIVE, RESOLVED
//
//
//    // ================= GETTERS =================
//
//    public Long getAlertId() {
//        return alertId;
//    }
//
//    public Long getProductId() {
//        return productId;
//    }
//
//    public String getAlertType() {
//        return alertType;
//    }
//
//    public String getSeverity() {
//        return severity;
//    }
//
//    public String getMessage() {
//        return message;
//    }
//
//    public LocalDateTime getCreatedDate() {
//        return createdDate;
//    }
//
//    public String getStatus() {
//        return status;
//    }
//
//
//    // ================= SETTERS =================
//
//    public void setAlertId(Long alertId) {
//        this.alertId = alertId;
//    }
//
//    public void setProductId(Long productId) {
//        this.productId = productId;
//    }
//
//    public void setAlertType(String alertType) {
//        this.alertType = alertType;
//    }
//
//    public void setSeverity(String severity) {
//        this.severity = severity;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }
//
//    public void setCreatedDate(LocalDateTime createdDate) {
//        this.createdDate = createdDate;
//    }
//
//    public void setStatus(String status) {
//        this.status = status;
//    }
//}