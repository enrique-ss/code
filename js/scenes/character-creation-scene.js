/**
 * CHARACTER CREATION SCENE - Background visuals
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
            this.add.image(width / 2, height / 2, 'bg_menu').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            // Draw a beautiful dark space background
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x0f0c1b, 0x0f0c1b, 0x1d1a39, 0x1d1a39, 1);
            graphics.fillRect(-200, -200, width + 400, height + 400);
        }
    }
}
