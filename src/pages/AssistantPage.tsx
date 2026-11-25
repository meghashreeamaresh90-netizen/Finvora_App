import React, { useEffect, useState } from 'react';
import { Bot, Send, ShieldCheck } from 'lucide-react';
import { MicButton } from '../components/MicButton';
import { SpeakButton } from '../components/SpeakButton';
import { useFinvora } from '../context/FinvoraContext';
import { ChatMessage, LanguageCode } from '../types/finvora';

const LOCALIZED_WELCOME: Record<LanguageCode, string> = {
  kn: 'ನಮಸ್ಕಾರ ಲಕ್ಷ್ಮಿ! ಉಳಿತಾಯ, ಸಾಲ, ಯುಪಿಐ, ಸರ್ಕಾರಿ ಯೋಜನೆ ಅಥವಾ ವಂಚನೆ ತಡೆ ಬಗ್ಗೆ ಕೇಳಿ. ಇದು ಕೇವಲ ಆರ್ಥಿಕ ಜಾಗೃತಿ ಮಾತ್ರ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ.',
  te: 'నమస్కారం లక్ష్మి గారు! పొదుపు, రుణాలు, యూపీఐ, ప్రభుత్వ పథకాలు లేదా మోసాల నివారణ గురించి అడగండి. ఇది ఆర్థిక అవగాహన మాత్రమే, చట్టపరమైన సలహా కాదు.',
  hi: 'नमस्कार लक्ष्मी जी! बचत, कर्ज, यूपीआई, सरकारी योजना या ठगी से बचाव के बारे में पूछें। यह केवल वित्तीय जागरूकता है, कानूनी सलाह नहीं है।',
  mr: 'नमस्कार लक्ष्मीबाई! बचत, कर्ज, यूपीआय, सरकारी योजना किंवा फसवणुकीपासून बचावाबद्दल विचारा. ही केवळ आर्थिक जनजागृती आहे, कायदेशीर सल्ला नाही.',
  ta: 'வணக்கம் லட்சுமி அம்மா! சேமிப்பு, கடன், யூபிஐ, அரசு திட்டம் அல்லது மோசடி தடுப்பு பற்றி கேளுங்கள். இது நிதி விழிப்புணர்வு மட்டுமே, சட்ட ஆலோசனை அல்ல.',
  en: 'Namaskara Lakshmi! Ask any question about savings, loans, UPI, government schemes, or scams. This is awareness, not legal advice.',
};

const LOCALIZED_THINKING: Record<LanguageCode, string> = {
  kn: 'ಸರಳ ಪದಗಳಲ್ಲಿ ಉತ್ತರ ಸಿದ್ಧವಾಗುತ್ತಿದೆ...',
  te: 'సరళమైన మాటల్లో సమాధానం సిద్ధమవుతోంది...',
  hi: 'सरल शब्दों में उत्तर तैयार हो रहा है...',
  mr: 'सोप्या शब्दांत उत्तर तयार होत आहे...',
  ta: 'எளிய வார்த்தைகளில் பதில் தயாராகிறது...',
  en: 'Thinking in simple words...',
};

const LOCALIZED_SAFETY_BANNER: Record<LanguageCode, string> = {
  kn: 'ನಿಮ್ಮ ಯುಪಿಐ ಪಿನ್, ಒಟಿಪಿ ಅಥವಾ ಆಧಾರ್ ಸಂಖ್ಯೆಯನ್ನು ಯಾರಿಗೂ ಹೇಳಬೇಡಿ. ಇದು ಕೇವಲ ಆರ್ಥಿಕ ಜಾಗೃತಿ ಮಾತ್ರ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ.',
  te: 'మీ యూపీఐ పిన్, ఓటీపీ లేదా ఆధార్ నంబర్‌ను ఎవరితోనూ పంచుకోవద్దు. ఇది ఆర్థిక అవగాహన మాత్రమే, చట్టపరమైన సలహా కాదు.',
  hi: 'अपना यूपीआई पिन, ओटीपी या आधार नंबर कभी साझा न करें। यह केवल वित्तीय जागरूकता है, कानूनी सलाह नहीं है।',
  mr: 'तुमचा यूपीआय पिन, ओटीपी किंवा आधार क्रमांक कधीही शेअर करू नका. ही केवळ आर्थिक जनजागृती आहे, कायदेशीर सल्ला नाही.',
  ta: 'உங்கள் யூபிஐ பின், ஓடிபி அல்லது ஆதார் எண்ணை யாருக்கும் சொல்லாதீர்கள். இது நிதி விழிப்புணர்வு மட்டுமே, சட்ட ஆலோசனை அல்ல.',
  en: 'Never share your UPI PIN, OTP, or Aadhaar number. This is financial awareness guidance, not legal advice.',
};

