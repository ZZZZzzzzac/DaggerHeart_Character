/**
 * nmxt_action.js — 逆命仙途 操作按钮逻辑
 * 参照 DaggerHeart 的 action.js，但完全独立、只操作 nmxt 的DOM
 */

// ─── localStorage key ────────────────────────────────────
const NMXT_STORAGE_KEY = 'nmxt_characterSheetData';

// ─── 导出表单状态 ────────────────────────────────────────
function nmxtExportState() {
    const state = {};

    // 文本框
    document.querySelectorAll('.nf[id]').forEach(el => {
        state[el.id] = el.value;
    });

    // Checkbox（读 data-state）
    document.querySelectorAll('.nmxt-cb[id]').forEach(el => {
        state[el.id] = el.dataset.state || '0';
    });

    // 立绘图片（Base64）
    const avatarImg = document.getElementById('nmxt-avatar-image');
    if (avatarImg && avatarImg.src && avatarImg.style.display !== 'none') {
        state.__avatarSrc = avatarImg.src;
    }

    return state;
}

// ─── 导入表单状态 ────────────────────────────────────────
function nmxtImportState(state) {
    for (const id in state) {
        if (!Object.hasOwnProperty.call(state, id)) continue;
        if (id === '__avatarSrc') continue; // 单独处理
        const val = state[id];

        const textEl = document.getElementById(id);
        if (textEl && textEl.classList.contains('nf')) {
            textEl.value = val;
        }

        const cbEl = document.getElementById(id);
        if (cbEl && cbEl.classList.contains('nmxt-cb')) {
            if (cbEl._cbInstance) {
                cbEl._cbInstance.setState(val);
            } else {
                cbEl.dataset.state = val;
                _applyCbVisual(cbEl);
            }
        }
    }

    // 立绘
    if (state.__avatarSrc) {
        _nmxtSetAvatar(state.__avatarSrc);
    } else {
        _nmxtClearAvatar();
    }

    nmxtUpdateTitle();
}

// ─── 保存到 localStorage ─────────────────────────────────
function nmxtSave() {
    localStorage.setItem(NMXT_STORAGE_KEY, JSON.stringify(nmxtExportState()));
}

// ─── 从 localStorage 加载 ────────────────────────────────
function nmxtLoad() {
    const raw = localStorage.getItem(NMXT_STORAGE_KEY);
    if (!raw) return;
    try { nmxtImportState(JSON.parse(raw)); } catch(e) { console.error('nmxt load error', e); }
}

// ─── 清空表单 ─────────────────────────────────────────────
function nmxtClear() {
    document.querySelectorAll('.nf[id]').forEach(el => { el.value = ''; });
    document.querySelectorAll('.nmxt-cb[id]').forEach(el => {
        if (el._cbInstance) el._cbInstance.setState(0);
        else { el.dataset.state = '0'; _applyCbVisual(el); }
    });
    _nmxtClearAvatar();
    localStorage.removeItem(NMXT_STORAGE_KEY);
    nmxtUpdateTitle();
}

