import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  INITIAL_GOALS,
  INITIAL_LESSONS,
  INITIAL_REMINDERS,
  INITIAL_SCAM_REPORTS,
  INITIAL_TRANSACTIONS,
} from '../data/seedData';
import { TRANSLATIONS, TranslationBundle } from '../i18n/translations';
import {
  LanguageCode,
  LearnCategoryId,
  Lesson,
  Reminder,
  SavingsGoal,
  ScamReport,
  Transaction,
} from '../types/finvora';
import { stopSpeaking } from '../utils/formatters';

interface FinvoraState {
  language: LanguageCode;
  lessons: Lesson[];
  completedLessonIds: string[];
  offlineLessonIds: string[];
  transactions: Transaction[];
  goals: SavingsGoal[];
  scamReports: ScamReport[];
  reminders: Reminder[];
  unlockedBadges: string[];
  languageUsage: Record<LanguageCode, number>;
  upiGuideCompleted: boolean;
  scamChecksCount: number;
  schemeChecksCount: number;
}

const STORAGE_KEY = 'finvora_app_state_v1';

const DEFAULT_STATE: FinvoraState = {
  language: 'en',
  lessons: INITIAL_LESSONS,
  completedLessonIds: ['sav-1', 'dig-1'],
  offlineLessonIds: ['sav-1', 'dig-1'],
  transactions: INITIAL_TRANSACTIONS,
  goals: INITIAL_GOALS,
  scamReports: INITIAL_SCAM_REPORTS,
  reminders: INITIAL_REMINDERS,
  unlockedBadges: ['saver-star'],
  languageUsage: {
    kn: 640,
    te: 260,
    hi: 390,
    mr: 185,
    ta: 140,
    en: 225,
  },
  upiGuideCompleted: false,
  scamChecksCount: 0,
  schemeChecksCount: 0,
};

function loadInitialState(): FinvoraState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<FinvoraState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      lessons: parsed.lessons && parsed.lessons.length > 0 ? parsed.lessons : DEFAULT_STATE.lessons,
      transactions:
        parsed.transactions && parsed.transactions.length > 0
          ? parsed.transactions
          : DEFAULT_STATE.transactions,
      goals: parsed.goals && parsed.goals.length > 0 ? parsed.goals : DEFAULT_STATE.goals,
      scamReports:
        parsed.scamReports && parsed.scamReports.length > 0
          ? parsed.scamReports
          : DEFAULT_STATE.scamReports,
      reminders:
        parsed.reminders && parsed.reminders.length > 0
          ? parsed.reminders
          : DEFAULT_STATE.reminders,
      languageUsage: {
        ...DEFAULT_STATE.languageUsage,
        ...(parsed.languageUsage || {}),
      },
    };
  } catch {
    return DEFAULT_STATE;
  }
}

