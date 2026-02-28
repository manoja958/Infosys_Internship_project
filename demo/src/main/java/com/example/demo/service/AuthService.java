
package com.example.demo.service;

import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.example.demo.security.JWTUtility;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private UserRequestRepository requestRepo;

    @Autowired
    private AuditLogRepository auditRepo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuditService auditService;

    @Autowired
    private JWTUtility jwtUtility;

    @Autowired
    private BCryptPasswordEncoder encoder;

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCK_DURATION_MINUTES = 15;

    // =========================
//    // SIGNUP
//    // =========================
    public String signup(User user) {

        if (user.getUsername() == null ||
                user.getUsername().length() < 5 ||
                user.getUsername().length() > 15)
            return "Username must be between 5 and 15 characters";

        if (userRepo.findByUsername(user.getUsername()).isPresent())
            return "Username already exists";

        if (user.getEmail() == null || !user.getEmail().contains("@"))
            return "Enter valid email address";

        if (userRepo.findByEmail(user.getEmail()).isPresent())
            return "Email already registered";

        if (user.getPassword() == null ||
                !user.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$"))
            return "Password must contain 1 uppercase, 1 number, 1 special character and minimum 8 characters";

        user.setPassword(encoder.encode(user.getPassword()));
        user.setRole(user.getRole().toUpperCase());
        user.setFailedAttempts(0);
        user.setAccountLocked(false);
        user.setLockTime(null);

        userRepo.save(user);

        return "Signup successful";
    }



    /* =====================================================
       LOGIN
    ===================================================== */
    public String login(String username, String password) {

        User user = userRepo.findByUsername(username).orElse(null);

        if (user == null)
            return "Invalid username";

        // 🔐 Check lock
        if (user.isAccountLocked()) {

            if (user.getLockTime() != null) {

                LocalDateTime unlockTime =
                        user.getLockTime().plusMinutes(LOCK_DURATION_MINUTES);

                if (unlockTime.isBefore(LocalDateTime.now())) {

                    user.setAccountLocked(false);
                    user.setFailedAttempts(0);
                    user.setLockTime(null);
                    userRepo.save(user);

                } else {
                    return "Account locked. Try again after 15 minutes";
                }

            } else {
                return "Account locked by admin. Contact administrator.";
            }
        }

        // 🔑 Check password
        if (!encoder.matches(password, user.getPassword())) {

            user.setFailedAttempts(user.getFailedAttempts() + 1);

            if (user.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {

                user.setAccountLocked(true);
                user.setLockTime(LocalDateTime.now());
                userRepo.save(user);

                return "Account locked due to 3 failed attempts";
            }

            userRepo.save(user);

            int remaining = MAX_FAILED_ATTEMPTS - user.getFailedAttempts();
            return "Invalid password. " + remaining + " attempts remaining";
        }

        // 🔄 Reset attempts
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepo.save(user);

        return jwtUtility.generateToken(user.getUsername(), user.getRole());
    }

    /* =====================================================
       CHANGE PASSWORD (First Login)
    ===================================================== */
//    public String changePassword(String username, String newPassword) {
//
//        User user = userRepo.findByUsername(username)
//                .orElseThrow(() -> new RuntimeException("User not found"));
//
//        user.setPassword(encoder.encode(newPassword));
//        user.setFirstLogin(false);
//
//        userRepo.save(user);
//
//        return "Password changed successfully";
//    }

    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */
    public String forgotPassword(String email) {

        User user = userRepo.findByEmail(email).orElse(null);

        if (user == null)
            return "Email not found";

        String token = UUID.randomUUID().toString();

        user.setResetToken(token);
        user.setTokenExpiry(LocalDateTime.now().plusMinutes(15));

        userRepo.save(user);

        emailService.sendResetEmail(email, token);

        return "Reset link sent to email";
    }

    /* =====================================================
       RESET PASSWORD
    ===================================================== */
    @Transactional
    public String resetPassword(String token, String newPassword) {

        User user = userRepo.findByResetToken(token).orElse(null);

        if (user == null)
            return "Invalid token";

        if (user.getTokenExpiry() == null ||
                user.getTokenExpiry().isBefore(LocalDateTime.now()))
            return "Token expired";

        user.setPassword(encoder.encode(newPassword));
        user.setFailedAttempts(0);
        user.setAccountLocked(false);
        user.setLockTime(null);
        user.setResetToken(null);
        user.setTokenExpiry(null);
        user.setFirstLogin(false);

        userRepo.save(user);

        return "Password reset successful";
    }

    /* =====================================================
       USER REQUEST
    ===================================================== */
    public String sendUserRequest(UserRequest request) {

        request.setStatus("PENDING");
        requestRepo.save(request);

        return "Request submitted. Wait for admin approval.";
    }

    public List<UserRequest> getPendingRequests() {
        return requestRepo.findByStatus("PENDING");
    }

    /* =====================================================
       APPROVE REQUEST (WITH TEMP PASSWORD + EMAIL)
    ===================================================== */

    public String approveRequest(Long requestId) {

        UserRequest request = requestRepo.findById(requestId).orElse(null);

        if (request == null)
            return "Request not found";

        if (!request.getStatus().equals("PENDING"))
            return "Already processed";

        // 🔒 Check duplicate username
        if (userRepo.findByUsername(request.getUsername()).isPresent())
            return "Username already exists";

        // 🔒 Check duplicate email
        if (userRepo.findByEmail(request.getEmail()).isPresent())
            return "Email already registered";

        try {

            // Generate temporary password
            String tempPassword = UUID.randomUUID().toString().substring(0, 8);

            User newUser = new User();
            newUser.setUsername(request.getUsername());
            newUser.setEmail(request.getEmail());
            newUser.setPassword(encoder.encode(tempPassword));
            newUser.setRole("USER");
            newUser.setAccountLocked(false);
            newUser.setFailedAttempts(0);
            newUser.setFirstLogin(true);

            userRepo.save(newUser);

            // Send approval email
            emailService.sendApprovalEmail(
                    request.getEmail(),
                    request.getUsername(),
                    tempPassword
            );

            request.setStatus("APPROVED");
            requestRepo.save(request);

            auditService.logAction(
                    "USER_APPROVED",
                    "ADMIN",
                    request.getUsername()
            );

            return "User approved. Temporary password sent via email.";

        } catch (Exception e) {
            return "Error while approving request";
        }
    }



    //    public String approveRequest(Long requestId) {
//
//        UserRequest request = requestRepo.findById(requestId).orElse(null);
//
//        if (request == null)
//            return "Request not found";
//
//        if (!request.getStatus().equals("PENDING"))
//            return "Already processed";
//
//        // Generate temporary password
//        String tempPassword = UUID.randomUUID().toString().substring(0, 8);
//
//        User newUser = new User();
//        newUser.setUsername(request.getUsername());
//        newUser.setEmail(request.getEmail());
//        newUser.setPassword(encoder.encode(tempPassword));
//        newUser.setRole("USER");
//        newUser.setAccountLocked(false);
//        newUser.setFailedAttempts(0);
//        newUser.setFirstLogin(true);
//
//        userRepo.save(newUser);
//
//        // Send email
//        emailService.sendApprovalEmail(
//                request.getEmail(),
//                request.getUsername(),
//                tempPassword
//        );
//
//        request.setStatus("APPROVED");
//        requestRepo.save(request);
//
//        auditService.logAction("USER_APPROVED", "ADMIN", request.getUsername());
//
//        return "User approved. Temporary password sent via email.";
//    }
//
    /* =====================================================
       REJECT REQUEST
    ===================================================== */
    public String rejectRequest(Long id, String reason) {

        UserRequest request = requestRepo.findById(id).orElse(null);

        if (request == null)
            return "Request not found";

        request.setStatus("REJECTED");
        request.setRejectionReason(reason);
        requestRepo.save(request);

        auditService.logAction("USER_REJECTED", "ADMIN", request.getUsername());

        return "Request rejected";
    }

    /* =====================================================
       ADMIN METHODS
    ===================================================== */
    public String unlockUser(String username) {

        User user = userRepo.findByUsername(username).orElse(null);

        if (user == null)
            return "User not found";

        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        user.setLockTime(null);

        userRepo.save(user);

        return "User unlocked successfully";
    }

    public long getTotalUsers() {
        return userRepo.count();
    }

    public long getLockedUsers() {
        return userRepo.findAll()
                .stream()
                .filter(User::isAccountLocked)
                .count();
    }

    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public String deleteUser(String username) {

        User user = userRepo.findByUsername(username).orElse(null);

        if (user == null)
            return "User not found";

        if (user.getRole().equalsIgnoreCase("ADMIN"))
            return "Admin account cannot be deleted";

        userRepo.delete(user);

        auditService.logAction("USER_DELETED", "ADMIN", username);

        return "User deleted successfully";
    }

    public List<AuditLog> getAllLogs() {
        return auditRepo.findAll();
    }
}





//package com.example.demo.service;
//import org.springframework.transaction.annotation.Transactional;
//
//import com.example.demo.security.JWTUtility;
//import com.example.demo.entity.User;
//import com.example.demo.repository.UserRepository;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//import com.example.demo.entity.AuditLog;
//import com.example.demo.entity.UserRequest;
//import com.example.demo.repository.UserRequestRepository;
//import com.example.demo.repository.AuditLogRepository;
//import java.time.LocalDateTime;
//import java.util.UUID;
//import java.util.List;
//
//@Service
//public class AuthService {
//
//    @Autowired
//    private AuditLogRepository auditRepo;
//
//    @Autowired
//    private UserRequestRepository requestRepo;
//
//
//    @Autowired
//    private JWTUtility jwtUtility;
//
//    @Autowired
//    private EmailService emailService;
//
//    @Autowired
//    private UserRepository userRepo;
//    @Autowired
//    private AuditService auditService;
//    @Autowired
//    private BCryptPasswordEncoder encoder;
//
//    private static final int MAX_FAILED_ATTEMPTS = 3;
//    private static final int LOCK_DURATION_MINUTES = 15;
//
//    // =========================
//    // SIGNUP
//    // =========================
//    public String signup(User user) {
//
//        if (user.getUsername() == null ||
//                user.getUsername().length() < 5 ||
//                user.getUsername().length() > 15)
//            return "Username must be between 5 and 15 characters";
//
//        if (userRepo.findByUsername(user.getUsername()).isPresent())
//            return "Username already exists";
//
//        if (user.getEmail() == null || !user.getEmail().contains("@"))
//            return "Enter valid email address";
//
//        if (userRepo.findByEmail(user.getEmail()).isPresent())
//            return "Email already registered";
//
//        if (user.getPassword() == null ||
//                !user.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$"))
//            return "Password must contain 1 uppercase, 1 number, 1 special character and minimum 8 characters";
//
//        user.setPassword(encoder.encode(user.getPassword()));
//        user.setRole(user.getRole().toUpperCase());
//        user.setFailedAttempts(0);
//        user.setAccountLocked(false);
//        user.setLockTime(null);
//
//        userRepo.save(user);
//
//        return "Signup successful";
//    }
//
//    // =========================
//// LOGIN
//// =========================
//    public String login(String username, String password) {
//
//        User user = userRepo.findByUsername(username).orElse(null);
//
//        if (user == null)
//            return "Invalid username";
//
//    /* =========================================
//       1️⃣ CHECK IF ACCOUNT LOCKED
//    ========================================= */
//
//        if (user.isAccountLocked()) {
//
//            // If lockTime exists → means locked due to failed attempts
//            if (user.getLockTime() != null) {
//
//                LocalDateTime unlockTime =
//                        user.getLockTime().plusMinutes(LOCK_DURATION_MINUTES);
//
//                if (unlockTime.isBefore(LocalDateTime.now())) {
//
//                    // Auto unlock
//                    user.setAccountLocked(false);
//                    user.setFailedAttempts(0);
//                    user.setLockTime(null);
//                    userRepo.save(user);
//
//                } else {
//                    return "Account locked. Try again after 15 minutes";
//                }
//
//            } else {
//                // lockTime null → means manually locked by ADMIN
//                return "Your account is locked by admin. Contact administrator.";
//            }
//        }
//
//    /* =========================================
//       2️⃣ VALIDATE PASSWORD
//    ========================================= */
//
//        if (!encoder.matches(password, user.getPassword())) {
//
//            user.setFailedAttempts(user.getFailedAttempts() + 1);
//
//            if (user.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
//
//                user.setAccountLocked(true);
//                user.setLockTime(LocalDateTime.now());
//
//                userRepo.save(user);
//
//                return "Account locked due to 3 failed attempts. Try after 15 minutes";
//            }
//
//            userRepo.save(user);
//
//            int remaining = MAX_FAILED_ATTEMPTS - user.getFailedAttempts();
//            return "Invalid password. " + remaining + " attempts remaining";
//        }
//
//    /* =========================================
//       3️⃣ SUCCESSFUL LOGIN
//    ========================================= */
//
//        user.setFailedAttempts(0);
//        user.setLockTime(null);
//        userRepo.save(user);
//
//        return jwtUtility.generateToken(user.getUsername(), user.getRole());
//    }
// // =========================
//    // FORGOT PASSWORD
//    // =========================
//    public String forgotPassword(String email) {
//
//        User user = userRepo.findByEmail(email).orElse(null);
//
//        if (user == null)
//            return "Email not found";
//
//        String token = UUID.randomUUID().toString();
//
//        user.setResetToken(token);
//        user.setTokenExpiry(LocalDateTime.now().plusMinutes(15));
//
//        userRepo.save(user);
//
//        emailService.sendResetEmail(email, token);
//
//        return "Reset link sent to email";
//    }
//
//    // =========================
//    // RESET PASSWORD
//    // =========================
//
//
//    @Transactional
//    public String resetPassword(String token, String newPassword) {
//
//        User user = userRepo.findByResetToken(token).orElse(null);
//
//        if (user == null)
//            return "Invalid token";
//
//        if (user.getTokenExpiry() == null ||
//                user.getTokenExpiry().isBefore(LocalDateTime.now()))
//            return "Token expired";
//
//        System.out.println("OLD HASH: " + user.getPassword());
//
//        String newHash = encoder.encode(newPassword);
//        System.out.println("NEW HASH: " + newHash);
//
//        user.setPassword(newHash);
//
//        user.setFailedAttempts(0);
//        user.setAccountLocked(false);
//        user.setLockTime(null);
//
//        user.setResetToken(null);
//        user.setTokenExpiry(null);
//
//        userRepo.save(user);
//
//        System.out.println("PASSWORD UPDATED IN DB");
//
//        return "Password reset successful";
//    }
//
////    public String resetPassword(String token, String newPassword) {
////
////        User user = userRepo.findByResetToken(token).orElse(null);
////
////        if (user == null)
////            return "Invalid token";
////
////        if (user.getTokenExpiry() == null ||
////                user.getTokenExpiry().isBefore(LocalDateTime.now()))
////            return "Token expired";
////
////        if (newPassword == null ||
////                !newPassword.matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$"))
////            return "Password must contain 1 uppercase, 1 number, 1 special character and minimum 8 characters";
////
////        user.setPassword(encoder.encode(newPassword));
////
////        // Unlock account after reset
////        user.setFailedAttempts(0);
////        user.setAccountLocked(false);
////        user.setLockTime(null);
////
////        user.setResetToken(null);
////        user.setTokenExpiry(null);
////
////        userRepo.save(user);
////
////        return "Password reset successful";
////    }
//
//    // =========================
//    // ADMIN UNLOCK
//    // =========================
//    public String unlockUser(String username) {
//
//        User user = userRepo.findByUsername(username).orElse(null);
//
//        if (user == null)
//            return "User not found";
//
//        user.setAccountLocked(false);
//        user.setFailedAttempts(0);
//        user.setLockTime(null);
//
//        userRepo.save(user);
//
//        return "User unlocked successfully";
//    }
//
//
//// =========================
//// ADMIN DASHBOARD METHODS
//// =========================
//
//    // Total Users Count
//    public long getTotalUsers() {
//        return userRepo.count();
//    }
//
//    // Locked Users Count
//    public long getLockedUsers() {
//        return userRepo.findAll()
//                .stream()
//                .filter(User::isAccountLocked)
//                .count();
//    }
//
//    // Get All Users
//    public List<User> getAllUsers() {
//        return userRepo.findAll();
//    }
//
//    // Delete User
//    public String deleteUser(String username) {
//
//        User user = userRepo.findByUsername(username).orElse(null);
//
//        if (user == null) {
//            return "User not found";
//        }
//
//        // Optional: Prevent deleting ADMIN
//        if (user.getRole().equalsIgnoreCase("ADMIN")) {
//            return "Admin account cannot be deleted";
//        }
//
//        userRepo.delete(user);
//
//        return "User deleted successfully";
//    }
//    public String sendUserRequest(UserRequest request) {
//
//        request.setStatus("PENDING");
//        requestRepo.save(request);
//
//        return "Request submitted. Wait for admin approval.";
//    }
////    public List<UserRequest> getPendingRequests() {
////        return requestRepo.findAll()
////                .stream()
////                .filter(r -> r.getStatus().equals("PENDING"))
////                .toList();
////    }
//public List<UserRequest> getPendingRequests() {
//    return requestRepo.findByStatus("PENDING");
//}
//    public String approveRequest(Long requestId) {
//
//        UserRequest request = requestRepo.findById(requestId).orElse(null);
//
//        if (request == null) return "Request not found";
//
//        User user = new User();
//        user.setUsername(request.getUsername());
//        user.setEmail(request.getEmail());
//        user.setPassword(encoder.encode("Default@123"));
//        user.setRole("USER");
//        user.setAccountLocked(false);
//        user.setFailedAttempts(0);
//
//        userRepo.save(user);
//
//        request.setStatus("APPROVED");
//        requestRepo.save(request);
//        auditService.logAction("USER_APPROVED", "ADMIN", request.getUsername());
//        return "User created successfully";
//    }
//    public String rejectRequest(Long id, String reason) {
//
//        UserRequest request = requestRepo.findById(id).orElse(null);
//
//        if (request == null) return "Request not found";
//
//        request.setStatus("REJECTED");
//        request.setRejectionReason(reason);
//
//        requestRepo.save(request);
//        auditService.logAction("USER_REJECTED", "ADMIN", request.getUsername());
//        return "Request rejected";
//    }
//    public List<AuditLog> getAllLogs() {
//        return auditRepo.findAll();
//    }
//    private void logAction(String action, String performedBy, String target) {
//
//        AuditLog log = new AuditLog();
//        log.setAction(action);
//        log.setPerformedBy(performedBy);
//        log.setTarget(target);
//        log.setTimestamp(LocalDateTime.now());
//
//        auditRepo.save(log);
//    }
//}
