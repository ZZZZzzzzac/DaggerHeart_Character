// Hard-coded debug mode switch
const DEBUG_MODE = false;

function applyDebugStyles() {
    if (!DEBUG_MODE) return;

    // --- Apply to textboxes ---
    const allTextboxes = document.querySelectorAll('.base-textbox');
    allTextboxes.forEach(textbox => {
        textbox.classList.add('debug-mode');
    });

    // --- Apply to checkboxes ---
    const allCheckboxes = document.querySelectorAll('.base-checkbox');
    allCheckboxes.forEach(checkbox => {
        checkbox.classList.add('debug-mode');
    });
}

// Run debug mode initialization once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', applyDebugStyles);

// Prevent zooming with Ctrl+mouse wheel or Ctrl+/-
document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-')) {
        event.preventDefault();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // 1. Set default states for slots first.
    setDefaultSlotStates();

    // 2. Initialize all TriStateCheckboxes. The constructor will pick up the default state.
    const checkboxLabels = document.querySelectorAll('.base-checkbox');
    checkboxLabels.forEach(label => {
        // Attach the instance to the element for easy access later
        label.checkboxInstance = new TriStateCheckbox(label);
    });

    // 3. Load any saved data from Local Storage. This will override the defaults if data exists.
    loadFormStateFromLocalStorage();

    // 4. Add event listeners to all non-checkbox form elements to save state on every change.
    // Checkbox saving is now handled within the TriStateCheckbox class.
    // const elements = document.querySelectorAll('.base-textbox');
    // elements.forEach(el => {
    //     el.addEventListener('input', saveFormStateToLocalStorage);
    // });

    // 5. Setup action buttons
    setupGlobalActionButtons(); // This function is in action.js
    setupDataModalButtons(); // This function is defined below

    // 6. Save all data to local storage before the page is unloaded (closed, refreshed, etc.)
    window.addEventListener('beforeunload', saveFormStateToLocalStorage);
});

