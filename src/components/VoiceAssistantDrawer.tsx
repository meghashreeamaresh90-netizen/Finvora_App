import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Mic, X } from 'lucide-react';
import { useFinvora } from '../context/FinvoraContext';
import { LanguageCode } from '../types/finvora';
import { speakText } from '../utils/formatters';
import { MicButton } from './MicButton';
import { SpeakButton } from './SpeakButton';

const VOICE_DRAWER_TEXT: Record<
  LanguageCode,
  {
    fabLabel: string;
    title: string;
    subtitle: string;
    heardLabel: string;
    navMatched: string;
    openPage: string;
    thinking: string;
    hint: string;
  }
> = {
  kn: {
    fabLabel: 'ಧ್ವನಿ ಸಹಾಯಕ',
    title: 'ಮಾತನಾಡಿ ಕೇಳಿ',
    subtitle: 'ಮೈಕ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ಪುಟಕ್ಕೆ ಹೋಗಿ.',
    heardLabel: 'ನೀವು ಹೇಳಿದ್ದು:',
    navMatched: 'ನೀವು ಕೇಳಿದ ಪುಟಕ್ಕೆ ಕರೆದೊಯ್ಯಲಾಗುತ್ತಿದೆ:',
    openPage: 'ತೆರೆಯಿರಿ',
    thinking: 'ಉತ್ತರ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
    hint: 'ಉದಾಹರಣೆ: "ಬೆಳೆ ಸಾಲ ಹೇಗೆ ಪಡೆಯುವುದು?", "ಸರ್ಕಾರಿ ಯೋಜನೆ", "ಬ್ಯಾಂಕ್"',
  },
  te: {
    fabLabel: 'వాయిస్ సహాయకుడు',
    title: 'మాట్లాడి అడగండి',
    subtitle: 'మైక్ నొక్కి తెలుగులో ప్రశ్న అడగండి లేదా పేజీని తెరవండి.',
    heardLabel: 'మీరు చెప్పింది:',
    navMatched: 'మీరు అడిగిన పేజీకి తీసుకెళ్తోంది:',
    openPage: 'తెరవండి',
    thinking: 'సమాధానం సిద్ధమవుతోంది...',
    hint: 'ఉదాహరణ: "పంట రుణం ఎలా పొందాలి?", "ప్రభుత్వ పథకాలు", "దగ్గరలోని బ్యాంకు"',
  },
  hi: {
    fabLabel: 'आवाज़ सहायक',
    title: 'बोलकर पूछें',
    subtitle: 'माइक दबाएं और हिंदी में सवाल पूछें या पेज खोलें।',
    heardLabel: 'आपने कहा:',
    navMatched: 'पेज खोल रहे हैं:',
    openPage: 'खोलें',
    thinking: 'उत्तर तैयार हो रहा है...',
    hint: 'उदाहरण: "फसल लोन कैसे लें?", "सरकारी योजना", "पास का बैंक"',
  },
  mr: {
    fabLabel: 'आवाज सहाय्यक',
    title: 'बोलून विचारा',
    subtitle: 'माइक दाबा आणि मराठीत प्रश्न विचारा किंवा पान उघडा.',
    heardLabel: 'तुम्ही म्हणालात:',
    navMatched: 'पान उघडत आहे:',
    openPage: 'उघडा',
    thinking: 'उत्तर तयार होत आहे...',
    hint: 'उदाहरण: "पीक कर्ज कसे घ्यावे?", "सरकारी योजना", "जवळची बँक"',
  },
  ta: {
    fabLabel: 'குரல் உதவியாளர்',
    title: 'பேசி கேளுங்கள்',
    subtitle: 'மைக் அழுத்தி தமிழில் கேள்வி கேளுங்கள்.',
    heardLabel: 'நீங்கள் சொன்னது:',
    navMatched: 'பக்கம் திறக்கப்படுகிறது:',
    openPage: 'திற',
    thinking: 'பதில் தயாராகிறது...',
    hint: 'உதாரணம்: "பயிர் கடன் பெறுவது எப்படி?", "அரசு திட்டம்", "வங்கி"',
  },
  en: {
    fabLabel: 'Voice Mic',
    title: 'Speak to Finvora',
    subtitle: 'Tap the mic and ask any money question or say a page name.',
    heardLabel: 'You said:',
    navMatched: 'Opening page:',
    openPage: 'Open',
    thinking: 'Finding answer...',
    hint: 'Try saying: "How to get a crop loan?", "Government schemes", or "Nearby banks"',
  },
};

