export type CouncilOption = string;

export type TargetBadgeType =
  | 'Private Hire / Uber'
  | 'Hackney Carriage'
  | 'Dual Driver';

export type TaskCategory =
  | 'topographical'
  | 'seru'
  | 'safeguarding'
  | 'mock_test'
  | 'highway_code'
  | 'english'
  | 'admin';

export interface CategoryMeta {
  id: TaskCategory;
  name: string;
  shortLabel: string;
  bgLight: string;
  textDark: string;
  border: string;
  dotColor: string;
}

export interface SlotTask {
  id: string;
  title: string;
  category: TaskCategory;
  time?: string;
  completed: boolean;
  notes?: string;
  instructor?: string;
}

export interface DaySchedule {
  dayName: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  dateNumber: number;
  morningPrep: SlotTask;
  trainingModules: SlotTask[]; // Exactly 7 slots
  eveningPractice: SlotTask;
}

export interface WeekendDaySchedule {
  dayName: 'Saturday' | 'Sunday';
  dateNumber: number;
  tasks: SlotTask[];
}

export interface WeekPlan {
  weekNumber: number; // 1, 2, 3, 4
  dateRange: string; // e.g. "Nov 2 - Nov 8, 2026"
  days: {
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
  };
  saturday: WeekendDaySchedule;
  sunday: WeekendDaySchedule;
  notes: string;
}

export interface TraineeStudent {
  id: string;
  fullName: string;
  phoneNumber: string;
  council: CouncilOption;
  customCouncil?: string;
  badgeType: TargetBadgeType;
  examDate?: string;
  applicationRef: string;
  dbsStatus: 'Approved' | 'In Review' | 'Pending Submission';
  medicalStatus: 'Group 2 Passed' | 'Doctor Appt Booked' | 'Pending';
  instructorNotes: string;
  createdAt: string;
  // Year -> Month (0-11) -> Week (1-4)
  schedules: Record<string, Record<number, Record<number, WeekPlan>>>;
}
