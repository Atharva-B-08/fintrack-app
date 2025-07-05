package com.fintrack.controller;

import com.fintrack.dto.SeedRequest;
import com.fintrack.service.SeedService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController

@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SeedController {

    @Autowired
    private SeedService seedService;

    @PostMapping("/seed")
    public ResponseEntity<?> seed(@RequestBody SeedRequest request) {
        try {
            seedService.seedData(request);
            return ResponseEntity.ok(Map.of("success", true, "message", "Seeded successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}

