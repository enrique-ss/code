/**
 * CENA DE CRIAÇÃO DE PERSONAGEM - Seleção de classe
 * Conforme Seção 7.2 (Telas Principais) e RF01 do GDD
 */

class CharacterCreationScene extends Phaser.Scene {
    constructor() {
        super('CharacterCreationScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background
        if (this.textures.exists('bg_menu')) {
            this.charBg = this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            this.charBg = this.add.graphics();
            this.charBg.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x1d1a39, 0x1d1a39, 1);
            this.charBg.fillRect(-200, -200, width + 400, height + 400);
        }

        // Título
        this.add.text(width / 2, height * 0.15, 'ESCOLHA SUA CLASSE', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Botão Guerreiro
        const btnGuerreiro = this.add.text(width / 2, height * 0.35, 'GUERREIRO', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff6b6b',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.selecionarClasse('guerreiro');
          })
          .on('pointerover', () => btnGuerreiro.setStyle({ backgroundColor: '#e05555' }))
          .on('pointerout', () => btnGuerreiro.setStyle({ backgroundColor: '#ff6b6b' }));

        // Descrição do Guerreiro
        this.add.text(width / 2, height * 0.42, 'Focado em força física', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Botão Mago
        const btnMago = this.add.text(width / 2, height * 0.55, 'MAGO', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4ecdc4',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.selecionarClasse('mago');
          })
          .on('pointerover', () => btnMago.setStyle({ backgroundColor: '#3dbdb5' }))
          .on('pointerout', () => btnMago.setStyle({ backgroundColor: '#4ecdc4' }));

        // Descrição do Mago
        this.add.text(width / 2, height * 0.62, 'Focado em conhecimento e magia', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Botão Arqueiro
        const btnArqueiro = this.add.text(width / 2, height * 0.75, 'ARQUEIRO', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#95e1d3',
            padding: { x: 30, y: 15 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.selecionarClasse('arqueiro');
          })
          .on('pointerover', () => btnArqueiro.setStyle({ backgroundColor: '#7dd1c2' }))
          .on('pointerout', () => btnArqueiro.setStyle({ backgroundColor: '#95e1d3' }));

        // Descrição do Arqueiro
        this.add.text(width / 2, height * 0.82, 'Focado em precisão e agilidade', {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Botão Voltar
        const btnVoltar = this.add.text(width * 0.2, height * 0.92, 'VOLTAR', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#6c757d',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('MenuScene');
          })
          .on('pointerover', () => btnVoltar.setStyle({ backgroundColor: '#5a6268' }))
          .on('pointerout', () => btnVoltar.setStyle({ backgroundColor: '#6c757d' }));

        // Botão Confirmar (inicialmente desabilitado)
        this.btnConfirmar = this.add.text(width * 0.8, height * 0.92, 'CONFIRMAR', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#28a745',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.confirmarClasse();
          })
          .on('pointerover', () => this.btnConfirmar.setStyle({ backgroundColor: '#218838' }))
          .on('pointerout', () => this.btnConfirmar.setStyle({ backgroundColor: '#28a745' }));

        this.classeSelecionada = null;

        // Handle resize
        this.scale.on('resize', (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;
            if (this.charBg && this.charBg.setDisplaySize) {
                this.charBg.setPosition(w / 2, h / 2);
                this.charBg.setDisplaySize(w * 1.3, h * 1.3);
            } else if (this.charBg && this.charBg.clear) {
                this.charBg.clear();
                this.charBg.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x1d1a39, 0x1d1a39, 1);
                this.charBg.fillRect(-200, -200, w + 400, h + 400);
            }
        });
    }

    selecionarClasse(classeId) {
        this.classeSelecionada = classeId;
        console.log('Classe selecionada:', classeId);
    }

    confirmarClasse() {
        if (!this.classeSelecionada) {
            console.log('Nenhuma classe selecionada');
            return;
        }

        // TODO: Integrar com ClassManager e GameState
        // Por enquanto, apenas avança para a cena do jogo
        this.scene.start('GameScene');
    }
}
