# Copilot Instructions for SecureTools

## Project Identity

SecureTools is a zero-tracking, zero-backend collection of browser tools. Everything runs client-side. The stack is vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no npm.

## Absolute Rules

- No frameworks (React, Vue, jQuery, Tailwind, etc.)
- No build tools (Webpack, Vite, etc.)
- No `package.json` or `node_modules`
- No server-side code or API calls with user input
- No inline JavaScript in HTML — all JS in external `.js` files loaded with `defer`
- No `Math.random()` — use `crypto.getRandomValues()` for any randomness
- Every CDN `<script>` must have `integrity` (SRI hash) and `crossorigin="anonymous"`

## Code Style

- HTML: 2-space indent, semantic elements, `lang="en"`, `<label>` for every `<input>`
- CSS: shared styles in `/assets/styles.css` (absolute path). Brand blue: `#2d9cdb`
- JS: `'use strict'` on line 1. `const`/`let` only. `addEventListener` for all events. Small named functions.
- Commits: Conventional Commits format — `feat(scope):`, `fix(scope):`, `docs:`, `style(scope):`

## Adding a New Tool

1. Copy `tool-template/` to `<tool-name>/` at repo root
2. Replace all placeholders in `index.html` and `script.js`
3. Link `/assets/styles.css` with an absolute path
4. Set `<script src="/<tool-name>/script.js" defer>`
5. Add a tile to `index.html` (home page)
6. Add a row to the tools table in `README.md`

## Nav Structure

Every tool page has exactly:
```html
<nav>
  <a href="/" aria-label="SecureTools Home">Home</a>
  <a href="/about.html" aria-label="About SecureTools">About</a>
</nav>
```

## File References

- Shared CSS: `/assets/styles.css` (always absolute)
- Tool script: `/<tool-name>/script.js` (always absolute, always `defer`)
- See `AGENTS.md` for the full specification
