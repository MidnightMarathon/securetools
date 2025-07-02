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
    "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
    "DC": "District of Columbia" // Ensure DC is in your stateNames map
};

function getFullStateName(abbr) {
    return stateNames[abbr] || abbr;
}

// List of states that will use the cutout method
const statesWithCutout = ["DC"]; // Add "RI" if you create a cutout for it too

function pickNewTarget() {
    const remaining = states.filter(id => {
        const el = document.getElementById(id);
        return el &&
               !el.classList.contains("correct") &&
               !el.classList.contains("partial") &&
               !failedStates.has(id);
    });

    // Reset visual state of the PREVIOUS target if it was a cutout state
    if (currentTarget && statesWithCutout.includes(currentTarget)) {
        const magnifiedEl = document.getElementById(`${currentTarget}-magnified`);
        if (magnifiedEl) {
            magnifiedEl.classList.remove("highlight-target");
            magnifiedEl.classList.add("inactive-magnified"); // Make it inactive
            magnifiedEl.classList.remove("correct", "partial", "fail", "given-up", "incorrect-temp"); // Clear any feedback
        }
    }
    
    // Reset the 'fail' class on the *previous* current target if it was there (for non-cutout states)
    if (currentTarget && !statesWithCutout.includes(currentTarget)) {
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

    // Apply visual state to the NEW target if it's a cutout state
    if (statesWithCutout.includes(currentTarget)) {
        const magnifiedEl = document.getElementById(`${currentTarget}-magnified`);
        if (magnifiedEl) {
            magnifiedEl.classList.remove("inactive-magnified"); // Make it active
            magnifiedEl.classList.add("highlight-target"); // Highlight it
        }
    }
}

function updateScoreDisplay() {
    const percentage = (total > 0) ? ((score / total) * 100).toFixed(1) : 0;
    document.getElementById("score").textContent = `${score} / ${total} (${percentage}%)`;
}

// Refactored click handler for reusability
function handleStateClick(clickedId) {
    if (!currentTarget) return;

    // Get the element for the clicked state (original path)
    const clickedEl = document.getElementById(clickedId);
    // Get the element for the current target state (original path)
    const currentTargetEl = document.getElementById(currentTarget);
    // Get the magnified element for the clicked state, if it exists
    const magnifiedClickedEl = statesWithCutout.includes(clickedId) ? document.getElementById(`${clickedId}-magnified`) : null;
    // Get the magnified element for the current target state, if it exists
    const magnifiedCurrentTargetEl = statesWithCutout.includes(currentTarget) ? document.getElementById(`${currentTarget}-magnified`) : null;


    // --- SCENARIO 1: Current target is marked 'fail' (red), user *must* click it to acknowledge ---
    if (currentTargetEl && currentTargetEl.classList.contains("fail")) {
        if (clickedId === currentTarget) {
            // User clicked the correct failed target state (original or magnified)
            currentTargetEl.classList.remove("fail");
            currentTargetEl.classList.add("given-up");
            if (magnifiedCurrentTargetEl) {
                 magnifiedCurrentTargetEl.classList.remove("fail");
                 magnifiedCurrentTargetEl.classList.add("given-up");
                 magnifiedCurrentTargetEl.classList.remove("highlight-target"); // Remove highlight
            }
            failedStates.add(currentTarget);
            pickNewTarget();
        } else {
            // User clicked a wrong state while a target was failed and waiting for acknowledgment
            // Apply temporary red flash to the *clicked* element (original or magnified)
            const elToFlash = magnifiedClickedEl || clickedEl; // Prioritize flashing the magnified if it exists
            if (elToFlash) {
                elToFlash.classList.remove("incorrect-temp");
                void elToFlash.offsetWidth; // Force reflow
                elToFlash.classList.add("incorrect-temp");
                setTimeout(() => {
                    elToFlash.classList.remove("incorrect-temp");
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
        const elToFlash = magnifiedClickedEl || clickedEl; // Prioritize flashing the magnified if it exists
        if (elToFlash) {
            elToFlash.classList.remove("incorrect-temp");
            void elToFlash.offsetWidth;
            elToFlash.classList.add("incorrect-temp");
            setTimeout(() => {
                elToFlash.classList.remove("incorrect-temp");
            }, 800);
        }

        if (attempts[currentTarget] >= 5) {
            // Current target has exceeded max attempts, mark it as 'fail' (red, pulsating)
            if (currentTargetEl) {
                currentTargetEl.classList.add("fail");
            }
            if (magnifiedCurrentTargetEl) {
                 magnifiedCurrentTargetEl.classList.add("fail");
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
        // Apply correct/partial class to the magnified state element (if it exists)
        if (magnifiedCurrentTargetEl) {
            if (wrongGuessesCount === 0) {
                magnifiedCurrentTargetEl.classList.add("correct");
            } else {
                magnifiedCurrentTargetEl.classList.add("partial");
            }
            magnifiedCurrentTargetEl.classList.remove("highlight-target"); // Remove highlight on success
            magnifiedCurrentTargetEl.classList.remove("inactive-magnified"); // Ensure no inactive class remains
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
                      .filter(id => id.length === 2 && stateNames[id]); // Ensures valid states are included

        total = states.length;

        document.getElementById("total-states").textContent = total;
        updateScoreDisplay();

        // Loop through all states to set up event listeners
        states.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.removeAttribute("style");
                el.removeAttribute("fill");

                // Check if this state uses a cutout (e.g., DC)
                if (statesWithCutout.includes(id)) {
                    // Original tiny state: make it non-clickable and dim it
                    el.classList.add("has-cutout"); // Add class for dimming/pointer-events: none

                    // Handle clicks on the MAGNIFIED version of the state in the cutout
                    const magnifiedEl = document.getElementById(`${id}-magnified`);
                    if (magnifiedEl) {
                        magnifiedEl.addEventListener('mouseover', function() {
                            // Apply hover effect to the magnified element itself
                            // Only if it's currently the target (active)
                            if (currentTarget === id && 
                                !this.classList.contains("correct") &&
                                !this.classList.contains("partial") &&
                                !this.classList.contains("fail") &&
                                !this.classList.contains("given-up") &&
                                !this.classList.contains("incorrect-temp")) {
                                this.classList.add("hover-state");
                            }
                        });
                        magnifiedEl.addEventListener('mouseout', function() {
                            this.classList.remove("hover-state");
                        });

                        magnifiedEl.addEventListener("click", () => {
                            // Call the general click handler, passing the original state ID ("DC")
                            // The logic within handleStateClick will determine if it's correct/incorrect
                            handleStateClick(id);
                        });
                        // Initialize magnified state as inactive until it becomes the target
                        magnifiedEl.classList.add("inactive-magnified");
                    }
                } else {
                    // For all other regular states, attach event listeners directly to the path
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
                }
            } else {
                console.warn(`Element with ID "${id}" not found in the SVG. Check your SVG or selector.`);
            }
        });

        // Start the first round of the game
        pickNewTarget();
    })
    .catch(err => console.error("Failed to load SVG:", err));
