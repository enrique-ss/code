const UIManager = {
    activeScreen: 'menu',
    selectedClass: '',
    activeTab: 'heroi',
    isTyping: false,
    typingTimer: null,
    currentText: '',
    onDialogClickCallback: null,

    initDOM() {
        console.log('[UIManager] Inicializando interface DOM');

        const btnStartGame = document.getElementById('btn-start-game');
        if (btnStartGame) {
            btnStartGame.addEventListener('click', () => {
                this.showScreen('char-create');
                if (window.game && window.game.scene.isActive('MenuScene')) {
                    window.game.scene.stop('MenuScene');
                    window.game.scene.start('CharacterCreationScene');
                }
            });
        }

        const btnAbout = document.getElementById('btn-about');
        if (btnAbout) {
            btnAbout.addEventListener('click', () => {
                document.getElementById('about-modal').classList.add('active');
            });
        }

        const btnCloseAbout = document.getElementById('btn-close-about');
        if (btnCloseAbout) {
            btnCloseAbout.addEventListener('click', () => {
                document.getElementById('about-modal').classList.remove('active');
            });
        }

        const classBtns = document.querySelectorAll('.class-btn');
        classBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                classBtns.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                this.selectedClass = btn.getAttribute('data-class');
                console.log('[UIManager] Classe selecionada:', this.selectedClass);
            });
        });

        const btnCharBack = document.getElementById('btn-char-back');
        if (btnCharBack) {
            btnCharBack.addEventListener('click', () => {
                this.showScreen('menu');
                if (window.game && window.game.scene.isActive('CharacterCreationScene')) {
                    window.game.scene.stop('CharacterCreationScene');
                    window.game.scene.start('MenuScene');
                }
            });
        }

        const btnCharConfirm = document.getElementById('btn-char-confirm');
        if (btnCharConfirm) {
            btnCharConfirm.addEventListener('click', () => {
                const nameInput = document.getElementById('char-name');
                const name = nameInput.value.trim();

                if (!name) {
                    alert('Por favor, digite o nome do seu personagem!');
                    return;
                }

                if (!this.selectedClass) {
                    alert('Por favor, selecione uma classe!');
                    return;
                }

                console.log(`[UIManager] Confirmando herói: Nome=${name}, Classe=${this.selectedClass}`);

                if (window.gameEngine) {
                    window.gameEngine.databases.heroi.nome = name;
                    window.gameEngine.databases.heroi.classe = this.selectedClass;
                    
                    switch(this.selectedClass) {
                        case 'Guerreiro':
                            window.gameEngine.databases.heroi.inteligencia = 10;
                            window.gameEngine.databases.heroi.forca = 18;
                            window.gameEngine.databases.heroi.destreza = 12;
                            window.gameEngine.databases.heroi.vida_maxima = 120;
                            window.gameEngine.databases.heroi.vida = 120;
                            window.gameEngine.databases.heroi.habilidades = ['ataque_poderoso', 'defesa_escudo'];
                            break;
                        case 'Mago':
                            window.gameEngine.databases.heroi.inteligencia = 18;
                            window.gameEngine.databases.heroi.forca = 6;
                            window.gameEngine.databases.heroi.destreza = 10;
                            window.gameEngine.databases.heroi.mana_maxima = 80;
                            window.gameEngine.databases.heroi.mana = 80;
                            window.gameEngine.databases.heroi.habilidades = ['bola_de_fogo', 'escudo_magico'];
                            break;
                        case 'Ladino':
                            window.gameEngine.databases.heroi.inteligencia = 12;
                            window.gameEngine.databases.heroi.forca = 10;
                            window.gameEngine.databases.heroi.destreza = 18;
                            window.gameEngine.databases.heroi.habilidades = ['furtividade', 'ataque_critico'];
                            break;
                    }
                    window.gameEngine.triggerDatabaseUpdate('heroi');
                }

                this.updateHUD();
                this.showScreen('game');

                if (window.game) {
                    if (window.game.scene.isActive('CharacterCreationScene')) {
                        window.game.scene.stop('CharacterCreationScene');
                    }
                    window.game.scene.start('GameScene');
                }
            });
        }

        const btnToggleJson = document.getElementById('btn-toggle-json');
        if (btnToggleJson) {
            btnToggleJson.addEventListener('click', () => {
                const panel = document.getElementById('hacker-menu-panel');
                panel.classList.toggle('active');
                this.updateJSON();
            });
        }

        const btnCloseJson = document.getElementById('btn-close-json');
        if (btnCloseJson) {
            btnCloseJson.addEventListener('click', () => {
                document.getElementById('hacker-menu-panel').classList.remove('active');
            });
        }

        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTab = btn.getAttribute('data-tab');
                this.updateJSON();
            });
        });

        const dialogBox = document.getElementById('game-dialog-box');
        if (dialogBox) {
            dialogBox.addEventListener('click', () => {
                if (this.isTyping) {
                    clearInterval(this.typingTimer);
                    this.isTyping = false;
                    const dialogText = document.getElementById('dialog-text-content');
                    dialogText.textContent = this.currentText;
                } else {
                    if (this.onDialogClickCallback) {
                        this.onDialogClickCallback();
                    }
                }
            });
        }

        const btnRestartGame = document.getElementById('btn-restart-game');
        if (btnRestartGame) {
            btnRestartGame.addEventListener('click', () => {
                this.restartGame();
            });
        }

        const btnFinalMenu = document.getElementById('btn-final-menu');
        if (btnFinalMenu) {
            btnFinalMenu.addEventListener('click', () => {
                this.showScreen('menu');
                if (window.game) {
                    window.game.scene.stop('FinalScene');
                    window.game.scene.start('MenuScene');
                }
            });
        }

        if (window.gameEngine) {
            window.gameEngine.onDatabaseUpdate = (tab) => {
                if (tab === this.activeTab) {
                    this.updateJSON();
                }
                this.updateHUD();
            };
        }
    },

    showScreen(screenId) {
        this.activeScreen = screenId;
        const screens = document.querySelectorAll('.screen');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        const activeScreenEl = document.getElementById(`screen-${screenId}`);
        if (activeScreenEl) {
            activeScreenEl.classList.add('active');
        }
    },

    updateHUD() {
        if (!window.gameEngine) return;

        const heroi = window.gameEngine.databases.heroi;
        const mundo = window.gameEngine.databases.mundo;

        const hudName = document.getElementById('hud-hero-name');
        const hudClass = document.getElementById('hud-hero-class');
        const hudLevel = document.getElementById('hud-hero-level');
        const hudTime = document.getElementById('hud-world-time');
        const hudWeather = document.getElementById('hud-world-weather');
        const hudWeatherIcon = document.getElementById('hud-weather-icon');

        if (hudName) hudName.textContent = heroi.nome || 'Arthur';
        if (hudClass) hudClass.textContent = heroi.classe || 'Programador';
        if (hudLevel) hudLevel.textContent = heroi.nivel || '1';
        if (hudTime) hudTime.textContent = mundo.hora || '06:00';
        if (hudWeather) hudWeather.textContent = mundo.clima || 'SOL';

        if (hudWeatherIcon) {
            if (mundo.clima === 'SOL') {
                hudWeatherIcon.innerHTML = '<i class="fa-solid fa-sun" style="color: #f1fa8c;"></i>';
            } else if (mundo.clima === 'CHUVA') {
                hudWeatherIcon.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy" style="color: #8be9fd;"></i>';
            } else {
                hudWeatherIcon.innerHTML = '<i class="fa-solid fa-cloud" style="color: #6272a4;"></i>';
            }
        }

        const finalName = document.getElementById('final-char-name');
        const finalClass = document.getElementById('final-char-class');
        const finalLevel = document.getElementById('final-char-level');
        const finalMana = document.getElementById('final-char-mana');
        const finalSkills = document.getElementById('final-char-skills');

        if (finalName) finalName.textContent = heroi.nome || 'Arthur';
        if (finalClass) finalClass.textContent = heroi.classe || 'Programador';
        if (finalLevel) finalLevel.textContent = heroi.nivel || '1';
        if (finalMana) finalMana.textContent = heroi.mana_maxima || '50';
        if (finalSkills) finalSkills.textContent = (heroi.habilidades || []).join(', ');
    },

    updateJSON() {
        if (!window.gameEngine) return;

        const data = window.gameEngine.databases[this.activeTab];
        const container = document.getElementById('json-visual-editor');
        if (!container) return;

        if (!data) {
            container.innerHTML = 'Nenhum dado disponível.';
            return;
        }

        container.innerHTML = this.renderJSONtoHTML(data);
    },

    renderJSONtoHTML(obj, depth = 0) {
        if (obj === null) return `<span class="json-null">null</span>`;
        if (typeof obj === 'boolean') return `<span class="json-boolean">${obj}</span>`;
        if (typeof obj === 'number') return `<span class="json-number">${obj}</span>`;
        if (typeof obj === 'string') return `<span class="json-string">"${obj}"</span>`;
        
        const indent = '  '.repeat(depth);
        const childIndent = '  '.repeat(depth + 1);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return `<span class="json-bracket">[]</span>`;
            let html = `<span class="json-bracket">[</span>\n`;
            html += obj.map(item => childIndent + this.renderJSONtoHTML(item, depth + 1)).join(',\n');
            html += '\n' + indent + `<span class="json-bracket">]</span>`;
            return html;
        }

        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return `<span class="json-bracket">{}</span>`;
            let html = `<span class="json-bracket">{</span>\n`;
            html += keys.map(key => {
                return childIndent + `<span class="json-key">"${key}"</span>: ` + this.renderJSONtoHTML(obj[key], depth + 1);
            }).join(',\n');
            html += '\n' + indent + `<span class="json-bracket">}</span>`;
            return html;
        }

        return String(obj);
    },

    showDialogue(speaker, text, callback) {
        const dialogBox = document.getElementById('game-dialog-box');
        const speakerTag = document.getElementById('dialog-speaker-name');
        const textContent = document.getElementById('dialog-text-content');

        if (!dialogBox || !speakerTag || !textContent) return;

        dialogBox.style.display = 'block';

        if (speaker === 'Arthur' && window.gameEngine && window.gameEngine.databases.heroi.nome) {
            speaker = window.gameEngine.databases.heroi.nome;
        }
        speakerTag.textContent = speaker;
        
        speakerTag.className = 'dialog-name-tag';
        const speakerLower = speaker.toLowerCase();
        if (speakerLower.includes('arthur')) {
            speakerTag.classList.add('luiza');
        } else if (speakerLower.includes('mago')) {
            speakerTag.classList.add('ruan');
        } else if (speakerLower.includes('mercador')) {
            speakerTag.classList.add('talita');
        } else if (speakerLower.includes('porta')) {
            speakerTag.classList.add('luiza');
        } else if (speakerLower.includes('narrador')) {
            speakerTag.classList.add('narrador');
        }

        this.currentText = text;
        this.onDialogClickCallback = callback;

        if (this.typingTimer) {
            clearInterval(this.typingTimer);
        }

        this.isTyping = true;
        textContent.textContent = '';
        let charIndex = 0;

        this.typingTimer = setInterval(() => {
            if (charIndex < text.length) {
                textContent.textContent += text.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(this.typingTimer);
                this.isTyping = false;
            }
        }, 15);
    },

    hideDialogue() {
        const dialogBox = document.getElementById('game-dialog-box');
        if (dialogBox) {
            dialogBox.style.display = 'none';
        }
    },

    showChoices(choices, onSelectCallback) {
        const choicesContainer = document.getElementById('game-choices-container');
        if (!choicesContainer) return;

        choicesContainer.innerHTML = '';
        choicesContainer.style.display = 'flex';

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
                <span>${choice.text}</span>
                <i class="fa-solid fa-angle-right"></i>
            `;
            btn.addEventListener('click', () => {
                choicesContainer.style.display = 'none';
                onSelectCallback(choice);
            });
            choicesContainer.appendChild(btn);
        });
    },

    hideChoices() {
        const choicesContainer = document.getElementById('game-choices-container');
        if (choicesContainer) {
            choicesContainer.style.display = 'none';
        }
    },

    showFeedback(text, isCorrect) {
        const overlay = document.getElementById('feedback-overlay');
        const card = document.getElementById('feedback-card');
        const icon = document.getElementById('feedback-card-icon');
        const content = document.getElementById('feedback-card-text');

        if (!overlay || !card || !icon || !content) return;

        content.textContent = text;
        
        if (isCorrect) {
            card.className = 'feedback-correct';
            icon.textContent = '✓';
        } else {
            card.className = 'feedback-incorrect';
            icon.textContent = '✗';
        }

        overlay.style.display = 'block';

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 2200);
    },

    restartGame() {
        console.log('[UIManager] Reiniciando o jogo');

        if (window.gameEngine) {
            window.gameEngine.databases.heroi = {
                nome: "",
                classe: "",
                nivel: 1,
                experiencia: 0,
                vida: 100,
                vida_maxima: 100,
                mana: 50,
                mana_maxima: 50,
                forca: 10,
                inteligencia: 10,
                destreza: 10,
                habilidades: [],
                conquistas: []
            };
            window.gameEngine.databases.inventario = {
                ouro: 0,
                itens: [],
                equipamentos: {
                    arma: null,
                    armadura: null,
                    acessorio: null
                }
            };
            window.gameEngine.databases.mundo = {
                hora: "06:00",
                clima: "SOL",
                localizacao: "floresta_inicial",
                regiao: "reino_codigo",
                cena_atual: "intro",
                eventos_ativos: [],
                estado_mundo: "normal"
            };
            window.gameEngine.currentState = window.gameEngine.GameState.MENU;
            window.gameEngine.triggerDatabaseUpdate('heroi');
            window.gameEngine.triggerDatabaseUpdate('inventario');
            window.gameEngine.triggerDatabaseUpdate('mundo');
        }

        const nameInput = document.getElementById('char-name');
        if (nameInput) nameInput.value = '';

        const classBtns = document.querySelectorAll('.class-btn');
        classBtns.forEach(btn => btn.classList.remove('selected'));
        this.selectedClass = '';

        document.getElementById('hacker-menu-panel').classList.remove('active');
        this.showScreen('char-create');

        if (window.game) {
            window.game.scene.stop('FinalScene');
            window.game.scene.start('CharacterCreationScene');
        }
    }
};

window.addEventListener('DOMContentLoaded', () => {
    UIManager.initDOM();
});

window.UIManager = UIManager;
