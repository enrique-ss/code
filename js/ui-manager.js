const UIManager = {
    activeScreen: 'menu',
    selectedClass: '',
    activeTab: 'heroi',
    isTyping: false,
    typingTimer: null,
    currentText: '',
    onDialogClickCallback: null,

    alignUI() {
        // Camada de UI agora é sobreposição de viewport 100%×100% — sem necessidade de escalonamento
        const uiLayer = document.getElementById('ui-layer');
        if (!uiLayer) return;
        uiLayer.style.position = 'absolute';
        uiLayer.style.width = '100%';
        uiLayer.style.height = '100%';
        uiLayer.style.left = '0';
        uiLayer.style.top = '0';
        uiLayer.style.transform = 'none';
    },

    initDOM() {
        console.log('[UIManager] Inicializando interface DOM');
        
        // Alinha UI na inicialização e redimensionamento
        this.alignUI();
        window.addEventListener('resize', () => this.alignUI());

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

                console.log(`[UIManager] Confirmando herói: Classe=${this.selectedClass}`);

                if (window.gameEngine) {
                    window.gameEngine.databases.heroi.classe = this.selectedClass;
                    
                    switch(this.selectedClass) {
                        case 'Guerreiro':
                            window.gameEngine.databases.heroi.inteligencia = 10;
                            window.gameEngine.databases.heroi.forca = 18;
                            window.gameEngine.databases.heroi.destreza = 12;
                            window.gameEngine.databases.heroi.vida = 120;
                            window.gameEngine.databases.heroi.habilidades = ['ataque_poderoso', 'defesa_escudo'];
                            window.gameEngine.databases.inventario.equipamentos = {
                                arma: { nome: 'Espada de Ferro', tipo: 'espada', bonus: '+3 forca' },
                                armadura: { nome: 'Armadura de Couro', tipo: 'armadura', bonus: '+5 defesa' },
                                acessorio: { nome: 'Anel de Força', tipo: 'anel', bonus: '+2 forca' }
                            };
                            break;
                        case 'Mago':
                            window.gameEngine.databases.heroi.inteligencia = 18;
                            window.gameEngine.databases.heroi.forca = 6;
                            window.gameEngine.databases.heroi.destreza = 10;
                            window.gameEngine.databases.heroi.mana = 80;
                            window.gameEngine.databases.heroi.habilidades = ['bola_de_fogo', 'escudo_magico'];
                            window.gameEngine.databases.inventario.equipamentos = {
                                arma: { nome: 'Cajado Básico', tipo: 'cajado', bonus: '+5 inteligencia' },
                                armadura: { nome: 'Túnica de Linho', tipo: 'tunica', bonus: '+3 mana' },
                                acessorio: { nome: 'Amuleto Arcano', tipo: 'amuleto', bonus: '+2 inteligencia' }
                            };
                            break;
                        case 'Arqueiro':
                            window.gameEngine.databases.heroi.inteligencia = 12;
                            window.gameEngine.databases.heroi.forca = 10;
                            window.gameEngine.databases.heroi.destreza = 18;
                            window.gameEngine.databases.heroi.habilidades = ['tiro_preciso', 'furtividade'];
                            window.gameEngine.databases.inventario.equipamentos = {
                                arma: { nome: 'Arco Curto', tipo: 'arco', bonus: '+3 destreza' },
                                armadura: { nome: 'Armadura Leve', tipo: 'armadura', bonus: '+3 defesa' },
                                acessorio: { nome: 'Capa de Caçador', tipo: 'capa', bonus: '+2 destreza' }
                            };
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

        // Delegador de cliques para edição de JSON no console
        const jsonVisualEditor = document.getElementById('json-visual-editor');
        if (jsonVisualEditor) {
            jsonVisualEditor.addEventListener('click', (e) => {
                const target = e.target.closest('.json-value-editable');
                if (target) {
                    const path = target.getAttribute('data-path');
                    const tab = this.activeTab;
                    const currentVal = target.textContent.replace(/"/g, ''); // limpa aspas
                    
                    const newVal = prompt(`Modificar valor de [${tab}] em "${path}":`, currentVal);
                    if (newVal !== null && newVal !== currentVal) {
                        const res = window.gameEngine.updateJSONDirectly(tab, path, newVal);
                        if (res.success) {
                            this.updateJSON();
                            this.updateHUD();
                        } else {
                            alert("Erro ao editar: " + res.error);
                        }
                    }
                }
            });
        }

        // Métodos auxiliares globais expostos para os botões do DOM
        window.UIManager = this;
        window.UIManager.triggerCraft = (recipeName) => {
            const res = window.gameEngine.craftItem(recipeName);
            alert(res.message);
            this.updateJSON();
            this.updateHUD();
        };

        window.UIManager.triggerLearnSkill = (skillName) => {
            const heroi = window.gameEngine.databases.heroi;
            heroi.habilidades.push(skillName);
            window.gameEngine.triggerDatabaseUpdate('heroi');
            this.updateJSON();
            this.updateHUD();
            alert(`Habilidade '${skillName}' desbloqueada!`);
        };

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
                // Ignore clicks if choices are active
                const choicesContainer = document.getElementById('game-choices-container');
                if (choicesContainer && choicesContainer.style.display === 'flex') {
                    return;
                }
                
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
                // Always update both JSON and HUD for complete synchronization
                this.updateJSON();
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

        const hudTime = document.getElementById('hud-world-time');
        const hudWeather = document.getElementById('hud-world-weather');
        const hudWeatherIcon = document.getElementById('hud-weather-icon');
        const hudTimeIcon = document.getElementById('hud-time-icon');

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

        // Atualização do Painel de Status Lateral
        const sidebar = document.getElementById('status-sidebar-panel');
        if (sidebar) {
            if (this.activeScreen === 'game') {
                sidebar.style.display = 'flex';
                
                // Calcula Dano base
                let dmg = heroi.forca;
                if (heroi.classe === 'Mago') dmg = heroi.inteligencia;
                else if (heroi.classe === 'Arqueiro') dmg = heroi.destreza;

                // Equipamento bônus
                const arma = window.gameEngine.databases.inventario.equipamentos.arma;
                if (arma) {
                    const bonusMatch = (arma.bonus || '').match(/\+(\d+)/);
                    if (bonusMatch) dmg += Number(bonusMatch[1]);
                }

                // Buff de clima
                const clima = (mundo.clima || 'sol').toLowerCase();
                let climaBuffText = "";
                if (clima === 'calor' && heroi.classe === 'Mago') {
                    dmg += 4;
                    climaBuffText = " (+4 Mágico)";
                } else if (clima === 'chuva' && heroi.classe === 'Mago') {
                    dmg -= 3;
                    climaBuffText = " (-3 Chuva)";
                }

                document.getElementById('status-val-dano').textContent = `${dmg}${climaBuffText}`;

                // Armadura
                let def = 0;
                const armadura = window.gameEngine.databases.inventario.equipamentos.armadura;
                if (armadura) {
                    const bonusMatch = (armadura.bonus || '').match(/\+(\d+)/);
                    if (bonusMatch) def += Number(bonusMatch[1]);
                }
                document.getElementById('status-val-armadura').textContent = def;

                // Fama
                document.getElementById('status-val-fama').textContent = heroi.fama;

                // Ouro
                document.getElementById('status-val-ouro').textContent = window.gameEngine.databases.inventario.ouro;
            } else {
                sidebar.style.display = 'none';
            }
        }

        // Controla estado de glitch visual
        document.body.classList.toggle('glitch-active', !!mundo.glitch_ativo);

        const finalClass = document.getElementById('final-char-class');
        const finalLevel = document.getElementById('final-char-level');
        const finalMana = document.getElementById('final-char-mana');
        const finalSkills = document.getElementById('final-char-skills');
        const finalEnding = document.getElementById('final-ending-desc');

        if (finalClass) finalClass.textContent = heroi.classe || 'Programador';
        if (finalLevel) finalLevel.textContent = heroi.nivel || '1';
        if (finalMana) finalMana.textContent = heroi.mana || '50';
        if (finalSkills) finalSkills.textContent = (heroi.habilidades || []).join(', ');

        if (finalEnding) {
            let endingText = "";
            if (heroi.fama >= 60) {
                endingText = "Herói da Comunidade - Seus atos de cooperação com os NPCs do Reino do Código espalharam sua fama por todo o continente.";
            } else if (heroi.fama <= 40) {
                endingText = "Desenvolvedor Pragmático - Você resolveu os desafios de forma estritamente racional, ignorando a opinião alheia.";
            } else {
                endingText = "Final Equilibrado - Você manteve uma postura neutra, resolvendo os problemas e garantindo sua passagem de volta.";
            }

            if (mundo.segredo_desbloqueado) {
                endingText += " [Hacker Lendário] Além disso, você manipulou as variáveis profundas do universo para destrancar caminhos ocultos!";
            }

            const clima = (mundo.clima || 'sol').toLowerCase();
            if (clima === 'sol') endingText += " O Reino amanheceu sob um lindo Sol, celebrando sua jornada.";
            else if (clima === 'chuva') endingText += " Uma Chuva reconfortante cobriu o portal na sua despedida.";
            else if (clima === 'neve') endingText += " Flocos de Neve decoraram o portal durante sua transição.";
            else if (clima === 'tempestade') endingText += " Relâmpagos de uma Tempestade épica ecoaram no horizonte.";
            else if (clima === 'neblina') endingText += " Uma misteriosa Neblina encobriu seus passos de volta para casa.";

            finalEnding.textContent = endingText;
        }
    },

    updateJSON() {
        if (!window.gameEngine) return;

        const data = window.gameEngine.databases[this.activeTab];
        const container = document.getElementById('json-visual-editor');
        if (!container) return;

        // Custom formatting for Crafting Tab
        if (this.activeTab === 'crafting') {
            let html = `<span style="color:#bd93f9; font-weight:bold;">// SISTEMA DE CRAFTING</span>\n\n`;
            html += `<span style="color:#6272a4;">Recursos Disponíveis:</span>\n`;
            const resources = window.gameEngine.databases.inventario.itens;
            const erva = resources.find(i => i.nome === 'erva')?.quantidade || 0;
            const minerio = resources.find(i => i.nome === 'minério')?.quantidade || 0;
            html += `  <span class="json-key">"erva"</span>: <span class="json-number">${erva}</span>,\n`;
            html += `  <span class="json-key">"minério"</span>: <span class="json-number">${minerio}</span>\n\n`;
            
            html += `<span style="color:#6272a4;">Receitas Desbloqueadas:</span>\n`;
            data.receitas.forEach(recipe => {
                const reqs = Object.entries(recipe.ingredientes).map(([ing, qty]) => `${qty}x ${ing}`).join(', ');
                html += `<div style="margin: 8px 0; padding: 10px; border: 1.5px dashed #6272a4; border-radius: 8px; background: rgba(98, 114, 164, 0.05); display: flex; justify-content: space-between; align-items: center;">`;
                html += `  <div><span style="color:#f1fa8c; font-weight:bold; font-size:13px;">${recipe.nome}</span> <span style="color:#6272a4; font-size:11px;">(${reqs})</span></div>`;
                html += `  <button onclick="UIManager.triggerCraft('${recipe.nome}')" style="background:#50fa7b; color:#282a36; border:none; border-radius:6px; padding:4px 10px; font-weight:bold; cursor:pointer; font-size:11px; font-family:'Outfit', sans-serif;">CRIAR</button>`;
                html += `</div>`;
            });
            container.innerHTML = html;
            return;
        }

        // Custom formatting for Skills Tree Tab
        if (this.activeTab === 'habilidades_classe') {
            const heroi = window.gameEngine.databases.heroi;
            const skillsList = data[heroi.classe] || [];
            let html = `<span style="color:#ff79c6; font-weight:bold;">// ÁRVORE DE HABILIDADES (${heroi.classe.toUpperCase()})</span>\n\n`;
            skillsList.forEach(skill => {
                const hasSkill = heroi.habilidades.includes(skill);
                html += `<div style="margin: 8px 0; padding: 10px; border: 1.5px solid ${hasSkill ? '#50fa7b' : '#6272a4'}; background: ${hasSkill ? 'rgba(80,250,123,0.05)' : 'rgba(0,0,0,0.2)'}; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">`;
                html += `  <span style="color:${hasSkill ? '#50fa7b' : '#f8f8f2'}; font-weight:bold; font-size:13px;">${skill}</span>`;
                if (hasSkill) {
                    html += `  <span style="color:#50fa7b; font-size:11px; font-weight:bold;"><i class="fa-solid fa-check"></i> Ativa</span>`;
                } else {
                    html += `  <button onclick="UIManager.triggerLearnSkill('${skill}')" style="background:#8be9fd; color:#282a36; border:none; border-radius:6px; padding:4px 10px; font-weight:bold; cursor:pointer; font-size:11px; font-family:'Outfit', sans-serif;">APRENDER</button>`;
                }
                html += `</div>`;
            });
            container.innerHTML = html;
            return;
        }

        // Mensagem especial quando a aba npcs ainda está vazia (nenhum personagem encontrado)
        if (this.activeTab === 'npcs' && (!data || Object.keys(data).length === 0)) {
            container.innerHTML = `<span style="color:#6272a4; font-style:italic; font-size:13px; line-height:1.7">
// Nenhum personagem descoberto ainda.
</span>`;
            return;
        }

        // Mensagem especial quando a aba monstros ainda está vazia (nenhum monstro encontrado)
        if (this.activeTab === 'monstros' && (!data || Object.keys(data).length === 0)) {
            container.innerHTML = `<span style="color:#6272a4; font-style:italic; font-size:13px; line-height:1.7">
// Nenhum monstro encontrado ainda.
</span>`;
            return;
        }

        if (!data) {
            container.innerHTML = 'Nenhum dado disponível.';
            return;
        }

        container.innerHTML = this.renderJSONtoHTML(data);
    },

    renderJSONtoHTML(obj, depth = 0, path = '') {
        if (obj === null) return `<span class="json-null json-value-editable" data-path="${path}">null</span>`;
        if (typeof obj === 'boolean') return `<span class="json-boolean json-value-editable" data-path="${path}">${obj}</span>`;
        if (typeof obj === 'number') return `<span class="json-number json-value-editable" data-path="${path}">${obj}</span>`;
        if (typeof obj === 'string') return `<span class="json-string json-value-editable" data-path="${path}">"${obj}"</span>`;
        
        const indent = '  '.repeat(depth);
        const childIndent = '  '.repeat(depth + 1);

        if (Array.isArray(obj)) {
            if (obj.length === 0) return `<span class="json-bracket">[]</span>`;
            let html = `<span class="json-bracket">[</span>\n`;
            html += obj.map((item, index) => childIndent + this.renderJSONtoHTML(item, depth + 1, `${path}[${index}]`)).join(',\n');
            html += '\n' + indent + `<span class="json-bracket">]</span>`;
            return html;
        }

        if (typeof obj === 'object') {
            const keys = Object.keys(obj);
            if (keys.length === 0) return `<span class="json-bracket">{}</span>`;
            let html = `<span class="json-bracket">{</span>\n`;
            html += keys.map(key => {
                const nextPath = path ? `${path}.${key}` : key;
                return childIndent + `<span class="json-key">"${key}"</span>: ` + this.renderJSONtoHTML(obj[key], depth + 1, nextPath);
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
            dialogBox.classList.remove('choices-active');
        }
    },

    showChoices(choices, onSelectCallback) {
        const choicesContainer = document.getElementById('game-choices-container');
        const dialogBox = document.getElementById('game-dialog-box');
        if (!choicesContainer) return;

        choicesContainer.innerHTML = '';
        choicesContainer.style.display = 'flex';

        // Add choices-active class to dialog box to disable hover effects
        if (dialogBox) {
            dialogBox.classList.add('choices-active');
        }

        choices.forEach(choice => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.innerHTML = `
                <span>${choice.text}</span>
                <i class="fa-solid fa-angle-right"></i>
            `;
            btn.addEventListener('click', () => {
                choicesContainer.style.display = 'none';
                // Remove choices-active class when choices are hidden
                if (dialogBox) {
                    dialogBox.classList.remove('choices-active');
                }
                onSelectCallback(choice);
            });
            choicesContainer.appendChild(btn);
        });
    },

    hideChoices() {
        const choicesContainer = document.getElementById('game-choices-container');
        const dialogBox = document.getElementById('game-dialog-box');
        if (choicesContainer) {
            choicesContainer.style.display = 'none';
        }
        // Remove choices-active class when choices are hidden
        if (dialogBox) {
            dialogBox.classList.remove('choices-active');
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
                classe: "",
                nivel: 1,
                experiencia: 0,
                vida: 100,
                mana: 50,
                forca: 10,
                inteligencia: 10,
                destreza: 10,
                habilidades: []
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
            // Reinicia os NPCs e monstros — serão revelados novamente conforme o jogador avança
            window.gameEngine.databases.npcs = {};
            window.gameEngine.databases.monstros = {};
            window.gameEngine.currentState = window.gameEngine.GameState.MENU;
            window.gameEngine.triggerDatabaseUpdate('heroi');
            window.gameEngine.triggerDatabaseUpdate('inventario');
            window.gameEngine.triggerDatabaseUpdate('mundo');
            window.gameEngine.triggerDatabaseUpdate('npcs');
            window.gameEngine.triggerDatabaseUpdate('monstros');

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
    },

    startTimingGame(callback) {
        const container = document.getElementById('combat-timing-container');
        const indicator = document.getElementById('timing-indicator');
        const hitBtn = document.getElementById('btn-timing-hit');
        if (!container || !indicator || !hitBtn) {
            callback("normal");
            return;
        }

        container.style.display = 'block';
        
        let position = 0;
        let speed = 2.5;
        
        const clima = (window.gameEngine && window.gameEngine.databases.mundo.clima || 'sol').toLowerCase();
        if (clima === 'neblina') {
            speed = 4.5;
        }

        let direction = 1;
        let active = true;

        const updateSlider = () => {
            if (!active) return;
            position += speed * direction;
            if (position >= 96) {
                position = 96;
                direction = -1;
            } else if (position <= 0) {
                position = 0;
                direction = 1;
            }
            indicator.style.left = `${position}%`;
            requestAnimationFrame(updateSlider);
        };

        requestAnimationFrame(updateSlider);

        const stopAndCheck = () => {
            if (!active) return;
            active = false;
            
            hitBtn.removeEventListener('click', stopAndCheck);
            document.removeEventListener('keydown', keyHandler);

            let result = "fail";
            if (position >= 65 && position <= 80) {
                result = "critical";
            } else if (position >= 40 && position <= 90) {
                result = "normal";
            }

            setTimeout(() => {
                container.style.display = 'none';
                callback(result);
            }, 1000);
        };

        const keyHandler = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                stopAndCheck();
            }
        };

        hitBtn.addEventListener('click', stopAndCheck);
        document.addEventListener('keydown', keyHandler);
    }
};

window.addEventListener('DOMContentLoaded', () => {
    UIManager.initDOM();
});

window.UIManager = UIManager;
