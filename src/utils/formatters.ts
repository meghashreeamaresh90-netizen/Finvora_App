import { LanguageCode } from '../types/finvora';

export function formatINR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.round(amount) : 0;
  const formatted = new Intl.NumberFormat('en-IN').format(Math.abs(safe));
  return safe < 0 ? `-₹${formatted}` : `₹${formatted}`;
}

export const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  kn: 'kn-IN',
  te: 'te-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
  en: 'en-IN',
};

export const LANGUAGE_DISPLAY_NAMES: Record<LanguageCode, string> = {
  kn: 'Kannada',
  te: 'Telugu',
  hi: 'Hindi',
  mr: 'Marathi',
  ta: 'Tamil',
  en: 'English',
};

export function cleanSpeechText(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^[•▪●\-–—]+\s*/gm, '')
    .replace(/[•▪●`~_]/g, ' ')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function splitSpeechChunks(text: string, maxLen = 175): string[] {
  const cleaned = cleanSpeechText(text);
  if (!cleaned) return [];

  const rawParts = cleaned
    .split(/(?<=[.!?।])\s+|\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: string[] = [];
  for (const part of rawParts) {
    if (part.length <= maxLen) {
      chunks.push(part);
      continue;
    }
    const words = part.split(/\s+/);
    let current = '';
    for (const word of words) {
      if (!current) {
        current = word;
      } else if (current.length + 1 + word.length <= maxLen) {
        current += ' ' + word;
      } else {
        chunks.push(current);
        current = word;
      }
    }
    if (current) chunks.push(current);
  }
  return chunks;
}

async function waitForSpeechVoices(): Promise<SpeechSynthesisVoice[]> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  const existing = window.speechSynthesis.getVoices();
  if (existing && existing.length > 0) {
    return existing;
  }
  return new Promise((resolve) => {
    let resolved = false;
    const finish = () => {
      if (resolved) return;
      resolved = true;
      window.speechSynthesis.removeEventListener?.('voiceschanged', handleVoicesChanged);
      resolve(window.speechSynthesis.getVoices() || []);
    };
    const handleVoicesChanged = () => finish();
    if ('onvoiceschanged' in window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }
    window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged);
    setTimeout(finish, 900);
  });
}

let activeSessionId = 0;
let activeAudio: HTMLAudioElement | null = null;
let activeAudioUrl: string | null = null;
let activeAbortController: AbortController | null = null;

export function stopSpeaking(): void {
  activeSessionId += 1;

  if (activeAbortController) {
    try {
      activeAbortController.abort();
    } catch {
      // ignore
    }
    activeAbortController = null;
  }

  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // ignore
    }
    activeAudio = null;
  }

  if (activeAudioUrl) {
    try {
      URL.revokeObjectURL(activeAudioUrl);
    } catch {
      // ignore
    }
    activeAudioUrl = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

export interface SpeakCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onVoiceMissing?: (message: string) => void;
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mimeType });
}

export async function speakText(
  text: string,
  language: LanguageCode,
  callbacks: SpeakCallbacks = {}
): Promise<boolean> {
  stopSpeaking();
  const sessionId = activeSessionId;
  const cleaned = cleanSpeechText(text);

  if (!cleaned) {
    callbacks.onEnd?.();
    return false;
  }

  callbacks.onStart?.();

  // 1. Primary path: Gemini native TTS (/api/ai/tts) for accurate Kannada/Hindi/Marathi/Tamil speech
  try {
    const controller = new AbortController();
    activeAbortController = controller;
    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: cleaned, language }),
      signal: controller.signal,
    });

    if (sessionId !== activeSessionId) {
      return false;
    }

    if (res.ok) {
      const data = (await res.json()) as { audioBase64?: string; mimeType?: string };
      if (data.audioBase64 && sessionId === activeSessionId) {
        const blob = base64ToBlob(data.audioBase64, data.mimeType || 'audio/wav');
        const url = URL.createObjectURL(blob);
        activeAudioUrl = url;
        const audio = new Audio(url);
        activeAudio = audio;

        return await new Promise<boolean>((resolve) => {
          audio.onended = () => {
            if (sessionId === activeSessionId) {
              stopSpeaking();
              callbacks.onEnd?.();
            }
            resolve(true);
          };
          audio.onerror = () => {
            if (sessionId === activeSessionId) {
              stopSpeaking();
              callbacks.onEnd?.();
            }
            resolve(false);
          };
          audio.play().catch(() => {
            if (sessionId === activeSessionId) {
              stopSpeaking();
              callbacks.onEnd?.();
            }
            resolve(false);
          });
        });
      }
    }
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return false;
    }
    // Fall through to browser speechSynthesis fallback
  }

  if (sessionId !== activeSessionId) {
    return false;
  }

  // 2. Fallback path: Browser Web Speech API with strict language voice matching (NO silent English fallback)
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    const langName = LANGUAGE_DISPLAY_NAMES[language] || 'Selected';
    callbacks.onVoiceMissing?.(
      `${langName} voice not installed on this device. Please install it in your device's text-to-speech settings.`
    );
    callbacks.onEnd?.();
    return false;
  }

  const voices = await waitForSpeechVoices();
  if (sessionId !== activeSessionId) {
    return false;
  }

  const mappedCode = SPEECH_LANG_MAP[language] || 'en-IN';
  const matchingVoice =
    voices.find((v) => v.lang.toLowerCase() === mappedCode.toLowerCase()) ||
    voices.find((v) => v.lang.toLowerCase().startsWith(language.toLowerCase()));

  if (!matchingVoice) {
    const langName = LANGUAGE_DISPLAY_NAMES[language] || 'Selected';
    callbacks.onVoiceMissing?.(
      `${langName} voice not installed on this device. Please install it in your device's text-to-speech settings.`
    );
    callbacks.onEnd?.();
    return false;
  }

  const chunks = splitSpeechChunks(cleaned, 175);
  if (chunks.length === 0) {
    callbacks.onEnd?.();
    return false;
  }

  window.speechSynthesis.cancel();

  const speakChunkAt = (index: number) => {
    if (sessionId !== activeSessionId) return;
    if (index >= chunks.length) {
      callbacks.onEnd?.();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunks[index]);
    utterance.lang = mappedCode;
    utterance.voice = matchingVoice;
    utterance.rate = 0.92;
    utterance.pitch = 1;

    utterance.onend = () => {
      if (sessionId !== activeSessionId) return;
      speakChunkAt(index + 1);
    };

    utterance.onerror = () => {
      if (sessionId !== activeSessionId) return;
      callbacks.onEnd?.();
    };

    window.speechSynthesis.speak(utterance);
  };

  speakChunkAt(0);
  return true;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const VOICE_ERROR_MESSAGES: Record<LanguageCode, { blocked: string; unclear: string; unsupported: string }> = {
  kn: {
    blocked: 'ಮೈಕ್ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ. ದಯವಿಟ್ಟು ಬ್ರೌಸರ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳಲ್ಲಿ ಮೈಕ್ ಅನುಮತಿ ನೀಡಿ.',
    unclear: 'ಧ್ವನಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿಸಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
    unsupported: 'ಈ ಸಾಧನದಲ್ಲಿ ಧ್ವನಿ ರೆಕಾರ್ಡಿಂಗ್ ಲಭ್ಯವಿಲ್ಲ.',
  },
  te: {
    blocked: 'మైక్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్‌లలో మైక్ అనుమతి ఇవ్వండి.',
    unclear: 'మాట స్పష్టంగా వినిపించలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.',
    unsupported: 'ఈ పరికరంలో వాయిస్ రికార్డింగ్ అందుబాటులో లేదు.',
  },
  hi: {
    blocked: 'माइक की अनुमति नहीं है। कृपया ब्राउज़र में माइक अनुमति दें।',
    unclear: 'आवाज़ साफ़ नहीं सुनाई दी। कृपया फिर से प्रयास करें।',
    unsupported: 'इस डिवाइस पर आवाज़ इनपुट उपलब्ध नहीं है।',
  },
  mr: {
    blocked: 'माइकची परवानगी नाही. कृपया ब्राउझरमध्ये माइक सुरू करा.',
    unclear: 'आवाज स्पष्ट ऐकू आला नाही. कृपया पुन्हा प्रयत्न करा.',
    unsupported: 'या डिव्हाइसवर व्हॉइस इनपुट उपलब्ध नाही.',
  },
  ta: {
    blocked: 'மைக் அனுமதி மறுக்கப்பட்டது. உலாவியில் மைக் அனுமதி வழங்கவும்.',
    unclear: 'குரல் தெளிவாகக் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.',
    unsupported: 'இந்த சாதனத்தில் குரல் பதிவு இல்லை.',
  },
  en: {
    blocked: 'Microphone permission was blocked. Please allow mic access or type below.',
    unclear: 'Could not hear clearly. Please try again or type your message.',
    unsupported: 'Voice input is not supported in this browser.',
  },
};

