let states = [];
let currentTarget = null;
let correctFirstTry = 0;
let completedStates = 0;
const maxWrongGuesses = 3;
const guessCounts = {};

function pickNewTarget() {
  const remaining = states.filter(id => {
    const el = document.getElementById(id);
    return el &&
      !el.classList.contains("correct") &&
      !el.classList.contains("eventual") &&
      !el.classList.contains("failed");
  });

  if (remaining.length === 0) {
    document.getElementById("target-state").textContent = "All done! 🎉";
    updateScoreDisplay();
    return;
  }

  currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
  document.getElementById("target-state").textContent = currentTarget.replace(/-/g, " ");
}

function updateScoreDisplay() {
  const totalStates = states.length;
  const percentage = ((correctFirstTry / totalStates) * 100).toFixed(1);
  document.getElementById("score").textContent =
    `${correctFirstTry} / ${totalStates} (${percentage}%)`;
}

fetch("us.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;
    states = Array.from(document.querySelectorAll("path")).map(p => p.id);
    document.getElementById("total-states").textContent = states.length;

    pickNewTarget();

    states.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.removeAttribute("style");
        el.removeAttribute("fill");
        el.style.cursor = "pointer";
        guessCounts[id] = 0;

        el.addEventListener("click", () => {
          if (id === currentTarget) {
            if (!el.classList.contains("correct") &&
                !el.classList.contains("eventual") &&
                !el.classList.contains("failed")) {

              completedStates++;

              if (guessCounts[id] === 0) {
                el.classList.add("correct");
                correctFirstTry++;
              } else if (guessCounts[id] < maxWrongGuesses) {
                el.classList.add("eventual");
              } else {
                el.classList.add("failed");
              }

              updateScoreDisplay();
              pickNewTarget();
            }
          } else {
            guessCounts[currentTarget]++;
            el.classList.add("incorrect");
            setTimeout(() => el.classList.remove("incorrect"), 1000);

            if (guessCounts[currentTarget] >= maxWrongGuesses) {
              const correctEl = document.getElementById(currentTarget);
              if (correctEl) correctEl.classList.add("failed");
              completedStates++;
              updateScoreDisplay();
              pickNewTarget();
            }
          }
        });
      }
    });
  })
  .catch(err => console.error("Failed to load SVG:", err));
