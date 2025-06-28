document.addEventListener('DOMContentLoaded', () => {
  const tools = [
    { name: "JSON Formatter", link: "tools/json-formatter/index.html" },
    { name: "QR Code Generator", link: "tools/qr-generator/index.html" },
    { name: "Image Compressor", link: "tools/image-compressor/index.html" },
    { name: "Unit Converter", link: "tools/unit-converter/index.html" },
    { name: "Text Case Changer", link: "tools/text-case/index.html" }
  ];

  const toolList = document.getElementById('tool-list');
  const searchInput = document.getElementById('search');

  function renderTools(query = '') {
    toolList.innerHTML = '';
    tools
      .filter(tool => tool.name.toLowerCase().includes(query.toLowerCase()))
      .forEach(tool => {
        const a = document.createElement('a');
        a.className = 'tool-card';
        a.href = tool.link;
        a.textContent = tool.name;
        toolList.appendChild(a);
      });
  }

  searchInput.addEventListener('input', e => renderTools(e.target.value));
  renderTools();
});
