let states = [];
let currentTarget = null;
let score = 0;
let total = 0;
const attempts = {};
const failedStates = new Set();

function pickNewTarget() {
  const remaining = states.filter(id => {
    const el = document.getElementById(id);
    // exclude correct, partial, fail, and permanently failed (given up)
    return el && 
      !el.classList.contains("correct") && 
      !el.classList.contains("partial") && 
      !el.classList.contains("fail") &&
      !failedStates.has(id);
  });

  if (remaining.length === 0) {
    document.getElementById("target-state").textContent = "All done! 🎉";
    currentTarget = null;
    return;
  }

  currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
  document.getElementById("target-state").textContent = currentTarget.replace(/-/g, " ");
}

function updateScoreDisplay() {
  const percentage = ((score / total) * 100).toFixed(1);
  document.getElementById("score").textContent = `${score} / ${total} (${percentage}%)`;
}

fetch("us.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;
    states = Array.from(document.querySelectorAll("path")).map(p => p.id);
    total = states.length;

    document.getElementById("total-states").textContent = total;
    updateScoreDisplay();
    pickNewTarget();

    states.forEach(id => {
      attempts[id] = 0;

      const el = document.getElementById(id);
      if (el) {
        el.removeAttribute("style");
        el.setAttribute("fill", "transparent"); // clickable interior
        el.style.cursor = "pointer";

        el.addEventListener("click", () => {
          if (!currentTarget) return; // game over, no target

          // If current target is failed (red), user must click it to acknowledge failure
          if (attempts[currentTarget] >= 5) {
            if (id === currentTarget) {
              // Mark as permanently failed
              el.classList.remove("fail");
              el.classList.add("given-up");
              failedStates.add(currentTarget); // remove from future targets
              pickNewTarget();
            } else {
              // Clicking other states while failed target active -> flash incorrect
              el.classList.remove("incorrect-temp"); // reset if clicked rapidly
              void el.offsetWidth; // force reflow
              el.classList.add("incorrect-temp");

            }
            return; // stop here
          }

          if (id !== currentTarget) {
            // Wrong guess on current target
            attempts[currentTarget]++;
            const targetEl = document.getElementById(currentTarget);

            if (attempts[currentTarget] >= 5) {
              // Mark current target as failed (red)
              targetEl.classList.add("fail");
              // Don't move on until user clicks failed target
            } else {
              el.classList.add("incorrect");
              setTimeout(() => el.classList.remove("incorrect"), 1000);
            }
          } else {
            // Correct guess
            const el = document.getElementById(currentTarget);
            const wrongGuesses = attempts[currentTarget];

            if (wrongGuesses >= 5) {
              // Already failed, but user clicked correct (shouldn't happen now)
              // Just ignore or maybe re-ask them to click the red fail target?
              // No score increase, no next target move here
            } else if (wrongGuesses > 0) {
              el.classList.add("partial"); // yellow
              score++;
              updateScoreDisplay();
              pickNewTarget();
            } else {
              el.classList.add("correct"); // green
              score++;
              updateScoreDisplay();
              pickNewTarget();
            }
          }
        });
      }
    });
  })
  .catch(err => console.error("Failed to load SVG:", err));
