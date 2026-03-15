package com.example.demo.service;

import com.example.demo.entity.Product;
import org.springframework.stereotype.Service;

@Service
public class AlertValidationService {

    public String validateProductForAlert(Product product) {

        if (product == null)
            return "Invalid product";

        if (!product.getStatus().equalsIgnoreCase("ACTIVE"))
            return "Inactive product";

        if (product.getMinStockLevel() < 0)
            return "Invalid stock threshold";

        return "VALID";
    }
}