/**
 * CODE QUEST - HISTORY & STORY
 * Contém os 3 cenários educacionais e encontros de combate interativos
 */

const StoryNodes = {
    // ==================== MENU ====================
    menu: {
        bg: "menu",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Estou prestes a entrar no Code Quest! Uma aventura sobre lógica de programação. Vamos lá!"
            }
        ],
        choices: [
            { text: "Iniciar Jogo", target: "intro" },
            { text: "Sobre", target: "sobre" }
        ]
    },

    sobre: {
        bg: "menu",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Este é o Code Quest, uma visual novel interativa onde serei transportado para um mundo de RPG de fantasia onde tudo é tratado como objeto."
            },
            {
                speaker: "Arthur",
                text: "Terei que usar meu conhecimento e o painel JSON do mundo para inspecionar atributos e tomar decisões."
            }
        ],
        choices: [
            { text: "Voltar", target: "menu" }
        ]
    },

    // ==================== INTRODUÇÃO ====================
    intro: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Ugh... Abri meus olhos in uma floresta totalmente desconhecida. O céu está azul e as árvores são incrivelmente verdes."
            },
            {
                speaker: "Arthur",
                text: "O que... onde eu estou? Lembro de estar programando no meu quarto e agora estou no meio do mato?"
            },
            {
                speaker: "Arthur",
                text: "Espere um segundo... Consigo ver caixas de dados flutuando no ar! É igual a um console de desenvolvedor!"
            },
            {
                speaker: "Arthur",
                text: "Estou percebendo que consigo inspecionar os objetos deste mundo e ver seus atributos formatados em JSON."
            },
            {
                speaker: "Arthur",
                text: "Incrível! Sou basicamente um administrador com acesso somente leitura. Vou começar a explorar!"
            }
        ],
        choices: [
            { text: "Continuar", target: "cenario_1_inicio" }
        ]
    },

    // ==================== CENÁRIO 1: A VARIÁVEL MÁGICA (let/const) ====================
    cenario_1_inicio: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Acabo de caminhar até uma grande torre mágica. Há um mago idoso do lado de fora e ele parece extremamente frustrado."
            },
            {
                speaker: "Arthur",
                text: "É o meu primeiro encontro com um habitante desse mundo! Vou inspecionar o JSON dele..."
            }
        ],
        json_data: {
            npc: {
                nome: "Mago Eldrin",
                tipo: "mentor",
                estado: "confuso",
                inventario: {
                    poção: {
                        tipo: "const",
                        valor: "cura",
                        modificavel: false
                    },
                    ingrediente_extra: {
                        tipo: "let",
                        valor: null,
                        modificavel: true
                    }
                }
            }
        },
        choices: [
            { text: "Falar com o mago", target: "cenario_1_dialogo" }
        ]
    },

    cenario_1_dialogo: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Mago Eldrin",
                text: "Por favor, herói! Minha poção de cura está estragada! Tentei mudar o tipo dela, mas não funciona!"
            },
            {
                speaker: "Arthur",
                text: "Deixe-me ver... Estou analisando no JSON que a sua poção base está definida como 'const', logo é imutável. Já o ingrediente extra é 'let', ou seja, mutável."
            }
        ],
        json_data: {
            npc: {
                nome: "Mago Eldrin",
                tipo: "mentor",
                estado: "confuso",
                inventario: {
                    poção: {
                        tipo: "const",
                        valor: "cura",
                        modificavel: false
                    },
                    ingrediente_extra: {
                        tipo: "let",
                        valor: null,
                        modificavel: true
                    }
                }
            }
        },
        choices: [
            {
                text: "[SIM] A poção base é const (imutável). Devo adicionar efeitos usando o let do ingrediente?",
                correct: true,
                feedback: "O mago entende! 'Ah! A poção base é imutável, mas posso modificar os ingredientes!'",
                target: "cenario_1_correto"
            },
            {
                text: "[NÃO] Devo tentar reatribuir o valor da poção de cura diretamente?",
                correct: false,
                feedback: "O mago tenta reatribuir, mas falha. 'Não consigo mudar! É const, está travada!'",
                target: "cenario_1_errado_1"
            }
        ]
    },

    cenario_1_correto: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Mago Eldrin",
                text: "Obrigado, herói! Tome esta erva mágica que encontrei. Ela serve para criar poções!"
            },
            {
                speaker: "Arthur",
                text: "Obrigado! Lembre-se: `const` serve para valores imutáveis e `let` para variáveis que mudam."
            }
        ],
        choices: [
            { text: "Continuar jornada", target: "combate_slime" }
        ]
    },

    cenario_1_errado_1: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Mago Eldrin",
                text: "Isso não vai funcionar... Preciso entender melhor as variáveis."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_1_dialogo" }
        ]
    },

    // ==================== COMBATE 1: SLIME (Natureza) ====================
    combate_slime: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Oh! Um Slime selvagem bloqueia meu caminho!"
            },
            {
                speaker: "Arthur",
                text: "Vou abrir a aba de Monstros no console para verificar a afinidade elementar dele!"
            }
        ],
        json_data: {
            monstros: {
                slime: {
                    nome: "Slime de Natureza",
                    nivel: 1,
                    vida: 20,
                    maxVida: 20,
                    elemento: "natureza",
                    ataque: 5,
                    defesa: 2
                }
            }
        },
        choices: [
            { text: "Atacar o Slime", target: "combate_slime_timing" }
        ]
    },

    combate_slime_timing: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Vou sincronizar meu ataque no momento certo da barra de timing!"
            }
        ],
        choices: [
            { text: "Iniciar Mini-game", target: "combate_slime_resultado" }
        ]
    },

    combate_slime_resultado: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Ataque desferido com sucesso! O Slime de Natureza foi derrotado!"
            },
            {
                speaker: "Arthur",
                text: "Ele deixou cair 1x erva! Coletei para meu inventário."
            }
        ],
        choices: [
            { text: "Continuar caminhando", target: "cenario_2_inicio" }
        ]
    },

    // ==================== CENÁRIO 2: O INVENTÁRIO TIPADO (Tipos de Dados) ====================
    cenario_2_inicio: {
        bg: "market",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Cheguei ao mercado. O Mercador Gorb está tendo problemas para classificar seus itens de venda."
            },
            {
                speaker: "Arthur",
                text: "Inspecionando os tipos de dados do inventário dele..."
            }
        ],
        json_data: {
            npc: {
                nome: "Mercador Gorb",
                tipo: "vendedor",
                estado: "estressado",
                inventario: {
                    espada: {
                        tipo: "object",
                        propriedades: {
                            dano: 25,
                            durabilidade: 100,
                            nome: "Espada de Ferro"
                        }
                    },
                    moedas: {
                        tipo: "number",
                        valor: 150
                    },
                    tem_licenca: {
                        tipo: "boolean",
                        valor: true
                    },
                    produtos: {
                        tipo: "array",
                        valor: ["poção", "espada", "escudo"]
                    }
                }
            }
        },
        choices: [
            { text: "Falar com o mercador", target: "cenario_2_dialogo" }
        ]
    },

    cenario_2_dialogo: {
        bg: "market",
        dialogs: [
            {
                speaker: "Mercador Gorb",
                text: "Herói, meu inventário é um caos! Tudo está misturado e sem tipo definido!"
            }
        ],
        choices: [
            {
                text: "[SIM] Organizar por tipos: moedas como number, licença como boolean, e itens como object/array?",
                correct: true,
                feedback: "O mercador sorri. 'Excelente! Agora consigo gerenciar as vendas!'",
                target: "cenario_2_correto"
            },
            {
                text: "[NÃO] Manter tudo como string (texto) simples?",
                correct: false,
                feedback: "O mercador reclama: 'Mas se tudo for texto, como vou calcular meus lucros?'",
                target: "cenario_2_errado_1"
            }
        ]
    },

    cenario_2_correto: {
        bg: "market",
        dialogs: [
            {
                speaker: "Mercador Gorb",
                text: "Obrigado! Pegue esses 2x minérios. Eles podem ser úteis para forjar novos equipamentos."
            }
        ],
        choices: [
            { text: "Continuar jornada", target: "combate_goblin" }
        ]
    },

    cenario_2_errado_1: {
        bg: "market",
        dialogs: [
            {
                speaker: "Mercador Gorb",
                text: "Não funcionou... Tenho certeza de que strings puras não dão certo para tudo."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_2_dialogo" }
        ]
    },

    // ==================== COMBATE 2: GOBLIN (Fogo) ====================
    combate_goblin: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Atenção! Um Goblin de Fogo aparece para me assaltar!"
            },
            {
                speaker: "Arthur",
                text: "Seu elemento Fogo o torna muito fraco se estiver chovendo, mas ele é forte sob o calor!"
            }
        ],
        json_data: {
            monstros: {
                goblin: {
                    nome: "Goblin de Fogo",
                    nivel: 2,
                    vida: 30,
                    maxVida: 30,
                    elemento: "fogo",
                    ataque: 8,
                    defesa: 3
                }
            }
        },
        choices: [
            { text: "Atacar o Goblin", target: "combate_goblin_timing" }
        ]
    },

    combate_goblin_timing: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Hora de desferir o ataque usando a barra de precisão!"
            }
        ],
        choices: [
            { text: "Iniciar Mini-game", target: "combate_goblin_resultado" }
        ]
    },

    combate_goblin_resultado: {
        bg: "forest_path",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Goblin derrotado! Ele dropou 1x minério."
            }
        ],
        choices: [
            { text: "Continuar para o templo", target: "cenario_3_inicio" }
        ]
    },

    // ==================== CENÁRIO 3: A PORTA LÓGICA (Condicionais if/else) ====================
    cenario_3_inicio: {
        bg: "door",
        dialogs: [
            {
                speaker: "Arthur",
                text: "A grandiosa Porta do Conhecimento está trancada por uma instrução condicional complexa."
            },
            {
                speaker: "Arthur",
                text: "Abrindo o console JSON para estudar as condicionais..."
            }
        ],
        json_data: {
            objeto: {
                nome: "Porta do Conhecimento",
                tipo: "passagem",
                estado: "trancada",
                requisitos: {
                    chave_necessaria: true,
                    nivel_minimo: 5,
                    tem_permissoes: false
                },
                logica_abertura: {
                    condicao: "if (tem_chave && nivel >= 5)",
                    alternativa: "else if (tem_permissoes)"
                }
            },
            heroi: {
                inventario: {
                    chave: true,
                    nivel: 7,
                    permissoes: false
                }
            }
        },
        choices: [
            { text: "Estudar lógica", target: "cenario_3_dialogo" }
        ]
    },

    cenario_3_dialogo: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Identidade requerida. Apenas aqueles que avaliarem as expressões lógicas para TRUE podem passar."
            }
        ],
        choices: [
            {
                text: "[SIM] Satisfaço a condição tem_chave (true) E nível >= 5 (nível 7, logo true)?",
                correct: true,
                feedback: "A porta range e destranca! 'Validação aceita. Acesso concedido.'",
                target: "cenario_3_correto"
            },
            {
                text: "[NÃO] Devo tentar entrar apenas com a condição else-if de permissões?",
                correct: false,
                feedback: "A porta pulsa vermelho: 'Acesso negado. A propriedade tem_permissoes é false.'",
                target: "cenario_3_errado_1"
            }
        ]
    },

    cenario_3_correto: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Você passou pelo desafio final da lógica com sucesso!"
            }
        ],
        choices: [
            { text: "Acessar o Portal Final", target: "final" }
        ]
    },

    cenario_3_errado_1: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Expressão avaliada como FALSE. O trinco continua travado."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_3_dialogo" }
        ]
    },

    // ==================== FINAL ====================
    final: {
        bg: "menu",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Cheguei ao fim da minha jornada lógica! Meu console está estabilizado."
            }
        ],
        choices: [
            { text: "Ver Resultados Finais", target: "final" }
        ]
    }
};

window.StoryNodes = StoryNodes;
