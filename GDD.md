# Code Quest - Game Design Document (GDD)

## Visão Geral

**Título**: Code Quest  
**Gênero**: Motion Comic Interativa / RPG Educativo  
**Tema**: Anime Isekai (Fantasia)  
**Público-Alvo**: Crianças (8-12 anos)  
**Objetivo**: Ensinar lógica de programação através do conceito "tudo é um objeto"

## Premissa

Um programador é transportado para um mundo de fantasia como um jogo RPG. Ele quebra a quarta parede constantemente, usando seu conhecimento de programação para entender e interagir com o mundo. Ele possui um painel flutuante estilo terminal/CMD que exibe dados JSON dos elementos do mundo.

## Regra de Ouro

O painel JSON é **estritamente read-only**. O jogador não pode alterar o código do mundo diretamente; ele apenas inspeciona os atributos e usa esse conhecimento para resolver desafios.

## Mecânica de Gameplay

1. **RPG Side-Scrolling Automático**: O herói anda sozinho e para ao encontrar obstáculos/inimigos
2. **Zoom e Diálogo**: Ao parar, a câmera dá zoom no obstáculo e abre um painel de diálogo/visual novel
3. **Resolução**: O jogador lê as propriedades do JSON e escolhe a ação correta para prosseguir

---

# Cenários de Ensino

## Cenário 1: A Variável Mágica (let/const)

**Conceito**: Diferença entre variáveis mutáveis (`let`) e imutáveis (`const`)

**Contexto Narrativo**: O herói encontra um NPC mago que está tentando criar uma poção mágica. O mago está confuso porque sua poção não funciona.

**JSON Exibido no Painel**:
```json
{
  "npc": {
    "nome": "Mago Eldrin",
    "tipo": "mentor",
    "estado": "confuso",
    "inventario": {
      "poção": {
        "tipo": "const",
        "valor": "cura",
        "modificavel": false
      },
      "ingrediente_extra": {
        "tipo": "let",
        "valor": null,
        "modificavel": true
      }
    }
  }
}
```

**Diálogo NPC**:
> "Por favor, herói! Minha poção de cura está estragada! Tentei mudar o tipo dela, mas não funciona!"

**Opções de Escolha (Date-Sim)**:

1. **[Errado]** "Você precisa recriar a poção do zero."
   - *Resultado*: O mago fica mais confuso. "Mas eu não tenho os ingredientes!"

2. **[Correto]** "A poção é `const` - ela não pode mudar. Use `let` no ingrediente extra para adicionar efeitos."
   - *Resultado*: O mago entende! "Ah! A poção base é imutável, mas posso modificar os ingredientes!"

3. **[Errado]** "Tente mudar o valor da poção para 'veneno'."
   - *Resultado*: O mago tenta, mas falha. "Não consigo mudar! É como se fosse gravado em pedra!"

**Lição Aprendida**: Variáveis `const` não podem ser reatribuídas, enquanto `let` podem.

---

## Cenário 2: O Inventário Tipado (Tipos de Dados)

**Conceito**: Tipos de dados primitivos (string, number, boolean, array, object)

**Contexto Narrativo**: O herói encontra um mercador que está organizando seu inventário. O mercador está misturando tudo e não consegue vender nada.

**JSON Exibido no Painel**:
```json
{
  "npc": {
    "nome": "Mercador Gorb",
    "tipo": "vendedor",
    "estado": "estressado",
    "inventario": {
      "espada": {
        "tipo": "object",
        "propriedades": {
          "dano": 25,
          "durabilidade": 100,
          "nome": "Espada de Ferro"
        }
      },
      "moedas": {
        "tipo": "number",
        "valor": 150
      },
      "tem_licenca": {
        "tipo": "boolean",
        "valor": true
      },
      "produtos": {
        "tipo": "array",
        "valor": ["poção", "espada", "escudo"]
      }
    }
  }
}
```

**Diálogo NPC**:
> "Meu inventário está uma bagunça! Não consigo separar o que é número, o que é texto e o que é lista!"

**Opções de Escolha (Date-Sim)**:

1. **[Errado]** "Jogue tudo fora e comece de novo."
   - *Resultado*: O mercador chora. "Mas eu perco meu lucro!"

2. **[Correto]** "Organize por tipo: `number` para moedas, `string` para nomes, `boolean` para estados, `array` para listas, `object` para itens complexos."
   - *Resultado*: O mercador organiza tudo! "Agora faz sentido! Cada coisa tem seu tipo!"

3. **[Errado]** "Transforme tudo em texto (string)."
   - *Resultado*: O mercador tenta, mas os números perdem valor. "Agoro não consigo fazer contas!"

**Lição Aprendida**: Diferentes tipos de dados servem para diferentes propósitos.

---

## Cenário 3: A Porta Lógica (Condicionais if/else)

**Conceito**: Estruturas condicionais e operadores de comparação

**Contexto Narrativo**: O herói encontra uma porta mágica trancada. A porta tem um sistema de segurança baseado em lógica de programação.

**JSON Exibido no Painel**:
```json
{
  "objeto": {
    "nome": "Porta do Conhecimento",
    "tipo": "passagem",
    "estado": "trancada",
    "requisitos": {
      "chave_necessaria": true,
      "nivel_minimo": 5,
      "tem_permissoes": false
    },
    "logica_abertura": {
      "condicao": "if (tem_chave && nivel >= 5)",
      "alternativa": "else if (tem_permissoes)"
    }
  },
  "heroi": {
    "inventario": {
      "chave": true,
      "nivel": 7,
      "permissoes": false
    }
  }
}
```

**Diálogo Porta**:
> "Sistema de segurança ativado. Para abrir, você deve satisfazer uma das condições lógicas."

**Opções de Escolha (Date-Sim)**:

1. **[Errado]** "Vou usar a chave apenas."
   - *Resultado*: A porta não abre. "Condição incompleta. Nível insuficiente avaliado."

2. **[Correto]** "Tenho a chave E meu nível é 7, que é maior que 5. A condição `tem_chave && nivel >= 5` é verdadeira."
   - *Resultado*: A porta abre! "Condição satisfeita. Acesso concedido."

3. **[Errado]** "Vou tentar usar permissões."
   - *Resultado*: A porta não abre. "Você não tem permissões. Condição falsa."

**Lição Aprendida**: Condicionais `if/else` verificam se condições são verdadeiras ou falsas para tomar decisões.

---

## Estrutura de Progressão

### Fase 1: Fundamentos (Cenários 1-2)
- Introdução ao conceito de "tudo é um objeto"
- Variáveis e tipos de dados
- JSON como representação de dados

### Fase 2: Lógica (Cenário 3)
- Condicionais
- Operadores lógicos (&&, ||, !)
- Comparadores (==, ===, >, <, >=, <=)

### Fase 3: Estruturas (Futuro)
- Loops (for, while)
- Funções
- Arrays e objetos complexos

## Sistema de Feedback

- **Correto**: Animação de sucesso, som positivo, progresso na história
- **Incorreto**: Dica educacional, tentativa novamente sem penalidade severa
- **JSON Dinâmico**: O painel atualiza em tempo real conforme o jogador interage

## Estilo Visual

- **Anime Isekai**: Personagens estilizados, cenários de fantasia
- **Painel JSON**: Estilo terminal/CMD com cores de sintaxe (como VS Code)
- **Interface**: Limpa, com foco no conteúdo educacional
- **Animações**: Suaves, não distraem do aprendizado

## Acessibilidade

- Texto legível com bom contraste
- Opções de tamanho de fonte
- Narrativa em áudio (opcional)
- Suporte a leitores de tela
