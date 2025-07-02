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

  // Charsets
  const CHARSETS = {
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    numbers: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?'
  };

  // Themes object (fill in all your themes here)
const THEMES = {
  "sci-fi": [
    "star", "warp", "nova", "alien", "robot", "laser", "orbit", "quantum", "galaxy", "nebula",
    "plasma", "cyber", "android", "asteroid", "hyper", "droid", "void", "solar", "comet", "pulse",
    "ion", "mech", "clone", "portal", "engine", "space", "lunar", "eclipse", "gravity", "satellite",
    "fusion", "rocket", "sensor", "cosmos", "astro", "turbo", "cyborg", "photon", "binary"
  ],
  "movie": [
    "film", "scene", "take", "script", "reel", "actor", "director", "studio", "popcorn", "blockbuster",
    "cinema", "trailer", "drama", "comedy", "cinematics", "cast", "soundtrack", "producer", "screen", "credits",
    "camera", "dialogue", "shoot", "clip", "premiere", "ticket", "set", "frame", "action", "cut",
    "editor", "screenplay", "audition", "cinematographer", "stunt", "voiceover", "genre", "plot"
  ],
  "fantasy": [
    "dragon", "elf", "magic", "sword", "quest", "castle", "wizard", "spell", "troll", "knight",
    "orc", "phoenix", "dwarf", "frost", "crown", "enchanted", "goblin", "hero", "myth", "realm",
    "legend", "battle", "charm", "curse", "portal", "shield", "fable", "dagger", "beast", "rune",
    "alchemy", "siege", "sorcery", "faerie", "crystal", "golem", "wyrm", "bard", "throne", "cloak"
  ],
  "horror": [
    "ghost", "night", "fear", "dark", "blood", "skull", "creep", "haunt", "witch", "zombie",
    "curse", "shadow", "grave", "panic", "scream", "spook", "vampire", "monster", "evil", "demon",
    "claw", "terror", "crypt", "fog", "bat", "boo", "phantom", "chill", "nightmare", "gore",
    "casket", "cobweb", "ghoul", "poltergeist", "web", "shiver", "hex", "mummy", "chains", "fog"
  ],
  "cyberpunk": [
    "neon", "hack", "chrome", "matrix", "glitch", "byte", "code", "virus", "deck", "cyber",
    "blade", "tech", "wire", "pulse", "net", "loop", "frame", "core", "drive", "node",
    "signal", "mesh", "data", "ghost", "quant", "link", "bot", "grid", "flux", "circuit",
    "drone", "synth", "holo", "pixel", "cypher", "firewall", "proxy", "ledger", "quantum", "script"
  ],
  "adventure": [
    "trail", "map", "rope", "camp", "peak", "river", "climb", "trek", "explore", "cave",
    "quest", "summit", "path", "gear", "wild", "voyage", "route", "hike", "trailblaze", "journey",
    "escape", "safari", "guide", "island", "trailhead", "campfire", "ridge", "basecamp", "expedition", "wilderness",
    "navigator", "compass", "backpack", "pioneer", "cliff", "ocean", "desert", "valley", "canyon", "summit"
  ],
  "nature": [
    "tree", "river", "mountain", "forest", "flower", "leaf", "breeze", "rain", "sun", "cloud",
    "earth", "stone", "wild", "meadow", "ocean", "pine", "creek", "valley", "rock", "sky",
    "wildlife", "trail", "lake", "spring", "glade", "moss", "dawn", "twilight", "fern", "canyon"
  ],
  "technology": [
    "circuit", "pixel", "code", "server", "cloud", "cache", "data", "binary", "logic", "kernel",
    "algorithm", "script", "network", "byte", "debug", "firewall", "interface", "stack", "thread", "node",
    "virtual", "compile", "source", "protocol", "hash", "loop", "array", "bit", "drive", "command"
  ],
  "food": [
    "spice", "sugar", "salt", "pepper", "basil", "chili", "curry", "mint", "honey", "olive",
    "berry", "lemon", "apple", "grape", "plum", "nut", "bean", "carrot", "garlic", "ginger",
    "thyme", "roast", "butter", "cream", "sauce", "cake", "pie", "bread", "grain"
  ],
  "music": [
    "note", "beat", "chord", "melody", "rhythm", "tune", "lyric", "bass", "drum", "piano",
    "guitar", "violin", "horn", "scale", "tempo", "harmony", "voice", "sound", "echo", "solo",
    "band", "song", "jam", "synth", "keyboard", "vibe", "hook", "track", "mix"
  ],
  "space": [
    "star", "planet", "comet", "orbit", "gravity", "rocket", "cosmos", "eclipse", "meteor", "galaxy",
    "asteroid", "satellite", "nebula", "quasar", "blackhole", "solar", "lunar", "crater", "probe", "telescope"
  ],
  "mythology": [
    "zeus", "hera", "poseidon", "athena", "apollo", "hercules", "odin", "thor", "loki",
    "freya", "anubis", "ra", "isis", "osiris", "venus", "mars", "jupiter", "mercury"
  ]
};


  // symbolMap and numberMap from your original code
  const symbolMap = { 'a': '@', 'i': '!', 's': '$', 'o': '()', 't': '+' };
  const numberMap = { 'e': '3', 'o': '0', 'i': '1', 'a': '4', 's': '5', 't': '7', 'b': '8' };

  function randomInt(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }




