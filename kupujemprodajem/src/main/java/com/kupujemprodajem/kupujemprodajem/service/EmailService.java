package com.kupujemprodajem.kupujemprodajem.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String to, String link) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("Verifikacija naloga");
        message.setText("Kliknite na sledeci link da biste verifikovali svoj nalog: \n" + link);
        mailSender.send(message);
    }

}