function startMediaRecorderFallback(
  language: LanguageCode,
  onTranscript: (text: string) => void,
  onError: (msg: string) => void,
  onEnd: () => void,
  onProcessing?: () => void
): () => void {
  const errMsgs = VOICE_ERROR_MESSAGES[language] || VOICE_ERROR_MESSAGES.en;
  let stopped = false;
  let mediaRecorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  let autoStopTimer: ReturnType<typeof setTimeout> | null = null;

  const cleanupStream = () => {
    if (autoStopTimer) {
      clearTimeout(autoStopTimer);
      autoStopTimer = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  };

  const stopRecording = () => {
    if (stopped) return;
    stopped = true;
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      try {
        mediaRecorder.stop();
      } catch {
        cleanupStream();
        onEnd();
      }
    } else {
      cleanupStream();
      onEnd();
    }
  };

  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    !navigator.mediaDevices.getUserMedia ||
    typeof MediaRecorder === 'undefined'
  ) {
    onError(errMsgs.unsupported);
    onEnd();
    return stopRecording;
  }

  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((mediaStream) => {
      if (stopped) {
        mediaStream.getTracks().forEach((t) => t.stop());
        return;
      }
      stream = mediaStream;
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : '';

      const recorder = mimeType
        ? new MediaRecorder(mediaStream, { mimeType })
        : new MediaRecorder(mediaStream);
      mediaRecorder = recorder;
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) {
          chunks.push(ev.data);
        }
      };

      recorder.onstop = async () => {
        cleanupStream();
        if (chunks.length === 0) {
          onError(errMsgs.unclear);
          onEnd();
          return;
        }
        onProcessing?.();
        try {
          const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = String(reader.result || '');
              const comma = result.indexOf(',');
              resolve(comma >= 0 ? result.slice(comma + 1) : result);
            };
            reader.onerror = () => reject(new Error('Read error'));
            reader.readAsDataURL(blob);
          });

          const res = await fetch('/api/ai/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: recorder.mimeType || 'audio/webm',
              language,
            }),
          });
          const data = await res.json();
          if (!res.ok || !data.transcript) {
            throw new Error(data.error || errMsgs.unclear);
          }
          onTranscript(String(data.transcript).trim());
        } catch {
          onError(errMsgs.unclear);
        } finally {
          onEnd();
        }
      };

      recorder.start();
      autoStopTimer = setTimeout(() => {
        stopRecording();
      }, 6500);
    })
    .catch(() => {
      cleanupStream();
      onError(errMsgs.blocked);
      onEnd();
    });

  return stopRecording;
}

