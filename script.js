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



// --- Form State Management ---
 




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
    const elements = document.querySelectorAll('.base-textbox');
    elements.forEach(el => {
        el.addEventListener('input', saveFormStateToLocalStorage);
    });

    // 5. Setup action buttons
    setupActionButtons();

    // 6. Setup specific data table buttons
    const addSecondaryWeaponBtn = document.getElementById('add-secondary-weapon-btn');
    if (addSecondaryWeaponBtn) {
        addSecondaryWeaponBtn.addEventListener('click', () => {
            // Ensure the global variable exists before using it
            if (typeof SECONDARY_WEAPON === 'undefined') {
                console.error('Data source variable "SECONDARY_WEAPON" is not defined.');
                alert('错误：副武器数据源未定义。');
                return;
            }

            const modalConfig = {
                title: "选择副武器",
                filterableColumns: ["trait", "range", "tier"],
                storageKey: "secondaryWeaponFilterState"
            };

            showDataTableModal(SECONDARY_WEAPON, (selectedItem) => {
                // Direct mapping
                const targetMap = {
                    "name": "SecondaryWeaponNameTextbox",
                    "damage": "SecondaryWeaponDamageTextbox",
                    "desc": "SecondaryWeaponTraitTextbox"
                };
                for (const sourceKey in targetMap) {
                    const targetElement = document.getElementById(targetMap[sourceKey]);
                    if (targetElement) {
                        targetElement.value = selectedItem[sourceKey] || '';
                    }
                }

                // Composite target
                const compositeTarget = {
                    targetId: "SecondaryWeaponStatTextbox",
                    format: "{trait}／{range}"
                };
                const compositeTargetElement = document.getElementById(compositeTarget.targetId);
                if (compositeTargetElement) {
                    let formattedString = compositeTarget.format;
                    const placeholders = formattedString.match(/{[^{}]+}/g) || [];
                    placeholders.forEach(placeholder => {
                        const key = placeholder.substring(1, placeholder.length - 1);
                        const value = selectedItem[key] || '';
                        formattedString = formattedString.replace(placeholder, value);
                    });
                    compositeTargetElement.value = formattedString;
                }
                
                // Trigger a save to persist the new data
                if (typeof saveFormStateToLocalStorage === 'function') {
                    saveFormStateToLocalStorage();
                }
            }, modalConfig);
        });
    }
});


