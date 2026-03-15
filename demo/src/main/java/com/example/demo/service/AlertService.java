package com.example.demo.service;

import com.example.demo.entity.Alert;
import com.example.demo.entity.Product;
import com.example.demo.repository.AlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.service.EmailService;
import java.time.LocalDateTime;
import java.util.List;
@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepo;

    @Autowired
    private AlertValidationService validationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    public void evaluateStockAlert(Product product) {

        String validation = validationService.validateProductForAlert(product);

        if (!validation.equals("VALID"))
            return;

        // If stock is normal → resolve alert
        if (product.getStockQuantity() >= product.getMinStockLevel()) {

            resolveExistingAlert(product.getProductId(), "LOW_STOCK");
            resolveExistingAlert(product.getProductId(), "OUT_OF_STOCK");
            return;
        }

        // OUT OF STOCK
        if (product.getStockQuantity() <= 0) {

            boolean created = createAlert(product, "OUT_OF_STOCK", "HIGH");

            if (created) {
                emailService.sendLowStockEmail(
                        product.getName(),
                        product.getStockQuantity()
                );
            }

        }

        // LOW STOCK
        else if (product.getStockQuantity() < product.getMinStockLevel()) {

            boolean created = createAlert(product, "LOW_STOCK", "MEDIUM");

            if (created) {
                emailService.sendLowStockEmail(
                        product.getName(),
                        product.getStockQuantity()
                );
            }
        }
    }

    public boolean createAlert(Product product, String type, String severity) {

        boolean exists = alertRepo.existsByProductIdAndAlertTypeAndStatus(
                product.getProductId(),
                type,
                "ACTIVE"
        );

        if (exists)
            return false;

        Alert alert = new Alert();
        alert.setProductId(product.getProductId());
        alert.setProductName(product.getName());
        alert.setAlertType(type);
        alert.setSeverity(severity);
        alert.setMessage(type + " detected for product: " + product.getName());

        alert.setStatus("ACTIVE");
        alert.setCreatedDate(LocalDateTime.now());

        alertRepo.save(alert);

        return true;
    }

    private String generateMessage(Product product, String type) {

        if (type.equals("OUT_OF_STOCK"))
            return product.getName() + " is OUT OF STOCK";

        return product.getName() + " is LOW in stock";
    }
    private void resolveExistingAlert(Long productId, String type) {

        List<Alert> alerts = alertRepo.findAll();

        for (Alert alert : alerts) {
            if (alert.getProductId().equals(productId)
                    && alert.getAlertType().equals(type)
                    && alert.getStatus().equals("ACTIVE")) {

                alert.setStatus("RESOLVED");
                alertRepo.save(alert);
            }
        }
    }
}