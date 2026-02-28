package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.entity.StockRequest;
import java.util.List;        // ✅ ADD THIS
import java.util.stream.Collectors;   // optional if needed
import java.security.Principal;
@RestController
@RequestMapping("/product")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping("/add")
    public String addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @PostMapping("/stock-in")
    public String stockIn(@RequestParam Long id,
                          @RequestParam int quantity) {
        return productService.stockIn(id, quantity);
    }

    @PostMapping("/stock-out")
    public String stockOut(@RequestParam Long id,
                           @RequestParam int quantity) {
        return productService.stockOut(id, quantity);
    }
    @GetMapping("/all")
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    @GetMapping("/low-stock")
    public List<Product> lowStock() {
        return productService.getLowStockProducts();
    }


    @GetMapping("/pending-requests")
    public List<StockRequest> pendingStockRequests() {
        return productService.getPendingStockRequests();
    }

    @PostMapping("/approve-stock/{id}")
    public String approveStock(@PathVariable Long id) {
        return productService.approveStock(id);
    }
    @PutMapping("/update/{id}")
    public String updateProduct(@PathVariable Long id,
                                @RequestBody Product product) {
        return productService.updateProduct(id, product);
    }
    @DeleteMapping("/delete/{id}")
    public String deleteProduct(@PathVariable Long id) {
        return productService.deleteProduct(id);
    }
    @GetMapping("/search")
    public List<Product> search(@RequestParam String name) {
        return productService.searchByName(name);
    }

    @GetMapping("/filter/category")
    public List<Product> filterCategory(@RequestParam String category) {
        return productService.filterByCategory(category);
    }

    @GetMapping("/filter/supplier")
    public List<Product> filterSupplier(@RequestParam String supplier) {
        return productService.filterBySupplier(supplier);
    }
    @PostMapping("/reject-stock/{id}")
    public String rejectStock(@PathVariable Long id,
                              @RequestParam String reason) {
        return productService.rejectStock(id, reason);
    }
    @GetMapping("/my-requests")
    public List<StockRequest> myRequests(Authentication authentication) {

        String username = authentication.getName();

        return productService.getRequestsByUser(username);
    }

    @PostMapping("/request-stock")
    public String requestStock(@RequestBody StockRequest request,
                               Authentication authentication) {

        String username = authentication.getName();

        request.setRequestedBy(username);

        return productService.requestStock(request);
    }
}
