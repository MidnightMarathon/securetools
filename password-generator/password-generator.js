// Character sets
const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const ambiguous = '0O1lI';

// Themes
const themes = {
  "sci-fi": ["star", "warp", "nova", "alien", "robot", "laser", "orbit", "quantum", "galaxy", "nebula"],
  "movie": ["film", "scene", "take", "script", "reel", "actor", "studio", "popcorn", "cinema", "drama"],
  "fantasy": ["dragon", "elf", "magic", "sword", "quest", "castle", "wizard", "knight", "phoenix", "realm"],
  "horror": ["ghost", "night", "fear", "dark", "blood", "skull", "witch", "zombie", "panic", "scream"],
  "cyberpunk": ["neon", "hack", "chrome", "glitch", "matrix", "byte", "code", "cyber", "proxy", "drone"],
  "adventure": ["trail", "map", "camp", "peak", "climb", "trek", "summit", "cave", "voyage", "ridge"],
  "nature": ["tree", "river", "mountain", "forest", "flower", "leaf", "rain", "sun", "cloud", "earth"],
  "technology": ["circuit", "pixel", "code", "server", "cloud", "data", "stack", "drive", "kernel", "bit"],
  "food": ["spice", "sugar", "salt", "pepper", "mint", "honey", "berry", "carrot", "garlic", "pie"],
  "music": ["note", "beat", "melody", "rhythm", "bass", "guitar", "piano", "lyric", "song", "voice"],
  "space": ["orbit", "cosmos", "galaxy", "star", "comet", "planet", "rocket", "lunar", "gravity", "eclipse"],
  "mythology": ["zeus", "hera", "poseidon", "athena", "apollo", "thor", "loki", "odin", "hydra", "titan"]
};

function randomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

function randomChar(charset) {
  return charset.charAt(randomInt(charset.length));
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generatePassword(length, opts, themeWords = []) {
  let charset = '';
  if (opts.uppercase) charset += upper;
  if (opts.lowercase) charset += lower;
  if (opts.numbers) charset += numbers;
  if (opts.symbols) charset += symbols;
  if (opts.excludeAmbiguous) charset = charset.split('').filter(c => !ambiguous.includes(c)).join('');

  const password = [];
  while (password.join('').length < length) {
    if (themeWords.length > 0 && password.join('').length + themeWords[0].length <= length) {
      password.push(themeWords.splice(randomInt(themeWords.length), 1)[0]);
    } else {
      password.push(randomChar(charset));
    }
  }

  return shuffle(password.join('').split('')).join('').slice(0, length);
}

function calculateEntropy(password, charsetSize) {
  const entropy = password.length * Math.log2(charsetSize);
  return entropy;
}

function getCharsetSize(password) {
  let size = 0;
  if (/[A-Z]/.test(password)) size += upper.length;
  if (/[a-z]/.test(password)) size += lower.length;
  if (/[0-9]/.test(password)) size += numbers.length;
  if (/[^A-Za-z0-9]/.test(password)) size += symbols.length;
  return size;
}

function updateUI() {
  const opts = {
    uppercase: document.getElementById('uppercase').checked,
    lowercase: document.getElementById('lowercase').checked,
    numbers: document.getElementById('numbers').checked,
    symbols: document.getElementById('symbols').checked,
    excludeAmbiguous: document.getElementById('no-ambiguous').checked
  };

  const length = parseInt(document.getElementById('length').value, 10);
  document.getElementById('length-val').textContent = length;

  let selectedTheme = document.getElementById('theme-select').value;
  let themeWords = [];
  if (selectedTheme === 'custom') {
    const custom = document.getElementById('custom-theme').value;
    themeWords = custom.split(',').map(w => w.trim()).filter(Boolean);
  } else if (themes[selectedTheme]) {
    themeWords = [...themes[selectedTheme]];
  }

  const password = generatePassword(length, opts, themeWords);
  document.getElementById('password').value = password;

  const charsetSize = getCharsetSize(password);
  const entropy = calculateEntropy(password, charsetSize);
  document.getElementById('entropy-desc').textContent = `Entropy: ${entropy.toFixed(1)} bits`;

  const fill = document.getElementById('entropy-fill');
  fill.style.width = Math.min(100, entropy) + '%';
  fill.className = 'fill';
  if (entropy > 80) fill.classList.add('strong');
  else if (entropy > 60) fill.classList.add('good');
  else if (entropy > 40) fill.classList.add('fair');
  else if (entropy > 20) fill.classList.add('weak');
  else fill.classList.add('very-weak');

  if (typeof zxcvbn === 'function') {
    const result = zxcvbn(password);
    const score = result.score;
    const zxcvbnFill = document.getElementById('zxcvbn-fill');
    const zxcvbnDesc = document.getElementById('zxcvbn-desc');
    const scores = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

    zxcvbnFill.style.width = `${(score + 1) * 20}%`;
    zxcvbnFill.className = 'fill';
    zxcvbnFill.classList.add(['very-weak', 'weak', 'fair', 'good', 'strong'][score]);
    zxcvbnDesc.textContent = `zxcvbn score: ${score} (${scores[score]})`;
  }
}

document.getElementById('length').addEventListener('input', updateUI);
document.getElementById('uppercase').addEventListener('change', updateUI);
document.getElementById('lowercase').addEventListener('change', updateUI);
document.getElementById('numbers').addEventListener('change', updateUI);
document.getElementById('symbols').addEventListener('change', updateUI);
document.getElementById('no-ambiguous').addEventListener('change', updateUI);
document.getElementById('theme-select').addEventListener('change', updateUI);
document.getElementById('custom-theme').addEventListener('input', updateUI);

document.addEventListener('DOMContentLoaded', updateUI);

function copyPassword() {
  const input = document.getElementById('password');
  input.select();
  document.execCommand('copy');
}
