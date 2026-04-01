/**
 * 超英派遣中心 - script.js
 * 实现 window.renderSkin(jsonData)，由 skin_api.js 自动调用。
 * 依赖：Chart.js, ../resource_tracker.js (DH.ResourceWidget)
 */

// ── 雷达图初始化 ──────────────────────────────────────────────
const ctx = document.getElementById('radarChart').getContext('2d');

// 六维属性实际范围 -1 ~ 8，绘图范围设为 -2 ~ 6，视觉上更平衡
const RADAR_MIN = -2;
const RADAR_MAX = 6;

// 对应 labels 顺序: AGI STR DEX INS PRE KNO
// 敏捻 力量 灵巧 本能 风度 知识
const RADAR_EMOJIS = ['🏃', '💪', '🤚', '👀', '💬', '💡'];

/**
 * 自定义插件：在每个六边形顶点上绘制深色圆背景 + emoji。
 * 比 CSS 定位更精准，始终与图表顶点对齐。
 */
const radarIconPlugin = {
    id: 'radarIconBg',
    afterDraw(chart) {
        const r   = chart.scales.r;
        const ctx = chart.ctx;
        const ICON_R = 16;   // 圆圈半径
        const OFFSET = ICON_R + 6; // 顶点外圈偏移

        RADAR_EMOJIS.forEach((emoji, i) => {
            const angle = r.getIndexAngle(i) - Math.PI / 2;
            const dist  = r.drawingArea + OFFSET;
            const x = r.xCenter + Math.cos(angle) * dist;
            const y = r.yCenter + Math.sin(angle) * dist;

            ctx.save();
            // 深色圆背景
            ctx.beginPath();
            ctx.arc(x, y, ICON_R, 0, Math.PI * 2);
            ctx.fillStyle   = '#55534c';
            ctx.fill();
            ctx.strokeStyle = '#e6dfcd';
            ctx.lineWidth   = 2;
            ctx.stroke();

            // emoji 文字
            ctx.font         = '15px sans-serif';
            ctx.textAlign    = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(emoji, x, y);
            ctx.restore();
        });
    }
};

const radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['AGI', 'STR', 'DEX', 'INS', 'PRE', 'KNO'],
        datasets: [{
            label: '能力值',
            data: [0, 0, 0, 0, 0, 0],
            backgroundColor: 'rgba(212, 129, 65, 0.35)',
            borderColor: 'rgba(212, 129, 65, 1)',
            borderWidth: 2,
            pointBackgroundColor: 'rgba(212, 129, 65, 1)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(212, 129, 65, 1)'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            // 为顶点图标圆留出足够空间：图标半径(16) + 偏移(22) + 余量 = 44
            padding: 44
        },
        scales: {
            r: {
                min: RADAR_MIN,
                max: RADAR_MAX,
                angleLines: { color: 'rgba(55, 42, 35, 0.35)', lineWidth: 1.5 },
                grid:       { color: 'rgba(55, 42, 35, 0.35)', circular: false, lineWidth: 1.5 },
                pointLabels: { display: false },
                ticks:       { display: false }
            }
        },
        plugins: {
            legend:  { display: false },
            tooltip: { enabled: false }
        }
    },
    plugins: [radarIconPlugin]
});

function updateRadarChart(values) {
    radarChart.data.datasets[0].data = values;
    radarChart.update();
}

// ── 标签切换 ─────────────────────────────────────────────────
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', e => {
        const targetId = e.currentTarget.dataset.target;
        if (!targetId) return; // 如果没有 target，说明是无效标签（比如“信息”还没做）

        // 更新 Tab 样式
        document.querySelectorAll('.tab').forEach(t => {
            t.classList.remove('active');
            t.classList.add('inactive');
        });
        e.currentTarget.classList.add('active');
        e.currentTarget.classList.remove('inactive');

        // 更新页面容器显示
        document.querySelectorAll('.page-container').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(targetId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    });
});

// ── 工具函数 ─────────────────────────────────────────────────
function toNum(val) {
    const n = parseFloat(val);
    return isNaN(n) ? 0 : n;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = (value !== null && value !== undefined) ? value : '—';
}

function setVal(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value || '';
}

