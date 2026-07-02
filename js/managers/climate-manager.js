/**
 * Gerenciador de Clima
 * Conforme Seção 3.10 (Sistema de Clima) do GDD
 */

class ClimateManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.climas = ['ensolarado', 'chuvoso', 'nublado', 'neblina'];
  }

  /**
   * Sorteia um clima aleatório com igual probabilidade
   * @returns {string} Clima sorteado
   */
  sortearClima() {
    const index = Math.floor(Math.random() * this.climas.length);
    return this.climas[index];
  }

  /**
   * Define o clima para o período atual
   * Chamado no início de cada período
   */
  definirClimaPeriodo() {
    const novoClima = this.sortearClima();
    this.gameState.setClima(novoClima);
    return novoClima;
  }

  /**
   * Atualiza o clima em transições de período
   * Chamado quando avança para o próximo período
   */
  atualizarClimaTransicao() {
    return this.definirClimaPeriodo();
  }

  /**
   * Retorna o clima atual
   * @returns {string} Clima atual
   */
  getClimaAtual() {
    const estado = this.gameState.getEstado();
    return estado.clima;
  }

  /**
   * Verifica se o clima atual é um clima específico
   * @param {string} clima - Clima a verificar
   * @returns {boolean}
   */
  isClimaAtual(clima) {
    return this.getClimaAtual() === clima;
  }

  /**
   * Retorna todos os climas disponíveis
   * @returns {Array} Lista de climas
   */
  getClimasDisponiveis() {
    return [...this.climas];
  }
}

// Exportar para uso global
window.ClimateManager = ClimateManager;
