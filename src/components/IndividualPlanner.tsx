import React, { useState } from 'react';
import {
  Calendar,
  Printer,
  ChevronDown,
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  FileDown,
  RotateCcw,
  Edit,
  Phone,
  Landmark,
  Award,
  FileCheck2,
  Plus,
  BookOpen,
  Compass,
  AlertCircle
} from 'lucide-react';
import { TraineeStudent, WeekPlan, SlotTask, TaskCategory } from '../types/planner';
import { CATEGORIES, MONTH_NAMES, FULL_MONTH_NAMES, QUICK_PRESETS } from '../data/categoriesAndPresets';
import { createEmptySlot, createEmptyWeek } from '../data/initialData';
import { TaskEditModal } from './TaskEditModal';
import { exportWeeklyPlannerToPdf } from '../utils/pdfExport';
import { ConfirmModal } from './ConfirmModal';

interface IndividualPlannerProps {
  trainees: TraineeStudent[];
  activeTraineeId: string;
  onSelectTrainee: (id: string) => void;
  onUpdateTrainee: (updated: TraineeStudent) => void;
  onEditTraineeProfile: (trainee: TraineeStudent) => void;
  onPrintRequest: () => void;
  onOpenCouncilModal?: () => void;
  selectedMonth?: number;
  onSelectMonth?: (month: number) => void;
  selectedWeek?: number;
  onSelectWeek?: (week: number) => void;
  onAddNewTrainee?: () => void;
}

