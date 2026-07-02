# Code Quest - Kanban de Desenvolvimento MVP

## Descrição Geral

Este Kanban organiza todas as tarefas necessárias para implementar o MVP de Code Quest, um jogo de aventura 2D narrativo com sistema de eventos dinâmicos, baseado no GDD (Documento de Design de Jogo). O projeto utiliza JavaScript e Phaser 3, com persistência em localStorage e estrutura de dados em JSON.

---

## BACKLOG:

Implementar classe/objeto Estado do Jogo (dia, periodo, clima, localizacao, classe, eventos_executados, memorias, karma)
Implementar sistema de persistência em localStorage (chave: "codequest_estado_do_jogo")
Implementar carregamento de estado salvo ao iniciar o jogo
Implementar salvamento após aplicar efeitos de cada escolha (RF16)
Implementar remoção do estado salvo ao concluir a run (RF18)
Implementar verificação de estado corrompido/inexistente (RNF07)
Implementar recuperação de eventos candidatos do dia/período
Implementar separação entre eventos fixos e normais
Implementar execução de evento fixo de abertura
Implementar filtragem de eventos normais por requisitos (Estado do Jogo como fonte de verdade)
Implementar exclusão de eventos já executados da elegibilidade
Implementar formação da pool de eventos normais elegíveis
Implementar sorteio ponderado por peso (3 eventos normais)
Implementar preenchimento com eventos coringa se pool < 3 eventos
Implementar execução dos 3 eventos normais selecionados
Implementar execução de evento fixo de encerramento
Implementar avanço automático para o próximo período
Implementar regra de não repetição (exceto coringa)
Implementar avaliação de requisitos com lógica AND
Implementar requisito de tipo "memoria" (presente/ausente)
Implementar requisito de tipo "tempo" (dia/período)
Implementar requisito de tipo "clima"
Implementar requisito de tipo "local" (valor único ou lista)
Implementar identificação de eventos coringa (local ausente ou array múltiplo)
Implementar algoritmo de sorteio ponderado (pseudocódigo da Seção 3.8)
Implementar multiplicador de prioridade para memórias gatilho (PRIORIDADE_MEMORIA = 2)
Implementar validação de peso (1 a 10)
Implementar distribuição uniforme se todos pesos = 0
Implementar cálculo de peso relativo na pool
Implementar apresentação de escolhas em eventos
Implementar aplicação imediata de efeitos ao Estado do Jogo
Implementar efeito de tipo "memoria" (criação)
Implementar efeito de tipo "karma" (+1, 0, -1)
Implementar efeito de tipo "clima" (alteração)
Implementar efeito de tipo "desbloqueio_mapa"
Implementar proteção contra remoção/alteração de memórias (RF13)
Implementar sorteio aleatório de clima no início de cada período (igual probabilidade)
Implementar manutenção de estado de clima vigente por período
Implementar atualização de clima em transições de período
Implementar requisito de clima na elegibilidade de eventos
Implementar cálculo acumulativo de Karma
Implementar determinação de desfecho final (>0=Bom, =0=Neutro, <0=Ruim)
Implementar apresentação de desfecho correspondente
Implementar narrativas dos 3 desfechos (Bom, Neutro, Ruim)
Implementar seleção de classe na criação de personagem (RF01)
Implementar aplicação de efeitos narrativos da classe (RF02)
Implementar variação no diálogo inicial de despertar por classe
Implementar impacto da classe na descrição da Visão JSON
Implementar escolha de mapa no início de cada período (exceto D3N)
Implementar apresentação apenas de mapas desbloqueados
Implementar desbloqueio de mapas por memória específica
Implementar atualização de localizacao no Estado do Jogo
Implementar exceção do confronto final (forçar Ruínas Antigas em D3N)
Implementar função de filtro de atributos por desbloqueio
Implementar exibição colorida de JSON (chaves rosa, strings amarelo, números roxo, booleanos verde)
Implementar abas do painel JSON (Herói, Mundo, NPCs)
Implementar modo read-only (valores não editáveis)
Implementar mensagens especiais para abas vazias
Implementar desbloqueio de atributos através de eventos específicos
Implementar botão para abrir/fechar painel JSON
Implementar Tela de Menu (botão Iniciar Jogo, Sobre, tela cheia)
Implementar Tela de Criação de Personagem (3 botões de classe, Voltar, Confirmar)
Implementar Cena de Jogo (ambiente side-scrolling, 5 camadas parallax)
Implementar HUD superior esquerdo (tempo do dia com ícone)
Implementar HUD superior direito (clima com ícone)
Implementar Painel de status lateral (Karma)
Implementar Painel de diálogo inferior (nome falante, texto com digitação, container de escolhas)
Implementar Tela de Transição de Período/Dia (indicador visual, atualização HUD, fade)
Implementar Tela de Desfecho (classe, Karma, narrativa, botões Menu Principal e Reiniciar)
Implementar modal "Sobre"
Implementar movimentação automática do personagem no eixo X para a direita
Implementar colisão com hitboxes de evento (NPCs, objetos, marcadores)
Implementar disparo de evento ao colidir com hitbox
Implementar retomada de movimentação após resolução de evento
Implementar parada de movimentação durante eventos/diálogos
Implementar taxa de quadros estável durante movimentação (RNF02)
Criar/obter sprites do personagem (3 classes)
Criar/obter sprites de NPCs (mercador, ferreiro, viajante, boss)
Criar/obter sprites de criaturas (lobo)
Criar/obter backgrounds dos 5 mapas (5 camadas parallax cada)
Criar/obter ícones de clima (ensolarado, chuvoso, nublado, neblina)
Criar/obter ícones de tempo (manhã, tarde, noite)
Criar/obter elementos de UI (botões, painéis, containers)
Criar/obter efeitos visuais (transições, digitação de texto)
Criar/obter assets do Boss
Criar evento fixo D1M_DESPERTAR (tutorial Visão JSON)
Criar evento fixo D1M_VILA_CONVITE (desbloqueio Vila Inicial)
Criar evento fixo D3N_CONFRONTO_FINAL (confronto Boss)
Criar eventos normais mínimos (54 eventos conforme Seção 5.2)
Criar eventos exclusivos de mapa (identidade narrativa por localização)
Criar eventos coringa (cobertura mínima da pool)
Criar eventos com memória gatilho (quests secundárias)
Criar eventos com requisito de clima
Criar diálogos dos eventos
Criar escolhas e efeitos dos eventos
Criar narrativas dos 3 desfechos

---

## EM ANDAMENTO:


---

## EM REVISÃO:


---

## CONCLUÍDO:
