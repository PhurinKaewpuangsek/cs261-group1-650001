package com.example.demo.repo;

import com.example.demo.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    // ✅ ดึงรีวิวทั้งหมดของนักศึกษาคนหนึ่ง
    List<Review> findByReviewerUsername(String reviewerUsername);
}
