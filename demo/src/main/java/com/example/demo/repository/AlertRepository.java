package com.example.demo.repository;

import com.example.demo.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    boolean existsByProductIdAndAlertTypeAndStatus(
            Long productId,
            String alertType,
            String status
    );
    List<Alert> findByStatus(String status);

    List<Alert> findBySeverity(String severity);

    List<Alert> findByAlertType(String alertType);
}