/**
 * nmxt_script.js — 逆命仙途 初始化 & 联动逻辑
 *
 * 坐标系说明：
 *   底图 PNG 尺寸：1654 × 2339 px
 *   默认渲染宽度：960 px（可通过宽度控制调整）
 *   比例因子：960 / 1654 ≈ 0.5806
 *   换算：CSS_px = PNG_px × (渲染宽度 / 1654)
 *
 * Debug 模式：点击「DEBUG」按钮后，所有输入框变红色并显示
 *             CSS 坐标（top / left / width / height），方便精确调位。
 */

'use strict';

// ────────────────────────────────────────────────────────
// 初始化入口
// ────────────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {

    // 1. 初始化所有 TriStateCheckbox
    document.querySelectorAll('.nmxt-cb').forEach(el => {
        el._cbInstance = new TriStateCheckbox(el);
    });

    // 2. 从 localStorage 加载存档
    nmxtLoad();

    // 3. 绑定操作按钮
    nmxtSetupActions();

    // 4. 绑定表格弹窗触发按钮（道源、境界、出身等）
    _bindTableTriggers();

    // 5. 绑定联动逻辑
    _bindLinkages();

    // 6. 页面关闭前自动保存
    window.addEventListener('beforeunload', nmxtSave);

    // 7. 同步初始标题
    nmxtUpdateTitle();

    // 8. 默认开启 Debug 模式（F5 后直接可用测量工具）
    document.getElementById('nmxt-debug-btn')?.click();
});

// ────────────────────────────────────────────────────────
// 弹窗触发绑定
// ────────────────────────────────────────────────────────
function _bindTableTriggers() {

    // —— 道源选择 ——
    bindTableModalTrigger(
        'nmxt-daoyuan-btn',
        () => NMXT_DAOYUAN,
        {
            title: '选择道源',
            columnMap: { 名称: '道源名称', 追源效果: '追源效果' },
            hiddenColumns: ['增益', '天人合一检定值', '法门'],
            filterableColumns: [],
        },
        row => {
            _set('Nmxt_道源',       row['名称']         || '');
            _set('Nmxt_增益',       row['增益']          || '');
            _set('Nmxt_追源效果',   row['追源效果']      || '');
            _set('Nmxt_天人合一',   row['天人合一检定值'] || '');
            _set('Nmxt_法门',       row['法门']          || '');
        }
    );

    // —— 出身选择 ——
    bindTableModalTrigger(
        'nmxt-chushen-btn',
        () => NMXT_CHUSHEN,
        { title: '选择出身', columnMap: { 名称: '出身', 出身效果: '效果说明' } },
        row => {
            _set('Nmxt_出身',     row['名称']   || '');
            _set('Nmxt_出身效果', row['出身效果'] || '');
        }
    );

    // —— 境界选择 ——
    bindTableModalTrigger(
        'nmxt-jingjie-btn',
        () => NMXT_JINGJIE,
        { title: '选择境界' },
        row => {
            _set('Nmxt_境界',   row['境界']   || '');
            _set('Nmxt_境界乘值', row['境界乘值'] || '');
            // 属性境界加值自动填入
            _set('Nmxt_仙躯境界', row['仙躯加值'] ?? '');
            _set('Nmxt_身法境界', row['身法加值'] ?? '');
            _set('Nmxt_神魂境界', row['神魂加值'] ?? '');
            _set('Nmxt_灵蕴境界', row['灵蕴加值'] ?? '');
            _calcAttr();
        }
    );
}

// ────────────────────────────────────────────────────────
// 联动逻辑
// ────────────────────────────────────────────────────────
function _bindLinkages() {
    // 属性基础值 / 境界加值 → 自动计算总终值
    ['仙躯', '身法', '神魂', '灵蕴'].forEach(attr => {
        document.getElementById(`Nmxt_${attr}基础`)?.addEventListener('input', _calcAttr);
        document.getElementById(`Nmxt_${attr}境界`)?.addEventListener('input', _calcAttr);
    });
}

function _calcAttr() {
    ['仙躯', '身法', '神魂', '灵蕴'].forEach(attr => {
        const base = parseInt(document.getElementById(`Nmxt_${attr}基础`)?.value) || 0;
        const mod  = parseInt(document.getElementById(`Nmxt_${attr}境界`)?.value) || 0;
        const total = document.getElementById(`Nmxt_${attr}总终`);
        if (total) total.value = base + mod;
    });
}

// ────────────────────────────────────────────────────────
// 工具函数
// ────────────────────────────────────────────────────────
function _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}
