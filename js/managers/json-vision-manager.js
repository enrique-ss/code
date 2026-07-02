/**
 * Gerenciador de Visão JSON
 * Conforme Seção 3.11 (Visão JSON) do GDD
 */

class JsonVisionManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.aberto = false;
    this.abaAtual = 'heroi';
    this.atributosDesbloqueados = {
      heroi: ['classe', 'karma'],
      mundo: ['dia', 'periodo', 'clima', 'localizacao'],
      npcs: []
    };
    this.cores = {
      chave: '#ff79c6', // rosa
      string: '#f1fa8c', // amarelo
      numero: '#bd93f9', // roxo
      booleano: '#50fa7b', // verde
      nulo: '#8be9fd' // ciano
    };
  }

  /**
   * Filtra atributos baseado no desbloqueio
   * @param {Object} objeto - Objeto a ser filtrado
   * @param {string} tipo - Tipo do objeto ('heroi', 'mundo', 'npcs')
   * @returns {Object} Objeto filtrado
   */
  filtrarAtributos(objeto, tipo) {
    const desbloqueados = this.atributosDesbloqueados[tipo] || [];
    const filtrado = {};

    for (const chave of desbloqueados) {
      if (chave in objeto) {
        filtrado[chave] = objeto[chave];
      }
    }

    return filtrado;
  }

  /**
   * Desbloqueia um atributo específico
   * @param {string} tipo - Tipo do objeto ('heroi', 'mundo', 'npcs')
   * @param {string} atributo - Nome do atributo
   */
  desbloquearAtributo(tipo, atributo) {
    if (!this.atributosDesbloqueados[tipo]) {
      this.atributosDesbloqueados[tipo] = [];
    }

    if (!this.atributosDesbloqueados[tipo].includes(atributo)) {
      this.atributosDesbloqueados[tipo].push(atributo);
    }
  }

  /**
   * Formata JSON com cores
   * @param {Object} objeto - Objeto a ser formatado
   * @returns {string} HTML com cores
   */
  formatarJsonComCores(objeto) {
    const json = JSON.stringify(objeto, null, 2);
    return this.colorirJson(json);
  }

  /**
   * Aplica cores ao JSON
   * @param {string} json - String JSON
   * @returns {string} HTML colorido
   */
  colorirJson(json) {
    let html = json;
    
    // Chaves (entre aspas seguidas de :)
    html = html.replace(/"([^"]+)":/g, `<span style="color: ${this.cores.chave}">"$1"</span>:`);
    
    // Strings (entre aspas que não são chaves)
    html = html.replace(/: "([^"]*)"/g, `: <span style="color: ${this.cores.string}">"$1"</span>`);
    
    // Números
    html = html.replace(/: (\d+)/g, `: <span style="color: ${this.cores.numero}">$1</span>`);
    
    // Booleanos
    html = html.replace(/: (true|false)/g, `: <span style="color: ${this.cores.booleano}">$1</span>`);
    
    // Null
    html = html.replace(/: null/g, `: <span style="color: ${this.cores.nulo}">null</span>`);
    
    return html;
  }

  /**
   * Retorna os dados da aba atual
   * @returns {Object} Dados da aba
   */
  getDadosAbaAtual() {
    const estado = this.gameState.getEstado();

    switch (this.abaAtual) {
      case 'heroi':
        return this.filtrarAtributos({
          classe: estado.classe,
          karma: estado.karma
        }, 'heroi');
      
      case 'mundo':
        return this.filtrarAtributos({
          dia: estado.dia,
          periodo: estado.periodo,
          clima: estado.clima,
          localizacao: estado.localizacao,
          memorias: estado.memorias
        }, 'mundo');
      
      case 'npcs':
        // TODO: Carregar NPCs do banco
        return this.filtrarAtributos({}, 'npcs');
      
      default:
        return {};
    }
  }

  /**
   * Retorna mensagem para aba vazia
   * @returns {string} Mensagem
   */
  getMensagemAbaVazia() {
    switch (this.abaAtual) {
      case 'heroi':
        return 'Nenhum atributo do herói desbloqueado ainda.';
      case 'mundo':
        return 'Nenhum atributo do mundo desbloqueado ainda.';
      case 'npcs':
        return 'Nenhum NPC desbloqueado ainda.';
      default:
        return 'Aba vazia.';
    }
  }

  /**
   * Alterna a visibilidade do painel JSON
   */
  togglePainel() {
    this.aberto = !this.aberto;
    return this.aberto;
  }

  /**
   * Define a aba atual
   * @param {string} aba - Nome da aba ('heroi', 'mundo', 'npcs')
   */
  setAba(aba) {
    if (['heroi', 'mundo', 'npcs'].includes(aba)) {
      this.abaAtual = aba;
    }
  }

  /**
   * Retorna a aba atual
   * @returns {string} Nome da aba atual
   */
  getAbaAtual() {
    return this.abaAtual;
  }

  /**
   * Verifica se o painel está aberto
   * @returns {boolean}
   */
  isAberto() {
    return this.aberto;
  }

  /**
   * Retorna o HTML do painel JSON
   * @returns {string} HTML do painel
   */
  getHtmlPainel() {
    const dados = this.getDadosAbaAtual();
    const htmlDados = this.formatarJsonComCores(dados);
    
    if (Object.keys(dados).length === 0) {
      return `<div class="json-vazio">${this.getMensagemAbaVazia()}</div>`;
    }
    
    return `<pre class="json-content">${htmlDados}</pre>`;
  }

  /**
   * Reseta os atributos desbloqueados (para novo jogo)
   */
  resetar() {
    this.atributosDesbloqueados = {
      heroi: ['classe', 'karma'],
      mundo: ['dia', 'periodo', 'clima', 'localizacao'],
      npcs: []
    };
    this.abaAtual = 'heroi';
    this.aberto = false;
  }
}

// Exportar para uso global
window.JsonVisionManager = JsonVisionManager;