export function startVoiceRecognition(
  language: LanguageCode,
  onTranscript: (text: string) => void,
  onError: (msg: string) => void,
  onEnd: () => void,
  onProcessing?: () => void
): () => void {
  const errMsgs = VOICE_ERROR_MESSAGES[language] || VOICE_ERROR_MESSAGES.en;
  if (typeof window === 'undefined') {
    onEnd();
    return () => {};
  }

  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  const Recognition = w.SpeechRecognition || w.webkitSpeechRecognition;

  // If browser SpeechRecognition is unavailable, immediately use MediaRecorder + Gemini Transcribe
  if (!Recognition) {
    return startMediaRecorderFallback(language, onTranscript, onError, onEnd, onProcessing);
  }

  let activeStopFn: () => void = () => {};
  let fellBackToRecorder = false;
  let receivedResult = false;
  let manuallyStopped = false;

  try {
    const recognition = new Recognition();
    recognition.lang = SPEECH_LANG_MAP[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    activeStopFn = () => {
      manuallyStopped = true;
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      if (transcript.trim()) {
        receivedResult = true;
        onTranscript(transcript.trim());
      }
    };

    recognition.onerror = (event) => {
      if (event.error === 'not-allowed' || event.error === 'audio-capture') {
        onError(errMsgs.blocked);
        return;
      }
      // In iframes/sandboxes, Chrome throws 'network' or 'service-not-allowed' for SpeechRecognition;
      // seamlessly switch to MediaRecorder + Gemini Audio Transcription!
      if (
        !manuallyStopped &&
        (event.error === 'network' ||
          event.error === 'service-not-allowed' ||
          event.error === 'language-not-supported')
      ) {
        fellBackToRecorder = true;
        activeStopFn = startMediaRecorderFallback(
          language,
          onTranscript,
          onError,
          onEnd,
          onProcessing
        );
        return;
      }
      if (!receivedResult) {
        onError(errMsgs.unclear);
      }
    };

    recognition.onend = () => {
      if (!fellBackToRecorder) {
        onEnd();
      }
    };

    recognition.start();
    return () => activeStopFn();
  } catch {
    return startMediaRecorderFallback(language, onTranscript, onError, onEnd, onProcessing);
  }
}
