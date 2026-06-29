/**
 * CODE QUEST GAME ENGINE
 * Motor do Jogo Educacional com Sistema de Estados
 * Gerencia WALKING, INSPECTING e FIGHTING_RESOLVED
 */

class CodeQuestGame {
    constructor() {
        if (window.__codeQuestGameInstance) {
            return window.__codeQuestGameInstance;
        }

        this.currentLevel = 1;

        // ==================== SISTEMA DE ESTADOS ====================
        // Estados do jogo para o fluxo educacional
        this.GameState = {
            WALKING: 'WALKING',           // Herói andando, aguardando colisão com gatilho
            INSPECTING: 'INSPECTING',     // Herói parado, painel JSON aberto, aguardando resposta
            FIGHTING_RESOLVED: 'FIGHTING_RESOLVED',  // Pergunta respondida corretamente
            MENU: 'MENU',                 // No menu principal
            FINAL: 'FINAL'                // Jogo finalizado
        };

        // Estado atual do jogo
        this.currentState = this.GameState.MENU;

        // Callbacks para mudança de estado
        this.onStateChange = null;

        // ==================== DADOS DO JOGO ====================
        // Bancos de dados JSON principais - carregados de arquivos JSON externos
        this.databases = {
            heroi: {
                classe: "Programador",
                nivel: 1,
                experiencia: 0,
                vida: 100,
                maxVida: 100,
                mana: 50,
                maxMana: 50,
                forca: 10,
                inteligencia: 15,  // Alta inteligência para programador
                destreza: 10,
                carisma: 10,
                fama: 50,
                habilidades: ["análise_de_código", "depuração"]
            },
            inventario: {
                ouro: 50,
                itens: [
                    { nome: "erva", quantidade: 1 },
                    { nome: "minério", quantidade: 1 }
                ],
                equipamentos: {
                    arma: null,
                    armadura: null,
                    acessorio: null
                }
            },
            mundo: {
                hora: "manha",
                clima: "sol",
                localizacao: "floresta_inicial",
                regiao: "reino_codigo",
                cena_atual: "intro",
                eventos_ativos: [],
                estado_mundo: "normal",
                glitch_ativo: false,
                segredo_desbloqueado: false
            },
            crafting: {
                receitas: [
                    { nome: "Poção de Vida", ingredientes: { "erva": 2 }, resultado: "poção_vida" },
                    { nome: "Amuleto de Carisma", ingredientes: { "minério": 2, "erva": 1 }, resultado: "amuleto_carisma" }
                ]
            },
            habilidades_classe: {
                Guerreiro: ["Golpe Devastador", "Pele de Aço", "Fúria Indomável"],
                Mago: ["Ignição Arcana", "Barreira Elemental", "Meteoro"],
                Arqueiro: ["Tiro Certeiro", "Esquiva Ágil", "Chuva de Flechas"]
            },
            monstros: {},  //Monstros são revelados dinamicamente conforme o jogador os encontra
            npcs: {}  // NPCs são revelados dinamicamente conforme o jogador os encontra
        };

        this.blockCounter = 0;
        this.interactionCount = 0;

        // ==================== MONSTROS REVELADOS ====================
        // Catálogo completo de monstros (dados completos, nunca expostos diretamente)
        this._monsterCatalog = {
            slime: {
                nome: "Slime",
                nivel: 1,
                vida: 20,
                maxVida: 20,
                ataque: 5,
                defesa: 2,
                elemento: "natureza",
                drops: ["erva"]
            },
            goblin: {
                nome: "Goblin",
                nivel: 2,
                vida: 30,
                maxVida: 30,
                ataque: 8,
                defesa: 3,
                elemento: "fogo",
                drops: ["minério"]
            },
            lobo: {
                nome: "Lobo",
                nivel: 3,
                vida: 40,
                maxVida: 40,
                ataque: 12,
                defesa: 4,
                elemento: "gelo",
                drops: ["pele_lobo"]
            }
        };

        // ==================== NPCs REVELADOS ====================
        // Catálogo completo de NPCs (dados completos, nunca expostos diretamente)
        this._npcCatalog = {
            mago: {
                nome: "Mago Eldrin",
                tipo: "mentor",
                localizacao: "torre_magica",
                status: "????"  // será atualizado ao revelar
            },
            mercador: {
                nome: "Mercador Gorb",
                tipo: "vendedor",
                localizacao: "mercado",
                status: "????"
            },
            porta: {
                nome: "Porta do Conhecimento",
                tipo: "passagem",
                localizacao: "sala_final",
                status: "????"
            }
        };

        // ==================== INICIALIZAÇÃO ====================
        // Carrega nível 1 inicialmente
        this.loadLevel(1);

        // Carrega dados JSON externos de forma assíncrona
        this.loadJSONData();

        window.__codeQuestGameInstance = this;
    }

