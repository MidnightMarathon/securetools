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
  "movie": [
    "film", "scene", "take", "script", "reel", "actor", "director", "studio", "popcorn", "blockbuster",
    "cinema", "trailer", "drama", "comedy", "cinematics", "cast", "soundtrack", "producer", "screen", "credits",
    "camera", "dialogue", "shoot", "clip", "premiere", "ticket", "set", "frame", "action", "cut",
    "producer", "editor", "screenplay", "audition", "cinematographer", "stunt", "voiceover", "genre", "plot", "scene"
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
    "honey", "thyme", "roast", "butter", "cream", "sauce", "cake", "pie", "bread", "grain"
  ],
  "music": [
    "note", "beat", "chord", "melody", "rhythm", "bass", "drum", "guitar", "piano", "vocal",
    "harmony", "tempo", "scale", "tune", "lyric", "sound", "band", "concert", "song", "voice",
    "synth", "tempo", "bridge", "solo", "verse", "chorus", "instrument", "acoustic", "bass", "key"
  ],
  "space": [
    "orbit", "cosmos", "galaxy", "star", "comet", "planet", "rocket", "asteroid", "meteor", "nebula",
    "satellite", "lunar", "solar", "eclipse", "gravity", "blackhole", "supernova", "space", "voyager", "astronaut",
    "telescope", "cosmic", "quasar", "constellation", "asteroid", "celestial", "orbit", "vacuum", "universe", "rocket"
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
    // Neither uppercase nor lowercase selected
    return '';
  }
}

function generatePassword(length, opts, themeWords) {
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

  if (!charset && (!themeWords || themeWords.length === 0)) return '';

  // If theme selected and themeWords provided
  if (themeWords && themeWords.length > 0) {
    const pwWords = [];
    let pw = '';

    while (pw.length < length) {
      let w = themeWords[randomInt(themeWords.length)];
      w = transformThemeWord(w, opts);

      if (w.length === 0) {
        // No letters allowed from theme, fallback to charset chars only
        while (pw.length < length) {
          pw += charset.charAt(randomInt(charset.length));
        }
        break;
      }

      if (pw.length + w.length <= length) {
        pw += w;
        pwWords.push(w);
      } else {
        while (pw.length < length) {
          pw += charset.charAt(randomInt(charset.length));
        }
      }
    }

    // Add required chars if not already included
    for (const ch of requiredChars) {
      if (!pw.includes(ch)) {
        pw += ch;
      }
    }

    pw = pw.slice(0, length);
    const pwArr = pw.split('');
    shuffleArray(pwArr);
    return pwArr.join('');
  }

  // No theme, build password from charset guaranteeing at least one of each selected type
  if (charset.length === 0) return '';

  let password = requiredChars.join('');
  while (password.length < length) {
    password += charset.charAt(randomInt(charset.length));
  }

  const passwordArr = password.split('');
  shuffleArray(passwordArr);
  return passwordArr.join('');
}

function estimateEntropy(password, opts) {
  let charsetSize = 0;
  if (opts.uppercase) charsetSize += 26;
  if (opts.lowercase) charsetSize += 26;
  if (opts.numbers) charsetSize += 10;
  if (opts.symbols) charsetSize += symbols.length;

  if (opts.theme && opts.themeWords && opts.themeWords.length > 0) {
    return password.length * 3;
  }

  return password.length * Math.log2(charsetSize || 1);
}

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

  const zx = zxcvbn(password);
  const zxFillBar = document.getElementById('zxcvbn-fill');
  zxFillBar.style.width = (zx.score + 1) * 20 + '%';

  const zxDesc = document.getElementById('zxcvbn-desc');
  const zxMessages = [
    "Very Weak", "Weak", "Fair",
