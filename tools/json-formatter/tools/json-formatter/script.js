document.getElementById('format-btn').addEventListener('click',()=>{
  const inp=document.getElementById('json-input').value;
  const out=document.getElementById('output');
  try{ out.textContent=JSON.stringify(JSON.parse(inp),null,2); }
  catch{ out.textContent='❌ Invalid JSON'; }
});
