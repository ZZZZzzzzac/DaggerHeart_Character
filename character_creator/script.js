document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('characterForm');
    const exportButton = document.getElementById('exportJson');
    const importJsonBtn = document.getElementById('importJsonBtn');
    const importFile = document.getElementById('importFile');

    const addExperienceBtn = document.getElementById('addExperienceBtn');
    const addItemBtn = document.getElementById('addItemBtn');
    const addSkillBtn = document.getElementById('addSkillBtn');

    const experiencesContainer = document.getElementById('experiences');
    const itemsContainer = document.getElementById('items');
    const skillsContainer = document.getElementById('skills');
    const appearanceUpload = document.getElementById('appearanceUpload');
    const appearancePreview = document.getElementById('appearancePreview');
    const removeAppearanceBtn = document.getElementById('removeAppearanceBtn');

    let experienceNextId = experiencesContainer.children.length + 1;
    let itemNextId = itemsContainer.children.length + 1;
    let skillNextId = skillsContainer.children.length + 1;
    let appearanceDataUrl = "";

    function addRemoveListener(button) {
        if (button) {
            button.addEventListener('click', function() {
                this.parentElement.remove();
                // No need to re-index or change counts here, export will handle current DOM
            });
        }
    }

    // Add remove listeners to initially loaded items
    document.querySelectorAll('.experience-item .remove-item-btn, .item .remove-item-btn').forEach(btn => {
        addRemoveListener(btn);
    });

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
        // const currentId = experienceNextId++; // No longer needed for ID/name
        newItem.innerHTML = `
            <label for="expKeyword">关键词:</label>
            <input type="text" id="expKeyword" name="expKeyword">
            <label for="expValue">调整值:</label>
            <input type="number" id="expValue" name="expValue" min="0" max="99">
            <button type="button" class="remove-item-btn">-</button>
        `;
        experiencesContainer.appendChild(newItem);
        addRemoveListener(newItem.querySelector('.remove-item-btn'));
    });

    addItemBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        const currentId = itemNextId++;
        newItem.innerHTML = `
            <label for="itemName${currentId}">名称:</label>
            <input type="text" id="itemName${currentId}" name="itemName${currentId}">
            <label for="itemQuantity${currentId}">数量:</label>
            <input type="number" id="itemQuantity${currentId}" name="itemQuantity${currentId}" value="0">
            <label for="itemDescription${currentId}">描述:</label>
            <input type="text" id="itemDescription${currentId}" name="itemDescription${currentId}">
            <button type="button" class="remove-item-btn">-</button>
        `;
        itemsContainer.appendChild(newItem);
        addRemoveListener(newItem.querySelector('.remove-item-btn'));
    });

    addSkillBtn.addEventListener('click', () => {
        const newItem = document.createElement('div');
        newItem.classList.add('item');
        const currentId = skillNextId++;
        newItem.innerHTML = `
            <label for="skillConfig${currentId}">配置:</label>
            <input type="text" id="skillConfig${currentId}" name="skillConfig${currentId}">
            <label for="skillName${currentId}">名称:</label>
            <input type="text" id="skillName${currentId}" name="skillName${currentId}">
            <label for="skillDomain${currentId}">领域:</label>
            <input type="text" id="skillDomain${currentId}" name="skillDomain${currentId}">
            <label for="skillLevel${currentId}">等级:</label>
            <input type="number" id="skillLevel${currentId}" name="skillLevel${currentId}" value="0">
            <label for="skillAttribute${currentId}">属性:</label>
            <input type="text" id="skillAttribute${currentId}" name="skillAttribute${currentId}">
            <label for="skillRecall${currentId}">回想:</label>
            <input type="text" id="skillRecall${currentId}" name="skillRecall${currentId}">
            <button type="button" class="remove-item-btn">-</button>
            <textarea id="skillDescription${currentId}" name="skillDescription${currentId}" placeholder="描述"></textarea>
        `;
        skillsContainer.appendChild(newItem);
        addRemoveListener(newItem.querySelector('.remove-item-btn'));
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
        form.reset(); // Reset form to default values first

        // Clear existing dynamic items
        experiencesContainer.innerHTML = '';
        experienceNextId = 1;
        itemsContainer.innerHTML = '';
        itemNextId = 1;
        skillsContainer.innerHTML = '';
        skillNextId = 1;
        
        // Reset appearance
        appearancePreview.src = "#";
        appearancePreview.style.display = 'none';
        removeAppearanceBtn.style.display = 'none';
        appearanceUpload.style.display = 'inline';
        appearanceUpload.value = null;
        appearanceDataUrl = "";

        // Populate "设定"
        if (data.设定) {
            form.roleName.value = data.设定.角色名 || "";
            form.age.value = data.设定.年龄 || 0;
            form.gender.value = data.设定.性别 || "";
            form.race.value = data.设定.种族 || "";
            form.mixedRace.value = data.设定.混血种族 || "";
            form.community.value = data.设定.社群 || "";
            form.profession.value = data.设定.职业 || "";
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
                data.设定.经历.forEach((exp, index) => {
                    // Logic to populate experiences needs to be more robust without unique IDs per item if multiple exist initially
                    // For now, assuming addExperienceBtn.click() correctly creates new distinct items
                    // and we populate them sequentially.
                    // If initial HTML has multiple, this might need adjustment or rely on initial items being handled by direct form field names if they are unique.

                    // Create a new row for each experience from JSON
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

        // Populate "状态"
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
            form.proficiency.value = data.状态.熟练 || 0;
            form.money.value = data.状态.金钱 || 0;
            form.strength.value = data.状态.力量 || 0;
            form.agility.value = data.状态.敏捷 || 0;
            form.dexterity.value = data.状态.灵巧 || 0;
            form.instinct.value = data.状态.本能 || 0;
            form.knowledge.value = data.状态.知识 || 0;
            form.grace.value = data.状态.风度 || 0;
        }

        // Populate "物品"
        if (data.物品) {
            if (data.物品.武器 && data.物品.武器.length > 0) {
                const weapon = data.物品.武器[0];
                if(form.weaponName1) form.weaponName1.value = weapon.名称 || "";
                if(form.weaponCheck1) form.weaponCheck1.value = weapon.检定 || "";
                if(form.weaponAttribute1) form.weaponAttribute1.value = weapon.属性 || "";
                if(form.weaponRange1) form.weaponRange1.value = weapon.距离 || "";
                if(form.weaponDamage1) form.weaponDamage1.value = weapon.伤害 || 0;
                if (form.weaponTwoHanded1) form.weaponTwoHanded1.checked = weapon.双手 || false;
                if(form.weaponTrait1) form.weaponTrait1.value = weapon.特性 || "";
            }
            if (data.物品.护甲 && data.物品.护甲.length > 0) {
                const armor = data.物品.护甲[0];
                 if(form.armorName1) form.armorName1.value = armor.名称 || "";
                 if(form.armorDefense1) form.armorDefense1.value = armor.防御 || 0;
                 if(form.armorTrait1) form.armorTrait1.value = armor.特性 || "";
            }

            if (data.物品.道具 && Array.isArray(data.物品.道具)) {
                data.物品.道具.forEach((item, index) => {
                     if(index === 0 && itemsContainer.children[index]){ // Fill initial item
                        itemsContainer.children[index].querySelector(`input[name^="itemName"]`).value = item.名称 || "";
                        itemsContainer.children[index].querySelector(`input[name^="itemQuantity"]`).value = item.数量 || 0;
                        itemsContainer.children[index].querySelector(`input[name^="itemDescription"]`).value = item.描述 || "";
                    } else {
                        addItemBtn.click(); 
                        const currentItem = itemsContainer.lastElementChild;
                        currentItem.querySelector(`input[name^="itemName"]`).value = item.名称 || "";
                        currentItem.querySelector(`input[name^="itemQuantity"]`).value = item.数量 || 0;
                        currentItem.querySelector(`input[name^="itemDescription"]`).value = item.描述 || "";
                    }
                });
            }
        }
        
        // Populate "技能"
        if (data.技能 && Array.isArray(data.技能)) {
            data.技能.forEach((skill, index) => {
                if(index === 0 && skillsContainer.children[index]){ // Fill initial item
                    skillsContainer.children[index].querySelector(`input[name^="skillConfig"]`).value = skill.配置 || "";
                    skillsContainer.children[index].querySelector(`input[name^="skillName"]`).value = skill.名称 || "";
                    skillsContainer.children[index].querySelector(`input[name^="skillDomain"]`).value = skill.领域 || "";
                    skillsContainer.children[index].querySelector(`input[name^="skillLevel"]`).value = skill.等级 || 0;
                    skillsContainer.children[index].querySelector(`input[name^="skillAttribute"]`).value = skill.属性 || "";
                    skillsContainer.children[index].querySelector(`input[name^="skillRecall"]`).value = skill.回想 || "";
                    skillsContainer.children[index].querySelector(`textarea[name^="skillDescription"]`).value = skill.描述 || "";
                } else {
                    addSkillBtn.click(); 
                    const currentSkillItem = skillsContainer.lastElementChild;
                    currentSkillItem.querySelector(`input[name^="skillConfig"]`).value = skill.配置 || "";
                    currentSkillItem.querySelector(`input[name^="skillName"]`).value = skill.名称 || "";
                    currentSkillItem.querySelector(`input[name^="skillDomain"]`).value = skill.领域 || "";
                    currentSkillItem.querySelector(`input[name^="skillLevel"]`).value = skill.等级 || 0;
                    currentSkillItem.querySelector(`input[name^="skillAttribute"]`).value = skill.属性 || "";
                    currentSkillItem.querySelector(`input[name^="skillRecall"]`).value = skill.回想 || "";
                    currentSkillItem.querySelector(`textarea[name^="skillDescription"]`).value = skill.描述 || "";
                }
            });
        }
         // After populating, reset counters based on actual DOM elements for future additions
        experienceNextId = experiencesContainer.children.length + 1;
        itemNextId = itemsContainer.children.length + 1;
        skillNextId = skillsContainer.children.length + 1;
    }


    exportButton.addEventListener('click', () => {
        const formData = new FormData(form);
        const characterData = {
            "设定": {},
            "状态": {},
            "物品": {
                "武器": [],
                "护甲": [],
                "道具": []
            },
            "技能": []
        };

        // 设定
        characterData.设定.角色名 = formData.get('roleName') || "";
        characterData.设定.年龄 = parseInt(formData.get('age'), 10) || 0;
        characterData.设定.性别 = formData.get('gender') || "";
        
        characterData.设定.经历 = [];
        const currentExperienceItems = experiencesContainer.querySelectorAll('.experience-item');
        currentExperienceItems.forEach((item) => {
            const keywordInput = item.querySelector('input[name="expKeyword"]');
            const valueInput = item.querySelector('input[name="expValue"]');
            if (keywordInput && valueInput) { // Ensure inputs exist
                 characterData.设定.经历.push({
                    "关键词": keywordInput.value || "",
                    "调整值": parseInt(valueInput.value, 10) || 0 // Keep parseInt for safety, though type=number helps
                });
            }
        });
        while (characterData.设定.经历.length < 5) {
            characterData.设定.经历.push({"关键词": "", "调整值": 0});
        }

        characterData.设定.背景故事 = formData.get('backgroundStory') || "";
        characterData.设定.形象 = appearanceDataUrl || "";
        characterData.设定.种族 = formData.get('race') || "";
        characterData.设定.混血种族 = formData.get('mixedRace') || "";
        characterData.设定.社群 = formData.get('community') || "";
        characterData.设定.职业 = formData.get('profession') || "";
        characterData.设定.子职业 = formData.get('subProfession') || "";
        characterData.设定.兼职 = formData.get('partTimeJob') || "";

        // 状态
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

        // 物品 - 武器
        if (form.querySelector('#weaponName1')) {
             characterData.物品.武器.push({
                "名称": formData.get('weaponName1') || "", "检定": formData.get('weaponCheck1') || "", "属性": formData.get('weaponAttribute1') || "",
                "距离": formData.get('weaponRange1') || "", "伤害": parseInt(formData.get('weaponDamage1'), 10) || 0,
                "双手": form.querySelector('#weaponTwoHanded1') ? form.querySelector('#weaponTwoHanded1').checked : false,
                "特性": formData.get('weaponTrait1') || ""
            });
        }
        // 物品 - 护甲
        if (form.querySelector('#armorName1')) {
            characterData.物品.护甲.push({
                "名称": formData.get('armorName1') || "", "防御": parseInt(formData.get('armorDefense1'), 10) || 0, "特性": formData.get('armorTrait1') || ""
            });
        }
        // 物品 - 道具
        characterData.物品.道具 = [];
        const currentItemElements = itemsContainer.querySelectorAll('.item');
        currentItemElements.forEach((itemElement) => {
            const nameInput = itemElement.querySelector(`input[name^="itemName"]`);
            const quantityInput = itemElement.querySelector(`input[name^="itemQuantity"]`);
            const descriptionInput = itemElement.querySelector(`input[name^="itemDescription"]`);
            if (nameInput) {
                 characterData.物品.道具.push({
                    "名称": nameInput.value || "",
                    "数量": parseInt(quantityInput ? quantityInput.value : 0, 10) || 0,
                    "描述": descriptionInput ? descriptionInput.value : ""
                });
            }
        });
        if (currentItemElements.length === 0 && form.querySelector('#itemName1')) { // If all removed but was one initially
             characterData.物品.道具.push({ "名称": "", "数量": 0, "描述": "" });
        }


        // 技能
        characterData.技能 = [];
        const currentSkillElements = skillsContainer.querySelectorAll('.item');
        currentSkillElements.forEach((itemElement) => {
            const nameInput = itemElement.querySelector(`input[name^="skillName"]`);
            if (nameInput) {
                characterData.技能.push({
                    "配置": itemElement.querySelector(`input[name^="skillConfig"]`)?.value || "",
                    "名称": nameInput.value || "",
                    "领域": itemElement.querySelector(`input[name^="skillDomain"]`)?.value || "",
                    "等级": parseInt(itemElement.querySelector(`input[name^="skillLevel"]`)?.value, 10) || 0,
                    "属性": itemElement.querySelector(`input[name^="skillAttribute"]`)?.value || "",
                    "回想": itemElement.querySelector(`input[name^="skillRecall"]`)?.value || "",
                    "描述": itemElement.querySelector(`textarea[name^="skillDescription"]`)?.value || ""
                });
            }
        });
         if (currentSkillElements.length === 0 && form.querySelector('#skillName1')) { // If all removed but was one initially
            characterData.技能.push({ "配置": "", "名称": "", "领域": "", "等级": 0, "属性": "", "回想": "", "描述": "" });
        }

        // 导出JSON文件
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
});