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
            out = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
            break;
        }
        $('#text-output').value = out;
      };
    }
  },

  b64: {
    title: 'Base64 Encoder / Decoder',
    icon: '🔐',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="b64-input" rows="8" placeholder="Enter text to encode or decode..."></textarea>
        <button class="btn" id="encode-b64">Encode</button>
        <button class="btn" id="decode-b64">Decode</button>
        <textarea id="b64-output" rows="8" readonly></textarea>
      `;
      $('#encode-b64').onclick = () => {
        try {
          const encoded = btoa($('#b64-input').value);
          $('#b64-output').value = encoded;
        } catch {
          alert('Invalid input for Base64 encoding');
        }
      };
      $('#decode-b64').onclick = () => {
        try {
          const decoded = atob($('#b64-input').value);
          $('#b64-output').value = decoded;
        } catch {
          alert('Invalid Base64 input');
        }
      };
    }
  },

  url: {
    title: 'URL Encoder / Decoder',
    icon: '🌐',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="url-input" rows="6" placeholder="Enter URL or text"></textarea>
        <button class="btn" id="encode-url">Encode</button>
        <button class="btn" id="decode-url">Decode</button>
        <textarea id="url-output" rows="6" readonly></textarea>
      `;
      $('#encode-url').onclick = () => {
        try {
          $('#url-output').value = encodeURIComponent($('#url-input').value);
        } catch {
          alert('Invalid input');
        }
      };
      $('#decode-url').onclick = () => {
        try {
          $('#url-output').value = decodeURIComponent($('#url-input').value);
        } catch {
          alert('Invalid input');
        }
      };
    }
  },

  lorem: {
    title: 'Lorem Ipsum Generator',
    icon: '📄',
    render() {
      const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Paragraphs</label>
        <input id="lorem-count" type="number" min="1" max="10" value="3" />
        <button class="btn" id="gen-lorem">Generate</button>
        <textarea id="lorem-output" rows="10" readonly></textarea>
      `;
      $('#gen-lorem').onclick = () => {
        const count = Math.min(Math.max(+$('#lorem-count').value, 1), 10);
        $('#lorem-output').value = Array(count).fill(loremText).join('\n\n');
      };
    }
  },

  md: {
    title: 'Markdown Previewer',
    icon: '📝',
    async render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="md-input" rows="12" placeholder="Enter Markdown here..."></textarea>
        <div id="md-preview" style="border:1px solid #ccc; padding:1rem; border-radius:8px; margin-top:1rem; max-height: 300px; overflow: auto; background: var(--card-bg)"></div>
      `;
      if (!window.marked) {
        await new Promise(r => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
          script.onload = r;
          document.head.appendChild(script);
        });
      }
      $('#md-input').addEventListener('input', e => {
        $('#md-preview').innerHTML = marked.parse(e.target.value || '');
      });
    }
  },

  /* ----- New tools ----- */

  pass: {
    title: 'Password Generator',
    icon: '🔑',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Length (4-64)</label>
        <input id="pass-length" type="number" min="4" max="64" value="12" />
        <label><input id="pass-numbers" type="checkbox" checked /> Include numbers</label>
        <label><input id="pass-symbols" type="checkbox" checked /> Include symbols</label>
        <button class="btn" id="gen-pass">Generate Password</button>
        <input id="pass-output" type="text" readonly placeholder="Your password will appear here" />
      `;
      $('#gen-pass').onclick = () => {
        const length = +$('#pass-length').value || 12;
        const useNumbers = $('#pass-numbers').checked;
        const useSymbols = $('#pass-symbols').checked;
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+[]{}';
        let pool = letters + (useNumbers ? numbers : '') + (useSymbols ? symbols : '');
        let pass = '';
        for (let i = 0; i < length; i++) {
          pass += pool.charAt(Math.floor(Math.random() * pool.length));
        }
        $('#pass-output').value = pass;
        $('#pass-output').select();
        document.execCommand('copy');
        alert('Password copied to clipboard!');
      };
    }
  },

  words: {
    title: 'Word & Character Counter',
    icon: '✍️',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="words-input" rows="10" placeholder="Type or paste text..."></textarea>
        <p><strong>Words:</strong> <span id="word-count">0</span> | <strong>Characters:</strong> <span id="char-count">0</span></p>
      `;
      $('#words-input').oninput = () => {
        const txt = $('#words-input').value.trim();
        const words = txt ? txt.split(/\s+/).length : 0;
        const chars = txt.length;
        $('#word-count').textContent = words;
        $('#char-count').textContent = chars;
      };
    }
  },

  color: {
    title: 'Color Picker',
    icon: '🎨',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <input id="color-picker" type="color" value="#4f46e5" style="width:100%; height: 4rem; border:none; margin-bottom:1rem;" />
        <input id="color-hex" type="text" readonly value="#4F46E5" style="text-align:center; font-weight:bold; font-size:1.2rem;" />
      `;
      $('#color-picker').oninput = e => {
        $('#color-hex').value = e.target.value.toUpperCase();
        $('#color-hex').select();
        document.execCommand('copy');
      };
    }
  },

  random: {
    title: 'Random Number Generator',
    icon: '🎲',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Min</label>
        <input id="rand-min" type="number" value="1" />
        <label>Max</label>
        <input id="rand-max" type="number" value="100" />
        <button class="btn" id="rand-gen">Generate</button>
        <p id="rand-result" style="font-weight:700; margin-top:1rem;"></p>
      `;
      $('#rand-gen').onclick = () => {
        let min = +$('#rand-min').value;
        let max = +$('#rand-max').value;
        if (min > max) [min, max] = [max, min];
        const rand = Math.floor(Math.random() * (max - min + 1)) + min;
        $('#rand-result').textContent = rand;
      };
    }
  },

  age: {
    title: 'Age Calculator',
    icon: '⏳',
    render() {
      const today = new Date().toISOString().split('T')[0];
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Date of birth</label>
        <input id="dob" type="date" max="${today}" />
        <button class="btn" id="calc-age">Calculate</button>
        <p id="age-result" style="font-weight:700; margin-top:1rem;"></p>
      `;
      $('#calc-age').onclick = () => {
        const dob = new Date($('#dob').value);
        if (!dob.getTime()) return alert('Please enter a valid date.');
        const diff = Date.now() - dob.getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        $('#age-result').textContent = `You are ${age} years old.`;
      };
    }
  },

  /* ----- 10 new tools ----- */

  timestamp: {
    title: 'Timestamp Converter',
    icon: '⏰',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Unix Timestamp (seconds)</label>
        <input id="ts-input" type="number" placeholder="e.g. 1655683200" />
        <button class="btn" id="ts-to-date">Convert to Date</button>
        <p id="ts-date" style="font-weight:700; margin-top:1rem;"></p>
        <hr />
        <label>Date (YYYY-MM-DD HH:mm:ss)</label>
        <input id="date-input" type="text" placeholder="e.g. 2025-06-27 15:00:00" />
        <button class="btn" id="date-to-ts">Convert to Timestamp</button>
        <p id="ts-result" style="font-weight:700; margin-top:1rem;"></p>
      `;

      $('#ts-to-date').onclick = () => {
        const ts = parseInt($('#ts-input').value, 10);
        if (isNaN(ts)) return alert('Enter a valid timestamp');
        const d = new Date(ts * 1000);
        $('#ts-date').textContent = d.toLocaleString();
      };

      $('#date-to-ts').onclick = () => {
        const s = $('#date-input').value;
        const d = new Date(s);
        if (isNaN(d.getTime())) return alert('Enter a valid date');
        const ts = Math.floor(d.getTime() / 1000);
        $('#ts-result').textContent = ts;
      };
    }
  },

  uuid: {
    title: 'UUID Generator',
    icon: '📛',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <button class="btn" id="gen-uuid">Generate UUID</button>
        <input type="text" id="uuid-output" readonly style="margin-top:1rem; width:100%; font-weight:700; font-size:1.2rem;" />
      `;
      $('#gen-uuid').onclick = () => {
        function uuidv4() {
          return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
          );
        }
        const id = uuidv4();
        $('#uuid-output').value = id;
        $('#uuid-output').select();
        document.execCommand('copy');
        alert('UUID copied to clipboard!');
      };
    }
  },

  htmlmin: {
    title: 'HTML Minifier',
    icon: '🧹',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="html-input" rows="12" placeholder="Paste HTML code here..."></textarea>
        <button class="btn" id="minify-btn">Minify HTML</button>
        <textarea id="html-output" rows="12" readonly></textarea>
      `;
      $('#minify-btn').onclick = () => {
        const html = $('#html-input').value;
        const minified = html.replace(/>\\s+</g, '><').replace(/\\n/g, '').replace(/\\s{2,}/g, ' ');
        $('#html-output').value = minified;
      };
    }
  },

  cssmin: {
    title: 'CSS Minifier',
    icon: '🎨',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="css-input" rows="12" placeholder="Paste CSS code here..."></textarea>
        <button class="btn" id="minify-css-btn">Minify CSS</button>
        <textarea id="css-output" rows="12" readonly></textarea>
      `;
      $('#minify-css-btn').onclick = () => {
        const css = $('#css-input').value;
        const minified = css.replace(/\\/\\*.*?\\*\\//gs, '').replace(/\\s{2,}/g, ' ').replace(/\\n/g, '');
        $('#css-output').value = minified;
      };
    }
  },

  jsmin: {
    title: 'JavaScript Minifier',
    icon: '📜',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="js-input" rows="12" placeholder="Paste JS code here..."></textarea>
        <button class="btn" id="minify-js-btn">Minify JS</button>
        <textarea id="js-output" rows="12" readonly></textarea>
      `;
      $('#minify-js-btn').onclick = () => {
        const js = $('#js-input').value;
        const minified = js
          .replace(/\\/\\/.*$/gm, '')
          .replace(/\\/\\*.*?\\*\\//gs, '')
          .replace(/\\s{2,}/g, ' ')
          .replace(/\\n/g, '');
        $('#js-output').value = minified;
      };
    }
  },

  /* More can be added here similarly... */
};

/* ---------- Router ---------- */
function render() {
  const key = location.hash.replace('#', '') || 'home';
  document.title = (tools[key]?.title || tools.home.title) + ' • Browser Toolkit';
  app.classList.remove('show');
  setTimeout(() => {
    if (tools[key]) tools[key].render();
    else tools.home.render();
    app.classList.add('show');
  }, 120);
}

window.addEventListener('hashchange', render);
window.addEventListener('load', render);

/* ---------- Keyboard shortcuts ---------- */
document.addEventListener('keydown', e => {
  if (e.key === '/' && location.hash === '') {
    e.preventDefault();
    $('#search')?.focus();
  }
  if (e.key === 'Escape' && location.hash !== '') {
    setHash('');
  }
});

/* ---------- Service Worker ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));
}
