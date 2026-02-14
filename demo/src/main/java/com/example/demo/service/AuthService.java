package com.example.demo.service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.security.JWTUtility;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private JWTUtility jwtUtility;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCK_DURATION_MINUTES = 15;

    // =========================
    // SIGNUP
    // =========================
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

    // =========================
    // LOGIN
    // =========================
    public String login(String username, String password) {

        User user = userRepo.findByUsername(username).orElse(null);

        if (user == null)
            return "Invalid username";

        // Check if account locked
        if (user.isAccountLocked()) {

            if (user.getLockTime() != null &&
                    user.getLockTime()
                            .plusMinutes(LOCK_DURATION_MINUTES)
                            .isBefore(LocalDateTime.now())) {

                // Auto unlock after 15 minutes
                user.setAccountLocked(false);
                user.setFailedAttempts(0);
                user.setLockTime(null);
                userRepo.save(user);

            } else {
                return "Account locked. Try again after 15 minutes";
            }
        }

        // Validate password
        if (!encoder.matches(password, user.getPassword())) {

            user.setFailedAttempts(user.getFailedAttempts() + 1);

            if (user.getFailedAttempts() >= MAX_FAILED_ATTEMPTS) {
                user.setAccountLocked(true);
                user.setLockTime(LocalDateTime.now());
                userRepo.save(user);
                return "Account locked due to 3 failed attempts. Try after 15 minutes";
            }

            userRepo.save(user);

            int remaining = MAX_FAILED_ATTEMPTS - user.getFailedAttempts();
            return "Invalid password. " + remaining + " attempts remaining";
        }

        // Successful login
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepo.save(user);

        return jwtUtility.generateToken(user.getUsername(), user.getRole());
    }

    // =========================
    // FORGOT PASSWORD
    // =========================
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

    // =========================
    // RESET PASSWORD
    // =========================


    @Transactional
    public String resetPassword(String token, String newPassword) {

        User user = userRepo.findByResetToken(token).orElse(null);

        if (user == null)
            return "Invalid token";

        if (user.getTokenExpiry() == null ||
                user.getTokenExpiry().isBefore(LocalDateTime.now()))
            return "Token expired";

        System.out.println("OLD HASH: " + user.getPassword());

        String newHash = encoder.encode(newPassword);
        System.out.println("NEW HASH: " + newHash);

        user.setPassword(newHash);

        user.setFailedAttempts(0);
        user.setAccountLocked(false);
        user.setLockTime(null);

        user.setResetToken(null);
        user.setTokenExpiry(null);

        userRepo.save(user);

        System.out.println("PASSWORD UPDATED IN DB");

        return "Password reset successful";
    }

    public long getTotalUsers() {
        return userRepo.count();
    }

    public long getLockedUsers() {
        return userRepo.countByAccountLockedTrue();
    }



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
//        if (newPassword == null ||
//                !newPassword.matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$"))
//            return "Password must contain 1 uppercase, 1 number, 1 special character and minimum 8 characters";
//
//        user.setPassword(encoder.encode(newPassword));
//
//        // Unlock account after reset
//        user.setFailedAttempts(0);
//        user.setAccountLocked(false);
//        user.setLockTime(null);
//
//        user.setResetToken(null);
//        user.setTokenExpiry(null);
//
//        userRepo.save(user);
//
//        return "Password reset successful";
//    }

    // =========================
    // ADMIN UNLOCK
    // =========================
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
}










//package com.example.demo.service;
//import com.example.demo.security.JWTUtility;
//
//import com.example.demo.entity.User;
//import com.example.demo.repository.UserRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.UUID;
//
//@Service
//public class AuthService {
//    @Autowired
//    private JWTUtility jwtUtility;
//
//    @Autowired
//    private EmailService emailService;
//    @Autowired
//    private UserRepository userRepo;
//
//    @Autowired
//    private BCryptPasswordEncoder encoder;
//
//    // SIGNUP
//    public String signup(User user) {
//        if (!user.getPassword().matches("^(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+=]).{8,}$"))
//            return "Password must contain 1 uppercase, 1 number, 1 special character and minimum 8 characters";
//
//        if (user.getUsername().length() < 5 || user.getUsername().length() > 15)
//            return "Username must be between 5 and 15 characters";
//
//        if (user.getPassword().length() < 8)
//            return "Password must be at least 8 characters";
//
//        if (userRepo.findByUsername(user.getUsername()).isPresent())
//            return "Username already exists";
//
//        user.setPassword(encoder.encode(user.getPassword()));
//        user.setRole(user.getRole().toUpperCase());
//        user.setFailedAttempts(0);
//        user.setAccountLocked(false);
//
//        userRepo.save(user);
//
//        return "Signup successful";
//    }
//
//    // LOGIN
//    public String login(String username, String password) {
//
//        User user = userRepo.findByUsername(username).orElse(null);
//
//        if (user == null)
//            return "Invalid username";
//
//        if (user.isAccountLocked())
//            return "Account locked due to 3 failed attempts";
//
//        if (!encoder.matches(password, user.getPassword())) {
//
//            user.setFailedAttempts(user.getFailedAttempts() + 1);
//
//            if (user.getFailedAttempts() >= 3) {
//                user.setAccountLocked(true);
//            }
//
//            userRepo.save(user);
//            return "Invalid password";
//        }
//
//        user.setFailedAttempts(0);
//        userRepo.save(user);
//
//        return jwtUtility.generateToken(user.getUsername(), user.getRole());
//    }
//
//    // FORGOT PASSWORD
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
//
//    //    public String forgotPassword(String email) {
////
////        User user = userRepo.findByEmail(email).orElse(null);
////
////        if (user == null)
////            return "Email not found";
////
////        String token = UUID.randomUUID().toString();
////
////        user.setResetToken(token);
////        user.setTokenExpiry(LocalDateTime.now().plusMinutes(15));
////
////        userRepo.save(user);
////
////        return "Reset token generated (email sending later)";
////    }
//    // RESET PASSWORD
//    public String resetPassword(String token, String newPassword) {
//
//        User user = userRepo.findByResetToken(token).orElse(null);
//
//        if (user == null)
//            return "Invalid token";
//
//        if (user.getTokenExpiry().isBefore(LocalDateTime.now()))
//            return "Token expired";
//
//        if (newPassword.length() < 8)
//            return "Password must be at least 8 characters";
//
//        user.setPassword(encoder.encode(newPassword));
//        user.setResetToken(null);
//        user.setTokenExpiry(null);
//
//        userRepo.save(user);
//
//        return "Password reset successful";
//    }
//
//    public String unlockUser(String username) {
//
//        User user = userRepo.findByUsername(username).orElse(null);
//
//        if (user == null)
//            return "User not found";
//
//        user.setAccountLocked(false);
//        user.setFailedAttempts(0);
//
//        userRepo.save(user);
//
//        return "User unlocked successfully";
//    }
//
//
//}
