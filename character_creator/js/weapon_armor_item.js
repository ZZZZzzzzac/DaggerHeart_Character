function initializeWeaponArmorItemModule() {
    //#region====================== Weapon & Armor & Item ======================    
    const weaponName3Input = document.getElementById('weaponName3');
    const weaponName4Input = document.getElementById('weaponName4');
       
    
    const weaponTrait1Textarea = document.getElementById('weaponTrait1');
    const weaponTrait2Textarea = document.getElementById('weaponTrait2');
    const weaponTrait3Textarea = document.getElementById('weaponTrait3');
    const weaponTrait4Textarea = document.getElementById('weaponTrait4');
    const armorTrait1Textarea = document.getElementById('armorTrait1');

    const equipmentModal = document.getElementById('equipmentModal');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalTitle = document.getElementById('modalTitle');
    const equipmentListContainer = document.getElementById('equipmentListContainer');
    

    const addItemBtn = document.getElementById('addItemBtn');
    
    
    // Auto-grow for weapon and armor trait textareas
    if (weaponTrait1Textarea) {
        weaponTrait1Textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: weaponTrait1Textarea }), 0);
    }
    if (weaponTrait2Textarea) {
        weaponTrait2Textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: weaponTrait2Textarea }), 0);
    }
    if (weaponTrait3Textarea) {
        weaponTrait3Textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: weaponTrait3Textarea }), 0);
    }
    if (weaponTrait4Textarea) {
        weaponTrait4Textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: weaponTrait4Textarea }), 0);
    }
    if (armorTrait1Textarea) {
        armorTrait1Textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: armorTrait1Textarea }), 0);
    }
    let currentTargetInput = null; // To store which input triggered the modal
    let currentOpenModalType = 'weapon'; // 'weapon' or 'armor'
    let currentOpenWeaponSlotType = 'any'; // 'main', 'auxiliary', 'any'

    function displayEquipment(type) { // itemCollections removed, will be handled by filterAndDisplayEquipment
        const fixedHeaderContainer = document.getElementById('fixedHeaderContainer');
        if (!equipmentListContainer || !modalTitle || !fixedHeaderContainer) return;

        // Clear previous items from both containers
        fixedHeaderContainer.innerHTML = '';
        equipmentListContainer.innerHTML = '';
        
        modalTitle.textContent = type === 'weapon' ? '选择武器' : '选择护甲';

        // Create and append header table to fixedHeaderContainer
        const headerTable = document.createElement('table');
        headerTable.classList.add('equipment-modal-table'); // Use same class for consistent styling
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        
        let headers = [];
        let columnWidths = [];

        // Define which headers are filterable
        // Define which headers are filterable (using new English field names for keys)
        const filterableWeaponKeys = ['name', 'trait', 'physical', 'range', 'damage', 'two_handed', 'desc', 'tier'];
        const filterableArmorKeys = ['name', 'score', 'major_threshold', 'severe_threshold', 'desc', 'tier']; // Added new thresholds
 
        // Headers for display (can remain in Chinese)
        if (type === 'weapon') {
            headers =     ['名称', 'Tier', '检定', '属性', '范围', '伤害', '负荷', '特性'];
            columnWidths = ['20%',  '8%',  '10%',  '10%',  '12%',  '10%',  '10%',  '20%'];
        } else if (type === 'armor') {
            headers =     ['名称', 'Tier', '护甲值', '重伤阈值', '致命阈值', '特性']; // Added new threshold headers
            columnWidths = ['24%',  '8%', '12%',  '12%',  '12%',  '32%']; // Adjusted widths
        }
 
        const headerToKeyMap = {
            '名称': 'name',
            'Tier': 'tier',
            '检定': 'trait',
            '属性': 'physical', // For weapons, this will be derived. For filtering, we might filter on a derived 'type' (physical/magic)
            '范围': 'range',
            '伤害': 'damage',
            '负荷': 'two_handed',
            '特性': 'desc',
            '护甲值': 'score',
            '重伤阈值': 'major_threshold',
            '致命阈值': 'severe_threshold'
        };
 
        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            if (columnWidths[index]) {
                th.style.width = columnWidths[index];
            }
            
            const filterKey = headerToKeyMap[headerText];
            let isFilterable = false;
            if (filterKey) {
                if (type === 'weapon' && filterableWeaponKeys.includes(filterKey)) {
                    isFilterable = true;
                } else if (type === 'armor' && filterableArmorKeys.includes(filterKey)) {
                    isFilterable = true;
                }
            }


            if (isFilterable) {
                const filterInput = document.createElement('input');
                filterInput.type = 'text';
                filterInput.placeholder = `筛选 ${headerText}`;
                filterInput.classList.add('header-filter-input');
                filterInput.dataset.filterKey = filterKey; // Use mapped English key
                filterInput.addEventListener('input', () => {
                    // Pass the correct weaponSlotType when filtering
                    const typeToFilter = currentOpenModalType;
                    const slotTypeToFilter = (typeToFilter === 'weapon') ? currentOpenWeaponSlotType : 'any';
                    filterAndDisplayEquipment(typeToFilter, slotTypeToFilter);
                });
                // th.appendChild(document.createElement('br')); // Removed line break
                th.appendChild(filterInput);
            }
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        headerTable.appendChild(thead);
        fixedHeaderContainer.appendChild(headerTable);

        // Create and append data table to equipmentListContainer
        const dataTable = document.createElement('table');
        dataTable.classList.add('equipment-modal-table');
        const tbody = document.createElement('tbody');
        // Data rows will be populated by filterAndDisplayEquipment
        dataTable.appendChild(tbody);
        equipmentListContainer.appendChild(dataTable);
        // equipmentModal.style.display = 'block'; // Displaying modal is now handled by individual input listeners
    }
    function filterAndDisplayEquipment(type, weaponSlotType = 'any') { // Added weaponSlotType
        const fixedHeaderContainer = document.getElementById('fixedHeaderContainer');
        const equipmentListContainer = document.getElementById('equipmentListContainer');
        if (!fixedHeaderContainer || !equipmentListContainer) {
            console.error("Required containers for filtering not found.");
            return;
        }

        const filterInputs = fixedHeaderContainer.querySelectorAll('.header-filter-input');
        const filters = {};
        filterInputs.forEach(input => {
            if (input.value.trim() !== '') {
                filters[input.dataset.filterKey] = input.value.trim().toLowerCase();
            }
        });

        let sourceData = [];
        const levelTier = parseInt(document.getElementById('levelTierDisplay').textContent.replace('T', ''), 10);

        if (type === 'weapon') {
            let combinedWeapons = [];
            if (weaponSlotType === 'main') {
                combinedWeapons = typeof PRIMARY_WEAPON !== 'undefined' ? [...PRIMARY_WEAPON] : [];
            } else if (weaponSlotType === 'auxiliary') {
                combinedWeapons = typeof SECONDARY_WEAPON !== 'undefined' ? [...SECONDARY_WEAPON] : [];
            } else { // 'any' for extra slots
                const primary = typeof PRIMARY_WEAPON !== 'undefined' ? PRIMARY_WEAPON : [];
                const secondary = typeof SECONDARY_WEAPON !== 'undefined' ? SECONDARY_WEAPON : [];
                combinedWeapons = [...primary, ...secondary];
            }
            sourceData = combinedWeapons.filter(item => item.tier === levelTier);
        } else if (type === 'armor') {
            sourceData = (typeof ARMOR !== 'undefined' ? ARMOR : []).filter(item => item.tier === levelTier);
        }
        
        const textFilteredItems = sourceData.filter(item => {
            for (const key in filters) {
                // Handle 'physical' filter for weapons, which is derived
                if (key === 'physical' && type === 'weapon') {
                    const itemIsPhysical = item.physical === true;
                    const itemIsMagical = item.physical === false;
                    const filterValue = filters[key];
                    if (filterValue === '物理' && !itemIsPhysical) return false;
                    if (filterValue === '魔法' && !itemIsMagical) return false;
                    if (filterValue !== '物理' && filterValue !== '魔法' && !String(item.physical).toLowerCase().includes(filterValue)) return false; // fallback for other text
                } else {
                    const itemValue = item[key] ? String(item[key]).toLowerCase() : "";
                    if (!itemValue.includes(filters[key])) {
                        return false;
                    }
                }
            }
            return true;
        });

        const dataTable = equipmentListContainer.querySelector('table.equipment-modal-table');
        let tbody = dataTable ? dataTable.querySelector('tbody') : null;

        if (!tbody) {
            console.error("Could not find tbody in equipmentListContainer for filtering.");
            return;
        }
        
        tbody.innerHTML = ''; // Clear previous rows

        textFilteredItems.forEach(item => {
            const tr = document.createElement('tr');
            tr.classList.add('equipment-item-row');
            tr.dataset.equipmentData = JSON.stringify(item);

            let cellsHtml = '';
            let currentColumnWidths = [];
            if (type === 'weapon') {
                currentColumnWidths = ['20%', '8%', '10%', '10%', '12%', '10%', '10%', '20%'];
                cellsHtml = `
                    <td style="width: ${currentColumnWidths[0]};">${item.name || ''}</td>
                    <td style="width: ${currentColumnWidths[1]};">${item.tier || ''}</td>
                    <td style="width: ${currentColumnWidths[2]};">${item.trait || ''}</td>
                    <td style="width: ${currentColumnWidths[3]};">${item.physical === true ? '物理' : (item.physical === false ? '魔法' : (item.physical === undefined && item.two_handed === '副手' ? 'N/A' : ''))}</td>
                    <td style="width: ${currentColumnWidths[4]};">${item.range || ''}</td>
                    <td style="width: ${currentColumnWidths[5]};">${item.damage || ''}</td>
                    <td style="width: ${currentColumnWidths[6]};">${item.two_handed || ''}</td>
                    <td style="width: ${currentColumnWidths[7]};">${item.desc || ''}</td>
                `;
            } else if (type === 'armor') {
                currentColumnWidths = ['24%',  '8%', '12%',  '12%',  '12%',  '32%'];
                cellsHtml = `
                    <td style="width: ${currentColumnWidths[0]};">${item.name || ''}</td>
                    <td style="width: ${currentColumnWidths[1]};">${item.tier || ''}</td>
                    <td style="width: ${currentColumnWidths[2]};">${item.score || ''}</td>
                    <td style="width: ${currentColumnWidths[2]};">${item.score || ''}</td>
                    <td style="width: ${currentColumnWidths[3]};">${item.major_threshold || ''}</td>
                    <td style="width: ${currentColumnWidths[4]};">${item.severe_threshold || ''}</td>
                    <td style="width: ${currentColumnWidths[5]};">${item.desc || ''}</td>
                `;
            }
            tr.innerHTML = cellsHtml;
            tbody.appendChild(tr);
        });
    }
    // Setup triggers for opening the modal
    const setupModalTrigger = (inputElement, modalType, weaponSlotType = 'any') => {
        if (inputElement) {
            inputElement.addEventListener('click', () => {
                currentTargetInput = inputElement; // Store the actual input element
                equipmentModal.dataset.targetInputId = inputElement.id; // Store the ID for populating form
                currentOpenModalType = modalType;
                currentOpenWeaponSlotType = weaponSlotType;
                displayEquipment(currentOpenModalType);
                filterAndDisplayEquipment(currentOpenModalType, currentOpenWeaponSlotType);
                equipmentModal.style.display = 'block';
            });
        }
    };
    setupModalTrigger(weaponName1Input, 'weapon', 'main');
    setupModalTrigger(weaponName2Input, 'weapon', 'auxiliary');
    setupModalTrigger(weaponName3Input, 'weapon', 'any');
    setupModalTrigger(weaponName4Input, 'weapon', 'any');
    setupModalTrigger(armorName1Input, 'armor', 'any');
    // Close modal logic
    if (modalCloseButton && equipmentModal) {
        modalCloseButton.addEventListener('click', () => {
            equipmentModal.style.display = 'none';
        });
    }
    if (equipmentModal) {
        window.addEventListener('click', (event) => {
            if (event.target === equipmentModal) {
                equipmentModal.style.display = 'none';
            }
        });
    }
    // Click listener for items within the modal's equipment list
    if (equipmentListContainer && equipmentModal) {
        equipmentListContainer.addEventListener('click', (event) => {
            const clickedItemRow = event.target.closest('tr.equipment-item-row');
            if (!clickedItemRow) {
                return;
            }

            const equipmentDataString = clickedItemRow.dataset.equipmentData;
            if (!equipmentDataString) {
                console.error('Equipment data not found on clicked item.');
                return;
            }

            let equipmentData;
            try {
                equipmentData = JSON.parse(equipmentDataString);
            } catch (e) {
                console.error('Failed to parse equipment data:', e);
                return;
            }
            
            // Use currentTargetInput (which is the actual input element)
            if (!currentTargetInput) {
                console.error('Target input (currentTargetInput) not set.');
                return;
            }
            const targetInputId = currentTargetInput.id;


            if (targetInputId.startsWith('weaponName')) {
                const weaponIndex = targetInputId.charAt(targetInputId.length - 1);
                if (form[`weaponName${weaponIndex}`]) form[`weaponName${weaponIndex}`].value = equipmentData.name || '';
                if (form[`weaponCheck${weaponIndex}`]) form[`weaponCheck${weaponIndex}`].value = equipmentData.trait || '';
                // Determine 'Attribute' based on 'physical' property for primary weapons, or leave blank/N/A for secondary
                let attributeValue = '';
                if (equipmentData.physical === true) {
                    attributeValue = '物理';
                } else if (equipmentData.physical === false) {
                    attributeValue = '魔法';
                } else if (equipmentData.two_handed === '副手') { // Secondary weapons don't have 'physical'
                    attributeValue = 'N/A';
                }
                if (form[`weaponAttribute${weaponIndex}`]) form[`weaponAttribute${weaponIndex}`].value = attributeValue;
                if (form[`weaponRange${weaponIndex}`]) form[`weaponRange${weaponIndex}`].value = equipmentData.range || '';
                if (form[`weaponDamage${weaponIndex}`]) form[`weaponDamage${weaponIndex}`].value = equipmentData.damage || '';
                if (form[`weaponTwoHanded${weaponIndex}`]) form[`weaponTwoHanded${weaponIndex}`].value = equipmentData.two_handed || '';
                const traitTextarea = document.getElementById(`weaponTrait${weaponIndex}`);
                if (traitTextarea) {
                    traitTextarea.value = equipmentData.desc || '';
                    setTimeout(() => autoGrowTextarea({ target: traitTextarea }), 0);
                }
            } else if (targetInputId.startsWith('armorName')) {
                const armorIndex = targetInputId.charAt(targetInputId.length - 1);
                if (form[`armorName${armorIndex}`]) form[`armorName${armorIndex}`].value = equipmentData.name || '';
                if (form[`armorDefense${armorIndex}`]) form[`armorDefense${armorIndex}`].value = equipmentData.score || '';
                // Update the new threshold fields for the specific armor item
                const armorMajorThresholdField = form[`armorMajorThreshold${armorIndex}`];
                const armorSevereThresholdField = form[`armorSevereThreshold${armorIndex}`];

                if (armorMajorThresholdField) armorMajorThresholdField.value = equipmentData.major_threshold || '';
                if (armorSevereThresholdField) armorSevereThresholdField.value = equipmentData.severe_threshold || '';
                
                // Update character's global damage thresholds by adding character level
                const characterLevelInput = document.getElementById('level');
                const characterLevel = characterLevelInput ? parseInt(characterLevelInput.value, 10) || 0 : 0;
                
                const baseMajorThreshold = parseInt(equipmentData.major_threshold, 10) || 0;
                const baseSevereThreshold = parseInt(equipmentData.severe_threshold, 10) || 0;

                const globalMajorThresholdInput = document.getElementById('majorDamageThreshold');
                const globalSevereThresholdInput = document.getElementById('severeDamageThreshold');

                if (globalMajorThresholdInput) {
                    globalMajorThresholdInput.value = baseMajorThreshold + characterLevel;
                }
                if (globalSevereThresholdInput) {
                    globalSevereThresholdInput.value = baseSevereThreshold + characterLevel;
                }
                
                const traitTextarea = document.getElementById(`armorTrait${armorIndex}`);
                if (traitTextarea) {
                    traitTextarea.value = equipmentData.desc || '';
                    setTimeout(() => autoGrowTextarea({ target: traitTextarea }), 0);
                }
            }
            equipmentModal.style.display = 'none';
        });
    }
    addItemBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        newItem.innerHTML = `
            <select name="itemName" class="item-name-select"></select>
            <input type="text" name="itemQuantity" placeholder="数量" value="1">
            <textarea name="itemDescription" placeholder="描述"></textarea>
            <button type="button" class="remove-item-btn">-</button>
        `;
        itemsContainer.appendChild(newItem);
        const newSelect = newItem.querySelector('.item-name-select');
        const newDescriptionTextarea = newItem.querySelector('textarea[name="itemDescription"]');
        if (newDescriptionTextarea) {
            newDescriptionTextarea.addEventListener('input', autoGrowTextarea);
        }
        populateItemSelect(newSelect); // This might pre-fill and should trigger autoGrow if so
        addRemoveListener(newItem.querySelector('.remove-item-btn'));
    });
    //#endregion====================== End of Weapon & Armor & Item ======================
}