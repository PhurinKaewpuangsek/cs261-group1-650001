package com.example.demo.models;

import jakarta.validation.constraints.Min;

public class DelCardDTO {
    @Min(1)
    private int CardID; // เปลี่ยนชื่อจาก IDCard เป็น id

    public int getCardId() {
        return CardID;
    }

    public void setId(int id) {
        this.CardID = id;
    }
}

