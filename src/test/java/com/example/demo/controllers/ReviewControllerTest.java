package com.example.demo.controllers;

import com.example.demo.models.Review;
import com.example.demo.services.ReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


// ทดสอบว่า API Endpoints ของ ReviewController ทำงานกับ HTTP Request และ Response ได้ถูกต้องหรือไม่

@WebMvcTest(ReviewController.class) 
class ReviewControllerTest {

	@Autowired
	private MockMvc mockMvc; 

	@MockBean 
	private ReviewService reviewService;

	@Autowired
	private ObjectMapper objectMapper; 
	
	@Test
	void getAllReviews_ShouldReturnListOfReviews() throws Exception {
		Review review1 = new Review();
		review1.setId(1L);
		review1.setCourse("CS261");

		Review review2 = new Review();
		review2.setId(2L);
		review2.setCourse("CS233");

		when(reviewService.getAllReviews()).thenReturn(List.of(review1, review2));

		mockMvc.perform(get("/api/reviews/all")).andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON)).andExpect(jsonPath("$", hasSize(2))) 
				.andExpect(jsonPath("$[0].course", is("CS261"))).andExpect(jsonPath("$[1].id", is(2)));
	}

	@Test
	void addReview_WithValidUsername_ShouldReturnSavedReview() throws Exception {
		Review reviewToAdd = new Review();
		reviewToAdd.setCourse("CS240");
		reviewToAdd.setComment("comment");

		Review savedReview = new Review();
		savedReview.setId(100L);
		savedReview.setCourse("CS240");
		savedReview.setComment("comment");
		savedReview.setReviewerUsername("testuser");

		when(reviewService.saveReview(eq("testuser"), any(Review.class))).thenReturn(savedReview);

		mockMvc.perform(post("/api/reviews/add").param("username", "testuser").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(reviewToAdd))) 
				.andExpect(status().isOk()).andExpect(jsonPath("$.id", is(100)))
				.andExpect(jsonPath("$.reviewerUsername", is("testuser")));
	}

	@Test
	void addReview_WithNoUsername_ShouldReturnBadRequest() throws Exception {
		Review reviewToAdd = new Review();
		reviewToAdd.setCourse("CS102");


		mockMvc.perform(post("/api/reviews/add").param("username", "") 
				.contentType(MediaType.APPLICATION_JSON).content(objectMapper.writeValueAsString(reviewToAdd)))
				.andExpect(status().isBadRequest()); // คาดหวังว่าจะได้ HTTP 400 Bad Request
	}
}