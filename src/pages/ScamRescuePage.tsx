import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Flag,
  PhoneCall,
  SearchCheck,
  ShieldAlert,
} from 'lucide-react';
import { ScamShieldIllustration } from '../components/Illustrations';
import { MicButton } from '../components/MicButton';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { getLocalizedCommonScams, getLocalizedSampleScams } from '../i18n/localizedSeedData';
import { SCREEN_STRINGS } from '../i18n/screenStrings';

interface ScamCheckResult {
  verdict: 'SAFE' | 'SUSPICIOUS' | 'SCAM';
  reasons: string[];
  advice: string;
  isOfflineFallback?: boolean;
}

function runOfflineSafetyFallback(text: string, language: string): ScamCheckResult {
  const lower = text.toLowerCase();
  const hasDangerKeywords =
    /pin|otp|kyc|lottery|prize|http:\/\/|bit\.ly|xyz|won|blocked|suspended|scan.*qr|receive|ಪಿನ್|ಒಟಿಪಿ|ಕೆವೈಸಿ|పిన్|ఓటీపీ|కేవైసీ/.test(
      lower
    );

  if (language === 'kn') {
    if (hasDangerKeywords) {
      return {
        verdict: 'SCAM',
        reasons: [
          'ಇದು ಯುಪಿಐ ಪಿನ್, ಒಟಿಪಿ ಅಥವಾ ಅನುಮಾನಾಸ್ಪದ ಲಿಂಕ್ ಕೇಳುತ್ತಿದೆ.',
          'ನಿಜವಾದ ಬ್ಯಾಂಕ್ ಅಥವಾ ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆ ಪಿನ್ ಕೇಳುವುದಿಲ್ಲ.',
          'ಹಣ ಪಡೆಯಲು ಕ್ಯೂಆರ್ ಕೋಡ್ ಸ್ಕ್ಯಾನ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ.',
        ],
        advice: 'ಯಾವುದೇ ಲಿಂಕ್ ಒತ್ತಬೇಡಿ ಮತ್ತು ಪಿನ್ ಹೇಳಬೇಡಿ. ಹತ್ತೊಂಬತ್ತು ನೂರು ಮೂವತ್ತಕ್ಕೆ ಕರೆ ಮಾಡಿ.',
        isOfflineFallback: true,
      };
    }
    return {
      verdict: 'SUSPICIOUS',
      reasons: [
        'ಸರ್ವರ್ ಸಂಪರ್ಕ ಸಿಗದ ಕಾರಣ ಆಫ್‌ಲೈನ್ ಸುರಕ್ಷತಾ ಪರೀಕ್ಷೆ ಮಾಡಲಾಗಿದೆ.',
        'ಅಪರಿಚಿತ ಲಿಂಕ್‌ಗಳನ್ನು ಎಂದಿಗೂ ಒತ್ತಬೇಡಿ.',
        'ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಲು ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ.',
      ],
      advice: 'ಸಂಶಯ ಬಂದರೆ ಕುಟುಂಬದವರನ್ನು ಅಥವಾ ಬ್ಯಾಂಕ್ ಸಿಬ್ಬಂದಿಯನ್ನು ಕೇಳಿ.',
      isOfflineFallback: true,
    };
  }

  if (language === 'te') {
    if (hasDangerKeywords) {
      return {
        verdict: 'SCAM',
        reasons: [
          'ఇది యూపీఐ పిన్, ఓటీపీ లేదా అనుమానాస్పద లింక్ అడుగుతోంది.',
          'నిజమైన బ్యాంకులు లేదా పీఎం కిసాన్ పథకం పిన్ అడగవు.',
          'డబ్బు పొందడానికి క్యూఆర్ కోడ్ స్కాన్ చేయాల్సిన అవసరం లేదు.',
        ],
        advice: 'ఏ లింక్‌పై క్లిక్ చేయవద్దు మరియు పిన్ చెప్పవద్దు. పంతొమ్మిది వందల ముప్పైకి కాల్ చేయండి.',
        isOfflineFallback: true,
      };
    }
    return {
      verdict: 'SUSPICIOUS',
      reasons: [
        'సర్వర్ కనెక్ట్ కాకపోవడంతో ఆఫ్‌లైన్ భద్రతా తనిఖీ జరిగింది.',
        'తెలియని లింక్‌లపై ఎప్పుడూ క్లిక్ చేయవద్దు.',
        'నిర్ధారించుకోవడానికి మీ బ్యాంక్ శాఖను నేరుగా సంప్రదించండి.',
      ],
      advice: 'అనుమానం ఉంటే కుటుంబ సభ్యులను లేదా బ్యాంక్ సిబ్బందిని అడగండి.',
      isOfflineFallback: true,
    };
  }

  if (hasDangerKeywords) {
    return {
      verdict: 'SCAM',
      reasons: [
        'Asks for UPI PIN, OTP, KYC update, or clicking an unverified web link.',
        'Real banks and PM-KISAN never ask for PINs or send shortened links.',
        'Receiving money NEVER requires scanning a QR code or typing your PIN.',
      ],
      advice: 'Do NOT click any link or share PIN/OTP. Delete the message or call nineteen thirty.',
      isOfflineFallback: true,
    };
  }

  return {
    verdict: 'SUSPICIOUS',
    reasons: [
      'Could not reach AI verification server—offline safety check ran instead.',
      'Always check the sender ID and never click unknown links.',
      'Confirm directly with your bank branch or passbook before acting.',
    ],
    advice: 'When in doubt, ask a family member or visit your local bank branch.',
    isOfflineFallback: true,
  };
}

