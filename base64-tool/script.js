const MAX_INPUT_LENGTH = 16000;

function safeEncode(str) {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch {
    return null;
  }
}

function safeDecode(str) {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch {
    return null;
  }
}

function handleEncode() {
  const input = document.getElementById("input").value;
  const urlSafe = document.getElementById("urlSafe").checked;
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";

  if (input.length > MAX_INPUT_LENGTH) {
    errorBox.textContent = `⚠️ Input too long. Limit: ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  let encoded = safeEncode(input);
  if (!encoded) {
    errorBox.textContent = "⚠️ Encoding failed. Check your input.";
    return;
  }

  if (urlSafe) {
    encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }

  document.getElementById("encoded").value = encoded;
  document.getElementById("encodedCount").textContent = encoded.length;
}

function handleDecode() {
  let input = document.getElementById("input").value;
  const stripWS = document.getElementById("stripWhitespace").checked;
  const errorBox = document.getElementById("error");
  errorBox.textContent = "";

  if (stripWS) {
    input = input.replace(/\s+/g, "");
  }

  if (input.length > MAX_INPUT_LENGTH) {
    errorBox.textContent = `⚠️ Input too long. Limit: ${MAX_INPUT_LENGTH} characters.`;
    return;
  }

  let decoded = safeDecode(input);
  if (!decoded) {
    errorBox.textContent = "⚠️ Decoding failed. Not valid Base64 input.";
    return;
  }

  document.getElementById("decoded").value = decoded;
  document.getElementById("decodedCount").textContent = decoded.length;
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

function updateCounts() {
  const input = document.getElementById("input").value;
  document.getElementById("inputCount").textContent = input.length;
}

function handleFileUpload() {
  const fileInput = document.getElementById("fileInput");
  const output = document.getElementById("fileOutput");
  const stripPrefix = document.getElementById("stripDataPrefix").checked;
  const count = document.getElementById("fileOutputCount");

  if (!fileInput.files.length) return;

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    let result = reader.result; // data:[mime];base64,[base64 string]

    if (stripPrefix) {
      const commaIndex = result.indexOf(",");
      result = result.slice(commaIndex + 1);
    }

    output.value = result;
    count.textContent = result.length;
  };

  reader.onerror = () => {
    output.value = "⚠️ Failed to read file.";
    count.textContent = 0;
  };

  reader.readAsDataURL(file);
}