function secureBool() {
  const array = new Uint8Array(1);
  window.crypto.getRandomValues(array);
  return array[0] > 127; // ~50% chance
}

function substituteChars(word, opts) {
  let map = {};
  if (opts.symbols && opts.numbers) {
    map = { ...numberMap, ...symbolMap };
  } else if (opts.symbols) {
    map = symbolMap;
  } else if (opts.numbers) {
    map = numberMap;
  }

  return word.split('').map(ch => {
    const lower = ch.toLowerCase();
    if (map[lower] && secureBool()) {
      return map[lower];
    }
    return ch;
  }).join('');
}

function generatePassword(opts) {
    let charPool = '';

    // --- REVISED LOGIC FOR charPool AND THEME WORD PROCESSING ---
    const includeUppercase = opts.uppercase;
    const includeLowercase = opts.lowercase;
    const includeNumbers = opts.numbers;
    const includeSymbols = opts.symbols;

    if (includeUppercase && !includeLowercase) {
        charPool += CHARSETS.uppercase;
    } else if (includeLowercase && !includeUppercase) {
        charPool += CHARSETS.lowercase;
    } else if (includeUppercase && includeLowercase) {
        charPool += CHARSETS.uppercase + CHARSETS.lowercase;
    }
    // If neither uppercase nor lowercase is checked, no letter charsets are added to charPool for random generation.

    if (includeNumbers) charPool += CHARSETS.numbers;
    if (includeSymbols) charPool += CHARSETS.symbols;

    // Fallback: If no character types are selected at all, use all.
    // This prevents an empty charPool for random character appending.
    if (!charPool) {
        charPool = CHARSETS.lowercase + CHARSETS.uppercase + CHARSETS.numbers + CHARSETS.symbols;
    }
    // --- END REVISED charPool LOGIC ---


    if (opts.theme && THEMES[opts.theme]) {
        const themeWords = THEMES[opts.theme];
        let words = [];
        let currentPasswordLength = 0;

        while (currentPasswordLength < opts.length && words.length < themeWords.length * 2) { // Add a safety break
            const originalWord = themeWords[randomInt(themeWords.length)];
            let processedWord = originalWord;

            // Apply case rules to theme words BEFORE adding them
            if (includeUppercase && !includeLowercase) {
                processedWord = originalWord.toUpperCase();
            } else if (includeLowercase && !includeUppercase) {
                processedWord = originalWord.toLowerCase();
            } else if (includeUppercase && includeLowercase) {
                // If both are checked, apply alternating case to make it "random"
                processedWord = applyRandomCaseStyle(originalWord);
            } else {
                // If no letters are allowed, filter out letters from theme words
                processedWord = originalWord.split('').filter(char => {
                    const isLetter = (CHARSETS.uppercase.includes(char.toUpperCase()) || CHARSETS.lowercase.includes(char.toLowerCase()));
                    return !isLetter;
                }).join('');

                // If filtering makes the word empty, or if original word only had letters
                // and no letters are allowed, skip this word or fill with non-letter chars.
                if (processedWord.length === 0 && (includeNumbers || includeSymbols)) {
                    // Try to add a random number or symbol if theme word can't be used
                    processedWord = charPool.charAt(randomInt(charPool.length));
                } else if (processedWord.length === 0) { // If no letters and no numbers/symbols allowed, this shouldn't happen with the fallback charPool
                     // Skip this word if it became empty and nothing else can be added
                     continue;
                }
            }
            
            // Only add word if it contributes meaningfully
            if (processedWord.length > 0) {
                words.push(processedWord);
                currentPasswordLength += processedWord.length;
            }
        }
        
        let password = words.join('');
        password = substituteChars(password, opts); // Apply substitutions after case and before final length adjustment

        // Trim or extend to exact length using the *correctly filtered* charPool
        if (password.length > opts.length) {
            password = password.slice(0, opts.length);
        } else if (password.length < opts.length) {
            while (password.length < opts.length) {
                // Ensure charPool is not empty, though the initial fallback should prevent this
                if (charPool.length === 0) {
                    console.warn("charPool is empty when trying to extend password length. This indicates an issue with character set selection.");
                    break;
                }
                password += charPool.charAt(randomInt(charPool.length));
            }
        }
        return password;

    } else {
        // Original logic for non-theme passwords, now using the refined charPool
        let password = '';
        for (let i = 0; i < opts.length; i++) {
            // Ensure charPool is not empty
            if (charPool.length === 0) {
                console.warn("charPool is empty for non-theme password generation.");
                break; // Prevent infinite loop
            }
            password += charPool.charAt(randomInt(charPool.length));
        }
        return password;
    }
}

