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

    // 5.5 文本框垂直居中
    _setupFieldAlignment();

    // 6. 页面关闭前自动保存
    window.addEventListener('beforeunload', nmxtSave);

    // 7. 同步初始标题
    nmxtUpdateTitle();

    // 7.5 初始内容加载后重新计算文字垂直居中
    _realignAllFields();

    // 8. 默认开启 Debug 模式（F5 后直接可用测量工具）
    // document.getElementById('nmxt-debug-btn')?.click();
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
            columnMap: { 名称: '道源名称' },
            hiddenColumns: ['法门'],
            filterableColumns: [],
        },
        row => {
            _applyDaoyuan(row);
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
            _syncSkillLevels();
        }
    );

    bindTableModalTrigger(
        'nmxt-gongfa1-btn',
        () => NMXT_GONGFA,
        { title: '选择功法', columnWidths: { 名称: '18%', 效果: '82%' } },
        row => _applyGongfaRow(row, 'Nmxt_功法1')
    );

    bindTableModalTrigger(
        'nmxt-famen-btn',
        () => NMXT_FAMEN,
        { title: '选择法门', columnWidths: { 名称: '14%', 法门效果: '42%', 感悟一名称: '14%', 感悟二名称: '14%', 感悟一效果: '0%', 感悟二效果: '0%' }, hiddenColumns: ['感悟一效果', '感悟二效果'] },
        row => _applyFamenRow(row)
    );

    bindTableModalTrigger(
        'nmxt-yinguo-btn',
        () => NMXT_YINGUO,
        { title: '选择因果值', columnWidths: { 因果值: '12%', 因果效果: '48%', 天赋限制: '40%' } },
        row => _applyYinguoRow(row)
    );

    bindTableModalTrigger(
        'nmxt-dadao-btn',
        () => NMXT_DADAO,
        { title: '选择大道', columnWidths: { 名称: '18%', 效果: '82%' } },
        row => _applySimpleNameEffect(row, 'Nmxt_大道名称', 'Nmxt_大道效果')
    );

    bindTableModalTrigger(
        'nmxt-ganwu1-btn',
        () => _currentFamenInsights(),
        () => ({ title: '选择感悟一', columnWidths: { 名称: '24%', 效果: '76%' } }),
        row => _applySimpleNameEffect(row, 'Nmxt_感悟一名', 'Nmxt_感悟一效')
    );

    bindTableModalTrigger(
        'nmxt-ganwu2-btn',
        () => _currentFamenInsights(),
        () => ({ title: '选择感悟二', columnWidths: { 名称: '24%', 效果: '76%' } }),
        row => _applySimpleNameEffect(row, 'Nmxt_感悟二名', 'Nmxt_感悟二效')
    );

    bindTableModalTrigger(
        'nmxt-xingshen2-btn',
        () => _currentOptionalShentong(),
        () => ({
            title: '选择可选神通',
            filterableColumns: ['道源', '类型'],
            preselectedFilters: _currentDaoyuanFilter(),
            columnWidths: { 道源: '8%', 类型: '10%', 名称: '12%', 灵气: '6%', 点数: '8%', 释放距离: '12%', 目标: '10%', 效果: '34%' },
        }),
        row => _applySkillRow(row, 'Nmxt_行神2')
    );

    bindTableModalTrigger(
        'nmxt-xingshen3-btn',
        () => _currentOptionalShentong(),
        () => ({
            title: '选择可选神通',
            filterableColumns: ['道源', '类型'],
            preselectedFilters: _currentDaoyuanFilter(),
            columnWidths: { 道源: '8%', 类型: '10%', 名称: '12%', 灵气: '6%', 点数: '8%', 释放距离: '12%', 目标: '10%', 效果: '34%' },
        }),
        row => _applySkillRow(row, 'Nmxt_行神3')
    );

    ['1', '2', '3', '4', '5'].forEach(index => {
        bindTableModalTrigger(
            `nmxt-fabao${index}-btn`,
            () => NMXT_FABAO,
            { title: '选择法宝', columnWidths: { 名称: '20%', 属性要求: '18%', 效果: '62%' } },
            row => {
                _set(`Nmxt_法宝${index}名`, row['名称'] || '');
                _set(`Nmxt_法宝${index}属`, row['属性要求'] || '');
                _set(`Nmxt_法宝${index}效`, row['效果'] || '');
            }
        );
    });

    ['1', '2', '3'].forEach(index => {
        bindTableModalTrigger(
            `nmxt-tianfu${index}-btn`,
            () => _availableTianfuOptions(),
            () => ({
                title: `选择天赋天谴 ${index}`,
                columnWidths: { 名称: '22%', 等级: '8%', 类型: '10%', 效果: '60%' },
            }),
            row => _applyTianfuRow(row, index)
        );
    });
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

    document.getElementById('Nmxt_道源')?.addEventListener('change', _syncDaoyuanFromName);
    document.getElementById('Nmxt_道源')?.addEventListener('blur', _syncDaoyuanFromName);
    document.getElementById('Nmxt_法门')?.addEventListener('change', _syncFamenFromName);
    document.getElementById('Nmxt_法门')?.addEventListener('blur', _syncFamenFromName);
    document.getElementById('Nmxt_大道名称')?.addEventListener('change', _syncDadaoFromName);
    document.getElementById('Nmxt_大道名称')?.addEventListener('blur', _syncDadaoFromName);
    document.getElementById('Nmxt_功法1名')?.addEventListener('change', _syncGongfaFromName);
    document.getElementById('Nmxt_功法1名')?.addEventListener('blur', _syncGongfaFromName);
    document.getElementById('Nmxt_因果值')?.addEventListener('change', _syncYinguoFromValue);
    document.getElementById('Nmxt_因果值')?.addEventListener('blur', _syncYinguoFromValue);
    document.getElementById('Nmxt_境界')?.addEventListener('change', _syncSkillLevels);
    document.getElementById('Nmxt_境界')?.addEventListener('blur', _syncSkillLevels);

    ['天赋1', '天赋2', '天赋3'].forEach(prefix => {
        document.getElementById(`Nmxt_${prefix}名`)?.addEventListener('change', _syncTianfuFromNames);
        document.getElementById(`Nmxt_${prefix}名`)?.addEventListener('blur', _syncTianfuFromNames);
    });
}

