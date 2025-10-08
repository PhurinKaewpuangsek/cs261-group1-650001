document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('review-text');
  const feedbackSpan = document.getElementById('feedback');
  const starBoxes = document.querySelectorAll('.star-box');
  const avatarPreview = document.getElementById('avatar-preview');
  const avatarOptions = document.querySelectorAll('.avatar-option');
  const profileModeBtn = document.getElementById('profileMode');
  const anonymousModeBtn = document.getElementById('anonymousMode');
  const MAX_LENGTH = 1000;

  // --- Toggle Profile / Anonymous ---
  profileModeBtn.addEventListener('click', () => {
    profileModeBtn.classList.add('active');
    anonymousModeBtn.classList.remove('active');
  });

  anonymousModeBtn.addEventListener('click', () => {
    anonymousModeBtn.classList.add('active');
    profileModeBtn.classList.remove('active');
  });

  // --- Rating ---
  starBoxes.forEach(box => {
    box.addEventListener('click', function() {
      starBoxes.forEach(b => b.classList.remove('selected'));
      this.classList.add('selected');
    });
  });

  // --- Review Length Check ---
  function updateFeedback() {
    const len = textarea.value.length;
    if (len > MAX_LENGTH) {
      feedbackSpan.textContent = 'too long';
      feedbackSpan.className = 'feedback-text too-long';
    } else if (len > 0) {
      feedbackSpan.textContent = 'ok';
      feedbackSpan.className = 'feedback-text ok';
    } else {
      feedbackSpan.textContent = 'too long';
      feedbackSpan.className = 'feedback-text too-long';
    }
  }

  textarea.addEventListener('input', updateFeedback);
  updateFeedback();

  // --- Avatar Selection ---
  avatarOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      avatarPreview.src = opt.src;
      avatarOptions.forEach(o => o.style.borderColor = "transparent");
      opt.style.borderColor = "#ffcc00";
    });
  });

  // --- Buttons ---
  document.querySelector('.btn-send').addEventListener('click', () => {
    if (textarea.value.length > MAX_LENGTH) {
      alert("Your review is too long!");
    } else {
      alert("Review sent successfully!");
    }
  });

  document.querySelector('.btn-cancel').addEventListener('click', () => {
    if (confirm("Cancel your review?")) {
      textarea.value = "";
      updateFeedback();
    }
  });
});
