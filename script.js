// Hard-coded debug mode switch
const DEBUG_MODE = false;

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

    // 4. Add event listeners to all non-checkbox form elements to save state on every change.
    // Checkbox saving is now handled within the TriStateCheckbox class.
    // const elements = document.querySelectorAll('.base-textbox');
    // elements.forEach(el => {
    //     el.addEventListener('input', saveFormStateToLocalStorage);
    // });

    // 5. Setup action buttons
    setupGlobalActionButtons(); // This function is in action.js
    setupDataModalButtons(); // This function is defined below
    updateCardSize(); // Apply initial card size

    // 6. Save all data to local storage before the page is unloaded (closed, refreshed, etc.)
    window.addEventListener('beforeunload', saveFormStateToLocalStorage);

    // --- Card Size Control Listeners ---
    const widthInput = document.getElementById('card-width-input');
    widthInput.addEventListener('blur', updateCardSize);
});
