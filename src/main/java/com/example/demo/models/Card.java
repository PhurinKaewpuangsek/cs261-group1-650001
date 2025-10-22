package com.example.demo.models;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Entity
@Table(name = "card")
public class Card {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "name", nullable = false, length = 100)
	private String name;
	
	@Column(name = "prof", length = 100)
	private String prof;
	
	@Column(name = "rating", nullable = false)
    @Min(value = 1, message = "rating ต้องไม่ต่ำกว่า 1")
    @Max(value = 5, message = "rating ต้องไม่เกิน 5")
	private int rating;
	
	@Column(name = "description", columnDefinition = "TEXT")
	private String description;
	
	public Card( String name, String prof, int rating, String description) {
		super();
		this.name = name;
		this.prof = prof;
		this.rating = rating;
		this.description = description;
	}
	public Card() {}
	
	
	public int getId() {
		return id;
	}
	
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getProf() {
		return prof;
	}
	public void setProf(String prof) {
		this.prof = prof;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}

	

	
	
}
