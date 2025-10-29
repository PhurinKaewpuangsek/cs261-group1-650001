package com.example.demo.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class TuAuthService {

    @Value("${tu.api.key}")
    private String applicationKey;

    @Value("${tu.api.url}")
    private String apiUrl;

    public String verifyUser(String username, String password) {
        RestTemplate restTemplate = new RestTemplate();

        // headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Application-Key", applicationKey);

        // body
        Map<String, String> body = new HashMap<>();
        body.put("UserName", username);
        body.put("PassWord", password);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, String.class);
            return response.getBody();
        } catch (Exception e) {
            return "{\"error\": \"" + e.getMessage() + "\"}";
        }
    }
}
