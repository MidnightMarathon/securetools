## What does this PR do?

<!-- One sentence summary. "Fixes #123" or "Adds the hash generator tool." -->

Fixes #

---

## Type of change

- [ ] Bug fix
- [ ] New tool
- [ ] Improvement to an existing tool
- [ ] Documentation / README update
- [ ] Other (describe below)

---

## Checklist

**All PRs**
- [ ] I've tested this in at least one browser
- [ ] No frameworks, build steps, or `node_modules` were added
- [ ] No external API calls or server-side dependencies were introduced
- [ ] No inline JavaScript in HTML (`onclick`, `<script>` blocks, etc.)
- [ ] All JS files start with `'use strict';`
- [ ] CDN scripts (if any) have `integrity` and `crossorigin` attributes

**New tools only**
- [ ] Copied from `tool-template/` — folder at repo root, lowercase hyphen name
- [ ] `index.html` links `/assets/styles.css` (absolute path)
- [ ] `<script src="/<tool-name>/script.js" defer>` (absolute path)
- [ ] Nav has exactly: Home (`/`) and About (`/about.html`)
- [ ] The tool is linked from `index.html` (home page tile grid)
- [ ] The tool is added to the tools table in `README.md`
- [ ] Uses `crypto.getRandomValues()` instead of `Math.random()` (if applicable)

**Bug fixes only**
- [ ] Minimal change — no unrelated refactors bundled in

---

## How was this tested?

<!-- What browser(s) did you test in? What did you click/enter/verify? -->

---

## Screenshots (if visual)

<!-- Before/after or a quick demo gif helps reviewers a lot. Delete this section if not applicable. -->

---

<!-- AI agents: ensure you've read AGENTS.md before submitting. -->
