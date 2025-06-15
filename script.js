// Hard-coded debug mode switch
const DEBUG_MODE = false;

function applyDebugStyles() {
    if (!DEBUG_MODE) return;

    // --- Apply to textboxes ---
    const allTextboxes = document.querySelectorAll('.base-textbox');
    allTextboxes.forEach(textbox => {
        textbox.classList.add('debug-mode');
    });

    // --- Apply to checkboxes ---
    const allCheckboxes = document.querySelectorAll('.base-checkbox');
    allCheckboxes.forEach(checkbox => {
        checkbox.classList.add('debug-mode');
    });
}

// Run debug mode initialization once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', applyDebugStyles);

// Prevent zooming with Ctrl+mouse wheel or Ctrl+/-
document.addEventListener('wheel', function(event) {
    if (event.ctrlKey) {
        event.preventDefault();
    }
}, { passive: false });

document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && (event.key === '+' || event.key === '-')) {
        event.preventDefault();
    }
});

window.addEventListener('DOMContentLoaded', () => {
    // 1. Set default states for slots first.
    setDefaultSlotStates();

    // 2. Initialize all TriStateCheckboxes. The constructor will pick up the default state.
    const checkboxLabels = document.querySelectorAll('.base-checkbox');
    checkboxLabels.forEach(label => {
        // Attach the instance to the element for easy access later
        label.checkboxInstance = new TriStateCheckbox(label);
    });

    // 3. Load any saved data from Local Storage. This will override the defaults if data exists.
    loadFormStateFromLocalStorage();

    // 4. Add event listeners to all non-checkbox form elements to save state on every change.
    // Checkbox saving is now handled within the TriStateCheckbox class.
    // const elements = document.querySelectorAll('.base-textbox');
    // elements.forEach(el => {
    //     el.addEventListener('input', saveFormStateToLocalStorage);
    // });

    // 5. Setup action buttons
    setupGlobalActionButtons(); // This function is in action.js
    setupDataModalButtons(); // This function is defined below

    // 6. Save all data to local storage before the page is unloaded (closed, refreshed, etc.)
    window.addEventListener('beforeunload', saveFormStateToLocalStorage);
});



let highestZIndex = 11;

function renderJsonCard(card, jsonData) {
    const contentArea = document.createElement('div');
    contentArea.className = 'card-content';

    const textarea = document.createElement('textarea');
    textarea.readOnly = true;
    textarea.value = JSON.stringify(jsonData, null, 2);
    
    contentArea.appendChild(textarea);
    card.appendChild(contentArea);
}

function createCard(cardInfo) { // cardInfo can be {data, position} or just data
    const cardContainer = document.getElementById('card-container');
    const card = document.createElement('div');
    card.className = 'skill-card';

    const data = cardInfo.data || cardInfo;
    const position = cardInfo.position;

    card.dataset.cardData = JSON.stringify(data); // Store original data
    card.style.zIndex = ++highestZIndex; // Set initial z-index

    if (position) {
        card.style.left = position.left;
        card.style.top = position.top;
    }

    // --- Close Button ---
    const closeButton = document.createElement('div');
    closeButton.className = 'close-card';
    closeButton.innerHTML = 'X';
    closeButton.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent mousedown on card from firing
        card.remove();
    });
    card.appendChild(closeButton);

    // --- Content ---
    if (typeof data === 'string') {
        // Image card
        const contentArea = document.createElement('div');
        contentArea.className = 'card-content';
        const img = document.createElement('img');
        img.src = data;
        img.draggable = false; // Prevent default browser image drag behavior
        contentArea.appendChild(img);
        card.appendChild(contentArea);
    } else if (typeof data === 'object' && data !== null) {
        // JSON card
        renderJsonCard(card, data);
    }

    cardContainer.appendChild(card);

    // --- Drag and Drop & Bring to Front ---
    let isDragging = false;
    let initialMouseX, initialMouseY, initialCardX, initialCardY;

    card.addEventListener('mousedown', (e) => {
        // Bring card to front
        card.style.zIndex = ++highestZIndex;

        isDragging = true;
        initialMouseX = e.clientX;
        initialMouseY = e.clientY;
        
        const rect = card.getBoundingClientRect();
        const containerRect = cardContainer.getBoundingClientRect();
        initialCardX = rect.left - containerRect.left;
        initialCardY = rect.top - containerRect.top;

        card.classList.add('dragging');

        function onMouseMove(e) {
            if (!isDragging) return;
            const dx = e.clientX - initialMouseX;
            const dy = e.clientY - initialMouseY;
            card.style.left = `${initialCardX + dx}px`;
            card.style.top = `${initialCardY + dy}px`;
        }

        function onMouseUp() {
            isDragging = false;
            card.classList.remove('dragging');
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}

// --- Example Usage ---
document.addEventListener('DOMContentLoaded', () => {
    // Example: Create an image card
    createCard('official_like_sheet/1.png');

    // Example: Create a JSON card
    createCard({ 
        name: "火焰球", 
        cost: "1 行动", 
        description: "你从指尖发射一个炽热的火球，对目标造成 2d6 火焰伤害。",
        range: "30英尺"
    });
});
