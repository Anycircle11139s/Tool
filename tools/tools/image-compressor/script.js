async function compress() {
  const file = document.getElementById('img-input').files[0];
  const status = document.getElementById('status');
  if (!file) {
    status.textContent = 'Please choose an image.';
    return;
  }
  const quality = parseFloat(document.getElementById('quality').value || '0.7');
  try {
    status.textContent = 'Compressing…';
    const opts = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      initialQuality: quality,
    };
    const compressed = await imageCompression(file, opts);
    status.textContent = `Original ${(file.size / 1024).toFixed(1)} KB → ${(compressed.size / 1024).toFixed(1)} KB`;
    const link = document.getElementById('download-link');
    link.href = URL.createObjectURL(compressed);
    link.style.display = 'inline-block';
  } catch {
    status.textContent = 'Compression failed';
  }
}
document.getElementById('compress-btn').addEventListener('click', compress);
