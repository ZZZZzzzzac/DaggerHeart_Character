function initializeNewbieModule() {
    
    //#region================== newbie guide ==================
    const newbieGuideButton = document.getElementById('newbieGuideButton');
    const newbieGuideModal = document.getElementById('newbieGuideModal');
    const newbieGuideModalCloseButton = document.getElementById('newbieGuideModalCloseButton');
    const newbieGuideNextButton = document.getElementById('newbieGuideNextButton');
    const newbieGuideCancelButton = document.getElementById('newbieGuideCancelButton');
    const newbieGuideQuestionText = document.getElementById('newbieGuideQuestionText'); // This will hold the question <p>
    const newbieGuideAnswerInput = document.getElementById('newbieGuideAnswerInput'); // This is the text input field
    const newbieGuideDropdownInput = document.getElementById('newbieGuideDropdownInput');
    const newbieGuidePromptTextarea = document.getElementById('newbieGuidePromptTextarea'); // Added this




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
        
        // Dynamically insert domain card selection steps after subclass selection
        const subclassQuestionIndex = newbieGuideQuestions.findIndex(q => q.targetSelectId === 'subclassSelect');
        if (subclassQuestionIndex !== -1) {
            const domainCardStep1 = {
                prompt: "请选择你的第一张领域卡。",
                questionType: "domainCardSelection", // New type
                targetFieldId: "domainCard1_placeholder" // Placeholder, actual data goes to skill row
            };
            const domainCardStep2 = {
                prompt: "请选择你的第二张领域卡。",
                questionType: "domainCardSelection", // New type
                targetFieldId: "domainCard2_placeholder" // Placeholder
            };
            // Insert after subclass question. Make a copy to avoid modifying the original template array if this function is called multiple times.
            let questionsWithDomainCards = [...newbieGuideQuestions];
            questionsWithDomainCards.splice(subclassQuestionIndex + 1, 0, domainCardStep1, domainCardStep2);
            // Use this modified array for the current guide session
            // This is a temporary solution. Ideally, newbieGuideQuestions should be reset or managed better if the guide can be restarted.
            // For now, we assume newbieGuideQuestions is reset elsewhere or this is a one-time modification for the session.
            // To make it truly dynamic for multiple runs, newbieGuideQuestions itself should be a fresh copy from a template each time.
            // Let's assume newbieGuideQuestions is the one to be used for this session.
            // This modification will persist for the current session if startNewbieGuide is called again without resetting newbieGuideQuestions from its original template.
            // For a robust solution, consider:
            // 1. Deep copying newbieGuideQuestions from a master template at the start of startNewbieGuide.
            // 2. Modifying that copy.
            // This example modifies the global newbieGuideQuestions for simplicity of this diff.
            // If newbieGuideQuestions is defined in data/template.js and imported, this will modify the imported array.
            // A better approach would be:
            // let currentSessionGuideQuestions = JSON.parse(JSON.stringify(newbieGuideQuestionsFromTemplate));
            // currentSessionGuideQuestions.splice(...)
            // And then use currentSessionGuideQuestions throughout the guide logic.
            // For this diff, we'll directly modify the (assumed global) newbieGuideQuestions array.
            if (!newbieGuideQuestions.find(q => q.questionType === "domainCardSelection")) { // Prevent multiple insertions
                 newbieGuideQuestions.splice(subclassQuestionIndex + 1, 0, domainCardStep1, domainCardStep2);
            }
        }


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
            if (initialQuestion && initialQuestion.targetFieldId && newbieGuidePrompts.textInput && newbieGuidePrompts.textInput[initialQuestion.targetFieldId]) {
                newbieGuidePromptTextarea.placeholder = newbieGuidePrompts.textInput[initialQuestion.targetFieldId] || initialQuestion.prompt;
            } else if (initialQuestion && initialQuestion.questionType === "domainCardSelection") {
                newbieGuidePromptTextarea.placeholder = "请点击下方打开的领域卡选择器，选择一张领域卡。";
            }
             else if (initialQuestion) {
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
    //#endregion====================== End of newbie guide ======================

}

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
                        // newbieGuideDropdownInput.disabled = true;
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
        } else if (question.questionType === "domainCardSelection") {
            newbieGuideAnswerInput.style.display = 'none';
            newbieGuideDropdownInput.style.display = 'none';
            if (newbieGuidePromptTextarea) {
                newbieGuidePromptTextarea.placeholder = "请点击下方打开的领域卡选择器，选择一张领域卡。";
            }
            // Add a new skill row for the domain card
            const newSkillRow = addSkillEntry({}); // Assuming addSkillEntry returns the new row element
            // Open the domain card modal, targeting the new skill row
            if (newSkillRow) {
                openDomainCardModal(newSkillRow);
            } else {
                console.error("Failed to add a new skill row for domain card selection in newbie guide.");
            }
            // The flow will continue once a card is selected (handled in selectDomainCard)
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