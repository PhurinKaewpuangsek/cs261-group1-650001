document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault(); // stop page refresh

    // Get input values
    const studentId = document.querySelector('input[type="text"]').value.trim();
    const password = document.querySelector('input[type="password"]').value;

    // For now: show in console (you'll replace this with API call later)
    console.log("Student ID:", studentId);
    console.log("Password:", password);

    // Optional: show confirmation on screen
    alert(`Student ID: ${studentId}\nPassword: ${password}`);

    // Example placeholder for future API call
    /*
    fetch("https://your-api-endpoint.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, password })
    })
      .then(res => res.json())
      .then(data => console.log("Response:", data))
      .catch(err => console.error("Error:", err));
    */
});
