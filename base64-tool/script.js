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

function insertLineBreaks(str, every = 76) {
  return str.replace(new RegExp(`(.{1,${every}})`, 'g'), '$1\n');
}

function handleEncode() {
  const input = document.getElementById("input").value;
  const urlSafe = document.getElementById("urlSafe").checked;
  const formatBase64 = document.getElementById("formatBase64").checked;
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

  if (formatBase64) {
    encoded = insertLineBreaks(encoded);
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

  const decoded = safeDecode(input);
  if (!decoded) {
    errorBox.textContent = "⚠️ Decoding failed. Not valid Base64 input.";
    return;
  }

  document.getElementById("decoded").value = decoded;
  document.getElementById("decodedCount").textContent = decoded.length;
}

async function copyToClipboard(targetId) {
  const el = document.getElementById(targetId);
  const copied = document.getElementById("copied");

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(el.value);
    } else {
      el.select();
      el.setSelectionRange(0, el.value.length);
      document.execCommand("copy");
    }

    copied.style.display = "block";
    setTimeout(() => {
      copied.style.display = "none";
    }, 1500);
  } catch {
    alert("⚠️ Copy to clipboard failed. Please copy manually.");
  }
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
    let result = reader.result;
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

function handleBase64Download() {
  const base64Input = document.getElementById("downloadBase64Input").value.trim();
  const filename = document.getElementById("downloadFilename").value.trim() || "download.bin";
  const errorBox = document.getElementById("downloadError");
  errorBox.textContent = "";

  if (!base64Input) {
    errorBox.textContent = "⚠️ Please paste Base64 content to download.";
    return;
  }

  const base64Data = base64Input.includes(",") ? base64Input.split(",")[1] : base64Input;

  if (!/^[A-Za-z0-9+/=_-]+$/.test(base64Data)) {
    errorBox.textContent = "⚠️ Invalid Base64 characters detected.";
    return;
  }

  try {
    const binaryString = atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const blob = new Blob([bytes], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 100);
  } catch {
    errorBox.textContent = "⚠️ Decoding failed. Check your Base64 input.";
  }
}
