/* Browser Toolkit – single-page app (hash router) */
/* ------------ utilities ------------ */
const $ = sel => document.querySelector(sel);
const app = $('#app');
function setHash(h){ location.hash = h; }
function loadScript(src){ return new Promise(r=>{ const s=document.createElement('script');s.src=src;s.onload=r;document.head.appendChild(s);}); }

/* ------------ tool definitions ------------ */
const tools = {
  home: {
    title: 'All Tools',
    render(){
      app.innerHTML = `
        <input id="search" type="text" placeholder="Search tools…">
        <section class="grid" id="grid">
          ${Object.entries(tools).filter(([k])=>k!=='home').map(([k,t])=>
            `<a class="card" href="#${k}">${t.title}</a>`).join('')}
        </section>`;
      $('#search').oninput = e=>{
        const q=e.target.value.toLowerCase();
        document.querySelectorAll('#grid .card').forEach(c=>{
          c.style.display=c.textContent.toLowerCase().includes(q)?'block':'none';
        });
      };
    }
  },

  json: {
    title:'JSON Formatter',
    render(){
      app.innerHTML=`
        <button class="btn" onclick="setHash('')">← Back</button>
        <h2>${this.title}</h2>
        <textarea id="json-in" rows="10" placeholder='{"name":"Alice"}'></textarea>
        <button class="btn" id="fmt">Format</button>
        <pre id="out"></pre>`;
      $('#fmt').onclick=()=>{
        try{$('#out').textContent=JSON.stringify(JSON.parse($('#json-in').value),null,2);}
        catch{ $('#out').textContent='❌ Invalid JSON'; }
      };
    }
  },

  qr: {
    title:'QR Code Generator',
    async render(){
      app.innerHTML=`
        <button class="btn" onclick="setHash('')">← Back</button>
        <h2>${this.title}</h2>
        <input id="qr-text" type="text" placeholder="https://example.com">
        <button class="btn" id="make">Generate</button>
        <div id="qr-out" style="margin-top:1rem"></div>`;
      await loadScript('https://unpkg.com/qrcode@1.5.1/build/qrcode.min.js');
      $('#make').onclick=()=>{
        const t=$('#qr-text').value.trim();if(!t)return;
        $('#qr-out').innerHTML='';
        QRCode.toCanvas(t,{width:220},(e,can)=>{ if(e) return; $('#qr-out').appendChild(can); });
      };
    }
  },

  img: {
    title:'Image Compressor',
    async render(){
      app.innerHTML=`
        <button class="btn" onclick="setHash('')">← Back</button>
        <h2>${this.title}</h2>
        <input type="file" id="file" accept="image/*">
        <label>Quality (0.1–1)</label>
        <input id="q" type="number" min="0.1" max="1" step="0.1" value="0.7">
        <button class="btn" id="go">Compress</button>
        <p id="status"></p>
        <a id="dl" class="btn hidden" download="compressed.jpg">Download</a>`;
      await loadScript('https://unpkg.com/browser-image-compression@2.0.1/dist/browser-image-compression.js');
      $('#go').onclick=async()=>{
        const f=$('#file').files[0]; if(!f){$('#status').textContent='Choose an image.';return;}
        $('#status').textContent='Compressing…';
        try{
          const out=await imageCompression(f,{maxSizeMB:1,maxWidthOrHeight:1024,useWebWorker:true,initialQuality:parseFloat($('#q').value)});
          $('#status').textContent=`${(f.size/1024).toFixed(1)} KB → ${(out.size/1024).toFixed(1)} KB`;
          $('#dl').href=URL.createObjectURL(out);$('#dl').classList.remove('hidden');
        }catch{ $('#status').textContent='Failed'; }
      };
    }
  },

  unit: {
    title:'Unit Converter',
    render(){
      app.innerHTML=`
        <button class="btn" onclick="setHash('')">← Back</button>
        <h2>${this.title}</h2>
        <label>Value</label><input id="val" type="number" value="1">
        <label>From</label><select id="from">
          <option value="m">Meters</option><option value="km">Kilometers</option>
          <option value="mi">Miles</option><option value="ft">Feet</option></select>
        <label>To</label><select id="to">
          <option value="km">Kilometers</option><option value="m">Meters</option>
          <option value="mi">Miles</option><option value="ft">Feet</option></select>
        <button class="btn" id="conv">Convert</button>
        <p id="res" style="font-weight:600"></p>`;
      const map={m:1,km:1000,mi:1609.34,ft:0.3048};
      $('#conv').onclick=()=>{
        const v=parseFloat($('#val').value);if(isNaN(v))return;
        const r=v*map[$('#from').value]/map[$('#to').value];
        $('#res').textContent=`${v} ${$('#from').value} = ${r.toFixed(4)} ${$('#to').value}`;
      };
    }
  },

  text: {
    title:'Text Case Changer',
    render(){
      app.innerHTML=`
        <button class="btn" onclick="setHash('')">← Back</button>
        <h2>${this.title}</h2>
        <textarea id="txt" rows="6" placeholder="Type or paste text…"></textarea>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin:.5rem 0 1rem">
          <button class="btn" data-m="upper">UPPERCASE</button>
          <button class="btn" data-m="lower">lowercase</button>
          <button class="btn" data-m="title">Title Case</button>
          <button class="btn" data-m="sent">Sentence case</button>
        </div>
        <textarea id="out" rows="6" readonly></textarea>`;
      document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{
        const t=$('#txt').value;
        let r=t;if(b.dataset.m==='upper')r=t.toUpperCase();
        else if(b.dataset.m==='lower')r=t.toLowerCase();
        else if(b.dataset.m==='title')r=t.replace(/\\w\\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase());
        else if(b.dataset.m==='sent')r=t.charAt(0).toUpperCase()+t.slice(1).toLowerCase();
        $('#out').value=r;
      });
    }
  }
};

/* ------------ router ------------ */
function render(){
  const key = location.hash.replace('#','') || 'home';
  (tools[key]||tools.home).render();
}
window.addEventListener('hashchange',render);
window.addEventListener('load',render);
