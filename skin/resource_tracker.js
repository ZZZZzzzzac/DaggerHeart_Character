/**
 * ============================================================
 * DaggerHeart 资源追踪器模块 (Resource Tracker)
 * skin/resource_tracker.js  —  v1.0
 * ============================================================
 *
 * 【给皮肤作者的说明】
 * 本模块提供标准化的四种角色资源管理（生命/压力/护甲/希望）。
 *
 * 引入方式（在皮肤 index.html 中，放在 skin_api.js 之后、script.js 之前）：
 *   <script src="../resource_tracker.js"></script>
 *
 * ── API ────────────────────────────────────────────────────
 *
 * 1. 解析初始资源值：
 *   const resources = DH.parseResources(jsonData);
 *   // 返回: { hp, stress, armor, hope }
 *   // 每项格式: { current: number, max: number }
 *
 * 2. 创建资源控件（自动在容器内构建加减按钮 + 展示区）：
 *   const tracker = new DH.ResourceWidget({
 *     container: document.getElementById('my-container'),
 *     resources: resources,
 *     onUpdate: (key, current, max) => {
 *       // key: 'hp' | 'stress' | 'armor' | 'hope'
 *       // 在此更新皮肤自定义的 UI（emoji、进度条、数字等均可）
 *     }
 *   });
 *
 * ── 数据说明 ────────────────────────────────────────────────
 * 上限计算规则（checkbox 状态: 0=空, 1=满, 2=不可用）：
 *   上限 = 状态为 '0' 或 '1' 的格子数量
 *   当前值 = 状态为 '1' 的格子数量
 *   护甲槽上限优先使用 ArmorTextbox 字段
 * ============================================================
 */

window.DH = window.DH || {};

(function (DH) {
    'use strict';

    // ── 工具：统计 checkbox 字段 ─────────────────────────────

    function countBoxes(jsonData, prefix, total, states) {
        let n = 0;
        for (let i = 1; i <= total; i++) {
            if (states.includes(jsonData[`${prefix}${i}`])) n++;
        }
        return n;
    }

    // ── 公共 API ─────────────────────────────────────────────

    /**
     * 从 jsonData 解析四种资源的当前值和上限。
     * @param {object} jsonData
     * @returns {{ hp, stress, armor, hope }}
     */
    DH.parseResources = function (jsonData) {
        // 生命点
        const hpMax     = countBoxes(jsonData, 'HpSlotCheckbox',     12, ['0', '1']);
        const hpCur     = countBoxes(jsonData, 'HpSlotCheckbox',     12, ['1']);

        // 压力点
        const stressMax = countBoxes(jsonData, 'StressSlotCheckbox', 12, ['0', '1']);
        const stressCur = countBoxes(jsonData, 'StressSlotCheckbox', 12, ['1']);

        // 护甲槽：优先用 ArmorTextbox 数值
        let armorMax = parseInt(jsonData.ArmorTextbox, 10);
        if (isNaN(armorMax) || armorMax <= 0) {
            armorMax = countBoxes(jsonData, 'ArmorSlotCheckbox', 12, ['0', '1']);
        }
        const armorCur  = countBoxes(jsonData, 'ArmorSlotCheckbox',  12, ['1']);

        // 希望点
        const hopeMax   = countBoxes(jsonData, 'HopeSlotCheckbox',   6,  ['0', '1']);
        const hopeCur   = countBoxes(jsonData, 'HopeSlotCheckbox',   6,  ['1']);

        return {
            hp:     { current: hpCur,     max: hpMax },
            stress: { current: stressCur, max: stressMax },
            armor:  { current: armorCur,  max: armorMax },
            hope:   { current: hopeCur,   max: hopeMax }
        };
    };

    /**
     * 资源控件类：管理四种资源的当前值，渲染加减按钮，
     * 通过 onUpdate 回调通知皮肤更新自定义 UI。
     */
    DH.ResourceWidget = class {
        constructor ({ container, resources, onUpdate }) {
            this._state    = {};
            this._onUpdate = onUpdate || (() => {});

            const KEYS = ['hp', 'stress', 'armor', 'hope'];
            KEYS.forEach(key => {
                const r = resources[key] || { current: 0, max: 0 };
                this._state[key] = {
                    current: Math.max(0, Math.min(r.current, r.max)),
                    max:     Math.max(0, r.max)
                };
            });

            this._buildUI(container);
        }

        /** 获取某资源的当前状态 { current, max } */
        get (key) { return { ...this._state[key] }; }

        /** 手动设置某资源的当前值（会自动 clamp 并触发 onUpdate） */
        set (key, value) {
            if (!this._state[key]) return;
            this._state[key].current = this._clamp(key, value);
            this._notifyAndRefreshCount(key);
        }

        increment (key) { this.set(key, (this._state[key]?.current ?? 0) + 1); }
        decrement (key) { this.set(key, (this._state[key]?.current ?? 0) - 1); }

        _clamp (key, val) {
            return Math.max(0, Math.min(val, this._state[key].max));
        }

        _notifyAndRefreshCount (key) {
            const s = this._state[key];
            // 更新控件内置的数字显示
            const countEl = this._container?.querySelector(`[data-dh-count="${key}"]`);
            if (countEl) countEl.textContent = s.current;
            // 通知皮肤
            this._onUpdate(key, s.current, s.max);
        }

        _buildUI (container) {
            if (!container) return;
            this._container = container;
            container.innerHTML = '';
            container.classList.add('dh-resource-widget');

            const LABELS = { hp: '生命', stress: '压力', armor: '护甲', hope: '希望' };
            const KEYS   = ['hp', 'stress', 'armor', 'hope'];

            KEYS.forEach(key => {
                if (!this._state[key]) return;
                const s = this._state[key];

                const row = document.createElement('div');
                row.className = 'dh-row';
                row.dataset.dhResource = key;

                // 标签
                const label = document.createElement('span');
                label.className    = 'dh-label';
                label.textContent  = LABELS[key];

                // 减号
                const minus = document.createElement('button');
                minus.className   = 'dh-btn dh-minus';
                minus.textContent = '▼';
                minus.addEventListener('click', () => this.decrement(key));

                // 当前数量
                const countEl = document.createElement('span');
                countEl.className = 'dh-count';
                countEl.dataset.dhCount = key;
                countEl.textContent = s.current;

                // 加号
                const plus = document.createElement('button');
                plus.className    = 'dh-btn dh-plus';
                plus.textContent  = '▲';
                plus.addEventListener('click', () => this.increment(key));

                // 皮肤的自定义展示区域
                const display = document.createElement('div');
                display.className      = 'dh-display';
                display.dataset.dhDisplay = key;

                row.appendChild(label);
                row.appendChild(minus);
                row.appendChild(countEl);
                row.appendChild(plus);
                row.appendChild(display);
                container.appendChild(row);
            });

            // 初次全量渲染
            KEYS.forEach(key => {
                const s = this._state[key];
                this._onUpdate(key, s.current, s.max);
            });
        }
    };

})(window.DH);
