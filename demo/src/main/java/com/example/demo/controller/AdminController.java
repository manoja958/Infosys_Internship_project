

package com.example.demo.controller;

import com.example.demo.entity.AuditLog;
import com.example.demo.entity.User;
import com.example.demo.entity.UserRequest;
import com.example.demo.service.AdminService;
import com.example.demo.service.AuthService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthService authService;

    @Autowired
    private AdminService adminService;

    /* =====================================
       DASHBOARD APIs
    ===================================== */

    @GetMapping("/total-users")
    public Map<String, Long> totalUsers() {
        return Map.of("totalUsers", authService.getTotalUsers());
    }

    @GetMapping("/locked-users")
    public Map<String, Long> lockedUsers() {
        return Map.of("lockedUsers", authService.getLockedUsers());
    }

    @GetMapping("/all-users")
    public List<User> allUsers() {
        return authService.getAllUsers();
    }

    /* =====================================
       USER MANAGEMENT (LOCK / UNLOCK / DELETE)
    ===================================== */

    @PostMapping("/lock")
    public String lockUser(@RequestParam String username) {
        return adminService.lockUser(username);
    }

    @PostMapping("/unlock")
    public String unlockUser(@RequestParam String username) {
        return adminService.unlockUser(username);
    }

    @DeleteMapping("/delete-user")
    public String deleteUser(@RequestParam String username) {
        return adminService.deleteUser(username);
    }

    /* =====================================
       USER REQUEST MANAGEMENT
    ===================================== */

    @GetMapping("/pending-requests")
    public List<UserRequest> pendingRequests() {
        return authService.getPendingRequests();
    }

    @PostMapping("/approve/{id}")
    public String approve(@PathVariable Long id) {
        return authService.approveRequest(id);
    }

    @PostMapping("/reject/{id}")
    public String reject(@PathVariable Long id,
                         @RequestParam String reason) {
        return authService.rejectRequest(id, reason);
    }

    /* =====================================
       AUDIT LOGS
    ===================================== */

    @GetMapping("/audit-logs")
    public List<AuditLog> getLogs() {
        return authService.getAllLogs();
    }
}

//package com.example.demo.controller;
//import org.springframework.security.access.prepost.PreAuthorize;
//import com.example.demo.entity.User;
//import com.example.demo.service.AuthService;
//import com.example.demo.entity.AuditLog;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//import com.example.demo.entity.UserRequest;
//import java.util.List;
//import java.util.Map;
//
//
//@RestController
//@RequestMapping("/admin")
//@CrossOrigin("*")
//public class AdminController {
//
//    @Autowired
//    private AuthService authService;
//
//    // Total users count
//    @GetMapping("/total-users")
//    public Map<String, Long> totalUsers() {
//        return Map.of("totalUsers", authService.getTotalUsers());
//    }
//
//    // Locked users count
//    @GetMapping("/locked-users")
//    public Map<String, Long> lockedUsers() {
//        return Map.of("lockedUsers", authService.getLockedUsers());
//    }
//
//    // Get all users
//    @GetMapping("/all-users")
//    public List<User> allUsers() {
//        return authService.getAllUsers();
//    }
//    @Autowired
//    private AdminService adminService;
//
//    /* ===================== */
//    /* LOCK USER */
//    /* ===================== */
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/lock")
//    public String lockUser(@RequestParam String username) {
//        return adminService.lockUser(username);
//    }
//
//    /* ===================== */
//    /* UNLOCK USER */
//    /* ===================== */
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @PostMapping("/unlock")
//    public String unlockUser(@RequestParam String username) {
//        return adminService.unlockUser(username);
//    }
//
//    /* ===================== */
//    /* DELETE USER */
//    /* ===================== */
//
//    @PreAuthorize("hasRole('ADMIN')")
//    @DeleteMapping("/delete-user")
//    public String deleteUser(@RequestParam String username) {
//        return adminService.deleteUser(username);
//    }
//    // Unlock user
//    @PostMapping("/unlock")
//    public String unlock(@RequestParam String username) {
//        return authService.unlockUser(username);
//    }
//
////    @PostMapping("/request")
////    public String sendRequest(@RequestBody UserRequest request) {
////        return authService.sendUserRequest(request);
////    }
//
//    @GetMapping("/pending-requests")
//    public List<UserRequest> pendingRequests() {
//        return authService.getPendingRequests();
//    }
//
//    @PostMapping("/approve/{id}")
//    public String approve(@PathVariable Long id) {
//        return authService.approveRequest(id);
//    }
//
//    // Delete user
//    @DeleteMapping("/delete-user")
//    public String delete(@RequestParam String username) {
//        return authService.deleteUser(username);
//    }
//    @PostMapping("/reject/{id}")
//    public String reject(@PathVariable Long id,
//                         @RequestParam String reason) {
//        return authService.rejectRequest(id, reason);
//    }
//    @GetMapping("/audit-logs")
//    public List<AuditLog> getLogs() {
//        return authService.getAllLogs();
//    }
//
//}
