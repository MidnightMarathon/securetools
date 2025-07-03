let states = [];
let currentTarget = null;
let score = 0;
let total = 0;
const attempts = {};
const failedStates = new Set();

const stateNames = {
  "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
  "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
  "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
  "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
  "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
  "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
  "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
  "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
  "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
  "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
};

function getFullStateName(abbr) {
  return stateNames[abbr] || abbr;
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

  // --- Scenario 1: Failed state waiting for acknowledgment ---
  if (currentTargetEl && currentTargetEl.classList.contains("fail")) {
    if (clickedId === currentTarget) {
      currentTargetEl.classList.remove("fail", "hover-state");
      currentTargetEl.classList.add("given-up");
      failedStates.add(currentTarget);
      pickNewTarget();
    } else {
      if (clickedEl) {
        clickedEl.classList.add("incorrect-temp");
        setTimeout(() => {
          clickedEl.classList.remove("incorrect-temp");
        }, 800);
      }
    }
    return;
  }

  // --- Scenario 2: Normal gameplay ---
  if (clickedId !== currentTarget) {
    attempts[currentTarget]++;
    if (clickedEl) {
      clickedEl.classList.add("incorrect-temp");
      setTimeout(() => {
        clickedEl.classList.remove("incorrect-temp");
      }, 800);
    }

    if (attempts[currentTarget] >= 5) {
      if (currentTargetEl) {
        currentTargetEl.classList.remove("hover-state");
        currentTargetEl.classList.add("fail");
      }
    }

  } else {
    const wrongGuessesCount = attempts[currentTarget];

    if (currentTargetEl) {
      currentTargetEl.classList.remove("hover-state");  // Remove hover blue fill
      if (wrongGuessesCount === 0) {
        currentTargetEl.classList.add("correct");
      } else {
        currentTargetEl.classList.add("partial");
      }

      // Bring to front in SVG
      currentTargetEl.parentNode.appendChild(currentTargetEl);

      // Add pop effect
      currentTargetEl.classList.add("pop");
      setTimeout(() => {
        currentTargetEl.classList.remove("pop");
      }, 500);
    }

    score++;
    updateScoreDisplay();
    pickNewTarget();
  }
}

// --- SVG Setup ---
fetch("us.svg")
  .then(res => {
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.text();
  })
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;

    states = Array.from(document.querySelectorAll("#map-container path[id]"))
      .map(p => p.id)
      .filter(id => id.length === 2 && stateNames[id]);

    total = states.length;
    document.getElementById("total-states").textContent = total;
    updateScoreDisplay();

    states.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.removeAttribute("style");
        el.removeAttribute("fill");

        el.addEventListener('mouseover', function () {
          if (!this.classList.contains("correct") &&
            !this.classList.contains("partial") &&
            !this.classList.contains("fail") &&
            !this.classList.contains("given-up") &&
            !this.classList.contains("incorrect-temp")) {
            this.classList.add("hover-state");
          }
        });

        el.addEventListener('mouseout', function () {
          this.classList.remove("hover-state");
        });

        el.addEventListener("click", () => {
          handleStateClick(id);
        });
      }
    });

    pickNewTarget();
  })
  .catch(err => console.error("Failed to load SVG:", err));
