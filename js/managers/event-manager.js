/**
 * Gerenciador de Eventos
 * Conforme Seção 3.5 (Pipeline de Execução) do GDD
 */

class EventManager {
  constructor(gameState, saveManager) {
    this.gameState = gameState;
    this.saveManager = saveManager;
    this.PRIORIDADE_MEMORIA = 2;
  }

  /**
   * Recupera todos os eventos candidatos do dia/período
   * @param {number} dia - Dia atual
   * @param {string} periodo - Período atual (manha, tarde, noite)
   * @returns {Array} Lista de eventos candidatos
   */
  recuperarEventosCandidatos(dia, periodo) {
    // TODO: Carregar do arquivo events.json
    // Por enquanto, retorna array vazio
    return [];
  }

  /**
   * Separa eventos em fixos e normais
   * @param {Array} eventos - Lista de eventos
   * @returns {Object} { fixos: [], normais: [] }
   */
  separarEventos(eventos) {
    const fixos = [];
    const normais = [];

    for (const evento of eventos) {
      if (evento.tipo === 'Fixo') {
        fixos.push(evento);
      } else {
        normais.push(evento);
      }
    }

    return { fixos, normais };
  }

  /**
   * Filtra eventos normais por requisitos
   * @param {Array} eventosNormais - Lista de eventos normais
   * @returns {Array} Lista de eventos elegíveis
   */
  filtrarPorRequisitos(eventosNormais) {
    const estado = this.gameState.getEstado();
    const elegiveis = [];

    for (const evento of eventosNormais) {
      // Excluir eventos já executados (exceto coringa)
      if (this.gameState.eventoFoiExecutado(evento.id) && !this.isEventoCoringa(evento)) {
        continue;
      }

      // Verificar todos os requisitos com lógica AND
      if (this.atendeTodosRequisitos(evento, estado)) {
        elegiveis.push(evento);
      }
    }

    return elegiveis;
  }

