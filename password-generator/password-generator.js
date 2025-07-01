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

function generatePassword(length, opts, themeWords) {
  let charset = '';
  if (opts.uppercase) charset += upper;
  if (opts.lowercase) charset += lower;
  if (opts.numbers) charset += numbers;
