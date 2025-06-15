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