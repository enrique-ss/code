/**
 * Gerenciador de Desfecho
 * Conforme Seção 3.12 (Sistema de Karma e Desfecho) do GDD
 */

class EndingManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.narrativas = {
      bom: 'Sua jornada foi marcada por escolhas nobres e altruístas. O mundo retribuiu sua bondade com prosperidade e paz. As pessoas se lembram de você como um herói que trouxe esperança para tempos difíceis.',
      neutro: 'Sua jornada foi equilibrada, com escolhas que refletiram a complexidade do mundo. Nem tudo foi perfeito, mas você encontrou seu caminho. O mundo segue seu curso, e sua história é lembrada como uma de muitas possibilidades.',
      ruim: 'Sua jornada foi marcada por escolhas egoístas e cruéis. O mundo sofreu com suas ações, e as consequências de seus atos ecoam por gerações. Sua história serve como aviso para aqueles que vêm depois.'
    };
  }

  /**
   * Determina o desfecho final baseado no Karma acumulado
   * @returns {string} 'bom', 'neutro' ou 'ruim'
   */
  determinarDesfecho() {
    const estado = this.gameState.getEstado();
    const karma = estado.karma;

    if (karma > 0) {
      return 'bom';
    } else if (karma < 0) {
      return 'ruim';
    } else {
      return 'neutro';
    }
  }

  /**
   * Retorna a narrativa do desfecho
   * @param {string} desfecho - Tipo de desfecho ('bom', 'neutro', 'ruim')
   * @returns {string} Narrativa do desfecho
   */
  getNarrativaDesfecho(desfecho) {
    return this.narrativas[desfecho] || this.narrativas.neutro;
  }

  /**
   * Retorna o desfecho e narrativa completos
   * @returns {Object} { tipo: string, narrativa: string, karma: number }
   */
  getDesfechoCompleto() {
    const desfecho = this.determinarDesfecho();
    const narrativa = this.getNarrativaDesfecho(desfecho);
    const estado = this.gameState.getEstado();

    return {
      tipo: desfecho,
      narrativa: narrativa,
      karma: estado.karma,
      classe: estado.classe
    };
  }

  /**
   * Apresenta o desfecho ao jogador
   * @returns {Promise}
   */
  async apresentarDesfecho() {
    const desfecho = this.getDesfechoCompleto();
    
    // TODO: Implementar apresentação visual do desfecho
    // Por enquanto, retorna o objeto do desfecho
    return new Promise((resolve) => {
      resolve(desfecho);
    });
  }

  /**
   * Define narrativas personalizadas
   * @param {Object} narrativas - Objeto com narrativas para cada desfecho
   */
  setNarrativas(narrativas) {
    this.narrativas = { ...this.narrativas, ...narrativas };
  }
}

// Exportar para uso global
window.EndingManager = EndingManager;
