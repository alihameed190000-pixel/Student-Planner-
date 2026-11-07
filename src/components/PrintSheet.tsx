import React from 'react';
import { Printer, X, Car, CheckCircle2 } from 'lucide-react';
import { TraineeStudent, WeekPlan } from '../types/planner';
import { CATEGORIES } from '../data/categoriesAndPresets';

interface PrintSheetProps {
  trainee: TraineeStudent;
  weekPlan: WeekPlan;
  monthName: string;
  year: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PrintSheet: React.FC<PrintSheetProps> = ({
  trainee,
  weekPlan,
  monthName,
  year,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const weekdays = [
    { label: 'Monday', schedule: weekPlan.days.monday },
    { label: 'Tuesday', schedule: weekPlan.days.tuesday },
    { label: 'Wednesday', schedule: weekPlan.days.wednesday },
    { label: 'Thursday', schedule: weekPlan.days.thursday },
    { label: 'Friday', schedule: weekPlan.days.friday },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto print:static print:p-0 print:bg-white print:overflow-visible print:z-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-5xl my-auto overflow-hidden print:border-none print:shadow-none print:max-w-none print:w-full print:m-0 print:rounded-none">
        
        {/* On-screen control bar (hidden in print) */}
        <div className="no-print bg-slate-900 text-white px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-400" />
            <span className="font-bold text-sm">Printable Weekly Planner Sheet</span>
            <span className="text-xs text-slate-400">
              ({trainee.fullName} — {monthName} Week {weekPlan.weekNumber})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Now (Ctrl+P)</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE BODY SHEET (matches the classic weekly planner format) */}
        <div className="p-4 sm:p-6 print:p-0 bg-white text-slate-900 font-sans">
          
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 text-amber-400 rounded-lg flex items-center justify-center font-black">
                <Car className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">
                  SMART TAXI SOLUTIONS
                </h1>
                <p className="text-[11px] font-bold text-slate-600 tracking-wider uppercase mt-0.5">
                  Driver Training & Council Licensing Study Planner
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm font-black text-slate-900 uppercase">
                {monthName} {year} — WEEK {weekPlan.weekNumber}
              </div>
              <div className="text-[11px] text-slate-600 font-mono">
                {weekPlan.dateRange}
              </div>
            </div>
          </div>

          {/* Student Dossier Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 bg-slate-100 rounded-lg border border-slate-300 text-xs mb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Trainee Name:</span>
              <span className="font-bold text-slate-900 text-sm">{trainee.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Contact Phone:</span>
              <span className="font-mono text-slate-800 font-semibold">{trainee.phoneNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Licensing Council:</span>
              <span className="font-bold text-slate-900">{trainee.council}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Target Badge / Exam:</span>
              <span className="font-semibold text-slate-800">
                {trainee.badgeType} {trainee.examDate ? `• ${trainee.examDate}` : ''}
              </span>
            </div>
          </div>

          {/* 6-Column Grid Replicating Reference Layout */}
          <div className="border border-slate-400 rounded-lg overflow-hidden">
            <div className="grid grid-cols-6 divide-x divide-slate-400">
              
              {/* Left 5 Weekdays */}
              {weekdays.map(({ label, schedule }) => (
                <div key={label} className="flex flex-col">
                  
                  {/* Slate Header */}
                  <div className="bg-slate-700 text-white p-1.5 flex items-center justify-between text-xs font-bold border-b border-slate-600">
                    <span className="uppercase text-[11px]">{label}</span>
                    <span className="w-5 h-5 bg-white text-slate-900 rounded font-black text-[10px] flex items-center justify-center font-mono">
                      {schedule.dateNumber}
                    </span>
                  </div>

                  {/* Morning Prep */}
                  <div className="p-1.5 border-b border-slate-300 bg-slate-50 min-h-[50px]">
                    <div className="text-[8px] font-extrabold uppercase text-slate-500 mb-0.5">
                      Morning Prep (08:00)
                    </div>
                    {schedule.morningPrep.title ? (
                      <p className={`text-[10px] leading-tight ${schedule.morningPrep.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}`}>
                        {schedule.morningPrep.title}
                      </p>
                    ) : (
                      <span className="text-[9px] text-slate-300 italic">—</span>
                    )}
                  </div>

                  {/* 7 Module Slots */}
                  <div className="divide-y divide-slate-200 flex-1">
                    {schedule.trainingModules.map((m, idx) => (
                      <div key={idx} className="p-1 min-h-[46px] flex flex-col justify-between">
                        <div className="flex items-center justify-between text-[8px] text-slate-400 font-mono mb-0.5">
                          <span>Slot {idx + 1}</span>
                          <span>{m.time ? m.time.split(' - ')[0] : ''}</span>
                        </div>
                        {m.title ? (
                          <p className={`text-[9.5px] leading-tight font-medium ${m.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                            {m.title}
                          </p>
                        ) : (
                          <div className="h-3" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Evening Practice */}
                  <div className="p-1.5 border-t border-slate-300 bg-slate-50 min-h-[50px]">
                    <div className="text-[8px] font-extrabold uppercase text-slate-500 mb-0.5">
                      Evening Practice (17:30)
                    </div>
                    {schedule.eveningPractice.title ? (
                      <p className={`text-[10px] leading-tight ${schedule.eveningPractice.completed ? 'line-through text-slate-400' : 'font-semibold text-slate-800'}`}>
                        {schedule.eveningPractice.title}
                      </p>
                    ) : (
                      <span className="text-[9px] text-slate-300 italic">—</span>
                    )}
                  </div>

                </div>
              ))}

              {/* Saturday, Sunday & Notes Column */}
              <div className="flex flex-col">
                
                {/* Saturday */}
                <div className="border-b border-slate-300">
                  <div className="bg-slate-700 text-white p-1.5 flex items-center justify-between text-xs font-bold border-b border-slate-600">
                    <span className="uppercase text-[11px]">Saturday</span>
                    <span className="w-5 h-5 bg-white text-slate-900 rounded font-black text-[10px] flex items-center justify-center font-mono">
                      {weekPlan.saturday.dateNumber}
                    </span>
                  </div>
                  <div className="p-1.5 space-y-1 min-h-[90px]">
                    {weekPlan.saturday.tasks.map((t, idx) => (
                      <p key={idx} className={`text-[9.5px] leading-tight ${t.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'}`}>
                        • {t.title}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Sunday */}
                <div className="border-b border-slate-300">
                  <div className="bg-slate-700 text-white p-1.5 flex items-center justify-between text-xs font-bold border-b border-slate-600">
                    <span className="uppercase text-[11px]">Sunday</span>
                    <span className="w-5 h-5 bg-white text-slate-900 rounded font-black text-[10px] flex items-center justify-center font-mono">
                      {weekPlan.sunday.dateNumber}
                    </span>
                  </div>
                  <div className="p-1.5 space-y-1 min-h-[90px]">
                    {weekPlan.sunday.tasks.map((t, idx) => (
                      <p key={idx} className={`text-[9.5px] leading-tight ${t.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800'}`}>
                        • {t.title}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Structured Notes */}
                <div className="p-2 flex-1 flex flex-col bg-slate-50/50">
                  <div className="text-[8px] font-extrabold uppercase text-slate-600 mb-1">
                    Instructor Notes & Weak Areas:
                  </div>
                  <p className="text-[9.5px] text-slate-800 whitespace-pre-wrap leading-relaxed flex-1">
                    {weekPlan.notes || 'No specific instructor notes registered for this week.'}
                  </p>
                </div>

              </div>

            </div>
          </div>

          {/* Footer Sign-off Section */}
          <div className="mt-4 pt-3 border-t border-slate-300 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-6">
              <div>
                <span className="font-bold text-slate-800">Trainee Signature:</span>
                <span className="inline-block w-40 border-b border-slate-400 ml-2"></span>
              </div>
              <div>
                <span className="font-bold text-slate-800">Instructor Sign-off:</span>
                <span className="inline-block w-40 border-b border-slate-400 ml-2"></span>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-500">
              Smart Taxi Solutions • Official Study Planner Log • Form STS-W8
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
