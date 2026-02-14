package com.example.demo.controller;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import com.example.demo.entity.User;
import com.example.demo.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {

        String result = authService.signup(user);

        if (!result.equals("Signup successful")) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }

//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody Map<String,String> data) {
//
//        String result = authService.login(
//                data.get("username"),
//                data.get("password"));
//
//        // If result is not a valid JWT (not 3 parts separated by .)
//        if (result == null || result.split("\\.").length != 3) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
//        }
//
//        return ResponseEntity.ok(Map.of("token", result));
//    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String,String> data) {

        String result = authService.login(
                data.get("username"),
                data.get("password"));

        if (result == null || result.split("\\.").length != 3) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", result));
        }

        return ResponseEntity.ok(Map.of("token", result));
    }

//    @PostMapping("/login")
//    public String login(@RequestBody Map<String,String> data) {
//        return authService.login(
//                data.get("username"),
//                data.get("password"));
//    }

    @PostMapping("/forgot")
    public String forgot(@RequestParam String email) {
        return authService.forgotPassword(email);
    }
//    @PostMapping("/reset")
//    public String reset(@RequestParam String token,
//                        @RequestParam String password) {
//        return authService.resetPassword(token, password);
//    }
@PostMapping("/reset")
public ResponseEntity<?> reset(@RequestBody Map<String, String> data) {

    String token = data.get("token");
    String password = data.get("password");

    String result = authService.resetPassword(token, password);

    if (!result.equals("Password reset successful")) {
        return ResponseEntity.badRequest().body(result);
    }

    return ResponseEntity.ok(result);
}

    @PostMapping("/logout")
    public String logout() {
        return "Logout successful. Please delete token on client side.";
    }
    @PostMapping("/admin/unlock")
    public String unlock(@RequestParam String username) {
        return authService.unlockUser(username);
    }

    @GetMapping("/admin/stats")
    public Map<String, Long> getStats() {

        return Map.of(
                "totalUsers", authService.getTotalUsers(),
                "lockedUsers", authService.getLockedUsers()
        );
    }


}
