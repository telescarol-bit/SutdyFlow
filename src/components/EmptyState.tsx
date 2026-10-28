import React from 'react';
import { BookOpen, Plus, RotateCcw, Search } from 'lucide-react';

interface EmptyStateProps {
  isFiltered: boolean;
  onClearFilters?: () => void;
  onOpenCreate: () => void;
  onLoadExamples?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  isFiltered,
  onClearFilters,
  onOpenCreate,
  onLoadExamples,
}) => {
  if (isFiltered) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-xl mx-auto my-6">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center mb-4">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-5 max-w-sm mx-auto leading-relaxed">
          Não encontramos nenhum objetivo correspondente aos filtros ou termo de busca aplicado.
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar filtros e busca</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-dashed border-indigo-200/80 p-8 sm:p-12 text-center max-w-xl mx-auto my-6 shadow-xs">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-4 ring-8 ring-indigo-50/50">
        <BookOpen className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2">
        Nenhum objetivo cadastrado ainda
      </h3>
      <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
        Não se preocupe! Definir metas pequenas e possíveis de cumprir é o segredo para construir uma rotina de estudos consistente.
      </p>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenCreate}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar meu primeiro objetivo</span>
        </button>

        {onLoadExamples && (
          <button
            onClick={onLoadExamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Carregar exemplos sugeridos</span>
          </button>
        )}
      </div>
    </div>
  );
};
