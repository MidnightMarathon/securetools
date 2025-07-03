document.addEventListener("DOMContentLoaded", () => {
  const qrInput = document.getElementById("qr-input");
  const generateBtn = document.getElementById("generate-btn");
  const qrWrapper = document.getElementById("qr-wrapper");
  const qrCodeContainer = document.getElementById("qr-code");
  const downloadLink = document.getElementById("download-link");
  const formatSelect = document.getElementById("format-select");
  const errorMsg = document.getElementById("error-msg");
  const advancedToggle = document.getElementById("advanced-toggle");
  const container = document.querySelector(".container");
  const sidebarPanel = document.querySelector(".sidebar-panel");
  const logoPanel = document.querySelector(".logo-panel");

  // QR code instance with defaults
  const qrCode = new QRCodeStyling({
    width: 320,
    height: 320,
    data: "",
    dotsOptions: { color: "#000", type: "rounded" },
    cornersSquareOptions: { type: "dot", color: "#000" },
    backgroundOptions: { color: "#fff" },
    imageOptions: { crossOrigin: "anonymous", margin: 5, imageSize: 0.15, opacity: 1 },
  });

  qrCode.append(qrCodeContainer);

  function isValidUrl(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }

  function generateQRCode() {
    const url = qrInput.value.trim();
    if (!url) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a URL or text to generate QR code.";
      qrWrapper.style.display = "none";
      downloadLink.style.display = "none";
      return;
    }
    if (!isValidUrl(url)) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a valid URL.";
      qrWrapper.style.display = "none";
      downloadLink.style.display = "none";
      return;
    }

    errorMsg.style.display = "none";

    qrCode.update({ data: url });

    qrWrapper.style.display = "block";
    downloadLink.style.display = "inline-block";
  }

  generateBtn.addEventListener("click", generateQRCode);
  qrInput.addEventListener("keypress", e => {
    if (e.key === "Enter") generateQRCode();
  });

  formatSelect.addEventListener("change", () => {
    downloadLink.download = `qr-code.${formatSelect.value}`;
  });

  downloadLink.addEventListener("click", e => {
    e.preventDefault();
    qrCode.download({ extension: formatSelect.value });
  });

  // Advanced toggle toggles 'advanced' class on container
  advancedToggle.addEventListener("change", () => {
    if (advancedToggle.checked) {
      container.classList.add("advanced");
    } else {
      container.classList.remove("advanced");
    }
  });

  // Advanced controls
  const dotStyleSelect = document.getElementById("dot-style");
  const cornerStyleSelect = document.getElementById("corner-style");
  const eyeColorPicker = document.getElementById("eye-color");
  const eyeRadiusRange = document.getElementById("eye-radius");
  const bgColorPicker = document.getElementById("bg-color");
  const logoUpload = document.getElementById("logo-upload");
  const logoSizeSlider = document.getElementById("logo-size");
  const logoOpacitySlider = document.getElementById("logo-opacity");

  function updateQR() {
    qrCode.update({
      dotsOptions: { type: dotStyleSelect.value },
      cornersSquareOptions: { type: cornerStyleSelect.value, color: eyeColorPicker.value },
      cornersDotOptions: { type: cornerStyleSelect.value },
      backgroundOptions: { color: bgColorPicker.value },
      imageOptions: {
        imageSize: logoSizeSlider.value / 100,
        opacity: Number(logoOpacitySlider.value),
        crossOrigin: "anonymous",
        margin: 5,
      },
    });
  }

  dotStyleSelect.addEventListener("change", updateQR);
  cornerStyleSelect.addEventListener("change", updateQR);
  eyeColorPicker.addEventListener("input", updateQR);
  eyeRadiusRange.addEventListener("input", updateQR);
  bgColorPicker.addEventListener("input", updateQR);
  logoSizeSlider.addEventListener("input", updateQR);
  logoOpacitySlider.addEventListener("input", updateQR);

  logoUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      qrCode.update({ image: "" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      qrCode.update({ image: ev.target.result });
    };
    reader.readAsDataURL(file);
  });
});
