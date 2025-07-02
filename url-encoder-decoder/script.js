const MAX_INPUT_LENGTH = 16000;

function updateCounts() {
  const input = document.getElementById("input").value;
  document.getElementById("inputCount").textContent = input.length;
}

document.getElementById("input").addEventListener("input", updateCounts);

function handleURLEncode() {
  const input = document.getElementById("input").value;
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";

  if (input.length > MAX_INPUT_LENGTH) {
    errorBox.textContent = `⚠️ Input too long. Limit: ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  try {
    const encoded = encodeURIComponent(input);
    document.getElementById("output").value = encoded;
    document.getElementById("outputCount").textContent = encoded.length;
  } catch {
    errorBox.textContent = "⚠️ Encoding failed.";
  }
}

function handleURLDecode() {
  const input = document.getElementById("input").value;
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";

  if (input.length > MAX_INPUT_LENGTH) {
    errorBox.textContent = `⚠️ Input too long. Limit: ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  try {
    const decoded = decodeURIComponent(input);
    document.getElementById("output").value = decoded;
    document.getElementById("outputCount").textContent = decoded.length;
  } catch {
    errorBox.textContent = "⚠️ Decoding failed. Make sure input is valid URL-encoded text.";
  }
}

function copyToClipboard(targetId) {
  const el = document.getElementById(targetId);
  el.select();
  el.setSelectionRange(0, 99999);
  document.execCommand("copy");

  const copied = document.getElementById("copied");
  copied.style.display = "block";
  setTimeout(() => {
    copied.style.display = "none";
  }, 1500);
}

