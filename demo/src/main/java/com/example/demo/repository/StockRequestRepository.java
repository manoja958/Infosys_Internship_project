package com.example.demo.repository;

import com.example.demo.entity.StockRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StockRequestRepository extends JpaRepository<StockRequest, Long> {

    List<StockRequest> findByStatus(String status);
    List<StockRequest> findByRequestedBy(String requestedBy);
}