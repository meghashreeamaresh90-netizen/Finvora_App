import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  Landmark,
  PiggyBank,
  QrCode,
  ShieldCheck,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { LEARN_CATEGORIES } from '../data/seedData';
import { localizeLesson } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { LearnCategoryId, Lesson } from '../types/finvora';

const CATEGORY_ICONS: Record<LearnCategoryId, React.ComponentType<{ className?: string }>> = {
  savings: PiggyBank,
  budgeting: Wallet,
  banking: Landmark,
  loans: BookOpen,
  insurance: ShieldCheck,
  'digital-payments': Smartphone,
};

export const LearnPage: React.FC = () => {
  const {
    t,
    language,
    lessons,
    completedLessonIds,
    offlineLessonIds,
    toggleLessonComplete,
    toggleLessonOffline,
  } = useFinvora();

  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;
  const [selectedCategory, setSelectedCategory] = useState<LearnCategoryId | 'all' | 'offline'>('all');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);

  const localizedLessons = useMemo(
    () => lessons.map((l) => localizeLesson(l, language)),
    [lessons, language]
  );

  const activeLesson: Lesson | null = useMemo(
    () => (activeLessonId ? localizedLessons.find((l) => l.id === activeLessonId) || null : null),
    [activeLessonId, localizedLessons]
  );

  const categoryTitles: Record<LearnCategoryId, string> = {
    savings: t.catSavings,
    budgeting: t.catBudgeting,
    banking: t.catBanking,
    loans: t.catLoans,
    insurance: t.catInsurance,
    'digital-payments': t.catDigital,
  };

  const progressPct = useMemo(() => {
    if (localizedLessons.length === 0) return 0;
    return Math.round((completedLessonIds.length / localizedLessons.length) * 100);
  }, [completedLessonIds.length, localizedLessons.length]);

  const visibleLessons = useMemo(() => {
    if (selectedCategory === 'all') return localizedLessons;
    if (selectedCategory === 'offline') {
      return localizedLessons.filter((l) => offlineLessonIds.includes(l.id));
    }
    return localizedLessons.filter((l) => l.categoryId === selectedCategory);
  }, [localizedLessons, offlineLessonIds, selectedCategory]);

  if (activeLesson) {
    const isDone = completedLessonIds.includes(activeLesson.id);
    const isOffline = offlineLessonIds.includes(activeLesson.id);
    const fullAudioText = `${activeLesson.title}. ${activeLesson.summary}. ${activeLesson.steps.join(
      '. '
    )}. ${s.rememberTip}: ${activeLesson.keyTip}`;

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => setActiveLessonId(null)}
          className="inline-flex items-center gap-2 min-h-[56px] px-5 rounded-[20px] bg-[#ECFDF5] border-2 border-[#166534] text-[#166534] font-bold text-[18px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t.back}</span>
        </button>

        <article className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-6 shadow-[0_6px_0_0_rgba(15,23,42,0.08)] space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-bold text-[#166534]">
              {categoryTitles[activeLesson.categoryId]} · {activeLesson.duration}
            </span>
            <SpeakButton text={fullAudioText} />
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0F172A]">
            {activeLesson.title}
          </h1>

          <p className="text-[19px] font-medium text-[#334155]">{activeLesson.summary}</p>

          <div className="space-y-3 pt-2">
            {activeLesson.steps.map((step, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-4"
              >
                <div className="w-9 h-9 rounded-full bg-[#166534] text-white font-extrabold flex items-center justify-center shrink-0">
                  {idx + 1}
                </div>
                <p className="text-[18px] font-medium text-[#0F172A] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-[#FEFCE8] border-2 border-[#FACC15] p-4">
            <p className="text-sm font-extrabold text-[#854D0E] uppercase tracking-wide mb-1">
              {s.rememberTip}
            </p>
            <p className="text-[19px] font-bold text-[#0F172A]">{activeLesson.keyTip}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={() => toggleLessonOffline(activeLesson.id)}
              className={`inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-[20px] font-bold text-[18px] border-2 transition-colors ${
                isOffline
                  ? 'bg-[#F0F9FF] border-[#0EA5E9] text-[#0369A1]'
                  : 'bg-white border-[#94A3B8] text-[#0F172A] hover:border-[#0EA5E9]'
              }`}
            >
              <Download className="w-5 h-5" />
              <span>{isOffline ? t.downloadedCheck : t.downloadOffline}</span>
            </button>

            <button
              type="button"
              onClick={() => toggleLessonComplete(activeLesson.id)}
              className={`inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-[20px] font-bold text-[18px] transition-colors ${
                isDone
                  ? 'bg-[#166534] text-white'
                  : 'bg-[#F97316] hover:bg-[#EA580C] text-white shadow-[0_4px_0_0_#9A3412]'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isDone ? t.completedCheck : t.markComplete}</span>
            </button>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
            {t.learnTitle}
          </h1>
          <p className="text-[18px] font-medium text-[#334155]">{t.learnSubtitle}</p>
        </div>
        <SpeakButton text={`${t.learnTitle}. ${t.learnSubtitle}`} />
      </div>

      {/* Progress Bar Card */}
      <section className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.06)]">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <h2 className="text-[20px] font-bold text-[#166534]">{t.yourProgress}</h2>
          <span className="text-[18px] font-extrabold text-[#166534] tabular-nums">
            {completedLessonIds.length} / {localizedLessons.length} {t.lessonsDone} ({progressPct}%)
          </span>
        </div>
        <div className="w-full h-5 rounded-full bg-white border border-[#A7F3D0] overflow-hidden">
          <div
            className="h-full bg-[#16A34A] transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-base font-semibold text-[#334155]">
            {offlineLessonIds.length} {t.offlineSaved}
          </span>
          <Link
            to="/upi-guide"
            className="inline-flex items-center gap-2 min-h-[48px] px-4 rounded-2xl bg-[#0EA5E9] text-white font-bold text-base hover:bg-[#0284C7]"
          >
            <QrCode className="w-5 h-5" />
            <span>{t.openUpiGuide}</span>
          </Link>
        </div>
      </section>

      {/* 6 Categories Grid */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {LEARN_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id];
            const catLessons = localizedLessons.filter((l) => l.categoryId === cat.id);
            const catDone = catLessons.filter((l) => completedLessonIds.includes(l.id)).length;
            const active = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(active ? 'all' : cat.id)}
                className={`text-left rounded-[20px] p-4 border-2 min-h-[120px] flex flex-col justify-between transition-all ${
                  active
                    ? 'bg-[#166534] border-[#166534] text-white shadow-[0_4px_0_0_#0F172A]'
                    : 'bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#16A34A]'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      active ? 'bg-white/20 text-white' : 'bg-[#ECFDF5] text-[#166534]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      active ? 'text-[#DCFCE7]' : 'text-[#166534]'
                    }`}
                  >
                    {catDone}/{catLessons.length}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-[18px] font-extrabold leading-snug">
                    {categoryTitles[cat.id]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`min-h-[44px] px-4 rounded-full font-bold text-base border-2 ${
              selectedCategory === 'all'
                ? 'bg-[#166534] border-[#166534] text-white'
                : 'bg-white border-[#CBD5E1] text-[#0F172A]'
            }`}
          >
            {s.allFilter} ({localizedLessons.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory('offline')}
            className={`min-h-[44px] px-4 rounded-full font-bold text-base border-2 ${
              selectedCategory === 'offline'
                ? 'bg-[#0EA5E9] border-[#0EA5E9] text-white'
                : 'bg-white border-[#CBD5E1] text-[#0F172A]'
            }`}
          >
            {s.downloadedOfflineFilter} ({offlineLessonIds.length})
          </button>
        </div>
      </section>

      {/* Lessons List */}
      <section className="space-y-4">
        {visibleLessons.length === 0 ? (
          <div className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-6 text-center">
            <p className="text-[18px] font-bold text-[#166534]">{s.noOfflineMsg}</p>
          </div>
        ) : (
          visibleLessons.map((lesson) => {
            const isDone = completedLessonIds.includes(lesson.id);
            const isOffline = offlineLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.06)] space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-[220px]">
                    <div className="text-sm font-bold text-[#166534]">
                      {categoryTitles[lesson.categoryId]} · {lesson.duration}
                      {lesson.isCustom && ` · ${s.trainerAdded}`}
                    </div>
                    <h3 className="text-[21px] font-extrabold text-[#0F172A] mt-1">
                      {lesson.title}
                    </h3>
                    <p className="text-[18px] text-[#334155] mt-1">{lesson.summary}</p>
                  </div>
                  <SpeakButton
                    text={`${lesson.title}. ${lesson.summary}. ${lesson.keyTip}`}
                    compact
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveLessonId(lesson.id)}
                    className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[18px] shadow-[0_3px_0_0_#9A3412]"
                  >
                    <BookOpen className="w-5 h-5" />
                    <span>{s.readLesson}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLessonOffline(lesson.id)}
                    className={`inline-flex items-center justify-center gap-2 min-h-[56px] px-4 rounded-[20px] font-bold text-base border-2 ${
                      isOffline
                        ? 'bg-[#F0F9FF] border-[#0EA5E9] text-[#0369A1]'
                        : 'bg-white border-[#CBD5E1] text-[#0F172A]'
                    }`}
                  >
                    <Download className="w-5 h-5" />
                    <span>{isOffline ? t.downloadedCheck : t.downloadOffline}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleLessonComplete(lesson.id)}
                    className={`inline-flex items-center justify-center gap-2 min-h-[56px] px-4 rounded-[20px] font-bold text-base border-2 ${
                      isDone
                        ? 'bg-[#ECFDF5] border-[#16A34A] text-[#166534]'
                        : 'bg-white border-[#CBD5E1] text-[#334155]'
                    }`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>{isDone ? t.completedCheck : t.markComplete}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
};
