import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  Bot,
  Calculator,
  Landmark,
  MapPin,
  PhoneCall,
  QrCode,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { LakshmiAvatarSvg, RuralSavingsIllustration } from '../components/Illustrations';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { formatINR } from '../utils/formatters';

export const HomePage: React.FC = () => {
  const {
    t,
    language,
    totalIncome,
    totalExpenses,
    totalSaved,
    goals,
    completedLessonIds,
    lessons,
  } = useFinvora();

  const [aiTip, setAiTip] = useState<string>('');
  const [tipLoading, setTipLoading] = useState<boolean>(false);
  const [tipError, setTipError] = useState<string>('');

  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const LOCALIZED_FALLBACK_TIPS: Record<string, string> = {
    kn: 'ಜೂನ್ ಒಳಗೆ ನಿಮ್ಮ ನೀರಿನ ಪಂಪ್ ಗುರಿಯನ್ನು ತಲುಪಲು ಪ್ರತಿ ತಿಂಗಳು ಏಳು ನೂರು ರೂಪಾಯಿ ಉಳಿತಾಯ ಮಾಡಿ.',
    te: 'జూన్ లోపు మీ నీటి పంపు లక్ష్యాన్ని చేరుకోవడానికి ప్రతి నెలా ఏడు వందల రూపాయలు ఆదా చేయండి.',
    hi: 'जून तक अपना पानी पंप लक्ष्य पूरा करने के लिए हर महीने सात सौ रुपये बचाएं।',
    mr: 'जूनपर्यंत पाण्याचा पंप घेण्यासाठी दरमहा सातशे रुपये बचत करा.',
    ta: 'ஜூன் மாதத்திற்குள் உங்கள் தண்ணீர் பம்ப் இலக்கை அடைய மாதம் எழுநூறு ரூபாய் சேமிக்கவும்.',
    en: 'Save seven hundred rupees every month to reach your Water Pump goal by June.',
  };

  const fallbackTip = LOCALIZED_FALLBACK_TIPS[language] || LOCALIZED_FALLBACK_TIPS.en;

  const fetchSavingsTip = useCallback(async () => {
    setTipLoading(true);
    setTipError('');
    setAiTip('');
    try {
      const res = await fetch('/api/ai/savings-tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          income: totalIncome,
          expenses: totalExpenses,
          goals: goals.map((g) => ({ title: g.title, target: g.target, saved: g.saved })),
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not load AI savings suggestion.');
      }
      setAiTip(data.tip || fallbackTip);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to reach AI tip service.';
      setTipError(msg);
      setAiTip(fallbackTip);
    } finally {
      setTipLoading(false);
    }
  }, [totalIncome, totalExpenses, goals, language, fallbackTip]);

  useEffect(() => {
    fetchSavingsTip();
  }, [fetchSavingsTip]);

  const displayedTip = aiTip || fallbackTip;

  const quickActions = [
    {
      to: '/learn',
      title: t.actionLearn,
      sub: t.actionLearnSub,
      icon: BookOpen,
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
      iconBg: 'bg-[#16A34A] text-white',
    },
    {
      to: '/upi-guide',
      title: t.actionUpi,
      sub: t.actionUpiSub,
      icon: QrCode,
      bg: 'bg-[#F0F9FF]',
      border: 'border-[#BAE6FD]',
      iconBg: 'bg-[#0EA5E9] text-white',
    },
    {
      to: '/money',
      title: t.actionMoney,
      sub: t.actionMoneySub,
      icon: Wallet,
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
      iconBg: 'bg-[#166534] text-white',
    },
    {
      to: '/goals',
      title: t.actionGoals,
      sub: t.actionGoalsSub,
      icon: Target,
      bg: 'bg-[#FFF7ED]',
      border: 'border-[#FED7AA]',
      iconBg: 'bg-[#F97316] text-white',
    },
    {
      to: '/schemes',
      title: t.actionSchemes,
      sub: t.actionSchemesSub,
      icon: Landmark,
      bg: 'bg-[#FEFCE8]',
      border: 'border-[#FDE047]',
      iconBg: 'bg-[#FACC15] text-[#0F172A]',
    },
    {
      to: '/calculators',
      title: t.actionCalc,
      sub: t.actionCalcSub,
      icon: Calculator,
      bg: 'bg-[#F0F9FF]',
      border: 'border-[#BAE6FD]',
      iconBg: 'bg-[#0284C7] text-white',
    },
    {
      to: '/scam-rescue',
      title: t.actionScam,
      sub: t.actionScamSub,
      icon: ShieldAlert,
      bg: 'bg-[#FEF2F2]',
      border: 'border-[#FECACA]',
      iconBg: 'bg-[#DC2626] text-white',
    },
    {
      to: '/assistant',
      title: t.actionAi,
      sub: t.actionAiSub,
      icon: Bot,
      bg: 'bg-[#F0F9FF]',
      border: 'border-[#7DD3FC]',
      iconBg: 'bg-[#0EA5E9] text-white',
    },
    {
      to: '/banks',
      title: t.actionBanks,
      sub: t.actionBanksSub,
      icon: MapPin,
      bg: 'bg-[#ECFDF5]',
      border: 'border-[#A7F3D0]',
      iconBg: 'bg-[#16A34A] text-white',
    },
    {
      to: '/dashboard',
      title: t.actionProfile,
      sub: t.actionProfileSub,
      icon: Award,
      bg: 'bg-[#FEFCE8]',
      border: 'border-[#FDE047]',
      iconBg: 'bg-[#166534] text-white',
    },
  ];

  return (
    <div className="space-y-7">
      {/* Greeting & Persona Header */}
      <section className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <LakshmiAvatarSvg className="w-16 h-16 shrink-0" />
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534] leading-tight">
              {t.greeting}
            </h1>
            <p className="text-[18px] font-medium text-[#334155]">
              {t.personaLocation} · {completedLessonIds.length}/{lessons.length} {t.lessonsDone}
            </p>
          </div>
        </div>
        <SpeakButton
          text={`${t.greeting} ${t.tagline}. ${t.income} ${formatINR(totalIncome)}, ${t.expenses} ${formatINR(totalExpenses)}, ${t.saved} ${formatINR(totalSaved)}. ${displayedTip}`}
        />
      </section>

      {/* Smart Savings Suggestion (Gemini AI Feature C) */}
      <section className="rounded-[20px] bg-white border-2 border-[#0EA5E9] p-5 shadow-[0_4px_0_0_rgba(14,165,233,0.14)]">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-[22px] font-bold text-[#0F172A]">{t.smartTipTitle}</h2>
          </div>
          <div className="flex items-center gap-2">
            <SpeakButton text={displayedTip} compact />
            <button
              type="button"
              onClick={fetchSavingsTip}
              disabled={tipLoading}
              className="inline-flex items-center gap-2 min-h-[44px] px-4 rounded-full bg-[#F0F9FF] border-2 border-[#0EA5E9] text-[#0369A1] font-bold text-sm hover:bg-[#E0F2FE] disabled:opacity-60 whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${tipLoading ? 'animate-spin' : ''}`} />
              <span>{t.refreshTip}</span>
            </button>
          </div>
        </div>

        {tipLoading ? (
          <div className="h-12 rounded-xl bg-[#F1F5F9] animate-pulse" />
        ) : (
          <p className="text-[20px] font-semibold text-[#0F172A] leading-relaxed">
            {displayedTip}
          </p>
        )}
        {tipError && (
          <p className="mt-2 text-sm font-medium text-[#9A3412]">
            {s.offlineTipNote}
          </p>
        )}
      </section>

      {/* Monthly Money Snapshot */}
      <section className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.08)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <RuralSavingsIllustration className="w-16 h-16 shrink-0" />
            <div>
              <h2 className="text-[22px] font-bold text-[#166534]">{t.monthlySummary}</h2>
              <p className="text-base text-[#334155]">{s.novemberPassbook}</p>
            </div>
          </div>
          <Link
            to="/money"
            className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[18px] shadow-[0_4px_0_0_#9A3412] active:translate-y-0.5 transition-all whitespace-nowrap"
          >
            <Wallet className="w-5 h-5" />
            <span>{t.actionMoney}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white border-2 border-[#BBF7D0] p-4">
            <p className="text-base font-semibold text-[#475569]">{t.income}</p>
            <p className="text-[28px] font-extrabold text-[#16A34A] tabular-nums">
              {formatINR(totalIncome)}
            </p>
          </div>
          <div className="rounded-2xl bg-white border-2 border-[#FED7AA] p-4">
            <p className="text-base font-semibold text-[#475569]">{t.expenses}</p>
            <p className="text-[28px] font-extrabold text-[#F97316] tabular-nums">
              {formatINR(totalExpenses)}
            </p>
          </div>
          <div className="rounded-2xl bg-[#166534] text-white p-4">
            <p className="text-base font-semibold text-[#DCFCE7]">{t.saved}</p>
            <p className="text-[28px] font-extrabold text-white tabular-nums">
              {formatINR(totalSaved)}
            </p>
          </div>
        </div>
      </section>

      {/* Main Action Grid */}
      <section>
        <h2 className="text-[24px] sm:text-[28px] font-extrabold text-[#0F172A] mb-4">
          {t.quickActions}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {quickActions.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className={`group rounded-[20px] ${card.bg} border-2 ${card.border} p-4 min-h-[132px] flex flex-col justify-between shadow-[0_4px_0_0_rgba(15,23,42,0.06)] hover:-translate-y-0.5 transition-transform`}
              >
                <div className={`w-12 h-12 rounded-2xl ${card.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[18px] font-extrabold text-[#0F172A] leading-snug">
                    {card.title}
                  </div>
                  <div className="text-sm font-medium text-[#475569] mt-0.5 leading-snug">
                    {card.sub}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Emergency Cyber Crime Banner */}
      <section className="rounded-[20px] bg-[#FEF2F2] border-2 border-[#DC2626] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#DC2626] text-white flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-[22px] font-extrabold text-[#991B1B]">
              {t.emergencyBannerTitle}
            </h2>
            <p className="text-[18px] font-medium text-[#0F172A]">
              {t.emergencyBannerDesc}
            </p>
          </div>
        </div>
        <a
          href="tel:1930"
          className="inline-flex items-center justify-center gap-2.5 min-h-[56px] px-6 rounded-[20px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-[18px] shadow-[0_4px_0_0_#7F1D1D] whitespace-nowrap w-full sm:w-auto"
        >
          <PhoneCall className="w-5 h-5" />
          <span>{t.call1930}</span>
        </a>
      </section>
    </div>
  );
};
