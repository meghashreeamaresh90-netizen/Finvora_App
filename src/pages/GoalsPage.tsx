import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Droplet, Edit3, GraduationCap, Plus, Shield, Target } from 'lucide-react';
import { MicButton } from '../components/MicButton';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { localizeGoal } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { SavingsGoal } from '../types/finvora';
import { formatINR } from '../utils/formatters';

export const GoalsPage: React.FC = () => {
  const { language, goals, addGoal, updateGoal, contributeToGoal } = useFinvora();
  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('15000');
  const [saved, setSaved] = useState('2000');
  const [deadline, setDeadline] = useState('2027');
  const [micError, setMicError] = useState('');

  const localizedGoals = useMemo(
    () => goals.map((g) => localizeGoal(g, language)),
    [goals, language]
  );

  const startEdit = (goal: SavingsGoal) => {
    setEditingId(goal.id);
    setTitle(goal.title);
    setTarget(String(goal.target));
    setSaved(String(goal.saved));
    setDeadline(goal.deadline);
    setShowAdd(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numTarget = Math.max(100, Number(target) || 1000);
    const numSaved = Math.max(0, Number(saved) || 0);
    if (!title.trim()) return;

    if (editingId) {
      updateGoal(editingId, {
        title: title.trim(),
        target: numTarget,
        saved: numSaved,
        deadline: deadline.trim() || '2027',
      });
    } else {
      addGoal({
        title: title.trim(),
        target: numTarget,
        saved: numSaved,
        deadline: deadline.trim() || '2027',
        icon: 'target',
      });
    }

    setTitle('');
    setTarget('15000');
    setSaved('0');
    setDeadline('2027');
    setEditingId(null);
    setShowAdd(false);
  };

  const renderIcon = (iconName: string) => {
    if (iconName === 'graduation') return <GraduationCap className="w-7 h-7 text-[#166534]" />;
    if (iconName === 'droplet') return <Droplet className="w-7 h-7 text-[#0EA5E9]" />;
    if (iconName === 'shield') return <Shield className="w-7 h-7 text-[#F97316]" />;
    return <Target className="w-7 h-7 text-[#16A34A]" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/money"
            className="inline-flex items-center gap-1.5 text-base font-bold text-[#166534] hover:underline mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{s.backToMoney}</span>
          </Link>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
            {s.goalsTitle}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setTitle('');
            setTarget('10000');
            setSaved('0');
            setShowAdd((prev) => !prev);
          }}
          className="inline-flex items-center gap-2 min-h-[56px] px-5 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[18px] shadow-[0_4px_0_0_#9A3412]"
        >
          <Plus className="w-5 h-5" />
          <span>{showAdd ? s.closeForm : s.addNewGoal}</span>
        </button>
      </div>

      {showAdd && (
        <form
          onSubmit={handleSubmit}
          className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#16A34A] p-5 space-y-4"
        >
          <h2 className="text-[22px] font-bold text-[#166534]">
            {editingId ? s.editGoalTitle : s.createGoalTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold mb-1">{s.goalNameLabel}</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={s.goalNamePlaceholder}
                  className="flex-1 min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[18px] font-medium"
                />
                <MicButton
                  compact
                  onTranscript={(txt) => setTitle(txt)}
                  onError={(err) => setMicError(err)}
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-bold mb-1">{s.targetMonthLabel}</label>
              <input
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[18px] font-medium"
              />
            </div>
            <div>
              <label className="block text-base font-bold mb-1">{s.targetAmountLabel}</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  required
                  min="100"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="flex-1 min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[22px] font-extrabold tabular-nums"
                />
                <MicButton
                  compact
                  onTranscript={(txt) => {
                    const digits = txt.replace(/[^\d]/g, '');
                    if (digits) setTarget(digits);
                  }}
                  onError={(err) => setMicError(err)}
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-bold mb-1">{s.alreadySavedLabel}</label>
              <input
                type="number"
                min="0"
                value={saved}
                onChange={(e) => setSaved(e.target.value)}
                className="w-full min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[22px] font-extrabold tabular-nums"
              />
            </div>
          </div>
          {micError && <p className="text-sm font-bold text-[#DC2626]">{micError}</p>}
          <button
            type="submit"
            className="min-h-[56px] px-7 rounded-[20px] bg-[#166534] text-white font-extrabold text-[18px]"
          >
            {editingId ? s.saveChanges : s.saveGoal}
          </button>
        </form>
      )}

      <div className="space-y-4">
        {localizedGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.saved / Math.max(1, goal.target)) * 100));
          const remaining = Math.max(0, goal.target - goal.saved);

          return (
            <div
              key={goal.id}
              className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.06)] space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] flex items-center justify-center shrink-0">
                    {renderIcon(goal.icon)}
                  </div>
                  <div>
                    <h2 className="text-[22px] font-extrabold text-[#0F172A]">{goal.title}</h2>
                    <p className="text-base font-semibold text-[#475569]">
                      {s.targetBy} {goal.deadline} · {pct}% {s.completeWord}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <SpeakButton
                    text={`${goal.title}. ${formatINR(goal.saved)} / ${formatINR(goal.target)}. ${s.leftWord}: ${formatINR(remaining)}.`}
                    compact
                  />
                  <button
                    type="button"
                    onClick={() => startEdit(goal)}
                    aria-label={`${s.editBtn} ${goal.title}`}
                    className="min-h-[44px] px-3.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] text-[#0F172A] font-bold text-sm inline-flex items-center gap-1.5"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{s.editBtn}</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-[26px] font-extrabold text-[#16A34A] tabular-nums">
                  {formatINR(goal.saved)}
                </span>
                <span className="text-[18px] font-bold text-[#334155] tabular-nums">
                  {s.goalLabel} {formatINR(goal.target)} ({formatINR(remaining)} {s.leftWord})
                </span>
              </div>

              <div className="w-full h-5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] overflow-hidden">
                <div
                  className="h-full bg-[#16A34A] transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <span className="text-base font-bold text-[#334155] mr-1">{s.addSavingsLabel}</span>
                {[500, 1000, 2000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => contributeToGoal(goal.id, amt)}
                    className="min-h-[48px] px-4 rounded-2xl bg-[#ECFDF5] border-2 border-[#16A34A] text-[#166534] font-extrabold text-base hover:bg-[#DCFCE7]"
                  >
                    +{formatINR(amt)}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
