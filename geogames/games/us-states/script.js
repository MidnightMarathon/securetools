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
    // REMOVED "DC": "District of Columbia"
};

function getFullStateName(abbr) {
    return stateNames[abbr] || abbr;
}

// REMOVED: const statesWithCutout = ["DC"];

function pickNewTarget() {
    const remaining = states.filter(id => {
        const el = document.getElementById(id);
        return el &&
               !el.classList.contains("correct") &&
               !el.classList.contains("partial") &&
               !failedStates.has(id);
    });

    // Reset the 'fail' class on the *previous* current target if it was there
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

// Refactored click handler for reusability
function handleStateClick(clickedId) {
    if (!currentTarget) return;

    // Get the element for the clicked state
    const clickedEl = document.getElementById(clickedId);
    // Get the element for the current target state
    const currentTargetEl = document.getElementById(currentTarget);


    // --- SCENARIO 1: Current target is marked 'fail' (red), user *must* click it to acknowledge ---
    if (currentTargetEl && currentTargetEl.classList.contains("fail")) {
        if (clickedId === currentTarget) {
            // User clicked the correct failed target state
            currentTargetEl.classList.remove("fail");
            currentTargetEl.classList.add("given-up");
            failedStates.add(currentTarget);
            pickNewTarget();
        } else {
            // User clicked a wrong state while a target was failed and waiting for acknowledgment
            if (clickedEl) {
                clickedEl.classList.remove("incorrect-temp");
                void clickedEl.offsetWidth; // Force reflow
                clickedEl.classList.add("incorrect-temp");
                setTimeout(() => {
                    clickedEl.classList.remove("incorrect-temp");
                }, 800);
            }
        }
        return;
    }

    // --- SCENARIO 2: Normal gameplay ---
    if (clickedId !== currentTarget) {
        // Incorrect Guess for the current target
        attempts[currentTarget]++;

        // Apply temporary red flash to the *clicked* element
        if (clickedEl) {
            clickedEl.classList.remove("incorrect-temp");
            void clickedEl.offsetWidth;
            clickedEl.classList.add("incorrect-temp");
            setTimeout(() => {
                clickedEl.classList.remove("incorrect-temp");
            }, 800);
        }

        if (attempts[currentTarget] >= 5) {
            // Current target has exceeded max attempts, mark it as 'fail' (red, pulsating)
            if (currentTargetEl) {
                currentTargetEl.classList.add("fail");
            }
        }

    } else {
        // Correct Guess for the current target
        const wrongGuessesCount = attempts[currentTarget];

        // Apply correct/partial class to the original state element
        if (currentTargetEl) {
            if (wrongGuessesCount === 0) {
                currentTargetEl.classList.add("correct");
            } else {
                currentTargetEl.classList.add("partial");
            }
        }
        
        score++;
        updateScoreDisplay();
        pickNewTarget(); // Move to the next state
    }
}


// --- Main Game Setup on SVG Load ---
fetch("us.svg")
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
    })
    .then(svg => {
        document.getElementById("map-container").innerHTML = svg;

        states = Array.from(document.querySelectorAll("#map-container path[id]"))
                      .map(p => p.id)
                      // Filter out DC and any other non-state IDs
                      .filter(id => id.length === 2 && stateNames[id] && id !== "DC");

        total = states.length;

        document.getElementById("total-states").textContent = total;
        updateScoreDisplay();

        // Loop through all states to set up event listeners
        states.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.removeAttribute("style");
                el.removeAttribute("fill");

                // Attach event listeners directly to the path for all remaining states
                el.addEventListener('mouseover', function() {
                    if (!this.classList.contains("correct") &&
                        !this.classList.contains("partial") &&
                        !this.classList.contains("fail") &&
                        !this.classList.contains("given-up") &&
                        !this.classList.contains("incorrect-temp")) {
                        this.classList.add("hover-state");
                    }
                });
                el.addEventListener('mouseout', function() {
                    this.classList.remove("hover-state");
                });

                el.addEventListener("click", () => {
                    handleStateClick(id);
                });
            } else {
                console.warn(`Element with ID "${id}" not found in the SVG. Check your SVG or selector.`);
            }
        });

        // Start the first round of the game
        pickNewTarget();
    })
    .catch(err => console.error("Failed to load SVG:", err));