function detectVoiceRoute(
  text: string
): { path: string; labelKn: string; labelTe: string; labelEn: string } | null {
  const lower = text.toLowerCase();
  if (/scheme|yojana|kisan|ಯೋಜನೆ|ಪೆನ್ಶನ್|పథకం|పథకాలు|కిసాన్|योजना|திட்டம்/.test(lower)) {
    return { path: '/schemes', labelKn: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು', labelTe: 'ప్రభుత్వ పథకాలు', labelEn: 'Govt Schemes' };
  }
  if (/bank|atm|mandya|ಬ್ಯಾಂಕ್|ಎಟಿಎಂ|బ్యాంక్|బ్యాంకు|ఏటీఎం|बैंक|बँक|வங்கி/.test(lower)) {
    return { path: '/banks', labelKn: 'ಹತ್ತಿರದ ಬ್ಯಾಂಕ್', labelTe: 'దగ్గరలోని బ్యాంకులు', labelEn: 'Nearby Banks' };
  }
  if (/goal|pump|education|ಗುರಿ|ಪಂಪ್|ಶಿಕ್ಷಣ|లక్ష్యం|పంపు|చదువు|लक्ष्य|ध्येय|இலக்கு/.test(lower)) {
    return { path: '/goals', labelKn: 'ಉಳಿತಾಯ ಗುರಿಗಳು', labelTe: 'పొదుపు లక్ష్యాలు', labelEn: 'Savings Goals' };
  }
  if (/calculator|emi|interest|ಲೆಕ್ಕ|ಇಎಂಐ|ಬಡ್ಡಿ|లెక్క|వడ్డీ|ఈఎంఐ|कैलकुलेटर|कॅल्क्युलेटर|கணக்கீடு/.test(lower)) {
    return { path: '/calculators', labelKn: 'ಲೆಕ್ಕಾಚಾರಗಳು', labelTe: 'ఆర్థిక లెక్కలు', labelEn: 'Calculators' };
  }
  if (/scam|fraud|link|1930|ವಂಚನೆ|ಮೋಸ|ಧೋಖಾ|మోసం|వంచన|ठगी|फसवणूक|மோசடி/.test(lower)) {
    return { path: '/scam-rescue', labelKn: 'ವಂಚನೆ ತಡೆ', labelTe: 'మోసాల నివారణ', labelEn: 'Scam Rescue' };
  }
  if (/upi|qr|ಯುಪಿಐ|ಕ್ಯೂಆರ್|యూపీఐ|క్యూఆర్|यूपीआई|यूपीआय|யூபிஐ/.test(lower) && text.length < 30) {
    return { path: '/upi-guide', labelKn: 'ಯುಪಿಐ ಮಾರ್ಗದರ್ಶಿ', labelTe: 'యూపీఐ గైడ్', labelEn: 'UPI Guide' };
  }
  if (/learn|lesson|ಪಾಠ|ಕಲಿಯಿರಿ|నేర్చుకో|పాఠం|सीखें|शिका|கற்க/.test(lower) && text.length < 30) {
    return { path: '/learn', labelKn: 'ಕಲಿಯಿರಿ', labelTe: 'నేర్చుకోండి', labelEn: 'Learn' };
  }
  if (/progress|badge|dashboard|ಪ್ರಗತಿ|ಬ್ಯಾಡ್ಜ್|ಡ್ಯಾಶ್|ప్రగతి|బ్యాడ్జ్|డాష్/.test(lower)) {
    return { path: '/dashboard', labelKn: 'ನನ್ನ ಪ್ರಗತಿ', labelTe: 'నా పురోగతి', labelEn: 'My Progress' };
  }
  return null;
}

export const VoiceAssistantDrawer: React.FC = () => {
  const { language, totalIncome, totalExpenses, totalSaved, setTtsWarning } = useFinvora();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [heardText, setHeardText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [matchedRoute, setMatchedRoute] = useState<{
    path: string;
    labelKn: string;
    labelTe: string;
    labelEn: string;
  } | null>(null);

  const ui = VOICE_DRAWER_TEXT[language] || VOICE_DRAWER_TEXT.en;

  const handleTranscript = async (transcript: string) => {
    setHeardText(transcript);
    setErrorMsg('');
    setReplyText('');

    const routeMatch = detectVoiceRoute(transcript);
    setMatchedRoute(routeMatch);

    if (routeMatch && transcript.trim().split(/\s+/).length <= 3) {
      navigate(routeMatch.path);
      const confirmMsg =
        language === 'kn'
          ? `${routeMatch.labelKn} ಪುಟವನ್ನು ತೆರೆಯಲಾಗಿದೆ.`
          : language === 'te'
          ? `${routeMatch.labelTe} పేజీ తెరవబడింది.`
          : `Opening ${routeMatch.labelEn}.`;
      setReplyText(confirmMsg);
      await speakText(confirmMsg, language, {
        onVoiceMissing: (msg) => setTtsWarning(msg),
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: transcript,
          language,
          userContext: `Lakshmi, 52, Mandya. Income ${totalIncome}, Expenses ${totalExpenses}, Saved ${totalSaved}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI service unavailable');
      }
      setReplyText(data.reply);
      await speakText(data.reply, language, {
        onVoiceMissing: (msg) => setTtsWarning(msg),
      });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to reply.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Persistent Global Mic Button (Bottom-Right above Bottom Nav) */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={ui.fabLabel}
        className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 min-h-[56px] px-4 rounded-full bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-extrabold text-base shadow-[0_6px_16px_rgba(14,165,233,0.4)] border-2 border-white active:scale-95 transition-transform"
      >
        <Mic className="w-6 h-6" />
        <span className="hidden sm:inline">{ui.fabLabel}</span>
      </button>

      {/* Voice Sheet Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-[#0F172A]/50 flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={ui.title}
        >
          <div className="w-full max-w-lg rounded-[24px] bg-white border-2 border-[#0EA5E9] p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-[22px] font-extrabold text-[#0F172A]">{ui.title}</h2>
                  <p className="text-sm font-medium text-[#475569]">{ui.subtitle}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="w-11 h-11 rounded-xl bg-[#F1F5F9] flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex justify-center py-2">
              <MicButton
                onTranscript={handleTranscript}
                onError={(msg) => setErrorMsg(msg)}
                className="w-full justify-center min-h-[64px] text-[20px]"
              />
            </div>

            <p className="text-sm font-medium text-[#475569] text-center">{ui.hint}</p>

            {heardText && (
              <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3.5">
                <p className="text-xs font-extrabold text-[#166534]">{ui.heardLabel}</p>
                <p className="text-[18px] font-bold text-[#0F172A] mt-0.5">{heardText}</p>
              </div>
            )}

            {matchedRoute && (
              <button
                type="button"
                onClick={() => {
                  navigate(matchedRoute.path);
                  setOpen(false);
                }}
                className="w-full min-h-[52px] px-4 rounded-2xl bg-[#166534] text-white font-bold text-base flex items-center justify-between"
              >
                <span>
                  {ui.navMatched}{' '}
                  {language === 'kn'
                    ? matchedRoute.labelKn
                    : language === 'te'
                    ? matchedRoute.labelTe
                    : matchedRoute.labelEn}
                </span>
                <span>{ui.openPage} →</span>
              </button>
            )}

            {loading && (
              <div className="rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] p-4 text-[18px] font-bold text-[#0369A1] animate-pulse">
                {ui.thinking}
              </div>
            )}

            {replyText && !loading && (
              <div className="rounded-2xl bg-[#F8FAFC] border-2 border-[#CBD5E1] p-4 space-y-3 max-h-56 overflow-y-auto">
                <p className="text-[18px] font-medium text-[#0F172A] whitespace-pre-line">
                  {replyText}
                </p>
                <div className="flex justify-end">
                  <SpeakButton text={replyText} compact />
                </div>
              </div>
            )}

            {errorMsg && (
              <p className="rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3 text-sm font-bold text-[#991B1B]">
                {errorMsg}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};
