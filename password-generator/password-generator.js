function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
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

  // If theme is used, keep current themed approach but still ensure required chars if any selected
  const useTheme = themeWords && themeWords.length > 0;
  let password = '';

  if (useTheme) {
    // Generate password from theme words and random chars
    const usedWords = new Set();

    while (password.length < length) {
      if (Math.random() < 0.6 && password.length < length - 4) {
        let word;
        let tries = 0;
        do {
          word = themeWords[randomInt(themeWords.length)];
          tries++;
        } while (usedWords.has(word) && tries < 10);
        usedWords.add(word);

        word = word.split('').map(c => Math.random() < 0.5 ? c.toUpperCase() : c).join('');
        if (password.length + word.length <= length) {
          password += word;
        } else {
          password += charset.charAt(randomInt(charset.length));
        }
      } else if (charset.length > 0) {
        password += charset.charAt(randomInt(charset.length));
      } else {
        break;
      }
    }
    password = password.slice(0, length);
  } else {
    // No theme, so ensure at least one from each selected charset
    if (charset.length === 0) return ''; // no charset selected

    // Start with required chars to guarantee presence
    password = requiredChars.join('');

    // Fill rest randomly from charset
    while (password.length < length) {
      password += charset.charAt(randomInt(charset.length));
    }
  }

  // Shuffle to avoid required chars always at front
  const passwordArr = password.split('');
  shuffleArray(passwordArr);
  return passwordArr.join('');
}