// ─── 导出 JSON 文件 ──────────────────────────────────────
function nmxtExportJSON() {
    const state = nmxtExportState();
    const name  = document.getElementById('Nmxt_角色名')?.value?.trim() || '角色';
    const blob  = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url   = URL.createObjectURL(blob);
    const a     = document.createElement('a');
    a.href = url;
    a.download = `${name}_逆命仙途人物卡.json`;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ─── 导入 JSON 文件 ──────────────────────────────────────
function nmxtImportJSON() {
    document.getElementById('nmxt-json-upload').click();
}

// ─── 打印 ─────────────────────────────────────────────────
function nmxtPrint() { window.print(); }

// ─── 更新页面标题 ─────────────────────────────────────────
function nmxtUpdateTitle() {
    const name = document.getElementById('Nmxt_角色名')?.value?.trim();
    document.title = name ? `${name} — 逆命仙途人物卡` : '逆命仙途 角色卡';
}

// ─── 辅助：直接应用 data-state 到视觉（无 instance 时） ──
function _applyCbVisual(el) {
    const s = parseInt(el.dataset.state) || 0;
    el.classList.remove('state-checked', 'state-dashed');
    if (s === 1) el.classList.add('state-checked');
    else if (s === 2) el.classList.add('state-dashed');
}

// ─── 初始化操作按钮 ──────────────────────────────────────
function nmxtSetupActions() {
    // 导出
    document.getElementById('nmxt-export-btn')?.addEventListener('click', nmxtExportJSON);

    // 导入
    document.getElementById('nmxt-import-btn')?.addEventListener('click', nmxtImportJSON);
    document.getElementById('nmxt-json-upload')?.addEventListener('change', e => {
        const file = e.target.files[0]; if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                nmxtImportState(JSON.parse(ev.target.result));
                nmxtSave();
                alert('导入成功！');
            } catch(err) { alert('导入失败，请检查文件格式。'); }
        };
        reader.readAsText(file);
        e.target.value = '';
    });

    // 清空
    document.getElementById('nmxt-clear-btn')?.addEventListener('click', () => {
        if (confirm('确定清空所有数据？此操作无法撤销。')) nmxtClear();
    });

    // 打印
    document.getElementById('nmxt-print-btn')?.addEventListener('click', nmxtPrint);

    // Debug 开关
    const debugBtn = document.getElementById('nmxt-debug-btn');
    debugBtn?.addEventListener('click', () => {
        const sheet = document.getElementById('character-sheet');
        const isDebug = sheet.classList.toggle('debug-mode');
        debugBtn.classList.toggle('active', isDebug);
        debugBtn.textContent = isDebug ? '🔴 DEBUG ON' : '🔵 DEBUG';
        if (isDebug) { _injectDebugLabels(); _startMouseTracker(); }
        else          { _removeDebugLabels(); _stopMouseTracker();  }
    });

    // 宽度控制（保留手动调节功能）
    document.getElementById('nmxt-width-input')?.addEventListener('input', e => {
        const w = parseInt(e.target.value) || 960;
        document.documentElement.style.setProperty('--sheet-width', w + 'px');
        _nmxtAutoScale();
    });

    // 角色名同步标题
    document.getElementById('Nmxt_角色名')?.addEventListener('blur', nmxtUpdateTitle);

    // 立绘上传
    _nmxtSetupAvatar();

    // 自动缩放监听
    _nmxtAutoScale();
    window.addEventListener('resize', _nmxtAutoScale);
}

// ─── 立绘上传 / 显示 / 清除 ──────────────────────────────
function _nmxtSetAvatar(src) {
    const img  = document.getElementById('nmxt-avatar-image');
    const ph   = document.getElementById('nmxt-avatar-placeholder');
    const rmBtn= document.getElementById('nmxt-avatar-remove-btn');
    if (!img) return;
    img.src = src;
    img.style.display = 'block';
    if (ph)    ph.style.display    = 'none';
    if (rmBtn) rmBtn.style.display = 'block';
}

function _nmxtClearAvatar() {
    const img  = document.getElementById('nmxt-avatar-image');
    const ph   = document.getElementById('nmxt-avatar-placeholder');
    const rmBtn= document.getElementById('nmxt-avatar-remove-btn');
    if (!img) return;
    img.src = '';
    img.style.display = 'none';
    if (ph)    ph.style.display    = 'flex';
    if (rmBtn) rmBtn.style.display = 'none';
}

function _nmxtSetupAvatar() {
    const container = document.getElementById('nmxt-avatar-container');
    const fileInput = document.getElementById('nmxt-avatar-upload');
    const rmBtn     = document.getElementById('nmxt-avatar-remove-btn');

    // 点击容器 → 触发文件选择
    container?.addEventListener('click', (e) => {
        if (e.target === rmBtn) return; // 不拦截删除按钮
        fileInput?.click();
    });

    // 文件选择后读取为 Base64
    fileInput?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            _nmxtSetAvatar(ev.target.result);
            nmxtSave();
        };
        reader.readAsDataURL(file);
        e.target.value = ''; // 允许重复选同一文件
    });

    // 删除按钮
    rmBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        _nmxtClearAvatar();
        nmxtSave();
    });
}

// ─── 自动缩放（transform:scale）─────────────────────────
// 将整个 #character-sheet 缩放到窗口可用宽度，坐标完全不用改。
// 手机端横屏时也能完整显示。
function _nmxtAutoScale() {
    const sheet = document.getElementById('character-sheet');
    if (!sheet) return;

    // 当前设计宽度（CSS变量 or 输入框值 or 默认960）
    const designWidth = parseFloat(
        getComputedStyle(document.documentElement)
            .getPropertyValue('--sheet-width')
    ) || parseInt(document.getElementById('nmxt-width-input')?.value) || 960;

    const availW = window.innerWidth;
    const scale  = Math.min(1, availW / designWidth); // 只缩小，不放大

    sheet.style.transformOrigin = 'top left';
    sheet.style.transform       = `scale(${scale})`;
    // 调整外层高度，避免缩放后产生空白
    sheet.style.marginBottom    = `-${sheet.scrollHeight * (1 - scale)}px`;
}

