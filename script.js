/* ---------- Helpers ---------- */
const $ = s => document.querySelector(s);
const app = $('#app');
function setHash(h) { location.hash = h; }

/* ---------- Dark Mode Toggle ---------- */
(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  $('#theme-toggle').onclick = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('theme', dark ? 'light' : 'dark');
  };
})();

/* ---------- Tools Definitions ---------- */
const tools = {
  /* Home */
  home: {
    title: 'All Tools',
    render() {
      app.innerHTML = `
        <input id="search" type="search" placeholder="Search tools…" aria-label="Search tools" autofocus />
        <section id="tool-list" role="list">
          ${Object.entries(tools)
            .filter(([k]) => k !== 'home')
            .map(([k, t]) =>
              `<a href="#${k}" class="tool-card" role="listitem" tabindex="0" aria-label="Open ${t.title} tool">
                ${t.icon || '🛠️'}<br>${t.title}
              </a>`
            )
            .join('')}
        </section>
      `;
      $('#search').oninput = e => {
        const q = e.target.value.toLowerCase();
        document.querySelectorAll('.tool-card').forEach(c => {
          c.style.display = c.textContent.toLowerCase().includes(q) ? 'inline-flex' : 'none';
        });
      };
      $('#search').focus();
    },
    icon: '🏠'
  },

  /* Original 15 tools here, simplified */
  json: {
    title: 'JSON Formatter',
    icon: '🗄️',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="json-input" rows="12" placeholder="Paste JSON here..."></textarea>
        <button class="btn" id="format-json">Format JSON</button>
        <pre id="json-output" style="white-space: pre-wrap; margin-top: 1rem; background: var(--card-bg); padding: 1rem; border-radius: 8px; max-height: 300px; overflow: auto;"></pre>
      `;
      $('#format-json').onclick = () => {
        const input = $('#json-input').value.trim();
        let out;
        try {
          const parsed = JSON.parse(input);
          out = JSON.stringify(parsed, null, 2);
        } catch {
          out = 'Invalid JSON!';
        }
        $('#json-output').textContent = out;
      };
    }
  },

  qr: {
    title: 'QR Code Generator',
    icon: '🔲',
    async render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <input id="qr-text" type="text" placeholder="Enter text or URL" />
        <button class="btn" id="gen-qr">Generate QR</button>
        <div id="qr-container" style="margin-top:1rem;"></div>
      `;

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js';
      document.head.appendChild(script);
      await new Promise(r => (script.onload = r));

      $('#gen-qr').onclick = () => {
        const text = $('#qr-text').value.trim();
        if (!text) return alert('Please enter text to generate QR code.');
        const container = $('#qr-container');
        container.innerHTML = '';
        QRCode.toCanvas(text, { width: 200 }, (err, canvas) => {
          if (err) return alert('Error generating QR code.');
          container.appendChild(canvas);
        });
      };
    }
  },

  img: {
    title: 'Image Compressor',
    icon: '🖼️',
    async render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <input id="img-file" type="file" accept="image/*" />
        <label for="quality">Quality (1–100):</label>
        <input id="quality" type="number" min="1" max="100" value="75" />
        <button class="btn" id="compress-btn">Compress Image</button>
        <div id="img-result" style="margin-top: 1rem;"></div>
      `;
      $('#compress-btn').onclick = () => {
        const fileInput = $('#img-file');
        const quality = Math.min(Math.max(+$('#quality').value, 1), 100) / 100;
        if (!fileInput.files.length) return alert('Select an image first.');
        const file = fileInput.files[0];
        const img = new Image();
        const reader = new FileReader();
        reader.onload = e => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              blob => {
                const url = URL.createObjectURL(blob);
                $('#img-result').innerHTML = `
                  <p>Compressed image:</p>
                  <a href="${url}" download="compressed.jpg">Download here</a>
                  <br><img src="${url}" alt="Compressed Image Preview" style="max-width: 100%; margin-top: 10px;" />
                `;
              },
              'image/jpeg',
              quality
            );
          };
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      };
    }
  },

  unit: {
    title: 'Unit Converter',
    icon: '📏',
    render() {
      // Simplified demo: length units only
      const units = {
        meter: 1,
        kilometer: 1000,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254
      };
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <input id="unit-value" type="number" value="1" step="any" />
        <select id="unit-from">${Object.keys(units).map(u => `<option>${u}</option>`).join('')}</select>
        to
        <select id="unit-to">${Object.keys(units).map(u => `<option>${u}</option>`).join('')}</select>
        <button class="btn" id="convert-unit">Convert</button>
        <p id="unit-result" style="font-weight:700; margin-top:1rem;"></p>
      `;
      $('#convert-unit').onclick = () => {
        const val = parseFloat($('#unit-value').value);
        const from = $('#unit-from').value;
        const to = $('#unit-to').value;
        if (isNaN(val)) return alert('Enter a valid number');
        const meters = val * units[from];
        const converted = meters / units[to];
        $('#unit-result').textContent = `${val} ${from} = ${converted.toFixed(4)} ${to}`;
      };
    }
  },

  text: {
    title: 'Text Case Changer',
    icon: '🔠',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="text-input" rows="8" placeholder="Enter text here..."></textarea>
        <select id="case-select">
          <option value="upper">UPPERCASE</option>
          <option value="lower">lowercase</option>
          <option value="title">Title Case</option>
          <option value="sentence">Sentence case</option>
        </select>
        <button class="btn" id="convert-case">Convert</button>
        <textarea id="text-output" rows="8" readonly></textarea>
      `;
      $('#convert-case').onclick = () => {
        const text = $('#text-input').value;
        const mode = $('#case-select').value;
        let out = '';
        switch (mode) {
          case 'upper': out = text.toUpperCase(); break;
          case 'lower': out = text.toLowerCase(); break;
          case 'title':
            out = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase());
            break;
          case 'sentence':
            out = tex


