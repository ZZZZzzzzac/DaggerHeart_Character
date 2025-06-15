// Hard-coded debug mode switch
const DEBUG_MODE = false;

/**
 * Removes basic Markdown formatting (bold, italics) from a string.
 * @param {string} text The input text.
 * @returns {string} The text with formatting removed.
 */
function removeMarkdownFormatting(text) {
    if (typeof text !== 'string') {
        return text;
    }
    // Remove bold (**text** or __text__), italics (*text* or _text_), and convert \n to newlines
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/__(.*?)__/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_(.*?)_/g, '$1')
        .replace(/\\n/g, '\n');
}

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
    updateCardSize(); // Apply initial card size

    // 6. Save all data to local storage before the page is unloaded (closed, refreshed, etc.)
    window.addEventListener('beforeunload', saveFormStateToLocalStorage);

    // --- Card Size Control Listeners ---
    const widthInput = document.getElementById('card-width-input');
    widthInput.addEventListener('blur', updateCardSize);
});

/**
 * Adds custom domain cards from an uploaded JSON file.
 * It standardizes the keys and merges them with the existing DOMAIN_CARDS array.
 * @param {Array<object>} customCards - An array of card objects from the user.
 */
function add_custom_domain_card(customCards) {
    const keyMap = {
        "名称": ["name", "cardname", "title"],
        "领域": ["domain"],
        "等级": ["level", "tier"],
        "属性": ["type", "attribute"],
        "回想": ["recall", "refresh"],
        "描述": ["description", "desc", "details"]
    };

    // Create a reverse map for quick lookup: { "name": "名称", "cardname": "名称", ... }
    const reverseKeyMap = {};
    for (const standardKey in keyMap) {
        for (const alias of keyMap[standardKey]) {
            reverseKeyMap[alias] = standardKey;
        }
    }

    const standardizedCards = customCards.map(card => {
        const newCard = {};
        for (const key in card) {
            if (Object.hasOwnProperty.call(card, key)) {
                const standardKey = reverseKeyMap[key.toLowerCase()] || key;
                newCard[standardKey] = card[key];
            }
        }
        return newCard;
    });

    // Merge with existing DOMAIN_CARDS, avoiding duplicates by name
    const existingNames = new Set(DOMAIN_CARDS.map(c => c.名称));
    const newCards = standardizedCards.filter(c => c.名称 && !existingNames.has(c.名称));

    if (newCards.length > 0) {
        DOMAIN_CARDS.push(...newCards);
        alert(`${newCards.length} 张新的领域卡已成功添加！`);
        console.log('Updated DOMAIN_CARDS:', DOMAIN_CARDS);
    } else {
        alert('没有新的领域卡被添加。可能它们已经存在或格式不正确。');
    }
}

/**
 * Adds custom classes from an uploaded JSON file.
 * It standardizes the keys and merges them with the existing MAIN_CLASS array.
 * @param {Array<object>} customClasses - An array of class objects from the user.
 */
