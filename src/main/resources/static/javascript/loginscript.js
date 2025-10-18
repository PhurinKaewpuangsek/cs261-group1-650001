// loginscript.js
// Login logic + password toggle + admin session flag + remember me

// --- Keys for remember me ---
const REMEMBER_FLAG_KEY = 'cstuRememberEnabled';   // "true" | "false"
const REMEMBER_CREDS_KEY = 'cstuRememberCreds';    // JSON { username, password }

// เคลียร์สิทธิ์ admin ทุกครั้งที่เปิดหน้า login
try { sessionStorage.removeItem('isAdmin'); } catch (e) { }

/* === Elements === */
const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("loginError");
const loginBtn = document.querySelector(".login-btn");
const studentInput = document.getElementById("studentId");
const readModeLink = document.getElementById("readModeLink");
const rememberBox = document.getElementById("rememberMe");

/* === Password toggle === */
if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    toggleBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
    toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    toggleBtn.setAttribute("title", isHidden ? "Hide password" : "Show password");
  });
}

/* === Remember me: preload values on page load === */
(function preloadRemembered() {
  try {
    const enabled = localStorage.getItem(REMEMBER_FLAG_KEY) === 'true';
    const raw = localStorage.getItem(REMEMBER_CREDS_KEY);
    const creds = raw ? JSON.parse(raw) : null;

    if (enabled && creds && typeof creds.username === 'string' && typeof creds.password === 'string') {
      studentInput.value = creds.username;
      passwordInput.value = creds.password;
      if (rememberBox) rememberBox.checked = true;
    } else {
      if (rememberBox) rememberBox.checked = false;
    }
  } catch (e) {
    // ถ้ามีปัญหา parsing ให้ปิด remember ไว้ก่อน
    try {
      localStorage.setItem(REMEMBER_FLAG_KEY, 'false');
      localStorage.removeItem(REMEMBER_CREDS_KEY);
    } catch (e2) { }
    if (rememberBox) rememberBox.checked = false;
  }
})();

/* === Helpers: save / clear remember me === */
function saveRemember(username, password) {
  try {
    localStorage.setItem(REMEMBER_FLAG_KEY, 'true');
    localStorage.setItem(REMEMBER_CREDS_KEY, JSON.stringify({ username, password }));
  } catch (e) { }
}
function clearRemember() {
  try {
    localStorage.setItem(REMEMBER_FLAG_KEY, 'false');
    localStorage.removeItem(REMEMBER_CREDS_KEY);
  } catch (e) { }
}

/* === Form submission & validation === */
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentId = studentInput.value.trim();
    const password = passwordInput.value.trim();

    errorMsg.style.display = "none";

    if (studentId === "" || password === "") {
      errorMsg.textContent = "Please fill in both fields.";
      errorMsg.style.display = "block";
      return;
    }

    loginBtn.classList.add("loading");
    loginBtn.textContent = "Loading...";
    loginBtn.disabled = true;

    setTimeout(() => {
      loginBtn.classList.remove("loading");
      loginBtn.textContent = "Log in";
      loginBtn.disabled = false;

      // --- Credentials ---
      // Admin: 650002 / 1001
      // User : 650001 / 1234
      const isAdminLogin = (studentId === "650002" && password === "1001");
      const isUserLogin = (studentId === "650001" && password === "1234");

      if (isAdminLogin || isUserLogin) {
        // Remember me
        if (rememberBox && rememberBox.checked) {
          saveRemember(studentId, password);
        } else {
          clearRemember();
        }

        // Set admin flag
        try { sessionStorage.setItem('isAdmin', isAdminLogin ? 'true' : 'false'); } catch (e) { }

        // Go to dashboard
        window.location.href = "/dashboard";
        return;
      }

      // default: invalid
      errorMsg.textContent = "Invalid credentials. Please try again.";
      errorMsg.style.display = "block";
      errorMsg.style.animation = "fadeIn 0.3s ease";
    }, 600);
  });
}

/* === Read mode link (Guest) === */
readModeLink?.addEventListener("click", (e) => {
  e.preventDefault();
  // guest/reader ไม่มีสิทธิ์ admin
  try { sessionStorage.setItem('isAdmin', 'false'); } catch (e) { }
  // การกด read mode จะไม่ไปยุ่งกับค่าที่ Remember ไว้
  window.location.href = "/dashboard/guest";
});
