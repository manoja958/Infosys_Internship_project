package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    /* ===================== */
    /* LOCK USER */
    /* ===================== */
    public String lockUser(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().equals("ADMIN")) {
            return "Admin accounts cannot be locked";
        }

        user.setAccountLocked(true);
        user.setLockTime(null); // manual lock
        userRepository.save(user);

        return "User locked successfully";
    }

    /* ===================== */
    /* UNLOCK USER */
    /* ===================== */
    public String unlockUser(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        user.setLockTime(null);
        userRepository.save(user);

        return "User unlocked successfully";
    }

    /* ===================== */
    /* DELETE USER */
    /* ===================== */
    public String deleteUser(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole().equals("ADMIN")) {
            return "Admin accounts cannot be deleted";
        }

        userRepository.delete(user);

        return "User deleted successfully";
    }
}