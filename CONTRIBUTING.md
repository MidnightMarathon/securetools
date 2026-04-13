# Contributing to SecureTools

Thanks for your interest in contributing — whether you're a human developer or an AI coding agent. SecureTools is a deliberate project — everything here has to be fast, private, and auditable. These guidelines exist so contributions stay consistent with that intent.

> **AI agents:** For machine-optimized instructions with checklists, file maps, and CI details, see [`AGENTS.md`](AGENTS.md).

---

## Quick reference

| Rule | Detail |
|---|---|
| Stack | Vanilla HTML, CSS, JS only — no frameworks, no build step |
| Backend | None. Everything runs client-side. No API calls with user input |
| Shared CSS | `/assets/styles.css` (absolute path, every tool links it) |
| Tool JS | `/<tool-name>/script.js` (absolute path, `defer` attribute) |
| Inline JS | Forbidden. No `onclick`, no `<script>` blocks in HTML |
| Randomness | `crypto.getRandomValues()` only — never `Math.random()` |
| CDN scripts | Must have `integrity` (SRI) + `crossorigin="anonymous"` |
| Commits | [Conventional Commits](https://www.conventionalcommits.org/) — `feat(scope):`, `fix(scope):` |
| PR scope | One fix or one tool per PR |

---

## Table of contents

1. [Quick reference](#quick-reference)
2. [Philosophy — read this first](#philosophy--read-this-first)
3. [What we're looking for](#what-were-looking-for)
4. [Good first issues](#good-first-issues)
5. [What we won't merge](#what-we-wont-merge)
6. [How to contribute](#how-to-contribute)
   - [Reporting a bug](#reporting-a-bug)
   - [Proposing a new tool](#proposing-a-new-tool)
   - [Fixing a bug or making an improvement](#fixing-a-bug-or-making-an-improvement)
   - [Adding a new tool](#adding-a-new-tool)
7. [Code style](#code-style)
8. [Commit messages](#commit-messages)
9. [Getting your PR merged](#getting-your-pr-merged)

---

## Philosophy — read this first

The project runs on three rules:

**1. Everything runs in the browser.**
No form submission sends data to a server. No input is logged. No analytic event is fired. If a tool can't work with zero backend, it doesn't belong here.

**2. Vanilla HTML, CSS, and JavaScript only.**
No React, no Vue, no Svelte. No `npm install`. No build step. No `node_modules` in the repo. A contributor should be able to open a file in Notepad and understand exactly what it does. A user should be able to audit it in DevTools without a source map.

**3. Performance is a feature.**
Every tool should load in under a second on a slow 3G connection. Prefer no external resources. If you must include a third-party library, load it from a CDN *with a Subresource Integrity (SRI) hash*.

---

## What we're looking for

- **Bug fixes** — broken layouts, wrong output, broken on a specific browser
- **Accessibility improvements** — better ARIA labels, keyboard navigation, screen reader support
- **New tools** that are genuinely useful, privacy-preserving, and fit within the vanilla HTML/CSS/JS constraint
- **UI/UX improvements** to existing tools (layout, clarity, mobile responsiveness)
- **README and documentation improvements** — clearer language, better examples

---

## Good first issues

Look for issues labeled **`good first issue`** — these are scoped, self-contained tasks that don't require deep knowledge of the whole project. Great examples:

- **Add `aria-label` attributes** to buttons missing them in an existing tool
- **Fix a CSS inconsistency** where one tool doesn't match the shared design
- **Add a README.md** to a tool folder that's missing one
- **Build a simple new tool** like a timestamp converter or lorem ipsum generator (check [AGENTS.md](AGENTS.md#tool-ideas-open-for-contribution) for ideas)

If you're an AI agent looking for work, start with `good first issue` + `help wanted` labeled issues, or pick a tool idea from `AGENTS.md`.

---

## What we won't merge

- Anything that introduces a framework (React, Vue, etc.) or a bundler (Webpack, Vite, etc.)
- Anything that adds `node_modules` or a `package.json` to the repo root or a tool folder
- Tools that make network requests with user input
- Tools that duplicate something already here
- Changes that reduce performance or add significant weight (JS bundles, large unoptimised images)
- Unrelated refactors bundled into a PR that fixes something else

If you're not sure whether your idea fits, [open an issue](https://github.com/MidnightMarathon/securetools/issues/new/choose) before writing a single line of code.

---

## How to contribute

### Reporting a bug

Use the **Bug Report** issue template. Include:

- Which tool and which browser (with version)
- Steps to reproduce
- What you expected vs. what actually happened
- Any errors from the browser console (F12 → Console)

### Proposing a new tool

Use the **New Tool Proposal** issue template. Before proposing, check:

- [Open issues](https://github.com/MidnightMarathon/securetools/issues) — is it already proposed?
- [Existing tools](https://github.com/MidnightMarathon/securetools#tools) — does it already exist?

Get some signal on the issue before investing time building.

### Fixing a bug or making an improvement

1. Fork the repo
2. Create a branch: `git checkout -b fix/description-of-fix`
3. Make your change
4. Test it in at least two browsers (Chrome and Firefox cover most cases)
5. Open a pull request against `main`

### Adding a new tool

1. Copy `tool-template/` to a new directory at the repo root (e.g. `hash-generator/`)
2. Name the folder with lowercase words separated by hyphens
3. Build the tool inside that folder, following the structure below
4. Add your tool to the tools table in `README.md`
5. Link your tool from `index.html`
6. Open a PR — include a screenshot or a short demo gif if visual

#### New tool folder structure

```
your-tool-name/
├── index.html       # The tool page (self-contained except for /assets/styles.css)
├── script.js        # All tool logic — no inline scripts in the HTML
└── README.md        # What the tool does, any keyboard shortcuts, browser notes
```

Use `tool-template/` as your starting point — the HTML boilerplate there already has the correct `<head>`, nav, and shared stylesheet reference.

---

## Code style

There is no linter config in the repo. Use common sense and match the surrounding code.

**HTML**
- 2-space indentation
- `lang="en"` on every `<html>` element
- `charset`, `viewport`, `<title>`, and `<meta name="description">` in every `<head>`
- Semantic elements (`<main>`, `<nav>`, `<button>`, `<label>`) — no `<div>` soup
- Labels associated with every form input via `for`/`id`
- `aria-label` on icon buttons or anything without visible text

**CSS**
- Share the global stylesheet at `/assets/styles.css` — don't duplicate base styles in each tool
- Use a `<style>` block in the tool's `index.html` for tool-specific styles if the scope is small, or a separate `style.css` if it grows

**JavaScript**
- No `var` — use `const` and `let`
- Keep functions small and named
- No global namespace pollution — wrap in a module pattern or use ES modules where appropriate
- `'use strict'` at the top of every script file

**External libraries**
If you need a library (e.g. QR code generation, zxcvbn), load it from a CDN with an SRI hash:

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/example/1.0.0/example.min.js"
  integrity="sha384-REPLACE_WITH_REAL_HASH"
  crossorigin="anonymous"
  defer
></script>
```

Generate the hash at [srihash.org](https://www.srihash.org/). PRs that add CDN scripts without SRI will be blocked by CI.

---

## Commit messages

Follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) — this keeps the history scannable.

```
fix(password-generator): handle edge case when all character sets unchecked
feat(hash-generator): add SHA-256 and SHA-512 support
docs: update CONTRIBUTING with SRI guidance
style(assets): tighten nav pill spacing on mobile
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## Getting your PR merged

- Keep PRs focused — one fix or one tool per PR
- Fill out the PR template in full
- If CI fails, fix it before requesting review
- Expect at least one round of review feedback — that's normal and not a rejection

If a PR sits more than a week without review, ping in the PR thread and we'll get to it.

---

## For AI agents

This project welcomes contributions from AI coding agents. To contribute effectively:

1. **Read [`AGENTS.md`](AGENTS.md)** — it's the machine-optimized version of this guide with checklists, file structure maps, CI details, and common mistakes.
2. **Claim an issue** — comment on the issue before starting work so others know it's being worked on.
3. **Follow the checklist exactly** — `AGENTS.md` has a step-by-step new tool checklist and a bug fix workflow.
4. **Run the CI checks** mentally — HTML must be valid, SRI hashes must be present, links must not be broken.
5. **Keep PRs atomic** — one tool or one fix per PR. Don't bundle refactors.

Common tools needed: `html-validate` (for CI parity), any static file server (for local testing), `srihash.org` (for generating SRI hashes).

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE) that covers this project.
