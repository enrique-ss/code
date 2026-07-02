/**
 * Gerenciador de Escolhas e Efeitos
 * Conforme Seção 3.9 (Sistema de Escolhas) do GDD
 */

class ChoiceManager {
  constructor(gameState, saveManager) {
    this.gameState = gameState;
    this.saveManager = saveManager;
  }

  /**
   * Aplica os efeitos de uma escolha ao Estado do Jogo
   * @param {Object} escolha - Escolha selecionada pelo jogador
   */
  aplicarEfeitos(escolha) {
    if (!escolha || !escolha.efeitos) {
      return;
    }

    for (const efeito of escolha.efeitos) {
      this.aplicarEfeito(efeito);
    }

    // Salvar estado após aplicar efeitos (RF16)
    const estado = this.gameState.getEstado();
    this.saveManager.salvar(estado);
  }

  /**
   * Aplica um efeito específico ao Estado do Jogo
   * @param {Object} efeito - Efeito a ser aplicado
   */
  aplicarEfeito(efeito) {
    switch (efeito.tipo) {
      case 'memoria':
        this.aplicarEfeitoMemoria(efeito);
        break;
      case 'karma':
        this.aplicarEfeitoKarma(efeito);
        break;
      case 'clima':
        this.aplicarEfeitoClima(efeito);
        break;
      case 'desbloqueio_mapa':
        this.aplicarEfeitoDesbloqueioMapa(efeito);
        break;
      default:
        console.warn('Tipo de efeito desconhecido:', efeito.tipo);
    }
  }

  /**
   * Aplica efeito de criação de memória
   * @param {Object} efeito - Efeito de memória
   */
  aplicarEfeitoMemoria(efeito) {
    if (efeito.acao === 'criar' && efeito.id) {
      this.gameState.adicionarMemoria(efeito.id);
    }
    // RF13: Proteção contra remoção/alteração de memórias
    // Não implementamos remoção ou alteração de memórias
  }

  /**
   * Aplica efeito de karma
   * @param {Object} efeito - Efeito de karma
   */
  aplicarEfeitoKarma(efeito) {
    if (efeito.valor !== undefined) {
      this.gameState.adicionarKarma(efeito.valor);
    }
  }

  /**
   * Aplica efeito de clima
   * @param {Object} efeito - Efeito de clima
   */
  aplicarEfeitoClima(efeito) {
    if (efeito.valor) {
      this.gameState.setClima(efeito.valor);
    }
  }

  /**
   * Aplica efeito de desbloqueio de mapa
   * @param {Object} efeito - Efeito de desbloqueio
   */
  aplicarEfeitoDesbloqueioMapa(efeito) {
    if (efeito.memoria) {
      // O desbloqueio de mapa é feito através de memória
      this.gameState.adicionarMemoria(efeito.memoria);
    }
  }

  /**
   * Apresenta as escolhas de um evento
   * @param {Array} escolhas - Lista de escolhas
   * @returns {Promise} Promise resolvida quando uma escolha é feita
   */
  async apresentarEscolhas(escolhas) {
    // TODO: Implementar apresentação visual de escolhas
    // Por enquanto, retorna a primeira escolha
    return new Promise((resolve) => {
      if (escolhas && escolhas.length > 0) {
        resolve(escolhas[0]);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Processa uma escolha completa (apresentação + aplicação de efeitos)
   * @param {Array} escolhas - Lista de escolhas
   * @returns {Promise}
   */
  async processarEscolha(escolhas) {
    const escolha = await this.apresentarEscolhas(escolhas);
    if (escolha) {
      this.aplicarEfeitos(escolha);
    }
    return escolha;
  }
}

// Exportar para uso global
window.ChoiceManager = ChoiceManager;
