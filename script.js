/* ------- Helpers ------- */
const $=s=>document.querySelector(s);
const app=$('#app');
function setHash(h){location.hash=h;}
/* theme toggle */
(()=>{const saved=localStorage.getItem('theme');if(saved==='dark')document.documentElement.setAttribute('data-theme','dark');
$('#theme-toggle').onclick=()=>{const d=document.documentElement.getAttribute('data-theme')==='dark';
document.documentElement.setAttribute('data-theme',d?'light':'dark');localStorage.setItem('theme',d?'light':'dark');};})();
/* external loader */
const ext=src=>new Promise(r=>{const s=document.createElement('script');s.src=src;s.onload=r;document.head.appendChild(s);});

/* ------- tool definitions ------- */
const tools={};
function addTool(key,title,icon,render){tools[key]={title,icon,render};}
/* Home renderer */
addTool('home','All Tools','🏠',function(){ app.innerHTML=`<input id="search" type="search" placeholder="Search tools…" autofocus>
<section class="grid" id="grid">${Object.entries(tools).filter(([k])=>k!=='home').map(([k,t])=>`<a href="#${k}" class="card">${t.icon}<br>${t.title}</a>`).join('')}</section>`;
$('#search').oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#grid .card').forEach(c=>c.style.display=c.textContent.toLowerCase().includes(q)?'block':'none');};});

/* Simple generators */
addTool('json','JSON Formatter','🗄️',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>JSON Formatter</h2>
<textarea id="jin" rows="10" placeholder='{"a":1}'></textarea><button class="btn" id="fmt">Format</button><pre id="jout"></pre>`;
$('#fmt').onclick=()=>{try{$('#jout').textContent=JSON.stringify(JSON.parse($('#jin').value),null,2);}catch{$('#jout').textContent='Invalid JSON';}};});

addTool('b64','Base64 Encode/Decode','🔐',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Base64 Encode / Decode</h2>
<textarea id="b64in" rows="6" placeholder="Text or Base64"></textarea>
<button class="btn" id="enc">Encode</button><button class="btn" id="dec">Decode</button>
<textarea id="b64out" rows="6" readonly></textarea>`;
$('#enc').onclick=()=>{$('#b64out').value=btoa($('#b64in').value);};
$('#dec').onclick=()=>{try{$('#b64out').value=atob($('#b64in').value);}catch{$('#b64out').value='Invalid Base64';}};});

addTool('url','URL Encode/Decode','🌐',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>URL Encode / Decode</h2>
<textarea id="urlin" rows="4"></textarea><button class="btn" id="urlenc">Encode</button><button class="btn" id="urldec">Decode</button><textarea id="urlout" rows="4" readonly></textarea>`;
$('#urlenc').onclick=()=>{$('#urlout').value=encodeURIComponent($('#urlin').value);};
$('#urldec').onclick=()=>{try{$('#urlout').value=decodeURIComponent($('#urlin').value);}catch{$('#urlout').value='Invalid';}};});

addTool('textcase','Text Case','🔠',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Text Case Converter</h2>
<textarea id="txt" rows="6"></textarea>
<select id="mode"><option value="upper">UPPER</option><option value="lower">lower</option><option value="title">Title Case</option></select>
<button class="btn" id="do">Convert</button><textarea id="out" rows="6" readonly></textarea>`;
$('#do').onclick=()=>{const m=$('#mode').value,t=$('#txt').value;
let r=t;if(m==='upper')r=t.toUpperCase();else if(m==='lower')r=t.toLowerCase();
else r=t.replace(/\w\S*/g,w=>w[0].toUpperCase()+w.slice(1).toLowerCase());$('#out').value=r;};});

addTool('lorem','Lorem Ipsum','📄',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Lorem Ipsum</h2>
<input id="num" type="number" min="1" max="10" value="2"><button class="btn" id="gen">Generate</button><textarea id="lout" rows="8" readonly></textarea>`;
$('#gen').onclick=()=>{const n=+$('#num').value;$('#lout').value=Array(n).fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit.').join('\n\n');};});

addTool('wordcount','Word Counter','✍️',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Word & Character Counter</h2>
<textarea id="wtext" rows="8"></textarea><p><b>Words:</b> <span id="w">0</span> | <b>Chars:</b> <span id="c">0</span></p>`;
$('#wtext').oninput=e=>{$('#c').textContent=e.target.value.length;$('#w').textContent=e.target.value.trim()?e.target.value.trim().split(/\s+/).length:0;};});

