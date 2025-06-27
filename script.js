/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const app = $('#app');
function setHash(h) { location.hash = h; }
const ext = src => new Promise(r => { const s = document.createElement('script'); s.src = src; s.onload = r; document.head.appendChild(s); });

/* ---------- dark-mode toggle ---------- */
(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  $('#theme-toggle').onclick = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
    localStorage.setItem('theme', dark ? 'light' : 'dark');
  };
})();

/* ---------- tool definitions ---------- */
const tools = {

  /* ----- home ----- */
  home: {
    title: 'All Tools',
    render() {
      app.innerHTML = `
        <input id="search" type="text" placeholder="Search tools…">
        <section class="grid" id="grid">
          ${Object.entries(tools)
            .filter(([k]) => k !== 'home')
            .map(([k, t]) => `<a class="card" href="#${k}">${t.title}</a>`)
            .join('')}
        </section>`;
      $('#search').oninput = e => {
        const q = e.target.value.toLowerCase();
        document
          .querySelectorAll('#grid .card')
          .forEach(c => (c.style.display = c.textContent.toLowerCase().includes(q) ? 'block' : 'none'));
      };
      $('#search').focus();
    }
  },

  /* ----- original 10 tools (unchanged) ----- */
  json: { title: 'JSON Formatter', render() { /* …same as before… */ } },
  qr:   { title: 'QR Code Generator', render: async function () { /* … */ } },
  img:  { title: 'Image Compressor', render: async function () { /* … */ } },
  unit: { title: 'Unit Converter', render() { /* … */ } },
  text: { title: 'Text Case Changer', render() { /* … */ } },
  b64:  { title: 'Base64 Encoder / Decoder', render() { /* … */ } },
  url:  { title: 'URL Encoder / Decoder', render() { /* … */ } },
  lorem:{ title: 'Lorem Ipsum Generator', render() { /* … */ } },
  md:   { title: 'Markdown Previewer', render: async function () { /* … */ } },

  /* ---------- NEW TOOLS BELOW ---------- */

  pass: {
    title: 'Password Generator',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Length</label><input id="plen" type="number" min="4" max="64" value="12">
        <label><input type="checkbox" id="pnums" checked> Include numbers</label>
        <label><input type="checkbox" id="psym"  checked> Include symbols</label>
        <button class="btn" id="make">Generate</button>
        <input id="pwd" type="text" readonly placeholder="Your password will appear here">`;
      $('#make').onclick = () => {
        const len = +$('#plen').value || 12;
        const nums = $('#pnums').checked;
        const sym = $('#psym').checked;
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+[]{}';
        let pool = letters + (nums ? numbers : '') + (sym ? symbols : '');
        let out = '';
        for (let i = 0; i < len; i++) out += pool[Math.floor(Math.random() * pool.length)];
        $('#pwd').value = out;
        $('#pwd').select(); document.execCommand('copy');
      };
    }
  },

  words: {
    title: 'Word & Character Counter',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <textarea id="wtext" rows="10" placeholder="Type or paste text…"></textarea>
        <p><strong id="wcount">0</strong> words, <strong id="ccount">0</strong> characters</p>`;
      $('#wtext').oninput = () => {
        const t = $('#wtext').value.trim();
        $('#ccount').textContent = t.length;
        $('#wcount').textContent = t ? t.split(/\\s+/).length : 0;
      };
    }
  },

  color: {
    title: 'Color Picker',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <input type="color" id="picker" value="#4f46e5" style="width:100%;height:4rem;border:none;">
        <input type="text" id="hex" readonly style="text-align:center" value="#4f46e5">`;
      $('#picker').oninput = e => { $('#hex').value = e.target.value.toUpperCase(); $('#hex').select(); document.execCommand('copy'); };
    }
  },

  random: {
    title: 'Random Number Generator',
    render() {
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Min</label><input id="rmin" type="number" value="1">
        <label>Max</label><input id="rmax" type="number" value="100">
        <button class="btn" id="roll">Roll</button>
        <h3 id="rout" style="margin-top:1rem"></h3>`;
      $('#roll').onclick = () => {
        let a = +$('#rmin').value, b = +$('#rmax').value;
        if (a > b) [a, b] = [b, a];
        const n = Math.floor(Math.random() * (b - a + 1)) + a;
        $('#rout').textContent = n;
      };
    }
  },

  age: {
    title: 'Age Calculator',
    render() {
      const today = new Date().toISOString().split('T')[0];
      app.innerHTML = `
        <button class="btn" onclick="setHash('')">← Back</button><h2>${this.title}</h2>
        <label>Date of birth</label><input id="dob" type="date" max="${today}">
        <button class="btn" id="calc">Calculate</button>
        <h3 id="aget" style="margin-top:1rem"></h3>`;
      $('#calc').onclick = () => {
        const dob = new Date($('#dob').value);
        if (!dob) return;
        const diff = Date.now() - dob.getTime();
        const age = new Date(diff).getUTCFullYear() - 1970;
        $('#aget').textContent = isNaN(age) ? '' : `You are ${age} years old.`;
      };
    }
  }
};

/* ---------- router ---------- */
function render() {
  const key = location.hash.replace('#', '') || 'home';
  document.title = (tools[key] || tools.home).title + ' • Browser Toolkit';
  app.classList.remove('show');
  setTimeout(() => { (tools[key] || tools.home).render(); app.classList.add('show'); }, 100);
}
window.addEventListener('hashchange', render);
window.addEventListener('load', render);

/* ---------- shortcuts ---------- */
document.addEventListener('keydown', e => {
  if (e.key === '/' && location.hash === '') { e.preventDefault(); $('#search')?.focus(); }
  if (e.key === 'Escape' && location.hash !== '') setHash('');
});

/* ---------- service worker ---------- */
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('service-worker.js'));

