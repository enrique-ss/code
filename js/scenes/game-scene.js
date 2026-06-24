/**
 * GAME SCENE - Side-scroller and physics sync with DOM UI overlays
 */

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Game state
        this.isWalking = true;
        this.currentNodeKey = null;
        this.obstacles = [];
        this.currentObstacleIndex = 0;
        this.storyQueue = [];
        this.queueIndex = 0;

        // Setup DOM sprites container for animated GIFs
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

        // Set bounds
        this.physics.world.setBounds(0, 0, width * 3, height);

        // Setup Parallax Background (5 layers)
        this.parallaxLayers = [
            { sprite: this.createParallaxLayer(0, 'forest_layer_0', width, height), factor: 0.05 },
            { sprite: this.createParallaxLayer(1, 'forest_layer_1', width, height), factor: 0.15 },
            { sprite: this.createParallaxLayer(2, 'forest_layer_2', width, height), factor: 0.4 },
            { sprite: this.createParallaxLayer(3, 'forest_layer_3', width, height), factor: 0.7 },
            { sprite: this.createParallaxLayer(4, 'forest_layer_4', width, height), factor: 1.0 }
        ];

        // Create hero sprite (use visual graphic circle if asset is missing)
        if (this.textures.exists('sprite_arthur')) {
            this.hero = this.physics.add.sprite(100, height * 0.65, 'sprite_arthur')
                .setScale(0.8)
                .setCollideWorldBounds(true);
        } else {
            // Create a premium glowing representative for the hero
            this.hero = this.physics.add.sprite(100, height * 0.65);
            const graphics = this.add.graphics();
            graphics.fillStyle(0x8be9fd, 1);
            graphics.fillCircle(20, 20, 20);
            graphics.generateTexture('hero_placeholder', 40, 40);
            graphics.destroy();
            
            this.hero.setTexture('hero_placeholder');
            this.hero.setCollideWorldBounds(true);
            
            // Light halo effect around hero
            const halo = this.add.circle(0, 0, 35, 0x8be9fd, 0.25);
            this.tweens.add({
                targets: halo,
                scale: { from: 0.8, to: 1.2 },
                alpha: { from: 0.2, to: 0.4 },
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
            this.heroHalo = halo;
        }

        // Add the DOM GIF overlay for Arthur
        this.createDOMSprite('arthur', this.hero, 0.8, 128);

        // Define obstacles/encounters positions (X coordinates)
        this.obstacles = [
            { x: 500, type: 'mage', node: 'cenario_1_inicio' },
            { x: 1200, type: 'merchant', node: 'cenario_2_inicio' },
            { x: 2000, type: 'door', node: 'cenario_3_inicio' }
        ];

        // Create obstacle sprites
        this.obstacles.forEach((obs, index) => {
            const spriteKey = `sprite_${obs.type}`;
            let sprite;
            if (this.textures.exists(spriteKey)) {
                sprite = this.add.image(obs.x, height * 0.65, spriteKey)
                    .setScale(0.8);
            } else {
                // Colored graphic placeholders for the obstacles
                const colors = {
                    mage: 0xbd93f9,
                    merchant: 0xf1fa8c,
                    door: 0xff5555
                };
                const labels = {
                    mage: '🧙‍♂️ Eldrin',
                    merchant: '🎒 Gorb',
                    door: '🚪 Porta'
                };
                
                // Draw a nice pedestal/glow for the obstacles
                const pColor = colors[obs.type] || 0x8be9fd;
                this.add.ellipse(obs.x, height * 0.65 + 30, 80, 25, 0x000000, 0.5);
                
                sprite = this.add.rectangle(obs.x, height * 0.65, 50, 80, pColor, 0.95);
                sprite.setStrokeStyle(3, 0xffffff);
                
                const label = this.add.text(obs.x, height * 0.65 - 65, labels[obs.type], {
                    fontFamily: 'Outfit, Arial, sans-serif',
                    fontSize: '16px',
                    color: '#f8f8f2',
                    backgroundColor: '#1a1a2e',
                    padding: { x: 8, y: 4 }
                }).setOrigin(0.5);
            }
            
            sprite.setData('index', index);
            sprite.setData('node', obs.node);

            // Add the DOM GIF overlay for this obstacle (Door uses larger sprite frame)
            const defaultSize = (obs.type === 'door') ? 160 : 128;
            this.createDOMSprite(obs.type, sprite, 0.8, defaultSize);
        });

        // Setup camera to follow hero smoothly
        this.cameras.main.startFollow(this.hero, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);

        // Hide all dialogues on UI DOM initial loading
        if (window.UIManager) {
            window.UIManager.hideDialogue();
            window.UIManager.hideChoices();
            window.UIManager.updateHUD();
        }

        // Start walking
        this.startWalking();

        // Load introduction narrative node
        this.loadNode('intro');
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
                this.cameras.main.zoomTo(1, 500, 'Power2');
                this.startWalking();
                break;

            case 'INSPECTING':
                if (data.nodeKey) {
                    this.loadNode(data.nodeKey);
                }
                break;

            case 'FIGHTING_RESOLVED':
                // Handled directly inside handleChoice click logic
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
        // Sync halo position if applicable
        if (this.heroHalo && this.hero) {
            this.heroHalo.x = this.hero.x;
            this.heroHalo.y = this.hero.y;
        }

        // Update parallax layers scroll position based on camera movement
        if (this.parallaxLayers) {
            const camScrollX = this.cameras.main.scrollX;
            this.parallaxLayers.forEach(layer => {
                layer.sprite.tilePositionX = camScrollX * layer.factor;
            });
        }

        // Update DOM sprites positions to match Phaser physics sprites
        if (this.domSprites) {
            const cam = this.cameras.main;
            Object.keys(this.domSprites).forEach(key => {
                const spriteData = this.domSprites[key];
                const phaserSprite = spriteData.phaserSprite;
                const el = spriteData.element;
                
                if (phaserSprite && el && el.style.display !== 'none') {
                    // Calculate screen position based on camera scroll
                    const screenX = phaserSprite.x - cam.scrollX;
                    const screenY = phaserSprite.y - cam.scrollY;
                    
                    const size = spriteData.defaultSize * phaserSprite.scaleX;
                    
                    el.style.width = `${size}px`;
                    el.style.height = `${size}px`;
                    el.style.left = `${screenX - size / 2}px`;
                    el.style.top = `${screenY - size * spriteData.originY}px`;
                    
                    // Mirroring (flipping horizontally) based on velocity
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

        // Trigger inspection when hero arrives at next obstacle
        if (this.isWalking && this.currentObstacleIndex < this.obstacles.length) {
            const obstacle = this.obstacles[this.currentObstacleIndex];
            const distance = Phaser.Math.Distance.Between(this.hero.x, this.hero.y, obstacle.x, this.hero.y);

            if (distance < 60) {
                this.triggerEncounter(obstacle);
            }
        }
    }

    triggerEncounter(obstacle) {
        this.stopWalking();

        if (window.gameEngine) {
            window.gameEngine.startInspecting(obstacle);
        }

        // Visual zoom and focus
        this.cameras.main.pan(obstacle.x, this.hero.y, 800, 'Power2');
        this.cameras.main.zoomTo(1.15, 800, 'Power2');
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

            if (window.UIManager) {
                window.UIManager.showDialogue(item.speaker, item.text, () => {
                    this.playNextDialog(currentNodeObj);
                });
            }
        } else {
            // Dialogue completed, display choice options
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
                // Incorrect
                if (window.UIManager) {
                    window.UIManager.showFeedback(choice.feedback || "Resposta incorreta!", false);
                }
                this.time.delayedCall(2200, () => {
                    this.loadNode(this.currentNodeKey);
                });
            } else {
                // Correct
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
     * Creates a parallax background layer (either from loaded image asset or generated beautiful fallback)
     */
    createParallaxLayer(index, key, width, height) {
        if (this.textures.exists(key)) {
            // Get original texture dimensions
            const texture = this.textures.get(key);
            const textureHeight = texture.getSourceImage().height;
            
            // Setup tileSprite with original height (no vertical tiling), screen width (horizontal tiling)
            const ts = this.add.tileSprite(width / 2, height / 2, width, textureHeight, key)
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0);
            
            return ts;
        }

        // Generate high-quality retro styled pixel-art fallbacks using Dracula Theme palette
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        if (index === 0) {
            // Layer 0: Deep space / Sky
            graphics.fillGradientStyle(0x0e0e1b, 0x0e0e1b, 0x1d1d35, 0x1d1d35, 1);
            graphics.fillRect(0, 0, width, height);
            
            // Glowing stars
            graphics.fillStyle(0x8be9fd, 0.4);
            for (let i = 0; i < 35; i++) {
                const rx = Phaser.Math.Between(0, width);
                const ry = Phaser.Math.Between(0, height * 0.55);
                graphics.fillCircle(rx, ry, Phaser.Math.Between(1, 3));
            }
            
            // Distant faint nebula clouds
            graphics.fillStyle(0xbd93f9, 0.08);
            graphics.fillEllipse(width * 0.3, height * 0.25, 300, 100);
            graphics.fillEllipse(width * 0.7, height * 0.35, 400, 150);
            
        } else if (index === 1) {
            // Layer 1: Distant mountains/skyline silhouttes
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
            // Layer 2: Midground pine forest
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
                // Draw trunk down to bottom
                graphics.fillRect(cx - 4, height * 0.67, 8, height * 0.33);
            }
            
        } else if (index === 3) {
            // Layer 3: Foreground trees, path & walk ground
            // Draw soil
            graphics.fillStyle(0x1a1a2e, 1);
            graphics.fillRect(0, height * 0.68, width, height * 0.32);
            
            // Draw path detail
            graphics.fillStyle(0x6272a4, 0.4);
            graphics.fillRect(0, height * 0.68, width, 18);
            
            // Draw grass blades and detail
            graphics.fillStyle(0x50fa7b, 0.95);
            graphics.fillRect(0, height * 0.68 - 4, width, 4);
            for (let cx = 0; cx < width; cx += 12) {
                graphics.fillRect(cx, height * 0.68 - 8, 4, 4);
            }
        }

        graphics.generateTexture(key, width, height);
        graphics.destroy();

        return this.add.tileSprite(0, 0, width, height, key)
            .setOrigin(0, 0)
            .setScrollFactor(0);
    }

    /**
     * Creates a DOM image element overlay for playing animated GIF files
     */
    createDOMSprite(key, phaserSprite, originY = 0.5, defaultSize = 128) {
        if (!this.domSpritesContainer) return;
        
        const path = ASSETS.sprites[key];
        if (!path) return;
        
        const img = document.createElement('img');
        img.src = path;
        img.style.position = 'absolute';
        img.style.pointerEvents = 'none';
        img.style.imageRendering = 'pixelated'; // Keep pixel art sharp!
        img.style.display = 'block';
        
        // Hide the original Phaser sprite visually but keep it for physics
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
