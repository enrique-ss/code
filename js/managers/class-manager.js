/**
 * Gerenciador de Classes
 * Conforme Seção 3.1.2 (Sistema de Classes) do GDD
 */

class ClassManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.classes = {
      guerreiro: {
        id: 'guerreiro',
        nome: 'Guerreiro',
        descricao: 'Focado em força física',
        impacto_narrativo: {
          dialogo_inicial: 'Você desperta com seus músculos tensos, pronto para lutar.',
          visao_json: 'Um guerreiro com força sobre-humana.'
        }
      },
      mago: {
        id: 'mago',
        nome: 'Mago',
        descricao: 'Focado em conhecimento e magia',
        impacto_narrativo: {
          dialogo_inicial: 'Você desperta com sua mente brilhando de conhecimento arcano.',
          visao_json: 'Um mago com poderes místicos latentes.'
        }
      },
      arqueiro: {
        id: 'arqueiro',
        nome: 'Arqueiro',
        descricao: 'Focado em precisão e agilidade',
        impacto_narrativo: {
          dialogo_inicial: 'Você desperta com seus reflexos afiados como uma flecha.',
          visao_json: 'Um arqueiro com precisão mortal.'
        }
      }
    };
  }

  /**
   * Retorna todas as classes disponíveis
   * @returns {Array} Lista de classes
   */
  getClassesDisponiveis() {
    return Object.values(this.classes);
  }

  /**
   * Retorna uma classe específica por ID
   * @param {string} classeId - ID da classe
   * @returns {Object|null} Classe ou null se não existir
   */
  getClasse(classeId) {
    return this.classes[classeId] || null;
  }

  /**
   * Define a classe do personagem
   * @param {string} classeId - ID da classe selecionada
   */
  setClassePersonagem(classeId) {
    const classe = this.getClasse(classeId);
    if (classe) {
      this.gameState.setClasse(classeId);
      return true;
    }
    return false;
  }

  /**
   * Retorna o diálogo inicial baseado na classe
   * @returns {string} Diálogo inicial
   */
  getDialogoInicial() {
    const estado = this.gameState.getEstado();
    const classe = this.getClasse(estado.classe);
    
    if (classe && classe.impacto_narrativo && classe.impacto_narrativo.dialogo_inicial) {
      return classe.impacto_narrativo.dialogo_inicial;
    }
    
    return 'Você desperta em um mundo desconhecido.';
  }

  /**
   * Retorna a descrição da Visão JSON baseada na classe
   * @returns {string} Descrição para Visão JSON
   */
  getDescricaoVisaoJSON() {
    const estado = this.gameState.getEstado();
    const classe = this.getClasse(estado.classe);
    
    if (classe && classe.impacto_narrativo && classe.impacto_narrativo.visao_json) {
      return classe.impacto_narrativo.visao_json;
    }
    
    return 'Um viajante misterioso.';
  }

  /**
   * Aplica efeitos narrativos da classe
   * Isso afeta diálogos e descrições ao longo do jogo
   */
  aplicarEfeitosNarrativos() {
    // Os efeitos narrativos são aplicados dinamicamente
    // através dos métodos getDialogoInicial e getDescricaoVisaoJSON
    // Não há estado persistente além da classe selecionada
  }

  /**
   * Retorna a classe atual do personagem
   * @returns {Object|null} Classe atual ou null
   */
  getClasseAtual() {
    const estado = this.gameState.getEstado();
    return this.getClasse(estado.classe);
  }
}

// Exportar para uso global
window.ClassManager = ClassManager;