    async loadJSONData() {
        try {
            const defaults = {
                heroi: this.databases.heroi,
                inventario: this.databases.inventario,
                mundo: this.databases.mundo,
                monstros: this.databases.monstros
                // 'npcs' é intencionalmente excluído — revelados dinamicamente durante o jogo
            };

            const tabs = Object.keys(defaults);
            for (const tab of tabs) {
                const localData = localStorage.getItem(`codequest:${tab}`);
                if (localData) {
                    this.databases[tab] = JSON.parse(localData);
                    continue;
                }

                const response = await fetch(`left-side/data/${tab}.json`);
                if (!response.ok) {
                    console.log(`Could not load ${tab}.json, using default`);
                    continue;
                }
                this.databases[tab] = await response.json();
            }

            // Garante que npcs e monstros sempre começam vazios (revelação progressiva)
            this.databases.npcs = {};
            this.databases.monstros = {};

            console.log('JSON data loaded successfully');
            // Aciona atualização da UI após carregamento
            if (this.onDatabaseUpdate) {
                this.onDatabaseUpdate('heroi', this.databases.heroi);
                this.onDatabaseUpdate('inventario', this.databases.inventario);
                this.onDatabaseUpdate('mundo', this.databases.mundo);
                this.onDatabaseUpdate('monstros', this.databases.monstros);
                this.onDatabaseUpdate('npcs', this.databases.npcs);
            }
        } catch (error) {
            console.error('Error loading JSON data:', error);
        }
    }

    async saveJSONData(tab) {
        try {
            const data = this.databases[tab];
            if (!data) return;
            localStorage.setItem(`codequest:${tab}`, JSON.stringify(data));
            this.triggerDatabaseUpdate(tab);
        } catch (error) {
            console.error('Error saving JSON data:', error);
        }
    }

    // Métodos de atualização JSON dinâmica - refletem ações do jogador
    updateHeroStat(stat, value) {
        if (this.databases.heroi[stat] !== undefined) {
            this.databases.heroi[stat] = value;
            this.triggerDatabaseUpdate('heroi');
        }
    }

    addExperience(amount) {
        this.databases.heroi.experiencia += amount;
        
        // Lógica de subir de nível
        const expNeeded = this.databases.heroi.nivel * 100;
        if (this.databases.heroi.experiencia >= expNeeded) {
            this.databases.heroi.nivel++;
            this.databases.heroi.experiencia -= expNeeded;
            this.databases.heroi.vida += 10;
            this.databases.heroi.mana += 5;
        }
        
        this.triggerDatabaseUpdate('heroi');
    }

    addItem(name, quantity = 1, properties = {}) {
        const existingItem = this.databases.inventario.itens.find(item => item.nome === name);
        if (existingItem) {
            existingItem.quantidade += quantity;
        } else {
            this.databases.inventario.itens.push({
                nome: name,
                quantidade: quantity,
                ...properties
            });
        }
        this.triggerDatabaseUpdate('inventario');
    }

