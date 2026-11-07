import React, { useState } from 'react';
import { X, Landmark, Plus, Trash2, Check, ShieldAlert } from 'lucide-react';
import { TraineeStudent } from '../types/planner';
import { ConfirmModal } from './ConfirmModal';

interface CouncilModalProps {
  isOpen: boolean;
  onClose: () => void;
  councils: string[];
  onAddCouncil: (newCouncil: string) => void;
  onDeleteCouncil: (councilToDelete: string) => void;
  trainees: TraineeStudent[];
}

export const CouncilModal: React.FC<CouncilModalProps> = ({
  isOpen,
  onClose,
  councils,
  onAddCouncil,
  onDeleteCouncil,
  trainees,
}) => {
  if (!isOpen) return null;

  const [newCouncilName, setNewCouncilName] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [councilPendingDelete, setCouncilPendingDelete] = useState<{
    name: string;
    count: number;
  } | null>(null);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCouncilName.trim();
    if (!trimmed) {
      setError('Please enter a council or licensing authority name.');
      return;
    }

    if (councils.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      setError(`"${trimmed}" is already in the licensing council directory.`);
      return;
    }

    onAddCouncil(trimmed);
    setNewCouncilName('');
    setError('');
    setSuccessMsg(`Added "${trimmed}" successfully.`);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const getTraineeCount = (councilName: string) => {
    return trainees.filter((t) => t.council.toLowerCase() === councilName.toLowerCase()).length;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Licensing Councils Directory
              </h3>
              <p className="text-xs text-slate-400">
                Add, configure, and inspect partner licensing authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Add New Council Form */}
          <form onSubmit={handleAdd} className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Add New Licensing Council Authority
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newCouncilName}
                  onChange={(e) => {
                    setNewCouncilName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="e.g. Bradford Metropolitan District Council, Sheffield..."
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-800"
                />
                <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs transition-colors shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Council</span>
              </button>
            </div>

            {error && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {error}
              </p>
            )}

            {successMsg && (
              <p className="text-xs text-emerald-600 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                {successMsg}
              </p>
            )}
          </form>

          {/* Council List */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
              <span>Current Available Councils ({councils.length})</span>
              <span>Enrolled Trainees</span>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
              {councils.map((c) => {
                const count = getTraineeCount(c);
                const isDefault = [
                  'TfL (Transport for London)',
                  'Wolverhampton Council',
                  'Manchester City Council',
                  'Bury Council',
                  'Other',
                ].includes(c);

                return (
                  <div
                    key={c}
                    className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                        {c}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {count} {count === 1 ? 'trainee' : 'trainees'}
                      </span>

                      {!isDefault && (
                        <button
                          type="button"
                          onClick={() => {
                            setCouncilPendingDelete({ name: c, count });
                          }}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          title={`Remove ${c}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Done
          </button>
        </div>

        {/* Delete Council In-App Confirmation Modal */}
        <ConfirmModal
          isOpen={!!councilPendingDelete}
          title="Remove Licensing Council"
          message={
            councilPendingDelete?.count && councilPendingDelete.count > 0
              ? `Warning: ${councilPendingDelete.count} trainee(s) are currently registered under "${councilPendingDelete.name}". Are you sure you want to remove this council authority?`
              : `Are you sure you want to remove "${councilPendingDelete?.name}" from the licensing directory?`
          }
          confirmLabel="Remove Council"
          isDestructive={true}
          onConfirm={() => {
            if (councilPendingDelete) {
              onDeleteCouncil(councilPendingDelete.name);
              setCouncilPendingDelete(null);
            }
          }}
          onCancel={() => setCouncilPendingDelete(null)}
        />
      </div>
    </div>
  );
};
