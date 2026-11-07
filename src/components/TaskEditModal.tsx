import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Clock, Tag, Sparkles } from 'lucide-react';
import { SlotTask, TaskCategory } from '../types/planner';
import { CATEGORIES, QUICK_PRESETS } from '../data/categoriesAndPresets';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTask: SlotTask) => void;
  onClear: (taskId: string) => void;
  slotContext: {
    dayLabel: string;
    sectionLabel: string;
    task: SlotTask;
  } | null;
}

export const TaskEditModal: React.FC<TaskEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onClear,
  slotContext,
}) => {
  if (!isOpen || !slotContext) return null;

  const [title, setTitle] = useState(slotContext.task.title);
  const [category, setCategory] = useState<TaskCategory>(slotContext.task.category || 'topographical');
  const [time, setTime] = useState(slotContext.task.time || '');
  const [completed, setCompleted] = useState(slotContext.task.completed);
  const [notes, setNotes] = useState(slotContext.task.notes || '');

  useEffect(() => {
    if (slotContext) {
      setTitle(slotContext.task.title);
      setCategory(slotContext.task.category || 'topographical');
      setTime(slotContext.task.time || '');
      setCompleted(slotContext.task.completed);
      setNotes(slotContext.task.notes || '');
    }
  }, [slotContext]);

  const handleApplyPreset = (preset: { title: string; category: TaskCategory; time?: string }) => {
    setTitle(preset.title);
    setCategory(preset.category);
    if (preset.time && !time) {
      setTime(preset.time);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...slotContext.task,
      title: title.trim(),
      category,
      time: time.trim(),
      completed,
      notes: notes.trim(),
    });
    onClose();
  };

  const handleClear = () => {
    onClear(slotContext.task.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-800 text-white px-5 py-4 flex items-center justify-between border-b border-slate-700">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {slotContext.dayLabel}
              </span>
              <span className="text-slate-400 text-xs">/</span>
              <span className="text-xs text-slate-300 font-medium">
                {slotContext.sectionLabel}
              </span>
            </div>
            <h3 className="text-base font-bold text-white mt-0.5">
              Edit Training Slot
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-5 space-y-4">
          
          {/* Quick-Add Preset Chips */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Quick-Add Training Presets:
              </label>
              <span className="text-[11px] text-slate-400">Click to autofill</span>
            </div>
            <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
              {QUICK_PRESETS.slice(0, 8).map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(preset)}
                  className="text-left text-[11px] px-2 py-1 bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-200 rounded text-slate-700 hover:text-slate-900 transition-colors shadow-2xs truncate max-w-full"
                  title={preset.title}
                >
                  + {preset.title}
                </button>
              ))}
            </div>
          </div>

          {/* Task Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Module / Task Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Master Atlas Tracing: Kings Cross to Canary Wharf"
              rows={2}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
              required
            />
          </div>

          {/* Category & Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Module Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
              >
                {Object.values(CATEGORIES).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Time / Slot Range
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="e.g. 09:00 - 09:50"
                  className="w-full pl-8 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                />
                <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          {/* Completion Status */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Study Completion Status
              </span>
              <span className="text-[11px] text-slate-500">
                Mark as completed when trainee passes module or finishes study
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={completed}
                onChange={(e) => setCompleted(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-hidden peer-focus:ring-2 peer-focus:ring-amber-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Instructor Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Specific Instructor Notes / Weak Points (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Needs extra attention on roundabout exit 3 rules"
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>

          {/* Modal Actions */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Slot</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save Slot</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
