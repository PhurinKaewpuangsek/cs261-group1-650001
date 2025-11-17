package com.example.demo.controllers;

import com.example.demo.models.Comment;
import com.example.demo.models.User;
import com.example.demo.repo.UserRepository;
import com.example.demo.services.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.is;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// ทดสอบว่า API Endpoints ของ CommentController ทำงานกับ HTTP Request และ Response ได้ถูกต้อง

@WebMvcTest(CommentController.class)
class CommentControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private CommentService commentService;

	@MockBean
	private UserRepository userRepo;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void getComments_ShouldHideUserIdAndStudentId() throws Exception {
		Comment comment = new Comment();
		comment.setId(1L);
		comment.setReviewId(10L);
		comment.setUserId(99L); // ข้อมูลที่ควรจะถูกซ่อน
		comment.setStudentId("6509xxxxxx"); // ข้อมูลที่ควรจะถูกซ่อน
		comment.setText("Test Comment");
		comment.setAuthor("SomeUser"); // ข้อมูลที่จะถูกเขียนทับ

		when(commentService.getCommentsByReview(10L)).thenReturn(List.of(comment));

		mockMvc.perform(get("/api/comments/10")).andExpect(status().isOk())
				.andExpect(jsonPath("$[0].text", is("Test Comment")))
				.andExpect(jsonPath("$[0].author", is("Anonymous"))) 
				.andExpect(jsonPath("$[0].userId").doesNotExist()) 
				.andExpect(jsonPath("$[0].studentId").doesNotExist()); 
	}

	@Test
	void addComment_WhenUserFound_ShouldSaveAndReturnComment() throws Exception {
		User user = new User();
		user.setId(5L);
		user.setUsername("testuser");

		Comment newComment = new Comment();
		newComment.setReviewId(1L);
		newComment.setText("New comment text");

		Comment savedComment = new Comment();
		savedComment.setId(101L);
		savedComment.setReviewId(1L);
		savedComment.setText("New comment text");
		savedComment.setUserId(5L);
		savedComment.setStudentId("testuser");
		savedComment.setAuthor("Anonymous");

		when(userRepo.findByUsername("testuser")).thenReturn(Optional.of(user));
		when(commentService.addComment(any(Comment.class))).thenReturn(savedComment);

		mockMvc.perform(post("/api/comments").param("username", "testuser").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(newComment))).andExpect(status().isOk())
				.andExpect(jsonPath("$.id", is(101))).andExpect(jsonPath("$.author", is("Anonymous")));
	}

	@Test
	void addComment_WhenUserNotFound_ShouldReturnBadRequest() throws Exception {
		Comment newComment = new Comment();
		newComment.setReviewId(1L);
		newComment.setText("New comment text");

		when(userRepo.findByUsername("unknown")).thenReturn(Optional.empty());

		mockMvc.perform(post("/api/comments").param("username", "unknown").contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsString(newComment))).andExpect(status().isBadRequest());
	}
}