class CustomCardModal {
    constructor(modalId, openBtnId, closeBtnId, addKvPairBtnId, kvContainerId, finishBtnId, templates) {
        this.modal = document.getElementById(modalId);
        this.openModalBtn = document.getElementById(openBtnId);
        this.closeModalBtn = document.getElementById(closeBtnId);
        this.addKvPairBtn = document.getElementById(addKvPairBtnId);
        this.kvContainer = document.getElementById(kvContainerId);
        this.finishBtn = document.getElementById(finishBtnId);
        this.templates = templates;
        this.editingCard = null; // To store the card element being edited

        this.initEventListeners();
    }

    initEventListeners() {
        if (this.openModalBtn) {
            this.openModalBtn.addEventListener('click', () => this.showModal());
        }
        if (this.closeModalBtn) {
            this.closeModalBtn.addEventListener('click', () => this.hideModal());
        }
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hideModal();
            }
        });
        if (this.addKvPairBtn) {
            this.addKvPairBtn.addEventListener('click', () => this.addKvPair());
        }
        if (this.finishBtn) {
            this.finishBtn.addEventListener('click', () => this.finish());
        }
        const templateButtons = document.querySelectorAll('.template-btn');
        templateButtons.forEach(button => {
            button.addEventListener('click', () => {
                const templateName = button.dataset.template;
                this.loadTemplate(templateName);
            });
        });
    }

    showModal() {
        if (this.modal) this.modal.style.display = 'flex';
    }

    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
            this.resetModal();
        }
    }

    resetModal() {
        document.getElementById('custom-card-name').value = '';
        document.getElementById('custom-card-type').value = '';
        document.getElementById('custom-card-desc').value = '';
        this.kvContainer.innerHTML = '';
        this.editingCard = null;
        this.finishBtn.textContent = '完成';
    }

    addKvPair(key = '', value = '', isReadonly = false) {
        const kvPairDiv = document.createElement('div');
        kvPairDiv.classList.add('kv-pair');

        const keyInput = document.createElement('input');
        keyInput.type = 'text';
        keyInput.placeholder = '可选属性名';
        keyInput.className = 'custom-card-kv-key';
        keyInput.value = key;
        if (isReadonly) {
            keyInput.readOnly = true;
        }

        const valueInput = document.createElement('input');
        valueInput.type = 'text';
        valueInput.placeholder = '可选属性值';
        valueInput.className = 'custom-card-kv-value';
        valueInput.value = value;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.className = 'remove-kv-btn';
        removeBtn.addEventListener('click', () => {
            kvPairDiv.remove();
        });

        kvPairDiv.appendChild(keyInput);
        kvPairDiv.appendChild(valueInput);
        kvPairDiv.appendChild(removeBtn);

        this.kvContainer.appendChild(kvPairDiv);
    }

    loadTemplate(templateName) {
        const template = this.templates[templateName];
        if (template) {
            this.kvContainer.innerHTML = '';
            document.getElementById('custom-card-type').value = template.type;
            template.keys.forEach(key => {
                this.addKvPair(key, '', true);
            });
        }
    }

    finish() {
        const nameInput = document.getElementById('custom-card-name');
        const typeInput = document.getElementById('custom-card-type');
        const descInput = document.getElementById('custom-card-desc');

        const nameValue = nameInput.value.trim();
        const typeValue = typeInput.value.trim();
        const descValue = descInput.value.trim();

        if (!nameValue || !typeValue || !descValue) {
            alert('名称、类型和描述是必填项！');
            return;
        }

        const cardJson = {
            "名称": nameValue,
            "类型": typeValue,
            "描述": descValue,
        };

        const kvPairs = this.kvContainer.querySelectorAll('.kv-pair');
        kvPairs.forEach(pair => {
            const keyInput = pair.querySelector('.custom-card-kv-key');
            const valueInput = pair.querySelector('.custom-card-kv-value');
            const key = keyInput.value.trim();
            const value = valueInput.value.trim();

            if (key && value) {
                cardJson[key] = value;
            }
        });

        if (typeValue === this.templates.class.type) {
            cardJson['职业特性'] = descValue;
        }

        if (this.editingCard) {
            // Update existing card
            updateCard(this.editingCard, cardJson);
        } else {
            // Create new card
            createCard(cardJson);
        }

        this.hideModal();
    }

    openForEdit(cardElement) {
        this.resetModal();
        this.editingCard = cardElement;
        this.finishBtn.textContent = '修改';

        const cardData = JSON.parse(cardElement.dataset.cardData);

        document.getElementById('custom-card-name').value = cardData['名称'] || '';
        document.getElementById('custom-card-type').value = cardData['类型'] || '';
        document.getElementById('custom-card-desc').value = cardData['描述'] || '';

        Object.entries(cardData).forEach(([key, value]) => {
            if (key !== '名称' && key !== '类型' && key !== '描述' && key !== '职业特性') {
                this.addKvPair(key, value);
            }
        });

        this.showModal();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const templates = {
        domain: { type: '领域卡', keys: ['领域', '等级', '属性', '回想'] },
        class: { type: '主职', keys: ['领域', '初始闪避值', '初始生命点', '希望特性'] },
        subclass: { type: '子职', keys: ['主职', '等级', '施法属性'] },
        image: { type: '图片', keys: ['imageUrl'] }
    };

    window.customCardModal = new CustomCardModal(
        'custom-card-modal',
        'add-custom-card-btn',
        'custom-card-modal-close',
        'add-kv-pair-btn',
        'custom-card-kv-container',
        'custom-card-finish-btn',
        templates
    );
});