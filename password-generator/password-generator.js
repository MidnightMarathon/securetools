const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

const themes = {
  // Your theme word lists here (keep as in your repo)
  // e.g. "sci-fi": [...], "movie": [...], etc.
  "sci-fi": [
    "star", "warp", "nova", "alien", "robot", "laser", "orbit", "quantum", "galaxy", "nebula",
    "plasma", "cyber", "android", "asteroid", "hyper", "droid", "void", "solar", "comet", "pulse",
    "ion", "mech", "clone", "portal", "engine", "space", "lunar", "eclipse", "gravity", "satellite",
    "fusion", "rocket", "sensor", "cosmos", "astro", "turbo", "cyborg", "asteroid", "photon", "binary"
  ],
  // add your other themes similarly...
};

function randomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function transformThemeWord(word, opts) {
  // Apply casing according to user selections
  if (opts.uppercase && !opts.lowercase) {
    return word.toUpperCase();
  } else if (!opts.uppercase && opts.lowercase) {
    return word.toLowerCase();
  } else if (opts.uppercase && opts.lowercase) {
    // Random mix casing
    return word.split('').map(c => (Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase())).join('');
  } else {
    // Neither uppercase nor lowercase selected, no letters allowed from theme words
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

  // Theme words password building
  if (opts.themeWords && opts.themeWords.length > 0) {
    let pw = '';
    while (pw.length < length) {
      let w = opts.themeWords[randomInt(opts.themeWords.length)];
      w = transformThemeWord(w, opts);

      if (w.length === 0) {
        // fallback to charset-only password (no letters allowed)
        while (pw.length < length) {
          pw += charset.charAt(randomInt(charset.length));
        }
        break;
      }

      if (pw.length + w.length <= length) {
        pw += w;
      } else {
        // fill remaining length with charset chars
        while (pw.length < length) {
          pw += charset.charAt(randomInt(charset.length));
        }
      }
    }

    // Add required chars if missing
    for (const ch of requiredChars) {
      if (!pw.includes(ch)) {
        pw += ch;
      }
    }

    pw = pw.slice(0, length);
    return shuffleArray(pw.split('')).join('');
  }

  // Charset-only password build
  if (charset.length === 0) return '';

  let password = requiredChars.join('');
  while (password.length < length) {
    password += charset.charAt(randomInt(charset.length));
  }
  return shuffleArray(password.split('')).join('');
}

// Estimate entropy bits roughly
function estimateEntropy(password, opts) {
  let charsetSize = 0;
  if (opts.uppercase) charsetSize += 26;
  if (opts.lowercase) charsetSize += 26;
  if (opts.numbers) charsetSize += 10;
  if (opts.symbols) charsetSize += symbols.length;

  if (opts.themeWords && opts.themeWords.length > 0) {
    // Themed passwords are less random - rough estimate
    return password.length * 3;
  }

  return password.length * Math.log2(charsetSize || 1);
}

// Calculate time to crack given entropy bits and guesses per second
function timeToCrack(entropyBits, guessesPerSecond) {
  // Number of guesses to crack: 2^(entropyBits)
  // Time in seconds = guesses / guessesPerSecond
  const seconds = Math.pow(2, entropyBits) / guessesPerSecond;
  return seconds;
}

// Format seconds to human readable time
function formatTime(seconds) {
  const units = [
    { label: 'years', secs: 60 * 60 * 24 * 365 },
    { label: 'days', secs: 60 * 60 * 24 },
    { label: 'hours', secs: 60 * 60 },
    { label: 'minutes', secs: 60 },
    { label: 'seconds', secs: 1 }
  ];

  for (const unit of units) {
    if (seconds >= unit.secs) {
      const val = seconds / unit.secs;
      return `${val.toFixed(2)} ${unit.label}`;
    }
  }
  return 'less than a second';
}

// Update UI bars and descriptions
function updateStrengthBars(password, opts) {
  const entropy = estimateEntropy(password, opts);
  const entropyFill = Math.min(entropy / 100, 1) * 100;
  const entropyFillBar = document.getElementById('entropy-fill');
  entropyFillBar.style.width = entropyFill + '%';

  const entropyDesc = document.getElementById('entropy-desc');
  if (entropy < 28) entropyDesc.textContent = "Very Weak";
  else if (entropy < 36) entropyDesc.textContent = "Weak";
  else if (entropy < 60) entropyDesc.textContent = "Reasonable";
  else if (entropy < 80) entropyDesc.textContent = "Strong";
  else entropyDesc.textContent = "Very Strong";

  // zxcvbn strength bar
  const zx = zxcvbn(password);
  const zxFillBar = document.getElementById('zxcvbn-fill');
  zxFillBar.style.width = (zx.score + 1) * 20 + '%';

  const zxDesc = document.getElementById('zxcvbn-desc');
  const zxMessages = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
  zxDesc.textContent = zxMessages[zx.score] || "";

  // Add time to crack estimates for different attacker tiers
  // guesses per second for attacker tiers:
  //  - Online throttled: 100 guesses/sec
  //  - Online unthrottled: 10,000 guesses/sec
  //  - Offline slow hash: 10 million guesses/sec
  //  - Offline fast hash: 10 billion guesses/sec
  const attackerTiers = {
    "Online (Throttled)": 100,
    "Online (Unthrottled)": 1e4,
    "Offline (Slow Hash)": 1e7,
    "Offline (Fast Hash)": 1e10
  };

  let timeEstimates = '';
  for (const [tier, gps] of Object.entries(attackerTiers)) {
    const timeSec = timeToCrack(entropy, gps);
    timeEstimates += `${tier}: ${formatTime(timeSec)}\n`;
  }

  // Create or update a textarea or div with id "time-to-crack" below your strength bars
  let timeDiv = document.getElementById('time-to-crack');
  if (!timeDiv) {
    timeDiv = document.createElement('pre');
    timeDiv.id = 'time-to-crack';
    timeDiv.style.marginTop = '1rem';
    timeDiv.style.whiteSpace = 'pre-wrap';
    timeDiv.style.background = '#f5f5f5';
    timeDiv.style.border = '1px solid #ccc';
    timeDiv.style.padding = '0.75rem';
    timeDiv.style.borderRadius = '8px';
    const container = document.querySelector('main');
    container.appendChild(timeDiv);
  }
  timeDiv.textContent = `Estimated Time to Crack:\n${timeEstimates}`;
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

// Add event listeners
document.getElementById('length').addEventListener('input', updatePassword);
document.getElementById('uppercase').addEventListener('change', updatePassword);
document.getElementById('lowercase').addEventListener('change', updatePassword);
document.getElementById('numbers').addEventListener('change', updatePassword);
document.getElementById('symbols').addEventListener('change', updatePassword);
document.getElementById('theme-select').addEventListener('change', updatePassword);

// Initial call
updatePassword();
