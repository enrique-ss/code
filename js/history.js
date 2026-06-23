/**
 * CODE QUEST - HISTORY & STORY
 * Contém os 3 cenários educacionais principais
 * Todos os diálogos do Narrador foram convertidos para falas do jogador em primeira pessoa.
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
                text: "Ugh... Abri meus olhos em uma floresta totalmente desconhecida. O céu está azul e as árvores são incrivelmente verdes."
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
                text: "Você precisa recriar a poção do zero.",
                correct: false,
                feedback: "O mago fica mais confuso. 'Mas eu não tenho os ingredientes!'",
                target: "cenario_1_errado_1"
            },
            {
                text: "A poção é `const` - ela não pode mudar. Use `let` no ingrediente extra para adicionar efeitos.",
                correct: true,
                feedback: "O mago entende! 'Ah! A poção base é imutável, mas posso modificar os ingredientes!'",
                target: "cenario_1_correto"
            },
            {
                text: "Tente mudar o valor da poção para 'veneno'.",
                correct: false,
                feedback: "O mago tenta, mas falha. 'Não consigo mudar! É como se fosse gravado em pedra!'",
                target: "cenario_1_errado_2"
            }
        ]
    },

    cenario_1_correto: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Mago Eldrin",
                text: "Obrigado, herói! Agora entendo a diferença entre `const` e `let`!"
            },
            {
                speaker: "Arthur",
                text: "Disponha! `const` serve para valores que nunca mudam após definidos, e `let` para aqueles que podem variar."
            },
            {
                speaker: "Arthur",
                text: "Senti que ganhei um pouco de experiência de desenvolvedor com isso. É hora de prosseguir."
            }
        ],
        choices: [
            { text: "Continuar jornada", target: "cenario_2_inicio" }
        ]
    },

    cenario_1_errado_1: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Mago Eldrin",
                text: "Isso não vai funcionar... Preciso entender melhor as variáveis."
            },
            {
                speaker: "Arthur",
                text: "Vou pensar melhor. Preciso olhar as propriedades do JSON com mais atenção."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_1_dialogo" }
        ]
    },

    cenario_1_errado_2: {
        bg: "magic_tower",
        dialogs: [
            {
                speaker: "Mago Eldrin",
                text: "Não consigo mudar! Deve haver outra maneira..."
            },
            {
                speaker: "Arthur",
                text: "A resposta está no tipo de mutabilidade da variável. Vamos tentar de novo."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_1_dialogo" }
        ]
    },

    // ==================== CENÁRIO 2: O INVENTÁRIO TIPADO (Tipos de Dados) ====================
    cenario_2_inicio: {
        bg: "market",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Acabo de chegar a um mercado movimentado. Aquele mercador ali parece extremamente estressado organizando seus produtos."
            },
            {
                speaker: "Arthur",
                text: "Vou inspecionar o inventário dele para entender o que está acontecendo..."
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
                text: "Meu inventário está uma bagunça! Não consigo separar o que é número, o que é texto e o que é lista!"
            },
            {
                speaker: "Arthur",
                text: "Acho que identifiquei o seu problema olhando o JSON. Você está misturando tipos de dados sem organizá-los!"
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
            {
                text: "Jogue tudo fora e comece de novo.",
                correct: false,
                feedback: "O mercador chora. 'Mas eu perco meu lucro!'",
                target: "cenario_2_errado_1"
            },
            {
                text: "Organize por tipo: `number` para moedas, `string` para nomes, `boolean` para estados, `array` para listas, `object` para itens complexos.",
                correct: true,
                feedback: "O mercador organiza tudo! 'Agora faz sentido! Cada coisa tem seu tipo!'",
                target: "cenario_2_correto"
            },
            {
                text: "Transforme tudo em texto (string).",
                correct: false,
                feedback: "O mercador tenta, mas os números perdem valor. 'Agora não consigo fazer contas!'",
                target: "cenario_2_errado_2"
            }
        ]
    },

    cenario_2_correto: {
        bg: "market",
        dialogs: [
            {
                speaker: "Mercador Gorb",
                text: "Muito obrigado! Agora meu inventário está organizado por tipos de dados!"
            },
            {
                speaker: "Arthur",
                text: "Sem problemas! Lembre-se: `number` guarda números, `string` guarda textos, `boolean` é para verdadeiro/falso, `array` é para listas e `object` é para dados compostos complexos."
            },
            {
                speaker: "Arthur",
                text: "Consegui mais experiência! Minhas habilidades estão evoluindo. Vou continuar explorando."
            }
        ],
        choices: [
            { text: "Continuar jornada", target: "cenario_3_inicio" }
        ]
    },

    cenario_2_errado_1: {
        bg: "market",
        dialogs: [
            {
                speaker: "Mercador Gorb",
                text: "Isso seria um desastre! Preciso de uma solução melhor..."
            },
            {
                speaker: "Arthur",
                text: "Vou pensar melhor. A chave está em atribuir o tipo correto para cada dado."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_2_dialogo" }
        ]
    },

    cenario_2_errado_2: {
        bg: "market",
        dialogs: [
            {
                speaker: "Mercador Gorb",
                text: "Isso não funcionou! Agora não consigo fazer cálculos com as moedas..."
            },
            {
                speaker: "Arthur",
                text: "O texto puro (string) não permite operações matemáticas diretas de moedas. Tenho que indicar o tipo certo."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_2_dialogo" }
        ]
    },

    // ==================== CENÁRIO 3: A PORTA LÓGICA (Condicionais if/else) ====================
    cenario_3_inicio: {
        bg: "door",
        dialogs: [
            {
                speaker: "Arthur",
                text: "Me deparei com uma porta mágica monumental. Ela tem o que parece ser um sistema eletrônico ou mágico de segurança."
            },
            {
                speaker: "Arthur",
                text: "Deixa eu inspecionar a lógica desse mecanismo no meu painel JSON..."
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
            { text: "Interagir com a porta", target: "cenario_3_dialogo" }
        ]
    },

    cenario_3_dialogo: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Sistema de segurança ativado. Para abrir, você deve satisfazer uma das condições lógicas."
            },
            {
                speaker: "Arthur",
                text: "Que interessante! O trinco da porta usa condicionais `if/else` com operadores lógicos. Deixe-me ver o que tenho no meu inventário."
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
            {
                text: "Vou usar a chave apenas.",
                correct: false,
                feedback: "A porta não abre. 'Condição incompleta. Nível insuficiente avaliado.'",
                target: "cenario_3_errado_1"
            },
            {
                text: "Tenho a chave E meu nível é 7, que é maior que 5. A condição `tem_chave && nivel >= 5` é verdadeira.",
                correct: true,
                feedback: "A porta abre! 'Condição satisfeita. Acesso concedido.'",
                target: "cenario_3_correto"
            },
            {
                text: "Vou tentar usar permissões.",
                correct: false,
                feedback: "A porta não abre. 'Você não tem permissões. Condição falsa.'",
                target: "cenario_3_errado_2"
            }
        ]
    },

    cenario_3_correto: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Acesso concedido. Bem-vindo ao próximo nível de conhecimento."
            },
            {
                speaker: "Arthur",
                text: "Entendi! Condicionais `if/else` decidem caminhos baseados em testes booleanos. O `&&` (E lógico) exige que ambos os testes sejam verdadeiros simultaneamente para dar 'true'."
            },
            {
                speaker: "Arthur",
                text: "Estou atravessando o portal! Sinto que venci o desafio final desse local!"
            }
        ],
        choices: [
            { text: "Finalizar Demo", target: "final" }
        ]
    },

    cenario_3_errado_1: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Condição incompleta. Você precisa satisfazer todos os requisitos da condição principal."
            },
            {
                speaker: "Arthur",
                text: "De fato, a chave por si só não basta. Como há um `&&`, preciso cumprir as duas condições."
            }
        ],
        choices: [
            { text: "Tentar novamente", target: "cenario_3_dialogo" }
        ]
    },

    cenario_3_errado_2: {
        bg: "door",
        dialogs: [
            {
                speaker: "Porta do Conhecimento",
                text: "Você não tem permissões. A condição alternativa não foi satisfeita."
            },
            {
                speaker: "Arthur",
                text: "Minha propriedade de permissões está como 'false'. O caminho correto deve ser a primeira condição."
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
                text: "Incrível! Completei com sucesso os 3 cenários educacionais do Code Quest!"
            },
            {
                speaker: "Arthur",
                text: "Pude praticar e consolidar conceitos de variáveis mutáveis/imutáveis, tipos de dados do inventário e condicionais lógicas."
            },
            {
                speaker: "Arthur",
                text: "Agora sei que, em programação, tudo pode ser estruturado como um objeto composto de propriedades e valores."
            },
            {
                speaker: "Arthur",
                text: "Estou ansioso para seguir minha jornada rumo aos loops, funções e coleções avançadas de dados!"
            }
        ],
        choices: [
            { text: "Voltar ao Menu", target: "menu" }
        ]
    }
};
