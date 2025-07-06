package com.fintrack.controller;

import com.fintrack.config.CustomUserDetails;
import com.fintrack.dto.UserWithAllAccountResponse;
import com.fintrack.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // adjust in production
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String imageUrl = "http://localhost:8080/uploads/" + userDetails.getUser().getProfileImageUrl();

        return ResponseEntity.ok(Map.of(
                "name", userDetails.getUser().getName(),
                "email", userDetails.getUsername(),
                "profileImageUrl", imageUrl
        ));
    }

    @GetMapping("/inngest/with-accounts")
    public ResponseEntity<List<UserWithAllAccountResponse>> getUsersWithAccounts() {
        try{
            List<UserWithAllAccountResponse> users = userService.getAllUsersWithAccounts();
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

    }
}
