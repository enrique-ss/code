/**
 * CODE QUEST GAME ENGINE
 * Fantasy Medieval Isekai with Fourth Wall Breaking
 */

class CodeQuestGame {
    constructor() {
        if (window.__codeQuestGameInstance) {
            return window.__codeQuestGameInstance;
        }

        this.currentLevel = 1;
        
        // Core JSON Databases - loaded from external JSON files
        this.databases = {
            heroi: {
                nome: "",
                classe: "",
                nivel: 1,
                experiencia: 0,
                vida: 100,
                vida_maxima: 100,
                mana: 50,
                mana_maxima: 50,
                forca: 10,
                inteligencia: 10,
                destreza: 10,
                habilidades: [],
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
                localizacao: "vila_inicial",
                regiao: "reino_central",
                cena_atual: "despertar",
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
                ferreiro: {
                    nome: "Ferreiro",
                    localizacao: "vila_inicial",
                    dialogos: ["Bem-vindo à minha ferraria!", "Posso melhorar seu equipamento."],
                    servicos: ["melhorar_arma", "melhorar_armadura"]
                },
                mercador: {
                    nome: "Mercador",
                    localizacao: "vila_inicial",
                    dialogos: ["Tenho os melhores itens!", "Olhe minha mercadoria."],
                    servicos: ["comprar_itens", "vender_itens"]
                },
                velho_sabio: {
                    nome: "Velho Sábio",
                    localizacao: "floresta_misteriosa",
                    dialogos: ["O mundo está mudando...", "Você é o escolhido."],
                    servicos: ["dar_missao", "dar_informacao"]
                }
            }
        };

        this.blockCounter = 0;

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
}

window.CodeQuestGame = CodeQuestGame;