addTool('uuid','UUID Generator','📛',function(){
function uuidv4(){return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c^crypto.getRandomValues(new Uint8Array(1))[0]&15>>c/4).toString(16));}
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>UUID Generator</h2><button class="btn" id="g">Generate</button><input id="u" type="text" readonly>`;
$('#g').onclick=()=>{$('#u').value=uuidv4();$('#u').select();document.execCommand('copy');};});

addTool('timestamp','Timestamp Converter','⏰',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Timestamp Converter</h2>
<input id="nin" type="number" placeholder="Unix timestamp"><button class="btn" id="todate">→ Date</button><p id="dout"></p><hr>
<input id="din" type="datetime-local"><button class="btn" id="tots">→ TS</button><p id="tout"></p>`;
$('#todate').onclick=()=>{const v=parseInt($('#nin').value,10);$('#dout').textContent=isNaN(v)?'':new Date(v*1000).toLocaleString();};
$('#tots').onclick=()=>{const v=$('#din').value;if(!v)return;$('#tout').textContent=Math.floor(new Date(v).getTime()/1000);};});

addTool('pass','Password Generator','🔑',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Password Generator</h2>
<input id="plen" type="number" min="4" max="64" value="12"><label><input id="n" type="checkbox" checked> Numbers</label><label><input id="s" type="checkbox" checked> Symbols</label>
<button class="btn" id="gp">Generate</button><input id="pout" type="text" readonly>`;
$('#gp').onclick=()=>{const len=+$('#plen').value,l='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',nums='0123456789',sym='!@#$%^&*()_+';let pool=l+($('#n').checked?nums:'')+($('#s').checked?sym:'');let out='';for(let i=0;i<len;i++)out+=pool[Math.floor(Math.random()*pool.length)];$('#pout').value=out;};});

addTool('color','Color Picker','🎨',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Color Picker</h2><input type="color" id="pick" value="#4f46e5" style="width:100%;height:4rem;border:none;"><input id="hex" type="text" readonly>`;
$('#pick').oninput=e=>{$('#hex').value=e.target.value.toUpperCase();$('#hex').select();document.execCommand('copy');};});

addTool('rand','Random Number','🎲',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Random Number</h2>
<input id="min" type="number" value="1"> to <input id="max" type="number" value="100"><button class="btn" id="roll">Roll</button><h3 id="res"></h3>`;
$('#roll').onclick=()=>{let a=+$('#min').value,b=+$('#max').value;if(a>b)[a,b]=[b,a];$('#res').textContent=Math.floor(Math.random()*(b-a+1))+a;};});

addTool('age','Age Calculator','⏳',function(){
const today=new Date().toISOString().split('T')[0];
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Age Calculator</h2><input type="date" id="dob" max="${today}"><button class="btn" id="calc">Calc</button><p id="age"></p>`;
$('#calc').onclick=()=>{const d=new Date($('#dob').value);if(!d.getTime())return;$('#age').textContent=Math.floor((Date.now()-d)/31557600000)+' years';};});

addTool('hash','SHA-256 Hash','🔄',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>SHA-256 Hash</h2><textarea id="hin" rows="4"></textarea><button class="btn" id="hgo">Hash</button><textarea id="hout" rows="4" readonly></textarea>`;
$('#hgo').onclick=async()=>{const enc=new TextEncoder().encode($('#hin').value);const buf=await crypto.subtle.digest('SHA-256',enc);$('#hout').value=Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');};});

addTool('md5','MD5 Hash','🧮',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>MD5 Hash</h2><textarea id="md5in" rows="4"></textarea><button class="btn" id="md5go">Hash</button><textarea id="md5out" rows="4" readonly></textarea>`;
$('#md5go').onclick=async()=>{await ext('https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js');$('#md5out').value=md5($('#md5in').value);};});

addTool('reverse','Text Reverser','🔁',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Text Reverser</h2><textarea id="rin" rows="6"></textarea><button class="btn" id="rgo">Reverse</button><textarea id="rout" rows="6" readonly></textarea>`;
$('#rgo').onclick=()=>{$('#rout').value=$('#rin').value.split('').reverse().join('');};});

addTool('pal','Palindrome Checker','🔍',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Palindrome Checker</h2><input id="palin" type="text"><button class="btn" id="pcheck">Check</button><p id="pout"></p>`;
$('#pcheck').onclick=()=>{const s=$('#palin').value.toLowerCase().replace(/[^a-z0-9]/g,'');$('#pout').textContent=s===s.split('').reverse().join('')?'Palindrome!':'Not a palindrome.';};});