function getOfflineFallbackReply(question: string, language: LanguageCode): string {
  const q = question.toLowerCase();
  const isPinOrScam =
    q.includes('pin') ||
    q.includes('upi') ||
    q.includes('scam') ||
    question.includes('ಪಿನ್') ||
    question.includes('ಯುಪಿಐ') ||
    question.includes('పిన్') ||
    question.includes('యూపీఐ') ||
    question.includes('మోసం') ||
    question.includes('पिन') ||
    question.includes('யூபிஐ');

  if (language === 'kn') {
    if (isPinOrScam) {
      return (
        'ಒಂದು. ಹಣ ಪಡೆಯಲು ಯುಪಿಐ ಪಿನ್ ಹಾಕುವ ಅಗತ್ಯವಿಲ್ಲ.\n' +
        'ಎರಡು. ಬ್ಯಾಂಕ್ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಕರೆ ಮಾಡಿ ಒಟಿಪಿ ಕೇಳುವುದಿಲ್ಲ.\n' +
        'ಮೂರು. ಅನುಮಾನ ಬಂದರೆ ಹತ್ತೊಂಬತ್ತು ನೂರು ಮೂವತ್ತಕ್ಕೆ ಕರೆ ಮಾಡಿ.\n\n' +
        'ಇದು ಕೇವಲ ಆರ್ಥಿಕ ಜಾಗೃತಿ ಮಾತ್ರ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ.'
      );
    }
    return (
      'ಒಂದು. ಹಾಲು ಅಥವಾ ಬೆಳೆ ಹಣ ಬಂದ ತಕ್ಷಣ ಹತ್ತು ಶೇಕಡಾ ಉಳಿತಾಯ ಮಾಡಿ.\n' +
      'ಎರಡು. ದಿನದ ಖರ್ಚನ್ನು ಹಣದ ಲೆಕ್ಕ ಪುಟದಲ್ಲಿ ಬರೆಯಿರಿ.\n' +
      'ಮೂರು. ಕಡಿಮೆ ಬಡ್ಡಿಯ ಬೆಳೆ ಸಾಲಕ್ಕಾಗಿ ಗ್ರಾಮೀಣ ಬ್ಯಾಂಕ್ ಅಥವಾ ಎಸ್ಬಿಐ ಶಾಖೆಗೆ ಭೇಟಿ ನೀಡಿ.\n\n' +
      'ಇದು ಕೇವಲ ಆರ್ಥಿಕ ಜಾಗೃತಿ ಮಾತ್ರ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ.'
    );
  }

  if (language === 'te') {
    if (isPinOrScam) {
      return (
        'ఒకటి. డబ్బు స్వీకరించడానికి యూపీఐ పిన్ ఎంటర్ చేయాల్సిన అవసరం లేదు.\n' +
        'రెండు. బ్యాంకులు లేదా ప్రభుత్వ పథకాలు ఫోన్ చేసి ఓటీపీ అడగవు.\n' +
        'మూడు. అనుమానం వస్తే పంతొమ్మిది వందల ముప్పైకి కాల్ చేయండి.\n\n' +
        'ఇది ఆర్థిక అవగాహన మాత్రమే, చట్టపరమైన సలహా కాదు.'
      );
    }
    return (
      'ఒకటి. పాలు లేదా పంట డబ్బు వచ్చిన వెంటనే పది శాతం పొదుపు చేయండి.\n' +
      'రెండు. రోజువారీ ఖర్చులను డబ్బు లెక్క పేజీలో రాయండి.\n' +
      'మూడు. తక్కువ వడ్డీ పంట రుణం కోసం గ్రామీణ బ్యాంక్ లేదా ఎస్బీఐ శాఖకు వెళ్ళండి.\n\n' +
      'ఇది ఆర్థిక అవగాహన మాత్రమే, చట్టపరమైన సలహా కాదు.'
    );
  }

  if (language === 'hi') {
    if (isPinOrScam) {
      return (
        'एक. पैसे लेने के लिए कभी यूपीआई पिन नहीं डालना होता।\n' +
        'दो. बैंक कभी फोन पर ओटीपी या पिन नहीं मांगता।\n' +
        'तीन. संदेह होने पर उन्नीस सौ तीस पर कॉल करें।\n\n' +
        'यह केवल वित्तीय जागरूकता है, कानूनी सलाह नहीं है।'
      );
    }
    return (
      'एक. फसल या दूध का पैसा आते ही दस प्रतिशत अलग बचाएं।\n' +
      'दो. रोज का खर्च पैसे वाले पन्ने में लिखें।\n' +
      'तीन. कम ब्याज के किसान कर्ज के लिए ग्रामीण बैंक या एसबीआई शाखा जाएं।\n\n' +
      'यह केवल वित्तीय जागरूकता है, कानूनी सलाह नहीं है।'
    );
  }

  if (language === 'mr') {
    return (
      'एक. पैसे मिळताच दहा टक्के रक्कम बँक किंवा बचत गटात बाजूला ठेवा.\n' +
      'दोन. कोणाशीही यूपीआय पिन किंवा ओटीपी शेअर करू नका.\n' +
      'तीन. कमी व्याजाच्या कर्जासाठी जवळच्या ग्रामीण बँक किंवा एसबीआय शाखेत जा.\n\n' +
      'ही केवळ आर्थिक जनजागृती आहे, कायदेशीर सल्ला नाही.'
    );
  }

  if (language === 'ta') {
    return (
      'ஒன்று. வருமானம் வந்தவுடன் பத்து சதவீதம் தனியாக சேமிக்கவும்.\n' +
      'இரண்டு. யூபிஐ பின் அல்லது ஓடிபி எண்ணை யாருக்கும் சொல்லாதீர்கள்.\n' +
      'மூன்று. குறைந்த வட்டி பயிர் கடனுக்கு கிராம வங்கி அல்லது எஸ்பிஐ கிளையை அணுகவும்.\n\n' +
      'இது நிதி விழிப்புணர்வு மட்டுமே, சட்ட ஆலோசனை அல்ல.'
    );
  }

  if (isPinOrScam) {
    return (
      '1. Never enter your UPI PIN or scan a QR code to receive money.\n' +
      '2. Banks and government schemes never ask for OTP or PIN over phone or SMS links.\n' +
      '3. If someone threatens you, hang up and call nineteen thirty.\n\n' +
      'This is awareness, not legal advice.'
    );
  }
  return (
    '1. Keep ten percent of every crop or milk payout aside first in your bank passbook.\n' +
    '2. Track daily expenses in the Money tab so you know where cash goes.\n' +
    '3. Ask your Gramin Bank or SBI branch for low-interest crop loans.\n\n' +
    'This is awareness, not legal advice.'
  );
}