function setupDataModalButtons() {
    // Helper function to set up a weapon button
    const setupWeaponButton = (buttonId, dataSource, modalTitle, storageKey, nameId, statId, damageId, traitId, columnWidths) => {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.addEventListener('click', () => {
            if (typeof dataSource === 'undefined') {
                console.error(`Data source for ${modalTitle} is not defined.`);
                alert(`错误：${modalTitle}数据源未定义。`);
                return;
            }

            const modalConfig = {
                title: modalTitle,
                filterableColumns: ["属性", "距离", "双手", "类型", "位阶"],
                storageKey: storageKey,
                columnWidths: columnWidths
            };

            showDataTableModal(dataSource, (selectedItem) => {
                const targetMap = {
                    "名称": nameId,
                    "特性": traitId
                };
                for (const sourceKey in targetMap) {
                    const targetElement = document.getElementById(targetMap[sourceKey]);
                    if (targetElement) {
                        targetElement.value = selectedItem[sourceKey] || '';
                    }
                }

                // Composite for Stat
                const compositeStatTarget = {
                    targetId: statId,
                    format: "{属性}／{距离}"
                };
                const compositeStatElement = document.getElementById(compositeStatTarget.targetId);
                if (compositeStatElement) {
                    let formattedString = compositeStatTarget.format;
                    const placeholders = formattedString.match(/{[^{}]+}/g) || [];
                    placeholders.forEach(placeholder => {
                        const key = placeholder.substring(1, placeholder.length - 1);
                        const value = selectedItem[key] || '';
                        formattedString = formattedString.replace(placeholder, value);
                    });
                    compositeStatElement.value = formattedString;
                }

                // Composite for Damage
                const compositeDamageTarget = {
                    targetId: damageId,
                    format: "{伤害}／{类型}"
                };
                const compositeDamageElement = document.getElementById(compositeDamageTarget.targetId);
                if (compositeDamageElement) {
                    let formattedString = compositeDamageTarget.format;
                    const placeholders = formattedString.match(/{[^{}]+}/g) || [];
                    placeholders.forEach(placeholder => {
                        const key = placeholder.substring(1, placeholder.length - 1);
                        const value = selectedItem[key] || '';
                        formattedString = formattedString.replace(placeholder, value);
                    });
                    compositeDamageElement.value = formattedString;
                }

                // No immediate save here anymore
            }, modalConfig);
        });
    };

    const weaponWidths = { 名称: '10%', 伤害: '5%', 属性: '5%', 距离: '7%', 双手: '5%', 类型: '5%', 位阶: '5%' };

    // Primary Weapon
    setupWeaponButton(
        'add-primary-weapon-btn',
        typeof PRIMARY_WEAPON !== 'undefined' ? PRIMARY_WEAPON : undefined,
        "选择主武器",
        "primaryWeaponFilterState",
        "PrimaryWeaponNameTextbox",
        "PrimaryWeaponStatTextbox",
        "PrimaryWeaponDamageTextbox",
        "PrimaryWeaponTraitTextbox",
        weaponWidths
    );

    // Secondary Weapon
    setupWeaponButton(
        'add-secondary-weapon-btn',
        typeof SECONDARY_WEAPON !== 'undefined' ? SECONDARY_WEAPON : undefined,
        "选择副武器",
        "secondaryWeaponFilterState",
        "SecondaryWeaponNameTextbox",
        "SecondaryWeaponStatTextbox",
        "SecondaryWeaponDamageTextbox",
        "SecondaryWeaponTraitTextbox",
        weaponWidths
    );
    
    // Backup Weapon 1
    setupWeaponButton(
        'add-backup1-weapon-btn',
        (typeof PRIMARY_WEAPON !== 'undefined' && typeof SECONDARY_WEAPON !== 'undefined') ? [...PRIMARY_WEAPON, ...SECONDARY_WEAPON] : undefined,
        "选择备用武器1",
        "backup1WeaponFilterState",
        "Backup1WeaponNameTextbox",
        "Backup1WeaponStatTextbox",
        "Backup1WeaponDamageTextbox",
        "Backup1WeaponTraitTextbox",
        weaponWidths
    );

    // Backup Weapon 2
    setupWeaponButton(
        'add-backup2-weapon-btn',
        (typeof PRIMARY_WEAPON !== 'undefined' && typeof SECONDARY_WEAPON !== 'undefined') ? [...PRIMARY_WEAPON, ...SECONDARY_WEAPON] : undefined,
        "选择备用武器2",
        "backup2WeaponFilterState",
        "Backup2WeaponNameTextbox",
        "Backup2WeaponStatTextbox",
        "Backup2WeaponDamageTextbox",
        "Backup2WeaponTraitTextbox",
        weaponWidths
    );

    // Armor
    const addArmorBtn = document.getElementById('add-armor-btn');
    if (addArmorBtn) {
        addArmorBtn.addEventListener('click', () => {
            if (typeof ARMOR === 'undefined') {
                console.error('Data source variable "ARMOR" is not defined.');
                alert('错误：护甲数据源未定义。');
                return;
            }

            const armorWidths = { 名称: '10%', 重伤阈值: '5%', 严重阈值: '5%', 护甲值: '5%', 位阶: '5%' };
            const modalConfig = {
                title: "选择护甲",
                filterableColumns: ["重伤阈值", "严重阈值", "护甲值", "位阶"],
                storageKey: "armorFilterState",
                columnWidths: armorWidths
            };
            
            showDataTableModal(ARMOR, (selectedItem) => {
                const directMap = {
                    "名称": "ArmorNameTextbox",
                    "护甲值": "ArmorScoreTextbox",
                    "特性": "ArmorTraitTextbox"
                };
                for (const sourceKey in directMap) {
                    const targetElement = document.getElementById(directMap[sourceKey]);
                    if (targetElement) {
                        targetElement.value = selectedItem[sourceKey] || '';
                    }
                }

                const thresholdTarget = document.getElementById("ArmorThresholdTextbox");
                if (thresholdTarget) {
                    const major = selectedItem.重伤阈值 || '';
                    const severe = selectedItem.严重阈值 || '';
                    thresholdTarget.value = `${major}／${severe}`;
                }
                
                // No immediate save here anymore
            }, modalConfig);
        });
    }

    // Items
    const addItemBtn = document.getElementById('add-item-btn');
    const ITEMS = typeof LOOT_DATA !== 'undefined' ? [...(LOOT_DATA.consumables || []), ...(LOOT_DATA.items || [])] : undefined;
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            if (typeof ITEMS === 'undefined') {
                console.error('Data source variable "ITEMS" is not defined.');
                alert('错误：物品数据源未定义。');
                return;
            }

            const itemWidths = { 名称: '15%', 掷骰: '5%'};
            const modalConfig = {
                title: "选择物品",
                filterableColumns: ["类型", "位阶"],
                storageKey: "itemFilterState",
                columnWidths: itemWidths
            };

            showDataTableModal(ITEMS, (selectedItem) => {
                const targetTextbox = document.getElementById('ItemSlot1Textbox');
                if (targetTextbox) {
                    const newItemText = `${selectedItem.名称}: ${selectedItem.特性}`;
                    if (targetTextbox.value.trim() === '') {
                        targetTextbox.value = newItemText;
                    } else {
                        targetTextbox.value += `\n${newItemText}`;
                    }
                }
                // No immediate save here anymore
            }, modalConfig);
        });
    }
}


