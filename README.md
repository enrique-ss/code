# Code Quest

Um jogo de aventura 2D narrativo com sistema de eventos dinâmicos, desenvolvido com JavaScript e Phaser 3. O jogador é transportado para um mundo de fantasia medieval e deve navegar por uma história ramificada com escolhas morais que afetam o desfecho.

## 🚀 Setup do Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (geralmente instalado com Node.js)

### Instalação

1. Clone ou baixe o repositório
2. Navegue até a pasta do projeto:
   ```bash
   cd code
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```

### Executar o Projeto

#### Desenvolvimento (com auto-reload)
```bash
npm run dev
```

#### Produção
```bash
npm start
```

O jogo estará disponível em `http://localhost:8080`

## 📱 Compatibilidade

- ✅ **Desktop**: Chrome, Firefox, Edge, Safari (Windows)
- ✅ **Mobile**: iOS Safari, Chrome Mobile (limitado no MVP)

## 🎮 Características

- **Motor de Jogo**: Phaser 3.60.0
- **Sistema de Eventos**: Sorteio ponderado com requisitos de memória, clima e localização
- **Sistema de Escolhas**: Escolhas que afetam Karma e desbloqueiam eventos futuros
- **Visão JSON**: Painel lateral para visualizar dados do jogo com desbloqueio progressivo
- **Sistema de Classes**: Guerreiro, Mago e Arqueiro
- **Persistência**: Estado salvo em localStorage
- **Movimentação Automática**: Personagem move-se automaticamente no eixo X

## 📁 Estrutura do Projeto

```
code/
├── assets/
│   ├── events/           # Arquivos JSON de eventos
│   ├── npcs/             # Arquivos JSON de NPCs
│   ├── maps/             # Arquivos JSON de mapas
│   ├── classes/          # Arquivos JSON de classes
│   └── data/             # Dados gerais (climas, memórias)
├── css/
│   └── style.css         # Estilos CSS
├── js/
│   ├── config.js         # Configurações e constantes
│   ├── game-engine.js    # Motor do jogo
│   ├── history.js        # História e nós de diálogo
│   ├── ui-manager.js     # Gerenciador do editor JSON
│   ├── main.js           # Entry point do Phaser 3
│   ├── managers/         # Gerenciadores de sistemas
│   └── scenes/           # Cenas do jogo
├── index.html            # HTML principal
├── package.json          # Dependências do projeto
├── GDD.md                # Documento de Design de Jogo
└── KANBAN.md             # Kanban de desenvolvimento
```

## 🎯 Como Jogar

1. **Menu Principal**: Clique em "Iniciar Jogo"
2. **Criação de Personagem**: 
   - Escolha uma classe (Guerreiro, Mago ou Arqueiro)
   - Clique em "Confirmar"
3. **Jogo**:
   - O personagem move-se automaticamente até colidir com eventos
   - Faça escolhas que afetam a história e o Karma
   - Use o painel JSON para visualizar dados do jogo
4. **Desfecho**: O final depende do Karma acumulado durante a run

## 🔧 Desenvolvimento

### Adicionar Novos Eventos

Edite `assets/events/events.json` e adicione novos eventos seguindo a estrutura definida no GDD.

### Adicionar Novos NPCs

Crie arquivos JSON em `assets/npcs/` seguindo o modelo de estrutura definido.

### Adicionar Novos Mapas

Crie arquivos JSON em `assets/maps/` com os dados do mapa (backgrounds, parallax, etc).

## 📊 Sistema de Dados

O jogo usa arquivos JSON para todos os dados:

- **events.json**: Banco de eventos do jogo
- **npcs/*.json**: Dados dos NPCs
- **maps/*.json**: Dados dos mapas

## 🐛 Troubleshooting

### Assets não carregam

Verifique se os arquivos existem nas pastas corretas em `assets/` e se os caminhos estão corretos.

### Erro ao executar npm start

Certifique-se de que instalou as dependências com `npm install`.

## 📝 Documentação

- **GDD.md**: Documento de Design de Jogo completo
- **KANBAN.md**: Kanban de desenvolvimento com tarefas pendentes

## 📝 Licença

Este projeto é para fins educacionais.