interface FinvoraContextValue extends FinvoraState {
  t: TranslationBundle;
  totalIncome: number;
  totalExpenses: number;
  totalSaved: number;
  ttsWarning: string;
  setTtsWarning: (msg: string) => void;
  setLanguage: (lang: LanguageCode) => void;
  toggleLessonComplete: (lessonId: string) => void;
  toggleLessonOffline: (lessonId: string) => void;
  addCustomLesson: (input: {
    categoryId: LearnCategoryId;
    title: string;
    summary: string;
    steps: string[];
    keyTip: string;
  }) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  addGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  updateGoal: (id: string, updates: Partial<SavingsGoal>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  addScamReport: (report: Omit<ScamReport, 'id' | 'date' | 'status'>) => void;
  toggleScamReportStatus: (id: string) => void;
  recordScamCheck: () => void;
  recordSchemeCheck: () => void;
  markUpiGuideCompleted: () => void;
  toggleReminder: (id: string) => void;
  addReminder: (title: string, dueText: string) => void;
  resetDemoData: () => void;
}

const FinvoraContext = createContext<FinvoraContextValue | null>(null);

export const FinvoraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FinvoraState>(() => loadInitialState());
  const [ttsWarning, setTtsWarning] = useState<string>('');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state]);

  const totals = useMemo(() => {
    const income = state.transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = state.transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalSaved: income - expenses,
    };
  }, [state.transactions]);

  const setLanguage = (lang: LanguageCode) => {
    stopSpeaking();
    setTtsWarning('');
    setState((prev) => ({
      ...prev,
      language: lang,
      languageUsage: {
        ...prev.languageUsage,
        [lang]: (prev.languageUsage[lang] || 0) + 1,
      },
    }));
  };

  const toggleLessonComplete = (lessonId: string) => {
    setState((prev) => {
      const exists = prev.completedLessonIds.includes(lessonId);
      const nextCompleted = exists
        ? prev.completedLessonIds.filter((id) => id !== lessonId)
        : [...prev.completedLessonIds, lessonId];
      const nextBadges = new Set(prev.unlockedBadges);
      if (nextCompleted.length >= 3 || prev.upiGuideCompleted) {
        nextBadges.add('digital-champion');
      }
      return {
        ...prev,
        completedLessonIds: nextCompleted,
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const toggleLessonOffline = (lessonId: string) => {
    setState((prev) => {
      const exists = prev.offlineLessonIds.includes(lessonId);
      const nextOffline = exists
        ? prev.offlineLessonIds.filter((id) => id !== lessonId)
        : [...prev.offlineLessonIds, lessonId];
      return {
        ...prev,
        offlineLessonIds: nextOffline,
      };
    });
  };

  const addCustomLesson = (input: {
    categoryId: LearnCategoryId;
    title: string;
    summary: string;
    steps: string[];
    keyTip: string;
  }) => {
    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      categoryId: input.categoryId,
      title: input.title,
      summary: input.summary,
      duration: '3 min',
      steps: input.steps.length > 0 ? input.steps : [input.summary],
      keyTip: input.keyTip || 'Ask your local bank or SHG leader if you have any doubts.',
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      lessons: [newLesson, ...prev.lessons],
    }));
  };

  const addTransaction = (tx: Omit<Transaction, 'id'>) => {
    const created: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`,
    };
    setState((prev) => {
      const nextTransactions = [created, ...prev.transactions];
      const income = nextTransactions
        .filter((item) => item.type === 'income')
        .reduce((s, item) => s + item.amount, 0);
      const expenses = nextTransactions
        .filter((item) => item.type === 'expense')
        .reduce((s, item) => s + item.amount, 0);
      const nextBadges = new Set(prev.unlockedBadges);
      if (income - expenses >= 5000) {
        nextBadges.add('saver-star');
      }
      return {
        ...prev,
        transactions: nextTransactions,
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setState((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  };

  const addGoal = (goal: Omit<SavingsGoal, 'id'>) => {
    const created: SavingsGoal = {
      ...goal,
      id: `goal-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      goals: [...prev.goals, created],
    }));
  };

  const updateGoal = (id: string, updates: Partial<SavingsGoal>) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? { ...g, ...updates } : g)),
    }));
  };

  const contributeToGoal = (id: string, amount: number) => {
    setState((prev) => {
      const nextBadges = new Set(prev.unlockedBadges);
      nextBadges.add('saver-star');
      return {
        ...prev,
        goals: prev.goals.map((g) =>
          g.id === id ? { ...g, saved: Math.max(0, g.saved + amount) } : g
        ),
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const addScamReport = (report: Omit<ScamReport, 'id' | 'date' | 'status'>) => {
    const newReport: ScamReport = {
      ...report,
      id: `rep-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
      status: 'Pending',
    };
    setState((prev) => {
      const nextBadges = new Set(prev.unlockedBadges);
      nextBadges.add('scam-fighter');
      return {
        ...prev,
        scamReports: [newReport, ...prev.scamReports],
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const toggleScamReportStatus = (id: string) => {
    setState((prev) => ({
      ...prev,
      scamReports: prev.scamReports.map((r) =>
        r.id === id
          ? { ...r, status: r.status === 'Pending' ? 'Resolved' : 'Pending' }
          : r
      ),
    }));
  };

  const recordScamCheck = () => {
    setState((prev) => {
      const nextBadges = new Set(prev.unlockedBadges);
      nextBadges.add('scam-fighter');
      return {
        ...prev,
        scamChecksCount: prev.scamChecksCount + 1,
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const recordSchemeCheck = () => {
    setState((prev) => {
      const nextBadges = new Set(prev.unlockedBadges);
      nextBadges.add('scheme-explorer');
      return {
        ...prev,
        schemeChecksCount: prev.schemeChecksCount + 1,
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const markUpiGuideCompleted = () => {
    setState((prev) => {
      const nextBadges = new Set(prev.unlockedBadges);
      nextBadges.add('digital-champion');
      return {
        ...prev,
        upiGuideCompleted: true,
        unlockedBadges: Array.from(nextBadges),
      };
    });
  };

  const toggleReminder = (id: string) => {
    setState((prev) => ({
      ...prev,
      reminders: prev.reminders.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      ),
    }));
  };

  const addReminder = (title: string, dueText: string) => {
    const newRem: Reminder = {
      id: `rem-${Date.now()}`,
      title,
      dueText,
      completed: false,
    };
    setState((prev) => ({
      ...prev,
      reminders: [newRem, ...prev.reminders],
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
  };

  return (
    <FinvoraContext.Provider
      value={{
        ...state,
        t: TRANSLATIONS[state.language] || TRANSLATIONS.en,
        ...totals,
        ttsWarning,
        setTtsWarning,
        setLanguage,
        toggleLessonComplete,
        toggleLessonOffline,
        addCustomLesson,
        addTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        contributeToGoal,
        addScamReport,
        toggleScamReportStatus,
        recordScamCheck,
        recordSchemeCheck,
        markUpiGuideCompleted,
        toggleReminder,
        addReminder,
        resetDemoData,
      }}
    >
      {children}
    </FinvoraContext.Provider>
  );
};

export function useFinvora(): FinvoraContextValue {
  const ctx = useContext(FinvoraContext);
  if (!ctx) {
    throw new Error('useFinvora must be used within a FinvoraProvider');
  }
  return ctx;
}
