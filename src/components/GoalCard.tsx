import React from 'react';
import { Calendar, CheckCircle2, Clock, Edit2, PlayCircle, Trash2 } from 'lucide-react';
import { GoalStatus, STATUS_CONFIG, StudyGoal } from '../types/goal';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onDeleteRequest: (goal: StudyGoal) => void;
  onStatusChange: (goalId: string, newStatus: GoalStatus) => void;
}

// Formatação amigável de data e cálculo de urgência
function formatDueDate(dateString: string): { formatted: string; relativeText: string; isUrgent: boolean; isOverdue: boolean } {
  if (!dateString) {
    return { formatted: 'Sem prazo definido', relativeText: '', isUrgent: false, isOverdue: false };
  }

  try {
    const [year, month, day] = dateString.split('-').map(Number);
    const dueDate = new Date(year, month - 1, day);
    
    // Hoje zerado em horas para comparação justa
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const formatted = dueDate.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    let relativeText = '';
    let isUrgent = false;
    let isOverdue = false;

    if (diffDays < 0) {
      relativeText = `Venceu há ${Math.abs(diffDays)} dia${Math.abs(diffDays) > 1 ? 's' : ''}`;
      isOverdue = true;
    } else if (diffDays === 0) {
      relativeText = 'Vence hoje';
      isUrgent = true;
    } else if (diffDays === 1) {
      relativeText = 'Vence amanhã';
      isUrgent = true;
    } else if (diffDays <= 3) {
      relativeText = `Em ${diffDays} dias`;
      isUrgent = true;
    } else {
      relativeText = `Em ${diffDays} dias`;
    }

    return { formatted, relativeText, isUrgent, isOverdue };
  } catch {
    return { formatted: dateString, relativeText: '', isUrgent: false, isOverdue: false };
  }
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onDeleteRequest,
  onStatusChange,
}) => {
  const currentConfig = STATUS_CONFIG[goal.status];
  const { formatted, relativeText, isUrgent, isOverdue } = formatDueDate(goal.dueDate);
  const isCompleted = goal.status === 'concluido';

  return (
    <div
      className={`group relative bg-white rounded-2xl border transition-all duration-200 p-5 flex flex-col justify-between hover:shadow-md ${
        isCompleted
          ? 'border-emerald-200/70 bg-emerald-50/20'
          : isOverdue
          ? 'border-rose-200/80'
          : 'border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Cabeçalho do Card: Status & Ações */}
        <div className="flex items-start justify-between gap-3 mb-3">
          {/* Seletor rápido de Status */}
          <div className="relative inline-block">
            <select
              value={goal.status}
              aria-label="Alterar status do objetivo"
              onChange={(e) => onStatusChange(goal.id, e.target.value as GoalStatus)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors ${currentConfig.badgeBg} ${currentConfig.badgeText} ${currentConfig.badgeBorder}`}
            >
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          {/* Botões de Ação: Editar e Excluir */}
          <div className="flex items-center gap-1 opacity-90 sm:opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(goal)}
              title="Editar este objetivo"
              aria-label={`Editar objetivo ${goal.title}`}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeleteRequest(goal)}
              title="Excluir este objetivo"
              aria-label={`Excluir objetivo ${goal.title}`}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Título do Objetivo */}
        <h3
          className={`text-base font-semibold tracking-tight mb-2 leading-snug ${
            isCompleted
              ? 'text-slate-500 line-through decoration-emerald-500/60'
              : 'text-slate-900'
          }`}
        >
          {goal.title}
        </h3>

        {/* Descrição do Objetivo */}
        {goal.description ? (
          <p className="text-sm text-slate-600 leading-relaxed mb-4 whitespace-pre-line line-clamp-3">
            {goal.description}
          </p>
        ) : (
          <p className="text-xs italic text-slate-400 mb-4">
            Sem descrição adicional
          </p>
        )}
      </div>

      {/* Rodapé do Card: Prazo e Indicador Visual */}
      <div className="pt-3 border-t border-slate-100/90 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="font-medium">{formatted}</span>
        </div>

        {/* Tag de Urgência / Prazo */}
        {relativeText && !isCompleted && (
          <span
            className={`font-medium text-[11px] px-2 py-0.5 rounded-md ${
              isOverdue
                ? 'bg-rose-50 text-rose-700 font-semibold'
                : isUrgent
                ? 'bg-amber-50 text-amber-800 font-semibold'
                : 'text-slate-500'
            }`}
          >
            {relativeText}
          </span>
        )}

        {isCompleted && (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
            <CheckCircle2 className="w-3 h-3" />
            Meta atingida
          </span>
        )}
      </div>
    </div>
  );
};
