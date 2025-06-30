function randomInt(max) {
  const array = new Uint32Array(1);
  window.crypto.getRandomValues(array);
  return array[0] % max;
}

function pickRandom(array) {
  return array[randomInt(array.length)];
}

function obfuscateWord(word) {
  const leet = { a: "@", s: "$", i: "!", o: "0", e: "3", l: "1", t: "7" };
  const modes = ['upper', 'random', 'leet'];
  const mode = pickRandom(modes);

  if (mode === 'upper') return word.toUpperCase();
  if (mode === 'leet') {
    return word.split('').map(c =>
      Math.random() < 0.5 && leet[c.toLowerCase()] ? leet[c.toLowerCase()] : c
    ).join('');
  }
  // random casing
  return word.split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c.toLowerCase()).join('');
}

function generatePassword(length, opts, themeWords) {
  let charset = '';
  const requiredTypes = [];

  if (opts.uppercase) {
    charset += upper;
    requiredTypes.push(() => pickRandom(upper));
  }
  if (opts.lowercase) {
    charset += lower;
    requiredTypes.push(() => pickRandom(lower));
  }
  if (opts.numbers) {
    charset += numbers;
    requiredTypes.push(() => pickRandom(numbers));
  }
  if (opts.symbols) {
    charset += symbols;
    requiredTypes.push(() => pickRandom(symbols));
  }

  const useTheme = themeWords && themeWords.length > 0;
  let password = '';
  const usedWords = new Set();
  const remainingLength = length - requiredTypes.length;

  while (password.length < remainingLength) {
    if (useTheme && Math.random() < 0.6 && password.length < length - 4) {
      let word, tries = 0;
      do {
        word = pickRandom(themeWords);
        tries++;
      } while (usedWords.has(word) && tries < 10);
      usedWords.add(word);

      const obfuscated = obfuscateWord(word);
      if (password.length + obfuscated.length <= remainingLength) {
        password += obfuscated;
      } else {
        password += pickRandom(charset);
      }
    } else if (charset.length > 0) {
      password += pickRandom(charset);
    } else {
      break;
    }
  }

  // Ensure each required type is used at least once
  for (let fn of requiredTypes) {
    password += fn();
  }

  // Shuffle the final password
  password = password.split('').sort(() => Math.random() - 0.5).join('');
  return password.slice(0, length);
}
