// ==========================================
// GAME STATE & ENGINE
// ==========================================
let currentWeather = WeatherTypes.SOL;
let previousSpeaker = null;

let coracoes = { enrique: 5, talita: 5 };
let energiaLuiza = 100;
let playerName = "";
let selectedClass = "";
const EXHAUSTION_ENERGY_THRESHOLD = 20;
let exhaustionWarningShownForNode = null;

const HEART_EFFECTS = {
    'muito bom': 2,
    'bom': 1,
    'neutro': 0,
    'ruim': -1
};

function applyEnergyEffect(energyTier) {
    const energyMap = {
        'cansativa': -10,
        'neutra': 0,
        'tranquila': 15
    };
    const change = energyMap[energyTier] || 0;
    energiaLuiza = Math.max(0, Math.min(100, energiaLuiza + change));
}

function showVictoryScreen() {
    showGoodnightScreen();
}

function getRandomWeather() {
    const weatherOptions = [WeatherTypes.SOL, WeatherTypes.CHUVA, WeatherTypes.FRIO];
    const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    console.log('Random weather generated:', randomWeather);
    return randomWeather;
}

function setWeather(weather) {
    currentWeather = weather;
    console.log('Weather set to:', currentWeather);
    try {
        updateWeatherIcon(document.getElementById('hud-time-val')?.textContent || '06:00');
    } catch (error) {
        console.error('Error in updateWeatherIcon:', error);
    }
}

// Estado do Jogo
let currentNodeKey = null;
let visitedNodes = new Set();

let dialogHistory = [];
let storyQueue = [];
let queueIndex = 0;
let typingInterval = null;
let isTyping = false;
let currentText = "";
let chatStep = 0;

function getPlayerName() {
    if (window.game && window.game.databases.heroi && window.game.databases.heroi.nome) {
        return window.game.databases.heroi.nome;
    }
    return playerName || "Jogador";
}

function advanceTime(minutes = 15) {
    if (!window.game || !window.game.databases.mundo) return;
    
    const currentTime = window.game.databases.mundo.hora || "06:00";
    const [hours, mins] = currentTime.split(':').map(Number);
    
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    
    const newTime = `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
    
    window.game.databases.mundo.hora = newTime;
    window.game.triggerDatabaseUpdate('mundo');
    
    // Update HUD time display
    const hudTimeVal = document.getElementById('hud-time-val');
    if (hudTimeVal) {
        hudTimeVal.textContent = newTime;
    }
    
    updateWeatherIcon(newTime);
}

// Inicializar o jogo ao carregar
window.onload = function() {
    createStars();
};

// Criar estrelas piscando na tela de boa noite
function createStars(containerId = 'stars-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    for(let i=0; i<60; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = Math.random() * 3 + 'px';
        star.style.height = star.style.width;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 2 + 's';
        container.appendChild(star);
    }
}

// Character creation functions
function showCharacterCreation() {
    switchScreen('screen-character-creation');
    selectedClass = null;
    playerName = null;
    document.getElementById('player-name').value = '';
    
    // Reset class selection
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

function selectClass(className) {
    selectedClass = className;
    
    // Update UI
    document.querySelectorAll('.class-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.class === className) {
            btn.classList.add('selected');
        }
    });
}

function confirmCharacterCreation() {
    const nameInput = document.getElementById('player-name').value.trim();
    
    if (!nameInput) {
        alert('Por favor, digite um nome para seu personagem.');
        return;
    }
    
    if (!selectedClass) {
        alert('Por favor, escolha uma classe.');
        return;
    }
    
    playerName = nameInput;
    
    // Set player name and class in game engine
    if (window.game && window.game.databases.heroi) {
        window.game.databases.heroi.nome = playerName;
        window.game.databases.heroi.classe = selectedClass;
        
        // Set class-specific stats
        switch(selectedClass) {
            case 'Guerreiro':
                window.game.databases.heroi.inteligencia = 10;
                window.game.databases.heroi.forca = 18;
                window.game.databases.heroi.destreza = 12;
                window.game.databases.heroi.habilidades = ['ataque_poderoso', 'defesa_escudo', 'grito_de_guerra'];
                break;
            case 'Mago':
                window.game.databases.heroi.inteligencia = 18;
                window.game.databases.heroi.forca = 6;
                window.game.databases.heroi.destreza = 10;
                window.game.databases.heroi.habilidades = ['bola_de_fogo', 'escudo_magico', 'teleporte'];
                break;
            case 'Ladino':
                window.game.databases.heroi.inteligencia = 12;
                window.game.databases.heroi.forca = 10;
                window.game.databases.heroi.destreza = 18;
                window.game.databases.heroi.habilidades = ['furtividade', 'ataque_critico', 'lockpick'];
                break;
        }
        
        window.game.triggerDatabaseUpdate('heroi');
    }
    
    startGame();
}

// Iniciar Aventura
function startGame() {
    dialogHistory = [];
    visitedNodes = new Set();

    switchScreen('screen-game');
    
    // Show hacker menu when game starts
    showHackerMenu();
    
    // Initialize random weather after screen switch to ensure element exists
    setTimeout(() => {
        console.log('Attempting to set weather...');
        setWeather(getRandomWeather());
        applyAmbienceToStoryNodes();
    }, 500);
    
    loadNode('despertar');
}

// Mudar de Tela
function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Modais
function openModal(modalId) {
    if (modalId === 'log-modal') {
        const body = document.getElementById('log-modal-body');
        if (dialogHistory.length === 0) {
            body.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Nenhum diálogo registrado ainda. Inicie o jogo!</p>`;
        } else {
            body.innerHTML = dialogHistory.map(entry => `
                <div class="log-entry">
                    <div class="log-name" style="color: ${getNameColor(entry.name)}">${entry.name}</div>
                    <div class="log-text">${entry.text}</div>
                </div>
            `).join('');
        }
    }
    document.getElementById(modalId).classList.add('active');
}

