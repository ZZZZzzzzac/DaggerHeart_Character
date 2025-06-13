function initializeRaceJobCommunityModule() {
    const raceSelect = document.getElementById('raceSelect');
    const mixedRaceSelect = document.getElementById('mixedRaceSelect');
    const communitySelect = document.getElementById('communitySelect');
    const professionSelect = document.getElementById('professionSelect');
    const subclassSelect = document.getElementById('subclassSelect');
    const skillsContainer = document.getElementById('skillsContainer'); // Added, as it's used by updateJobTraitsAsSkills

    //#region====================== Race, Jobs, and Community Selects ======================
    
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
    populateGenericSelect(raceSelect, RACES_DATA, 'name', 'name', "必选", "RACES_DATA"); // 'race' -> 'name'
    populateGenericSelect(mixedRaceSelect, RACES_DATA, 'name', 'name', "可选", "RACES_DATA"); // 'race' -> 'name'
    populateGenericSelect(communitySelect, GROUPS_DATA, 'name', 'name', "必选", "GROUPS_DATA"); // '社群' -> 'name'
    populateGenericSelect(professionSelect, JOBS_DATA, 'name', 'name', "必选", "JOBS_DATA"); // '职业' -> 'name'

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


    //#endregion====================== End of Race, Jobs, and Community Selects ======================
}

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
        const jobData = JOBS_DATA.find(j => j.name === selectedJobName); // j.职业 -> j.name
        if (jobData) {
            const subclasses = [];
            if (jobData.subclass1) subclasses.push({ name: jobData.subclass1, spellcast: jobData.subclass1_spellcast });
            if (jobData.subclass2) subclasses.push({ name: jobData.subclass2, spellcast: jobData.subclass2_spellcast });

            if (subclasses.length > 0) {
                subclasses.forEach((subclass, index) => {
                    if (subclass.name) {
                        if (index === 0) {
                            firstSubclassName = subclass.name;
                        }
                        const option = document.createElement('option');
                        option.value = subclass.name;
                        option.textContent = subclass.name;
                        // Store spellcasting attribute for later use if needed, e.g., in updateJobTraitsAsSkills
                        option.dataset.spellcast = subclass.spellcast || "";
                        subclassSelect.appendChild(option);
                        if (subclass.name === previousSubclassValue) {
                            previousValueIsValid = true;
                        }
                    }
                }); // End of forEach
                subclassSelect.disabled = false;
            } else { // Added else for if (subclasses.length > 0)
                const option = document.createElement('option');
                option.value = "";
                option.textContent = "无可用子职";
                subclassSelect.appendChild(option);
                subclassSelect.disabled = true;
            } // End of else for if (subclasses.length > 0)
            
            // This logic should be inside the 'if (jobData)' block but outside 'if (subclasses.length > 0)' if no subclasses means no selection
            // Or, more simply, if subclasses.length IS 0, firstSubclassName will be null, leading to selection of ""
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
        const mainRaceData = RACES_DATA.find(r => r.name === selectedRaceName); // r.race -> r.name
        if (!mainRaceData) return;
        
        // 处理主要种族特性
        if (mainRaceData.trait1_name) { // Use new field trait1_name
            trait1Data = createTraitData(mainRaceData.trait1_name, mainRaceData.trait1_desc, "种族");
        }

        // 处理第二个特性（可能来自混血种族或主要种族）
        if (hasMixedRace) {
            const mixedRaceData = RACES_DATA.find(r => r.name === selectedMixedRaceName); // Use r.name
            if (mixedRaceData && mixedRaceData.trait2_name) { // Use new field trait2_name
                trait2Data = createTraitData(mixedRaceData.trait2_name, mixedRaceData.trait2_desc, "混血");
            }
        }
        
        // 如果没有从混血获取第二特性，尝试使用主要种族的第二特性
        if (!trait2Data && mainRaceData.trait2_name) { // Use new field trait2_name
            trait2Data = createTraitData(mainRaceData.trait2_name, mainRaceData.trait2_desc, "种族");
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
        const groupData = GROUPS_DATA.find(g => g.name === selectedGroupName); // g.社群 -> g.name
        if (groupData && groupData.trait_name && groupData.trait_desc) { // 特性名 -> trait_name, 描述 -> trait_desc
            groupTraitData = createTraitData(groupData.trait_name, groupData.trait_desc, "社群");
        }
    }
    
    updateSkillInSlot(FixedSkillSlotIds.GROUP_1, groupTraitData);
}

