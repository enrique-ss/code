/**
 * PRELOAD SCENE - Load all game assets
 */

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Carrega imagens de fundo (apenas se caminho não for null)
        Object.entries(ASSETS.backgrounds).forEach(([key, path]) => {
            if (path) {
                this.load.image(key, path);
            }
        });

        // Carrega sprites de personagens (apenas se caminho não for null)
        Object.entries(ASSETS.sprites).forEach(([key, path]) => {
            if (path) {
                this.load.image(`sprite_${key}`, path);
            }
        });

        // Carrega adesivos (apenas se caminho não for null)
        Object.entries(ASSETS.stickers || {}).forEach(([key, path]) => {
            if (path) {
                this.load.image(`sticker_${key}`, path);
            }
        });
    }

    create() {
        // Inicializa motor do jogo
        if (!window.gameEngine) {
            window.gameEngine = new CodeQuestGame();
        }

        this.scene.start('MenuScene');
    }
}
