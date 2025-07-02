let states = []; // Will store 2-letter abbreviations (e.g., "NY", "CA")
let currentTarget = null; // Will store the 2-letter abbreviation of the target state
let score = 0;
let total = 0;
const attempts = {}; // Tracks INCORRECT attempts for the *current* target state
let currentFailedTargetId = null; // Tracks if the user has given up on a state (turns red permanently)

// Helper function to map 2-letter abbr to full state name for display
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
};

function getFullStateName(abbr) {
    return stateNames[abbr] || abbr;
}

function pickNewTarget() {
    // Filter out states that are already 'correct' or 'failed'
    const remaining = states.filter(id => {
        const el = document.getElementById(id);
        return el && !el.classList.contains("correct") && !el.classList.contains("permanent-fail");
    });

    if (remaining.length === 0) {
        document.getElementById("target-state").textContent = "All done! 🎉";
        currentFailedTargetId = null; // Clear any pending failed state
        return;
    }

    // Reset attempts for the new target
    if (currentTarget) {
        attempts[currentTarget] = 0; // Reset attempts for the *previous* target
    }
    currentFailedTargetId = null; // Clear any previously acknowledged failed state

    currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
    document.getElementById("target-state").textContent = getFullStateName(currentTarget);
    
    // Visually reset the map (if needed for states that were temporarily styled)
    states.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove("incorrect-flash"); // Ensure any flash is gone
            el.classList.remove("target-highlight"); // Remove any previous target highlight
            // If you added a specific highlight for the current target, apply it here:
            if (id === currentTarget) {
                el.classList.add("target-highlight"); // Optional: Highlight the target state
            }
        }
    });
}

function updateScoreDisplay() {
    const percentage = (total > 0) ? ((score / total) * 100).toFixed(1) : 0; // Prevent division by zero
    document.getElementById("score").textContent = `${score} / ${total} (${percentage}%)`;
}

// Global click handler for states
function handleStateClick(clickedId) {
    const clickedEl = document.getElementById(clickedId);
    if (!clickedEl) return; // Should not happen if states array is correct

    // --- Scenario 1: Acknowledging a failed target ---
    if (currentFailedTargetId && clickedId === currentFailedTargetId) {
        clickedEl.classList.remove("fail"); // Remove temporary fail if it was there
        clickedEl.classList.add("permanent-fail"); // Mark as permanently failed (red)
        currentFailedTargetId = null; // Clear this flag
        // The failed state no longer participates in game logic
        pickNewTarget(); // Move to the next state
        return; // Stop further processing for this click
    }

    // --- Scenario 2: Clicks when a target hasn't been failed yet ---
    if (clickedId === currentTarget) {
        // Correct Guess
        const wrongGuesses = attempts[currentTarget] || 0; // Number of incorrect guesses for this target

        if (wrongGuesses === 0) {
            // First try correct
            clickedEl.classList.remove("target-highlight"); // Remove highlight if it was there
            clickedEl.classList.add("correct"); // Green
            score++;
        } else {
            // Correct after misses
            clickedEl.classList.remove("target-highlight"); // Remove highlight if it was there
            clickedEl.classList.add("partial"); // Yellow
            score++; // Still gets a point, just marked differently
        }
        
        // Disable further clicks on this state
        clickedEl.style.pointerEvents = 'none';

        updateScoreDisplay();
        pickNewTarget(); // Move to the next state

    } else {
        // Incorrect Guess
        if (!attempts[currentTarget]) {
            attempts[currentTarget] = 0; // Initialize if not set
        }
        attempts[currentTarget]++;

        clickedEl.classList.add("incorrect-flash"); // Temporarily mark clicked state red
        setTimeout(() => {
            clickedEl.classList.remove("incorrect-flash");
        }, 800); // Remove flash after 0.8 seconds

        // Check if the current target state should now turn permanently red
        if (attempts[currentTarget] >= 5) {
            const targetEl = document.getElementById(currentTarget);
            if (targetEl) {
                targetEl.classList.add("fail"); // Current target state turns red
                currentFailedTargetId = currentTarget; // Set flag that this state needs acknowledgement
            }
            // Do NOT pick a new target here. User must click the failed state.
            // The "Find:" text will still show the failed state.
        }
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

        // Get all state IDs from the loaded SVG
        // Ensure your SVG path IDs are 2-letter abbreviations (e.g., "AL", "NY")
        states = Array.from(document.querySelectorAll("#map-container path[id]"))
                      .map(p => p.id)
                      // Optional: Filter out non-state IDs if your SVG has other path elements
                      .filter(id => id.length === 2 && stateNames[id]); // Ensures it's a valid 2-letter state abbr

        total = states.length;

        document.getElementById("total-states").textContent = total;
        updateScoreDisplay(); // Initialize score display

        // Attach event listeners to all identified state paths
        states.forEach(id => {
            attempts[id] = 0; // Initialize attempts for each state (by its 2-letter ID)

            const el = document.getElementById(id);
            if (el) {
                el.removeAttribute("style"); // Remove any inline styles from SVG
                el.removeAttribute("fill");  // Remove inline fill from SVG
                // Pointer-events will be controlled by CSS classes and JS if needed

                // Add mouseover/mouseout for hover effect (using CSS class)
                el.addEventListener('mouseover', () => {
                    // Only apply hover if not already marked correct/partial/permanent-fail
                    if (!el.classList.contains("correct") && !el.classList.contains("partial") && !el.classList.contains("permanent-fail") && !el.classList.contains("fail")) {
                        el.classList.add("hover-state");
                    }
                });
                el.addEventListener('mouseout', () => {
                    el.classList.remove("hover-state");
                });

                // Attach the main click handler
                el.addEventListener("click", () => handleStateClick(id));
            } else {
                console.warn(`Element with ID "${id}" not found in the SVG. Check your SVG or selector.`);
            }
        });

        // Start the first round of the game
        pickNewTarget();
    })
    .catch(err => console.error("Failed to load SVG:", err));

// DOMContentLoaded is implicitly handled by script placement or not strictly necessary for this structure
// if the script tag is at the end of <body> as you have it.
