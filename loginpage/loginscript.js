// Toggle password visibility
const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");

if (toggleBtn && passwordInput) {
  toggleBtn.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";

    // Update ARIA and visual cue
    toggleBtn.setAttribute("aria-pressed", isHidden ? "true" : "false");
    toggleBtn.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    toggleBtn.setAttribute("title", isHidden ? "Hide password" : "Show password");
  });

  // Optional: allow pressing Enter while focused on toggle to toggle
  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });
}

// Form submit handler (keeps demo behaviour)
const form = document.getElementById("login-form");
if (form) {
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const studentId = document.querySelector('input[type="text"]').value.trim();
    const password = passwordInput.value;

    console.log("Student ID:", studentId);
    console.log("Password:", password);

    // Replace alert with in-page message or API call in future
    alert(`Student ID: ${studentId}\nPassword: ${password}`);
  });
}