    removeItem(name, quantity = 1) {
        const itemIndex = this.databases.inventario.itens.findIndex(item => item.nome === name);
        if (itemIndex !== -1) {
            const item = this.databases.inventario.itens[itemIndex];
            item.quantidade -= quantity;
            if (item.quantidade <= 0) {
                this.databases.inventario.itens.splice(itemIndex, 1);
            }
        }
        this.triggerDatabaseUpdate('inventario');
    }

    addGold(amount) {
        this.databases.inventario.ouro += amount;
        this.triggerDatabaseUpdate('inventario');
    }

    updateLocation(location) {
        this.databases.mundo.localizacao = location;
        this.triggerDatabaseUpdate('mundo');
    }

    updateWeather(weather) {
        this.databases.mundo.clima = weather;
        this.triggerDatabaseUpdate('mundo');
    }

    updateWorldTime(time) {
        this.databases.mundo.hora = time;
        this.triggerDatabaseUpdate('mundo');
    }

    advanceInteraction() {
        this.interactionCount++;
        
        // Regeneração de HP
        const isNight = this.databases.mundo.hora === 'noite';
        if (!isNight && this.databases.heroi.vida < this.databases.heroi.maxVida) {
            this.databases.heroi.vida = Math.min(this.databases.heroi.maxVida, this.databases.heroi.vida + 2);
            this.triggerDatabaseUpdate('heroi');
        }

        if (this.interactionCount % 5 === 0) {
            const timeCycles = ["manha", "tarde", "noite"];
            const currentIndex = timeCycles.indexOf(this.databases.mundo.hora);
            const nextIndex = (currentIndex + 1) % timeCycles.length;
            const nextTime = timeCycles[nextIndex];
            
            this.updateWorldTime(nextTime);

            // Sorteia clima se amanheceu
            if (nextTime === "manha") {
                const weathers = ["sol", "chuva", "neve", "tempestade", "neblina"];
                const nextWeather = weathers[Math.floor(Math.random() * weathers.length)];
                this.updateWeather(nextWeather);
            }
        }
    }

    craftItem(recipeName) {
        const recipe = this.databases.crafting.receitas.find(r => r.nome === recipeName);
        if (!recipe) return { success: false, message: "Receita não encontrada!" };

        // Verifica ingredientes
        for (const [ing, reqQty] of Object.entries(recipe.ingredientes)) {
            const invItem = this.databases.inventario.itens.find(i => i.nome === ing);
            if (!invItem || invItem.quantidade < reqQty) {
                return { success: false, message: `Ingredientes insuficientes! Precisa de ${reqQty}x ${ing}` };
            }
        }

        // Consome ingredientes
        for (const [ing, reqQty] of Object.entries(recipe.ingredientes)) {
            this.removeItem(ing, reqQty);
        }

        // Adiciona resultado
        if (recipe.resultado === "poção_vida") {
            this.addItem("Poção de Vida", 1, { efeito: "Recupera 50 HP", tipo: "consumível" });
        } else if (recipe.resultado === "amuleto_carisma") {
            this.addItem("Amuleto de Carisma", 1, { efeito: "+5 Carisma", tipo: "acessorio" });
            this.databases.heroi.carisma += 5;
            this.triggerDatabaseUpdate('heroi');
        } else {
            this.addItem(recipe.resultado, 1);
        }

        return { success: true, message: `Sucesso ao criar ${recipe.nome}!` };
    }

