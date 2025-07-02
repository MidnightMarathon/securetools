let states = [];
let currentTarget = null;
let score = 0;
let total = 0;
const attempts = {};

function pickNewTarget() {
  const remaining = states.filter(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("correct") && !el.classList.contains("partial") && !el.classList.contains("fail");
  });

  if (remaining.length === 0) {
    document.getElementById("target-state").textContent = "All done! 🎉";
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
        el.removeAttribute("fill");
        el.style.cursor = "pointer";

        el.addEventListener("click", () => {
          if (id !== currentTarget) {
            // Wrong guess
            attempts[currentTarget]++;
            const targetEl = document.getElementById(currentTarget);

            if (attempts[currentTarget] >= 5) {
              targetEl.classList.add("fail");
              // Do NOT move to next target until clicked correctly
            } else {
              el.classList.add("incorrect");
              setTimeout(() => el.classList.remove("incorrect"), 800);
            }

          } else {
            // Correct guess
            const el = document.getElementById(currentTarget);
            const wrongGuesses = attempts[currentTarget];

            if (wrongGuesses >= 5) {
              el.classList.add("fail");
              // No score increase
            } else if (wrongGuesses > 0) {
              el.classList.add("partial");
              score++;
            } else {
              el.classList.add("correct");
              score++;
            }

            updateScoreDisplay();
            pickNewTarget();
          }
        });
      }
    });
  })
  .catch(err => console.error("Failed to load SVG:", err));
