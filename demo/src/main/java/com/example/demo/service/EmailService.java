//package com.example.demo.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//public class EmailService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    public void sendResetEmail(String toEmail, String token) {
//
//        String link = "http://localhost:9090/auth/reset?token=" + token;
//
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(toEmail);
//        message.setSubject("Inventory System Password Reset");
//        message.setText("Click the link below to reset your password:\n" + link);
//
//        mailSender.send(message);
//    }
//}
package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    /* =====================================
       FORGOT PASSWORD EMAIL
    ===================================== */
    public void sendResetEmail(String toEmail, String token) {

        String link = "http://localhost:9090/auth/reset?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Inventory System Password Reset");
        message.setText(
                "Click the link below to reset your password:\n\n" +
                        link + "\n\n" +
                        "If you did not request this, please ignore this email."
        );

        mailSender.send(message);
    }

    /* =====================================
       APPROVAL EMAIL (TEMP PASSWORD)
    ===================================== */
    public void sendApprovalEmail(String toEmail,
                                  String username,
                                  String tempPassword) {

        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(toEmail);
        message.setSubject("Account Approved - Inventra");

        message.setText(
                "Congratulations! 🎉\n\n" +
                        "Your account request has been approved by Admin.\n\n" +
                        "Login Details:\n" +
                        "Username: " + username + "\n" +
                        "Temporary Password: " + tempPassword + "\n\n" +
                        "Please login and change your password immediately.\n\n" +
                        "Regards,\nInventra Team"
        );

        mailSender.send(message);
    }
}