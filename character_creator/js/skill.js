function initializeSkillModule() {
        //#region====================== Skill ======================

    
    const skillsContainer = document.getElementById('skillsContainer');
    const addSkillBtn = document.getElementById('addSkillBtn');





    // Helper to create skill row TR element (used by fixed slots and potentially dynamic ones)

    function initializeFixedSkillSlots() {
        if (!skillsContainer) return;
        // This function ensures the 5 fixed slots are present.
        // It doesn't clear other dynamic skills that might be added later.
        AllFixedSlotIds.forEach(slotId => {
            if (!document.getElementById(slotId)) {
                const slotRow = createSkillRowElement({ 名称: "" }, true, slotId); // Pass empty name to ensure placeholder is set
                const nameInputInSlot = slotRow.querySelector('input[name="skillName"]');
                if (nameInputInSlot) {
                    nameInputInSlot.placeholder = "名称"; // Explicitly set placeholder for fixed slots
                }
                skillsContainer.appendChild(slotRow);
                const textarea = slotRow.querySelector('textarea[name="skillDescription"]');
                // Initial auto-grow for textareas in fixed slots
                if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
            }
        });
    }
    initializeFixedSkillSlots(); // Create the 5 fixed slots on load

    // addSkillEntry is now for DYNAMIC, non-fixed skills, added AFTER fixed slots

    addSkillBtn.addEventListener('click', () => {
        addSkillEntry({
            配置: "激活", 名称: "", 领域: "", 等级: "", 属性: "", 回想: "", 描述: ""
        });
    });
    // give all textareas in the skills container the auto-grow functionality
    document.querySelectorAll('#skillsContainer textarea[name="skillDescription"]').forEach(textarea => {
        textarea.addEventListener('input', autoGrowTextarea);
        setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
    });
    //#endregion====================== End of Skill ======================


}

function updateRemoveButtonVisibility(skillRowElement) {
    if (!skillRowElement) return;
    const configInput = skillRowElement.querySelector('select[name="skillConfig"]');
    const removeBtn = skillRowElement.querySelector('.remove-item-btn');
    if (configInput && removeBtn) {
        if (configInput.value === "永久") {
            removeBtn.style.display = 'none';
        } else {
            removeBtn.style.display = ''; // Reset to default display
        }
    }
}

function updateSkillAvailabilityStyle(skillRowElement) {
    if (!skillRowElement) return;
    const configInput = skillRowElement.querySelector('select[name="skillConfig"]');
    if (!configInput) return;

    const configValue = configInput.value; // No need for trim().toLowerCase() with select
    skillRowElement.classList.remove('skill-unavailable-temporary', 'skill-unavailable-permanent');

    if (configValue === '宝库') {
        skillRowElement.classList.add('skill-unavailable-temporary');
    } else if (configValue === '除外') {
        skillRowElement.classList.add('skill-unavailable-permanent');
    }
}

function updateSkillInSlot(slotId, skillData) {
    const slotRow = document.getElementById(slotId);
    if (!slotRow) {
        console.warn(`Skill slot with ID ${slotId} not found during update.`);
        return;
    }

    const inputs = {
        config: slotRow.querySelector('select[name="skillConfig"]'),
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
    updateSkillAvailabilityStyle(slotRow); // Add this call
}

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
    
    const defaultConfig = skillData.配置 || (isFixedSlot ? '永久' : '激活');
    const defaultLevel = skillData.等级 || ''; // Fixed slots might not have a numeric level initially

    newRow.innerHTML = `
        <td>
            <select name="skillConfig">
                <option value="永久"${defaultConfig === '永久' ? ' selected' : ''}>永久</option>
                <option value="激活"${defaultConfig === '激活' ? ' selected' : ''}>激活</option>
                <option value="宝库"${defaultConfig === '宝库' ? ' selected' : ''}>宝库</option>
                <option value="除外"${defaultConfig === '除外' ? ' selected' : ''}>除外</option>
            </select>
        </td>
        <td><input type="text" name="skillName" placeholder="名称(点我)" value="${skillData.名称 || ''}" class="skill-name-input"></td>
        <td><input type="text" name="skillDomain" placeholder="领域" value="${skillData.领域 || ''}"></td>
        <td><input type="text" name="skillLevel" placeholder="等级" value="${defaultLevel}"></td>
        <td><input type="text" name="skillAttribute" placeholder="属性" value="${defaultAttribute}"></td>
        <td><input type="text" name="skillRecall" placeholder="回想" value="${skillData.回想 || ''}"></td>
        <td><textarea name="skillDescription" placeholder="描述">${skillData.描述 || ''}</textarea></td>
        <td><button type="button" class="remove-item-btn">-</button></td>
    `;

    const nameInput = newRow.querySelector('input[name="skillName"].skill-name-input');
    if (nameInput) {
        nameInput.addEventListener('click', () => {
            const configSelect = newRow.querySelector('select[name="skillConfig"]');
            const currentConfigValue = configSelect ? configSelect.value : '';
                // Check availability and config before opening modal
            if (currentConfigValue !== '永久' && !newRow.classList.contains('skill-unavailable-temporary') && !newRow.classList.contains('skill-unavailable-permanent')) {
                openDomainCardModal(newRow);
            }
        });
    }

    const newTextarea = newRow.querySelector('textarea[name="skillDescription"]');
    if (newTextarea) {
        newTextarea.addEventListener('input', autoGrowTextarea);
    }
    
    const configInput = newRow.querySelector('select[name="skillConfig"]'); // Changed to select
    if (configInput) {
        configInput.addEventListener('input', () => {
            updateRemoveButtonVisibility(newRow);
            updateSkillAvailabilityStyle(newRow); // Add this call
        });
    }

    // Initial visibility and style check
    updateRemoveButtonVisibility(newRow);
    updateSkillAvailabilityStyle(newRow); // Add this call

    if (!isFixedSlot) { // Still add remove listener for non-fixed, but visibility is handled separately
        addRemoveListener(newRow.querySelector('.remove-item-btn'));
    }
    return newRow;
}

function addSkillEntry(skillData) {
    const newRow = createSkillRowElement(skillData, false); // isFixedSlot = false
    skillsContainer.appendChild(newRow);
    const textarea = newRow.querySelector('textarea[name="skillDescription"]');
    // Initial auto-grow for dynamically added textareas
    if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
    return newRow;
}