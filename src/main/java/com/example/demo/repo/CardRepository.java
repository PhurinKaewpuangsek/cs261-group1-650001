package com.example.demo.repo;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.models.Card;

public interface CardRepository extends JpaRepository<Card,Integer> {
//	List<Card> findByName(String name);

//	List<Card> findByEmailContaining(String keyword);
	
}
