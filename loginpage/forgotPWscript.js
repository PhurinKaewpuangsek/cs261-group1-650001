document.addEventListener('DOMContentLoaded', () => {
    const emailForm = document.getElementById('email-form');
    const otpForm = document.getElementById('otp-form');
    const resetEmailInput = document.getElementById('resetEmail');
    const otpCodeInput = document.getElementById('otpCode');
    const newPasswordInput = document.getElementById('newPassword');
    const errorMsg1 = document.getElementById('errorMsg1');
    const errorMsg2 = document.getElementById('errorMsg2');
    const timerDisplay = document.getElementById('timer');
    const resendOtpBtn = document.getElementById('resendOtpBtn');
    const finalMessage = document.getElementById('final-message');
    const otpDestination = document.getElementById('otp-destination');
    const sendOtpBtn = document.getElementById('sendOtpBtn');

    let countdownInterval;
    const RESEND_TIME_SECONDS = 60; 
    let countdown = RESEND_TIME_SECONDS;
    let currentEmail = '';

    
    function showMessage(element, message, isError = true) {
        element.textContent = message;
        element.style.display = 'block';
        element.className = isError ? 'status-msg error-msg' : 'status-msg success-msg';
    }

    
    function hideMessage(element) {
        element.style.display = 'none';
    }

    // ฟังก์ชันเริ่มจับเวลาสำหรับการรอ OTP
    function startTimer() {
        clearInterval(countdownInterval);
        countdown = RESEND_TIME_SECONDS;
        resendOtpBtn.disabled = true; 
        timerDisplay.textContent = countdown;
        
        countdownInterval = setInterval(() => {
            countdown--;
            timerDisplay.textContent = countdown;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                resendOtpBtn.disabled = false; 
                timerDisplay.textContent = '0';
                showMessage(errorMsg2, 'OTP expired. Please click "Resend OTP".', true);
            }
        }, 1000);
    }


    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideMessage(errorMsg1);
        
        currentEmail = resetEmailInput.value.trim();
        if (!currentEmail || !currentEmail.includes('@') || !currentEmail.includes('.')) {
            showMessage(errorMsg1, 'Please enter a valid email address.');
            return;
        }

       
        sendOtpBtn.textContent = 'Sending...';
        sendOtpBtn.disabled = true;

     
        setTimeout(() => {
            emailForm.style.display = 'none';
            otpForm.style.display = 'flex'; 
            otpForm.style.flexDirection = 'column'; 
            
            
            otpDestination.textContent = `(${currentEmail})`;
            
            startTimer();

            
            sendOtpBtn.textContent = 'Send OTP Code';
            sendOtpBtn.disabled = false;
            
        }, 1500); 
    });
    

    resendOtpBtn.addEventListener('click', function() {
        hideMessage(errorMsg2);
        resendOtpBtn.disabled = true;
        resendOtpBtn.textContent = 'Resending...';

      
        setTimeout(() => {
            showMessage(errorMsg2, 'New OTP sent successfully. Please check your email.', false);
            resendOtpBtn.textContent = 'Resend OTP';
            startTimer(); 
        }, 1500);
    });

    // --- Step 2: Verify OTP and Reset Password (เมื่อกดปุ่ม Confirm OTP & Reset) ---
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        hideMessage(errorMsg2);
        
        const otpCode = otpCodeInput.value.trim();
        const newPassword = newPasswordInput.value;

      
        if (otpCode.length !== 6 || isNaN(otpCode)) {
            showMessage(errorMsg2, 'OTP must be a 6-digit number.');
            return;
        }

        if (newPassword.length < 8) {
            showMessage(errorMsg2, 'New password must be at least 8 characters long.');
            return;
        }
        
       
        otpForm.style.display = 'none';
        clearInterval(countdownInterval);
        
        finalMessage.style.display = 'block'; 
        
       
        setTimeout(() => {
            console.log('Password reset successful. Redirecting to login page...');
        }, 3000);
    });
});
