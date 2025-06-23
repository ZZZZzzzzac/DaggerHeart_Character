document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('enemy-card-modal');
    const modalBodyContent = document.getElementById('modal-body-content');
    const addEnemyCardBtn = document.getElementById('add-enemy-card-btn');
    const closeBtn = document.getElementById('enemy-card-modal-close');

    // --- Modal Visibility ---
    if (addEnemyCardBtn && modal) {
        addEnemyCardBtn.addEventListener('click', () => {
            modal.style.display = 'block';
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // --- Load Form and Initialize ---
    if (modalBodyContent) {
        fetch("html/enemy_card_modal_form.html")
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                modalBodyContent.innerHTML = html;
                initializeFormLogic();
            })
            .catch(error => console.error('Error loading enemy card form:', error));
    } else {
        console.error("Fatal: Modal content area 'modal-body-content' not found.");
    }

    function initializeFormLogic() {
        // --- Element References (from loaded form) ---
        const downloadJsonBtn = document.getElementById('enemy-card-download-json-btn');
        const finishBtn = document.getElementById('enemy-card-finish-btn');
        const featuresContainer = document.getElementById("featuresContainer");
        const addFeatureBtn = document.querySelector(".add-feature-btn");

        // --- Feature Row Management ---
        function addFeatureRow() {
            const newRow = document.createElement("div");
            newRow.className = "feature-form-row";
            newRow.innerHTML = `
                <input type="text" class="feature-name" placeholder="特性名称" required>
                <select class="feature-type" required>
                    <option value="被动">被动</option>
                    <option value="反应">反应</option>
                    <option value="动作">动作</option>
                    <option value="其他">其他</option>
                </select>
                <input type="text" class="feature-desc" placeholder="特性描述" required>
                <button type="button" class="remove-feature">-</button>
            `;
            featuresContainer.appendChild(newRow);
            // Add event listener to the new remove button
            newRow.querySelector('.remove-feature').addEventListener('click', function() {
                removeFeatureRow(this);
            });
        }

        function removeFeatureRow(btn) {
            const row = btn.closest('.feature-form-row');
            // Keep at least one row
            if (featuresContainer.children.length > 1) {
                row.remove();
            }
        }

        // Attach listeners to initially loaded remove buttons
        featuresContainer.querySelectorAll('.remove-feature').forEach(btn => {
            btn.addEventListener('click', function() {
                removeFeatureRow(this);
            });
        });
        
        // Attach listener to the add button
        if (addFeatureBtn) {
            addFeatureBtn.addEventListener('click', addFeatureRow);
        }

        // --- Data Collection ---
        function collectEnemyData() {
            const data = {
                name: document.getElementById('enemyName')?.value,
                rank: document.getElementById('enemyRank')?.value,
                type: document.getElementById('enemyType')?.value,
                description: document.getElementById('enemyDesc')?.value,
                motives: document.getElementById('enemyMotives')?.value,
                difficulty: document.getElementById('enemyDifficulty')?.value,
                threshold1: document.getElementById('enemyThreshold1')?.value,
                threshold2: document.getElementById('enemyThreshold2')?.value,
                hp: document.getElementById('enemyHP')?.value,
                stress: document.getElementById('enemyStress')?.value,
                attackBonus: document.getElementById('enemyATK')?.value,
                attack: document.getElementById('enemyAttack')?.value,
                features: []
            };

            const featureRows = document.querySelectorAll('#featuresContainer .feature-form-row');
            featureRows.forEach(row => {
                const feature = {
                    name: row.querySelector('.feature-name')?.value,
                    type: row.querySelector('.feature-type')?.value,
                    description: row.querySelector('.feature-desc')?.value
                };
                if (feature.name && feature.description) {
                    data.features.push(feature);
                }
            });

            return data;
        }

        // --- Button Actions ---
        if (downloadJsonBtn) {
            downloadJsonBtn.addEventListener('click', () => {
                const data = collectEnemyData();
                const json = JSON.stringify(data, null, 2);
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${data.name || 'enemy'}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            });
        }

        if (finishBtn) {
            finishBtn.addEventListener('click', () => {
                const enemyData = collectEnemyData();
                const cardDescription = enemyData.features
                    .map(f => `【${f.name}】(${f.type}): ${f.description}`)
                    .join('\n');

                const cardData = {
                    "名称": enemyData.name,
                    "类型": "敌人",
                    "描述": cardDescription,
                    "位阶": enemyData.rank,
                    "敌人类型": enemyData.type,
                    "动机与战术": enemyData.motives,
                    "难度": enemyData.difficulty,
                    "阈值": `${enemyData.threshold1}/${enemyData.threshold2}`,
                    "生命值": enemyData.hp,
                    "压力值": enemyData.stress,
                    "攻击加值": enemyData.attackBonus,
                    "攻击": enemyData.attack
                };

                if (typeof window.createCard === 'function') {
                    window.createCard(cardData);
                } else {
                    console.error('createCard function is not defined on the window object.');
                }

                if (modal) {
                    modal.style.display = 'none';
                }
            });
        }
    }
});