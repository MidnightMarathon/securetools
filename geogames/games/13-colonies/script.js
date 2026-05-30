'use strict';

let mapStates = [];
let quizStates = [];
let currentTarget = null;
let score = 0;
let total = 0;
const attempts = {};
const failedStates = new Set();
const randomBuffer = new Uint32Array(1);

const colonyNames = {
  CT: 'Connecticut',
  DE: 'Delaware',
  GA: 'Georgia',
  MA: 'Massachusetts',
  MD: 'Maryland',
  NC: 'North Carolina',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NY: 'New York',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  VA: 'Virginia'
};

function getFullStateName(abbr) {
  return colonyNames[abbr] || abbr;
}

function randomInt(max) {
  if (!Number.isInteger(max) || max <= 0) {
    throw new Error('max must be a positive integer');
  }

  const maxUint32 = 0x100000000;
  const limit = Math.floor(maxUint32 / max) * max;

  do {
    window.crypto.getRandomValues(randomBuffer);
  } while (randomBuffer[0] >= limit);

  return randomBuffer[0] % max;
}

function pickNewTarget() {
  const remaining = quizStates.filter(id => {
    const el = document.getElementById(id);
    return el &&
      !el.classList.contains('correct') &&
      !el.classList.contains('partial') &&
      !failedStates.has(id);
  });

  if (currentTarget) {
    const prevTargetEl = document.getElementById(currentTarget);
    if (prevTargetEl) {
      prevTargetEl.classList.remove('fail');
    }
  }

  if (remaining.length === 0) {
    document.getElementById('target-state').textContent = 'All done!';
    currentTarget = null;
    return;
  }

  currentTarget = remaining[randomInt(remaining.length)];
  attempts[currentTarget] = 0;
  document.getElementById('target-state').textContent = getFullStateName(currentTarget);
}

function updateScoreDisplay() {
  const percentage = total > 0 ? ((score / total) * 100).toFixed(1) : '0.0';
  document.getElementById('score').textContent = String(score);
  document.getElementById('total-states').textContent = String(total);
  document.getElementById('percentage').textContent = `${percentage}%`;
}

function clearIncorrectFlashes() {
  mapStates.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.remove('incorrect-temp');
    }
  });
}

function flashIncorrectState(clickedEl) {
  if (!clickedEl) {
    return;
  }

  clickedEl.classList.add('incorrect-temp');
  setTimeout(() => {
    clickedEl.classList.remove('incorrect-temp');
  }, 800);
}

function handleStateClick(clickedId) {
  clearIncorrectFlashes();

  if (!currentTarget) {
    return;
  }

  const clickedEl = document.getElementById(clickedId);
  const currentTargetEl = document.getElementById(currentTarget);

  if (currentTargetEl && currentTargetEl.classList.contains('fail')) {
    if (clickedId === currentTarget) {
      currentTargetEl.classList.remove('fail', 'hover-state');
      currentTargetEl.classList.add('given-up');
      failedStates.add(currentTarget);
      pickNewTarget();
    } else {
      flashIncorrectState(clickedEl);
    }
    return;
  }

  if (clickedId !== currentTarget) {
    attempts[currentTarget]++;
    flashIncorrectState(clickedEl);

    if (attempts[currentTarget] >= 5 && currentTargetEl) {
      currentTargetEl.classList.remove('hover-state');
      currentTargetEl.classList.add('fail');
    }
    return;
  }

  if (currentTargetEl) {
    currentTargetEl.classList.remove('hover-state');
    if (attempts[currentTarget] === 0) {
      currentTargetEl.classList.add('correct');
    } else {
      currentTargetEl.classList.add('partial');
    }

    currentTargetEl.parentNode.appendChild(currentTargetEl);
    currentTargetEl.classList.add('pop');
    setTimeout(() => {
      currentTargetEl.classList.remove('pop');
    }, 500);
  }

  score++;
  updateScoreDisplay();
  pickNewTarget();
}

fetch('/geogames/games/13-colonies/colonies-1775.svg?v=20260530b')
  .then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.text();
  })
  .then(svg => {
    document.getElementById('map-container').innerHTML = svg;

    mapStates = Array.from(document.querySelectorAll('#map-container path[id]'))
      .map(path => path.id)
      .filter(id => colonyNames[id]);

    quizStates = [...mapStates];
    total = quizStates.length;
    updateScoreDisplay();

    const svgRoot = document.querySelector('#map-container svg');
    if (svgRoot) {
      svgRoot.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    }

    mapStates.forEach(id => {
      const el = document.getElementById(id);
      if (!el) {
        return;
      }

      el.removeAttribute('style');
      el.removeAttribute('fill');

      el.addEventListener('mouseover', function () {
        if (!this.classList.contains('correct') &&
            !this.classList.contains('partial') &&
            !this.classList.contains('fail') &&
            !this.classList.contains('given-up') &&
            !this.classList.contains('incorrect-temp')) {
          this.classList.add('hover-state');
        }
      });

      el.addEventListener('mouseout', function () {
        this.classList.remove('hover-state');
      });

      el.addEventListener('click', () => {
        handleStateClick(id);
      });
    });

    pickNewTarget();
  })
  .catch(err => console.error('Failed to load SVG:', err));