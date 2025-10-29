package com.example.demo.controllers;

import com.example.demo.services.TuAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private TuAuthService tuAuthService;

    @PostMapping("/login")
    public String login(@RequestParam String username, @RequestParam String password) {
        return tuAuthService.verifyUser(username, password);
    }
}