// ─── Debug 标签注入 ──────────────────────────────────────
function _injectDebugLabels() {
    _removeDebugLabels();
    // 给所有 .nf 和 .nmxt-cb 注入相对于 page-container 的位置标签
    document.querySelectorAll('.page-container').forEach(page => {
        const pageRect = page.getBoundingClientRect();
        [...page.querySelectorAll('.nf[id], .nmxt-cb[id], .cb-row')].forEach(el => {
            const r = el.getBoundingClientRect();
            const t = Math.round(r.top  - pageRect.top  + page.scrollTop);
            const l = Math.round(r.left - pageRect.left + page.scrollLeft);
            const w = Math.round(r.width);
            const h = Math.round(r.height);
            const lbl = document.createElement('span');
            lbl.className = 'dbg-label';
            lbl.textContent = `${el.id||'row'} t:${t} l:${l} w:${w} h:${h}`;
            lbl.style.top  = (t) + 'px';
            lbl.style.left = l + 'px';
            page.appendChild(lbl);
        });
    });
}

function _removeDebugLabels() {
    document.querySelectorAll('.dbg-label').forEach(el => el.remove());
}

// ─── 两点点击测量工具 ────────────────────────────────────
// 用法：Debug模式下，在页面上点击左上角，再点击右下角，
//       自动计算并复制 top/left/width/height 到剪贴板。

let _mouseTrackerEl = null;  // 右上角信息面板
let _rubberbandEl   = null;  // 半透明橡皮框预览
let _mouseMoveHn    = null;  // mousemove handler
let _clickHn        = null;  // click handler

let _pt1 = null;  // 第一次点击的 {cx, cy, pageEl}
let _curPt = null; // 当前鼠标位置

function _startMouseTracker() {
    _pt1 = null;
    _curPt = null;

    // ── 信息面板 ──────────────────────────────────────
    _mouseTrackerEl = document.createElement('div');
    _mouseTrackerEl.id = 'nmxt-mouse-tracker';
    Object.assign(_mouseTrackerEl.style, {
        position: 'fixed', top: '8px', right: '8px',
        background: 'rgba(0,0,0,0.88)',
        color: '#0f0', fontFamily: 'monospace', fontSize: '13px',
        padding: '8px 12px', borderRadius: '6px',
        zIndex: '99999', pointerEvents: 'none',
        lineHeight: '1.7', userSelect: 'none',
        border: '1px solid #0a0', minWidth: '230px',
    });
    document.body.appendChild(_mouseTrackerEl);
    _updatePanel('waiting');

    // ── 橡皮框 ───────────────────────────────────────
    _rubberbandEl = document.createElement('div');
    _rubberbandEl.id = 'nmxt-rubberband';
    Object.assign(_rubberbandEl.style, {
        position: 'absolute', display: 'none',
        border: '2px dashed #f00',
        background: 'rgba(255,0,0,0.08)',
        pointerEvents: 'none', zIndex: '99998',
        boxSizing: 'border-box',
    });
    document.body.appendChild(_rubberbandEl);

    // ── mousemove ────────────────────────────────────
    _mouseMoveHn = (e) => {
        const hit = _hitPage(e);
        if (!hit) { _updatePanel('outside'); _hideRubberband(); return; }
        _curPt = hit;
        _updatePanel(_pt1 ? 'second' : 'first', hit);
        if (_pt1 && _pt1.pageEl === hit.pageEl) _drawRubberband(_pt1, hit);
        else _hideRubberband();
    };

    // ── click（阻止冒泡，防止误触发输入框等） ────────
    _clickHn = (e) => {
        const hit = _hitPage(e);
        if (!hit) return;

        if (!_pt1) {
            // 第一次点击
            _pt1 = hit;
            _updatePanel('second', hit);
        } else {
            if (_pt1.pageEl !== hit.pageEl) {
                // 跨页，重置
                _pt1 = hit;
                _updatePanel('second', hit);
                return;
            }
            // 第二次点击 → 计算结果
            const x1 = Math.min(_pt1.cx, hit.cx);
            const y1 = Math.min(_pt1.cy, hit.cy);
            const x2 = Math.max(_pt1.cx, hit.cx);
            const y2 = Math.max(_pt1.cy, hit.cy);
            const w  = x2 - x1, h = y2 - y1;
            const result = `top:${y1}px;left:${x1}px;width:${w}px;height:${h}px;`;

            // 复制到剪贴板
            navigator.clipboard?.writeText(result).catch(() => {});

            _updatePanel('done', null, result);
            _hideRubberband();
            _pt1 = null;  // 重置，可以继续测下一个
        }
    };

    // 在 capture 阶段捕获点击，避免被子元素吞掉
    document.addEventListener('mousemove', _mouseMoveHn);
    document.addEventListener('click',     _clickHn, true);
}

