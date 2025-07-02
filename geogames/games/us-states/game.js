let states = [];
let currentTarget = null;

function pickNewTarget() {
  currentTarget = states[Math.floor(Math.random() * states.length)];
  document.getElementById("target-state").textContent = currentTarget.replace(/-/g, " ");
}

function handleClick(id, el) {
  if (id === currentTarget) {
    el.classList.add("correct");
    setTimeout(() => {
      el.classList.remove("correct");
      pickNewTarget();
    }, 1000);
  } else {
    el.classList.add("incorrect");
    setTimeout(() => el.classList.remove("incorrect"), 1000);
  }
}

fetch("map.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;
    states = Array.from(document.querySelectorAll("path")).map(p => p.id);
    pickNewTarget();

    states.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.cursor = "pointer";
        el.addEventListener("click", () => handleClick(id, el));
      }
    });
  })
  .catch(err => console.error("Failed to load SVG:", err));
