# SecureTools

![CI](https://github.com/MidnightMarathon/securetools/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![No Dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

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

**It also means the code is auditable. You can open a file, read it, and verify it does what it does.**

---

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

Contributions are welcome from humans and AI agents alike. The stack is simple, the rules are clear, and first-time contributors can ship a tool in a single PR.

- **Start here:** [CONTRIBUTING.md](CONTRIBUTING.md) — philosophy, code style, commit conventions
- **AI agents:** [AGENTS.md](AGENTS.md) — machine-optimized checklists, file maps, CI details, tool ideas
- **Quick tasks:** Look for issues labeled [`good first issue`](https://github.com/MidnightMarathon/securetools/labels/good%20first%20issue)
- **Tool ideas:** [AGENTS.md — Tool Ideas](AGENTS.md#tool-ideas-open-for-contribution)

If you're not sure whether an idea fits, [open an issue](https://github.com/MidnightMarathon/securetools/issues/new/choose) before writing any code.

---

## License

MIT — see [LICENSE](LICENSE).

