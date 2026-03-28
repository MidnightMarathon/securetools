# SecureTools

I got tired of watching people Google "free QR code generator" and land on sites plastered with ads, paywalls, and sign-up modals — just to encode a URL. These are simple tools. They shouldn't require an account, a cookie banner, or a privacy policy written to obscure rather than inform.

I care about privacy seriously - your data is yours. So I built tools that make it structurally impossible to collect anything: everything runs in the browser, nothing is sent to a server, and there's no backend to leak.

Live at [securegenerators.com](https://www.securegenerators.com).

---

## Tools

| Tool | What it does |
|---|---|
| [QR Code Generator](/qr-code-generator/) | Generate QR codes client-side, no watermark |
| [Password Generator](/password-generator/) | Cryptographically random passwords, configurable |
| [UUID Generator](/uuid-generator/) | RFC-compliant UUIDs, in the browser |
| [Random Number Generator](/rng-generator/) | Pick a random number between any two values |
| [Favicon Generator](/favicon-generator/) | Create favicons without uploading anything |
| [Base64 Encoder / Decoder](/base64-tool/) | Encode and decode Base64 text locally |
| [URL Encoder / Decoder](/url-encoder-decoder/) | Percent-encode and decode URLs |
| [US States Map Quiz](/geogames/) | Click-based US geography quiz |
| [Gaussian Elimination](/gaussian-elimination/) | Interactive linear algebra game with drag-and-drop row operations |

More tools are in the works.

---

## How it's built

Vanilla HTML, CSS, and JavaScript. No build step, no framework, no `node_modules`.

This is a deliberate choice. A page that's just HTML and CSS loads in milliseconds on a ten-year-old phone on a slow connection. The moment you pull in a framework, you're making someone wait so you can have a nicer developer experience — and that trade-off isn't worth it here. These tools should work for everyone, not just people with fast hardware and uncapped data plans.

**It also means the code is auditable. You can open a file, read it, and verify it does what it says.
**---

## Running locally

```bash
git clone https://github.com/MidnightMarathon/securetools.git
cd securetools
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## Structure

```
/
├── index.html
├── about.html
├── assets/                  # Shared CSS and JS
├── qr-code-generator/
├── password-generator/
├── uuid-generator/
├── rng-generator/
├── favicon-generator/
├── base64-tool/
├── url-encoder-decoder/
├── geogames/
└── gaussian-elimination/
```

---

## Contributing

If something's broken or you have a tool that fits here, open an issue or a PR. The bar is low.

---

## License

MIT.

---

## Tools

| Tool | What it does |
|---|---|
| [QR Code Generator](/qr-code-generator/) | Generate QR codes client-side, no watermark |
| [Password Generator](/password-generator/) | Cryptographically random passwords, configurable |
| [UUID Generator](/uuid-generator/) | RFC-compliant UUIDs, generated in the browser |
| [Random Number Generator](/rng-generator/) | Pick a number between any two values |
| [Favicon Generator](/favicon-generator/) | Create favicons without uploading anything |
| [Base64 Encoder / Decoder](/base64-tool/) | Encode and decode Base64 text locally |
| [URL Encoder / Decoder](/url-encoder-decoder/) | Percent-encode and decode URLs |
| [US States Map Quiz](/geogames/) | Click-based geography quiz |
| [Gaussian Elimination](/gaussian-elimination/) | Interactive linear algebra game |

---

## Philosophy

Everything runs in the browser. There are no accounts, no analytics, no cookies, no servers receiving your input.

All of these tools don't need a backend, so there isn't one. Client-side is simpler, faster, and easier to trust.

The codebase is vanilla HTML, CSS, and JavaScript. No build step, no framework, no `node_modules`. You can open the files directly, read them, and understand them without installing anything.

