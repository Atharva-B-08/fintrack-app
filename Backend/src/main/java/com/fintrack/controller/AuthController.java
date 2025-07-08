package com.fintrack.controller;


import com.fintrack.dto.AuthResponse;
import com.fintrack.dto.LoginRequest;
import com.fintrack.dto.MessageResponse;
import com.fintrack.dto.SignUpRequest;
import com.fintrack.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartException;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // Or restrict to your frontend origin
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * ✅ Register a new user
     */
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@ModelAttribute SignUpRequest request) {
        try {
            MessageResponse response = authService.signup(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to upload profile image.");
        } catch (MultipartException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid file upload: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request: " + e.getMessage());
        }
    }

    /**
     * ✅ Login existing user
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            AuthResponse auth = authService.login(request);
            // Set cookie on success
            Cookie cookie = new Cookie("token", auth.getToken());
            cookie.setHttpOnly(true);
            cookie.setPath("/");
            cookie.setMaxAge(24 * 60 * 60); // 1 day
            response.addCookie(cookie);

            return ResponseEntity.ok(auth);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid credentials. Please try again.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {

        System.out.println("Logout inn");

        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}
