/**
 * Gerenciador de HUD
 * Conforme Seção 7.2 (Telas Principais) do GDD
 */

class HUDManager {
  constructor(scene, gameState) {
    this.scene = scene;
    this.gameState = gameState;
    this.hudContainer = null;
  }

  /**
   * Cria o container do HUD
   */
  create() {
    const width = this.scene.cameras.main.width;
    const height = this.scene.cameras.main.height;

    // Container principal do HUD
    this.hudContainer = this.scene.add.container(0, 0).setDepth(1000);

    // HUD superior esquerdo (tempo do dia)
    this.createTimeHUD(width, height);

    // HUD superior direito (clima)
    this.createClimateHUD(width, height);

    // Painel de status lateral (Karma)
    this.createKarmaPanel(width, height);

    // Painel de diálogo inferior
    this.createDialoguePanel(width, height);
  }

  /**
   * Cria HUD superior esquerdo (tempo do dia)
   */
  createTimeHUD(width, height) {
    const x = 20;
    const y = 20;

    // Fundo do HUD
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.8);
    bg.fillRoundedRect(x, y, 200, 60, 10);
    this.hudContainer.add(bg);

    // Ícone de tempo (placeholder)
    const icon = this.scene.add.text(x + 20, y + 30, '☀️', {
      fontSize: '32px'
    }).setOrigin(0.5);
    this.hudContainer.add(icon);

    // Texto de tempo
    this.timeText = this.scene.add.text(x + 60, y + 30, '', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0, 0.5);
    this.hudContainer.add(this.timeText);