addTool('morse','Morse Code','•−',function(){
const morseMap={A:'.-',B:'-...',C:'-.-.',D:'-..',E:'.',F:'..-.',G:'--.',H:'....',I:'..',J:'.---',K:'-.-',L:'.-..',M:'--',N:'-.',O:'---',P:'.--.',Q:'--.-',R:'.-.',S:'...',T:'-',U:'..-',V:'...-',W:'.--',X:'-..-',Y:'-.--',Z:'--..',0:'-----',1:'.----',2:'..---',3:'...--',4:'....-',5:'.....',6:'-....',7:'--...',8:'---..',9:'----.'};
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Morse Code Encoder / Decoder</h2><textarea id="min" rows="4"></textarea>
<button class="btn" id="encm">Encode</button><button class="btn" id="decm">Decode</button><textarea id="mout" rows="4" readonly></textarea>`;
$('#encm').onclick=()=>{$('#mout').value=$('#min').value.toUpperCase().split('').map(ch=>morseMap[ch]||ch).join(' ');};
$('#decm').onclick=()=>{const rev=Object.fromEntries(Object.entries(morseMap).map(([k,v])=>[v,k]));$('#mout').value=$('#min').value.trim().split(' ').map(c=>rev[c]||' ').join('').replace(/  /g,' ');};});

addTool('rgbhex','RGB ↔ HEX','🌈',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>RGB ↔ HEX Converter</h2>
<input id="rgb" placeholder="rgb(255,0,0) or #ff0000"><button class="btn" id="cvt">Convert</button><p id="rgbout"></p>`;
$('#cvt').onclick=()=>{const v=$('#rgb').value.trim();let out='';if(v.startsWith('#')){const r=parseInt(v.slice(1,3),16),g=parseInt(v.slice(3,5),16),b=parseInt(v.slice(5,7),16);out=`rgb(${r},${g},${b})`;}else{const m=v.match(/rgb\((\d+),(\d+),(\d+)\)/);if(m){out='#'+[m[1],m[2],m[3]].map(n=>(+n).toString(16).padStart(2,'0')).join('');}}$('#rgbout').textContent=out||'Invalid';};});

addTool('bmi','BMI Calculator','⚖️',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>BMI Calculator</h2>
<label>Weight (kg)</label><input id="kg" type="number" step="any"><label>Height (cm)</label><input id="cm" type="number" step="any"><button class="btn" id="bmigo">Calculate</button><p id="bmires"></p>`;
$('#bmigo').onclick=()=>{const kg=+$('#kg').value,cm=+$('#cm').value;if(!kg||!cm)return;const bmi=kg/((cm/100)**2);$('#bmires').textContent='BMI: '+bmi.toFixed(2);};});

addTool('tip','Tip Calculator','💸',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Tip Calculator</h2>
<label>Bill ($)</label><input id="bill" type="number" step="any"><label>Tip %</label><input id="perc" type="number" value="15"><label>People</label><input id="peep" type="number" value="1"><button class="btn" id="tipgo">Calculate</button><p id="tipout"></p>`;
$('#tipgo').onclick=()=>{const b=+$('#bill').value,p=+$('#perc').value,n=+$('#peep').value;if(!b||!p||!n)return;const tip=b*p/100,total=b+tip;$('#tipout').textContent=`Tip: $${tip.toFixed(2)} | Total per person: $${(total/n).toFixed(2)}`;};});

addTool('regex','Regex Tester','🔎',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Regex Tester</h2>
<textarea id="txtin" rows="6" placeholder="Sample text"></textarea>
<input id="pattern" placeholder="Pattern (e.g. \d+)"><button class="btn" id="test">Test</button><p id="regout"></p>`;
$('#test').onclick=()=>{try{const re=new RegExp($('#pattern').value,'g');const res=$('#txtin').value.match(re);$('#regout').textContent=res?res.join(', '):'No matches';}catch(e){$('#regout').textContent='Invalid regex';}};});

/* more simple tool stubs to reach 30+ */
addTool('binary','Binary ↔ Decimal','💡',function(){
app.innerHTML=`<button class="btn" onclick="setHash('')">← Back</button><h2>Binary ↔ Decimal</h2>
<input id="bin" placeholder="Enter binary or decimal"><button class="btn" id="b2d">Bin → Dec</button><button class="btn" id="d2b">Dec → Bin</button><p id="bdout"></p>`;
$('#b2d').onclick=()=>{$('#bdout').textContent=parseInt($('#bin').value,2)||'Invalid';};
$('#d2b').onclick=()=>{$('#bdout').textContent=(+$('#bin').value).toString(2)||'Invalid';};});

/* ------- Router + keyboard ------- */
function render(){const k=location.hash.slice(1)||'home';document.title=(tools[k]?.title||tools.home.title)+' • Toolkit';app.classList.add('hidden');setTimeout(()=>{tools[k]?.render();app.classList.remove('hidden');},100);}
window.addEventListener('hashchange',render);window.addEventListener('load',render);
document.addEventListener('keydown',e=>{if(e.key==='/'&&location.hash==='#'){e.preventDefault();$('#search')?.focus();}if(e.key==='Escape'&&location.hash!==''){setHash('');}});
/* Service worker register */
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('service-worker.js'));
