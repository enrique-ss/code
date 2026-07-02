/**
 * Gerenciador de Mapas
 * Conforme Seção 3.1.1 (Sistema de Navegação de Mapas) do GDD
 */

class MapManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.mapas = {
      campo: {
        id: 'campo',
        nome: 'Campo',
        desbloqueado_por_defecto: true,
        memoria_desbloqueio: null
      },
      vila_inicial: {
        id: 'vila_inicial',
        nome: 'Vila Inicial',
        desbloqueado_por_defecto: false,
        memoria_desbloqueio: 'vila_desbloqueada'
      },
      estradas: {
        id: 'estradas',
        nome: 'Estradas',
        desbloqueado_por_defecto: false,
        memoria_desbloqueio: 'vila_desbloqueada'
      },
      floresta_sombria: {
        id: 'floresta_sombria',
        nome: 'Floresta Sombria',
        desbloqueado_por_defecto: false,
        memoria_desbloqueio: 'boss_localizado'
      },
      ruinas_antigas: {
        id: 'ruinas_antigas',
        nome: 'Ruínas Antigas',
        desbloqueado_por_defecto: false,
        memoria_desbloqueio: 'boss_localizado'
      }
    };
  }

  /**
   * Retorna todos os mapas disponíveis
   * @returns {Array} Lista de mapas
   */
  getTodosMapas() {
    return Object.values(this.mapas);
  }

  /**
   * Retorna apenas os mapas desbloqueados
   * @returns {Array} Lista de mapas desbloqueados
   */
  getMapasDesbloqueados() {
    const estado = this.gameState.getEstado();
    const desbloqueados = [];

    for (const mapa of Object.values(this.mapas)) {
      if (this.isMapaDesbloqueado(mapa, estado)) {
        desbloqueados.push(mapa);
      }
    }

    return desbloqueados;
  }

  /**
   * Verifica se um mapa está desbloqueado
   * @param {Object} mapa - Mapa a verificar
   * @param {Object} estado - Estado do jogo
   * @returns {boolean}
   */
  isMapaDesbloqueado(mapa, estado) {
    // Se é desbloqueado por padrão
    if (mapa.desbloqueado_por_defecto) {
      return true;
    }

    // Se requer memória específica
    if (mapa.memoria_desbloqueio) {
      return estado.memorias.includes(mapa.memoria_desbloqueio);
    }

    return false;
  }

  /**
   * Define o mapa atual
   * @param {string} mapaId - ID do mapa
   * @returns {boolean} Sucesso da operação
   */
  setMapaAtual(mapaId) {
    const estado = this.gameState.getEstado();
    const mapa = this.mapas[mapaId];

    if (!mapa) {
      return false;
    }

    // Verificar se está desbloqueado
    if (!this.isMapaDesbloqueado(mapa, estado)) {
      return false;
    }

    this.gameState.setLocalizacao(mapaId);
    return true;
  }

  /**
   * Retorna o mapa atual
   * @returns {Object|null} Mapa atual ou null
   */
  getMapaAtual() {
    const estado = this.gameState.getEstado();
    return this.mapas[estado.localizacao] || null;
  }

  /**
   * Apresenta a escolha de mapa para o período
   * @returns {Promise} Promise resolvida com o mapa escolhido
   */
  async apresentarEscolhaMapa() {
    const mapasDesbloqueados = this.getMapasDesbloqueados();

    // TODO: Implementar apresentação visual de escolha de mapa
    // Por enquanto, retorna o primeiro mapa desbloqueado
    return new Promise((resolve) => {
      if (mapasDesbloqueados.length > 0) {
        resolve(mapasDesbloqueados[0]);
      } else {
        resolve(null);
      }
    });
  }

  /**
   * Processa a escolha de mapa para o período
   * Considera a exceção do confronto final (D3N)
   * @returns {Promise}
   */
  async processarEscolhaMapa() {
    const estado = this.gameState.getEstado();

    // Exceção do confronto final: forçar Ruínas Antigas em D3N
    if (estado.dia === 3 && estado.periodo === 'noite') {
      this.gameState.setLocalizacao('ruinas_antigas');
      return this.mapas.ruinas_antigas;
    }

    // Escolha normal de mapa
    const mapa = await this.apresentarEscolhaMapa();
    if (mapa) {
      this.setMapaAtual(mapa.id);
    }

    return mapa;
  }

  /**
   * Verifica se é o período do confronto final
   * @returns {boolean}
   */
  isPeriodoConfrontoFinal() {
    const estado = this.gameState.getEstado();
    return estado.dia === 3 && estado.periodo === 'noite';
  }

  /**
   * Retorna um mapa específico por ID
   * @param {string} mapaId - ID do mapa
   * @returns {Object|null} Mapa ou null
   */
  getMapa(mapaId) {
    return this.mapas[mapaId] || null;
  }
}

// Exportar para uso global
window.MapManager = MapManager;
