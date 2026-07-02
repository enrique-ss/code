# CODE QUEST
## Documento de Design de Jogo (GDD)

---

## SUMÁRIO

1. [VISÃO GERAL](#1-visão-geral)
   - 1.1 Resumo do Jogo
   - 1.2 Objetivo Geral
   - 1.3 Objetivos Específicos
   - 1.4 Público-alvo
   - 1.5 Escopo do MVP
   - 1.6 Tecnologias Utilizadas
2. [UNIVERSO](#2-universo)
   - 2.1 Premissa
   - 2.2 Regras do Universo
   - 2.3 Visão JSON
   - 2.4 Localizações
   - 2.5 NPCs
3. [GAMEPLAY](#3-gameplay)
   - 3.1 Loop Principal
     - 3.1.1 Sistema de Navegação de Mapas
     - 3.1.1.1 Exceção do Confronto Final
   - 3.2 Estado do Jogo
     - 3.2.1 Regra de Encerramento da Run
   - 3.3 Memória do Mundo
   - 3.4 Sistema de Eventos
     - 3.4.1 Estrutura de Evento
     - 3.4.2 Classificação de Eventos
   - 3.5 Pipeline de Execução de Eventos
   - 3.6 Sistema de Requisitos
   - 3.7 Sistema de Peso
   - 3.8 Algoritmo de Sorteio Ponderado
   - 3.9 Sistema de Escolhas
   - 3.10 Sistema de Clima
   - 3.11 Visão JSON — Regra de Implementação
   - 3.12 Sistema de Karma
   - 3.13 Sistema de Classes
   - 3.14 Notas de Implementação MVP
     - 3.14.1 Persistência do Estado do Jogo
     - 3.14.2 Execução do MVP
     - 3.14.3 Limitações Intencionais do MVP
   - 3.15 Modelos de Dados
     - 3.15.1 Estado do Jogo
     - 3.15.2 Classe
     - 3.15.3 NPC
     - 3.15.4 Evento
     - 3.16 Organização dos Dados
4. [HISTÓRIA](#4-história)
   - 4.1 Linha do Tempo
   - 4.2 Dia 1 — O Despertar
   - 4.3 Dia 2 — A Vila
   - 4.4 Dia 3 — O Confronto Final
   - 4.5 Desfechos
5. [BANCO DE EVENTOS](#5-banco-de-eventos)
   - 5.1 Convenção de IDs
   - 5.2 Lista Completa de Eventos
   - 5.3 Dependências entre Eventos
   - 5.4 Fluxo Narrativo
6. [REQUISITOS](#6-requisitos)
   - 6.1 Requisitos Funcionais
   - 6.2 Requisitos Não Funcionais
   - 6.3 Regras de Negócio
7. [FLUXO DE USO](#7-fluxo-de-uso)
   - 7.1 Jornada do Jogador
   - 7.2 Telas Principais

---

## 1 VISÃO GERAL

### 1.1 Resumo do Jogo

Code Quest é um jogo digital de aventura em 2D, com progressão narrativa baseada em escolhas e elementos característicos do gênero rogue-like. A história se desenrola ao longo de três dias, durante os quais o jogador vivencia eventos sorteados dinamicamente. Essa dinâmica garante que combinações de situações, personagens e decisões variem entre partidas.

O protagonista desperta em um mundo de fantasia medieval sem compreender como chegou até ali. Nos primeiros momentos, descobre possuir uma habilidade única: a Visão JSON, capacidade de enxergar uma estrutura invisível de dados que revela propriedades de objetos, criaturas e personagens, permanecendo oculta para os demais habitantes do mundo.

Essa habilidade cumpre também um propósito educacional: introduzir, de forma natural e acessível, conceitos básicos sobre como sistemas organizam informações, sem exigir conhecimento técnico prévio do jogador.

Cada escolha realizada ao longo da jornada gera consequências permanentes. A resolução dos eventos consolida progressivamente um dos três desfechos possíveis, determinados ao final do terceiro dia com base no sistema de Karma.

### 1.2 Objetivo Geral

Desenvolver um jogo digital que desperte o interesse pela programação por meio de uma narrativa interativa, utilizando conceitos computacionais como parte da construção do universo do jogo.

### 1.3 Objetivos Específicos

- Desenvolver uma narrativa baseada em escolhas
- Implementar um sistema de eventos sorteados dinamicamente
- Incentivar a exploração e a rejogabilidade
- Apresentar, de maneira natural, conceitos básicos relacionados à estrutura de dados durante a narrativa
- Aplicar conhecimentos de desenvolvimento de jogos, desenvolvimento web, programação em JavaScript e organização de software

### 1.4 Público-alvo

O jogo é destinado principalmente a crianças e adolescentes com interesse em jogos narrativos, aventura e fantasia medieval, sobretudo pessoas sem contato prévio com programação. A proposta utiliza elementos visuais e narrativos para despertar curiosidade sobre a forma como informações podem ser estruturadas em sistemas computacionais.

Não é necessário conhecimento prévio em programação para compreender ou concluir a história. A complexidade dos sistemas internos descritos neste documento (Visão JSON, eventos, Karma) não é exposta ao jogador: a experiência permanece baseada em escolhas claras e consequências perceptíveis.

### 1.5 Escopo do MVP

O Produto Mínimo Viável (MVP) contempla uma versão funcional da proposta do jogo, contendo os sistemas necessários para validar sua mecânica central. O MVP inclui:

- Protagonista personalizável por classe, sem sistema de progressão por nível ou experiência
- Narrativa distribuída ao longo de três dias, cada um dividido em manhã, tarde e noite
- Sistema de eventos sorteados dinamicamente
- Sistema de escolhas com consequências
- Sistema de clima
- Três classes jogáveis
- Três desfechos narrativos possíveis, determinados pelo sistema de Karma
- Interface para apresentação de eventos, escolhas e informações do jogador (painel JSON e HUD)

### 1.6 Tecnologias Utilizadas

**Tabela 1 — Tecnologias utilizadas no desenvolvimento**

| Categoria | Detalhes |
|-----------|----------|
| Linguagem de Programação | JavaScript |
| Engine/Framework | Phaser 3 |
| Controle de Versão | Git e GitHub |
| Ferramentas de Desenvolvimento | Visual Studio Code, Google Docs, Canva |
| Plataforma Alvo | Desktop (Windows) |

---

## 2 UNIVERSO

### 2.1 Premissa

O universo de Code Quest combina elementos clássicos da fantasia medieval com uma estrutura invisível baseada em dados. Para seus habitantes, o mundo funciona de maneira natural: pessoas trabalham, criaturas habitam as florestas, a magia existe e a vida segue seu curso comum.

Por trás dessa normalidade, toda a realidade é organizada por uma estrutura de propriedades e regras que permanecem invisíveis para quem vive ali. Apenas o protagonista é capaz de enxergar parte dessa estrutura, por meio da Visão JSON.

Essa habilidade não altera o funcionamento do mundo. O que ela muda é a forma como o jogador interpreta os acontecimentos e toma decisões ao longo da aventura, oferecendo uma camada extra de leitura que nenhum outro personagem possui.

### 2.2 Regras do Universo

A Visão JSON expande as informações disponíveis conforme o protagonista interage com o mundo, refletindo diretamente suas experiências. As informações reveladas permanecem disponíveis após serem desbloqueadas, permitindo nova consulta a dados já descobertos. Cada interação relevante pode liberar novos campos relacionados às entidades envolvidas, incentivando exploração e experimentação. O desbloqueio de atributos ocorre através de eventos específicos que adicionam campos à estrutura JSON da entidade consultada.

O mundo registra acontecimentos relevantes da jornada. Esses registros são formalmente implementados como Memórias do Mundo, subsistema do Estado do Jogo detalhado na Seção 3.3. Exemplos incluem ações significativas como ajudar um NPC ou descobrir uma ruína. Memórias não pertencem a entidades individuais: pertencem ao Estado do Jogo e são apenas referenciadas por elas.

### 2.3 Visão JSON

O objetivo não é revelar informações completas, mas fornecer pistas parciais que influenciam interpretação e decisões. A regra de implementação deste filtro está descrita na Seção 3.11.

Exemplos de estrutura exibida:

```json
{
  "tipo": "baú",
  "aberto": false
}
```

```json
{
  "tipo": "lobo",
  "hostilidade": "alta"
}
```

```json
{
  "nome": "André de Aurora",
  "ocupacao": "Ferreiro"
}
```

### 2.4 Localizações

O jogo utiliza estrutura side-scrolling 2D, com navegação horizontal entre áreas. Cada localização é uma faixa horizontal que contém pontos de interação. As localizações não representam exploração livre contínua dentro de uma cena. Cada mapa funciona como contexto e filtro para o sistema de eventos (Seção 3.6). A definição de qual mapa está ativo em cada período da run não é fixa por dia: é resultado de uma escolha do jogador, formalizada no Sistema de Navegação de Mapas (Seção 3.1.1), respeitando o desbloqueio progressivo de cada localização.

**Tabela 2 — Localizações do jogo**

| Localização | Descrição |
|-------------|-----------|
| Campo | Área de introdução, com baixa densidade de eventos. |
| Vila Inicial | Centro principal, com maior concentração de NPCs e eventos. |
| Estradas | Área de transição entre regiões, com eventos de percurso. |
| Floresta Sombria | Área de exploração, com eventos de risco e encontros isolados. |
| Ruínas Antigas | Região ligada ao mistério central e ao confronto final, com eventos raros. |

### 2.5 NPCs

NPCs são entidades narrativas persistentes que participam de múltiplos eventos ao longo da jogatina. O estado de cada NPC consiste em uma lista de memórias referenciadas: IDs de Memórias do Mundo relevantes para aquele NPC.

Dois ou mais NPCs podem referenciar a mesma memória e reagir de formas distintas a ela, pois a interpretação do dado é definida individualmente em cada evento que envolve aquele NPC. A memória em si é neutra, apenas um fato registrado no Estado do Jogo; o significado atribuído a ela é definido pelo conteúdo do evento, não pela memória.

O comportamento dos NPCs varia conforme as memórias do mundo, alterando diálogos e consequências de eventos. Como as memórias são globais, não há divergência entre o que aconteceu e o que o NPC sabe.

---

## 3 GAMEPLAY

### 3.1 Loop Principal

O jogo é estruturado em três dias, cada um dividido em manhã, tarde e noite, totalizando nove períodos por run. Cada período é composto por cinco eventos executados em ordem fixa:

1. 1 evento fixo de abertura
2. 3 eventos normais, selecionados por sorteio ponderado
3. 1 evento fixo de encerramento

Dessa forma, cada período produz exatamente 3 eventos normais e 2 eventos fixos. Ao longo da run completa, são executados 27 eventos normais (9 períodos × 3) e 18 eventos fixos (9 períodos × 2), totalizando 45 eventos. A classificação entre eventos fixos e normais é detalhada na Seção 3.4.2.

#### 3.1.1 Sistema de Navegação de Mapas

No início de cada período, exceto no período fixo de encerramento do Dia 3, o jogador escolhe, entre os mapas atualmente desbloqueados, para qual Mapa deseja ir. Essa escolha define o valor de localizacao no Estado do Jogo para aquele período, e os eventos normais sorteados do período são filtrados considerando esse Mapa, por meio do requisito de local.

**Regras:**

- A escolha de Mapa ocorre uma vez por período, podendo o jogador alternar entre Mapas até nove vezes ao longo da run
- Apenas mapas desbloqueados são apresentados como opção
- O desbloqueio de um mapa ocorre por meio de Memória do Mundo específica, adquirida como efeito de uma escolha em algum evento anterior
- O desbloqueio de mapas independe do dia ou período em que ocorre, dependendo exclusivamente da memória correspondente ter sido registrada no Estado do Jogo
- O Campo é o único mapa desbloqueado por padrão no início da run

#### 3.1.1.1 Exceção do Confronto Final

No período fixo de encerramento do Dia 3 (noite), não há escolha de mapa: o sistema força a transição para as Ruínas Antigas, independentemente dos mapas desbloqueados ou da escolha feita pelo jogador em períodos anteriores. Essa exceção segue a mesma regra já aplicada a eventos fixos: ignora completamente qualquer lógica de seleção.

### 3.2 Estado do Jogo

O Estado do Jogo é a estrutura principal que representa toda a informação ativa da run. Existe apenas durante uma partida e é reiniciado ao iniciar um novo jogo. É a única fonte de verdade para todas as decisões do sistema, armazenando:

- Tempo atual (dia e período)
- Eventos já executados
- Valor de Karma acumulado
- Memórias do Mundo

**Regras gerais do Estado do Jogo:**

- Existe apenas durante uma run e é reiniciado ao iniciar uma nova partida
- É atualizado imediatamente após cada evento
- Controla toda a lógica de elegibilidade, progressão e desfecho do jogo
- Memórias do Mundo não geram eventos diretamente: afetam apenas a elegibilidade de eventos futuros, por meio do sistema de requisitos
- Memórias do Mundo não alteram o pool de eventos nem a pipeline de seleção
- O estado de NPCs é definido estaticamente no banco de NPCs e não é armazenado no Estado do Jogo

#### 3.2.1 Regra de Encerramento da Run

A jogatina é finalizada automaticamente ao término do período da noite do Dia 3, após a execução de todos os eventos desse período e o cálculo do desfecho com base no Karma acumulado.

### 3.3 Memória do Mundo

A Memória do Mundo é o subsistema do Estado do Jogo responsável por registrar acontecimentos narrativamente relevantes durante a jogatina. Cada memória é um registro com a seguinte estrutura:

```json
{
  "id": "ajudou_mercador",
  "descricao": "O protagonista ajudou o mercador a recuperar sua carroça",
  "dia_criacao": 1
}
```

**Regras da Memória do Mundo:**

- Toda memória é criada como efeito de uma escolha do jogador
- Memórias são permanentes e imutáveis dentro de uma jogatina; não podem ser removidas ou alteradas após criadas
- Memórias são identificadas por um id único, usado por outros sistemas para referenciá-las
- Memórias nunca pertencem a um NPC ou ao jogador: pertencem sempre ao Estado do Jogo, e outras entidades apenas as referenciam

### 3.4 Sistema de Eventos

Eventos são unidades independentes de narrativa que compõem a experiência dinâmica do jogo. Cada evento representa uma situação possível dentro de um período específico da run e é definido estaticamente no banco de eventos, sendo processado em tempo de execução pela pipeline de execução.

Eventos podem ser classificados por tipo narrativo (Pacífico, Hostil, Misterioso, Neutro), mas todos são resolvidos por escolhas narrativas. Não existe sistema de batalha em tempo real no MVP.

A estrutura completa de um evento é definida em JSON na Seção 3.15.4 (Modelos de Dados).

#### 3.4.2 Classificação de Eventos

**Eventos Fixos:**

- São executados obrigatoriamente em cada período
- Não entram na pool de elegibilidade
- Não participam do sorteio ponderado
- Garantem progressão narrativa estruturada

**Eventos Normais:**

- Entram na pool de elegibilidade do período
- Passam por verificação de requisitos, incluindo o Mapa vigente no período
- Participam do sorteio ponderado por peso
- São limitados a exatamente 3 execuções por período

Quanto ao requisito de local, os eventos normais se dividem em duas subcategorias:

- **Eventos exclusivos de mapa**: possuem requisito de local com valor único (ex.: "local": "vila_inicial"), sendo elegíveis apenas quando esse Mapa está ativo no período. Reforçam a identidade narrativa de cada localização.
- **Eventos coringa**: possuem requisito de local ausente ou como lista de mapas compatíveis (ex.: "local": ["campo", "vila_inicial", "estradas"]), sendo elegíveis em qualquer um dos mapas informados. O sistema identifica um evento como coringa quando o campo `local` está ausente ou é um array com múltiplos valores. Garantem cobertura mínima da pool de eventos independentemente da escolha de mapa feita pelo jogador. Eventos coringa ignoram a regra de não repetição.

### 3.5 Pipeline de Execução de Eventos

Cada período executa o seguinte fluxo determinístico:

1. Recuperar todos os eventos candidatos do dia/período
2. Separar eventos em fixos e normais
3. Executar o evento fixo de abertura
4. Filtrar eventos normais por requisitos, tendo o Estado do Jogo como única fonte de verdade, excluindo eventos já executados anteriormente na jogatina
5. Formar a pool de eventos normais elegíveis
6. Executar sorteio ponderado por peso até selecionar exatamente 3 eventos normais
7. Se a pool elegível for menor que 3 eventos, preencher o restante com eventos coringa conforme definido na Seção 3.4.2
8. Executar os 3 eventos normais selecionados
9. Executar o evento fixo de encerramento
10. Avançar para o próximo período

Cada período produz dois conjuntos distintos: executadosFixos (2 eventos) e executadosNormais (3 eventos). Se a pool elegível de eventos normais for insuficiente para preencher os 3 eventos do período, o sistema preenche o restante com eventos coringa conforme definido na Seção 3.4.2.

O sistema de eventos é determinístico por período: não se auto-expande durante a execução, não cria novos eventos em tempo real e toda variação é resolvida antes do sorteio.

### 3.6 Sistema de Requisitos

Requisitos definem condições obrigatórias para entrada de um evento normal na pool de elegibilidade.

**Regras:**

- Todos os requisitos de um evento são avaliados com lógica AND
- Um evento só entra na pool se todos os seus requisitos forem verdadeiros
- O Estado do Jogo é a única fonte de verdade para avaliação

**Tipos de requisito:** memória, tempo (dia/período), clima e local. O requisito de local corresponde ao campo localizacao do Estado do Jogo e pode ser um valor único ou uma lista de valores compatíveis, conforme a subcategoria do evento. Exemplos:

```json
{
  "tipo": "memoria",
  "id": "ajudou_mercador",
  "presente": true
}
```

```json
{
  "tipo": "local",
  "valor": "vila"
}
```

```json
{
  "tipo": "local",
  "valor": ["campo", "vila_inicial", "estradas"]
}
```

### 3.7 Sistema de Peso

O peso define a probabilidade relativa entre eventos elegíveis dentro da pool de um período.

**Regras:**

- Peso não representa porcentagem; é uma proporção relativa dentro da pool final
- A comparação de peso é sempre relativa entre os eventos elegíveis
- O peso máximo permitido para qualquer evento do banco é 10 (Regra de Negócio RN06)
- Se todos os pesos da pool forem 0, aplica-se distribuição uniforme entre os eventos elegíveis
- Se a pool tiver poucos eventos elegíveis, o sorteio ocorre normalmente, sem compensação

Exemplo: um evento com peso 10 tem o dobro de chance de ser sorteado em relação a um evento com peso 5, dentro da mesma pool.

### 3.8 Algoritmo de Sorteio Ponderado

O sorteio ponderado seleciona eventos da pool elegível com base em seus pesos relativos. Eventos com memória gatilho correspondente às memórias do jogador recebem prioridade multiplicando seu peso por uma constante configurável (ex: PRIORIDADE_MEMORIA = 2).

**Pseudocódigo:**

```
PARA CADA evento NA pool:
    pesoCalculado = evento.peso
    SE evento POSSUI requisito de memória E jogador POSSUI essa memória:
        pesoCalculado = pesoCalculado * PRIORIDADE_MEMORIA
    FIM SE
FIM PARA

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

**Regra de prioridade para memórias gatilho:**
- Antes do sorteio, eventos que possuem um requisito de memória que o jogador já possui recebem um multiplicador de prioridade aplicado ao seu peso
- O valor do multiplicador é definido como constante no código (ex.: PRIORIDADE_MEMORIA = 2)
- Isso garante que o jogador progrida nas histórias secundárias e quests desbloqueadas por escolhas anteriores
- A prioridade é aplicada apenas ao peso de sorteio, não afeta a elegibilidade (que continua sendo controlada pelo sistema de requisitos)
- Exemplo: se o jogador tem a memória "ajudou_mercador", eventos que requerem essa memória como requisito têm peso aumentado no sorteio

**Regra de não repetição:** eventos normais não podem se repetir dentro da mesma run, exceto eventos coringa conforme definido na Seção 3.4.2. Eventos já executados são removidos de futuras elegibilidades, exceto eventos coringa.

### 3.9 Sistema de Escolhas

O Sistema de Escolhas define como o jogador influencia o mundo. Cada evento pode conter uma ou mais escolhas, e cada escolha gera efeitos diretos no Estado do Jogo.

**Fluxo de uma escolha:** escolha do jogador → geração de efeitos → aplicação no Estado do Jogo → atualização de memórias e Karma → continuação da run.

Uma escolha pode gerar os seguintes efeitos:

- Alteração de Karma (+1, 0 ou -1)
- Criação de Memória do Mundo
- Alteração de clima
- Desbloqueio de mapas

**Regras do sistema de escolhas:**

- Toda escolha altera imediatamente o Estado do Jogo
- Memórias criadas por escolhas são permanentes na run
- Escolhas podem afetar múltiplos sistemas simultaneamente
- Não existe escolha neutra em nível de sistema: toda escolha altera pelo menos um estado interno

### 3.10 Sistema de Clima

Clima é uma variável global definida no início de cada período, com os estados: ensolarado, chuvoso, nublado e neblina. O clima é sorteado aleatoriamente no início de cada período, com igual probabilidade entre os quatro estados disponíveis.

O clima altera descrições de eventos e afeta a elegibilidade de eventos para a pool de sorteio, por meio do tipo de requisito "clima" definido na Seção 3.6. Um evento pode exigir um clima específico para entrar na pool elegível do período — por exemplo, um evento de neblina nas Ruínas Antigas só é elegível se o clima vigente for "neblina".

```json
{
  "tipo": "clima",
  "valor": "neblina"
}
```

### 3.11 Visão JSON — Regra de Implementação

A Visão JSON é implementada como uma função que exibe apenas os atributos já desbloqueados para a entidade consultada.

**Regras:**

- Ao exibir qualquer entidade (NPC, objeto ou criatura), o sistema filtra os campos do objeto antes da renderização
- A função recebe o objeto completo e retorna uma versão filtrada
- A filtragem não altera o estado interno da entidade, apenas sua visualização
- O desbloqueio de atributos ocorre através de eventos específicos que adicionam campos à estrutura JSON da entidade consultada

### 3.12 Sistema de Karma

O Karma é o sistema responsável por determinar o desfecho da narrativa. Representa o alinhamento moral das escolhas do jogador, sendo atualizado de forma acumulativa ao longo da jogatina conforme os efeitos definidos em cada escolha.

Cada escolha com efeito de Karma aplica um dos seguintes valores:

- **+1**: ação altruísta ou compassiva
- **0**: ação neutra ou sem impacto moral significativo
- **-1**: ação egoísta, cruel ou prejudicial

Ao final do período da noite do Dia 3, o sistema soma o Karma acumulado durante toda a jornada e determina o desfecho conforme a tabela a seguir.

**Tabela 3 — Determinação do desfecho pelo Karma**

| Karma final | Desfecho |
|-------------|----------|
| > 0 | Final Bom |
| = 0 | Final Neutro |
| < 0 | Final Ruim |

O cálculo do Karma é determinístico e não depende de sorteio: todos os jogadores percorrem a mesma narrativa principal, mas o desfecho apresentado reflete as consequências morais das decisões tomadas durante a jornada.

### 3.13 Sistema de Classes

Classes definem a identidade inicial do protagonista. No MVP, não possuem progressão mecânica ou atributos numéricos, apenas impacto narrativo inicial. A classe escolhida pode afetar:
- Variações no diálogo inicial de despertar
- Descrições na Visão JSON

Não há troca de classe durante a run. As três classes disponíveis são:
- **Guerreiro**: Focado em força física
- **Mago**: Focado em conhecimento e magia
- **Arqueiro**: Focado em precisão e agilidade

### 3.14 Notas de Implementação MVP

Esta seção descreve decisões técnicas mínimas para a implementação do MVP. Diferentemente das seções anteriores, não define regras de design do jogo: define como essas regras devem ser traduzidas em código de forma simples e viável dentro do prazo do projeto.

#### 3.14.1 Persistência do Estado do Jogo

O Estado do Jogo deve ser persistido no navegador utilizando localStorage.

- O Estado do Jogo é salvo após aplicar os efeitos de cada escolha
- Ao iniciar o jogo, o sistema verifica se existe um Estado do Jogo salvo
- Se existir, ele é carregado e a run continua do ponto atual
- Se não existir, um novo Estado do Jogo é criado

Chave sugerida: "codequest_estado_do_jogo".

#### 3.14.2 Execução do MVP

O sistema pode ser implementado como um loop sequencial simples por período:

1. Carregar eventos do dia/período
2. Aplicar a pipeline de eventos
3. Atualizar o Estado do Jogo
4. Salvar no localStorage
5. Avançar para o próximo período

Não é necessário paralelismo, filas assíncronas complexas ou arquitetura baseada em eventos externos.

#### 3.14.3 Limitações Intencionais do MVP

O MVP não incluirá:

- Sistema de salvamento em servidor
- Banco de dados externo

O objetivo desta fase é validar exclusivamente o sistema de eventos, escolhas e progressão narrativa.

### 3.15 Modelos de Dados

Esta seção define a estrutura JSON completa das principais entidades do sistema, servindo como referência única para implementação.

#### 3.15.1 Estado do Jogo

```json
{
  "dia": 1,
  "periodo": "manha",
  "clima": "ensolarado",
  "localizacao": "campo",
  "classe": "guerreiro",
  "eventos_executados": ["D1M_DESPERTAR", "D1M_MERCADOR_CARROCA"],
  "memorias": ["ajudou_mercador"],
  "karma": 1
}
```

**Campos explicados:**
- `dia`: 1, 2 ou 3
- `periodo`: "manha", "tarde" ou "noite"
- `clima`: "ensolarado", "chuvoso", "nublado" ou "neblina"
- `localizacao`: mapa atual (ex.: "campo", "vila_inicial", "estradas", "floresta_sombria", "ruinas_antigas")
- `classe`: classe do protagonista (ex.: "guerreiro", "mago", "arqueiro")
- `eventos_executados`: lista de IDs de eventos já executados
- `memorias`: lista de Memórias do Mundo acumuladas
- `karma`: valor acumulado de Karma (pode ser negativo, zero ou positivo)

#### 3.15.2 Classe

```json
{
  "id": "guerreiro",
  "nome": "Guerreiro",
  "descricao": "Focado em força física"
}
```

**Campos explicados:**
- `id`: identificador único da classe
- `nome`: nome de exibição
- `descricao`: descrição narrativa da classe

A classe selecionada afeta o diálogo inicial e a descrição exibida pela Visão JSON para o protagonista.

#### 3.15.3 NPC

```json
{
  "id": "mercador_vila",
  "nome": "Mercador",
  "ocupacao": "Comerciante",
  "memorias_referenciadas": ["ajudou_mercador", "ignorou_mercador"],
  "inventario": ["pocao_cura", "mapa_antigo"]
}
```

**Campos explicados:**
- `id`: identificador único do NPC
- `nome`: nome de exibição
- `ocupacao`: ocupação exibida pela Visão JSON
- `memorias_referenciadas`: IDs de Memórias do Mundo relevantes para o NPC
- `inventario`: lista de IDs de itens que o NPC possui (opcional)

#### 3.15.4 Evento

```json
{
  "id": "D1M_MERCADOR_CARROCA",
  "dia": 1,
  "periodo": "manha",
  "tipo_execucao": "normal",
  "texto": "Você encontra um mercador com a carroça atolada na lama.",
  "requisitos": [
    { "tipo": "local", "valor": "estradas" }
  ],
  "peso": 5,
  "escolhas": [
    {
      "texto": "Ajudar o mercador",
      "efeitos": [
        { "tipo": "memoria", "valor": "ajudou_mercador" },
        { "tipo": "karma", "valor": 1 }
      ]
    },
    {
      "texto": "Ignorar e seguir caminho",
      "efeitos": [
        { "tipo": "memoria", "valor": "ignorou_mercador" },
        { "tipo": "karma", "valor": -1 }
      ]
    }
  ]
}
```

**Campos explicados:**
- `id`: Identificador único
- `dia`: 1, 2 ou 3
- `periodo`: "manha", "tarde" ou "noite"
- `tipo_execucao`: "fixo" ou "normal"
- `texto`: Texto narrativo do evento
- `requisitos`: Array de condições de elegibilidade
- `peso`: Peso no sorteio (1 a 10)
- `escolhas`: Array de escolhas disponíveis, cada uma com texto e efeitos

#### 3.16 Organização dos Dados

Esta seção define a estrutura de arquivos e diretórios para organização dos dados do jogo durante o desenvolvimento.

```
/assets
  /events
    eventos.json
  /npcs
    mercador_vila.json
    ferreiro.json
    viajante.json
    ...
  /maps
    campo.json
    vila_inicial.json
    estradas.json
    floresta_sombria.json
    ruinas_antigas.json
  /classes
    guerreiro.json
    mago.json
    arqueiro.json
  /data
    memorias.json
    climas.json
```

Cada arquivo JSON contém um array de objetos seguindo os modelos de dados definidos na Seção 3.15. O arquivo eventos.json contém todos os eventos (fixos e normais) em um único arquivo, simplificando o carregamento para o MVP.

---

## 4 HISTÓRIA

### 4.1 Linha do Tempo

A progressão narrativa não amarra um único mapa a cada dia: a cada período, o jogador escolhe para qual Mapa desbloqueado deseja ir (Seção 3.1.1), o que influencia os eventos disponíveis. A tabela a seguir resume o eixo narrativo principal de cada dia, o mapa inicial disponível e as condições de desbloqueio de novas localizações.

**Tabela 4 — Eixo narrativo e desbloqueio de mapas por dia**

| Dia | Eixo Narrativo | Mapas desbloqueáveis no dia |
|-----|----------------|------------------------------|
| Dia 1 | Descoberta da Visão JSON e adaptação ao novo mundo. | Campo (inicial); Vila Inicial (desbloqueada ao final do dia). |
| Dia 2 | Exploração da vila e descoberta da ameaça do Boss. | Estradas (desbloqueada por memória obtida na vila). |
| Dia 3 | Viagem e confronto final. | Floresta Sombria e Ruínas Antigas (desbloqueadas por memórias obtidas nas Estradas). Ruínas Antigas é forçada no período fixo de encerramento, independentemente de desbloqueio prévio. |

### 4.2 Dia 1 — O Despertar

O primeiro dia apresenta o protagonista, a Visão JSON e as regras básicas do universo. O evento fixo de abertura da manhã mostra o despertar do protagonista em local desconhecido e a primeira manifestação da Visão JSON, funcionando como tutorial integrado à narrativa.

Durante o restante do dia, os eventos normais introduzem os primeiros NPCs, pequenas missões e encontros hostis. As escolhas realizadas começam a registrar Memórias do Mundo (Seção 3.3), que poderão influenciar eventos futuros.

O evento fixo de encerramento da noite conduz o protagonista até a Vila Inicial, marcando o início efetivo de sua jornada. O tom predominante do dia é de descoberta e curiosidade.

### 4.3 Dia 2 — A Vila

O segundo dia expande o universo do jogo. Os eventos fixos apresentam os personagens centrais da história e revelam a existência do Boss, responsável pela instabilidade que afeta a região.

Os eventos normais permitem conhecer melhor os habitantes da vila, cumprir pequenas missões, participar de encontros hostis opcionais e desbloquear novas informações na Visão JSON. As Memórias do Mundo acumuladas no Dia 1 passam a alterar a disponibilidade de eventos, fazendo com que diferentes partidas apresentem experiências distintas dentro da mesma estrutura narrativa.

O tom evolui para investigação e preparação.

### 4.4 Dia 3 — O Confronto Final

O terceiro dia libera o acesso às Estradas, à Floresta Sombria e, progressivamente, às Ruínas Antigas, conforme os Mapas forem desbloqueados. O jogador pode transitar entre esses Mapas a cada período, até que o evento fixo de encerramento force a chegada às Ruínas Antigas para o desfecho da jornada (Seção 3.1.1.1).

Os eventos fixos aprofundam o mistério envolvendo a Visão JSON e conduzem o protagonista até as Ruínas Antigas, indicando que a origem de sua habilidade está relacionada ao local.

Os eventos normais possuem maior diversidade, incluindo emboscadas, comerciantes itinerantes e eventos condicionados às Memórias do Mundo acumuladas nos dois dias anteriores. As escolhas realizadas ao longo da run passam a gerar consequências evidentes, alterando diálogos, encontros e desfechos.

O evento fixo de encerramento da noite conduz ao confronto final contra o Boss, sempre localizado nas Ruínas Antigas. Após a resolução do confronto, o sistema calcula o desfecho com base no Karma acumulado (Seção 3.12). O tom predominante é de tensão crescente, culminando em clímax e conclusão.

### 4.5 Desfechos

Ao final do período da noite do Dia 3, após a resolução do confronto com o Boss nas Ruínas Antigas, o sistema calcula o desfecho da história com base no valor de Karma acumulado durante toda a jornada, conforme a Tabela 3 (Seção 3.12).

Todos os jogadores percorrem a mesma narrativa principal e enfrentam o Boss no mesmo local. O desfecho apresentado — Final Bom, Final Neutro ou Final Ruim — reflete exclusivamente as consequências morais das decisões tomadas durante a jornada, sem elemento de sorte no cálculo.

**Exemplos narrativos dos desfechos:**

- **Final Bom (Karma > 0)**: O protagonista derrota o Boss com honra e compaixão. A Visão JSON se expande, revelando que a habilidade era um dom para proteger o mundo. Os habitantes das regiões visitadas celebram a vitória, e NPCs ajudados retribuem com presentes e gratidão. O protagonista é reconhecido como um herói cujas escolhas inspiraram esperança.

- **Final Neutro (Karma = 0)**: O protagonista derrota o Boss, mas sem clareza moral sobre suas ações. A Visão JSON permanece estável, sem revelações adicionais. O mundo continua como estava, com algumas melhorias locais mas sem transformação significativa. O protagonista parte como um viajante que passou pelo mundo, deixando marcas superficiais.

- **Final Ruim (Karma < 0)**: O protagonista derrota o Boss, mas por meios questionáveis. A Visão JSON se enfraquece, sugerindo que o poder foi mal utilizado. Regiões visitadas mostram sinais de deterioração, e NPCs ignorados ou prejudicados expressam ressentimento. O protagonista parte como alguém que resolveu o problema mas deixou um rastro de consequências negativas.

---

## 5 BANCO DE EVENTOS

### 5.1 Convenção de IDs

Os eventos são identificados por um ID único, composto pelo dia, período e um descritor curto do conteúdo, no formato, por exemplo, D2M_FERREIRO_RECONHECIMENTO para um evento do Dia 2, período da manhã.

### 5.2 Lista Completa de Eventos

**Tabela 5 — Tabela ilustrativa de eventos**

A Tabela 5 apresenta apenas exemplos de eventos. O banco completo será implementado em arquivos JSON durante o desenvolvimento.

| ID | Locais | Dias | Períodos | Clima | Memória gatilho | Memória ganha | Peso | Tipo |
|----|--------|------|----------|-------|-----------------|---------------|------|------|
| D1M_DESPERTAR | Campo | 1 | Manhã | Todos | | | | Fixo |
| D1M_MERCADOR_CARROCA | Estradas | 1 | Manhã, Tarde | ensolarado, chuvoso | | ajudou_mercador | 5 | Pacífico |
| D1M_LOBO_ATACA | Campo, Floresta Sombria | 1,2,3 | Noite | Todos | | derrotou_lobo | 3 | Hostil |
| D1M_CAMPO_DESCOBERTA | Campo | 1 | Manhã | Todos | | descobriu_campo | 4 | Pacífico |
| D1M_VILA_CONVITE | Campo | 1 | Manhã | Todos | | vila_desbloqueada | | Fixo |
| D1T_FERREIRO_OFERTA | Vila Inicial | 1,2 | Manhã, Tarde | nublado | | | 4 | Neutro |
| D1T_MERCADOR_RETORNO | Vila Inicial | 1 | Tarde | ensolarado | ajudou_mercador | | 6 | Pacífico |
| D1N_VILA_MISTERIO | Vila Inicial | 1 | Noite | neblina | | descobriu_misterio | 5 | Misterioso |
| D2M_EMBOSCADA | Estradas | 2 | Manhã | Todos | | | 4 | Hostil |
| D2M_VIAJANTE | Estradas | 2 | Todos | ensolarado, chuvoso | | | 3 | Neutro |
| D2T_BOSS_RUMOR | Vila Inicial | 2 | Tarde | nublado | | boss_localizado | 5 | Misterioso |
| D2N_PREPARACAO | Vila Inicial | 2 | Noite | Todos | | | 4 | Pacífico |
| D3M_FLORESTA_PERIGO | Floresta Sombria | 3 | Manhã | chuvoso | | | 5 | Hostil |
| D3T_RUINAS_PISTA | Ruínas Antigas | 3 | Tarde | neblina | boss_localizado | | 6 | Misterioso |
| D3N_CONFRONTO_FINAL | Ruínas Antigas | 3 | Noite | Todos | | | | Fixo |

A run completa executa 27 eventos normais (9 períodos multiplicados por 3 eventos normais por período, conforme Seção 3.1). Para garantir que a pool elegível nunca falte eventos, mesmo quando eventos com gatilho de memória ou clima não estejam disponíveis para o jogador, o banco de eventos normais deve conter, no mínimo, o dobro do total executado em uma run: 54 eventos normais. Este mínimo não considera eventos fixos.

Essa margem é uma garantia agregada do banco, e não uma exigência fixa por período isolado. Como a elegibilidade de eventos com gatilho varia conforme o caminho de escolhas do jogador, um período específico pode apresentar mais ou menos eventos disponíveis que outro. A Tabela 6 apresenta uma distribuição de referência para orientar o design de conteúdo, sem constituir um mínimo obrigatório rígido por período. O que deve ser respeitado é o total agregado de 54 eventos normais no banco.

**Tabela 6 — Distribuição de referência de eventos por período**

| Dia | Período | Eventos normais (referência) | Eventos fixos |
|-----|---------|------------------------------|---------------|
| 1 | Manhã | 6 | 2 (abertura: despertar) |
| 1 | Tarde | 6 | 2 |
| 1 | Noite | 6 | 2 |
| 2 | Manhã | 6 | 2 |
| 2 | Tarde | 6 | 2 |
| 2 | Noite | 6 | 2 |
| 3 | Manhã | 6 | 2 |
| 3 | Tarde | 6 | 2 |
| 3 | Noite | 6 | 2 (encerramento: confronto final) |

Nota: Eventos fixos são definidos por período no banco de eventos.

Total do banco: 54 eventos normais. Essa cobertura combina eventos exclusivos de mapa, que dão identidade narrativa a cada localização, e eventos coringa, elegíveis em múltiplos Mapas (Seção 3.4.2), garantindo que a pool nunca fique insuficiente independentemente da sequência de Mapas escolhida pelo jogador ao longo da run.

### 5.3 Dependências entre Eventos

Eventos podem depender de Memórias do Mundo registradas em eventos anteriores. Essas dependências são implementadas utilizando o sistema de requisitos.

Exemplo: o evento ajuda_mercador (Dia 1, tarde) cria a memória "ajudou_mercador" caso o jogador escolha ajudar. O evento ferreiro_amigo (Dia 2, manhã) possui como requisito a presença dessa memória, só entrando na pool se ela existir.

### 5.4 Fluxo Narrativo

**Exemplo de cadeia narrativa completa:

1. **Evento D1T_MERCADOR_CARROCA (Dia 1, tarde)**: O jogador encontra um mercador com a carroça atolada.
   - Escolha 1: Ajudar o mercador → Cria memória "ajudou_mercador" e +1 Karma
   - Escolha 2: Ignorar o mercador → Cria memória "ignorou_mercador" e -1 Karma

2. **Evento D2M_FERREIRO_OFERTA (Dia 2, manhã)**: O ferreiro oferece desconto em equipamentos.
   - Requisito: memória "ajudou_mercador" presente
   - Se elegível: O jogador recebe desconto e o ferreiro menciona o mercador
   - Se não elegível: O ferreiro não oferece desconto

3. **Evento D1T_MERCADOR_RETORNO (Dia 1, tarde)**: O mercador retorna e oferece recompensa.
   - Requisito: memória "ajudou_mercador" presente
   - Se elegível: O mercador entrega um item especial
   - Se não elegível: O evento não ocorre

Neste exemplo, a escolha no Dia 1 desbloqueia eventos específicos no Dia 2, criando uma experiência narrativa diferenciada baseada nas decisões do jogador.

---

## 6 REQUISITOS

### 6.1 Requisitos Funcionais

Os requisitos funcionais abaixo descrevem comportamentos obrigatórios do sistema, derivados das regras de design definidas nas Seções 2 a 5.

**Criação e gerenciamento de personagem:**

- RF01: O sistema deve permitir ao jogador selecionar uma classe entre as três disponíveis antes de iniciar a run (Seção 3.13).
- RF02: O sistema deve aplicar os efeitos narrativos correspondentes à classe escolhida (Seção 3.13).

**Progressão temporal:**

- RF03: O sistema deve avançar automaticamente entre os períodos do dia (manhã, tarde, noite) após a execução de todos os eventos do período atual (Seção 3.1).
- RF04: O sistema deve avançar automaticamente entre os dias (1, 2 e 3) ao final do período da noite (Seção 3.1).
- RF05: O sistema deve encerrar a run automaticamente ao término do período da noite do Dia 3 (Seção 3.2.1).

**Sistema de eventos:**

- RF06: O sistema deve executar o evento fixo de abertura do período assim que ele se inicia, antes de qualquer evento normal (Seção 3.5).
- RF07: O sistema deve filtrar os eventos normais elegíveis com base nos requisitos de cada evento, consultando exclusivamente o Estado do Jogo (Seção 3.6).
- RF08: O sistema deve sortear exatamente 3 eventos normais por período, utilizando o algoritmo de sorteio ponderado por peso (Seção 3.8).
- RF09: O sistema deve impedir a repetição de qualquer evento normal já executado dentro da mesma run (Seção 3.8).
- RF10: O sistema deve completar a seleção dos três eventos normais utilizando eventos coringa quando não houver eventos normais elegíveis suficientes (Seção 3.4.2).

**Escolhas e efeitos:**

- RF11: O sistema deve apresentar ao jogador as escolhas disponíveis em cada evento normal ou fixo que possua escolhas (Seção 3.9).
- RF12: O sistema deve aplicar imediatamente os efeitos da escolha selecionada ao Estado do Jogo (Seção 3.9).
- RF13: O sistema deve impedir a remoção ou alteração de qualquer Memória do Mundo já criada na run (Seção 3.6).

**Clima:**

- RF14: O sistema deve definir e manter um estado de clima vigente por período (Seção 3.10).
- RF15: O sistema deve considerar o clima vigente como critério de elegibilidade para eventos que possuam requisito de clima (Seção 3.10).

**Persistência:**

- RF16: O sistema deve salvar o Estado do Jogo em localStorage após aplicar os efeitos de cada escolha (Seção 3.14).
- RF17: O sistema deve verificar a existência de um Estado do Jogo salvo ao iniciar o jogo e carregá-lo, caso exista (Seção 3.14).
- RF18: O sistema deve remover o Estado do Jogo salvo ao concluir uma run, evitando continuação de partidas já finalizadas (Seção 3.14).

**Desfecho:**

- RF19: O sistema deve calcular o desfecho final com base no Karma acumulado ao final da run (Seção 3.12).
- RF20: O sistema deve apresentar o desfecho correspondente (Bom, Neutro ou Ruim) conforme a Tabela 3 (Seção 3.12).

### 6.2 Requisitos Não Funcionais

**Desempenho:**

- RNF01: O sistema deve executar a pipeline completa de um período (filtragem, sorteio, execução) em tempo imperceptível ao jogador, sem atrasos visíveis na transição entre eventos.
- RNF02: O sistema deve manter taxa de quadros estável durante a movimentação do personagem na cena, compatível com os padrões do Phaser 3 em hardware desktop comum.

**Compatibilidade:**

- RNF03: O sistema deve ser executável em ambiente Desktop Windows, conforme definido em 1.6.
- RNF04: O sistema deve funcionar corretamente nos navegadores compatíveis com o ambiente de execução do Phaser 3, sem dependência de plugins externos.

**Usabilidade:**

- RNF05: A interface deve utilizar linguagem visual e textual acessível ao público-alvo definido em 1.4, sem exigir conhecimento prévio de programação.
- RNF06: O texto de eventos e diálogos deve ser legível em resolução padrão de monitor desktop, sem necessidade de zoom ou ajuste manual.

**Confiabilidade:**

- RNF07: O sistema deve lidar de forma previsível com a ausência ou corrupção do Estado do Jogo salvo em localStorage, iniciando uma nova run nesse caso, sem travar a aplicação.
- RNF08: O sistema não deve permitir que falhas em um evento individual interrompam a execução da pipeline do período como um todo.

**Manutenibilidade:**

- RNF09: O banco de eventos deve ser implementado como dado estruturado (JSON ou estrutura equivalente), permitindo adição de novos eventos sem alteração do código da engine (Seção 3.14).
- RNF10: O código do MVP deve seguir os princípios de funções puras sempre que possível, conforme definido no escopo técnico permitido (Seção 3.14).

### 6.3 Regras de Negócio

Esta seção consolida, em formato de lista numerada, as regras de negócio já definidas em detalhe ao longo do documento. Cada regra remete à seção onde foi originalmente especificada.

- RN01: Uma run dura exatamente 3 dias, cada um dividido em manhã, tarde e noite (Seção 3.1).
- RN02: Cada período contém exatamente 3 eventos normais executados, além de eventos fixos (Seção 3.4.2).
- RN03: O Estado do Jogo é a única fonte de verdade para todas as decisões do sistema (Seção 3.5).
- RN04: Memórias do Mundo são permanentes e imutáveis dentro de uma run (Seção 3.6).
- RN05: Eventos normais não podem se repetir dentro da mesma run, exceto eventos coringa (Seção 3.4.2).
- RN06: O peso permitido para qualquer evento do banco é de 1 a 10 (Seção 3.7).
- RN07: O confronto final ocorre sempre nas Ruínas Antigas, no período fixo de encerramento do Dia 3, independentemente da sequência de mapas escolhida pelo jogador ao longo da run (Seção 3.1.1.1).
- RN08: A run é finalizada automaticamente ao término da noite do Dia 3, sem condição de derrota no MVP (Seção 3.4). Eventos que envolvem confrontos não resultam em derrota do jogador; o resultado é determinado pelas escolhas narrativas.

---

## 7 FLUXO DE USO

### 7.1 Jornada do Jogador

O fluxo de uso descreve a sequência de interações do jogador desde a abertura do jogo até o encerramento de uma run, formalizando o comportamento descrito no Loop Principal (Seção 3.1) sob a perspectiva da experiência do usuário.

1. **Tela de menu**: o jogador abre o jogo e visualiza a tela inicial, com a opção de iniciar uma nova run.
2. **Criação de personagem**: o jogador escolhe a classe do protagonista (RF01).
3. **Evento de despertar**: a run inicia com o evento fixo do Dia 1, manhã (Seção 4.2), apresentado em formato de diálogo. Este evento não envolve movimentação do personagem, apenas progressão de texto.
4. **Liberação de movimentação**: ao final dos diálogos do evento de despertar, o personagem inicia movimentação automática no eixo X para a direita. O movimento não é controlado por clique ou teclado: o personagem se move automaticamente até colidir com a hitbox do próximo evento disponível no período.
5. **Encontro com gatilho de evento**: o personagem se move automaticamente no eixo X para a direita até colidir com a hitbox de um ponto de interação (NPC, objeto ou marcador de localização) correspondente a um dos eventos selecionados pelo sorteio do período (Seção 3.5).
6. **Execução do evento**: a colisão dispara o evento, exibindo seu texto e, quando aplicável, suas escolhas (RF12).
7. **Escolha e consequência**: o jogador seleciona uma escolha, e o sistema aplica os efeitos correspondentes ao Estado do Jogo (RF13).
8. **Retomada da movimentação**: após a resolução do evento, o personagem retoma movimentação automática no eixo X para a direita até colidir com a próxima hitbox de evento disponível no período atual.
9. **Repetição dentro do período**: os passos 5 a 8 se repetem até que os 3 eventos normais selecionados para o período tenham sido executados.
10. **Transição de período**: ao final dos eventos do período, o sistema avança automaticamente para o próximo período (manhã para tarde, tarde para noite, noite para manhã do dia seguinte), podendo exibir uma transição visual e atualizar o clima vigente (RF04, RF15).
11. **Repetição entre dias**: os passos 5 a 10 se repetem ao longo dos três dias da run.
12. **Resolução final**: na noite do Dia 3, após o confronto final nas Ruínas Antigas, o sistema calcula o desfecho com base no Karma acumulado (RF19, RF20) e apresenta a narrativa de encerramento.
13. **Tela de desfecho**: o jogador visualiza o resultado final da run, com a opção de retornar ao menu e iniciar uma nova run.

### 7.2 Telas Principais

Lista das telas necessárias para suportar o fluxo descrito em 7.1, com especificação de componentes e funcionalidades.

**Tela de Menu:**
- Botão "Iniciar Jogo" - inicia fluxo de criação de personagem
- Botão "Sobre" - exibe modal com informações do jogo
- Botão de tela cheia

**Tela de Criação de Personagem:**
- Três botões de seleção de classe (Guerreiro, Mago, Arqueiro)
- Botão "Voltar" - retorna ao menu
- Botão "Confirmar" - inicia a run com a classe selecionada

**Cena de Jogo:**
- Ambiente side-scrolling com 5 camadas de parallax
- HUD superior esquerdo: tempo do dia (manhã/tarde/noite) com ícone
- HUD superior direito: clima (ensolarado/chuvoso/nublado/neblina) com ícone
- Painel de status lateral: Karma
- Botão para abrir/fechar painel JSON
- Painel de diálogo inferior: nome do falante, texto com efeito de digitação, container de escolhas
- Personagem: move-se automaticamente no eixo X para a direita até colidir com hitboxes de evento
- Hitboxes de evento: NPCs, objetos e marcadores de localização

**Painel JSON (Visão JSON):**
- Abas: Herói, Mundo, NPCs
- Exibição colorida de dados JSON (chaves em rosa, strings em amarelo, números em roxo, booleanos em verde)
- Modo read-only: valores são apenas para visualização, não editáveis
- Mensagens especiais quando abas NPCs estão vazias (nenhum descoberto ainda)

**Tela de Transição de Período/Dia:**
- Indicador visual de passagem de tempo (manhã → tarde → noite → manhã do dia seguinte)
- Atualização do HUD com novo período e clima (se aplicável)
- Animação de fade ou transição suave (opcional)
- Duração: 2-3 segundos

**Tela de Desfecho:**
- Exibição da classe e Karma do herói
- Narrativa do desfecho baseada no Karma acumulado
- Botão "Menu Principal" - retorna ao menu
- Botão "Reiniciar" - inicia nova run com novo personagem

---

## 8 CONCLUSÃO

Este documento define as regras de design e implementação do MVP de Code Quest, servindo como referência para o desenvolvimento do projeto.
