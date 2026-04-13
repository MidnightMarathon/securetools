'use strict';

// ---------------------------------------------------------------------------
// Replace this file with your tool logic.
// The DOM is fully loaded when this script runs (loaded with `defer`).
// ---------------------------------------------------------------------------

const input  = document.getElementById('tool-input');
const output = document.getElementById('tool-output');
const runBtn = document.getElementById('run-btn');
const copyBtn = document.getElementById('copy-btn');

// ── Core logic ──────────────────────────────────────────────────────────────

function run() {
  const value = input.value.trim();

  if (!value) {
    output.textContent = '';
    return;
  }

  // TODO: replace with your tool's actual logic
  output.textContent = value;
}

// ── Copy to clipboard ────────────────────────────────────────────────────────

async function copyToClipboard() {
  const text = output.textContent;
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = original; }, 1500);
  } catch {
    // Fallback for browsers that block clipboard without a user gesture
    const range = document.createRange();
    range.selectNodeContents(output);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}

// ── Event listeners ──────────────────────────────────────────────────────────

runBtn.addEventListener('click', run);
copyBtn.addEventListener('click', copyToClipboard);

// Run on Enter inside the input field
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') run();
});
