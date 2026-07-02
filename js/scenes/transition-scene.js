/**
 * CENA DE TRANSIÇÃO - Transição entre períodos/dias
 * Conforme Seção 7.2 (Telas Principais) do GDD
 */

class TransitionScene extends Phaser.Scene {
    constructor() {
        super('TransitionScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Fundo escuro
        this.bg = this.add.graphics();
        this.bg.fillStyle(0x000000, 1);
        this.bg.fillRect(0, 0, width, height);

        // Texto de transição
        this.transitionText = this.add.text(width / 2, height / 2, '', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        // Texto secundário
        this.subText = this.add.text(width / 2, height / 2 + 60, '', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#cccccc'
        }).setOrigin(0.5);

        // Fade in
        this.cameras.main.fadeIn(500, 0, 0, 0);

        // Dados da transição (passados via scene.start)
        const dia = this.registry.get('transitionDia') || 1;
        const periodo = this.registry.get('transitionPeriodo') || 'manha';
        const nextScene = this.registry.get('transitionNextScene') || 'GameScene';

        this.showTransition(dia, periodo, nextScene);
    }

    showTransition(dia, periodo, nextScene) {
        const periodos = {
            'manha': 'MANHÃ',
            'tarde': 'TARDE',
            'noite': 'NOITE'
        };

        this.transitionText.setText(`DIA ${dia}`);
        this.subText.setText(periodos[periodo] || periodo.toUpperCase());

        // Animação do texto
        this.tweens.add({
            targets: [this.transitionText, this.subText],
            alpha: { from: 0, to: 1 },
            y: { from: this.transitionText.y - 20, to: this.transitionText.y },
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Aguarda e depois transiciona
                this.time.delayedCall(2000, () => {
                    this.transitionToNextScene(nextScene);
                });
            }
        });
    }

    transitionToNextScene(nextScene) {
        // Fade out
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.time.delayedCall(500, () => {
            this.scene.start(nextScene);
        });
    }
}

// Exportar para uso global
window.TransitionScene = TransitionScene;
