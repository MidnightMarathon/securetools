let states = [];
let currentTarget = null;
let score = 0;

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

fetch("us.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;
    states = Array.from(document.querySelectorAll("path")).map(p => p.id);

    // Set total states count in the UI
    document.getElementById("total-states").textContent = states.length;

    pickNewTarget();

 states.forEach(id => {
  const el = document.getElementById(id);
  if (el) {
    // Remove inline styles to allow CSS to control colors
    el.removeAttribute("style");

    // DO NOT set fill inline here; CSS handles base color now
    // el.style.fill = "#cfd8dc";  <-- REMOVE or COMMENT OUT this line

    el.style.cursor = "pointer";

    el.addEventListener("click", () => {
      if (id === currentTarget) {
        if (!el.classList.contains("correct")) {
          el.classList.add("correct");
          updateScore();
          pickNewTarget();
        }
      } else {
        el.classList.add("incorrect");
        setTimeout(() => el.classList.remove("incorrect"), 1000);
      }
    });
  }
});

  })
  .catch(err => console.error("Failed to load SVG:", err));
