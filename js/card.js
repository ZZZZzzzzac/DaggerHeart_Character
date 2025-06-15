
/**
 * Updates the CSS rules for skill card dimensions based on input values.
 */
function updateCardSize() {
    const width = document.getElementById('card-width-input').value;
    height = 1.4 * width;
    const styleId = 'card-size-override';
    console.log(`Updating card size: ${width}px x ${height}px`);
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
        body #card-container .skill-card {
            width: ${width}px !important;
            height: ${height}px !important;
        }
    `;
}


let highestZIndex = 11;

function renderJsonCard(card, jsonData) {
    const contentArea = document.createElement('div');
    contentArea.className = 'card-content';

    // --- Data Extraction ---
    const titleKeys = ["名称", "name"];
    const descriptionKeys = ["特性", "效果", "desc", "description"];

    let title = "";
    for (const key of titleKeys) {
        if (jsonData[key]) {
            title = jsonData[key];
            break;
        }
    }

    let description = "";
    for (const key of descriptionKeys) {
        if (jsonData[key]) {
            description += (description ? "\n" : "") + jsonData[key];
        }
    }

    const tags = [];
    const reservedKeys = [...titleKeys, ...descriptionKeys];
    for (const key in jsonData) {
        if (!reservedKeys.includes(key)) {
            tags.push(`${key}: ${jsonData[key]}`);
        }
    }

    // --- Element Creation ---
    const titleElement = document.createElement('div');
    titleElement.className = 'card-title-json';
    titleElement.textContent = removeMarkdownFormatting(title);

    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'card-tags-container';
    tags.forEach(tagText => {
        const tagElement = document.createElement('div');
        tagElement.className = 'card-tag';
        tagElement.textContent = removeMarkdownFormatting(tagText);
        tagsContainer.appendChild(tagElement);
    });

    const descriptionElement = document.createElement('div');
    descriptionElement.className = 'card-description-json';
    descriptionElement.textContent = removeMarkdownFormatting(description);

    contentArea.appendChild(titleElement);
    contentArea.appendChild(tagsContainer);
    contentArea.appendChild(descriptionElement);
    card.appendChild(contentArea);
}

function createCard(cardInfo) { // cardInfo can be {data, position} or just data
    let data = cardInfo.data || cardInfo;
    const position = cardInfo.position;

    // --- Smart URL Mapping Logic ---
    const processCardCreation = (finalData) => {
        const cardContainer = document.getElementById('card-container');
        const card = document.createElement('div');
        card.className = 'skill-card';

        card.dataset.cardData = JSON.stringify(finalData); // Store original data
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
        if (typeof finalData === 'string') {
            // Image card
            const contentArea = document.createElement('div');
            contentArea.className = 'card-content';
            const img = document.createElement('img');
            img.src = finalData;
            img.draggable = false; // Prevent default browser image drag behavior
            contentArea.appendChild(img);
            card.appendChild(contentArea);
        } else if (typeof finalData === 'object' && finalData !== null) {
            // JSON card
            renderJsonCard(card, finalData);
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
    };

    const key = typeof data === 'string' ? data : (data.name || data.名称);
    if (typeof url_map !== 'undefined' && url_map[key]) {
        const urls = url_map[key];
        const onlineUrl = urls.online;
        const localUrl = urls.local;
        const testImage = (url, onSuccess, onError) => {
            const img = new Image();
            img.onload = () => onSuccess(url);
            img.onerror = onError;
            img.src = url;
        };

        testImage(onlineUrl,
            (validUrl) => processCardCreation(validUrl), // Online URL works
            () => { // Online URL failed, try local
                testImage(localUrl,
                    (validUrl) => processCardCreation(validUrl), // Local URL works
                    () => processCardCreation(data) // Both failed, use original data
                );
            }
        );
    } else {
        // No mapping found, proceed with original data
        processCardCreation(data);
    }
}