  /**
   * Verifica se um evento atende todos os requisitos
   * @param {Object} evento - Evento a ser verificado
   * @param {Object} estado - Estado do jogo
   * @returns {boolean}
   */
  atendeTodosRequisitos(evento, estado) {
    // Verificar requisito de memória
    if (evento.memoria_gatilho && !estado.memorias.includes(evento.memoria_gatilho)) {
      return false;
    }

    // Verificar requisito de tempo (dia)
    if (evento.dias && !evento.dias.includes(estado.dia)) {
      return false;
    }

    // Verificar requisito de tempo (período)
    if (evento.periodos && !evento.periodos.includes(estado.periodo)) {
      return false;
    }

    // Verificar requisito de clima
    if (evento.clima && evento.clima !== 'Todos' && evento.clima !== estado.clima) {
      return false;
    }

    // Verificar requisito de local
    if (evento.locais && evento.locais.length > 0) {
      // Se é array múltiplo (coringa), verifica se local está na lista
      if (Array.isArray(evento.locais) && evento.locais.length > 1) {
        if (!evento.locais.includes(estado.localizacao)) {
          return false;
        }
      }
      // Se é valor único (exclusivo de mapa), verifica se é igual
      else if (!Array.isArray(evento.locais) || evento.locais.length === 1) {
        const local = Array.isArray(evento.locais) ? evento.locais[0] : evento.locais;
        if (local !== estado.localizacao) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Verifica se um evento é coringa
   * @param {Object} evento - Evento a ser verificado
   * @returns {boolean}
   */
  isEventoCoringa(evento) {
    // Evento é coringa se não tem requisito de local ou tem array múltiplo
    if (!evento.locais || evento.locais.length === 0) {
      return true;
    }
    if (Array.isArray(evento.locais) && evento.locais.length > 1) {
      return true;
    }
    return false;
  }

  /**
   * Executa sorteio ponderado por peso
   * @param {Array} pool - Pool de eventos elegíveis
   * @param {number} quantidade - Quantidade de eventos a selecionar
   * @returns {Array} Lista de eventos selecionados
   */
  sortearPonderado(pool, quantidade) {
    const selecionados = [];
    const poolDisponivel = [...pool];

    for (let i = 0; i < quantidade && poolDisponivel.length > 0; i++) {
      const evento = this.sortearEvento(poolDisponivel);
      if (evento) {
        selecionados.push(evento);
        // Remover da pool disponível para não repetir
        const index = poolDisponivel.indexOf(evento);
        if (index > -1) {
          poolDisponivel.splice(index, 1);
        }
      }
    }

    return selecionados;
  }

  /**
   * Sorteia um evento da pool com base em pesos
   * @param {Array} pool - Pool de eventos
   * @returns {Object|null} Evento selecionado ou null
   */
  sortearEvento(pool) {
    if (pool.length === 0) {
      return null;
    }

    const estado = this.gameState.getEstado();
    const pesosCalculados = [];

    // Calcular pesos com prioridade de memória
    for (const evento of pool) {
      let peso = evento.peso || 0;

      // Aplicar prioridade se tiver memória gatilho e jogador tiver a memória
      if (this.temMemoriaGatilho(evento, estado)) {
        peso = peso * this.PRIORIDADE_MEMORIA;
      }

      pesosCalculados.push(peso);
    }

    // Se todos pesos são 0, distribuição uniforme
    const totalPeso = pesosCalculados.reduce((sum, p) => sum + p, 0);
    if (totalPeso === 0) {
      const index = Math.floor(Math.random() * pool.length);
      return pool[index];
    }

    // Sorteio ponderado
    const valorSorteado = Math.random() * totalPeso;
    let acumulado = 0;

    for (let i = 0; i < pool.length; i++) {
      acumulado += pesosCalculados[i];
      if (valorSorteado <= acumulado) {
        return pool[i];
      }
    }

    return pool[pool.length - 1];
  }

  /**
   * Verifica se o evento tem memória gatilho que o jogador possui
   * @param {Object} evento - Evento a ser verificado
   * @param {Object} estado - Estado do jogo
   * @returns {boolean}
   */
  temMemoriaGatilho(evento, estado) {
    if (!evento.memoria_gatilho) {
      return false;
    }
    return estado.memorias.includes(evento.memoria_gatilho);
  }

  /**
   * Preenche com eventos coringa se pool < 3 eventos
   * @param {Array} selecionados - Eventos já selecionados
   * @param {Array} pool - Pool completa de eventos
   * @param {number} quantidade - Quantidade desejada
   * @returns {Array} Lista completa com eventos coringa
   */
  preencherComCoringa(selecionados, pool, quantidade) {
    if (selecionados.length >= quantidade) {
      return selecionados;
    }

    const coringas = pool.filter(e => this.isEventoCoringa(e));
    const restante = quantidade - selecionados.length;

    for (let i = 0; i < restante && coringas.length > 0; i++) {
      const index = Math.floor(Math.random() * coringas.length);
      selecionados.push(coringas[index]);
      coringas.splice(index, 1);
    }

    return selecionados;
  }

  /**
   * Executa a pipeline completa de eventos do período
   * @returns {Promise}
   */
  async executarPipelinePeriodo() {
    const estado = this.gameState.getEstado();
    
    // 1. Recuperar eventos candidatos
    const candidatos = this.recuperarEventosCandidatos(estado.dia, estado.periodo);
    
    // 2. Separar fixos e normais
    const { fixos, normais } = this.separarEventos(candidatos);
    
    // 3. Executar evento fixo de abertura
    const eventoAbertura = fixos.find(e => e.id.includes('ABERTURA') || e.id.includes('DESPERTAR'));
    if (eventoAbertura) {
      await this.executarEvento(eventoAbertura);
    }
    
    // 4. Filtrar eventos normais por requisitos
    const elegiveis = this.filtrarPorRequisitos(normais);
    
    // 5. Formar pool de eventos elegíveis
    const pool = elegiveis;
    
    // 6. Sortear 3 eventos normais
    let selecionados = this.sortearPonderado(pool, 3);
    
    // 7. Preencher com coringa se necessário
    selecionados = this.preencherComCoringa(selecionados, normais, 3);
    
    // 8. Executar os 3 eventos normais
    for (const evento of selecionados) {
      await this.executarEvento(evento);
    }
    
    // 9. Executar evento fixo de encerramento
    const eventoEncerramento = fixos.find(e => e.id.includes('ENCERRAMENTO') || e.id.includes('CONFRONTO'));
    if (eventoEncerramento) {
      await this.executarEvento(eventoEncerramento);
    }
    
    // 10. Avançar para o próximo período
    this.gameState.avancarPeriodo();
    
    // Salvar estado após aplicar efeitos (RF16)
    this.saveManager.salvar(estado);
  }

  /**
   * Executa um evento específico
   * @param {Object} evento - Evento a ser executado
   * @returns {Promise}
   */
  async executarEvento(evento) {
    // TODO: Implementar execução de evento
    // Registrar como executado
    this.gameState.registrarEventoExecutado(evento.id);
    
    // Salvar estado após aplicar efeitos (RF16)
    const estado = this.gameState.getEstado();
    this.saveManager.salvar(estado);
  }
}

// Exportar para uso global
window.EventManager = EventManager;
