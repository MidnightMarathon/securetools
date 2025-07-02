const targetDisplay = document.getElementById("target-state");
const scoreDisplay = document.getElementById("score-count");

let score = 0;
let states = [];
let currentTarget = "";

fetch("map.svg")
  .then(res => res.text())
  .then(svg => {
    document.getElementById("map-container").innerHTML = svg;
    states = Array.from(document.querySelectorAll("path")).map(p => p.id);
    pickNewTarget();

    states.forEach(id => {
      const el = document.getElementById(id);
      el.addEventListener("click", () => handleClick(id, el));
    });
  });

function pickNewTarget() {
  currentTarget = states[Math.floor(Math.random() * states.length)];
  targetDisplay.textContent = currentTarget.replace(/-/g, " ");
}

function handleClick(id, el) {
  if (id === currentTarget) {
    el.classList.add("correct");
    score++;
    scoreDisplay.textContent = score;
    pickNewTarget();
  } else {
    el.classList.add("incorrect");
    setTimeout(() => el.classList.remove("incorrect"), 700);
  }
}

