/**
 * PRELOAD SCENE - Load all game assets
 */

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Create loading bar
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();

        progressBox.fillStyle(0x222233, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2 - 30, 320, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Carregando...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);

        this.load.on('progress', (value) => {
            percentText.setText(`${Math.floor(value * 100)}%`);
            progressBar.clear();
            progressBar.fillStyle(0x8be9fd, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 - 20, 300 * value, 30);
        });

        this.load.on('complete', () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });

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
