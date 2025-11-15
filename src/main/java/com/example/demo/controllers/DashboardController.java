package com.example.demo.controllers;

import com.example.demo.models.Review;
import com.example.demo.repo.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private ReviewRepository reviewRepository;

    // ✅ Dashboard หลัก — ดึงข้อมูลจาก Database
    @GetMapping("")
    public String dashboard(Model model) {
        List<Review> reviews = reviewRepository.findAll();
        model.addAttribute("reviews", reviews);
        return "dashboard/dashboard"; // จะไปหา templates/dashboard/dashboard.html
    }

    @GetMapping("/profile")
    public String profile() {
        return "dashboard/profile";
    }

    @GetMapping("/review")
    public String review() {
        return "dashboard/review";
    }

    @GetMapping("/history")
    public String history() {
        return "dashboard/history";
    }

    @GetMapping("/review-detail")
    public String reviewDetail() {
        return "dashboard/review-detail";
    }

    @GetMapping("/guest")
    public String guestDashboard() {
        return "dashboard/guestDashboard";
    }
}
