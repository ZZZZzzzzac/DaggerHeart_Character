/**
 * setupDataModalButtons
 * 为角色卡编辑器里的各个「添加」按钮绑定数据表格弹窗。
 * 依赖 generic_table_modal.js 提供的 showTableModal(data, config) → Promise
 */
function setupDataModalButtons() {

    // ── 工具函数 ──────────────────────────────────────────────────────────────

    /** 根据 dataset.state 更新三态复选框的视觉样式 */
    const updateCheckboxVisualState = (element) => {
        if (!element) return;
        const state = element.dataset.state;
        element.classList.remove('state-checked', 'state-dashed');
        if (state === '1') element.classList.add('state-checked');
        else if (state === '2') element.classList.add('state-dashed');
    };

    /**
     * 为武器按钮注册弹窗逻辑。
     * @param {string} buttonId       触发按钮的 DOM ID
     * @param {*}      dataSource     武器数据数组（可能为 undefined，运行时检查）
     * @param {string} modalTitle     弹窗标题
     * @param {string} storageKey     localStorage 筛选状态键
     * @param {string} nameId         名称 textbox 的 DOM ID
     * @param {string} statId         属性/距离 textbox 的 DOM ID
     * @param {string} damageId       伤害 textbox 的 DOM ID
     * @param {string} traitId        描述 textbox 的 DOM ID
     * @param {Object} columnWidths   列宽配置
     */
    const setupWeaponButton = (buttonId, dataSource, modalTitle, storageKey,
                                nameId, statId, damageId, traitId, columnWidths) => {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.addEventListener('click', () => {
            if (!dataSource || dataSource.length === 0) {
                console.error(`Data source for ${modalTitle} is not defined.`);
                alert(`错误：${modalTitle}数据源未定义。`);
                return;
            }

            showTableModal(dataSource, {
                title: modalTitle,
                filterableColumns: ['属性', '距离', '双手', '伤害类型', '位阶'],
                storageKey,
                columnWidths,
            }).then(selectedItem => {
                // 直接映射：名称 → nameId，描述 → traitId
                const directMap = { '名称': nameId, '描述': traitId };
                for (const key in directMap) {
                    const el = document.getElementById(directMap[key]);
                    if (el) el.value = removeMarkdownFormatting(selectedItem[key] || '');
                }

                // 组合字段：属性／距离
                const statEl = document.getElementById(statId);
                if (statEl) {
                    statEl.value = `${selectedItem['属性'] || ''}／${selectedItem['距离'] || ''}`;
                }

                // 组合字段：伤害／伤害类型
                const damageEl = document.getElementById(damageId);
                if (damageEl) {
                    damageEl.value = `${selectedItem['伤害'] || ''}／${selectedItem['伤害类型'] || ''}`;
                }
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    };

    const weaponWidths = {
        名称: '10%', 伤害: '5%', 属性: '5%', 距离: '7%',
        双手: '5%', 伤害类型: '5%', 位阶: '5%', 描述: ''
    };

    // ── 主武器 ────────────────────────────────────────────────────────────────
    setupWeaponButton(
        'add-primary-weapon-btn',
        typeof PRIMARY_WEAPON !== 'undefined' ? PRIMARY_WEAPON : undefined,
        '选择主武器', 'primaryWeaponFilterState',
        'PrimaryWeaponNameTextbox', 'PrimaryWeaponStatTextbox',
        'PrimaryWeaponDamageTextbox', 'PrimaryWeaponTraitTextbox',
        weaponWidths
    );

    // ── 副武器 ────────────────────────────────────────────────────────────────
    setupWeaponButton(
        'add-secondary-weapon-btn',
        typeof SECONDARY_WEAPON !== 'undefined' ? SECONDARY_WEAPON : undefined,
        '选择副武器', 'secondaryWeaponFilterState',
        'SecondaryWeaponNameTextbox', 'SecondaryWeaponStatTextbox',
        'SecondaryWeaponDamageTextbox', 'SecondaryWeaponTraitTextbox',
        weaponWidths
    );

    // ── 备用武器 1 ────────────────────────────────────────────────────────────
    setupWeaponButton(
        'add-backup1-weapon-btn',
        (typeof PRIMARY_WEAPON !== 'undefined' && typeof SECONDARY_WEAPON !== 'undefined')
            ? [...PRIMARY_WEAPON, ...SECONDARY_WEAPON] : undefined,
        '选择备用武器1', 'backup1WeaponFilterState',
        'Backup1WeaponNameTextbox', 'Backup1WeaponStatTextbox',
        'Backup1WeaponDamageTextbox', 'Backup1WeaponTraitTextbox',
        weaponWidths
    );

    // ── 备用武器 2 ────────────────────────────────────────────────────────────
    setupWeaponButton(
        'add-backup2-weapon-btn',
        (typeof PRIMARY_WEAPON !== 'undefined' && typeof SECONDARY_WEAPON !== 'undefined')
            ? [...PRIMARY_WEAPON, ...SECONDARY_WEAPON] : undefined,
        '选择备用武器2', 'backup2WeaponFilterState',
        'Backup2WeaponNameTextbox', 'Backup2WeaponStatTextbox',
        'Backup2WeaponDamageTextbox', 'Backup2WeaponTraitTextbox',
        weaponWidths
    );

    // ── 护甲 ──────────────────────────────────────────────────────────────────
    const addArmorBtn = document.getElementById('add-armor-btn');
    if (addArmorBtn) {
        addArmorBtn.addEventListener('click', () => {
            if (typeof ARMOR === 'undefined') {
                console.error('Data source variable "ARMOR" is not defined.');
                alert('错误：护甲数据源未定义。');
                return;
            }

            showTableModal(ARMOR, {
                title: '选择护甲',
                filterableColumns: ['重伤阈值', '严重阈值', '护甲值', '位阶'],
                storageKey: 'armorFilterState',
                columnWidths: { 名称: '10%', 重伤阈值: '5%', 严重阈值: '5%', 护甲值: '5%', 位阶: '5%', 描述: ''},
            }).then(selectedItem => {
                // 直接映射
                const directMap = {
                    '名称': 'ArmorNameTextbox',
                    '护甲值': 'ArmorScoreTextbox',
                    '描述': 'ArmorTraitTextbox',
                };
                for (const key in directMap) {
                    const el = document.getElementById(directMap[key]);
                    if (el) el.value = removeMarkdownFormatting(selectedItem[key] || '');
                }

                // 重伤／严重阈值 组合显示
                const thresholdEl = document.getElementById('ArmorThresholdTextbox');
                if (thresholdEl) {
                    thresholdEl.value = `${selectedItem['重伤阈值'] || ''}／${selectedItem['严重阈值'] || ''}`;
                }

                // 基于等级计算实际阈值与护甲槽
                const levelEl = document.getElementById('LevelTextbox');
                const level = parseInt(levelEl?.value, 10) || 1;
                const majorThreshold = (parseInt(selectedItem['重伤阈值'], 10) || level) + level;
                const severeThreshold = (parseInt(selectedItem['严重阈值'], 10) || level * 2) + level;
                const armorValue = parseInt(selectedItem['护甲值'], 10) || 0;

                const majorEl = document.getElementById('MajorTextbox');
                if (majorEl) majorEl.value = majorThreshold;

                const severeEl = document.getElementById('SevereTextbox');
                if (severeEl) severeEl.value = severeThreshold;

                const armorEl = document.getElementById('ArmorTextbox');
                if (armorEl) armorEl.value = armorValue;

                // 更新护甲槽状态
                const armorSlots = document.querySelectorAll('#armor-slots-container .armor-slot-checkbox');
                armorSlots.forEach((slot, index) => {
                    slot.dataset.state = index < armorValue ? '0' : '2';
                    updateCheckboxVisualState(slot);
                });
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    }

    // ── 物品 ──────────────────────────────────────────────────────────────────
    const addItemBtn = document.getElementById('add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', () => {
            const ITEMS = typeof LOOT_DATA !== 'undefined' ? LOOT_DATA : undefined;
            if (!ITEMS) {
                console.error('Data source variable "LOOT_DATA" is not defined.');
                alert('错误：物品数据源未定义。');
                return;
            }

            showTableModal(ITEMS, {
                title: '选择物品',
                filterableColumns: ['类型'],
                storageKey: 'itemFilterState',
                columnWidths: { 名称: '15%', 类型: '5%', 掷骰: '5%', 描述: ''},
            }).then(selectedItem => {
                const targetTextbox = document.getElementById('ItemSlot1Textbox');
                if (targetTextbox) {
                    const newItemText = `${selectedItem['名称']}: ${removeMarkdownFormatting(selectedItem['描述'] || '')}`;
                    targetTextbox.value = targetTextbox.value.trim() === ''
                        ? newItemText
                        : `${targetTextbox.value}\n${newItemText}`;
                }
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    }

    // ── 领域卡 ────────────────────────────────────────────────────────────────
    const addDomainCardBtn = document.getElementById('add-domain-card-btn');
    if (addDomainCardBtn) {
        addDomainCardBtn.addEventListener('click', () => {
            if (typeof DOMAIN_CARDS === 'undefined') {
                console.error('Data source variable "DOMAIN_CARDS" is not defined.');
                alert('错误：领域卡数据源未定义。');
                return;
            }

            const classDomain = document.getElementById('ClassDomainTextbox')?.value;
            let modalTitle = '选择领域卡';
            if (classDomain) {
                modalTitle = `选择领域卡 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 当前职业领域：${classDomain}`;
            }

            showTableModal(DOMAIN_CARDS, {
                title: modalTitle,
                filterableColumns: ['领域', '等级', '属性', '回想'],
                storageKey: 'domainCardFilterState',
                columnWidths: { 名称: '10%', 领域: '5%', 等级: '5%', 属性: '5%', 回想: '5%', 描述: '' },
            }).then(selectedItem => {
                createCard(selectedItem);
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    }

    // ── 种族卡（两次选择）────────────────────────────────────────────────────
    const addAncestryCardBtn = document.getElementById('add-ancestry-card-btn');
    if (addAncestryCardBtn) {
        addAncestryCardBtn.addEventListener('click', async () => {
            if (typeof RACES_DATA === 'undefined') {
                console.error('Data source variable "RACES_DATA" is not defined.');
                alert('错误：种族数据源未定义。');
                return;
            }

            const modalConfig = {
                title: '选择第一个种族',
                storageKey: 'ancestryCardFilterState',
                columnWidths: { 名称: '10%', 简介: '30%', 描述: '' },
            };

            try {
                const selectedItem1 = await showTableModal(RACES_DATA, modalConfig);

                modalConfig.title = '选择第二个种族';
                const selectedItem2 = await showTableModal(RACES_DATA, modalConfig);

                const raceTextbox = document.getElementById('RaceTextbox');
                if (raceTextbox) {
                    if (selectedItem1['名称'] === selectedItem2['名称']) {
                        raceTextbox.value = selectedItem1['名称'] || '';
                        createCard(selectedItem1);
                    } else {
                        const desc1Parts = selectedItem1['描述'].split('\n');
                        const desc2Parts = selectedItem2['描述'].split('\n');
                        const mixedRace = {
                            '名称': `${selectedItem1['名称']}+${selectedItem2['名称']}`,
                            '类型': '种族',
                            '描述': `${desc1Parts[0]}\n\n${desc2Parts[1]}`,
                        };
                        raceTextbox.value = mixedRace['名称'];
                        createCard(mixedRace);
                    }
                }
            } catch (error) {
                console.log('种族选择已取消。', error);
            }
        });
    }

    // ── 社群卡 ────────────────────────────────────────────────────────────────
    const addCommunityCardBtn = document.getElementById('add-community-card-btn');
    if (addCommunityCardBtn) {
        addCommunityCardBtn.addEventListener('click', () => {
            if (typeof COMM_DATA === 'undefined') {
                console.error('Data source variable "COMM_DATA" is not defined.');
                alert('错误：社群数据源未定义。');
                return;
            }

            showTableModal(COMM_DATA, {
                title: '选择社群',
                storageKey: 'communityCardFilterState',
                columnWidths: { 名称: '10%', 简介: '30%', 描述: '' },
            }).then(selectedItem => {
                const communityTextbox = document.getElementById('CommunityTextbox');
                if (communityTextbox) communityTextbox.value = selectedItem['名称'] || '';
                createCard(selectedItem);
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    }

    // ── 野兽形态卡 ────────────────────────────────────────────────────────────
    const addBeastFormCardBtn = document.getElementById('add-beast-form-card-btn');
    if (addBeastFormCardBtn) {
        addBeastFormCardBtn.addEventListener('click', () => {
            if (typeof BEAST_FORM === 'undefined') {
                console.error('Data source variable "BEAST_FORM" is not defined.');
                alert('错误：野兽形态数据源未定义。');
                return;
            }

            showTableModal(BEAST_FORM, {
                title: '选择野兽形态',
                filterableColumns: ['位阶', '属性', '闪避值', '攻击范围', '攻击属性', '攻击伤害', '攻击类型', '获得优势'],
                storageKey: 'beastFormCardFilterState',
                columnWidths: {
                    名称: '10%', 位阶: '5%', 属性: '5%', 闪避值: '5%',
                    攻击范围: '5%', 攻击属性: '5%', 攻击伤害: '5%', 攻击类型: '5%', 获得优势: '10%', 描述: '' 
                },
            }).then(selectedItem => {
                createCard(selectedItem);
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    }

    // ── 职业卡 ────────────────────────────────────────────────────────────────
    const addClassCardBtn = document.getElementById('add-class-card-btn');
    if (addClassCardBtn) {
        addClassCardBtn.addEventListener('click', () => {
            if (typeof MAIN_CLASS === 'undefined') {
                console.error('Data source variable "MAIN_CLASS" is not defined.');
                alert('错误：职业数据源未定义。');
                return;
            }

            showTableModal(MAIN_CLASS, {
                title: '选择职业',
                storageKey: 'classCardFilterState',
                columnWidths: { 名称: '7%', 领域: '7%', 初始闪避值: '5%', 初始生命点: '5%', 希望特性: '15%', 职业特性: ''  },
            }).then(selectedItem => {
                // 领域（隐藏字段）
                const classDomainTextbox = document.getElementById('ClassDomainTextbox');
                if (classDomainTextbox) classDomainTextbox.value = selectedItem['领域'] || '';

                // 职业名称
                const classTextbox = document.getElementById('ClassTextbox');
                if (classTextbox) classTextbox.value = selectedItem['名称'] || '';

                // 闪避值
                const evasionTextbox = document.getElementById('EvasionTextbox');
                if (evasionTextbox) evasionTextbox.value = selectedItem['初始闪避值'] || '';

                // 生命槽
                const initialHp = parseInt(selectedItem['初始生命点'], 10);
                if (!isNaN(initialHp)) {
                    document.querySelectorAll('#hp-container .hp-slot-checkbox').forEach((slot, index) => {
                        slot.dataset.state = index < initialHp ? '0' : '2';
                        updateCheckboxVisualState(slot);
                    });
                }

                // 职业特性
                const classFeatureTextbox = document.getElementById('ClassFeatureTextbox');
                if (classFeatureTextbox) {
                    classFeatureTextbox.value = removeMarkdownFormatting(
                        `${selectedItem['希望特性']}\n\n${selectedItem['职业特性']}`
                    );
                }

                // 背景问题
                ['BackgroundQuestion1Textbox', 'BackgroundQuestion2Textbox', 'BackgroundQuestion3Textbox']
                    .forEach((id, i) => {
                        const el = document.getElementById(id);
                        if (el && selectedItem['背景问题']) el.value = selectedItem['背景问题'][i] || '';
                    });

                // 关系问题
                ['ConnectQuestion1Textbox', 'ConnectQuestion2Textbox', 'ConnectQuestion3Textbox']
                    .forEach((id, i) => {
                        const el = document.getElementById(id);
                        if (el && selectedItem['关系问题']) el.value = selectedItem['关系问题'][i] || '';
                    });

                // 自动触发子职业选择
                const subClassBtn = document.getElementById('add-subclass-card-btn');
                if (subClassBtn) {
                    subClassBtn.dataset.parentClass = selectedItem['名称'];
                    setTimeout(() => subClassBtn.click(), 100);
                }
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });
        });
    }

    // ── 子职业卡 ──────────────────────────────────────────────────────────────
    const addSubclassCardBtn = document.getElementById('add-subclass-card-btn');
    if (addSubclassCardBtn) {
        addSubclassCardBtn.addEventListener('click', function () {
            if (typeof SUB_CLASS === 'undefined') {
                console.error('Data source variable "SUB_CLASS" is not defined.');
                alert('错误：子职业数据源未定义。');
                return;
            }

            const parentClass = this.dataset.parentClass;
            if (parentClass) localStorage.removeItem('subclassCardFilterState');

            showTableModal(SUB_CLASS, {
                title: '选择子职业',
                filterableColumns: ['主职'],
                storageKey: 'subclassCardFilterState',
                columnWidths: { 名称: '10%', 主职: '10%', 施法属性: '7%', 等级: '7%', 描述: ''  },
                preselectedFilters: parentClass ? { '主职': parentClass } : {},
            }).then(selectedItem => {
                const classTextbox = document.getElementById('ClassTextbox');
                if (classTextbox && selectedItem['主职'] && selectedItem['名称']) {
                    let subClassName = selectedItem['名称'];
                    const lastDashIndex = subClassName.lastIndexOf('-');
                    if (lastDashIndex > -1) subClassName = subClassName.substring(0, lastDashIndex).trim();
                    classTextbox.value = `${selectedItem['主职']}-${subClassName}`;
                }
                createCard(selectedItem);
            }).catch(() => { /* 用户关闭弹窗，忽略 */ });

            if (parentClass) delete this.dataset.parentClass;
        });
    }
}
