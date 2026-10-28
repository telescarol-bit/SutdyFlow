import React, { useEffect, useMemo, useState } from 'react';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { GoalCard } from './components/GoalCard';
import { GoalFilters, SortOption } from './components/GoalFilters';
import { GoalModal } from './components/GoalModal';
import { Header } from './components/Header';
import { StatsOverview } from './components/StatsOverview';
import { storageService } from './services/storageService';
import { GoalFilter, GoalFormData, GoalStatus, StudyGoal } from './types/goal';

export default function App() {
  // Estado principal dos objetivos
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Estados de controle de interface
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<StudyGoal | null>(null);

  // Filtros, busca e ordenação
  const [currentFilter, setCurrentFilter] = useState<GoalFilter>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('prazo_asc');

  // Carrega os objetivos persistidos no localStorage ao inicializar
  useEffect(() => {
    const loaded = storageService.loadGoals();
    setGoals(loaded);
    setIsLoaded(true);
  }, []);

  // Estatísticas calculadas dinamicamente
  const stats = useMemo(() => {
    return storageService.calculateStats(goals);
  }, [goals]);

  // Lista filtrada e ordenada para exibição
  const filteredGoals = useMemo(() => {
    let result = [...goals];

    // Filtro por status
    if (currentFilter !== 'todos') {
      result = result.filter((g) => g.status === currentFilter);
    }

    // Filtro por busca textual
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(query) ||
          g.description.toLowerCase().includes(query)
      );
    }

    // Ordenação
    result.sort((a, b) => {
      if (sortOption === 'prazo_asc') {
        return (a.dueDate || '').localeCompare(b.dueDate || '');
      }
      if (sortOption === 'prazo_desc') {
        return (b.dueDate || '').localeCompare(a.dueDate || '');
      }
      if (sortOption === 'titulo') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      // Padrão: mais recente primeiro
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return result;
  }, [goals, currentFilter, searchQuery, sortOption]);

  // Handlers para operações de dados
  const handleCreateGoal = (data: GoalFormData) => {
    const created = storageService.addGoal(data);
    setGoals((prev) => [created, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateGoal = (data: GoalFormData) => {
    if (!editingGoal) return;
    const updated = storageService.updateGoal(editingGoal.id, data);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    }
    setEditingGoal(null);
  };

  const handleStatusChange = (goalId: string, newStatus: GoalStatus) => {
    const updated = storageService.updateStatus(goalId, newStatus);
    if (updated) {
      setGoals((prev) => prev.map((g) => (g.id === updated.id ? updated : g)));
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingGoal) return;
    const success = storageService.deleteGoal(deletingGoal.id);
    if (success) {
      setGoals((prev) => prev.filter((g) => g.id !== deletingGoal.id));
    }
    setDeletingGoal(null);
  };

  const handleLoadExamples = () => {
    const examples = storageService.resetExamples();
    setGoals(examples);
    setCurrentFilter('todos');
    setSearchQuery('');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 text-sm">
        Carregando StudyFlow...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Barra de Navegação Superior */}
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        totalGoals={stats.total}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Painel de Estatísticas e Progresso */}
        <StatsOverview stats={stats} />

        {/* Barra de Filtros, Busca e Ordenação */}
        {goals.length > 0 && (
          <GoalFilters
            currentFilter={currentFilter}
            onFilterChange={setCurrentFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortOption={sortOption}
            onSortChange={setSortOption}
            stats={stats}
          />
        )}

        {/* Lista de Objetivos ou Estados Vazios */}
        {goals.length === 0 ? (
          <EmptyState
            isFiltered={false}
            onOpenCreate={() => setIsCreateModalOpen(true)}
            onLoadExamples={handleLoadExamples}
          />
        ) : filteredGoals.length === 0 ? (
          <EmptyState
            isFiltered={true}
            onClearFilters={() => {
              setCurrentFilter('todos');
              setSearchQuery('');
            }}
            onOpenCreate={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGoals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(item) => setEditingGoal(item)}
                onDeleteRequest={(item) => setDeletingGoal(item)}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Rodapé Acolhedor e Discreto */}
      <footer className="mt-auto border-t border-slate-200/70 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            <strong className="font-semibold text-slate-700">StudyFlow</strong> — Seu companheiro simples para organizar a rotina de estudos.
          </p>
          <div className="flex items-center gap-4">
            <span>Dados salvos localmente</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleLoadExamples}
              className="text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
            >
              Restaurar exemplos
            </button>
          </div>
        </div>
      </footer>

      {/* Modal de Criação */}
      <GoalModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateGoal}
      />

      {/* Modal de Edição */}
      <GoalModal
        isOpen={Boolean(editingGoal)}
        goalToEdit={editingGoal}
        onClose={() => setEditingGoal(null)}
        onSubmit={handleUpdateGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmModal
        isOpen={Boolean(deletingGoal)}
        goal={deletingGoal}
        onCancel={() => setDeletingGoal(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
