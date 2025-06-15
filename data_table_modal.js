/**
 * 显示一个包含可筛选、可排序数据的模态弹窗。
 * 首次调用时，会自动加载所需的 HTML 和 CSS。
 * @param {Array<Object>} data - 要在表格中显示的数据数组。
 * @param {Object} [config={}] - 用于自定义表格行为的配置对象。
 * @param {Object} [config.columnMap={}] - 列键到显示名称的映射。
 * @param {string[]} [config.filterableColumns=[]] - 需要添加筛选功能的列的键数组。
 * @param {string} [config.storageKey] - 用于在 localStorage 中保存筛选状态的唯一键。
 * @param {string} [config.title] - 模态框的标题。
 */
function showDataTableModal(data, onRowSelected, config = {}) {
    return new Promise((resolve, reject) => {
        // 1. 获取 DOM 元素引用
        const modal = document.getElementById('data-table-modal');
        const closeButton = document.getElementById('data-table-modal-close');
        const titleElement = document.getElementById('data-table-modal-title');
        const fixedHeader = document.getElementById('data-table-fixed-header');
        const bodyContainer = document.getElementById('data-table-body-container');

        if (!modal || !closeButton || !titleElement || !fixedHeader || !bodyContainer) {
            console.error('One or more modal elements could not be found in the DOM.');
            reject('Modal elements not found.');
            return;
        }

        fixedHeader.innerHTML = '';
        bodyContainer.innerHTML = '';

        if (!data || data.length === 0) {
            console.warn('showDataTableModal called with invalid or empty data.');
            reject('No data provided.');
            return;
        }

        const keys = Object.keys(data[0]);
        const { columnMap = {}, filterableColumns = [], storageKey, columnWidths = {} } = config;

        const headerTable = document.createElement('table');
        const thead = document.createElement('thead');
        const titleRow = document.createElement('tr');
        const filterRow = document.createElement('tr');
        const filterSelects = [];

        // 3. 动态生成表头和筛选器
        keys.forEach(key => {
            // Title Row
            const titleTh = document.createElement('th');
            if (columnWidths[key]) {
                titleTh.style.width = columnWidths[key];
            }
            titleTh.textContent = columnMap[key] || key;
            titleRow.appendChild(titleTh);

            // Filter Row
            const filterTh = document.createElement('th');
            if (filterableColumns.includes(key)) {
                const select = document.createElement('select');
                select.dataset.key = key;
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = '全部';
                select.appendChild(defaultOption);

                const uniqueValues = [...new Set(data.map(item => item[key]))].sort();
                uniqueValues.forEach(value => {
                    const option = document.createElement('option');
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });

                filterTh.appendChild(select);
                filterSelects.push(select);
            }
            filterRow.appendChild(filterTh);
        });

        thead.appendChild(titleRow);
        thead.appendChild(filterRow);
        headerTable.appendChild(thead);
        fixedHeader.appendChild(headerTable);

        const bodyTable = document.createElement('table');
        const colgroup = document.createElement('colgroup');
        keys.forEach(key => {
            const col = document.createElement('col');
            if (columnWidths[key]) {
                col.style.width = columnWidths[key];
            }
            colgroup.appendChild(col);
        });
        bodyTable.appendChild(colgroup);
        const tbody = document.createElement('tbody');
        bodyTable.appendChild(tbody);
        bodyContainer.appendChild(bodyTable);

        // 4. 核心功能函数
        const renderTableBody = (filteredData) => {
            tbody.innerHTML = '';
            filteredData.forEach(item => {
                const tr = document.createElement('tr');
                tr.dataset.rowData = JSON.stringify(item);
                keys.forEach(key => {
                    const td = document.createElement('td');
                    td.textContent = item[key];
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
        };

        const syncColumnWidths = () => {
            // This function is no longer needed as widths are set directly.
            // Kept for potential future use or can be removed.
        };

        const applyFiltersAndRender = () => {
            const currentFilters = {};
            filterSelects.forEach(select => {
                currentFilters[select.dataset.key] = select.value;
            });

            if (storageKey) {
                localStorage.setItem(storageKey, JSON.stringify(currentFilters));
            }

            const filteredData = data.filter(item => {
                return Object.entries(currentFilters).every(([key, value]) => {
                    return !value || String(item[key]) === value;
                });
            });

            renderTableBody(filteredData);
            syncColumnWidths();
        };

        // 5. 状态持久化和事件绑定
        if (storageKey) {
            const savedState = localStorage.getItem(storageKey);
            if (savedState) {
                const filters = JSON.parse(savedState);
                filterSelects.forEach(select => {
                    if (filters[select.dataset.key]) {
                        select.value = filters[select.dataset.key];
                    }
                });
            }
        }

        filterSelects.forEach(select => {
            select.addEventListener('change', applyFiltersAndRender);
        });

        // 6. 实现行点击选择
        const handleRowClick = (event) => {
            const row = event.target.closest('tr');
            if (row && row.dataset.rowData) {
                const selectedData = JSON.parse(row.dataset.rowData);
                if (typeof onRowSelected === 'function') {
                    onRowSelected(selectedData);
                }
                resolve(selectedData); // Still resolve the promise for other potential uses
                cleanupAndClose();
            }
        };
        bodyContainer.addEventListener('click', handleRowClick);

        // 7. 实现显示/隐藏和关闭逻辑
        modal.style.display = 'block';
        const cleanupAndClose = () => {
            modal.style.display = 'none';
            closeButton.removeEventListener('click', handleCloseClick);
            window.removeEventListener('click', handleWindowClick);
            bodyContainer.removeEventListener('click', handleRowClick);
            filterSelects.forEach(select => select.removeEventListener('change', applyFiltersAndRender));
        };

        const handleCloseClick = () => {
            reject('用户关闭了窗口');
            cleanupAndClose();
        };

        const handleWindowClick = (event) => {
            if (event.target === modal) {
                reject('用户关闭了窗口');
                cleanupAndClose();
            }
        };

        closeButton.addEventListener('click', handleCloseClick);
        window.addEventListener('click', handleWindowClick);

        if (config.title) {
            titleElement.textContent = config.title;
        }

        // 初始加载
        applyFiltersAndRender();
        // 确保初始宽度同步
        setTimeout(syncColumnWidths, 0);
    });
}

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

