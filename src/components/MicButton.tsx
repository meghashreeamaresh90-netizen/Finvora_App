import React, { useEffect, useRef, useState } from 'react';
import { Loader2, Mic, Square } from 'lucide-react';
import { useFinvora } from '../context/FinvoraContext';
import { LanguageCode } from '../types/finvora';
import { startVoiceRecognition } from '../utils/formatters';

interface MicButtonProps {
  onTranscript: (text: string) => void;
  onError?: (msg: string) => void;
  compact?: boolean;
  label?: string;
  className?: string;
}

const MIC_LABELS: Record<
  LanguageCode,
  { speak: string; listening: string; processing: string }
> = {
  kn: {
    speak: 'ಮಾತನಾಡಿ',
    listening: 'ಕೇಳುತ್ತಿದೆ... ನಿಲ್ಲಿಸಿ',
    processing: 'ಬರೆಯುತ್ತಿದೆ...',
  },
  te: {
    speak: 'మాట్లాడండి',
    listening: 'వింటోంది... ఆపండి',
    processing: 'రాస్తోంది...',
  },
  hi: {
    speak: 'बोलें',
    listening: 'सुन रहा है... रोकें',
    processing: 'लिख रहा है...',
  },
  mr: {
    speak: 'बोला',
    listening: 'ऐकत आहे... थांबवा',
    processing: 'लिहीत आहे...',
  },
  ta: {
    speak: 'பேசு',
    listening: 'கேட்கிறது... நிறுத்து',
    processing: 'எழுதுகிறது...',
  },
  en: {
    speak: 'Speak',
    listening: 'Listening... Stop',
    processing: 'Transcribing...',
  },
};

export const MicButton: React.FC<MicButtonProps> = ({
  onTranscript,
  onError,
  compact = false,
  label,
  className = '',
}) => {
  const { language } = useFinvora();
  const [state, setState] = useState<'idle' | 'listening' | 'processing'>('idle');
  const stopRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      stopRef.current?.();
    };
  }, []);

  useEffect(() => {
    if (state !== 'idle') {
      stopRef.current?.();
      setState('idle');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  const labels = MIC_LABELS[language] || MIC_LABELS.en;

  const handleClick = () => {
    if (state === 'listening') {
      stopRef.current?.();
      return;
    }
    if (state === 'processing') return;

    setState('listening');
    stopRef.current = startVoiceRecognition(
      language,
      (text) => onTranscript(text),
      (msg) => onError?.(msg),
      () => {
        stopRef.current = null;
        setState('idle');
      },
      () => setState('processing')
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={state === 'processing'}
      aria-label={state === 'listening' ? labels.listening : label || labels.speak}
      className={`inline-flex items-center justify-center gap-2 font-bold transition-colors shrink-0 whitespace-nowrap ${
        state === 'listening'
          ? 'bg-[#DC2626] text-white border-2 border-[#DC2626]'
          : state === 'processing'
          ? 'bg-[#0369A1] text-white border-2 border-[#0369A1] opacity-80'
          : 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white border-2 border-[#0EA5E9]'
      } ${
        compact
          ? 'min-h-[44px] min-w-[44px] px-3 rounded-xl text-sm'
          : 'min-h-[56px] px-5 rounded-[20px] text-[18px]'
      } ${className}`}
    >
      {state === 'processing' ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : state === 'listening' ? (
        <Square className="w-4 h-4 fill-current" />
      ) : (
        <Mic className="w-5 h-5" />
      )}
      {!compact && (
        <span>
          {state === 'processing'
            ? labels.processing
            : state === 'listening'
            ? labels.listening
            : label || labels.speak}
        </span>
      )}
    </button>
  );
};
