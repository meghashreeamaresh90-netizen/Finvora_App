import React from 'react';
import { Link } from 'react-router-dom';
import { Award, Landmark, MapPin, PhoneCall, ShieldAlert } from 'lucide-react';
import { useFinvora } from '../context/FinvoraContext';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { AssistantPage } from './AssistantPage';

export const HelpHubPage: React.FC = () => {
  const { t, language } = useFinvora();
  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
        {t.helpTitle}
      </h1>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          to="/banks"
          className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-4 flex items-center gap-3 hover:bg-[#DCFCE7]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#16A34A] text-white flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[18px] font-extrabold text-[#0F172A]">{t.actionBanks}</div>
            <div className="text-sm font-medium text-[#334155]">{t.actionBanksSub}</div>
          </div>
        </Link>

        <Link
          to="/schemes"
          className="rounded-[20px] bg-[#FEFCE8] border-2 border-[#FACC15] p-4 flex items-center gap-3 hover:bg-[#FEF9C3]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FACC15] text-[#0F172A] flex items-center justify-center shrink-0">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[18px] font-extrabold text-[#0F172A]">{t.actionSchemes}</div>
            <div className="text-sm font-medium text-[#334155]">{t.actionSchemesSub}</div>
          </div>
        </Link>

        <Link
          to="/dashboard"
          className="rounded-[20px] bg-[#F0F9FF] border-2 border-[#BAE6FD] p-4 flex items-center gap-3 hover:bg-[#E0F2FE]"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[18px] font-extrabold text-[#0F172A]">{t.actionProfile}</div>
            <div className="text-sm font-medium text-[#334155]">{t.actionProfileSub}</div>
          </div>
        </Link>
      </div>

      {/* Embedded AI Financial Assistant */}
      <section className="rounded-[20px] bg-white border-2 border-[#0EA5E9] p-5 shadow-[0_4px_0_0_rgba(14,165,233,0.12)]">
        <h2 className="text-[24px] font-extrabold text-[#0369A1] mb-3">{t.aiTitle}</h2>
        <AssistantPage embedded />
      </section>

      {/* Emergency Helplines */}
      <section className="rounded-[20px] bg-[#FEF2F2] border-2 border-[#DC2626] p-5 space-y-3">
        <div className="flex items-center gap-2.5 text-[#991B1B]">
          <ShieldAlert className="w-6 h-6" />
          <h2 className="text-[22px] font-extrabold">{s.importantHelplines}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href="tel:1930"
            className="flex items-center justify-between min-h-[58px] px-5 rounded-[20px] bg-[#DC2626] text-white font-extrabold text-[18px]"
          >
            <span className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5" />
              {s.cyberFraudHelpline}
            </span>
            <span>1930</span>
          </a>
          <a
            href="tel:14447"
            className="flex items-center justify-between min-h-[58px] px-5 rounded-[20px] bg-white border-2 border-[#166534] text-[#166534] font-extrabold text-[18px]"
          >
            <span className="flex items-center gap-2">
              <PhoneCall className="w-5 h-5" />
              {s.cropInsuranceHelpline}
            </span>
            <span>14447</span>
          </a>
        </div>
      </section>
    </div>
  );
};