// Fechar Modal
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function getNameColor(name) {
    const key = getCharacterKeyFromSpeaker(name);
    return SPRITE_STYLES[key]?.color || 'var(--text-muted)';
}

// Atualizar Informações na HUD
function updateHUD() {
    console.log('HUD atualizado via sistema JSON dinâmico');
}

function updateHeartMeter(elementId, amount, maxHearts = 5) {
    const element = document.getElementById(elementId);
    if (!element) {
        console.log('Elemento não encontrado:', elementId);
        return;
    }

    const filled = Math.max(0, Math.min(maxHearts, amount));
    element.innerHTML = Array.from({ length: maxHearts }, (_, index) => {
        const className = index < filled ? 'heart-full' : 'heart-empty';
        return `<span class="${className}">♥</span>`;
    }).join('');
    
    console.log('Heart meter atualizado:', elementId, 'amount:', amount, 'filled:', filled, 'maxHearts:', maxHearts);
}

function updateWeatherIcon(time) {
    const weatherIcon = document.getElementById('weather-icon');
    if (!weatherIcon) return;

    const [hStr, mStr] = (time || '08:00').split(':');
    const totalMin = parseInt(hStr, 10) * 60 + parseInt(mStr, 10);

    if (totalMin >= 1200) {
        weatherIcon.className = 'fa-solid fa-moon';
        return;
    }

    const icons = {
        [WeatherTypes.SOL]: 'fa-sun',
        [WeatherTypes.CHUVA]: 'fa-cloud-rain',
        [WeatherTypes.FRIO]: 'fa-snowflake'
    };

    const newIconClass = icons[currentWeather] || 'fa-sun';
    weatherIcon.className = 'fa-solid ' + newIconClass;
}

// Aplica decaimento de energia baseado no tempo que passou
let lastTime = "05:30";

function applyEnergyDecay(currentTime) {
    if (!currentTime || !lastTime) return;

    const [h1, m1] = lastTime.split(':').map(Number);
    const [h2, m2] = currentTime.split(':').map(Number);

    const totalMin1 = h1 * 60 + m1;
    const totalMin2 = h2 * 60 + m2;

    const diffMinutes = totalMin2 - totalMin1;

    if (diffMinutes > 0) {
        const energyLoss = Math.floor(diffMinutes / 60);
        if (energyLoss > 0) {
            energiaLuiza = Math.max(0, energiaLuiza - energyLoss);
            updateHUD();
        }
    }

    lastTime = currentTime;
}

