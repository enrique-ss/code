/**
 * CENA DE DESFECHO - Tela final com base no Karma
 * Conforme Seção 7.2 (Telas Principais) e Seção 3.12 do GDD
 */

class FinalScene extends Phaser.Scene {
    constructor() {
        super('FinalScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fundo
        if (this.textures.exists('bg_final')) {
            this.finalBg = this.add.image(width / 2, height / 2, 'bg_final').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            this.finalBg = this.add.graphics();
            this.finalBg.fillGradientStyle(0x0a0518, 0x0a0518, 0x1d143c, 0x1d143c, 1);
            this.finalBg.fillRect(-200, -200, width + 400, height + 400);
        }

        // Efeito de estrelas cintilantes
        this.createStars();

        // Obter desfecho do EndingManager
        let desfecho = { tipo: 'neutro', narrativa: '', karma: 0, classe: '' };
        if (window.EndingManager && window.gameState) {
            const endingManager = new EndingManager(window.gameState);
            desfecho = endingManager.getDesfechoCompleto();
        }

        // Título do desfecho
        const tituloDesfecho = this.getTituloDesfecho(desfecho.tipo);
        const corDesfecho = this.getCorDesfecho(desfecho.tipo);

        this.add.text(width / 2, height * 0.15, tituloDesfecho, {
            fontSize: '56px',
            fontFamily: 'Arial',
            color: corDesfecho,
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);

        // Informações da classe e Karma
        this.add.text(width / 2, height * 0.28, `Classe: ${desfecho.classe || 'Desconhecida'}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#f8f8f2'
        }).setOrigin(0.5);

        this.add.text(width / 2, height * 0.33, `Karma: ${desfecho.karma}`, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: corDesfecho,
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Narrativa do desfecho
        const narrativa = desfecho.narrativa || 'Sua jornada chegou ao fim.';
        this.add.text(width / 2, height * 0.5, narrativa, {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#f8f8f2',
            align: 'center',
            wordWrap: { width: width * 0.8 }
        }).setOrigin(0.5);

        // Botão Menu Principal
        const btnMenu = this.add.text(width / 2, height * 0.75, 'MENU PRINCIPAL', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#4a90e2',
            padding: { x: 25, y: 12 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.returnToMenu();
          })
          .on('pointerover', () => btnMenu.setStyle({ backgroundColor: '#357abd' }))
          .on('pointerout', () => btnMenu.setStyle({ backgroundColor: '#4a90e2' }));

        // Botão Reiniciar
        const btnReiniciar = this.add.text(width / 2, height * 0.85, 'REINICIAR', {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            backgroundColor: '#50fa7b',
            padding: { x: 25, y: 12 }
        }).setOrigin(0.5)
          .setInteractive({ useHandCursor: true })
          .on('pointerdown', () => {
              this.restartGame();
          })
          .on('pointerover', () => btnReiniciar.setStyle({ backgroundColor: '#45c96b' }))
          .on('pointerout', () => btnReiniciar.setStyle({ backgroundColor: '#50fa7b' }));

        // Trata redimensionamento
        this.scale.on('resize', (gameSize) => {
            const w = gameSize.width;
            const h = gameSize.height;
            if (this.finalBg && this.finalBg.setDisplaySize) {
                this.finalBg.setPosition(w / 2, h / 2);
                this.finalBg.setDisplaySize(w * 1.3, h * 1.3);
            } else if (this.finalBg && this.finalBg.clear) {
                this.finalBg.clear();
                this.finalBg.fillGradientStyle(0x0a0518, 0x0a0518, 0x1d143c, 0x1d143c, 1);
                this.finalBg.fillRect(-200, -200, w + 400, h + 400);
            }
        });
    }

    getTituloDesfecho(tipo) {
        const titulos = {
            'bom': 'DESEFECHO BOM',
            'neutro': 'DESEFECHO NEUTRO',
            'ruim': 'DESEFECHO RUIM'
        };
        return titulos[tipo] || 'DESEFECHO';
    }

    getCorDesfecho(tipo) {
        const cores = {
            'bom': '#50fa7b',
            'neutro': '#f1fa8c',
            'ruim': '#ff5555'
        };
        return cores[tipo] || '#f1fa8c';
    }

    returnToMenu() {
        // Remover estado salvo (RF18)
        if (window.SaveManager) {
            const saveManager = new SaveManager();
            saveManager.remover();
        }

        // Reiniciar estado do jogo
        if (window.gameState) {
            window.gameState.reiniciar();
        }

        this.scene.start('MenuScene');
    }

    restartGame() {
        // Remover estado salvo (RF18)
        if (window.SaveManager) {
            const saveManager = new SaveManager();
            saveManager.remover();
        }

        // Reiniciar estado do jogo
        if (window.gameState) {
            window.gameState.reiniciar();
        }

        this.scene.start('CharacterCreationScene');
    }

    createStars() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        for (let i = 0; i < 60; i++) {
            const x = Phaser.Math.Between(-100, width + 100);
            const y = Phaser.Math.Between(-100, height + 100);
            const size = Phaser.Math.Between(1, 3);
            
            const star = this.add.rectangle(x, y, size, size, 0xffffff);
            star.setAlpha(Phaser.Math.FloatBetween(0.3, 1));

            this.tweens.add({
                targets: star,
                alpha: { from: star.alpha, to: 0.1 },
                duration: Phaser.Math.Between(1000, 3000),
                yoyo: true,
                repeat: -1
            });
        }
    }
}
