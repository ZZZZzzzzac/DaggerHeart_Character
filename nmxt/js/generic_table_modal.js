/**
 * @file generic_table_modal.js
 * @description 通用数据表格弹窗模块（完全独立，自包含 HTML 与 CSS）
 *
 * ─── 使用方式 ───────────────────────────────────────────────────────────────
 *
 * 方式一：直接调用，返回 Promise
 *   showTableModal(dataArray, config)
 *     .then(selectedRow => { ... })
 *     .catch(reason => { ... });   // 用户关闭弹窗时 reject
 *
 * 方式二：绑定到触发元素，每次点击时调用数据获取函数并弹窗
 *   bindTableModalTrigger(
 *     triggerElement,          // DOM 元素 或 元素 ID 字符串
 *     dataProvider,            // () => dataArray  或  () => Promise<dataArray>
 *     config,                  // 配置对象（同 showTableModal）
 *     onSelect                 // (selectedRow) => void，点击行时的回调（可选）
 *   );
 *
 * ─── config 配置项 ─────────────────────────────────────────────────────────
 *   title            {string}   弹窗标题（支持 HTML）
 *   hiddenColumns    {string[]} 不显示的列键名
 *   columnMap        {Object}   列键名 -> 显示名称 的映射
 *   filterableColumns{string[]} 需要下拉筛选的列键名
 *   columnWidths     {Object}   列键名 -> CSS 宽度，如 { "名称": "20%" }
 *   storageKey       {string}   用于 localStorage 持久化筛选状态的唯一 key
 *   preselectedFilters{Object}  初始预选筛选值，如 { "类型": "武器" }
 *   cellFormatter    {Function} (key, value, rowData) => string  自定义单元格文本
 *
 * ─── 依赖 ──────────────────────────────────────────────────────────────────
 *   无外部依赖。若宿主环境定义了 removeMarkdownFormatting(text) 函数，
 *   单元格渲染时将自动调用它；否则原样显示。
 */

