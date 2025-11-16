package com.example.demo.controllers;

import com.example.demo.models.Review;
import com.example.demo.services.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:8081") // ✅ อนุญาตให้ frontend เข้าถึง
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ✅ POST /api/reviews/add?username=<ชื่อผู้ใช้>
    @PostMapping("/add")
    public ResponseEntity<Object> addReview(
            @RequestParam String username,
            @RequestBody Review review) {

        System.out.println("📩 [REVIEW ADD] username = " + username);

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("⚠️ ต้องระบุ username เพื่อบันทึกรีวิว");
        }

        try {
            Review saved = reviewService.saveReview(username, review);
            System.out.println("✅ Review saved successfully by " + username);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("❌ ERROR saving review: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ เกิดข้อผิดพลาดระหว่างบันทึกรีวิว: " + e.getMessage());
        }
    }

    // ✅ GET /api/reviews/all — ดึงรีวิวทั้งหมด
    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        try {
            List<Review> reviews = reviewService.getAllReviews();
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            System.err.println("❌ ERROR fetching reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // ✅ GET /api/reviews/user?username=<ชื่อผู้ใช้>
    @GetMapping("/user")
    public ResponseEntity<Object> getReviewsByCurrentUser(
            @RequestParam String username) {

        System.out.println("🧭 [DEBUG] Fetching reviews for username = " + username);

        if (username == null || username.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("⚠️ ต้องระบุ username ก่อนดึงรีวิวของผู้ใช้");
        }

        try {
            return ResponseEntity.ok(reviewService.getReviewsByUser(username));
        } catch (Exception e) {
            System.err.println("❌ ERROR fetching user's reviews: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ เกิดข้อผิดพลาดขณะดึงข้อมูลรีวิวของผู้ใช้");
        }
    }

    // ✅ GET /api/reviews/{id} — ดึงรีวิวตาม ID สำหรับ review-detail.html
    @GetMapping("/{id}")
    public ResponseEntity<Object> getReviewById(@PathVariable Long id) {
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("❌ ไม่พบรีวิวที่ต้องการ");
            }
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            System.err.println("❌ ERROR fetching review by ID: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ เกิดข้อผิดพลาดขณะดึงข้อมูลรีวิว: " + e.getMessage());
        }
    }

    // ✅ PUT /api/reviews/{id}/feedback?type=helpful&action=cancel|helpful|notHelpful
    @PutMapping("/{id}/feedback")
    public ResponseEntity<?> updateFeedback(
            @PathVariable Long id,
            @RequestParam String type,
            @RequestParam(required = false, defaultValue = "none") String action) { // ✅ ป้องกัน error ถ้าไม่ได้ส่ง action
        try {
            Review review = reviewService.getReviewById(id);
            if (review == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("❌ ไม่พบรีวิวที่ต้องการอัปเดต");
            }

            // ✅ Toggle feedback logic (กดซ้ำ = ยกเลิก, กดอีกฝั่ง = สลับ)
            if ("helpful".equalsIgnoreCase(type)) {
                switch (action) {
                    case "helpful" -> review.setHelpfulCount(review.getHelpfulCount() + 1);
                    case "cancel" -> review.setHelpfulCount(Math.max(0, review.getHelpfulCount() - 1));
                    case "notHelpful" -> {
                        review.setHelpfulCount(Math.max(0, review.getHelpfulCount() - 1));
                        review.setNotHelpfulCount(review.getNotHelpfulCount() + 1);
                    }
                    default -> System.out.println("⚠️ Unknown action: " + action);
                }
            } else if ("notHelpful".equalsIgnoreCase(type)) {
                switch (action) {
                    case "notHelpful" -> review.setNotHelpfulCount(review.getNotHelpfulCount() + 1);
                    case "cancel" -> review.setNotHelpfulCount(Math.max(0, review.getNotHelpfulCount() - 1));
                    case "helpful" -> {
                        review.setNotHelpfulCount(Math.max(0, review.getNotHelpfulCount() - 1));
                        review.setHelpfulCount(review.getHelpfulCount() + 1);
                    }
                    default -> System.out.println("⚠️ Unknown action: " + action);
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("⚠️ ค่าของ type ต้องเป็น helpful หรือ notHelpful เท่านั้น");
            }

            // ✅ บันทึกผลการอัปเดต
            Review updated = reviewService.save(review);
            System.out.println("👍 Updated feedback for review " + id + ": " + type + " (" + action + ")");
            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            System.err.println("❌ ERROR updating feedback: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ เกิดข้อผิดพลาดในการอัปเดต feedback: " + e.getMessage());
        }
    }
}
