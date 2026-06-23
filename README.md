# Code Quest

Um visual novel interativo desenvolvido com Phaser 3, onde você é um programador transportado para um mundo de fantasia medieval. Use suas habilidades de programação para manipular o JSON do mundo e encontrar seu caminho de volta para casa!

## 🚀 Como Jogar

### Opção 1: Abrir Diretamente (Mais Simples)

1. Clone ou baixe o repositório
2. Abra o arquivo `index.html` no seu navegador
3. Pronto! O jogo funciona sem precisar instalar nada

### Opção 2: GitHub Pages

Hospede o jogo gratuitamente no GitHub Pages:

1. Faça push do repositório para o GitHub
2. Vá em Settings > Pages
3. Em "Source", selecione "Deploy from a branch"
4. Escolha a branch `main` e a pasta `/ (root)`
5. Clique em "Save"
6. Aguarde alguns minutos e o jogo estará disponível em `https://seu-usuario.github.io/code`

## 📱 Compatibilidade

- ✅ **Desktop**: Chrome, Firefox, Edge, Safari
- ✅ **Mobile**: iOS Safari, Chrome Mobile
- ✅ **Tablet**: Qualquer navegador moderno

## 🎮 Características

- **Motor de Jogo**: Phaser 3 via CDN (sem instalação)
- **Visual Novel**: Sistema de diálogos com efeito de digitação
- **Sistema de Escolhas**: Escolhas que afetam a história
- **Editor JSON**: Painel lateral para visualizar e editar dados do jogo
- **Sistema de Classes**: Guerreiro, Mago e Ladino
- **Responsivo**: Funciona em PC e mobile

## 📁 Estrutura do Projeto

```
code/
├── assets/                 # Imagens e assets do jogo
├── css/
│   └── style.css          # Estilos CSS
├── js/
│   ├── config.js         # Configurações e constantes
│   ├── game-engine.js    # Motor do jogo
│   ├── history.js        # História e nós de diálogo
│   ├── ui-manager.js     # Gerenciador do editor JSON
│   ├── main.js           # Entry point do Phaser 3
│   └── scenes/
│       ├── preload-scene.js       # Carregamento de assets
│       ├── menu-scene.js          # Menu principal
│       ├── character-creation-scene.js  # Criação de personagem
│       ├── game-scene.js          # Cena principal do jogo
│       └── final-scene.js         # Tela final
└── index.html            # HTML principal
```

## 🎯 Como Jogar

1. **Menu Principal**: Clique em "Iniciar Jogo"
2. **Criação de Personagem**: 
   - Digite o nome do seu personagem
   - Escolha uma classe (Guerreiro, Mago ou Ladino)
   - Clique em "Confirmar"
3. **Jogo**:
   - Clique na caixa de diálogo para avançar
   - Faça escolhas que afetam a história
   - Use o editor JSON para visualizar dados do jogo
4. **Editor JSON**: Clique no botão "JSON" no canto superior esquerdo

## 🔧 Desenvolvimento

### Adicionar Novas Cenas

1. Crie um novo arquivo em `js/scenes/`
2. Crie a classe da cena:
```javascript
class MinhaCena extends Phaser.Scene {
    constructor() {
        super('MinhaCena');
    }
    
    create() {
        // Sua lógica aqui
    }
}
```

3. Adicione a cena ao array de cenas em `js/main.js`

### Adicionar Novos Assets

1. Coloque as imagens na pasta `assets/`
2. Adicione o asset ao objeto `ASSETS` em `js/config.js`
3. O asset será carregado automaticamente no `PreloadScene`

### Adicionar Novos Nós de História

Edite `js/history.js` e adicione novos nós ao objeto `StoryNodes`:

```javascript
const StoryNodes = {
    meu_novo_no: {
        bg: "planicie_inicial",
        dialogs: [
            { speaker: "Narrador", text: "Seu texto aqui" }
        ],
        choices: [
            { text: "Opção 1", target: "outro_no" }
        ]
    }
};
```

## 🎨 Customização

### Cores e Estilos

Edite `SPRITE_STYLES` em `js/config.js` para customizar cores dos personagens.

### Fontes

O projeto usa Google Fonts (Fredoka, Outfit). Para alterar, edite o HTML e as configurações de texto nas cenas.

## 📊 Sistema de Dados

O jogo usa um sistema de JSON dinâmico que pode ser editado em tempo real:

- **heroi**: Atributos do jogador (vida, mana, força, etc.)
- **inventario**: Itens, ouro e equipamentos
- **mundo**: Clima, hora, localização
- **monstros**: Dados de monstros
- **npcs**: Dados de NPCs

## 🐛 Troubleshooting

### Assets não carregam

Verifique se os arquivos de imagem existem na pasta `assets/` e se os caminhos em `config.js` estão corretos.

### Editor JSON não funciona

O editor JSON usa DOM overlay sobre o canvas Phaser. Verifique se `ui-manager.js` está carregado corretamente.

## 📝 Licença

Este projeto é para fins educacionais.
