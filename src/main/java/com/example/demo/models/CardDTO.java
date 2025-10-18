package com.example.demo.models;

import jakarta.validation.constraints.*;

public class CardDTO {
	@NotEmpty(message = "กรูณาใส่ชื่อวิชา")
	private String name;
	
	@NotEmpty(message = "กรุณาใส่ชื่ออาจารย์")
	private String prof;
	
	@Min(1)
	@Max(5)
	@NotEmpty(message = "กรุณาให้คะแนน")
	private int rating;
	
	
	@Size(max = 200,message = "กรุณาใส่ไม่เกิน 200 ตัวอักษร")
	@NotEmpty(message = "กรุณาใส่คำอธิบาย")
	private String description;


	public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getProf() { return prof; }
    public void setProf(String prof) { this.prof = prof; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
