import React, { useState } from 'react';
import {
  Search,
  Filter,
  Users,
  Calendar,
  Phone,
  Landmark,
  Award,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Edit,
  GraduationCap,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { TraineeStudent, WeekPlan, TaskCategory } from '../types/planner';
import { COUNCILS, CATEGORIES, MONTH_NAMES, FULL_MONTH_NAMES } from '../data/categoriesAndPresets';
import { ConfirmModal } from './ConfirmModal';

interface MasterOverviewProps {
  trainees: TraineeStudent[];
  onSelectTraineeForPlanner: (traineeId: string) => void;
  onEditTrainee: (trainee: TraineeStudent) => void;
  onDeleteTrainee: (traineeId: string) => void;
  onAddNewTrainee: () => void;
  councils: string[];
  onOpenCouncilModal?: () => void;
}

export const MasterOverview: React.FC<MasterOverviewProps> = ({
  trainees,
  onSelectTraineeForPlanner,
  onEditTrainee,
  onDeleteTrainee,
  onAddNewTrainee,
  councils,
  onOpenCouncilModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [councilFilter, setCouncilFilter] = useState<string>('ALL');
  const [badgeFilter, setBadgeFilter] = useState<string>('ALL');
  const [viewSubMode, setViewSubMode] = useState<'roster' | 'timetable'>('roster');
  const [selectedTimetableDay, setSelectedTimetableDay] = useState<
    'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday'
  >('monday');

  // Expanded student cards in roster
  const [expandedStudentIds, setExpandedStudentIds] = useState<Record<string, boolean>>({
    'trainee-1': true, // Tariq expanded by default
  });
  const [traineePendingDelete, setTraineePendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedStudentIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter trainees
  const filteredTrainees = trainees.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.phoneNumber.includes(searchTerm) ||
      t.applicationRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.council.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCouncil =
      councilFilter === 'ALL' || t.council === councilFilter;

    const matchesBadge =
      badgeFilter === 'ALL' || t.badgeType === badgeFilter;

    return matchesSearch && matchesCouncil && matchesBadge;
  });

  // Calculate statistics for a trainee for current week (November 2026, Week 1)
  const getTraineeWeekStats = (trainee: TraineeStudent) => {
    const weekPlan: WeekPlan | undefined =
      trainee.schedules?.['2026']?.[10]?.[1];
    if (!weekPlan) return { total: 0, completed: 0, pct: 0 };

    let total = 0;
    let completed = 0;

    Object.values(weekPlan.days).forEach((d) => {
      if (d.morningPrep.title) {
        total++;
        if (d.morningPrep.completed) completed++;
      }
      d.trainingModules.forEach((m) => {
        if (m.title) {
          total++;
          if (m.completed) completed++;
        }
      });
      if (d.eveningPractice.title) {
        total++;
        if (d.eveningPractice.completed) completed++;
      }
    });

    weekPlan.saturday.tasks.forEach((t) => {
      if (t.title) {
        total++;
        if (t.completed) completed++;
      }
    });
    weekPlan.sunday.tasks.forEach((t) => {
      if (t.title) {
        total++;
        if (t.completed) completed++;
      }
    });

    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pct, weekPlan };
  };

  // Aggregate KPI stats
  const totalStudents = trainees.length;
  const examsDueSoon = trainees.filter((t) => t.examDate).length;
  const avgCompletion = Math.round(
    trainees.reduce((acc, t) => acc + getTraineeWeekStats(t).pct, 0) /
      (trainees.length || 1)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Banner & KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Trainees
            </span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {totalStudents}
            </span>
            <span className="text-xs text-slate-500">active licence applicants</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average Study Progress
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {avgCompletion}%
            </span>
            <span className="text-xs text-emerald-600 font-medium">on current week modules</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Exams Scheduled
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {examsDueSoon}
            </span>
            <span className="text-xs text-amber-600 font-medium">booked council dates</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Partner Councils
            </span>
            <Landmark className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900 font-mono">
              {new Set(trainees.map((t) => t.council)).size}
            </span>
            <span className="text-xs text-slate-500">licensing authorities</span>
          </div>
        </div>

      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student name, UK phone, or council ref..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:bg-white text-slate-800 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>

          {/* Filters & View Sub-Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Council Filter */}
            <div className="flex items-center gap-1.5">
              <select
                value={councilFilter}
                onChange={(e) => setCouncilFilter(e.target.value)}
                className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">All Councils ({trainees.length})</option>
                {councils.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {onOpenCouncilModal && (
                <button
                  onClick={onOpenCouncilModal}
                  title="Add or manage licensing councils"
                  className="px-2.5 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ Add Council</span>
                </button>
              )}
            </div>

            {/* Badge Type Filter */}
            <select
              value={badgeFilter}
              onChange={(e) => setBadgeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Badge Types</option>
              <option value="Private Hire / Uber">Private Hire / Uber</option>
              <option value="Hackney Carriage">Hackney Carriage</option>
              <option value="Dual Driver">Dual Driver</option>
            </select>

            {/* View Sub-mode Switcher */}
            <div className="flex items-center p-0.5 bg-slate-100 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewSubMode('roster')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  viewSubMode === 'roster'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Trainee Roster
              </button>
              <button
                onClick={() => setViewSubMode('timetable')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  viewSubMode === 'timetable'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Daily Timetable Matrix
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* SUB-VIEW 1: TRAINEE ROSTER & INLINE WEEKLY PREVIEW */}
      {viewSubMode === 'roster' && (
        <div className="space-y-4">
          {filteredTrainees.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-700">No driver trainees found</h4>
              <p className="text-xs text-slate-500 mt-1">
                Try adjusting your search query or filters.
              </p>
            </div>
          ) : (
            filteredTrainees.map((trainee) => {
              const { total, completed, pct, weekPlan } = getTraineeWeekStats(trainee);
              const isExpanded = !!expandedStudentIds[trainee.id];

              return (
                <div
                  key={trainee.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden"
                >
                  {/* Card Header Row */}
                  <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Trainee Identity & Badge */}
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 font-black text-base flex items-center justify-center shrink-0 shadow-xs">
                        {trainee.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">
                            {trainee.fullName}
                          </h3>
                          <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-600 rounded border border-slate-200">
                            {trainee.applicationRef}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1 font-mono text-slate-700 font-medium">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {trainee.phoneNumber}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-800">
                            <Landmark className="w-3.5 h-3.5 text-slate-400" />
                            {trainee.council}
                          </span>
                          <span className="flex items-center gap-1 text-slate-600">
                            <Award className="w-3.5 h-3.5 text-amber-500" />
                            {trainee.badgeType}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Exam Info */}
                    <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                      
                      {/* Weekly Progress */}
                      <div className="min-w-[140px] sm:min-w-[180px]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500 font-medium">Week 1 Progress:</span>
                          <span className="font-bold text-slate-800 font-mono text-[11px]">
                            {pct}% ({completed}/{total})
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Exam Date Tag */}
                      <div className="text-right">
                        {trainee.examDate ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-xs font-semibold">
                            <Clock className="w-3.5 h-3.5 text-amber-600" />
                            <span>Exam: {trainee.examDate}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            Exam to be booked
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        
                        <button
                          onClick={() => toggleExpand(trainee.id)}
                          className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <span>{isExpanded ? 'Hide' : 'Quick Preview'}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => onSelectTraineeForPlanner(trainee.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-2xs transition-colors"
                        >
                          <span>Jump to Full Planner</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onEditTrainee(trainee)}
                          title="Edit trainee profile"
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => {
                            setTraineePendingDelete({ id: trainee.id, name: trainee.fullName });
                          }}
                          title="Delete trainee"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </div>

                  </div>

                  {/* INLINE WEEK SCHEDULE EXPANSION */}
                  {isExpanded && weekPlan && (
                    <div className="bg-slate-50/80 border-t border-slate-200 p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                            Current Week Study Schedule (Week 1 — Nov 2026)
                          </span>
                          <span className="text-[11px] text-slate-400">
                            Showing morning, core modules, and evening study
                          </span>
                        </div>
                        <button
                          onClick={() => onSelectTraineeForPlanner(trainee.id)}
                          className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 underline underline-offset-2"
                        >
                          Open in Full 7-Slot Grid &rarr;
                        </button>
                      </div>

                      {/* 5-Day Compact Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
                        {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map(
                          (dayKey) => {
                            const d = weekPlan.days[dayKey];
                            const activeModules = d.trainingModules.filter((m) => m.title);
                            return (
                              <div
                                key={dayKey}
                                className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-2 shadow-2xs"
                              >
                                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                                  <span className="text-xs font-bold uppercase text-slate-800">
                                    {d.dayName}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-500 font-bold bg-slate-100 px-1.5 py-0.2 rounded">
                                    {d.dateNumber} Nov
                                  </span>
                                </div>

                                {/* Morning */}
                                <div className="text-[11px]">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                                    Morning:
                                  </span>
                                  <p className={`line-clamp-1 font-medium ${
                                    d.morningPrep.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                                  }`}>
                                    {d.morningPrep.title || 'No scheduled task'}
                                  </p>
                                </div>

                                {/* Active Modules Count */}
                                <div className="text-[11px]">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                                    Class Modules ({activeModules.length}/7):
                                  </span>
                                  <div className="space-y-1 mt-0.5">
                                    {activeModules.slice(0, 2).map((m, mIdx) => (
                                      <p
                                        key={mIdx}
                                        className={`line-clamp-1 text-[10px] leading-tight ${
                                          m.completed ? 'text-slate-400 line-through' : 'text-slate-800 font-medium'
                                        }`}
                                      >
                                        • {m.title}
                                      </p>
                                    ))}
                                    {activeModules.length > 2 && (
                                      <span className="text-[10px] text-slate-400 italic block">
                                        + {activeModules.length - 2} more modules
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Evening */}
                                <div className="text-[11px] pt-1 border-t border-slate-100">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">
                                    Evening:
                                  </span>
                                  <p className={`line-clamp-1 font-medium text-[10px] ${
                                    d.eveningPractice.completed ? 'text-slate-400 line-through' : 'text-slate-700'
                                  }`}>
                                    {d.eveningPractice.title || 'Revision / Quiz'}
                                  </p>
                                </div>

                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Instructor Feedback Snippet */}
                      {trainee.instructorNotes && (
                        <div className="mt-3 p-2.5 bg-amber-50/60 border border-amber-200/60 rounded-lg text-xs text-amber-900 flex items-start gap-2">
                          <BookOpen className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold mr-1">Trainee Notes:</span>
                            {trainee.instructorNotes}
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      )}

      {/* SUB-VIEW 2: MASTER DAILY TIMETABLE MATRIX */}
      {viewSubMode === 'timetable' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          
          {/* Day Selector */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Daily Master Training Timetable
              </h3>
              <p className="text-xs text-slate-500">
                Inspect which students have scheduled study & classes on this day
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              {(['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as const).map((dayKey) => {
                const label = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
                return (
                  <button
                    key={dayKey}
                    onClick={() => setSelectedTimetableDay(dayKey)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      selectedTimetableDay === dayKey
                        ? 'bg-slate-800 text-amber-400 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timetable Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-800 text-white font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3 rounded-tl-lg">Driver Student</th>
                  <th className="py-2.5 px-3">Council & Badge</th>
                  <th className="py-2.5 px-3">Morning Prep</th>
                  <th className="py-2.5 px-3">Module Highlights</th>
                  <th className="py-2.5 px-3">Evening Practice</th>
                  <th className="py-2.5 px-3 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTrainees.map((trainee) => {
                  const daySchedule =
                    trainee.schedules?.['2026']?.[10]?.[1]?.days?.[selectedTimetableDay];
                  const morning = daySchedule?.morningPrep?.title;
                  const evening = daySchedule?.eveningPractice?.title;
                  const activeModules =
                    daySchedule?.trainingModules.filter((m) => m.title) || [];

                  return (
                    <tr key={trainee.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        {trainee.fullName}
                        <span className="block text-[11px] font-mono text-slate-400 font-normal">
                          {trainee.phoneNumber}
                        </span>
                      </td>

                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-800 block">
                          {trainee.council}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {trainee.badgeType}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        {morning ? (
                          <span className={`line-clamp-2 leading-tight ${
                            daySchedule?.morningPrep.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                          }`}>
                            {morning}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">None scheduled</span>
                        )}
                      </td>

                      <td className="py-3 px-3 max-w-sm">
                        {activeModules.length > 0 ? (
                          <div className="space-y-1">
                            {activeModules.slice(0, 2).map((m, mIdx) => (
                              <div key={mIdx} className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold px-1 rounded ${
                                  CATEGORIES[m.category]?.bgLight || 'bg-slate-100'
                                }`}>
                                  {CATEGORIES[m.category]?.shortLabel || 'Mod'}
                                </span>
                                <span className={`line-clamp-1 ${m.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                  {m.title}
                                </span>
                              </div>
                            ))}
                            {activeModules.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                + {activeModules.length - 2} additional training slots
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">No class slots assigned</span>
                        )}
                      </td>

                      <td className="py-3 px-3 max-w-xs">
                        {evening ? (
                          <span className={`line-clamp-2 leading-tight ${
                            daySchedule?.eveningPractice.completed ? 'text-slate-400 line-through' : 'text-slate-800'
                          }`}>
                            {evening}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Independent study</span>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <button
                          onClick={() => onSelectTraineeForPlanner(trainee.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded shadow-2xs transition-colors"
                        >
                          Open Planner
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* Delete Trainee Confirmation Modal */}
      <ConfirmModal
        isOpen={!!traineePendingDelete}
        title="Delete Driver Trainee Record"
        message={`Are you sure you want to permanently delete the profile and study schedules for "${traineePendingDelete?.name}"?`}
        confirmLabel="Delete Trainee"
        isDestructive={true}
        onConfirm={() => {
          if (traineePendingDelete) {
            onDeleteTrainee(traineePendingDelete.id);
            setTraineePendingDelete(null);
          }
        }}
        onCancel={() => setTraineePendingDelete(null)}
      />

    </div>
  );
};
