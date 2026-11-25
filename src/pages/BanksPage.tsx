import React, { useMemo, useState } from 'react';
import { Clock, Landmark, MapPin, Navigation, PhoneCall } from 'lucide-react';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { getLocalizedBanks } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';

export const BanksPage: React.FC = () => {
  const { t, language } = useFinvora();
  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;
  const [filter, setFilter] = useState<'All' | 'Bank' | 'ATM' | 'Post Office'>('All');

  const banks = useMemo(() => getLocalizedBanks(language), [language]);

  const items = useMemo(() => {
    if (filter === 'All') return banks;
    return banks.filter((b) => b.type === filter);
  }, [banks, filter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
            {t.nearbyBanks}
          </h1>
          <p className="text-[18px] font-medium text-[#334155]">{s.banksSubtitle}</p>
        </div>
        <SpeakButton text={s.banksSpeakSummary} />
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {(['All', 'Bank', 'ATM', 'Post Office'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilter(type)}
            className={`min-h-[48px] px-4 rounded-full font-bold text-base border-2 ${
              filter === type
                ? 'bg-[#166534] border-[#166534] text-white'
                : 'bg-white border-[#CBD5E1] text-[#0F172A]'
            }`}
          >
            {s.bankFilterLabels[type]}
          </button>
        ))}
      </div>

      {/* Mandya Bank & ATM Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((loc) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            loc.mapsQuery
          )}`;

          return (
            <div
              key={loc.id}
              className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 shadow-[0_4px_0_0_rgba(15,23,42,0.06)] flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-extrabold text-[#166534] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded-full">
                    {s.bankFilterLabels[loc.type]} · {loc.distance}
                  </span>
                  <SpeakButton text={`${loc.name}. ${loc.address}. ${loc.timings}`} compact />
                </div>

                <h2 className="text-[21px] font-extrabold text-[#0F172A] flex items-start gap-2">
                  <Landmark className="w-6 h-6 text-[#16A34A] shrink-0 mt-1" />
                  <span>{loc.name}</span>
                </h2>

                <p className="text-[17px] text-[#334155] flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-[#64748B] shrink-0 mt-1" />
                  <span>{loc.address}</span>
                </p>

                <p className="text-base font-medium text-[#475569] flex items-start gap-2">
                  <Clock className="w-5 h-5 text-[#64748B] shrink-0 mt-0.5" />
                  <span>{loc.timings}</span>
                </p>

                <p className="text-sm font-semibold text-[#166534]">
                  {s.servicesLabel} {loc.services.join(' · ')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${loc.phone}`}
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-4 rounded-[20px] bg-[#ECFDF5] border-2 border-[#166534] text-[#166534] font-extrabold text-[18px]"
                >
                  <PhoneCall className="w-5 h-5" />
                  <span>{t.callBtn}</span>
                </a>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 min-h-[56px] px-4 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-[18px] shadow-[0_3px_0_0_#9A3412]"
                >
                  <Navigation className="w-5 h-5" />
                  <span>{t.directionsBtn}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
