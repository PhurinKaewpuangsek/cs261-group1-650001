package com.example.demo.services;

import com.example.demo.models.User;
import com.example.demo.repo.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class TuAuthService {

    @Value("${tu.api.key}")
    private String applicationKey;

    @Value("${tu.api.url}")
    private String apiUrl;

    private final UserRepository userRepository;

    public TuAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public ResponseEntity<Object> verifyUser(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Application-Key", applicationKey);

        Map<String, String> body = new HashMap<>();
        body.put("UserName", username);
        body.put("PassWord", password);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            JsonNode json = mapper.readTree(response.getBody());

            if (json.has("status") && json.get("status").asBoolean()) {
                saveOrUpdateProfile(json);
                return ResponseEntity.ok(Map.of(
                        "status", true,
                        "message", "Login success and profile updated",
                        "user", json
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                        "status", false,
                        "message", "Invalid credentials",
                        "response", json
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    private void saveOrUpdateProfile(JsonNode json) {
        String username = json.get("username").asText();
        Optional<User> optional = userRepository.findByUsername(username); // ✅ ใช้ Optional จาก repo

        User profile = optional.orElse(new User());
        profile.setUsername(username);
        profile.setDisplayName(json.path("displayname_th").asText());
        profile.setEmail(json.path("email").asText());
        profile.setFaculty(json.path("faculty").asText());
        profile.setDepartment(json.path("department").asText());
        profile.setLastLogin(java.time.LocalDateTime.now());

        userRepository.save(profile);
    }
}
