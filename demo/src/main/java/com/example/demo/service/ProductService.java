package com.example.demo.service;

import com.example.demo.entity.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;        // ✅ ADD THIS
import java.util.stream.Collectors;   // optional if needed
import com.example.demo.entity.StockRequest;
import com.example.demo.repository.StockRequestRepository;
import org.springframework.security.core.Authentication;
@Service
public class ProductService {
    @Autowired
    private StockRequestRepository stockRequestRepo;
    @Autowired
    private ProductRepository productRepo;
    @Autowired
    private AuditService auditService;
    @Autowired
    private ProductValidationService validationService;
private long productId;
    public String addProduct(Product product) {

        String validation = validationService.validateNewProduct(product);

        if (!validation.equals("VALID"))
            return validation;

        product.setStatus("ACTIVE");

        productRepo.save(product);
        auditService.logAction(
                "PRODUCT_ADDED",
                "ADMIN",
                product.getName()
        );

        return "Product added successfully";
    }

    public String stockIn(Long id, int quantity) {

        Product product = productRepo.findById(id).orElse(null);

        String validation = validationService.validateStockIn(product, quantity);

        if (!validation.equals("VALID"))
            return validation;

        product.setStockQuantity(product.getStockQuantity() + quantity);

        productRepo.save(product);

        return "Stock updated successfully";
    }

    public String stockOut(Long id, int quantity) {

        Product product = productRepo.findById(id).orElse(null);

        String validation = validationService.validateStockOut(product, quantity);

        if (!validation.equals("VALID"))
            return validation;

        product.setStockQuantity(product.getStockQuantity() - quantity);

        productRepo.save(product);

        return "Stock updated successfully";
    }
    public List<Product> getAllProducts() {
        return productRepo.findAll();
    }
    public List<Product> getLowStockProducts() {
        return productRepo.findAll()
                .stream()
                .filter(p -> p.getStockQuantity() <= p.getMinStockLevel())
                .toList();
    }
//    public String requestStock(StockRequest request) {
//
//        Product product = productRepo.findByName(request.getProductName());
//
//        if (product == null)
//            return "Product not found";
//
//        if (request.getQuantity() <= 0)
//            return "Invalid quantity";
//
//        request.setStatus("PENDING");
//        stockRequestRepo.save(request);
//
//        return "Stock request sent to admin";
//    }

    public String requestStock(StockRequest request) {

        Product product = productRepo.findByName(request.getProductName());

        if (product == null)
            return "Product not found";

        if (request.getQuantity() <= 0)
            return "Invalid quantity";

        request.setStatus("PENDING");

        stockRequestRepo.save(request);

        return "Stock request sent to admin";
    }

//public String requestStock(StockRequest request, Authentication authentication) {
//
//    String username = authentication.getName();
//
//    Product product = productRepo.findByName(request.getProductName());
//
//    if (product == null)
//        return "Product not found";
//
//    if (request.getQuantity() <= 0)
//        return "Invalid quantity";
//
//    request.setRequestedBy(username);
//    request.setStatus("PENDING");
//
//    stockRequestRepo.save(request);
//
//    return "Stock request sent to admin";
//}
    public List<StockRequest> getPendingStockRequests() {
        return stockRequestRepo.findByStatus("PENDING");
    }
    public String approveStock(Long id) {

        StockRequest request = stockRequestRepo.findById(id).orElse(null);

        if (request == null)
            return "Request not found";

       Product product = productRepo.findByName(request.getProductName());
        if (product == null)
            return "Product not found";

        if (product.getStockQuantity() < request.getQuantity())
            return "Insufficient stock";

        product.setStockQuantity(
                product.getStockQuantity() - request.getQuantity()
        );

        productRepo.save(product);

        request.setStatus("APPROVED");
        stockRequestRepo.save(request);
        auditService.logAction("STOCK_APPROVED", "ADMIN", request.getProductName());
        return "Stock approved successfully";
    }
    public String updateProduct(Long id, Product updatedProduct) {

        Product existing = productRepo.findById(id).orElse(null);

        if (existing == null)
            return "Product not found";

        existing.setName(updatedProduct.getName());
        existing.setSku(updatedProduct.getSku());
        existing.setCategory(updatedProduct.getCategory());
        existing.setSupplier(updatedProduct.getSupplier());
        existing.setUnitPrice(updatedProduct.getUnitPrice());
        existing.setMinStockLevel(updatedProduct.getMinStockLevel());

        productRepo.save(existing);
        auditService.logAction(
                "PRODUCT_UPDATED",
                "ADMIN",
                existing.getName()
        );
        return "Product updated successfully";
    }
    public String deleteProduct(Long id) {

        Product product = productRepo.findById(id).orElse(null);

        if (product == null) {
            return "Product not found";
        }

        productRepo.delete(product);

        auditService.logAction(
                "PRODUCT_DELETED",
                "ADMIN",
                product.getName()
        );

        return "Product deleted successfully";
    }
    public List<Product> searchByName(String name) {
        return productRepo.findByNameContainingIgnoreCase(name);
    }

    public List<Product> filterByCategory(String category) {
        return productRepo.findByCategory(category);
    }

    public List<Product> filterBySupplier(String supplier) {
        return productRepo.findBySupplier(supplier);
    }
    public String rejectStock(Long id, String reason) {

        StockRequest request = stockRequestRepo.findById(id).orElse(null);

        if (request == null) return "Request not found";

        request.setStatus("REJECTED");
        request.setRejectionReason(reason);

        stockRequestRepo.save(request);
        auditService.logAction(
                "STOCK_REJECTED",
                "ADMIN",
                request.getProductName()
        );
        return "Stock request rejected";
    }
    public List<StockRequest> getRequestsByUser(String username) {
        return stockRequestRepo.findByRequestedBy(username);
    }
}
