/* ---------- mock data: ใช้โครงเดียวกับเพื่อน ---------- */
const mockDatabase = {
  "650001": {
    reviewId: "650001",
    courseCode: "CS111",
    courseName: "Object-Oriented Concepts",
    courseSection: "650001",
    professor: "John Deelan",
    reviewTitle: "Great Introduction to OOP",
    rating: 4,
    reviewText:
      "This course was incredibly challenging, covering complex iteration. Prof. Somsak explains clearly, but homework load is heavy. Expect sling. However, I learned a tremendous amount and highly recommend if can handle the workload!",
    reviewedBy: "John Smith",
    reviewDate: "Nov 2, 2025",
    helpfulCount: 7,
    notHelpfulCount: 2,
  },
  "650002": {
    reviewId: "650002",
    courseCode: "CS261",
    courseName: "Data Structures",
    courseSection: "650001",
    professor: "Sarah Johnson",
    reviewTitle: "Challenging but Rewarding",
    rating: 5,
    reviewText:
      "Amazing course! The professor is very knowledgeable and explains complex topics clearly. Homework is tough but fair. Highly recommend!",
    reviewedBy: "John Smith",
    reviewDate: "Nov 1, 2025",
    helpfulCount: 15,
    notHelpfulCount: 1,
  },
  "650003": {
    reviewId: "650003",
    courseCode: "CS240",
    courseName: "Web Development",
    courseSection: "650001",
    professor: "Mike Brown",
    reviewTitle: "Fun and Practical",
    rating: 3,
    reviewText:
      "Good course overall. Lots of hands-on projects. Could use more examples in class. Final project was interesting.",
    reviewedBy: "Anonymous",   // สมมติรีวิวนี้เป็น anonymous
    reviewDate: "Oct 30, 2025",
    helpfulCount: 8,
    notHelpfulCount: 3,
  },
  "650004": {
    reviewId: "650004",
    courseCode: "CS233",
    courseName: "Algorithm Design",
    courseSection: "650001",
    professor: "Dr. Smith",
    reviewTitle: "Very Challenging Course",
    rating: 5,
    reviewText: "Great course but very difficult...",
    reviewedBy: "John Smith",
    reviewDate: "Nov 5, 2025",
    helpfulCount: 10,
    notHelpfulCount: 1,
  },
};

/* ---------- helpers ---------- */
function getParam(name) {
  const s = new URLSearchParams(location.search);
  return s.get(name);
}
function generateStars(n) {
  let s = "";
  for (let i = 1; i <= 5; i++) s += `<span class="star${i > n ? " empty" : ""}">★</span>`;
  return s;
}

/* ---------- data for this page ---------- */
// user ที่จะดูประวัติ (จริงๆ จะมาจาก session/login)
// ให้รับจาก query ?user=John%20Smith หรือ default เป็น John Smith
const currentUser = decodeURIComponent(getParam("user") || "John Smith");

// สร้าง array ของรีวิวทั้งหมดที่ผู้ใช้นี้เคยเขียน (รวมที่ anonymous)
const allReviewsByUser = Object.values(mockDatabase).filter(
  r => r.reviewedBy === currentUser || r.reviewedBy === "Anonymous"
);

// state
let filtered = [...allReviewsByUser];
let page = 1;
const PAGE_SIZE = 2;

/* ---------- render ---------- */
function renderSummary() {
  const sum = document.getElementById("summary");
  const total = filtered.length;
  const avg =
    total === 0
      ? "-"
      : (filtered.reduce((a, b) => a + (b.rating || 0), 0) / total).toFixed(2);
  sum.textContent = `Showing ${total} reviews · Average rating: ${avg}`;
  document.getElementById("pageTitle").textContent = `Review History · User: ${currentUser}`;
}

function renderList() {
  const list = document.getElementById("historyList");
  if (filtered.length === 0) {
    list.innerHTML =
      `<p style="text-align:center;color:#999;padding:24px;">No reviews found.</p>`;
    document.getElementById("pageInfo").textContent = "";
    return;
  }

  const start = (page - 1) * PAGE_SIZE;
  const items = filtered.slice(start, start + PAGE_SIZE);

  list.innerHTML = items
    .map((r) => {
      const anonBadge = r.reviewedBy === "Anonymous" ? `<span style="margin-left:6px; font-size:12px; color:#999">[anonymous]</span>` : "";
      return `
      <div class="review-card">
        <div class="review-title">Review Title: ${r.reviewTitle}</div>

        <div style="display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap;">
          <div class="course-info" style="min-width:260px;">
            <div class="course-code">${r.courseCode} ${r.courseName} ${r.courseSection}</div>
            <div class="professor">Professor: ${r.professor}</div>
            <div class="reviewer-info">
              <div class="reviewer-avatar">👤</div>
              <span>Reviewed by: ${r.reviewedBy}${anonBadge} on ${r.reviewDate}</span>
            </div>
            <div class="stars">${generateStars(r.rating)}</div>
            <div class="rating-score">${r.rating}/5</div>
          </div>

          <div style="flex:1;">
            <div class="review-text">${r.reviewText}</div>
            <div class="helpful-buttons" style="margin-top:8px;">
              <button class="helpful-btn positive" onclick="vote('${r.reviewId}', true)">
                😊 Helpful (<span id="h-${r.reviewId}">${r.helpfulCount}</span>)
              </button>
              <button class="helpful-btn negative" onclick="vote('${r.reviewId}', false)">
                😕 Not Helpful (<span id="n-${r.reviewId}">${r.notHelpfulCount}</span>)
              </button>
              <a class="back-button" style="margin-left:auto;text-decoration:none"
                 href="carddetail.html?reviewId=${r.reviewId}">
                View detail →
              </a>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  // page info
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  document.getElementById("pageInfo").textContent = `Page ${page} / ${totalPages}`;
}

/* ---------- actions ---------- */
function applyFilter() {
  const q = (document.getElementById("filterInput").value || "").trim().toLowerCase();
  if (!q) {
    filtered = [...allReviewsByUser];
  } else {
    filtered = allReviewsByUser.filter((r) =>
      [r.courseCode, r.courseName, r.professor].some((x) =>
        (x || "").toLowerCase().includes(q)
      )
    );
  }
  page = 1;
  renderSummary();
  renderList();
}

function nextPage() {
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  if (page < totalPages) {
    page++;
    renderList();
  }
}
function prevPage() {
  if (page > 1) {
    page--;
    renderList();
  }
}

// โหวต (mock ในหน้า)
const votes = {}; // { reviewId: 'helpful'|'not' }
function vote(reviewId, isHelpful) {
  const r = mockDatabase[reviewId];
  if (!r) return;

  // toggle
  if (votes[reviewId] === (isHelpful ? "helpful" : "not")) {
    if (isHelpful) r.helpfulCount--; else r.notHelpfulCount--;
    votes[reviewId] = null;
  } else {
    if (votes[reviewId] === "helpful") r.helpfulCount--;
    if (votes[reviewId] === "not") r.notHelpfulCount--;
    if (isHelpful) r.helpfulCount++; else r.notHelpfulCount++;
    votes[reviewId] = isHelpful ? "helpful" : "not";
  }

  // update UI
  document.getElementById(`h-${reviewId}`).textContent = r.helpfulCount;
  document.getElementById(`n-${reviewId}`).textContent = r.notHelpfulCount;
}

/* ---------- init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderSummary();
  renderList();

  // Enter = filter
  const inp = document.getElementById("filterInput");
  inp.addEventListener("keypress", (e) => {
    if (e.key === "Enter") applyFilter();
  });
});