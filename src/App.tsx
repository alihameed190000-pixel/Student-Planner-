/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IndividualPlanner } from './components/IndividualPlanner';
import { MasterOverview } from './components/MasterOverview';
import { StudentModal } from './components/StudentModal';
import { CouncilModal } from './components/CouncilModal';
import { PrintSheet } from './components/PrintSheet';
import { ConfirmModal } from './components/ConfirmModal';
import { TraineeStudent, WeekPlan } from './types/planner';
import { INITIAL_TRAINEES, createEmptyWeek } from './data/initialData';
import { FULL_MONTH_NAMES, COUNCILS as DEFAULT_COUNCILS } from './data/categoriesAndPresets';
import { Car, RefreshCw, Info, ExternalLink } from 'lucide-react';

const STORAGE_KEY = 'smart_taxi_trainees_v1';
const COUNCILS_STORAGE_KEY = 'smart_taxi_councils_v1';

export default function App() {
  // Load from localStorage or initialize with realistic trainee records
  const [trainees, setTrainees] = useState<TraineeStudent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage trainees', e);
    }
    return INITIAL_TRAINEES;
  });

  // Councils directory state (dynamic, editable)
  const [councils, setCouncils] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(COUNCILS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage councils', e);
    }
    return DEFAULT_COUNCILS;
  });

  // Save trainees to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trainees));
    } catch (e) {
      console.error('Failed to save trainees to localStorage', e);
    }
  }, [trainees]);

  // Save councils to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(COUNCILS_STORAGE_KEY, JSON.stringify(councils));
    } catch (e) {
      console.error('Failed to save councils to localStorage', e);
    }
  }, [councils]);

  // Current view toggle
  const [currentView, setCurrentView] = useState<'planner' | 'master'>('planner');

  // Active student for the individual planner
  const [activeTraineeId, setActiveTraineeId] = useState<string>(() => {
    return trainees[0]?.id || 'trainee-1';
  });

  // Active month & week selection (Nov 2026, Week 1 by default)
  const [selectedMonth, setSelectedMonth] = useState<number>(10);
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Modals state
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<TraineeStudent | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isCouncilModalOpen, setIsCouncilModalOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Active trainee helper
  const activeTrainee = trainees.find((t) => t.id === activeTraineeId) || trainees[0];

  // Handler: Add or update trainee
  const handleSaveTrainee = (savedTrainee: TraineeStudent) => {
    setTrainees((prev) => {
      const exists = prev.some((t) => t.id === savedTrainee.id);
      if (exists) {
        return prev.map((t) => (t.id === savedTrainee.id ? savedTrainee : t));
      } else {
        return [savedTrainee, ...prev];
      }
    });
    setActiveTraineeId(savedTrainee.id);

    // If trainee council is not yet in councils, automatically register it
    if (savedTrainee.council && !councils.includes(savedTrainee.council) && savedTrainee.council !== 'Other') {
      setCouncils((prev) => [...prev, savedTrainee.council]);
    }
  };

  // Handler: Delete trainee
  const handleDeleteTrainee = (traineeId: string) => {
    setTrainees((prev) => {
      const filtered = prev.filter((t) => t.id !== traineeId);
      if (activeTraineeId === traineeId && filtered.length > 0) {
        setActiveTraineeId(filtered[0].id);
      }
      return filtered;
    });
  };

  // Handler: Add new council
  const handleAddCouncil = (newCouncil: string) => {
    const trimmed = newCouncil.trim();
    if (!trimmed) return;
    setCouncils((prev) => {
      if (prev.some((c) => c.toLowerCase() === trimmed.toLowerCase())) return prev;
      return [...prev, trimmed];
    });
  };

  // Handler: Delete council
  const handleDeleteCouncil = (councilToDelete: string) => {
    setCouncils((prev) => prev.filter((c) => c !== councilToDelete));
  };

  // Handler: Open edit profile modal
  const handleEditTraineeProfile = (trainee: TraineeStudent) => {
    setStudentToEdit(trainee);
    setIsStudentModalOpen(true);
  };

  // Handler: Open create modal
  const handleOpenCreateModal = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  // Handler: Jump from master view to individual planner
  const handleJumpToPlanner = (traineeId: string) => {
    setActiveTraineeId(traineeId);
    setCurrentView('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler: Reset to factory demo trainees
  const handleResetDemoData = () => {
    setIsResetConfirmOpen(true);
  };

  const handleConfirmResetDemo = () => {
    setTrainees(INITIAL_TRAINEES);
    setCouncils(DEFAULT_COUNCILS);
    setActiveTraineeId(INITIAL_TRAINEES[0].id);
    setSelectedMonth(10);
    setSelectedWeek(1);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(COUNCILS_STORAGE_KEY);
    } catch (e) {}
    setIsResetConfirmOpen(false);
  };

  // Get active week plan for print modal and individual planner
  const currentWeekPlan: WeekPlan =
    activeTrainee?.schedules?.['2026']?.[selectedMonth]?.[selectedWeek] ||
    createEmptyWeek(selectedWeek, selectedMonth, 2026);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100/70 text-slate-900 font-sans antialiased">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddNewTrainee={handleOpenCreateModal}
        activeTrainee={activeTrainee}
        onPrintClick={() => setIsPrintModalOpen(true)}
        onOpenCouncilModal={() => setIsCouncilModalOpen(true)}
      />

      {/* Main Viewport */}
      <main className={`flex-1 pb-16 ${isPrintModalOpen ? 'print:hidden' : ''}`}>
        {currentView === 'planner' ? (
          <IndividualPlanner
            trainees={trainees}
            activeTraineeId={activeTraineeId}
            onSelectTrainee={setActiveTraineeId}
            onUpdateTrainee={handleSaveTrainee}
            onEditTraineeProfile={handleEditTraineeProfile}
            onPrintRequest={() => setIsPrintModalOpen(true)}
            onOpenCouncilModal={() => setIsCouncilModalOpen(true)}
            selectedMonth={selectedMonth}
            onSelectMonth={setSelectedMonth}
            selectedWeek={selectedWeek}
            onSelectWeek={setSelectedWeek}
            onAddNewTrainee={handleOpenCreateModal}
          />
        ) : (
          <MasterOverview
            trainees={trainees}
            onSelectTraineeForPlanner={handleJumpToPlanner}
            onEditTrainee={handleEditTraineeProfile}
            onDeleteTrainee={handleDeleteTrainee}
            onAddNewTrainee={handleOpenCreateModal}
            councils={councils}
            onOpenCouncilModal={() => setIsCouncilModalOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-slate-400 py-6 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Smart Taxi Solutions</span>
            <span>•</span>
            <span>UK Private Hire & Hackney Carriage Academy Study Planner</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCouncilModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-400 transition-colors"
            >
              <span>Manage Councils ({councils.length})</span>
            </button>
            <span>•</span>
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-amber-400 transition-colors"
              title="Reset sample candidate records and councils"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
            <span>•</span>
            <span className="text-slate-500">
              Compliant with TfL SERU, Manchester, Wolverhampton & UK Council standards
            </span>
          </div>
        </div>
      </footer>

      {/* Trainee Profile Modal (Create / Edit) */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => {
          setIsStudentModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveTrainee}
        traineeToEdit={studentToEdit}
        councils={councils}
        onAddNewCouncil={handleAddCouncil}
      />

      {/* Councils Directory Modal */}
      <CouncilModal
        isOpen={isCouncilModalOpen}
        onClose={() => setIsCouncilModalOpen(false)}
        councils={councils}
        onAddCouncil={handleAddCouncil}
        onDeleteCouncil={handleDeleteCouncil}
        trainees={trainees}
      />

      {/* Printable Sheet View / Modal */}
      {activeTrainee && (
        <PrintSheet
          trainee={activeTrainee}
          weekPlan={currentWeekPlan}
          monthName={FULL_MONTH_NAMES[selectedMonth]}
          year={2026}
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}

      {/* Reset Demo Data In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={isResetConfirmOpen}
        title="Reset Candidate Records & Councils"
        message="This will reset all candidate timetables, study progress, and custom councils back to the original 4 realistic demo candidates. Any new candidates you created will be erased."
        confirmLabel="Reset Everything"
        isDestructive={true}
        onConfirm={handleConfirmResetDemo}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

    </div>
  );
}
