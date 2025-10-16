package com.example.demo.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Card;
import com.example.demo.models.CardDTO;
import com.example.demo.services.CardRepository;





@RestController
@RequestMapping("/api/review")
@CrossOrigin 
public class MyController {
	@Autowired
	private CardRepository repo;

	@PostMapping
    public Card saveReview(@RequestBody Card review) {
        // TODO: บันทึก review ลง database
        return repo.save(review);
    }
	@GetMapping
	public List<Card> showReview() {
		return repo.findAll();
	}
}
