import React, { useMemo, useState } from 'react';
import { AlertTriangle, Calculator, PiggyBank, TrendingUp } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { formatINR } from '../utils/formatters';

type CalcTab = 'emi' | 'interest' | 'savings';

export const CalculatorsPage: React.FC = () => {
  const { language } = useFinvora();
  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [tab, setTab] = useState<CalcTab>('emi');
  const [loanAmount, setLoanAmount] = useState(50000);
  const [interestRate, setInterestRate] = useState(9);
  const [tenureMonths, setTenureMonths] = useState(24);

  const [principal, setPrincipal] = useState(25000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(3);
  const [isCompound, setIsCompound] = useState(false);

  const [monthlySave, setMonthlySave] = useState(1000);
  const [saveRate, setSaveRate] = useState(6.5);
  const [saveMonths, setSaveMonths] = useState(24);

  const emiResult = useMemo(() => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenureMonths;
    if (r === 0) {
      const emi = P / n;
      return { emi, totalPayable: P, totalInterest: 0 };
    }
    const factor = Math.pow(1 + r, n);
    const emi = (P * r * factor) / (factor - 1);
    const totalPayable = emi * n;
    const totalInterest = totalPayable - P;
    return { emi, totalPayable, totalInterest };
  }, [loanAmount, interestRate, tenureMonths]);

  const interestResult = useMemo(() => {
    if (isCompound) {
      const total = principal * Math.pow(1 + rate / 100, years);
      return { total, interest: total - principal };
    }
    const interest = (principal * rate * years) / 100;
    return { total: principal + interest, interest };
  }, [principal, rate, years, isCompound]);

  const savingsResult = useMemo(() => {
    const r = saveRate / 12 / 100;
    const n = saveMonths;
    const invested = monthlySave * n;
    if (r === 0) return { invested, maturity: invested, interestEarned: 0 };
    const maturity = monthlySave * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    return { invested, maturity, interestEarned: maturity - invested };
  }, [monthlySave, saveRate, saveMonths]);

  const principalPct =
    tab === 'emi'
      ? Math.round((loanAmount / Math.max(1, emiResult.totalPayable)) * 100)
      : tab === 'interest'
      ? Math.round((principal / Math.max(1, interestResult.total)) * 100)
      : Math.round((savingsResult.invested / Math.max(1, savingsResult.maturity)) * 100);

  const secondaryPct = Math.max(0, 100 - principalPct);

  const spokenSummary =
    tab === 'emi'
      ? `${s.loanAmountLabel}: ${formatINR(loanAmount)}. ${s.monthlyEmiPay}: ${formatINR(emiResult.emi)}. ${s.totalInterestLabel}: ${formatINR(emiResult.totalInterest)}.`
      : tab === 'interest'
      ? `${s.totalFinalValue}: ${formatINR(interestResult.total)}. ${s.interestAmountLabel}: ${formatINR(interestResult.interest)}.`
      : `${s.monthlySavingLabel}: ${formatINR(monthlySave)}. ${s.totalMoneyHave}: ${formatINR(savingsResult.maturity)}.`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
            {s.calcTitle}
          </h1>
          <p className="text-[18px] font-medium text-[#334155]">{s.calcSubtitle}</p>
        </div>
        <SpeakButton text={spokenSummary} />
      </div>

      {/* Mode Tabs */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => setTab('emi')}
          className={`min-h-[56px] px-3 rounded-[20px] font-bold text-base sm:text-[18px] border-2 inline-flex items-center justify-center gap-2 ${
            tab === 'emi'
              ? 'bg-[#166534] border-[#166534] text-white'
              : 'bg-white border-[#CBD5E1] text-[#0F172A]'
          }`}
        >
          <Calculator className="w-5 h-5 shrink-0" />
          <span>{s.tabEmi}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('interest')}
          className={`min-h-[56px] px-3 rounded-[20px] font-bold text-base sm:text-[18px] border-2 inline-flex items-center justify-center gap-2 ${
            tab === 'interest'
              ? 'bg-[#166534] border-[#166534] text-white'
              : 'bg-white border-[#CBD5E1] text-[#0F172A]'
          }`}
        >
          <TrendingUp className="w-5 h-5 shrink-0" />
          <span>{s.tabInterest}</span>
        </button>
        <button
          type="button"
          onClick={() => setTab('savings')}
          className={`min-h-[56px] px-3 rounded-[20px] font-bold text-base sm:text-[18px] border-2 inline-flex items-center justify-center gap-2 ${
            tab === 'savings'
              ? 'bg-[#166534] border-[#166534] text-white'
              : 'bg-white border-[#CBD5E1] text-[#0F172A]'
          }`}
        >
          <PiggyBank className="w-5 h-5 shrink-0" />
          <span>{s.tabSavings}</span>
        </button>
      </div>

      {/* Calculator Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 space-y-6">
          {tab === 'emi' && (
            <>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.loanAmountLabel}</span>
                  <span className="text-[#166534] tabular-nums">{formatINR(loanAmount)}</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={500000}
                  step={5000}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.yearlyRateLabel}</span>
                  <span className="text-[#F97316] tabular-nums">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={48}
                  step={0.5}
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setInterestRate(7)}
                    className="px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#16A34A] text-sm font-bold text-[#166534]"
                  >
                    {s.bankKccChip}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(12)}
                    className="px-3 py-1.5 rounded-full bg-[#F0F9FF] border border-[#0EA5E9] text-sm font-bold text-[#0369A1]"
                  >
                    {s.shgLoanChip}
                  </button>
                  <button
                    type="button"
                    onClick={() => setInterestRate(36)}
                    className="px-3 py-1.5 rounded-full bg-[#FEF2F2] border border-[#DC2626] text-sm font-bold text-[#991B1B]"
                  >
                    {s.moneylenderChip}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.repaymentMonthsLabel}</span>
                  <span className="text-[#166534] tabular-nums">
                    {tenureMonths} {s.monthsUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={60}
                  step={3}
                  value={tenureMonths}
                  onChange={(e) => setTenureMonths(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {tab === 'interest' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsCompound(false)}
                  className={`min-h-[48px] rounded-xl font-bold border-2 ${
                    !isCompound
                      ? 'bg-[#166534] border-[#166534] text-white'
                      : 'bg-white border-[#CBD5E1] text-[#0F172A]'
                  }`}
                >
                  {s.simpleInterestBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCompound(true)}
                  className={`min-h-[48px] rounded-xl font-bold border-2 ${
                    isCompound
                      ? 'bg-[#166534] border-[#166534] text-white'
                      : 'bg-white border-[#CBD5E1] text-[#0F172A]'
                  }`}
                >
                  {s.compoundInterestBtn}
                </button>
              </div>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.principalAmountLabel}</span>
                  <span className="text-[#166534] tabular-nums">{formatINR(principal)}</span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={200000}
                  step={1000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.yearlyRateLabel}</span>
                  <span className="text-[#F97316] tabular-nums">{rate}%</span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={36}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.timeYearsLabel}</span>
                  <span className="text-[#166534] tabular-nums">
                    {years} {s.yearsUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={15}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}

          {tab === 'savings' && (
            <>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.monthlySavingLabel}</span>
                  <span className="text-[#166534] tabular-nums">{formatINR(monthlySave)}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={10000}
                  step={100}
                  value={monthlySave}
                  onChange={(e) => setMonthlySave(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.bankRdRateLabel}</span>
                  <span className="text-[#0EA5E9] tabular-nums">{saveRate}%</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={10}
                  step={0.5}
                  value={saveRate}
                  onChange={(e) => setSaveRate(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <div className="flex justify-between font-bold text-[18px] mb-2">
                  <span>{s.savingPeriodLabel}</span>
                  <span className="text-[#166534] tabular-nums">
                    {saveMonths} {s.monthsUnit}
                  </span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={60}
                  step={6}
                  value={saveMonths}
                  onChange={(e) => setSaveMonths(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </>
          )}
        </section>

        {/* Results & Principal vs Interest Split Bar */}
        <section className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 flex flex-col justify-between space-y-5">
          {tab === 'emi' && (
            <>
              <div>
                <p className="text-base font-bold text-[#166534]">{s.monthlyEmiPay}</p>
                <p className="text-[36px] font-extrabold text-[#166534] tabular-nums">
                  {formatINR(emiResult.emi)} / {s.perMonth}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border border-[#A7F3D0] p-3.5">
                  <p className="text-sm font-bold text-[#475569]">{s.principalLoanLabel}</p>
                  <p className="text-[22px] font-extrabold text-[#16A34A] tabular-nums">
                    {formatINR(loanAmount)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-[#FED7AA] p-3.5">
                  <p className="text-sm font-bold text-[#475569]">{s.totalInterestLabel}</p>
                  <p className="text-[22px] font-extrabold text-[#F97316] tabular-nums">
                    {formatINR(emiResult.totalInterest)}
                  </p>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-[#CBD5E1] p-3.5 flex justify-between items-center">
                <span className="font-bold text-[#0F172A]">{s.totalPayBackLabel}</span>
                <span className="text-[22px] font-extrabold text-[#0F172A] tabular-nums">
                  {formatINR(emiResult.totalPayable)}
                </span>
              </div>
            </>
          )}

          {tab === 'interest' && (
            <>
              <div>
                <p className="text-base font-bold text-[#166534]">{s.totalFinalValue}</p>
                <p className="text-[36px] font-extrabold text-[#166534] tabular-nums">
                  {formatINR(interestResult.total)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border border-[#A7F3D0] p-3.5">
                  <p className="text-sm font-bold text-[#475569]">{s.principalLabel}</p>
                  <p className="text-[22px] font-extrabold text-[#16A34A] tabular-nums">
                    {formatINR(principal)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-[#FED7AA] p-3.5">
                  <p className="text-sm font-bold text-[#475569]">{s.interestAmountLabel}</p>
                  <p className="text-[22px] font-extrabold text-[#F97316] tabular-nums">
                    {formatINR(interestResult.interest)}
                  </p>
                </div>
              </div>
            </>
          )}

          {tab === 'savings' && (
            <>
              <div>
                <p className="text-base font-bold text-[#166534]">{s.totalMoneyHave}</p>
                <p className="text-[36px] font-extrabold text-[#166534] tabular-nums">
                  {formatINR(savingsResult.maturity)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white border border-[#A7F3D0] p-3.5">
                  <p className="text-sm font-bold text-[#475569]">{s.yourDepositsLabel}</p>
                  <p className="text-[22px] font-extrabold text-[#16A34A] tabular-nums">
                    {formatINR(savingsResult.invested)}
                  </p>
                </div>
                <div className="rounded-2xl bg-white border border-[#BAE6FD] p-3.5">
                  <p className="text-sm font-bold text-[#475569]">{s.freeBankInterest}</p>
                  <p className="text-[22px] font-extrabold text-[#0EA5E9] tabular-nums">
                    +{formatINR(savingsResult.interestEarned)}
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Bar Split: Principal vs Interest */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span className="text-[#166534]">
                {tab === 'savings' ? s.yourDepositsLabel : s.principalLabel} ({principalPct}%)
              </span>
              <span className="text-[#9A3412]">
                {s.interestAmountLabel} ({secondaryPct}%)
              </span>
            </div>
            <div className="w-full h-7 rounded-full overflow-hidden flex border-2 border-white shadow-inner">
              <div
                className="bg-[#16A34A] h-full transition-all"
                style={{ width: `${principalPct}%` }}
              />
              <div
                className="bg-[#F97316] h-full transition-all"
                style={{ width: `${secondaryPct}%` }}
              />
            </div>
          </div>

          {tab === 'emi' && interestRate >= 24 && (
            <div className="rounded-2xl bg-[#FEF2F2] border-2 border-[#DC2626] p-3.5 flex items-start gap-2.5">
              <AlertTriangle className="w-6 h-6 text-[#DC2626] shrink-0 mt-0.5" />
              <p className="text-base font-bold text-[#991B1B]">{s.highInterestWarning}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
