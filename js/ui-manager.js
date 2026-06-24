const UIManager = {
    activeScreen: 'menu',
    selectedClass: '',
    activeTab: 'heroi',
    isTyping: false,
    typingTimer: null,
    currentText: '',
    onDialogClickCallback: null,

    alignUI() {
        const canvas = document.querySelector('#game-container canvas');
        const uiLayer = document.getElementById('ui-layer');
        const gameContainer = document.getElementById('game-container');
        if (!canvas || !uiLayer || !gameContainer) return;

        const canvasRect = canvas.getBoundingClientRect();
        const parentRect = gameContainer.getBoundingClientRect();

        const left = canvasRect.left - parentRect.left;
        const top = canvasRect.top - parentRect.top;
        const width = canvasRect.width;
        const height = canvasRect.height;
        
        // Scale ui-layer (1280x720) to match canvas dimensions
        const scale = width / 1280;

        uiLayer.style.position = 'absolute';
        uiLayer.style.width = '1280px';
        uiLayer.style.height = '720px';
        uiLayer.style.left = '0px';
        uiLayer.style.top = '0px';
        uiLayer.style.transformOrigin = 'top left';
        uiLayer.style.transform = `translate(${left}px, ${top}px) scale(${scale})`;
    },

    initDOM() {
        console.log('[UIManager] Inicializando interface DOM');
        
        // Align UI to canvas on init, resize and periodically
        this.alignUI();
        window.addEventListener('resize', () => this.alignUI());
        setInterval(() => this.alignUI(), 200);

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
                const name = 'Arthur';

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

        const btnFullscreen = document.getElementById('btn-fullscreen');
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                this.toggleFullscreen();
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

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Erro ao ativar tela cheia: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
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

        const hudClass = document.getElementById('hud-hero-class');
        const hudLevel = document.getElementById('hud-hero-level');
        const hudTime = document.getElementById('hud-world-time');
        const hudWeather = document.getElementById('hud-world-weather');
        const hudWeatherIcon = document.getElementById('hud-weather-icon');
        const hudTimeIcon = document.getElementById('hud-time-icon');

        if (hudClass) hudClass.textContent = heroi.classe || 'Programador';
        if (hudLevel) hudLevel.textContent = heroi.nivel || '1';

        if (hudTime) {
            const timeValue = (mundo.hora || 'manha').toLowerCase();
            hudTime.textContent = timeValue.toUpperCase();
            if (hudTimeIcon) {
                if (timeValue === 'manha') {
                    hudTimeIcon.innerHTML = '<i class="fa-solid fa-cloud-sun" style="color: #ffb86c;"></i>';
                } else if (timeValue === 'tarde') {
                    hudTimeIcon.innerHTML = '<i class="fa-solid fa-sun" style="color: #ff79c6;"></i>';
                } else if (timeValue === 'noite') {
                    hudTimeIcon.innerHTML = '<i class="fa-solid fa-moon" style="color: #bd93f9;"></i>';
                } else {
                    hudTimeIcon.innerHTML = '<i class="fa-solid fa-clock" style="color: #f8f8f2;"></i>';
                }
            }
        }

        if (hudWeather) {
            const weatherValue = (mundo.clima || 'sol').toLowerCase();
            hudWeather.textContent = weatherValue.toUpperCase();
            if (hudWeatherIcon) {
                if (weatherValue === 'sol') {
                    hudWeatherIcon.innerHTML = '<i class="fa-solid fa-sun" style="color: #f1fa8c;"></i>';
                } else if (weatherValue === 'chuva') {
                    hudWeatherIcon.innerHTML = '<i class="fa-solid fa-cloud-showers-heavy" style="color: #8be9fd;"></i>';
                } else if (weatherValue === 'calor') {
                    hudWeatherIcon.innerHTML = '<i class="fa-solid fa-temperature-high" style="color: #ff5555;"></i>';
                } else if (weatherValue === 'frio') {
                    hudWeatherIcon.innerHTML = '<i class="fa-solid fa-snowflake" style="color: #8be9fd;"></i>';
                } else {
                    hudWeatherIcon.innerHTML = '<i class="fa-solid fa-cloud" style="color: #6272a4;"></i>';
                }
            }
        }

        const finalClass = document.getElementById('final-char-class');
        const finalLevel = document.getElementById('final-char-level');
        const finalMana = document.getElementById('final-char-mana');
        const finalSkills = document.getElementById('final-char-skills');

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

        // Mensagem especial quando a aba npcs ainda está vazia (nenhum personagem encontrado)
        if (this.activeTab === 'npcs' && (!data || Object.keys(data).length === 0)) {
            container.innerHTML = `<span style="color:#6272a4; font-style:italic; font-size:13px; line-height:1.7">
// Nenhum personagem descoberto ainda.<br>
// Continue avançando na história<br>
// para revelar os habitantes deste mundo.<br><br>
<span style="color:#44475a">// npcs: {}</span>
</span>`;
            return;
        }

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

        if ((speaker === 'Arthur' || speaker.toLowerCase().includes('arthur')) && window.gameEngine && window.gameEngine.databases.heroi.classe) {
            speaker = window.gameEngine.databases.heroi.classe;
        }
        speakerTag.textContent = speaker;
        
        speakerTag.className = 'dialog-name-tag';
        const speakerLower = speaker.toLowerCase();
        const currentHeroClass = (window.gameEngine && window.gameEngine.databases.heroi.classe) ? window.gameEngine.databases.heroi.classe.toLowerCase() : 'arthur';
        if (speakerLower.includes('arthur') || speakerLower.includes(currentHeroClass)) {
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
                hora: "manha",
                clima: "sol",
                localizacao: "floresta_inicial",
                regiao: "reino_codigo",
                cena_atual: "intro",
                eventos_ativos: [],
                estado_mundo: "normal"
            };
            // Reinicia os NPCs — serão revelados novamente conforme o jogador avança
            window.gameEngine.databases.npcs = {};
            window.gameEngine.currentState = window.gameEngine.GameState.MENU;
            window.gameEngine.triggerDatabaseUpdate('heroi');
            window.gameEngine.triggerDatabaseUpdate('inventario');
            window.gameEngine.triggerDatabaseUpdate('mundo');
            window.gameEngine.triggerDatabaseUpdate('npcs');

            // Limpa o cache do localStorage para não restaurar dados de sessões anteriores
            ['heroi', 'inventario', 'mundo', 'npcs', 'monstros'].forEach(tab => {
                localStorage.removeItem(`codequest:${tab}`);
            });
        }

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
