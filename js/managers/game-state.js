/**
 * Gerenciador do Estado do Jogo
 * Conforme Seção 3.2 do GDD
 */

class GameState {
  constructor() {
    this.estado = this.criarEstadoInicial();
  }

  /**
   * Cria o estado inicial do jogo
   */
  criarEstadoInicial() {
    return {
      dia: 1,
      periodo: 'manha',
      clima: null,
      localizacao: 'campo',
      classe: null,
      eventos_executados: [],
      memorias: [],
      karma: 0
    };
  }

  /**
   * Reinicia o estado do jogo
   */
  reiniciar() {
    this.estado = this.criarEstadoInicial();
  }

  /**
   * Avança para o próximo período
   */
  avancarPeriodo() {
    const periodos = ['manha', 'tarde', 'noite'];
    const indiceAtual = periodos.indexOf(this.estado.periodo);

    if (indiceAtual < periodos.length - 1) {
      this.estado.periodo = periodos[indiceAtual + 1];
    } else {
      // Avança para o próximo dia
      this.estado.dia += 1;
      this.estado.periodo = 'manha';
    }
  }

  /**
   * Define o clima atual
   */
  setClima(clima) {
    this.estado.clima = clima;
  }

  /**
   * Define a localização atual
   */
  setLocalizacao(localizacao) {
    this.estado.localizacao = localizacao;
  }

  /**
   * Define a classe do personagem
   */
  setClasse(classe) {
    this.estado.classe = classe;
  }

  /**
   * Adiciona uma memória ao estado
   */
  adicionarMemoria(memoriaId) {
    if (!this.estado.memorias.includes(memoriaId)) {
      this.estado.memorias.push(memoriaId);
    }
  }

  /**
   * Verifica se uma memória existe
   */
  temMemoria(memoriaId) {
    return this.estado.memorias.includes(memoriaId);
  }

  /**
   * Adiciona karma
   */
  adicionarKarma(valor) {
    this.estado.karma += valor;
  }

  /**
   * Registra um evento como executado
   */
  registrarEventoExecutado(eventoId) {
    if (!this.estado.eventos_executados.includes(eventoId)) {
      this.estado.eventos_executados.push(eventoId);
    }
  }

  /**
   * Verifica se um evento já foi executado
   */
  eventoFoiExecutado(eventoId) {
    return this.estado.eventos_executados.includes(eventoId);
  }

  /**
   * Retorna o estado atual
   */
  getEstado() {
    return { ...this.estado };
  }

  /**
   * Define o estado (usado para carregar save)
   */
  setEstado(estado) {
    this.estado = estado;
  }

  /**
   * Verifica se a run foi concluída
   */
  isRunConcluida() {
    return this.estado.dia > 3 || (this.estado.dia === 3 && this.estado.periodo === 'noite');
  }
}

// Exportar para uso global
window.GameState = GameState;
