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


  // QR CodeStyling instance
  const qrCode = new QRCodeStyling({
    width: 440,
    height: 440,
    type: "canvas",
    data: "",
    dotsOptions: {
      color: "#000",
      type: "rounded"
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000"
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000"
    },
    backgroundOptions: {
      color: "#ffffff"
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
      imageSize: 0.15,
      opacity: 1
    },
    image: ""
  });

  // Append QR to container
  qrCode.append(qrCodeContainer);

  // Basic URL validation helper
  function isValidUrl(string) {
    try {
      new URL(string);

      return true;
    } catch {
      return false;
    }
  }


  // Automatically prepend https:// if missing
  function normalizeUrl(url) {
    if (!url.match(/^https?:\/\//i)) {
      return "https://" + url;
    }
    return url;
  }

  // Generate QR code function
  function generateQr() {
    let data = qrInput.value.trim();
    if (!data) {

      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a URL or text to generate QR code.";
      qrWrapper.style.display = "none";
      downloadLink.style.display = "none";
      return;
    }


    data = normalizeUrl(data);

    if (!isValidUrl(data)) {

      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a valid URL.";
      qrWrapper.style.display = "none";
      downloadLink.style.display = "none";
      return;
    }

    errorMsg.style.display = "none";


    qrCode.update({ data });


    qrWrapper.style.display = "block";
    downloadLink.style.display = "inline-block";
  }

  generateBtn.addEventListener("click", generateQr);
  qrInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateQr();
  });

  // Download format selection
  formatSelect.addEventListener("change", () => {
    downloadLink.download = `qr-code.${formatSelect.value}`;
  });

  downloadLink.addEventListener("click", (e) => {
    e.preventDefault();
    qrCode.download({ name: "qr-code", extension: formatSelect.value });
  });

  // Advanced mode toggle class on container
  advancedToggle.addEventListener("change", () => {
    if (advancedToggle.checked) {
      container.classList.add("advanced");
    } else {
      container.classList.remove("advanced");
    }
  });

  // Dot style control
  const dotSelect = document.getElementById("dot-style");
  dotSelect.addEventListener("change", () => {
    qrCode.update({ dotsOptions: { type: dotSelect.value } });
  });

  // Corner style control
  const cornerSelect = document.getElementById("corner-style");
  cornerSelect.addEventListener("change", () => {
    qrCode.update({ cornersSquareOptions: { type: cornerSelect.value } });
  });

  // Eye radius control
  const eyeRadius = document.getElementById("eye-radius");
  eyeRadius.addEventListener("input", () => {
    const radius = Number(eyeRadius.value);
    qrCode.update({ cornersDotOptions: { radius } });
  });

  // Background color control
  const bgColorPicker = document.getElementById("bg-color");
  bgColorPicker.addEventListener("input", () => {
    qrCode.update({ backgroundOptions: { color: bgColorPicker.value } });
  });

  // Eye color control
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

  // Logo size slider
  const logoSizeSlider = document.getElementById("logo-size");
  logoSizeSlider.addEventListener("input", () => {
    const size = Number(logoSizeSlider.value) / 100;
    qrCode.update({ imageOptions: { imageSize: size } });
  });

  // Logo opacity slider
  const logoOpacitySlider = document.getElementById("logo-opacity");
  logoOpacitySlider.addEventListener("input", () => {
    const opacity = Number(logoOpacitySlider.value);
    qrCode.update({ imageOptions: { opacity: opacity } });
  });

});
