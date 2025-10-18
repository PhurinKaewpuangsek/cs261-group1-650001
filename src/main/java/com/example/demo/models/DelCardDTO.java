package com.example.demo.models;

import jakarta.validation.constraints.Min;

public class DelCardDTO {
    @Min(1)
    private int id; // เปลี่ยนชื่อจาก IDCard เป็น id

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}

