window.addEventListener("load", () => {
  const qrCode = new QRCodeStyling({
    width: 280,
    height: 280,
    type: "png",
    data: "",
    dotsOptions: {
      color: "#000000",
      type: "rounded", // nicer style than square
    },
    backgroundOptions: {
      color: "#ffffff00", // transparent background for glass morphism look
    },
    qrOptions: {
      errorCorrectionLevel: "H",
    },
  });

  // Elements
  const input = document.getElementById("qr-input");
  const generateBtn = document.getElementById("generate-btn");
  const qrWrapper = document.getElementById("qr-wrapper");
  const qrContainer = document.getElementById("qr-code");
  const downloadLink = document.getElementById("download-link");
  const formatSelect = document.getElementById("format-select");
  const downloadControls = document.getElementById("download-controls");
  const errorMsg = document.getElementById("error-msg");
  const advancedToggle = document.getElementById("advanced-toggle");
  const advancedControls = document.querySelector(".advanced-controls");

  // Append QR to container
  qrCode.append(qrContainer);

  // URL validation helper
  function isValidUrl(str) {
    try {
      const url = new URL(str);
      const validProtocol = url.protocol === "http:" || url.protocol === "https:";
      return validProtocol && url.hostname.includes(".");
    } catch {
      return false;
    }
  }

  // Add https if missing
  function prependHttpsIfMissing(text) {
    if (!/^https?:\/\//i.test(text)) {
      return "https://" + text;
    }
    return text;
  }

  // Extract filename from URL hostname
  function extractFilename(url) {
    try {
      const parsedUrl = new URL(url);
      let hostname = parsedUrl.hostname;
      if (hostname.startsWith("www.")) hostname = hostname.slice(4);
      const parts = hostname.split(".");
      if (parts.length > 1) parts.pop();
      return parts.join(".") || "qr-code";
    } catch {
      return "qr-code";
    }
  }

  // Generate or update QR code
  function generateQrCode() {
    let text = input.value.trim();
    if (!text) {
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      errorMsg.style.display = "none";
      return;
    }

    text = prependHttpsIfMissing(text);

    if (!isValidUrl(text)) {
      errorMsg.textContent = "Please enter a valid URL (e.g. https://example.com)";
      errorMsg.style.display = "block";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }

    errorMsg.style.display = "none";
    qrCode.update({ data: text });
    qrWrapper.style.display = "block";
    downloadControls.style.display = "flex";

    const filename = extractFilename(text);
    downloadLink.setAttribute("download", `${filename}.${formatSelect.value}`);
  }

  // Live generate on input with debounce
  let debounceTimeout;
  input.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(generateQrCode, 300);
  });

  // Also generate on button click (in case someone prefers that)
  generateBtn.addEventListener("click", () => {
    generateQrCode();
  });

  // Update download filename when format changes
  formatSelect.addEventListener("change", () => {
    const text = input.value.trim();
    if (!text) return;

    const sanitized = prependHttpsIfMissing(text);
    if (!isValidUrl(sanitized)) return;

    const filename = extractFilename(sanitized);
    downloadLink.setAttribute("download", `${filename}.${formatSelect.value}`);
  });

  // Download QR image
  downloadLink.addEventListener("click", (e) => {
    const text = input.value.trim();
    const sanitized = prependHttpsIfMissing(text);

    if (!isValidUrl(sanitized)) {
      e.preventDefault();
      errorMsg.textContent = "Please enter a valid URL before downloading.";
      errorMsg.style.display = "block";
      return;
    }

    const format = formatSelect.value;
    qrCode.download({ extension: format });
  });

  // Toggle advanced controls
  advancedToggle?.addEventListener("change", (e) => {
    if (e.target.checked) {
      advancedControls.classList.add("open");
    } else {
      advancedControls.classList.remove("open");
    }
  });

  // On load: hide QR and download controls
  qrWrapper.style.display = "none";
  downloadControls.style.display = "none";
  errorMsg.style.display = "none";
});
