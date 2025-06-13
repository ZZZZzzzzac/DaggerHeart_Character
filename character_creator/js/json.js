function initializeJsonModule() {
    //#region====================== Import ======================
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
                 if(form.armorDefense1) form.armorDefense1.value = armor.护甲值 || ""; // Changed 0 to "" for consistency with text input
                 if(form.armorMajorThreshold1) form.armorMajorThreshold1.value = armor.重伤阈值 || "";
                 if(form.armorSevereThreshold1) form.armorSevereThreshold1.value = armor.致命阈值 || "";
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
                            populateItemSelect(nameSelect, itemData.name); // Populate and select
                        }
                        if (quantityInput) quantityInput.value = itemData.数量 || "1";
                        
                        // populateItemSelect should handle pre-filling the description and auto-growing it.
                        // If it's not, this is a fallback, but the logic in populateItemSelect is preferred.
                        if (descriptionTextarea) {
                             descriptionTextarea.value = itemData.desc || ""; // Set from JSON first
                             const selectedFullItem = ALL_ITEMS_DATA.find(i => i.name === itemData.name);
                             if (selectedFullItem) { // Then override with effect if item is found
                                 descriptionTextarea.value = selectedFullItem.desc || "";
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

    // Initial population for the static item row if it exists
    const initialItemSelect = itemsContainer.querySelector('.item-name-select'); // This should get the first static item's select
    if (initialItemSelect) {
        populateItemSelect(initialItemSelect); // Populates options

        // Set default item after options are populated, if no value is already set (e.g., by import)
        // and if it's the specific static select with id="itemName"
        if (initialItemSelect.id === 'itemName' && !initialItemSelect.value) {
            const defaultItemNameToSet = "小型生命药水";
            const defaultItemEffectToSet = "立刻回复1d4生命值";
            
            let optionExists = false;
            for (let i = 0; i < initialItemSelect.options.length; i++) {
                if (initialItemSelect.options[i].value === defaultItemNameToSet) {
                    optionExists = true;
                    break;
                }
            }

            if (!optionExists) {
                const itemData = ALL_ITEMS_DATA.find(i => i.name === defaultItemNameToSet);
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
    //#endregion====================== End of Import ======================


    //#region====================== Export ======================
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
                "名称": formData.get('armorName1') || "",
                "护甲值": formData.get('armorDefense1') || "",
                "重伤阈值": formData.get('armorMajorThreshold1') || "",
                "致命阈值": formData.get('armorSevereThreshold1') || "",
                "特性": formData.get('armorTrait1') || ""
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

            const configInput = rowElement.cells[0].querySelector('select[name="skillConfig"]');
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
    //#endregion====================== End of Export ======================

}

function populateItemSelect(selectElement, selectedItemName = "") {
    if (!selectElement) {
        return;
    }
    selectElement.innerHTML = '<option value="">--选择道具--</option>'; // Default empty option

    ALL_ITEMS_DATA.forEach(item => {
        const option = document.createElement('option');
        option.value = item.name;
        option.textContent = item.name;
        if (item.name === selectedItemName) {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });

    // If a selectedItemName is provided, find its data and pre-fill description and quantity
    if (selectedItemName) {
        const itemData = ALL_ITEMS_DATA.find(i => i.name === selectedItemName);
        const parentItemDiv = selectElement.closest('.item');
        if (itemData && parentItemDiv) {
            const descTextarea = parentItemDiv.querySelector('textarea[name="itemDescription"]');
            const quantityInput = parentItemDiv.querySelector('input[name="itemQuantity"]');
            if (descTextarea) {
                descTextarea.value = itemData.desc || "";
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
        const itemData = ALL_ITEMS_DATA.find(i => i.name === selectedName);
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