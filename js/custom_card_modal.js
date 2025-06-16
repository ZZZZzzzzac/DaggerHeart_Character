document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('custom-card-modal');
    const openModalBtn = document.getElementById('add-custom-card-btn');
    const closeModalBtn = document.getElementById('custom-card-modal-close');
    const addKvPairBtn = document.getElementById('add-kv-pair-btn');
    const kvContainer = document.getElementById('custom-card-kv-container');

    const templates = {
        domain: {
            type: '领域卡',
            keys: ['领域', '等级', '属性', '回想']
        },
        class: {
            type: '主职',
            keys: ['领域', '初始闪避值', '初始生命点', '希望特性', '职业特性']
        },
        subclass: {
            type: '子职',
            keys: ['主职', '等级', '施法属性']
        },
        image: {
            type: '图片',
            keys: ['图片链接']
        }
    };

    // Function to show the modal
    const showModal = () => {
        if(modal) modal.style.display = 'flex';
    };

    // Function to hide the modal
    const hideModal = () => {
        if (modal) {
            modal.style.display = 'none';
            resetModal(); // Reset on close
        }
    };

    // Event listeners
    if (openModalBtn) {
        openModalBtn.addEventListener('click', showModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', hideModal);
    }

    // Hide modal if user clicks outside of the content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Function to add a new Key-Value pair input group
    const addKvPair = (key = '', isReadonly = false) => {
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

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'x';
        removeBtn.className = 'remove-kv-btn';
        removeBtn.addEventListener('click', () => {
            kvPairDiv.remove();
        });

        kvPairDiv.appendChild(keyInput);
        kvPairDiv.appendChild(valueInput);
        kvPairDiv.appendChild(removeBtn);

        kvContainer.appendChild(kvPairDiv);
    };

    if (addKvPairBtn) {
        addKvPairBtn.addEventListener('click', () => addKvPair());
    }

    const finishBtn = document.getElementById('custom-card-finish-btn');

    // Function to reset all inputs in the modal
    const resetModal = () => {
        document.getElementById('custom-card-name').value = '';
        document.getElementById('custom-card-type').value = '';
        document.getElementById('custom-card-desc').value = '';
        kvContainer.innerHTML = ''; // Clear all key-value pairs
    };

    if (finishBtn) {
        finishBtn.addEventListener('click', () => {
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
                "描述": descValue
            };

            const kvPairs = kvContainer.querySelectorAll('.kv-pair');
            kvPairs.forEach(pair => {
                const keyInput = pair.querySelector('.custom-card-kv-key');
                const valueInput = pair.querySelector('.custom-card-kv-value');
                const key = keyInput.value.trim();
                const value = valueInput.value.trim();

                if (key && value) {
                    cardJson[key] = value;
                }
            
            });

            // Call the global createCard function (assuming it's defined in another file, e.g., card.js)
            if (typeof createCard === 'function') {
                createCard(cardJson);
            } else {
                console.error('createCard function is not defined.');
            }

            hideModal();
        });
    }
    // Template buttons logic
    const templateButtons = document.querySelectorAll('.template-btn');
    templateButtons.forEach(button => {
        button.addEventListener('click', () => {
            const templateName = button.dataset.template;
            const template = templates[templateName];

            if (template) {
                // Clear existing KV pairs
                kvContainer.innerHTML = '';

                // Set card type
                document.getElementById('custom-card-type').value = template.type;

                // Add new KV pairs from template
                template.keys.forEach(key => {
                    addKvPair(key, true); // Add key with readonly attribute
                });
            }
        });
    });
});