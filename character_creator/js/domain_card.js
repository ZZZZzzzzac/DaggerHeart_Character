function initializeDomainCardModule() {
    //#region====================== Domain Card Modal Logic ======================
    const domainCardModal = document.getElementById('domainCardModal');
    const domainCardModalCloseButton = document.getElementById('domainCardModalCloseButton');
    const domainCardListContainer = document.getElementById('domainCardListContainer');
    const jobDomainsDisplay = document.getElementById('jobDomainsDisplay'); // Already defined, but ensure it's accessible
    let currentTargetSkillRow = null;



    if (domainCardModalCloseButton) {
        domainCardModalCloseButton.addEventListener('click', closeDomainCardModal);
    }

    window.addEventListener('click', (event) => {
        if (domainCardModal && event.target === domainCardModal) {
            closeDomainCardModal();
        }
    });


    //#endregion====================== End of Domain Card Modal Logic ======================

}

function openDomainCardModal(skillRow) {
    if (!skillRow) return;
    const configInput = skillRow.querySelector('input[name="skillConfig"]');
    if (configInput && configInput.value.trim().toLowerCase() === "永久") {
        return; // Do not open modal if config is "永久"
    }

    currentTargetSkillRow = skillRow;
    const charLevel = parseInt(levelInput.value, 10) || 1;
    
    let jobDomains = [];
    if (currentSelectedJobDomains.domain1) jobDomains.push(currentSelectedJobDomains.domain1);
    if (currentSelectedJobDomains.domain2 && currentSelectedJobDomains.domain1 !== currentSelectedJobDomains.domain2) {
        jobDomains.push(currentSelectedJobDomains.domain2);
    }
    
    if (jobDomains.length === 0 && jobDomainsDisplay && jobDomainsDisplay.textContent) {
        const displayedText = jobDomainsDisplay.textContent;
        const domainMatches = displayedText.match(/领域: ([^+|]+)/g);
        if (domainMatches) {
            domainMatches.forEach(match => {
                const parts = match.replace('领域: ', '').split('+');
                parts.forEach(part => {
                    const domain = part.trim();
                    if (domain && !jobDomains.includes(domain)) {
                        jobDomains.push(domain);
                    }
                });
            });
        }
    }
    
    if (jobDomainsDisplay && jobDomainsDisplay.textContent) {
        const spellcastingMatch = jobDomainsDisplay.textContent.match(/施法: ([^)]+)/);
        if (spellcastingMatch && spellcastingMatch[1]) {
            const spellcastingDomain = spellcastingMatch[1].trim();
            if (spellcastingDomain && !jobDomains.includes(spellcastingDomain)) {
                jobDomains.push(spellcastingDomain);
            }
        }
    }

    // Get already selected domain card names
    const selectedDomainCardNames = [];
    const allSkillRows = document.querySelectorAll('#skillsContainer tr.skill-item');
    allSkillRows.forEach(row => {
        if (row !== currentTargetSkillRow) { // Exclude the current row being edited
            const nameInput = row.querySelector('input[name="skillName"]');
            const domainInput = row.querySelector('input[name="skillDomain"]');
            if (nameInput && nameInput.value && domainInput && domainInput.value) {
                const cardOrigin = DOMAIN_CARDS && DOMAIN_CARDS.find(dc => dc.名称 === nameInput.value && dc.领域 === domainInput.value);
                if (cardOrigin) {
                    selectedDomainCardNames.push(nameInput.value);
                }
            }
        }
    });

    filterAndDisplayDomainCards(charLevel, jobDomains, selectedDomainCardNames);
    if(domainCardModal) domainCardModal.style.display = 'block';
}

function closeDomainCardModal() {
    if(domainCardModal) domainCardModal.style.display = 'none';
    currentTargetSkillRow = null;
}

