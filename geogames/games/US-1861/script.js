let states = [];
let currentTarget = null;
let score = 0;
let total = 0;
const attempts = {};
const failedStates = new Set();

const stateNames = new Set([
  // States in 1861
  "Alabama", "Arkansas", "California", "Connecticut", "Delaware",
  "Florida", "Georgia", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland",
  "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri",
  "New Hampshire", "New Jersey", "New York", "North Carolina", "Ohio",
  "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "Tennessee",
  "Texas", "Vermont", "Virginia", "Wisconsin",

  // Territories in 1861
  "Colorado Territory", "Dakota Territory", "Indian Territory",
  "Nebraska Territory", "Nevada Territory", "New Mexico Territory",
  "Utah Territory", "Washington Territory"
]);

function getFullStateName(name) {
  return name; // Path IDs are full names already
}

function pickNewTarget() {
  const remaining = states.filter(id => {
    const el = document.getElementById(id);
    return el &&
      !el.classList.contains("correct") &&
      !el.classList.contains("partial") &&
      !failedStates.has(id);
  });

  if (currentTarget) {
    const prevTargetEl = document.getElementById(currentTarget);
    if (prevTargetEl) {
      prevTargetEl.classList.remove("fail");
    }
  }

  if (remaining.length === 0) {
    document.getElementById("target-state").textContent = "All done! 🎉";
    currentTarget = null;
    return;
  }

  currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
  attempts[currentTarget] = 0;
  document.getElementById("target-state").textContent = getFullStateName(currentTarget);
}

function updateScoreDisplay() {
  const percentage = (total > 0) ? ((score / total) * 100).toFixed(1) : 0;
  document.getElementById("score").textContent
