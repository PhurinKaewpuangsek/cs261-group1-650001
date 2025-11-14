// ✅ reviewscript.js — เวอร์ชันไม่ใช้ session / cookie
document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("reviewForm");
  const ratingBoxes = document.querySelectorAll(".star-box");
  const charCount = document.getElementById("charCount");
  const reviewText = document.getElementById("reviewText");
  const avatarPreview = document.getElementById("avatarPreview");
  const avatarOptions = document.querySelectorAll(".avatar-option");
  const btnCancel = document.getElementById("btnCancel");
  const profileModeBtn = document.getElementById("profileMode");
  const anonymousModeBtn = document.getElementById("anonymousMode");

  // ✅ เก็บ state ของผู้ใช้
  let selectedRating = 0;
  let selectedAvatar = "/Avatar/Anonymous.png";
  let isAnonymous = false;

  // ✅ โหมด Profile
  profileModeBtn.addEventListener("click", () => {
    isAnonymous = false;
    profileModeBtn.classList.add("active");
    anonymousModeBtn.classList.remove("active");
    avatarPreview.src = selectedAvatar;
  });

  // ✅ โหมด Anonymous
  anonymousModeBtn.addEventListener("click", () => {
    isAnonymous = true;
    anonymousModeBtn.classList.add("active");
    profileModeBtn.classList.remove("active");
    avatarPreview.src = "/Avatar/Anonymous.png";
  });

  // ✅ นับจำนวนตัวอักษร
  reviewText.addEventListener("input", () => {
    const count = reviewText.value.length;
    charCount.textContent = `${count}/1000`;
    charCount.style.color = count > 1000 ? "red" : "#333";
  });

  // ✅ เลือกดาว Rating
  ratingBoxes.forEach((box) => {
    box.addEventListener("click", () => {
      selectedRating = parseInt(box.dataset.rating);
      ratingBoxes.forEach((b) => b.classList.remove("active"));
      box.classList.add("active");
    });
  });

  // ✅ เลือก Avatar
  avatarOptions.forEach((img) => {
    img.addEventListener("click", () => {
      if (isAnonymous) {
        alert("⚠️ โหมด Anonymous จะใช้รูปโปรไฟล์ Anonymous เท่านั้น");
        return;
      }
      selectedAvatar = img.getAttribute("src");
      avatarPreview.src = selectedAvatar;
    });
  });

  // ✅ ปุ่ม Cancel → กลับหน้า Dashboard
  btnCancel.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  });

  // ✅ Toast แจ้งผล
  function showToast(msg, success = true) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = msg;
    toast.style.background = success ? "#dfffd8" : "#ffe5e5";
    toast.style.color = success ? "#2e7d32" : "#c62828";
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("is-show"), 50);
    setTimeout(() => {
      toast.classList.remove("is-show");
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  }

  // ✅ Submit ฟอร์ม
  reviewForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = localStorage.getItem("username"); // ดึง username จาก login
    if (!username) {
      showToast("⚠️ กรุณาเข้าสู่ระบบก่อนทำการรีวิว", false);
      return;
    }

    const course = document.getElementById("subject").value.trim();
    const professor = document.getElementById("professor").value.trim();
    const comment = reviewText.value.trim();

    if (!course || !professor || !comment) {
      showToast("⚠️ กรุณากรอกข้อมูลให้ครบทุกช่อง", false);
      return;
    }

    if (selectedRating === 0) {
      showToast("⚠️ กรุณาเลือกจำนวนดาวก่อนส่งรีวิว", false);
      return;
    }

    const payload = {
      course,
      professor,
      rating: selectedRating,
      comment,
      avatar: isAnonymous ? "/Avatar/Anonymous.png" : selectedAvatar,
      anonymous: isAnonymous,
    };

    console.log("📦 Sending Review:", payload);

    try {
      // ✅ แนบ username ไปกับ request (แทน session)
      const res = await fetch(`/api/reviews/add?username=${encodeURIComponent(username)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Server error");
      }

      const result = await res.json();
      console.log("✅ Review added:", result);

      showToast("✅ รีวิวถูกบันทึกเรียบร้อย!");
      setTimeout(() => (window.location.href = "/dashboard"), 1500);
    } catch (err) {
      console.error("❌ Error saving review:", err);
      showToast("❌ ไม่สามารถบันทึกรีวิวได้ กรุณาลองอีกครั้ง", false);
    }
  });
});
