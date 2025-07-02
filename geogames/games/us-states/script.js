let states = []; // Stores 2-letter state abbreviations (e.g., "NY", "CA")
let currentTarget = null; // The 2-letter abbreviation of the state to find
let score = 0;
let total = 0;
const attempts = {}; // attempts[stateId] stores incorrect clicks for the *current* target
const failedStates = new Set(); // Stores IDs of states user has "given up" on

// Helper function to map 2-letter abbr to full state name for display
// This map is useful because it's guaranteed to be complete and consistent
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
    return stateNames[abbr] || abbr; // Returns full name, falls back to abbr if not found
}

function pickNewTarget() {
    // Filter out states that are already 'correct' or 'partial' or in the 'failedStates' Set
    const remaining = states.filter(id => {
        const el = document.getElementById(id);
        return el &&
               !el.classList.contains("correct") &&
               !el.classList.contains("partial") &&
               !failedStates.has(id);
    });

    // Reset the 'fail' class on the *previous* current target if it was there
    // This is important if the user failed a state, then gave up, and we moved on.
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

    // Pick a new random target from the remaining states
    currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
    // Reset attempts for the newly selected target state
    attempts[currentTarget] = 0; 

    // Display the full name of the target state
    document.getElementById("target-state").textContent = getFullStateName(currentTarget);
}

function updateScoreDisplay() {
    // Prevent division by zero if total is 0
    const percentage = (total > 0) ? ((score / total) * 100).toFixed(1) : 0;
    document.getElementById("score").textContent = `${score} / ${total} (${percentage}%)`;
}


// --- Main Game Setup on SVG Load ---
fetch("us.svg")
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
    })
    .then(svg => {
        document.getElementById("map-container").innerHTML = svg;

        // Select all path elements within the map-container that have an ID
        // Filter to ensure it's a valid 2-letter state abbreviation
        states = Array.from(document.querySelectorAll("#map-container path[id]"))
                      .map(p => p.id)
                      .filter(id => id.length === 2 && stateNames[id]);

        total = states.length;

        document.getElementById("total-states").textContent = total;
        updateScoreDisplay(); // Initialize score display

        // Attach event listeners and clean up inline styles for all identified state paths
        states.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                // *** CRITICAL FIX: Remove inline styles to allow CSS classes to control appearance ***
                el.removeAttribute("style");
                el.removeAttribute("fill");
                // (Your CSS rules will now correctly apply default fill and stroke)

                // Add mouseover/mouseout for hover effect (using CSS class)
                el.addEventListener('mouseover', function() {
                    // Only apply hover if not already marked as a final state or active feedback state
                    if (!this.classList.contains("correct") &&
                        !this.classList.contains("partial") &&
                        !this.classList.contains("fail") && // Allow hover on 'fail' if clickable
                        !this.classList.contains("given-up") &&
                        !this.classList.contains("incorrect-temp")) {
                        this.classList.add("hover-state");
                    }
                });
                el.addEventListener('mouseout', function() {
                    this.classList.remove("hover-state");
                });

                // Attach the main click handler
                el.addEventListener("click", () => {
                    if (!currentTarget) return; // Game over or no target yet

                    // Get the element for the current target state (could be different from clicked `id`)
                    const currentTargetEl = document.getElementById(currentTarget);

                    // --- SCENARIO 1: Current target is marked 'fail' (red), user *must* click it to acknowledge ---
                    if (currentTargetEl && currentTargetEl.classList.contains("fail")) {
                        if (id === currentTarget) {
                            // User clicked the correct failed target state
                            currentTargetEl.classList.remove("fail"); // Remove pulsing red
                            currentTargetEl.classList.add("given-up"); // Apply permanent dark red
                            failedStates.add(currentTarget); // Add to the set of permanently failed states
                            pickNewTarget(); // Move to the next state
                        } else {
                            // User clicked a wrong state while a target was failed and waiting for acknowledgment
                            // Provide temporary visual feedback for the clicked wrong state
                            el.classList.remove("incorrect-temp"); // Reset animation if clicked rapidly
                            void el.offsetWidth; // Force reflow to restart CSS animation
                            el.classList.add("incorrect-temp");
                            // No score change, no change to the current target state's status
                            // The game waits for the user to click the `fail` state.
                        }
                        return; // Stop further processing in this click event
                    }

                    // --- SCENARIO 2: Normal gameplay (no failed target waiting for acknowledgment) ---
                    if (id !== currentTarget) {
                        // Incorrect Guess for the current target
                        attempts[currentTarget]++; // Increment incorrect attempt count for the *current* target

                        // Apply temporary red flash to the *clicked* state
                        el.classList.remove("incorrect-temp"); // Reset animation if rapid clicks
                        void el.offsetWidth; // Force reflow to restart CSS animation
                        el.classList.add("incorrect-temp");
                        
                        // Set a timeout to remove the 'incorrect-temp' class (duration matches CSS animation)
                        setTimeout(() => {
                            el.classList.remove("incorrect-temp");
                        }, 800); // Matches the 0.8s animation duration in CSS

                        if (attempts[currentTarget] >= 5) {
                            // Current target has exceeded max attempts, mark it as 'fail' (red, pulsating)
                            // This state is now awaiting user acknowledgment.
                            if (currentTargetEl) { // Ensure element exists
                                currentTargetEl.classList.add("fail");
                            }
                            // Do NOT pick a new target here. User *must* click the now-red `fail` state.
                        }

                    } else {
                        // Correct Guess for the current target
                        const wrongGuessesCount = attempts[currentTarget]; // Get count of wrong guesses for this state

                        if (wrongGuessesCount === 0) {
                            el.classList.add("correct"); // Green (first try)
                        } else {
                            el.classList.add("partial"); // Yellow (correct after misses)
                        }
                        score++; // Score increases for all successful guesses

                        // The CSS rules for .correct and .partial will handle `pointer-events: none;`
                        // So these states become non-clickable after being identified.

                        updateScoreDisplay();
                        pickNewTarget(); // Move to the next state
                    }
                });
            } else {
                console.warn(`Element with ID "${id}" not found in the SVG. Check your SVG or selector.`);
            }
        });

        // Start the first round of the game
        pickNewTarget();
    })
    .catch(err => console.error("Failed to load SVG:", err));
