package com.example.demo.services;

import com.example.demo.models.Comment;
import com.example.demo.repo.CommentRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {

    private final CommentRepository repo;

    public CommentService(CommentRepository repo) {
        this.repo = repo;
    }

    // ✅ ดึงคอมเมนต์ทั้งหมดของรีวิว (ใช้ในหน้า review-detail)
    public List<Comment> getCommentsByReview(Long reviewId) {
        return repo.findByReviewId(reviewId);
    }

    // ✅ เพิ่มคอมเมนต์ใหม่
    public Comment addComment(Comment comment) {
        // ป้องกันไม่ให้มีข้อมูลว่าง
        if (comment.getText() == null || comment.getText().isBlank()) {
            throw new IllegalArgumentException("Comment text cannot be empty");
        }

        // ตั้งเวลาอัตโนมัติหากไม่ได้ส่งมา
        if (comment.getCreatedAt() == null) {
            comment.setCreatedAt(LocalDateTime.now());
        }

        return repo.save(comment);
    }

    // ✅ [Admin] ดึงคอมเมนต์ทั้งหมด (รวม userId)
    public List<Comment> getAllComments() {
        return repo.findAll();
    }
}
