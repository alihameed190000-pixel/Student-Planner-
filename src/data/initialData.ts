import { TraineeStudent, WeekPlan, DaySchedule, WeekendDaySchedule, SlotTask } from '../types/planner';
import { DEFAULT_SLOT_TIMES } from './categoriesAndPresets';

export function createEmptySlot(id: string, time?: string): SlotTask {
  return {
    id,
    title: '',
    category: 'topographical',
    time: time || '',
    completed: false,
  };
}

export function createEmptyWeek(weekNumber: number, monthIndex: number, year: number = 2026): WeekPlan {
  // Approximate dates for week 1..4
  const startDay = (weekNumber - 1) * 7 + 2;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

  const buildDay = (dayName: (typeof days)[number], idx: number): DaySchedule => ({
    dayName,
    dateNumber: startDay + idx,
    morningPrep: createEmptySlot(`w${weekNumber}-${dayName.toLowerCase()}-morning`, '08:00 - 08:45'),
    trainingModules: Array.from({ length: 7 }, (_, mIdx) =>
      createEmptySlot(`w${weekNumber}-${dayName.toLowerCase()}-m${mIdx + 1}`, DEFAULT_SLOT_TIMES[mIdx])
    ),
    eveningPractice: createEmptySlot(`w${weekNumber}-${dayName.toLowerCase()}-evening`, '17:30 - 18:30'),
  });

  return {
    weekNumber,
    dateRange: `Week ${weekNumber} (${monthIndex + 1}/${year})`,
    days: {
      monday: buildDay('Monday', 0),
      tuesday: buildDay('Tuesday', 1),
      wednesday: buildDay('Wednesday', 2),
      thursday: buildDay('Thursday', 3),
      friday: buildDay('Friday', 4),
    },
    saturday: {
      dayName: 'Saturday',
      dateNumber: startDay + 5,
      tasks: [
        createEmptySlot(`w${weekNumber}-sat-1`, '10:00 - 11:30'),
        createEmptySlot(`w${weekNumber}-sat-2`, '14:00 - 15:30'),
      ],
    },
    sunday: {
      dayName: 'Sunday',
      dateNumber: startDay + 6,
      tasks: [
        createEmptySlot(`w${weekNumber}-sun-1`, '11:00 - 12:30'),
        createEmptySlot(`w${weekNumber}-sun-2`, '16:00 - 17:00'),
      ],
    },
    notes: '',
  };
}

