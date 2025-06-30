<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Themed Password Generator</title>
  <style>
    body {
      font-family: sans-serif;
      background: #f4f4f4;
      padding: 2rem;
      max-width: 600px;
      margin: auto;
    }
    input[type="range"] { width: 100%; }
    .section { margin-bottom: 1.5rem; }
    .bar {
      height: 10px;
      width: 100%;
      background: #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .fill {
      height: 100%;
      width: 0;
      transition: width 0.3s, background 0.3s;
    }
    #password {
      width: 100%;
      font-size: 1.2rem;
      padding: 0.5rem;
      margin-bottom: 0.5rem;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      cursor: pointer;
    }
    .attack-times {
      font-size: 0.9rem;
      color: #444;
      margin-top: 0.5rem;
    }
    #custom-theme-wrapper {
      display: none;
    }
    #custom-theme {
      width: 100%;
      height: 80px;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>Themed Password Generator</h1>

  <div class="section">
    <label>Password length: <span id="length-val">16</span></label>
    <input id="length" type="range" min="8" max="64" value="16">
  </div>

  <div class="section">
    <label><input type="checkbox" id="uppercase" checked> Uppercase</label><br>
    <label><input type="checkbox" id="lowercase" checked> Lowercase</label><br>
    <label><input type="checkbox" id="numbers" checked> Numbers</label><br>
    <label><input type="checkbox" id="symbols"> Symbols</label><br>
    <label><input type="checkbox" id="no-ambiguous"> Exclude ambiguous characters</label>
  </div>

  <div class="section">
    <label for="theme-select">Theme:</label>
    <select id="theme-select">
      <option value="">None</option>
      <option value="sci-fi">Sci-Fi</option>
      <option value="movie">Movie</option>
      <option value="fantasy">Fantasy</option>
      <option value="horror">Horror</option>
      <option value="cyberpunk">Cyberpunk</option>
      <option value="adventure">Adventure</option>
      <option value="nature">Nature</option>
      <option value="technology">Technology</option>
      <option value="food">Food</option>
      <option value="music">Music</option>
      <option value="space">Space</option>
      <option value="mythology">Mythology</option>
      <option value="custom">Custom</option>
    </select>

    <div id="custom-theme-wrapper">
      <label for="custom-theme">Enter your custom words (comma-separated):</label>
      <textarea id="custom-theme"></textarea>
    </div>
  </div>

  <div class="section">
    <input id="password" readonly>
    <button onclick="copyPassword()">Copy</button>
  </div>

  <div class="section">
    <div><strong>Estimated Entropy</strong></div>
    <div class="bar"><div id="entropy-fill" class="fill"></div></div>
    <div id="entropy-desc"></div>
    <div id="attack-times" class="attack-times"></div>
  </div>

  <div class="section">
    <div><strong>zxcvbn Score</strong></div>
    <div class="bar"><div id="zxcvbn-fill" class="fill"></div></div>
    <div id="zxcvbn-desc"></div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/zxcvbn"></script>
  <script src="generator.js"></script>
  <script>
    const themeSelect = document.getElementById('theme-select');
    const customWrapper = document.getElementById('custom-theme-wrapper');
    themeSelect.addEventListener('change', () => {
      customWrapper.style.display = themeSelect.value === 'custom' ? 'block' : 'none';
    });
  </script>
</body>
</html>
