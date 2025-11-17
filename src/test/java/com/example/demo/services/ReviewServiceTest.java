package com.example.demo.services;

import com.example.demo.models.Review;
import com.example.demo.models.User;
import com.example.demo.repo.ReviewRepository;
import com.example.demo.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

// ทดสอบ ReviewService

@ExtendWith(MockitoExtension.class) 
class ReviewServiceTest {

	@Mock 
	private ReviewRepository reviewRepository;

	@Mock
	private UserRepository userRepository;

	@InjectMocks 
	private ReviewService reviewService;

	private User testUser;
	private Review reviewToSave;

	@BeforeEach
	void setUp() {
		testUser = new User();
		testUser.setId(1L);
		testUser.setUsername("6709650110");

		reviewToSave = new Review();
		reviewToSave.setCourse("Test Course");
		reviewToSave.setComment("Great course!");
	}

	@Test
	void saveReview_WhenUserExists_ShouldSetUsernameAndSave() {
		when(userRepository.findByUsername("6709650110")).thenReturn(Optional.of(testUser));

		when(reviewRepository.save(any(Review.class))).thenAnswer(invocation -> invocation.getArgument(0));

		Review savedReview = reviewService.saveReview("6709650110", reviewToSave);

		assertNotNull(savedReview); 
		assertEquals("6709650110", savedReview.getReviewerUsername()); 
		assertNotNull(savedReview.getCreatedAt()); 
		assertEquals("/Avatar/Anonymous.png", savedReview.getAvatar()); 
	}

	@Test
	void saveReview_WhenUserNotFound_ShouldThrowRuntimeException() {
		when(userRepository.findByUsername("unknown_user")).thenReturn(Optional.empty());

		RuntimeException exception = assertThrows(RuntimeException.class, () -> {
			reviewService.saveReview("unknown_user", reviewToSave);
		});

		assertEquals("User not found", exception.getMessage());
	}
}