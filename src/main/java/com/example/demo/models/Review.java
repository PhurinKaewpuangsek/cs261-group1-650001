package com.example.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "card")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String course;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String professor;

    private int rating;

    @Column(columnDefinition = "NVARCHAR(500)")
    private String comment;

    // ✅ ใช้ Integer + default = 0 (กัน null ใน DB)
    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer helpfulCount = 0;

    @Column(nullable = false, columnDefinition = "INT DEFAULT 0")
    private Integer notHelpfulCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(columnDefinition = "NVARCHAR(255)")
    private String avatar; // ✅ path รูปโปรไฟล์

    @Column(name = "reviewer_username", columnDefinition = "NVARCHAR(255)")
    private String reviewerUsername; // ✅ เก็บเลขนักศึกษาหรือ username ของผู้รีวิว

    private boolean anonymous; // ✅ โหมด anonymous

    @Transient
    @JsonIgnore
    private User author;

    // ===== Constructor =====
    public Review() {}

    // ===== Getter / Setter =====
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getProfessor() { return professor; }
    public void setProfessor(String professor) { this.professor = professor; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Integer getHelpfulCount() {
        return helpfulCount != null ? helpfulCount : 0;
    }
    public void setHelpfulCount(Integer helpfulCount) {
        this.helpfulCount = helpfulCount != null ? helpfulCount : 0;
    }

    public Integer getNotHelpfulCount() {
        return notHelpfulCount != null ? notHelpfulCount : 0;
    }
    public void setNotHelpfulCount(Integer notHelpfulCount) {
        this.notHelpfulCount = notHelpfulCount != null ? notHelpfulCount : 0;
    }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public boolean isAnonymous() { return anonymous; }
    public void setAnonymous(boolean anonymous) { this.anonymous = anonymous; }

    public String getReviewerUsername() { return reviewerUsername; }
    public void setReviewerUsername(String reviewerUsername) { this.reviewerUsername = reviewerUsername; }

    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
}
