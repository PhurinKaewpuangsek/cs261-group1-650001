package com.example.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ReviewController {

    @GetMapping("/review")
    public String reviewPage() {
        // ต้องระบุชื่อโฟลเดอร์ด้วย เพราะ review.html อยู่ใน /templates/review/
        return "review/review";
    }
}