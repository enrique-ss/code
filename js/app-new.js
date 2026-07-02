class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.state = {
      classId: null,
      day: 1,
      period: 'manha',
      location: 'campo',
      climate: 'ensolarado',
      karma: 0,
      memories: [],
      executed: [],
      currentPeriodEvents: [],
      currentEventIndex: 0,
      runOver: false,
      transitionPending: false
    };
  }

  clone() {
    return JSON.parse(JSON.stringify(this.state));
  }

  setClass(classId) {
    this.state.classId = classId;
  }

  setLocation(location) {
    this.state.location = location;
  }

  setClimate(climate) {
    this.state.climate = climate;
  }

  addMemory(memoryId) {
    if (memoryId && !this.state.memories.includes(memoryId)) {
      this.state.memories.push(memoryId);
    }
  }

  addKarma(value) {
    this.state.karma += value;
  }

  markExecuted(eventId) {
    if (eventId && !this.state.executed.includes(eventId)) {
      this.state.executed.push(eventId);
    }
  }

  hasExecuted(eventId) {
    return this.state.executed.includes(eventId);
  }

  nextPeriod() {
    const periods = ['manha', 'tarde', 'noite'];
    const index = periods.indexOf(this.state.period);
    if (index < periods.length - 1) {
      this.state.period = periods[index + 1];
    } else {
      this.state.period = 'manha';
      this.state.day += 1;
    }
    this.state.transitionPending = true;
    this.state.runOver = this.state.day > 3;
  }

  clearTransition() {
    this.state.transitionPending = false;
  }
}

class SaveManager {
  constructor(key = 'codequest-save') {
    this.key = key;
  }

  save(state) {
    try {
      localStorage.setItem(this.key, JSON.stringify(state));
    } catch (error) {}
  }