function add_custom_class(customClasses) {
    const keyMap = {
        "名称": ["name", "classname", "title"],
        "领域": ["domain", "domains"],
        "初始闪避值": ["evasion", "baseevasion", "startevasion","起始闪避"],
        "初始生命值": ["hp", "basehp", "starthp","起始生命"],
        "希望特性": ["hopefeature", "hope_feature"],
        "职业特性": ["classfeature", "class_feature"],
        "背景问题": ["backgroundquestions", "background_questions"],
        "关系问题": ["relationshipprompts", "relationship_prompts"]
    };

    // Create a reverse map for quick lookup
    const reverseKeyMap = {};
    for (const standardKey in keyMap) {
        for (const alias of keyMap[standardKey]) {
            reverseKeyMap[alias] = standardKey;
        }
    }

    const standardizedClasses = customClasses.map(cls => {
        const newClass = {};
        const rawDomains = [];

        // First pass: map keys and collect domains
        for (const key in cls) {
            if (Object.hasOwnProperty.call(cls, key)) {
                const lowerKey = key.toLowerCase();
                // Special handling for numbered domains
                if (lowerKey.startsWith("domain") || lowerKey.startsWith("领域")) {
                    rawDomains.push(cls[key]);
                    continue;
                }
                const standardKey = reverseKeyMap[lowerKey];
                if (standardKey) {
                    newClass[standardKey] = cls[key];
                } else {
                    newClass[key] = cls[key]; // Keep unmapped keys
                }
            }
        }

        // Process and combine domains
        if (rawDomains.length > 0) {
            newClass["领域"] = rawDomains.join('+');
        }

        // Ensure all standard keys exist, providing defaults if necessary
        for (const standardKey in keyMap) {
            if (!Object.hasOwnProperty.call(newClass, standardKey)) {
                if (standardKey === "背景问题" || standardKey === "关系问题") {
                    newClass[standardKey] = ["","",""]; // Default to empty array for question lists
                }
                else {
                    newClass[standardKey] = ""; // Default to empty string
                }
            }
        }
        return newClass;
    });

    // Merge with existing MAIN_CLASS, avoiding duplicates by name
    const existingNames = new Set(MAIN_CLASS.map(c => c.名称));
    const newClasses = standardizedClasses.filter(c => c.名称 && !existingNames.has(c.名称));

    if (newClasses.length > 0) {
        MAIN_CLASS.push(...newClasses);
        alert(`${newClasses.length} 个新的职业已成功添加！`);
        console.log('Updated MAIN_CLASS:', MAIN_CLASS);
    } else {
        alert('没有新的职业被添加。可能它们已经存在或格式不正确。');
    }
}

/**
 * Adds custom subclasses from an uploaded JSON file.
 * It standardizes the keys and merges them with the existing SUB_CLASS array.
 * @param {Array<object>} customSubclasses - An array of subclass objects from the user.
 */
function add_custom_subclass(customSubclasses) {
    const keyMap = {
        "主职": ["主职","主职业", "parentclass", "mainclass"],
        "名称": ["name", "subclassname", "title"],
        "等级": ["level", "tier"],
        "施法属性": ["施法", "castingstat", "casting_stat"],
        "特性": ["特性", "描述", "description", "desc", "details", "feature"]
    };

    // Create a reverse map for quick lookup
    const reverseKeyMap = {};
    for (const standardKey in keyMap) {
        for (const alias of keyMap[standardKey]) {
            reverseKeyMap[alias] = standardKey;
        }
    }

    const standardizedSubclasses = customSubclasses.map(subclass => {
        const tempSubclass = {};
        for (const key in subclass) {
            if (Object.hasOwnProperty.call(subclass, key)) {
                const standardKey = reverseKeyMap[key.toLowerCase()] || key;
                tempSubclass[standardKey] = subclass[key];
            }
        }

        // Construct the final object in the correct format
        const newSubclass = {};
        newSubclass.主职 = tempSubclass.主职 || "";
        // The name is a combination of the subclass name and its level
        newSubclass.名称 = `${tempSubclass.子职业 || tempSubclass.名称 || ""}-${tempSubclass.等级 || ""}`;
        newSubclass.等级 = tempSubclass.等级 || "";
        newSubclass.施法属性 = (tempSubclass.施法属性 === "不可施法") ? "无" : (tempSubclass.施法属性 || "无");
        newSubclass.特性 = tempSubclass.特性 || "";

        return newSubclass;
    });

    // Merge with existing SUB_CLASS, avoiding duplicates by name
    const existingNames = new Set(SUB_CLASS.map(sc => sc.名称));
    const newSubclasses = standardizedSubclasses.filter(sc => sc.名称 && sc.名称 !== "-" && !existingNames.has(sc.名称));

    if (newSubclasses.length > 0) {
        SUB_CLASS.push(...newSubclasses);
        alert(`${newSubclasses.length} 个新的子职业已成功添加！`);
        console.log('Updated SUB_CLASS:', SUB_CLASS);
    } else {
        alert('没有新的子职业被添加。可能它们已经存在或格式不正确。');
    }
}
