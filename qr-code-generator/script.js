// script.js

// On-screen QR code instance (300x300)
const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  data: "",
  dotsOptions: {
    color: "#000",
    type: "square",
  },
  backgroundOptions: {
    color: "#ffffff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5,
  },
});

const qrCodeContainer = document.getElementById("qr-code");
qrCode.append(qrCodeContainer);

const inputEl = document.getElementById("qr-input");
const generateBtn = document.getElementById("generate-btn");
const qrWrapper = document.getElementById("qr-wrapper");
const errorMsg = document.getElementById("error-msg");
const downloadControls = document.getElementById("download-controls");
const formatSelect = document.getElementById("format-select");
const downloadLink = document.getElementById("download-link");

function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.style.display = "block";
}

function hideError() {
  errorMsg.textContent = "";
  errorMsg.style.display = "none";
}

function isValidInput(text) {
  return text.trim().length > 0;
}

// Generate QR on button click
generateBtn.addEventListener("click", () => {
  const inputValue = inputEl.value.trim();

  if (!isValidInput(inputValue)) {
    showError("Please enter a valid URL or text.");
    qrWrapper.style.display = "none";
    downloadControls.style.display = "none";
    return;
  }

  hideError();

  // Update on-screen QR code
  qrCode.update({
    data: inputValue,
  });

  qrWrapper.style.display = "block";
  downloadControls.style.display = "block";

  // Update download link for current input & selected format
  updateDownloadLink();
});

// Update download link for the selected format & input value
function updateDownloadLink() {
  const format = formatSelect.value;
  const inputValue = inputEl.value.trim();

  // Create a temporary QR code instance at 1080x1080 for high-res download
  const qrDownload = new QRCodeStyling({
    width: 1080,
    height: 1080,
    data: inputValue,
    dotsOptions: {
      color: "#000000",
      type: "rounded",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 5,
    },
  });

  qrDownload.getRawData(format).then((blob) => {
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = `securetools-qr.${format}`;
  });
}

// Update download link if user changes format selection
formatSelect.addEventListener("change", () => {
  if (qrWrapper.style.display === "block") {
    updateDownloadLink();
  }
});

