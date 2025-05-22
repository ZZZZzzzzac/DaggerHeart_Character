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
        const filterableWeaponHeaders = ['名称', '检定', '属性', '范围', '伤害', '负荷', '特性', 'Tier'];
        const filterableArmorHeaders = ['名称', '护甲值', '特性', 'Tier'];

        if (type === 'weapon') {
            headers =     ['名称', 'Tier', '检定', '属性', '范围', '伤害', '负荷', '特性'];
            columnWidths = ['20%',  '8%',  '10%',  '10%',  '12%',  '10%',  '10%',  '20%']; // Sum should be 100%
        } else if (type === 'armor') {
            headers =     ['名称', 'Tier', '护甲值', '特性'];
            columnWidths = ['34%',  '12%', '20%',  '34%']; // Sum should be 100%
        }

        headers.forEach((headerText, index) => {
            const th = document.createElement('th');
            th.textContent = headerText;
            if (columnWidths[index]) {
                th.style.width = columnWidths[index];
            }
            
            let isFilterable = false;
            if (headerText === '名称') { // Name is always filterable
                isFilterable = true;
            } else if (type === 'weapon' && filterableWeaponHeaders.includes(headerText)) {
                isFilterable = true;
            } else if (type === 'armor' && filterableArmorHeaders.includes(headerText)) {
                isFilterable = true;
            } else if (headerText === 'Tier') {
                isFilterable = true;
            }

            if (isFilterable) {
                const filterInput = document.createElement('input');
                filterInput.type = 'text';
                filterInput.placeholder = `筛选 ${headerText}`;
                filterInput.classList.add('header-filter-input');
                // Store the header key for easy access during filtering
                // Ensure 'Tier' uses 'tier' as key to match item property
                // '名称' uses '名称' as key, which matches the property in equipment_data.js
                filterInput.dataset.filterKey = (headerText === 'Tier') ? 'tier' : headerText;
                filterInput.addEventListener('input', () => {
                    // Pass the correct weaponSlotType when filtering
                    const typeToFilter = currentOpenModalType;
                    const slotTypeToFilter = (typeToFilter === 'weapon') ? currentOpenWeaponSlotType : 'any';
                    filterAndDisplayEquipment(typeToFilter, slotTypeToFilter);
                });
                th.appendChild(document.createElement('br')); // Add a line break for layout
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

        let rawDataCollectionsWithTier = [];
        
        const addTierToItems = (collection, tierName, varName) => {
            if (typeof collection !== 'undefined' && Array.isArray(collection)) {
                collection.forEach(item => {
                    rawDataCollectionsWithTier.push({ ...item, tier: tierName, sourceVar: varName });
                });
            }
        };

        if (type === 'weapon') {
            addTierToItems(weapon_t1_physics, 'T1', 'weapon_t1_physics');
            addTierToItems(weapon_t1_magic, 'T1', 'weapon_t1_magic');
            addTierToItems(offhand_weapon_t1, 'T1', 'offhand_weapon_t1');
            addTierToItems(weapon_t2_physics, 'T2', 'weapon_t2_physics');
            addTierToItems(weapon_t2_magic, 'T2', 'weapon_t2_magic');
            addTierToItems(offhand_weapon_t2, 'T2', 'offhand_weapon_t2');
            addTierToItems(weapon_t3_physics, 'T3', 'weapon_t3_physics');
            addTierToItems(weapon_t3_magic, 'T3', 'weapon_t3_magic');
            addTierToItems(offhand_weapon_t3, 'T3', 'offhand_weapon_t3');
            addTierToItems(weapon_t4_physics, 'T4', 'weapon_t4_physics');
            addTierToItems(weapon_t4_magic, 'T4', 'weapon_t4_magic');
            addTierToItems(offhand_weapon_t4, 'T4', 'offhand_weapon_t4');
        } else if (type === 'armor') {
            addTierToItems(armor_t1, 'T1', 'armor_t1');
            addTierToItems(armor_t2, 'T2', 'armor_t2');
            addTierToItems(armor_t3, 'T3', 'armor_t3');
            addTierToItems(armor_t4, 'T4', 'armor_t4');
        }
        
        let slotFilteredData = rawDataCollectionsWithTier;
        if (type === 'weapon') {
            if (weaponSlotType === 'main') {
                // For 'main' slots, filter out items where '负荷' is '副手'
                slotFilteredData = rawDataCollectionsWithTier.filter(item => item.负荷 !== '副手');
            } else if (weaponSlotType === 'auxiliary') {
                // For 'auxiliary' slots, only include items where '负荷' is '副手'
                slotFilteredData = rawDataCollectionsWithTier.filter(item => item.负荷 === '副手');
            }
        }
        
        // Ensure slotFilteredData is an array before trying to filter it further
        if (!Array.isArray(slotFilteredData)) {
            console.error("slotFilteredData is not an array. Initial data might be missing for the current tier/type.", slotFilteredData);
            slotFilteredData = []; // Default to empty array to prevent further errors
        }

        const textFilteredItems = slotFilteredData.filter(item => {
            for (const key in filters) {
                const itemValue = item[key] ? String(item[key]).toLowerCase() : "";
                if (!itemValue.includes(filters[key])) {
                    return false;
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
                    <td style="width: ${currentColumnWidths[0]};">${item.名称 || ''}</td>
                    <td style="width: ${currentColumnWidths[1]};">${item.tier || ''}</td>
                    <td style="width: ${currentColumnWidths[2]};">${item.检定 || ''}</td>
                    <td style="width: ${currentColumnWidths[3]};">${item.属性 || ''}</td>
                    <td style="width: ${currentColumnWidths[4]};">${item.范围 || ''}</td>
                    <td style="width: ${currentColumnWidths[5]};">${item.伤害 || ''}</td>
                    <td style="width: ${currentColumnWidths[6]};">${item.负荷 || ''}</td>
                    <td style="width: ${currentColumnWidths[7]};">${item.特性 || ''}</td>
                `;
            } else if (type === 'armor') {
                currentColumnWidths = ['34%', '12%', '20%', '34%'];
                cellsHtml = `
                    <td style="width: ${currentColumnWidths[0]};">${item.名称 || ''}</td>
                    <td style="width: ${currentColumnWidths[1]};">${item.tier || ''}</td>
                    <td style="width: ${currentColumnWidths[2]};">${item.护甲值 || ''}</td>
                    <td style="width: ${currentColumnWidths[3]};">${item.特性 || ''}</td>
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
                if (form[`weaponName${weaponIndex}`]) form[`weaponName${weaponIndex}`].value = equipmentData.名称 || '';
                if (form[`weaponCheck${weaponIndex}`]) form[`weaponCheck${weaponIndex}`].value = equipmentData.检定 || '';
                if (form[`weaponAttribute${weaponIndex}`]) form[`weaponAttribute${weaponIndex}`].value = equipmentData.属性 || '';
                if (form[`weaponRange${weaponIndex}`]) form[`weaponRange${weaponIndex}`].value = equipmentData.范围 || '';
                if (form[`weaponDamage${weaponIndex}`]) form[`weaponDamage${weaponIndex}`].value = equipmentData.伤害 || '';
                if (form[`weaponTwoHanded${weaponIndex}`]) form[`weaponTwoHanded${weaponIndex}`].value = equipmentData.负荷 || '';
                const traitTextarea = document.getElementById(`weaponTrait${weaponIndex}`);
                if (traitTextarea) {
                    traitTextarea.value = equipmentData.特性 || '';
                    setTimeout(() => autoGrowTextarea({ target: traitTextarea }), 0);
                }
            } else if (targetInputId.startsWith('armorName')) {
                const armorIndex = targetInputId.charAt(targetInputId.length - 1);
                if (form[`armorName${armorIndex}`]) form[`armorName${armorIndex}`].value = equipmentData.名称 || '';
                if (form[`armorDefense${armorIndex}`]) form[`armorDefense${armorIndex}`].value = equipmentData.护甲值 || '';
                const traitTextarea = document.getElementById(`armorTrait${armorIndex}`);
                if (traitTextarea) {
                    traitTextarea.value = equipmentData.特性 || '';
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