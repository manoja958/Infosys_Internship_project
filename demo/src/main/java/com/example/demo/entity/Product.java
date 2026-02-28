package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productId;

    @Column(unique = true)
    private String sku;

    private String name;
    private String category;
    private String supplier;

    private double unitPrice;
    private int stockQuantity;
    private int minStockLevel;

    private String status; // ACTIVE / INACTIVE

    // Getters and Setters
}