function _setupFieldAlignment() {
    document.querySelectorAll('.nf-name, .nf-desc').forEach(el => {
        ['input', 'change', 'blur'].forEach(eventName => {
            el.addEventListener(eventName, () => _alignFieldText(el));
        });
    });

    window.addEventListener('resize', _realignAllFields);
    setTimeout(_realignAllFields, 0);
}

function _realignAllFields() {
    document.querySelectorAll('.nf-name, .nf-desc').forEach(_alignFieldText);
}

function _alignFieldText(el) {
    if (!el) return;

    const style = window.getComputedStyle(el);
    const innerHeight = el.clientHeight;
    const basePadX = 4;
    const text = el.value || el.placeholder || '';

    el.style.paddingLeft = `${basePadX}px`;
    el.style.paddingRight = `${basePadX}px`;

    const measure = document.createElement('div');
    measure.style.position = 'absolute';
    measure.style.visibility = 'hidden';
    measure.style.pointerEvents = 'none';
    measure.style.whiteSpace = 'pre-wrap';
    measure.style.wordBreak = 'break-word';
    measure.style.boxSizing = 'border-box';
    measure.style.width = `${el.clientWidth - basePadX * 2}px`;
    measure.style.fontFamily = style.fontFamily;
    measure.style.fontSize = style.fontSize;
    measure.style.fontWeight = style.fontWeight;
    measure.style.lineHeight = style.lineHeight;
    measure.style.letterSpacing = style.letterSpacing;
    measure.style.textAlign = style.textAlign;
    measure.textContent = text || ' ';
    document.body.appendChild(measure);

    const contentHeight = Math.ceil(measure.getBoundingClientRect().height);
    document.body.removeChild(measure);

    const verticalPad = Math.max(0, Math.floor((innerHeight - contentHeight) / 2));
    el.style.paddingTop = `${verticalPad}px`;
    el.style.paddingBottom = `${verticalPad}px`;
}

function _calcAttr() {
    ['仙躯', '身法', '神魂', '灵蕴'].forEach(attr => {
        const base = parseInt(document.getElementById(`Nmxt_${attr}基础`)?.value) || 0;
        const mod  = parseInt(document.getElementById(`Nmxt_${attr}境界`)?.value) || 0;
        const total = document.getElementById(`Nmxt_${attr}总终`);
        if (total) total.value = base + mod;
    });
}

