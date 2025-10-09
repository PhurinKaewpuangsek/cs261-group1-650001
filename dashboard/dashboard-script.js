/* =========================================================
   CSTU Pantip — Dashboard JS (ใช้ร่วมทั้ง dashboard.html & guest.html)
   หน้าที่:
     - โหลด/แสดงรีวิว (ช่วง prototype ใช้ localStorage จำลอง)
     - ค้นหา (search) และกรองตามดาว (filters)
     - ผูกปุ่ม back/logout
   หมายเหตุ:
     - จุดเชื่อม Backend ทำเครื่องหมายไว้ด้วย "TODO"
========================================================= */

const CSTU = (() => {
  const LS_KEY = 'courseReviews';   // ชื่อ key เก็บรีวิวใน localStorage (mock)

  /* เพิ่มชุดข้อมูลตัวอย่างลง localStorage ครั้งแรก
     เพื่อให้เปิดหน้าแล้วเห็นการ์ดทันที (ลบได้เมื่อมี backend) */
  function seedIfEmpty() {
    const has = localStorage.getItem(LS_KEY);
    if (!has) {
      const sample = [
        { course: 'CS262 - Web Tech', prof: 'Dr. A', rating: 5, text: 'สนุก เข้าใจง่าย' },
        { course: 'CS201 - Algorithm', prof: 'Dr. B', rating: 4, text: 'เนื้อหาแน่น ต้องอ่านเพิ่ม' },
        { course: 'CS101 - Intro CS',  prof: 'Dr. C', rating: 3, text: 'กลางๆ พอใช้' }
      ];
      localStorage.setItem(LS_KEY, JSON.stringify(sample));
    }
  }

  /* ดึงรีวิวทั้งหมด
     TODO(backend): เปลี่ยนเป็น fetch('/api/reviews') แล้ว setState */
  function getReviews() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  }

  /* วาดการ์ดรีวิวลง container ที่กำหนด */
  function renderCards(list, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    if (!list.length) {
      el.innerHTML = `<div class="empty">ยังไม่มีรีวิว…</div>`;
      return;
    }

    // ใช้ Array.map แปลงข้อมูล -> markup แล้วรวมเป็นสตริงเดียว
    el.innerHTML = list.map(r => `
      <article class="card">
        <h4 class="card__title">${r.course}</h4>
        <div class="card__rating">★ ${r.rating}</div>
        <p class="card__text">${r.text}</p>
        <p class="card__text" style="opacity:.6">by ${r.prof}</p>
      </article>
    `).join('');
  }

  /* ผูก event สำหรับ Search/Filter/Back/Logout
     - mode: 'login' (มีฟิลเตอร์ดาวใช้งานจริง) หรือ 'guest' (ปุ่มดาวไม่ผูกตัวกรอง) */
function attachSearchFilter(mode) {
  const all = getReviews();     // ข้อมูลทั้งหมด
  let filtered = [...all];      // ที่กำลังแสดง
  let activeStar = null;        // เก็บว่าตอนนี้กรองดาวอะไรอยู่ (null = ไม่กรอง)

  // --- Search ---
  const search = document.getElementById('searchInput');
  search?.addEventListener('input', () => {
    const q = search.value.toLowerCase();
    const base = activeStar ? all.filter(r => r.rating === activeStar) : all;
    filtered = base.filter(r =>
      [r.course, r.prof, r.text].join(' ').toLowerCase().includes(q)
    );
    renderCards(filtered, 'reviewGrid');
  });

  // --- Star filters (มีเฉพาะหน้า login) ---
  const stars = document.getElementById('starFilters');
  const chipEls = stars ? [...stars.querySelectorAll('[data-star]')] : [];

  stars?.addEventListener('click', e => {
    const star = e.target?.dataset?.star || e.target.closest('[data-star]')?.dataset?.star;
    if (!star) return;

    const s = Number(star);

    // ถ้าคลิกที่ดาวดวงเดิมอีกครั้ง => รีเซ็ตกลับไป “ทุกดาว”
    if (activeStar === s) {
      activeStar = null;
      chipEls.forEach(c => c.classList.remove('chip--active')); // เอาไฮไลต์ออก
      filtered = [...all];
      search.value = ''; // เคลียร์ search ด้วย (ถ้าต้องการ)
      renderCards(filtered, 'reviewGrid');
      return;
    }

    // ถ้าเป็นดาวใหม่ => กรองตามดาวนั้น และทำไฮไลต์
    activeStar = s;
    chipEls.forEach(c => c.classList.toggle('chip--active', Number(c.dataset.star) === s));

    // ถ้ามีข้อความค้นหา ให้กรองต่อยอดจากดาว
    const q = (search?.value || '').toLowerCase();
    const starFiltered = all.filter(r => r.rating === s);
    filtered = q
      ? starFiltered.filter(r =>
          [r.course, r.prof, r.text].join(' ').toLowerCase().includes(q)
        )
      : starFiltered;

    renderCards(filtered, 'reviewGrid');
  });

  // แสดงครั้งแรก (ทุกดาว)
  renderCards(filtered, 'reviewGrid');

  // ปุ่ม Back / Logout (เดิม)
  document.getElementById('btnBack')?.addEventListener('click', () => {
    // TODO(frontend router): เปลี่ยนเป็นระบบ route จริงจังภายหลัง
    history.back();
  });
  document.getElementById('btnLogout')?.addEventListener('click', (e) => {
    e.preventDefault();
    // TODO(backend): เรียก /logout แล้ว redirect ไปหน้า login จริง
    location.href = 'dashboard.html'; // ชั่วคราว
  });
}


  /* จุดเข้าใช้งานจากแต่ละหน้า
     - seedIfEmpty(): ใส่ mock data (ถ้ายังไม่มี)
     - attachSearchFilter(mode): ผูก event + render */
  function initDashboard({ mode }) {
    seedIfEmpty();           // ลบได้เมื่อใช้ backend จริง
    attachSearchFilter(mode);
  }

  // ส่งฟังก์ชันออกไปให้ HTML เรียก
  return { initDashboard };
})();  // <-- ปิด IIFE ให้ครบ