/**
 * PRELOAD SCENE - Load all game assets
 */

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Load background images (apenas se caminho não for null)
        Object.entries(ASSETS.backgrounds).forEach(([key, path]) => {
            if (path) {
                this.load.image(key, path);
            }
        });

        // Load character sprites (apenas se caminho não for null)
        Object.entries(ASSETS.sprites).forEach(([key, path]) => {
            if (path) {
                this.load.image(`sprite_${key}`, path);
            }
        });

        // Load stickers (apenas se caminho não for null)
        Object.entries(ASSETS.stickers || {}).forEach(([key, path]) => {
            if (path) {
                this.load.image(`sticker_${key}`, path);
            }
        });
    }

    create() {
        // Initialize game engine
        if (!window.gameEngine) {
            window.gameEngine = new CodeQuestGame();
        }

        this.scene.start('MenuScene');
    }
}