function updateJobTraitsAsSkills() {
    const jobDomainsDisplay = document.getElementById('jobDomainsDisplay');
    // const skillsContainer = document.getElementById('skillsContainer'); // Already defined at the top of this function scope

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
        const jobData = JOBS_DATA.find(j => j.name === selectedJobName); // j.职业 -> j.name
        if (jobData) {
            // Handle Hope Trait
            if (jobData.hope_trait_name && jobData.hope_trait_desc) {
                hopeTraitData = createTraitData(jobData.hope_trait_name, jobData.hope_trait_desc, "职业");
            }

            // Handle Class Features
            if (jobData.class_feature && Array.isArray(jobData.class_feature)) {
                jobData.class_feature.forEach(feature => {
                    if (feature.name && feature.desc) {
                        const featureSkillData = {
                            配置: "永久",
                            名称: feature.name, // feature.名称 -> feature.name
                            领域: "",
                            等级: "",
                            属性: "职业特性",
                            回想: "",
                            描述: feature.desc // feature.描述 -> feature.desc
                        };
                        const newRow = createSkillRowElement(featureSkillData, false);
                        newRow.classList.add('dynamic-job-feature-row');
                        skillsContainer.appendChild(newRow);
                        updateRemoveButtonVisibility(newRow);
                        const textarea = newRow.querySelector('textarea[name="skillDescription"]');
                        if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
                    }
                });
            }

            // Update domains display
            let domainsText = "";
            if (jobData.domain1) { // jobData.领域1 -> jobData.domain1
                domainsText += `领域: ${jobData.domain1}`;
                currentSelectedJobDomains.domain1 = jobData.domain1;
            } else {
                currentSelectedJobDomains.domain1 = null;
            }
            if (jobData.domain2) { // jobData.领域2 -> jobData.domain2
                if (domainsText) domainsText += "+";
                domainsText += `${jobData.domain2}`;
                currentSelectedJobDomains.domain2 = jobData.domain2;
            } else {
                currentSelectedJobDomains.domain2 = null;
            }
            
            const selectedSubclassName = subclassSelect ? subclassSelect.value : null;
            let subclassSpellcast = "";
            let baseFeatures = [];

            if (selectedSubclassName) {
                if (jobData.subclass1 === selectedSubclassName) {
                    subclassSpellcast = jobData.subclass1_spellcast || "";
                    baseFeatures = jobData.subclass1_base_feature || [];
                } else if (jobData.subclass2 === selectedSubclassName) {
                    subclassSpellcast = jobData.subclass2_spellcast || "";
                    baseFeatures = jobData.subclass2_base_feature || [];
                }
            }

            if (subclassSpellcast && subclassSpellcast.trim() !== "") {
                if (domainsText) {
                    domainsText += ` | 施法: ${subclassSpellcast}`;
                } else {
                    domainsText = `施法: ${subclassSpellcast}`;
                }
            }
            currentSelectedJobDomains.spellcasting = subclassSpellcast;


            // Handle Subclass Base Features (Keystone)
            if (baseFeatures.length > 0) {
                baseFeatures.forEach(trait => {
                    if (trait.name && trait.desc) {
                        const keystoneTraitSkillData = {
                            配置: "永久",
                            名称: trait.name,
                            领域: "",
                            等级: "基石", // Level is determined by the array it's in
                            属性: "子职特性",
                            回想: "",
                            描述: trait.desc
                        };
                        const newRow = createSkillRowElement(keystoneTraitSkillData, false);
                        newRow.classList.add('subclass-keystone-trait-row');
                        skillsContainer.appendChild(newRow);
                        updateRemoveButtonVisibility(newRow);
                        const textarea = newRow.querySelector('textarea[name="skillDescription"]');
                        if (textarea) setTimeout(() => autoGrowTextarea({ target: textarea }), 0);
                    }
                });
            }
            if (jobDomainsDisplay) jobDomainsDisplay.textContent = domainsText;
        }
    }
    
    updateSkillInSlot(FixedSkillSlotIds.JOB_1, hopeTraitData);
    // If there's a JOB_2 slot and a clear second job trait (e.g. from subclass or another primary job trait),
    // it would be populated here using updateSkillInSlot(FixedSkillSlotIds.JOB_2, secondJobTraitData);
}

