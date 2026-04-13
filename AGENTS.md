# Agent Instructions for SecureTools

> This file is for AI coding agents (OpenClaw, Copilot, Codex, Devin, SWE-Agent, etc.).
> It describes the project rules, conventions, and workflows you must follow when contributing.

---

## Project Summary

SecureTools is a collection of client-side browser tools at [securegenerators.com](https://www.securegenerators.com). Every tool runs entirely in the browser with zero backend, zero tracking, and zero data collection. The codebase is vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no `node_modules`.

Repository: `MidnightMarathon/securetools`

---

## Hard Rules (will fail CI or be rejected if violated)

1. **No frameworks.** No React, Vue, Svelte, Angular, jQuery, Tailwind, or any CSS/JS framework.
2. **No build step.** No Webpack, Vite, Rollup, esbuild, or bundlers. No `package.json` in the repo.
3. **No server-side code.** No backend, no API calls with user input, no form submissions to a server.
4. **No tracking.** No analytics, no cookies, no fingerprinting, no telemetry of any kind.
5. **No inline JavaScript in HTML.** All JS goes in a separate `.js` file loaded with `defer`. No `onclick`, `oninput`, or `<script>` blocks in HTML.
6. **CDN scripts require SRI.** Every `<script src="https://...">` must have `integrity="sha384-..."` and `crossorigin="anonymous"`. Generate hashes at [srihash.org](https://www.srihash.org/).
7. **Shared CSS only.** All tools link `/assets/styles.css`. Tool-specific overrides go in a small `<style>` block or a local `.css` file — never duplicate the shared styles.

---

## File Structure

```
/
├── index.html              ← Home page (tool grid)
├── about.html              ← About page
├── assets/
│   └── styles.css          ← Shared stylesheet (all tools use this)
├── tool-template/          ← Starting point for new tools (copy this)
│   ├── index.html
│   ├── script.js
│   └── README.md
├── <tool-name>/            ← Each tool is a folder at the repo root
│   ├── index.html
│   ├── script.js
│   └── README.md           ← Optional but encouraged
├── .github/
│   ├── CODEOWNERS
│   ├── workflows/ci.yml    ← CI: HTML validation, SRI check, link check
│   ├── ISSUE_TEMPLATE/     ← Bug report and new tool proposal templates
│   └── PULL_REQUEST_TEMPLATE.md
├── CONTRIBUTING.md          ← Full contributor guide
├── AGENTS.md                ← This file
└── README.md
```

---

## How to Add a New Tool

Follow these steps exactly:

1. **Copy** `tool-template/` to a new folder at the repo root.
2. **Name** the folder with lowercase words separated by hyphens (e.g., `hash-generator/`).
3. **Edit** `index.html`:
   - Replace all `Your Tool Name` and `your-tool-name` placeholders.
   - Update `<title>`, `<meta name="description">`, OG/Twitter meta tags.
   - Update `<link rel="canonical">` to `https://www.securegenerators.com/<tool-name>/`.
   - Update the `<script src>` path to `/<tool-name>/script.js`.
   - Build your UI inside `<main>` using semantic HTML (`<label>`, `<button>`, `<input>`, `<output>`).
4. **Edit** `script.js`:
   - Keep `'use strict';` on line 1.
   - Wire all events with `addEventListener` — never use inline handlers.
   - For cryptographic randomness, use `crypto.getRandomValues()`, never `Math.random()`.
5. **Add the tool to `index.html`** (the home page): add a tile inside the tool grid that links to `/<tool-name>/`.
6. **Add the tool to `README.md`**: add a row to the Tools table.
7. **Open a PR** against `main` with the subject `feat(<tool-name>): add <tool-name>`.

### New tool checklist

- [ ] Folder is at repo root, named with lowercase hyphens
- [ ] `index.html` links `/assets/styles.css` (absolute path)
- [ ] `index.html` has `<meta charset>`, `<meta viewport>`, `<title>`, `<meta description>`
- [ ] `<script src="/<tool-name>/script.js" defer>` — absolute path, defer attribute
- [ ] Nav has exactly two links: `Home` (`/`) and `About` (`/about.html`)
- [ ] All JS logic is in `script.js`, not inline in HTML
- [ ] `script.js` starts with `'use strict';`
- [ ] No `Math.random()` — use `crypto.getRandomValues()` for any randomness
- [ ] No external scripts without SRI hashes
- [ ] Tool is added to `index.html` tile grid
- [ ] Tool is added to `README.md` tools table
- [ ] Tested in at least one browser

---

## How to Fix a Bug

1. Identify the affected tool folder (e.g., `password-generator/`).
2. Read the tool's `index.html` and `script.js` to understand current behavior.
3. Make the minimal fix — do not refactor unrelated code.
4. Test the fix by opening the HTML file in a browser.
5. Open a PR with the subject `fix(<tool-name>): description of fix`.

---

## Code Conventions

### HTML
- 2-space indentation.
- `lang="en"` on `<html>`.
- Semantic elements: `<main>`, `<nav>`, `<button>`, `<label>`, `<output>`.
- Every `<input>` has an associated `<label>` via `for`/`id`.
- `aria-label` on buttons without visible text.
- No `<div>` soup — only use `<div>` when no semantic element fits.

### CSS
- Shared base styles are in `/assets/styles.css` — **do not duplicate them**.
- Brand blue: `#2d9cdb`. Hover: `#1b6ea8`.
- Tool-specific styles: put in a `<style>` block in the tool's `index.html` or a separate `.css` file.
- All tools inherit the shared button styles, gradient background, nav, and card layout from the shared stylesheet.

### JavaScript
- `'use strict';` on line 1 of every `.js` file.
- `const` and `let` only — no `var`.
- All DOM wiring via `addEventListener` — no `onclick`, `oninput`, or other inline handlers.
- Functions should be small and named.
- Clipboard: use `navigator.clipboard.writeText()` with a try/catch fallback.
- Randomness: `crypto.getRandomValues()` only.

### Commit messages
Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
```
feat(<scope>): add new feature
fix(<scope>): fix the thing
docs: update documentation
style(<scope>): visual/CSS-only change
refactor(<scope>): code restructure, no behavior change
```

---

## CI Checks (GitHub Actions)

Every PR runs these checks — your PR must pass all of them:

| Check | What it does | How to fix failures |
|---|---|---|
| **HTML validation** | Runs `html-validate` on all `.html` files | Fix the HTML errors reported in the CI log |
| **No package.json** | Ensures no `package.json` exists in the repo | Remove any `package.json` you added |
| **CDN SRI check** | Ensures every `<script src="https://...">` has `integrity=` | Add SRI hash — generate at [srihash.org](https://www.srihash.org/) |
| **Link check** (PRs only) | Uses Lychee to check for broken internal links | Fix broken `href` values |

---

## Common Mistakes to Avoid

| Mistake | Why it's wrong | What to do instead |
|---|---|---|
| Adding `onclick="..."` in HTML | Violates inline-JS rule | Use `addEventListener` in `script.js` |
| Using `../assets/styles.css` | Breaks if URL path changes | Use `/assets/styles.css` (absolute) |
| Using `Math.random()` | Not cryptographically secure | Use `crypto.getRandomValues()` |
| Copying body/nav/gradient CSS into a tool | Duplicates shared styles | Link `/assets/styles.css` and only add tool-specific overrides |
| Adding a `<script>` block in HTML | All JS must be external | Put logic in `script.js` and load with `defer` |
| Forgetting SRI on CDN scripts | CI will block the PR | Generate hash at srihash.org |
| Large PRs mixing multiple changes | Hard to review, likely rejected | One fix or one tool per PR |

---

## Existing Tools (for reference)

| Tool | Folder | Key libraries |
|---|---|---|
| QR Code Generator | `qr-code-generator/` | qr-code-styling (CDN) |
| Password Generator | `password-generator/` | zxcvbn (CDN) |
| UUID Generator | `uuid-generator/` | None |
| Random Number Generator | `rng-generator/` | None |
| Favicon Generator | `favicon-generator/` | None |
| Base64 Encoder/Decoder | `base64-tool/` | None |
| URL Encoder/Decoder | `url-encoder-decoder/` | None |
| US States Map Quiz | `geogames/` | None |
| Gaussian Elimination | `gaussian-elimination/` | None |

---

## Tool Ideas (open for contribution)

These are tools that would fit well in the project. Check [open issues](https://github.com/MidnightMarathon/securetools/issues) first — someone may already be working on one.

- **Hash Generator** — SHA-256, SHA-512, MD5 hashes of text or files in the browser
- **JWT Decoder** — Decode and inspect JWT tokens without sending them to a server
- **Color Picker / Converter** — Convert between HEX, RGB, HSL formats
- **Regex Tester** — Test regular expressions with live highlighting
- **Markdown Preview** — Write Markdown and see rendered HTML side by side
- **JSON Formatter** — Pretty-print, minify, and validate JSON
- **Timestamp Converter** — Convert between Unix timestamps and human-readable dates
- **Lorem Ipsum Generator** — Generate placeholder text
- **CIDR Calculator** — Subnet calculator for network ranges
- **Diff Tool** — Compare two blocks of text and highlight differences
