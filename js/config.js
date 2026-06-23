/**
 * CODE QUEST - CONFIGURAÇÕES
 * Motion Comic Educativa sobre Programação
 */

// Phaser Game Configuration
const GAME_CONFIG = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

// Game Constants
const CONSTANTS = {
    FONT_FAMILY: 'Fredoka, Arial, sans-serif',
    FONT_FAMILY_UI: 'Outfit, Arial, sans-serif',
    FONT_FAMILY_CODE: 'Courier New, monospace',
    
    // Colors
    COLORS: {
        PRIMARY: '#8be9fd',
        SECONDARY: '#50fa7b',
        DANGER: '#ff5555',
        WARNING: '#f1fa8c',
        PURPLE: '#bd93f9',
        BACKGROUND: '#1a1a2e',
        SURFACE: '#282a36',
        TEXT: '#f8f8f2',
        TEXT_MUTED: '#6272a4'
    },
    
    // Animation Speeds
    TYPING_SPEED: 30,
    ZOOM_DURATION: 500,
    WALK_SPEED: 100
};

// Assets Configuration (Standardized 16-bit Pixel Art paths)
// - Backgrounds standard resolution: 1280x720px
// - Sprites standard resolution: 128x128px (or 256x256px for higher detail)
// - UI elements should match standard component sizing
const ASSETS = {
    backgrounds: {
        menu: 'assets/backgrounds/menu.png',
        forest_path: 'assets/backgrounds/forest_path.png',
        magic_tower: 'assets/backgrounds/magic_tower.png',
        market: 'assets/backgrounds/market.png',
        door: 'assets/backgrounds/door.png',
        forest_layer_0: 'assets/backgrounds/GrassLand_Background_1.png',
        forest_layer_1: 'assets/backgrounds/GrassLand_Background_2.png',
        forest_layer_2: 'assets/backgrounds/GrassLand_Background_3.png',
        forest_layer_3: 'assets/backgrounds/GrassLand_Background_4.png'
    },
    sprites: {
        arthur: 'assets/sprites/arthur.gif',
        mage: 'assets/sprites/mage.gif',
        merchant: 'assets/sprites/merchant.gif',
        door: 'assets/sprites/door.gif'
    },
    ui: {
        json_panel: 'assets/ui/json_panel.png',
        dialog_box: 'assets/ui/dialog_box.png',
        choice_button: 'assets/ui/choice_button.png'
    }
};

// JSON Panel Styling (Terminal-like)
const JSON_PANEL_STYLES = {
    backgroundColor: '#0d0d12',
    borderColor: '#44475a',
    textColor: '#f8f8f2',
    keyColor: '#ff79c6',
    stringColor: '#f1fa8c',
    numberColor: '#bd93f9',
    booleanColor: '#50fa7b',
    nullColor: '#6272a4',
    bracketColor: '#f8f8f2',
    fontSize: 13,
    fontFamily: 'Courier New, monospace'
};

// Character Styles
const CHARACTER_STYLES = {
    arthur: {
        name: 'Arthur',
        color: '#8be9fd',
        glow: 'rgba(139, 233, 253, 0.3)',
        role: 'protagonist'
    },
    mage: {
        name: 'Mago Eldrin',
        color: '#bd93f9',
        glow: 'rgba(189, 147, 249, 0.3)',
        role: 'npc'
    },
    merchant: {
        name: 'Mercador Gorb',
        color: '#f1fa8c',
        glow: 'rgba(241, 250, 140, 0.3)',
        role: 'npc'
    },
    door: {
        name: 'Porta do Conhecimento',
        color: '#ff5555',
        glow: 'rgba(255, 85, 85, 0.3)',
        role: 'object'
    }
};
