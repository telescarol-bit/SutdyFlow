import React from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { GoalFilter, GoalStats } from '../types/goal';

export type SortOption = 'prazo_asc' | 'prazo_desc' | 'recente' | 'titulo';

interface GoalFiltersProps {
  currentFilter: GoalFilter;
  onFilterChange: (filter: GoalFilter) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  stats: GoalStats;
}

export const GoalFilters: React.FC<GoalFiltersProps> = ({
  currentFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortOption,
  onSortChange,
  stats,
}) => {
  const filterTabs: Array<{ id: GoalFilter; label: string; count: number }> = [
    { id: 'todos', label: 'Todos', count: stats.total },
    { id: 'em_andamento', label: 'Em andamento', count: stats.emAndamento },
    { id: 'nao_iniciado', label: 'Não iniciados', count: stats.naoIniciados },
    { id: 'concluido', label: 'Concluídos', count: stats.concluidos },
  ];

  return (
    <div className="space-y-4 mb-6">
      {/* Linha de Busca e Ordenação */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 bg-white border border-slate-200/90 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors shadow-2xs"
          />
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Ordenar:</span>
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer shadow-2xs"
          >
            <option value="prazo_asc">Prazo mais próximo</option>
            <option value="prazo_desc">Prazo mais distante</option>
            <option value="recente">Mais recentes primeiro</option>
            <option value="titulo">Título (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas Segmentadas de Filtro de Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = currentFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100/80 border border-slate-200/80'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] font-mono tabular-nums px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
