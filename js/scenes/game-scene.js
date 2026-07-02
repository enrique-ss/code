/**
 * CENA DO JOGO - Side-scrolling com movimentação automática
 * Conforme Seção 7.1 (Jornada do Jogador) e 7.2 (Telas Principais) do GDD
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
                fontFamily: 'Arial, sans-serif',
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
        this.obstacles = [];
        this.currentObstacleIndex = 0;

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

        // Define posições de obstáculos/encontros (coordenadas X)
        this.obstacles = [
            { x: 500, type: 'mage', node: 'cenario_1_inicio' },
            { x: 950, type: 'slime', node: 'combate_slime' },
            { x: 1400, type: 'merchant', node: 'cenario_2_inicio' },
            { x: 1850, type: 'goblin', node: 'combate_goblin' },
            { x: 2300, type: 'door', node: 'cenario_3_inicio' }
        ];

        // Cria sprites de obstáculos usando a classe Character
        this.obstacleCharacters = [];
        this.obstacles.forEach((obs, index) => {
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
                slime: {
                    id: 'slime',
                    color: 0x50fa7b,
                    width: 50,
                    height: 50,
                    label: '🟢 Slime',
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
                goblin: {
                    id: 'goblin',
                    color: 0xff5555,
                    width: 50,
                    height: 70,
                    label: '👺 Goblin',
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
            this.obstacleCharacters.push(character);
        });

        // Configuração da câmera
        this.cameras.main.setZoom(1);

        // Inicia caminhada
        this.startWalking();

        // Adiciona listener para recarregar cena quando a tela mudar de tamanho
        this.scale.on('resize', (gameSize, baseSize, displaySize, resolution) => {
            console.log('[GameScene] Tela alterado - recarregando cena');
            this.scene.restart();
        });
    }

    startWalking() {
        this.isWalking = true;
        this.hero.setVelocityX(100);
    }

    stopWalking() {
        this.isWalking = false;
        this.hero.setVelocityX(0);
    }

    update() {
        // Acompanhamento horizontal manual da câmera
        if (this.hero && this.isWalking) {
            const targetX = this.hero.x - this.cameras.main.width / 2;
            this.cameras.main.scrollX = Phaser.Math.Linear(this.cameras.main.scrollX, targetX, 0.1);
        }

        // Mantém scrollY fixo
        this.cameras.main.scrollY = 0;

        // Atualiza posições dos personagens
        if (this.heroCharacter) {
            this.heroCharacter.updatePosition();
        }

        this.obstacleCharacters.forEach(char => {
            char.updatePosition();
        });

        // Atualiza posição de rolagem das camadas parallax
        if (this.parallaxLayers) {
            const camScrollX = this.cameras.main.scrollX;
            this.parallaxLayers.forEach(layer => {
                layer.sprite.tilePositionX = camScrollX * layer.factor;
            });
        }
    }

    createParallaxLayer(index, key, width, height) {
        if (this.textures.exists(key)) {
            const texture = this.textures.get(key);
            const textureHeight = texture.getSourceImage().height;
            
            const ts = this.add.tileSprite(width / 2, height / 2, width, textureHeight, key)
                .setOrigin(0.5, 0.5)
                .setScrollFactor(0);
            
            return ts;
        }

        // Fallback: gera textura procedural
        const graphics = this.make.graphics({ x: 0, y: 0, add: false });
        
        if (index === 0) {
            graphics.fillGradientStyle(0x0e0e1b, 0x0e0e1b, 0x1d1d35, 0x1d1d35, 1);
            graphics.fillRect(0, 0, width, height);
        } else if (index === 1) {
            graphics.fillStyle(0x282a36, 1);
            graphics.fillRect(0, height * 0.5, width, height * 0.5);
        } else if (index === 2) {
            graphics.fillStyle(0x44475a, 1);
            graphics.fillRect(0, height * 0.55, width, height * 0.45);
        } else if (index === 3) {
            graphics.fillStyle(0x1a1a2e, 1);
            graphics.fillRect(0, height * 0.6, width, height * 0.4);
        } else {
            graphics.fillStyle(0x1a1a2e, 1);
            graphics.fillRect(0, height * 0.65, width, height * 0.35);
        }

        graphics.generateTexture(key, width, height);
        graphics.destroy();

        return this.add.tileSprite(width / 2, height / 2, width, height, key)
            .setOrigin(0.5, 0.5)
            .setScrollFactor(0);
    }
}
