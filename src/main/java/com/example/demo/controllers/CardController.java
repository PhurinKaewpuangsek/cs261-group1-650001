package com.example.demo.controllers;
import java.util.List;

import com.example.demo.models.Card;
import com.example.demo.models.CardDTO;
import com.example.demo.repo.CardRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;





@Controller
@RequestMapping("/dashboard")
public class CardController {
//	@Autowired
//	private CardRepository repo;
	
	@GetMapping({"","/"})
	public String showCard (Model model) {
//		List<Card> cards = repo.findAll();
//		model.addAllAttributes(cards);
		return "dashboard/dashboard.html";
	}
	@GetMapping({"/guest"})
	public String showCard () {
//		List<Card> cards = repo.findAll();
//		model.addAllAttributes(cards);
		return "dashboard/guestDashboard.html";
	}
	
	@GetMapping({"/review"})
	public String review (Model model) {
//		CardDTO carddto = new CardDTO();
		return "review/review.html";
	}
}
