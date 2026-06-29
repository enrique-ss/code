/**
 * CENA DO JOGO - Side-scroller e sincronização de física com sobreposições de UI DOM
 */

// Classe Character para estilização padronizada
class Character {
    constructor(scene, x, y, config) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.config = config;

        // Configuração padrão
        this.color = config.color || 0x8be9fd;
        this.width = config.width || 50;
        this.height = config.height || 80;
        this.label = config.label || '';
        this.isPhysics = config.isPhysics || false;
        this.hasPedestal = config.hasPedestal !== undefined ? config.hasPedestal : true;
        this.hasHalo = config.hasHalo !== undefined ? config.hasHalo : true;

        this.sprite = this.createSprite();
        this.halo = this.hasHalo ? this.createHalo() : null;
    }

    createSprite() {
        // Desenha o pedestal primeiro (para que apareça atrás do sprite)
        if (this.hasPedestal) {
            this.pedestal = this.scene.add.ellipse(this.x, this.y + 40, 80, 25, 0x000000, 0.5);
        }

        const graphics = this.scene.add.graphics();
        graphics.fillStyle(this.color, 0.95);
        graphics.fillRect(0, 0, this.width, this.height);
        graphics.lineStyle(3, 0xffffff);
        graphics.strokeRect(0, 0, this.width, this.height);
        
        const textureKey = `char_${this.config.id || 'default'}`;
        graphics.generateTexture(textureKey, this.width, this.height);
        graphics.destroy();

        let sprite;
        if (this.isPhysics) {
            sprite = this.scene.physics.add.sprite(this.x, this.y, textureKey);
        } else {
            sprite = this.scene.add.image(this.x, this.y, textureKey);
        }

        // Desenha o rótulo se fornecido
        if (this.label) {
            const label = this.scene.add.text(this.x, this.y - this.height / 2 - 15, this.label, {
                fontFamily: 'Outfit, Arial, sans-serif',
                fontSize: '16px',
                color: '#f8f8f2',
                backgroundColor: '#1a1a2e',
                padding: { x: 8, y: 4 }
            }).setOrigin(0.5);
            sprite.label = label;
        }

        return sprite;
    }

    createHalo() {
        const halo = this.scene.add.rectangle(
            this.x,
            this.y,
            this.width + 20,
            this.height + 30,
            this.color,
            0.25
        );

        this.scene.tweens.add({
            targets: halo,
            scale: { from: 0.8, to: 1.2 },
            alpha: { from: 0.2, to: 0.4 },
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        return halo;
    }

    updatePosition() {
        if (this.pedestal) {
            this.pedestal.x = this.sprite.x;
            this.pedestal.y = this.sprite.y + 40;
        }
        if (this.halo) {
            this.halo.x = this.sprite.x;
            this.halo.y = this.sprite.y;
        }
        if (this.sprite.label) {
            this.sprite.label.x = this.sprite.x;
            this.sprite.label.y = this.sprite.y - this.height / 2 - 15;
        }
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        const characterY = height * 0.525;

        // Estado do jogo
        this.isWalking = true;
        this.currentNodeKey = null;
        this.obstacles = [];
        this.currentObstacleIndex = 0;
        this.storyQueue = [];
        this.queueIndex = 0;

        // Configuração do contêiner de sprites DOM para GIFs animados
        const uiLayer = document.getElementById('ui-layer');
        this.domSprites = {};
        
        if (uiLayer) {
            const oldContainer = document.getElementById('dom-sprites-container');
            if (oldContainer) oldContainer.remove();
            
            this.domSpritesContainer = document.createElement('div');
            this.domSpritesContainer.id = 'dom-sprites-container';
            this.domSpritesContainer.style.position = 'absolute';
            this.domSpritesContainer.style.top = '0';
            this.domSpritesContainer.style.left = '0';
            this.domSpritesContainer.style.width = '100%';
            this.domSpritesContainer.style.height = '100%';
            this.domSpritesContainer.style.pointerEvents = 'none';
            uiLayer.appendChild(this.domSpritesContainer);
            
            this.events.on('shutdown', () => {
                if (this.domSpritesContainer) this.domSpritesContainer.remove();
            });
        }

        // ==================== INTEGRAR COM GAME ENGINE ====================
        if (window.gameEngine) {
            window.gameEngine.onStateChange = (oldState, newState, data) => {
                this.handleStateChange(oldState, newState, data);
            };
            window.gameScene = this;
        }

        // Define limites e desabilita gravidade
        this.physics.world.setBounds(0, 0, width * 3, height);
        this.physics.world.gravity.y = 0;

        // Configuração de Fundo Parallax (5 camadas)
        this.parallaxLayers = [
            { sprite: this.createParallaxLayer(0, 'forest_layer_0', width, height), factor: 0.05 },
            { sprite: this.createParallaxLayer(1, 'forest_layer_1', width, height), factor: 0.15 },
            { sprite: this.createParallaxLayer(2, 'forest_layer_2', width, height), factor: 0.4 },
            { sprite: this.createParallaxLayer(3, 'forest_layer_3', width, height), factor: 0.7 },
            { sprite: this.createParallaxLayer(4, 'forest_layer_4', width, height), factor: 1.0 }
        ];

        // Cria herói usando a classe Character
        if (this.textures.exists('sprite_arthur')) {
            this.hero = this.physics.add.sprite(100, characterY, 'sprite_arthur')
                .setScale(0.8);
            this.heroCharacter = null;
        } else {
            this.heroCharacter = new Character(this, 100, characterY, {
                id: 'hero',
                color: 0x8be9fd,
                width: 50,
                height: 80,
                isPhysics: true,
                hasPedestal: true,
                hasHalo: false
            });
            this.hero = this.heroCharacter.sprite;
            this.heroHalo = this.heroCharacter.halo;
        }

        // Adiciona a sobreposição de GIF DOM para Arthur
        this.createDOMSprite('arthur', this.hero, 0.8, 128);

        // Define posições de obstáculos/encontros (coordenadas X)
        this.obstacles = [
            { x: 500, type: 'mage', node: 'cenario_1_inicio' },
            { x: 1200, type: 'merchant', node: 'cenario_2_inicio' },
            { x: 2000, type: 'door', node: 'cenario_3_inicio' }
        ];

        // Cria sprites de obstáculos usando a classe Character
        this.obstacleCharacters = [];
        this.obstacles.forEach((obs, index) => {
            const spriteKey = `sprite_${obs.type}`;
            let sprite;
            
            if (this.textures.exists(spriteKey)) {
                sprite = this.add.image(obs.x, characterY, spriteKey)
                    .setScale(0.8);
            } else {
                // Configurações de personagem para cada tipo de obstáculo
                const characterConfigs = {
                    mage: {
                        id: 'mage',
                        color: 0xbd93f9,
                        width: 50,
                        height: 80,
                        label: '🧙‍♂️ Eldrin',
                        isPhysics: false,
                        hasPedestal: true,
                        hasHalo: false
                    },
                    merchant: {
                        id: 'merchant',
                        color: 0xf1fa8c,
                        width: 50,
                        height: 80,
                        label: '🎒 Gorb',
                        isPhysics: false,
                        hasPedestal: true,
                        hasHalo: false
                    },
                    door: {
                        id: 'door',
                        color: 0xff5555,
                        width: 50,
                        height: 80,
                        label: '🚪 Porta',
                        isPhysics: false,
                        hasPedestal: true,
                        hasHalo: false
                    }
                };

                const config = characterConfigs[obs.type] || characterConfigs.mage;
                const character = new Character(this, obs.x, characterY, config);
                sprite = character.sprite;
                this.obstacleCharacters.push(character);
            }
            
            sprite.setData('index', index);
            sprite.setData('node', obs.node);

            // Adiciona a sobreposição de GIF DOM para este obstáculo (Porta usa frame de sprite maior)
            const defaultSize = (obs.type === 'door') ? 160 : 128;
            this.createDOMSprite(obs.type, sprite, 0.8, defaultSize);
        });

        // Configuração da câmera - acompanhamento horizontal manual apenas
        this.cameras.main.setZoom(1);

        // Oculta todos os diálogos no carregamento inicial do UI DOM
        if (window.UIManager) {
            window.UIManager.hideDialogue();
            window.UIManager.hideChoices();
            window.UIManager.updateHUD();
        }

        // Inicia caminhada
        this.startWalking();

        // Carrega nó narrativo de introdução
        this.loadNode('intro');

        // Adiciona listener para recarregar cena quando a tela mudar de tamanho
        this.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
            console.log('[GameScene] Tela alterado - recarregando cena');
            this.scene.restart();
        });
    }

    handleStateChange(oldState, newState, data) {
        console.log(`[GameScene] Transição de estado: ${oldState} -> ${newState}`, data);

        switch (newState) {
            case 'WALKING':
                if (window.UIManager) {
                    window.UIManager.hideDialogue();
                    window.UIManager.hideChoices();
                }
                this.currentObstacleIndex++;
                // this.cameras.main.zoomTo(1, 500, 'Power2');
                this.startWalking();
                break;

            case 'INSPECTING':
                if (data.nodeKey) {
                    this.loadNode(data.nodeKey);
                }
                break;

            case 'FIGHTING_RESOLVED':
                // Tratado diretamente dentro da lógica de clique handleChoice
                break;

            case 'MENU':
                if (window.UIManager) window.UIManager.showScreen('menu');
                this.scene.start('MenuScene');
                break;

            case 'FINAL':
                if (window.UIManager) window.UIManager.showScreen('final');
                this.scene.start('FinalScene');
                break;
        }
    }

    startWalking() {
        this.isWalking = true;
        this.hero.setVelocityX(CONSTANTS.WALK_SPEED || 100);
    }

    stopWalking() {
        this.isWalking = false;
        this.hero.setVelocityX(0);
    }

    update() {
        // Acompanhamento horizontal manual da câmera (apenas quando não em diálogo)
        if (this.hero && this.isWalking) {
            const targetX = this.hero.x - this.cameras.main.width / 2;
            this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, targetX, 0.1);
        }

        // Mantém scrollY fixo para evitar que o zoom mova personagens verticalmente
        this.cameras.main.scrollY = 0;

        // Sincroniza posição do personagem herói (halo, rótulo)
        if (this.heroCharacter) {
            this.heroCharacter.updatePosition();
        } else if (this.heroHalo && this.hero) {
            // Fallback para herói baseado em assets
            this.heroHalo.x = this.hero.x;
            this.heroHalo.y = this.hero.y;
        }

        // Sincroniza posições dos personagens obstáculos (halo, rótulo)
        if (this.obstacleCharacters) {
            this.obstacleCharacters.forEach(char => char.updatePosition());
        }

        // Atualiza posição de rolagem das camadas parallax com base no movimento da câmera
        if (this.parallaxLayers) {
            const camScrollX = this.cameras.main.scrollX;
            this.parallaxLayers.forEach(layer => {
                layer.sprite.tilePositionX = camScrollX * layer.factor;
            });
        }

        // Atualiza posições dos sprites DOM para corresponder aos sprites de física do Phaser
        if (this.domSprites) {
            const cam = this.cameras.main;
            const zoom = cam.zoom;
            Object.keys(this.domSprites).forEach(key => {
                const spriteData = this.domSprites[key];
                const phaserSprite = spriteData.phaserSprite;
                const el = spriteData.element;
                
                if (phaserSprite && el && el.style.display !== 'none') {
                    // Calculate screen position based on camera scroll and zoom
                    const screenX = (phaserSprite.x - cam.scrollX) * zoom;
                    const screenY = (phaserSprite.y - cam.scrollY) * zoom;
                    
                    const size = spriteData.defaultSize * phaserSprite.scaleX * zoom;
                    
                    el.style.width = `${size}px`;
                    el.style.height = `${size}px`;
                    el.style.left = `${screenX - size / 2}px`;
                    el.style.top = `${screenY - size * spriteData.originY}px`;
                    
                    // Espelhamento (virar horizontalmente) com base na velocidade
                    if (phaserSprite.body && phaserSprite.body.velocity) {
                        if (phaserSprite.body.velocity.x < 0) {
                            el.style.transform = 'scaleX(-1)';
                        } else if (phaserSprite.body.velocity.x > 0) {
                            el.style.transform = 'scaleX(1)';
                        }
                    }
                }
            });
        }

        // Aciona inspeção quando o herói chega ao próximo obstáculo
        if (this.isWalking && this.currentObstacleIndex < this.obstacles.length) {
            const obstacle = this.obstacles[this.currentObstacleIndex];
            const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, obstacle.x, this.hero.y);

            if (distance < 200) {
                this.triggerEncounter(obstacle);
            }
        }
    }

    triggerEncounter(obstacle) {
        this.stopWalking();

        if (window.gameEngine) {
            window.gameEngine.startInspecting(obstacle);
        }

        // Foco visual (apenas panorâmica horizontal)
        this.cameras.main.pan(obstacle.x, this.cameras.main.scrollY, 800, 'Power2');
    }

    focusCameraOnSpeaker(speaker) {
        let targetX = this.hero.x;

        // Mapeia nomes de falantes para tipos de obstáculos
        const speakerToType = {
            'Arthur': 'hero',
            'Mago Eldrin': 'mage',
            'Eldrin': 'mage',
            'Mercador Gorb': 'merchant',
            'Gorb': 'merchant',
            'Porta do Conhecimento': 'door',
            'Porta': 'door'
        };

        const type = speakerToType[speaker];

        if (type === 'hero') {
            targetX = this.hero.x;
        } else if (type && this.obstacleCharacters) {
            const character = this.obstacleCharacters.find(char => char.config.id === type);
            if (character) {
                targetX = character.sprite.x;
            }
        }

        // Move a câmera para o falante (apenas horizontal)
        this.cameras.main.pan(targetX, this.cameras.main.scrollY, 500, 'Power2');
    }

    loadNode(nodeKey) {
        this.currentNodeKey = nodeKey;
        const node = StoryNodes[nodeKey];
        if (!node) return;

        // Garante que o jogador fique parado enquanto o diálogo estiver ativo
        this.stopWalking();

        // Revela NPCs dinamicamente no painel JSON conforme o jogador os encontra
        if (node.json_data && window.gameEngine) {
            if (nodeKey.includes('cenario_1')) {
                // Mago Eldrin: revela no primeiro encontro, depois atualiza com dados do nó
                window.gameEngine.revealNPC('mago', node.json_data.npc || {});
            } else if (nodeKey.includes('cenario_2')) {
                // Mercador Gorb: revela ao chegar no mercado
                window.gameEngine.revealNPC('mercador', node.json_data.npc || {});
            } else if (nodeKey.includes('cenario_3')) {
                // Porta do Conhecimento: revela no último cenário
                window.gameEngine.revealNPC('porta', node.json_data.objeto || {});
                // Também atualiza inventário do herói com os dados do cenário
                if (node.json_data.heroi && node.json_data.heroi.inventario) {
                    Object.assign(window.gameEngine.databases.inventario, node.json_data.heroi.inventario);
                    window.gameEngine.triggerDatabaseUpdate('inventario');
                }
            }
        }

        this.storyQueue = [...node.dialogs];
        this.queueIndex = 0;

        if (window.UIManager) {
            window.UIManager.hideChoices();
        }

        this.playNextDialog(node);
    }

    playNextDialog(currentNodeObj) {
        if (this.queueIndex < this.storyQueue.length) {
            const item = this.storyQueue[this.queueIndex];
            this.queueIndex++;

            // Foca a câmera no falante
            this.focusCameraOnSpeaker(item.speaker);

            if (window.UIManager) {
                window.UIManager.showDialogue(item.speaker, item.text, () => {
                    this.playNextDialog(currentNodeObj);
                });
            }
        } else {
            // Diálogo concluído, exibe opções de escolha
            if (currentNodeObj.choices) {
                // Se houver apenas uma escolha de transição de caminhada/fim, avança automaticamente
                if (currentNodeObj.choices.length === 1 && currentNodeObj.choices[0].target && 
                    (currentNodeObj.choices[0].target.endsWith('_inicio') || currentNodeObj.choices[0].target === 'final')) {
                    const singleChoice = currentNodeObj.choices[0];
                    this.handleChoice(singleChoice);
                } else {
                    if (window.UIManager) {
                        window.UIManager.showChoices(currentNodeObj.choices, (choice) => {
                            this.handleChoice(choice);
                        });
                    }
                }
            }
        }
    }

    handleChoice(choice) {
        if (window.UIManager) {
            window.UIManager.hideChoices();
        }

        // Se a escolha não tiver a propriedade 'correct', é uma transição neutra de história
        if (choice.correct === undefined) {
            this.proceedAfterChoice(choice);
            return;
        }

        if (window.gameEngine) {
            const isCorrect = window.gameEngine.handleChoice(choice);

            if (!isCorrect) {
                // Incorreto
                if (window.UIManager) {
                    window.UIManager.showFeedback(choice.feedback || "Resposta incorreta!", false);
                }
                this.time.delayedCall(2200, () => {
                    this.loadNode(this.currentNodeKey);
                });
            } else {
                // Correto
                if (choice.feedback) {
                    if (window.UIManager) {
                        window.UIManager.showFeedback(choice.feedback, true);
                    }
                    this.time.delayedCall(2200, () => {
                        window.gameEngine.resolveObstacle();
                        this.proceedAfterChoice(choice);
                    });
                } else {
                    window.gameEngine.resolveObstacle();
                    this.proceedAfterChoice(choice);
                }
            }
        } else {
            this.handleChoiceFallback(choice);
        }
    }

    handleChoiceFallback(choice) {
        if (choice.correct === false) {
            if (window.UIManager) {
                window.UIManager.showFeedback(choice.feedback, false);
            }
            this.time.delayedCall(2200, () => {
                this.loadNode(this.currentNodeKey);
            });
        } else {
            if (choice.feedback) {
                if (window.UIManager) {
                    window.UIManager.showFeedback(choice.feedback, true);
                }
                this.time.delayedCall(2200, () => {
                    this.proceedAfterChoice(choice);
                });
            } else {
                this.proceedAfterChoice(choice);
            }
        }
    }

    proceedAfterChoice(choice) {
        if (choice.target) {
            if (choice.target === 'final') {
                if (window.gameEngine) {
                    window.gameEngine.startFinal();
                } else {
                    this.scene.start('FinalScene');
                }
            } else if (choice.target === 'menu') {
                if (window.gameEngine) {
                    window.gameEngine.startMenu();
                } else {
                    this.scene.start('MenuScene');
                }
            } else if (choice.target.endsWith('_inicio')) {
                // Se é início de um novo cenário, fecha diálogo e volta a caminhar
                if (window.UIManager) {
                    window.UIManager.hideDialogue();
                    window.UIManager.hideChoices();
                }
                
                if (window.gameEngine && window.gameEngine.isState('INSPECTING')) {
                    window.gameEngine.setState('WALKING');
                } else {
                    this.startWalking();
                }
            } else {
                // Outro nó de diálogo sequencial (ex: intro -> cenario_1_inicio ou cenario_1_dialogo)
                this.loadNode(choice.target);
            }
        }
    }

    /**
     * Cria uma camada de fundo parallax (a partir de asset de imagem carregada ou fallback gerado)
     */
    createParallaxLayer(index, key, width, height) {
        if (this.textures.exists(key)) {
            // Obtém dimensões originais da textura
            const texture = this.textures.get(key);
            const textureWidth = texture.getSourceImage().width;
            const textureHeight = texture.getSourceImage().height;
            
            // Configura tileSprite: ladrilho horizontalmente, sem ladrilho vertical, centralizado
            const ts = this.add.tileSprite(width / 2, height / 2, width, textureHeight, key)
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0);
            
            return ts;
        }

        // Gera fallbacks de pixel art retrô de alta qualidade usando a paleta do tema Dracula
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        if (index === 0) {
            // Camada 0: Espaço profundo / Céu
            graphics.fillGradientStyle(0x0e0e1b, 0x0e0e1b, 0x1d1d35, 0x1d1d35, 1);
            graphics.fillRect(0, 0, width, height);
            
            // Estrelas brilhantes
            graphics.fillStyle(0x8be9fd, 0.4);
            for (let i = 0; i < 35; i++) {
                const rx = Phaser.Math.Between(0, width);
                const ry = Phaser.Math.Between(0, height * 0.55);
                graphics.fillCircle(rx, ry, Phaser.Math.Between(1, 3));
            }
            
            // Nuvens de nebulosas distantes e fracas
            graphics.fillStyle(0xbd93f9, 0.08);
            graphics.fillEllipse(width * 0.3, height * 0.25, 300, 100);
            graphics.fillEllipse(width * 0.7, height * 0.35, 400, 150);
            
        } else if (index === 1) {
            // Camada 1: Silhuetas de montanhas distantes/horizonte
            graphics.fillStyle(0x282a36, 1);
            graphics.beginPath();
            graphics.moveTo(0, height);
            let cx = 0;
            while (cx < width) {
                const nextX = cx + Phaser.Math.Between(100, 200);
                const peakY = height * 0.52 + Phaser.Math.Between(-30, 25);
                graphics.lineTo(cx, height);
                graphics.lineTo(nextX, peakY);
                cx = nextX;
            }
            graphics.lineTo(width, height);
            graphics.closePath();
            graphics.fillPath();
            
        } else if (index === 2) {
            // Camada 2: Floresta de pinheiros em segundo plano
            graphics.fillStyle(0x44475a, 1);
            for (let cx = 15; cx < width; cx += Phaser.Math.Between(45, 80)) {
                const treeH = Phaser.Math.Between(90, 150);
                const topY = height * 0.67 - treeH;
                graphics.beginPath();
                graphics.moveTo(cx, topY);
                graphics.lineTo(cx - 25, height * 0.67);
                graphics.lineTo(cx + 25, height * 0.67);
                graphics.closePath();
                graphics.fillPath();
                // Desenha o tronco até o fundo
                graphics.fillRect(cx - 4, height * 0.67, 8, height * 0.33);
            }
            
        } else if (index === 3) {
            // Camada 3: Árvores em primeiro plano, caminho e solo caminhável
            // Desenha o solo
            graphics.fillStyle(0x1a1a2e, 1);
            graphics.fillRect(0, height * 0.68, width, height * 0.32);
            
            // Desenha detalhes do caminho
            graphics.fillStyle(0x6272a4, 0.4);
            graphics.fillRect(0, height * 0.68, width, 18);
            
            // Desenha lâminas de grama e detalhes
            graphics.fillStyle(0x50fa7b, 0.95);
            graphics.fillRect(0, height * 0.68 - 4, width, 4);
            for (let cx = 0; cx < width; cx += 12) {
                graphics.fillRect(cx, height * 0.68 - 8, 4, 4);
            }
        }

        graphics.generateTexture(key, width, height);
        graphics.destroy();

        return this.add.tileSprite(width / 2, height / 2, width, height, key)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);
    }

    /**
     * Cria uma sobreposição de elemento de imagem DOM para reproduzir arquivos GIF animados
     */
    createDOMSprite(key, phaserSprite, originY = 0.5, defaultSize = 128) {
        if (!this.domSpritesContainer) return;
        
        const path = ASSETS.sprites[key];
        if (!path) return;
        
        const img = document.createElement('img');
        img.src = path;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.imageRendering = 'pixelated'; // Mantém a pixel art nítida!
        img.style.display = 'block';
        
        // Oculta visualmente o sprite original do Phaser, mas o mantém para física
        phaserSprite.setAlpha(0);
        
        img.onerror = () => {
            img.style.display = 'none';
            phaserSprite.setAlpha(1);
        };
        
        this.domSpritesContainer.appendChild(img);
        this.domSprites[key] = {
            element: img,
            phaserSprite: phaserSprite,
            originY: originY,
            defaultSize: defaultSize
        };
    }
}
