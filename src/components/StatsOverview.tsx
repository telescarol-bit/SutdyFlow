import React from 'react';
import { CheckCircle2, Clock, ListTodo, PlayCircle } from 'lucide-react';
import { GoalStats } from '../types/goal';

interface StatsOverviewProps {
  stats: GoalStats;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            Visão Geral dos Estudos
          </h2>
          <p className="text-sm text-slate-500">
            Acompanhe a sua evolução diária e mantenha o ritmo de aprendizado
          </p>
        </div>

        {/* Taxa de Conclusão */}
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 self-start sm:self-auto">
          <div className="text-right">
            <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Taxa de Conclusão
            </span>
            <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
              {stats.completionRate}%
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center font-bold text-sm">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Barra de Progresso Visual */}
      <div className="pt-4 pb-5">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
          <span>Progresso geral ({stats.concluidos} de {stats.total} metas concluídas)</span>
          <span className="font-mono tabular-nums font-semibold text-slate-700">{stats.completionRate}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Cards de Contagem Quantitativa */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">
              Total de Objetivos
            </span>
            <span className="text-xl font-bold text-slate-900 font-mono tabular-nums">
              {stats.total}
            </span>
          </div>
        </div>

        {/* Em Andamento */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">
              Em Andamento
            </span>
            <span className="text-xl font-bold text-sky-700 font-mono tabular-nums">
              {stats.emAndamento}
            </span>
          </div>
        </div>

        {/* Não Iniciados */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">
              Não Iniciados
            </span>
            <span className="text-xl font-bold text-amber-700 font-mono tabular-nums">
              {stats.naoIniciados}
            </span>
          </div>
        </div>

        {/* Concluídos */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-500">
              Concluídos
            </span>
            <span className="text-xl font-bold text-emerald-700 font-mono tabular-nums">
              {stats.concluidos}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
