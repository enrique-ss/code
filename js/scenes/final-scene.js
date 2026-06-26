/**
 * FINAL SCENE - Twinkling stars effect and background
 */

class FinalScene extends Phaser.Scene {
    constructor() {
        super('FinalScene');
    }

    create() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        // Background (larger than canvas to prevent gaps)
        if (this.textures.exists('bg_final')) {
            this.finalBg = this.add.image(width / 2, height / 2, 'bg_final').setDisplaySize(width * 1.3, height * 1.3);
        } else {
            // Draw a beautiful dark space background
            this.finalBg = this.add.graphics();
            this.finalBg.fillGradientStyle(0x0a0518, 0x0a0518, 0x1d143c, 0x1d143c, 1);
            this.finalBg.fillRect(-200, -200, width + 400, height + 400);
        }

        // Handle resize
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

        // Twinkling stars effect
        this.createStars();
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
