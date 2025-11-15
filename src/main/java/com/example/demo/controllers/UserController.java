package com.example.demo.controllers;

import com.example.demo.models.User;
import com.example.demo.repo.UserRepository;

import java.util.Optional;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserRepository repo;

    public UserController(UserRepository repo) {
        this.repo = repo;
    }

    @PostMapping("/save")
    public User saveUser(@RequestBody User u) {
        return repo.save(u);
    }

    @GetMapping("/{username}")
    public Optional<User> getUser(@PathVariable String username) {
        return repo.findByUsername(username);
    }
}
