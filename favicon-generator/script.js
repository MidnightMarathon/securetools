const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const downloads = document.getElementById("downloads");
const clearBtn = document.getElementById("clear");
const fileInfo = document.getElementById("file-info");

let image = new Image();
let uploadedFileName = "";

upload.addEventListener("change", handleUpload);
clearBtn.addEventListener("click", clearAll);

function handleUpload(e) {
  downloads.innerHTML = "";
  preview.innerHTML = "";
  fileInfo.textContent = "";
  clearBtn.disabled = true;

  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Please upload a valid image file.");
    upload.value = "";
    return;
  }

  uploadedFileName = file.name;
  fileInfo.textContent = `Selected file: ${uploadedFileName}`;

  const reader = new FileReader();
  reader.onload = () => {
    image = new Image();
    image.src = reader.result;

    image.onload = () => {
      clearBtn.disabled = false;
      showPreview(image);
      createDownloadLinks(image);
    };

    image.onerror = () => {
      alert("Failed to load image. Try another file.");
      upload.value = "";
      fileInfo.textContent = "";
    };
  };
  reader.readAsDataURL(file);
}

function clearAll() {
  upload.value = "";
  preview.innerHTML = "";
  downloads.innerHTML = "";
  fileInfo.textContent = "";
  clearBtn.disabled = true;
  image = new Image();
}

function showPreview(img) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  drawImageCentered(ctx, img, canvas.width, canvas.height);
  preview.appendChild(canvas);
}

function drawImageCentered(ctx, img, w, h) {
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / img.width, h / img.height);
  const x = (w - img.width * scale) / 2;
  const y = (h - img.height * scale) / 2;
  ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

function createDownloadLinks(img) {
  downloads.innerHTML = "";
  const sizes = [16, 32, 48, 180];

  sizes.forEach((size) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    drawImageCentered(ctx, img, size, size);

    const dataURL = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = dataURL;
    a.download = size === 180
      ? "apple-touch-icon.png"
      : `favicon-${size}x${size}.png`;
    a.textContent = `⬇️ ${a.download}`;
    a.className = "download-button";

    downloads.appendChild(a);
  });

  // Generate .ico file from canvases 16,32,48
  const canvases = sizes.slice(0, 3).map((size) => {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d");
    drawImageCentered(ctx, img, size, size);
    return c;
  });

  try {
    const icoBlob = canvasToIco(canvases); // returns a Blob
    const url = URL.createObjectURL(icoBlob);

    const icoLink = document.createElement("a");
    icoLink.href = url;
    icoLink.download = "favicon.ico";
    icoLink.textContent = "⬇️ favicon.ico";
    icoLink.className = "download-button";

    downloads.appendChild(icoLink);

    icoLink.addEventListener("click", () => {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  } catch (err) {
    console.warn("Failed to generate favicon.ico:", err);
  }

  // Removed snippet display as requested
}