  load() {
    try {
      const raw = localStorage.getItem(this.key);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  clear() {
    try {
      localStorage.removeItem(this.key);
    } catch (error) {}
  }
}

function normalizeEvent(evento) {
  if (!evento || !evento.id) return null;
  const fixed = String(evento.tipo || evento.kind || '').toLowerCase() === 'fixo' || String(evento.kind || '').toLowerCase() === 'fixed';
  const dialogs = (evento.dialogos || evento.dialogues || evento.dialogs || []).map((dialogo) => ({
    speaker: dialogo.falante || dialogo.speaker || evento.speaker || 'Narrador',
    text: dialogo.texto || dialogo.text || ''
  }));
  const choices = (evento.escolhas || evento.choices || []).map((choice) => ({
    text: choice.texto || choice.text || '',
    effects: (choice.efeitos || choice.effects || []).map((effect) => ({
      type: effect.tipo || effect.type,
      value: effect.valor ?? effect.value
    }))
  }));

  const locations = evento.locais || evento.locations || [evento.localizacao || 'campo'];
  const days = evento.dias || evento.day || [1];
  const periods = evento.periodos || evento.period || ['manha'];
  const climates = evento.clima || evento.climates || ['all'];

  return {
    id: evento.id,
    fixed,
    name: evento.nome || evento.name || evento.id,
    day: Array.isArray(days) ? days : [days],
    period: Array.isArray(periods) ? periods : [periods],
    locations: Array.isArray(locations) ? locations : [locations],
    climates: Array.isArray(climates) ? climates : [climates],
    memoryTrigger: evento.memoria_gatilho ?? evento.memoryTrigger ?? null,
    memoryGain: evento.memoria_ganha ?? evento.memoryGain ?? null,
    weight: Number(evento.peso ?? evento.weight ?? 0),
    obstacle: {
      id: evento.obstaculo_id || evento.obstacle?.id || 'generic',
      sprite: evento.obstaculo_sprite || evento.obstacle?.sprite || 'generic',
      label: evento.obstaculo_label || evento.obstacle?.label || evento.speaker || evento.nome || evento.id
    },
    speaker: evento.speaker || dialogs[0]?.speaker || 'Narrador',
    dialogs,
    choices
  };
}

class EventCatalog {
  constructor(events) {
    this.events = events;
  }

  all() {
    return this.events;
  }
}

class EventSelector {
  constructor(gameState, catalog) {
    this.gameState = gameState;
    this.catalog = catalog;
    this.memoryPriority = 2;
  }

  isEligible(evento) {
    const state = this.gameState.state;
    if (evento.day.length && !evento.day.includes(state.day)) return false;
    if (evento.period.length && !evento.period.includes(state.period)) return false;
    if (evento.locations.length && !evento.locations.includes(state.location)) return false;
    if (evento.climates.length && !evento.climates.includes('all') && !evento.climates.includes('Todos') && !evento.climates.includes(state.climate)) return false;
    if (evento.memoryTrigger && !state.memories.includes(evento.memoryTrigger)) return false;
    if (!evento.fixed && this.gameState.hasExecuted(evento.id)) return false;
    return true;
  }

  isCoreEligible(evento) {
    const state = this.gameState.state;
    if (evento.day.length && !evento.day.includes(state.day)) return false;
    if (evento.period.length && !evento.period.includes(state.period)) return false;
    if (evento.climates.length && !evento.climates.includes('all') && !evento.climates.includes('Todos') && !evento.climates.includes(state.climate)) return false;
    if (evento.memoryTrigger && !state.memories.includes(evento.memoryTrigger)) return false;
    if (!evento.fixed && this.gameState.hasExecuted(evento.id)) return false;
    return true;
  }

  weightedPick(pool) {
    if (!pool.length) return null;
    const state = this.gameState.state;
    const weights = pool.map((event) => {
      let weight = Math.max(0, Number(event.weight || 0));
      if (event.memoryTrigger && state.memories.includes(event.memoryTrigger)) {
        weight *= this.memoryPriority;
      }
      return weight;
    });

    const total = weights.reduce((sum, value) => sum + value, 0);
    if (total <= 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }

    let roll = Math.random() * total;
    for (let i = 0; i < pool.length; i += 1) {
      roll -= weights[i];
      if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
  }

  selectPeriodEvents() {
    const all = this.catalog.all();
    const eligibleFixes = all.filter((event) => event.fixed && this.isEligible(event));
    const eligibleNormals = all.filter((event) => !event.fixed && this.isEligible(event));
    const wildcardNormals = all.filter((event) => !event.fixed && this.isCoreEligible(event) && !eligibleNormals.some((item) => item.id === event.id));

    const opening = eligibleFixes.find((event) => event.id.includes('DESPERTAR')) || eligibleFixes.find((event) => event.id.includes('ABERTURA')) || null;
    const closing = eligibleFixes.find((event) => event.id.includes('CONFRONTO_FINAL')) || eligibleFixes.find((event) => event.id.includes('ENCERRAMENTO')) || null;

    const selectedNormals = [];
    const pool = [...eligibleNormals];
    while (selectedNormals.length < 3 && pool.length > 0) {
      const pick = this.weightedPick(pool);
      if (!pick) break;
      selectedNormals.push(pick);
      pool.splice(pool.indexOf(pick), 1);
    }

    const fallbackPool = [...wildcardNormals];
    while (selectedNormals.length < 3 && fallbackPool.length > 0) {
      const pick = this.weightedPick(fallbackPool);
      if (!pick) break;
      selectedNormals.push(pick);
      fallbackPool.splice(fallbackPool.indexOf(pick), 1);
    }

    const periodEvents = [];
    if (opening) periodEvents.push(opening);
    periodEvents.push(...selectedNormals);
    if (closing) periodEvents.push(closing);

    return {
      opening,
      closing,
      normals: selectedNormals,
      events: periodEvents
    };
  }
}

class OverlayUI {
  constructor(scene) {
    this.scene = scene;
    this.lines = [];
    this.choiceTexts = [];
    this.visible = false;
    this.dialogIndex = 0;
  }

  create() {
    const w = this.scene.scale.width;
    const h = this.scene.scale.height;

    this.fog = this.scene.add.rectangle(w / 2, h * 0.76, w, h * 0.52, 0x14141e, 0.72).setDepth(900).setVisible(false);
    this.spriteArea = this.scene.add.container(0, 0).setDepth(910).setVisible(false);
    this.dialogBox = this.scene.add.rectangle(24, h - 180, w - 48, 180, 0x1e1f29, 0.92).setOrigin(0, 0).setDepth(920).setVisible(false);
    this.nameTag = this.scene.add.text(48, h - 196, '', {
      fontFamily: 'Arial',
      fontSize: '16px',
      fontStyle: 'bold',
      color: '#1a1b26',
      backgroundColor: '#ff79c6',
      padding: { x: 16, y: 6 }
    }).setDepth(930).setVisible(false);
    this.dialogText = this.scene.add.text(48, h - 150, '', {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#f8f8f2',
      wordWrap: { width: w - 110 },
      lineSpacing: 6
    }).setDepth(930).setVisible(false);
    this.cursor = this.scene.add.text(w - 72, h - 42, '▶', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#8be9fd'
    }).setDepth(930).setVisible(false);
    this.spriteLabel = this.scene.add.text(w - 220, h - 268, '', {
      fontFamily: 'Arial',
      fontSize: '18px',
      color: '#f8f8f2',
      backgroundColor: '#1a1b26',
      padding: { x: 12, y: 8 }
    }).setDepth(930).setVisible(false);
  }

  show(event, onDone) {
    this.currentEvent = event;
    this.onDone = onDone;
    this.dialogIndex = 0;
    this.visible = true;
    this.updateVisibility(true);
    this.renderDialog();
  }

  updateVisibility(value) {
    this.fog.setVisible(value);
    this.dialogBox.setVisible(value);
    this.nameTag.setVisible(value);
    this.dialogText.setVisible(value);
    this.cursor.setVisible(value);
    this.spriteLabel.setVisible(value);
  }

  clearChoices() {
    this.choiceTexts.forEach((text) => text.destroy());
    this.choiceTexts = [];
  }

  renderDialog() {
    this.clearChoices();
    const dialogs = this.currentEvent?.dialogs || [];
    if (this.dialogIndex >= dialogs.length) {
      this.renderChoices();
      return;
    }

    const line = dialogs[this.dialogIndex];
    this.nameTag.setText(line.speaker || this.currentEvent.speaker || 'Narrador');
    this.dialogText.setText(line.text || '');
    this.spriteLabel.setText(this.currentEvent.obstacle?.label || this.currentEvent.speaker || '');
    this.dialogIndex += 1;
    this.scene.focusSpeaker(this.currentEvent);
  }

  renderChoices() {
    this.clearChoices();
    const choices = this.currentEvent?.choices || [];
    if (!choices.length) {
      this.onDone?.(null);
      return;
    }

    const w = this.scene.scale.width;
    const baseY = this.scene.scale.height - 104;
    choices.forEach((choice, index) => {
      const text = this.scene.add.text(48, baseY + index * 32, choice.text, {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#f8f8f2',
        backgroundColor: '#2e3141',
        padding: { x: 12, y: 7 }
      }).setDepth(940).setInteractive({ useHandCursor: true });
      text.on('pointerdown', () => this.onDone?.(choice));
      this.choiceTexts.push(text);
    });
  }

  advance() {
    if (!this.visible) return;
    const dialogs = this.currentEvent?.dialogs || [];
    if (this.dialogIndex < dialogs.length) {
      this.renderDialog();
      return;
    }
    this.renderChoices();
  }

  hide() {
    this.visible = false;
    this.updateVisibility(false);
    this.clearChoices();
    this.currentEvent = null;
  }
}

class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    this.load.image('bg_menu', 'assets/backgrounds/menu.png');
    this.load.image('forest_layer_0', 'assets/backgrounds/GrassLand_Background_1.png');
    this.load.image('forest_layer_1', 'assets/backgrounds/GrassLand_Background_2.png');
    this.load.image('forest_layer_2', 'assets/backgrounds/GrassLand_Background_3.png');
    this.load.image('forest_layer_3', 'assets/backgrounds/GrassLand_Background_4.png');
    this.load.image('forest_layer_4', 'assets/backgrounds/GrassLand_Background_5.png');
    this.load.json('events', 'assets/events/events.json');
  }

