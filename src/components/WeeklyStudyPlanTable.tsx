import React, { useState, useEffect, useMemo, useRef } from 'react';
import { toBlob } from 'html-to-image';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Download, 
  Printer, 
  RotateCcw, 
  Sparkles, 
  User, 
  Award, 
  Target, 
  ChevronDown, 
  Check, 
  Flame,
  FileText,
  HelpCircle,
  Pencil,
  History,
  Image as ImageIcon,
  X,
  ExternalLink
} from 'lucide-react';
import { UserProgress } from '../types';

export type EnglishSkill = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'speaking';
export type PlanStatus = 'completed' | 'in_progress' | 'scheduled';

export interface StudyPlanDayItem {
  dayId: string;
  dayNameKh: string;
  dayNameEn: string;
  dayNumber: number;
  timeRange: string;
  skill: EnglishSkill;
  topic: string;
  status: PlanStatus;
}

interface WeeklyStudyPlanTableProps {
  progress: UserProgress;
  isEn?: boolean;
}

// Available Weekly History Log Options
const WEEK_HISTORY_OPTIONS = [
  { id: 'current_week', labelKh: '⭐ សប្តាហ៍បច្ចុប្បន្ន (Current Week)', labelEn: '⭐ Current Week (Active)' },
  { id: 'week_1', labelKh: '📅 សប្តាហ៍ទី 1 (Week 1)', labelEn: '📅 Week 1 (Curriculum)' },
  { id: 'week_2', labelKh: '📅 សប្តាហ៍ទី 2 (Week 2)', labelEn: '📅 Week 2 (Grammar & Vocab)' },
  { id: 'week_3', labelKh: '📅 សប្តាហ៍ទី 3 (Week 3)', labelEn: '📅 Week 3 (Reading & Listening)' },
  { id: 'week_4', labelKh: '📅 សប្តាហ៍ទី 4 (Week 4)', labelEn: '📅 Week 4 (Fluency & Review)' },
  { id: 'past_week_prev', labelKh: '📜 សប្តាហ៍កន្លងទៅ (Past Log)', labelEn: '📜 Past Week Log (Archive)' },
];

// Available time range options
const TIME_SLOT_OPTIONS = [
  { value: '06:30 - 07:30', labelKh: '06:30 - 07:30 (ព្រឹកព្រលឹម)', labelEn: '06:30 - 07:30 (Early Morning)' },
  { value: '07:00 - 08:00', labelKh: '07:00 - 08:00 (ពេលព្រឹក)', labelEn: '07:00 - 08:00 (Morning)' },
  { value: '08:00 - 09:00', labelKh: '08:00 - 09:00 (ម៉ោងសិក្សាព្រឹក)', labelEn: '08:00 - 09:00 (Morning Focus)' },
  { value: '09:00 - 10:00', labelKh: '09:00 - 10:00 (ពេលព្រឹក)', labelEn: '09:00 - 10:00 (Late Morning)' },
  { value: '11:30 - 12:30', labelKh: '11:30 - 12:30 (ថ្ងៃត្រង់)', labelEn: '11:30 - 12:30 (Lunch Break)' },
  { value: '14:00 - 15:00', labelKh: '14:00 - 15:00 (រសៀល)', labelEn: '14:00 - 15:00 (Afternoon)' },
  { value: '17:00 - 18:00', labelKh: '17:00 - 18:00 (ល្ងាច)', labelEn: '17:00 - 18:00 (Late Afternoon)' },
  { value: '18:00 - 19:00', labelKh: '18:00 - 19:00 (ពេលល្ងាច)', labelEn: '18:00 - 19:00 (Evening)' },
  { value: '19:00 - 20:00', labelKh: '19:00 - 20:00 (យប់)', labelEn: '19:00 - 20:00 (Night Study)' },
  { value: '20:00 - 21:00', labelKh: '20:00 - 21:00 (យប់ជ្រៅ)', labelEn: '20:00 - 21:00 (Late Night)' },
  { value: '21:00 - 22:00', labelKh: '21:00 - 22:00 (មុនគេង)', labelEn: '21:00 - 22:00 (Before Sleep)' },
];

// Available English Skills metadata
export const SKILL_METADATA: Record<EnglishSkill, { 
  labelKh: string; 
  labelEn: string; 
  icon: string; 
  color: string; 
  bgColor: string; 
  borderColor: string;
  defaultTopics: string[];
}> = {
  grammar: {
    labelKh: 'វេយ្យាករណ៍',
    labelEn: 'Grammar',
    icon: '📝',
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    defaultTopics: [
      'Present Simple vs Continuous (កាលបច្ចុប្បន្ន)',
      'Past Tense & Irregular Verbs (កាលអតីតកាល)',
      'Modal Verbs: Can, Should, Must (កិរិយាសព្ទជំនួយ)',
      'Relative Clauses & Conjunctions (ឈ្នាប់ភ្ជាប់ឃ្លា)'
    ]
  },
  vocabulary: {
    labelKh: 'វាក្យសព្ទ',
    labelEn: 'Vocabulary',
    icon: '📖',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    defaultTopics: [
      '50 Daily Oxford Core Words (ពាក្យគន្លឹះប្រចាំថ្ងៃ)',
      'Work & Business Idioms (ពាក្យការងារ & អាជីវកម្ម)',
      'Travel & Transportation Terms (ពាក្យធ្វើដំណើរ)',
      'Phrasal Verbs Flashcards (កិរិយាសព្ទផ្សំ)'
    ]
  },
  reading: {
    labelKh: 'អំណាន',
    labelEn: 'Reading',
    icon: '📑',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    defaultTopics: [
      'Short Story & Comprehension (អំណានរឿងខ្លី)',
      'Cambodian Heritage News Article (អត្ថបទព័ត៌មាន)',
      'Speed Reading & Skimming Practice (ការអានរហ័ស)',
      'Dialogue & Narrative Comprehension (ការយល់អត្ថបទ)'
    ]
  },
  listening: {
    labelKh: 'ការស្តាប់',
    labelEn: 'Listening',
    icon: '🎧',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    defaultTopics: [
      'Conversational Audio Podcast (ស្តាប់ការសន្ទនា)',
      'Audio Accent Discrimination (ស្តាប់ការបញ្ចេញសំឡេង)',
      'Listening Quiz & Answer Drills (ឆ្លើយសំណួរការស្តាប់)',
      'Dictation & Sentence Transcription (កត់ត្រាការស្តាប់)'
    ]
  },
  speaking: {
    labelKh: 'ការនិយាយ',
    labelEn: 'Speaking',
    icon: '🗣️',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    defaultTopics: [
      'Self-Introduction & Daily Routines (ការណែនាំខ្លួន)',
      'Pronunciation & Shadowing Drill (ការហ្វឹកហាត់សំឡេង)',
      'Giving Opinions & Agreeing/Disagreeing (ការបញ្ចេញមតិ)',
      'Situational Roleplay & Free Talk (ការសន្ទនាជាក់ស្តែង)'
    ]
  }
};

