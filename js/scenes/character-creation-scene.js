/**
 * CENA DE CRIAÇÃO DE PERSONAGEM - Visuais de fundo
 */

class CharacterCreationScene extends Phaser.Scene {
    constructor() {
        super('CharacterCreationScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background (larger than canvas to prevent gaps)
        if (this.textures.exists('bg_menu')) {
            this.charBg = this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            // Draw a beautiful dark space background
            this.charBg = this.add.graphics();
            this.charBg.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x1d1a39, 0x1d1a39, 1);
            this.charBg.fillRect(-200, -200, width + 400, height + 400);
        }

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
}
