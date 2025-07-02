let states = [];
let currentTarget = null;
let score = 0;
let clickable = true;

function pickNewTarget() {
  const remaining = states.filter(id => {
    const el = document.getElementById(id);
    return el && !el.classList.contains("correct");
  });

  if (remaining.length === 0) {
    document.getElementById("target-state").textContent = "All done! 🎉";
    return;
  }

  currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
  document.getElementById("target-state").textContent = currentTarget.replace(/-/g, " ");
}

function updateScore() {
  score++;
  document.getElementById("score").textContent = score;
}

function resetStateColors() {
  states.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove("correct", "incorrect");
      el.style.fill = "";
      el.style.filter = "";
    }
  });
}

function disableClicks() {
  clickable = false;
}

function enableClicks() {
  clickable = true;
}

function giveFeedback(clickedEl, isCorrect) {
  if (isCorrect) {
    clickedEl.classList.add("correct");
  } else {
    clickedEl.classList.add("incorrect");
    // No highlighting of correct state here
  }
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
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
          if (!clickable) return;

          if (id === currentTarget) {
            if (!el.classList.contains("correct")) {
              disableClicks();
              giveFeedback(el, true);
              updateScore();

              setTimeout(() => {
                pickNewTarget();
                enableClicks();
              }, 1500);
            }
          } else {
            disableClicks();
            giveFeedback(el, false);

            setTimeout(() => {
              // Remove only incorrect feedback here
              el.classList.remove("incorrect");
              enableClicks();
            }, 1500);
          }
        });
      }
    });
  })
  .catch(err => console.error("Failed to load SVG:", err));
