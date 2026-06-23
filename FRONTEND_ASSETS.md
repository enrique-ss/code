# Guia de Assets do Front-End (Sprites, Imagens e Interface)

Este documento descreve a estrutura de diretórios de assets do front-end, as especificações técnicas recomendadas para imagens e sprites, e como integrá-los ao jogo no **Code Quest**.

---

## 📂 Estrutura de Diretórios

Todos os arquivos visuais e de mídia do jogo devem ser organizados dentro da pasta raiz [assets](file:///C:/Users/LUIZHENRIQUESILVEIRA/Documents/GitHub/code/assets) seguindo a estrutura abaixo:

```text
assets/
├── backgrounds/     # Cenários de fundo do jogo (1280x720px)
├── sprites/         # Sprites de personagens e objetos interativos (128x128px ou 256x256px)
└── ui/              # Componentes de interface (caixas de diálogo, painéis, botões)
```

---

## 📐 Especificações Técnicas de Mídia

Para garantir a consistência estética do jogo (estilo **Pixel Art de 16-bit**), utilize os seguintes parâmetros:

| Categoria | Caminho Sugerido | Resolução Recomendada | Formato | Notas |
| :--- | :--- | :--- | :---: | :--- |
| **Cenários / Fundo** | `assets/backgrounds/` | **1280 x 720 px** (16:9) | `.png` | Fundo completo opaco. Evite degradês complexos não condizentes com pixel art. |
| **Sprites / Personagens** | `assets/sprites/` | **128 x 128 px** ou **256 x 256 px** | `.gif` | Formato **GIF Animado** com fundo transparente. Traz movimento e ambientação dinâmica para os personagens do jogo. |
| **Interface (UI)** | `assets/ui/` | Variável (conforme elemento) | `.png` | Elementos de interface, botões ou painéis. Podem usar técnica de 9-slice se necessário. |

> [!IMPORTANT]
> **Nomenclatura**: Sempre utilize letras minúsculas e separação por underline (`snake_case`). Exemplo: `forest_path.png`, `mago_eldrin.gif`.

---

## 🛠️ Como Adicionar um Novo Asset ao Jogo

Adicionar um arquivo de imagem na pasta `assets/` não é suficiente; é necessário registrá-lo no arquivo de configuração do jogo para que o Phaser possa carregá-lo.

### Passo 1: Copiar o arquivo
Coloque o arquivo `.png` no diretório correto correspondente dentro de `assets/`.

### Passo 2: Registrar no arquivo `config.js`
Abra o arquivo [js/config.js](file:///C:/Users/LUIZHENRIQUESILVEIRA/Documents/GitHub/code/js/config.js) e adicione o caminho do novo asset na constante `ASSETS`.

```javascript
// Exemplo no arquivo js/config.js:
const ASSETS = {
    backgrounds: {
        menu: 'assets/backgrounds/menu.png',
        forest_path: 'assets/backgrounds/forest_path.png',
        // Adicione seu novo cenário aqui:
        novo_cenario: 'assets/backgrounds/novo_cenario.png'
    },
    sprites: {
        arthur: 'assets/sprites/arthur.png',
        mage: 'assets/sprites/mage.png',
        // Adicione seu novo sprite aqui:
        novo_personagem: 'assets/sprites/novo_personagem.png'
    },
    ui: {
        json_panel: 'assets/ui/json_panel.png',
        dialog_box: 'assets/ui/dialog_box.png'
    }
};
```

### Passo 3: Pré-carregamento automático (Preload)
A cena [preload-scene.js](file:///C:/Users/LUIZHENRIQUESILVEIRA/Documents/GitHub/code/js/scenes/preload-scene.js) lê automaticamente todos os caminhos definidos no objeto `ASSETS` e os carrega na memória.
* Os **Backgrounds** ganham o prefixo `bg_` (Ex: `bg_menu`, `bg_novo_cenario`)
* Os **Sprites** ganham o prefixo `sprite_` (Ex: `sprite_arthur`, `sprite_novo_personagem`)
* Os **Stickers/UI** ganham o prefixo `sticker_` ou similar dependendo da chave.

### Passo 4: Exibir o asset no jogo
Uma vez carregado, você pode usá-lo dentro de qualquer cena do Phaser referenciando a chave correspondente:

```javascript
// Dentro de uma cena do Phaser (ex: game-scene.js)
// Para adicionar um background:
this.add.image(width / 2, height / 2, 'bg_novo_cenario');

// Para adicionar um sprite de personagem:
this.add.sprite(x, y, 'sprite_novo_personagem');
```

---

## 🎨 Dicas para Manter a Estética Pixel Art
1. **Sem Antialiasing**: Exporte as imagens sem suavização de bordas para manter o aspecto "quadradinho" da pixel art.
2. **Paleta de Cores Coesa**: Mantenha tons vibrantes no estilo retro. O projeto atualmente usa tons inspirados no tema Dracula (Cores como `#8be9fd`, `#50fa7b`, `#bd93f9`, `#ff5555`).
3. **Escalonamento Perfeito (Nearest Neighbor)**: O motor do Phaser está configurado para renderizar sem suavização de textura, mantendo os pixels nítidos mesmo ao redimensionar.