    this.updateTime();
  }

  /**
   * Cria HUD superior direito (clima)
   */
  createClimateHUD(width, height) {
    const x = width - 220;
    const y = 20;

    // Fundo do HUD
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.8);
    bg.fillRoundedRect(x, y, 200, 60, 10);
    this.hudContainer.add(bg);

    // Ícone de clima (placeholder)
    const icon = this.scene.add.text(x + 20, y + 30, '🌤️', {
      fontSize: '32px'
    }).setOrigin(0.5);
    this.hudContainer.add(icon);

    // Texto de clima
    this.climateText = this.scene.add.text(x + 60, y + 30, '', {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#ffffff'
    }).setOrigin(0, 0.5);
    this.hudContainer.add(this.climateText);

    this.updateClimate();
  }

  /**
   * Cria painel de status lateral (Karma)
   */
  createKarmaPanel(width, height) {
    const x = 20;
    const y = height - 100;

    // Fundo do painel
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.8);
    bg.fillRoundedRect(x, y, 150, 80, 10);
    this.hudContainer.add(bg);

    // Título
    this.scene.add.text(x + 75, y + 20, 'KARMA', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#ff79c6'
    }).setOrigin(0.5);

    // Valor de Karma
    this.karmaText = this.scene.add.text(x + 75, y + 50, '0', {
      fontSize: '28px',
      fontFamily: 'Arial',
      color: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);
    this.hudContainer.add(this.karmaText);

    this.updateKarma();
  }

  /**
   * Cria painel de diálogo inferior
   */
  createDialoguePanel(width, height) {
    const x = 0;
    const y = height - 200;

    // Fundo do painel
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x1a1a2e, 0.9);
    bg.fillRoundedRect(x, y, width, 200, 10);
    this.hudContainer.add(bg);

    // Nome do falante
    this.speakerText = this.scene.add.text(x + 20, y + 20, '', {
      fontSize: '18px',
      fontFamily: 'Arial',
      color: '#ff79c6',
      fontStyle: 'bold'
    });
    this.hudContainer.add(this.speakerText);

    // Texto de diálogo
    this.dialogueText = this.scene.add.text(x + 20, y + 50, '', {
      fontSize: '16px',
      fontFamily: 'Arial',
      color: '#f8f8f2',
      wordWrap: { width: width - 40 }
    });
    this.hudContainer.add(this.dialogueText);

    // Container de escolhas (inicialmente vazio)
    this.choicesContainer = this.scene.add.container(x + 20, y + 120);
    this.hudContainer.add(this.choicesContainer);

    // Esconde o painel inicialmente
    this.hideDialogue();
  }

  /**
   * Atualiza o tempo do dia
   */
  updateTime() {
    const estado = this.gameState.getEstado();
    const periodo = estado.periodo;
    
    const periodos = {
      'manha': 'Manhã',
      'tarde': 'Tarde',
      'noite': 'Noite'
    };

    const icones = {
      'manha': '☀️',
      'tarde': '🌅',
      'noite': '🌙'
    };

    if (this.timeText) {
      this.timeText.setText(`${periodos[periodo] || periodo} - Dia ${estado.dia}`);
    }
  }

  /**
   * Atualiza o clima
   */
  updateClimate() {
    const estado = this.gameState.getEstado();
    const clima = estado.clima;

    const climas = {
      'ensolarado': 'Ensolarado',
      'chuvoso': 'Chuvoso',
      'nublado': 'Nublado',
      'neblina': 'Neblina'
    };

    const icones = {
      'ensolarado': '☀️',
      'chuvoso': '🌧️',
      'nublado': '☁️',
      'neblina': '🌫️'
    };

    if (this.climateText) {
      this.climateText.setText(climas[clima] || clima);
    }
  }

  /**
   * Atualiza o Karma
   */
  updateKarma() {
    const estado = this.gameState.getEstado();
    const karma = estado.karma;

    if (this.karmaText) {
      this.karmaText.setText(karma.toString());
      
      // Cor baseada no valor
      if (karma > 0) {
        this.karmaText.setColor('#50fa7b'); // verde
      } else if (karma < 0) {
        this.karmaText.setColor('#ff5555'); // vermelho
      } else {
        this.karmaText.setColor('#ffffff'); // branco
      }
    }
  }

  /**
   * Mostra diálogo
   * @param {string} speaker - Nome do falante
   * @param {string} text - Texto do diálogo
   */
  showDialogue(speaker, text) {
    if (this.speakerText) {
      this.speakerText.setText(speaker);
      this.speakerText.setVisible(true);
    }
    if (this.dialogueText) {
      this.dialogueText.setText(text);
      this.dialogueText.setVisible(true);
    }
    this.hudContainer.setVisible(true);
  }

  /**
   * Esconde diálogo
   */
  hideDialogue() {
    if (this.speakerText) {
      this.speakerText.setVisible(false);
    }
    if (this.dialogueText) {
      this.dialogueText.setVisible(false);
    }
    this.hideChoices();
  }

  /**
   * Mostra escolhas
   * @param {Array} choices - Lista de escolhas
   */
  showChoices(choices) {
    // Limpa escolhas anteriores
    this.hideChoices();

    if (!choices || choices.length === 0) {
      return;
    }

    choices.forEach((choice, index) => {
      const y = index * 40;
      const choiceText = this.scene.add.text(0, y, choice.text || choice, {
        fontSize: '16px',
        fontFamily: 'Arial',
        color: '#f8f8f2',
        backgroundColor: '#4a90e2',
        padding: { x: 15, y: 8 }
      }).setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
          if (choice.onSelect) {
            choice.onSelect(choice);
          }
        })
        .on('pointerover', () => {
          choiceText.setStyle({ backgroundColor: '#357abd' });
        })
        .on('pointerout', () => {
          choiceText.setStyle({ backgroundColor: '#4a90e2' });
        });

      this.choicesContainer.add(choiceText);
    });

    this.choicesContainer.setVisible(true);
  }

  /**
   * Esconde escolhas
   */
  hideChoices() {
    this.choicesContainer.removeAll(true);
    this.choicesContainer.setVisible(false);
  }

  /**
   * Atualiza todos os elementos do HUD
   */
  updateAll() {
    this.updateTime();
    this.updateClimate();
    this.updateKarma();
  }

  /**
   * Destrói o HUD
   */
  destroy() {
    if (this.hudContainer) {
      this.hudContainer.destroy();
    }
  }
}

// Exportar para uso global
window.HUDManager = HUDManager;
