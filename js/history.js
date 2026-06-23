const StoryNodes = {
    // ==================== ATO 1: O DESPERTAR NO MUNDO DE FANTASIA ====================
    
    despertar: {
        bg: "planicie_inicial",
        skipAmbience: true,
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você abre os olhos lentamente. O céu acima é um azul brilhante, mais intenso do que qualquer céu que já viu. A grama é verdejante, macia sob seu corpo."
            },
            { 
                speaker: "Narrador", 
                text: "Ao seu lado, uma espada enferrujada descansa na grama. Você se levanta, confuso, e percebe que não está mais em seu ambiente familiar."
            },
            { 
                speaker: "Jogador", 
                text: "Que diabos... Eu estava programando até tarde... *(olha ao redor)* Isso não é meu quarto. Isso não é nem a Terra."
            },
            { 
                speaker: "Narrador", 
                text: "Você foca sua visão, e de repente, um painel flutuante aparece diante de seus olhos — uma interface holográfica semelhante a um terminal de comando."
            },
            { 
                speaker: "Jogador", 
                text: "Isso... isso é JSON! *(sorri)* Eu entendi. Fui transportado para dentro de um jogo de fantasia medieval. Um Isekai clássico!"
            },
            { 
                speaker: "Jogador", 
                text: "E olha só... consigo ver os dados de tudo ao meu redor. *(examina o painel)* Mas espera... só tenho acesso de leitura ao meu próprio perfil. Não posso modificar meus atributos diretamente."
            },
            { 
                speaker: "Narrador", 
                text: "Você percebe que, embora não possa alterar a si mesmo, pode inspecionar e manipular os dados de tudo mais no mundo — monstros, NPCs, itens, até o clima e o tempo."
            },
            { 
                speaker: "Jogador", 
                text: "Interessante. A realidade obedece a regras de programação. Se eu entender a lógica por trás desse código, talvez eu consiga encontrar um caminho de volta... ou pelo menos sobreviver até lá."
            }
        ],
        choices: [
            { text: "Examinar meus próprios atributos", target: "examinar_atributos" },
            { text: "Investigar a espada enferrujada", target: "examinar_espada" },
            { text: "Explorar a planície", target: "explorar_planicie" }
        ]
    },

    examinar_atributos: {
        bg: "planicie_inicial",
        dialogs: [
            { 
                speaker: "Jogador", 
                text: "Vamos ver o que o sistema tem sobre mim... *(foca no painel flutuante)*"
            },
            { 
                speaker: "Narrador", 
                text: "Você examina seus dados no painel JSON. Nível 1, vida máxima, mana, força, inteligência, destreza."
            },
            { 
                speaker: "Jogador", 
                text: "Inteligência alta... *(ri)* Faz sentido. Minha mente analítica de programador se traduziu em atributo de inteligência neste mundo."
            },
            { 
                speaker: "Jogador", 
                text: "E olha essas habilidades: análise de código, depuração, otimização. O sistema reconheceu minhas habilidades de programação como habilidades mágicas."
            },
            { 
                speaker: "Narrador", 
                text: "Você percebe que suas habilidades de programador podem ser usadas de maneiras inesperadas neste mundo de fantasia."
            },
            { 
                speaker: "Jogador", 
                text: "Se eu consigo entender a lógica por trás das magias e mecânicas deste mundo, posso usá-las a meu favor. Vamos explorar."
            }
        ],
        choices: [
            { text: "Investigar a espada enferrujada", target: "examinar_espada" },
            { text: "Explorar a planície", target: "explorar_planicie" }
        ]
    },

    examinar_espada: {
        bg: "planicie_inicial",
        dialogs: [
            { 
                speaker: "Jogador", 
                text: "Vamos ver o que essa espada tem... *(pega a espada enferrujada)*"
            },
            { 
                speaker: "Narrador", 
                text: "Você foca na espada e o painel flutuante exibe seus dados JSON."
            },
            { 
                speaker: "Jogador", 
                text: "Espada Enferrujada. Dano baixo. *(pondera)* Não é grande coisa, mas é melhor do que nada."
            },
            { 
                speaker: "Jogador", 
                text: "Interessante... consigo ver a estrutura do objeto. Se eu entender como o sistema calcula dano, talvez eu possa otimizar isso."
            },
            { 
                speaker: "Narrador", 
                text: "Você guarda a espada e sente-se mais confiante. Sua mente de programador já está analisando as possibilidades."
            },
            { 
                speaker: "Jogador", 
                text: "Vamos explorar. Preciso entender melhor como este mundo funciona — do ponto de vista do código."
            }
        ],
        choices: [
            { text: "Examinar meus atributos", target: "examinar_atributos" },
            { text: "Explorar a planície", target: "explorar_planicie" }
        ]
    },

    explorar_planicie: {
        bg: "planicie_inicial",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você começa a caminhar pela planície. Ao longe, vê uma vila pequena e, mais perto, algo verde e gelatinoso se movendo."
            },
            { 
                speaker: "Jogador", 
                text: "O que é aquilo? *(foca a visão)* Um Slime Verde! Clássico."
            },
            { 
                speaker: "Narrador", 
                text: "O painel flutuante exibe os dados do monstro: vida, ataque, defesa, experiência."
            },
            { 
                speaker: "Jogador", 
                text: "Vida, ataque... *(calcula mentalmente)* Com minha espada, vou precisar de alguns golpes para derrotá-lo."
            },
            { 
                speaker: "Jogador", 
                text: "E se eu modificar os dados do monstro... *(experimenta)* Não, não consigo alterar dados de combate ativos. O sistema tem proteções."
            },
            { 
                speaker: "Narrador", 
                text: "Você percebe que há limitações ao que pode manipular, mas ainda assim, o conhecimento é poder."
            }
        ],
        choices: [
            { text: "Lutar contra o Slime Verde", target: "lutar_slime" },
            { text: "Ir para a vila", target: "ir_vila" }
        ]
    },

    lutar_slime: {
        bg: "planicie_inicial",
        effects: {
            experience: 10,
            addItem: {
                name: "Gel de Slime",
                quantity: 1
            }
        },
        dialogs: [
            { 
                speaker: "Jogador", 
                text: "Vamos testar minha teoria. *(saca a espada)*"
            },
            { 
                speaker: "Narrador", 
                text: "Você avança contra o Slime Verde. Calcula o ângulo de ataque, considerando a defesa do monstro."
            },
            { 
                speaker: "Jogador", 
                text: "Dano base menos defesa... *(ataca)*"
            },
            { 
                speaker: "Narrador", 
                text: "O Slime recebe o golpe e perde vida. Você continua calculando e atacando até o monstro ser derrotado."
            },
            { 
                speaker: "Jogador", 
                text: "Experiência ganha. *(sorri)* O sistema funciona exatamente como eu previ. Matemática pura."
            },
            { 
                speaker: "Narrador", 
                text: "O Slime derrota deixa um item. Você o coleta."
            },
            { 
                speaker: "Jogador", 
                text: "Gel de Slime... provavelmente pode ser usado para crafting. Vou guardar."
            }
        ],
        choices: [
            { text: "Ir para a vila", target: "ir_vila" }
        ]
    },

    ir_vila: {
        bg: "vila_pequena",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você chega à vila pequena. Casas de madeira, uma fonte no centro, e NPCs andando por todos os lados."
            },
            { 
                speaker: "Jogador", 
                text: "Interessante... *(foca em um aldeão)* Posso ver os dados de cada NPC. Vida, diálogo, missões disponíveis."
            },
            { 
                speaker: "Aldeão", 
                text: "Bem-vindo, viajante! Você parece novo por aqui."
            },
            { 
                speaker: "Jogador", 
                text: "Olá. Sou um viajante. *(pensa)* O diálogo dele é pré-programado, mas posso interagir normalmente."
            },
            { 
                speaker: "Aldeão", 
                text: "Nome incomum. Você é aventureiro?"
            },
            { 
                speaker: "Jogador", 
                text: "Você pode dizer isso. Estou explorando este mundo... *(sorri)* e aprendendo como ele funciona."
            }
        ],
        choices: [
            { text: "Perguntar sobre o Reino", target: "perguntar_reino" },
            { text: "Procurar o ferreiro", target: "procurar_ferreiro" },
            { text: "Visitar o mercador", target: "visitar_mercador" }
        ]
    },

    perguntar_reino: {
        bg: "vila_pequena",
        dialogs: [
            { 
                speaker: "Jogador", 
                text: "O que você pode me contar sobre este reino?"
            },
            { 
                speaker: "Aldeão", 
                text: "Este é um reino de paz e magia. Nossa governante governa com sabedoria há muitos anos."
            },
            { 
                speaker: "Jogador", 
                text: "Governante... *(foca no painel)* O sistema tem dados sobre a governança. Isso pode ser útil."
            },
            { 
                speaker: "Aldeão", 
                text: "Mas ultimamente, monstros têm ficado mais agressivos perto da vila. Alguns dizem que algo está acontecendo na masmorra real."
            },
            { 
                speaker: "Jogador", 
                text: "Masmorra real... *(calcula)* Provavelmente uma área de conteúdo de nível mais alto. Vou precisar subir de nível antes."
            },
            { 
                speaker: "Narrador", 
                text: "Você percebe que este mundo tem uma estrutura progressiva típica de RPGs."
            }
        ],
        choices: [
            { text: "Procurar o ferreiro", target: "procurar_ferreiro" },
            { text: "Visitar o mercador", target: "visitar_mercador" }
        ]
    },

    procurar_ferreiro: {
        bg: "ferreiria",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você encontra a ferreiria. O ferreiro está trabalhando em uma bigorna."
            },
            { 
                speaker: "Ferreiro", 
                text: "Precisa de armas, viajante?"
            },
            { 
                speaker: "Jogador", 
                text: "Talvez. *(examina os dados do ferreiro)* Missão disponível."
            },
            { 
                speaker: "Jogador", 
                text: "Você tem uma missão para mim?"
            },
            { 
                speaker: "Ferreiro", 
                text: "Sim! Preciso de minério de ferro para fazer armas melhores. Se você me trouxer, posso melhorar sua espada."
            },
            { 
                speaker: "Jogador", 
                text: "Coletar minério... *(pensa)* Isso provavelmente envolve explorar uma mina ou derrotar monstros específicos. Quest clássica."
            },
            { 
                speaker: "Jogador", 
                text: "Aceito a missão. *(sorri)* Vou analisar onde encontrar o minério mais eficientemente."
            }
        ],
        choices: [
            { text: "Visitar o mercador primeiro", target: "visitar_mercador" },
            { text: "Partir para coletar minério", target: "coletar_minerio" }
        ]
    },

    visitar_mercador: {
        bg: "loja_mercador",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você entra na loja do mercador. Prateleiras cheias de poções e itens."
            },
            { 
                speaker: "Mercador", 
                text: "Tenho as melhores poções! O que deseja?"
            },
            { 
                speaker: "Jogador", 
                text: "Vamos ver... *(examina os itens)* Poção de Vida, Poção de Mana. Preços razoáveis."
            },
            { 
                speaker: "Jogador", 
                text: "Tenho 0 de ouro no inventário. *(verifica)* Vou precisar ganhar algum dinheiro primeiro."
            },
            { 
                speaker: "Mercador", 
                text: "Sem ouro? Sem problemas! Monstros dropam ouro, e você pode vender itens que encontra."
            },
            { 
                speaker: "Jogador", 
                text: "Entendido. Sistema econômico baseado em drops e vendas. Vou voltar quando tiver recursos."
            }
        ],
        choices: [
            { text: "Procurar o ferreiro", target: "procurar_ferreiro" },
            { text: "Partir para coletar minério", target: "coletar_minerio" }
        ]
    },

    coletar_minerio: {
        bg: "mina_abandonada",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você parte para a mina abandonada. O local é escuro, mas consegue ver graças à luz que entra pelas aberturas."
            },
            { 
                speaker: "Jogador", 
                text: "Mina abandonada... *(foca no painel)* Localização, clima, probabilidade de monstros."
            },
            { 
                speaker: "Narrador", 
                text: "Você encontra minério de ferro espalhado pelo chão, mas também encontra inimigos guardando a área."
            },
            { 
                speaker: "Jogador", 
                text: "Inimigos... *(calcula)* Posso derrotá-los, mas vou precisar de estratégia."
            },
            { 
                speaker: "Jogador", 
                text: "Vou usar minha habilidade de análise de código para encontrar padrões em seus movimentos."
            },
            { 
                speaker: "Narrador", 
                text: "Você observa os inimigos e percebe que eles seguem rotinas previsíveis — como código mal escrito."
            },
            { 
                speaker: "Jogador", 
                text: "Eles têm um bug no comportamento de patrulha. Posso explorar isso para coletar o minério sem combate desnecessário."
            }
        ],
        choices: [
            { text: "Usar o bug para coletar minério", target: "coletar_com_bug" },
            { text: "Lutar contra os inimigos", target: "lutar_inimigos" }
        ]
    },

    coletar_com_bug: {
        bg: "mina_abandonada",
        effects: {
            addItem: {
                name: "Minério de Ferro",
                quantity: 5
            },
            location: "Vila Pequena"
        },
        dialogs: [
            { 
                speaker: "Jogador", 
                text: "Vou esperar o momento certo... *(observa o padrão de movimento)*"
            },
            { 
                speaker: "Narrador", 
                text: "Você espera até os inimigos se afastarem e rapidamente coleta o minério de ferro."
            },
            { 
                speaker: "Jogador", 
                text: "Minério coletado. *(sorri)* Otimização completa. Sem dano recebido."
            },
            { 
                speaker: "Narrador", 
                text: "Você volta para a vila com o minério, sentindo-se satisfeito com sua abordagem analítica."
            },
            { 
                speaker: "Jogador", 
                text: "Programação não é só sobre código — é sobre encontrar soluções eficientes. E isso se aplica a tudo neste mundo."
            }
        ],
        choices: [
            { text: "Voltar ao ferreiro", target: "voltar_ferreiro" }
        ]
    },

    lutar_inimigos: {
        bg: "mina_abandonada",
        effects: {
            experience: 25,
            addItem: {
                name: "Minério de Ferro",
                quantity: 5
            },
            location: "Vila Pequena"
        },
        dialogs: [
            { 
                speaker: "Jogador", 
                text: "Vou fazer da maneira tradicional. *(saca a espada)*"
            },
            { 
                speaker: "Narrador", 
                text: "Você luta contra os inimigos. Usa sua espada enferrujada, mas sua inteligência ajuda a prever os ataques."
            },
            { 
                speaker: "Jogador", 
                text: "Ataque contra minha defesa... *(desvia)* Consigo prever o padrão de ataque."
            },
            { 
                speaker: "Narrador", 
                text: "Após uma batalha difícil, você derrota os inimigos e coleta o minério."
            },
            { 
                speaker: "Jogador", 
                text: "Vida perdida, mas missão completa. *(recupera fôlego)* A abordagem analítica funcionou, mas foi mais custosa."
            },
            { 
                speaker: "Jogador", 
                text: "Próxima vez, vou tentar otimizar o processo. Eficiência é tudo."
            }
        ],
        choices: [
            { text: "Voltar ao ferreiro", target: "voltar_ferreiro" }
        ]
    },

    voltar_ferreiro: {
        bg: "ferreiria",
        effects: {
            removeItem: {
                name: "Minério de Ferro",
                quantity: 5
            },
            addItem: {
                name: "Espada Melhorada",
                quantity: 1,
                properties: {
                    dano: 8
                }
            },
            removeItem: {
                name: "Espada Enferrujada",
                quantity: 1
            }
        },
        dialogs: [
            { 
                speaker: "Ferreiro", 
                text: "Você voltou! Conseguiu o minério?"
            },
            { 
                speaker: "Jogador", 
                text: "Sim. Minério de ferro. *(entrega)*"
            },
            { 
                speaker: "Ferreiro", 
                text: "Excelente! Vou melhorar sua espada agora mesmo."
            },
            { 
                speaker: "Narrador", 
                text: "O ferreiro trabalha na espada e a devolve com uma qualidade melhor."
            },
            { 
                speaker: "Jogador", 
                text: "Espada Melhorada. Dano aumentado. *(examina os dados)* O sistema atualizou os atributos corretamente."
            },
            { 
                speaker: "Ferreiro", 
                text: "Com essa espada, você pode enfrentar desafios maiores. Boa sorte!"
            },
            { 
                speaker: "Jogador", 
                text: "Obrigado. *(pensa)* Este mundo funciona de forma previsível. Se eu entender as regras, posso dominá-lo."
            }
        ],
        choices: [
            { text: "Continuar a jornada", target: "continuar_jornada" }
        ]
    },

    continuar_jornada: {
        bg: "planicie_inicial",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você sai da vila com sua espada melhorada. Olha para o horizonte, pronto para explorar mais deste mundo."
            },
            { 
                speaker: "Jogador", 
                text: "Comecei do zero, mas já estou entendendo como este mundo funciona. *(sorri)* A programação me dá uma vantagem única."
            },
            { 
                speaker: "Jogador", 
                text: "Vou continuar explorando, coletando dados, e otimizando minha jornada. Quem sabe, talvez eu encontre um bug no sistema que me leve de volta para casa."
            },
            { 
                speaker: "Narrador", 
                text: "Você caminha em direção ao desconhecido, sua mente analítica pronta para decifrar os segredos deste mundo de fantasia."
            },
            { 
                speaker: "Jogador", 
                text: "A aventura só está começando. *(foca no painel flutuante)* E eu tenho o código fonte do mundo nas mãos."
            }
        ],
        choices: [
            { text: "Continuar explorando", target: "fim_jogo" }
        ]
    },

    fim_jogo: {
        bg: "planicie_inicial",
        dialogs: [
            { 
                speaker: "Narrador", 
                text: "Você continua sua jornada pelo reino, usando sua mente de programador para navegar pelos desafios deste mundo de fantasia."
            },
            { 
                speaker: "Jogador", 
                text: "Este é apenas o começo. *(sorri)* Vou descobrir todos os segredos deste código... e quem sabe, encontrar um caminho de volta para casa."
            },
            { 
                speaker: "Narrador", 
                text: "A história do Programador Isekai está apenas começando. Sua jornada épica se tornará uma grande aula de programação."
            }
        ],
        choices: []
    }
};

function applyAmbienceToStoryNodes() {
    Object.values(StoryNodes).forEach(node => {
        if (!node.dialogs || !node.bg || node.skipAmbience) return;

        const ambience = AMBIENCE_BY_BG[node.bg];
        if (!ambience) return;

        node.dialogs.forEach(dialog => {
            if (dialog.speaker === "Narrador" && !dialog.text.includes("Protagonista")) {
                dialog.text = `${dialog.text} ${ambience}`;
            }
        });
    });
}

applyAmbienceToStoryNodes();