import React from 'react';
import { Calendar, Users, PlusCircle, Car, ShieldCheck, Printer, Landmark } from 'lucide-react';
import { TraineeStudent } from '../types/planner';

interface NavbarProps {
  currentView: 'planner' | 'master';
  onViewChange: (view: 'planner' | 'master') => void;
  onAddNewTrainee: () => void;
  activeTrainee: TraineeStudent | null;
  onPrintClick: () => void;
  onOpenCouncilModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  onAddNewTrainee,
  activeTrainee,
  onPrintClick,
  onOpenCouncilModal,
}) => {
  return (
    <header className="no-print bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm tracking-wider">
              <Car className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap">
                  Smart Taxi Solutions
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Licence Academy
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Council Licensing & Driver Study Planner
              </p>
            </div>
          </div>

          {/* Navigation View Toggles */}
          <nav className="flex items-center p-1 bg-slate-800/80 rounded-lg border border-slate-700/60">
            <button
              onClick={() => onViewChange('planner')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'planner'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Driver Weekly Planner</span>
              {activeTrainee && currentView === 'planner' && (
                <span className="hidden xl:inline text-[11px] opacity-80 border-l border-slate-950/20 pl-1.5">
                  {activeTrainee.fullName.split(' ')[0]}
                </span>
              )}
            </button>

            <button
              onClick={() => onViewChange('master')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap ${
                currentView === 'master'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>All Students & Schedules</span>
            </button>
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenCouncilModal}
              title="Manage and add licensing councils"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <Landmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Councils</span>
            </button>

            {currentView === 'planner' && (
              <button
                onClick={onPrintClick}
                title="Print current weekly schedule"
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                <span>Print Schedule</span>
              </button>
            )}

            <button
              onClick={onAddNewTrainee}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Add New Trainee</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
