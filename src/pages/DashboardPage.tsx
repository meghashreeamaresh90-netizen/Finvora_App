import React, { useMemo, useState } from 'react';
import { Award, Bell, CheckCircle2, Plus, ShieldAlert, Star } from 'lucide-react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { LakshmiAvatarSvg } from '../components/Illustrations';
import { MicButton } from '../components/MicButton';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { LEARN_CATEGORIES } from '../data/seedData';
import { getLocalizedBadgeMeta, localizeReminder } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { LearnCategoryId } from '../types/finvora';
import { formatINR } from '../utils/formatters';

const BADGE_CATALOG = [
  {
    id: 'saver-star',
    title: 'Saver Star',
    desc: 'Saved ₹5,000+ or added money to a family savings goal.',
    icon: Star,
  },
  {
    id: 'scam-fighter',
    title: 'Scam Fighter',
    desc: 'Checked a suspicious SMS or reported a scam message.',
    icon: ShieldAlert,
  },
  {
    id: 'digital-champion',
    title: 'Digital Champion',
    desc: 'Completed 3+ money lessons or finished the UPI Step Guide.',
    icon: Award,
  },
  {
    id: 'scheme-explorer',
    title: 'Scheme Explorer',
    desc: 'Checked eligibility for government schemes.',
    icon: CheckCircle2,
  },
];

