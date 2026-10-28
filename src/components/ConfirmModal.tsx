import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { StudyGoal } from '../types/goal';

interface ConfirmModalProps {
  isOpen: boolean;
  goal: StudyGoal | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  goal,
  onCancel,
  onConfirm,
}) => {
  // Fechar com tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !goal) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
    >
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 id="confirm-delete-title" className="text-base font-bold text-slate-900 mb-1">
                Excluir objetivo de estudo?
              </h3>
              <p className="text-sm text-slate-600 mb-3 leading-relaxed">
                Tem certeza de que deseja remover esta meta da sua lista de estudos?
              </p>
              
              {/* Card de destaque do item a ser excluído */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs text-slate-700">
                <span className="font-semibold block text-slate-900 line-clamp-1 mb-0.5">
                  {goal.title}
                </span>
                {goal.description && (
                  <span className="text-slate-500 line-clamp-2">
                    {goal.description}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé com botões de confirmação e cancelamento */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Sim, excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
};
