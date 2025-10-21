package com.example.demo.controllers;


import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.models.Card;
import com.example.demo.models.CardDTO;
import com.example.demo.models.DelCardDTO;
import com.example.demo.repo.CardRepository;





@RestController
@RequestMapping("/api/review")
@CrossOrigin 
public class MyController {
	@Autowired
	private CardRepository repo;

	@PostMapping("/post")
    public Card saveReview(@RequestBody CardDTO reviewDTO) {
        // TODO: บันทึก review ลง database
		Card review = new Card(reviewDTO.getName(),
				reviewDTO.getProf(),
				reviewDTO.getRating(),
				reviewDTO.getDescription());
		
        return repo.save(review);
    }
	@GetMapping()
	public List<Card> showReview() {
		return repo.findAll();
	}
	
	@DeleteMapping("/delete")
	public ResponseEntity<String> deleteCard(@RequestBody DelCardDTO del) {
	    int id = del.getCardId();
	    if (repo.existsById(id)) {
	        repo.deleteById(id);
	        return ResponseEntity.ok("ลบการ์ด id = " + id + " เรียบร้อย");
	    } else {
	        return ResponseEntity.status(404).body("ไม่พบการ์ด id = " + id);
	    }
	}
}
