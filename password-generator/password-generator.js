const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';
const ambiguous = '0O1lI';

const attackerProfiles = {
  "Single CPU (10⁵/sec)": 1e5,
  "Hobbyist (10⁸/sec)": 1e8,
  "Professional (10¹¹/sec)": 1e11,
  "Nation-State (10¹⁴/sec)": 1e14
};

// These should match your HTML themes
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
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePassword(length, opts, themeWords) {
  let charset = '';
  if (opts.uppercase) charset += upper;
  if (opts.lowercase) charset += lower;
  if (opts.numbers) charset += numbers;
  if (opts.symbols) charset += symbols;

  if (opts.noAmbiguous) {
    charset = charset.split('').filter(c => !ambiguous.includes(c)).join('');
  }

  const useTheme = themeWords && themeWords.length > 0;
  let passwordParts = [];

  if (useTheme) {
    const usedWords = new Set();
    // Add theme words while they fit
    while (passwordParts.join('').length < length) {
      let word;
      let tries = 0;
      do {
        word = themeWords[randomInt(themeWords.length)];
        tries++;
      } while (usedWords.has(word) && tries < 10);
      usedWords.add(word);

      // Randomly capitalize letters
      word = word.split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');

      if (passwordParts.join('').length + word.length <= length) {
        passwordParts.push(word);
      } else {
        break;
      }
    }

    // Insert random chars between, front, or end until length reached
    let currentLength = passwordParts.join('').length;
    while (currentLength < length) {
      const randomChar = charset.charAt(randomInt(charset.length));
      const insertPos = randomInt(passwordParts.length + 1);
      passwordParts.splice(insertPos, 0, randomChar);
      currentLength++;
    }

    return passwordParts.join('').slice(0, length);
  } else {
    // No theme words, just random chars
    let password = '';
    while (password.length < length) {
      password += charset.charAt(randomInt(charset.length));
    }
    return password.slice(0, length);
  }
}

function estimateEntropy(password, opts) {
  let charsetSize = 0;
  if (opts.uppercase) charsetSize += 26;
  if (opts.lowercase) charsetSize += 26;
  if (opts.numbers) charsetSize += 10;
  if (opts.symbols) charsetSize += symbols.length;

  if (opts.noAmbiguous) charsetSize -= ambiguous.length;

  if (opts.theme && opts.themeWords?.length > 0) {
    // Rough guess for theme words entropy
    return password.length * 3;
  }

  return password.length * Math.log2(charsetSize || 1);
}

function secondsToHuman(seconds) {
  const units = [
    ["seconds", 60],
    ["minutes", 60],
    ["hours", 24],
    ["days", 365],
    ["years", 100],
    ["centuries", Infinity]
  ];
  let i = 0;
  while (i < units.length && seconds >= units[i][1]) {
    seconds /= units[i][1];
    i++;
  }
  return seconds.toFixed(2) + " " + units[i][0];
}

function updateStrengthBars(password, opts) {
  const entropy = estimateEntropy(password, opts);
  const entropyFill = document.getElementById('entropy-fill');
  entropyFill.style.width = Math.min(entropy, 100) + '%';
  entropyFill.className = 'fill ' + getEntropyClass(entropy);

  let desc = `Entropy: ${entropy.toFixed(1)} bits<br>`;
  for (const [label, rate] of Object.entries(attackerProfiles)) {
    const seconds = Math.pow(2, entropy) / rate;
    desc += `<strong>${label}:</strong> ${secondsToHuman(seconds)}<br>`;
  }
  document.getElementById('entropy-desc').innerHTML = desc;

  const zx = zxcvbn(password);
  const zxcvbnFill = document.getElementById('zxcvbn-fill');
  zxcvbnFill.style.width = (zx.score + 1) * 20 + '%';
  zxcvbnFill.className = 'fill ' + getEntropyClass(zx.score * 25); // approximate
  const messages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  document.getElementById('zxcvbn-desc').textContent = messages[zx.score] || "";
}

function getEntropyClass(entropy) {
  if (entropy < 28) return 'very-weak';
  if (entropy < 36) return 'weak';
  if (entropy < 60) return 'fair';
  if (entropy < 128) return 'good';
  return 'strong';
}

function updatePassword() {
  let length = +document.getElementById('length').value;
  if (length < 4) {
    length = 4;
    document.getElementById('length').value = 4;
  }

  document.getElementById('length-val').textContent = length;

  const uppercase = document.getElementById('uppercase').checked;
  const lowercase = document.getElementById('lowercase').checked;
  const numbers = document.getElementById('numbers').checked;
  const symbols = document.getElementById('symbols').checked;
  const noAmbiguous = document.getElementById('no-ambiguous').checked;
  const theme = document.getElementById('theme-select').value;

  const opts = { uppercase, lowercase, numbers, symbols, noAmbiguous, theme };
  let themeWords = theme && themes[theme] ? themes[theme] : null;

  // For custom theme words, override if any
  if (theme === 'custom') {
    const customText = document.getElementById('custom-theme').value;
    if (customText.trim()) {
      themeWords = customText.split(',').map(w => w.trim()).filter(Boolean);
    } else {
      themeWords = null;
    }
  }

  opts.themeWords = themeWords;

  const password = generatePassword(length, opts, themeWords);
  document.getElementById('password').value = password;

  updateStrengthBars(password, opts);
}

function copyPassword() {
  const pw = document.getElementById('password');
  pw.select();
  pw.setSelectionRange(0, 99999); // for mobile
  document.execCommand('copy');
  alert('Password copied to clipboard!');
}

// Init listeners
document.getElementById('length').addEventListener('input', updatePassword);
document.getElementById('uppercase').addEventListener('change', updatePassword);
document.getElementById('lowercase').addEventListener('change', updatePassword);
document.getElementById('numbers').addEventListener('change', updatePassword);
document.getElementById('symbols').addEventListener('change', updatePassword);
document.getElementById('no-ambiguous').addEventListener('change', updatePassword);
document.getElementById('theme-select').addEventListener('change', updatePassword);
document.getElementById('custom-theme').addEventListener('input', updatePassword);

// Initial call
updatePassword();
