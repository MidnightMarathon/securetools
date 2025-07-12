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

  const qrCode = new QRCodeStyling({
    width: 440,
    height: 440,
    type: "canvas",
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
    },
    backgroundOptions: {
      color: "#ffffff", // default white
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

  formatSelect.addEventListener("change", () => {
    downloadLink.download = `qr-code.${formatSelect.value}`;
  });

  downloadLink.addEventListener("click", async (e) => {
    e.preventDefault();
    const format = formatSelect.value;

    if (format === "pdf") {
      const canvas = await qrCode.getRawData("png");
      const dataUrl = canvas.toDataURL("image/png");

      const pdf = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width + 40, canvas.height + 40],
      });

      pdf.addImage(dataUrl, "PNG", 20, 20, canvas.width, canvas.height);
      pdf.save("qr-code.pdf");
    } else {
      qrCode.download({ name: "qr-code", extension: format });
    }
  });

  advancedToggle.addEventListener("change", () => {
    if (advancedToggle.checked) {
      container.classList.add("advanced");
    } else {
      container.classList.remove("advanced");
    }
  });

  const dotSelect = document.getElementById("dot-style");
  dotSelect.addEventListener("change", () => {
    qrCode.update({ dotsOptions: { type: dotSelect.value } });
  });

  const cornerSelect = document.getElementById("corner-style");
  cornerSelect.addEventListener("change", () => {
    qrCode.update({ cornersSquareOptions: { type: cornerSelect.value } });
  });

  const eyeRadius = document.getElementById("eye-radius");
  eyeRadius.addEventListener("input", () => {
    const radius = Number(eyeRadius.value);
    qrCode.update({ cornersDotOptions: { radius } });
  });

  const bgColorPicker = document.getElementById("bg-color");
  bgColorPicker.addEventListener("input", () => {
    qrCode.update({ backgroundOptions: { color: bgColorPicker.value } });
  });

  const eyeColorPicker = document.getElementById("eye-color");
  eyeColorPicker.addEventListener("input", () => {
    qrCode.update({ cornersSquareOptions: { color: eyeColorPicker.value } });
  });

  const transparentBgToggle = document.getElementById("transparent-bg");
  transparentBgToggle.addEventListener("change", () => {
    if (transparentBgToggle.checked) {
      qrCode.update({ backgroundOptions: { color: "rgba(0,0,0,0)" } });
    } else {
      qrCode.update({ backgroundOptions: { color: bgColorPicker.value } });
    }
  });

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

  const logoSizeSlider = document.getElementById("logo-size");
  logoSizeSlider.addEventListener("input", () => {
    const size = Number(logoSizeSlider.value) / 100;
    qrCode.update({ imageOptions: { imageSize: size } });
  });

  const logoOpacitySlider = document.getElementById("logo-opacity");
  logoOpacitySlider.addEventListener("input", () => {
    const opacity = Number(logoOpacitySlider.value);
    qrCode.update({ imageOptions: { opacity: opacity / 100 } });
  });
});