(function (global) {
    'use strict';

    // ─────────────────────────────────────────────────────────────────────────
    // 一、样式注入（仅注入一次）
    // ─────────────────────────────────────────────────────────────────────────

    const STYLE_ID = 'generic-table-modal-style';

    function _injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
/* ── Generic Table Modal ────────────────────────────── */
.gtm-overlay {
    display: none;
    position: fixed;
    z-index: 10000;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
}
.gtm-overlay.gtm-visible {
    display: block;
}
.gtm-dialog {
    background: #fefefe;
    border: 1px solid #888;
    border-radius: 4px;
    width: 80vw;
    height: 65vh;
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 16px 20px 12px;
    box-sizing: border-box;
    box-shadow: 0 8px 32px rgba(0,0,0,0.28);
}
.gtm-header-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-shrink: 0;
    margin-bottom: 8px;
}
.gtm-title {
    margin: 0;
    font-size: 16px;
    font-weight: bold;
    line-height: 1.4;
    flex: 1;
    padding-right: 12px;
}
.gtm-close {
    color: #aaa;
    font-size: 26px;
    font-weight: bold;
    cursor: pointer;
    line-height: 1;
    flex-shrink: 0;
    user-select: none;
}
.gtm-close:hover { color: #333; }

.gtm-fixed-header {
    overflow-y: hidden;
    flex-shrink: 0;
}
.gtm-body {
    overflow-y: auto;
    flex-grow: 1;
}

/* Tables */
.gtm-dialog table {
    width: 100%;
    border-collapse: collapse;
}
.gtm-dialog th,
.gtm-dialog td {
    border: 1px solid #ddd;
    padding: 3px 4px;
    font-size: 13px;
    text-align: left;
    vertical-align: top;
    word-break: break-all;
    white-space: pre-wrap;
}
.gtm-dialog th {
    background: #f2f2f2;
    font-weight: bold;
}
.gtm-dialog th select {
    width: 100%;
    padding: 2px 4px;
    font-size: 12px;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-sizing: border-box;
}

/* Row hover / click */
.gtm-body tbody tr {
    cursor: pointer;
    transition: background 0.1s;
}
.gtm-body tbody tr:hover {
    background: #e8f4fd;
}
.gtm-body tbody tr:active {
    background: #c8e6f9;
}
/* ── End Generic Table Modal ─────────────────────────── */
        `;
        document.head.appendChild(style);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 二、DOM 骨架构建（每次调用重用同一个 overlay 元素）
    // ─────────────────────────────────────────────────────────────────────────

    const OVERLAY_ID = 'gtm-overlay-singleton';

    function _getOrCreateOverlay() {
        let overlay = document.getElementById(OVERLAY_ID);
        if (overlay) return overlay;

        overlay = document.createElement('div');
        overlay.id = OVERLAY_ID;
        overlay.className = 'gtm-overlay';
        overlay.innerHTML = `
            <div class="gtm-dialog">
                <div class="gtm-header-row">
                    <h2 class="gtm-title"></h2>
                    <span class="gtm-close">&times;</span>
                </div>
                <div class="gtm-fixed-header"></div>
                <div class="gtm-body"></div>
            </div>
        `;
        document.body.appendChild(overlay);
        return overlay;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 三、核心函数：showTableModal
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * 显示通用数据表格弹窗。
     * @param {Object[]} data   JSON 对象数组，所有对象应具有相同的键结构。
     * @param {Object}  [config={}] 配置项（详见文件顶部文档）。
     * @returns {Promise<Object>} resolve 时返回用户选中的行对象，reject 时返回关闭原因字符串。
     */
    function showTableModal(data, config) {
        config = config || {};

        _injectStyles();
        const overlay = _getOrCreateOverlay();

        const titleEl      = overlay.querySelector('.gtm-title');
        const closeBtn     = overlay.querySelector('.gtm-close');
        const fixedHeader  = overlay.querySelector('.gtm-fixed-header');
        const bodyDiv      = overlay.querySelector('.gtm-body');

        // 清空上次内容
        fixedHeader.innerHTML = '';
        bodyDiv.innerHTML = '';
        fixedHeader.style.paddingRight = '';

        return new Promise((resolve, reject) => {

            // ── 参数校验 ──────────────────────────────────────────────────
            if (!data || data.length === 0) {
                reject('数据为空，无法显示表格。');
                return;
            }

            const {
                title            = '',
                hiddenColumns    = [],
                columnMap        = {},
                filterableColumns= [],
                columnWidths     = {},
                storageKey       = null,
                preselectedFilters = {},
                cellFormatter    = null,
            } = config;

            // ── 收集所有键（去重，保序，过滤隐藏列）───────────────────────
            const allKeysSet = new Set();
            data.forEach(item => {
                Object.keys(item).forEach(k => allKeysSet.add(k));
            });
            const keys = [...allKeysSet].filter(k => !hiddenColumns.includes(k));

            if (keys.length === 0) {
                reject('所有列均被隐藏，没有可显示的列。');
                return;
            }

            // ── 设置标题 ──────────────────────────────────────────────────
            titleEl.innerHTML = title || '选择数据';

            // ── 构建固定表头 ───────────────────────────────────────────────
            const headerTable = document.createElement('table');
            const thead = document.createElement('thead');
            const titleRow = document.createElement('tr');
            const filterRow = document.createElement('tr');
            const filterSelects = [];

            keys.forEach(key => {
                // 标题行
                const titleTh = document.createElement('th');
                if (columnWidths[key]) titleTh.style.width = columnWidths[key];
                titleTh.textContent = columnMap[key] || key;
                titleRow.appendChild(titleTh);

                // 筛选行
                const filterTh = document.createElement('th');
                if (columnWidths[key]) filterTh.style.width = columnWidths[key];

                if (filterableColumns.includes(key)) {
                    const select = document.createElement('select');
                    select.dataset.key = key;

                    const defaultOpt = document.createElement('option');
                    defaultOpt.value = '';
                    defaultOpt.textContent = '全部';
                    select.appendChild(defaultOpt);

                    const uniqueVals = [...new Set(data.map(item => item[key]))].sort();
                    uniqueVals.forEach(val => {
                        const opt = document.createElement('option');
                        opt.value = val;
                        opt.textContent = val;
                        select.appendChild(opt);
                    });

                    // 优先使用 preselectedFilters，否则从 localStorage 恢复
                    if (preselectedFilters[key] !== undefined) {
                        select.value = preselectedFilters[key];
                    }

                    filterTh.appendChild(select);
                    filterSelects.push(select);
                }

                filterRow.appendChild(filterTh);
            });

            thead.appendChild(titleRow);
            thead.appendChild(filterRow);
            headerTable.appendChild(thead);
            fixedHeader.appendChild(headerTable);

            // ── 从 localStorage 恢复（若无 preselectedFilters 干预）────────
            if (storageKey && Object.keys(preselectedFilters).length === 0) {
                try {
                    const saved = localStorage.getItem(storageKey);
                    if (saved) {
                        const state = JSON.parse(saved);
                        filterSelects.forEach(sel => {
                            if (state[sel.dataset.key] !== undefined) {
                                sel.value = state[sel.dataset.key];
                            }
                        });
                    }
                } catch (e) { /* 忽略 parse 错误 */ }
            }

            // ── 构建可滚动 tbody ──────────────────────────────────────────
            const bodyTable = document.createElement('table');
            const colgroup  = document.createElement('colgroup');
            keys.forEach(key => {
                const col = document.createElement('col');
                if (columnWidths[key]) col.style.width = columnWidths[key];
                colgroup.appendChild(col);
            });
            bodyTable.appendChild(colgroup);
            const tbody = document.createElement('tbody');
            bodyTable.appendChild(tbody);
            bodyDiv.appendChild(bodyTable);

            // ── 辅助：Markdown 去除（兼容宿主环境）────────────────────────
            const stripMarkdown = (val) => {
                const text = (val === null || val === undefined) ? '' : String(val);
                if (typeof global.removeMarkdownFormatting === 'function') {
                    return global.removeMarkdownFormatting(text);
                }
                return text;
            };

            // ── 渲染表体 ──────────────────────────────────────────────────
            const renderBody = (filteredData) => {
                tbody.innerHTML = '';
                filteredData.forEach(item => {
                    const tr = document.createElement('tr');
                    tr.dataset.rowData = JSON.stringify(item);
                    keys.forEach(key => {
                        const td = document.createElement('td');
                        if (typeof cellFormatter === 'function') {
                            td.textContent = cellFormatter(key, item[key], item);
                        } else {
                            td.textContent = stripMarkdown(item[key]);
                        }
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
            };

            // ── 应用筛选并重渲染 ──────────────────────────────────────────
            const applyAndRender = () => {
                const currentFilters = {};
                filterSelects.forEach(sel => {
                    currentFilters[sel.dataset.key] = sel.value;
                });

                if (storageKey) {
                    try {
                        localStorage.setItem(storageKey, JSON.stringify(currentFilters));
                    } catch (e) { /* 忽略 */ }
                }

                const filtered = data.filter(item =>
                    Object.entries(currentFilters).every(([k, v]) =>
                        !v || String(item[k]) === v
                    )
                );

                renderBody(filtered);

                // 补偿滚动条宽度，保持表头对齐
                const scrollbarW = bodyDiv.offsetWidth - bodyDiv.clientWidth;
                fixedHeader.style.paddingRight = `${scrollbarW}px`;
            };

            // ── 绑定筛选事件 ──────────────────────────────────────────────
            filterSelects.forEach(sel => sel.addEventListener('change', applyAndRender));

            // ── 关闭逻辑 ──────────────────────────────────────────────────
            const cleanup = () => {
                overlay.classList.remove('gtm-visible');
                closeBtn.removeEventListener('click', handleClose);
                overlay.removeEventListener('click', handleOverlayClick);
                bodyDiv.removeEventListener('click', handleRowClick);
                filterSelects.forEach(sel => sel.removeEventListener('change', applyAndRender));
            };

            const handleClose = () => {
                cleanup();
                reject('用户关闭了窗口');
            };

            const handleOverlayClick = (e) => {
                if (e.target === overlay) handleClose();
            };

            // ── 行点击（选中）事件 ────────────────────────────────────────
            const handleRowClick = (e) => {
                const row = e.target.closest('tr');
                if (row && row.dataset.rowData) {
                    const selected = JSON.parse(row.dataset.rowData);
                    cleanup();
                    resolve(selected);
                }
            };

            closeBtn.addEventListener('click', handleClose);
            overlay.addEventListener('click', handleOverlayClick);
            bodyDiv.addEventListener('click', handleRowClick);

            // ── 显示弹窗并初始渲染 ────────────────────────────────────────
            overlay.classList.add('gtm-visible');
            applyAndRender();
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 四、便捷绑定函数：bindTableModalTrigger
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * 将弹窗触发行为绑定到一个 DOM 元素上。
     * 每次点击触发元素时，调用 dataProvider 获取数据并弹出表格。
     *
     * @param {Element|string} trigger      触发元素或其 ID 字符串。
     * @param {Function}       dataProvider () => Object[] | Promise<Object[]>
     *                                      返回数据数组，或返回 Promise 包装的数组。
     * @param {Object}        [config={}]   与 showTableModal 相同的配置对象。
     *                                      config 也可以是 () => Object 的函数，方便动态生成配置。
     * @param {Function}      [onSelect]    (selectedRow) => void  选中行时的回调。
     * @returns {Function}   解绑函数，调用后移除监听器。
     */
    function bindTableModalTrigger(trigger, dataProvider, config, onSelect) {
        const el = (typeof trigger === 'string')
            ? document.getElementById(trigger)
            : trigger;

        if (!el) {
            console.warn('[generic_table_modal] bindTableModalTrigger: 找不到触发元素', trigger);
            return () => {};
        }

        const handler = async () => {
            let data;
            try {
                data = await Promise.resolve(
                    typeof dataProvider === 'function' ? dataProvider() : dataProvider
                );
            } catch (e) {
                console.error('[generic_table_modal] dataProvider 出错:', e);
                return;
            }

            if (!data || !data.length) {
                console.warn('[generic_table_modal] 数据为空，不弹窗。');
                return;
            }

            const resolvedConfig = (typeof config === 'function') ? config() : (config || {});

            showTableModal(data, resolvedConfig)
                .then(selected => {
                    if (typeof onSelect === 'function') onSelect(selected);
                })
                .catch(reason => {
                    // 用户主动关闭，不视为错误，但记录 debug 信息
                    console.debug('[generic_table_modal] 弹窗关闭:', reason);
                });
        };

        el.addEventListener('click', handler);
        return () => el.removeEventListener('click', handler);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // 五、导出到全局
    // ─────────────────────────────────────────────────────────────────────────

    global.showTableModal          = showTableModal;
    global.bindTableModalTrigger   = bindTableModalTrigger;

}(window));
