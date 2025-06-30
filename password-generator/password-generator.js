const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const lower = 'abcdefghijklmnopqrstuvwxyz';
const numbers = '0123456789';
const symbols = '!@#$%^&*()-_=+[]{}|;:,.<>?';

const themes = {
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
    "casket", "cobweb", "ghoul", "poltergeist", "web", "shiver", "hex", "mummy", "chains"
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
    "escape", "safari", "guide", "island", "trailhead", "campfire", "ridge", "basecamp", "expedition",
    "wilderness", "navigator", "compass", "backpack", "pioneer", "cliff", "ocean", "desert", "valley", "canyon"
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
    "note", "beat", "chord", "melody", "rhythm", "bass", "drum", "guitar", "piano", "vocal",
    "harmony", "tempo", "scale", "tune", "lyric", "sound", "band", "concert", "song", "voice",
    "synth", "bridge", "solo", "verse", "chorus", "instrument", "acoustic", "key"
  ],
  "space": [
    "orbit", "cosmos", "galaxy", "star", "comet", "planet", "rocket", "asteroid", "meteor", "nebula",
    "satellite", "lunar", "solar", "eclipse", "gravity", "blackhole", "supernova", "voyager", "astronaut",
    "telescope", "cosmic", "quasar", "constellation", "celestial", "vacuum", "universe"
  ],
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

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function generatePassword(length, opts, themeWords) {
  let charset = '';
  if (opts.uppercase) charset += upper;
  if (opts.lowercase) charset += lower;
  if (opts.numbers) charset += numbers;
  if (opts.symbols) charset += symbols;

  const useTheme = themeWords && themeWords.length > 0;
  let password = '';
  const usedWords = new Set();

  while (password.length < length) {
    if (useTheme && Math.random() < 0.6 && password.length < length - 4) {
      // Pick a unique theme word
      let word;
      let tries = 0;
      do {
        word = themeWords[randomInt(themeWords.length)];
        tries++;
      } while (usedWords.has(word) && tries < 10);
      usedWords.add(word);

      // Randomize casing per letter
      word = word.split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');
      if (password.length + word.length <= length) {
        password += word;
      } else {
        // If word doesn't fit, fill with random chars instead
        password += charset.charAt(randomInt(charset.length));
      }
    } else if (charset.length > 0) {
      password += charset.charAt(randomInt(charset.length));
    } else {
      break; // No charset and no theme words
    }
  }

  return password.slice(0, length);
}

function estimateEntropy(password, opts) {
  let charsetSize = 0;
  if (opts.uppercase) charsetSize += 26;
  if (opts.lowercase) charsetSize += 26;
  if (opts.numbers) charsetSize += 10;
  if (opts.symbols) charsetSize += symbols.length;

  if (opts.theme && opts.themeWords && opts.themeWords.length > 0) {
    // Themed password entropy estimate (rough, since words lower entropy)
    return password.length * 3;
  }

  return password.length * Math.log2(charsetSize || 1);
}

// Converts seconds to a human-readable string (seconds, minutes, hours, days, years, centuries)
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
  const entropyFill = Math.min(entropy / 100, 1) * 100; // cap at 100 bits for bar
  const entropyFillBar = document.getElementById('entropy-fill');
  entropyFillBar.style.width = entropyFill + '%';

  const entropyDesc = document.getElementById('entropy-desc');
  // Attacker tiers in guesses per second
  const attackerProfiles = {
    "Casual": 1e3,
    "Hobbyist": 1e6,
    "Professional": 1e9,
    "Nation-State": 1e12
  };

  let crackTimes = Object.entries(attackerProfiles).map(([level, rate]) => {
    const seconds = Math.pow(2, entropy) / rate;
    const display = secondsToHuman(seconds);
    return `<strong>${level}</strong>: ${display}`;
  });

  entropyDesc.innerHTML = `
    <div>${entropy < 28 ? "Very Weak" : entropy < 36 ? "Weak" : entropy < 60 ? "Reasonable" : entropy < 80 ? "Strong" : "Very Strong"}</div>
    <div style="margin-top: 0.5rem; font-size: 0.9rem; line-height: 1.2;">${crackTimes.join('<br>')}</div>
  `;

  // zxcvbn
  const zx = zxcvbn(password);
  const zxFillBar = document.getElementById('zxcvbn-fill');
  zxFillBar.style.width = (zx.score + 1) * 20 + '%';

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

  let themeWords = null;
  if (theme && themes[theme]) {
    themeWords = themes[theme];
  }
  opts.themeWords = themeWords;

  const pw = generatePassword(length, opts, themeWords);
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

// Initialize on page load
updatePassword();