// Keep applyRandomCaseStyle as is for the "both upper and lower" scenario with themes
function applyRandomCaseStyle(word) {
    return word.split('').map((ch, i) =>
        i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
    ).join('');
}


function entropyColor(entropy) {
  const clamped = Math.min(Math.max(entropy, 0), 80);
  const percent = clamped / 80;

  // Gradient from dark red → red → orange → yellow → green
  if (percent < 0.25) return "#8B0000";      // Dark Red
  if (percent < 0.4)  return "#FF0000";      // Red
  if (percent < 0.6)  return "#FF8C00";      // Orange
  if (percent < 0.8)  return "#FFD700";      // Yellow
  return "#00C853";                          // Green
}


  function entropyDescription(entropy) {
    if (entropy < 20) return "Very Weak";
    if (entropy < 40) return "Weak";
    if (entropy < 60) return "Moderate";
    if (entropy < 80) return "Strong";
    return "Very Strong";
  }

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
  function calcEntropy(password, opts) {
  let characterSetSize = 0;
  if (opts.lowercase) characterSetSize += CHARSETS.lowercase.length;
  if (opts.uppercase) characterSetSize += CHARSETS.uppercase.length;
  if (opts.numbers) characterSetSize += CHARSETS.numbers.length;
  if (opts.symbols) characterSetSize += CHARSETS.symbols.length;

  // If no character type is selected, default to all character sets.
  // This should ideally match your password generation logic's default.
  if (characterSetSize === 0) {
    characterSetSize = CHARSETS.lowercase.length + CHARSETS.uppercase.length + CHARSETS.numbers.length + CHARSETS.symbols.length;
  }

  // Shannon entropy formula: E = L * log2(N)
  // L is the length of the password.
  // N is the size of the character set.
  if (password.length === 0 || characterSetSize === 0) {
    return 0;
  }

  const entropy = password.length * (Math.log(characterSetSize) / Math.log(2));
  return entropy;
}
  function updateEntropy(password, opts) {
    const entropy = calcEntropy(password, opts);
    const maxEntropy = 80;
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

      const score = result.score;
      const scorePercent = (score / 4) * 100;
      zxcvbnFill.style.width = scorePercent + "%";
      zxcvbnFill.style.backgroundColor = zxcvbnColor(score);
      zxcvbnDesc.textContent = zxcvbnDescription(score);
    }
  }

  function updatePassword() {
    const opts = {
      length: parseInt(lengthInput.value, 10),
      uppercase: uppercaseCheckbox.checked,
      lowercase: lowercaseCheckbox.checked,
      numbers: numbersCheckbox.checked,
      symbols: symbolsCheckbox.checked,
      theme: themeSelect.value || null,
    };

    const pwd = generatePassword(opts);
    passwordTextarea.value = pwd;
    lengthVal.textContent = opts.length;

    updateEntropy(pwd, opts);
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
  themeSelect.addEventListener("change", updatePassword);

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

  // Initial update
  lengthVal.textContent = lengthInput.value;
  updatePassword();
});
