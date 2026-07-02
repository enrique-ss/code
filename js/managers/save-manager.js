/**
 * Gerenciador de Persistência
 * Conforme Seção 3.14.1 do GDD
 */

class SaveManager {
  constructor() {
    this.CHAVE_LOCALSTORAGE = 'codequest_estado_do_jogo';
  }

  /**
   * Salva o estado do jogo em localStorage
   * @param {Object} estado - Estado do jogo a ser salvo
   */
  salvar(estado) {
    try {
      const estadoJSON = JSON.stringify(estado);
      localStorage.setItem(this.CHAVE_LOCALSTORAGE, estadoJSON);
      return true;
    } catch (erro) {
      console.error('Erro ao salvar estado:', erro);
      return false;
    }
  }

  /**
   * Carrega o estado do jogo do localStorage
   * @returns {Object|null} Estado do jogo ou null se não existir
   */
  carregar() {
    try {
      const estadoJSON = localStorage.getItem(this.CHAVE_LOCALSTORAGE);
      if (!estadoJSON) {
        return null;
      }

      const estado = JSON.parse(estadoJSON);

      // Verifica se o estado é válido
      if (!this.validarEstado(estado)) {
        console.error('Estado salvo é inválido');
        this.remover();
        return null;
      }

      return estado;
    } catch (erro) {
      console.error('Erro ao carregar estado:', erro);
      return null;
    }
  }

  /**
   * Remove o estado salvo do localStorage
   * Usado ao concluir a run (RF18)
   */
  remover() {
    try {
      localStorage.removeItem(this.CHAVE_LOCALSTORAGE);
      return true;
    } catch (erro) {
      console.error('Erro ao remover estado:', erro);
      return false;
    }
  }

  /**
   * Verifica se existe um estado salvo
   * @returns {boolean}
   */
  existeSave() {
    return localStorage.getItem(this.CHAVE_LOCALSTORAGE) !== null;
  }

  /**
   * Valida se o estado tem a estrutura esperada
   * @param {Object} estado - Estado a ser validado
   * @returns {boolean}
   */
  validarEstado(estado) {
    if (!estado || typeof estado !== 'object') {
      return false;
    }

    const camposObrigatorios = ['dia', 'periodo', 'clima', 'localizacao', 'classe', 'eventos_executados', 'memorias', 'karma'];

    for (const campo of camposObrigatorios) {
      if (!(campo in estado)) {
        return false;
      }
    }

    // Validações específicas
    if (typeof estado.dia !== 'number' || estado.dia < 1 || estado.dia > 3) {
      return false;
    }

    if (!['manha', 'tarde', 'noite'].includes(estado.periodo)) {
      return false;
    }

    if (typeof estado.karma !== 'number') {
      return false;
    }

    if (!Array.isArray(estado.eventos_executados)) {
      return false;
    }

    if (!Array.isArray(estado.memorias)) {
      return false;
    }

    return true;
  }

  /**
   * Verifica se o estado está corrompido ou inválido
   * @returns {boolean}
   */
  estadoCorrompido() {
    const estado = this.carregar();
    return estado === null;
  }
}

// Exportar para uso global
window.SaveManager = SaveManager;
