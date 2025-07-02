let states = []; // Will store 2-letter abbreviations (e.g., "NY", "CA")
let currentTarget = null; // Will store the 2-letter abbreviation of the target state
let score = 0;
let total = 0;
const attempts = {};

// Helper function to map 2-letter abbr to full state name for display
// You'll need to expand this mapping for all states
function getFullStateName(abbr) {
    const nameMap = {
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
    return nameMap[abbr] || abbr; // Return full name, fallback to abbr if not found
}

function pickNewTarget() {
    // Filter based on 2-letter IDs
    const remaining = states.filter(id => {
        const el = document.getElementById(id); // Use the 2-letter ID
        return el && !el.classList.contains("correct") && !el.classList.contains("partial") && !el.classList.contains("fail");
    });

    if (remaining.length === 0) {
        document.getElementById("target-state").textContent = "All done! 🎉";
        return;
    }

    currentTarget = remaining[Math.floor(Math.random() * remaining.length)];
    // Display the full state name for the user
    document.getElementById("target-state").textContent = getFullStateName(currentTarget);
}

function updateScoreDisplay() {
    const percentage = (total > 0) ? ((score / total) * 100).toFixed(1) : 0; // Prevent division by zero
    document.getElementById("score").textContent = `${score} / ${total} (${percentage}%)`;
}

fetch("us.svg")
    .then(res => res.text())
    .then(svg => {
        document.getElementById("map-container").innerHTML = svg;

        // CRITICAL CHANGE: Select all <path> elements that have an ID.
        // Assuming your SVG state paths have IDs like "AL", "NY", "CA"
        states = Array.from(document.querySelectorAll("#map-container path[id]"))
                      .map(p => p.id)
                      // Optional: Filter out non-state IDs if your SVG has other path elements
                      .filter(id => id.length === 2 && getFullStateName(id) !== id); // Ensures it's a valid 2-letter state abbr

        total = states.length; // Now correctly reflects the number of states

        document.getElementById("total-states").textContent = total;
        updateScoreDisplay();
        pickNewTarget();

        // Attach event listeners to all state paths identified
        states.forEach(id => {
            attempts[id] = 0; // Initialize attempts for each state (by its 2-letter ID)

            const el = document.getElementById(id); // Get the element by its 2-letter ID
            if (el) { // Ensure the element exists before trying to manipulate it
                // Remove inline styles that might override CSS
                el.removeAttribute("style");
                el.removeAttribute("fill");
                el.style.cursor = "pointer"; // Add pointer cursor via JS for clarity

                // Add hover effects via JS (or preferably CSS)
                el.addEventListener('mouseover', () => {
                    if (!el.classList.contains("correct") && !el.classList.contains("partial") && !el.classList.contains("fail")) {
                        el.classList.add("hover"); // Add a 'hover' class for CSS styling
                    }
                });
                el.addEventListener('mouseout', () => {
                    el.classList.remove("hover");
                });


                el.addEventListener("click", () => {
                    // Check if the clicked state is the one to be found, OR if the current target has failed
                    // Logic here seems to assume you MUST click the currentTarget if it's failed
                    if (attempts[currentTarget] >= 5) {
                        if (id === currentTarget) { // Correctly clicked the failed target
                            const targetEl = document.getElementById(currentTarget);
                            targetEl.classList.remove("fail");
                            targetEl.classList.add("correct"); // Mark as correct (even though it failed earlier)
                            score++; // Score for getting it correct after failing
                            updateScoreDisplay();
                            pickNewTarget();
                        } else {
                            // Clicking other states while target is failed: give visual feedback
                            el.classList.add("incorrect");
                            setTimeout(() => el.classList.remove("incorrect"), 800);
                        }
                        return; // Stop further processing for this click
                    }

                    if (id !== currentTarget) {
                        // Wrong guess
                        attempts[currentTarget]++;
                        const targetEl = document.getElementById(currentTarget); // Get the current target element

                        if (attempts[currentTarget] >= 5) {
                            targetEl.classList.add("fail"); // Mark the target state as "fail"
                        }

                        el.classList.add("incorrect"); // Mark the *clicked* state as incorrect
                        setTimeout(() => el.classList.remove("incorrect"), 800);

                    } else {
                        // Correct guess
                        const wrongGuesses = attempts[currentTarget]; // How many times was the target missed before being found?

                        // Apply classes based on previous attempts
                        if (wrongGuesses >= 5) {
                            // This path should ideally be handled by the `if (attempts[currentTarget] >= 5)` block at the top
                            // If code reaches here, it means it's the correct target but it was previously failed.
                            // The score logic here is a bit ambiguous with `fail`.
                            // It's already marked `correct` above if it was `fail` and then correctly clicked.
                            // Consider if you want to score a "failed" state differently when it's eventually clicked correctly.
                             el.classList.add("correct"); // Still mark it correct if it's the right one
                             // score is already incremented above if it's a failed state that's now correct
                        } else if (wrongGuesses > 0) {
                            el.classList.add("partial"); // Correct, but took multiple tries
                            score++; // Score for partial success
                        } else {
                            el.classList.add("correct"); // Correct on first try
                            score++; // Score for perfect success
                        }

                        updateScoreDisplay();
                        pickNewTarget();
                    }
                });
            } else {
                console.warn(`Element with ID "${id}" not found in the SVG. Check your SVG or selector.`);
            }
        });
    })
    .catch(err => console.error("Failed to load SVG:", err));

// Add a DOMContentLoaded listener to wrap your fetch call,
// ensuring the script doesn't try to access map-container before it exists.
// Though your current fetch already runs after DOMContentLoaded due to script placement.
// It's good practice for larger scripts.
document.addEventListener("DOMContentLoaded", () => {
    // All your existing fetch and game setup code goes here.
    // The fetch call is already outside, so this is just for organization.
});
