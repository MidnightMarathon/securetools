window.addEventListener("load", () => {
  const qrCode = new QRCodeStyling({
    width: 1080,
    height: 1080,
    type: "png",
    data: "",
    dotsOptions: {
      color: "#000000",
      type: "square"
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    qrOptions: {
      errorCorrectionLevel: "H"
    }
  });

  const input = document.getElementById("qr-input");
  const generateBtn = document.getElementById("generate-btn");
  const qrContainer = document.getElementById("qr-code");
  const downloadLink = document.getElementById("download-link");
  const formatSelect = document.getElementById("format-select");
  const downloadControls = document.getElementById("download-controls");
  const qrWrapper = document.getElementById("qr-wrapper");
  const errorMsg = document.getElementById("error-msg");

  qrCode.append(qrContainer);

  function isValidUrl(string) {
    try {
      const url = new URL(string);
      const hostname = url.hostname;

      // Basic check: must include a dot and not start/end with one
      const validHostname = hostname.includes(".") && !hostname.startsWith(".") && !hostname.endsWith(".");
      const validProtocol = url.protocol === "http:" || url.protocol === "https:";
      return validProtocol && validHostname;
    } catch {
      return false;
    }
  }

  function prependHttpsIfMissing(text) {
    if (!/^https?:\/\//i.test(text)) {
      return "https://" + text;
    }
    return text;
  }

  function extractFilename(url) {
    try {
      const parsedUrl = new URL(url);
      let hostname = parsedUrl.hostname;
      if (hostname.startsWith("www.")) {
        hostname = hostname.slice(4);
      }
      const parts = hostname.split(".");
      if (parts.length > 1) parts.pop();
      return parts.join(".") || "qr-code";
    } catch {
      return "qr-code";
    }
  }

  generateBtn.addEventListener("click", () => {
    let text = input.value.trim();
    text = prependHttpsIfMissing(text);

    errorMsg.style.display = "none";
    downloadControls.style.display = "none";
    qrWrapper.style.display = "none";

    if (!isValidUrl(text)) {
      errorMsg.textContent = "Please enter a valid URL (e.g. https://example.com)";
      errorMsg.style.display = "block";
      return;
    }

    qrCode.update({ data: text });
    qrWrapper.style.display = "block";
    downloadControls.style.display = "flex";

    const filename = extractFilename(text);
    downloadLink.setAttribute("download", filename + "." + formatSelect.value);
  });

  formatSelect.addEventListener("change", () => {
    const text = input.value.trim();
    const sanitized = prependHttpsIfMissing(text);
    if (!isValidUrl(sanitized)) return;

    const filename = extractFilename(sanitized);
    downloadLink.setAttribute("download", filename + "." + formatSelect.value);
  });

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
});