  create() {
    window.gameState = new GameState();
    window.saveManager = new SaveManager();
    const saved = window.saveManager.load();
    if (saved) {
      window.gameState.state = { ...window.gameState.state, ...saved };
    }
    const rawEvents = this.cache.json.get('events')?.eventos || [];
    window.eventCatalog = new EventCatalog(rawEvents.map(normalizeEvent).filter(Boolean));
    this.scene.start('MenuScene');
  }
}

class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.image(w / 2, h / 2, 'bg_menu').setDisplaySize(w, h);
    this.add.text(w / 2, h * 0.18, 'CODE QUEST', {
      fontFamily: 'Arial',
      fontSize: '56px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 6
    }).setOrigin(0.5);
    this.add.text(w / 2, h * 0.28, 'MVP narrativo', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#cbd5e1'
    }).setOrigin(0.5);

    const start = this.add.text(w / 2, h * 0.55, 'INICIAR JOGO', {
      fontFamily: 'Arial',
      fontSize: '30px',
      color: '#1a1b26',
      backgroundColor: '#50fa7b',
      padding: { x: 24, y: 12 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    start.on('pointerdown', () => this.scene.start('CharacterSelectScene'));
  }
}

class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super('CharacterSelectScene');
    this.selectedClass = null;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.rectangle(w / 2, h / 2, w, h, 0x0f1020, 1);
    this.add.text(w / 2, h * 0.12, 'ESCOLHA SUA CLASSE', {
      fontFamily: 'Arial',
      fontSize: '42px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    const classes = [
      ['guerreiro', 'GUERREIRO', '#ff5555', 'Força física'],
      ['mago', 'MAGO', '#bd93f9', 'Conhecimento e magia'],
      ['arqueiro', 'ARQUEIRO', '#50fa7b', 'Precisão e agilidade']
    ];

    classes.forEach((entry, index) => {
      const y = h * 0.32 + index * 110;
      const btn = this.add.text(w / 2, y, entry[1], {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#ffffff',
        backgroundColor: entry[2],
        padding: { x: 24, y: 14 }
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      btn.on('pointerdown', () => {
        this.selectedClass = entry[0];
        classes.forEach((item, i) => {
          const selected = i === index;
          const target = this.children.list.find((child) => child.text === item[1]);
          if (target) {
            target.setAlpha(selected ? 1 : 0.65);
          }
        });
      });
      this.add.text(w / 2, y + 38, entry[3], {
        fontFamily: 'Arial',
        fontSize: '18px',
        color: '#cbd5e1'
      }).setOrigin(0.5);
    });

    const back = this.add.text(w * 0.25, h * 0.9, 'VOLTAR', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#6c757d',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    back.on('pointerdown', () => this.scene.start('MenuScene'));

    const confirm = this.add.text(w * 0.75, h * 0.9, 'CONFIRMAR', {
      fontFamily: 'Arial',
      fontSize: '22px',
      color: '#ffffff',
      backgroundColor: '#28a745',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });
    confirm.on('pointerdown', () => {
      if (!this.selectedClass) return;
      window.gameState.reset();
      window.gameState.setClass(this.selectedClass);
      window.saveManager.save(window.gameState.clone());
      this.scene.start('GameScene');
    });
  }
}

class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
    this.walkSpeed = 120;
    this.heroX = 120;
    this.currentObstacleIndex = 0;
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    this.selector = new EventSelector(window.gameState, window.eventCatalog);
    this.overlay = new OverlayUI(this);
    this.overlay.create();
    this.eventVisuals = [];
    this.obstacles = [];
    this.isWalking = false;
    this.lastResolvedEventId = null;
    this.scene.bringToTop();

    this.physics.world.setBounds(0, 0, 6000, h);
    this.cameras.main.setBounds(0, 0, 6000, h);

    this.background = this.add.tileSprite(3000, h / 2, 6000, h, 'forest_layer_4').setScrollFactor(0.15);
    this.add.tileSprite(3000, h / 2, 6000, h, 'forest_layer_3').setScrollFactor(0.25);
    this.add.tileSprite(3000, h / 2, 6000, h, 'forest_layer_2').setScrollFactor(0.4);
    this.add.tileSprite(3000, h / 2, 6000, h, 'forest_layer_1').setScrollFactor(0.65);
    this.add.tileSprite(3000, h / 2, 6000, h, 'forest_layer_0').setScrollFactor(1.0);
    this.add.rectangle(3000, h * 0.76, 6000, h * 0.24, 0x17202a, 0.42);

    this.hero = this.add.rectangle(this.heroX, h * 0.68, 48, 78, 0x8be9fd).setOrigin(0.5, 1).setDepth(100);
    this.heroBody = this.physics.add.existing(this.hero);
    this.hero.body.setAllowGravity(false);
    this.hero.body.setImmovable(true);

    this.cameraTarget = this.hero;
    this.cameras.main.startFollow(this.cameraTarget, true, 0.08, 0.08, 180, 0);

    this.input.on('pointerdown', () => this.overlay.advance());

    this.startRun();
  }

  startRun() {
    const wake = window.eventCatalog.all().find((event) => event.id === 'D1M_FIX_CAMPO_01' || event.id === 'D1M_DESPERTAR');
    if (wake && !window.gameState.hasExecuted(wake.id)) {
      window.gameState.setLocation('campo');
      window.gameState.setClimate('ensolarado');
      this.isWalking = false;
      this.overlay.show(wake, (choice) => this.finishWake(choice));
      return;
    }
    this.buildPeriod();
  }

  finishWake(choice) {
    this.applyChoice(choice);
    window.gameState.markExecuted('D1M_FIX_CAMPO_01');
    window.gameState.markExecuted('D1M_DESPERTAR');
    this.overlay.hide();
    this.buildPeriod();
    this.beginWalking();
  }

  buildPeriod() {
    const state = window.gameState.state;
    const locationByPeriod = {
      1: { manha: 'campo', tarde: 'estradas', noite: 'campo' },
      2: { manha: 'vila_inicial', tarde: 'estradas', noite: 'vila_inicial' },
      3: { manha: 'estradas', tarde: 'floresta_sombria', noite: 'ruinas_antigas' }
    };
    const nextLocation = locationByPeriod[state.day]?.[state.period] || 'campo';
    window.gameState.setLocation(nextLocation);
    window.gameState.setClimate(['ensolarado', 'chuvoso', 'nublado', 'neblina'][Math.floor(Math.random() * 4)]);

    const selection = this.selector.selectPeriodEvents();
    window.gameState.state.currentPeriodEvents = selection.events;
    window.gameState.state.currentEventIndex = 0;

    this.spawnObstacles(selection.normals);
    this.isWalking = true;
    this.beginWalking();
    window.saveManager.save(window.gameState.clone());
  }

  spawnObstacles(events) {
    this.clearObstacles();
    const h = this.scale.height;
    const startX = 620;
    const spacing = 260;
    this.obstacles = events.map((event, index) => ({
      event,
      x: startX + index * spacing,
      resolved: false
    }));

    this.eventVisuals = this.obstacles.map((obstacle) => {
      const colors = {
        mage: 0xbd93f9,
        merchant: 0xf1fa8c,
        slime: 0x50fa7b,
        goblin: 0xff5555,
        door: 0xff5555,
        generic: 0x8be9fd
      };
      const key = obstacle.event.obstacle?.sprite || 'generic';
      const tint = colors[key] || colors.generic;

      const halo = this.add.circle(obstacle.x, h * 0.68, 44, tint, 0.18).setDepth(20);
      const sprite = this.add.rectangle(obstacle.x, h * 0.68, 56, 82, tint, 0.95).setDepth(21);
      const label = this.add.text(obstacle.x, h * 0.68 - 68, obstacle.event.obstacle?.label || obstacle.event.speaker || obstacle.event.id, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#f8f8f2',
        backgroundColor: '#1a1b26',
        padding: { x: 8, y: 4 }
      }).setOrigin(0.5).setDepth(22);
      const hitbox = this.add.zone(obstacle.x, h * 0.68, 64, 120).setOrigin(0.5, 1);
      this.physics.add.existing(hitbox);
      hitbox.body.setAllowGravity(false);
      hitbox.body.setImmovable(true);
      hitbox.body.setSize(64, 120, true);
      this.physics.add.overlap(this.hero, hitbox, () => this.handleObstacleHit(obstacle));

      return { obstacle, halo, sprite, label, hitbox };
    });
  }

  clearObstacles() {
    this.eventVisuals?.forEach((item) => {
      item.halo?.destroy();
      item.sprite?.destroy();
      item.label?.destroy();
      item.hitbox?.destroy();
    });
    this.eventVisuals = [];
  }

  beginWalking() {
    this.isWalking = true;
  }

  stopWalking() {
    this.isWalking = false;
  }

  focusSpeaker(event) {
    const item = this.eventVisuals?.find((visual) => visual.obstacle.event.id === event.id);
    if (item?.sprite) {
      this.cameras.main.pan(item.sprite.x, this.cameras.main.centerY, 220, 'Sine.easeInOut', true);
    }
  }

  resumeHeroFollow() {
    this.cameras.main.startFollow(this.hero, true, 0.08, 0.08, 180, 0);
  }

  applyChoice(choice) {
    if (!choice) return;
    (choice.effects || []).forEach((effect) => {
      if (effect.type === 'karma') {
        window.gameState.addKarma(Number(effect.value || 0));
      }
      if (effect.type === 'memory') {
        window.gameState.addMemory(effect.value);
      }
    });
    window.saveManager.save(window.gameState.clone());
  }

  handleObstacleHit(obstacle) {
    if (!this.isWalking || obstacle.resolved) return;
    obstacle.resolved = true;
    this.stopWalking();
    this.overlay.show(obstacle.event, (choice) => {
      this.applyChoice(choice);
      window.gameState.markExecuted(obstacle.event.id);
      window.gameState.state.currentEventIndex += 1;
      this.overlay.hide();
      this.resumeHeroFollow();
      this.beginWalking();
      window.saveManager.save(window.gameState.clone());
    });
  }

  update(_, delta) {
    if (window.gameState.state.runOver) {
      return;
    }

    if (this.isWalking) {
      this.heroX += this.walkSpeed * (delta / 1000);
      this.hero.x = this.heroX;
      this.hero.body.x = this.heroX;
      this.eventVisuals.forEach((visual) => {
        visual.halo.x = visual.obstacle.x;
        visual.sprite.x = visual.obstacle.x;
        visual.label.x = visual.obstacle.x;
        visual.hitbox.x = visual.obstacle.x;
      });

      const nextHit = this.obstacles.find((item) => !item.resolved && this.heroX >= item.x - 22);
      if (nextHit) {
        this.handleObstacleHit(nextHit);
      }

      if (this.heroX > 1100 && !this.overlay.visible) {
        this.finishPeriod();
      }
    }
  }

  finishPeriod() {
    this.stopWalking();
    window.gameState.nextPeriod();
    window.saveManager.save(window.gameState.clone());
    if (window.gameState.state.runOver) {
      this.scene.start('FinalScene');
      return;
    }
    this.scene.restart();
  }
}

