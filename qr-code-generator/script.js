document.addEventListener("DOMContentLoaded", () => {
  // QR Code styling options defaults
  const qrCode = new QRCodeStyling({
    width: 240,
    height: 240,
    data: "",
    dotsOptions: {
      color: "#000",
      type: "dots"
    },
    cornersSquareOptions: {
      type: "dots",
      color: "#000"
    },
    backgroundOptions: {
      color: "#fff"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.15,
      opacity: 1
    }
  });

  // DOM elements
  const qrInput = document.getElementById("qr-input");
  const generateBtn = document.getElementById("generate-btn");
  const qrWrapper = document.getElementById("qr-wrapper");
  const qrCodeContainer = document.getElementById("qr-code");
  const downloadControls = document.getElementById("download-controls");
  const formatSelect = document.getElementById("format-select");
  const downloadLink = document.getElementById("download-link");
  const errorMsg = document.getElementById("error-msg");
  const advancedToggle = document.getElementById("advanced-toggle");
  const advancedControls = document.querySelector(".advanced-controls");
  const copyBtn = document.getElementById("copy-btn");
  const darkModeToggle = document.getElementById("toggle-darkmode");
  const logoUpload = document.getElementById("logo-upload");
  const logoSizeInput = document.getElementById("qr-logo-size");
  const logoOpacityInput = document.getElementById("qr-logo-opacity");
  const dotsStyleSelect = document.getElementById("qr-dots-style");
  const cornersStyleSelect = document.getElementById("qr-corners-style");
  const dotColorInput = document.getElementById("qr-color");
  const bgColorInput = document.getElementById("qr-bg-color");
  const eyesColorInput = document.getElementById("qr-eyes-color");
  const eyeRadiusInput = document.getElementById("qr-eye-radius");

  let currentLogoDataUrl = null;

  // Append QR code to container
  qrCode.append(qrCodeContainer);

  // Helper: Validate URL (basic)
  function isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  }

  // Generate QR code with current options
  function generateQr() {
    const data = qrInput.value.trim();
    if (!data) {
      errorMsg.textContent = "Please enter a URL or text to generate QR code.";
      errorMsg.style.display = "block";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }

    if (!isValidUrl(data)) {
      errorMsg.textContent = "Please enter a valid URL.";
      errorMsg.style.display = "block";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }

    errorMsg.style.display = "none";

    qrCode.update({
      data,
      dotsOptions: {
        color: dotColorInput.value,
        type: dotsStyleSelect.value
      },
      cornersSquareOptions: {
        type: cornersStyleSelect.value,
        color: eyesColorInput.value,
        // radius not supported natively on this option, workaround below
      },
      backgroundOptions: {
        color: bgColorInput.value
      },
      image: currentLogoDataUrl,
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 5,
        imageSize: logoSizeInput.value / 100,
        opacity: logoOpacityInput.value
      }
    });

    // Handle corner eye radius (workaround)
    // QRCodeStyling doesn't support eye radius directly, so we override SVG after generation
    setTimeout(() => {
      const svgs = qrCodeContainer.querySelectorAll("svg path, svg rect");
      svgs.forEach(el => {
        if (el.style.fill === eyesColorInput.value) {
          el.style.rx = `${eyeRadiusInput.value}px`;
          el.style.ry = `${eyeRadiusInput.value}px`;
        }
      });
    }, 100);

    qrWrapper.style.display = "block";
    downloadControls.style.display = "flex";
  }

  // Event listeners
  generateBtn.addEventListener("click", generateQr);
  qrInput.addEventListener("keypress", e => {
    if (e.key === "Enter") generateQr();
  });

  formatSelect.addEventListener("change", () => {
    const format = formatSelect.value;
    qrCode.download({ extension: format });
  });

  downloadLink.addEventListener("click", e => {
    e.preventDefault();
    const format = formatSelect.value;
    qrCode.download({ extension: format });
  });

  // Advanced toggle sliding effect
  advancedToggle.addEventListener("change", () => {
    if (advancedToggle.checked) {
      advancedControls.style.maxHeight = advancedControls.scrollHeight + "px";
    } else {
      advancedControls.style.maxHeight = "0";
    }
  });

  // Logo upload
  logoUpload.addEventListener("change", () => {
    const file = logoUpload.files[0];
    if (!file) {
      currentLogoDataUrl = null;
      generateQr();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      currentLogoDataUrl = reader.result;
      generateQr();
    };
    reader.readAsDataURL(file);
  });

  // All controls that should trigger QR regenerate
  const controls = [
    dotsStyleSelect,
    cornersStyleSelect,
    dotColorInput,
    bgColorInput,
    logoSizeInput,
    logoOpacityInput,
    eyesColorInput,
    eyeRadiusInput
  ];
  controls.forEach(ctrl => {
    ctrl.addEventListener("input", generateQr);
  });

  // Copy QR code to clipboard as PNG
  copyBtn.addEventListener("click", async () => {
    try {
      const blob = await qrCode.getRawData("png");
      await navigator.clipboard.write([
        new ClipboardItem({
          "image/png": blob
        })
      ]);
      alert("QR code copied to clipboard!");
    } catch (err) {
      alert("Failed to copy QR code. Try downloading instead.");
    }
  });

  // Dark mode toggle
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
  });

  // Dark mode CSS (dynamically add to body class)
  // You can add this CSS in shared styles or add here dynamically if you want

});
