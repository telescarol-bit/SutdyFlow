import { GoalFormData, GoalStats, GoalStatus, StudyGoal } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

// Exemplos iniciais amigáveis para estudantes iniciantes
export const EXAMPLE_GOALS: StudyGoal[] = [
  {
    id: 'meta-1',
    title: 'Compreender os Fundamentos de Funções Matemáticas',
    description: 'Assistir a 2 videoaulas introdutórias e resolver os 5 primeiros exercícios de fixação da apostila.',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'meta-2',
    title: 'Leitura do Capítulo 1 de História Contemporânea',
    description: 'Fazer fichamento com as principais datas, causas e consequências da Revolução Industrial.',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'meta-3',
    title: 'Criar Mapa Mental de Biologia Celular',
    description: 'Diferenciar organelas celulares de células eucariontes e procariontes em uma folha A4 colorida.',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'concluido',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

class StorageService {
  /**
   * Carrega os objetivos salvos no localStorage.
   * Se for a primeira visita do usuário (chave vazia), inicializa com exemplos acolhedores.
   */
  loadGoals(): StudyGoal[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === null) {
        // Primeira visita: semeia os exemplos acolhedores para não assustar o iniciante
        this.saveGoals(EXAMPLE_GOALS);
        return EXAMPLE_GOALS;
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao ler dados do localStorage:', error);
      return [];
    }
  }

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao persistir dados no localStorage:', error);
    }
  }

  /**
   * Cadastra um novo objetivo de estudo.
   */
  addGoal(goalData: GoalFormData): StudyGoal {
    const goals = this.loadGoals();
    const now = new Date().toISOString();
    const newGoal: StudyGoal = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      title: goalData.title.trim(),
      description: goalData.description.trim(),
      dueDate: goalData.dueDate,
      status: goalData.status || 'nao_iniciado',
      createdAt: now,
      updatedAt: now,
    };

    const updatedGoals = [newGoal, ...goals];
    this.saveGoals(updatedGoals);
    return newGoal;
  }

  /**
   * Atualiza um objetivo existente pelo ID.
   */
  updateGoal(id: string, updates: Partial<GoalFormData>): StudyGoal | null {
    const goals = this.loadGoals();
    const index = goals.findIndex((g) => g.id === id);
    if (index === -1) return null;

    const existing = goals[index];
    const updated: StudyGoal = {
      ...existing,
      ...(updates.title !== undefined && { title: updates.title.trim() }),
      ...(updates.description !== undefined && { description: updates.description.trim() }),
      ...(updates.dueDate !== undefined && { dueDate: updates.dueDate }),
      ...(updates.status !== undefined && { status: updates.status }),
      updatedAt: new Date().toISOString(),
    };

    goals[index] = updated;
    this.saveGoals(goals);
    return updated;
  }

  /**
   * Atualiza unicamente o status de um objetivo (atalho rápido no card).
   */
  updateStatus(id: string, newStatus: GoalStatus): StudyGoal | null {
    return this.updateGoal(id, { status: newStatus });
  }

  /**
   * Remove um objetivo pelo ID após confirmação.
   */
  deleteGoal(id: string): boolean {
    const goals = this.loadGoals();
    const filtered = goals.filter((g) => g.id !== id);
    if (filtered.length === goals.length) {
      return false;
    }
    this.saveGoals(filtered);
    return true;
  }

  /**
   * Busca um objetivo específico pelo ID.
   */
  getGoalById(id: string): StudyGoal | null {
    const goals = this.loadGoals();
    return goals.find((g) => g.id === id) || null;
  }

  /**
   * Calcula as estatísticas e quantidades de objetivos.
   */
  calculateStats(goals: StudyGoal[]): GoalStats {
    const total = goals.length;
    let naoIniciados = 0;
    let emAndamento = 0;
    let concluidos = 0;

    for (const g of goals) {
      if (g.status === 'concluido') {
        concluidos++;
      } else if (g.status === 'em_andamento') {
        emAndamento++;
      } else {
        naoIniciados++;
      }
    }

    const completionRate = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    return {
      total,
      naoIniciados,
      emAndamento,
      concluidos,
      completionRate,
    };
  }

  /**
   * Restaura exemplos de estudo para teste rápido.
   */
  resetExamples(): StudyGoal[] {
    this.saveGoals(EXAMPLE_GOALS);
    return EXAMPLE_GOALS;
  }

  /**
   * Limpa todos os objetivos.
   */
  clearAll(): void {
    this.saveGoals([]);
  }
}

export const storageService = new StorageService();
