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
    state.cards = exportCardData();

    // Export avatar image if present
    const avatarImage = document.getElementById('avatar-image');
    if (avatarImage && avatarImage.src && avatarImage.src !== '#' && avatarImage.src !== window.location.href + '#') { // Check if src is valid and not placeholder
        state.avatarImageSrc = avatarImage.src;
    }

    return state;
}

/**
 * Exports the data of all skill cards currently on the page.
 * @returns {Array<object>} An array of card data objects, including their position.
 */
function exportCardData() {
    const cards = [];
    const cardElements = document.querySelectorAll('#card-container .skill-card');
    cardElements.forEach(cardEl => {
        if (cardEl.dataset.cardData) {
            try {
                const cardData = JSON.parse(cardEl.dataset.cardData);
                const position = {
                    left: cardEl.style.left,
                    top: cardEl.style.top
                };
                cards.push({ data: cardData, position: position });
            } catch (e) {
                console.error('Error processing card data on export:', e, cardEl.dataset.cardData);
            }
        }
    });
    return cards;
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

    // Import avatar image if present in state
    const avatarImageElement = document.getElementById('avatar-image');
    const avatarImageContainer = document.getElementById('avatar-image-container');
    const avatarTextbox = document.getElementById('AvatarTextbox');

    if (state.avatarImageSrc && avatarImageElement && avatarImageContainer && avatarTextbox) {
        avatarImageElement.src = state.avatarImageSrc;
        avatarImageContainer.style.display = 'block';
        avatarTextbox.style.display = 'none';
    } else if (avatarImageContainer && avatarTextbox) {
        // Ensure avatar is hidden if not in state
        avatarImageContainer.style.display = 'none';
        avatarTextbox.style.display = 'block';
        if(avatarImageElement) avatarImageElement.src = '#';
    }

    updatePageTitle(); // Update title after importing
}

/**
 * Updates the page title based on the character name.
 */
function updatePageTitle() {
    const nameTextbox = document.getElementById('NameTextbox');
    if (nameTextbox && nameTextbox.value.trim()) {
        document.title = `${nameTextbox.value.trim()}_zzz车卡器`;
    } else {
        document.title = '角色卡编辑器'; // Reset to default if name is empty
    }
}

/**
 * Saves the current form state to Local Storage.
 */
