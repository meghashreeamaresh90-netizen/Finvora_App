import React, { useEffect, useState } from 'react';
import { Loader2, Volume2, VolumeX } from 'lucide-react';
import { useFinvora } from '../context/FinvoraContext';
import { speakText, stopSpeaking } from '../utils/formatters';

interface SpeakButtonProps {
  text: string;
  compact?: boolean;
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  text,
  compact = false,
  className = '',
}) => {
  const { language, t, setTtsWarning } = useFinvora();
  const [status, setStatus] = useState<'idle' | 'loading' | 'speaking'>('idle');

  useEffect(() => {
    setStatus('idle');
  }, [language]);

  useEffect(() => {
    return () => {
      if (status !== 'idle') {
        stopSpeaking();
      }
    };
  }, [status]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (status !== 'idle') {
      stopSpeaking();
      setStatus('idle');
      return;
    }

    setTtsWarning('');
    setStatus('loading');

    const ok = await speakText(text, language, {
      onStart: () => setStatus('speaking'),
      onEnd: () => setStatus('idle'),
      onVoiceMissing: (msg) => {
        setTtsWarning(msg);
        setStatus('idle');
      },
    });

    if (!ok) {
      setStatus('idle');
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={status !== 'idle' ? t.stopListening : t.listen}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-transform active:scale-95 shrink-0 whitespace-nowrap ${
        status !== 'idle'
          ? 'bg-[#166534] text-white'
          : 'bg-[#0EA5E9] hover:bg-[#0284C7] text-white'
      } ${
        compact
          ? 'min-h-[44px] min-w-[44px] px-3 text-sm'
          : 'min-h-[56px] px-5 text-base'
      } ${className}`}
    >
      {status === 'loading' ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : status === 'speaking' ? (
        <VolumeX className="w-5 h-5" />
      ) : (
        <Volume2 className="w-5 h-5" />
      )}
      {!compact && <span>{status !== 'idle' ? t.stopListening : t.listen}</span>}
    </button>
  );
};
