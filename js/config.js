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

// Assets Configuration (placeholders - usar cores sólidas se imagens não existirem)
const ASSETS = {
    backgrounds: {
        menu: null,  // Usará cor sólida
        forest_path: null,
        magic_tower: null,
        market: null,
        door: null
    },
    sprites: {
        arthur: null,  // Usará placeholder
        mage: null,
        merchant: null,
        door: null
    },
    ui: {
        json_panel: null,
        dialog_box: null,
        choice_button: null
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
