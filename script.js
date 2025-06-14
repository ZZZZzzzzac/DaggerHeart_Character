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

// --- TriStateCheckbox Class ---

class TriStateCheckbox {
    /**
     * Creates a tri-state checkbox.
     * @param {HTMLElement} labelElement The label element that acts as the checkbox.
     */
    constructor(labelElement) {
        this.label = labelElement;
        // State: 0 = normal, 1 = checked (full), 2 = dashed
        this.state = parseInt(this.label.dataset.state) || 0;
        this.isTwoState = this.label.classList.contains('two-state');
        this.updateVisuals();

        this.label.addEventListener('click', this.handleClick.bind(this));
        this.label.addEventListener('contextmenu', this.handleRightClick.bind(this));
    }

    handleClick(event) {
        event.preventDefault();
        // Left-click toggles between normal (0) and checked (1)
        this.state = this.state === 1 ? 0 : 1;
        this.updateVisuals();
        saveFormStateToCookie(); // Save state on change
    }

    handleRightClick(event) {
        event.preventDefault();
        if (this.isTwoState) {
            return; // Do nothing for two-state checkboxes
        }
        // Right-click toggles between normal (0) and dashed (2)
        this.state = this.state === 2 ? 0 : 2;
        this.updateVisuals();
        saveFormStateToCookie(); // Save state on change
    }

    updateVisuals() {
        this.label.dataset.state = this.state;
        this.label.classList.remove('state-checked', 'state-dashed');
        if (this.state === 1) {
            this.label.classList.add('state-checked');
        } else if (this.state === 2) {
            this.label.classList.add('state-dashed');
        }
    }

    setState(newState) {
        this.state = parseInt(newState) || 0;
        this.updateVisuals();
    }
}


// --- Form State Management ---
 
 /**
  * Exports the current state of all relevant form elements on the page.
  * @returns {object} An object containing the form state.
  */
 function exportFormState() {
     const state = {};
     // Textareas and text inputs
     const textElements = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
     textElements.forEach(el => {
         if (el.name) {
             state[el.name] = el.value;
         }
     });

     // Tri-state checkboxes
     const checkboxLabels = document.querySelectorAll('.base-checkbox');
     checkboxLabels.forEach(label => {
         if (label.id) {
             state[label.id] = label.dataset.state || '0';
         }
     });
 
     return state;
 }
 
 /**
  * Imports a given state into the form elements on the page.
  * @param {object} state - The state object to import.
  */
 function importFormState(state) {
     for (const name in state) {
         if (Object.hasOwnProperty.call(state, name)) {
             const value = state[name];
             // Handle textareas and inputs
             const textElement = document.querySelector(`[name="${name}"]`);
             if (textElement) {
                 textElement.value = value;
             }

             // Handle tri-state checkboxes by finding the label
             const checkboxLabel = document.getElementById(name);
             if (checkboxLabel && checkboxLabel.classList.contains('base-checkbox')) {
                 if (checkboxLabel.checkboxInstance) {
                     checkboxLabel.checkboxInstance.setState(value);
                 } else {
                     // Fallback for elements not yet initialized
                     checkboxLabel.dataset.state = value;
                 }
             }
         }
     }
 }

/**
 * Saves the current form state to a cookie. This is the reliable way.
 */
function saveFormStateToCookie() {
    const formState = exportFormState();
    // Set a cookie that expires in 7 days. samesite=strict is a good practice.
    document.cookie = `characterSheetData=${JSON.stringify(formState)};path=/;max-age=604800;samesite=strict`;
    console.log('角色表单数据已保存到Cookie。', document.cookie);
}

/**
 * Loads form state from a cookie and populates the form.
 */
function loadFormStateFromCookie() {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(c => c.startsWith('characterSheetData='));
    
    if (cookie) {
        try {
            const jsonString = cookie.substring('characterSheetData='.length);
            // Ensure jsonString is not empty before parsing
            if (jsonString) {
                const formState = JSON.parse(jsonString);
                importFormState(formState);
                console.log('角色表单数据已从Cookie加载。');
            }
        } catch (error) {
            console.error('无法解析角色表单数据Cookie:', error);
        }
    }
    else {
        console.log('没有找到角色表单数据Cookie。');
    }
}

// On page load, load the state and then set up listeners for real-time saving.
function setDefaultSlotStates() {
    // Set default states for HP and Stress slots
    // This runs before loading from cookie, so cookie data will override this.
    for (let i = 1; i <= 12; i++) {
        const hpLabel = document.getElementById(`HpSlotCheckbox${i}`);
        const stressLabel = document.getElementById(`StressSlotCheckbox${i}`);

        if (i > 6) {
            if (hpLabel) hpLabel.dataset.state = '2'; // Dashed
            if (stressLabel) stressLabel.dataset.state = '2'; // Dashed
        } else {
            if (hpLabel) hpLabel.dataset.state = '0'; // Empty
            if (stressLabel) stressLabel.dataset.state = '0'; // Empty
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    // 1. Set default states for slots first.
    setDefaultSlotStates();

    // 2. Initialize all TriStateCheckboxes. The constructor will pick up the default state.
    const checkboxLabels = document.querySelectorAll('.base-checkbox');
    checkboxLabels.forEach(label => {
        // Attach the instance to the element for easy access later
        label.checkboxInstance = new TriStateCheckbox(label);
    });

    // 3. Load any saved data from cookie. This will override the defaults if data exists.
    loadFormStateFromCookie();

    // 4. Add event listeners to all non-checkbox form elements to save state on every change.
    // Checkbox saving is now handled within the TriStateCheckbox class.
    const elements = document.querySelectorAll('input[type="text"], input[type="number"], textarea');
    elements.forEach(el => {
        el.addEventListener('input', saveFormStateToCookie);
    });
});
