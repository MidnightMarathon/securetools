document.addEventListener("DOMContentLoaded", () => {
  const qrInput = document.getElementById("qr-input");
  const generateBtn = document.getElementById("generate-btn");
  const qrWrapper = document.getElementById("qr-wrapper");
  const qrCodeContainer = document.getElementById("qr-code");
  const downloadControls = document.getElementById("download-controls");
  const downloadLink = document.getElementById("download-link");
  const formatSelect = document.getElementById("format-select");
  const errorMsg = document.getElementById("error-msg");
  const advancedToggle = document.getElementById("advanced-toggle");
  const container = document.querySelector(".container");
  const transparentBgToggle = document.getElementById("transparent-bg");

  const qrCode = new QRCodeStyling({
    width: 440,
    height: 440,
    type: "canvas", // default canvas, can be changed when downloading SVG
    data: "",
    dotsOptions: {
      color: "#000",
      type: "rounded",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000",
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000",
      radius: 10,
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.15,
      opacity: 1,
    },
    image: "",
  });

  qrCode.append(qrCodeContainer);

  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  function normalizeUrl(url) {
    if (!url.match(/^https?:\/\//i)) {
      return "https://" + url;
    }
    return url;
  }

  function generateQr() {
    let data = qrInput.value.trim();
    if (!data) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a URL or text to generate QR code.";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }

    data = normalizeUrl(data);

    if (!isValidUrl(data)) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a valid URL.";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }

    errorMsg.style.display = "none";

    qrCode.update({ data });

    qrWrapper.style.display = "block";
    downloadControls.style.display = "flex";
  }

  generateBtn.addEventListener("click", generateQr);
  qrInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateQr();
  });

  formatSelect.addEventListener("change", () => {
    downloadLink.download = `qr-code.${formatSelect.value}`;
  });

  downloadLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const format = formatSelect.value;

if (format === "pdf") {
  const canvas = qrCode._canvas;
  
  if (!canvas) {
    console.error("No canvas found for QR Code.");
    return;
  }

  const dataUrl = canvas.toDataURL("image/png");

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "px",
    format: [canvas.width + 40, canvas.height + 40],
  });

  pdf.addImage(dataUrl, "PNG", 20, 20, canvas.width, canvas.height);
  pdf.save("qr-code.pdf");
} else {
  qrCode.download({ name: "qr-code", extension: format });
}


  advancedToggle.addEventListener("change", () => {
    if (advancedToggle.checked) {
      container.classList.add("advanced");
    } else {
      container.classList.remove("advanced");
    }
  });

  // Dot style
  const dotSelect = document.getElementById("dot-style");
  dotSelect.addEventListener("change", () => {
    qrCode.update({ dotsOptions: { type: dotSelect.value } });
  });

  // Corner style
  const cornerSelect = document.getElementById("corner-style");
  cornerSelect.addEventListener("change", () => {
    qrCode.update({ cornersSquareOptions: { type: cornerSelect.value } });
  });

  // Eye radius
  const eyeRadius = document.getElementById("eye-radius");
  eyeRadius.addEventListener("input", () => {
    const radius = Number(eyeRadius.value);
    qrCode.update({ cornersDotOptions: { radius } });
  });

  // Background color
  const bgColorPicker = document.getElementById("bg-color");
  bgColorPicker.addEventListener("input", () => {
    if (!transparentBgToggle.checked) {
      qrCode.update({ backgroundOptions: { color: bgColorPicker.value } });
    }
  });

  // Transparent background toggle
  transparentBgToggle.addEventListener("change", () => {
    if (transparentBgToggle.checked) {
      qrCode.update({ backgroundOptions: { color: "rgba(0,0,0,0)" } });
    } else {
      qrCode.update({ backgroundOptions: { color: bgColorPicker.value } });
    }
  });

  // Eye color
  const eyeColorPicker = document.getElementById("eye-color");
  eyeColorPicker.addEventListener("input", () => {
    qrCode.update({ cornersSquareOptions: { color: eyeColorPicker.value } });
  });

  // Logo upload
  const logoInput = document.getElementById("logo-upload");
  logoInput.addEventListener("change", (event) => {
    const file = event.target.files[0];

    if (!file) {
      qrCode.update({ image: "" });
      return;
    }
    const reader = new FileReader();

    reader.onload = (e) => {
      qrCode.update({ image: e.target.result });
    };
    reader.readAsDataURL(file);
  });

  // Logo size slider (0-50% mapped to 0.0-0.5)
  const logoSizeSlider = document.getElementById("logo-size");
  logoSizeSlider.addEventListener("input", () => {
    const size = Number(logoSizeSlider.value) / 100 * 3; // scaled to ~0-1.5 range to allow bigger logos
    qrCode.update({ imageOptions: { imageSize: size } });
  });

  // Logo opacity slider (0-100 scaled to 0.0-1.0)
  const logoOpacitySlider = document.getElementById("logo-opacity");
  logoOpacitySlider.addEventListener("input", () => {
    const opacity = Number(logoOpacitySlider.value) / 100;
    qrCode.update({ imageOptions: { opacity } });
  });
});

