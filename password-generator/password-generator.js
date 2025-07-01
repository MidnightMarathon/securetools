<script>
  window.addEventListener('DOMContentLoaded', () => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

    const symbolMap = {
      'a': '@', 'i': '!', 's': '$', 'o': '()', 't': '+',
    };

    const numberMap = {
      'e': '3', 'o': '0', 'i': '1', 'a': '4', 's': '5', 't': '7', 'b': '8'
    };

    const themes = {
      "sci-fi": ["star", "warp", "nova", "alien", "robot", "laser", "orbit", "quantum", "galaxy", "nebula",
        "plasma", "cyber", "android", "asteroid", "hyper", "droid", "void", "solar", "comet", "pulse",
        "ion", "mech", "clone", "portal", "engine", "space", "lunar", "eclipse", "gravity", "satellite",
        "fusion", "rocket", "sensor", "cosmos", "astro", "turbo", "cyborg", "photon", "binary"
      ],
      "movie": ["film", "scene", "take", "script", "reel", "actor", "director", "studio", "popcorn", "blockbuster",
        "cinema", "trailer", "drama", "comedy", "cinematics", "cast", "soundtrack", "producer", "screen", "credits",
        "camera", "dialogue", "shoot", "clip", "premiere", "ticket", "set", "frame", "action", "cut",
        "editor", "screenplay", "audition", "cinematographer", "stunt", "voiceover", "genre", "plot"
      ],
      // ... rest of themes as before ...
      "fantasy": ["dragon", "elf", "magic", "sword", "quest", "castle", "wizard", "spell", "troll", "knight",
        "orc", "phoenix", "dwarf", "frost", "crown", "enchanted", "goblin", "hero", "myth", "realm",
        "legend", "battle", "charm", "curse", "portal", "shield", "fable", "dagger", "beast", "rune",
        "alchemy", "siege", "sorcery", "faerie", "crystal", "golem", "wyrm", "bard", "throne", "cloak"
      ],
      "horror": ["ghost", "night", "fear", "dark", "blood", "skull", "creep", "haunt", "witch", "zombie",
        "curse", "shadow", "grave", "panic", "scream", "spook", "vampire", "monster", "evil", "demon",
        "claw", "terror", "crypt", "fog", "bat", "boo", "phantom", "chill", "nightmare", "gore",
        "casket", "cobweb", "ghoul", "poltergeist", "web", "shiver", "hex", "mummy", "chains", "fog"
      ],
      "cyberpunk": ["neon", "hack", "chrome", "matrix", "glitch", "byte", "code", "virus", "deck", "cyber",
        "blade", "tech", "wire", "pulse", "net", "loop", "frame", "core", "drive", "node",
        "signal", "mesh", "data", "ghost", "quant", "link", "bot", "grid", "flux", "circuit",
        "drone", "synth", "holo", "pixel", "cypher", "firewall", "proxy", "ledger", "quantum", "script"
      ],
      "adventure": ["trail", "map", "rope", "camp", "peak", "river", "climb", "trek", "explore", "cave",
        "quest", "summit", "path", "gear", "wild", "voyage", "route", "hike", "trailblaze", "journey",
        "escape", "safari", "guide", "island", "trailhead", "campfire", "ridge", "basecamp", "expedition", "wilderness",
        "navigator", "compass", "backpack", "pioneer", "cliff", "ocean", "desert", "valley", "canyon", "summit"
      ],
      "nature": ["tree", "river", "mountain", "forest", "flower", "leaf", "breeze", "rain", "sun", "cloud",
        "earth", "stone", "wild", "meadow", "ocean", "pine", "creek", "valley", "rock", "sky",
        "wildlife", "trail", "lake", "spring", "glade", "moss", "dawn", "twilight", "fern", "canyon"
      ],
      "technology": ["circuit", "pixel", "code", "server", "cloud", "cache", "data", "binary", "logic", "kernel",
        "algorithm", "script", "network", "byte", "debug", "firewall", "interface", "stack", "thread", "node",
        "virtual", "compile", "source", "protocol", "hash", "loop", "array", "bit", "drive", "command"
      ],
      "food": ["spice", "sugar", "salt", "pepper", "basil", "chili", "curry", "mint", "honey", "olive",
        "berry", "lemon", "apple", "grape", "plum", "nut", "bean", "carrot", "garlic", "ginger",
        "thyme", "roast", "butter", "cream", "sauce", "cake", "pie", "bread", "grain"
      ],
      "music": ["note", "beat", "chord", "melody", "rhythm", "tune", "lyric", "bass", "drum", "piano",
        "guitar", "violin", "horn", "scale", "tempo", "harmony", "voice", "sound", "echo", "solo",
        "band", "song", "jam", "synth", "keyboard", "vibe", "hook", "track", "mix"
      ],
      "space": ["star", "planet", "comet", "orbit", "gravity", "rocket", "cosmos", "eclipse", "meteor", "galaxy",
        "asteroid", "satellite", "nebula", "quasar", "blackhole", "solar", "lunar", "crater", "probe", "telescope"
      ],
      "mythology": ["zeus", "hera", "poseidon", "athena", "apollo", "hera", "hercules", "odin", "thor", "loki",
        "freya", "anubis", "ra", "isis", "osiris", "venus", "mars", "jupiter", "mercury", "venus"
      ]
    };

    function randomInt(max) {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    }

    function capitalize(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function applyRandomCaseStyle(word) {
      const styles = ['pascal', 'camel', 'alt'];
      const style = styles[randomInt(styles.length)];
      if (style === 'pascal') return capitalize(word.toLowerCase());
      if (style === 'camel') return word.charAt(0).toLowerCase() + word.slice(1).toUpperCase();
      if (style === 'alt') {
        return word.split('').map((ch, i) =>
          i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()
        ).join('');
      }
      return word;
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
        if (map[lower]) {
          // 50% chance to substitute
          if (Math.random() > 0.5) {
            return map[lower];
          }
        }
        return ch;
      }).join('');
    }

    function generatePassword(opts) {
      if (opts.theme && opts.theme in themes) {
        const themeWords = themes[opts.theme];
        let words = [];
        while (words.length < Math.ceil(opts.length / 6)) {
          const w = themeWords[randomInt(themeWords.length)];
          words.push(w);
        }
        // Combine words and truncate or pad
        let password = words.join('');
        // Apply case styles & substitutions
        password = applyRandomCaseStyle(password);
        password = substituteChars(password, opts);
        // If still shorter than length, append random chars
        while (password.length < opts.length) {
          let charPool = '';
          if (opts.uppercase) charPool += upper;
          if (opts.lowercase) charPool += lower;
          if (opts.numbers) charPool += numbers;
          if (opts.symbols) charPool += symbols;
          if (!charPool) charPool = lower + upper + numbers + symbols;
          password += charPool.charAt(randomInt(charPool.length));
        }
        return password.slice(0, opts.length);
      }

      let charPool = '';
      if (opts.uppercase) charPool += upper;
      if (opts.lowercase) charPool += lower;
      if (opts.numbers) charPool += numbers;
      if (opts.symbols) charPool += symbols;
      if (!charPool) charPool = lower + upper + numbers + symbols;

      let password = '';
      for (let i = 0; i < opts.length; i++) {
        password += charPool.charAt(randomInt(charPool.length));
      }
      return password;
    }

    function calcEntropy(length, poolSize) {
      if (poolSize === 0) return 0;
      return Math.round(Math.log2(poolSize) * length);
    }

    function formatSeconds(seconds) {
      if (seconds === 0 || !isFinite(seconds)) return '∞ (very strong)';
      const units = [
        { label: 'years', seconds: 60 * 60 * 24 * 365 },
        { label: 'days', seconds: 60 * 60 * 24 },
        { label: 'hours', seconds: 60 * 60 },
        { label: 'minutes', seconds: 60 },
        { label: 'seconds', seconds: 1 }
      ];
      for (const unit of units) {
        if (seconds >= unit.seconds) {
          const val = seconds / unit.seconds;
          return `${val.toFixed(1)} ${unit.label}`;
        }
      }
      return `${seconds.toFixed(1)} seconds`;
    }

    const lengthSlider = document.getElementById('length');
    const lengthVal = document.getElementById('length-val');
    const uppercaseCheckbox = document.getElementById('uppercase');
    const lowercaseCheckbox = document.getElementById('lowercase');
    const numbersCheckbox = document.getElementById('numbers');
    const symbolsCheckbox = document.getElementById('symbols');
    const themeSelect = document.getElementById('theme-select');
    const passwordArea = document.getElementById('password');
    const rerollBtn = document.getElementById('reroll');

    const entropyFill = document.getElementById('entropy-fill');
    const entropyDesc = document.getElementById('entropy-desc');
    const crackCpu = document.getElementById('crack-time-cpu');
    const crackGpu = document.getElementById('crack-time-gpu');
    const crackGroup = document.getElementById('crack-time-group');
    const crackState = document.getElementById('crack-time-state');

    const zxcvbnFill = document.getElementById('zxcvbn-fill');
    const zxcvbnDesc = document.getElementById('zxcvbn-desc');

    const testInput = document.getElementById('test-password-input');
    const testFill = document.getElementById('test-zxcvbn-fill');
    const testDesc = document.getElementById('test-zxcvbn-desc');

    function updatePassword() {
      const opts = {
        length: parseInt(lengthSlider.value),
        uppercase: uppercaseCheckbox.checked,
        lowercase: lowercaseCheckbox.checked,
        numbers: numbersCheckbox.checked,
        symbols: symbolsCheckbox.checked,
        theme: themeSelect.value || null
      };

      const pwd = generatePassword(opts);
      passwordArea.value = pwd;

      // Calculate pool size
      let poolSize = 0;
      if (opts.uppercase) poolSize += upper.length;
      if (opts.lowercase) poolSize += lower.length;
      if (opts.numbers) poolSize += numbers.length;
      if (opts.symbols) poolSize += symbols.length;
      if (poolSize === 0) poolSize = upper.length + lower.length + numbers.length + symbols.length;

      const entropy = calcEntropy(opts.length, poolSize);
      entropyFill.style.width = Math.min(entropy / 128 * 100, 100) + '%';

      let entropyColor = '#27ae60'; // green
      if (entropy < 40) entropyColor = '#e74c3c'; // red
      else if (entropy < 80) entropyColor = '#f1c40f'; // yellow
      entropyFill.style.backgroundColor = entropyColor;

      if (entropy < 40) entropyDesc.textContent = 'Weak';
      else if (entropy < 80) entropyDesc.textContent = 'Moderate';
      else entropyDesc.textContent = 'Strong';

      // Crack time estimates (guesses per second)
      const guesses = Math.pow(2, entropy);
      crackCpu.textContent = formatSeconds(guesses / 1e9);
      crackGpu.textContent = formatSeconds(guesses / 1e11);
      crackGroup.textContent = formatSeconds(guesses / 1e13);
      crackState.textContent = formatSeconds(guesses / 1e14);

      // zxcvbn score & feedback
      if (typeof zxcvbn === 'function') {
        const zx = zxcvbn(pwd);
        const score = zx.score || 0;
        const zPercent = (score / 4) * 100;
        zxcvbnFill.style.width = zPercent + '%';

        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#2ecc71'];
        zxcvbnFill.style.backgroundColor = colors[score];

        const scoreText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
        zxcvbnDesc.textContent = `Password strength: ${scoreText}. ${zx.feedback.warning || ''} ${zx.feedback.suggestions.join(' ')}`;
      }
    }

    lengthSlider.addEventListener('input', () => {
      lengthVal.textContent = lengthSlider.value;
      updatePassword();
    });

    uppercaseCheckbox.addEventListener('change', updatePassword);
    lowercaseCheckbox.addEventListener('change', updatePassword);
    numbersCheckbox.addEventListener('change', updatePassword);
    symbolsCheckbox.addEventListener('change', updatePassword);
    themeSelect.addEventListener('change', updatePassword);
    rerollBtn.addEventListener('click', updatePassword);

    // Initial update on load
    updatePassword();

    // Test your own password input event
    testInput.addEventListener('input', () => {
      const pw = testInput.value;
      if (typeof zxcvbn === 'function' && pw.length > 0) {
        const zx = zxcvbn(pw);
        const score = zx.score || 0;
        const zPercent = (score / 4) * 100;
        testFill.style.width = zPercent + '%';

        const colors = ['#e74c3c', '#f39c12', '#f1c40f', '#27ae60', '#2ecc71'];
        testFill.style.backgroundColor = colors[score];

        const scoreText = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][score];
        testDesc.textContent = `Password strength: ${scoreText}. ${zx.feedback.warning || ''} ${zx.feedback.suggestions.join(' ')}`;
      } else {
        testFill.style.width = '0%';
        testDesc.textContent = 'Enter a password above to see how strong it is.';
      }
    });
  });
</script>
