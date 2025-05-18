document.addEventListener('DOMContentLoaded', () => {    
    
    initializeRaceJobCommunityModule();
    initializeWeaponArmorItemModule();
    initializeSkillModule();
    initializeJsonModule();
    initializeNewbieModule();
    initializeDomainCardModule();
    updateLevelTierDisplay();


    //#region====================== Experience & Background ======================
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
    //#endregion====================== End of Experience & Background ======================


    //#region===================== Utility Functions =====================
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
    //#endregion===================== End of Utility Functions =====================


});