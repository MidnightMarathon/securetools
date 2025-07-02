const MAX_INPUT_LENGTH = 16000;

function safeEncode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (err) {
    return null;
  }
}

function safeDecode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (err) {
    return null;
  }
}

function handleEncode() {
  const input = document.getElementById("input").value;
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";

  if (input.length > MAX_INPUT_LENGTH) {
    errorBox.textContent = `⚠️ Input too long. Limit: ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  const encoded = safeEncode(input);
  document.getElementById("encoded").value = encoded ?? "⚠️ Encoding failed. Check your input.";
}

function handleDecode() {
  const input = document.getElementById("input").value;
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";

  if (input.length > MAX_INPUT_LENGTH) {
    errorBox.textContent = `⚠️ Input too long. Limit: ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  const decoded = safeDecode(input);
  document.getElementById("decoded").value = decoded ?? "⚠️ Decoding failed. Not valid Base64 input.";
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

