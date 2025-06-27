const out = document.getElementById('qr-output');
document.getElementById('qr-btn').addEventListener('click', () => {
  out.innerHTML = '';
  const txt = document.getElementById('qr-text').value.trim();
  if (!txt) return;
  QRCode.toCanvas(txt, { width: 220 }, (err, canvas) => {
    if (err) {
      out.textContent = 'Error generating QR code';
      return;
    }
    out.appendChild(canvas);
  });
});
