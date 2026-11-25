import React, { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, FileText, Landmark, Sparkles } from 'lucide-react';
import { MicButton } from '../components/MicButton';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { getLocalizedSchemes } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';
import { SchemeCategoryTag } from '../types/finvora';

const FILTER_TAGS: Array<'All' | SchemeCategoryTag> = [
  'All',
  'Farmers',
  'Women',
  'SC/ST/OBC',
  'Senior Citizens',
];

export const SchemesPage: React.FC = () => {
  const { schemeId } = useParams<{ schemeId?: string }>();
  const navigate = useNavigate();
  const { language, recordSchemeCheck } = useFinvora();
  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [selectedTag, setSelectedTag] = useState<'All' | SchemeCategoryTag>('All');
  const [age, setAge] = useState('52');
  const [occupation, setOccupation] = useState('farmer');
  const [socialCategory, setSocialCategory] = useState('obc');
  const [eligibilityChecked, setEligibilityChecked] = useState(false);

  const schemes = useMemo(() => getLocalizedSchemes(language), [language]);

  const selectedScheme = useMemo(
    () => (schemeId ? schemes.find((item) => item.id === schemeId) || null : null),
    [schemeId, schemes]
  );

  const eligibleIds = useMemo(() => {
    if (!eligibilityChecked) return new Set<string>();
    const numAge = Number(age) || 35;
    return new Set(
      schemes
        .filter((scheme) => {
          const ageOk = numAge >= scheme.minAge && numAge <= scheme.maxAge;
          const occOk =
            scheme.eligibleOccupations.includes(occupation) || occupation === 'all';
          const catOk =
            scheme.eligibleCategories.includes(socialCategory) ||
            scheme.eligibleCategories.includes('all');
          return ageOk && occOk && catOk;
        })
        .map((item) => item.id)
    );
  }, [age, eligibilityChecked, occupation, schemes, socialCategory]);

  const filteredSchemes = useMemo(() => {
    if (selectedTag === 'All') return schemes;
    return schemes.filter((item) => item.tags.includes(selectedTag));
  }, [schemes, selectedTag]);

  const handleCheckEligibility = (e: React.FormEvent) => {
    e.preventDefault();
    setEligibilityChecked(true);
    recordSchemeCheck();
  };

  if (selectedScheme) {
    const audioSummary = `${selectedScheme.name}. ${selectedScheme.summary}. ${s.benefitsHeading}: ${selectedScheme.benefits.join(' ')}. ${s.documentsHeading}: ${selectedScheme.documents.join(', ')}. ${s.howToApplyHeading}: ${selectedScheme.howToApply}`;

    return (
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate('/schemes')}
          className="inline-flex items-center gap-2 min-h-[56px] px-5 rounded-[20px] bg-[#ECFDF5] border-2 border-[#166534] text-[#166534] font-bold text-[18px]"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{s.allSchemesBtn}</span>
        </button>

        <article className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-6 shadow-[0_6px_0_0_rgba(15,23,42,0.08)] space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-block px-3.5 py-1 rounded-full bg-[#FACC15] text-[#0F172A] font-extrabold text-sm mb-2">
                {selectedScheme.benefitBadge}
              </div>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
                {selectedScheme.name}
              </h1>
              <p className="text-[18px] font-medium text-[#334155] mt-2">
                {selectedScheme.summary}
              </p>
            </div>
            <SpeakButton text={audioSummary} />
          </div>

          <section className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-5 space-y-2.5">
            <h2 className="text-[21px] font-extrabold text-[#166534]">{s.benefitsHeading}</h2>
            <ul className="space-y-2">
              {selectedScheme.benefits.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[18px] font-medium">
                  <CheckCircle2 className="w-6 h-6 text-[#16A34A] shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-[#F8FAFC] border border-[#CBD5E1] p-5 space-y-2.5">
            <h2 className="text-[21px] font-extrabold text-[#0F172A]">{s.eligibilityHeading}</h2>
            <ul className="space-y-2">
              {selectedScheme.eligibility.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[18px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#166534] shrink-0 mt-2.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-[#FEFCE8] border-2 border-[#FDE047] p-5 space-y-2.5">
            <h2 className="text-[21px] font-extrabold text-[#0F172A] flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#854D0E]" />
              <span>{s.documentsHeading}</span>
            </h2>
            <ul className="space-y-2">
              {selectedScheme.documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-[18px] font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-[#854D0E] shrink-0 mt-1" />
                  <span>{doc}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] p-5">
            <h2 className="text-[20px] font-extrabold text-[#0369A1] mb-1">
              {s.howToApplyHeading}
            </h2>
            <p className="text-[18px] font-medium text-[#0F172A]">{selectedScheme.howToApply}</p>
          </section>

          <Link
            to="/banks"
            className="inline-flex items-center justify-center gap-2 min-h-[56px] px-6 rounded-[20px] bg-[#F97316] text-white font-extrabold text-[18px] shadow-[0_4px_0_0_#9A3412]"
          >
            <Landmark className="w-5 h-5" />
            <span>{s.findNearestBankBtn}</span>
          </Link>
        </article>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
            {s.schemesTitle}
          </h1>
          <p className="text-[18px] font-medium text-[#334155]">{s.schemesSubtitle}</p>
        </div>
        <SpeakButton text={s.schemesSpeakSummary} />
      </div>

      {/* Check My Eligibility Form */}
      <section className="rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-6 h-6 text-[#166534]" />
          <h2 className="text-[22px] font-extrabold text-[#166534]">
            {s.checkEligibilityTitle}
          </h2>
        </div>

        <form onSubmit={handleCheckEligibility} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">{s.yourAgeLabel}</label>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min="10"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="flex-1 min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-3.5 text-[20px] font-bold tabular-nums"
              />
              <MicButton
                compact
                onTranscript={(txt) => {
                  const digits = txt.replace(/[^\d]/g, '');
                  if (digits) setAge(digits);
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">{s.occupationLabel}</label>
            <select
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              className="w-full min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-3 text-[17px] font-semibold"
            >
              {s.occupations.map((occ) => (
                <option key={occ.value} value={occ.value}>
                  {occ.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#0F172A] mb-1">{s.socialCatLabel}</label>
            <select
              value={socialCategory}
              onChange={(e) => setSocialCategory(e.target.value)}
              className="w-full min-h-[56px] rounded-xl bg-white border-2 border-[#94A3B8] px-3 text-[17px] font-semibold"
            >
              {s.socialCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="min-h-[56px] px-5 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-extrabold text-[18px] shadow-[0_4px_0_0_#9A3412]"
          >
            {s.checkSchemesBtn}
          </button>
        </form>

        {eligibilityChecked && (
          <p className="text-[18px] font-bold text-[#166534]">
            {s.eligibilityMatchPrefix} ({eligibleIds.size})
          </p>
        )}
      </section>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Scheme category filters">
        {FILTER_TAGS.map((tag) => {
          const active = selectedTag === tag;
          return (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`min-h-[48px] px-4 rounded-full font-bold text-base border-2 transition-colors ${
                active
                  ? 'bg-[#166534] border-[#166534] text-white'
                  : 'bg-white border-[#CBD5E1] text-[#0F172A] hover:border-[#16A34A]'
              }`}
            >
              {s.schemeFilterLabels[tag]}
            </button>
          );
        })}
      </div>

      {/* Scheme Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => {
          const isMatch = eligibleIds.has(scheme.id);

          return (
            <div
              key={scheme.id}
              className={`rounded-[20px] p-5 border-2 flex flex-col justify-between gap-4 transition-all ${
                isMatch
                  ? 'bg-[#ECFDF5] border-[#16A34A] shadow-[0_4px_0_0_rgba(22,163,74,0.18)]'
                  : 'bg-white border-[#CBD5E1] shadow-[0_4px_0_0_rgba(15,23,42,0.06)]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-[#FACC15] text-[#0F172A] font-extrabold text-sm">
                    {scheme.benefitBadge}
                  </span>
                  {isMatch && (
                    <span className="text-sm font-extrabold text-[#166534]">
                      ✓ {s.eligibleMatchBadge}
                    </span>
                  )}
                </div>

                <h2 className="text-[22px] font-extrabold text-[#0F172A]">
                  {scheme.name}
                </h2>
                <p className="text-[17px] text-[#334155]">{scheme.summary}</p>
                <p className="text-sm font-semibold text-[#475569]">
                  {scheme.tags.map((tag) => s.schemeFilterLabels[tag]).join(' · ')}
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Link
                  to={`/schemes/${scheme.id}`}
                  className="flex-1 inline-flex items-center justify-center min-h-[56px] px-4 rounded-[20px] bg-[#166534] hover:bg-[#14532D] text-white font-bold text-[18px]"
                >
                  {s.viewBenefitsDocs}
                </Link>
                <SpeakButton text={`${scheme.name}. ${scheme.benefitBadge}. ${scheme.summary}`} compact />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
