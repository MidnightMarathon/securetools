function generateRandom() {
  const min = parseInt(document.getElementById('min').value);
  const max = parseInt(document.getElementById('max').value);
  const result = document.getElementById('result');

  if (isNaN(min) || isNaN(max) || min >= max) {
    result.textContent = "😵‍💫";
    return;
  }

  const rand = Math.floor(Math.random() * (max - min + 1)) + min;
  result.textContent = rand;
  result.style.transform = "scale(1.2)";
  setTimeout(() => {
    result.style.transform = "scale(1)";
  }, 150);
}

