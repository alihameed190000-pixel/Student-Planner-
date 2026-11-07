import React, { useState, useEffect } from 'react';
import { X, User, Phone, Landmark, Award, Calendar, FileText, CheckCircle2, ShieldAlert, Plus, ChevronDown } from 'lucide-react';
import { TraineeStudent, TargetBadgeType } from '../types/planner';
import { BADGE_TYPES } from '../data/categoriesAndPresets';
import { createEmptyWeek } from '../data/initialData';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (trainee: TraineeStudent) => void;
  traineeToEdit?: TraineeStudent | null;
  councils: string[];
  onAddNewCouncil?: (newCouncil: string) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  traineeToEdit,
  councils,
  onAddNewCouncil,
}) => {
  if (!isOpen) return null;

  const isEditing = !!traineeToEdit;

  const [fullName, setFullName] = useState(traineeToEdit?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(traineeToEdit?.phoneNumber || '');
  const [council, setCouncil] = useState<string>(
    traineeToEdit?.council || councils[0] || 'TfL (Transport for London)'
  );
  const [customCouncil, setCustomCouncil] = useState(traineeToEdit?.customCouncil || '');
  const [isAddingNewCouncilInline, setIsAddingNewCouncilInline] = useState(false);
  const [inlineCouncilInput, setInlineCouncilInput] = useState('');
  const [badgeType, setBadgeType] = useState<TargetBadgeType>(
    traineeToEdit?.badgeType || 'Private Hire / Uber'
  );
  const [examDate, setExamDate] = useState(traineeToEdit?.examDate || '');
  const [applicationRef, setApplicationRef] = useState(
    traineeToEdit?.applicationRef || ''
  );
  const [dbsStatus, setDbsStatus] = useState<TraineeStudent['dbsStatus']>(
    traineeToEdit?.dbsStatus || 'In Review'
  );
  const [medicalStatus, setMedicalStatus] = useState<TraineeStudent['medicalStatus']>(
    traineeToEdit?.medicalStatus || 'Doctor Appt Booked'
  );
  const [instructorNotes, setInstructorNotes] = useState(
    traineeToEdit?.instructorNotes || ''
  );

  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    if (traineeToEdit) {
      setFullName(traineeToEdit.fullName);
      setPhoneNumber(traineeToEdit.phoneNumber);
      setCouncil(traineeToEdit.council);
      setCustomCouncil(traineeToEdit.customCouncil || '');
      setBadgeType(traineeToEdit.badgeType);
      setExamDate(traineeToEdit.examDate || '');
      setApplicationRef(traineeToEdit.applicationRef || '');
      setDbsStatus(traineeToEdit.dbsStatus);
      setMedicalStatus(traineeToEdit.medicalStatus);
      setInstructorNotes(traineeToEdit.instructorNotes || '');
    } else {
      setFullName('');
      setPhoneNumber('');
      setCouncil('TfL (Transport for London)');
      setCustomCouncil('');
      setBadgeType('Private Hire / Uber');
      setExamDate('');
      setApplicationRef(`STS-${Math.floor(10000 + Math.random() * 90000)}`);
      setDbsStatus('In Review');
      setMedicalStatus('Doctor Appt Booked');
      setInstructorNotes('');
    }
    setPhoneError('');
  }, [traineeToEdit, isOpen]);

  // Clean UK phone number formatting helper
  const handlePhoneChange = (val: string) => {
    setPhoneNumber(val);
    const cleaned = val.replace(/\s+/g, '');
    if (cleaned.length > 0 && !/^(07|\+447)\d{8,9}$/.test(cleaned) && cleaned.length > 4) {
      setPhoneError('Please enter a valid UK mobile number (e.g. 07XXX XXXXXX or +44 7XXX XXXXXX)');
    } else {
      setPhoneError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) return;
    if (!phoneNumber.trim()) {
      setPhoneError('Phone number is required');
      return;
    }

    const updatedTrainee: TraineeStudent = {
      id: traineeToEdit?.id || `trainee-${Date.now()}`,
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      council,
      customCouncil: council === 'Other' ? customCouncil.trim() : undefined,
      badgeType,
      examDate: examDate || undefined,
      applicationRef: applicationRef.trim() || `STS-${Math.floor(10000 + Math.random() * 90000)}`,
      dbsStatus,
      medicalStatus,
      instructorNotes: instructorNotes.trim(),
      createdAt: traineeToEdit?.createdAt || new Date().toISOString().split('T')[0],
      schedules: traineeToEdit?.schedules || {
        '2026': {
          10: {
            1: createEmptyWeek(1, 10, 2026),
            2: createEmptyWeek(2, 10, 2026),
            3: createEmptyWeek(3, 10, 2026),
            4: createEmptyWeek(4, 10, 2026),
          },
        },
      },
    };

    onSave(updatedTrainee);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isEditing ? 'Edit Driver Trainee Profile' : 'Register New Driver Trainee'}
              </h3>
              <p className="text-xs text-slate-400">
                Council exam preparation and study planner record
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Trainee Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Student Full Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Tariq Mahmood"
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-800"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* UK Phone Number */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              UK Mobile Phone Number <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="e.g. 07712 345678"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white border rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800 ${
                  phoneError ? 'border-rose-400 focus:border-rose-500' : 'border-slate-300 focus:border-amber-500'
                }`}
                required
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
            {phoneError && (
              <p className="text-[11px] text-rose-600 mt-1">{phoneError}</p>
            )}
          </div>

          {/* Council & Badge Type Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Licensing Council <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsAddingNewCouncilInline(!isAddingNewCouncilInline)}
                  className="text-[11px] font-semibold text-amber-600 hover:text-amber-800 flex items-center gap-0.5"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isAddingNewCouncilInline ? 'Cancel' : '+ Add Council'}</span>
                </button>
              </div>

              {isAddingNewCouncilInline ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={inlineCouncilInput}
                    onChange={(e) => setInlineCouncilInput(e.target.value)}
                    placeholder="Enter new council name..."
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const trimmed = inlineCouncilInput.trim();
                      if (trimmed) {
                        if (onAddNewCouncil) onAddNewCouncil(trimmed);
                        setCouncil(trimmed);
                        setInlineCouncilInput('');
                        setIsAddingNewCouncilInline(false);
                      }
                    }}
                    className="px-2.5 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg shrink-0"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={council}
                    onChange={(e) => setCouncil(e.target.value)}
                    className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800 appearance-none cursor-pointer"
                  >
                    {councils.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <Landmark className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Target Badge Type <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={badgeType}
                  onChange={(e) => setBadgeType(e.target.value as TargetBadgeType)}
                  className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800 appearance-none cursor-pointer"
                >
                  {BADGE_TYPES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <Award className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Custom council input if "Other" */}
          {council === 'Other' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Specify Licensing Authority Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={customCouncil}
                onChange={(e) => setCustomCouncil(e.target.value)}
                placeholder="e.g. Sheffield City Council"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                required
              />
            </div>
          )}

          {/* Exam Date & App Ref Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Council Exam / Assessment Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
                />
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Application / Badge Reference
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={applicationRef}
                  onChange={(e) => setApplicationRef(e.target.value)}
                  placeholder="e.g. TFL-PHV-99420"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800 font-mono"
                />
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* DBS & Medical Compliance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Enhanced DBS Status
              </label>
              <select
                value={dbsStatus}
                onChange={(e) => setDbsStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-slate-800"
              >
                <option value="Approved">Approved / Cleared</option>
                <option value="In Review">In Review with DBS</option>
                <option value="Pending Submission">Pending Submission</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                Group 2 Medical Form (D4)
              </label>
              <select
                value={medicalStatus}
                onChange={(e) => setMedicalStatus(e.target.value as any)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-amber-500 text-slate-800"
              >
                <option value="Group 2 Passed">Group 2 Passed & Stamped</option>
                <option value="Doctor Appt Booked">Doctor Appt Booked</option>
                <option value="Pending">Pending / Not Started</option>
              </select>
            </div>
          </div>

          {/* Instructor Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Instructor Notes & Target Areas
            </label>
            <textarea
              value={instructorNotes}
              onChange={(e) => setInstructorNotes(e.target.value)}
              placeholder="e.g. Focus on Topographical route planning and SERU Equality Act questions..."
              rows={3}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-amber-500 text-slate-800"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Save Changes' : 'Create Trainee'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