    updateJSONDirectly(tab, keyPath, value) {
        try {
            // Se tentar alterar algo inválido/restrito
            if (tab === 'heroi' && keyPath.includes('classe')) {
                throw new Error("Classe não pode ser modificada diretamente!");
            }

            // Acessa e altera a propriedade no objeto databases
            let obj = this.databases[tab];
            const parts = keyPath.split('.');
            for (let i = 0; i < parts.length - 1; i++) {
                obj = obj[parts[i]];
            }
            
            const lastKey = parts[parts.length - 1];
            
            // Converte tipo de valor se necessário
            let parsedVal = value;
            if (value === "true") parsedVal = true;
            else if (value === "false") parsedVal = false;
            else if (value === "null") parsedVal = null;
            else if (!isNaN(value) && value.trim() !== '') parsedVal = Number(value);

            obj[lastKey] = parsedVal;
            
            // Checa caminhos secretos
            if (tab === 'mundo' && keyPath === 'estado_mundo' && parsedVal === 'secreto') {
                this.databases.mundo.segredo_desbloqueado = true;
                this.databases.mundo.glitch_ativo = false;
            } else if (tab === 'npcs' && keyPath.includes('chave_necessaria') && parsedVal === false) {
                this.databases.mundo.segredo_desbloqueado = true;
                this.databases.mundo.glitch_ativo = false;
            } else {
                // Modificação incorreta/aleatória gera glitch se fugir do esperado
                if (tab === 'mundo' && keyPath === 'estado_mundo' && parsedVal !== 'normal') {
                    this.databases.mundo.glitch_ativo = true;
                }
            }

            this.triggerDatabaseUpdate(tab);
            return { success: true };
        } catch (e) {
            console.error("Erro ao modificar JSON:", e);
            this.databases.mundo.glitch_ativo = true;
            this.triggerDatabaseUpdate('mundo');
            return { success: false, error: e.message };
        }
    }

    triggerDatabaseUpdate(tab) {
        if (this.onDatabaseUpdate) {
            this.onDatabaseUpdate(tab, this.databases[tab]);
        }
    }

    /**
     * Revela um NPC no painel JSON, tornando seus dados visíveis ao jogador.
     * Mescla os dados do catálogo interno com os dados dinâmicos do encontro.
     * @param {string} npcKey - Chave do NPC ('mago', 'mercador', 'porta')
     * @param {Object} encounterData - Dados extras do encontro atual (do StoryNodes.json_data)
     */
    revealNPC(npcKey, encounterData = {}) {
        const base = this._npcCatalog[npcKey];
        if (!base) return;

        // Mescla os dados base do catálogo com os dados dinâmicos do encontro
        this.databases.npcs[npcKey] = Object.assign({}, base, encounterData);
        delete this.databases.npcs[npcKey].status; // Remove placeholder "????"

        this.triggerDatabaseUpdate('npcs');
        console.log(`[GameEngine] NPC revelado: ${npcKey}`);
    }

    /**
     * Revela um monstro no painel JSON, tornando seus dados visíveis ao jogador.
     * Mescla os dados do catálogo interno com os dados dinâmicos do encontro.
     * @param {string} monsterKey - Chave do monstro ('slime', 'goblin', 'lobo')
     * @param {Object} encounterData - Dados extras do encontro atual (do StoryNodes.json_data)
     */
    revealMonster(monsterKey, encounterData = {}) {
        const base = this._monsterCatalog[monsterKey];
        if (!base) return;

        // Mescla os dados base do catálogo com os dados dinâmicos do encontro
        this.databases.monstros[monsterKey] = Object.assign({}, base, encounterData);

        this.triggerDatabaseUpdate('monstros');
        console.log(`[GameEngine] Monstro revelado: ${monsterKey}`);
    }

    loadLevel(levelId) {
        this.currentLevel = levelId;
        console.log(`Loading level ${levelId}`);
    }

    resetLevel() {
        this.loadLevel(this.currentLevel);
    }

    // ==================== MÉTODOS DO SISTEMA DE ESTADOS ====================

    /**
     * Muda o estado atual do jogo
     * @param {string} newState - Novo estado (WALKING, INSPECTING, FIGHTING_RESOLVED, MENU, FINAL)
     * @param {Object} data - Dados opcionais para passar junto com a mudança de estado
     */
    setState(newState, data = {}) {
        const oldState = this.currentState;
        this.currentState = newState;

        console.log(`[GameEngine] Estado mudou: ${oldState} -> ${newState}`, data);

        // Dispara callback de mudança de estado se existir
        if (this.onStateChange) {
            this.onStateChange(oldState, newState, data);
        }
    }

