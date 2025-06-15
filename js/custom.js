/**
 * Creates a reverse map from a key map for quick, case-insensitive alias lookup.
 * @param {object} keyMap - The map of standard keys to their aliases.
 * @returns {object} A reverse map where keys are lowercase aliases and values are standard keys.
 */
function createReverseKeyMap(keyMap) {
    const reverseKeyMap = {};
    for (const standardKey in keyMap) {
        for (const alias of keyMap[standardKey]) {
            reverseKeyMap[alias.toLowerCase()] = standardKey;
        }
    }
    return reverseKeyMap;
}

/**
 * A generic handler for adding custom data from user uploads.
 * @param {Array<object>} items - The array of items from the user.
 * @param {object} config - Configuration object.
 * @param {string} config.entityName - The user-facing name of the data type (e.g., "领域卡").
 * @param {Array<object>} config.targetArray - The global array to push data to.
 * @param {string} config.targetArrayName - The string name of the global array for logging.
 * @param {function(object): object | null} config.processingFn - A function that takes a raw item and returns a processed item, or null to discard.
 * @param {function(object, Set<string>): boolean} [config.filterFn] - An optional function to filter processed items before merging. It receives the item and a Set of existing names.
 */
function addData(items, config) {
    const { entityName, targetArray, targetArrayName, processingFn } = config;

    // 1. Process all items. The processing function is responsible for everything.
    const processedItems = items.map(processingFn).filter(item => item !== null && typeof item === 'object' && Object.keys(item).length > 0);

    // 2. Filter out duplicates or unwanted items.
    const existingNames = new Set(targetArray.map(item => item.名称));
    
    // The default filter checks for a non-empty '名称' property and uniqueness.
    const filterFn = config.filterFn || ((item, names) => item.名称 && !names.has(item.名称));
    
    const newItems = processedItems.filter(item => filterFn(item, existingNames));

    // 3. Merge and notify.
    if (newItems.length > 0) {
        targetArray.push(...newItems);
        alert(`${newItems.length} 个新的${entityName}已成功添加！`);
        console.log(`Updated ${targetArrayName}:`, targetArray);
    } else {
        alert(`没有新的${entityName}被添加。可能它们已经存在或格式不正确。`);
    }
}

/**
 * Adds custom domain cards from an uploaded JSON file.
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
    const reverseKeyMap = createReverseKeyMap(keyMap);

    const processingFn = (card) => {
        const newCard = {};
        for (const key in card) {
            if (Object.hasOwnProperty.call(card, key)) {
                const standardKey = reverseKeyMap[key.toLowerCase()] || key;
                newCard[standardKey] = card[key];
            }
        }
        return newCard;
    };

    addData(customCards, {
        entityName: '领域卡',
        targetArray: DOMAIN_CARDS,
        targetArrayName: 'DOMAIN_CARDS',
        processingFn: processingFn
    });
}

/**
 * Adds custom classes from an uploaded JSON file.
 * @param {Array<object>} customClasses - An array of class objects from the user.
 */
function add_custom_class(customClasses) {
    const keyMap = {
        "名称": ["name", "classname", "title"],
        "领域": ["domain", "domains"],
        "初始闪避值": ["evasion", "baseevasion", "startevasion", "起始闪避"],
        "初始生命值": ["hp", "basehp", "starthp", "起始生命"],
        "希望特性": ["hopefeature", "hope_feature"],
        "职业特性": ["classfeature", "class_feature"],
        "背景问题": ["backgroundquestions", "background_questions"],
        "关系问题": ["relationshipprompts", "relationship_prompts"]
    };
    const reverseKeyMap = createReverseKeyMap(keyMap);

    const processingFn = (cls) => {
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
                    newClass[standardKey] = ["", "", ""]; // Default to empty array for question lists
                } else {
                    newClass[standardKey] = ""; // Default to empty string
                }
            }
        }
        return newClass;
    };

    addData(customClasses, {
        entityName: '职业',
        targetArray: MAIN_CLASS,
        targetArrayName: 'MAIN_CLASS',
        processingFn: processingFn
    });
}

/**
 * Adds custom subclasses from an uploaded JSON file.
 * @param {Array<object>} customSubclasses - An array of subclass objects from the user.
 */
function add_custom_subclass(customSubclasses) {
    const keyMap = {
        "主职": ["主职", "主职业", "parentclass", "mainclass"],
        "名称": ["子职业","name", "subclassname", "title"],
        "等级": ["等级","level", "tier"],
        "施法属性": ["施法", "castingstat", "casting_stat"],
        "特性": ["特性", "描述", "description", "desc", "details", "feature"]
    };
    const reverseKeyMap = createReverseKeyMap(keyMap);

    const processingFn = (subclass) => {
        const tempSubclass = {};
        for (const key in subclass) {
            if (Object.hasOwnProperty.call(subclass, key)) {
                const standardKey = reverseKeyMap[key.toLowerCase()] || key;
                tempSubclass[standardKey] = subclass[key];
            }
        }
        return tempSubclass;
    };
    
    const filterFn = (item, names) => item.名称 && item.名称 !== "-" && !names.has(item.名称);

    addData(customSubclasses, {
        entityName: '子职业',
        targetArray: SUB_CLASS,
        targetArrayName: 'SUB_CLASS',
        processingFn: processingFn,
        filterFn: filterFn
    });
}

/**
 * Adds custom variant cards from an uploaded JSON file.
 * The user uploads a card pack, from which this function extracts 'variant' data,
 * processes it, and then presents it in a modal for the user to select a card to create.
 * @param {Array<object>|object} items - The parsed JSON content from the uploaded file.
 */
function add_custom_variant(items) {
    let variants = [];

    // Find the 'variant' array within the uploaded data structure.
    if (Array.isArray(items) && items.length > 0) {
        // Case 1: The file is an array of packs, check the first one.
        const pack = items[0];
        if (pack && Array.isArray(pack.variant)) {
            variants = pack.variant;
        } else if (pack && pack.name && pack.desc) {
            // Case 2: The file is an array of variants itself.
            variants = items;
        }
    } else if (typeof items === 'object' && items !== null) {
        // Case 3: The file is a single pack object.
        if (Array.isArray(items.variant)) {
            variants = items.variant;
        }
    }

    if (variants.length === 0) {
        alert("在上传的文件中没有找到有效的'variant'数据。请确保文件包含一个名为 'variant' 的对象列表。");
        return;
    }

    // 1. Process variants: remove the 'id' field from each object.
    const processedVariants = variants.map(variant => {
        // Use object destructuring to exclude the 'id' property.
        const { id, ...rest } = variant;
        return rest;
    });

    // 2. Define the configuration for the data table modal.
    const modalConfig = {
        title: "选择要生成的变体卡牌",
    };

    // 3. Define the callback function for when a row is selected.
    const handleRowSelected = (selectedRowData) => {
        if (selectedRowData) {
            // 4. Create a card from the selected data.
            createCard(selectedRowData);
        }
    };

    // 5. Call showDataTableModal with the correct arguments.
    showDataTableModal(processedVariants, handleRowSelected, modalConfig)
        .catch(error => {
            console.log("模态框已关闭: ", error);
        });
}
