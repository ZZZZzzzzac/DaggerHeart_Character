document.addEventListener('DOMContentLoaded', () => {
    const FixedSkillSlotIds = {
        RACE_1: 'fixed-skill-race-1',
        RACE_2: 'fixed-skill-race-2',
        GROUP_1: 'fixed-skill-group-1',
        JOB_1: 'fixed-skill-job-1',
        JOB_2: 'fixed-skill-job-2'
    };
    const AllFixedSlotIds = Object.values(FixedSkillSlotIds);

    const form = document.getElementById('characterForm');
    const exportButton = document.getElementById('exportJson');
    const importJsonBtn = document.getElementById('importJsonBtn');
    const importFile = document.getElementById('importFile');

    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const addSkillBtn = document.getElementById('addSkillBtn');

    const experiencesContainer = document.getElementById('experiences');
    const itemsContainer = document.getElementById('items');
    const skillsContainer = document.getElementById('skillsContainer');
    const appearanceUpload = document.getElementById('appearanceUpload');
    const appearancePreview = document.getElementById('appearancePreview');
    const removeAppearanceBtn = document.getElementById('removeAppearanceBtn');

    const raceSelect = document.getElementById('raceSelect');
    const mixedRaceSelect = document.getElementById('mixedRaceSelect');
    const communitySelect = document.getElementById('communitySelect');
    const professionSelect = document.getElementById('professionSelect');
    const levelInput = document.getElementById('level');
    const levelTierDisplay = document.getElementById('levelTierDisplay');

    let experienceNextId = experiencesContainer.children.length + 1;
    let itemNextId = itemsContainer.children.length + 1;
    // skillNextId will be used for dynamic skills later, if any.
    // let skillNextId = skillsContainer.children.length + 1; // Comment out for now or adjust after fixed slots
    let appearanceDataUrl = "";

    const ALL_ITEMS_DATA = [...ITEMS_DATA, ...CONSUMABLES_DATA];

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

    addExperienceBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('experience-item');
        newItem.innerHTML = `
            <input type="text" id="expKeyword" name="expKeyword" placeholder="关键词">
            <input type="text" id="expValue" name="expValue" placeholder="调整值">
            <button type="button" class="remove-item-btn">-</button>
        `;
        experiencesContainer.appendChild(newItem);
        addRemoveListener(newItem.querySelector('.remove-item-btn'));
    });

    addItemBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        const currentId = itemNextId++; // Keep for unique IDs if needed for other elements
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

    function populateItemSelect(selectElement, selectedItemName = "") {
        console.log('[populateItemSelect] Called with selectElement:', selectElement, 'selectedItemName:', selectedItemName);
        if (!selectElement) {
            console.log('[populateItemSelect] selectElement is null or undefined. Returning.');
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
            console.log('[populateItemSelect] selectedItemName provided:', selectedItemName);
            const itemData = ALL_ITEMS_DATA.find(i => i.名称 === selectedItemName);
            console.log('[populateItemSelect] Found itemData for selectedItemName:', itemData);
            const parentItemDiv = selectElement.closest('.item');
            console.log('[populateItemSelect] parentItemDiv for pre-fill:', parentItemDiv);
            if (itemData && parentItemDiv) {
                const descTextarea = parentItemDiv.querySelector('textarea[name="itemDescription"]');
                const quantityInput = parentItemDiv.querySelector('input[name="itemQuantity"]');
                console.log('[populateItemSelect] descTextarea:', descTextarea, 'quantityInput:', quantityInput);
                if (descTextarea) {
                    descTextarea.value = itemData.效果 || "";
                    console.log('[populateItemSelect] Set descTextarea value to:', descTextarea.value);
                    setTimeout(() => autoGrowTextarea({ target: descTextarea }), 0); // Trigger auto-grow
                }
                if (quantityInput) {
                    // Preserve existing quantity if it's already set (e.g. from JSON import), otherwise default to 1
                    if (!quantityInput.value || quantityInput.value === "0" || quantityInput.value === "") {
                         quantityInput.value = "1";
                    }
                    console.log('[populateItemSelect] Set quantityInput value to:', quantityInput.value);
                }
            } else {
                console.log('[populateItemSelect] itemData or parentItemDiv not found for pre-fill.');
            }
        }

        selectElement.addEventListener('change', function(event) {
            console.log('[populateItemSelect] Change event triggered on selectElement:', event.target);
            const selectedName = event.target.value;
            console.log('[populateItemSelect] Selected name in change event:', selectedName);
            const itemData = ALL_ITEMS_DATA.find(i => i.名称 === selectedName);
            console.log('[populateItemSelect] Found itemData in change event:', itemData);
            const parentItemDiv = event.target.closest('.item');
            console.log('[populateItemSelect] parentItemDiv in change event:', parentItemDiv);
            if (parentItemDiv) {
                const descTextarea = parentItemDiv.querySelector('textarea[name="itemDescription"]');
                const quantityInput = parentItemDiv.querySelector('input[name="itemQuantity"]');
                console.log('[populateItemSelect] descTextarea in change event:', descTextarea, 'quantityInput in change event:', quantityInput);
                if (itemData) {
                    if (descTextarea) {
                        descTextarea.value = itemData.效果 || "";
                        console.log('[populateItemSelect] Set descTextarea value in change event to:', descTextarea.value);
                        setTimeout(() => autoGrowTextarea({ target: descTextarea }), 0); // Trigger auto-grow
                    }
                    if (quantityInput) {
                        quantityInput.value = "1"; // Default to 1 on new selection from dropdown
                        console.log('[populateItemSelect] Set quantityInput value in change event to:', quantityInput.value);
                    }
                } else {
                    if (descTextarea) {
                        descTextarea.value = "";
                        console.log('[populateItemSelect] Cleared descTextarea value in change event.');
                        setTimeout(() => autoGrowTextarea({ target: descTextarea }), 0); // Trigger auto-grow
                    }
                    if (quantityInput) {
                        quantityInput.value = "1"; // Default to 1 even if item not found (e.g. "--选择道具--")
                         console.log('[populateItemSelect] Set quantityInput to 1 as itemData not found in change event.');
                    }
                }
            } else {
                console.log('[populateItemSelect] parentItemDiv not found in change event.');
            }
        });
    }

    // Initial population for the static item row if it exists
    const initialItemSelect = itemsContainer.querySelector('.item-name-select');
    if (initialItemSelect) {
        populateItemSelect(initialItemSelect);
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
        const defaultLevel = skillData.等级 || (isFixedSlot ? '' : '0'); // Fixed slots might not have a numeric level initially

        newRow.innerHTML = `
            <td><input type="text" name="skillConfig" placeholder="配置" value="${defaultConfig}"></td>
            <td><input type="text" name="skillName" placeholder="名称" value="${skillData.名称 || ''}"></td>
            <td><input type="text" name="skillDomain" placeholder="领域" value="${skillData.领域 || ''}"></td>
            <td><input type="text" name="skillLevel" placeholder="等级" value="${defaultLevel}"></td>
            <td><input type="text" name="skillAttribute" placeholder="属性" value="${defaultAttribute}"></td>
            <td><input type="text" name="skillRecall" placeholder="回想" value="${skillData.回想 || ''}"></td>
            <td><textarea name="skillDescription" placeholder="描述">${skillData.描述 || ''}</textarea></td>
            <td><button type="button" class="remove-item-btn" style="${isFixedSlot ? 'display:none;' : ''}">-</button></td>
        `;

        const newTextarea = newRow.querySelector('textarea[name="skillDescription"]');
        if (newTextarea) {
            newTextarea.addEventListener('input', autoGrowTextarea);
        }
        if (!isFixedSlot) {
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
        else if (slotId === FixedSkillSlotIds.JOB_1 || slotId === FixedSkillSlotIds.JOB_2) currentAttributeType = "职业";

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
    }

    // addSkillEntry is now for DYNAMIC, non-fixed skills, added AFTER fixed slots
    function addSkillEntry(skillData) {
        const newRow = createSkillRowElement(skillData, false); // isFixedSlot = false
        skillsContainer.appendChild(newRow);
        const textarea = newRow.querySelector('textarea[name="skillDescription"]');
        // Initial auto-grow for dynamically added textareas
        if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
        return newRow;
    }

    addSkillBtn.addEventListener('click', () => {
        addSkillEntry({
            配置: "", 名称: "", 领域: "", 等级: "0", 属性: "", 回想: "", 描述: ""
        });
    });

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
        experienceNextId = 1;
        itemsContainer.innerHTML = '';
        itemNextId = 1;
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

            // After setting dropdowns from JSON, update the fixed skill slots accordingly
            updateRaceTraitsAsSkills();
            updateGroupTraitAsSkill();
            updateJobTraitsAsSkills();
            
            form.subProfession.value = data.设定.子职业 || "";
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
                // Populate Weapon 1
                if (data.物品.武器.length > 0) {
                    const weapon1 = data.物品.武器[0];
                    if(form.weaponName1) form.weaponName1.value = weapon1.名称 || "";
                    if(form.weaponCheck1) form.weaponCheck1.value = weapon1.检定 || "";
                    if(form.weaponAttribute1) form.weaponAttribute1.value = weapon1.属性 || "";
                    if(form.weaponRange1) form.weaponRange1.value = weapon1.范围 || "";
                    if(form.weaponDamage1) form.weaponDamage1.value = weapon1.伤害 || ""; // Damage is text
                    if (form.weaponTwoHanded1) form.weaponTwoHanded1.value = weapon1.负荷 || "";
                    if(form.weaponTrait1) form.weaponTrait1.value = weapon1.特性 || "";
                }
                // Populate Weapon 2
                if (data.物品.武器.length > 1) {
                    const weapon2 = data.物品.武器[1];
                    if(form.weaponName2) form.weaponName2.value = weapon2.名称 || "";
                    if(form.weaponCheck2) form.weaponCheck2.value = weapon2.检定 || "";
                    if(form.weaponAttribute2) form.weaponAttribute2.value = weapon2.属性 || "";
                    if(form.weaponRange2) form.weaponRange2.value = weapon2.范围 || "";
                    if(form.weaponDamage2) form.weaponDamage2.value = weapon2.伤害 || ""; // Damage is text
                    if (form.weaponTwoHanded2) form.weaponTwoHanded2.value = weapon2.负荷 || "";
                    if(form.weaponTrait2) form.weaponTrait2.value = weapon2.特性 || "";
                }
            }
            if (data.物品.护甲 && data.物品.护甲.length > 0) {
                const armor = data.物品.护甲[0];
                 if(form.armorName1) form.armorName1.value = armor.名称 || "";
                 if(form.armorDefense1) form.armorDefense1.value = armor.防御 || 0;
                 if(form.armorTrait1) form.armorTrait1.value = armor.特性 || "";
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
                const isFixedTypeAttribute = skill.属性 === "种族" || skill.属性 === "社群" || skill.属性 === "职业" || skill.属性 === "混血";
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

        experienceNextId = experiencesContainer.children.length + 1;
        itemNextId = itemsContainer.children.length + 1;
        skillNextId = skillsContainer.children.length + 1; 
    }


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
        // while (characterData.设定.经历.length < 5) {  // Removed: Do not pad experiences to 5
        //     characterData.设定.经历.push({"关键词": "", "调整值": 0});
        // }

        characterData.设定.背景故事 = formData.get('backgroundStory') || "";
        characterData.设定.形象 = appearanceDataUrl || "";
        characterData.设定.种族 = form.raceSelect ? form.raceSelect.value : ""; 
        characterData.设定.混血种族 = form.mixedRaceSelect ? form.mixedRaceSelect.value : ""; 
        characterData.设定.社群 = form.communitySelect ? form.communitySelect.value : ""; 
        characterData.设定.职业 = form.professionSelect ? form.professionSelect.value : ""; 
        characterData.设定.子职业 = formData.get('subProfession') || "";
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

        // Export Weapon 1
        if (form.querySelector('#weaponName1') && formData.get('weaponName1')) { // Check if name exists to consider it non-empty
             characterData.物品.武器.push({
                "名称": formData.get('weaponName1') || "",
                "检定": formData.get('weaponCheck1') || "",
                "属性": formData.get('weaponAttribute1') || "",
                "范围": formData.get('weaponRange1') || "",
                "伤害": formData.get('weaponDamage1') || "", // Damage is text
                "负荷": formData.get('weaponTwoHanded1') || "",
                "特性": formData.get('weaponTrait1') || ""
            });
        }
        // Export Weapon 2
        if (form.querySelector('#weaponName2') && formData.get('weaponName2')) { // Check if name exists to consider it non-empty
            characterData.物品.武器.push({
               "名称": formData.get('weaponName2') || "",
               "检定": formData.get('weaponCheck2') || "",
               "属性": formData.get('weaponAttribute2') || "",
               "范围": formData.get('weaponRange2') || "",
               "伤害": formData.get('weaponDamage2') || "", // Damage is text
               "负荷": formData.get('weaponTwoHanded2') || "",
               "特性": formData.get('weaponTrait2') || ""
           });
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
    
    document.querySelectorAll('#skillsContainer textarea[name="skillDescription"]').forEach(textarea => {
        textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
    });

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

    populateGenericSelect(raceSelect, RACES_DATA, 'race', 'race', "必选", "RACES_DATA");
    populateGenericSelect(mixedRaceSelect, RACES_DATA, 'race', 'race', "可选", "RACES_DATA");
    populateGenericSelect(communitySelect, GROUPS_DATA, '社群', '社群', "必选", "GROUPS_DATA");
    populateGenericSelect(professionSelect, JOBS_DATA, '职业', '职业', "必选", "JOBS_DATA");

    if (raceSelect) raceSelect.addEventListener('change', updateRaceTraitsAsSkills);
    if (mixedRaceSelect) mixedRaceSelect.addEventListener('change', updateRaceTraitsAsSkills);
    if (communitySelect) communitySelect.addEventListener('change', updateGroupTraitAsSkill);
    if (professionSelect) professionSelect.addEventListener('change', updateJobTraitsAsSkills);
    
    // Initial calls for a fresh form (no import) - only if data is loaded.
    // populateForm handles these calls after an import.
    if (typeof RACES_DATA !== 'undefined' && RACES_DATA.length > 0 && raceSelect.value) {
         updateRaceTraitsAsSkills();
    }
    if (typeof GROUPS_DATA !== 'undefined' && GROUPS_DATA.length > 0 && communitySelect.value) {
        updateGroupTraitAsSkill();
    }
    if (typeof JOBS_DATA !== 'undefined' && JOBS_DATA.length > 0 && professionSelect.value) {
        updateJobTraitsAsSkills();
    }

    function updateRaceTraitsAsSkills() {
        if (!raceSelect || typeof RACES_DATA === 'undefined' || !Array.isArray(RACES_DATA) || RACES_DATA.length === 0) {
            updateSkillInSlot(FixedSkillSlotIds.RACE_1, null);
            updateSkillInSlot(FixedSkillSlotIds.RACE_2, null);
            return;
        }

        const selectedRaceName = raceSelect.value;
        const selectedMixedRaceName = mixedRaceSelect ? mixedRaceSelect.value : null;
        
        let trait1Data = null;
        let trait2Data = null;

        if (selectedRaceName) {
            const mainRaceData = RACES_DATA.find(r => r.race === selectedRaceName);
            if (mainRaceData) {
                if (mainRaceData.trait1 && mainRaceData.trait1.name) {
                    trait1Data = {
                        配置: "永久",
                        名称: mainRaceData.trait1.name,
                        领域: "",
                        等级: "", // Racial traits might not have a numeric level
                        属性: "种族",
                        回想: "",
                        描述: mainRaceData.trait1.description || ""
                    };
                }

                let secondFeatureSource = null;
                let secondFeatureAttribute = "种族"; // Default to main race's second trait

                if (selectedMixedRaceName && selectedMixedRaceName !== "" && selectedMixedRaceName !== selectedRaceName) {
                    const mixedRaceData = RACES_DATA.find(r => r.race === selectedMixedRaceName);
                    // Use trait2 from mixed race for the second slot if mixed race is selected and valid
                    if (mixedRaceData && mixedRaceData.trait2 && mixedRaceData.trait2.name) {
                        secondFeatureSource = mixedRaceData.trait2;
                        secondFeatureAttribute = "混血";
                    } else if (mixedRaceData && mixedRaceData.trait1 && mixedRaceData.trait1.name) {
                        // Fallback: if mixed race selected but no trait2, use its trait1 for the second slot
                        // This handles cases where a "mixed" choice is essentially picking another primary race for the second trait
                        // Ensure it's different from the main race's first trait if possible, or document this behavior.
                        // For now, let's assume trait2 of mixed is the primary target. If not, then mainRaceData.trait2.
                        // The original logic was: if mixed, use mixed.trait2. Else use main.trait2.
                        // So, if mixed is chosen, we prioritize its trait2.
                         secondFeatureSource = mixedRaceData.trait2; // This might be null if mixedRaceData.trait2 is not valid
                         if (secondFeatureSource) secondFeatureAttribute = "混血";
                    }
                }
                
                // If no valid second feature from mixed race, try main race's trait2
                if (!secondFeatureSource && mainRaceData.trait2 && mainRaceData.trait2.name) {
                    secondFeatureSource = mainRaceData.trait2;
                    secondFeatureAttribute = "种族";
                }

                if (secondFeatureSource) {
                    trait2Data = {
                        配置: "永久",
                        名称: secondFeatureSource.name,
                        领域: "",
                        等级: "",
                        属性: secondFeatureAttribute,
                        回想: "",
                        描述: secondFeatureSource.description || ""
                    };
                }
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
                groupTraitData = {
                    配置: "永久",
                    名称: groupData.特性名,
                    领域: "",
                    等级: "",
                    属性: "社群",
                    回想: "",
                    描述: groupData.描述
                };
            }
        }
        updateSkillInSlot(FixedSkillSlotIds.GROUP_1, groupTraitData);
    }

    function updateJobTraitsAsSkills() {
        if (!professionSelect || typeof JOBS_DATA === 'undefined' || !Array.isArray(JOBS_DATA)) {
            updateSkillInSlot(FixedSkillSlotIds.JOB_1, null);
            updateSkillInSlot(FixedSkillSlotIds.JOB_2, null);
            return;
        }

        const selectedJobName = professionSelect.value;
        let jobTrait1Data = null; // For "希望特性"
        let jobTrait2Data = null; // For "职业特性名"

        if (selectedJobName) {
            const jobData = JOBS_DATA.find(j => j.职业 === selectedJobName);
            if (jobData) {
                if (jobData.希望特性) { // Assuming "希望特性" is a string description for a skill named "希望特性"
                    jobTrait1Data = {
                        配置: "永久",
                        名称: "希望特性", // Fixed name for this slot type
                        领域: "",
                        等级: "",
                        属性: "职业",
                        回想: "",
                        描述: jobData.希望特性
                    };
                }
                if (jobData.职业特性名 && jobData.职业特性描述) {
                    jobTrait2Data = {
                        配置: "永久",
                        名称: jobData.职业特性名,
                        领域: "",
                        等级: "",
                        属性: "职业",
                        回想: "",
                        描述: jobData.职业特性描述
                    };
                }
            }
        }
        updateSkillInSlot(FixedSkillSlotIds.JOB_1, jobTrait1Data);
        updateSkillInSlot(FixedSkillSlotIds.JOB_2, jobTrait2Data);
    }

    function calculateTier(level) {
        const lvl = parseInt(level, 10);
        if (isNaN(lvl)) return 0; // Default to tier 0 if level is not a number
        if (lvl === 1) return 0;
        if (lvl >= 2 && lvl <= 4) return 1;
        if (lvl >= 5 && lvl <= 7) return 2;
        if (lvl >= 8) return 3;
        return 0; // Default for any other case (e.g., level < 1)
    }

    function updateLevelTierDisplay() {
        if (levelInput && levelTierDisplay) {
            const tier = calculateTier(levelInput.value);
            levelTierDisplay.textContent = `T${tier}`;
        }
    }

    if (levelInput) {
        levelInput.addEventListener('input', updateLevelTierDisplay);
    }

    // // Initial population of dropdowns
    // populateGenericSelect(raceSelect, RACES_DATA, 'name', 'name', '--选择种族--', '种族');
    // populateGenericSelect(mixedRaceSelect, RACES_DATA, 'name', 'name', '--选择混血--', '混血');
    // populateGenericSelect(communitySelect, GROUPS_DATA, '社群', '社群', '--选择社群--', '社群');
    // populateGenericSelect(professionSelect, JOBS_DATA, '职业', '职业', '--选择职业--', '职业');


    // // Initial skill updates based on default dropdown values (likely none selected)
    // updateRaceTraitsAsSkills();
    // updateGroupTraitAsSkill();
    // updateJobTraitsAsSkills();
    updateLevelTierDisplay(); // Initial tier display on load
});