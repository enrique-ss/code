# IDEIAS PARA CODE QUEST

## SISTEMA DE TEMPO E CLIMA

### Ciclo Dia/Noite
- A cada 5 interações, muda o horário do dia (manhã → tarde → noite → manhã)
- Quando muda o horário, altera:
  - Cor do céu nas camadas parallax (gradientes dinâmicos)
  - Iluminação dos sprites (overlay de cor com alpha variável)
  - Visibilidade de elementos (estrelas apenas à noite, nuvens diferentes)
  - Comportamento dos NPCs (mercador fecha à noite, mago mais poderoso à meia-noite)

### Sistema de Clima Dinâmico
- Clima aleatório ao começo de cada manhã (sol, chuva, neve, tempestade, neblina)
- Propriedades do clima influenciam combates e diálogos:
  - Inimigo de fogo: mais fraco em chuva, mais forte em calor
  - Inimigo de gelo: mais forte em neve, mais fraco em sol
  - Neblina: reduz precisão em combates, aumenta chance de encontros raros
  - Tempestade: chance de raio causar dano extra, mas também revela itens escondidos

## INTERFACE E HUD

### Barra de Vida do Jogador
- Barra de HP sobre a cabeça do personagem com animação de dano
- Cores dinâmicas: verde (100-60%), amarelo (59-30%), vermelho (29-0%)
- Efeito de flash quando recebe dano
- Regeneração lenta durante o dia, nenhuma à noite

### Painel de Status Lateral
- Menu ao lado esquerdo do dialog-box com 4 informações principais:
  - **Dano**: baseado em classe + equipamentos + buff de clima
  - **Armadura**: redução de dano recebido
  - **Fama**: afeta preços no mercado e reações de NPCs
  - **Ouro**: moeda principal para compras e negociações

## SISTEMA DE DIÁLOGOS

### Escolhas Binárias
- Todas as opções de diálogo para o jogador devem ser de sim/não
- Sistema de consequências:
  - "Sim" pode levar a recompensas mas também riscos
  - "Não" pode ser seguro mas perder oportunidades
  - Algumas escolhas afetam permanentemente a reputação

### Sistema de Persuasão
- Baseado em atributos do personagem (carisma, inteligência)
- Chance de sucesso modificada por:
  - Clima atual (NPCs mais irritados em dias quentes)
  - Hora do dia (NPCs mais generosos à noite)
  - Itens equipados (amuletos de carisma)

## MECÂNICAS DE COMBATE

### Sistema de Elementos
- Pedra-papel-tesoura expandido: fogo > gelo > natureza > fogo
- Cada inimigo tem afinidade elementar visível no painel JSON
- Clima modifica multiplicadores de dano elementais

### Combate por Turnos com Timing
- Barra de timing para ataques perfeitos (como Paper Mario)
- Críticos causam efeitos visuais especiais (screen shake, flash)
- Falhas no timing deixam o personagem vulnerável

## SISTEMA DE PROGRESSÃO

### Árvore de Habilidades por Classe
- Guerreiro: foco em força e resistência
- Mago: foco em mana e magias elementais
- Arqueiro: foco em precisão e velocidade

### Sistema de Crafting
- Coleta de recursos durante caminhadas (ervas, minérios)
- Criação de poções e equipamentos
- Receitas desbloqueadas através de diálogos com NPCs

## MECÂNICAS ESPECIAIS

### Sistema de "Debug" do Mundo
- Painel JSON não é apenas visual: permite modificar valores
- Modificar valores corretamente pode desbloquear caminhos secretos
- Modificações incorretas causam "glitches" no jogo (efeitos visuais intencionais)

### Eventos Dinâmicos
- Eventos aleatórios durante caminhada:
  - Mercador viajante aparece apenas em dias de sol
  - Bandidos atacam mais à noite
  - Tesouros escondidos revelados após tempestades

### Multi-ending Baseado em Escolhas
- Final depende de:
  - Quantos NPCs ajudou vs ignorou
  - Escolhas morais em diálogos
  - Clima ao derrotar o chefe final
  - Itens coletados durante a jornada