package com.example.demo.repo;

import com.example.demo.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUsername(String username);
}