// Sample generator for Tariq Mahmood (TfL Trainee)
function getTariqSchedule(): Record<string, Record<number, Record<number, WeekPlan>>> {
  const novemberWeeks: Record<number, WeekPlan> = {
    1: {
      weekNumber: 1,
      dateRange: 'Nov 2 – Nov 8, 2026',
      days: {
        monday: {
          dayName: 'Monday',
          dateNumber: 2,
          morningPrep: {
            id: 'tm-w1-mon-morn',
            title: 'Highway Code: Mandatory Road Signs & Urban Bus Lane Timings',
            category: 'highway_code',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'tm-w1-mon-m1',
              title: 'Master Atlas Tracing: Kings Cross to Canary Wharf via A1203',
              category: 'topographical',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'tm-w1-mon-m2',
              title: 'Topographical: Rotherhithe Tunnel weight/height rules & alternatives',
              category: 'topographical',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'tm-w1-mon-m3',
              title: 'SERU Chapter 1: London PHV Regulatory Framework & Operator Rules',
              category: 'seru',
              time: '11:00 - 11:50',
              completed: true,
            },
            {
              id: 'tm-w1-mon-m4',
              title: 'Safeguarding: Vulnerable Passengers & County Lines Spotting',
              category: 'safeguarding',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'tm-w1-mon-m5',
              title: 'TfL Congestion & ULEZ Boundaries: Route deviation analysis',
              category: 'topographical',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'tm-w1-mon-m6',
              title: 'English Speaking: Explaining fare breakdown & delays to customer',
              category: 'english',
              time: '14:45 - 15:35',
              completed: false,
            },
            {
              id: 'tm-w1-mon-m7',
              title: 'Instructor 1-on-1: Reviewing map route precision & line weights',
              category: 'topographical',
              time: '15:45 - 16:35',
              completed: true,
            },
          ],
          eveningPractice: {
            id: 'tm-w1-mon-eve',
            title: 'Timed Mock: 40-question SERU multiple choice simulator',
            category: 'mock_test',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
        tuesday: {
          dayName: 'Tuesday',
          dateNumber: 3,
          morningPrep: {
            id: 'tm-w1-tue-morn',
            title: 'Highway Code: Stopping distances in wet weather & ABS reactions',
            category: 'highway_code',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'tm-w1-tue-m1',
              title: 'Topographical: River crossings (Tower Bridge, Blackwall, Dartford)',
              category: 'topographical',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'tm-w1-tue-m2',
              title: 'Topographical: Grid referencing & finding index page coordinates',
              category: 'topographical',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'tm-w1-tue-m3',
              title: 'SERU Chapter 2: Driver responsibilities, badges & vehicle cleanliness',
              category: 'seru',
              time: '11:00 - 11:50',
              completed: false,
            },
            {
              id: 'tm-w1-tue-m4',
              title: 'Safeguarding: Equality Act 2010 & Guide Dogs conveyance duty',
              category: 'safeguarding',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'tm-w1-tue-m5',
              title: 'Topographical Practice: Heathrow Airport Terminal 2 to West End',
              category: 'topographical',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'tm-w1-tue-m6',
              title: 'English Listening: Comprehending varied UK accents & radio dispatch',
              category: 'english',
              time: '14:45 - 15:35',
              completed: true,
            },
            {
              id: 'tm-w1-tue-m7',
              title: 'Mock Test Debrief: Reviewing missed SERU questions from yesterday',
              category: 'mock_test',
              time: '15:45 - 16:35',
              completed: true,
            },
          ],
          eveningPractice: {
            id: 'tm-w1-tue-eve',
            title: 'Topographical Drawing: 5 route exercises with pencil & ruler',
            category: 'topographical',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
        wednesday: {
          dayName: 'Wednesday',
          dateNumber: 4,
          morningPrep: {
            id: 'tm-w1-wed-morn',
            title: 'Admin Check: Verify enhanced DBS certificate status on update service',
            category: 'admin',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'tm-w1-wed-m1',
              title: 'Topographical: London Major Hospitals & Ambulance bay approach',
              category: 'topographical',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'tm-w1-wed-m2',
              title: 'SERU Chapter 3: Private Hire Booking Process & Pre-arranged journeys',
              category: 'seru',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'tm-w1-wed-m3',
              title: 'Highway Code: Multi-lane roundabout lane discipline (A406 North Circular)',
              category: 'highway_code',
              time: '11:00 - 11:50',
              completed: false,
            },
            {
              id: 'tm-w1-wed-m4',
              title: 'Mock Exam: 20-Question Topographical Drawing Test #1',
              category: 'mock_test',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'tm-w1-wed-m5',
              title: 'Safeguarding: Handling lost property, dispute escalation & police contact',
              category: 'safeguarding',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'tm-w1-wed-m6',
              title: 'English Test Prep: Reading comprehension on licensing condition letters',
              category: 'english',
              time: '14:45 - 15:35',
              completed: true,
            },
            {
              id: 'tm-w1-wed-m7',
              title: 'Map Skills: Avoiding cul-de-sacs and pedestrianised zones (Soho/Covent Garden)',
              category: 'topographical',
              time: '15:45 - 16:35',
              completed: false,
            },
          ],
          eveningPractice: {
            id: 'tm-w1-wed-eve',
            title: 'SERU Reading: Chapters 4 & 5 passenger safety and vehicle inspections',
            category: 'seru',
            time: '17:30 - 18:30',
            completed: false,
          },
        },
        thursday: {
          dayName: 'Thursday',
          dateNumber: 5,
          morningPrep: {
            id: 'tm-w1-thu-morn',
            title: 'Highway Code: Red routes, clearways & parking restriction plates',
            category: 'highway_code',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'tm-w1-thu-m1',
              title: 'Topographical: South London main radials (A2, A20, A23, A24)',
              category: 'topographical',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'tm-w1-thu-m2',
              title: 'Topographical: North London corridors (A1, A10, A41, M1 start)',
              category: 'topographical',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'tm-w1-thu-m3',
              title: 'SERU Chapter 4: Equality Act, wheelchair accessible vehicles & assistance dogs',
              category: 'seru',
              time: '11:00 - 11:50',
              completed: true,
            },
            {
              id: 'tm-w1-thu-m4',
              title: 'Mock Exam: SERU Fill-in-the-blanks test module (Target > 85%)',
              category: 'mock_test',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'tm-w1-thu-m5',
              title: 'English Language: Simulated customer scenarios & directions confirmation',
              category: 'english',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'tm-w1-thu-m6',
              title: 'Topographical Lab: Avoiding illegal U-turns on central reservation corridors',
              category: 'topographical',
              time: '14:45 - 15:35',
              completed: false,
            },
            {
              id: 'tm-w1-thu-m7',
              title: 'Instructor Debrief: Tracing assessment feedback & scale accuracy',
              category: 'topographical',
              time: '15:45 - 16:35',
              completed: true,
            },
          ],
          eveningPractice: {
            id: 'tm-w1-thu-eve',
            title: 'Online Portal: 3x Quick 15-question SERU speed runs',
            category: 'mock_test',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
        friday: {
          dayName: 'Friday',
          dateNumber: 6,
          morningPrep: {
            id: 'tm-w1-fri-morn',
            title: 'Highway Code: Box junctions, yellow zigzags & school zones',
            category: 'highway_code',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'tm-w1-fri-m1',
              title: 'Full Topographical Simulation: 2-hour official format test run',
              category: 'mock_test',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'tm-w1-fri-m2',
              title: 'Topographical Simulation: Route plotting part 2 (20 routes)',
              category: 'mock_test',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'tm-w1-fri-m3',
              title: 'SERU Final Weekly Review: Regulatory definitions & bylaw compliance',
              category: 'seru',
              time: '11:00 - 11:50',
              completed: true,
            },
            {
              id: 'tm-w1-fri-m4',
              title: 'Safeguarding Refresher: Recognising signs of human trafficking in taxis',
              category: 'safeguarding',
              time: '12:45 - 13:35',
              completed: false,
            },
            {
              id: 'tm-w1-fri-m5',
              title: 'Council Portal Review: Verify photo upload & medical certificate filing',
              category: 'admin',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'tm-w1-fri-m6',
              title: 'Map Skills: Complex junctions near Bank, Monument & Elephant & Castle',
              category: 'topographical',
              time: '14:45 - 15:35',
              completed: false,
            },
            {
              id: 'tm-w1-fri-m7',
              title: 'Weekly Progress Review with Lead Instructor: Week 2 target setting',
              category: 'admin',
              time: '15:45 - 16:35',
              completed: true,
            },
          ],
          eveningPractice: {
            id: 'tm-w1-fri-eve',
            title: 'Relaxed revision: Listening to SERU audio handbook Chapters 1-4',
            category: 'seru',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
      },
      saturday: {
        dayName: 'Saturday',
        dateNumber: 7,
        tasks: [
          {
            id: 'tm-w1-sat-1',
            title: 'Weekend Self-Study: Tracing 10 challenging routes across central London bridges',
            category: 'topographical',
            time: '10:00 - 11:30',
            completed: true,
          },
          {
            id: 'tm-w1-sat-2',
            title: 'SERU Practice App: Complete 100 questions on Equality Act & Driver Conduct',
            category: 'seru',
            time: '14:00 - 15:30',
            completed: false,
          },
        ],
      },
      sunday: {
        dayName: 'Sunday',
        dateNumber: 8,
        tasks: [
          {
            id: 'tm-w1-sun-1',
            title: 'Highway Code flashcards: Road signage & motorway signs review',
            category: 'highway_code',
            time: '11:00 - 12:00',
            completed: true,
          },
          {
            id: 'tm-w1-sun-2',
            title: 'Rest & Mental Preparation for Week 2 Advanced Topographical Modules',
            category: 'admin',
            time: '16:00 - 17:00',
            completed: true,
          },
        ],
      },
      notes: `Instructor Notes:
- Tariq is performing strongly on route plotting (scored 91% on Friday mock).
- Weak area: Remind him that Blackwall Tunnel is northbound/southbound two bores with distinct clearance limits.
- DBS Status: Enhanced DBS verified on Update Service.
- Medical: Group 2 D4 Form stamped by GP; portal upload complete.
- Next week focus: High-speed motorway links (M4, M11, A13) and London Airport routes.`,
    },
    2: createEmptyWeek(2, 10, 2026),
    3: createEmptyWeek(3, 10, 2026),
    4: createEmptyWeek(4, 10, 2026),
  };

  return {
    '2026': {
      10: novemberWeeks,
      9: { 1: createEmptyWeek(1, 9, 2026), 2: createEmptyWeek(2, 9, 2026), 3: createEmptyWeek(3, 9, 2026), 4: createEmptyWeek(4, 9, 2026) },
      11: { 1: createEmptyWeek(1, 11, 2026), 2: createEmptyWeek(2, 11, 2026), 3: createEmptyWeek(3, 11, 2026), 4: createEmptyWeek(4, 11, 2026) },
    },
  };
}

// Sample generator for Sarah Jenkins (Manchester Hackney Carriage)
function getSarahSchedule(): Record<string, Record<number, Record<number, WeekPlan>>> {
  const novemberWeeks: Record<number, WeekPlan> = {
    1: {
      weekNumber: 1,
      dateRange: 'Nov 2 – Nov 8, 2026',
      days: {
        monday: {
          dayName: 'Monday',
          dateNumber: 2,
          morningPrep: {
            id: 'sj-w1-mon-morn',
            title: 'Manchester City Center One-Way Systems & Bus Gates (Deansgate/Portland St)',
            category: 'topographical',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'sj-w1-mon-m1',
              title: 'Hackney Carriage Bylaws: Plying for hire & taxi rank ranking etiquette',
              category: 'seru',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'sj-w1-mon-m2',
              title: 'Local Knowledge: Route 1 - Piccadilly Station to Manchester Arena',
              category: 'topographical',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'sj-w1-mon-m3',
              title: 'Local Knowledge: Route 2 - Oxford Road corridor to Salford Quays',
              category: 'topographical',
              time: '11:00 - 11:50',
              completed: true,
            },
            {
              id: 'sj-w1-mon-m4',
              title: 'Safeguarding: Vulnerable night-time economy passengers & safe drops',
              category: 'safeguarding',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'sj-w1-mon-m5',
              title: 'Meter Operations: Council tariff rates, night rate multiplier & extras',
              category: 'seru',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'sj-w1-mon-m6',
              title: 'Wheelchair Ramp Deployment & Restraint Securing practical session',
              category: 'safeguarding',
              time: '14:45 - 15:35',
              completed: true,
            },
            {
              id: 'sj-w1-mon-m7',
              title: 'Instructor Oral Run: Landmark navigation without sat-nav assistance',
              category: 'topographical',
              time: '15:45 - 16:35',
              completed: false,
            },
          ],
          eveningPractice: {
            id: 'sj-w1-mon-eve',
            title: 'Manchester Street Atlas: Memorizing 30 key city centre hotels & theatres',
            category: 'topographical',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
        tuesday: {
          dayName: 'Tuesday',
          dateNumber: 3,
          morningPrep: {
            id: 'sj-w1-tue-morn',
            title: 'Highway Code: Tram track crossings (Metrolink) & shared pedestrian zones',
            category: 'highway_code',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'sj-w1-tue-m1',
              title: 'Airport Knowledge: Manchester Airport Terminals 1, 2, 3 approach lanes',
              category: 'topographical',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'sj-w1-tue-m2',
              title: 'Local Knowledge: Hospitals - Manchester Royal Infirmary, Wythenshawe & Christie',
              category: 'topographical',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'sj-w1-tue-m3',
              title: 'Council Bylaws: Penalty points system & vehicle compliance standards',
              category: 'seru',
              time: '11:00 - 11:50',
              completed: true,
            },
            {
              id: 'sj-w1-tue-m4',
              title: 'Mock Test: Manchester Hackney Carriage Street Route Written Exam 1',
              category: 'mock_test',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'sj-w1-tue-m5',
              title: 'English & Communication: Handling impaired passengers & conflict de-escalation',
              category: 'english',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'sj-w1-tue-m6',
              title: 'Topographical Drill: Ring road exits (Princess Parkway to Mancunian Way)',
              category: 'topographical',
              time: '14:45 - 15:35',
              completed: true,
            },
            {
              id: 'sj-w1-tue-m7',
              title: 'Instructor Feedback: Scoring of street route written exam (88%)',
              category: 'mock_test',
              time: '15:45 - 16:35',
              completed: true,
            },
          ],
          eveningPractice: {
            id: 'sj-w1-tue-eve',
            title: 'Council Knowledge Bank: Reviewing 50 obscure Manchester street names',
            category: 'topographical',
            time: '17:30 - 18:30',
            completed: false,
          },
        },
        wednesday: createEmptyDay('Wednesday', 4),
        thursday: createEmptyDay('Thursday', 5),
        friday: createEmptyDay('Friday', 6),
      },
      saturday: {
        dayName: 'Saturday',
        dateNumber: 7,
        tasks: [
          {
            id: 'sj-w1-sat-1',
            title: 'Real-World Drive-along: Shadowing senior hackney driver around Piccadilly rank',
            category: 'topographical',
            time: '09:00 - 12:00',
            completed: true,
          },
        ],
      },
      sunday: {
        dayName: 'Sunday',
        dateNumber: 8,
        tasks: [
          {
            id: 'sj-w1-sun-1',
            title: 'Revision: Equality Act & Guide Dog laws for Hackney drivers',
            category: 'safeguarding',
            time: '14:00 - 15:30',
            completed: true,
          },
        ],
      },
      notes: `Instructor Notes:
- Sarah has exceptional geographical recall for Manchester city centre landmarks.
- Needs more practice on Wythenshawe estate layout and Christie Hospital perimeter roads.
- Medical and DBS cleared. Ready for practical badge assessment in early December.`,
    },
  };

  return {
    '2026': {
      10: novemberWeeks,
    },
  };
}

function createEmptyDay(dayName: DaySchedule['dayName'], dateNumber: number): DaySchedule {
  return {
    dayName,
    dateNumber,
    morningPrep: createEmptySlot(`${dayName}-morn`, '08:00 - 08:45'),
    trainingModules: Array.from({ length: 7 }, (_, idx) =>
      createEmptySlot(`${dayName}-m${idx + 1}`, DEFAULT_SLOT_TIMES[idx])
    ),
    eveningPractice: createEmptySlot(`${dayName}-eve`, '17:30 - 18:30'),
  };
}

// Sample generator for Mohammed Al-Fayed (Wolverhampton Trainee)
function getMohammedSchedule(): Record<string, Record<number, Record<number, WeekPlan>>> {
  const novemberWeeks: Record<number, WeekPlan> = {
    1: {
      weekNumber: 1,
      dateRange: 'Nov 2 – Nov 8, 2026',
      days: {
        monday: {
          dayName: 'Monday',
          dateNumber: 2,
          morningPrep: {
            id: 'ma-w1-mon-morn',
            title: 'Wolverhampton Council Licensing Guidelines & Code of Conduct reading',
            category: 'seru',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'ma-w1-mon-m1',
              title: 'Wolverhampton Knowledge Test: Council policies & vehicle age limits',
              category: 'seru',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'ma-w1-mon-m2',
              title: 'Safeguarding: CSE Awareness certificate course (Mandatory Council module)',
              category: 'safeguarding',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'ma-w1-mon-m3',
              title: 'Safeguarding: Modern slavery & passenger protection scenarios',
              category: 'safeguarding',
              time: '11:00 - 11:50',
              completed: true,
            },
            {
              id: 'ma-w1-mon-m4',
              title: 'Highway Code: Road traffic legislation, penalty points & notification duty',
              category: 'highway_code',
              time: '12:45 - 13:35',
              completed: false,
            },
            {
              id: 'ma-w1-mon-m5',
              title: 'Mock Test: 40-question Wolverhampton Knowledge Exam simulator',
              category: 'mock_test',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'ma-w1-mon-m6',
              title: 'English Verbal Exam: Council conversational assessment drill',
              category: 'english',
              time: '14:45 - 15:35',
              completed: true,
            },
            {
              id: 'ma-w1-mon-m7',
              title: 'Admin Session: Uploading Certificate of Good Conduct & UK Driving Licence check',
              category: 'admin',
              time: '15:45 - 16:35',
              completed: true,
            },
          ],
          eveningPractice: {
            id: 'ma-w1-mon-eve',
            title: 'Quiz Portal: Wolverhampton Private Hire conditions & driver dress code',
            category: 'seru',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
        tuesday: createEmptyDay('Tuesday', 3),
        wednesday: createEmptyDay('Wednesday', 4),
        thursday: createEmptyDay('Thursday', 5),
        friday: createEmptyDay('Friday', 6),
      },
      saturday: {
        dayName: 'Saturday',
        dateNumber: 7,
        tasks: [
          {
            id: 'ma-w1-sat-1',
            title: 'Mock Exam: Timed Wolverhampton Full Knowledge test #3',
            category: 'mock_test',
            time: '10:00 - 11:00',
            completed: true,
          },
        ],
      },
      sunday: {
        dayName: 'Sunday',
        dateNumber: 8,
        tasks: [
          {
            id: 'ma-w1-sun-1',
            title: 'Highway Code signs & vehicle safety pre-checks review',
            category: 'highway_code',
            time: '14:00 - 15:00',
            completed: true,
          },
        ],
      },
      notes: `Instructor Notes:
- Mohammed is preparing for the fast-track Wolverhampton Private Hire licence.
- Scored 94% on Safeguarding module.
- Exam is booked for Nov 20. Urgent: ensure Medical D4 GP appointment report is submitted by Friday.`,
    },
  };

  return {
    '2026': {
      10: novemberWeeks,
    },
  };
}

// Sample generator for David O'Connor (Bury Dual Driver)
function getDavidSchedule(): Record<string, Record<number, Record<number, WeekPlan>>> {
  const novemberWeeks: Record<number, WeekPlan> = {
    1: {
      weekNumber: 1,
      dateRange: 'Nov 2 – Nov 8, 2026',
      days: {
        monday: {
          dayName: 'Monday',
          dateNumber: 2,
          morningPrep: {
            id: 'doc-w1-mon-morn',
            title: 'Bury Council Hackney & PHV Joint Licensing Policy review',
            category: 'seru',
            time: '08:00 - 08:45',
            completed: true,
          },
          trainingModules: [
            {
              id: 'doc-w1-mon-m1',
              title: 'Bury Local Geography: Key routes connecting Bury, Radcliffe, Prestwich & Ramsbottom',
              category: 'topographical',
              time: '09:00 - 09:50',
              completed: true,
            },
            {
              id: 'doc-w1-mon-m2',
              title: 'Dual Driver Regulations: Operating as hackney vs private hire job rules',
              category: 'seru',
              time: '10:00 - 10:50',
              completed: true,
            },
            {
              id: 'doc-w1-mon-m3',
              title: 'Safeguarding: Bury Council mandatory child protection & safe journey policy',
              category: 'safeguarding',
              time: '11:00 - 11:50',
              completed: false,
            },
            {
              id: 'doc-w1-mon-m4',
              title: 'Mock Assessment: Bury Borough Street Knowledge test #1',
              category: 'mock_test',
              time: '12:45 - 13:35',
              completed: true,
            },
            {
              id: 'doc-w1-mon-m5',
              title: 'Highway Code: Rural single carriageways & national speed limit zones around Rossendale',
              category: 'highway_code',
              time: '13:45 - 14:35',
              completed: true,
            },
            {
              id: 'doc-w1-mon-m6',
              title: 'Customer Care & Disability: Safe handling of guide dogs & mobility walkers',
              category: 'safeguarding',
              time: '14:45 - 15:35',
              completed: true,
            },
            {
              id: 'doc-w1-mon-m7',
              title: 'Instructor 1-on-1: Route shortest path calculations',
              category: 'topographical',
              time: '15:45 - 16:35',
              completed: false,
            },
          ],
          eveningPractice: {
            id: 'doc-w1-mon-eve',
            title: 'Bury Town Centre one-way map drawing & landmark memory test',
            category: 'topographical',
            time: '17:30 - 18:30',
            completed: true,
          },
        },
        tuesday: createEmptyDay('Tuesday', 3),
        wednesday: createEmptyDay('Wednesday', 4),
        thursday: createEmptyDay('Thursday', 5),
        friday: createEmptyDay('Friday', 6),
      },
      saturday: {
        dayName: 'Saturday',
        dateNumber: 7,
        tasks: [
          {
            id: 'doc-w1-sat-1',
            title: 'Weekend Practice: Mock test covering Bury Council fare chart tariff 1 & 2',
            category: 'mock_test',
            time: '10:00 - 11:30',
            completed: true,
          },
        ],
      },
      sunday: {
        dayName: 'Sunday',
        dateNumber: 8,
        tasks: [
          {
            id: 'doc-w1-sun-1',
            title: 'Rest & review of Bury Council licensing conditions handbook',
            category: 'seru',
            time: '15:00 - 16:00',
            completed: false,
          },
        ],
      },
      notes: `Instructor Notes:
- David is sitting the Bury Dual Badge assessment.
- Strong practical driving skills.
- Focus area: Memorise the exact fares and out-of-district booking rules for Greater Manchester joint boundaries.`,
    },
  };

  return {
    '2026': {
      10: novemberWeeks,
    },
  };
}

export const INITIAL_TRAINEES: TraineeStudent[] = [
  {
    id: 'trainee-1',
    fullName: 'Tariq Mahmood',
    phoneNumber: '07712 345678',
    council: 'TfL (Transport for London)',
    badgeType: 'Private Hire / Uber',
    examDate: '2026-11-28',
    applicationRef: 'TFL-PHV-99420',
    dbsStatus: 'Approved',
    medicalStatus: 'Group 2 Passed',
    instructorNotes: 'Candidate is strong on route plotting. Needs minor revision on Rotherhithe tunnel weight rules and SERU Section 4.',
    createdAt: '2026-10-15',
    schedules: getTariqSchedule(),
  },
  {
    id: 'trainee-2',
    fullName: 'Sarah Jenkins',
    phoneNumber: '07890 234567',
    council: 'Manchester City Council',
    badgeType: 'Hackney Carriage',
    examDate: '2026-12-05',
    applicationRef: 'MCC-HAC-44102',
    dbsStatus: 'Approved',
    medicalStatus: 'Group 2 Passed',
    instructorNotes: 'Excellent landmark knowledge across Piccadilly & Deansgate. Focusing on Wythenshawe hospital perimeter access.',
    createdAt: '2026-10-20',
    schedules: getSarahSchedule(),
  },
  {
    id: 'trainee-3',
    fullName: 'Mohammed Al-Fayed',
    phoneNumber: '07555 890123',
    council: 'Wolverhampton Council',
    badgeType: 'Private Hire / Uber',
    examDate: '2026-11-20',
    applicationRef: 'WOLV-PH-33190',
    dbsStatus: 'In Review',
    medicalStatus: 'Doctor Appt Booked',
    instructorNotes: 'High test scores in Safeguarding and CSE modules. Must complete Doctor Medical examination appointment before exam date.',
    createdAt: '2026-10-28',
    schedules: getMohammedSchedule(),
  },
  {
    id: 'trainee-4',
    fullName: "David O'Connor",
    phoneNumber: '07401 987654',
    council: 'Bury Council',
    badgeType: 'Dual Driver',
    examDate: '2026-12-18',
    applicationRef: 'BURY-DUAL-10842',
    dbsStatus: 'Approved',
    medicalStatus: 'Group 2 Passed',
    instructorNotes: 'Dual badge applicant (Hackney + PHV). Working through Greater Manchester cross-border regulations and night-time tariffs.',
    createdAt: '2026-11-01',
    schedules: getDavidSchedule(),
  },
];
