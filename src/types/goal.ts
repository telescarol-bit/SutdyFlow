export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  dueDate: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = Omit<StudyGoal, 'id' | 'createdAt' | 'updatedAt'>;

export type GoalFilter = 'todos' | GoalStatus;

export interface GoalStats {
  total: number;
  naoIniciados: number;
  emAndamento: number;
  concluidos: number;
  completionRate: number; // 0 a 100
}

export const STATUS_CONFIG: Record<GoalStatus, {
  label: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  indicatorBg: string;
}> = {
  nao_iniciado: {
    label: 'Não iniciado',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-800',
    badgeBorder: 'border-amber-200',
    indicatorBg: 'bg-amber-500',
  },
  em_andamento: {
    label: 'Em andamento',
    badgeBg: 'bg-sky-50',
    badgeText: 'text-sky-800',
    badgeBorder: 'border-sky-200',
    indicatorBg: 'bg-sky-500',
  },
  concluido: {
    label: 'Concluído',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-800',
    badgeBorder: 'border-emerald-200',
    indicatorBg: 'bg-emerald-500',
  },
};
