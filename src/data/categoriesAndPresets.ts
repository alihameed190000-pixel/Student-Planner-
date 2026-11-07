import { CategoryMeta, CouncilOption, TargetBadgeType, TaskCategory } from '../types/planner';

export const COUNCILS: CouncilOption[] = [
  'TfL (Transport for London)',
  'Wolverhampton Council',
  'Manchester City Council',
  'Bury Council',
  'Salford City Council',
  'Birmingham City Council',
  'Leeds City Council',
  'Other',
];

export const BADGE_TYPES: TargetBadgeType[] = [
  'Private Hire / Uber',
  'Hackney Carriage',
  'Dual Driver',
];

export const CATEGORIES: Record<TaskCategory, CategoryMeta> = {
  topographical: {
    id: 'topographical',
    name: 'Topographical & Route Finding',
    shortLabel: 'Topographical',
    bgLight: 'bg-blue-50 text-blue-800',
    textDark: 'text-blue-700',
    border: 'border-blue-200',
    dotColor: 'bg-blue-600',
  },
  seru: {
    id: 'seru',
    name: 'SERU & Regulatory Compliance',
    shortLabel: 'SERU / Rules',
    bgLight: 'bg-emerald-50 text-emerald-800',
    textDark: 'text-emerald-700',
    border: 'border-emerald-200',
    dotColor: 'bg-emerald-600',
  },
  safeguarding: {
    id: 'safeguarding',
    name: 'Safeguarding & Equality Act',
    shortLabel: 'Safeguarding',
    bgLight: 'bg-purple-50 text-purple-800',
    textDark: 'text-purple-700',
    border: 'border-purple-200',
    dotColor: 'bg-purple-600',
  },
  mock_test: {
    id: 'mock_test',
    name: 'Mock Exam & Timed Assessment',
    shortLabel: 'Mock Exam',
    bgLight: 'bg-amber-50 text-amber-900',
    textDark: 'text-amber-700',
    border: 'border-amber-200',
    dotColor: 'bg-amber-500',
  },
  highway_code: {
    id: 'highway_code',
    name: 'Highway Code & Road Signs',
    shortLabel: 'Highway Code',
    bgLight: 'bg-rose-50 text-rose-800',
    textDark: 'text-rose-700',
    border: 'border-rose-200',
    dotColor: 'bg-rose-600',
  },
  english: {
    id: 'english',
    name: 'English Speaking & Listening',
    shortLabel: 'English Assess.',
    bgLight: 'bg-cyan-50 text-cyan-800',
    textDark: 'text-cyan-700',
    border: 'border-cyan-200',
    dotColor: 'bg-cyan-600',
  },
  admin: {
    id: 'admin',
    name: 'Licensing Admin, DBS & Medical',
    shortLabel: 'Admin / DBS',
    bgLight: 'bg-slate-100 text-slate-800',
    textDark: 'text-slate-700',
    border: 'border-slate-200',
    dotColor: 'bg-slate-600',
  },
};

export const QUICK_PRESETS: { title: string; category: TaskCategory; time?: string }[] = [
  {
    title: 'Topographical: Direct route tracing on A-Z Master Atlas',
    category: 'topographical',
    time: '09:00 - 10:15',
  },
  {
    title: 'Topographical: River crossings & Rotherhithe/Blackwall restrictions',
    category: 'topographical',
    time: '10:30 - 11:30',
  },
  {
    title: 'Topographical: Central London 1-way systems & congestion zone',
    category: 'topographical',
    time: '13:00 - 14:00',
  },
  {
    title: 'SERU: Equality Act 2010 & Assistance Dogs obligations',
    category: 'seru',
    time: '11:45 - 12:45',
  },
  {
    title: 'SERU: Driver safety, emergency procedures & vehicle checks',
    category: 'seru',
    time: '14:15 - 15:15',
  },
  {
    title: 'SERU: Passenger records, bookings & lost property regulations',
    category: 'seru',
    time: '15:30 - 16:30',
  },
  {
    title: 'Safeguarding: Child Sexual Exploitation (CSE) & County Lines indicators',
    category: 'safeguarding',
    time: '10:00 - 11:00',
  },
  {
    title: 'Safeguarding: Vulnerable adults & disability awareness protocol',
    category: 'safeguarding',
    time: '14:00 - 15:00',
  },
  {
    title: 'Highway Code: Stopping distances, road markings & bus lane hours',
    category: 'highway_code',
    time: '08:30 - 09:15',
  },
  {
    title: 'Highway Code: Multi-lane roundabouts & motorway speed limits',
    category: 'highway_code',
    time: '16:00 - 17:00',
  },
  {
    title: 'Mock Exam: 45-min Timed Online SERU MCQ Assessment (>80% required)',
    category: 'mock_test',
    time: '17:00 - 18:00',
  },
  {
    title: 'Mock Exam: 20-Point Council Topographical Drawing Assessment',
    category: 'mock_test',
    time: '18:15 - 19:15',
  },
  {
    title: 'Local Knowledge: Major railway stations, hospitals & terminals drill',
    category: 'topographical',
    time: '11:30 - 12:30',
  },
  {
    title: 'English Assessment: Verbal dialogue & passenger dispute resolution',
    category: 'english',
    time: '13:30 - 14:15',
  },
  {
    title: 'Admin: Verify Enhanced DBS Certificate & Update Service enrolment',
    category: 'admin',
    time: '08:00 - 08:45',
  },
  {
    title: 'Admin: Group 2 Medical D4 Form review & Council portal upload',
    category: 'admin',
    time: '16:30 - 17:15',
  },
];

export const DEFAULT_SLOT_TIMES: string[] = [
  '09:00 - 09:50',
  '10:00 - 10:50',
  '11:00 - 11:50',
  '12:45 - 13:35',
  '13:45 - 14:35',
  '14:45 - 15:35',
  '15:45 - 16:35',
];

export const MONTH_NAMES = [
  'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
];

export const FULL_MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];
