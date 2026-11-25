import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { UpiPhoneIllustration } from '../components/Illustrations';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { getLocalizedUpiSteps } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';

export const UpiGuidePage: React.FC = () => {
  const { t, language, markUpiGuideCompleted, upiGuideCompleted } = useFinvora();
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState(0);

  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;
  const steps = getLocalizedUpiSteps(language);
  const currentStep = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;

  const handleNext = () => {
    if (!isLast) {
      setStepIdx((prev) => prev + 1);
    } else {
      markUpiGuideCompleted();
      navigate('/learn');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            to="/learn"
            className="inline-flex items-center gap-1.5 text-base font-bold text-[#166534] hover:underline mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.navLearn}</span>
          </Link>
          <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#166534]">
            {t.upiTitle}
          </h1>
        </div>

        <SpeakButton
          text={`${t.upiStepOf} ${currentStep.stepNumber}. ${currentStep.title}. ${currentStep.instruction}. ${s.safetyRuleLabel}: ${currentStep.safetyNote}`}
        />
      </div>

      {/* Progress Dots */}
      <div className="flex items-center justify-between gap-3 rounded-[20px] bg-[#ECFDF5] border-2 border-[#A7F3D0] p-4">
        <span className="text-[18px] font-extrabold text-[#166534]">
          {t.upiStepOf} {currentStep.stepNumber} / {steps.length}
        </span>
        <div className="flex items-center gap-2" aria-label="Step progress">
          {steps.map((st, idx) => (
            <button
              key={st.stepNumber}
              type="button"
              onClick={() => setStepIdx(idx)}
              aria-label={`${t.upiStepOf} ${st.stepNumber}`}
              className={`h-4 rounded-full transition-all ${
                idx === stepIdx
                  ? 'w-10 bg-[#166534]'
                  : idx < stepIdx
                  ? 'w-4 bg-[#16A34A]'
                  : 'w-4 bg-[#CBD5E1]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Card */}
      <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-6 shadow-[0_6px_0_0_rgba(15,23,42,0.08)] space-y-5">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0 flex flex-col items-center bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4">
            <UpiPhoneIllustration step={currentStep.stepNumber} className="w-44 h-44" />
            <span className="mt-2 text-sm font-bold text-[#475569] text-center">
              {currentStep.screenLabel}
            </span>
          </div>

          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 text-base font-extrabold text-[#0EA5E9]">
              {t.upiStepOf} {currentStep.stepNumber}
            </div>
            <h2 className="text-[26px] font-extrabold text-[#0F172A]">
              {currentStep.title}
            </h2>
            <p className="text-[20px] font-medium text-[#0F172A] leading-relaxed">
              {currentStep.instruction}
            </p>

            <div className="rounded-2xl bg-[#FEF2F2] border-2 border-[#DC2626] p-4 flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-extrabold text-[#991B1B]">{s.safetyRuleLabel}</p>
                <p className="text-[18px] font-semibold text-[#0F172A]">
                  {currentStep.safetyNote}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={() => setStepIdx((prev) => Math.max(0, prev - 1))}
            disabled={stepIdx === 0}
            className="inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-[20px] bg-[#ECFDF5] border-2 border-[#166534] text-[#166534] font-bold text-[18px] disabled:opacity-40"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{t.back}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-[18px] shadow-[0_4px_0_0_#9A3412]"
          >
            {isLast ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>{upiGuideCompleted ? s.doneLabel : t.finishGuide}</span>
              </>
            ) : (
              <>
                <span>{t.next}</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </section>
    </div>
  );
};