// Default standard weekly English schedule
const DEFAULT_WEEKLY_PLAN: StudyPlanDayItem[] = [
  {
    dayId: 'mon',
    dayNameKh: 'ច័ន្ទ (Monday)',
    dayNameEn: 'Monday',
    dayNumber: 1,
    timeRange: '08:00 - 09:00',
    skill: 'grammar',
    topic: 'Present Simple vs Present Continuous (កាលបច្ចុប្បន្ន)',
    status: 'completed',
  },
  {
    dayId: 'tue',
    dayNameKh: 'អង្គារ (Tuesday)',
    dayNameEn: 'Tuesday',
    dayNumber: 2,
    timeRange: '19:00 - 20:00',
    skill: 'vocabulary',
    topic: '50 Daily Core English Words & Oxford Flashcards',
    status: 'completed',
  },
  {
    dayId: 'wed',
    dayNameKh: 'ពុធ (Wednesday)',
    dayNameEn: 'Wednesday',
    dayNumber: 3,
    timeRange: '19:00 - 20:00',
    skill: 'listening',
    topic: 'Natural English Audio Conversations & Dialogues',
    status: 'in_progress',
  },
  {
    dayId: 'thu',
    dayNameKh: 'ព្រហស្បតិ៍ (Thursday)',
    dayNameEn: 'Thursday',
    dayNumber: 4,
    timeRange: '08:00 - 09:00',
    skill: 'reading',
    topic: 'Short Passage Reading & Comprehension Quiz',
    status: 'scheduled',
  },
  {
    dayId: 'fri',
    dayNameKh: 'សុក្រ (Friday)',
    dayNameEn: 'Friday',
    dayNumber: 5,
    timeRange: '18:00 - 19:00',
    skill: 'speaking',
    topic: 'Pronunciation, Shadowing & Fluency Drills',
    status: 'scheduled',
  },
  {
    dayId: 'sat',
    dayNameKh: 'សៅរ៍ (Saturday)',
    dayNameEn: 'Saturday',
    dayNumber: 6,
    timeRange: '09:00 - 10:00',
    skill: 'grammar',
    topic: 'Weekly Knowledge Review & Arena Quiz Battle',
    status: 'scheduled',
  },
  {
    dayId: 'sun',
    dayNameKh: 'អាទិត្យ (Sunday)',
    dayNameEn: 'Sunday',
    dayNumber: 7,
    timeRange: '14:00 - 15:00',
    skill: 'vocabulary',
    topic: 'Weak Vocabulary Review & Certificate Milestones',
    status: 'scheduled',
  },
];

