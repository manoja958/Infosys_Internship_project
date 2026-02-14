
package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    private int failedAttempts;

    private boolean accountLocked;

    private LocalDateTime lockTime;

    private String resetToken;

    private LocalDateTime tokenExpiry;

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


    public int getFailedAttempts() {
        return failedAttempts;
    }

    public void setFailedAttempts(int failedAttempts) {
        this.failedAttempts = failedAttempts;
    }


    public boolean isAccountLocked() {
        return accountLocked;
    }

    public void setAccountLocked(boolean accountLocked) {
        this.accountLocked = accountLocked;
    }


    public LocalDateTime getLockTime() {
        return lockTime;
    }

    public void setLockTime(LocalDateTime lockTime) {
        this.lockTime = lockTime;
    }


    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }


    public LocalDateTime getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(LocalDateTime tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }
}




//package com.example.demo.entity;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//@Table(name = "users")
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true)
//    private String username;
//
//    @Column(unique = true)
//    private String email;
//
//    private String password;
//    private String role;
//
//    private int failedAttempts;
//    private boolean accountLocked;
//
//    private String resetToken;
//    private LocalDateTime tokenExpiry;
//    private LocalDateTime lockTime;   // ADD THIS
//
//    public Long getId() { return id; }
//
//    public String getUsername() { return username; }
//    public void setUsername(String username) { this.username = username; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//
//    public String getRole() { return role; }
//    public void setRole(String role) { this.role = role; }
//
//    public int getFailedAttempts() { return failedAttempts; }
//    public void setFailedAttempts(int failedAttempts) { this.failedAttempts = failedAttempts; }
//
//    public boolean isAccountLocked() { return accountLocked; }
//    public void setAccountLocked(boolean accountLocked) { this.accountLocked = accountLocked; }
//
//    public String getResetToken() { return resetToken; }
//    public void setResetToken(String resetToken) { this.resetToken = resetToken; }
//
//    public LocalDateTime getTokenExpiry() { return tokenExpiry; }
//    public void setTokenExpiry(LocalDateTime tokenExpiry) { this.tokenExpiry = tokenExpiry; }
//
//    public LocalDateTime getLockTime() {
//        return lockTime;
//    }
//
//    public void setLockTime(LocalDateTime lockTime) {
//        this.lockTime = lockTime;
//    }
//
//}