export const DashboardPage: React.FC = () => {
  const {
    t,
    language,
    lessons,
    completedLessonIds,
    offlineLessonIds,
    totalIncome,
    totalExpenses,
    totalSaved,
    goals,
    unlockedBadges,
    reminders,
    toggleReminder,
    addReminder,
  } = useFinvora();

  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemDue, setNewRemDue] = useState('');

  const categoryLabels: Record<LearnCategoryId, string> = {
    savings: t.catSavings,
    budgeting: t.catBudgeting,
    banking: t.catBanking,
    loans: t.catLoans,
    insurance: t.catInsurance,
    'digital-payments': t.catDigital,
  };

  const learningPct = Math.round(
    (completedLessonIds.length / Math.max(1, lessons.length)) * 100
  );

  const totalGoalSaved = useMemo(
    () => goals.reduce((sum, g) => sum + g.saved, 0),
    [goals]
  );

  const chartData = [
    { name: s.chartLabels.income, amount: totalIncome, fill: '#16A34A' },
    { name: s.chartLabels.expenses, amount: totalExpenses, fill: '#F97316' },
    { name: s.chartLabels.saved, amount: Math.max(0, totalSaved), fill: '#0EA5E9' },
    { name: s.chartLabels.goals, amount: totalGoalSaved, fill: '#166534' },
  ];

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRemTitle.trim()) return;
    addReminder(newRemTitle.trim(), newRemDue.trim() || s.lockedBadge);
    setNewRemTitle('');
    setNewRemDue('');
  };

  const speakSummaryText =
    language === 'kn'
      ? `${s.profileTitle}. ${completedLessonIds.length} ಪಾಠಗಳು ಮುಗಿದಿವೆ, ${unlockedBadges.length} ಬ್ಯಾಡ್ಜ್‌ಗಳು ಲಭಿಸಿವೆ, ಮತ್ತು ಈ ತಿಂಗಳು ${formatINR(totalSaved)} ಉಳಿತಾಯವಾಗಿದೆ.`
      : language === 'te'
      ? `${s.profileTitle}. ${completedLessonIds.length} పాఠాలు పూర్తయ్యాయి, ${unlockedBadges.length} బ్యాడ్జీలు లభించాయి, మరియు ఈ నెలలో ${formatINR(totalSaved)} పొదుపు అయింది.`
      : `${s.profileTitle}. ${completedLessonIds.length} / ${lessons.length} ${s.lessonsDoneCard}, ${unlockedBadges.length} ${s.badgesEarnedText}, ${s.monthlySavedCard}: ${formatINR(totalSaved)}.`;

  return (
    <div className="space-y-6">
      <div className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LakshmiAvatarSvg className="w-16 h-16 shrink-0" />
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
              {s.profileTitle}
            </h1>
            <p className="text-[18px] font-medium text-[#334155]">
              {s.agePlaceSummary} · {unlockedBadges.length}/{BADGE_CATALOG.length} {s.badgesEarnedText}
            </p>
          </div>
        </div>
        <SpeakButton text={speakSummaryText} />
      </div>

      {/* Real App Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-4">
          <p className="text-sm font-bold text-[#475569]">{s.monthlySavedCard}</p>
          <p className="text-[26px] font-extrabold text-[#16A34A] tabular-nums">
            {formatINR(totalSaved)}
          </p>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-4">
          <p className="text-sm font-bold text-[#475569]">{s.totalInGoalsCard}</p>
          <p className="text-[26px] font-extrabold text-[#166534] tabular-nums">
            {formatINR(totalGoalSaved)}
          </p>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-4">
          <p className="text-sm font-bold text-[#475569]">{s.lessonsDoneCard}</p>
          <p className="text-[26px] font-extrabold text-[#0EA5E9] tabular-nums">
            {learningPct}%
          </p>
        </div>
        <div className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-4">
          <p className="text-sm font-bold text-[#475569]">{s.offlineLessonsCard}</p>
          <p className="text-[26px] font-extrabold text-[#F97316] tabular-nums">
            {offlineLessonIds.length}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5">
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-3">
            {s.moneyOverviewChart}
          </h2>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 700 }} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip formatter={(val) => formatINR(Number(val ?? 0))} />
                <Bar dataKey="amount" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 space-y-3">
          <h2 className="text-[22px] font-bold text-[#0F172A]">
            {s.learningTopicChart}
          </h2>
          {LEARN_CATEGORIES.map((cat) => {
            const catTotal = lessons.filter((l) => l.categoryId === cat.id).length;
            const catDone = lessons.filter(
              (l) => l.categoryId === cat.id && completedLessonIds.includes(l.id)
            ).length;
            const pct = catTotal > 0 ? Math.round((catDone / catTotal) * 100) : 0;

            return (
              <div key={cat.id} className="space-y-1">
                <div className="flex justify-between text-sm font-bold">
                  <span>{categoryLabels[cat.id]}</span>
                  <span className="tabular-nums">
                    {catDone}/{catTotal} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-3.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </div>

      {/* Earned Badges */}
      <section className="space-y-3">
        <h2 className="text-[22px] font-extrabold text-[#0F172A]">{s.myBadgesHeading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {BADGE_CATALOG.map((badge) => {
            const Icon = badge.icon;
            const unlocked = unlockedBadges.includes(badge.id);
            const localizedMeta = getLocalizedBadgeMeta(
              badge.id,
              badge.title,
              badge.desc,
              language
            );

            return (
              <div
                key={badge.id}
                className={`rounded-[20px] p-4 border-2 space-y-2 ${
                  unlocked
                    ? 'bg-[#FEFCE8] border-[#FACC15]'
                    : 'bg-[#F8FAFC] border-[#CBD5E1] opacity-70'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center ${
                      unlocked ? 'bg-[#FACC15] text-[#0F172A]' : 'bg-[#E2E8F0] text-[#64748B]'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                      unlocked
                        ? 'bg-[#166534] text-white'
                        : 'bg-[#E2E8F0] text-[#475569]'
                    }`}
                  >
                    {unlocked ? `${s.unlockedBadge} ✓` : s.lockedBadge}
                  </span>
                </div>
                <h3 className="text-[19px] font-extrabold text-[#0F172A]">
                  {localizedMeta.title}
                </h3>
                <p className="text-sm font-medium text-[#475569]">{localizedMeta.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reminders & Notifications */}
      <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Bell className="w-6 h-6 text-[#F97316]" />
          <h2 className="text-[22px] font-extrabold text-[#0F172A]">
            {s.remindersHeading}
          </h2>
        </div>

        <form onSubmit={handleAddReminder} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newRemTitle}
              onChange={(e) => setNewRemTitle(e.target.value)}
              placeholder={s.reminderTitlePlaceholder}
              className="w-full min-h-[52px] rounded-xl border-2 border-[#94A3B8] px-3.5 text-base font-medium"
            />
            <MicButton compact onTranscript={(text) => setNewRemTitle(text)} />
          </div>
          <input
            type="text"
            value={newRemDue}
            onChange={(e) => setNewRemDue(e.target.value)}
            placeholder={s.reminderDuePlaceholder}
            className="min-h-[52px] rounded-xl border-2 border-[#94A3B8] px-3.5 text-base font-medium"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 min-h-[52px] rounded-xl bg-[#166534] text-white font-bold text-base"
          >
            <Plus className="w-5 h-5" />
            <span>{s.addReminderBtn}</span>
          </button>
        </form>

        <div className="space-y-2.5">
          {reminders.map((rawRem) => {
            const rem = localizeReminder(rawRem, language);
            return (
              <button
                key={rem.id}
                type="button"
                onClick={() => toggleReminder(rem.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 flex items-center justify-between gap-3 transition-colors ${
                  rem.completed
                    ? 'bg-[#ECFDF5] border-[#A7F3D0]'
                    : 'bg-[#FFF7ED] border-[#FED7AA]'
                }`}
              >
                <div>
                  <p
                    className={`text-[18px] font-bold ${
                      rem.completed ? 'line-through text-[#475569]' : 'text-[#0F172A]'
                    }`}
                  >
                    {rem.title}
                  </p>
                  <p className="text-sm font-semibold text-[#475569]">{rem.dueText}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-sm font-extrabold shrink-0 ${
                    rem.completed
                      ? 'bg-[#16A34A] text-white'
                      : 'bg-[#F97316] text-white'
                  }`}
                >
                  {rem.completed ? `${s.doneCheck} ✓` : s.markDoneBtn}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