function _applyDaoyuan(row) {
    if (!row) return;

    _set('Nmxt_道源', row['名称'] || '');
    _set('Nmxt_增益', row['增益'] || '');
    _set('Nmxt_道源效果', row['道源效果'] || '');
    _set('Nmxt_天人合一', row['天人合一检定值'] || '');
    _set('Nmxt_法门', row['法门'] || '');
    _set('Nmxt_肉体轻伤', row['肉体轻伤'] || '');
    _set('Nmxt_肉体中伤', row['肉体中伤'] || '');
    _set('Nmxt_肉体重伤', row['肉体重伤'] || '');
    _set('Nmxt_神魂轻伤', row['神魂轻伤'] || '');
    _set('Nmxt_神魂中伤', row['神魂中伤'] || '');
    _set('Nmxt_神魂重伤', row['神魂重伤'] || '');

    _applyDefaultAttack();
    _applySkillRow(_findDaoyuanResource(row['名称'], '初始神通'), 'Nmxt_行神1');
    _applySkillRow(_findDaoyuanResource(row['名称'], '初始秘法'), 'Nmxt_秘法1');
    _syncFamenFromName();
}

function _findDaoyuanByName(name) {
    const normalized = _normalizeDaoyuanName(name);
    return NMXT_DAOYUAN.find(row => _normalizeDaoyuanName(row['名称']) === normalized) || null;
}

function _findDaoyuanResource(daoyuanName, type) {
    const normalized = _normalizeDaoyuanName(daoyuanName);
    return NMXT_DAOYUAN_RESOURCES.find(row => _normalizeDaoyuanName(row['道源']) === normalized && row['类型'] === type) || null;
}

function _normalizeDaoyuanName(name) {
    return (name || '').trim().replace(/^雷(?:-|－).*/, '雷');
}

function _applySkillRow(row, prefix) {
    if (!row) return;

    const shortLevel = _currentShortLevel();

    _set(`${prefix}境`, shortLevel);
    _set(`${prefix}名`, row['名称'] || '');
    _set(`${prefix}气`, row['灵气'] || '');
    _set(`${prefix}点`, row['点数'] || '');
    _set(`${prefix}距`, row['释放距离'] || '');
    _set(`${prefix}标`, row['目标'] || '');
    _set(`${prefix}效`, row['效果'] || '');
}

function _applyDefaultAttack() {
    _set('Nmxt_通动1名', '普攻');
    _set('Nmxt_通动1境', '');
    _set('Nmxt_通动1气', '0');
    _set('Nmxt_通动1点', '◉');
    _set('Nmxt_通动1距', '2（近）');
    _set('Nmxt_通动1标', '1名');
    _set('Nmxt_通动1效', '造成【核心属性】伤害');
}

function _currentShortLevel() {
    const levelText = document.getElementById('Nmxt_境界')?.value?.trim() || '炼气';
    return levelText.split(/一|二|三|四|五|六|七|八|九|十|初期|中期|后期/)[0] || levelText;
}

function _syncSkillLevels() {
    const shortLevel = _currentShortLevel();
    ['Nmxt_功法1境', 'Nmxt_行神1境', 'Nmxt_行神2境', 'Nmxt_行神3境', 'Nmxt_秘法1境'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = shortLevel;
    });
}

function _applySimpleNameEffect(row, nameId, effectId) {
    if (!row) return;
    _set(nameId, row['名称'] || '');
    _set(effectId, row['效果'] || '');
}

function _applyTianfuRow(row, index) {
    if (!row) return;
    const label = [row['名称'], row['等级'] ? `（${row['等级']}${row['类型'] || ''}）` : ''].join('');
    _set(`Nmxt_天赋${index}名`, label);
    _set(`Nmxt_天赋${index}效`, row['效果'] || '');
}

function _applyFamenRow(row) {
    if (!row) return;

    _set('Nmxt_法门', row['名称'] || '');
    _set('Nmxt_法门效果', row['法门效果'] || '');
    _set('Nmxt_感悟一名', row['感悟一名称'] || '');
    _set('Nmxt_感悟一效', row['感悟一效果'] || '');
    _set('Nmxt_感悟二名', row['感悟二名称'] || '');
    _set('Nmxt_感悟二效', row['感悟二效果'] || '');
}

function _applyYinguoRow(row) {
    if (!row) return;

    _set('Nmxt_因果值', row['因果值'] || '');
    const text = [row['因果效果'], row['天赋限制']].filter(Boolean).join('\n');
    _set('Nmxt_因果值效果', text);
}

function _applyGongfaRow(row, prefix) {
    if (!row) return;
    _set(`${prefix}境`, _currentShortLevel());
    _set(`${prefix}名`, row['名称'] || '');
    _set(`${prefix}效`, row['效果'] || '');
}

