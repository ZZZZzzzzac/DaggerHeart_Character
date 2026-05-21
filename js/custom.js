/**
 * 处理上传的自定义卡包数据。
 * @param {Array<Object>} packData - 从JSON文件解析出的卡牌对象数组。
 */
function processUploadedPack(packData) {
    let addedCounts = {
        domain: 0,
        class: 0,
        subclass: 0,
        race: 0,
        community: 0,
        primaryWeapon: 0,
        secondaryWeapon: 0,
        armor: 0,
        loot: 0,
        other: 0
    };

    const knownTypes = new Set([
        '领域卡',
        '主职',
        '子职',
        '种族',
        '社群',
        '主武器',
        '副武器',
        '护甲',
        '物品',
        '消耗品'
    ]);
    const lootLikeKeys = new Set(['名称', '原名', '位阶', '类型', '描述', '掷骰']);

    function addUniqueCard(targetArray, card) {
        if (!targetArray || targetArray.some(c => c.名称 === card.名称)) {
            return false;
        }
        targetArray.push(card);
        return true;
    }

    function isLootLikeCard(card) {
        const keys = Object.keys(card);
        return keys.length > 0 && keys.every(key => lootLikeKeys.has(key));
    }

    if (!Array.isArray(packData)) {
        console.error("提供的卡包数据不是一个数组:", packData);
        alert("错误：卡包文件格式不正确，需要一个卡牌数组。");
        return;
    }

    packData.forEach(card => {
        if (!card || typeof card !== 'object') {
            console.warn("在卡包数据中发现无效的卡牌条目:", card);
            return; // 跳过无效的条目
        }

        const cardType = card.类型;

        switch (cardType) {
            case '领域卡':
                if (addUniqueCard(DOMAIN_CARDS, card)) {
                    addedCounts.domain++;
                }
                break;
            case '主职':
                if (addUniqueCard(MAIN_CLASS, card)) {
                    addedCounts.class++;
                }
                break;
            case '子职':
                if (addUniqueCard(SUB_CLASS, card)) {
                    addedCounts.subclass++;
                }
                break;
            case '种族':
                if (typeof RACES_DATA !== 'undefined' && addUniqueCard(RACES_DATA, card)) {
                    addedCounts.race++;
                }
                break;
            case '社群':
                if (typeof COMM_DATA !== 'undefined' && addUniqueCard(COMM_DATA, card)) {
                    addedCounts.community++;
                }
                break;
            case '主武器':
                if (typeof PRIMARY_WEAPON !== 'undefined' && addUniqueCard(PRIMARY_WEAPON, card)) {
                    addedCounts.primaryWeapon++;
                }
                break;
            case '副武器':
                if (typeof SECONDARY_WEAPON !== 'undefined' && addUniqueCard(SECONDARY_WEAPON, card)) {
                    addedCounts.secondaryWeapon++;
                }
                break;
            case '护甲':
                if (typeof ARMOR !== 'undefined' && addUniqueCard(ARMOR, card)) {
                    addedCounts.armor++;
                }
                break;
            case '物品':
            case '消耗品':
                if (typeof LOOT_DATA !== 'undefined' && addUniqueCard(LOOT_DATA, card)) {
                    addedCounts.loot++;
                }
                break;
            default:
                if (!knownTypes.has(cardType) && isLootLikeCard(card)) {
                    if (typeof LOOT_DATA !== 'undefined' && addUniqueCard(LOOT_DATA, card)) {
                        addedCounts.loot++;
                    }
                    break;
                }

                // 如果类型不匹配或不存在，则直接创建卡牌
                if (typeof createCard === 'function') {
                    createCard(card);
                    addedCounts.other++;
                } else {
                    console.warn("createCard 函数未定义，无法创建卡牌:", card);
                }
                break;
        }
    });

    let messageParts = [];
    if (addedCounts.domain > 0) {
        messageParts.push(`- 新增领域卡: ${addedCounts.domain}`);
    }
    if (addedCounts.class > 0) {
        messageParts.push(`- 新增职业: ${addedCounts.class}`);
    }
    if (addedCounts.subclass > 0) {
        messageParts.push(`- 新增子职: ${addedCounts.subclass}`);
    }
    if (addedCounts.race > 0) {
        messageParts.push(`- 新增种族: ${addedCounts.race}`);
    }
    if (addedCounts.community > 0) {
        messageParts.push(`- 新增社群: ${addedCounts.community}`);
    }
    if (addedCounts.primaryWeapon > 0) {
        messageParts.push(`- 新增主武器: ${addedCounts.primaryWeapon}`);
    }
    if (addedCounts.secondaryWeapon > 0) {
        messageParts.push(`- 新增副武器: ${addedCounts.secondaryWeapon}`);
    }
    if (addedCounts.armor > 0) {
        messageParts.push(`- 新增护甲: ${addedCounts.armor}`);
    }
    if (addedCounts.loot > 0) {
        messageParts.push(`- 新增物品/消耗品: ${addedCounts.loot}`);
    }
    if (addedCounts.other > 0) {
        messageParts.push(`- 直接创建到页面的其他卡牌: ${addedCounts.other}`);
    }

    if (messageParts.length > 0) {
        alert("处理完成！\n" + messageParts.join("\n"));
    } else {
        alert("没有新的卡牌被添加或创建。");
    }
}