export const AssistantPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { t, language, totalIncome, totalExpenses, totalSaved, goals } = useFinvora();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      text: LOCALIZED_WELCOME[language] || LOCALIZED_WELCOME.en,
      timestamp: '',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorNote, setErrorNote] = useState('');

  // Keep welcome message synced to selected language
  useEffect(() => {
    setMessages((prev) => {
      const hasOnlyWelcome = prev.length === 1 && prev[0].id === 'welcome-1';
      if (hasOnlyWelcome) {
        return [
          {
            id: 'welcome-1',
            role: 'assistant',
            text: LOCALIZED_WELCOME[language] || LOCALIZED_WELCOME.en,
            timestamp: '',
          },
        ];
      }
      return prev;
    });
  }, [language]);

  const sendMessage = async (textToSend?: string) => {
    const query = (textToSend ?? input).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    if (!textToSend) setInput('');
    setLoading(true);
    setErrorNote('');

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          language,
          history: nextMessages.slice(-6).map((m) => ({ role: m.role, text: m.text })),
          userContext: `Lakshmi, 52, farmer near Mandya. Monthly income ${totalIncome} rupees, expenses ${totalExpenses} rupees, saved ${totalSaved} rupees. Top goal: ${goals[0]?.title || 'Water Pump'}.`,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'AI service could not reply.');
      }

      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to connect.';
      setErrorNote(msg);
      const fallbackMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: getOfflineFallbackReply(query, language),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {!embedded && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center shrink-0">
              <Bot className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#0369A1]">
                {t.aiTitle}
              </h1>
              <p className="text-[18px] font-medium text-[#334155]">{t.aiSubtitle}</p>
            </div>
          </div>
          <SpeakButton text={LOCALIZED_WELCOME[language] || t.aiSubtitle} />
        </div>
      )}

      {/* Safety Notice */}
      <div className="rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] p-3.5 flex items-center gap-2.5 text-base font-semibold text-[#166534]">
        <ShieldCheck className="w-5 h-5 shrink-0" />
        <span>{LOCALIZED_SAFETY_BANNER[language] || t.awarenessNotice}</span>
      </div>

      {/* 3 Suggested Chips */}
      <div className="space-y-2">
        <p className="text-base font-bold text-[#334155]">{t.suggestedTitle}</p>
        <div className="flex flex-wrap gap-2">
          {t.suggestedChips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => sendMessage(chip)}
              disabled={loading}
              className="min-h-[48px] px-4 py-2 rounded-2xl bg-[#F0F9FF] border-2 border-[#0EA5E9] text-[#0369A1] font-bold text-base text-left hover:bg-[#E0F2FE] disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="rounded-[20px] bg-[#F8FAFC] border-2 border-[#CBD5E1] p-4 space-y-4 max-h-[460px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[80%] rounded-[20px] p-4 space-y-3 ${
                msg.role === 'user'
                  ? 'bg-[#166534] text-white'
                  : 'bg-white border-2 border-[#BAE6FD] text-[#0F172A]'
              }`}
            >
              <p className="text-[18px] font-medium whitespace-pre-line leading-relaxed">
                {msg.text}
              </p>

              {msg.role === 'assistant' && (
                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#E2E8F0]">
                  <span className="text-xs font-bold text-[#64748B]">{msg.timestamp}</span>
                  <SpeakButton text={msg.text} compact />
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start">
            <div className="rounded-[20px] bg-white border-2 border-[#BAE6FD] p-4 text-[18px] font-semibold text-[#0369A1] animate-pulse">
              {LOCALIZED_THINKING[language] || LOCALIZED_THINKING.en}
            </div>
          </div>
        )}
      </div>

      {errorNote && (
        <p className="text-sm font-semibold text-[#9A3412] bg-[#FFF7ED] border border-[#FED7AA] rounded-xl p-3">
          {errorNote}
        </p>
      )}

      {/* Input + Voice Mic Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="flex flex-col sm:flex-row gap-2.5"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.aiPlaceholder}
          className="flex-1 min-h-[58px] rounded-[20px] bg-white border-2 border-[#94A3B8] px-4 text-[18px] font-medium text-[#0F172A]"
        />
        <div className="grid grid-cols-2 sm:flex gap-2.5">
          <MicButton
            onTranscript={(transcript) => {
              setInput(transcript);
              sendMessage(transcript);
            }}
            onError={(err) => setErrorNote(err)}
            label={t.micBtn}
            className="min-h-[58px] justify-center"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center justify-center gap-2 min-h-[58px] px-6 rounded-[20px] bg-[#F97316] hover:bg-[#EA580C] disabled:opacity-50 text-white font-extrabold text-[18px] shadow-[0_4px_0_0_#9A3412]"
          >
            <Send className="w-5 h-5" />
            <span>{t.sendBtn}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
