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

    // --- Export Skill Cards ---
    state.cards = [];
    const cardElements = document.querySelectorAll('#card-container .skill-card');
    cardElements.forEach(cardEl => {
        if (cardEl.dataset.cardData) {
            try {
                const cardData = JSON.parse(cardEl.dataset.cardData);
                const position = {
                    left: cardEl.style.left,
                    top: cardEl.style.top
                };
                state.cards.push({ data: cardData, position: position });
            } catch (e) {
                console.error('Error processing card data on export:', e, cardEl.dataset.cardData);
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
    // Clear existing cards before importing new ones
    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
        cardContainer.innerHTML = '';
    }

    for (const id in state) {
        if (Object.hasOwnProperty.call(state, id)) {
            const value = state[id];
            // Handle textareas and inputs by ID
            const textElement = document.getElementById(id);
            if (textElement && textElement.classList.contains('base-textbox')) {
                // Remove markdown for specific textboxes
                if (id === 'ClassFeatureTextbox' || id.endsWith('TraitTextbox')) {
                    textElement.value = removeMarkdownFormatting(value);
                } else {
                    textElement.value = value;
                }
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

    // --- Import and Recreate Skill Cards ---
    if (Array.isArray(state.cards)) {
        state.cards.forEach(cardInfo => { // cardInfo is now {data, position}
            // Assuming createCard is a globally available function from script.js
            if (typeof createCard === 'function') {
                createCard(cardInfo);
            }
        });
    }
}

/**
 * Saves the current form state to Local Storage.
 */
function saveFormStateToLocalStorage() {
    const formState = exportFormState();
    // localStorage can handle the raw string without encoding.
    localStorage.setItem('characterSheetData', JSON.stringify(formState));
    console.log('角色表单数据已保存到 Local Storage。');
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

function clearForm() {
    console.log('Clearing form and resetting to default states...');
    // 1. Clear all textareas
    const textElements = document.querySelectorAll('.base-textbox');
    textElements.forEach(el => {
        el.value = '';
    });

    // 2. Reset all checkboxes to their initial state (0)
    const checkboxLabels = document.querySelectorAll('.base-checkbox');
    checkboxLabels.forEach(label => {
        if (label.checkboxInstance) {
            label.checkboxInstance.setState('0');
        } else {
            label.dataset.state = '0';
            // Manually update visuals for non-instantiated checkboxes
            label.classList.remove('state-checked', 'state-dashed');
        }
    });

    // 3. Apply the specific default states for HP and Stress slots
    setDefaultSlotStates();

    // 4. Ensure the visuals of HP and Stress checkboxes match the new default state
    for (let i = 1; i <= 12; i++) {
        const hpLabel = document.getElementById(`HpSlotCheckbox${i}`);
        const stressLabel = document.getElementById(`StressSlotCheckbox${i}`);
        if (hpLabel && hpLabel.checkboxInstance) {
            hpLabel.checkboxInstance.setState(hpLabel.dataset.state);
        }
        if (stressLabel && stressLabel.checkboxInstance) {
            stressLabel.checkboxInstance.setState(stressLabel.dataset.state);
        }
    }
    
    // 5. Clear the saved state from local storage
    localStorage.removeItem('characterSheetData');

    console.log('表单已清空并重置为默认状态。');
    alert('所有数据已被清空。刷新页面后将是全新的角色卡。');
}


function setupGlobalActionButtons() {
    const importBtn = document.getElementById('import-json-btn');
    const exportBtn = document.getElementById('export-json-btn');
    const printBtn = document.getElementById('print-pdf-btn');
    const clearBtn = document.getElementById('clear-form-btn');
    const fileInput = document.getElementById('json-upload');
    const customPackBtn = document.getElementById('upload-custom-pack-btn');
    const customPackInput = document.getElementById('custom-pack-upload');

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('你确定要清空所有数据吗？此操作无法撤销。')) {
                clearForm();
            }
        });
    }
    
    if (!importBtn || !exportBtn || !printBtn || !fileInput) {
        console.warn("一个或多个全局操作按钮未在DOM中找到。");
        return;
    }

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

    // Custom Pack Upload functionality
    if (customPackBtn && customPackInput) {
        customPackBtn.addEventListener('click', () => {
            customPackInput.click();
        });

        customPackInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const packData = JSON.parse(e.target.result);
                    const domainKeys = ["domain", "domain_card", "domains"];
                    const classKeys = ["class", "profession", "job"];
                    const subclassKeys = ["subclass", "subclass_card", "subclasses"];

                    for (const key in packData) {
                        const lowerKey = key.toLowerCase();
                        if (domainKeys.includes(lowerKey)) {
                            if (typeof add_custom_domain_card === 'function') {
                                add_custom_domain_card(packData[key]);
                            } else {
                                console.error('add_custom_domain_card function not found.');
                                alert('错误：处理领域卡的函数未找到。');
                            }
                        } else if (classKeys.includes(lowerKey)) {
                            if (typeof add_custom_class === 'function') {
                                add_custom_class(packData[key]);
                            } else {
                                console.error('add_custom_class function not found.');
                                alert('错误：处理职业的函数未找到。');
                            }
                        } else if (subclassKeys.includes(lowerKey)) {
                            if (typeof add_custom_subclass === 'function') {
                                add_custom_subclass(packData[key]);
                            } else {
                                console.error('add_custom_subclass function not found.');
                                alert('错误：处理子职业的函数未找到。');
                            }
                        }
                    }

                } catch (error) {
                    console.error('导入自定义卡包失败:', error);
                    alert('导入失败，请检查文件格式是否为有效的JSON。');
                }
            };
            reader.readAsText(file);
            customPackInput.value = ''; // Reset input
        });
    }


    // Print functionality
    printBtn.addEventListener('click', () => {
        // --- Prepare for printing ---
        const textareas = document.querySelectorAll('.base-textbox');
        const replacements = [];

        // 1. Replace textareas with divs for better printing
        textareas.forEach(ta => {
            const div = document.createElement('div');
            div.className = ta.className;
            div.style.cssText = ta.style.cssText;
            div.style.display = 'flex';
            div.innerHTML = ta.value.replace(/\n/g, '<br>');
            div.classList.add('print-replacement');
            
            ta.style.display = 'none';
            ta.parentNode.insertBefore(div, ta);
            replacements.push({ original: ta, replacement: div });
        });

        // 2. Create a temporary wrapper for printing
        const printWrapper = document.createElement('div');
        printWrapper.id = 'print-wrapper';
        const characterSheet = document.getElementById('character-sheet');
        const cardContainer = document.getElementById('card-container');
        const h3Container = document.getElementById('h3-container');

        // 3. Populate the h3-container
        h3Container.innerHTML = ''; // Clear previous content
        const h3TextElements = document.querySelectorAll('.h3-text');
        h3TextElements.forEach(ta => {
            if (ta.value && ta.value.trim() !== '') {
                let title = '';
                const id = ta.id;

                const titleMap = {
                    'ClassFeatureTextbox': '职业特性',
                    'EventLogTextbox': '事件记录',
                    'AvatarTextbox': '角色形象'
                };

                if (titleMap[id]) {
                    title = titleMap[id];
                } else if (id.includes('BackgroundAnswer')) {
                    const questionId = id.replace('Answer', 'Question');
                    const questionEl = document.getElementById(questionId);
                    title = questionEl ? questionEl.value : '背景'; // Fallback
                } else if (id.includes('ConnectAnswer')) {
                    const questionId = id.replace('Answer', 'Question');
                    const questionEl = document.getElementById(questionId);
                    title = questionEl ? questionEl.value : '连接'; // Fallback
                } else {
                    title = id.replace('Textbox', ''); // Default behavior
                }

                const contentDiv = document.createElement('div');
                contentDiv.className = 'h3-print-item';
                contentDiv.innerHTML = `<h4>${title}</h4><p>${ta.value.replace(/\n/g, '<br>')}</p>`;
                h3Container.appendChild(contentDiv);
            }
        });
        
        // Temporarily move the sheet, cards, and h3 container into the wrapper
        if (characterSheet) printWrapper.appendChild(characterSheet);
        if (cardContainer) printWrapper.appendChild(cardContainer);
        if (h3Container && h3Container.hasChildNodes()) {
            printWrapper.appendChild(h3Container);
        }
        
        document.body.appendChild(printWrapper);
        document.body.classList.add('printing');

        // --- Define the after-print cleanup ---
        window.onafterprint = () => {
            // 1. Restore original textareas
            replacements.forEach(pair => {
                pair.original.style.display = '';
                if (pair.replacement.parentNode) {
                    pair.replacement.parentNode.removeChild(pair.replacement);
                }
            });

            // 2. Move elements back to the body
            const originalSheetParent = document.body; // Or wherever it should be
            if (characterSheet) originalSheetParent.insertBefore(characterSheet, printWrapper);
            if (cardContainer) originalSheetParent.insertBefore(cardContainer, printWrapper);
            if (h3Container) {
                originalSheetParent.insertBefore(h3Container, printWrapper);
                h3Container.innerHTML = ''; // Clear content after printing
            }

            // 3. Remove the temporary wrapper and printing class
            if (printWrapper.parentNode) {
                printWrapper.parentNode.removeChild(printWrapper);
            }
            document.body.classList.remove('printing');

            // 4. Clean up the event handler
            window.onafterprint = null;
        };

        // --- Trigger the print dialog ---
        window.print();
    });
}