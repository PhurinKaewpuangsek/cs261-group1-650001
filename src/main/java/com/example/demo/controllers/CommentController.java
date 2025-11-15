package com.example.demo.controllers;

import com.example.demo.models.Comment;
import com.example.demo.models.User;
import com.example.demo.services.CommentService;
import com.example.demo.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:9090") // ✅ ให้ frontend เรียกได้
public class CommentController {

    private final CommentService service;
    private final UserRepository userRepo;

    public CommentController(CommentService service, UserRepository userRepo) {
        this.service = service;
        this.userRepo = userRepo;
    }

    // ✅ ดึงคอมเมนต์ของรีวิว (ซ่อน userId และ studentId จาก frontend)
    @GetMapping("/{reviewId}")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long reviewId) {
        List<Comment> comments = service.getCommentsByReview(reviewId);
        comments.forEach(c -> {
            c.setUserId(null);          // ❌ ไม่ให้ frontend เห็น id ภายใน
            c.setStudentId(null);       // ❌ ไม่ให้เห็นรหัสนักศึกษา
            c.setAuthor("Anonymous");   // ✅ แสดง Anonymous เสมอ
        });
        return ResponseEntity.ok(comments);
    }

    // ✅ เพิ่มคอมเมนต์ใหม่ (เก็บ user_id + student_id แต่ไม่แสดงออก)
    @PostMapping
    public ResponseEntity<?> addComment(
            @RequestParam String username, // มาจาก TU API login
            @RequestBody Comment comment) {

        try {
            // 🔍 หา user จาก username (TU Login)
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));

            // ✅ เก็บ user_id และ student_id (username = รหัสนักศึกษา)
            comment.setUserId(user.getId());
            comment.setStudentId(user.getUsername());
            comment.setAuthor("Anonymous"); // ✅ frontend จะเห็น Anonymous เสมอ

            Comment saved = service.addComment(comment);
            return ResponseEntity.ok(saved);

        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body("❌ ไม่พบผู้ใช้ username นี้ หรือข้อมูลไม่ถูกต้อง: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity
                    .internalServerError()
                    .body("❌ เกิดข้อผิดพลาดในระบบ: " + ex.getMessage());
        }
    }

    // ✅ [OPTIONAL] สำหรับ admin: ดูคอมเมนต์ทั้งหมด (เห็น userId/studentId จริง)
    @GetMapping("/admin/all")
    public ResponseEntity<List<Comment>> getAllComments() {
        return ResponseEntity.ok(service.getAllComments());
    }
}
