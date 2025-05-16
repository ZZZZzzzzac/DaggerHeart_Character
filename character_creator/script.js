document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('characterForm');
    


    //========================= Setting =========================
    const raceSelect = document.getElementById('raceSelect');
    const mixedRaceSelect = document.getElementById('mixedRaceSelect');
    const communitySelect = document.getElementById('communitySelect');
    const professionSelect = document.getElementById('professionSelect');
    const subclassSelect = document.getElementById('subclassSelect'); // Added subclassSelect
    const levelInput = document.getElementById('level');
    const levelTierDisplay = document.getElementById('levelTierDisplay');
    
    function calculateTier(level) {
        const lvl = parseInt(level, 10);
        if (isNaN(lvl)) return "T1"; // Default to T1 if level is not a number

        if (lvl <= 1) return "T1"; // Level 1 is T1
        if (lvl >= 2 && lvl <= 4) return "T2"; // Levels 2-4 are T2
        if (lvl >= 5 && lvl <= 7) return "T3"; // Levels 5-7 are T3
        if (lvl >= 8) return "T4"; // Levels 8+ are T4
        return "T1"; // Default for any other case (e.g., level < 1, though <=1 handles it)
    }
    function updateLevelTierDisplay() {
        if (levelInput && levelTierDisplay) {
            const tierString = calculateTier(levelInput.value);
            levelTierDisplay.textContent = tierString; // calculateTier now returns "T1", "T2", etc.
        }
    }
    if (levelInput) {
        levelInput.addEventListener('input', updateLevelTierDisplay);
    }
    updateLevelTierDisplay(); // Initial tier display on load
    // ====================== End of Setting ======================

    
    // ====================== Race, Jobs, and Community Selects ======================
    let currentSelectedJobDomains = { domain1: null, domain2: null }; // Store current job's domains
    function populateGenericSelect(selectElement, data, valueField, textField, defaultText, dataName) {
        if (!selectElement) {
            return;
        }
        if (typeof data === 'undefined' || !Array.isArray(data)) {
            console.warn(`${dataName || 'Data'} is not available or not an array. ${selectElement.id} will not be populated.`);
            selectElement.innerHTML = `<option value="">${dataName || '数据'}未加载</option>`;
            return;
        }
        try {
            const uniqueItems = [...new Set(data.map(item => item[valueField]))].sort();
            selectElement.innerHTML = ''; 
            const defaultOption = document.createElement('option');
            defaultOption.value = "";
            defaultOption.textContent = defaultText;
            defaultOption.selected = true;
            selectElement.appendChild(defaultOption);

            uniqueItems.forEach(itemValue => {
                const option = document.createElement('option');
                option.value = itemValue;
                const itemObject = data.find(d => d[valueField] === itemValue);
                option.textContent = itemObject && itemObject[textField] ? itemObject[textField] : itemValue;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error(`Error processing data for ${selectElement.id} with ${dataName}:`, error);
            selectElement.innerHTML = `<option value="">处理${dataName || '数据'}出错</option>`;
        }
    }
    // 初始化下拉选择框
    populateGenericSelect(raceSelect, RACES_DATA, 'race', 'race', "必选", "RACES_DATA");
    populateGenericSelect(mixedRaceSelect, RACES_DATA, 'race', 'race', "可选", "RACES_DATA");
    populateGenericSelect(communitySelect, GROUPS_DATA, '社群', '社群', "必选", "GROUPS_DATA");
    populateGenericSelect(professionSelect, JOBS_DATA, '职业', '职业', "必选", "JOBS_DATA");
    // 通用函数：创建特性对象
    function createTraitData(name, description, attribute, config = "永久") {
        return {
            配置: config,
            名称: name,
            领域: "",
            等级: "",
            属性: attribute,
            回想: "",
            描述: description || ""
        };
    }
    // 添加选择框事件监听
    if (raceSelect) raceSelect.addEventListener('change', updateRaceTraitsAsSkills);
    if (mixedRaceSelect) mixedRaceSelect.addEventListener('change', updateRaceTraitsAsSkills);
    if (communitySelect) communitySelect.addEventListener('change', updateGroupTraitAsSkill);
    if (professionSelect) professionSelect.addEventListener('change', updateJobTraitsAsSkills);
    if (subclassSelect) subclassSelect.addEventListener('change', updateJobTraitsAsSkills); // Add event listener for subclass change
    // 初始调用 - 仅在数据已加载时
    function initializeTraits() {
        if (typeof RACES_DATA !== 'undefined' && RACES_DATA.length > 0 && raceSelect.value) {
            updateRaceTraitsAsSkills();
        }
        if (typeof GROUPS_DATA !== 'undefined' && GROUPS_DATA.length > 0 && communitySelect.value) {
            updateGroupTraitAsSkill();
        }
        if (typeof JOBS_DATA !== 'undefined' && JOBS_DATA.length > 0 && professionSelect.value) {
            updateJobTraitsAsSkills(); // This will also handle initial subclass spellcasting if any
        }
    }
    initializeTraits();
    function updateSubclassOptions() {
        if (!professionSelect || !subclassSelect || typeof JOBS_DATA === 'undefined' || !Array.isArray(JOBS_DATA)) {
            if (subclassSelect) {
                subclassSelect.innerHTML = '<option value="">N/A</option>';
                subclassSelect.disabled = true;
            }
            return;
        }

        const selectedJobName = professionSelect.value;

        const previousSubclassValue = subclassSelect.value;
        subclassSelect.innerHTML = ''; // Clear existing options
        let firstSubclassName = null;
        let previousValueIsValid = false;

        if (selectedJobName) {
            const jobData = JOBS_DATA.find(j => j.职业 === selectedJobName);
            if (jobData && jobData.子职 && Array.isArray(jobData.子职) && jobData.子职.length > 0) {
                jobData.子职.forEach((subclass, index) => {
                    if (subclass.名称) { // Ensure subclass has a name
                        if (index === 0) {
                            firstSubclassName = subclass.名称;
                        }
                        const option = document.createElement('option');
                        option.value = subclass.名称;
                        option.textContent = subclass.名称;
                        subclassSelect.appendChild(option);
                        if (subclass.名称 === previousSubclassValue) {
                            previousValueIsValid = true;
                        }
                    }
                });
                subclassSelect.disabled = false;
                
                if (previousValueIsValid) {
                    subclassSelect.value = previousSubclassValue;
                } else if (firstSubclassName) {
                    subclassSelect.value = firstSubclassName;
                } else {
                    // This case implies no valid subclasses were found, though the outer check should prevent it.
                    // Fallback to an empty selection if somehow reached.
                    subclassSelect.value = "";
                }
            } else {
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "无可用子职";
                subclassSelect.appendChild(option);
                subclassSelect.disabled = true;
            }
        } else {
            const option = document.createElement('option');
            option.value = "";
            option.textContent = "请先选择职业";
            subclassSelect.appendChild(option);
            subclassSelect.disabled = true;
        }
        // updateJobTraitsAsSkills(); // Call to update domains display after subclass options change
    }
    function updateRaceTraitsAsSkills() {
        // 检查数据有效性
        if (!raceSelect || typeof RACES_DATA === 'undefined' || !Array.isArray(RACES_DATA) || RACES_DATA.length === 0) {
            updateSkillInSlot(FixedSkillSlotIds.RACE_1, null);
            updateSkillInSlot(FixedSkillSlotIds.RACE_2, null);
            return;
        }

        const selectedRaceName = raceSelect.value;
        const selectedMixedRaceName = mixedRaceSelect ? mixedRaceSelect.value : null;
        const hasMixedRace = selectedMixedRaceName && selectedMixedRaceName !== "" && selectedMixedRaceName !== selectedRaceName;
        
        let trait1Data = null;
        let trait2Data = null;

        if (selectedRaceName) {
            const mainRaceData = RACES_DATA.find(r => r.race === selectedRaceName);
            if (!mainRaceData) return;
            
            // 处理主要种族特性
            if (mainRaceData.trait1 && mainRaceData.trait1.name) {
                trait1Data = createTraitData(mainRaceData.trait1.name,mainRaceData.trait1.description,"种族");
            }

            // 处理第二个特性（可能来自混血种族或主要种族）
            if (hasMixedRace) {
                const mixedRaceData = RACES_DATA.find(r => r.race === selectedMixedRaceName);
                if (mixedRaceData && mixedRaceData.trait2 && mixedRaceData.trait2.name) {
                    trait2Data = createTraitData(mixedRaceData.trait2.name,mixedRaceData.trait2.description,"混血");
                }
            }
            
            // 如果没有从混血获取第二特性，尝试使用主要种族的第二特性
            if (!trait2Data && mainRaceData.trait2 && mainRaceData.trait2.name) {
                trait2Data = createTraitData(mainRaceData.trait2.name,mainRaceData.trait2.description,"种族");
            }
        }
        
        updateSkillInSlot(FixedSkillSlotIds.RACE_1, trait1Data);
        updateSkillInSlot(FixedSkillSlotIds.RACE_2, trait2Data);
    }
    function updateGroupTraitAsSkill() {
        if (!communitySelect || typeof GROUPS_DATA === 'undefined' || !Array.isArray(GROUPS_DATA)) {
            updateSkillInSlot(FixedSkillSlotIds.GROUP_1, null);
            return;
        }

        const selectedGroupName = communitySelect.value;
        let groupTraitData = null;

        if (selectedGroupName) {
            const groupData = GROUPS_DATA.find(g => g.社群 === selectedGroupName);
            if (groupData && groupData.特性名 && groupData.描述) {
                groupTraitData = createTraitData(groupData.特性名,groupData.描述,"社群");
            }
        }
        
        updateSkillInSlot(FixedSkillSlotIds.GROUP_1, groupTraitData);
    }
    function updateJobTraitsAsSkills() {
        const jobDomainsDisplay = document.getElementById('jobDomainsDisplay');
        const skillsContainer = document.getElementById('skillsContainer');

        // Clear previously added dynamic job feature rows AND subclass keystone trait rows
        if (skillsContainer) {
            const dynamicJobRows = skillsContainer.querySelectorAll('.dynamic-job-feature-row');
            dynamicJobRows.forEach(row => row.remove());
            const dynamicSubclassRows = skillsContainer.querySelectorAll('.subclass-keystone-trait-row');
            dynamicSubclassRows.forEach(row => row.remove());
        }

        if (!professionSelect || typeof JOBS_DATA === 'undefined' || !Array.isArray(JOBS_DATA) || !skillsContainer) {
            updateSkillInSlot(FixedSkillSlotIds.JOB_1, null);
            if (jobDomainsDisplay) jobDomainsDisplay.textContent = "";
            updateSubclassOptions(); // Ensure subclass options are cleared/disabled if no profession data
            return;
        }

        const selectedJobName = professionSelect.value;
        updateSubclassOptions(); // Update subclass options based on the selected job

        let hopeTraitData = null; // For "希望特性" - typically goes to JOB_1

        if (jobDomainsDisplay) jobDomainsDisplay.textContent = "";

        if (selectedJobName) {
            const jobData = JOBS_DATA.find(j => j.职业 === selectedJobName);
            if (jobData) {
                // Handle "希望特性" - goes into FixedSkillSlotIds.JOB_1
                if (jobData.希望特性) {
                    hopeTraitData = createTraitData("希望特性", jobData.希望特性, "职业");
                }

                // Handle "职业特性" - dynamically added
                if (jobData.职业特性) {
                    const features = Array.isArray(jobData.职业特性) ? jobData.职业特性 : [jobData.职业特性];
                    features.forEach(feature => {
                        if (feature.名称 && feature.描述) {
                            const featureSkillData = {
                                配置: "永久",
                                名称: feature.名称,
                                领域: "",
                                等级: "", // Or feature.等级 if available and relevant
                                属性: "职业特性",
                                回想: "",
                                描述: feature.描述
                            };
                            const newRow = createSkillRowElement(featureSkillData, false);
                            newRow.classList.add('dynamic-job-feature-row');
                            skillsContainer.appendChild(newRow);
                            updateRemoveButtonVisibility(newRow); // Added
                            const textarea = newRow.querySelector('textarea[name="skillDescription"]');
                            if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
                        }
                    });
                }

                // Update domains display (Job domains and Subclass spellcasting)
                let domainsText = "";
                if (jobData.领域1) {
                    domainsText += `领域: ${jobData.领域1}`;
                    currentSelectedJobDomains.domain1 = jobData.领域1;
                }
                if (jobData.领域2) {
                    if (domainsText) domainsText += "+";
                    domainsText += `${jobData.领域2}`;
                    currentSelectedJobDomains.domain2 = jobData.领域2;
                }
                
                const selectedSubclassName = subclassSelect ? subclassSelect.value : null;
                if (selectedSubclassName && jobData.子职) {
                    const subclassData = jobData.子职.find(sc => sc.名称 === selectedSubclassName);
                    if (subclassData) {
                        // Add subclass spellcasting to domains display
                        if (subclassData.施法 && subclassData.施法.trim() !== "") {
                            if (domainsText) {
                                domainsText += ` | 施法: ${subclassData.施法}`;
                            } else {
                                domainsText = `施法: ${subclassData.施法}`;
                            }
                        }

                        // Handle Subclass "特性" with "等级": "基石" - dynamically added
                        if (subclassData.特性 && Array.isArray(subclassData.特性)) {
                            subclassData.特性.forEach(trait => {
                                if (trait.等级 === "基石" && trait.名称 && trait.描述) {
                                    const keystoneTraitSkillData = {
                                        配置: "永久",
                                        名称: trait.名称,
                                        领域: "", // Subclass traits typically don't have a domain here
                                        等级: "基石",
                                        属性: "子职特性", // Specific attribute type
                                        回想: "",
                                        描述: trait.描述
                                    };
                                    const newRow = createSkillRowElement(keystoneTraitSkillData, false);
                                    newRow.classList.add('subclass-keystone-trait-row'); // Specific class
                                    skillsContainer.appendChild(newRow);
                                    updateRemoveButtonVisibility(newRow); // Added
                                    const textarea = newRow.querySelector('textarea[name="skillDescription"]');
                                    if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
                                }
                            });
                        }
                    }
                }
                if (jobDomainsDisplay) jobDomainsDisplay.textContent = domainsText;
            }
        }
        
        updateSkillInSlot(FixedSkillSlotIds.JOB_1, hopeTraitData);
        // If there's a JOB_2 slot and a clear second job trait (e.g. from subclass or another primary job trait),
        // it would be populated here using updateSkillInSlot(FixedSkillSlotIds.JOB_2, secondJobTraitData);
    }
    // ====================== End of Race, Jobs, and Community Selects ======================


    // ====================== Experience & Background ======================
    let appearanceDataUrl = "";
    const experiencesContainer = document.getElementById('experiences');
    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const appearanceUpload = document.getElementById('appearanceUpload');
    const appearancePreview = document.getElementById('appearancePreview');
    const removeAppearanceBtn = document.getElementById('removeAppearanceBtn');
    addExperienceBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('experience-item');
        newItem.innerHTML = `
            <input type="text" name="expKeyword" placeholder="关键词">
            <input type="text" name="expValue" placeholder="调整值" value="1">
            <button type="button" class="remove-item-btn">-</button>
        `;
        experiencesContainer.appendChild(newItem);
        addRemoveListener(newItem.querySelector('.remove-item-btn'));
    });    
    // ====================== End of Experience & Background ======================


    // ====================== Status =======================

    // ====================== End of Status =======================


    // ====================== Weapon & Armor & Item ======================
    const weaponName1Input = document.getElementById('weaponName1');
    const weaponName2Input = document.getElementById('weaponName2');
    const weaponName3Input = document.getElementById('weaponName3');
    const weaponName4Input = document.getElementById('weaponName4');
    const armorName1Input = document.getElementById('armorName1');    
    
    const weaponTrait1Textarea = document.getElementById('weaponTrait1');
    const weaponTrait2Textarea = document.getElementById('weaponTrait2');
    const weaponTrait3Textarea = document.getElementById('weaponTrait3');
    const weaponTrait4Textarea = document.getElementById('weaponTrait4');
    const armorTrait1Textarea = document.getElementById('armorTrait1');

    const equipmentModal = document.getElementById('equipmentModal');
    const modalCloseButton = document.getElementById('modalCloseButton');
    const modalTitle = document.getElementById('modalTitle');
    const equipmentListContainer = document.getElementById('equipmentListContainer');
    
    const itemsContainer = document.getElementById('items');
    const addItemBtn = document.getElementById('addItemBtn');
    const ALL_ITEMS_DATA = [...ITEMS_DATA, ...CONSUMABLES_DATA];
    
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
        const filterableArmorHeaders = ['名称', '防御', '特性', 'Tier'];

        if (type === 'weapon') {
            headers =     ['名称', 'Tier', '检定', '属性', '范围', '伤害', '负荷', '特性'];
            columnWidths = ['20%',  '8%',  '10%',  '10%',  '12%',  '10%',  '10%',  '20%']; // Sum should be 100%
        } else if (type === 'armor') {
            headers =     ['名称', 'Tier', '防御', '特性'];
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
                    <td style="width: ${currentColumnWidths[2]};">${item.防御 || ''}</td>
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
                if (form[`armorDefense${armorIndex}`]) form[`armorDefense${armorIndex}`].value = equipmentData.防御 || '';
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
    // ====================== End of Weapon & Armor & Item ======================


    // ====================== Skill ======================
    const FixedSkillSlotIds = {
        RACE_1: 'fixed-skill-race-1',
        RACE_2: 'fixed-skill-race-2',
        GROUP_1: 'fixed-skill-group-1',
        JOB_1: 'fixed-skill-job-1'
    };
    const AllFixedSlotIds = Object.values(FixedSkillSlotIds);
    const skillsContainer = document.getElementById('skillsContainer');
    const addSkillBtn = document.getElementById('addSkillBtn');

    function updateRemoveButtonVisibility(skillRowElement) {
        if (!skillRowElement) return;
        const configInput = skillRowElement.querySelector('input[name="skillConfig"]');
        const removeBtn = skillRowElement.querySelector('.remove-item-btn');
        if (configInput && removeBtn) {
            if (configInput.value.trim() === "永久") { // Use trim() for robustness
                removeBtn.style.display = 'none';
            } else {
                removeBtn.style.display = ''; // Reset to default display
            }
        }
    }

    // Helper to create skill row TR element (used by fixed slots and potentially dynamic ones)
    function createSkillRowElement(skillData = {}, isFixedSlot = false, slotId = '') {
        const newRow = document.createElement('tr');
        newRow.classList.add('skill-item');
        if (isFixedSlot) {
            newRow.id = slotId;
            newRow.classList.add('fixed-skill-slot');
        }

        // Determine default attribute for fixed slots if skillData.属性 is not provided
        let defaultAttribute = skillData.属性 || '';
        if (isFixedSlot && !defaultAttribute) {
            if (slotId.startsWith('fixed-skill-race')) defaultAttribute = "种族";
            else if (slotId.startsWith('fixed-skill-group')) defaultAttribute = "社群";
            else if (slotId.startsWith('fixed-skill-job')) defaultAttribute = "职业";
        }
        
        const defaultConfig = skillData.配置 || (isFixedSlot ? '永久' : '');
        const defaultLevel = skillData.等级 || ''; // Fixed slots might not have a numeric level initially

        newRow.innerHTML = `
            <td><input type="text" name="skillConfig" placeholder="配置" value="${defaultConfig}"></td>
            <td><input type="text" name="skillName" placeholder="名称" value="${skillData.名称 || ''}"></td>
            <td><input type="text" name="skillDomain" placeholder="领域" value="${skillData.领域 || ''}"></td>
            <td><input type="text" name="skillLevel" placeholder="等级" value="${defaultLevel}"></td>
            <td><input type="text" name="skillAttribute" placeholder="属性" value="${defaultAttribute}"></td>
            <td><input type="text" name="skillRecall" placeholder="回想" value="${skillData.回想 || ''}"></td>
            <td><textarea name="skillDescription" placeholder="描述">${skillData.描述 || ''}</textarea></td>
            <td><button type="button" class="remove-item-btn">-</button></td>
        `;

        const newTextarea = newRow.querySelector('textarea[name="skillDescription"]');
        if (newTextarea) {
            newTextarea.addEventListener('input', autoGrowTextarea);
        }
        
        const configInput = newRow.querySelector('input[name="skillConfig"]');
        if (configInput) {
            configInput.addEventListener('input', () => updateRemoveButtonVisibility(newRow));
        }

        // Initial visibility check
        updateRemoveButtonVisibility(newRow);

        if (!isFixedSlot) { // Still add remove listener for non-fixed, but visibility is handled separately
            addRemoveListener(newRow.querySelector('.remove-item-btn'));
        }
        return newRow;
    }
    function initializeFixedSkillSlots() {
        if (!skillsContainer) return;
        // This function ensures the 5 fixed slots are present.
        // It doesn't clear other dynamic skills that might be added later.
        AllFixedSlotIds.forEach(slotId => {
            if (!document.getElementById(slotId)) {
                const slotRow = createSkillRowElement({}, true, slotId);
                skillsContainer.appendChild(slotRow);
                const textarea = slotRow.querySelector('textarea[name="skillDescription"]');
                // Initial auto-grow for textareas in fixed slots
                if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
            }
        });
    }    
    initializeFixedSkillSlots(); // Create the 5 fixed slots on load
    function updateSkillInSlot(slotId, skillData) {
        const slotRow = document.getElementById(slotId);
        if (!slotRow) {
            console.warn(`Skill slot with ID ${slotId} not found during update.`);
            return;
        }

        const inputs = {
            config: slotRow.querySelector('input[name="skillConfig"]'),
            name: slotRow.querySelector('input[name="skillName"]'),
            domain: slotRow.querySelector('input[name="skillDomain"]'),
            level: slotRow.querySelector('input[name="skillLevel"]'),
            attribute: slotRow.querySelector('input[name="skillAttribute"]'),
            recall: slotRow.querySelector('input[name="skillRecall"]'),
            description: slotRow.querySelector('textarea[name="skillDescription"]')
        };

        let currentAttributeType = "";
        if (slotId === FixedSkillSlotIds.RACE_1 || slotId === FixedSkillSlotIds.RACE_2) currentAttributeType = "种族";
        else if (slotId === FixedSkillSlotIds.GROUP_1) currentAttributeType = "社群";
        else if (slotId === FixedSkillSlotIds.JOB_1) currentAttributeType = "职业";

        if (skillData) {
            inputs.config.value = skillData.配置 || "永久";
            inputs.name.value = skillData.名称 || "";
            inputs.domain.value = skillData.领域 || "";
            inputs.level.value = skillData.等级 || "";
            inputs.attribute.value = skillData.属性 || currentAttributeType; // Use skillData.属性 if provided, else default for slot
            inputs.recall.value = skillData.回想 || "";
            inputs.description.value = skillData.描述 || "";
        } else { // Clear the slot, but maintain config and attribute type
            inputs.config.value = "永久";
            inputs.name.value = "";
            inputs.domain.value = "";
            inputs.level.value = "";
            inputs.attribute.value = currentAttributeType; // Keep placeholder attribute
            inputs.recall.value = "";
            inputs.description.value = "";
        }
        // Ensure textarea height is adjusted after update
        if (inputs.description) {
             setTimeout(() => autoGrowTextarea({ target: inputs.description }), 0);
        }
        updateRemoveButtonVisibility(slotRow); // Added
    }
    // addSkillEntry is now for DYNAMIC, non-fixed skills, added AFTER fixed slots
    function addSkillEntry(skillData) {
        const newRow = createSkillRowElement(skillData, false); // isFixedSlot = false
        skillsContainer.appendChild(newRow);
        const textarea = newRow.querySelector('textarea[name="skillDescription"]');
        // Initial auto-grow for dynamically added textareas
        if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
        updateRemoveButtonVisibility(newRow); // Added
        return newRow;
    }
    addSkillBtn.addEventListener('click', () => {
        addSkillEntry({
            配置: "", 名称: "", 领域: "", 等级: "", 属性: "", 回想: "", 描述: ""
        });
    });
    // give all textareas in the skills container the auto-grow functionality
    document.querySelectorAll('#skillsContainer textarea[name="skillDescription"]').forEach(textarea => {
        textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
    });
    // ====================== End of Skill ======================


    // ====================== Import ======================
    const importJsonBtn = document.getElementById('importJsonBtn');
    const importFile = document.getElementById('importFile');
    if (importJsonBtn && importFile) {
        importJsonBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        populateForm(importedData);
                        importFile.value = null; 
                    } catch (error) {
                        console.error("Error parsing JSON file:", error);
                        alert("导入失败：无效的JSON文件。");
                    }
                };
                reader.readAsText(file);
            }
        });
    }
    function populateForm(data) {
        if (!data) return;
        form.reset();

        // Clear dynamic sections, but fixed skill slots are managed by initializeFixedSkillSlots and updateSkillInSlot
        experiencesContainer.innerHTML = '';
        itemsContainer.innerHTML = '';
        // skillNextId = 1; // Reset for dynamic skills, if any are added

        // Clear fixed skill slots before populating
        AllFixedSlotIds.forEach(slotId => {
            updateSkillInSlot(slotId, null);
        });
        
        // Clear any dynamically added skill rows (not the fixed ones)
        const dynamicSkillRows = skillsContainer.querySelectorAll('tr.skill-item:not(.fixed-skill-slot)');
        dynamicSkillRows.forEach(row => row.remove());
        
        appearancePreview.src = "#";
        appearancePreview.style.display = 'none';
        removeAppearanceBtn.style.display = 'none';
        appearanceUpload.style.display = 'inline';
        appearanceUpload.value = null;
        appearanceDataUrl = "";

        if (data.设定) {
            form.roleName.value = data.设定.角色名 || "";
            form.age.value = data.设定.年龄 || 0;
            form.gender.value = data.设定.性别 || "";
            
            if (form.raceSelect) form.raceSelect.value = data.设定.种族 || "";
            if (form.mixedRaceSelect) form.mixedRaceSelect.value = data.设定.混血种族 || "";
            if (form.communitySelect) form.communitySelect.value = data.设定.社群 || "";
            if (form.professionSelect) form.professionSelect.value = data.设定.职业 || "";
            
            // Update subclass options first, based on the selected profession
            updateSubclassOptions();
            
            // Now set the subclass value from JSON
            if (form.subclassSelect) form.subclassSelect.value = data.设定.子职业 || "";

            // After setting ALL dropdowns from JSON (including subclass), update the fixed skill slots and job traits
            updateRaceTraitsAsSkills();
            updateGroupTraitAsSkill();
            updateJobTraitsAsSkills(); // This will now use the correctly set subclass
            
            // form.subProfession.value = data.设定.子职业 || ""; // This line is redundant if subclassSelect is used
            form.partTimeJob.value = data.设定.兼职 || "";
            form.backgroundStory.value = data.设定.背景故事 || "";
            
            if (data.设定.形象 && typeof data.设定.形象 === 'string' && data.设定.形象.startsWith('data:image')) {
                appearancePreview.src = data.设定.形象;
                appearancePreview.style.display = 'block';
                removeAppearanceBtn.style.display = 'inline';
                appearanceUpload.style.display = 'none';
                appearanceDataUrl = data.设定.形象;
            }

            if (data.设定.经历 && Array.isArray(data.设定.经历)) {
                data.设定.经历.forEach((exp) => {
                    addExperienceBtn.click();
                    const currentExpItem = experiencesContainer.lastElementChild;
                    if (currentExpItem) {
                        const keywordInput = currentExpItem.querySelector('input[name="expKeyword"]');
                        const valueInput = currentExpItem.querySelector('input[name="expValue"]');
                        if (keywordInput) keywordInput.value = exp.关键词 || "";
                        if (valueInput) valueInput.value = exp.调整值 || "";
                    }
                });
            }
        }

        if (data.状态) {
            form.hpCurrent.value = data.状态.HP?.当前 || 0;
            form.hpMax.value = data.状态.HP?.最大 || 0;
            form.stressCurrent.value = data.状态.压力?.当前 || 0;
            form.stressMax.value = data.状态.压力?.最大 || 0;
            form.hopeCurrent.value = data.状态.希望?.当前 || 0;
            form.hopeMax.value = data.状态.希望?.最大 || 0;
            form.armorCurrent.value = data.状态.护甲?.当前 || 0;
            form.armorMax.value = data.状态.护甲?.最大 || 0;
            form.armorValue.value = data.状态.护甲值 || 0;
            form.level.value = data.状态.等级 || 0;
            updateLevelTierDisplay(); // Update tier display after setting level from JSON
            form.proficiency.value = data.状态.熟练 || 0;
            form.money.value = data.状态.金钱 || 0;
            form.strength.value = data.状态.力量 || 0;
            form.agility.value = data.状态.敏捷 || 0;
            form.dexterity.value = data.状态.灵巧 || 0;
            form.instinct.value = data.状态.本能 || 0;
            form.knowledge.value = data.状态.知识 || 0;
            form.grace.value = data.状态.风度 || 0;
        }

        if (data.物品) {
            if (data.物品.武器 && Array.isArray(data.物品.武器)) {
                // 武器导入循环化简
                for (let i = 1; i <= 4; i++) {
                    if (data.物品.武器.length >= i) {
                        const weapon = data.物品.武器[i-1];
                        
                        // 使用对象属性名循环来处理所有字段
                        const weaponFields = ['名称', '检定', '属性', '范围', '伤害', '负荷', '特性'];
                        const formFields = ['weaponName', 'weaponCheck', 'weaponAttribute', 'weaponRange', 
                                           'weaponDamage', 'weaponTwoHanded', 'weaponTrait'];
                        
                        // 循环处理每个字段
                        for (let j = 0; j < weaponFields.length; j++) {
                            const formField = `${formFields[j]}${i}`;
                            if (form[formField]) {
                                form[formField].value = weapon[weaponFields[j]] || "";
                            }
                        }
                        
                        // 特别处理文本区域的自动增长
                        const traitTextarea = form[`weaponTrait${i}`];
                        if (traitTextarea) {
                            setTimeout(() => autoGrowTextarea({ target: traitTextarea }), 0);
                        }
                    }
                }            
            }
            if (data.物品.护甲 && data.物品.护甲.length > 0) {
                const armor = data.物品.护甲[0];
                 if(form.armorName1) form.armorName1.value = armor.名称 || "";
                 if(form.armorDefense1) form.armorDefense1.value = armor.防御 || 0;
                 if(form.armorTrait1) form.armorTrait1.value = armor.特性 || "";
                 if (form.armorTrait1) setTimeout(() => autoGrowTextarea({ target: form.armorTrait1 }), 0);
            }

            if (data.物品.道具 && Array.isArray(data.物品.道具)) {
                data.物品.道具.forEach((itemData, index) => {
                    let currentItemDiv;
                    if (index === 0 && itemsContainer.children[0] && itemsContainer.children[0].classList.contains('item')) {
                        currentItemDiv = itemsContainer.children[0];
                    } else {
                        addItemBtn.click(); // This will create a new item div with a select
                        currentItemDiv = itemsContainer.lastElementChild;
                    }

                    if (currentItemDiv) {
                        const nameSelect = currentItemDiv.querySelector('select[name="itemName"]');
                        const quantityInput = currentItemDiv.querySelector('input[name="itemQuantity"]');
                        const descriptionTextarea = currentItemDiv.querySelector('textarea[name="itemDescription"]');

                        if (nameSelect) {
                            populateItemSelect(nameSelect, itemData.名称); // Populate and select
                        }
                        if (quantityInput) quantityInput.value = itemData.数量 || "1";
                        
                        // populateItemSelect should handle pre-filling the description and auto-growing it.
                        // If it's not, this is a fallback, but the logic in populateItemSelect is preferred.
                        if (descriptionTextarea) {
                             descriptionTextarea.value = itemData.描述 || ""; // Set from JSON first
                             const selectedFullItem = ALL_ITEMS_DATA.find(i => i.名称 === itemData.名称);
                             if (selectedFullItem) { // Then override with effect if item is found
                                 descriptionTextarea.value = selectedFullItem.效果 || "";
                             }
                             setTimeout(() => autoGrowTextarea({ target: descriptionTextarea }), 0);
                        }
                    }
                });
            }
        }
        
        if (data.技能 && Array.isArray(data.技能)) {
            data.技能.forEach((skill) => {
                // Only add skills from JSON if they are not meant for the fixed slots
                // (which are now populated by update...AsSkills calls above)
                const isFixedTypeAttribute = skill.属性 === "种族" ||
                                             skill.属性 === "社群" ||
                                             skill.属性 === "职业" ||
                                             skill.属性 === "混血" ||
                                             skill.属性 === "职业特性" || // Added to prevent duplication
                                             skill.属性 === "子职特性";   // Added to prevent duplication
                // A more robust check might involve skill names if they are predictable for fixed slots,
                // e.g. if jobData.希望特性 always results in a skill named "希望特性".
                // For now, primarily rely on attribute.
                if (!isFixedTypeAttribute) {
                    const newSkillRow = addSkillEntry(skill); // This adds a dynamic, removable row
                    const skillDescTextarea = newSkillRow.querySelector('textarea[name="skillDescription"]');
                    if (skillDescTextarea) {
                        setTimeout(() => autoGrowTextarea({ target: skillDescTextarea }), 0);
                    }
                }
            });
        }
        
        // The update...AsSkills() calls were moved up to after dropdowns are set from JSON.
        // This ensures fixed slots are populated based on the imported character's race/group/job.

        skillNextId = skillsContainer.children.length + 1; 
    }
    function populateItemSelect(selectElement, selectedItemName = "") {
        if (!selectElement) {
            return;
        }
        selectElement.innerHTML = '<option value="">--选择道具--</option>'; // Default empty option

        ALL_ITEMS_DATA.forEach(item => {
            const option = document.createElement('option');
            option.value = item.名称;
            option.textContent = item.名称;
            if (item.名称 === selectedItemName) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });

        // If a selectedItemName is provided, find its data and pre-fill description and quantity
        if (selectedItemName) {
            const itemData = ALL_ITEMS_DATA.find(i => i.名称 === selectedItemName);
            const parentItemDiv = selectElement.closest('.item');
            if (itemData && parentItemDiv) {
                const descTextarea = parentItemDiv.querySelector('textarea[name="itemDescription"]');
                const quantityInput = parentItemDiv.querySelector('input[name="itemQuantity"]');
                if (descTextarea) {
                    descTextarea.value = itemData.效果 || "";
                    setTimeout(() => autoGrowTextarea({ target: descTextarea }), 0); // Trigger auto-grow
                }
                if (quantityInput) {
                    // Preserve existing quantity if it's already set (e.g. from JSON import), otherwise default to 1
                    if (!quantityInput.value || quantityInput.value === "0" || quantityInput.value === "") {
                         quantityInput.value = "1";
                    }
                }
            } else {
                console.log('[populateItemSelect] itemData or parentItemDiv not found for pre-fill.');
            }
        }

        selectElement.addEventListener('change', function(event) {
            const selectedName = event.target.value;
            const itemData = ALL_ITEMS_DATA.find(i => i.名称 === selectedName);
            const parentItemDiv = event.target.closest('.item');
            if (parentItemDiv) {
                const descTextarea = parentItemDiv.querySelector('textarea[name="itemDescription"]');
                const quantityInput = parentItemDiv.querySelector('input[name="itemQuantity"]');
                if (itemData) {
                    if (descTextarea) {
                        descTextarea.value = itemData.效果 || "";
                        setTimeout(() => autoGrowTextarea({ target: descTextarea }), 0); // Trigger auto-grow
                    }
                    if (quantityInput) {
                        quantityInput.value = "1"; // Default to 1 on new selection from dropdown
                    }
                } else {
                    if (descTextarea) {
                        descTextarea.value = "";
                        setTimeout(() => autoGrowTextarea({ target: descTextarea }), 0); // Trigger auto-grow
                    }
                    if (quantityInput) {
                        quantityInput.value = "1"; // Default to 1 even if item not found (e.g. "--选择道具--")
                    }
                }
            } else {
                console.log('[populateItemSelect] parentItemDiv not found in change event.');
            }
        });
    }
    // Initial population for the static item row if it exists
    const initialItemSelect = itemsContainer.querySelector('.item-name-select'); // This should get the first static item's select
    if (initialItemSelect) {
        populateItemSelect(initialItemSelect); // Populates options

        // Set default item after options are populated, if no value is already set (e.g., by import)
        // and if it's the specific static select with id="itemName"
        if (initialItemSelect.id === 'itemName' && !initialItemSelect.value) {
            const defaultItemNameToSet = "小型生命药水Minor Health Potion";
            const defaultItemEffectToSet = "立刻回复1d4生命值";
            
            let optionExists = false;
            for (let i = 0; i < initialItemSelect.options.length; i++) {
                if (initialItemSelect.options[i].value === defaultItemNameToSet) {
                    optionExists = true;
                    break;
                }
            }

            if (!optionExists) {
                const itemData = ALL_ITEMS_DATA.find(i => i.名称 === defaultItemNameToSet);
                if (itemData) {
                    const newOption = document.createElement('option');
                    newOption.value = defaultItemNameToSet;
                    newOption.textContent = defaultItemNameToSet;
                    initialItemSelect.appendChild(newOption);
                    optionExists = true;
                } else {
                    console.warn(`Default item "${defaultItemNameToSet}" not found in ALL_ITEMS_DATA. Cannot add as an option.`);
                }
            }

            if (optionExists) {
                initialItemSelect.value = defaultItemNameToSet;
                initialItemSelect.dispatchEvent(new Event('change', { bubbles: true }));
                
                // Ensure the description is set correctly, as the change event might be handled generally by populateItemSelect
                const parentItemDiv = initialItemSelect.closest('.item');
                if (parentItemDiv) {
                    const descriptionTextarea = parentItemDiv.querySelector('textarea[name="itemDescription"]'); // Or by ID if static
                    const quantityInput = parentItemDiv.querySelector('input[name="itemQuantity"]');
                    
                    if (descriptionTextarea) {
                        descriptionTextarea.value = defaultItemEffectToSet;
                        autoGrowTextarea({ target: descriptionTextarea });
                    }
                    if (quantityInput && !quantityInput.value) { // Set quantity if not already set
                        quantityInput.value = "1";
                    }
                }
            }
        }
    }
    // ====================== End of Import ======================


    // ====================== Export ======================
    const exportButton = document.getElementById('exportJson');
    exportButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const characterData = {
            "设定": {},
            "状态": {},
            "物品": { "武器": [], "护甲": [], "道具": [] },
            "技能": []
        };

        characterData.设定.角色名 = formData.get('roleName') || "";
        characterData.设定.年龄 = parseInt(formData.get('age'), 10) || 0;
        characterData.设定.性别 = formData.get('gender') || "";
        
        characterData.设定.经历 = [];
        const currentExperienceItems = experiencesContainer.querySelectorAll('.experience-item');
        currentExperienceItems.forEach((item) => {
            const keywordInput = item.querySelector('input[name="expKeyword"]');
            const valueInput = item.querySelector('input[name="expValue"]');
            if (keywordInput && valueInput) { 
                 characterData.设定.经历.push({
                    "关键词": keywordInput.value || "",
                    "调整值": valueInput.value || ""
                });
            }
        });

        characterData.设定.背景故事 = formData.get('backgroundStory') || "";
        characterData.设定.形象 = appearanceDataUrl || "";
        characterData.设定.种族 = form.raceSelect ? form.raceSelect.value : ""; 
        characterData.设定.混血种族 = form.mixedRaceSelect ? form.mixedRaceSelect.value : ""; 
        characterData.设定.社群 = form.communitySelect ? form.communitySelect.value : ""; 
        characterData.设定.职业 = form.professionSelect ? form.professionSelect.value : "";
        // Ensure we get value from subclassSelect if it exists, otherwise fallback to subProfession (old text input)
        const subProfessionValue = form.querySelector('#subclassSelect') ? form.querySelector('#subclassSelect').value : formData.get('subProfession');
        characterData.设定.子职 = subProfessionValue || ""; // Changed from 子职业 to 子职 to match HTML and populateForm
        characterData.设定.兼职 = formData.get('partTimeJob') || "";

        characterData.状态.HP = {"当前": parseInt(formData.get('hpCurrent'), 10) || 0, "最大": parseInt(formData.get('hpMax'), 10) || 0};
        characterData.状态.压力 = {"当前": parseInt(formData.get('stressCurrent'), 10) || 0, "最大": parseInt(formData.get('stressMax'), 10) || 0};
        characterData.状态.希望 = {"当前": parseInt(formData.get('hopeCurrent'), 10) || 0, "最大": parseInt(formData.get('hopeMax'), 10) || 0};
        characterData.状态.护甲 = {"当前": parseInt(formData.get('armorCurrent'), 10) || 0, "最大": parseInt(formData.get('armorMax'), 10) || 0};
        characterData.状态.护甲值 = parseInt(formData.get('armorValue'), 10) || 0;
        characterData.状态.等级 = parseInt(formData.get('level'), 10) || 0;
        characterData.状态.熟练 = parseInt(formData.get('proficiency'), 10) || 0;
        characterData.状态.金钱 = parseInt(formData.get('money'), 10) || 0;
        characterData.状态.力量 = parseInt(formData.get('strength'), 10) || 0;
        characterData.状态.敏捷 = parseInt(formData.get('agility'), 10) || 0;
        characterData.状态.灵巧 = parseInt(formData.get('dexterity'), 10) || 0;
        characterData.状态.本能 = parseInt(formData.get('instinct'), 10) || 0;
        characterData.状态.知识 = parseInt(formData.get('knowledge'), 10) || 0;
        characterData.状态.风度 = parseInt(formData.get('grace'), 10) || 0;

        // 替换这四个独立的武器导出块
        for (let i = 1; i <= 4; i++) {
            const weaponSelector = `#weaponName${i}`;
            if (form.querySelector(weaponSelector) && formData.get(`weaponName${i}`)) {
                characterData.物品.武器.push({
                    "名称": formData.get(`weaponName${i}`) || "",
                    "检定": formData.get(`weaponCheck${i}`) || "",
                    "属性": formData.get(`weaponAttribute${i}`) || "",
                    "范围": formData.get(`weaponRange${i}`) || "",
                    "伤害": formData.get(`weaponDamage${i}`) || "",
                    "负荷": formData.get(`weaponTwoHanded${i}`) || "",
                    "特性": formData.get(`weaponTrait${i}`) || ""
                });
            }
        }

        if (form.querySelector('#armorName1')) {
            characterData.物品.护甲.push({
                "名称": formData.get('armorName1') || "", "防御": formData.get('armorDefense1') || "", "特性": formData.get('armorTrait1') || ""
            });
        }
        characterData.物品.道具 = []; // Initialize道具 array
        const currentItemElements = itemsContainer.querySelectorAll('.item');
        currentItemElements.forEach((itemElement) => {
            const itemNameSelect = itemElement.querySelector('select[name="itemName"]');
            const itemQuantityInput = itemElement.querySelector('input[name="itemQuantity"]');
            const itemDescriptionTextarea = itemElement.querySelector('textarea[name="itemDescription"]');

            if (itemNameSelect && itemNameSelect.value) { // Only add if an item is selected
                characterData.物品.道具.push({
                    "名称": itemNameSelect.value,
                    "数量": itemQuantityInput ? itemQuantityInput.value : "1",
                    "描述": itemDescriptionTextarea ? itemDescriptionTextarea.value : ""
                });
            }
        });
        // Removed the logic for adding an empty item if none exist, as new select logic handles defaults.

        characterData.技能 = [];

        // Helper function to extract skill data from a row element
        function getSkillDataFromRow(rowElement) {
            if (!rowElement || rowElement.cells.length < 7) return null;

            const configInput = rowElement.cells[0].querySelector('input[name="skillConfig"]');
            const nameInput = rowElement.cells[1].querySelector('input[name="skillName"]');
            const domainInput = rowElement.cells[2].querySelector('input[name="skillDomain"]');
            const levelInput = rowElement.cells[3].querySelector('input[name="skillLevel"]');
            const attributeInput = rowElement.cells[4].querySelector('input[name="skillAttribute"]');
            const recallInput = rowElement.cells[5].querySelector('input[name="skillRecall"]');
            const descriptionTextarea = rowElement.cells[6].querySelector('textarea[name="skillDescription"]');

            // Only include the skill if it has a name (considered non-empty)
            if (nameInput && nameInput.value.trim() !== "") {
                return {
                    "配置": configInput?.value || "",
                    "名称": nameInput.value,
                    "领域": domainInput?.value || "",
                    "等级": levelInput?.value || "", // Keep level as string, or parse if strictly numeric
                    "属性": attributeInput?.value || "",
                    "回想": recallInput?.value || "",
                    "描述": descriptionTextarea?.value || ""
                };
            }
            return null;
        }

        // Export fixed skill slots
        AllFixedSlotIds.forEach(slotId => {
            const slotRow = document.getElementById(slotId);
            const skillData = getSkillDataFromRow(slotRow);
            if (skillData) { // Only add if the slot has a name (is considered filled)
                characterData.技能.push(skillData);
            }
        });

        // Export dynamic (non-fixed) skill slots
        const dynamicSkillElements = skillsContainer.querySelectorAll('tr.skill-item:not(.fixed-skill-slot)');
        dynamicSkillElements.forEach((rowElement) => {
            const skillData = getSkillDataFromRow(rowElement);
            if (skillData) {
                characterData.技能.push(skillData);
            }
        });
        
        const jsonDataString = JSON.stringify(characterData, null, 4);
        const blob = new Blob([jsonDataString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${characterData.设定.角色名 || 'character'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        console.log(characterData);
    });    
    // ====================== End of Export ======================


    // ================== newbie guide ==================
    const newbieGuideButton = document.getElementById('newbieGuideButton');
    const newbieGuideModal = document.getElementById('newbieGuideModal');
    const newbieGuideModalCloseButton = document.getElementById('newbieGuideModalCloseButton');
    const newbieGuideNextButton = document.getElementById('newbieGuideNextButton');
    const newbieGuideCancelButton = document.getElementById('newbieGuideCancelButton');
    const newbieGuideQuestionText = document.getElementById('newbieGuideQuestionText'); // This will hold the question <p>
    const newbieGuideAnswerInput = document.getElementById('newbieGuideAnswerInput'); // This is the text input field
    const newbieGuideDropdownInput = document.getElementById('newbieGuideDropdownInput');
    const newbieGuidePromptTextarea = document.getElementById('newbieGuidePromptTextarea'); // Added this

    let currentNewbieQuestionIndex = 0;
    let newbieUserAnswers = {};

    function displayCurrentNewbieQuestion() {
        if (currentNewbieQuestionIndex < newbieGuideQuestions.length) {
            const question = newbieGuideQuestions[currentNewbieQuestionIndex];
            newbieGuideQuestionText.textContent = question.prompt; // Set the question text

            // Hide all input types initially, textarea is always visible
            newbieGuideAnswerInput.style.display = 'none';
            newbieGuideDropdownInput.style.display = 'none';
            if (newbieGuidePromptTextarea) newbieGuidePromptTextarea.style.display = 'block';


            if (question.questionType === "dropdown") {
                newbieGuideDropdownInput.style.display = 'block';
                newbieGuideAnswerInput.style.display = 'none'; // Ensure text input is hidden
                newbieGuideDropdownInput.innerHTML = ''; // Clear existing options

                let dataSource;
                if (question.dataSourceVariable === "RACES_DATA") dataSource = typeof RACES_DATA !== 'undefined' ? RACES_DATA : null;
                else if (question.dataSourceVariable === "GROUPS_DATA") dataSource = typeof GROUPS_DATA !== 'undefined' ? GROUPS_DATA : null;
                else if (question.dataSourceVariable === "JOBS_DATA") dataSource = typeof JOBS_DATA !== 'undefined' ? JOBS_DATA : null;
                else dataSource = null;

                if (dataSource && Array.isArray(dataSource)) {
                    // Removed default "--- 请选择 ---" option for all dropdowns in newbie guide
                    // newbieGuideDropdownInput.innerHTML = ''; // Clear existing options - already done before this block

                    if (question.targetSelectId === "subclassSelect") {
                        const selectedProfessionName = newbieUserAnswers["professionSelect"];
                        let firstSubclassValue = null; // To store the value of the first subclass
                        let previousSelectionRestored = false;

                        if (selectedProfessionName) {
                            const jobData = JOBS_DATA.find(j => j.职业 === selectedProfessionName);
                            if (jobData && jobData.子职 && Array.isArray(jobData.子职)) {
                                if (jobData.子职.length === 0) {
                                    const noSubclassOption = document.createElement('option');
                                    noSubclassOption.value = "";
                                    noSubclassOption.textContent = "该职业无子职";
                                    noSubclassOption.disabled = true;
                                    newbieGuideDropdownInput.appendChild(noSubclassOption);
                                    newbieGuideDropdownInput.value = "";
                                } else {
                                    jobData.子职.forEach((subclass, index) => {
                                        const option = document.createElement('option');
                                        option.value = subclass[question.optionValueField];
                                        option.textContent = subclass[question.optionTextField];
                                        if (index === 0) {
                                            firstSubclassValue = subclass[question.optionValueField];
                                        }
                                        if (newbieUserAnswers[question.targetSelectId] === subclass[question.optionValueField]) {
                                            option.selected = true;
                                            previousSelectionRestored = true;
                                        }
                                        newbieGuideDropdownInput.appendChild(option);
                                    });
                                    // If previous selection was not restored and there's a first subclass, select it
                                    if (!previousSelectionRestored && firstSubclassValue) {
                                        newbieGuideDropdownInput.value = firstSubclassValue;
                                    } else if (!previousSelectionRestored && jobData.子职.length > 0) {
                                        // Fallback if firstSubclassValue somehow wasn't set but there are options
                                        newbieGuideDropdownInput.value = jobData.子职[0][question.optionValueField];
                                    }
                                }
                            } else {
                                const errorOption = document.createElement('option');
                                errorOption.value = "";
                                errorOption.textContent = "子职数据错误";
                                newbieGuideDropdownInput.appendChild(errorOption);
                            }
                        } else {
                            const errorOption = document.createElement('option');
                            errorOption.value = "";
                            errorOption.textContent = "请先选择职业";
                            newbieGuideDropdownInput.appendChild(errorOption);
                            newbieGuideDropdownInput.disabled = true;
                        }
                    } else {
                        // For other dropdowns (race, community, profession), add a default "--- 请选择 ---"
                        const defaultOption = document.createElement('option');
                        defaultOption.value = "";
                        defaultOption.textContent = `--- 请选择 ---`;
                        newbieGuideDropdownInput.appendChild(defaultOption);

                        dataSource.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item[question.optionValueField];
                            option.textContent = item[question.optionTextField];
                            if (newbieUserAnswers[question.targetSelectId] === item[question.optionValueField]) {
                                option.selected = true;
                            }
                            newbieGuideDropdownInput.appendChild(option);
                        });
                    }
                } else {
                    console.error(`Newbie Guide: Data source "${question.dataSourceVariable}" not found or not an array.`);
                    newbieGuideDropdownInput.innerHTML = '<option value="">数据加载失败</option>';
                }
                
                // Update placeholder based on current selection or default
                const selectedValue = newbieGuideDropdownInput.value;
                let promptCategoryKey;
                switch (question.targetSelectId) {
                    case 'raceSelect': promptCategoryKey = 'race'; break;
                    case 'mixedRaceSelect': promptCategoryKey = 'mixedRace'; break;
                    case 'communitySelect': promptCategoryKey = 'community'; break;
                    case 'professionSelect': promptCategoryKey = 'profession'; break;
                    case 'subclassSelect': promptCategoryKey = 'subclass'; break; // Added subclass
                    default: promptCategoryKey = null;
                }

                if (newbieGuidePromptTextarea) {
                    if (promptCategoryKey && newbieGuidePrompts[promptCategoryKey]) {
                        // For subclass, if a specific prompt for the selected subclass exists, use it. Otherwise, use the general subclass prompt.
                        if (promptCategoryKey === 'subclass' && newbieGuidePrompts.subclass[selectedValue]) {
                            newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.subclass[selectedValue];
                        } else if (promptCategoryKey === 'subclass' && newbieGuidePrompts.subclass[""]) {
                             newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.subclass[""];
                        }
                        else if (newbieGuidePrompts[promptCategoryKey][selectedValue]) {
                             newbieGuidePromptTextarea.placeholder = newbieGuidePrompts[promptCategoryKey][selectedValue];
                        }
                         else {
                            newbieGuidePromptTextarea.placeholder = newbieGuidePrompts[promptCategoryKey][""] || "请从上方选择一项以查看相关提示...";
                        }
                    } else if (promptCategoryKey === 'mixedRace' && newbieGuidePrompts.race) {
                        newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.race[selectedValue] || "请从上方选择一项以查看相关提示...";
                    } else {
                        newbieGuidePromptTextarea.placeholder = "请从上方选择一项以查看相关提示...";
                    }
                }
                newbieGuideDropdownInput.focus();

            } else { // Text input (now a textarea)
                newbieGuideAnswerInput.style.display = 'block';
                newbieGuideDropdownInput.style.display = 'none'; // Ensure dropdown is hidden
                newbieGuideAnswerInput.value = newbieUserAnswers[question.targetFieldId] || ''; // Restore previous answer
                if (newbieGuidePromptTextarea) {
                    newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.textInput[question.targetFieldId] || question.prompt;
                }
                newbieGuideAnswerInput.focus();
                // Ensure autoGrow is applied when question changes to text input
                setTimeout(() => autoGrowTextarea({ target: newbieGuideAnswerInput }), 0);
            }

            if (currentNewbieQuestionIndex === newbieGuideQuestions.length - 1) {
                newbieGuideNextButton.textContent = "完成";
            } else {
                newbieGuideNextButton.textContent = "下一步";
            }
        }
    }
    function populateFieldsFromNewbieGuide() {
        for (const fieldId in newbieUserAnswers) {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = newbieUserAnswers[fieldId];
                if (element.id === 'level') { // Example: trigger input for level if it has listeners
                    element.dispatchEvent(new Event('input', { bubbles: true }));
                }
            } else {
                if (!fieldId.includes("_placeholder_")) {
                    console.warn(`Newbie Guide: Target field with ID '${fieldId}' not found.`);
                } else {
                     console.log(`Newbie Guide: Placeholder field '${fieldId}' was answered. Value: ${newbieUserAnswers[fieldId]}. Manual handling needed.`);
                }
            }
        }
        resetNewbieGuide(); // Reset and hide modal
    }
    function startNewbieGuide() {
        currentNewbieQuestionIndex = 0;
        newbieUserAnswers = {};
        
        if (document.getElementById('newbieGuideAttributesContainer')) {
            document.getElementById('newbieGuideAttributesContainer').style.display = 'none';
        }
        if (newbieGuideDropdownInput) newbieGuideDropdownInput.style.display = 'none';
        if (newbieGuideAnswerInput) {
            newbieGuideAnswerInput.style.display = 'block';
            // Add autoGrow listener if not already added, or ensure it's active
            newbieGuideAnswerInput.removeEventListener('input', autoGrowTextarea); // Remove if exists to avoid duplicates
            newbieGuideAnswerInput.addEventListener('input', autoGrowTextarea);
            setTimeout(() => autoGrowTextarea({ target: newbieGuideAnswerInput }), 0); // Initial grow
        }

        const initialQuestion = newbieGuideQuestions[0];
        if (newbieGuidePromptTextarea) {
            if (initialQuestion && initialQuestion.targetFieldId && newbieGuidePrompts.textInput) {
                newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.textInput[initialQuestion.targetFieldId] || initialQuestion.prompt;
            } else if (initialQuestion) {
                newbieGuidePromptTextarea.placeholder = initialQuestion.prompt;
            } else {
                newbieGuidePromptTextarea.placeholder = "根据你的选择，这里会显示相关的提示词...";
            }
        }
        
        displayCurrentNewbieQuestion(); // This will also call autoGrow for the first question if it's text
        newbieGuideModal.style.display = 'block';
    }    
    function resetNewbieGuide() {
        newbieGuideModal.style.display = 'none';
        currentNewbieQuestionIndex = 0;
        newbieUserAnswers = {};
        newbieGuideNextButton.textContent = "下一步";
        if (newbieGuidePromptTextarea) {
            newbieGuidePromptTextarea.placeholder = "根据你的选择，这里会显示相关的提示词...";
        }
        if (document.getElementById('newbieGuideAttributesContainer')) {
            document.getElementById('newbieGuideAttributesContainer').style.display = 'none';
        }
        if (newbieGuideDropdownInput) newbieGuideDropdownInput.style.display = 'none';
        if (newbieGuideAnswerInput) newbieGuideAnswerInput.style.display = 'block';
    }
    if (newbieGuideButton && newbieGuideModal && newbieGuideModalCloseButton && newbieGuideCancelButton && newbieGuideNextButton && newbieGuideQuestionText && newbieGuideAnswerInput && newbieGuideDropdownInput && newbieGuidePromptTextarea) {
        newbieGuideButton.addEventListener('click', startNewbieGuide);

        newbieGuideDropdownInput.addEventListener('change', () => {
            const question = newbieGuideQuestions[currentNewbieQuestionIndex];
            if (question.questionType === "dropdown") {
                const selectedValue = newbieGuideDropdownInput.value;
                let promptCategoryKey;
                switch (question.targetSelectId) {
                    case 'raceSelect': promptCategoryKey = 'race'; break;
                    case 'mixedRaceSelect': promptCategoryKey = 'mixedRace'; break;
                    case 'communitySelect': promptCategoryKey = 'community'; break;
                    case 'professionSelect': promptCategoryKey = 'profession'; break;
                    case 'subclassSelect': promptCategoryKey = 'subclass'; break; // Added subclass
                    default: promptCategoryKey = null;
                }

                if (promptCategoryKey && newbieGuidePrompts[promptCategoryKey]) {
                     // For subclass, if a specific prompt for the selected subclass exists, use it. Otherwise, use the general subclass prompt.
                    if (promptCategoryKey === 'subclass' && newbieGuidePrompts.subclass[selectedValue]) {
                        newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.subclass[selectedValue];
                    } else if (promptCategoryKey === 'subclass' && newbieGuidePrompts.subclass[""]) {
                            newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.subclass[""];
                    } else if (newbieGuidePrompts[promptCategoryKey][selectedValue]) {
                            newbieGuidePromptTextarea.placeholder = newbieGuidePrompts[promptCategoryKey][selectedValue];
                    }
                    else {
                        newbieGuidePromptTextarea.placeholder = newbieGuidePrompts[promptCategoryKey][""] || "请从上方选择一项以查看相关提示...";
                    }
                } else if (promptCategoryKey === 'mixedRace' && newbieGuidePrompts.race) {
                    newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.race[selectedValue] || "请从上方选择一项以查看相关提示...";
                } else {
                    newbieGuidePromptTextarea.placeholder = "请从上方选择一项以查看相关提示...";
                }
            }
        });

        newbieGuideNextButton.addEventListener('click', () => {
            const question = newbieGuideQuestions[currentNewbieQuestionIndex];
            if (!question) return;

            // Skip subclass step if no subclasses are available for the selected profession
            if (question.targetSelectId === "subclassSelect") {
                const selectedProfessionName = newbieUserAnswers["professionSelect"];
                if (selectedProfessionName) {
                    const jobData = JOBS_DATA.find(j => j.职业 === selectedProfessionName);
                    if (!jobData || !jobData.子职 || jobData.子职.length === 0) {
                        // If no subclasses, store an empty value and skip to the next question
                        newbieUserAnswers[question.targetSelectId] = "";
                        const targetSelectElement = document.getElementById(question.targetSelectId);
                        if (targetSelectElement) {
                            targetSelectElement.value = ""; // Clear the main form's subclass select
                            targetSelectElement.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change for consistency
                        }
                        currentNewbieQuestionIndex++;
                        if (currentNewbieQuestionIndex < newbieGuideQuestions.length) {
                            displayCurrentNewbieQuestion();
                        } else {
                            populateFieldsFromNewbieGuide();
                        }
                        return; // Exit early
                    }
                } else {
                    // Profession not selected, should ideally not happen if guide flows correctly
                    // but as a fallback, treat as skippable
                    newbieUserAnswers[question.targetSelectId] = "";
                    currentNewbieQuestionIndex++;
                     if (currentNewbieQuestionIndex < newbieGuideQuestions.length) {
                        displayCurrentNewbieQuestion();
                    } else {
                        populateFieldsFromNewbieGuide();
                    }
                    return;
                }
            }


            if (question.questionType === "dropdown") {
                const selectedValue = newbieGuideDropdownInput.value;
                newbieUserAnswers[question.targetSelectId] = selectedValue;

                const targetSelectElement = document.getElementById(question.targetSelectId);
                if (targetSelectElement) {
                    targetSelectElement.value = selectedValue;
                    targetSelectElement.dispatchEvent(new Event('change', { bubbles: true }));
                    
                    if (question.updateFunction) {
                         console.log(`Newbie Guide: Triggered 'change' on ${question.targetSelectId}, which should call ${question.updateFunction}.`);
                    }

                    if (question.targetSelectId === "professionSelect") {
                        const selectedProfessionValue = newbieUserAnswers[question.targetSelectId];
                        const template = professionTemplates[selectedProfessionValue];
                        if (template) {
                            console.log(`Applying template for profession: ${selectedProfessionValue}`);
                            const attributeFields = ["strength", "agility", "instinct", "grace", "knowledge", "dexterity"]; // Corrected: presence to grace, finesse to dexterity
                            template.attributes.forEach((value, index) => {
                                const fieldId = attributeFields[index];
                                const element = document.getElementById(fieldId);
                                if (element) element.value = value;
                                else console.warn(`Newbie Guide Template: Attribute field ${fieldId} not found.`);
                            });

                            if (template.weapon) {
                                if(weaponName1Input) weaponName1Input.value = template.weapon.名称 || "";
                                if(document.getElementById('weaponCheck1')) document.getElementById('weaponCheck1').value = template.weapon.检定 || "";
                                if(document.getElementById('weaponAttribute1')) document.getElementById('weaponAttribute1').value = template.weapon.属性 || "";
                                if(document.getElementById('weaponRange1')) document.getElementById('weaponRange1').value = template.weapon.范围 || "";
                                if(document.getElementById('weaponDamage1')) document.getElementById('weaponDamage1').value = template.weapon.伤害 || "";
                                if(document.getElementById('weaponTwoHanded1')) document.getElementById('weaponTwoHanded1').value = template.weapon.负荷 || ""; // HTML uses weaponTwoHanded1 for load
                                if(document.getElementById('weaponTrait1')) document.getElementById('weaponTrait1').value = template.weapon.特性 || "";
                                if(document.getElementById('weaponTrait1')) autoGrowTextarea({target: document.getElementById('weaponTrait1')});
                            }
                            if (template.offHandWeapon && template.weapon && template.weapon.负荷 === "单手") { // Check main weapon is one-handed
                                if(weaponName2Input) weaponName2Input.value = template.offHandWeapon.名称 || "";
                                if(document.getElementById('weaponCheck2')) document.getElementById('weaponCheck2').value = template.offHandWeapon.检定 || "";
                                if(document.getElementById('weaponAttribute2')) document.getElementById('weaponAttribute2').value = template.offHandWeapon.属性 || "";
                                if(document.getElementById('weaponRange2')) document.getElementById('weaponRange2').value = template.offHandWeapon.范围 || "";
                                if(document.getElementById('weaponDamage2')) document.getElementById('weaponDamage2').value = template.offHandWeapon.伤害 || "";
                                if(document.getElementById('weaponTwoHanded2')) document.getElementById('weaponTwoHanded2').value = template.offHandWeapon.负荷 || ""; // HTML uses weaponTwoHanded2 for load
                                if(document.getElementById('weaponTrait2')) document.getElementById('weaponTrait2').value = template.offHandWeapon.特性 || "";
                                if(document.getElementById('weaponTrait2')) autoGrowTextarea({target: document.getElementById('weaponTrait2')});
                            } else { // Clear slot 2 if main is two-handed or no offhand
                                if(weaponName2Input) weaponName2Input.value = "";
                                if(document.getElementById('weaponCheck2')) document.getElementById('weaponCheck2').value = "";
                                if(document.getElementById('weaponAttribute2')) document.getElementById('weaponAttribute2').value = "";
                                if(document.getElementById('weaponRange2')) document.getElementById('weaponRange2').value = "";
                                if(document.getElementById('weaponDamage2')) document.getElementById('weaponDamage2').value = "";
                                if(document.getElementById('weaponTwoHanded2')) document.getElementById('weaponTwoHanded2').value = "";
                                if(document.getElementById('weaponTrait2')) document.getElementById('weaponTrait2').value = "";
                                if(document.getElementById('weaponTrait2')) autoGrowTextarea({target: document.getElementById('weaponTrait2')});
                            }
                            if (template.armor) {
                                if(armorName1Input) armorName1Input.value = template.armor.名称 || "";
                                if(document.getElementById('armorDefense1')) document.getElementById('armorDefense1').value = template.armor.防御 || "";
                                if(document.getElementById('armorTrait1')) document.getElementById('armorTrait1').value = template.armor.特性 || "";
                                if(document.getElementById('armorTrait1')) autoGrowTextarea({target: document.getElementById('armorTrait1')});
                            }
                        } else {
                            console.log(`Newbie Guide: No template found for profession: ${selectedProfessionValue}.`);
                        }
                    }
                    // Update placeholder for dropdown after all actions
                    let promptCategoryKey;
                    switch (question.targetSelectId) {
                        case 'raceSelect': promptCategoryKey = 'race'; break;
                        case 'mixedRaceSelect': promptCategoryKey = 'mixedRace'; break;
                        case 'communitySelect': promptCategoryKey = 'community'; break;
                        case 'professionSelect': promptCategoryKey = 'profession'; break;
                        case 'subclassSelect': promptCategoryKey = 'subclass'; break; // Added subclass
                        default: promptCategoryKey = null;
                    }
                    if (promptCategoryKey && newbieGuidePrompts[promptCategoryKey]) {
                        // For subclass, if a specific prompt for the selected subclass exists, use it. Otherwise, use the general subclass prompt.
                        if (promptCategoryKey === 'subclass' && newbieGuidePrompts.subclass[selectedValue]) {
                            newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.subclass[selectedValue];
                        } else if (promptCategoryKey === 'subclass' && newbieGuidePrompts.subclass[""]) {
                             newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.subclass[""];
                        } else if (newbieGuidePrompts[promptCategoryKey][selectedValue]) {
                             newbieGuidePromptTextarea.placeholder = newbieGuidePrompts[promptCategoryKey][selectedValue];
                        }
                        else {
                            newbieGuidePromptTextarea.placeholder = newbieGuidePrompts[promptCategoryKey][""] || "请从上方选择一项以查看相关提示...";
                        }
                    } else if (promptCategoryKey === 'mixedRace' && newbieGuidePrompts.race) {
                         newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.race[selectedValue] || "请从上方选择一项以查看相关提示...";
                    } else {
                        newbieGuidePromptTextarea.placeholder = "请从上方选择一项以查看相关提示...";
                    }

                } else {
                    console.warn(`Newbie Guide: Target select element with ID '${question.targetSelectId}' not found on the main form.`);
                }
            } else { // Default text input
                newbieUserAnswers[question.targetFieldId] = newbieGuideAnswerInput.value;
                 // Update main form field directly
                const mainFormField = document.getElementById(question.targetFieldId);
                if (mainFormField) {
                    mainFormField.value = newbieGuideAnswerInput.value;
                }
            }

            currentNewbieQuestionIndex++;
            if (currentNewbieQuestionIndex < newbieGuideQuestions.length) {
                displayCurrentNewbieQuestion();
            } else {
                populateFieldsFromNewbieGuide();
            }
        });

        newbieGuideModalCloseButton.addEventListener('click', resetNewbieGuide);
        newbieGuideCancelButton.addEventListener('click', () => {
            if (currentNewbieQuestionIndex > 0) {
                currentNewbieQuestionIndex--;
                displayCurrentNewbieQuestion();
            } else {
                resetNewbieGuide(); // If it's the first question, close the modal
            }
        });

        window.addEventListener('click', (event) => {
            if (event.target === newbieGuideModal) {
                resetNewbieGuide();
            }
        });
    }
    if (appearanceUpload && appearancePreview && removeAppearanceBtn) {
        appearanceUpload.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    appearancePreview.src = e.target.result;
                    appearancePreview.style.display = 'block';
                    removeAppearanceBtn.style.display = 'inline';
                    appearanceUpload.style.display = 'none';
                    appearanceDataUrl = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        });

        removeAppearanceBtn.addEventListener('click', function() {
            appearancePreview.src = "#";
            appearancePreview.style.display = 'none';
            removeAppearanceBtn.style.display = 'none';
            appearanceUpload.style.display = 'inline';
            appearanceUpload.value = null;
            appearanceDataUrl = "";
        });        
    }
    // ====================== End of newbie guide ======================


    // ===================== Utility Functions =====================
    function autoGrowTextarea(event) {
        const textarea = event.target;
        textarea.style.height = '0px';
        textarea.style.height = textarea.scrollHeight + 'px';
    }
    function addRemoveListener(button) {
        if (button) {
            button.addEventListener('click', function(event) {
                const experienceItem = event.target.closest('.experience-item');
                if (experienceItem) {
                    experienceItem.remove();
                    return;
                }
                const itemItem = event.target.closest('.item');
                if (itemItem) {
                    itemItem.remove();
                    return;
                }
                const skillItemRow = event.target.closest('tr.skill-item');
                if (skillItemRow) {
                    skillItemRow.remove();
                    return;
                }
            });
        }
    }
    document.querySelectorAll('.experience-item .remove-item-btn, .item .remove-item-btn, .skill-item .remove-item-btn').forEach(btn => {
        addRemoveListener(btn);
    });
    // Add autoGrowTextarea to initial static item description textarea
    const initialItemDescriptionTextarea = itemsContainer.querySelector('.item textarea[name="itemDescription"]');
    if (initialItemDescriptionTextarea) {
        initialItemDescriptionTextarea.addEventListener('input', autoGrowTextarea);
        // Trigger auto-grow in case there's pre-filled content (though unlikely for a static empty one)
        setTimeout(() => autoGrowTextarea({ target: initialItemDescriptionTextarea }), 0);
    }
    // ===================== End of Utility Functions =====================
});