function saveFormStateToLocalStorage() {
    const formState = exportFormState();
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
    // Reset Level to 1
    const levelTextbox = document.getElementById('LevelTextbox');
    if (levelTextbox) {
        levelTextbox.value = '1';
    }

    // 2. Reset all checkboxes to their initial state (0)
    const checkboxLabels = document.querySelectorAll('.base-checkbox');
    checkboxLabels.forEach(label => {
        if (label.checkboxInstance) {
            label.checkboxInstance.setState('0');
        } else {
            label.dataset.state = '0';
            label.classList.remove('state-checked', 'state-dashed');
        }
    });

    // 3. Apply the specific default states for HP and Stress slots directly
    for (let i = 1; i <= 12; i++) {
        const hpLabel = document.getElementById(`HpSlotCheckbox${i}`);
        const stressLabel = document.getElementById(`StressSlotCheckbox${i}`);
        const state = (i > 6) ? '2' : '0';

        if (hpLabel && hpLabel.checkboxInstance) {
            hpLabel.checkboxInstance.setState(state);
        }
        if (stressLabel && stressLabel.checkboxInstance) {
            stressLabel.checkboxInstance.setState(state);
        }
    }

    // 4.5 Set default Hope and Gold
    for (let i = 1; i <= 2; i++) {
        const hopeLabel = document.getElementById(`HopeSlotCheckbox${i}`);
        if (hopeLabel && hopeLabel.checkboxInstance) {
            hopeLabel.checkboxInstance.setState('1');
        }
    }
    const bagGoldLabel = document.getElementById('HandfulGoldCheckbox1');
    if (bagGoldLabel && bagGoldLabel.checkboxInstance) {
        bagGoldLabel.checkboxInstance.setState('1');
    }

    // 5. Clear all skill cards
    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
        cardContainer.innerHTML = '';
    }

    // 6. Clear Avatar Image
    const avatarImage = document.getElementById('avatar-image');
    const avatarImageContainer = document.getElementById('avatar-image-container');
    const avatarTextbox = document.getElementById('AvatarTextbox');
    if (avatarImage && avatarImageContainer && avatarTextbox) {
        avatarImage.src = '#';
        avatarImageContainer.style.display = 'none';
        avatarTextbox.style.display = 'block';
    }
    
    // 7. Clear the saved state from local storage
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
    const saveCardsBtn = document.getElementById('save-cards-btn');
    const uploadAvatarBtn = document.getElementById('upload-avatar-btn');
    const avatarUploadInput = document.getElementById('avatar-upload-input');
    const avatarImageContainer = document.getElementById('avatar-image-container');
    const avatarImage = document.getElementById('avatar-image');
    const closeAvatarImageBtn = document.getElementById('close-avatar-image-btn');
    const avatarTextbox = document.getElementById('AvatarTextbox');
    const nameTextbox = document.getElementById('NameTextbox');

    if (nameTextbox) {
        nameTextbox.addEventListener('blur', updatePageTitle);
    }
 
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
        link.download = `${characterName}_匕首之心人物卡_zzz.json`;
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
                saveFormStateToLocalStorage();
                alert('JSON文件已成功导入！');
            } catch (error) {
                console.error('导入JSON失败:', error);
                alert('导入失败，请检查文件格式是否正确。');
            }
        };
        reader.readAsText(file);
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
                    processUploadedPack(packData);
                } catch (error) {
                    console.error('导入自定义卡包失败:', error);
                    alert('导入失败，请检查文件格式是否为有效的JSON。');
                }
            };
            reader.readAsText(file);
            customPackInput.value = '';
        });
    }
 
    // Save All Cards functionality
    if (saveCardsBtn) {
        saveCardsBtn.addEventListener('click', () => {
            const cardDataWithPosition = exportCardData();
            if (cardDataWithPosition.length === 0) {
                alert('当前没有可保存的卡牌。');
                return;
            }
            const cardsOnly = cardDataWithPosition.map(item => item.data);
            const dataStr = JSON.stringify(cardsOnly, null, 4);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = '匕首之心卡牌包_zzz.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        });
    }
 
     // --- REFACTORED PRINT FUNCTIONALITY ---
     printBtn.addEventListener('click', () => {
        const printArea = document.getElementById('print-area');
        if (!printArea) {
            console.error('Print area not found!');
            return;
        }

        // 1. Clear previous print content
        printArea.innerHTML = '';

        // 2. Add Character Sheet
        const characterSheet = document.getElementById('character-sheet');
        if (characterSheet) {
            const sheetClone = characterSheet.cloneNode(true);
            sheetClone.id = ''; // Avoid duplicate IDs
            sheetClone.classList.add('print-section', 'print-character-sheet');
            printArea.appendChild(sheetClone);
        }

        // 3. Add Skill Cards
        const cardContainer = document.getElementById('card-container');
        const allCards = cardContainer.querySelectorAll('.skill-card');
        if (allCards.length > 0) {
            const cardPrintSection = document.createElement('div');
            cardPrintSection.className = 'print-section print-card-container';
            allCards.forEach(card => {
                const cardClone = card.cloneNode(true);
                cardClone.id = ''; // Avoid duplicate IDs
                cardPrintSection.appendChild(cardClone);
            });
            printArea.appendChild(cardPrintSection);
        }

        // 4. Add h3-text content
        const h3PrintSection = document.createElement('div');
        h3PrintSection.className = 'print-section print-h3-container';
        // Query within the original character sheet to avoid picking up clones
        const h3TextElements = document.querySelectorAll('#character-sheet .h3-text');
        let hasH3Content = false;
        h3TextElements.forEach(ta => {
            if (ta.value && ta.value.trim() !== '') {
                hasH3Content = true;
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
                    title = questionEl ? questionEl.value : '背景';
                } else if (id.includes('ConnectAnswer')) {
                    const questionId = id.replace('Answer', 'Question');
                    const questionEl = document.getElementById(questionId);
                    title = questionEl ? questionEl.value : '连接';
                } else {
                    title = id.replace('Textbox', '');
                }

                const contentDiv = document.createElement('div');
                contentDiv.className = 'h3-print-item';
                contentDiv.innerHTML = `<h3>${title}</h3><p>${ta.value.replace(/\n/g, '<br>')}</p>`;
                h3PrintSection.appendChild(contentDiv);
            }
        });

        if (hasH3Content) {
            printArea.appendChild(h3PrintSection);
        }
        
        // 5. Trigger Print Dialog
        window.print();

        // 6. Cleanup after printing (optional, as the area is hidden)
        // Using a timeout to ensure it cleans up after the print dialog closes
        setTimeout(() => {
            printArea.innerHTML = '';
        }, 1000);
    });
    
    // Avatar Upload Functionality
    if (uploadAvatarBtn && avatarUploadInput && avatarImageContainer && avatarImage && closeAvatarImageBtn && avatarTextbox) {
        uploadAvatarBtn.addEventListener('click', () => {
            avatarUploadInput.click();
        });

        avatarUploadInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    avatarImage.src = e.target.result;
                    avatarImageContainer.style.display = 'block';
                    avatarTextbox.style.display = 'none';
                }
                reader.readAsDataURL(file);
            }
            avatarUploadInput.value = '';
        });

        closeAvatarImageBtn.addEventListener('click', () => {
            avatarImage.src = '#';
            avatarImageContainer.style.display = 'none';
            avatarTextbox.style.display = 'block';
        });
    } else {
        console.warn('One or more avatar upload elements not found in DOM.');
    }
}