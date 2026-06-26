/**
 * CODE QUEST - PONTO DE ENTRADA PRINCIPAL PHASER 3
 * Visual Novel com Quebra da Quarta Parede
 */

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [PreloadScene, MenuScene, CharacterCreationScene, GameScene, FinalScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

console.log('[Main] Inicializando Phaser Game');
const game = new Phaser.Game(config);

window.game = game;

console.log('[Main] Phaser Game inicializado');