    /**
     * Verifica se o jogo está em um estado específico
     * @param {string} state - Estado para verificar
     * @returns {boolean}
     */
    isState(state) {
        return this.currentState === state;
    }

    /**
     * Retorna o estado atual
     * @returns {string}
     */
    getCurrentState() {
        return this.currentState;
    }

    /**
     * Inicia o estado WALKING
     * Chamado pela game-scene.js quando o herói começa a andar
     * O herói se move da esquerda para direita automaticamente
     */
    startWalking() {
        this.setState(this.GameState.WALKING);
    }

    /**
     * Inicia o estado INSPECTING
     * Chamado pela game-scene.js quando o herói colide com um obstáculo
     * O painel JSON é aberto em read-only e as opções de diálogo são exibidas
     * @param {Object} obstacleData - Dados do obstáculo/NPC
     */
    startInspecting(obstacleData) {
        this.setState(this.GameState.INSPECTING, {
            obstacle: obstacleData,
            nodeKey: obstacleData.node
        });
    }

    /**
     * Processa a resposta do jogador a uma pergunta educacional
     * Chamado pela game-scene.js quando o jogador clica em uma opção
     * @param {Object} choice - Objeto de escolha do history.js
     * @returns {boolean} - true se a resposta foi correta, false se incorreta
     */
    handleChoice(choice) {
        if (!this.isState(this.GameState.INSPECTING)) {
            console.warn('[GameEngine] Tentativa de responder fora do estado INSPECTING');
            return false;
        }

        if (choice.correct === true) {
            // Resposta correta - avança para FIGHTING_RESOLVED
            this.setState(this.GameState.FIGHTING_RESOLVED, {
                choice: choice,
                feedback: choice.feedback
            });
            return true;
        } else {
            // Resposta incorreta - permanece em INSPECTING para retry
            console.log('[GameEngine] Resposta incorreta, jogador deve tentar novamente');
            return false;
        }
    }

    /**
     * Finaliza o estado INSPECTING e volta ao WALKING
     * Chamado pela game-scene.js após feedback visual de resposta correta
     * O herói retoma a caminhada para o próximo obstáculo
     */
    resolveObstacle() {
        if (this.isState(this.GameState.FIGHTING_RESOLVED)) {
            this.setState(this.GameState.WALKING);
        }
    }

    /**
     * Inicia o estado MENU
     * Chamado pela menu-scene.js
     */
    startMenu() {
        this.setState(this.GameState.MENU);
    }

    /**
     * Inicia o estado FINAL
     * Chamado quando o jogador completa todos os cenários
     */
    startFinal() {
        this.setState(this.GameState.FINAL);
    }

    // ==================== MÉTODOS DE COMUNICAÇÃO ENTRE COMPONENTES ====================

    /**
     * Registra um callback para mudanças de estado
     * Usado pela game-scene.js para reagir a mudanças de estado
     * @param {Function} callback - Função(oldState, newState, data)
     */
    onStateChange(callback) {
        this.onStateChange = callback;
    }

    /**
     * Notifica a game-scene.js que deve iniciar a caminhada
     * Chamado após mudança de estado para WALKING
     */
    notifySceneToWalk() {
        // A game-scene.js deve escutar mudanças de estado via onStateChange
        // Este método é um placeholder para comunicação explícita se necessário
        if (window.gameScene && window.gameScene.startWalking) {
            window.gameScene.startWalking();
        }
    }

    /**
     * Notifica a game-scene.js que deve parar e mostrar diálogo
     * Chamado após mudança de estado para INSPECTING
     * @param {string} nodeKey - Chave do nó no history.js
     */
    notifySceneToInspect(nodeKey) {
        // A game-scene.js deve escutar mudanças de estado via onStateChange
        // Este método é um placeholder para comunicação explícita se necessário
        if (window.gameScene && window.gameScene.loadNode) {
            window.gameScene.loadNode(nodeKey);
        }
    }
}