// ── 资源 emoji 配置（皮肤作者自定义部分）──────────────────────
const RESOURCE_EMOJI = {
    hp:     { filled: '❤️',  empty: '🤍' },
    stress: { filled: '😱',  empty: '😀' },
    armor:  { filled: '🛡️', empty: '🪨' },
    hope:   { filled: '⭐', empty: '🪨' }
};

/**
 * onUpdate 回调：每当资源数值变化时，更新对应的 emoji 展示区。
 * @param {string} key     - 'hp' | 'stress' | 'armor' | 'hope'
 * @param {number} current - 当前值
 * @param {number} max     - 上限
 */
function renderResourceDisplay(key, current, max) {
    const display = document.querySelector(`[data-dh-display="${key}"]`);
    if (!display) return;

    display.innerHTML = '';
    const cfg = RESOURCE_EMOJI[key] || { filled: '●', empty: '○' };

    for (let i = 0; i < max; i++) {
        const pip = document.createElement('span');
        pip.className = 'dh-pip' + (i < current ? '' : ' empty');
        pip.textContent = i < current ? cfg.filled : cfg.empty;
        display.appendChild(pip);
    }
}

// ── renderSkin ────────────────────────────────────────────────
window.renderSkin = function(jsonData) {
    if (!jsonData) return;

    // ── 1. 左列：等级 / 闪避 / 护甲 ──────────────────────────
    setText('skin-level',   jsonData.LevelTextbox  || '1');
    setText('skin-evasion', jsonData.EvasionTextbox || '—');
    setText('skin-armor',   jsonData.ArmorTextbox   || '—');

    // ── 2. 阈值：{重度} / {严重} ─────────────────────────────
    setText('skin-threshold',
        `${jsonData.MajorTextbox || '—'} / ${jsonData.SevereTextbox || '—'}`);

    // ── 3. 头像 ───────────────────────────────────────────────
    const avatarEl = document.getElementById('skin-avatar');
    if (avatarEl) {
        if (jsonData.avatarImageSrc) {
            avatarEl.src = jsonData.avatarImageSrc;
            avatarEl.style.display = 'block';
        } else {
            avatarEl.style.display = 'none';
        }
    }

    // ── 4. 姓名 & 标签 ────────────────────────────────────────
    const name = jsonData.NameTextbox || '（未命名）';
    setText('skin-name', name);
    document.title = `${name} | 超英派遣中心`;

    const tagsContainer = document.getElementById('skin-tags');
    if (tagsContainer) {
        tagsContainer.innerHTML = '';
        [jsonData.RaceTextbox, jsonData.CommunityTextbox, jsonData.ClassTextbox]
            .filter(t => t && t.trim())
            .forEach(text => {
                const span = document.createElement('span');
                span.className = 'avatar-tag';
                span.textContent = text.trim();
                tagsContainer.appendChild(span);
            });
    }

    // ── 5. 六维属性 ───────────────────────────────────────────
    const strVal = toNum(jsonData.StrengthTextbox);
    const insVal = toNum(jsonData.InstinctTextbox);
    const agiVal = toNum(jsonData.AgilityTextbox);
    const dexVal = toNum(jsonData.FinesseTextbox);
    const preVal = toNum(jsonData.PresenceTextbox);
    const knoVal = toNum(jsonData.KnowledgeTextbox);

    setText('attr-str', strVal);
    setText('attr-ins', insVal);
    setText('attr-agi', agiVal);
    setText('attr-pre', preVal);
    setText('attr-kno', knoVal);
    setText('attr-dex', dexVal);

    // 雷达图：顺序 AGI STR DEX INS PRE KNO
    updateRadarChart([agiVal, strVal, dexVal, insVal, preVal, knoVal]);

    // ── 6. 资源追踪器（生命/压力/护甲/希望）──────────────────
    const resources = DH.parseResources(jsonData);
    new DH.ResourceWidget({
        container: document.getElementById('resource-tracker-container'),
        resources:  resources,
        onUpdate:   renderResourceDisplay
    });

    // ── 7. 底栏其余两格 ───────────────────────────────────────
    setVal('skin-class-feature', jsonData.ClassFeatureTextbox);

    const experiences = [];
    for (let i = 1; i <= 5; i++) {
        const expName = jsonData[`Experience${i}Textbox`];
        const expMod  = jsonData[`Experience${i}ModifierTextbox`];
        if (expName && expName.trim()) {
            experiences.push(expMod ? `${expName} (${expMod})` : expName);
        }
    }
    setVal('skin-experience', experiences.join('\n'));

    // ── 8. 武器 / 护甲 / 阈值（右列下方）───────────────────────
    function wiText(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html || '';
    }

    // 主武器
    const pwName   = jsonData.PrimaryWeaponNameTextbox   || '';
    const pwStat   = jsonData.PrimaryWeaponStatTextbox   || '';
    const pwDmg    = jsonData.PrimaryWeaponDamageTextbox || '';
    const pwTrait  = jsonData.PrimaryWeaponTraitTextbox  || '';
    wiText('wi-primary',
        pwName ? `<b>主武器</b>：${pwName}&#8194;<span style="color:var(--text-muted)">${pwStat}</span>&#8194;<b>${pwDmg}</b>` : '');
    wiText('wi-primary-trait', pwTrait ? `● ${pwTrait}` : '');

    // 副武器
    const swName   = jsonData.SecondaryWeaponNameTextbox   || '';
    const swStat   = jsonData.SecondaryWeaponStatTextbox   || '';
    const swDmg    = jsonData.SecondaryWeaponDamageTextbox || '';
    const swTrait  = jsonData.SecondaryWeaponTraitTextbox  || '';
    wiText('wi-secondary',
        swName ? `<b>副武器</b>：${swName}&#8194;<span style="color:var(--text-muted)">${swStat}</span>&#8194;<b>${swDmg}</b>` : '');
    wiText('wi-secondary-trait', swTrait ? `● ${swTrait}` : '');

    // 护甲
    const armorName   = jsonData.ArmorNameTextbox      || '';
    const major       = jsonData.MajorTextbox          || '—';
    const severe      = jsonData.SevereTextbox         || '—';
    const armorTrait  = jsonData.ArmorTraitTextbox     || '';
    wiText('wi-armor',
        armorName ? `<b>护甲</b>：${armorName}&#8194;<span style="color:var(--text-muted)">阈值</span>&#8194;<b>${major} / ${severe}</b>` : '');
    wiText('wi-armor-trait', armorTrait ? `● ${armorTrait}` : '');

    // ── 9. 能力卡片 (Abilities) ────────────────────────────────
    const abilitiesGrid = document.getElementById('skin-abilities-grid');
    if (abilitiesGrid) {
        abilitiesGrid.innerHTML = '';
        const cards = jsonData.cards || [];
        
        cards.forEach(cardItem => {
            const data = cardItem.data || cardItem;
            if (!data) return;

            const cardEl = document.createElement('div');
            cardEl.className = 'dh-card';

            const resolvePath = (src) => {
                if (!src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
                    return '../../' + src; // 适配主工程相对路径
                }
                return src;
            };

            const renderMarkdown = (text) => {
                return (text || '').replace(/\*\*|__|\*|_/g, ''); // 简单去掉粗体/斜体符号
            };

            if (typeof data === 'string') {
                // 图片卡
                const img = document.createElement('img');
                img.src = resolvePath(data);
                cardEl.appendChild(img);
            } else if (typeof data === 'object') {
                if (data.imageUrl) {
                    const img = document.createElement('img');
                    img.src = resolvePath(data.imageUrl);
                    cardEl.appendChild(img);
                } else {
                    // 文本卡
                    const title = data['名称'] || data['name'] || '未命名卡片';
                    const type = data['类型'] || '通用特性';
                    const descKeys = ["特性", "效果", "desc", "description", "描述"];
                    let desc = "";
                    for (const key of descKeys) {
                        if (data[key]) {
                            desc += (desc ? "\n" : "") + data[key];
                        }
                    }

                    cardEl.innerHTML = `
                        <div class="dh-card-text">
                            <div class="dh-card-title">${renderMarkdown(title)}</div>
                            <div class="dh-card-tag">${renderMarkdown(type)}</div>
                            <div class="dh-card-desc">${renderMarkdown(desc)}</div>
                        </div>
                    `;
                }
            }

            abilitiesGrid.appendChild(cardEl);
        });
    }

    // ── 10. 信息页面 (Info Page) ────────────────────────────────
    // 事件记录
    setVal('skin-event-log', jsonData.EventLogTextbox || '');
    
    // 金钱
    const gold = window.SkinUtils.parseGold(jsonData);
    setText('skin-money', `金币：${gold.chest} 箱 / ${gold.bag} 袋 / ${gold.handful} 把`);

    // 便携物品
    setVal('skin-items', jsonData.ItemSlot1Textbox || '');

    // 库存武器
    const bw1Name   = jsonData.Backup1WeaponNameTextbox   || '';
    const bw1Stat   = jsonData.Backup1WeaponStatTextbox   || '';
    const bw1Dmg    = jsonData.Backup1WeaponDamageTextbox || '';
    const bw1Trait  = jsonData.Backup1WeaponTraitTextbox  || '';
    wiText('wi-backup1', bw1Name ? `<b>备用武器一</b>：${bw1Name}&#8194;<span style="color:var(--text-muted)">${bw1Stat}</span>&#8194;<b>${bw1Dmg}</b>` : '');
    wiText('wi-backup1-trait', bw1Trait ? `● ${bw1Trait}` : '');

    const bw2Name   = jsonData.Backup2WeaponNameTextbox   || '';
    const bw2Stat   = jsonData.Backup2WeaponStatTextbox   || '';
    const bw2Dmg    = jsonData.Backup2WeaponDamageTextbox || '';
    const bw2Trait  = jsonData.Backup2WeaponTraitTextbox  || '';
    wiText('wi-backup2', bw2Name ? `<b>备用武器二</b>：${bw2Name}&#8194;<span style="color:var(--text-muted)">${bw2Stat}</span>&#8194;<b>${bw2Dmg}</b>` : '');
    wiText('wi-backup2-trait', bw2Trait ? `● ${bw2Trait}` : '');

    const divider = document.getElementById('wi-backup-divider');
    if (divider) {
        divider.style.display = (bw1Name && bw2Name) ? 'block' : 'none';
    }

    // ── 11. 升级系统 (Level Up) ────────────────────────────────
    const luContainer = document.getElementById('skin-levelup-container');
    if (luContainer) {
        luContainer.innerHTML = '';
        
        const levelupData = window.SkinUtils.parseLevelUp(jsonData);

        // 渲染 Tabs
        const tabsDiv = document.createElement('div');
        tabsDiv.className = 'lu-tabs';
        levelupData.forEach((tierData, idx) => {
            const tab = document.createElement('div');
            tab.className = `lu-tab ${idx === 0 ? 'active' : ''}`;
            tab.textContent = tierData.title;
            tab.dataset.target = `lu-content-${tierData.tier}`;
            
            tab.addEventListener('click', e => {
                tabsDiv.querySelectorAll('.lu-tab').forEach(t => t.classList.remove('active'));
                e.currentTarget.classList.add('active');
                luContainer.querySelectorAll('.lu-content').forEach(c => c.classList.remove('active'));
                document.getElementById(`lu-content-${tierData.tier}`).classList.add('active');
            });
            tabsDiv.appendChild(tab);
        });
        luContainer.appendChild(tabsDiv);

        // 渲染 Contents
        levelupData.forEach((tierData, idx) => {
            const contentDiv = document.createElement('div');
            contentDiv.className = `lu-content ${idx === 0 ? 'active' : ''}`;
            contentDiv.id = `lu-content-${tierData.tier}`;

            contentDiv.innerHTML = '';

            tierData.options.forEach(opt => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'lu-item';

                const boxesDiv = document.createElement('div');
                boxesDiv.className = 'lu-boxes';

                (opt.states || []).forEach(val => {
                    let boxClass = 'lu-box';
                    if (val === '1') boxClass += ' checked';
                    else if (val === '2') boxClass += ' disabled';
                    boxesDiv.innerHTML += `<div class="${boxClass}"></div>`;
                });

                itemDiv.appendChild(boxesDiv);

                const textDiv = document.createElement('div');
                textDiv.className = 'lu-text';
                textDiv.textContent = opt.text;
                itemDiv.appendChild(textDiv);

                contentDiv.appendChild(itemDiv);
            });



            luContainer.appendChild(contentDiv);
        });
    }
};
