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
        // Core JSON Databases - loaded from external JSON files
        this.databases = {
            heroi: {
                nome: "Arthur",
                classe: "Programador",
                nivel: 1,
                experiencia: 0,
                vida: 100,
                vida_maxima: 100,
                mana: 50,
                mana_maxima: 50,
                forca: 10,
                inteligencia: 15,  // Alta inteligência para programador
                destreza: 10,
                habilidades: ["análise_de_código", "depuração"],
                conquistas: []
            },
            inventario: {
                ouro: 0,
                itens: [],
                equipamentos: {
                    arma: null,
                    armadura: null,
                    acessorio: null
                }
            },
            mundo: {
                hora: "06:00",
                clima: "SOL",
                localizacao: "floresta_inicial",
                regiao: "reino_codigo",
                cena_atual: "intro",
                eventos_ativos: [],
                estado_mundo: "normal"
            },
            monstros: {
                slime: {
                    nome: "Slime",
                    nivel: 1,
                    vida: 20,
                    ataque: 5,
                    defesa: 2,
                    experiencia: 10,
                    drops: ["gel_de_slime"]
                },
                goblin: {
                    nome: "Goblin",
                    nivel: 2,
                    vida: 30,
                    ataque: 8,
                    defesa: 3,
                    experiencia: 20,
                    drops: ["osso_goblin", "pele_goblin"]
                },
                lobo: {
                    nome: "Lobo",
                    nivel: 3,
                    vida: 40,
                    ataque: 12,
                    defesa: 4,
                    experiencia: 30,
                    drops: ["pele_lobo", "dente_lobo"]
                }
            },
            npcs: {
                mago: {
                    nome: "Mago Eldrin",
                    localizacao: "torre_magica",
                    dialogos: ["Bem-vindo, viajante!", "A magia é como código."],
                    servicos: ["ensinar_magia", "dar_poção"]
                },
                mercador: {
                    nome: "Mercador Gorb",
                    localizacao: "mercado",
                    dialogos: ["Tenho os melhores itens!", "Olhe minha mercadoria."],
                    servicos: ["comprar_itens", "vender_itens"]
                },
                porta: {
                    nome: "Porta do Conhecimento",
                    localizacao: "final",
                    dialogos: ["Responda corretamente para passar.", "A lógica é a chave."],
                    servicos: ["abrir_porta"]
                }
            }
        };

        this.blockCounter = 0;

        // ==================== INICIALIZAÇÃO ====================
        // Load level 1 initially
        this.loadLevel(1);

        // Load external JSON data asynchronously
        this.loadJSONData();

        window.__codeQuestGameInstance = this;
    }

    async loadJSONData() {
        try {
            const defaults = {
                heroi: this.databases.heroi,
                inventario: this.databases.inventario,
                mundo: this.databases.mundo,
                monstros: this.databases.monstros,
                npcs: this.databases.npcs
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

            console.log('JSON data loaded successfully');
            // Trigger UI update after loading
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

    // Dynamic JSON update methods - reflect player actions
    updateHeroStat(stat, value) {
        if (this.databases.heroi[stat] !== undefined) {
            this.databases.heroi[stat] = value;
            this.triggerDatabaseUpdate('heroi');
        }
    }

    addExperience(amount) {
        this.databases.heroi.experiencia += amount;
        
        // Level up logic
        const expNeeded = this.databases.heroi.nivel * 100;
        if (this.databases.heroi.experiencia >= expNeeded) {
            this.databases.heroi.nivel++;
            this.databases.heroi.experiencia -= expNeeded;
            this.databases.heroi.vida_maxima += 10;
            this.databases.heroi.vida = this.databases.heroi.vida_maxima;
            this.databases.heroi.mana_maxima += 5;
            this.databases.heroi.mana = this.databases.heroi.mana_maxima;
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

    triggerDatabaseUpdate(tab) {
        if (this.onDatabaseUpdate) {
            this.onDatabaseUpdate(tab, this.databases[tab]);
        }
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
