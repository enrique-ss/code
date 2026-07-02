/**
 * PRELOAD SCENE - Load all game assets
 */

class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Carrega imagens de fundo existentes
        this.load.image('bg_menu', 'assets/backgrounds/menu.png');
        this.load.image('bg_final', 'assets/backgrounds/GrassLand_Background_1.png');
        
        // Carrega camadas de parallax
        this.load.image('forest_layer_0', 'assets/backgrounds/GrassLand_Background_1.png');
        this.load.image('forest_layer_1', 'assets/backgrounds/GrassLand_Background_2.png');
        this.load.image('forest_layer_2', 'assets/backgrounds/GrassLand_Background_3.png');
        this.load.image('forest_layer_3', 'assets/backgrounds/GrassLand_Background_4.png');
        this.load.image('forest_layer_4', 'assets/backgrounds/GrassLand_Background_5.png');
        
        // Carrega nuvens
        this.load.image('cloud_1', 'assets/backgrounds/GrassLand_Cloud_1.png');
        this.load.image('cloud_2', 'assets/backgrounds/GrassLand_Cloud_2.png');
        this.load.image('cloud_3', 'assets/backgrounds/GrassLand_Cloud_3.png');
    }

    create() {
        // Inicializa os managers globais
        window.gameState = new GameState();
        window.saveManager = new SaveManager(window.gameState);
        
        // Carrega estado salvo se existir
        if (window.saveManager.existeSave()) {
            const estadoSalvo = window.saveManager.carregar();
            if (estadoSalvo && !window.saveManager.estadoCorrompido()) {
                window.gameState.setEstado(estadoSalvo);
            }
        }

        this.scene.start('MenuScene');
    }
}
