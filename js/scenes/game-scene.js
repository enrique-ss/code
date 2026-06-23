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

        // ==================== INTEGRAR COM GAME ENGINE ====================
        if (window.gameEngine) {
            window.gameEngine.onStateChange = (oldState, newState, data) => {
                this.handleStateChange(oldState, newState, data);
            };
            window.gameScene = this;
        }

        // Set bounds
        this.physics.world.setBounds(0, 0, width * 3, height);

        // Background loading (use gradient fallback if image is missing)
        // Make it slightly wider and taller than the actual bounds to prevent gaps on zoom/shake
        if (this.textures.exists('bg_forest_path')) {
            this.background = this.add.image(width * 1.5, height / 2, 'bg_forest_path')
                .setDisplaySize(width * 3.6, height * 1.3);
        } else {
            // Create a gorgeous parallax style forest background
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x1d1a39, 0x1d1a39, 1);
            graphics.fillRect(-300, -200, width * 3 + 600, height + 400);
            
            // Add some simple glowing stars in Phaser
            for (let i = 0; i < 40; i++) {
                const sx = Phaser.Math.Between(-100, width * 3 + 100);
                const sy = Phaser.Math.Between(-100, height * 0.4);
                const size = Phaser.Math.Between(2, 4);
                const star = this.add.circle(sx, sy, size, 0x8be9fd, 0.4);
                
                this.tweens.add({
                    targets: star,
                    alpha: { from: 0.4, to: 0.8 },
                    duration: Phaser.Math.Between(1500, 3000),
                    yoyo: true,
                    repeat: -1
                });
            }
        }

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

        // Synchronize databases and trigger updates for tabs
        if (node.json_data && window.gameEngine) {
            if (nodeKey.includes('cenario_1')) {
                window.gameEngine.databases.npcs.mago = node.json_data.npc;
                window.gameEngine.triggerDatabaseUpdate('npcs');
            } else if (nodeKey.includes('cenario_2')) {
                window.gameEngine.databases.npcs.mercador = node.json_data.npc;
                window.gameEngine.triggerDatabaseUpdate('npcs');
            } else if (nodeKey.includes('cenario_3')) {
                window.gameEngine.databases.npcs.porta = node.json_data.objeto;
                window.gameEngine.databases.inventario = node.json_data.heroi.inventario;
                window.gameEngine.triggerDatabaseUpdate('npcs');
                window.gameEngine.triggerDatabaseUpdate('inventario');
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
}
