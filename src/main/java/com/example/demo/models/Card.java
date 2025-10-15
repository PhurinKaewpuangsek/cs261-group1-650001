package com.example.demo.models;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="Card")
public class Card {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;
	@Column(columnDefinition = "name")
	private String name;
	@Column(columnDefinition = "prof")
	private String prof;
	@Column(columnDefinition = "name")
	private int rating;
	@Column(columnDefinition = "description")
	private String description;
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