function filterAndDisplayDomainCards(characterLevel, jobDomains, selectedDomainCardNames = []) {
    if (!domainCardListContainer || typeof DOMAIN_CARDS === 'undefined') {
        if(domainCardListContainer) domainCardListContainer.innerHTML = '<p style="text-align:center; color:#777;">领域卡数据或容器未找到。</p>';
        return;
    }
    domainCardListContainer.innerHTML = '';
    let availableCardsFound = false;

    DOMAIN_CARDS.forEach(card => {
        const cardLevel = parseInt(card.等级, 10);
        const cardDomain = card.领域;
        const isSelected = selectedDomainCardNames.includes(card.名称);

        const domainMatch = jobDomains.some(jd => jd === cardDomain);
        
        if (domainMatch && cardLevel <= characterLevel) {
            availableCardsFound = true;
            const cardElement = document.createElement('div');
            cardElement.classList.add('domain-card-item');
            if (isSelected) {
                cardElement.classList.add('disabled');
            }
            cardElement.innerHTML = `
                <h4>${card.名称} (Lvl ${card.等级}, ${card.领域})${isSelected ? ' (已选择)' : ''}</h4>
                <p class="card-meta">属性: ${card.属性} | 回想: ${card.回想}</p>
                <p>${card.描述.substring(0, 150)}${card.描述.length > 150 ? '...' : ''}</p>
            `;
            if (!isSelected) {
                cardElement.addEventListener('click', () => selectDomainCard(card));
            } else {
                cardElement.style.cursor = 'not-allowed';
            }
            domainCardListContainer.appendChild(cardElement);
        }
    });

    if (!availableCardsFound) {
        domainCardListContainer.innerHTML = '<p style="text-align:center; color:#777;">没有符合当前职业领域和等级的领域卡。</p>';
    }
}

function selectDomainCard(cardData) {
    // Check if this card is already selected by another skill slot
    const allSkillRows = document.querySelectorAll('#skillsContainer tr.skill-item');
    for (let i = 0; i < allSkillRows.length; i++) {
        const row = allSkillRows[i];
        if (row === currentTargetSkillRow) continue; // Skip the current row

        const nameInput = row.querySelector('input[name="skillName"]');
        const domainInput = row.querySelector('input[name="skillDomain"]');
        if (nameInput && nameInput.value === cardData.名称 && domainInput && domainInput.value === cardData.领域) {
                // Check if it's truly a domain card from DOMAIN_CARDS by checking its source/type if available
                // For now, a name and domain match is considered a duplicate from domain cards
            alert(`领域卡 "${cardData.名称}" 已经被选择，不能重复选择。`);
            return;
        }
    }

    if (currentTargetSkillRow) {
        const nameInput = currentTargetSkillRow.querySelector('input[name="skillName"]');
        const domainInput = currentTargetSkillRow.querySelector('input[name="skillDomain"]');
        const levelInputTarget = currentTargetSkillRow.querySelector('input[name="skillLevel"]');
        const attributeInput = currentTargetSkillRow.querySelector('input[name="skillAttribute"]');
        const recallInput = currentTargetSkillRow.querySelector('input[name="skillRecall"]');
        const descriptionTextarea = currentTargetSkillRow.querySelector('textarea[name="skillDescription"]');
        const configInput = currentTargetSkillRow.querySelector('input[name="skillConfig"]');

        if (nameInput) nameInput.value = cardData.名称 || "";
        if (domainInput) domainInput.value = cardData.领域 || "";
        if (levelInputTarget) levelInputTarget.value = `Lv${cardData.等级}` || "";
        if (attributeInput) attributeInput.value = cardData.属性 || "";
        if (recallInput) recallInput.value = `${cardData.回想}费` || "";
        if (descriptionTextarea) {
            descriptionTextarea.value = cardData.描述 || "";
            autoGrowTextarea({ target: descriptionTextarea });
        }
        if (configInput) configInput.value = "激活"; // Default to "激活"
        
        updateRemoveButtonVisibility(currentTargetSkillRow);
    }
    closeDomainCardModal();

    // If currently in newbie guide and it's a domain card selection step, proceed to next question
    if (newbieGuideModal.style.display === 'block' &&
        currentNewbieQuestionIndex < newbieGuideQuestions.length &&
        newbieGuideQuestions[currentNewbieQuestionIndex].questionType === "domainCardSelection") {
        
        // Store a placeholder answer or the card name if needed for logging/debugging
        const question = newbieGuideQuestions[currentNewbieQuestionIndex];
        newbieUserAnswers[question.targetFieldId] = cardData.名称; // Store selected card name

        currentNewbieQuestionIndex++;
        if (currentNewbieQuestionIndex < newbieGuideQuestions.length) {
            displayCurrentNewbieQuestion();
        } else {
            // Guide finished
            newbieGuideNextButton.textContent = "完成"; // Should already be set, but ensure
            // Optionally, could auto-click "完成" here or wait for user
            // For now, let user click "完成"
        }
    }
}