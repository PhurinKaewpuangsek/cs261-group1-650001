(() => {
  const API_BASE = "http://localhost:9090/api/reviews";
  const historyList = document.getElementById("historyList");
  const usernameEl = document.getElementById("username");

  // ✅ โหลดข้อมูลนักศึกษาที่ login ไว้จาก localStorage
  const studentData = JSON.parse(localStorage.getItem("studentData") || "{}");
  if (!studentData.username) {
    alert("กรุณาเข้าสู่ระบบก่อน");
    window.location.href = "/login";
    return;
  }

  // ✅ แสดงชื่อผู้ใช้ด้านบน
  usernameEl.textContent =
    studentData.displayname_th || studentData.username || "Anonymous";

  // ✅ ฟังก์ชันแปลงวันที่เป็นรูปแบบไทย
  const formatDate = (ts) => {
    const d = new Date(ts);
    return d.toLocaleDateString("th-TH", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ✅ โหลดประวัติรีวิวของผู้ใช้จาก Backend
  async function loadHistory() {
    try {
      const res = await fetch(
        `${API_BASE}/user?username=${encodeURIComponent(studentData.username)}`
      );
      if (!res.ok) throw new Error("โหลดรีวิวไม่สำเร็จ");
      const reviews = await res.json();

      if (!Array.isArray(reviews) || reviews.length === 0) {
        historyList.innerHTML = `
          <p style="text-align:center; color:#777;">ยังไม่มีรีวิวที่คุณเขียนไว้</p>
        `;
        return;
      }

      // ✅ เรียงจากใหม่ → เก่า
      reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      // ✅ แสดงรีวิว
      historyList.innerHTML = reviews
        .map(
          (r) => `
        <div class="history-card" data-id="${r.id}" style="cursor:pointer;">
          <div class="top">
            <div>Date: ${formatDate(r.createdAt)}</div>
            <div>Rating : ⭐${r.rating}/5</div>
          </div>

          <div class="review-body">
            <strong>Review :</strong>
            <p class="review-text">${r.comment || "(ไม่มีข้อความ)"}</p>
          </div>

          <div class="bottom">
            <div class="meta">
              Professor: <strong>${r.professor || "-"}</strong>
              &nbsp;&nbsp; Course: <strong>${r.course || "-"}</strong>
            </div>

            <!-- 🔒 ปุ่ม Feedback — ดูได้อย่างเดียว -->
            <div class="footer-buttons readonly">
              <button disabled>😊 Helpful (${r.helpfulCount || 0})</button>
              <button disabled>🙃 Not Helpful (${r.notHelpfulCount || 0})</button>
            </div>
          </div>
        </div>
      `
        )
        .join("");

      // ✅ คลิกเปิดหน้า review-detail
      historyList.querySelectorAll(".history-card").forEach((card) => {
        const reviewId = card.dataset.id;
        card.addEventListener("click", () => {
          window.location.href = `/dashboard/review-detail?id=${reviewId}`;
        });
      });
    } catch (err) {
      console.error("❌ โหลดประวัติรีวิวล้มเหลว:", err);
      historyList.innerHTML = `
        <p style="color:red; text-align:center;">โหลดข้อมูลไม่สำเร็จ (${err.message})</p>
      `;
    }
  }

  // ✅ เมื่อหน้าโหลดเสร็จ ให้เรียกฟังก์ชัน
  document.addEventListener("DOMContentLoaded", loadHistory);
})();
