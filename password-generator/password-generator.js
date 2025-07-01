// Wait for DOM load
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const lengthInput = document.getElementById("length");
  const lengthVal = document.getElementById("length-val");
  const rerollBtn = document.getElementById("reroll");
  const passwordTextarea = document.getElementById("password");
  const uppercaseCheckbox = document.getElementById("uppercase");
  const lowercaseCheckbox = document.getElementById("lowercase");
  const numbersCheckbox = document.getElementById("numbers");
  const symbolsCheckbox = document.getElementById("symbols");
  const themeSelect = document.getElementById("theme-select");

  // Entropy bar elements
  const entropyFill = document.getElementById("entropy-fill");
  const entropyDesc = document.getElementById("entropy-desc");

  // zxcvbn bar elements
  const zxcvbnFill = document.getElementById("zxcvbn-fill");
  const zxcvbnDesc = document.getElementById("zxcvbn-desc");

  // Crack time elements
  const crackCpu = document.getElementById("crack-time-cpu");
  const crackGpu = document.getElementById("crack-time-gpu");
  const crackGroup = document.getElementById("crack-time-group");
  const crackState = document.getElementById("crack-time-state");

  // Test your own password elements
  const testInput = document.getElementById("test-password-input");
  const testFill = document.getElementById("test-zxcvbn-fill");
  const testDesc = document.getElementById("test-zxcvbn-desc");

  // Character sets
  const CHARSETS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()-_=+[]{}|;:',.<>/?`~"
  };

  // Themes character overrides (optional)
  const THEMES = {
    // Example themes — you can customize or expand
    "sci-fi": "0123456789ABCDEF", // hex-like
    "movie": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    "fantasy": "abcdefghijklmnopqrstuvwxyz",
    "horror": "!@#$%^&*",
    "cyberpunk": "0123456789abcdef!@#$%",
    "adventure": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    "nature": "abcdefghijklmnopqrstuvwxyz",
    "technology": "01",
    "food": "abcdefghijklmnopqrstuvwxyz",
    "music": "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "space": "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    "mythology": "abcdefghijklmnopqrstuvwxyz"
  };

  // Utility: Random integer between min (incl) and max (excl)
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // Generate password based on current settings
  function generatePassword() {
    let length = parseInt(lengthInput.value, 10);
    let charset = "";

    if (themeSelect.value && THEMES[themeSelect.value]) {
      // If theme selected, use theme charset only
      charset = THEMES[themeSelect.value];
    } else {
      // Otherwise, build charset from checked options
      if (uppercaseCheckbox.checked) charset += CHARSETS.uppercase;
      if (lowercaseCheckbox.checked) charset += CHARSETS.lowercase;
      if (numbersCheckbox.checked) charset += CHARSETS.numbers;
      if (symbolsCheckbox.checked) charset += CHARSETS.symbols;
    }

    if (!charset) return ""; // no charset selected

    let pwd = "";
    for (let i = 0; i < length; i++) {
      pwd += charset.charAt(randomInt(0, charset.length));
    }
    return pwd;
  }

  // Calculate entropy bits roughly: log2(charset_length^length) = length * log2(charset_length)
  function calcEntropy(password) {
    let charsetLength;

    if (themeSelect.value && THEMES[themeSelect.value]) {
      charsetLength = THEMES[themeSelect.value].length;
    } else {
      charsetLength = 0;
      if (uppercaseCheckbox.checked) charsetLength += CHARSETS.uppercase.length;
      if (lowercaseCheckbox.checked) charsetLength += CHARSETS.lowercase.length;
      if (numbersCheckbox.checked) charsetLength += CHARSETS.numbers.length;
      if (symbolsCheckbox.checked) charsetLength += CHARSETS.symbols.length;
    }
    if (charsetLength === 0) return 0;

    return password.length * Math.log2(charsetLength);
  }

  // Map entropy bits to color gradient red → yellow → green
  // entropy ranges: 0 → 60+ bits (you can tweak)
  function entropyColor(entropy) {
    const min = 0;
    const mid = 30;
    const max = 60;

    if (entropy <= mid) {
      // interpolate red (255,0,0) to yellow (255,255,0)
      const ratio = entropy / mid;
      const r = 255;
      const g = Math.round(255 * ratio);
      const b = 0;
      return `rgb(${r},${g},${b})`;
    } else {
      // interpolate yellow (255,255,0) to green (0,128,0)
      const ratio = (entropy - mid) / (max - mid);
      const r = Math.round(255 * (1 - ratio));
      const g = Math.round(255 - (127 * ratio));
      const b = 0;
      return `rgb(${r},${g},${b})`;
    }
  }

  // Entropy description based on bits
  function entropyDescription(entropy) {
    if (entropy < 20) return "Very Weak";
    if (entropy < 40) return "Weak";
    if (entropy < 60) return "Moderate";
    if (entropy < 80) return "Strong";
    return "Very Strong";
  }

  // Format crack times given seconds from zxcvbn result
  function formatCrackTime(seconds) {
    if (seconds === 0) return "Instantly";
    if (seconds < 1) return "<1 second";

    const units = [
      { label: "years", seconds: 31536000 },
      { label: "days", seconds: 86400 },
      { label: "hours", seconds: 3600 },
      { label: "minutes", seconds: 60 },
      { label: "seconds", seconds: 1 },
    ];

    for (const unit of units) {
      const val = Math.floor(seconds / unit.seconds);
      if (val > 0) return `${val} ${unit.label}`;
    }
    return "Instantly";
  }

  // Update entropy bar & description & crack times
  function updateEntropy(password) {
    const entropy = calcEntropy(password);
    const maxEntropy = 80; // cap max entropy for coloring

    const widthPercent = Math.min((entropy / maxEntropy) * 100, 100);
    entropyFill.style.width = widthPercent + "%";
    entropyFill.style.backgroundColor = entropyColor(entropy);
    entropyDesc.textContent = entropyDescription(entropy);

    if (typeof zxcvbn !== "undefined") {
      const result = zxcvbn(password);

      crackCpu.textContent = formatCrackTime(result.crack_times_seconds.offline_slow_hashing_1e4_per_second);
      crackGpu.textContent = formatCrackTime(result.crack_times_seconds.offline_fast_hashing_1e10_per_second);
      crackGroup.textContent = formatCrackTime(result.crack_times_seconds.offline_fast_hashing_1e11_per_second);
      crackState.textContent = formatCrackTime(result.crack_times_seconds.online_no_throttling_10_per_second);

      // Update zxcvbn bar & description for generated password
      const score = result.score;
      const scorePercent = (score / 4) * 100;
      zxcvbnFill.style.width = scorePercent + "%";
      zxcvbnFill.style.backgroundColor = zxcvbnColor(score);
      zxcvbnDesc.textContent = zxcvbnDescription(score);
    }
  }

  // zxcvbn score to color
  function zxcvbnColor(score) {
    switch(score) {
      case 0: return "#ff3b30"; // red
      case 1: return "#ff9500"; // orange
      case 2: return "#ffcc00"; // yellow
      case 3: return "#4cd964"; // light green
      case 4: return "#007aff"; // blue
      default: return "#ccc";
    }
  }

  // zxcvbn score description
  function zxcvbnDescription(score) {
    switch(score) {
      case 0: return "Very Weak";
      case 1: return "Weak";
      case 2: return "Fair";
      case 3: return "Strong";
      case 4: return "Very Strong";
      default: return "";
    }
  }

  // Update password display and stats
  function updatePassword() {
    const pwd = generatePassword();
    passwordTextarea.value = pwd;
    updateEntropy(pwd);
  }

  // Event listeners
  rerollBtn.addEventListener("click", updatePassword);

  lengthInput.addEventListener("input", () => {
    lengthVal.textContent = lengthInput.value;
    updatePassword();
  });

  uppercaseCheckbox.addEventListener("change", updatePassword);
  lowercaseCheckbox.addEventListener("change", updatePassword);
  numbersCheckbox.addEventListener("change", updatePassword);
  symbolsCheckbox.addEventListener("change", updatePassword);
  themeSelect.addEventListener("change", () => {
    updatePassword();
  });

  // Test your own password input listener
  testInput.addEventListener("input", () => {
    const pwd = testInput.value;
    if (!pwd) {
      testFill.style.width = "0%";
      testDesc.textContent = "Enter a password above to see how strong it is.";
      testFill.style.backgroundColor = "#ddd";
      return;
    }

    if (typeof zxcvbn !== "undefined") {
      const result = zxcvbn(pwd);
      const score = result.score;
      const scorePercent = (score / 4) * 100;

      testFill.style.width = scorePercent + "%";
      testFill.style.backgroundColor = zxcvbnColor(score);
      testDesc.textContent = `Score: ${score} — ${zxcvbnDescription(score)}`;
    }
  });

  // Initial run
  updatePassword();
});
