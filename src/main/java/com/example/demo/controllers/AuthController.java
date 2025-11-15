package com.example.demo.controllers;

import com.example.demo.services.TuAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:9090") // ❌ ไม่ต้องใช้ allowCredentials เพราะไม่ใช้ cookie
public class AuthController {

    @Autowired
    private TuAuthService tuAuthService;

    // ✅ ตรวจสอบกับ TU API
    @PostMapping("/login")
    public ResponseEntity<Object> login(
            @RequestParam String username,
            @RequestParam String password) {

        // เรียก TU API เพื่อยืนยันตัวตน
        ResponseEntity<Object> response = tuAuthService.verifyUser(username, password);
        System.out.println("📡 [DEBUG] TU API Response: " + response.getBody());

        return response; // ส่งต่อให้ frontend ใช้เลย
    }

    // ✅ logout (frontend ล้าง localStorage เอง)
    @PostMapping("/logout")
    public ResponseEntity<Object> logout() {
        System.out.println("🚪 [LOGOUT] Stateless system — frontend จัดการเอง");
        return ResponseEntity.ok().body(
                java.util.Map.of("message", "Logout success (stateless — no session used)")
        );
    }
}
