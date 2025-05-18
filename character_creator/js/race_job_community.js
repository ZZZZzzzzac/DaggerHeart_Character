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
    populateGenericSelect(raceSelect, RACES_DATA, 'race', 'race', "必选", "RACES_DATA");
    populateGenericSelect(mixedRaceSelect, RACES_DATA, 'race', 'race', "可选", "RACES_DATA");
    populateGenericSelect(communitySelect, GROUPS_DATA, '社群', '社群', "必选", "GROUPS_DATA");
    populateGenericSelect(professionSelect, JOBS_DATA, '职业', '职业', "必选", "JOBS_DATA");

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

