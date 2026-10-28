import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle, FileText, Flag, Sparkles, X } from 'lucide-react';
import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GoalFormData) => void;
  goalToEdit?: StudyGoal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  goalToEdit,
}) => {
  const isEditing = Boolean(goalToEdit);

  // Estados dos campos do formulário
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [error, setError] = useState<string | null>(null);

  // Inicializa ou reseta formulário quando abre ou troca o goalToEdit
  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || '');
      setDueDate(goalToEdit.dueDate || '');
      setStatus(goalToEdit.status || 'nao_iniciado');
      setError(null);
    } else {
      // Sugere por padrão uma data daqui a 3 dias para facilitar
      const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0];
      setTitle('');
      setDescription('');
      setDueDate(defaultDate);
      setStatus('nao_iniciado');
      setError(null);
    }
  }, [goalToEdit, isOpen]);

  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();

    if (!cleanTitle) {
      setError('Por favor, informe um título para o seu objetivo de estudo.');
      return;
    }

    if (cleanTitle.length < 3) {
      setError('O título deve ter pelo menos 3 caracteres.');
      return;
    }

    setError(null);
    onSubmit({
      title: cleanTitle,
      description: description.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      status,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="goal-modal-title"
    >
      {/* Container do Modal */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Cabeçalho do Modal */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              {isEditing ? <FileText className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            <div>
              <h3 id="goal-modal-title" className="text-base font-bold text-slate-900">
                {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEditing
                  ? 'Atualize os dados e o andamento da sua meta'
                  : 'Defina o que você quer aprender de forma simples'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar janela"
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          {/* Campo: Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Título do Objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Ex: Aprender o Teorema de Pitágoras e fazer 5 exercícios"
              className="w-full px-3.5 py-2.5 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-colors"
              autoFocus
            />
            <p className="mt-1 text-[11px] text-slate-500">
              Dica: Escreva uma ação clara que você consiga realizar.
            </p>
          </div>

          {/* Campo: Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Descrição ou Anotações <span className="text-slate-400 font-normal lowercase">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Ler o capítulo 3 da apostila, assistir vídeo explicativo no YouTube e resolver lista 2."
              className="w-full px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-colors resize-none"
            />
          </div>

          {/* Linha dupla: Prazo e Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Campo: Prazo */}
            <div>
              <label htmlFor="goal-due-date" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Prazo Final
              </label>
              <input
                id="goal-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-colors"
              />
            </div>

            {/* Campo: Status */}
            <div>
              <label htmlFor="goal-status" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                Status Atual
              </label>
              <select
                id="goal-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition-colors cursor-pointer"
              >
                <option value="nao_iniciado">Ainda não iniciado</option>
                <option value="em_andamento">Em andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          {/* Botões de Ação do Rodapé */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
