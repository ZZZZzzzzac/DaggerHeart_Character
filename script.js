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

    // 5. Setup action buttons
    setupActionButtons();
});

function setupActionButtons() {
    const importBtn = document.getElementById('import-json-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const printBtn = document.getElementById('print-pdf-btn');
    const fileInput = document.getElementById('json-upload');

    // Export functionality
    exportBtn.addEventListener('click', () => {
        const state = exportFormState();
        const dataStr = JSON.stringify(state, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        const characterName = state.NameTextbox || 'character';
        link.download = `${characterName}_daggerheart.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    // Import functionality
    importBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const state = JSON.parse(e.target.result);
                importFormState(state);
                saveFormStateToCookie(); // Save imported state immediately
                alert('JSON文件已成功导入！');
            } catch (error) {
                console.error('导入JSON失败:', error);
                alert('导入失败，请检查文件格式是否正确。');
            }
        };
        reader.readAsText(file);
        // Reset file input to allow uploading the same file again
        fileInput.value = '';
    });

    // Print functionality
    printBtn.addEventListener('click', () => {
        // --- Textarea to Div replacement logic for printing ---
        const textareas = document.querySelectorAll('.base-textbox');
        const replacements = [];

        textareas.forEach(ta => {
            const div = document.createElement('div');
            div.className = ta.className;
            div.style.cssText = ta.style.cssText;
            div.style.display = 'flex';
            div.innerHTML = ta.value.replace(/\n/g, '<br>');
            div.classList.add('print-replacement'); // Add a class to identify them
            
            ta.style.display = 'none';
            ta.parentNode.insertBefore(div, ta);
            replacements.push({ original: ta, replacement: div });
        });

        // Use a short timeout to allow the DOM to update before printing
        setTimeout(() => {
            window.print();

            // --- Restore original textareas after printing ---
            replacements.forEach(pair => {
                pair.original.style.display = '';
                pair.replacement.remove();
            });
        }, 100); // 100ms delay
    });
}