function _stopMouseTracker() {
    if (_mouseTrackerEl) { _mouseTrackerEl.remove(); _mouseTrackerEl = null; }
    if (_rubberbandEl)   { _rubberbandEl.remove();   _rubberbandEl   = null; }
    if (_mouseMoveHn)    { document.removeEventListener('mousemove', _mouseMoveHn); _mouseMoveHn = null; }
    if (_clickHn)        { document.removeEventListener('click',     _clickHn, true); _clickHn = null; }
    _pt1 = null; _curPt = null;
}

// 找鼠标命中的 page-container，返回 { pageEl, pageIdx, cx, cy, _r }
// cx/cy 是相对于 page-container 左上角的坐标（与 style="top/left" 对应）
function _hitPage(e) {
    let result = null;
    document.querySelectorAll('.page-container').forEach((p, i) => {
        const r = p.getBoundingClientRect();
        if (e.clientX >= r.left && e.clientX <= r.right &&
            e.clientY >= r.top  && e.clientY <= r.bottom) {
            result = {
                pageEl:  p,
                pageIdx: i + 1,
                // pageX/Y 是相对文档的坐标，r.top/left + scrollY/X 是容器相对文档的位置
                cx: Math.round(e.pageX - (r.left + window.scrollX)),
                cy: Math.round(e.pageY - (r.top  + window.scrollY)),
                _r: r,
            };
        }
    });
    return result;
}

// 更新面板文字
function _updatePanel(state, pt, result) {
    if (!_mouseTrackerEl) return;
    const coords = pt ? `x:<b>${pt.cx}</b> y:<b>${pt.cy}</b>` : '';
    const pageLabel = pt ? `📄 第${pt.pageIdx}页 ` : '';
    switch(state) {
        case 'waiting':
            _mouseTrackerEl.innerHTML =
                `<span style="color:#ff0">● 点击左上角</span> 开始测量<br><small style="color:#888">ESC 重置</small>`;
            break;
        case 'outside':
            _mouseTrackerEl.innerHTML =
                `<span style="color:#888">鼠标不在页面上</span>`;
            break;
        case 'first':
            _mouseTrackerEl.innerHTML =
                `${pageLabel}${coords}<br>` +
                `<span style="color:#ff0">● 点击左上角</span>`;
            break;
        case 'second':
            _mouseTrackerEl.innerHTML =
                `${pageLabel}${coords}<br>` +
                `<span style="color:#0ff">✔ 左上角已记录</span><br>` +
                `<span style="color:#ff0">● 点击右下角</span>`;
            break;
        case 'done':
            _mouseTrackerEl.innerHTML =
                `<span style="color:#0f0">✔ 已复制到剪贴板！</span><br>` +
                `<span style="color:#fff;word-break:break-all;">${result}</span><br>` +
                `<span style="color:#ff0">● 继续：点击左上角</span>`;
            break;
    }
}

// 绘制橡皮框（基于 viewport 坐标）
function _drawRubberband(pt1, pt2) {
    if (!_rubberbandEl) return;
    const r1 = pt1._r || pt1.pageEl.getBoundingClientRect();
    const x1v = r1.left + pt1.cx;
    const y1v = r1.top  + pt1.cy;
    const x2v = r1.left + pt2.cx;
    const y2v = r1.top  + pt2.cy;

    const left   = Math.min(x1v, x2v) + window.scrollX;
    const top    = Math.min(y1v, y2v) + window.scrollY;
    const width  = Math.abs(x2v - x1v);
    const height = Math.abs(y2v - y1v);

    Object.assign(_rubberbandEl.style, {
        display: 'block',
        left:    left  + 'px',
        top:     top   + 'px',
        width:   width + 'px',
        height:  height + 'px',
    });
}

function _hideRubberband() {
    if (_rubberbandEl) _rubberbandEl.style.display = 'none';
}
