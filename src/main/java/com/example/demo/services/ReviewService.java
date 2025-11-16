package com.example.demo.services;

import com.example.demo.models.Review;
import com.example.demo.models.User;
import com.example.demo.repo.ReviewRepository;
import com.example.demo.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    // ✅ บันทึกรีวิว โดยเก็บ reviewer_username (เลขนักศึกษา)
    public Review saveReview(String username, Review review) {
        // ดึงข้อมูลผู้ใช้จาก username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ เก็บ username ของผู้รีวิว
        review.setReviewerUsername(user.getUsername());
        review.setCreatedAt(LocalDateTime.now());

        // ✅ ตั้งค่า avatar ถ้ายังไม่มี
        if (review.getAvatar() == null || review.getAvatar().isBlank()) {
            review.setAvatar("/Avatar/Anonymous.png");
        }

        // ✅ Anonymous Mode
        if (review.isAnonymous()) {
            // ไม่ต้องลบ reviewerUsername เพราะยังใช้ตรวจสอบหลังบ้านได้
        }

        return reviewRepository.save(review);
    }

    // ✅ สำหรับบันทึกโดยไม่ต้องมี username (ใช้ในระบบ feedback)
    public Review save(Review review) {
        return reviewRepository.save(review);
    }

    // ✅ ดึงรีวิวทั้งหมด (สำหรับ Dashboard)
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // ✅ ดึงรีวิวของผู้ใช้คนเดียว
    public List<Review> getReviewsByUser(String username) {
        return reviewRepository.findByReviewerUsername(username);
    }

    // ✅ ดึงรีวิวตาม ID
    public Review getReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    // ✅ เพิ่มฟังก์ชันอัปเดต Feedback แบบ toggle
    public Review updateFeedback(Long reviewId, String type, String action) {
        Review review = getReviewById(reviewId);
        if (review == null) {
            throw new RuntimeException("Review not found");
        }

        // 🎯 Logic toggle feedback
        if ("helpful".equalsIgnoreCase(type)) {
            switch (action) {
                case "helpful" -> review.setHelpfulCount(review.getHelpfulCount() + 1);
                case "cancel" -> review.setHelpfulCount(Math.max(0, review.getHelpfulCount() - 1));
                case "notHelpful" -> {
                    review.setHelpfulCount(Math.max(0, review.getHelpfulCount() - 1));
                    review.setNotHelpfulCount(review.getNotHelpfulCount() + 1);
                }
            }
        } else if ("notHelpful".equalsIgnoreCase(type)) {
            switch (action) {
                case "notHelpful" -> review.setNotHelpfulCount(review.getNotHelpfulCount() + 1);
                case "cancel" -> review.setNotHelpfulCount(Math.max(0, review.getNotHelpfulCount() - 1));
                case "helpful" -> {
                    review.setNotHelpfulCount(Math.max(0, review.getNotHelpfulCount() - 1));
                    review.setHelpfulCount(review.getHelpfulCount() + 1);
                }
            }
        } else {
            throw new RuntimeException("Invalid feedback type");
        }

        return reviewRepository.save(review);
    }
}
