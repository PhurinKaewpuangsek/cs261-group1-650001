// === Password toggle ===
const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");

if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    toggleBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
    toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    toggleBtn.setAttribute("title", isHidden ? "Hide password" : "Show password");
  });
}

// === Form submission & validation ===
const form = document.getElementById("login-form");
const errorMsg = document.getElementById("loginError");
const loginBtn = document.querySelector(".login-btn");
const studentInput = document.getElementById("studentId");

if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentId = studentInput.value.trim();
    const password = passwordInput.value.trim();

    // Reset error display
    errorMsg.style.display = "none";

    // Basic validation
    if (studentId === "" || password === "") {
      errorMsg.textContent = "Please fill in both fields.";
      errorMsg.style.display = "block";
      return;
    }

    // Simulate loading / spinner state
    loginBtn.classList.add("loading");
    loginBtn.textContent = "Loading...";
    loginBtn.disabled = true;

    setTimeout(() => {
      // Reset button state
      loginBtn.classList.remove("loading");
      loginBtn.textContent = "Log in";
      loginBtn.disabled = false;

      // Fake login success/fail for demo
      if (studentId !== "650001" || password !== "1234") {
        errorMsg.textContent = "Invalid credentials. Please try again.";
        errorMsg.style.display = "block";
        errorMsg.style.animation = "fadeIn 0.3s ease"; // triggers CSS animation

      } else {
        window.location.href = "/dashboard"; // replace with actual page
      }
    }, 2000);
  });
}
