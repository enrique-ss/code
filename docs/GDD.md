# CODE QUEST — Especificação Consolidada (v2.1)

**Este documento substitui o GDD original, a Especificação Técnica Normativa
e a v2.0.** Ele é a única fonte de verdade a partir de agora. Onde este
documento diverge de qualquer versão anterior, **este documento vence**. As
versões anteriores podem ser mantidas como referência histórica de design,
mas não devem ser consultadas para resolver dúvidas de implementação.

Esta revisão (v2.1) fecha as pendências identificadas na auditoria interna
feita sobre a v2.0: métodos de `GameState` que estavam implícitos mas não
declarados, o formato de sinais de retorno entre módulos, a simplificação do
linter de cobertura, e a seção de organização de arquivos, que constava no
sumário mas nunca havia sido escrita. Todas as decisões de arquitetura em
aberto foram resolvidas — não há mais notas de "a decidir" neste documento.

### Glossário rápido

- **Estado da Run**: o conceito — o conjunto de dados que representa a
  partida em andamento (Seção 3).
- **`GameState`**: a classe/módulo de código que implementa e protege o
  Estado da Run (Seção 17.1). "Estado da Run" e "`GameState`" se referem à
  mesma coisa; o primeiro é o conceito, o segundo é a implementação.
- **Evento fixo** vs. **evento normal**: ver Seção 4.1.
- **Período**: uma das 9 janelas de tempo da run (3 dias × manhã/tarde/noite).

---

## SUMÁRIO