function toggleHamburgerMenu() {
    const drawer = document.getElementById('hamburger-drawer');
    if (drawer) {
        drawer.classList.toggle('active');
    }
}

// Abrir Diário a partir do Drawer lateral
function showHistoryFromDrawer() {
    toggleHamburgerMenu();
    showHistory();
}

// Carregar um nó da história
function loadNode(nodeKey) {
    currentNodeKey = nodeKey;
    visitedNodes.add(nodeKey);
    
    previousSpeaker = null;

    const node = StoryNodes[nodeKey];
    if (!node) return;

    // Apply dynamic JSON effects if present
    if (node.effects && window.game) {
        if (node.effects.experience) {
            window.game.addExperience(node.effects.experience);
        }
        if (node.effects.addItem) {
            window.game.addItem(node.effects.addItem.name, node.effects.addItem.quantity, node.effects.addItem.properties);
        }
        if (node.effects.removeItem) {
            window.game.removeItem(node.effects.removeItem.name, node.effects.removeItem.quantity);
        }
        if (node.effects.gold) {
            window.game.addGold(node.effects.gold);
        }
        if (node.effects.location) {
            window.game.updateLocation(node.effects.location);
        }
        if (node.effects.weather) {
            window.game.updateWeather(node.effects.weather);
        }
        if (node.effects.time) {
            window.game.updateWorldTime(node.effects.time);
        }
    }

    const gameScreen = document.getElementById('screen-game');
    gameScreen.className = 'screen active';

    const bgName = node.bg;
    gameScreen.style.backgroundImage = `url(${ASSETS.backgrounds[bgName]})`;
    gameScreen.classList.add(`fallback-bg-${bgName.replace('_', '-')}`);

    if (node.time) {
        const hudTimeVal = document.getElementById('hud-time-val');
        if (hudTimeVal) {
            hudTimeVal.textContent = node.time;
        }
        updateWeatherIcon(node.time);
        applyEnergyDecay(node.time);
    }

    hideAllSprites();

    storyQueue = [...node.dialogs];
    queueIndex = 0;

    const choicesContainer = document.getElementById('choices-container');
    if (choicesContainer) {
        choicesContainer.style.display = 'none';
    }

    playNextDialog(node);
}

function hideAllSprites() {
    document.querySelectorAll('.character-sprite-container').forEach(sprite => {
        sprite.classList.remove('active', 'speaking', 'dimmed');
    });
}

// Toca o próximo diálogo na fila com avaliação de condicionais
function playNextDialog(currentNodeObj) {
    if (queueIndex < storyQueue.length) {
        const item = storyQueue[queueIndex];
        
        let textToPlay = item.text;
        
        // Check for weather-based dialogue variations
        if (item.weatherDialogs && item.weatherDialogs[currentWeather]) {
            textToPlay = item.weatherDialogs[currentWeather];
        }
        
        if (item.conditional) {
            for (let branch of item.conditional) {
                if (branch.cond()) {
                    textToPlay = branch.text;
                    break;
                }
            }
        }
        
        showDialogText(item.speaker, textToPlay, item.chars || item.char);
        queueIndex++;
    } else {
        if (currentNodeObj.isChat) {
            startWhatsAppChat(currentNodeObj.chatPartner);
        } else if (currentNodeObj.choices) {
            if (
                energiaLuiza < EXHAUSTION_ENERGY_THRESHOLD &&
                energiaLuiza > 0 &&
                exhaustionWarningShownForNode !== currentNodeKey
            ) {
                exhaustionWarningShownForNode = currentNodeKey;
                showDialogText(
                    "Luiza",
                    "*(suspiro)* Estou tão exausta... Será que ainda tenho forças pra ser romântica?"
                );
                return;
            }
            showChoices(currentNodeObj.choices);
        } else if (currentNodeObj.next === 'show_goodnight_screen') {
            showGoodnightScreen();
        } else if (currentNodeObj.next === 'show_bad_ending_screen') {
            showBadEndingScreen();
        } else if (currentNodeObj.next) {
            loadNode(currentNodeObj.next);
        }
    }
}

function applyHeartEffects(heartEffects) {
    if (!heartEffects) {
        console.log('Heart effects é null/undefined');
        return;
    }

    console.log('Aplicando heart effects:', heartEffects);
    console.log('Antes - Enrique:', coracoes.enrique, 'Talita:', coracoes.talita);

    Object.entries(heartEffects).forEach(([personagem, effectName]) => {
        if (coracoes[personagem] === undefined) {
            console.log('Personagem não encontrado no coracoes:', personagem);
            return;
        }
        
        const change = HEART_EFFECTS[effectName] || 0;
        coracoes[personagem] = Math.max(0, Math.min(10, coracoes[personagem] + change));
        
        console.log('Aplicado', change, 'corações para', personagem, '- Total agora:', coracoes[personagem]);
    });
    
    const totalHearts = coracoes.enrique + coracoes.talita;
    console.log('Total de corações:', totalHearts);
    if (totalHearts > 10) {
        const excess = totalHearts - 10;
        const enriqueRatio = coracoes.enrique / totalHearts;
        const talitaRatio = coracoes.talita / totalHearts;
        
        coracoes.enrique = Math.max(0, coracoes.enrique - Math.ceil(excess * enriqueRatio));
        coracoes.talita = Math.max(0, coracoes.talita - Math.ceil(excess * talitaRatio));
        
        console.log('Excesso de corações detectado. Reduzindo proporcionalmente.');
    }
    
    coracoes.enrique = Math.max(0, Math.min(10, coracoes.enrique));
    coracoes.talita = Math.max(0, Math.min(10, coracoes.talita));
    
    console.log('Depois - Enrique:', coracoes.enrique, 'Talita:', coracoes.talita);
}

// Exibir Diálogo com efeito de digitação gradual
function showDialogText(speaker, text, activeCharKey) {
    const nameTag = document.getElementById('dialog-name');
    const textBox = document.getElementById('dialog-text');
    const dialogBox = document.getElementById('dialog-box');
    const speakerCharKey = getCharacterKeyFromSpeaker(speaker);
    
    const actualPlayerName = getPlayerName();
    const displayText = text.replace(/Jogador/g, actualPlayerName);
    const displaySpeaker = speaker === "Jogador" ? actualPlayerName : speaker;
    
    const previousSpeakerCharKey = previousSpeaker ? getCharacterKeyFromSpeaker(previousSpeaker) : null;
    previousSpeaker = speaker;
    
    let activeCharKeys = [];
    if (getSpeakerClassName(speaker) !== 'narrador') {
        if (speakerCharKey) {
            activeCharKeys.push(speakerCharKey);
        }
        if (previousSpeakerCharKey && previousSpeakerCharKey !== speakerCharKey) {
            activeCharKeys.push(previousSpeakerCharKey);
        }
    }
    
    nameTag.textContent = displaySpeaker;
    nameTag.className = 'dialog-name-tag ' + getSpeakerClassName(speaker);

    if (speakerCharKey && SPRITE_STYLES[speakerCharKey]) {
        const style = SPRITE_STYLES[speakerCharKey];
        dialogBox.style.borderColor = style.color;
        
        const dialogCursor = document.querySelector('.dialog-cursor');
        if (dialogCursor) {
            dialogCursor.style.color = style.color;
        }
    } else {
        dialogBox.style.borderColor = 'var(--surface-border)';
        
        const dialogCursor = document.querySelector('.dialog-cursor');
        if (dialogCursor) {
            if (speaker === 'Narrador') {
                dialogCursor.style.color = '#ffffff';
            } else {
                dialogCursor.style.color = 'var(--primary)';
            }
        }
    }

    dialogHistory.push({ name: displaySpeaker, text: displayText });

    manageSpritesState(activeCharKeys, speakerCharKey);

    if (typingInterval) clearInterval(typingInterval);
    isTyping = true;
    currentText = displayText;
    textBox.textContent = "";
    let i = 0;
    
    typingInterval = setInterval(() => {
        if (i < displayText.length) {
            textBox.textContent += displayText.charAt(i);
            i++;
        } else {
            clearInterval(typingInterval);
            isTyping = false;
            advanceTime(5);
        }
    }, 18);
}

