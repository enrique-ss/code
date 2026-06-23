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

        // Background with fallback
        if (this.textures.exists('bg_menu')) {
            this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width, height);
        } else {
            // Draw a beautiful dark space background
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x241d3b, 0x241d3b, 1);
            graphics.fillRect(0, 0, width, height);
        }
    }
}
