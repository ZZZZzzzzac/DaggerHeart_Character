// Hard-coded debug mode switch
const DEBUG_MODE = false;

/**
 * Removes basic Markdown formatting (bold, italics) from a string.
 * @param {string} text The input text.
 * @returns {string} The text with formatting removed.
 */
function removeMarkdownFormatting(text) {
    if (typeof text !== 'string') {
        return text;
    }
    // Remove bold (**text** or __text__), italics (*text* or _text_), and convert \n to newlines
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/\\n/g, '\n');
}

function applyDebugStyles() {
    if (!DEBUG_MODE) return;

    // --- Apply to textboxes ---
    const allTextboxes = document.querySelectorAll('.base-textbox');
    allTextboxes.forEach(textbox => {
        textbox.classList.add('debug-mode');
    });

    // --- Apply to checkboxes ---
    const allCheckboxes = document.querySelectorAll('.base-checkbox');
    allCheckboxes.forEach(checkbox => {
        checkbox.classList.add('debug-mode');
    });
}

// Run debug mode initialization once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', applyDebugStyles);

// Prevent zooming with Ctrl+mouse wheel or Ctrl+/-
document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-')) {
        event.preventDefault();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // 1. Set default states for slots first.
    setDefaultSlotStates();

    // 2. Initialize all TriStateCheckboxes. The constructor will pick up the default state.
    const checkboxLabels = document.querySelectorAll('.base-checkbox');
    checkboxLabels.forEach(label => {
        // Attach the instance to the element for easy access later
        label.checkboxInstance = new TriStateCheckbox(label);
    });

    // 3. Load any saved data from Local Storage. This will override the defaults if data exists.
    loadFormStateFromLocalStorage();

    // 5. Setup action buttons
    setupGlobalActionButtons(); // This function is in action.js
    setupDataModalButtons(); // This function is defined below
    updateCardSize(); // Apply initial card size
    setupTooltips(); // Initialize tooltips

    // 6. Save all data to local storage before the page is unloaded (closed, refreshed, etc.)
    window.addEventListener('beforeunload', saveFormStateToLocalStorage);

    // --- Card Size Control Listeners ---
    const widthInput = document.getElementById('card-width-input');
    widthInput.addEventListener('blur', updateCardSize);
});
/**
 * Sets up tooltips for all elements with a 'data-tooltip' attribute.
 */
function setupTooltips() {
    let tooltipElement = null;
    let tooltipTimeout = null;
    let lastMouseX = 0;
    let lastMouseY = 0;

    document.querySelectorAll('[data-tooltip]').forEach(element => {
        // Always track the mouse position over the element
        element.addEventListener('mousemove', (event) => {
            // We use pageX/pageY to get coordinates relative to the whole document
            lastMouseX = event.pageX;
            lastMouseY = event.pageY;
            
            // If the tooltip is already visible, move it
            if (tooltipElement) {
                tooltipElement.style.left = `${lastMouseX}px`;
                tooltipElement.style.top = `${lastMouseY + 20}px`;
            }
        });

        element.addEventListener('mouseenter', (event) => {
            const tooltipText = element.getAttribute('data-tooltip');
            if (!tooltipText) return;

            // Store the initial position relative to the document
            lastMouseX = event.pageX;
            lastMouseY = event.pageY;

            // Set a timeout to show the tooltip after 1 second
            tooltipTimeout = setTimeout(() => {
                // Create tooltip element
                tooltipElement = document.createElement('div');
                tooltipElement.className = 'tooltip';
                tooltipElement.textContent = tooltipText;
                document.body.appendChild(tooltipElement);

                // Position the tooltip using the LATEST document coordinates
                tooltipElement.style.left = `${lastMouseX}px`;
                tooltipElement.style.top = `${lastMouseY + 20}px`;

                // Fade in
                setTimeout(() => {
                    if (tooltipElement) tooltipElement.classList.add('visible');
                }, 10); // Short delay for the fade-in transition
            }, 1000); // 1-second delay
        });

        element.addEventListener('mouseleave', () => {
            // Clear the timeout if the mouse leaves before the tooltip appears
            clearTimeout(tooltipTimeout);

            if (tooltipElement) {
                tooltipElement.classList.remove('visible');
                // Remove from DOM after transition
                setTimeout(() => {
                    if (tooltipElement && !tooltipElement.classList.contains('visible')) {
                        tooltipElement.remove();
                        tooltipElement = null;
                    }
                }, 200); // Matches the CSS transition duration
            }
        });
    });
}