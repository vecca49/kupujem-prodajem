package com.kupujemprodajem.kupujemprodajem.service;

import com.google.common.hash.BloomFilter;
import com.google.common.hash.Funnels;
import com.kupujemprodajem.kupujemprodajem.model.User;
import com.kupujemprodajem.kupujemprodajem.model.VerificationToken;
import com.kupujemprodajem.kupujemprodajem.repository.UserRepository;
import com.kupujemprodajem.kupujemprodajem.repository.VerificationTokenRepository;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    VerificationTokenRepository tokenRepository;

    @Autowired
    EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private BloomFilter<String> usernameBloomFilter;

    @PostConstruct
    public void init(){
        List<User> allUsers = userRepository.findAll();
        usernameBloomFilter = BloomFilter.create(Funnels.stringFunnel(StandardCharsets.UTF_8), allUsers.size() + 1000);

        for(User user : allUsers){
            usernameBloomFilter.put(user.getUsername());
        }
    }

    public boolean mightContainUsername(String username) {
        return usernameBloomFilter.mightContain(username);
    }

    @Transactional
    public  synchronized  User saveUser( User user){
        if(user.getPassword() == null || user.getPassword().length() < 6){
            throw new IllegalArgumentException("Password must be at least 6 characters.");
        }

        if(userRepository.findByUsername(user.getUsername()) != null){
            throw  new IllegalArgumentException("Username is already taken.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        user.setAccountVerified(false);

        usernameBloomFilter.put(user.getUsername());

        return  userRepository.save(user);
    };

    public User getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    public User getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void deleteUserById(Long id) {
        VerificationToken token = tokenRepository.findByUserId(id);
        if (token != null) {
            tokenRepository.delete(token);
        }

        userRepository.deleteById(id);
    }

    public User updateUser(Long id, User newUserData){
        return  userRepository.findById(id)
                .map(existingUser -> {
                    existingUser.setUsername(newUserData.getUsername());
                    existingUser.setAddress(newUserData.getAddress());
                    existingUser.setPassword(newUserData.getPassword());
                    existingUser.setLatitude(newUserData.getLatitude());
                    existingUser.setLongitude(newUserData.getLongitude());
                    existingUser.setEmail(newUserData.getEmail());
                    return  userRepository.save(existingUser);
                }).orElse(null);
    }

    public void createVerificationToken(User user){
        String token = UUID.randomUUID().toString();

        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);

        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));

        tokenRepository.save(verificationToken);

        String url = "http://localhost:8080/api/users/verify?token=" + token;

        emailService.sendVerificationEmail(user.getEmail(), url);
    }


    private final Map<String, List<LocalDateTime>> loginAttempts = new ConcurrentHashMap<>();

    public boolean canAttemptLogin(String ip) {
        LocalDateTime now = LocalDateTime.now();
        loginAttempts.putIfAbsent(ip, new CopyOnWriteArrayList<>());

        loginAttempts.get(ip).removeIf(time -> time.isBefore(now.minusMinutes(1)));

        return loginAttempts.get(ip).size() < 5;
    }

    public void logFailedAttempt(String ip) {
        loginAttempts.putIfAbsent(ip, new CopyOnWriteArrayList<>());
        loginAttempts.get(ip).add(LocalDateTime.now());
    }

    public void resetAttempts(String ip) {
        loginAttempts.remove(ip);
    }


}
