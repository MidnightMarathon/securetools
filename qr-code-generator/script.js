// qr-code-generator/script.js

const qrInput = document.getElementById("qr-input");
const generateBtn = document.getElementById("generate-btn");
const qrWrapper = document.getElementById("qr-wrapper");
const qrCodeContainer = document.getElementById("qr-code");
const downloadLink = document.getElementById("download-link");
const formatSelect = document.getElementById("format-select");
const errorMsg = document.getElementById("error-msg");
const advancedToggle = document.getElementById("advanced-toggle");
const sidebarPanel = document.querySelector(".sidebar-panel");

let currentQR = null;

const qrCode = new QRCodeStyling({
  width: 1080,
  height: 1080,
  type: "canvas",
  data: "",
  image: "",
  dotsOptions: {
    color: "#000",
    type: "rounded"
  },
  cornersSquareOptions: {
    type: "extra-rounded"
  },
  cornersDotOptions: {
    type: "dot"
  },
  backgroundOptions: {
    color: "#ffffff"
  }
});

function generateQRCode() {
  let url = qrInput.value.trim();

  // Prepend https:// if missing a protocol
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  if (!url || url === "https://") {
    errorMsg.style.display = "block";
    errorMsg.textContent = "Please enter a valid URL.";
    qrWrapper.style.display = "none";
    downloadLink.style.display = "none";
    return;
  }

  errorMsg.style.display = "none";
  qrCode.update({ data: url });

  qrCodeContainer.innerHTML = "";
  qrCode.append(qrCodeContainer);
  qrWrapper.style.display = "block";
  document.getElementById("download-controls").style.display = "flex";
}

generateBtn.addEventListener("click", generateQRCode);
qrInput.addEventListener("input", generateQRCode);

formatSelect.addEventListener("change", () => {
  downloadLink.download = `qr-code.${formatSelect.value}`;
});

downloadLink.addEventListener("click", () => {
  qrCode.download({ name: "qr-code", extension: formatSelect.value });
});

// Toggle advanced mode panel
advancedToggle.addEventListener("change", () => {
  document.querySelector(".container").classList.toggle("advanced", advancedToggle.checked);
});

// Update dot style
const dotSelect = document.getElementById("dot-style");
dotSelect.addEventListener("change", () => {
  qrCode.update({ dotsOptions: { type: dotSelect.value } });
});

// Update corner style
const cornerSelect = document.getElementById("corner-style");
cornerSelect.addEventListener("change", () => {
  qrCode.update({ cornersSquareOptions: { type: cornerSelect.value } });
});

// Update eye radius
const eyeRadius = document.getElementById("eye-radius");
eyeRadius.addEventListener("input", () => {
  qrCode.update({ cornersDotOptions: { type: eyeRadius.value } });
});

// Background color
const bgColorPicker = document.getElementById("bg-color");
bgColorPicker.addEventListener("input", () => {
  qrCode.update({ backgroundOptions: { color: bgColorPicker.value } });
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
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    qrCode.update({ image: e.target.result });
  };
  reader.readAsDataURL(file);
});

// Logo size
const logoSizeSlider = document.getElementById("logo-size");
logoSizeSlider.addEventListener("input", () => {
  qrCode.update({ imageOptions: { imageSize: Number(logoSizeSlider.value) } });
});

// Logo opacity
const logoOpacitySlider = document.getElementById("logo-opacity");
logoOpacitySlider.addEventListener("input", () => {
  qrCode.update({
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 0,
      hideBackgroundDots: false,
      imageSize: Number(logoSizeSlider.value),
      opacity: Number(logoOpacitySlider.value)
    }
  });
});
