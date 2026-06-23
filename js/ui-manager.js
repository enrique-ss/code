/**
 * CODE QUEST UI MANAGER - JSON EDITOR FOR VISUAL NOVEL
 */

// Wait for game to be ready before initializing
function initUIManager() {
    let game = window.__codeQuestGameInstance;
    
    if (!game) {
        game = new CodeQuestGame();
    }
    
    window.game = game;
    window.dispatchEvent(new CustomEvent("codequest:game-ready", { detail: { game } }));

    let activeTab = "heroi";

    // DOM Elements Cache
    const jsonVisualEditor = document.getElementById("json-visual-editor");
    const tabButtons = document.querySelectorAll(".tab-btn");
    const resizeHandle = document.getElementById("resize-handle");
    const leftPanel = document.querySelector(".hacker-menu-panel");

    if (!jsonVisualEditor) {
        console.error("json-visual-editor element not found");
        return;
    }

    // Initialize View after game loads JSON data
    setTimeout(() => {
        initJSONEditor();
    }, 500);

    // Resize handle functionality
    let isResizing = false;

    resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        document.body.style.cursor = "col-resize";
        document.body.style.userSelect = "none";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isResizing) return;

        const newWidth = e.clientX;
        const maxWidth = window.innerWidth * 0.5;
        const minWidth = 250;

        if (newWidth >= minWidth && newWidth <= maxWidth) {
            leftPanel.style.width = newWidth + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        }
    });

    function initJSONEditor() {
        console.log("Initializing JSON editor for tab:", activeTab);
        // Render initial JSON editor
        if (game.databases[activeTab]) {
            loadJSONToEditor();
        } else {
            // Retry if data not loaded yet
            console.log("Data not loaded yet, retrying...");
            setTimeout(initJSONEditor, 200);
        }
    }

    function loadJSONToEditor() {
        const data = game.databases[activeTab];
        console.log("Loading JSON to editor:", activeTab, data);
        if (data) {
            renderTopLevelJSONEditor(data);
        }
    }

    function renderTopLevelJSONEditor(data) {
        jsonVisualEditor.innerHTML = '';

        const opening = document.createElement('div');
        opening.className = 'json-bracket';
        opening.textContent = '{';
        jsonVisualEditor.appendChild(opening);

        const content = document.createElement('div');
        content.className = 'json-indent';
        jsonVisualEditor.appendChild(content);

        renderVisualJSONEditor(data, content);

        const closing = document.createElement('div');
        closing.className = 'json-bracket';
        closing.textContent = '}';
        jsonVisualEditor.appendChild(closing);
    }

    function renderVisualJSONEditor(data, parentElement = jsonVisualEditor, path = '') {
        parentElement.innerHTML = '';
        
        const keys = Object.keys(data);
        keys.forEach((key, index) => {
            const value = data[key];
            const currentPath = path ? `${path}.${key}` : key;
            const fieldContainer = document.createElement('div');
            fieldContainer.className = 'json-field';
            fieldContainer.dataset.path = currentPath;

            const keyElement = document.createElement('span');
            keyElement.className = 'json-key';
            keyElement.textContent = `"${key}":`;
            fieldContainer.appendChild(keyElement);

            if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                    const bracket = document.createElement('span');
                    bracket.className = 'json-bracket';
                    bracket.textContent = '[';
                    fieldContainer.appendChild(bracket);

                    const arrayContainer = document.createElement('div');
                    arrayContainer.className = 'json-indent';
                    fieldContainer.appendChild(arrayContainer);

                    value.forEach((item, itemIndex) => {
                        if (typeof item === 'object' && item !== null) {
                            renderVisualJSONEditor(item, arrayContainer, `${currentPath}[${itemIndex}]`);
                        } else {
                            const itemField = createEditableField(item, `${currentPath}[${itemIndex}]`);
                            arrayContainer.appendChild(itemField);
                            
                            // Add comma if not last item
                            if (itemIndex < value.length - 1) {
                                const comma = document.createElement('span');
                                comma.className = 'json-comma';
                                comma.textContent = ',';
                                arrayContainer.appendChild(comma);
                            }
                        }
                    });

                    const closingBracket = document.createElement('span');
                    closingBracket.className = 'json-bracket';
                    closingBracket.textContent = ']';
                    fieldContainer.appendChild(closingBracket);
                } else {
                    const bracket = document.createElement('span');
                    bracket.className = 'json-bracket';
                    bracket.textContent = '{';
                    fieldContainer.appendChild(bracket);

                    const objectContainer = document.createElement('div');
                    objectContainer.className = 'json-indent';
                    fieldContainer.appendChild(objectContainer);

                    renderVisualJSONEditor(value, objectContainer, currentPath);

                    const closingBracket = document.createElement('span');
                    closingBracket.className = 'json-bracket';
                    closingBracket.textContent = '}';
                    fieldContainer.appendChild(closingBracket);
                }
            } else {
                const valueElement = createEditableField(value, currentPath);
                fieldContainer.appendChild(valueElement);
            }

            // Add comma if not last item
            if (index < keys.length - 1) {
                const comma = document.createElement('span');
                comma.className = 'json-comma';
                comma.textContent = ',';
                fieldContainer.appendChild(comma);
            }

            parentElement.appendChild(fieldContainer);
        });
    }

    function createEditableField(value, path) {
        const container = document.createElement('div');
        container.className = 'json-value-container';

        if (activeTab === 'heroi') {
            const valueElement = document.createElement('span');
            valueElement.className = `json-value-readonly json-value-${getJSONValueClass(value)}`;
            valueElement.style.fontStyle = 'normal';
            valueElement.textContent = formatJSONValue(value);
            container.appendChild(valueElement);
            return container;
        }

        // All tabs are now editable
        const valueElement = document.createElement('input');
        valueElement.className = `json-value-input json-value-${getJSONValueClass(value)}`;
        valueElement.type = getValueType(value);
        valueElement.value = value;
        valueElement.dataset.path = path;

        if (typeof value === 'string') {
            valueElement.style.width = `${Math.max(50, value.length * 8)}px`;
        } else {
            valueElement.style.width = '60px';
        }

        // Auto-save on input change
        const syncAndSave = () => {
            autoSaveJSON();
        };

        valueElement.addEventListener('input', syncAndSave);
        valueElement.addEventListener('change', syncAndSave);

        container.appendChild(valueElement);

        return container;
    }

    function autoSaveJSON() {
        try {
            const inputs = jsonVisualEditor.querySelectorAll('.json-value-input');
            const newData = JSON.parse(JSON.stringify(game.databases[activeTab]));
            
            inputs.forEach(input => {
                const path = input.dataset.path;
                const value = input.type === 'number' ? parseFloat(input.value) : 
                             input.type === 'checkbox' ? input.checked : input.value;
                
                setValueByPath(newData, path, value);
            });

            game.databases[activeTab] = newData;
            game.saveJSONData(activeTab);
            console.log(`JSON salvo automaticamente: ${activeTab}`);
        } catch (error) {
            console.error('Erro ao salvar JSON:', error);
        }
    }

    function getValueType(value) {
        if (typeof value === 'number') {
            return 'number';
        } else if (typeof value === 'boolean') {
            return 'checkbox';
        }
        return 'text';
    }

    function formatJSONValue(value) {
        if (typeof value === 'string') {
            return `"${value}"`;
        }

        if (typeof value === 'boolean') {
            return value ? 'true' : 'false';
        }

        if (value === null || value === undefined) {
            return 'null';
        }

        if (typeof value === 'object') {
            return Array.isArray(value) ? '[...]' : '{...}';
        }

        return String(value);
    }

    function getJSONValueClass(value) {
        if (typeof value === 'string') return 'string';
        if (typeof value === 'number') return 'number';
        if (typeof value === 'boolean') return 'boolean';
        if (value === null) return 'null';
        return 'object';
    }

    function setValueByPath(obj, path, value) {
        const parts = path.replace(/\[(\d+)\]/g, '.$1').split('.');
        let current = obj;
        
        for (let i = 0; i < parts.length - 1; i++) {
            if (parts[i] !== undefined) {
                current = current[parts[i]];
            }
        }
        
        const lastKey = parts[parts.length - 1];
        if (lastKey !== undefined) {
            current[lastKey] = value;
        }
    }

    // Tab toggling
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            activeTab = btn.dataset.tab;
            jsonVisualEditor.dataset.tab = activeTab;
            loadJSONToEditor();
        });
    });

    // Game engine callback for database updates
    game.onDatabaseUpdate = (tab) => {
        if (tab === activeTab) {
            loadJSONToEditor();
        }
    };

    jsonVisualEditor.dataset.tab = activeTab;
    game.onDatabaseUpdate('heroi', game.databases.heroi);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIManager);
} else {
    initUIManager();
}