export const IndividualPlanner: React.FC<IndividualPlannerProps> = ({
  trainees,
  activeTraineeId,
  onSelectTrainee,
  onUpdateTrainee,
  onEditTraineeProfile,
  onPrintRequest,
  onOpenCouncilModal,
  selectedMonth: propMonth,
  onSelectMonth,
  selectedWeek: propWeek,
  onSelectWeek,
  onAddNewTrainee,
}) => {
  const currentTrainee = trainees.find((t) => t.id === activeTraineeId) || trainees[0];

  const currentYear = 2026;
  const [internalMonth, setInternalMonth] = useState<number>(10); // November (0-indexed = 10)
  const [internalWeek, setInternalWeek] = useState<number>(1);
  const [isClearWeekConfirmOpen, setIsClearWeekConfirmOpen] = useState(false);

  const selectedMonth = propMonth !== undefined ? propMonth : internalMonth;
  const setSelectedMonth = onSelectMonth || setInternalMonth;
  const selectedWeek = propWeek !== undefined ? propWeek : internalWeek;
  const setSelectedWeek = onSelectWeek || setInternalWeek;

  // Modal editing state
  const [editingSlot, setEditingSlot] = useState<{
    dayKey: string;
    slotType: 'morning' | 'module' | 'evening' | 'saturday' | 'sunday';
    moduleIndex?: number;
    dayLabel: string;
    sectionLabel: string;
    task: SlotTask;
  } | null>(null);

  if (!currentTrainee) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-white rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl mx-auto flex items-center justify-center font-bold">
          <BookOpen className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">No Driver Trainees Found</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Get started by adding your first private hire or hackney carriage driver candidate to generate their council study timetable.
        </p>
        {onAddNewTrainee && (
          <button
            onClick={onAddNewTrainee}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg shadow-sm transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Driver Trainee</span>
          </button>
        )}
      </div>
    );
  }

  // Ensure current week plan exists in trainee data
  const traineeSchedules = currentTrainee.schedules || {};
  const yearData = traineeSchedules[currentYear.toString()] || {};
  const monthData = yearData[selectedMonth] || {};
  const currentWeekPlan: WeekPlan =
    monthData[selectedWeek] || createEmptyWeek(selectedWeek, selectedMonth, currentYear);

  // Helper to commit week updates back to trainee
  const updateCurrentWeek = (newWeekPlan: WeekPlan) => {
    const updatedSchedules = {
      ...traineeSchedules,
      [currentYear.toString()]: {
        ...yearData,
        [selectedMonth]: {
          ...monthData,
          [selectedWeek]: newWeekPlan,
        },
      },
    };

    onUpdateTrainee({
      ...currentTrainee,
      schedules: updatedSchedules,
    });
  };

  // Toggle slot completion directly
  const toggleSlotCompletion = (
    dayKey: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
    slotType: 'morning' | 'module' | 'evening' | 'weekend',
    moduleIdx?: number
  ) => {
    const newWeek = JSON.parse(JSON.stringify(currentWeekPlan)) as WeekPlan;

    if (dayKey === 'saturday' || dayKey === 'sunday') {
      if (moduleIdx !== undefined && newWeek[dayKey].tasks[moduleIdx]) {
        newWeek[dayKey].tasks[moduleIdx].completed = !newWeek[dayKey].tasks[moduleIdx].completed;
      }
    } else {
      const day = newWeek.days[dayKey];
      if (slotType === 'morning') {
        day.morningPrep.completed = !day.morningPrep.completed;
      } else if (slotType === 'evening') {
        day.eveningPractice.completed = !day.eveningPractice.completed;
      } else if (slotType === 'module' && moduleIdx !== undefined && day.trainingModules[moduleIdx]) {
        day.trainingModules[moduleIdx].completed = !day.trainingModules[moduleIdx].completed;
      }
    }

    updateCurrentWeek(newWeek);
  };

  // Open slot in modal
  const handleSlotClick = (
    dayKey: string,
    slotType: 'morning' | 'module' | 'evening' | 'saturday' | 'sunday',
    moduleIndex: number | undefined,
    dayLabel: string,
    sectionLabel: string,
    task: SlotTask
  ) => {
    setEditingSlot({
      dayKey,
      slotType,
      moduleIndex,
      dayLabel,
      sectionLabel,
      task,
    });
  };

  // Save updated slot from modal
  const handleSaveSlot = (updatedTask: SlotTask) => {
    if (!editingSlot) return;
    const newWeek = JSON.parse(JSON.stringify(currentWeekPlan)) as WeekPlan;

    if (editingSlot.dayKey === 'saturday' || editingSlot.dayKey === 'sunday') {
      const weekendDay = newWeek[editingSlot.dayKey as 'saturday' | 'sunday'];
      if (editingSlot.moduleIndex !== undefined && weekendDay.tasks[editingSlot.moduleIndex]) {
        weekendDay.tasks[editingSlot.moduleIndex] = updatedTask;
      } else {
        weekendDay.tasks.push(updatedTask);
      }
    } else {
      const day = newWeek.days[editingSlot.dayKey as keyof typeof newWeek.days];
      if (editingSlot.slotType === 'morning') {
        day.morningPrep = updatedTask;
      } else if (editingSlot.slotType === 'evening') {
        day.eveningPractice = updatedTask;
      } else if (editingSlot.slotType === 'module' && editingSlot.moduleIndex !== undefined) {
        day.trainingModules[editingSlot.moduleIndex] = updatedTask;
      }
    }

    updateCurrentWeek(newWeek);
  };

  // Clear slot
  const handleClearSlot = (taskId: string) => {
    if (!editingSlot) return;
    const newWeek = JSON.parse(JSON.stringify(currentWeekPlan)) as WeekPlan;

    if (editingSlot.dayKey === 'saturday' || editingSlot.dayKey === 'sunday') {
      const weekendDay = newWeek[editingSlot.dayKey as 'saturday' | 'sunday'];
      if (editingSlot.moduleIndex !== undefined) {
        weekendDay.tasks.splice(editingSlot.moduleIndex, 1);
      }
    } else {
      const day = newWeek.days[editingSlot.dayKey as keyof typeof newWeek.days];
      if (editingSlot.slotType === 'morning') {
        day.morningPrep = createEmptySlot(taskId, '08:00 - 08:45');
      } else if (editingSlot.slotType === 'evening') {
        day.eveningPractice = createEmptySlot(taskId, '17:30 - 18:30');
      } else if (editingSlot.slotType === 'module' && editingSlot.moduleIndex !== undefined) {
        day.trainingModules[editingSlot.moduleIndex] = createEmptySlot(taskId, editingSlot.task.time);
      }
    }

    updateCurrentWeek(newWeek);
  };

  // Notes update
  const handleNotesChange = (val: string) => {
    const newWeek = {
      ...currentWeekPlan,
      notes: val,
    };
    updateCurrentWeek(newWeek);
  };

  // Calculate statistics for this week
  const allWeekdayDays = Object.values(currentWeekPlan.days);
  let totalTasks = 0;
  let completedTasks = 0;

  allWeekdayDays.forEach((d) => {
    if (d.morningPrep.title) {
      totalTasks++;
      if (d.morningPrep.completed) completedTasks++;
    }
    d.trainingModules.forEach((m) => {
      if (m.title) {
        totalTasks++;
        if (m.completed) completedTasks++;
      }
    });
    if (d.eveningPractice.title) {
      totalTasks++;
      if (d.eveningPractice.completed) completedTasks++;
    }
  });

  currentWeekPlan.saturday.tasks.forEach((t) => {
    if (t.title) {
      totalTasks++;
      if (t.completed) completedTasks++;
    }
  });

  currentWeekPlan.sunday.tasks.forEach((t) => {
    if (t.title) {
      totalTasks++;
      if (t.completed) completedTasks++;
    }
  });

  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Smart Fill Curriculum for the active council
  const handleSmartFillCurriculum = () => {
    const newWeek = JSON.parse(JSON.stringify(currentWeekPlan)) as WeekPlan;
    const presets = [...QUICK_PRESETS];
    
    // Assign diverse council presets across empty slots
    let pIdx = 0;
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const;
    days.forEach((dayKey) => {
      const d = newWeek.days[dayKey];
      if (!d.morningPrep.title) {
        const p = presets[pIdx % presets.length];
        d.morningPrep.title = p.title;
        d.morningPrep.category = p.category;
        pIdx++;
      }
      d.trainingModules.forEach((m) => {
        if (!m.title) {
          const p = presets[pIdx % presets.length];
          m.title = p.title;
          m.category = p.category;
          pIdx++;
        }
      });
      if (!d.eveningPractice.title) {
        const p = presets[pIdx % presets.length];
        d.eveningPractice.title = p.title;
        d.eveningPractice.category = p.category;
        pIdx++;
      }
    });

    if (newWeek.saturday.tasks.length === 0 || !newWeek.saturday.tasks[0]?.title) {
      newWeek.saturday.tasks = [
        {
          id: `w${selectedWeek}-sat-1`,
          title: 'Weekend Mock: 45-min Timed Computer-Based Exam Simulation',
          category: 'mock_test',
          time: '10:00 - 11:30',
          completed: false,
        },
      ];
    }

    if (newWeek.sunday.tasks.length === 0 || !newWeek.sunday.tasks[0]?.title) {
      newWeek.sunday.tasks = [
        {
          id: `w${selectedWeek}-sun-1`,
          title: 'Weekly Revision: Review missed questions and difficult route lines',
          category: 'highway_code',
          time: '14:00 - 15:30',
          completed: false,
        },
      ];
    }

    updateCurrentWeek(newWeek);
  };

  // Clear current week
  const handleClearWeek = () => {
    setIsClearWeekConfirmOpen(true);
  };

  const handleConfirmClearWeek = () => {
    updateCurrentWeek(createEmptyWeek(selectedWeek, selectedMonth, currentYear));
    setIsClearWeekConfirmOpen(false);
  };

  // Export current schedule as PDF
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handleExportPDF = () => {
    setIsExportingPdf(true);
    try {
      exportWeeklyPlannerToPdf(
        currentTrainee,
        currentWeekPlan,
        FULL_MONTH_NAMES[selectedMonth],
        currentYear
      );
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setTimeout(() => setIsExportingPdf(false), 600);
    }
  };

  const weekdays = [
    { key: 'monday', label: 'Monday', schedule: currentWeekPlan.days.monday },
    { key: 'tuesday', label: 'Tuesday', schedule: currentWeekPlan.days.tuesday },
    { key: 'wednesday', label: 'Wednesday', schedule: currentWeekPlan.days.wednesday },
    { key: 'thursday', label: 'Thursday', schedule: currentWeekPlan.days.thursday },
    { key: 'friday', label: 'Friday', schedule: currentWeekPlan.days.friday },
  ] as const;

  return (
    <div className="max-w-[1520px] mx-auto px-2 sm:px-4 lg:px-6 py-6 space-y-5">
      
      {/* 1. STUDENT HEADER BAR */}
      <div className="no-print bg-white rounded-xl border border-slate-200/90 shadow-xs p-4 sm:p-5 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Student Selector & Core Meta */}
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Quick Switch Dropdown */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Active Driver Trainee
              </label>
              <div className="relative">
                <select
                  value={activeTraineeId}
                  onChange={(e) => onSelectTrainee(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-sm sm:text-base font-bold text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-colors appearance-none cursor-pointer"
                >
                  {trainees.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.fullName} — {t.council.split(' ')[0]} ({t.badgeType.split(' ')[0]})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Trainee Details Strip */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm text-slate-600 pt-3 lg:pt-4 border-t lg:border-t-0 lg:border-l border-slate-200 lg:pl-5">
              
              <div className="flex items-center gap-1.5 font-medium text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{currentTrainee.phoneNumber}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">
                  {currentTrainee.council === 'Other' ? currentTrainee.customCouncil : currentTrainee.council}
                </span>
                {onOpenCouncilModal && (
                  <button
                    onClick={onOpenCouncilModal}
                    title="Add or manage councils"
                    className="ml-1 text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded transition-colors inline-flex items-center gap-0.5"
                  >
                    <span>+ Add Council</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-700">{currentTrainee.badgeType}</span>
              </div>

              {currentTrainee.examDate ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md font-semibold text-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Exam: {currentTrainee.examDate}</span>
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  Exam date to be booked
                </div>
              )}

              {/* DBS & Medical Status Tags */}
              <div className="hidden xl:flex items-center gap-2 text-xs">
                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  currentTrainee.dbsStatus === 'Approved'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  DBS: {currentTrainee.dbsStatus}
                </span>

                <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
                  currentTrainee.medicalStatus === 'Group 2 Passed'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  Medical: {currentTrainee.medicalStatus}
                </span>
              </div>

            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0 self-end lg:self-center">
            
            <button
              onClick={() => onEditTraineeProfile(currentTrainee)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" />
              <span>Edit Profile</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isExportingPdf}
              title="Export and download weekly schedule as PDF document"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-800 bg-white hover:bg-amber-50 hover:border-amber-300 border border-slate-300 rounded-lg shadow-2xs transition-all active:scale-[0.98]"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-600" />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Export to PDF'}</span>
            </button>

            <button
              onClick={onPrintRequest}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>Print Schedule</span>
            </button>

          </div>

        </div>
      </div>

      {/* 2. MONTH SELECTOR BAR */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-2 shadow-2xs overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-[720px] justify-between">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3">
            Month:
          </div>
          <div className="flex items-center gap-1 flex-1">
            {MONTH_NAMES.map((m, idx) => {
              const isSelected = selectedMonth === idx;
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(idx)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all text-center ${
                    isSelected
                      ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. WEEK SELECTOR & UTILITIES BAR */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-3 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Week Tabs */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
            Plan Week:
          </span>
          {[1, 2, 3, 4].map((wk) => (
            <button
              key={wk}
              onClick={() => setSelectedWeek(wk)}
              className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedWeek === wk
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Week {wk}
            </button>
          ))}
          <span className="text-xs text-slate-500 ml-2 hidden sm:inline">
            ({FULL_MONTH_NAMES[selectedMonth]} {currentYear})
          </span>
        </div>

        {/* Progress & Quick Tools */}
        <div className="flex items-center gap-3">
          
          {/* Progress Bar */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Study Completion:</span>
            <div className="w-24 sm:w-32 h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="font-bold text-slate-800 font-mono text-[11px] tabular-nums">
              {completionPct}% ({completedTasks}/{totalTasks})
            </span>
          </div>

          {/* Quick Curriculum Autofill */}
          <button
            onClick={handleSmartFillCurriculum}
            title="Populate recommended syllabus modules"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Smart Curriculum Fill</span>
          </button>

          <button
            onClick={handleClearWeek}
            title="Reset slots for this week"
            className="inline-flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>

        </div>

      </div>

      {/* 4. THE WEEKLY PLANNER GRID (REPLICATING THE STRUCTURED PLANNER REFERENCE) */}
      <div className="print-page bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden">
        
        {/* Main Grid: 6 Columns (5 Weekdays + 1 Weekend/Notes Column) */}
        <div className="grid grid-cols-1 md:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-slate-300">
          
          {/* LEFT 5 COLUMNS: MONDAY TO FRIDAY */}
          {weekdays.map(({ key, label, schedule }) => (
            <div key={key} className="flex flex-col bg-white">
              
              {/* Day Header (Slate-700 / #334155 header with crisp white text & date box) */}
              <div className="bg-slate-700 text-white px-3 py-2 flex items-center justify-between border-b border-slate-600 select-none">
                <span className="font-bold text-sm tracking-wide uppercase">
                  {label}
                </span>
                <div className="w-7 h-6 bg-white text-slate-900 rounded font-black text-xs flex items-center justify-center font-mono shadow-xs">
                  {schedule.dateNumber}
                </div>
              </div>

              {/* Section 1: Morning Prep / Self-Study (Replacing "Before School") */}
              <div className="border-b border-slate-200 bg-slate-50/70 p-2 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                    Morning Prep
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    08:00 - 08:45
                  </span>
                </div>

                <div
                  onClick={() =>
                    handleSlotClick(key, 'morning', undefined, label, 'Morning Prep', schedule.morningPrep)
                  }
                  className={`group relative p-2 rounded border cursor-pointer transition-all ${
                    schedule.morningPrep.title
                      ? schedule.morningPrep.completed
                        ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400'
                        : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-2xs'
                      : 'bg-white/50 border-dashed border-slate-300 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (schedule.morningPrep.title) {
                          toggleSlotCompletion(key, 'morning');
                        } else {
                          handleSlotClick(key, 'morning', undefined, label, 'Morning Prep', schedule.morningPrep);
                        }
                      }}
                      className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${
                        schedule.morningPrep.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {schedule.morningPrep.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {schedule.morningPrep.title ? (
                        <>
                          <p className={`text-xs font-semibold leading-tight line-clamp-2 ${
                            schedule.morningPrep.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}>
                            {schedule.morningPrep.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`inline-block px-1.5 py-0.2 text-[9px] font-medium rounded ${
                              CATEGORIES[schedule.morningPrep.category]?.bgLight || 'bg-slate-100 text-slate-700'
                            }`}>
                              {CATEGORIES[schedule.morningPrep.category]?.shortLabel || 'Prep'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic block py-1 group-hover:text-slate-600">
                          + Add morning study...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Training Modules & Classes (7 structured slots replacing "Classes") */}
              <div className="divide-y divide-slate-200 flex-1">
                <div className="bg-slate-100/90 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center justify-between border-b border-slate-200">
                  <span>Training Modules (7 Slots)</span>
                  <span className="text-[9px] text-slate-400 lowercase font-normal">click to edit</span>
                </div>

                {schedule.trainingModules.map((moduleSlot, mIdx) => {
                  const cat = CATEGORIES[moduleSlot.category] || CATEGORIES.topographical;
                  return (
                    <div
                      key={mIdx}
                      onClick={() =>
                        handleSlotClick(
                          key,
                          'module',
                          mIdx,
                          label,
                          `Module Slot ${mIdx + 1} (${moduleSlot.time || ''})`,
                          moduleSlot
                        )
                      }
                      className={`group p-2 cursor-pointer transition-colors relative min-h-[58px] ${
                        moduleSlot.completed
                          ? 'bg-emerald-50/50 hover:bg-emerald-50'
                          : moduleSlot.title
                          ? 'bg-white hover:bg-amber-50/30'
                          : 'bg-white/70 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        
                        {/* Checkbox toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (moduleSlot.title) {
                              toggleSlotCompletion(key, 'module', mIdx);
                            } else {
                              handleSlotClick(
                                key,
                                'module',
                                mIdx,
                                label,
                                `Module Slot ${mIdx + 1}`,
                                moduleSlot
                              );
                            }
                          }}
                          className={`mt-0.5 w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center border transition-colors ${
                            moduleSlot.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 hover:border-slate-400 bg-white'
                          }`}
                        >
                          {moduleSlot.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          {moduleSlot.title ? (
                            <>
                              <div className="flex items-center justify-between gap-1 mb-0.5">
                                <span className={`text-[9px] font-bold uppercase tracking-tight px-1 py-0.2 rounded truncate ${cat.bgLight}`}>
                                  {cat.shortLabel}
                                </span>
                                {moduleSlot.time && (
                                  <span className="text-[9px] font-mono text-slate-400 shrink-0">
                                    {moduleSlot.time.split(' - ')[0]}
                                  </span>
                                )}
                              </div>
                              <p className={`text-[11px] font-medium leading-snug line-clamp-2 ${
                                moduleSlot.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                              }`}>
                                {moduleSlot.title}
                              </p>
                            </>
                          ) : (
                            <div className="flex items-center justify-between text-[11px] text-slate-300 group-hover:text-slate-500 py-1">
                              <span className="font-mono text-[10px]">Slot {mIdx + 1}</span>
                              <span className="italic text-[10px]">+ Set task</span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Section 3: Evening Practice / Mock Exams (Replacing "After School") */}
              <div className="border-t border-slate-200 bg-slate-50/70 p-2 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                    Evening Practice
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    17:30 - 18:30
                  </span>
                </div>

                <div
                  onClick={() =>
                    handleSlotClick(key, 'evening', undefined, label, 'Evening Practice', schedule.eveningPractice)
                  }
                  className={`group relative p-2 rounded border cursor-pointer transition-all ${
                    schedule.eveningPractice.title
                      ? schedule.eveningPractice.completed
                        ? 'bg-emerald-50/80 border-emerald-200 hover:border-emerald-400'
                        : 'bg-white border-slate-200 hover:border-amber-400 hover:shadow-2xs'
                      : 'bg-white/50 border-dashed border-slate-300 hover:border-slate-400 hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (schedule.eveningPractice.title) {
                          toggleSlotCompletion(key, 'evening');
                        } else {
                          handleSlotClick(key, 'evening', undefined, label, 'Evening Practice', schedule.eveningPractice);
                        }
                      }}
                      className={`mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-colors ${
                        schedule.eveningPractice.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                    >
                      {schedule.eveningPractice.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <div className="flex-1 min-w-0">
                      {schedule.eveningPractice.title ? (
                        <>
                          <p className={`text-xs font-semibold leading-tight line-clamp-2 ${
                            schedule.eveningPractice.completed ? 'text-slate-500 line-through' : 'text-slate-900'
                          }`}>
                            {schedule.eveningPractice.title}
                          </p>
                          <div className="mt-1 flex items-center gap-1.5">
                            <span className={`inline-block px-1.5 py-0.2 text-[9px] font-medium rounded ${
                              CATEGORIES[schedule.eveningPractice.category]?.bgLight || 'bg-amber-50 text-amber-900'
                            }`}>
                              {CATEGORIES[schedule.eveningPractice.category]?.shortLabel || 'Mock Exam'}
                            </span>
                          </div>
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic block py-1 group-hover:text-slate-600">
                          + Add evening mock / quiz...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}

          {/* RIGHT COLUMN: SATURDAY, SUNDAY & NOTES (STACKED VERTICALLY) */}
          <div className="flex flex-col bg-slate-50/40">
            
            {/* Saturday Box */}
            <div className="border-b border-slate-300">
              <div className="bg-slate-700 text-white px-3 py-2 flex items-center justify-between border-b border-slate-600 select-none">
                <span className="font-bold text-sm tracking-wide uppercase">
                  Saturday
                </span>
                <div className="w-7 h-6 bg-white text-slate-900 rounded font-black text-xs flex items-center justify-center font-mono shadow-xs">
                  {currentWeekPlan.saturday.dateNumber}
                </div>
              </div>

              <div className="p-2 space-y-1.5 min-h-[140px]">
                {currentWeekPlan.saturday.tasks.map((task, sIdx) => {
                  const cat = CATEGORIES[task.category] || CATEGORIES.topographical;
                  return (
                    <div
                      key={task.id || sIdx}
                      onClick={() =>
                        handleSlotClick('saturday', 'saturday', sIdx, 'Saturday', `Weekend Task ${sIdx + 1}`, task)
                      }
                      className={`p-2 rounded border cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlotCompletion('saturday', 'weekend', sIdx);
                          }}
                          className={`mt-0.5 w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center border ${
                            task.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[9px] font-bold uppercase tracking-tight px-1 py-0.2 rounded truncate block w-fit mb-0.5 ${cat.bgLight}`}>
                            {cat.shortLabel}
                          </span>
                          <p className={`text-xs font-medium leading-snug line-clamp-2 ${
                            task.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                          }`}>
                            {task.title || 'Untitled task'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    const newSatTask = createEmptySlot(`w${selectedWeek}-sat-${Date.now()}`, '10:00 - 11:30');
                    handleSlotClick('saturday', 'saturday', currentWeekPlan.saturday.tasks.length, 'Saturday', 'New Saturday Task', newSatTask);
                  }}
                  className="w-full py-1.5 px-2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 hover:border-slate-400 rounded-md transition-colors flex items-center justify-center gap-1 bg-white/70"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Weekend Task</span>
                </button>
              </div>
            </div>

            {/* Sunday Box */}
            <div className="border-b border-slate-300">
              <div className="bg-slate-700 text-white px-3 py-2 flex items-center justify-between border-b border-slate-600 select-none">
                <span className="font-bold text-sm tracking-wide uppercase">
                  Sunday
                </span>
                <div className="w-7 h-6 bg-white text-slate-900 rounded font-black text-xs flex items-center justify-center font-mono shadow-xs">
                  {currentWeekPlan.sunday.dateNumber}
                </div>
              </div>

              <div className="p-2 space-y-1.5 min-h-[140px]">
                {currentWeekPlan.sunday.tasks.map((task, suIdx) => {
                  const cat = CATEGORIES[task.category] || CATEGORIES.highway_code;
                  return (
                    <div
                      key={task.id || suIdx}
                      onClick={() =>
                        handleSlotClick('sunday', 'sunday', suIdx, 'Sunday', `Weekend Task ${suIdx + 1}`, task)
                      }
                      className={`p-2 rounded border cursor-pointer transition-all ${
                        task.completed
                          ? 'bg-emerald-50 border-emerald-200'
                          : 'bg-white border-slate-200 hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlotCompletion('sunday', 'weekend', suIdx);
                          }}
                          className={`mt-0.5 w-3.5 h-3.5 rounded shrink-0 flex items-center justify-center border ${
                            task.completed
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {task.completed && <CheckCircle2 className="w-3 h-3" />}
                        </button>
                        <div className="flex-1 min-w-0">
                          <span className={`text-[9px] font-bold uppercase tracking-tight px-1 py-0.2 rounded truncate block w-fit mb-0.5 ${cat.bgLight}`}>
                            {cat.shortLabel}
                          </span>
                          <p className={`text-xs font-medium leading-snug line-clamp-2 ${
                            task.completed ? 'text-slate-500 line-through' : 'text-slate-800'
                          }`}>
                            {task.title || 'Untitled task'}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    const newSunTask = createEmptySlot(`w${selectedWeek}-sun-${Date.now()}`, '14:00 - 15:30');
                    handleSlotClick('sunday', 'sunday', currentWeekPlan.sunday.tasks.length, 'Sunday', 'New Sunday Task', newSunTask);
                  }}
                  className="w-full py-1.5 px-2 text-[11px] font-semibold text-slate-500 hover:text-slate-800 border border-dashed border-slate-300 hover:border-slate-400 rounded-md transition-colors flex items-center justify-center gap-1 bg-white/70"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Weekend Task</span>
                </button>
              </div>
            </div>

            {/* Structured Notes Section (Lined box at the bottom-right for instructor feedback) */}
            <div className="flex-1 flex flex-col p-3 bg-amber-50/20">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Notes & Instructor Feedback
                </span>
                <span className="text-[9px] text-slate-400">auto-saved</span>
              </div>
              <textarea
                value={currentWeekPlan.notes || ''}
                onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Write instructor feedback, weak areas, application reference numbers, or DBS/Medical status updates..."
                rows={7}
                className="w-full flex-1 p-2.5 text-xs text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-amber-500 leading-relaxed resize-none shadow-2xs font-sans"
              />
            </div>

          </div>

        </div>

      </div>

      {/* Category Legend & Key */}
      <div className="no-print bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Module Categories:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {Object.values(CATEGORIES).map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs border ${cat.bgLight} ${cat.border}`}
              >
                <span className={`w-2 h-2 rounded-full ${cat.dotColor}`} />
                <span className="font-medium">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task Edit Modal */}
      <TaskEditModal
        isOpen={!!editingSlot}
        onClose={() => setEditingSlot(null)}
        onSave={handleSaveSlot}
        onClear={handleClearSlot}
        slotContext={editingSlot}
      />

      {/* Clear Week In-App Confirmation Modal */}
      <ConfirmModal
        isOpen={isClearWeekConfirmOpen}
        title="Clear Current Week Schedule"
        message={`Are you sure you want to clear all training slots and notes for Week ${selectedWeek} (${FULL_MONTH_NAMES[selectedMonth]} ${currentYear})?`}
        confirmLabel="Clear Week"
        isDestructive={true}
        onConfirm={handleConfirmClearWeek}
        onCancel={() => setIsClearWeekConfirmOpen(false)}
      />

    </div>
  );
};
