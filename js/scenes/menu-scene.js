/**
 * MENU SCENE - Tela principal do menu
 * Conforme Seção 7.2 (Telas Principais) do GDD
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fundo com fallback
        if (this.textures.exists('bg_menu')) {
            this.menuBg = this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            this.menuBg = this.add.graphics();
            this.menuBg.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x241d3b, 0x241d3b, 1);
            this.menuBg.fillRect(-200, -200, width + 400, height + 400);
        }

        // Título do jogo
        this.add.text(width / 2, height * 0.2, 'CODE QUEST', {
            fontSize: '64px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Botão Iniciar Jogo
        const btnIniciar = this.add.text(width / 2, height * 0.5, 'INICIAR JOGO', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4a90e2',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.scene.start('CharacterCreationScene');
          })
          .on('pointerover', () => btnIniciar.setStyle({ backgroundColor: '#357abd' }))
          .on('pointerout', () => btnIniciar.setStyle({ backgroundColor: '#4a90e2' }));

        // Botão Sobre
        const btnSobre = this.add.text(width / 2, height * 0.65, 'SOBRE', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#50fa7b',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.mostrarModalSobre();
          })
          .on('pointerover', () => btnSobre.setStyle({ backgroundColor: '#45c96b' }))
          .on('pointerout', () => btnSobre.setStyle({ backgroundColor: '#50fa7b' }));

        // Botão Tela Cheia
        const btnTelaCheia = this.add.text(width / 2, height * 0.8, 'TELA CHEIA', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff79c6',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              if (this.scale.isFullscreen) {
                  this.scale.stopFullscreen();
              } else {
                  this.scale.startFullscreen();
              }
          })
          .on('pointerover', () => btnTelaCheia.setStyle({ backgroundColor: '#e05e9e' }))
          .on('pointerout', () => btnTelaCheia.setStyle({ backgroundColor: '#ff79c6' }));

        // Trata redimensionamento
        this.scale.on('resize', (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;
            if (this.menuBg && this.menuBg.setDisplaySize) {
                this.menuBg.setPosition(w / 2, h / 2);
                this.menuBg.setDisplaySize(w * 1.3, h * 1.3);
            } else if (this.menuBg && this.menuBg.clear) {
                this.menuBg.clear();
                this.menuBg.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x241d3b, 0x241d3b, 1);
                this.menuBg.fillRect(-200, -200, w + 400, h + 400);
            }
        });
    }

    mostrarModalSobre() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fundo escuro semi-transparente
        this.modalBg = this.add.graphics();
        this.modalBg.fillStyle(0x000000, 0.7);
        this.modalBg.fillRect(0, 0, width, height);
        this.modalBg.setInteractive();

        // Container do modal
        const modalWidth = Math.min(600, width * 0.8);
        const modalHeight = Math.min(400, height * 0.8);
        const modalX = (width - modalWidth) / 2;
        const modalY = (height - modalHeight) / 2;

        // Fundo do modal
        this.modalContainer = this.add.graphics();
        this.modalContainer.fillStyle(0x1a1a2e, 0.95);
        this.modalContainer.fillRoundedRect(modalX, modalY, modalWidth, modalHeight, 15);
        this.modalContainer.lineStyle(3, 0x4a90e2, 1);
        this.modalContainer.strokeRoundedRect(modalX, modalY, modalWidth, modalHeight, 15);

        // Título
        this.add.text(width / 2, modalY + 30, 'SOBRE CODE QUEST', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ff79c6',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Texto do sobre
        const sobreText = 'Code Quest é um jogo de aventura 2D narrativo com sistema de eventos dinâmicos.\n\n' +
                         'Desenvolvido com Phaser 3 e JavaScript.\n\n' +
                         'Explore um mundo onde suas escolhas moldam o destino através do sistema de Karma.\n\n' +
                         'Versão: 1.0.0 MVP';

        this.add.text(width / 2, modalY + 80, sobreText, {
            fontSize: '18px',
            fontFamily: 'Arial',
            color: '#f8f8f2',
            align: 'center',
            wordWrap: { width: modalWidth - 60 }
        }).setOrigin(0.5);

        // Botão Fechar
        const btnFechar = this.add.text(width / 2, modalY + modalHeight - 40, 'FECHAR', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#ff5555',
            padding: { x: 30, y: 12 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.fecharModalSobre();
          })
          .on('pointerover', () => btnFechar.setStyle({ backgroundColor: '#e04444' }))
          .on('pointerout', () => btnFechar.setStyle({ backgroundColor: '#ff5555' }));

        // Clicar no fundo fecha o modal
        this.modalBg.on('pointerdown', () => {
            this.fecharModalSobre();
        });
    }

    fecharModalSobre() {
        if (this.modalBg) {
            this.modalBg.destroy();
        }
        if (this.modalContainer) {
            this.modalContainer.destroy();
        }
    }
}
