'use strict';

function cryptoRandInt(min, max) {
  const range = max - min + 1;
  const bytesNeeded = Math.ceil(Math.log2(range) / 8) + 1;
  const maxUnbiased = Math.floor(256 ** bytesNeeded / range) * range;
  let value;
  do {
    const bytes = crypto.getRandomValues(new Uint8Array(bytesNeeded));
    value = bytes.reduce((acc, byte) => acc * 256 + byte, 0);
  } while (value >= maxUnbiased);
  return min + (value % range);
}

function generateRandom() {
  const min = parseInt(document.getElementById('min').value);
  const max = parseInt(document.getElementById('max').value);
  const result = document.getElementById('result');

  if (isNaN(min) || isNaN(max) || min >= max) {
    result.textContent = "😵‍💫";
    return;
  }

  const rand = cryptoRandInt(min, max);
  result.textContent = rand;
  result.style.transform = "scale(1.2)";
  setTimeout(() => {
    result.style.transform = "scale(1)";
  }, 150);
}

document.getElementById('generate-btn').addEventListener('click', generateRandom);

