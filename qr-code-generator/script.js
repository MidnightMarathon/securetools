document.addEventListener('DOMContentLoaded', () => {
  const qrInput = document.getElementById('qr-input');
  const generateBtn = document.getElementById('generate-btn');
  const qrWrapper = document.getElementById('qr-wrapper');
  const qrCodeContainer = document.getElementById('qr-code');
  const downloadControls = document.getElementById('download-controls');
  const formatSelect = document.getElementById('format-select');
  const downloadLink = document.getElementById('download-link');
  const errorMsg = document.getElementById('error-msg');
  const advancedToggle = document.getElementById('advanced-toggle');
  const advControls = document.querySelector('.advanced-controls');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const copyBtn = document.getElementById('copy-btn');

  let qrCode = null;

  // Function to validate URL (basic)
  function isValidUrl(url) {
    try {
      const _ = new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Create QRCodeStyling instance
  function createQRCode(data) {
    if (qrCode) {
      qrCode.update({ data });
    } else {
      qrCode = new QRCodeStyling({
        width: 160,
        height: 160,
        data: data,
        image: "", // no logo for now
        dotsOptions: {
          color: "#000",
          type: "rounded"
        },
        backgroundOptions: {
          color: "transparent"
        },
        imageOptions: {
          crossOrigin: "anonymous",
          margin: 5
        }
      });
      qrCode.append(qrCodeContainer);
    }
  }

  // Generate button click handler
  generateBtn.addEventListener('click', () => {
    const url = qrInput.value.trim();
    if (!url) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Please enter a URL.";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }
    if (!isValidUrl(url)) {
      errorMsg.style.display = "block";
      errorMsg.textContent = "Invalid URL format.";
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      return;
    }

    errorMsg.style.display = "none";
    createQRCode(url);
    qrWrapper.style.display = "block";
    downloadControls.style.display = "flex";
    updateDownloadLink();
  });

  // Update download link based on selected format
  function updateDownloadLink() {
    const format = formatSelect.value;
    if (!qrCode) return;
    qrCode.getRawData(format).then(blob => {
      const url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = `qr-code.${format}`;
    });
  }

  formatSelect.addEventListener('change', updateDownloadLink);

  // Advanced controls toggle slide
  advancedToggle.addEventListener('change', () => {
    if (advancedToggle.checked) {
      advControls.classList.add('active');
      advControls.setAttribute('aria-hidden', 'false');
    } else {
      advControls.classList.remove('active');
      advControls.setAttribute('aria-hidden', 'true');
    }
  });

  // Dark mode toggle
  darkModeToggle.addEventListener('change', () => {
    if (darkModeToggle.checked) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  });

  // Copy QR code button
  copyBtn.addEventListener('click', async () => {
    try {
      const qrCanvas = document.querySelector('#qr-code canvas');
      if (!qrCanvas) {
        alert('Please generate a QR code first.');
        return;
      }
      qrCanvas.toBlob(async (blob) => {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('QR code copied to clipboard!');
        } catch {
          alert('Copy failed, please try downloading instead.');
        }
      });
    } catch (err) {
      alert('Copy not supported on this browser.');
    }
  });

  // Optional: live update QR on input change (remove comment to enable)
  /*
  qrInput.addEventListener('input', () => {
    if (qrInput.value.trim() !== "") {
      generateBtn.click();
    } else {
      qrWrapper.style.display = "none";
      downloadControls.style.display = "none";
      errorMsg.style.display = "none";
    }
  });
  */
});
