import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calculator,
  Plus,
  Target,
  Trash2,
} from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { MicButton } from '../components/MicButton';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { localizeTransaction } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { formatINR } from '../utils/formatters';

const DONUT_COLORS = ['#16A34A', '#F97316', '#0EA5E9', '#FACC15', '#8B5CF6', '#EC4899'];

export const MoneyTrackerPage: React.FC = () => {
  const {
    t,
    language,
    transactions,
    totalIncome,
    totalExpenses,
    totalSaved,
    addTransaction,
    deleteTransaction,
  } = useFinvora();

  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [formMode, setFormMode] = useState<'income' | 'expense'>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [voiceError, setVoiceError] = useState('');

  const localizedTransactions = useMemo(
    () => transactions.map((tx) => localizeTransaction(tx, language)),
    [transactions, language]
  );

  const categoryOptions =
    formMode === 'income' ? s.incomeCategories : s.expenseCategories;

  const activeCategory = category || categoryOptions[0];

  const expenseBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    localizedTransactions
      .filter((tx) => tx.type === 'expense')
      .forEach((tx) => {
        map.set(tx.category, (map.get(tx.category) || 0) + tx.amount);
      });
    const list = Array.from(map.entries()).map(([name, value]) => ({ name, value }));
    if (totalSaved > 0) {
      list.unshift({ name: t.saved, value: totalSaved });
    }
    return list;
  }, [localizedTransactions, totalSaved, t.saved]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!title.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return;
    }
    addTransaction({
      type: formMode,
      title: title.trim(),
      category: activeCategory,
      amount: Math.round(numericAmount),
      date: new Date().toISOString().slice(0, 10),
    });
    setTitle('');
    setAmount('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
          {t.moneyTitle}
        </h1>
        <SpeakButton
          text={`${t.income} ${formatINR(totalIncome)}. ${t.expenses} ${formatINR(totalExpenses)}. ${t.saved} ${formatINR(totalSaved)}.`}
        />
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-4">
          <div className="flex items-center gap-2 text-[#166534] font-bold">
            <ArrowDownLeft className="w-5 h-5 text-[#16A34A]" />
            <span>{t.income}</span>
          </div>
          <p className="text-[30px] font-extrabold text-[#16A34A] tabular-nums mt-1">
            {formatINR(totalIncome)}
          </p>
        </div>

        <div className="rounded-[20px] bg-[#FFF7ED] border-2 border-[#FED7AA] p-4">
          <div className="flex items-center gap-2 text-[#9A3412] font-bold">
            <ArrowUpRight className="w-5 h-5 text-[#F97316]" />
            <span>{t.expenses}</span>
          </div>
          <p className="text-[30px] font-extrabold text-[#F97316] tabular-nums mt-1">
            {formatINR(totalExpenses)}
          </p>
        </div>

        <div className="rounded-[20px] bg-[#166534] text-white p-4">
          <p className="text-base font-bold text-[#DCFCE7]">{t.saved}</p>
          <p className="text-[30px] font-extrabold tabular-nums mt-1">
            {formatINR(totalSaved)}
          </p>
        </div>
      </div>

      {/* Quick Links to Goals & Calculators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/goals"
          className="flex items-center justify-between min-h-[60px] px-5 rounded-[20px] bg-[#ECFDF5] border-2 border-[#166534] text-[#166534] font-extrabold text-[18px] hover:bg-[#DCFCE7]"
        >
          <span className="flex items-center gap-2.5">
            <Target className="w-6 h-6" />
            {t.viewGoals}
          </span>
          <span>→</span>
        </Link>
        <Link
          to="/calculators"
          className="flex items-center justify-between min-h-[60px] px-5 rounded-[20px] bg-[#F0F9FF] border-2 border-[#0EA5E9] text-[#0369A1] font-extrabold text-[18px] hover:bg-[#E0F2FE]"
        >
          <span className="flex items-center gap-2.5">
            <Calculator className="w-6 h-6" />
            {t.viewCalculators}
          </span>
          <span>→</span>
        </Link>
      </div>

      {/* Live Recharts Donut Chart + Add Entry Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.06)]">
          <h2 className="text-[22px] font-bold text-[#0F172A] mb-2">
            {s.whereMoneyGoes}
          </h2>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={3}
                >
                  {expenseBreakdown.map((entry, idx) => (
                    <Cell
                      key={entry.name}
                      fill={DONUT_COLORS[idx % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatINR(Number(value ?? 0))}
                  contentStyle={{
                    borderRadius: '14px',
                    border: '2px solid #CBD5E1',
                    fontSize: '16px',
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {expenseBreakdown.map((item, idx) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2 rounded-xl bg-[#F8FAFC] px-3 py-2 text-sm font-bold"
              >
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: DONUT_COLORS[idx % DONUT_COLORS.length] }}
                  />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="tabular-nums text-[#0F172A]">{formatINR(item.value)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Add Income / Expense Form */}
        <section className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.06)]">
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              type="button"
              onClick={() => {
                setFormMode('income');
                setCategory('');
              }}
              className={`min-h-[56px] rounded-[20px] font-extrabold text-[18px] border-2 transition-colors ${
                formMode === 'income'
                  ? 'bg-[#16A34A] border-[#166534] text-white'
                  : 'bg-white border-[#CBD5E1] text-[#0F172A]'
              }`}
            >
              {t.addIncome}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormMode('expense');
                setCategory('');
              }}
              className={`min-h-[56px] rounded-[20px] font-extrabold text-[18px] border-2 transition-colors ${
                formMode === 'expense'
                  ? 'bg-[#F97316] border-[#9A3412] text-white'
                  : 'bg-white border-[#CBD5E1] text-[#0F172A]'
              }`}
            >
              {t.addExpense}
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-base font-bold text-[#0F172A] mb-1.5">
                {t.amountLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  className="flex-1 min-h-[60px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[24px] font-extrabold text-[#0F172A] tabular-nums"
                />
                <MicButton
                  compact
                  onTranscript={(txt) => {
                    const digits = txt.replace(/[^\d]/g, '');
                    if (digits) setAmount(digits);
                    else setVoiceError(txt);
                  }}
                  onError={(err) => setVoiceError(err)}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {[100, 500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(String((Number(amount) || 0) + val))}
                    className="min-h-[40px] px-3.5 rounded-full bg-white border border-[#16A34A] text-[#166534] font-bold text-sm"
                  >
                    +{formatINR(val)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-[#0F172A] mb-1.5">
                {t.titleLabel}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={
                    formMode === 'income' ? s.incomePlaceholder : s.expensePlaceholder
                  }
                  className="flex-1 min-h-[60px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[18px] font-medium text-[#0F172A]"
                />
                <MicButton
                  compact
                  onTranscript={(txt) => setTitle(txt)}
                  onError={(err) => setVoiceError(err)}
                />
              </div>
            </div>

            <div>
              <label className="block text-base font-bold text-[#0F172A] mb-1.5">
                {s.categoryLabel}
              </label>
              <select
                value={activeCategory}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-4 text-[18px] font-semibold text-[#0F172A]"
              >
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {voiceError && (
              <p className="text-sm font-semibold text-[#DC2626]">{voiceError}</p>
            )}

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 min-h-[58px] rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-[19px] shadow-[0_4px_0_0_#9A3412]"
            >
              <Plus className="w-6 h-6" />
              <span>{t.saveEntry}</span>
            </button>
          </form>
        </section>
      </div>

      {/* Passbook Entries */}
      <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 space-y-3">
        <h2 className="text-[22px] font-bold text-[#0F172A]">{t.recentEntries}</h2>
        <div className="divide-y divide-[#E2E8F0]">
          {localizedTransactions.map((tx) => (
            <div
              key={tx.id}
              className="py-3.5 flex items-center justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-[18px] font-bold text-[#0F172A] truncate">{tx.title}</p>
                <p className="text-sm font-semibold text-[#475569]">
                  {tx.category} · {tx.date}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-[20px] font-extrabold tabular-nums ${
                    tx.type === 'income' ? 'text-[#16A34A]' : 'text-[#DC2626]'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}
                  {formatINR(tx.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => deleteTransaction(tx.id)}
                  aria-label={`Delete ${tx.title}`}
                  className="w-11 h-11 rounded-xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center hover:bg-[#FEE2E2]"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
