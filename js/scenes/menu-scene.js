/**
 * MENU SCENE - Background and visuals for main menu
 */

class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background with fallback (larger than canvas to prevent gaps)
        if (this.textures.exists('bg_menu')) {
            this.menuBg = this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            // Draw a beautiful dark space background
            this.menuBg = this.add.graphics();
            this.menuBg.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x241d3b, 0x241d3b, 1);
            this.menuBg.fillRect(-200, -200, width + 400, height + 400);
        }

        // Handle resize to keep background covering full viewport
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
}