function _currentOptionalShentong() {
    return NMXT_DAOYUAN_RESOURCES.filter(row => row['类型'] === '可选神通');
}

function _currentDaoyuanFilter() {
    const name = document.getElementById('Nmxt_道源')?.value?.trim();
    const normalized = _normalizeDaoyuanName(name);
    return normalized ? { 道源: normalized, 类型: '可选神通' } : { 类型: '可选神通' };
}

function _currentFamenInsights() {
    const famenName = document.getElementById('Nmxt_法门')?.value?.trim();
    const famen = NMXT_FAMEN.find(item => item['名称'] === famenName);
    if (!famen) {
        return [
            { 名称: '（待先选择法门）', 效果: '当前没有可选感悟，请先填写或选择法门。' },
        ];
    }

    return [
        { 名称: famen['感悟一名称'] || '', 效果: famen['感悟一效果'] || '' },
        { 名称: famen['感悟二名称'] || '', 效果: famen['感悟二效果'] || '' },
    ].filter(item => item['名称']);
}

function _availableTianfuOptions() {
    return NMXT_TIANFU;
}

function _currentYinguoRule() {
    const value = (document.getElementById('Nmxt_因果值')?.value || '').trim();
    return NMXT_YINGUO.find(item => item['因果值'] === value) || null;
}

function _parseTianfuPlans(limitText) {
    const text = (limitText || '').trim();
    if (!text) return [];

    return text.split('/').map(part => part.trim()).filter(Boolean).map(part => {
        if (part === '对应天谴') {
            return [{ 等级: '对应', 类型: '天谴' }];
        }

        return part.split('+').map(item => item.trim()).filter(Boolean).map(token => {
            if (token === '对应天谴') {
                return { 等级: '对应', 类型: '天谴' };
            }
            return {
                等级: token.replace(/^两/, ''),
                数量: token.startsWith('两') ? 2 : 1,
                类型: token.includes('天谴') ? '天谴' : '天赋',
            };
        }).flatMap(rule => {
            if (rule.等级 === '对应') return [rule];
            return Array.from({ length: rule.数量 }, () => ({ 等级: rule.等级, 类型: rule.类型 }));
        });
    });
}

function _findTianfuByLabel(label) {
    if (!label) return null;
    const match = label.match(/^(.*?)(?:（([天地人凡])(天赋|天谴)）)?$/);
    if (!match) return null;
    const name = (match[1] || '').trim();
    const level = match[2] || '';
    const type = match[3] || '';
    return NMXT_TIANFU.find(item => item['名称'] === name && (!level || item['等级'] === level) && (!type || item['类型'] === type)) || null;
}

function _syncDaoyuanFromName() {
    const row = _findDaoyuanByName(document.getElementById('Nmxt_道源')?.value);
    if (row) _applyDaoyuan(row);
}

function _syncFamenFromName() {
    const name = document.getElementById('Nmxt_法门')?.value?.trim();
    const row = NMXT_FAMEN.find(item => item['名称'] === name);
    if (!row) return;

    _applyFamenRow(row);
}

function _syncDadaoFromName() {
    const name = document.getElementById('Nmxt_大道名称')?.value?.trim();
    const row = NMXT_DADAO.find(item => item['名称'] === name);
    if (row) _set('Nmxt_大道效果', row['效果'] || '');
}

function _syncGongfaFromName() {
    const name = document.getElementById('Nmxt_功法1名')?.value?.trim();
    const row = NMXT_GONGFA.find(item => item['名称'] === name);
    if (row) _set('Nmxt_功法1效', row['效果'] || '');
}

function _syncYinguoFromValue() {
    const row = _currentYinguoRule();
    if (!row) return;

    _applyYinguoRow(row);
}

function _syncTianfuFromNames() {
    ['天赋1', '天赋2', '天赋3'].forEach(prefix => {
        const name = document.getElementById(`Nmxt_${prefix}名`)?.value?.trim();
        const row = _findTianfuByLabel(name) || NMXT_TIANFU.find(item => item['名称'] === name);
        if (row) {
            _set(`Nmxt_${prefix}效`, row['效果'] || '');
            const currentLabel = document.getElementById(`Nmxt_${prefix}名`)?.value?.trim();
            if (currentLabel === row['名称']) {
                _applyTianfuRow(row, prefix.replace('天赋', ''));
            }
        }
    });
}

// ────────────────────────────────────────────────────────
// 工具函数
// ────────────────────────────────────────────────────────
function _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
}
