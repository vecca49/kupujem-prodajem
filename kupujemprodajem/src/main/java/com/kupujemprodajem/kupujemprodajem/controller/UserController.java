package com.kupujemprodajem.kupujemprodajem.controller;

import com.kupujemprodajem.kupujemprodajem.model.LoginRequest;
import com.kupujemprodajem.kupujemprodajem.model.User;
import com.kupujemprodajem.kupujemprodajem.model.VerificationToken;
import com.kupujemprodajem.kupujemprodajem.repository.VerificationTokenRepository;
import com.kupujemprodajem.kupujemprodajem.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user){
        User savedUser = userService.saveUser(user);
        userService.createVerificationToken(savedUser);
        return ResponseEntity.ok(savedUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest){
        String ip = httpRequest.getRemoteAddr();

        if(!userService.canAttemptLogin(ip)) {
            return  ResponseEntity.status(429).body("Too many login attempts. Please wait a minute and try again.");
        }

        User user = userService.getByUsername(request.getUsername());

        if(user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            userService.logFailedAttempt(ip);
            return ResponseEntity.status(401).body("Wrong username or password.");
        }

        userService.resetAttempts(ip);
        return  ResponseEntity.ok("Successful login.");
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getByEmail(email);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User newUserData) {
        User updated = userService.updateUser(id, newUserData);
        if (updated == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/verify")
    public ResponseEntity<String> verifyUser(@RequestParam String token) {
        VerificationToken vToken = tokenRepository.findByToken(token);
        if (vToken == null || vToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired token.");
        }

        User user = vToken.getUser();
        user.setAccountVerified(true);
        userService.updateUser(user.getId(), user);
        tokenRepository.delete(vToken);

        return ResponseEntity.ok("Account successfully verified!");
    }

    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsername(@PathVariable String username) {
        boolean exists = userService.mightContainUsername(username);
        return ResponseEntity.ok(exists);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
    }



}