function getCharacterKeyFromSpeaker(speaker) {
    const normalizedSpeaker = getSpeakerClassName(speaker);

    const speakerSpriteMap = {
        luiza: 'luiza',
        enrique: 'enrique',
        talita: 'talita'
    };

    return speakerSpriteMap[normalizedSpeaker] || null;
}

function getSpeakerClassName(speaker) {
    return speaker
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function manageSpritesState(activeCharKeys, speakingCharKey) {
    const activeKeys = Array.isArray(activeCharKeys) ? activeCharKeys : [];

    document.querySelectorAll('.character-sprite-container').forEach(sprite => {
        sprite.classList.remove('active', 'speaking', 'speaking-otavio', 'speaking-ruan', 'dimmed');
        sprite.style.filter = '';
    });

    const spritesLayer = document.querySelector('.sprites-layer');
    if (spritesLayer) {
        if (activeKeys.length === 2) {
            spritesLayer.classList.add('two-sprites');
        } else {
            spritesLayer.classList.remove('two-sprites');
        }
    }

    activeKeys.forEach(activeCharKey => {
        const activeSprite = document.getElementById(`sprite-${activeCharKey}`);
        if (activeSprite) {
            activeSprite.classList.add('active');

            if (activeCharKey !== speakingCharKey) {
                activeSprite.classList.add('dimmed');
            } else {
                activeSprite.classList.add('speaking');
                
                const spriteStyle = SPRITE_STYLES[activeCharKey];
                if (spriteStyle && spriteStyle.glow) {
                    activeSprite.style.filter = `drop-shadow(0 0 15px ${spriteStyle.glow})`;
                }
            }
        }
    });
}

// Ao clicar na caixa de diálogo
function onDialogBoxClick() {
    if (isTyping) {
        if (typingInterval) clearInterval(typingInterval);
        document.getElementById('dialog-text').textContent = currentText;
        isTyping = false;
    } else {
        const choicesContainer = document.getElementById('choices-container');
        if (choicesContainer && choicesContainer.style.display === 'flex') {
            return;
        }

        const activeNodeKey = getActiveNodeKey();
        if (activeNodeKey) {
            playNextDialog(StoryNodes[activeNodeKey]);
        }
    }
}

// Retorna a chave do nó ativo
function getActiveNodeKey() {
    return currentNodeKey;
}

function hasRequiredHearts(requirements) {
    return Object.entries(requirements).every(([personagem, amount]) => {
        return (coracoes[personagem] || 0) >= amount;
    });
}

function getHeartRequirementText(requirements) {
    const names = {
        enrique: 'Enrique',
        talita: 'Talita'
    };

    return Object.entries(requirements)
        .map(([personagem, amount]) => `${amount} coração com ${names[personagem] || personagem}`)
        .join(' e ');
}

function isExpressiveChoice(choice) {
    const effects = resolveChoiceEffects(choice);
    if (!effects.hearts) return false;
    return Object.values(effects.hearts).includes('muito bom');
}

function isOutdoorContext(context) {
    return context === 'parque' || context === 'mirante';
}

function isIndoorComfortContext(context) {
    return context === 'cinema' || context === 'cafe' || context === 'bar' || context === 'restaurante';
}

function isPhysicalContactChoice(choice) {
    return choice.energy === 'cansativa' || choice.context === 'fisico';
}

function downgradeHeartTier(tier) {
    const order = ['muito bom', 'bom', 'neutro', 'ruim'];
    const index = order.indexOf(tier);
    return index === -1 ? tier : order[Math.min(order.length - 1, index + 1)];
}

function upgradeHeartTier(tier) {
    const reverseOrder = ['muito bom', 'bom', 'neutro', 'ruim'];
    const index = reverseOrder.indexOf(tier);
    return index === -1 ? tier : reverseOrder[Math.max(0, index - 1)];
}

function resolveChoiceEffects(choice) {
    let energy = choice.energy;
    let hearts = choice.hearts ? { ...choice.hearts } : null;
    const context = choice.context;

    if (currentWeather === WeatherTypes.CHUVA) {
        if (isOutdoorContext(context)) {
            if (energy === 'neutra' || energy === 'tranquila') {
                energy = 'cansativa';
            }
            if (hearts) {
                Object.keys(hearts).forEach(personagem => {
                    hearts[personagem] = downgradeHeartTier(hearts[personagem]);
                });
            }
        }

        if (isIndoorComfortContext(context) && hearts) {
            Object.keys(hearts).forEach(personagem => {
                if (hearts[personagem] !== 'ruim') {
                    hearts[personagem] = upgradeHeartTier(hearts[personagem]);
                }
            });
        }
    }

    if (hearts && isPhysicalContactChoice(choice)) {
        if (currentWeather === WeatherTypes.FRIO) {
            Object.keys(hearts).forEach(personagem => {
                hearts[personagem] = upgradeHeartTier(hearts[personagem]);
            });
        } else if (currentWeather === WeatherTypes.SOL) {
            Object.keys(hearts).forEach(personagem => {
                hearts[personagem] = downgradeHeartTier(hearts[personagem]);
            });
        }
    }

    return { energy, hearts };
}

function meetsChoiceCondition(choice) {
    const condition = choice.condition;
    if (!condition) return true;

    if (condition.heartsEnriqueMin !== undefined && coracoes.enrique < condition.heartsEnriqueMin) {
        return false;
    }
    if (condition.heartsTalitaMin !== undefined && coracoes.talita < condition.heartsTalitaMin) {
        return false;
    }
    if (condition.energyMin !== undefined && energiaLuiza < condition.energyMin) {
        return false;
    }
    if (condition.visitedNode && !visitedNodes.has(condition.visitedNode)) {
        return false;
    }

    return true;
}

function getChoiceLockState(choice) {
    const condition = choice.condition || {};

    if (condition.visitedNode && !visitedNodes.has(condition.visitedNode)) {
        return { locked: true, hidden: true, reason: '' };
    }

    if (!meetsChoiceCondition(choice)) {
        if (condition.heartsEnriqueMin !== undefined && coracoes.enrique < condition.heartsEnriqueMin) {
            return { locked: true, reason: `Requer ${condition.heartsEnriqueMin} corações com Enrique` };
        }
        if (condition.heartsTalitaMin !== undefined && coracoes.talita < condition.heartsTalitaMin) {
            return { locked: true, hidden: true, reason: '' };
        }
        if (condition.energyMin !== undefined && energiaLuiza < condition.energyMin) {
            return { locked: true, reason: `Requer Energia >= ${condition.energyMin}%` };
        }

        return { locked: true, reason: 'Requisito não atendido' };
    }

    if (choice.reqHearts && !hasRequiredHearts(choice.reqHearts)) {
        return { locked: true, reason: getHeartRequirementText(choice.reqHearts), hidden: true };
    }

    if (choice.reqEnergyMin !== undefined && energiaLuiza < choice.reqEnergyMin) {
        return { locked: true, reason: `Requer Energia >= ${choice.reqEnergyMin}%` };
    }

    if (energiaLuiza < EXHAUSTION_ENERGY_THRESHOLD && isExpressiveChoice(choice)) {
        return { locked: true, reason: 'Luiza está exausta demais para isso' };
    }

    if (choice.reqWeather && !choice.reqWeather.includes(currentWeather)) {
        return { locked: true, reason: 'Clima inadequado' };
    }

    return { locked: false, reason: '' };
}

// Exibir opções de escolha
function showChoices(choices) {
    const container = document.getElementById('choices-container');
    container.innerHTML = '';

    const visibleChoices = choices.filter(choice => {
        const lockState = getChoiceLockState(choice);
        return !lockState.hidden;
    });

    visibleChoices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';

        const lockState = getChoiceLockState(choice);

        if (lockState.locked) {
            btn.classList.add('locked');
            btn.innerHTML = `
                <span>${choice.text}</span>
                <span class="choice-requirement"><i class="fa-solid fa-lock"></i> ${lockState.reason}</span>
            `;
            btn.onclick = () => {
                btn.classList.add('shake');
                setTimeout(() => btn.classList.remove('shake'), 400);
            };
        } else {
            btn.innerHTML = `
                <span>${choice.text}</span>
            `;
            btn.onclick = () => {
                const resolved = resolveChoiceEffects(choice);

                if (resolved.energy) {
                    applyEnergyEffect(resolved.energy);
                }

                if (resolved.hearts) {
                    applyHeartEffects(resolved.hearts);
                }

                updateHUD();

                if (choice.target === 'go_victory') {
                    showVictoryScreen();
                } else {
                    loadNode(choice.target);
                }
            };
        }

        container.appendChild(btn);
    });

    container.style.display = 'flex';
}

