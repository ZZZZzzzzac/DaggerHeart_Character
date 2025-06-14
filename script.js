// Hard-coded debug mode switch
const DEBUG_MODE = true;

function applyDebugStyles() {
    if (!DEBUG_MODE) return;

    // --- Apply to textboxes ---
    const allTextboxes = document.querySelectorAll('.base-textbox');
    allTextboxes.forEach(textbox => {
        textbox.classList.add('debug-mode');
    });

    // --- Apply to checkboxes ---
    const allCheckboxWrappers = document.querySelectorAll('.base-checkbox-wrapper');
    allCheckboxWrappers.forEach(wrapper => {
        wrapper.classList.add('debug-mode');
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

// --- Form State Management ---

/**
 * Exports the current state of all relevant form elements on the page.
 * @returns {object} An object containing the form state.
 */
function exportFormState() {
    const state = {};
    const elements = document.querySelectorAll('input[type="text"], input[type="number"], textarea, input[type="checkbox"]');

    elements.forEach(el => {
        if (el.name) {
            if (el.type === 'checkbox') {
                state[el.name] = el.checked;
            } else {
                state[el.name] = el.value;
            }
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
            const element = document.querySelector(`[name="${name}"]`);

            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = value;
                } else {
                    element.value = value;
                }
            } else {
                console.log(`未找到名为 '${name}' 的元素`);
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
window.addEventListener('DOMContentLoaded', () => {
    // 1. Load any saved data first.
    loadFormStateFromCookie();

    // 2. Add event listeners to all form elements to save state on every change.
    // This is more reliable than 'beforeunload'.
    const elements = document.querySelectorAll('input[type="text"], input[type="number"], textarea, input[type="checkbox"]');
    elements.forEach(el => {
        // 'input' event for textareas and text fields for immediate feedback
        el.addEventListener('input', saveFormStateToCookie);
        // 'change' event for checkboxes
        el.addEventListener('change', saveFormStateToCookie);
    });
});