export const WeeklyStudyPlanTable: React.FC<WeeklyStudyPlanTableProps> = ({
  progress,
  isEn = false,
}) => {
  // Weekly History Log selector state (e.g. current_week, week_1, week_2, week_3, week_4)
  const [selectedWeek, setSelectedWeek] = useState<string>('current_week');
  const [savedWeeks, setSavedWeeks] = useState<string[]>([]);
  
  // Student Metadata (customizable/editable)
  const [studentName, setStudentName] = useState<string>(
    progress.userName || (isEn ? 'Student Learner' : 'សិស្ស / អ្នកសិក្សា')
  );
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [studentLevel, setStudentLevel] = useState<string>(
    progress.currentLevel ? progress.currentLevel.toUpperCase() : 'BEGINNER (A1-A2)'
  );
  const [weeklyTargetHours, setWeeklyTargetHours] = useState<number>(7);
  
  // Schedule Items
  const [scheduleItems, setScheduleItems] = useState<StudyPlanDayItem[]>(DEFAULT_WEEKLY_PLAN);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [isSavingImage, setIsSavingImage] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [cleanCardModalOpen, setCleanCardModalOpen] = useState<boolean>(false);
  const [cleanCardBlobUrl, setCleanCardBlobUrl] = useState<string>('');

  // Reference to the Timetable DOM element for canvas rendering
  const timetableRef = useRef<HTMLDivElement>(null);

  // Storage keys
  const uid = progress.userIdentifier || 'guest';
  const storageKey = useMemo(() => {
    return `eng_kh_study_plan_${uid}_${selectedWeek}`;
  }, [uid, selectedWeek]);

  const historyIndexKey = useMemo(() => {
    return `eng_kh_study_plan_history_${uid}`;
  }, [uid]);

  const metaKey = useMemo(() => {
    return `eng_kh_study_plan_meta_${uid}`;
  }, [uid]);

  // Load saved metadata (name, level, hours) on mount
  useEffect(() => {
    try {
      const savedMeta = localStorage.getItem(metaKey);
      if (savedMeta) {
        const parsed = JSON.parse(savedMeta);
        if (parsed.studentName) setStudentName(parsed.studentName);
        if (parsed.studentLevel) setStudentLevel(parsed.studentLevel);
        if (parsed.weeklyTargetHours) setWeeklyTargetHours(parsed.weeklyTargetHours);
      }
    } catch {
      // ignore
    }
  }, [metaKey]);

  // Load saved weeks index
  useEffect(() => {
    try {
      const idxSaved = localStorage.getItem(historyIndexKey);
      if (idxSaved) {
        setSavedWeeks(JSON.parse(idxSaved));
      }
    } catch {
      // ignore
    }
  }, [historyIndexKey]);

  // Load from localStorage on week switch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 7) {
          setScheduleItems(parsed);
          return;
        }
      }

      // Check key 'ankor_weekly_plan' as requested
      const ankorPlan = localStorage.getItem('ankor_weekly_plan');
      if (ankorPlan) {
        const parsed = JSON.parse(ankorPlan);
        if (parsed.scheduleItems && Array.isArray(parsed.scheduleItems) && parsed.scheduleItems.length === 7) {
          setScheduleItems(parsed.scheduleItems);
          if (parsed.studentName) setStudentName(parsed.studentName);
          if (parsed.studentLevel) setStudentLevel(parsed.studentLevel);
          if (parsed.weeklyTargetHours) setWeeklyTargetHours(parsed.weeklyTargetHours);
          return;
        }
      }
    } catch {
      // ignore
    }
    // Fallback to default
    setScheduleItems(DEFAULT_WEEKLY_PLAN);
  }, [storageKey]);

  // Helper: Persist current timetable state & metadata to localStorage
  const persistPlanData = () => {
    try {
      const weeklyPlanState = {
        appName: 'Angkor English Academy',
        fileFormat: 'Ankor_Weekly_Study_Plan_v1',
        exportedAt: new Date().toISOString(),
        selectedWeek,
        weekLabelKh: WEEK_HISTORY_OPTIONS.find(o => o.id === selectedWeek)?.labelKh || selectedWeek,
        weekLabelEn: WEEK_HISTORY_OPTIONS.find(o => o.id === selectedWeek)?.labelEn || selectedWeek,
        student: {
          name: studentName,
          level: studentLevel,
          weeklyTargetHours,
        },
        analytics: {
          completedDays: completedCount,
          inProgressDays: inProgressCount,
          totalDays: 7,
          completionRate: `${completionRate}%`,
          totalPlannedHours: 7.0,
        },
        scheduleItems: scheduleItems.map((item) => {
          const skillMeta = SKILL_METADATA[item.skill] || SKILL_METADATA.grammar;
          return {
            dayNumber: item.dayNumber,
            dayId: item.dayId,
            dayNameKh: item.dayNameKh,
            dayNameEn: item.dayNameEn,
            timeRange: item.timeRange,
            skill: item.skill,
            skillKh: skillMeta.labelKh,
            skillEn: skillMeta.labelEn,
            topic: item.topic,
            status: item.status,
            statusKh:
              item.status === 'completed'
                ? 'បានបញ្ចប់'
                : item.status === 'in_progress'
                ? 'កំពុងរៀន'
                : 'គ្រោងទុក',
          };
        }),
      };

      localStorage.setItem('ankor_weekly_plan', JSON.stringify(weeklyPlanState));
      localStorage.setItem(storageKey, JSON.stringify(scheduleItems));
      
      if (!savedWeeks.includes(selectedWeek)) {
        const updatedList = [...savedWeeks, selectedWeek];
        setSavedWeeks(updatedList);
        localStorage.setItem(historyIndexKey, JSON.stringify(updatedList));
      }

      localStorage.setItem(metaKey, JSON.stringify({
        studentName,
        studentLevel,
        weeklyTargetHours,
        savedAt: new Date().toISOString(),
      }));
    } catch (err) {
      console.warn('LocalStorage persistence error:', err);
    }
  };

  // 1. PURE CLEAN TIMETABLE HTML GENERATOR (ZERO EXTERNAL CDN SCRIPTS, 100% STANDALONE & SAFE)
  const generateCleanTimetableHtml = (params: {
    studentName: string;
    studentLevel: string;
    weeklyTargetHours: string;
    selectedWeek: string;
    scheduleItems: StudyPlanDayItem[];
    isEn?: boolean;
  }): string => {
    const { studentName: sName, studentLevel: sLevel, weeklyTargetHours: sHours, selectedWeek: sWeek, scheduleItems: sItems, isEn: enMode } = params;

    const rowsHtml = sItems.map((item) => {
      const isWeekend = item.dayNumber === 6 || item.dayNumber === 7;
      const dayHeaderStyle = isWeekend
        ? 'color: #dc2626 !important; font-weight: bold; border-bottom: 2px solid #dc2626; background-color: #fef2f2;'
        : 'color: #1e3a8a !important; font-weight: bold; border-bottom: 2px solid #2563eb; background-color: #eff6ff;';

      const statusBadge = item.status === 'completed'
        ? '<span style="background-color:#ecfdf5;color:#047857;border:1px solid #a7f3d0;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold;">✓ បានបញ្ចប់</span>'
        : item.status === 'in_progress'
        ? '<span style="background-color:#eef2ff;color:#4338ca;border:1px solid #c7d2fe;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold;">⚡ កំពុងរៀន</span>'
        : '<span style="background-color:#f1f5f9;color:#475569;border:1px solid #cbd5e1;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold;">📅 គ្រោងទុក</span>';

      return `
        <tr style="border-bottom: 1px solid #e2e8f0; ${isWeekend ? 'background-color: #fffafa;' : ''}">
          <td style="padding: 10px 12px; text-align: center; vertical-align: middle;">
            <div style="display: inline-block; padding: 6px 14px; border-radius: 8px; ${dayHeaderStyle}">
              <div style="font-size: 16px; font-weight: bold; ${isWeekend ? 'color: #dc2626 !important; border-bottom: 2px solid #dc2626; padding-bottom: 2px;' : 'color: #1e3a8a;'}">${item.dayNameKh.split(' ')[0]}</div>
              <div style="font-size: 11px; margin-top: 2px; ${isWeekend ? 'color: #dc2626 !important; font-weight: bold;' : 'color: #3b82f6;'}">${item.dayNameEn}</div>
            </div>
          </td>
          <td style="padding: 10px 12px; font-weight: 600; color: #1e293b; font-size: 13px; vertical-align: middle;">
            ⏰ ${item.timeRange}
          </td>
          <td style="padding: 10px 12px; vertical-align: middle;">
            <div style="font-size: 11px; font-weight: bold; text-transform: uppercase; color: #4338ca; letter-spacing: 0.5px;">${item.skill}</div>
            <div style="font-size: 13px; font-weight: 500; color: #0f172a; margin-top: 2px;">${item.topic}</div>
          </td>
          <td style="padding: 10px 12px; text-align: center; vertical-align: middle;">
            ${statusBadge}
          </td>
        </tr>
      `;
    }).join('');

    return `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Angkor_English_Timetable_${sWeek}</title>
  <style>
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      background-color: #ffffff !important;
      color: #0f172a;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Kantumruy Pro", sans-serif;
      margin: 0;
      padding: 16px;
    }
    .clean-card-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }
    .no-print-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 10px 16px;
      border-radius: 12px;
      margin-bottom: 20px;
    }
    .btn {
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 13px;
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .btn-primary {
      background: #1e3a8a;
      color: #ffffff;
    }
    .btn-secondary {
      background: #e2e8f0;
      color: #334155;
    }
    .timetable-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }
    .timetable-table th {
      background: #f1f5f9;
      color: #1e293b;
      padding: 10px 12px;
      text-align: left;
      font-weight: 700;
      border-bottom: 2px solid #cbd5e1;
    }
    .signatures-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 32px;
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
    }
    .sig-line {
      border-bottom: 1px solid #cbd5e1;
      width: 180px;
      margin: 24px auto 8px auto;
    }
    @media print {
      body {
        padding: 0 !important;
      }
      .no-print-toolbar {
        display: none !important;
      }
      .clean-card-container {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        max-width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="clean-card-container">
    <div class="no-print-toolbar">
      <div style="font-size: 12px; color: #475569;">
        💡 <strong>ការណែនាំ (Tip):</strong> ចុចកណ្ដុរស្ដាំ (Right-Click) លើតារាងដើម្បី Save / Copy Image ឬចុចប៊ូតុង "Print / Save as PDF"!
      </div>
      <div style="display: flex; gap: 8px;">
        <button onclick="window.print()" class="btn btn-primary">🖨️ Print / Save as PDF</button>
        <button onclick="window.close()" class="btn btn-secondary">✕ Close</button>
      </div>
    </div>

    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 16px;">
      <div>
        <h1 style="margin: 0; font-size: 20px; font-weight: 800; color: #1e3a8a;">
          ${enMode ? 'Angkor English • Weekly Study Timetable' : 'អង្គរអង់គ្លេស • កាលវិភាគសិក្សាភាសាអង់គ្លេសប្រចាំសប្ដាហ៍'}
        </h1>
        <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
          ផែនការសិក្សាប្រចាំសប្ដាហ៍ ៧ ថ្ងៃ (Weekly 7-Day Curriculum Grid)
        </div>
      </div>
      <div style="text-align: right; font-size: 12px; color: #334155;">
        <div><strong>សិស្ស (Student):</strong> ${sName}</div>
        <div><strong>កម្រិត (Level):</strong> ${sLevel}</div>
        <div><strong>គោលដៅ (Target):</strong> ${sHours} ម៉ោង/សប្តាហ៍</div>
      </div>
    </div>

    <!-- Table -->
    <table class="timetable-table">
      <thead>
        <tr>
          <th style="text-align: center; width: 140px;">ថ្ងៃសិក្សា (Day)</th>
          <th style="width: 160px;">ម៉ោងសិក្សា (Time)</th>
          <th>ជំនាញ & ខ្លឹមសារ (Skill & Topic)</th>
          <th style="text-align: center; width: 130px;">ស្ថានភាព (Status)</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>

    <!-- Signatures -->
    <div class="signatures-grid">
      <div>
        <div style="font-weight: bold; font-size: 12px; color: #1e293b;">ហត្ថលេខាសិស្សសិក្សា (Student Signature)</div>
        <div class="sig-line"></div>
        <div style="font-size: 11px; color: #64748b;">${sName}</div>
      </div>
      <div>
        <div style="font-weight: bold; font-size: 12px; color: #1e293b;">គ្រូបង្រៀន / អាណាព្យាបាល (Teacher / Parent)</div>
        <div class="sig-line"></div>
        <div style="font-size: 11px; color: #64748b;">Angkor English Academic Department</div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; font-size: 10px; color: #94a3b8; margin-top: 24px; padding-top: 10px; border-top: 1px solid #f1f5f9;">
      Angkor English Timetable • Generated on ${new Date().toLocaleDateString()} • Keep practicing daily!
    </div>
  </div>
</body>
</html>`;
  };

  // ACTION 1 ("🖼️ រក្សាទុកជារូបភាព"): Directly triggers browser file download (Ankor_Timetable.png) via Blob anchor tag without opening any new tab
  const handleSaveImage = async () => {
    setIsSavingImage(true);
    try {
      persistPlanData();

      setSaveToast(
        isEn 
          ? '⏳ Generating PNG image download...' 
          : '⏳ កំពុងបង្កើតរូបភាពទាញយក PNG...'
      );

      let pngBlob: Blob | null = null;

      // Primary: Convert timetable-grid node to PNG blob using html-to-image
      if (timetableRef.current) {
        try {
          pngBlob = await toBlob(timetableRef.current, {
            backgroundColor: '#ffffff',
            pixelRatio: 2,
            filter: (domNode: HTMLElement) => {
              if (domNode && domNode.getAttribute) {
                if (domNode.getAttribute('data-html2canvas-ignore') === 'true') return false;
                if (domNode.getAttribute('data-print-hidden') === 'true') return false;
              }
              if (domNode && domNode.classList && domNode.classList.contains('print:hidden')) {
                return false;
              }
              return true;
            },
          });
        } catch (captureErr) {
          console.warn('html-to-image capture fallback needed:', captureErr);
        }
      }

      // Secondary Fallback: Generate SVG/Canvas rasterized PNG blob directly
      if (!pngBlob) {
        const svgContent = `
          <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1100">
            <foreignObject width="1000" height="1100">
              <div xmlns="http://www.w3.org/1999/xhtml">
                ${generateCleanTimetableHtml({
                  studentName,
                  studentLevel,
                  weeklyTargetHours: String(weeklyTargetHours),
                  selectedWeek,
                  scheduleItems,
                  isEn,
                })}
              </div>
            </foreignObject>
          </svg>
        `;
        const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        
        const img = new Image();
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = reject;
          img.src = svgUrl;
        });

        const canvas = document.createElement('canvas');
        canvas.width = 1000;
        canvas.height = 1100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          pngBlob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/png'));
        }
        URL.revokeObjectURL(svgUrl);
      }

      if (pngBlob) {
        // Direct browser file download via anchor <a> tag without window.open()
        const downloadUrl = URL.createObjectURL(pngBlob);
        const downloadAnchor = document.createElement('a');
        downloadAnchor.style.display = 'none';
        downloadAnchor.href = downloadUrl;
        downloadAnchor.download = 'Ankor_Timetable.png';
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();

        // Cleanup
        setTimeout(() => {
          if (downloadAnchor.parentNode) {
            downloadAnchor.parentNode.removeChild(downloadAnchor);
          }
          URL.revokeObjectURL(downloadUrl);
        }, 1500);

        setSaveToast(
          isEn 
            ? '✓ Downloaded Ankor_Timetable.png successfully!' 
            : '✓ បានទាញយករូបភាព Ankor_Timetable.png ដោយជោគជ័យ!'
        );
      } else {
        throw new Error('Could not create PNG blob');
      }
    } catch (e) {
      console.error('Failed to save PNG image directly:', e);
      setSaveToast(
        isEn 
          ? '⚠ Direct image download failed, opening print dialog...' 
          : '⚠ ការទាញយករូបភាពមានបញ្ហា កំពុងបើកផ្ទាំងបោះពុម្ព...'
      );
      setTimeout(() => {
        window.print();
      }, 300);
    } finally {
      setIsSavingImage(false);
      setTimeout(() => setSaveToast(null), 3500);
    }
  };

  // ACTION 2 ("🖨️ បោះពុម្ព / PDF"): Directly execute window.print() without toast delay or blocking
  const handlePrintOrPdf = () => {
    try {
      persistPlanData();
      window.print();
    } catch (e) {
      console.error('Print error:', e);
      window.print();
    }
  };

  // Reset to default
  const handleResetPlan = () => {
    setScheduleItems(DEFAULT_WEEKLY_PLAN);
    localStorage.removeItem(storageKey);
    localStorage.removeItem('ankor_weekly_plan');
    setSaveToast(isEn ? 'Schedule reset to standard curriculum.' : 'បានកំណត់កាលវិភាគឡើងវិញតាមស្តង់ដារ។');
    setTimeout(() => setSaveToast(null), 2500);
  };

  // Update item field
  const handleUpdateItem = <K extends keyof StudyPlanDayItem>(
    index: number,
    field: K,
    value: StudyPlanDayItem[K]
  ) => {
    setScheduleItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Print Report Handler
  const handlePrintReport = () => {
    window.print();
  };

  // Analytics summary for the weekly schedule
  const completedCount = scheduleItems.filter(i => i.status === 'completed').length;
  const inProgressCount = scheduleItems.filter(i => i.status === 'in_progress').length;
  const completionRate = Math.round((completedCount / 7) * 100);

  return (
    <div id="weekly-study-plan-section" className="space-y-3">
      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed top-4 right-4 z-50 bg-emerald-700 text-white py-2 px-4 rounded-xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-khmer font-bold animate-in fade-in slide-in-from-top-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Main Container Card (Interactive Screen View, Print Target & PNG Image Capture) */}
      <div 
        id="timetable-grid" 
        ref={timetableRef}
        className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs p-3 sm:p-4 md:p-6 space-y-4 font-khmer text-slate-800"
      >
        
        {/* ========================================================
            1) TITLE TYPOGRAPHY & HIGHLIGHT ACCENT CARD
               Title: "ផែនការសិក្សាភាសាអង់គ្លេសប្រចាំសប្ដាហ៍ (WEEKLY ENGLISH TIMETABLE GRID)"
               Styled in Bold Dark Navy Blue (text-blue-950 font-bold text-xl font-khmer tracking-wide)
           ======================================================== */}
        <div className="bg-gradient-to-r from-blue-50/80 via-slate-50 to-indigo-50/50 border border-blue-100/90 rounded-2xl p-3 sm:p-3.5 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-950 text-white flex items-center justify-center font-bold shadow-2xs shrink-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-200" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-blue-950 font-bold text-base sm:text-xl font-khmer tracking-wide leading-snug break-words">
                {isEn 
                  ? 'Weekly English Study Plan (WEEKLY ENGLISH TIMETABLE GRID)' 
                  : 'ផែនការសិក្សាភាសាអង់គ្លេសប្រចាំសប្ដាហ៍ (WEEKLY ENGLISH TIMETABLE GRID)'}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-khmer truncate sm:whitespace-normal">
                {isEn 
                  ? 'Structured 7-day study plan with time slots, skill distribution, and progress tracking.' 
                  : 'តារាងបែងចែកម៉ោងសិក្សា ជំនាញ និងខ្លឹមសាររៀន ៧ ថ្ងៃក្នុងមួយសប្តាហ៍ ដើម្បីធានាប្រសិទ្ធភាពនៃការរៀន។'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            2) BUTTON REPOSITIONING & FUNCTIONALITY FIX
               - LEFT: "ប្រវត្តិផែនការប្រចាំសប្តាហ៍" dropdown
               - FAR-RIGHT: [📥 រក្សាទុក] & [🖨️ បោះពុម្ព] (ml-auto flex items-center gap-2)
               - COMPACT BUTTONS: (px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm)
               - MOBILE RESPONSIVE: stacks vertically or scales dynamically on mobile
               - data-html2canvas-ignore="true" & print:hidden to prevent buttons in exported PNG and printout
           ======================================================== */}
        <div data-html2canvas-ignore="true" className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 w-full print:hidden">
          {/* LEFT: Weekly History Log Dropdown */}
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100/90 border border-slate-200/90 rounded-xl px-2.5 sm:px-3 py-1.5 shadow-2xs transition w-full sm:w-auto">
            <History className="w-4 h-4 text-blue-950 shrink-0" />
            <div className="flex items-center gap-1.5 flex-1 sm:flex-initial min-w-0">
              <label htmlFor="weekly-history-selector" className="text-xs font-bold text-slate-600 font-khmer whitespace-nowrap shrink-0">
                {isEn ? 'Weekly History:' : 'ប្រវត្តិផែនការប្រចាំសប្តាហ៍:'}
              </label>
              <select
                id="weekly-history-selector"
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(e.target.value)}
                className="bg-transparent text-xs font-bold text-blue-950 focus:outline-none cursor-pointer font-khmer pr-1 truncate"
              >
                {WEEK_HISTORY_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {isEn ? opt.labelEn : opt.labelKh} {savedWeeks.includes(opt.id) ? '✓' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* FAR-RIGHT: [🖼️ រក្សាទុកជារូបភាព] & [🖨️ បោះពុម្ព / PDF] compact buttons */}
          <div className="ml-auto flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {/* Button 1: [🖼️ រក្សាទុកជារូបភាព] -> Direct PNG Blob Download (Ankor_Timetable.png) without window.open */}
            <button
              id="btn-save-image-study-plan"
              type="button"
              disabled={isSavingImage || isPrinting}
              onClick={handleSaveImage}
              className="px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm bg-emerald-600 hover:bg-emerald-700 active:scale-95 disabled:opacity-50 text-white font-khmer flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
              title={isEn ? 'Save as Image (Download Ankor_Timetable.png)' : 'រក្សាទុកជារូបភាព (ទាញយក Ankor_Timetable.png)'}
            >
              <ImageIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{isSavingImage ? (isEn ? 'Saving PNG...' : 'កំពុងរក្សាទុក PNG...') : (isEn ? '🖼️ Save Image' : '🖼️ រក្សាទុកជារូបភាព')}</span>
            </button>

            {/* Button 2: [🖨️ បោះពុម្ព / PDF] -> Directly executes native print/PDF dialog (window.print()) */}
            <button
              id="btn-print-pdf-study-plan"
              type="button"
              onClick={handlePrintOrPdf}
              className="px-3 py-1.5 text-xs font-semibold rounded-md shadow-sm bg-blue-950 hover:bg-slate-900 active:scale-95 text-white font-khmer flex items-center justify-center gap-1.5 transition cursor-pointer whitespace-nowrap"
              title={isEn ? 'Print or Save as PDF' : 'បោះពុម្ព / PDF (Print / PDF)'}
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>{isEn ? '🖨️ Print / PDF' : '🖨️ បោះពុម្ព / PDF'}</span>
            </button>

            {/* Reset Button */}
            <button
              id="btn-reset-study-plan"
              type="button"
              onClick={handleResetPlan}
              className="p-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition cursor-pointer shadow-2xs"
              title={isEn ? 'Reset to default' : 'កំណត់កាលវិភាគឡើងវិញ'}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            3) STUDENT CREDENTIALS BAR (Image 44 Responsive Fix)
               - Prevents card clipping, text truncation, and badge overlap
               - Stacks cleanly on mobile screens (<640px)
           ======================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 bg-slate-50/80 rounded-xl p-2.5 border border-slate-200/80">
          
          {/* 1. Student Name */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {isEn ? 'Student Name' : 'ឈ្មោះសិស្ស (Name)'}
              </span>
              {isEditingName ? (
                <div className="flex items-center gap-1 mt-0.5">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full text-xs font-bold text-slate-800 border border-indigo-300 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-khmer"
                    autoFocus
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setIsEditingName(false);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="p-1 text-emerald-600 hover:text-emerald-700"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between group">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 font-khmer truncate">
                    {studentName}
                  </span>
                  <button
                    type="button"
                    data-html2canvas-ignore="true"
                    onClick={() => setIsEditingName(true)}
                    className="opacity-60 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 p-0.5 transition cursor-pointer shrink-0 ml-1 print:hidden"
                    title={isEn ? 'Edit Name' : 'កែប្រែឈ្មោះ'}
                  >
                    <Pencil className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Proficiency Level */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {isEn ? 'English Level' : 'កម្រិតសិក្សា (Level)'}
              </span>
              <div className="timetable-interactive-field">
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-purple-700 focus:outline-none cursor-pointer mt-0.5 truncate"
                >
                  <option value="BEGINNER (A1-A2)">BEGINNER (A1-A2)</option>
                  <option value="INTERMEDIATE (B1-B2)">INTERMEDIATE (B1-B2)</option>
                  <option value="ADVANCED (C1-C2)">ADVANCED (C1-C2)</option>
                </select>
              </div>
              <div className="timetable-static-display hidden text-xs font-bold text-purple-700 mt-0.5">
                {studentLevel}
              </div>
            </div>
          </div>

          {/* 3. Target Hours */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {isEn ? 'Target Hours / Week' : 'គោលដៅម៉ោងសិក្សា'}
              </span>
              <div className="timetable-interactive-field">
                <select
                  value={weeklyTargetHours}
                  onChange={(e) => setWeeklyTargetHours(Number(e.target.value))}
                  className="w-full bg-transparent text-xs font-bold text-amber-800 focus:outline-none cursor-pointer mt-0.5 truncate"
                >
                  <option value={5}>5 ម៉ោង / សប្តាហ៍ (5h/week)</option>
                  <option value={7}>7 ម៉ោង / សប្តាហ៍ (7h/week)</option>
                  <option value={10}>10 ម៉ោង / សប្តាហ៍ (10h/week)</option>
                  <option value={14}>14 ម៉ោង / សប្តាហ៍ (14h/week)</option>
                </select>
              </div>
              <div className="timetable-static-display hidden text-xs font-bold text-amber-800 mt-0.5 font-sans">
                {weeklyTargetHours} {isEn ? 'Hours / Week' : 'ម៉ោង / សប្តាហ៍'}
              </div>
            </div>
          </div>

          {/* 4. Active Plan / Week Status */}
          <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200 flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                {isEn ? 'Active Timetable' : 'កាលវិភាគសកម្ម'}
              </span>
              <p className="text-xs font-bold text-emerald-800 mt-0.5 font-khmer truncate">
                {WEEK_HISTORY_OPTIONS.find(o => o.id === selectedWeek)?.labelKh.split(' ')[0] || 'សប្តាហ៍បច្ចុប្បន្ន'}
                <span className="text-[10px] font-normal text-slate-500 ml-1">
                  ({savedWeeks.includes(selectedWeek) ? (isEn ? 'Saved' : 'បានរក្សាទុក') : (isEn ? 'Draft' : 'ព្រាង')})
                </span>
              </p>
            </div>
          </div>

        </div>

        {/* ========================================================
            4) 7-DAY TIMETABLE: DUAL-RENDER FOR RESPONSIVE PERFECTION
               - Mobile (<md): Stacked Day Cards to completely eliminate table overflow and clipping (Image 44 Fix)
               - Desktop/Tablet (md+): Smooth Horizontal Scrolling Table with Compact Padding
           ======================================================== */}

        {/* MOBILE VIEW: Stacked Day Cards (<md) */}
        <div id="timetable-mobile-cards" className="block md:hidden space-y-2.5 print:hidden">
          {scheduleItems.map((item, idx) => {
            const skillMeta = SKILL_METADATA[item.skill] || SKILL_METADATA.grammar;
            const isWeekend = item.dayNumber === 6 || item.dayNumber === 7;

            return (
              <div
                key={item.dayId}
                className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-colors"
              >
                {/* Day Header (Mon - Sun / ច័ន្ទ - អាទិត្យ): Weekend Highlight (Saturday & Sunday in DARK RED) */}
                <div className={`${
                  isWeekend 
                    ? 'bg-red-50/80 border-b-2 border-red-600' 
                    : 'bg-blue-50 border-b-2 border-blue-600'
                } rounded-t-xl py-2 px-3 flex items-center justify-between gap-2`}>
                  <div className="flex items-center gap-2">
                    <span className={`${
                      isWeekend ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-[#1E3A8A] text-blue-900 font-bold'
                    } text-lg sm:text-xl font-khmer`}>
                      {item.dayNameKh.split(' ')[0]}
                    </span>
                    <span className={`${
                      isWeekend ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-[#1E3A8A] text-blue-900 font-bold'
                    } text-sm sm:text-base font-sans opacity-90`}>
                      ({item.dayNameEn})
                    </span>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={item.status}
                    onChange={(e) => handleUpdateItem(idx, 'status', e.target.value as PlanStatus)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold font-khmer border transition cursor-pointer focus:outline-none shadow-2xs ${
                      item.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : item.status === 'in_progress'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    <option value="completed">{isEn ? '✓ Completed' : '✓ បានបញ្ចប់'}</option>
                    <option value="in_progress">{isEn ? '⚡ In Progress' : '⚡ កំពុងរៀន'}</option>
                    <option value="scheduled">{isEn ? '📅 Scheduled' : '📅 គ្រោងទុក'}</option>
                  </select>
                </div>

                <div className="p-2.5 sm:p-3 space-y-2">
                  {/* Time Range */}
                  <div className="relative">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="font-khmer">{isEn ? 'Time Slot:' : 'ម៉ោងសិក្សា:'}</span>
                    </div>
                    <div className="relative">
                      <select
                        value={item.timeRange}
                        onChange={(e) => handleUpdateItem(idx, 'timeRange', e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900 transition cursor-pointer font-sans appearance-none pr-7"
                      >
                        {TIME_SLOT_OPTIONS.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {isEn ? slot.labelEn : slot.labelKh}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Skills Selector */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <BookOpen className="w-3 h-3 text-slate-400" />
                      <span className="font-khmer">{isEn ? 'Skill Focus:' : 'ជំនាញរៀន:'}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {(['grammar', 'vocabulary', 'reading', 'listening', 'speaking'] as EnglishSkill[]).map((sk) => {
                        const meta = SKILL_METADATA[sk];
                        const isSelected = item.skill === sk;
                        return (
                          <button
                            key={sk}
                            type="button"
                            onClick={() => handleUpdateItem(idx, 'skill', sk)}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-khmer transition cursor-pointer flex items-center gap-1 ${
                              isSelected
                                ? `${meta.bgColor} ${meta.color} border ${meta.borderColor} shadow-2xs`
                                : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                            }`}
                          >
                            <span>{meta.icon}</span>
                            <span>{isEn ? meta.labelEn : meta.labelKh}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Topic Input */}
                  <div>
                    <input
                      type="text"
                      value={item.topic}
                      onChange={(e) => handleUpdateItem(idx, 'topic', e.target.value)}
                      placeholder={isEn ? 'Specific lesson or topic...' : 'ខ្លឹមសារមេរៀនជាក់លាក់...'}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900 font-khmer"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP & TABLET VIEW: Compact Table with Smooth Horizontal Scrolling (md+) & Print View */}
        <div id="timetable-table-wrapper" className="hidden md:block print:block border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {/* Table Header */}
              <thead>
                <tr className="bg-slate-100/90 text-slate-700 text-xs font-bold border-b border-slate-200 font-khmer">
                  <th className="py-2.5 px-3 w-[16%] text-center">
                    <span className="text-slate-800 font-bold">
                      {isEn ? 'Day (ថ្ងៃ)' : 'ថ្ងៃសិក្សា (Day)'}
                    </span>
                  </th>
                  <th className="py-2.5 px-3 w-[23%]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEn ? 'Time Range (ម៉ោង)' : 'ម៉ោងសិក្សា'}</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 w-[43%]">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEn ? 'English Skill & Content' : 'ជំនាញ & ខ្លឹមសាររៀន'}</span>
                    </div>
                  </th>
                  <th className="py-2.5 px-3 w-[18%] text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>{isEn ? 'Status' : 'ស្ថានភាព'}</span>
                    </div>
                  </th>
                </tr>
              </thead>

              {/* Table Body: 7 Days (Mon - Sun) */}
              <tbody className="divide-y divide-slate-100 text-xs">
                {scheduleItems.map((item, idx) => {
                  const skillMeta = SKILL_METADATA[item.skill] || SKILL_METADATA.grammar;
                  const isWeekend = item.dayNumber === 6 || item.dayNumber === 7;

                  return (
                    <tr 
                      key={item.dayId}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        item.status === 'completed' 
                          ? 'bg-emerald-50/20' 
                          : isWeekend 
                          ? 'bg-amber-50/10' 
                          : ''
                      }`}
                    >
                      {/* 1. ថ្ងៃសិក្សា (Day Header Cell: DARK RED for Saturday & Sunday, Deep Navy for Mon - Fri) */}
                      <td className="py-2 px-2 text-center font-khmer align-middle">
                        <div className={`${
                          isWeekend 
                            ? 'bg-red-50/80 border-b-2 border-red-600' 
                            : 'bg-blue-50 border-b-2 border-blue-600'
                        } rounded-t-xl py-2 px-3 inline-flex flex-col items-center justify-center min-w-[105px] shadow-2xs`}>
                          <span className={`${
                            isWeekend ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-[#1E3A8A] text-blue-900 font-bold'
                          } text-lg sm:text-xl leading-tight font-khmer`}>
                            {item.dayNameKh.split(' ')[0]}
                          </span>
                          <span className={`${
                            isWeekend ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-[#1E3A8A] text-blue-900 font-bold'
                          } text-xs sm:text-sm font-sans leading-tight opacity-90`}>
                            {item.dayNameEn}
                          </span>
                        </div>
                      </td>

                      {/* 2. ម៉ោងសិក្សា (Time Range Dropdown) */}
                      <td className="py-2 px-3">
                        <div className="timetable-interactive-field relative">
                          <select
                            value={item.timeRange}
                            onChange={(e) => handleUpdateItem(idx, 'timeRange', e.target.value)}
                            className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900 transition cursor-pointer font-sans appearance-none pr-7"
                          >
                            {TIME_SLOT_OPTIONS.map((slot) => (
                              <option key={slot.value} value={slot.value}>
                                {isEn ? slot.labelEn : slot.labelKh}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <div className="timetable-static-display hidden text-xs font-bold font-sans text-slate-900">
                          {item.timeRange}
                        </div>
                      </td>

                      {/* 3. ជំនាញ & ខ្លឹមសាររៀន (Skill & Topic Selector) */}
                      <td className="py-2 px-3 space-y-1.5">
                        <div className="timetable-interactive-field space-y-1.5">
                          {/* Skill Selector Pills */}
                          <div className="flex flex-wrap gap-1">
                            {(['grammar', 'vocabulary', 'reading', 'listening', 'speaking'] as EnglishSkill[]).map((sk) => {
                              const meta = SKILL_METADATA[sk];
                              const isSelected = item.skill === sk;
                              return (
                                <button
                                  key={sk}
                                  type="button"
                                  onClick={() => handleUpdateItem(idx, 'skill', sk)}
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold font-khmer transition cursor-pointer flex items-center gap-1 ${
                                    isSelected
                                      ? `${meta.bgColor} ${meta.color} border ${meta.borderColor} shadow-2xs`
                                      : 'bg-slate-100 text-slate-500 hover:text-slate-800'
                                  }`}
                                >
                                  <span>{meta.icon}</span>
                                  <span>{isEn ? meta.labelEn : meta.labelKh}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Topic Input */}
                          <div className="relative">
                            <input
                              type="text"
                              value={item.topic}
                              onChange={(e) => handleUpdateItem(idx, 'topic', e.target.value)}
                              placeholder={isEn ? 'Specific lesson or topic...' : 'ខ្លឹមសារមេរៀនជាក់លាក់...'}
                              className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-900 font-khmer"
                            />
                          </div>
                        </div>

                        <div className="timetable-static-display hidden space-y-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${skillMeta.bgColor} ${skillMeta.color} border ${skillMeta.borderColor}`}>
                            <span>{skillMeta.icon}</span>
                            <span>{isEn ? skillMeta.labelEn : skillMeta.labelKh}</span>
                          </span>
                          <div className="text-xs font-semibold text-slate-800 font-khmer">
                            {item.topic}
                          </div>
                        </div>
                      </td>

                      {/* 4. ស្ថានភាព (Status Dropdown) */}
                      <td className="py-2 px-3 text-center">
                        <div className="timetable-interactive-field">
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateItem(idx, 'status', e.target.value as PlanStatus)}
                            className={`py-1 px-2 rounded-lg text-xs font-bold font-khmer border transition cursor-pointer focus:outline-none ${
                              item.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                : item.status === 'in_progress'
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300'
                                : 'bg-slate-50 text-slate-600 border-slate-200'
                            }`}
                          >
                            <option value="completed">
                              {isEn ? '✓ Completed' : '✓ បានបញ្ចប់'}
                            </option>
                            <option value="in_progress">
                              {isEn ? '⚡ In Progress' : '⚡ កំពុងរៀន'}
                            </option>
                            <option value="scheduled">
                              {isEn ? '📅 Scheduled' : '📅 គ្រោងទុក'}
                            </option>
                          </select>
                        </div>
                        <div className="timetable-static-display hidden">
                          <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-lg text-xs font-bold font-khmer ${
                            item.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : item.status === 'in_progress'
                              ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {item.status === 'completed'
                              ? (isEn ? '✓ Completed' : '✓ បានបញ្ចប់')
                              : item.status === 'in_progress'
                              ? (isEn ? '⚡ In Progress' : '⚡ កំពុងរៀន')
                              : (isEn ? '📅 Scheduled' : '📅 គ្រោងទុក')}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================
            5) COMPACT FOOTER: SUMMARY STATS & MOTIVATIONAL PROGRESS
           ======================================================== */}
        <div className="bg-slate-50 p-2.5 sm:p-3 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-2.5 text-xs font-khmer">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-between sm:justify-start w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-600">
                {isEn ? 'Completed' : 'បានបញ្ចប់'}: <strong className="text-emerald-700 font-sans">{completedCount} / 7</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-600">
                {isEn ? 'In Progress' : 'កំពុងរៀន'}: <strong className="text-indigo-700 font-sans">{inProgressCount}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-slate-600">
                {isEn ? 'Total Planned' : 'ម៉ោងគ្រោងទុកសរុប'}: <strong className="text-amber-800 font-sans">7.0h</strong>
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 w-full sm:w-52">
            <span className="text-[11px] font-bold text-slate-500">{completionRate}%</span>
            <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            6) OFFICIAL VERIFICATION SIGNATURES & INSTITUTIONAL STAMP
           ======================================================== */}
        <div id="timetable-verification-signatures" className="grid grid-cols-2 gap-6 sm:gap-8 pt-4 border-t border-slate-200 text-xs font-khmer">
          <div className="text-center space-y-6 sm:space-y-8">
            <p className="font-bold text-slate-800">ហត្ថលេខាសិស្សសិក្សា (Student's Commitment)</p>
            <div className="border-b border-slate-300 w-36 sm:w-48 mx-auto" />
            <p className="text-[11px] font-semibold text-slate-600">{studentName}</p>
          </div>

          <div className="text-center space-y-6 sm:space-y-8">
            <p className="font-bold text-slate-800">គ្រូបង្រៀន / អាណាព្យាបាល (Teacher / Advisor)</p>
            <div className="border-b border-slate-300 w-36 sm:w-48 mx-auto" />
            <p className="text-[11px] font-semibold text-slate-600">Angkor English Academy Academic Department</p>
          </div>
        </div>

        {/* Timetable Footer Stamp */}
        <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-sans">
          Angkor English Academy • Generated on {new Date().toLocaleDateString()} • Keep practicing daily!
        </div>

      </div>

      {/* ========================================================
          7) CLEAN PRINTABLE CARD MODAL (NO CRASH, 100% RELIABLE)
         ======================================================== */}
      {cleanCardModalOpen && (
        <div 
          id="modal-clean-timetable-card"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs font-khmer"
          onClick={() => setCleanCardModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {isEn ? 'Printable Timetable Card' : 'កាលវិភាគសិក្សាស្អាត (Clean Printable Card)'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {isEn 
                      ? 'Right-click on the card below to Copy/Save Image, or click Print/PDF' 
                      : 'ចុចកណ្ដុរស្ដាំ (Right-Click) លើតារាងដើម្បី Save/Copy Image ឬចុចបោះពុម្ពជា PDF'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cleanCardBlobUrl && (
                  <a
                    href={cleanCardBlobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 transition"
                    title={isEn ? 'Open in new tab' : 'បើកក្នុង Tab ថ្មី'}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{isEn ? 'New Tab' : 'Tab ថ្មី'}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-950 hover:bg-slate-900 text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{isEn ? 'Print / PDF' : 'បោះពុម្ព / PDF'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCleanCardModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body: High Resolution Clean Card */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-100/50">
              <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-6 shadow-sm mx-auto max-w-3xl">
                {/* Header Banner */}
                <div className="flex items-center justify-between border-b-2 border-blue-900 pb-3 mb-4">
                  <div>
                    <h2 className="text-base sm:text-lg font-extrabold text-blue-900 font-khmer">
                      {isEn ? 'Angkor English • Weekly Study Timetable' : 'អង្គរអង់គ្លេស • កាលវិភាគសិក្សាភាសាអង់គ្លេសប្រចាំសប្ដាហ៍'}
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      ផែនការសិក្សា ៧ ថ្ងៃ (Weekly 7-Day Curriculum Grid)
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-600">
                    <div><strong>សិស្ស:</strong> {studentName}</div>
                    <div><strong>កម្រិត:</strong> {studentLevel}</div>
                    <div><strong>គោលដៅ:</strong> {weeklyTargetHours} ម៉ោង/សប្តាហ៍</div>
                  </div>
                </div>

                {/* Table View */}
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-2 px-3 text-center w-28">ថ្ងៃ (Day)</th>
                        <th className="py-2 px-3 w-36">ម៉ោង (Time)</th>
                        <th className="py-2 px-3">ជំនាញ & ខ្លឹមសារ (Skill & Topic)</th>
                        <th className="py-2 px-3 text-center w-28">ស្ថានភាព (Status)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {scheduleItems.map((item) => {
                        const isWeekend = item.dayNumber === 6 || item.dayNumber === 7;
                        return (
                          <tr 
                            key={item.dayId} 
                            className={isWeekend ? 'bg-red-50/20' : 'hover:bg-slate-50/50'}
                          >
                            <td className="py-2 px-3 text-center align-middle">
                              <div className={`inline-flex flex-col items-center justify-center px-2.5 py-1 rounded-md ${
                                isWeekend 
                                  ? 'bg-red-50/80 border-b-2 border-red-600' 
                                  : 'bg-blue-50 border-b-2 border-blue-600'
                              }`}>
                                <span className={`text-sm leading-tight ${
                                  isWeekend ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-blue-900 font-bold'
                                } font-khmer`}>
                                  {item.dayNameKh.split(' ')[0]}
                                </span>
                                <span className={`text-[10px] leading-tight ${
                                  isWeekend ? 'text-red-600 font-bold border-b-2 border-red-600' : 'text-blue-600'
                                }`}>
                                  {item.dayNameEn}
                                </span>
                              </div>
                            </td>
                            <td className="py-2 px-3 font-semibold text-slate-800 align-middle whitespace-nowrap">
                              ⏰ {item.timeRange}
                            </td>
                            <td className="py-2 px-3 align-middle">
                              <span className="text-[10px] font-bold text-indigo-700 uppercase block">
                                {item.skill}
                              </span>
                              <span className="text-slate-900 font-medium block">
                                {item.topic}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-center align-middle whitespace-nowrap">
                              {item.status === 'completed' ? (
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  ✓ បានបញ្ចប់
                                </span>
                              ) : item.status === 'in_progress' ? (
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  ⚡ កំពុងរៀន
                                </span>
                              ) : (
                                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                                  📅 គ្រោងទុក
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-6 mt-6 border-t border-slate-200 text-center text-xs">
                  <div>
                    <p className="font-bold text-slate-700">ហត្ថលេខាសិស្ស (Student)</p>
                    <div className="border-b border-slate-300 w-32 mx-auto my-4" />
                    <p className="text-[10px] text-slate-500">{studentName}</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-700">គ្រូបង្រៀន (Teacher)</p>
                    <div className="border-b border-slate-300 w-32 mx-auto my-4" />
                    <p className="text-[10px] text-slate-500">Angkor English Academy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
