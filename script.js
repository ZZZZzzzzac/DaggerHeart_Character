// Hard-coded debug mode switch
const DEBUG_MODE = true;

function applyDebugStyles() {
    if (!DEBUG_MODE) return;

    // --- Apply to textboxes ---
    const allTextboxes = document.querySelectorAll('.base-textbox');
    allTextboxes.forEach(textbox => {
        textbox.classList.add('debug-mode');
        const container = textbox.closest('.control-container');
        const coordsDisplay = document.getElementById(textbox.id + 'Coords');

        if (container && coordsDisplay) {
            const computedStyle = getComputedStyle(container);
            const topValue = computedStyle.top;
            const leftValue = computedStyle.left;
            coordsDisplay.textContent = `T:${topValue}, L:${leftValue}`;
        } else {
            console.warn(`Could not find container or coords display for textbox with id: ${textbox.id}`);
        }
    });

    // --- Apply to checkboxes ---
    // We need to find all checkbox wrappers. A bit more complex without a shared base class for all wrappers.
    // Let's assume all checkbox wrappers have an ID ending in 'Wrapper'. This is brittle.
    // A better approach would be to add a common class like 'base-checkbox-wrapper' to all of them in the HTML.
    // The current HTML has this, so we'll use it.
    const allCheckboxWrappers = document.querySelectorAll('.base-checkbox-wrapper');
    allCheckboxWrappers.forEach(wrapper => {
        wrapper.classList.add('debug-mode');
        const container = wrapper.closest('.control-container');
        // The coords display ID is not as predictable. Let's find it inside the wrapper.
        const coordsDisplay = wrapper.querySelector('.coords-display');

        if (container && coordsDisplay) {
            const computedStyle = getComputedStyle(container);
            const topValue = computedStyle.top;
            const leftValue = computedStyle.left;
            coordsDisplay.textContent = `T:${topValue}, L:${leftValue}`;
        } else {
             console.warn(`Could not find container or coords display for checkbox wrapper with id: ${wrapper.id}`);
        }
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
