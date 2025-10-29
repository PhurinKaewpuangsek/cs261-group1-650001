package com.example.demo.controllers;

import com.example.demo.models.UserProfile;
import com.example.demo.repo.UserProfileRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserProfileRepository userRepo;

    // ✅ อัปเดตโปรไฟล์
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @RequestBody @Valid UserProfile updatedProfile,
            @RequestHeader("username") String username // จำลองการตรวจสอบ session
    ) {
        if (username == null || username.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Session expired or unauthorized"));
        }

        Optional<UserProfile> optionalUser = userRepo.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        UserProfile existing = optionalUser.get();

        // Validation (ความยาว)
        if (updatedProfile.getDisplayName() == null || updatedProfile.getDisplayName().length() < 3) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Display name must be at least 3 characters"));
        }

        if (updatedProfile.getDisplayName().length() > 50) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Display name too long"));
        }

        if (updatedProfile.getBio() != null && updatedProfile.getBio().length() > 255) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Bio too long"));
        }

        // Update data
        existing.setDisplayName(updatedProfile.getDisplayName());
        existing.setBio(updatedProfile.getBio());
        userRepo.save(existing);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("profile", existing);

        return ResponseEntity.ok(response);
    }
}
