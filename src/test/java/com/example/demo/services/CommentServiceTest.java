package com.example.demo.services;

import com.example.demo.models.Comment;
import com.example.demo.repo.CommentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

// ทดสอบ CommentService 

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

	@Mock
	private CommentRepository commentRepository;

	@InjectMocks
	private CommentService commentService;

	@Test
	void addComment_withValidText_shouldSetCreatedAtAndSave() {
		Comment comment = new Comment();
		comment.setText("Hello World eiei!");
		comment.setCreatedAt(null);

		when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
			Comment c = invocation.getArgument(0);
			c.setId(1L); 
			return c;
		});

		Comment savedComment = commentService.addComment(comment);

		assertNotNull(savedComment.getId());
		assertNotNull(savedComment.getCreatedAt()); 
	}

	@Test
	void addComment_withEmptyText_shouldThrowException() {
		Comment comment = new Comment();
		comment.setText(""); 

		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
			commentService.addComment(comment);
		});

		assertEquals("Comment text cannot be empty", exception.getMessage());
	}

	@Test
	void addComment_withNullText_shouldThrowException() {
		Comment comment = new Comment();
		comment.setText(null);

		IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
			commentService.addComment(comment);
		});

		assertEquals("Comment text cannot be empty", exception.getMessage());
	}
}