// ================= CHAT WHATSAPP =================
function startWhatsAppChat(partner) {
    chatStep = 0;
    switchScreen('screen-whatsapp');

    const chatBody = document.getElementById('wa-chat-body');
    chatBody.innerHTML = '';

    const title = document.getElementById('wa-chat-name');
    const status = document.getElementById('wa-chat-status');
    const avatarText = document.getElementById('wa-avatar-text');
    const avatarImg = document.getElementById('wa-avatar-img');

    if (partner === 'enrique') {
        title.textContent = "Meu Amor 💖 Enrique";
        status.textContent = "online";
        avatarText.style.display = 'none';
        avatarImg.src = ASSETS.sprites.enrique_zen;
        avatarImg.style.display = 'block';
    }

    nextChatStep(partner);
}

function nextChatStep(partner) {
    if (!partner) {
        partner = 'enrique';
    }

    const script = ChatScripts[partner];
    const chatBody = document.getElementById('wa-chat-body');
    
    if (chatStep < script.length) {
        const msg = script[chatStep];
        const msgDiv = document.createElement('div');
        
        const isIncoming = msg.author !== 'Luiza';
        msgDiv.className = `wa-msg ${isIncoming ? 'incoming' : 'outgoing'}`;
        
        let authorSpan = '';
        if (isIncoming) {
            authorSpan = `<span class="wa-msg-author ${msg.author.toLowerCase()}">${msg.author}</span>`;
        }

        let stickerContent = '';
        if (msg.sticker) {
            const stickerSrc = STICKERS[msg.sticker];
            if (stickerSrc) {
                stickerContent = `<img src="${stickerSrc}" class="wa-sticker" alt="sticker">`;
            }
        }

        msgDiv.innerHTML = `
            ${authorSpan}
            <div>${msg.text}</div>
            ${stickerContent}
            <span class="wa-time">${msg.time}</span>
        `;
        
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        chatStep++;

        const inputText = document.getElementById('wa-input-text');
        if (chatStep < script.length && script[chatStep].author === 'Luiza') {
            inputText.textContent = "Tocar para responder...";
        } else {
            inputText.textContent = "Tocar para ler próximas mensagens...";
        }
    } else {
        const chatNodes = ['whatsapp_noite'];
        for (const key of chatNodes) {
            const n = StoryNodes[key];
            if (n?.isChat && n?.chatPartner === partner && n?.effects) {
                if (n.effects.energia) {
                    applyEnergyEffect(n.effects.energia);
                }
                updateHUD();
                break;
            }
        }
        switchScreen('screen-final');
    }
}

// ================= TELA DE BOA NOITE =================
function showGoodnightScreen() {
    createStars('stars-container-goodnight');
    switchScreen('screen-goodnight');
}

// ================= TELA DE FIM DE JOGO RUIM =================
function showBadEndingScreen() {
    switchScreen('screen-final');
}

// Funções Auxiliares de Navegação
const backToMenu = () => {
    switchScreen('screen-menu');
    hideHackerMenu();
};

const showHistory = () => {
    openModal('log-modal');
};

// ================= HACKER MENU FUNCTIONS =================
function showHackerMenu() {
    const hackerMenu = document.getElementById('hacker-menu-panel');
    if (hackerMenu) {
        hackerMenu.style.display = 'flex';
    }
}

function hideHackerMenu() {
    const hackerMenu = document.getElementById('hacker-menu-panel');
    if (hackerMenu) {
        hackerMenu.style.display = 'none';
    }
}
