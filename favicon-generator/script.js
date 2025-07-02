const upload = document.getElementById("upload");
const preview = document.getElementById("preview");
const downloads = document.getElementById("downloads");

let image = new Image();

upload.addEventListener("change", (e) => {
  downloads.innerHTML = "";
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    image.src = reader.result;
    image.onload = () => {
      preview.innerHTML = "";
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      preview.appendChild(canvas);

      createDownloadLinks();
    };
  };
  reader.readAsDataURL(file);
});

function createDownloadLinks() {
  downloads.innerHTML = "";
  const sizes = [16, 32, 48, 180]; // 180 for apple-touch-icon

  sizes.forEach((size) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(image, 0, 0, size, size);

    const dataURL = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataURL;
    a.download =
      size === 180 ? "apple-touch-icon.png" : `favicon-${size}x${size}.png`;
    a.textContent = `Download ${a.download}`;
    a.className = "download-button";
    a.style.display = "inline-block";
    a.style.margin = "0.3em 0.6em";

    downloads.appendChild(a);
  });

  // Optional: show HTML snippet to add to <head>
  const snippet = `
<link rel="icon" type="image/png" sizes="16x16" href="favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="favicon-48x48.png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
`.trim();

  const pre = document.createElement("pre");
  pre.textContent = snippet;
  pre.style.marginTop = "1em";
  pre.style.padding = "1em";
  pre.style.background = "#eee";
  pre.style.borderRadius = "5px";
  pre.style.textAlign = "left";
  downloads.appendChild(pre);
}