1. [VISÃO GERAL](#1-visão-geral)
2. [UNIVERSO](#2-universo)
3. [ESTADO DA RUN](#3-estado-da-run)
4. [SISTEMA DE EVENTOS](#4-sistema-de-eventos)
5. [PIPELINE DE EXECUÇÃO DO PERÍODO](#5-pipeline-de-execução-do-período)
6. [SISTEMA DE REQUISITOS E ELEGIBILIDADE](#6-sistema-de-requisitos-e-elegibilidade)
7. [SORTEIO PONDERADO](#7-sorteio-ponderado)
8. [SISTEMA DE ESCOLHAS E EFEITOS](#8-sistema-de-escolhas-e-efeitos)
9. [SISTEMA DE CLIMA](#9-sistema-de-clima)
10. [SISTEMA DE KARMA E DESFECHOS](#10-sistema-de-karma-e-desfechos)
11. [VISÃO JSON](#11-visão-json)
12. [SISTEMA DE CLASSES](#12-sistema-de-classes)
13. [OBSTÁCULOS E COLISÃO](#13-obstáculos-e-colisão)
14. [OVERLAY DE DIÁLOGO](#14-overlay-de-diálogo)
15. [PERSISTÊNCIA](#15-persistência)
16. [MODELOS DE DADOS (SCHEMA FINAL)](#16-modelos-de-dados-schema-final)
17. [CONTRATOS ENTRE MÓDULOS](#17-contratos-entre-módulos)
18. [BANCO DE EVENTOS](#18-banco-de-eventos)
19. [HISTÓRIA](#19-história)
20. [FLUXO DE USO E TELAS](#20-fluxo-de-uso-e-telas)
21. [REQUISITOS FUNCIONAIS E NÃO FUNCIONAIS](#21-requisitos-funcionais-e-não-funcionais)
22. [FERRAMENTAS DE VALIDAÇÃO (LINTERS)](#22-ferramentas-de-validação-linters)
23. [CONVENÇÕES DE NOMENCLATURA](#23-convenções-de-nomenclatura)
24. [ORGANIZAÇÃO DE ARQUIVOS](#24-organização-de-arquivos)
25. [CRITÉRIOS DE ACEITE](#25-critérios-de-aceite)
26. [HISTÓRICO DE RESOLUÇÃO DE AMBIGUIDADES](#26-histórico-de-resolução-de-ambiguidades)

---

## 1. VISÃO GERAL

### 1.1 Resumo do Jogo

Code Quest é um jogo digital de aventura em 2D side-scrolling, com progressão
narrativa baseada em escolhas e elementos de rogue-like leve. A história se
desenrola ao longo de três dias, durante os quais o jogador vivencia eventos
sorteados dinamicamente.

O protagonista desperta em um mundo de fantasia medieval sem compreender como
chegou até ali. Descobre possuir a **Visão JSON**: capacidade de enxergar uma
estrutura invisível de dados que revela propriedades de objetos, criaturas e
personagens, oculta para os demais habitantes do mundo.

### 1.2 Objetivo Geral

Desenvolver um jogo digital que desperte o interesse pela programação por meio
de uma narrativa interativa, utilizando conceitos computacionais como parte da
construção do universo do jogo.

### 1.3 Objetivos Específicos

- Narrativa baseada em escolhas com consequências permanentes.
- Sistema de eventos sorteados dinamicamente.
- Incentivo à exploração e à rejogabilidade.
- Introdução natural a conceitos de estrutura de dados.
- Aplicação de JavaScript, Phaser 3 e organização de software.

### 1.4 Público-alvo

Crianças e adolescentes com interesse em jogos narrativos, aventura e fantasia
medieval, sem contato prévio com programação. Não é necessário conhecimento
técnico para concluir o jogo — a complexidade interna (Visão JSON, eventos,
Karma) não é exposta como mecânica explícita ao jogador.

### 1.5 Escopo do MVP

**Incluído:**

- Protagonista personalizável por classe (sem progressão por nível).
- Narrativa em 3 dias × 3 períodos (manhã/tarde/noite).
- Sistema de eventos sorteados dinamicamente, com pesos.
- Caminhada automática entre obstáculos.
- Obstáculos gerados a partir dos eventos sorteados.
- Overlay de diálogo estilo visual novel.
- Persistência da run em `localStorage`.
- Sistema de escolhas com consequências (Karma, memórias).
- Sistema de clima.
- Três classes jogáveis.
- Três desfechos narrativos, determinados pelo Karma.
- Painel JSON (Visão JSON) e HUD.

**Fora do MVP:**

- Combate em tempo real.
- Inventário jogável.
- Níveis / árvore de habilidades.
- Mapa livre sem restrição (jogador nunca escolhe destino manualmente).
- Múltiplas runs simultâneas.
- Salvamento em servidor / banco de dados externo.
- Efeito de escolha que altera o clima do período vigente (ver Seção 9.3).

### 1.6 Tecnologias Utilizadas

| Categoria | Detalhes |
|---|---|
| Linguagem | JavaScript |
| Engine | Phaser 3 |
| Controle de Versão | Git e GitHub |
| Ferramentas | Visual Studio Code, Google Docs, Canva |
| Plataforma Alvo | Desktop (Windows) |

---

## 2. UNIVERSO

### 2.1 Premissa

O mundo funciona normalmente para seus habitantes. Por trás dessa normalidade,
toda a realidade é organizada por uma estrutura de propriedades e regras
invisíveis, que só o protagonista consegue enxergar parcialmente através da
Visão JSON. A habilidade não altera o funcionamento do mundo — muda apenas
como o jogador interpreta e decide.

### 2.2 Localizações

Estrutura side-scrolling: cada localização é uma faixa horizontal com pontos
de interação. Não há exploração livre contínua. **O jogador nunca escolhe
livremente para onde ir.**

| Localização (ID) | Descrição |
|---|---|
| `campo` | Área de introdução, baixa densidade de eventos. |
| `vila_inicial` | Centro principal, maior concentração de NPCs e eventos. |
| `estradas` | Transição entre regiões, eventos de percurso. |
| `floresta_sombria` | Exploração, eventos de risco e encontros isolados. |
| `ruinas_antigas` | Mistério central e confronto final, eventos raros. |

#### 2.2.1 Regra Única de Alteração de `state.location`

**A única forma de `state.location` mudar é como efeito de um evento fixo.**
Não existe efeito de escolha do tipo `location` (não está no catálogo da
Seção 8.1), e o `RunController` nunca decide a localização por conta própria
— ele apenas lê o valor já definido no Estado da Run ao montar o próximo
período (passo 1 da pipeline, Seção 5).

Concretamente:

1. Todo evento fixo (`kind: "fixed"`) pode opcionalmente declarar um campo
   `setLocation: string | null` no seu schema (Seção 16.4). Se presente e
   não-nulo, ao o evento fixo concluir, `GameState.definirLocalizacao(id)` é
   chamado com esse valor.
2. Eventos normais **nunca** alteram `state.location` — apenas eventos
   fixos têm esse poder, porque são os únicos pontos de transição narrativa
   controlada da run.
3. Ao abrir um novo período (passo 1 da pipeline, Seção 5), o
   `RunController` não altera `location` — ele simplesmente usa o valor que
   já está no Estado da Run (herdado do período anterior, ou alterado pelo
   `openingEvent` do próprio período que está prestes a rodar).
4. A ordem dentro do período é: `openingEvent` roda primeiro (Seção 5) e
   pode alterar `location` **antes** da filtragem de elegíveis acontecer —
   por isso a filtragem de elegíveis deve ocorrer **depois** do
   `openingEvent`. Isso é a ordem final da pipeline (Seção 5.1).
5. Regra de negócio fixada: `ruinas_antigas` é sempre definida via
   `setLocation` do `openingEvent` (ou de um evento fixo anterior no mesmo
   dia) do período `D3N_CONFRONTO_FINAL`, garantindo RN07 (confronto sempre
   nas Ruínas) sem exceção de fluxo.

**Frase-resumo para referência rápida:** *Eventos fixos podem alterar a
localização ao concluir; eventos normais nunca alteram a localização; o
`RunController` apenas lê o valor vigente ao montar cada período.*

**Quem é responsável pelo quê (para eliminar qualquer dúvida residual):**

| Módulo | Papel em relação a `state.location` |
|---|---|
| Evento fixo | Declara `setLocation` no seu schema, se aplicável. Não executa nada sozinho. |
| `RunController` | Detecta que um evento fixo com `setLocation` concluiu e chama o método do `GameState` correspondente. Nunca decide a localização por lógica própria. |
| `GameState` | Executa a mutação via `definirLocalizacao(id)` quando solicitado. Não decide quando isso deve acontecer. |
| Pipeline (Seção 5) | Garante que a leitura de `state.location` para filtragem de elegíveis ocorra sempre depois de qualquer `setLocation` do `openingEvent` do período. |

### 2.3 NPCs

NPCs são entidades narrativas persistentes que participam de múltiplos
eventos. O estado de cada NPC é uma lista de IDs de Memórias do Mundo que ele
referencia. NPCs diferentes podem referenciar a mesma memória e reagir de
formas distintas — a memória é neutra; o significado é definido pelo evento,
não pela memória em si.

O estado de NPCs é definido estaticamente no banco de NPCs; **não é
armazenado no Estado da Run.**

---

## 3. ESTADO DA RUN

O Estado da Run é a **única fonte de verdade** do sistema. Existe apenas
durante uma partida e é recriado do zero ao iniciar um novo jogo.

### 3.1 Campos Obrigatórios

```json
{
  "classId": "guerreiro",
  "day": 1,
  "period": "manha",
  "location": "campo",
  "climate": "ensolarado",
  "karma": 0,
  "memories": [],
  "executed": [],
  "unlockedFields": {
    "protagonista": ["classe"]
  },
  "openingEvent": "D1M_DESPERTAR",
  "openingDone": false,
  "currentPeriodEvents": [],
  "currentEventIndex": 0,
  "closingEvent": null,
  "closingDone": false,
  "transitionPending": false,
  "runOver": false
}
```

> **Nota sobre `climate` no estado inicial:** o valor `"ensolarado"` acima é
> apenas um placeholder antes do primeiro sorteio de clima rodar. O clima real
> do Dia 1/manhã é sorteado normalmente — ver Seção 9.1. Não há tratamento
> especial para o primeiro período.

### 3.2 Regras do Estado

1. `day` começa em `1` e termina em `3`.
2. `period` é sempre um de: `manha`, `tarde`, `noite`.
3. `location` começa em `campo`.
4. `memories` é uma lista de strings (IDs de memória), única (sem duplicatas), imutável — itens nunca são removidos ou alterados após inseridos.
5. `executed` contém IDs de eventos (fixos e normais) já resolvidos na run.
6. **`openingEvent`** contém o ID do evento fixo de abertura do período atual, ou `null` se o período não tiver um. **`openingDone`** indica se ele já foi executado.
7. **`currentPeriodEvents`** contém **sempre exatamente 3 IDs de eventos normais** (nunca eventos fixos) do período atual, em ordem de sorteio.
8. **`currentEventIndex`** aponta para a posição ativa dentro de `currentPeriodEvents` (0, 1 ou 2). Não referencia eventos fixos.
9. **`closingEvent`** contém o ID do evento fixo de encerramento do período atual, ou `null` se não houver. **`closingDone`** indica se já foi executado.
10. `runOver` é `true` somente após o fechamento do evento fixo de encerramento da noite do Dia 3 e o cálculo do desfecho (ver Seção 10.3, que define explicitamente quem calcula o desfecho e em que ordem).
11. `transitionPending` é `true` apenas durante a transição visual entre períodos.
12. `location` só muda como efeito de um evento fixo com `setLocation` — nunca por escolha livre do jogador, nunca por evento normal (ver Seção 2.2.1).
13. **`unlockedFields`** é um mapa `{ [entidadeId]: string[] }` com os campos já revelados pela Visão JSON para cada entidade (ver Seção 11).

### 3.3 Responsabilidade de Mutação

- **Somente o `GameState` modifica os campos do Estado da Run.** Outros
  módulos solicitam mudanças através dos métodos do `GameState` (ver Seção 17.1).
- **`RunController` decide *quando* uma transição deve ocorrer** (fim de
  período, fim de dia, fim de run). Ele então chama o método correspondente
  do `GameState`, que executa a mutação sem lógica de decisão própria.
  - Exemplo: `RunController` detecta que `currentEventIndex` passou do
    último evento normal e `closingDone === true` → chama
    `GameState.advancePeriod()`.
  - `GameState.advancePeriod()` apenas incrementa `period`/`day` e reseta os
    campos do período (`currentPeriodEvents`, `currentEventIndex`,
    `openingDone`, `closingDone`, `openingEvent`, `closingEvent`) — não
    decide se deve avançar, e não define sozinho quais serão o novo
    `openingEvent`/`closingEvent` do período seguinte (isso é preenchido
    logo em seguida pelo `RunController`, ver Seção 17.1 e o passo 1 da
    pipeline, Seção 5.1).
- Este é exatamente o mesmo princípio aplicado a `location`: quem decide
  (`RunController`) é sempre separado de quem executa (`GameState`).

### 3.4 Memória do Mundo

```json
{
  "id": "ajudou_mercador",
  "descricao": "O protagonista ajudou o mercador a recuperar sua carroça",
  "dia_criacao": 1
}
```

**Regras:**

- Toda memória é criada como efeito de uma escolha do jogador, **ou** como
  aplicação automática de `memoryGain` em um evento sem `choices` (Seção 8.3).
- Memórias são permanentes e imutáveis dentro de uma run.
- Memórias são identificadas por `id` único.
- Memórias pertencem sempre ao Estado da Run — nunca a um NPC ou ao jogador;
  outras entidades apenas as referenciam por ID.
- Memórias não geram eventos diretamente e não alteram o pool de eventos nem
  a pipeline de seleção — elas afetam apenas a **elegibilidade** de eventos
  futuros, via `memoryTrigger` (Seção 6).

---

## 4. SISTEMA DE EVENTOS

### 4.1 Classificação

**Eventos Fixos:**

- Executados obrigatoriamente quando presentes no período.
- Não entram na pool de elegibilidade, não participam do sorteio.
- `kind: "fixed"`, `weight: 0`.
- Não geram obstáculo com hitbox — são exibidos em tela cheia, sem caminhada.
- São os únicos eventos que podem carregar `setLocation` (Seção 2.2.1) e são
  os únicos cujo `id` pode ser atribuído aos campos `openingEvent` /
  `closingEvent` do Estado da Run.

**Eventos Normais:**

- Entram na pool de elegibilidade do período (Seção 6).
- Participam do sorteio ponderado por peso (Seção 7).
- Exatamente 3 são executados por período.
- Geram exatamente 1 obstáculo cada, com hitbox.
- `kind: "normal"`, `weight` entre `0` e `10` (ver Seção 7.1 sobre o peso 0).

### 4.2 Subcategorias de Evento Normal (por localização)

- **Exclusivo de localização:** `locations` tem exatamente 1 valor (ex.:
  `["vila_inicial"]`). Elegível apenas quando essa localização está ativa.
- **Coringa:** `locations` tem **mais de 1 valor** (ex.: `["campo",
  "vila_inicial", "estradas"]`). Elegível em qualquer uma das localizações
  listadas.

> O campo `locations` é **sempre um array** com no mínimo 1 elemento — nunca
> fica ausente/omitido no schema. O critério de "coringa" é único e simples:
> `locations.length > 1`.

Eventos coringa obedecem à regra de não repetição dentro da run, salvo
exceção explicitamente marcada no catálogo do evento (campo `repeatable:
true`, ver Seção 16.4).

---

## 5. PIPELINE DE EXECUÇÃO DO PERÍODO

Esta é a máquina de estado oficial e única do período. Substitui qualquer
versão anterior.

### 5.1 Sequência Oficial

```
1. Abrir o período:
   a. Sortear o clima (Seção 9).
   b. RunController consulta o EventSelector para obter os eventos fixos
      elegíveis para o (day, period) vigente e chama
      GameState.definirEventoAbertura(id|null) e
      GameState.definirEventoEncerramento(id|null) com os resultados.
      (No período de abertura da run, esse passo já foi feito na criação
      do Estado da Run — Seção 3.1 — e não se repete.)
2. Se openingEvent existir: executar o evento fixo de abertura em tela
   cheia (sem caminhada; nenhum obstáculo existe ainda no cenário — nada é
   instanciado antes deste passo terminar). Se o evento tiver setLocation,
   aplicar a mudança de localização agora (Seção 2.2.1), chamando
   GameState.definirLocalizacao(id). Se tiver memoryGain e não tiver
   choices, aplicar a memória agora também (Seção 8.3). Ao concluir,
   GameState.marcarAberturaConcluida() é chamado (openingDone = true).
3. Filtrar eventos elegíveis (Seção 6), usando o state.location já
   eventualmente atualizado pelo passo 2.
4. Sortear exatamente 3 eventos normais por peso (Seção 7).
5. Registrar os 3 IDs sorteados via GameState.definirPeriodoAtual(ids)
   (currentPeriodEvents = ids; currentEventIndex = 0).
6. Só agora os 3 obstáculos são criados de fato no cenário, já com hitbox
   ativa, e a caminhada automática é liberada. Não existe nenhum objeto de
   obstáculo no mapa antes deste passo — não há estado intermediário de
   "instanciado mas inativo"; o objeto simplesmente não existe até aqui.
7. Aguardar colisão com o próximo obstáculo não resolvido.
8. Ao colidir: pausar a caminhada, abrir o overlay do evento (Seção 14).
9. Jogador avança diálogos e faz escolha(s), se houver.
10. Aplicar efeitos da escolha ao Estado da Run (Seção 8).
11. Marcar o evento como executado (GameState.marcarEventoExecutado(id)).
12. GameState.avancarEventoAtual() (incrementa currentEventIndex). Fechar
    o overlay.
13. Retomar a caminhada a partir da posição X atual (nunca reseta para o
    início).
14. Repetir os passos 7–13 até currentEventIndex ultrapassar o 3º evento.
15. Se closingEvent existir: executar o evento fixo de encerramento em
    tela cheia. Se tiver setLocation, aplicar agora. Se tiver memoryGain e
    não tiver choices, aplicar a memória agora (Seção 8.3). Ao concluir,
    GameState.marcarEncerramentoConcluido() é chamado (closingDone = true).
16. RunController verifica: é a noite do Dia 3? Se sim → ir para o fluxo
    de encerramento da run (Seção 10.3). Se não → chamar
    GameState.advancePeriod() (que reseta os campos do período, incluindo
    openingEvent/closingEvent) e voltar ao passo 1 para o próximo período.
```

**Por que essa ordem (abertura sempre antes da filtragem de elegíveis):** o
evento fixo de abertura pode mudar `state.location` (Seção 2.2.1) — por
exemplo, o fixo de encerramento do Dia 1 leva o jogador à Vila Inicial. Se a
filtragem de elegíveis rodasse antes da abertura, ela usaria a localização
*errada* (a do período anterior). Por isso a abertura roda primeiro, e só
depois o sistema decide quais eventos normais são elegíveis para a
localização (já correta) daquele período.

**Sobre a instanciação dos obstáculos (decisão fechada nesta revisão):** não
existe mais um estado intermediário de "obstáculo instanciado mas inativo".
Os objetos de obstáculo (sprite + hitbox) só são criados no Phaser depois que
a abertura já rodou e a pool já foi sorteada (passo 6) — antes disso, eles
simplesmente não existem na cena. Isso elimina qualquer ambiguidade sobre
`body.enable`, visibilidade de sprite ou posição fora de tela: não há nada
para gerenciar, porque não há nada para desligar.

Se um evento fixo (abertura ou encerramento) não existir para o período, o
passo correspondente é simplesmente pulado — a ordem geral não muda.

---

## 6. SISTEMA DE REQUISITOS E ELEGIBILIDADE

Um evento normal entra na pool elegível do período somente se **todos** os
seus requisitos forem verdadeiros (lógica AND). O Estado da Run é a única
fonte consultada.

**Tipos de requisito**, todos derivados diretamente dos campos do evento
(Seção 16.4) — não há um objeto "requisito" separado do evento; a elegibilidade
é calculada comparando os campos do evento contra o Estado da Run:

| Campo do evento | Critério de elegibilidade |
|---|---|
| `day` | `state.day` deve estar contido no array `day` do evento. |
| `period` | `state.period` deve estar contido no array `period` do evento. |
| `locations` | `state.location` deve estar contido no array `locations` do evento. |
| `climates` | `state.climate` deve estar contido no array `climates`, **ou** `climates` conter `"all"`. |
| `memoryTrigger` | Se não for `null`, `state.memories` deve conter esse ID. Se for `null`, sem restrição. |
| `executed` | O `id` do evento não pode já constar em `state.executed`, **exceto** se `repeatable: true`. |

Não existe um schema JSON avulso de "requisito" (como `{"tipo": "local",
"valor": ...}`) — essa forma foi removida por ser redundante com os campos já
presentes no próprio evento e por gerar inconsistência de nomenclatura
(`local` vs `locations`). Toda a lógica de elegibilidade é uma função pura:

```
elegivel(evento, state) =
     state.day ∈ evento.day
  E  state.period ∈ evento.period
  E  state.location ∈ evento.locations
  E  (evento.climates ∋ "all" OU state.climate ∈ evento.climates)
  E  (evento.memoryTrigger == null OU evento.memoryTrigger ∈ state.memories)
  E  (evento.id ∉ state.executed OU evento.repeatable == true)
```

---

## 7. SORTEIO PONDERADO

### 7.1 Peso

- Peso mínimo: **0**. Peso máximo: **10**. Válido para eventos normais.
- Eventos fixos sempre têm `weight: 0` e nunca entram no sorteio.
- Peso não é porcentagem — é proporção relativa dentro da pool elegível do
  momento.
- **Se todos os eventos elegíveis da pool tiverem peso 0**, aplica-se
  distribuição uniforme entre eles (cada um tem a mesma chance).
- Um evento normal com peso 0 é uma raridade extrema: só é sorteado se toda a
  pool também tiver peso 0 no momento (aí entra na distribuição uniforme). Na
  prática, ao popular o banco de eventos, use pesos de 1 a 10 para eventos
  normais comuns; reserve 0 apenas para casos deliberadamente raros dentro de
  uma pool que você garante ter outros pesos 0 concorrendo.
- Peso 0 usado por engano (não deliberado) em uma pool que também tem
  eventos de peso > 0 não quebra nada tecnicamente — o evento de peso 0
  simplesmente tem chance zero de ser sorteado enquanto houver concorrentes
  de peso maior que 0 na mesma pool. Não é tratado como erro pelos linters
  (Seção 22), pois é um valor de design válido, não um valor inválido de
  schema.

### 7.2 Algoritmo

```
PARA CADA evento NA pool elegível:
    pesoCalculado = evento.weight
FIM PARA

SE SOMA(pesoCalculado) == 0:
    // distribuição uniforme
    pesoCalculado = 1 PARA CADA evento
FIM SE

totalPeso = SOMA DE pesoCalculado DE TODOS eventos
valorSorteado = ALEATÓRIO(0, totalPeso)
acumulado = 0

PARA CADA evento NA pool:
    acumulado = acumulado + evento.pesoCalculado
    SE valorSorteado <= acumulado:
        RETORNAR evento
    FIM SE
FIM PARA
```

O sorteio ocorre **sem reposição**: cada evento sorteado é removido da pool
antes do próximo sorteio, garantindo que os 3 eventos do período sejam
distintos entre si.

### 7.3 Fallback (Pool Insuficiente) — Dois Sorteios Sequenciais

O preenchimento por coringa **não** é um sorteio único misturando tudo desde
o início. São **dois sorteios sequenciais e independentes**, nesta ordem
fixa:

1. **Primeiro sorteio (exclusivos):** monta-se a pool apenas com eventos
   elegíveis que **não** são coringa (`locations.length == 1`). Roda-se o
   algoritmo da Seção 7.2 sobre essa pool, sem reposição, até esgotá-la ou
   até completar 3 eventos.
2. **Se, e somente se, o primeiro sorteio não atingir 3 eventos**, monta-se
   uma **segunda pool, do zero**, agora só com eventos coringa
   (`locations.length > 1`) elegíveis pelos demais critérios (Seção 6),
   ignorando a regra de não-repetição apenas quando o coringa já tiver
   `repeatable: true` — coringas com `repeatable: false` já executados
   continuam indisponíveis. Roda-se o algoritmo da Seção 7.2 novamente,
   **do zero** (novo cálculo de peso total, novo valor sorteado), **somente**
   sobre essa segunda pool, até completar o total de 3.
3. Os eventos do primeiro sorteio nunca voltam a concorrer no segundo, e
   vice-versa — não existe, em nenhum momento, uma pool única combinando
   exclusivos e coringas juntos. São duas execuções independentes do mesmo
   algoritmo, sobre duas pools diferentes, em sequência.
4. Se mesmo somando os dois sorteios não houver 3 eventos disponíveis (caso
   teórico, não deve ocorrer se o banco seguir a Seção 18.2), o período
   executa com menos de 3 eventos normais. Isso é uma falha de conteúdo, não
   uma condição normal — deve ser pega pelo linter de cobertura (Seção 22.1)
   antes de chegar a produção.

---

## 8. SISTEMA DE ESCOLHAS E EFEITOS

Fluxo: **escolha do jogador → geração de efeitos → aplicação no Estado da Run
→ atualização de memórias e Karma → continuação da run.**

### 8.1 Tipos de Efeito Válidos (MVP)

| `type` | Efeito |
|---|---|
| `karma` | Soma `value` (`-1`, `0` ou `1`) ao Karma acumulado. |
| `memory` | Adiciona `value` (ID de memória) à lista `memories`, se ainda não presente. |
| `unlockField` | Adiciona `field` à lista `unlockedFields[targetId]` no Estado da Run, se ainda não presente (ver Seção 11.3 para formato completo e exemplo). |

> **`climate` foi removido do catálogo de efeitos.** No design original havia
> a possibilidade de uma escolha alterar o clima do período — isso contradizia
> a regra de que o clima é constante durante todo o período (Seção 9) e não
> era usado em nenhum evento de exemplo. Decisão: cortado do MVP por completo.
> Se o clima do *próximo* período precisar ser influenciado narrativamente no
> futuro, isso deve ser reintroduzido como um novo tipo de efeito explícito
> (ex.: `climateBias`) em uma versão futura — não faz parte deste MVP.

### 8.2 Regras

- Toda escolha altera imediatamente o Estado da Run.
- Memórias criadas por escolhas são permanentes na run.
- Uma escolha pode ter múltiplos efeitos simultâneos (ex.: `karma` + `memory`
  + `unlockField`, todos no mesmo array `effects`).
- **Toda escolha deve ter pelo menos um efeito que não seja `{type: "karma",
  value: 0}` isoladamente.** Uma escolha só com Karma 0 e nada mais é
  considerada inválida — não altera nenhum estado observável, violando o
  princípio de que toda escolha tem consequência. Isso é verificado pelo
  linter de conteúdo (Seção 22.2), não em tempo de execução.

### 8.3 Aplicação de `memoryGain` em Eventos sem `choices`

Eventos (normalmente fixos) que não têm `choices` — e portanto avançam
automaticamente ao fim dos diálogos — ainda podem ter `memoryGain` definido
no schema (Seção 16.4). Nesse caso, a memória é adicionada ao Estado da Run
**automaticamente ao final dos diálogos**, sem esperar uma escolha.

Esta regra vale tanto para eventos fixos de abertura/encerramento quanto
para qualquer evento normal hipotético sem `choices` (caso exista no banco).
O passo exato na pipeline (Seção 5.1) é:

- Para o `openingEvent`: a aplicação de `memoryGain` ocorre dentro do passo
  2, imediatamente antes de `GameState.marcarAberturaConcluida()`.
- Para o `closingEvent`: a aplicação de `memoryGain` ocorre dentro do passo
  15, imediatamente antes de `GameState.marcarEncerramentoConcluido()`.
- Para um evento normal sem `choices` (dentro do loop de 3 eventos): a
  aplicação ocorre no passo 10 (mesmo ponto onde efeitos de escolha seriam
  aplicados), antes do passo 11 (`marcarEventoExecutado`).

Em todos os casos, isso é equivalente a tratar o evento como se tivesse uma
única escolha implícita com efeito `{type: "memory", value: <memoryGain>}`.

Se o evento **tiver** `choices`, `memoryGain` é ignorado como aplicação
automática — a memória só é concedida se alguma das `choices` tiver
explicitamente um efeito `{type: "memory", value: <memoryGain>}` em seu
array `effects`. Isso evita ambiguidade entre "a memória é dada sempre" vs.
"a memória é dada só nessa escolha específica" quando o evento tem múltiplos
caminhos.

---

## 9. SISTEMA DE CLIMA

### 9.1 Sorteio

O clima é sorteado no início de **todo** período, incluindo o Dia 1/manhã —
sem exceção ou caso especial. Sorteio uniforme entre os 4 estados:

- `ensolarado`
- `chuvoso`
- `nublado`
- `neblina`

### 9.2 Persistência Durante o Período

O clima sorteado é armazenado em `state.climate` e **permanece
imutável durante todo o período** — do passo 1 ao passo 16 da pipeline
(Seção 5). Nenhuma escolha, evento ou efeito pode alterá-lo antes do próximo
período ser aberto.

### 9.3 Uso em Elegibilidade

Um evento pode restringir sua elegibilidade a climas específicos via o campo
`climates` (Seção 6). O valor especial `"all"` torna o evento elegível em
qualquer clima.

---

## 10. SISTEMA DE KARMA E DESFECHOS

### 10.1 Acumulação

Cada escolha com efeito `karma` soma `-1`, `0` ou `1` ao valor acumulado em
`state.karma`. Sem teto ou piso artificial — o valor pode variar livremente
conforme as ~27 escolhas possíveis ao longo da run. Apenas o **sinal** final
importa para o desfecho.

### 10.2 Tabela de Desfecho

| Karma final | Desfecho |
|---|---|
| `> 0` | Final Bom |
| `= 0` | Final Neutro |
| `< 0` | Final Ruim |

O cálculo é determinístico, sem elemento de sorteio.

### 10.3 Fluxo de Encerramento da Run

1. Executar o evento fixo de encerramento do Dia 3/noite (`D3N_CONFRONTO_FINAL`),
   sempre localizado em `ruinas_antigas`.
2. **`RunController` calcula o desfecho** aplicando a Tabela 10.2 sobre o
   `state.karma` que ele lê do `GameState` (via `getEstado()`). O cálculo do
   desfecho é responsabilidade do `RunController`, não do `GameState` —
   segue a mesma regra geral da Seção 3.3 ("`GameState` nunca decide, só
   executa"). O `GameState` nunca calcula um desfecho sozinho a partir do
   karma; ele apenas recebe o resultado já calculado.
3. `RunController` chama `GameState.finalizarRun(desfecho)`, passando o
   valor já calculado (`"bom" | "neutro" | "ruim"`) como argumento. Esse
   método seta `runOver = true` e registra o desfecho recebido — sem
   recalculá-lo.
4. Salvar o Estado da Run (via `SaveManager`) com o desfecho calculado.
5. Remover o save do `localStorage` (Seção 15.3) — a run está encerrada e não
   pode ser retomada; uma nova partida sempre começa do zero.
6. Exibir a tela de desfecho (Seção 20.2).

> Não existe condição de derrota no MVP. Eventos com obstáculo do tipo
> `monstro` ou classificação narrativa "Hostil" são sempre resolvidos por
> escolha de diálogo — nunca por HP, dano ou falha de combate. O termo
> "confronto" na narrativa (Seção 19) refere-se sempre a uma sequência de
> escolhas, nunca a uma mecânica de luta em tempo real.

---

## 11. VISÃO JSON

A Visão JSON é a mecânica central de identidade do jogo — é o que diferencia
Code Quest de qualquer outro jogo de escolhas narrativas, e a razão de ser
do projeto (Seção 1.2). Esta seção define como ela funciona de ponta a
ponta: onde os dados moram, como são desbloqueados, e como o painel os lê.

### 11.1 Conceito

Cada entidade "consultável" do mundo (o protagonista, cada NPC, cada
criatura, e certos objetos narrativamente relevantes) tem um objeto de dados
JSON completo por trás — mas o jogador só enxerga, a qualquer momento, o
**subconjunto de campos já desbloqueado** para aquela entidade específica.
Campos não desbloqueados simplesmente não aparecem no painel (não aparecem
como `"???"` ou similar — são omitidos).

### 11.2 Onde os Dados Ficam Armazenados

Existem **dois níveis de dados** por entidade, e é essencial não confundi-los:

1. **Dados completos da entidade** — vivem nos arquivos estáticos do banco
   de conteúdo (`data/npcs.json`, ver Seção 24), com todos os campos que
   aquela entidade *poderia* revelar. Isso nunca muda durante a run — é
   conteúdo de design, carregado uma vez no boot.
2. **Registro de campos desbloqueados por entidade** — é o que muda durante
   a run, e por isso vive dentro do **Estado da Run** (Seção 3), não no
   banco estático. Formato:

```json
"unlockedFields": {
  "protagonista": ["classe", "ocupacao"],
  "mercador_vila": ["nome", "ocupacao"],
  "lobo_floresta": ["tipo"]
}
```

- Chave: o `id` da entidade (mesmo `id` usado no banco de NPCs — Seção 16.3
  — ou um id fixo `"protagonista"` para o herói, ou o `obstacle.id` de uma
  criatura/objeto quando aplicável).
- Valor: array de nomes de campos (strings) já desbloqueados para aquela
  entidade especificamente.
- **`unlockedFields` é um campo obrigatório do Estado da Run (Seção 3.1)**.

Isso significa: **o desbloqueio é por par (entidade, campo)**, não global.
Desbloquear `ocupacao` para o Mercador não desbloqueia `ocupacao` para o
Ferreiro — cada entidade acumula seus próprios campos revelados,
independentemente.

### 11.3 Como um Campo é Desbloqueado

O desbloqueio acontece através do efeito `unlockField`, já listado no
catálogo da Seção 8.1:

| `type` | Efeito |
|---|---|
| `unlockField` | Adiciona `field` à lista `unlockedFields[targetId]` no Estado da Run, se ainda não presente. |

Formato do efeito:

```json
{ "type": "unlockField", "targetId": "mercador_vila", "field": "ocupacao" }
```

Exemplo: a escolha "Ajudar o mercador" no evento `D1T_MERCADOR_CARROCA`, além
dos efeitos de `karma` e `memory` já mostrados na Seção 16.4, também poderia
ter `{ "type": "unlockField", "targetId": "mercador_vila", "field":
"ocupacao" }`, revelando a ocupação do Mercador na aba NPCs do painel a
partir daquele momento.

Regras:

- Um campo desbloqueado permanece desbloqueado para sempre dentro da run
  (mesma regra de imutabilidade das memórias — Seção 3.4).
- Não há limite de campos por entidade nem ordem obrigatória de desbloqueio
  — cada evento decide quais campos revela, livremente, respeitando apenas
  quais campos existem de fato nos dados completos da entidade (Seção 11.2,
  item 1).
- O protagonista já começa a run com alguns campos desbloqueados por padrão
  (definidos pela classe escolhida — Seção 12), tipicamente `classe` e uma
  descrição narrativa curta.

### 11.4 Como o Painel Consulta Isso (Função de Filtragem)

A função central é:

```
visaoJSON(entidadeCompleta, unlockedFields[entidadeCompleta.id]) → objeto filtrado
```

- **Entrada:** o objeto completo da entidade (vindo do banco estático de
  conteúdo) e a lista de campos desbloqueados para aquele `id` específico
  (vinda do Estado da Run).
- **Saída:** um novo objeto contendo apenas as chaves cujo nome está na
  lista de desbloqueados. Chaves não desbloqueadas são omitidas do objeto
  de saída (não substituídas por placeholder).
- É uma função pura: mesma entrada sempre produz a mesma saída, e nunca
  modifica nem a entidade original nem o Estado da Run.
- O painel (`json-panel.js`, Seção 24) chama essa função toda vez que o
  jogador abre a aba correspondente (Herói/Mundo/NPCs), nunca antes —
  não há necessidade de recalcular a cada frame.

### 11.5 Como NPCs Diferentes Exibem Campos Diferentes

Isso é uma consequência direta do modelo de dados (Seção 11.2), não uma
regra separada: como `unlockedFields` é indexado por `id` de entidade, dois
NPCs podem ter listas de campos desbloqueados completamente diferentes a
qualquer momento da run. Não é necessário nenhum código especial para isso
— é o comportamento natural de uma estrutura `{ [entidadeId]: string[] }`.

Exemplo prático ao longo de uma run:

| Momento | `unlockedFields["mercador_vila"]` | `unlockedFields["ferreiro"]` |
|---|---|---|
| Início | `[]` (não descoberto ainda) | `[]` |
| Após `D1T_MERCADOR_CARROCA` | `["nome", "ocupacao"]` | `[]` |
| Após `D2M_FERREIRO_OFERTA` | `["nome", "ocupacao"]` | `["nome"]` |

A aba NPCs do painel exibe apenas entidades cujo `unlockedFields[id]` já
tenha pelo menos 1 campo — NPCs nunca vistos não aparecem na lista (mantendo
a mensagem "nenhum descoberto ainda" da Seção 20.2 para quando a lista está
totalmente vazia).

### 11.6 Valor Inicial no Boot

Valor inicial de `unlockedFields` no boot de uma nova run:
`{ "protagonista": [<campos default da classe escolhida>] }` — todas as
outras entidades começam sem entrada no objeto (equivalente a lista vazia).

---

## 12. SISTEMA DE CLASSES

Classes definem identidade inicial, sem progressão mecânica ou atributos
numéricos no MVP. Não há troca de classe durante a run.

| ID | Nome | Foco narrativo |
|---|---|---|
| `guerreiro` | Guerreiro | Força física |
| `mago` | Mago | Conhecimento e magia |
| `arqueiro` | Arqueiro | Precisão e agilidade |

A classe afeta apenas: (a) variações no diálogo inicial de despertar, e (b)
a descrição do protagonista exibida na Visão JSON.

---

## 13. OBSTÁCULOS E COLISÃO

### 13.1 Geração

- Cada um dos 3 eventos normais sorteados gera exatamente 1 obstáculo.
- Eventos fixos **não** geram obstáculo com hitbox.
- Posição X do obstáculo de índice `i`: `startX + (i * spacing)`.
- Obstáculos são criados no passo 6 da pipeline (Seção 5) — já com hitbox
  ativa desde o momento em que passam a existir. Não existem antes disso, e
  não existe uma fase em que existem sem hitbox.

### 13.2 Mapeamento Visual

- `obstacle.sprite` define **apenas a aparência** (asset carregado pelo
  Phaser). Valores permitidos: `hero`, `merchant`, `mage`, `slime`, `goblin`,
  `door`, `generic`.
- `obstacle.id` é uma string livre, descritiva, em português, usada só para
  lookup narrativo/debug (ex.: `"mercador_carroca"`) — **não** é usada para
  carregar assets e não precisa pertencer a um enum fechado.
- Mapeamento por tipo de conteúdo do evento:
  - NPC (mago, mercador etc.) → obstáculo com `sprite` de personagem.
  - Monstro (slime, goblin etc.) → obstáculo com `sprite` de criatura.
  - Objeto (porta, baú etc.) → obstáculo com `sprite` de objeto (`door` ou
    variantes futuras).
  - Sem entidade específica → `sprite: "generic"`.

### 13.3 Colisão

1. A hitbox é invisível, alinhada à representação visual do obstáculo.
2. A colisão dispara **uma única vez** por obstáculo.
3. Ao colidir: a caminhada para (`stopWalking()`), o evento associado abre no
   overlay inferior.
4. Após a resolução: a caminhada retoma a partir da posição X atual
   (`resumeWalkingFromCurrentX()`) — **o personagem nunca volta ao X inicial
   da cena.**
5. O obstáculo permanece visível no mapa após resolvido, mas não dispara
   novamente o mesmo evento.

---

## 14. OVERLAY DE DIÁLOGO

Elementos obrigatórios:

- Faixa escura inferior, fixa (não ocupa o centro da tela).
- Área de sprite do falante, acima da caixa de diálogo.
- Nome do falante em destaque.
- Texto do diálogo, com efeito de digitação.
- Área de escolhas (quando o evento tiver `choices`).

**Regras:**

1. O overlay **não troca a cena principal** — apenas sobrepõe e pausa a
   caminhada enquanto aberto.
2. Todo item de `dialogues` tem um `speaker` nomeado — **não existe fala sem
   personagem atribuído.** Quando não há um NPC/criatura falando, o
   `speaker` é o nome do próprio protagonista (ex.: `"speaker": "Guerreiro"`,
   ou o nome definido pela classe/narrativa), usado tanto para falas em voz
   alta quanto para pensamentos ou quebra da quarta parede. **Não existe
   `speaker: null` nem `speaker: "Narrador"` no schema deste jogo.**
3. Eventos fixos usam o mesmo componente de overlay, mas em modo "tela
   cheia" (sem obstáculo/hitbox associado e sem retomar caminhada até o
   fixo terminar).
4. Quando o evento não tem `choices`, o overlay avança automaticamente ao
   fim do último diálogo (o jogador só precisa confirmar/avançar o texto,
   não escolher nada) — ver formato exato do sinal retornado ao
   `RunController` na Seção 17.4.

---

## 15. PERSISTÊNCIA

### 15.1 Regras

- Chave do `localStorage`: `"codequest_estado_do_jogo"`.
- O Estado da Run é salvo:
  - Imediatamente após aplicar os efeitos de cada escolha.
  - Imediatamente após a conclusão de cada evento (fixo ou normal).
- Ao iniciar o jogo, o sistema verifica se existe save válido:
  - Se existir e for válido → carrega e a run continua do ponto salvo.
  - Se não existir, ou estiver corrompido/inválido → cria um novo Estado da
    Run do zero, sem travar a aplicação.

### 15.2 Validação de Save Corrompido

Um save é considerado inválido se: falhar o `JSON.parse`, ou não contiver
todos os campos obrigatórios da Seção 3.1, ou tiver `day`/`period`/`location`
fora dos valores do catálogo (Seção 16.5). Nesses casos, descarta-se o save e
inicia-se uma nova run — sem exibir erro bloqueante ao jogador.

### 15.3 Remoção do Save

- O save é apagado do `localStorage` **apenas** quando a run é concluída
  (Seção 10.3, passo 5) — ao término do desfecho, para impedir continuação de
  uma partida já finalizada.
- Se o jogador fechar o navegador no meio da run, o save permanece
  disponível para continuação.

---

## 16. MODELOS DE DADOS (SCHEMA FINAL)

### 16.1 Estado da Run

Ver Seção 3.1 — schema completo e único.

### 16.2 Classe

```json
{
  "id": "guerreiro",
  "nome": "Guerreiro",
  "descricao": "Focado em força física"
}
```

### 16.3 NPC

```json
{
  "id": "mercador_vila",
  "nome": "Mercador",
  "ocupacao": "Comerciante",
  "memorias_referenciadas": ["ajudou_mercador", "ignorou_mercador"],
  "inventario": ["pocao_cura", "mapa_antigo"]
}
```

### 16.4 Evento (schema definitivo)

```json
{
  "id": "D1M_MERCADOR_CARROCA",
  "kind": "normal",
  "day": [1],
  "period": ["manha"],
  "locations": ["estradas"],
  "climates": ["all"],
  "memoryTrigger": null,
  "memoryGain": "ajudou_mercador",
  "weight": 5,
  "repeatable": false,
  "setLocation": null,
  "obstacle": {
    "id": "mercador_carroca",
    "sprite": "merchant"
  },
  "dialogues": [
    {
      "speaker": "Gorb",
      "text": "Minha carroça atolou. Pode me ajudar?"
    }
  ],
  "choices": [
    {
      "text": "Ajudar o mercador",
      "effects": [
        { "type": "karma", "value": 1 },
        { "type": "memory", "value": "ajudou_mercador" }
      ]
    },
    {
      "text": "Ignorar e seguir caminho",
      "effects": [
        { "type": "karma", "value": -1 }
      ]
    }
  ]
}
```

Exemplo de evento **fixo** com `setLocation` (o campo só faz sentido para
`kind: "fixed"`):

```json
{
  "id": "D1N_CONVITE_VILA",
  "kind": "fixed",
  "day": [1],
  "period": ["noite"],
  "locations": ["campo"],
  "climates": ["all"],
  "memoryTrigger": null,
  "memoryGain": null,
  "weight": 0,
  "repeatable": false,
  "setLocation": "vila_inicial",
  "dialogues": [
    { "speaker": "Guerreiro", "text": "É melhor eu seguir para a vila antes que escureça de vez." }
  ]
}
```

**Campos:**

| Campo | Tipo | Obrigatório | Notas |
|---|---|---|---|
| `id` | string | sim | Formato `D{DIA}{PERIODO}_{DESCRITOR}`, ex.: `D1M_DESPERTAR`. |
| `kind` | `"fixed"` \| `"normal"` | sim | |
| `day` | int[] | sim | Valores em `{1,2,3}`. |
| `period` | string[] | sim | Valores em `{"manha","tarde","noite"}`. |
| `locations` | string[] | sim | Mínimo 1 elemento; nunca omitido. `length > 1` = coringa. |
| `climates` | string[] | sim | Valores do catálogo (Seção 16.5) ou `["all"]`. |
| `memoryTrigger` | string \| null | sim | ID de memória única exigida, ou `null`. Sem suporte a múltiplos triggers no MVP — ver nota abaixo. |
| `memoryGain` | string \| null | não | ID de memória concedida ao concluir o evento (via efeito `memory` de alguma escolha, ou diretamente se o evento não tiver escolhas — Seção 8.3). |
| `weight` | int | sim | `0`–`10`. Eventos fixos: sempre `0`. |
| `repeatable` | boolean | não (default `false`) | Se `true`, ignora a regra de não-repetição (uso típico: coringas de ambientação). |
| `setLocation` | string \| null | não (default `null`); só válido para `kind: "fixed"` | Se presente e não-nulo, `GameState.definirLocalizacao(id)` é chamado ao evento fixo concluir (Seção 2.2.1). Em eventos `normal`, deve sempre ser omitido ou `null` — nunca tem efeito. |
| `obstacle` | objeto | sim para `kind: "normal"` | `{ id, sprite }` — ver Seção 13.2. Omitido para eventos fixos. |
| `dialogues` | objeto[] | sim | Array de `{ speaker, text }`. `speaker` nunca é `null`. |
| `choices` | objeto[] | não | Array de `{ text, effects[] }`. Eventos fixos podem não ter escolhas (avançam automaticamente). |

> **Sobre `memoryTrigger` singular:** o MVP suporta apenas uma memória como
> pré-requisito por evento. Se o design narrativo precisar de um evento que
> dependa de duas memórias anteriores, a solução é criar um evento
> intermediário que consome as duas memórias e produz uma terceira memória
> consolidada (ex.: `"pronto_para_ruinas"`), que então vira o `memoryTrigger`
> do evento final. Isso segue o mesmo padrão de encadeamento já usado no
> banco de eventos (Seção 18) e evita alterar o schema.

### 16.5 Catálogo de Valores Válidos (Enums)

- **Períodos:** `manha`, `tarde`, `noite`
- **Climas:** `ensolarado`, `chuvoso`, `nublado`, `neblina`, `all` (especial, só em `climates` de evento)
- **Classes:** `guerreiro`, `mago`, `arqueiro`
- **Localizações:** `campo`, `vila_inicial`, `estradas`, `floresta_sombria`, `ruinas_antigas`
- **Kind:** `fixed`, `normal`
- **Tipos de efeito:** `karma`, `memory`, `unlockField` (ver Seção 8.1 — `climate` foi removido do MVP)
- **Sprites de obstáculo:** `hero`, `merchant`, `mage`, `slime`, `goblin`, `door`, `generic`
- **Dias:** `1`, `2`, `3`
- **Desfechos:** `bom`, `neutro`, `ruim`

---

## 17. CONTRATOS ENTRE MÓDULOS

### 17.1 GameState

**Responsabilidades:**
- Armazenar e validar todos os campos do Estado da Run (Seção 3.1).
- Expor métodos de mutação (lista fechada, não "etc."):
  - `modificarKarma(value: -1|0|1): void`
  - `adicionarMemoria(id: string): void`
  - `desbloquearCampo(targetId: string, field: string): void` — adiciona
    `field` a `unlockedFields[targetId]`, criando a entrada se ainda não
    existir (efeito `unlockField`, Seção 11.3).
  - `definirLocalizacao(id: string): void` — seta `location`. Só deve ser
    chamado pelo `RunController` como resultado de um `setLocation` de
    evento fixo (Seção 2.2.1) — o `GameState` não valida a origem da
    chamada, mas o contrato de uso é este.
  - `marcarEventoExecutado(id: string): void`
  - `definirEventoAbertura(id: string | null): void` — seta `openingEvent`
    para o período que está sendo montado. Chamado pelo `RunController` no
    passo 1 da pipeline (Seção 5.1), com o resultado do `EventSelector`.
  - `definirEventoEncerramento(id: string | null): void` — seta
    `closingEvent`, mesmo padrão do método acima.
  - `definirPeriodoAtual(events: string[]): void` — recebe os 3 IDs de
    eventos normais sorteados (extraídos de `.normals` na saída do
    `EventSelector`, Seção 17.2), seta `currentPeriodEvents` e
    `currentEventIndex = 0`.
  - `avancarEventoAtual(): void` — incrementa `currentEventIndex`.
  - `marcarAberturaConcluida(): void` — seta `openingDone = true`.
  - `marcarEncerramentoConcluido(): void` — seta `closingDone = true`.
  - `advancePeriod(): void` — incrementa `period`/`day` e reseta os campos
    do período: `currentPeriodEvents`, `currentEventIndex`, `openingDone`,
    `closingDone`, `openingEvent` (→ `null`), `closingEvent` (→ `null`).
    **Não decide quando chamar isso** (ver 17.3), e não define sozinho os
    novos `openingEvent`/`closingEvent` do período seguinte — isso é
    responsabilidade do `RunController`, que chama
    `definirEventoAbertura`/`definirEventoEncerramento` logo em seguida, já
    no passo 1 do novo ciclo da pipeline.
  - `finalizarRun(desfecho: "bom"|"neutro"|"ruim"): void` — seta
    `runOver = true` e registra o `desfecho` recebido como parâmetro. Este
    método **não calcula** o desfecho — quem calcula é o `RunController`
    (Seção 10.3, passo 2); o `GameState` apenas registra o valor já pronto.
  - `getEstado(): GameStateSnapshot` — retorna cópia read-only do estado atual.
- Validar toda operação de mutação (ex.: rejeitar `modificarKarma` com valor fora de `{-1,0,1}`).
- **Não decide fluxo** — apenas executa mutações solicitadas por outros módulos.

**Não altera:** nada fora de si mesmo.

### 17.2 EventSelector

**Entrada:** `GameState` (snapshot).
**Saída:** `{ opening: Event|null, normals: Event[3], closing: Event|null }`

**Responsabilidades:**
- Filtrar eventos elegíveis (Seção 6), incluindo os candidatos a
  `openingEvent`/`closingEvent` (fixos elegíveis para o `day`/`period`
  vigente).
- Separar eventos fixos (abertura/encerramento) dos normais.
- Executar sorteio ponderado sem reposição (Seção 7) para selecionar
  exatamente 3 normais.
- Aplicar fallback de coringa via os dois sorteios sequenciais da Seção 7.3
  se a pool de exclusivos for insuficiente.
- **Não altera** o `GameState` — apenas lê e retorna.

**Consumo pelo `RunController` (deixado explícito para não haver dúvida de
"quem converte o quê"):** o `RunController` recebe este objeto e:
1. extrai os `id` de `.normals` (3 objetos `Event` → 3 strings) e chama
   `GameState.definirPeriodoAtual(ids)`;
2. extrai o `id` de `.opening` (ou `null`) e chama
   `GameState.definirEventoAbertura(id)`;
3. extrai o `id` de `.closing` (ou `null`) e chama
   `GameState.definirEventoEncerramento(id)`.

### 17.3 RunController

**Entrada:** `GameState`, saída do `EventSelector`.
**Saída:** `GameState` atualizado (via chamadas aos métodos do `GameState`).

**Responsabilidades:**
- Executar a pipeline completa do período (Seção 5), passo a passo.
- Decidir **quando** avançar período/dia/encerrar a run (a lógica de decisão
  mora aqui, não no `GameState` — ver Seção 3.3).
- Calcular o desfecho da run (Tabela 10.2) a partir do karma lido do
  `GameState`, e passá-lo pronto para `GameState.finalizarRun(desfecho)`
  (Seção 10.3).
- Converter a saída do `EventSelector` em chamadas aos métodos do
  `GameState` (ver Seção 17.2, "Consumo pelo `RunController`").
- Coordenar transição entre eventos, controle de caminhada e colisão junto
  com a `GameScene`.
- Chamar `SaveManager` após cada evento concluído.
- Ao detectar Dia 3/noite com `closingDone === true`: disparar o fluxo de
  encerramento da run (Seção 10.3) em vez de `advancePeriod()`.

### 17.4 OverlayUI (EventDialogueScene)

**Entrada:** `Event` (evento atual, fixo ou normal).
**Saída:** `Choice` selecionada, **ou o valor `null`** se o evento não tiver
`choices`.

**Formato exato do sinal de conclusão (decisão fechada nesta revisão):**
quando o evento não tem `choices`, o `OverlayUI` não retorna um objeto
`Choice` sintético nem um objeto `{done: true}` — retorna literalmente
`null` assim que o jogador confirma a última tela de diálogo. O
`RunController` interpreta `null` como "sem efeitos de escolha a aplicar,
avançar direto para verificar `memoryGain` automático (Seção 8.3) e marcar
o evento como executado". Quando há `choices`, o retorno é sempre um objeto
`Choice` real, nunca `null`.

**Responsabilidades:**
- Exibir diálogos (`speaker` + `text`) em sequência com efeito de digitação.
- Exibir as `choices` disponíveis, se houver.
- Capturar a seleção do jogador e notificar o `RunController`.
- Pausar a caminhada enquanto aberto; sinalizar ao `RunController` quando
  pode retomar.
- **Não altera** o `GameState` diretamente — apenas informa a escolha feita
  (ou `null`).

### 17.5 SaveManager

**Entrada:** `GameState` (para salvar) ou nenhuma (para carregar).
**Saída:** `boolean` de sucesso, mais um snapshot do `GameState` quando carregado.

**Responsabilidades:**
- Salvar/carregar/apagar o Estado da Run em `localStorage` (chave
  `"codequest_estado_do_jogo"`).
- Validar o save carregado (Seção 15.2); descartar se inválido.
- **Não altera** o `GameState` — apenas serializa/deserializa.

---

## 18. BANCO DE EVENTOS

### 18.1 Convenção de IDs

Formato: `D{DIA}{PERIODO}_{DESCRITOR}` em UPPER_SNAKE_CASE.
Prefixos de período: `M` (manhã), `T` (tarde), `N` (noite).
Exemplos: `D1M_DESPERTAR`, `D1T_MERCADOR_CARROCA`, `D3N_CONFRONTO_FINAL`.

### 18.2 Dimensionamento do Banco

- Uma run completa executa **27 eventos normais** (9 períodos × 3 eventos).
- O banco deve conter **no mínimo 54 eventos normais** cadastrados (o dobro
  do executado em uma run), como margem de segurança agregada.
- **Importante:** esse mínimo agregado de 54 **não é, por si só, uma garantia
  de que todo período terá 3 eventos elegíveis** em qualquer caminho de
  escolhas possível. A elegibilidade depende simultaneamente de dia, período,
  localização, clima e `memoryTrigger` — um total agregado suficiente não
  impede que uma combinação específica fique momentaneamente escassa.
- A cobertura real por período deve ser verificada pelo **linter de
  cobertura** (Seção 22.1) antes de qualquer conteúdo ir para produção — não
  pela contagem agregada isoladamente.

### 18.3 Distribuição de Referência (não obrigatória por período)

| Dia | Período | Eventos normais (referência) | Eventos fixos |
|---|---|---|---|
| 1 | Manhã | 6 | abertura: despertar |
| 1 | Tarde | 6 | — |
| 1 | Noite | 6 | encerramento: convite à vila |
| 2 | Manhã | 6 | — |
| 2 | Tarde | 6 | — |
| 2 | Noite | 6 | — |
| 3 | Manhã | 6 | — |
| 3 | Tarde | 6 | — |
| 3 | Noite | 6 | encerramento: confronto final |

Esta tabela orienta o design de conteúdo; o requisito real e obrigatório é o
total agregado de 54 eventos normais (Seção 18.2) validado pelo linter.

### 18.4 Dependências entre Eventos

Implementadas via `memoryTrigger`/`memoryGain`. Exemplo de cadeia:

1. `D1T_MERCADOR_CARROCA` (Dia 1, tarde): escolha "Ajudar" → `memoryGain:
   "ajudou_mercador"`, Karma +1.
2. `D2M_FERREIRO_OFERTA` (Dia 2, manhã): `memoryTrigger: "ajudou_mercador"`
   — só elegível se a memória existir.

---

## 19. HISTÓRIA

### 19.1 Linha do Tempo

| Dia | Eixo Narrativo | Mapas envolvidos |
|---|---|---|
| 1 | Descoberta da Visão JSON e adaptação ao mundo. | Campo (inicial) → Vila Inicial (ao final do dia). |
| 2 | Exploração da vila e descoberta da ameaça do Boss. | Estradas (desbloqueada por memória obtida na vila). |
| 3 | Viagem e confronto final. | Floresta Sombria e Ruínas Antigas (desbloqueadas por memórias das Estradas). Ruínas Antigas é forçada no fixo de encerramento, independentemente de desbloqueio prévio. |

### 19.2 Dia 1 — O Despertar

Evento fixo de abertura (`D1M_DESPERTAR`): despertar do protagonista e
primeira manifestação da Visão JSON, funcionando como tutorial integrado.
Eventos normais introduzem os primeiros NPCs e encontros. Evento fixo de
encerramento conduz à Vila Inicial. Tom: descoberta e curiosidade.

### 19.3 Dia 2 — A Vila

Eventos fixos apresentam personagens centrais e revelam a existência do
Boss. Eventos normais aprofundam a vila e desbloqueiam novas informações na
Visão JSON. Memórias do Dia 1 alteram disponibilidade de eventos. Tom:
investigação e preparação.

### 19.4 Dia 3 — O Confronto Final

Libera Estradas, Floresta Sombria e progressivamente Ruínas Antigas. Eventos
fixos aprofundam o mistério da Visão JSON e conduzem às Ruínas Antigas.
Eventos normais têm maior diversidade e dependem fortemente das memórias
acumuladas. Evento fixo de encerramento (`D3N_CONFRONTO_FINAL`) sempre em
`ruinas_antigas`. Tom: tensão crescente até o clímax.

### 19.5 Desfechos

Ver Seção 10.2 para a tabela e Seção 10.3 para o fluxo de cálculo.

- **Final Bom (Karma > 0):** vitória com honra; Visão JSON se expande; NPCs
  ajudados retribuem.
- **Final Neutro (Karma = 0):** vitória sem clareza moral; mundo segue como
  estava.
- **Final Ruim (Karma < 0):** vitória por meios questionáveis; Visão JSON se
  enfraquece; NPCs prejudicados expressam ressentimento.

---

## 20. FLUXO DE USO E TELAS

### 20.1 Jornada do Jogador

1. Tela de menu → 2. Criação de personagem → 3. Despertar (fixo Dia 1/manhã)
→ 4. Pipeline do período (Seção 5) → 5. Instanciar obstáculos → 6. Caminhar
→ 7. Colidir → 8. Overlay de evento → 9. Escolha e efeito → 10. Retomar
caminhada → 11. Repetir 6–10 até 3 eventos → 12. Transição de período → 13.
Repetir 4–12 pelos 3 dias → 14. Confronto final e cálculo de desfecho → 15.
Tela de desfecho.

### 20.2 Telas

- **Menu:** "Iniciar Jogo", "Sobre", tela cheia.
- **Criação de Personagem:** 3 botões de classe, "Voltar", "Confirmar".
- **Cena de Jogo:** side-scrolling com parallax; HUD de período e clima;
  painel de Karma; botão do painel JSON; overlay de diálogo inferior.
- **Painel JSON:** abas Herói/Mundo/NPCs; somente leitura; syntax highlight.
- **Transição de Período/Dia:** indicador visual, atualização de HUD, 2–3s.
- **Desfecho:** classe e Karma do herói, narrativa final, "Voltar ao Menu".

---

## 21. REQUISITOS FUNCIONAIS E NÃO FUNCIONAIS

### 21.1 Funcionais

- RF01: Permitir seleção de classe antes de iniciar a run.
- RF02: Aplicar efeitos narrativos da classe escolhida.
- RF03: Avançar automaticamente entre períodos após consumir os 3 eventos
  normais + fixo de encerramento (se houver).
- RF04: Avançar automaticamente entre dias ao final do período da noite.
- RF05: Encerrar a run automaticamente ao término da noite do Dia 3.
- RF06: Executar o evento fixo de abertura antes de liberar a caminhada e
  antes de instanciar os obstáculos (Seção 5).
- RF07: Filtrar eventos elegíveis consultando exclusivamente o Estado da Run.
- RF08: Sortear exatamente 3 eventos normais por período via sorteio
  ponderado.
- RF09: Impedir repetição de evento normal já executado, exceto
  `repeatable: true`.
- RF10: Completar a seleção com eventos coringa quando faltarem elegíveis,
  via os dois sorteios sequenciais da Seção 7.3.
- RF11: Apresentar as escolhas disponíveis de cada evento com `choices`.
- RF12: Aplicar imediatamente os efeitos da escolha ao Estado da Run.
- RF13: Impedir remoção/alteração de qualquer memória já criada.
- RF14: Sortear e manter um clima por período, constante do início ao fim.
- RF15: Considerar o clima vigente como critério de elegibilidade.
- RF16: Salvar o Estado da Run em `localStorage` após cada escolha e após
  cada evento concluído.
- RF17: Verificar e carregar save existente no boot; descartar se inválido.
- RF18: Remover o save ao concluir a run.
- RF19: Calcular o desfecho com base no Karma acumulado ao final da run
  (cálculo feito pelo `RunController`, ver Seção 10.3).
- RF20: Exibir o desfecho correspondente (Bom, Neutro, Ruim).
- RF21: Permitir que eventos fixos alterem `state.location` via `setLocation`
  ao concluir (Seção 2.2.1).
- RF22: Permitir que escolhas revelem campos de entidades na Visão JSON via
  o efeito `unlockField` (Seção 11.3).

### 21.2 Não Funcionais

- RNF01: Pipeline do período executa sem atraso perceptível na transição
  entre eventos.
- RNF02: Taxa de quadros estável durante movimentação, compatível com
  Phaser 3 em hardware desktop comum.
- RNF03: Executável em Desktop Windows.
- RNF04: Funciona em navegadores compatíveis com Phaser 3, sem plugins
  externos.
- RNF05: Interface acessível ao público-alvo, sem exigir conhecimento prévio
  de programação.
- RNF06: Texto legível em resolução padrão desktop, sem necessidade de zoom.
- RNF07: Save ausente ou corrompido inicia nova run sem travar a aplicação.
- RNF08: Falha em um evento individual não interrompe a pipeline do período
  como um todo.
- RNF09: Banco de eventos é dado estruturado (JSON), permitindo adição de
  conteúdo sem alterar código da engine.
- RNF10: Código do MVP segue princípios de funções puras sempre que possível.

### 21.3 Regras de Negócio

- RN01: Uma run dura exatamente 3 dias × 3 períodos.
- RN02: Cada período executa exatamente 3 eventos normais, além de fixos.
- RN03: O Estado da Run é a única fonte de verdade.
- RN04: Memórias são permanentes e imutáveis dentro de uma run.
- RN05: Eventos normais não repetem na run, exceto `repeatable: true`.
- RN06: **Peso permitido para qualquer evento do banco: 0 a 10** (eventos
  fixos sempre 0; eventos normais tipicamente 1–10, podendo ser 0 em casos
  raros — ver Seção 7.1).
- RN07: O confronto final ocorre sempre em `ruinas_antigas`, no fixo de
  encerramento do Dia 3 (Seção 19.4), independentemente da sequência de
  mapas percorrida na run.
- RN08: Não há condição de derrota no MVP. Confrontos são sempre resolvidos
  por escolha narrativa (Seção 10.3).
- RN09: `state.location` só é alterado por `setLocation` de evento fixo —
  nunca por evento normal, escolha, ou decisão própria do `RunController`
  (Seção 2.2.1).

---

## 22. FERRAMENTAS DE VALIDAÇÃO (LINTERS)

Estas ferramentas são parte obrigatória do pipeline de conteúdo — não são
opcionais nem "nice to have". Devem rodar antes de qualquer merge que altere
o banco de eventos.

### 22.1 Linter de Cobertura (`validate-event-coverage.js`)

**Objetivo:** substituir a afirmação não verificada de que "54 eventos
garantem que a pool nunca falte" por uma verificação real.

**Escopo desta versão (decisão fechada):** a verificação exaustiva de "pior
caminho de escolhas possível" é um problema de busca combinatória em um
grafo de dependências de memória — fora de escopo para o MVP. Em vez disso,
o linter verifica um **cenário simplificado, mas realista**: assumir que
`state.memories = []` (nenhuma memória obtida ainda). Esse é o pior caso
real para qualquer evento com `memoryTrigger` (que só fica elegível quando a
memória já existe) — sem memórias, o número de eventos elegíveis está no
seu mínimo possível para aquele `(day, period)`.

**Algoritmo:**
1. Para cada uma das 9 combinações de `(day, period)`:
2. Fixar `state.memories = []` como cenário de verificação (não se simula
   nenhuma árvore de escolhas — este é o único cenário testado).
3. Para cada uma das 4 possibilidades de clima nesse período, calcular
   quantos eventos normais (exclusivos + coringas ainda não marcados como
   `executed` neste cenário hipotético) ficam elegíveis pela função
   `elegivel()` da Seção 6.
4. Se em algum `(day, period, climate)` o total elegível for `< 3`, o linter
   falha e reporta exatamente qual combinação está com cobertura
   insuficiente.

**Limitação conhecida e aceita:** esta verificação garante cobertura apenas
no cenário "chão" (zero memórias). Ela não prova formalmente que todo
caminho intermediário de escolhas ao longo da run sempre terá 3 eventos
elegíveis — apenas que o pior caso estrutural (ausência total de memórias)
está coberto. Isso é considerado suficiente para o MVP porque, na prática,
memórias tendem a *aumentar* elegibilidade (via `memoryTrigger`) e nunca a
diminuí-la — não existe mecanismo no schema para uma memória *remover*
elegibilidade de um evento. Uma verificação exaustiva por árvore de escolhas
fica registrada como possível melhoria futura, fora do MVP.

### 22.2 Linter de Efeitos Vazios (`validate-choice-effects.js`)

**Objetivo:** impedir escolhas que não alteram nenhum estado observável
(Seção 8.2).

**Algoritmo:** para cada `choice` de cada evento no banco, rejeitar se
`effects` estiver vazio, ou se todos os itens de `effects` forem
`{type: "karma", value: 0}`.

### 22.3 Linter de Schema (`validate-event-schema.js`)

**Objetivo:** validar que todo evento no banco segue exatamente o schema da
Seção 16.4 — campos obrigatórios presentes, tipos corretos, valores dentro
dos enums da Seção 16.5, `speaker` nunca nulo/vazio em `dialogues`, e
`setLocation` presente apenas em eventos `kind: "fixed"` (nunca em
`normal`). Peso `0` em evento normal **não é rejeitado** — é um valor válido
por design (Seção 7.1), não um erro de schema.

---

## 23. CONVENÇÕES DE NOMENCLATURA

- **IDs de evento:** UPPER_SNAKE_CASE, formato `D{DIA}{PERIODO}_{DESCRITOR}`.
- **Propriedades JSON:** camelCase (`memoryTrigger`, `memoryGain`,
  `locations`, `climates`, `classId`, `setLocation`).
- **Arquivos JavaScript:** kebab-case (`game-state.js`, `save-manager.js`).
- **Classes JavaScript:** PascalCase (`GameState`, `SaveManager`).
- **Constantes:** UPPER_SNAKE_CASE (`MAX_WEIGHT`, `SAVE_KEY`).
- **Variáveis e funções:** camelCase (`currentState`, `calculateKarma()`).
- **IDs de localização:** snake_case minúsculo (`vila_inicial`, nunca
  "Vila" ou "vila").
- **Valor especial "todos":** sempre a string `"all"` (nunca "Todos" ou
  variações).

---

## 24. ORGANIZAÇÃO DE ARQUIVOS

Esta seção define o layout físico de diretórios do projeto, para que
nenhuma decisão de "onde isso vai" precise ser tomada durante a
implementação.

### 24.1 Árvore de Diretórios

```
code-quest/
├── index.html
├── assets/
│   ├── sprites/
│   │   ├── hero/
│   │   ├── merchant/
│   │   ├── mage/
│   │   ├── slime/
│   │   ├── goblin/
│   │   └── door/
│   ├── backgrounds/
│   │   ├── campo/
│   │   ├── vila_inicial/
│   │   ├── estradas/
│   │   ├── floresta_sombria/
│   │   └── ruinas_antigas/
│   └── audio/
├── data/
│   ├── events/
│   │   ├── day1.json
│   │   ├── day2.json
│   │   └── day3.json
│   ├── npcs.json
│   ├── classes.json
│   └── climates.json
├── src/
│   ├── core/
│   │   ├── game-state.js
│   │   ├── event-selector.js
│   │   ├── run-controller.js
│   │   └── save-manager.js
│   ├── scenes/
│   │   ├── menu-scene.js
│   │   ├── character-creation-scene.js
│   │   ├── game-scene.js
│   │   ├── event-dialogue-scene.js
│   │   └── ending-scene.js
│   └── ui/
│       └── json-panel.js
└── tools/
    ├── validate-event-coverage.js
    ├── validate-choice-effects.js
    └── validate-event-schema.js
```

### 24.2 Regras de Organização

1. **Eventos são organizados por dia, não por período.** Cada arquivo
   `data/events/day{N}.json` é um array contendo **todos** os eventos
   daquele dia — fixos e normais misturados, distinguíveis pelo campo
   `kind`. Não há um arquivo por período: dividir em 9 arquivos pequenos
   traria mais custo de manutenção (referências cruzadas entre arquivos)
   do que benefício.
2. `data/npcs.json` contém a lista completa de NPCs cadastrados (schema da
   Seção 16.3) — um único array, um único arquivo.
3. `data/classes.json` contém as 3 classes jogáveis (schema da Seção 16.2).
4. `data/climates.json` é **opcional e apenas informativo**: uma lista dos 4
   climas válidos (Seção 16.5), útil para os linters e para eventuais
   ferramentas de autoria de conteúdo. Não é lido em tempo de execução pelo
   jogo — os valores válidos já estão fixados no schema (Seção 16.5).
5. `src/core/` contém os quatro módulos com contrato formal definido na
   Seção 17 (`GameState`, `EventSelector`, `RunController`, `SaveManager`) —
   um arquivo por módulo, nomes batendo exatamente com os usados nesta
   especificação.
6. `src/scenes/` contém as cenas Phaser, uma por tela da Seção 20.2 (Menu,
   Criação de Personagem, Jogo, Overlay de Diálogo, Desfecho).
7. `src/ui/json-panel.js` implementa o painel da Visão JSON (Seção 11.4) —
   fica separado de `scenes/` porque é um componente de UI reutilizado
   dentro da `GameScene`, não uma cena própria.
8. `tools/` contém os três linters da Seção 22, executáveis via linha de
   comando (Node.js), fora do bundle do jogo — não são carregados pelo
   Phaser em nenhum momento.
9. Nomes de arquivo `.js` seguem kebab-case (Seção 23); nomes de arquivo
   `.json` em `data/` seguem snake_case simples e descritivo
   (`day1.json`, `npcs.json`, `classes.json`, `climates.json`).
10. Os três linters devem ser executados (manualmente ou via hook de CI) antes
    de qualquer merge que altere qualquer arquivo dentro de `data/events/`.

---

## 25. CRITÉRIOS DE ACEITE

**EventSelector pronto quando:**
- Recebe `GameState` e retorna `{ opening, normals[3], closing }`.
- Filtra corretamente por dia, período, localização, clima, memória.
- Sorteio ponderado sem reposição, com fallback de coringa via os dois
  sorteios sequenciais da Seção 7.3.
- Não altera o `GameState` recebido.

**GameState pronto quando:**
- Implementa exatamente os métodos listados na Seção 17.1 (lista fechada,
  incluindo `definirLocalizacao`, `definirEventoAbertura`,
  `definirEventoEncerramento` e `desbloquearCampo`).
- Valida toda operação de mutação, rejeitando valores inválidos.
- `advancePeriod()` reseta também `openingEvent`/`closingEvent` para `null`.
- `finalizarRun(desfecho)` apenas registra o valor recebido, sem calculá-lo.
- `getEstado()` retorna cópia read-only.
- Nenhum outro módulo consegue mutar campos diretamente.

**RunController pronto quando:**
- Executa a pipeline da Seção 5 passo a passo, sem desvios.
- É o único módulo que decide *quando* chamar `advancePeriod()` /
  `finalizarRun()`, e é quem calcula o desfecho antes de chamar
  `finalizarRun()`.
- Converte a saída do `EventSelector` em chamadas aos setters corretos do
  `GameState` (Seção 17.2).
- Chama `SaveManager` após cada evento concluído.

**OverlayUI pronto quando:**
- Exibe `speaker` + `text` de cada item de `dialogues`, nunca com speaker
  vazio.
- Captura e retorna a escolha (ou `null`, se o evento não tiver `choices`)
  sem alterar `GameState`.
- Pausa/retoma a caminhada corretamente.

**SaveManager pronto quando:**
- Salva/carrega/apaga com a chave `"codequest_estado_do_jogo"`.
- Descarta saves inválidos (Seção 15.2) sem travar o boot.
- Nunca modifica o `GameState` — só serializa/deserializa.

**Banco de eventos pronto quando:**
- Passa nos três linters da Seção 22 sem erros.
- Contém no mínimo 54 eventos normais.
- Todo evento segue o schema da Seção 16.4.
- Está organizado nos arquivos descritos na Seção 24.

---

## 26. HISTÓRICO DE RESOLUÇÃO DE AMBIGUIDADES

Registro das decisões tomadas nas auditorias de julho/2026 (a original,
contra os documentos-fonte, e a interna, contra o próprio documento
consolidado). Todas já estão incorporadas ao corpo do documento acima —
esta seção é só referência histórica, não precisa ser consultada para
implementar nada.

| # | Ambiguidade original | Decisão final | Seção onde foi aplicada |
|---|---|---|---|
| 1 | Ordem: abertura fixa vs. instanciação de obstáculos | Obstáculo só é criado depois que a abertura já rodou; não existe estado "instanciado mas inativo" | 5 |
| 2 | `currentPeriodEvents` com 3 ou 5 itens | Sempre 3 (só normais); fixos em campos separados (`openingEvent`/`closingEvent`) | 3.1 |
| 3 | Quem avança dia/período: GameState ou RunController | RunController decide; GameState só executa | 3.3, 17.1, 17.3 |
| 4 | Peso mínimo 0 ou 1 | 0, com distribuição uniforme se toda a pool for 0 | 7.1 |
| 5 | `dialogues` como string ou `{speaker, text}` | `{speaker, text}`; speaker nunca nulo — sempre um personagem, incluindo o protagonista | 14, 16.4 |
| 6 | Efeito `climate` em escolha, conflitando com clima constante | Removido do MVP por completo | 8.1 |
| 7 | Clima do primeiro período: sorteado ou fixo | Sorteado normalmente, sem exceção | 9.1 |
| 8 | RN07 referenciava seção inexistente (3.1.1.1) | Corrigido para referenciar Seção 19.4 | 21.3 |
| 9 | "54 eventos garantem cobertura" (afirmação não verificada) | Substituído por linter de cobertura obrigatório | 18.2, 22.1 |
| 10 | `memoryTrigger` singular vs. narrativa sugerindo múltiplos | Mantido singular; usar evento intermediário para encadear memórias | 16.4 |
| 11 | Critério "locations ausente" para coringa (nunca ocorre na prática) | Simplificado para `locations.length > 1` | 4.2 |
| 12 | `obstacle.id` vs `obstacle.sprite` — a quem pertence o enum visual | Enum pertence a `sprite`; `id` é string livre para debug/narrativa | 13.2, 16.4 |
| 13 | Escolha com só Karma 0 viola "toda escolha altera estado" | Vira regra de linter, rejeitada no build de conteúdo | 8.2, 22.2 |
| 14 | `"tipo": "local"` violava convenção própria de nomenclatura | Removido o schema de "requisito" avulso; elegibilidade é função pura sobre os campos do evento | 6 |
| 15 | Quem altera `state.location`, de forma explícita e única | Só eventos fixos, via `setLocation`; RunController só lê, GameState só executa | 2.2.1 |
| 16 | Visão JSON documentada superficialmente frente à sua importância | Seção expandida cobrindo armazenamento, desbloqueio, consulta e diferenciação entre entidades | 11 |
| 17 | Formato físico de arquivos nunca definido | Árvore de diretórios completa, com regras de organização | 24 |
| 18 | `EventSelector` retorna objeto `{opening, normals, closing}`, mas `GameState.definirPeriodoAtual` só aceitava `string[]` — faltavam setters para os fixos | Adicionados `definirEventoAbertura`/`definirEventoEncerramento`; consumo da saída do EventSelector documentado explicitamente | 17.1, 17.2 |
| 19 | `advancePeriod()` resetava campos do período mas não `openingEvent`/`closingEvent` | Reset explícito incluído; novos valores são preenchidos pelo RunController logo em seguida | 3.3, 17.1 |
| 20 | Quem calcula o desfecho: GameState ou RunController | RunController calcula e passa pronto para `GameState.finalizarRun(desfecho)` | 10.3, 17.1, 17.3 |
| 21 | Formato do "sinal de concluído" do OverlayUI quando não há `choices` | Definido como `null`, literal e explícito | 17.4 |
| 22 | Sorteio de coringa no fallback: pool única ou dois sorteios separados | Dois sorteios sequenciais e independentes, nesta ordem fixa | 7.3 |
| 23 | Linter de cobertura pedia simulação exaustiva de "pior caminho de escolhas" (não implementável como escrito) | Simplificado para cenário único com `memories = []`, com limitação conhecida documentada | 22.1 |
| 24 | `unlockField` era citado como efeito (Seção 11) mas não constava no catálogo formal (Seção 8.1) | Adicionado ao catálogo de efeitos | 8.1, 16.5 |
| 25 | `setLocation` era citado como campo de evento fixo (Seção 2.2.1) mas não constava no schema formal (Seção 16.4) | Adicionado ao schema, com exemplo de evento fixo completo | 16.4 |