class FinalScene extends Phaser.Scene {
  constructor() {
    super('FinalScene');
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;
    window.saveManager.clear();
    this.add.rectangle(w / 2, h / 2, w, h, 0x08060c, 1);
    this.add.text(w / 2, h * 0.18, 'FIM DA RUN', {
      fontFamily: 'Arial',
      fontSize: '54px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add.text(w / 2, h * 0.36, `Classe: ${window.gameState.state.classId || '-'}`, {
      fontFamily: 'Arial',
      fontSize: '26px',
      color: '#cbd5e1'
    }).setOrigin(0.5);
    this.add.text(w / 2, h * 0.46, `Karma: ${window.gameState.state.karma}`, {
      fontFamily: 'Arial',
      fontSize: '28px',
      color: '#8be9fd'
    }).setOrigin(0.5);
    const ending = window.gameState.state.karma > 0 ? 'Final Bom' : window.gameState.state.karma < 0 ? 'Final Ruim' : 'Final Neutro';
    this.add.text(w / 2, h * 0.56, ending, {
      fontFamily: 'Arial',
      fontSize: '34px',
      color: '#f8f8f2'
    }).setOrigin(0.5);
    this.add.text(w / 2, h * 0.75, 'RETORNAR AO MENU', {
      fontFamily: 'Arial',
      fontSize: '24px',
      color: '#1a1b26',
      backgroundColor: '#50fa7b',
      padding: { x: 18, y: 10 }
    }).setOrigin(0.5).setInteractive({ useHandCursor: true }).on('pointerdown', () => this.scene.start('MenuScene'));
  }
}

window.CodeQuest = {
  GameState,
  SaveManager,
  EventCatalog,
  EventSelector,
  OverlayUI,
  BootScene,
  MenuScene,
  CharacterSelectScene,
  GameScene,
  FinalScene
};

window.addEventListener('load', () => {
  const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#0f1020',
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
      default: 'arcade',
      arcade: { debug: false }
    },
    scene: [BootScene, MenuScene, CharacterSelectScene, GameScene, FinalScene]
  };

  window.game = new Phaser.Game(config);
});
