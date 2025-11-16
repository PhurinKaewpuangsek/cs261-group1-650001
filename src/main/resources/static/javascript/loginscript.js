// ===============================
// loginscript.js (TU API + Remember Me + Auto Login)
// ===============================

// 🔸 Keys สำหรับจัดการ Remember Me
const REMEMBER_FLAG_KEY = "cstuRememberEnabled";
const REMEMBER_CREDS_KEY = "cstuRememberCreds";

// 🔸 เคลียร์ session เก่าทันทีเมื่อโหลดหน้า login
try {
  sessionStorage.removeItem("isAdmin");
} catch (e) {}

const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("loginError");
const loginBtn = document.querySelector(".login-btn");
const studentInput = document.getElementById("studentId");
const readModeLink = document.getElementById("readModeLink");
const rememberBox = document.getElementById("rememberMe");

// ✅ focus input อัตโนมัติเมื่อเปิดหน้า
studentInput.focus();

// ===============================
// 🔹 ฟังก์ชัน Toggle Password
// ===============================
if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    toggleBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
  });
}

// ===============================
// 🔹 Remember Me — โหลดข้อมูลที่เคยจำไว้
// ===============================
(function preloadRemembered() {
  try {
    const enabled = localStorage.getItem(REMEMBER_FLAG_KEY) === "true";
    const creds = JSON.parse(localStorage.getItem(REMEMBER_CREDS_KEY) || "{}");
    if (enabled && creds.username && creds.password) {
      studentInput.value = creds.username;
      passwordInput.value = creds.password;
      rememberBox.checked = true;

      // ✅ ถ้าต้องการ Auto Login อัตโนมัติให้ uncomment บรรทัดด้านล่าง
      // autoLogin(creds.username, creds.password);
    }
  } catch (e) {
    console.warn("⚠️ โหลดข้อมูล Remember Me ไม่สำเร็จ", e);
  }
})();

// ===============================
// 🔹 Save / Clear Remember
// ===============================
function saveRemember(username, password) {
  localStorage.setItem(REMEMBER_FLAG_KEY, "true");
  localStorage.setItem(
    REMEMBER_CREDS_KEY,
    JSON.stringify({ username, password })
  );
}
function clearRemember() {
  localStorage.setItem(REMEMBER_FLAG_KEY, "false");
  localStorage.removeItem(REMEMBER_CREDS_KEY);
}

// ===============================
// 🔹 ฟังก์ชัน Auto Login (optional)
// ===============================
async function autoLogin(username, password) {
  try {
    const response = await fetch(
      `http://localhost:9090/api/auth/login?username=${username}&password=${password}`,
      { method: "POST" }
    );

    if (!response.ok) return;
    const data = await response.json();
    if (data.status === true) {
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("displayName", data.user.displayName || "");
      localStorage.setItem("studentData", JSON.stringify(data.user));
      window.location.href = "/dashboard";
    }
  } catch (err) {
    console.warn("Auto-login failed:", err);
  }
}

// ===============================
// 🔹 ฟังก์ชันหลักเมื่อ Submit Login
// ===============================
form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const studentId = studentInput.value.trim();
  const password = passwordInput.value.trim();

  errorMsg.style.display = "none";

  if (!studentId || !password) {
    errorMsg.textContent = "⚠️ กรุณากรอกข้อมูลให้ครบถ้วน";
    errorMsg.style.display = "block";
    return;
  }

  loginBtn.classList.add("loading");
  loginBtn.textContent = "กำลังเข้าสู่ระบบ...";
  loginBtn.disabled = true;

  try {
    // ✅ เรียก TU API ผ่าน Backend (Stateless)
    const response = await fetch(
      `http://localhost:9090/api/auth/login?username=${studentId}&password=${password}`,
      { method: "POST" }
    );

    if (!response.ok) throw new Error("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");

    const data = await response.json();

    if (data.status === true) {
      // ✅ เก็บข้อมูลผู้ใช้
      localStorage.setItem("username", data.user.username);
      localStorage.setItem("displayName", data.user.displayName || "");
      localStorage.setItem("studentData", JSON.stringify(data.user));

      // ✅ Remember me
      if (rememberBox.checked) saveRemember(studentId, password);
      else clearRemember();

      // ✅ ไปหน้า dashboard
      window.location.href = "/dashboard";
    } else {
      throw new Error(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  } catch (err) {
    errorMsg.textContent = err.message.includes("เชื่อมต่อ")
      ? "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้"
      : err.message;
    errorMsg.style.display = "block";
  } finally {
    loginBtn.classList.remove("loading");
    loginBtn.textContent = "Log in";
    loginBtn.disabled = false;
  }
});

// ===============================
// 🔹 ปุ่ม Read Mode (Guest)
// ===============================
readModeLink?.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "/dashboard/guest";
});
