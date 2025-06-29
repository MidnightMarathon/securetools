const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

const themes = {
  "sci-fi": [
    "star", "warp", "nova", "alien", "robot", "laser", "orbit", "quantum", "galaxy", "nebula",
    "plasma", "cyber", "android", "asteroid", "hyper", "droid", "void", "solar", "comet", "pulse",
    "ion", "mech", "clone", "portal", "engine", "space", "lunar", "eclipse", "gravity", "satellite",
    "fusion", "rocket", "sensor", "cosmos", "astro", "turbo", "cyborg", "asteroid", "photon", "binary"
  ],
  // ... include other themes as before ...
  "mythology": [
    "zeus", "hera", "poseidon", "athena", "apollo", "ares", "thor", "loki", "freya",
    "odin", "valhalla", "medusa", "minotaur", "cerberus", "pegasus", "hydra", "cyclops", "nymph", "titan",
    "sphinx", "chimera", "hephaestus", "hades", "demeter", "nike"
  ]
};

function randomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function transformThemeWord(word, opts) {
  if (opts.uppercase && !opts.lowercase) {
    return word.toUpperCase();
  } else if (!opts.uppercase && opts.lowercase) {
    return word.toLowerCase();
  } else if (opts.uppercase && opts.lowercase) {
    return word.split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
  } else {
    // Neither uppercase nor lowercase selected — return empty string
    return '';
  }
}

function generatePassword(length, opts) {
  let charset = '';
  const requiredChars = [];

  if (opts.uppercase) {
    charset += upper;
    requiredChars.push(upper.charAt(randomInt(upper.length)));
  }
  if (opts.lowercase) {
    charset += lower;
    requiredChars.push(lower.charAt(randomInt(lower.length)));
  }
  if (opts.numbers) {
    charset += numbers;
    requiredChars.push(numbers.charAt(randomInt(numbers.length)));
  }
  if (opts.symbols) {
    charset += symbols;
    requiredChars.push(symbols.charAt(randomInt(symbols.length)));
  }

  if (!charset && (!opts.themeWords || opts.themeWords.length === 0)) return '';

  if (opts.themeWords && opts.themeWords.length > 0) {
    let pwWords = [];
    let currentLength = 0;

    // Add theme words transformed by casing until we reach desired length
    while (currentLength < length) {
      let w = opts.themeWords[randomInt(opts.themeWords.length)];
      w = transformThemeWord(w, opts);

      if (w.length === 0) {
        // No letters allowed, fallback to charset chars only
        while (currentLength < length) {
          pwWords.push(charset.charAt(randomInt(charset.length)));
          currentLength++;
        }
        break;
      }

      if (currentLength + w.length <= length) {
        pwWords.push(w);
        currentLength += w.length;
      } else {
        // Fill remainder with random chars if word won't fit
        while (currentLength < length) {
          pwWords.push(charset.charAt(randomInt(charset.length)));
          currentLength++;
        }
      }
    }

    // Add required chars if missing
    for (const ch of requiredChars) {
      if (!pwWords.includes(ch)) {
        pwWords.push(ch);
      }
    }

    // Trim if over length
    let joined = pwWords.join('');
    while (joined.length > length) {
      pwWords.pop();
      joined = pwWords.join('');
    }

    // Shuffle words (words and chars stay intact)
    pwWords = shuffleArray(pwWords);

    return pwWords.join('');
  }

  // No theme, generate password from charset ensuring required chars included
  if (charset.length === 0) return '';

  let password = requiredChars.join('');
  while (password.length < length) {
    password += charset.charAt(randomInt(charset.length));
  }
  return shuffleArray(password.split('')).join('');
}

function estimateEntropy(password, opts) {
  let charsetSize = 0;
  if (opts.uppercase) charsetSize += 26;
  if (opts.lowercase) charsetSize += 26;
  if (opts.numbers) charsetSize += 10;
  if (opts.symbols) charsetSize += symbols.length;

  if (opts.theme && opts.themeWords && opts.themeWords.length > 0) {
    return password.length * 3; // crude estimate for themed words
  }

  return password.length * Math.log2(charsetSize || 1);
}

function updateStrengthBars(password, opts) {
  const entropy = estimateEntropy(password, opts);
  const entropyFill = Math.min(entropy / 100, 1) * 100;
  document.getElementById('entropy-fill').style.width = entropyFill + '%';

  const entropyDesc = document.getElementById('entropy-desc');
  if (entropy < 28) entropyDesc.textContent = "Very Weak";
  else if (entropy < 36) entropyDesc.textContent = "Weak";
  else if (entropy < 60) entropyDesc.textContent = "Reasonable";
  else if (entropy < 80) entropyDesc.textContent = "Strong";
  else entropyDesc.textContent = "Very Strong";

  const zx = zxcvbn(password);
  document.getElementById('zxcvbn-fill').style.width = (zx.score + 1) * 20 + '%';

  const zxDesc = document.getElementById('zxcvbn-desc');
  const zxMessages = [
    "Very Weak", "Weak", "Fair", "Good", "Strong"
  ];
  zxDesc.textContent = zxMessages[zx.score] || "";
}

function updatePassword() {
  const length = +document.getElementById('length').value;
  const uppercase = document.getElementById('uppercase').checked;
  const lowercase = document.getElementById('lowercase').checked;
  const numbers = document.getElementById('numbers').checked;
  const symbols = document.getElementById('symbols').checked;
  const theme = document.getElementById('theme-select').value;

  const opts = { uppercase, lowercase, numbers, symbols, theme };

  if (theme && themes[theme]) {
    opts.themeWords = themes[theme];
  } else {
    opts.themeWords = null;
  }

  const pw = generatePassword(length, opts);
  const pwBox = document.getElementById('password');
  pwBox.value = pw;

  updateStrengthBars(pw, opts);
  document.getElementById('length-val').textContent = length;
}

// Event listeners
document.getElementById('length').addEventListener('input', updatePassword);
document.getElementById('uppercase').addEventListener('change', updatePassword);
document.getElementById('lowercase').addEventListener('change', updatePassword);
document.getElementById('numbers').addEventListener('change', updatePassword);
document.getElementById('symbols').addEventListener('change', updatePassword);
document.getElementById('theme-select').addEventListener('change', updatePassword);

// Initialize
updatePassword();