export const ScamRescuePage: React.FC = () => {
  const { t, language, addScamReport, recordScamCheck } = useFinvora();
  const s = SCREEN_STRINGS[language] || SCREEN_STRINGS.en;

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState<ScamCheckResult | null>(null);
  const [reported, setReported] = useState(false);

  const sampleScams = getLocalizedSampleScams(language);
  const commonScams = getLocalizedCommonScams(language);

  const handleCheck = async (e?: React.FormEvent, overrideText?: string) => {
    if (e) e.preventDefault();
    const messageToCheck = (overrideText ?? inputText).trim();
    if (!messageToCheck) return;

    setLoading(true);
    setErrorMsg('');
    setReported(false);
    recordScamCheck();

    try {
      const res = await fetch('/api/ai/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToCheck, language }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not reach AI scam checker.');
      }
      setResult({
        verdict: data.verdict,
        reasons: data.reasons || [],
        advice: data.advice || '',
      });
    } catch {
      setErrorMsg(s.offlineTipNote);
      setResult(runOfflineSafetyFallback(messageToCheck, language));
    } finally {
      setLoading(false);
    }
  };

  const handleReportScam = () => {
    if (!result || reported) return;
    addScamReport({
      message: inputText.trim(),
      verdict: result.verdict,
      reasons: result.reasons,
      advice: result.advice,
      reportedBy:
        language === 'kn'
          ? 'ಲಕ್ಷ್ಮಿ (ಮಂಡ್ಯ)'
          : language === 'te'
          ? 'లక్ష్మి (మండ్య)'
          : 'Lakshmi (Mandya)',
      location:
        language === 'kn'
          ? 'ಮಂಡ್ಯ ತಾಲೂಕು'
          : language === 'te'
          ? 'మండ్య తాలూకా'
          : 'Mandya Taluk, KA',
    });
    setReported(true);
  };

  const verdictStyles =
    result?.verdict === 'SCAM'
      ? {
          bg: 'bg-[#FEF2F2]',
          border: 'border-[#DC2626]',
          badgeBg: 'bg-[#DC2626] text-white',
          label: t.verdictScam,
          icon: ShieldAlert,
        }
      : result?.verdict === 'SAFE'
      ? {
          bg: 'bg-[#ECFDF5]',
          border: 'border-[#16A34A]',
          badgeBg: 'bg-[#16A34A] text-white',
          label: t.verdictSafe,
          icon: CheckCircle2,
        }
      : {
          bg: 'bg-[#FEFCE8]',
          border: 'border-[#D97706]',
          badgeBg: 'bg-[#D97706] text-white',
          label: t.verdictSuspicious,
          icon: AlertTriangle,
        };

  const VerdictIcon = verdictStyles.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <ScamShieldIllustration className="w-16 h-16 shrink-0" />
          <div>
            <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#DC2626]">
              {t.scamTitle}
            </h1>
            <p className="text-[18px] font-medium text-[#334155]">{t.scamSubtitle}</p>
          </div>
        </div>
        <SpeakButton text={`${t.scamTitle}. ${t.scamSubtitle}`} />
      </div>

      {/* Scam Checker Input Card */}
      <section className="rounded-[20px] bg-white border-2 border-[#CBD5E1] p-5 shadow-[0_6px_0_0_rgba(15,23,42,0.08)] space-y-4">
        <form onSubmit={(e) => handleCheck(e)} className="space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.scamInputPlaceholder}
              className="w-full rounded-2xl bg-[#F8FAFC] border-2 border-[#94A3B8] p-4 text-[18px] font-medium text-[#0F172A] focus:border-[#166534]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[#475569]">{t.tryExample}</span>
            {sampleScams.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setInputText(sample.text);
                  handleCheck(undefined, sample.text);
                }}
                className="min-h-[40px] px-3.5 rounded-full bg-[#F8FAFC] border border-[#CBD5E1] hover:border-[#0EA5E9] text-sm font-bold text-[#0F172A]"
              >
                {sample.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MicButton
              onTranscript={(transcript) => setInputText(transcript)}
              onError={(err) => setErrorMsg(err)}
              label={t.micBtn}
              className="w-full justify-center"
            />

            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="sm:col-span-2 inline-flex items-center justify-center gap-2 min-h-[58px] px-6 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-extrabold text-[19px] shadow-[0_4px_0_0_#9A3412]"
            >
              <SearchCheck className="w-6 h-6" />
              <span>{loading ? t.checkingMsg : t.checkMessageBtn}</span>
            </button>
          </div>
        </form>

        {errorMsg && (
          <div className="rounded-xl bg-[#FEFCE8] border border-[#FACC15] p-3 text-base font-semibold text-[#854D0E]">
            {errorMsg}
          </div>
        )}
      </section>

      {/* AI Verdict Result Card */}
      {loading && (
        <div className="rounded-[20px] bg-[#F8FAFC] border-2 border-[#CBD5E1] p-6 space-y-3 animate-pulse">
          <div className="h-8 w-48 bg-[#E2E8F0] rounded-lg" />
          <div className="h-5 w-full bg-[#E2E8F0] rounded-lg" />
          <div className="h-5 w-5/6 bg-[#E2E8F0] rounded-lg" />
        </div>
      )}

      {result && !loading && (
        <section
          className={`rounded-[20px] ${verdictStyles.bg} border-2 ${verdictStyles.border} p-6 shadow-[0_6px_0_0_rgba(15,23,42,0.1)] space-y-5`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl font-extrabold text-[20px] ${verdictStyles.badgeBg}`}>
              <VerdictIcon className="w-6 h-6" />
              <span>{verdictStyles.label}</span>
            </div>

            <SpeakButton
              text={`${verdictStyles.label}. ${t.reasonsTitle} ${result.reasons.join('. ')}. ${t.adviceTitle} ${result.advice}`}
            />
          </div>

          <div className="space-y-2">
            <h2 className="text-[20px] font-extrabold text-[#0F172A]">{t.reasonsTitle}</h2>
            <ul className="space-y-2">
              {result.reasons.map((reason, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 rounded-xl bg-white/80 p-3 text-[18px] font-semibold text-[#0F172A]"
                >
                  <span className="w-7 h-7 rounded-full bg-[#0F172A] text-white text-sm font-extrabold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-white p-4 border border-[#CBD5E1]">
            <h3 className="text-base font-extrabold text-[#166534] uppercase">
              {t.adviceTitle}
            </h3>
            <p className="text-[19px] font-bold text-[#0F172A] mt-1">{result.advice}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={handleReportScam}
              disabled={reported}
              className={`inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-[20px] font-extrabold text-[18px] border-2 ${
                reported
                  ? 'bg-[#166534] border-[#166534] text-white'
                  : 'bg-white border-[#0F172A] text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Flag className="w-5 h-5" />
              <span>{reported ? t.reportedSuccess : t.reportScamBtn}</span>
            </button>

            <a
              href="tel:1930"
              className="inline-flex items-center justify-center gap-2 min-h-[56px] px-5 rounded-[20px] bg-[#DC2626] hover:bg-[#B91C1C] text-white font-extrabold text-[18px] shadow-[0_4px_0_0_#7F1D1D]"
            >
              <PhoneCall className="w-5 h-5" />
              <span>{t.call1930}</span>
            </a>
          </div>
        </section>
      )}

      {/* Common Rural Scams Reference */}
      <section className="space-y-3">
        <h2 className="text-[22px] font-extrabold text-[#0F172A]">{t.commonScamsTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {commonScams.map((item) => (
            <div
              key={item.title}
              className="rounded-[20px] bg-[#FEF2F2] border border-[#FECACA] p-4 space-y-1.5"
            >
              <h3 className="text-[19px] font-extrabold text-[#991B1B]">{item.title}</h3>
              <p className="text-[17px] font-medium text-[#0F172A]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
