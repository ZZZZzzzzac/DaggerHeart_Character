/**
 * Exports the current state of all relevant form elements on the page.
 * @returns {object} An object containing the form state.
 */
function exportFormState() {
    const state = {};
    // Use the .base-textbox class to select all relevant text fields
    const textElements = document.querySelectorAll('.base-textbox');
    textElements.forEach(el => {
        // Use ID as the key, which matches the provided JSON structure
        if (el.id) {
            state[el.id] = el.value;
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
    for (const id in state) {
        if (Object.hasOwnProperty.call(state, id)) {
            const value = state[id];
            // Handle textareas and inputs by ID
            const textElement = document.getElementById(id);
            if (textElement && textElement.classList.contains('base-textbox')) {
                textElement.value = value;
            }

            // Handle tri-state checkboxes by finding the label by ID
            const checkboxLabel = document.getElementById(id);
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
 * Saves the current form state to Local Storage.
 */
function saveFormStateToLocalStorage() {
    const formState = exportFormState();
    // localStorage can handle the raw string without encoding.
    localStorage.setItem('characterSheetData', JSON.stringify(formState));
}

/**
 * Loads form state from Local Storage and populates the form.
 */
function loadFormStateFromLocalStorage() {
    const jsonString = localStorage.getItem('characterSheetData');
    if (jsonString) {
        try {
            const formState = JSON.parse(jsonString);
            importFormState(formState);
            console.log('角色表单数据已从 Local Storage 加载。');
        } catch (error) {
            console.error('无法解析 Local Storage 中的角色表单数据:', error);
        }
    } else {
        console.log('没有在 Local Storage 中找到角色表单数据。');
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
                saveFormStateToLocalStorage(); // Save imported state immediately
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