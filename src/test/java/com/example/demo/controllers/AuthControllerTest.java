package com.example.demo.controllers;

import com.example.demo.services.TuAuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// ทดสอบว่า AuthController สามารถรับ HTTP Request และแปลงผลลัพธ์จาก TuAuthService ไปเป็น HTTP Response ที่ถูกต้องได้หรือไม่

@WebMvcTest(AuthController.class)
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private TuAuthService tuAuthService;

	@Test
	void login_whenCredentialsAreValid_shouldReturnOkFromService() throws Exception {
		String username = "validUser";
		String password = "validPassword";
		ResponseEntity<Object> successResponse = ResponseEntity.ok(Map.of("status", true, "message", "Login success"));

		when(tuAuthService.verifyUser(username, password)).thenReturn(successResponse);

		mockMvc.perform(post("/api/auth/login").param("username", username).param("password", password))
				.andExpect(status().isOk()).andExpect(jsonPath("$.status", org.hamcrest.Matchers.is(true)));
	}

	@Test
	void login_whenCredentialsAreInvalid_shouldReturnUnauthorizedFromService() throws Exception {
		String username = "invalidUser";
		String password = "invalidPassword";
		ResponseEntity<Object> failureResponse = ResponseEntity.status(HttpStatus.UNAUTHORIZED)
				.body(Map.of("status", false, "message", "Invalid credentials"));

		when(tuAuthService.verifyUser(username, password)).thenReturn(failureResponse);

		mockMvc.perform(post("/api/auth/login").param("username", username).param("password", password))
				.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.status", org.hamcrest.Matchers.is(false)));
	}

	@Test
	void logout_shouldAlwaysReturnOk() throws Exception {
		mockMvc.perform(post("/api/auth/logout")).andExpect(status().isOk())
				.andExpect(jsonPath("$.message", org.hamcrest.Matchers.containsString("Logout success")));
	}
}