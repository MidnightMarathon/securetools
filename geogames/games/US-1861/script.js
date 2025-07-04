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
  "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts",
  "Michigan", "Minnesota", "Mississippi", "Missouri", "New Hampshire",
  "New Jersey", "New York", "North Carolina", "Ohio", "Oregon",
  "Pennsylvania", "Rhode Island", "South Carolina", "Tennessee", "Texas",
  "Vermont", "Virginia", "Wisconsin",

  // Territories in 1861
  "Washington Territory",
  "Nebraska Territory",
  "Utah Territory",
  "New Mexico Territory",
  "Kansas Territory",
  "Nevada Territory",
  "Dakota Territory",
  "Indian Territory",
  // Add any others you need
]);

function getFullStateName(name) {
  return name; // IDs are full names in the SVG
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
    if (prevTargetEl) prevTargetEl.classList.remove("fail");
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
  const percentage = total > 0 ? ((score / total) * 100).toFixed(1) : 0;
  document.getElementById("score").textContent = `${score} / ${total} (${percentage}%)`;
}

function handleStateClick(clickedId) {
  // Clear all previous incorrect flashes
  states.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('incorrect-temp');
  });

  if (!currentTarget) return;

  const clickedEl = document.getElementById(clickedId);
  const currentTargetEl = document.getElementById(currentTarget);

  // Handle failed state acknowledgment
  if (currentTargetEl && currentTargetEl.classList.contains("fail")) {
    if (clickedId === currentTarget) {
      currentTargetEl.classList.remove("fail", "hover-state");
      currentTargetEl.classList.add("given-up");
      failedStates.add(currentTarget);
      pickNewTarget();
    } else {
      if (clickedEl) {
        clickedEl.classList.add("incorrect-temp");
        setTimeout(() => clickedEl.classList.remove("incorrect-temp"), 800);
      }
    }
    return;
  }

  // Normal gameplay
  if (clickedId !== currentTarget) {
    attempts[currentTarget]++;
    if (clickedEl) {
      clickedEl.classList.add("incorrect-temp");
      setTimeout(() => clickedEl.classList.remove("incorrect-temp"), 800);
    }

    if (attempts[currentTarget] >= 5 && currentTargetEl) {
      currentTargetEl.classList.remove("hover-state");
      currentTargetEl.classList.add("fail");
    }
  } else {
    const wrongGuessesCount = attempts[currentTarget];

    if (currentTargetEl) {
      currentTargetEl.classList.remove("hover-state");
      if (wrongGuessesCount === 0) {
        currentTargetEl.classList.add("correct");
      } else {
        currentTargetEl.classList.add("partial");
      }

      // Bring the clicked state to front
      currentTargetEl.parentNode.appendChild(currentTargetEl);

      // Pop animation
      currentTargetEl.classList.add("pop");
      setTimeout(() => currentTargetEl.classList.remove("pop"), 500);
    }

    score++;
    updateScoreDisplay();
    pickNewTarget();
  }
}

// Load SVG and initialize game
fetch("Historical_blank_US_map_1861.svg")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  })
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;

    states = Array.from(document.querySelectorAll("#map-container path[id]"))
      .map(p => p.id)
      .filter(id => stateNames.has(id));

    total = states.length;
    document.getElementById("total-states").textContent = total;
    updateScoreDisplay();

    states.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;

      el.removeAttribute("style");
      el.removeAttribute("fill");

      el.addEventListener('mouseover', () => {
        if (!el.classList.contains("correct") &&
          !el.classList.contains("partial") &&
          !el.classList.contains("fail") &&
          !el.classList.contains("given-up") &&
          !el.classList.contains("incorrect-temp")) {
          el.classList.add("hover-state");
        }
      });

      el.addEventListener('mouseout', () => {
        el.classList.remove("hover-state");
      });

      el.addEventListener("click", () => handleStateClick(id));
    });

    pickNewTarget();
  })
  .catch(err => console.error("Failed to load SVG:", err));
