import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function resolveServerPort(): number {
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    const parsed = Number(process.argv[portArgIdx + 1]);
    if (Number.isFinite(parsed) && parsed > 0) return parsed;
  }
  if (process.env.NODE_ENV === 'production') {
    return Number(process.env.PORT) || 3000;
  }
  const envPort = Number(process.env.PORT);
  if (Number.isFinite(envPort) && envPort > 0 && envPort !== 8080) {
    return envPort;
  }
  return 3000;
}

const PORT = resolveServerPort();
const MODEL_NAME = 'gemini-4-hydrogen';
const FALLBACK_TEXT_MODEL = 'gemini-3.1-flash-lite';
const PRIMARY_TTS_MODEL = 'gemini-3.8-flash-lite-tts';
const FALLBACK_TTS_MODEL = 'gemini-3.8-flash-tts';

async function generateWithFallback(
  ai: GoogleGenAI,
  params: Omit<Parameters<GoogleGenAI['models']['generateContent']>[0], 'model'>
) {
  try {
    return await ai.models.generateContent({
      model: MODEL_NAME,
      ...params,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const isTransient = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('429');
    if (!isTransient) throw err;
    console.warn(`Primary model (${MODEL_NAME}) unavailable, falling back to ${FALLBACK_TEXT_MODEL}`);
    return await ai.models.generateContent({
      model: FALLBACK_TEXT_MODEL,
      ...params,
    });
  }
}

function getGeminiClient(apiVersion?: string): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    ...(apiVersion ? { apiVersion } : {}),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

const LANGUAGE_META: Record<
  string,
  {
    name: string;
    scriptName: string;
    examples: string;
    amountExample: string;
    awarenessNote: string;
  }
> = {
  kn: {
    name: 'Kannada',
    scriptName: 'Kannada (ಕನ್ನಡ)',
    examples: 'UPI → ಯುಪಿಐ, OTP → ಒಟಿಪಿ, KYC → ಕೆವೈಸಿ, EMI → ಇಎಂಐ, SBI → ಎಸ್ಬಿಐ, ATM → ಎಟಿಎಂ, PM-KISAN → ಪಿಎಂ ಕಿಸಾನ್, SMS → ಎಸ್ಎಂಎಸ್, QR → ಕ್ಯೂಆರ್, PIN → ಪಿನ್',
    amountExample: '₹500 → ಐನೂರು ರೂಪಾಯಿ, ₹700 → ಏಳು ನೂರು ರೂಪಾಯಿ, ₹2000 → ಎರಡು ಸಾವಿರ ರೂಪಾಯಿ',
    awarenessNote: 'ಇದು ಕೇವಲ ಆರ್ಥಿಕ ಜಾಗೃತಿ ಮಾತ್ರ, ಕಾನೂನು ಸಲಹೆಯಲ್ಲ.',
  },
  te: {
    name: 'Telugu',
    scriptName: 'Telugu (తెలుగు)',
    examples: 'UPI → యూపీఐ, OTP → ఓటీపీ, KYC → కేవైసీ, EMI → ఈఎంఐ, SBI → ఎస్బీఐ, ATM → ఏటీఎం, PM-KISAN → పీఎం కిసాన్, SMS → ఎస్ఎంఎస్, QR → క్యూఆర్, PIN → పిన్',
    amountExample: '₹500 → ఐదు వందల రూపాయలు, ₹700 → ఏడు వందల రూపాయలు, ₹2000 → రెండు వేల రూపాయలు',
    awarenessNote: 'ఇది కేవలం ఆర్థిక అవగాహన మాత్రమే, న్యాయ సలహా కాదు.',
  },
  hi: {
    name: 'Hindi',
    scriptName: 'Hindi (हिंदी)',
    examples: 'UPI → यूपीआई, OTP → ओटीपी, KYC → केवाईसी, EMI → ईएमआई, SBI → एसबीआई, ATM → एटीएम, PM-KISAN → पीएम किसान, SMS → एसएमएस, QR → क्यूआर, PIN → पिन',
    amountExample: '₹500 → पांच सौ रुपये, ₹700 → सात सौ रुपये, ₹2000 → दो हजार रुपये',
    awarenessNote: 'यह केवल वित्तीय जागरूकता है, कानूनी सलाह नहीं है।',
  },
  mr: {
    name: 'Marathi',
    scriptName: 'Marathi (मराठी)',
    examples: 'UPI → यूपीआय, OTP → ओटीपी, KYC → केवायसी, EMI → ईएमआय, SBI → एसबीआय, ATM → एटीएम, PM-KISAN → पीएम किसान, SMS → एसएमएस, QR → क्यूआर, PIN → पिन',
    amountExample: '₹500 → पाचशे रुपये, ₹700 → सातशे रुपये, ₹2000 → दोन हजार रुपये',
    awarenessNote: 'ही केवळ आर्थिक जनजागृती आहे, कायदेशीर सल्ला नाही.',
  },
  ta: {
    name: 'Tamil',
    scriptName: 'Tamil (தமிழ்)',
    examples: 'UPI → யூபிஐ, OTP → ஓடிபி, KYC → கேஒய்சி, EMI → இஎம்ஐ, SBI → எஸ்பிஐ, ATM → ஏடிஎம், PM-KISAN → பிஎம் கிசான், SMS → எஸ்எம்எஸ், QR → க்யூஆர், PIN → பின்',
    amountExample: '₹500 → ஐந்நூறு ரூபாய், ₹700 → எழுநூறு ரூபாய், ₹2000 → இரண்டாயிரம் ரூபாய்',
    awarenessNote: 'இது நிதி விழிப்புணர்வு மட்டுமே, சட்ட ஆலோசனை அல்ல.',
  },
  en: {
    name: 'English',
    scriptName: 'English',
    examples: 'Use simple everyday English words.',
    amountExample: '₹500 → five hundred rupees',
    awarenessNote: 'This is awareness, not legal advice.',
  },
};

function buildStrictLanguageDirective(language: string): string {
  const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
  if (language === 'en') {
    return (
      `Reply ONLY in simple English. ` +
      `Write amounts in simple spoken words with rupees (${meta.amountExample}). ` +
      `Use very simple spoken-style sentences. No markdown, asterisks, emojis, or bullet symbols.`
    );
  }
  return (
    `Reply ONLY in ${meta.scriptName} script. ` +
    `Do not use English words or the Latin alphabet anywhere in your reply. ` +
    `Write English terms in the ${meta.name} script (${meta.examples}). ` +
    `Write all numbers and amounts in words with the local word for rupees (${meta.amountExample}). ` +
    `Use very simple spoken-style sentences. ` +
    `No markdown, asterisks, emojis, or bullet symbols.`
  );
}

function cleanModelText(text: string): string {
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/^#+\s*/gm, '')
    .replace(/^[•▪●\-–—]\s+/gm, '')
    .replace(/`/g, '')
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function wrapPcmAsWav(pcmBuffer: Buffer, sampleRate = 24000, channels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);
  header.write('RIFF', 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // PCM chunk size
  header.writeUInt16LE(1, 20); // AudioFormat = 1 (PCM)
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]);
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  // A. Scam Checker endpoint
  app.post('/api/ai/scam-check', async (req, res) => {
    try {
      const { message, language = 'en' } = req.body as {
        message?: string;
        language?: string;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Please paste a message or link to check.' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API key is not configured yet. Please check Settings > Secrets.',
        });
        return;
      }

      const langDirective = buildStrictLanguageDirective(language);

      const response = await generateWithFallback(ai, {
        contents: `Analyze this SMS / WhatsApp message or link for financial scam risk:\n\n"""${message.trim()}"""`,
        config: {
          systemInstruction:
            `You are a rural Indian cyber-safety and financial fraud detector protecting farmers, senior citizens, and women's self-help group members. ` +
            `Classify the message strictly as one of: "SAFE", "SUSPICIOUS", or "SCAM" in the JSON verdict field. ` +
            `For the "reasons" (3 short reasons) and "advice" fields: ${langDirective} ` +
            `Mention calling nineteen thirty (or 1930 in target script words) if SCAM or SUSPICIOUS. ` +
            `Remember: banks never ask for UPI PIN, OTP, Aadhaar OTP, or KYC via unknown WhatsApp/SMS links; receiving money NEVER requires entering a UPI PIN.`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              verdict: {
                type: Type.STRING,
                description: 'Must be exactly SAFE, SUSPICIOUS, or SCAM',
              },
              reasons: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Exactly 3 short simple spoken-style reasons strictly in the target language script',
              },
              advice: {
                type: Type.STRING,
                description: 'One simple, actionable step strictly in the target language script',
              },
            },
            required: ['verdict', 'reasons', 'advice'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Empty response received from AI service.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      const normalizedVerdict = ['SAFE', 'SUSPICIOUS', 'SCAM'].includes(
        String(parsed.verdict).toUpperCase()
      )
        ? String(parsed.verdict).toUpperCase()
        : 'SUSPICIOUS';

      res.json({
        verdict: normalizedVerdict,
        reasons: Array.isArray(parsed.reasons)
          ? parsed.reasons.slice(0, 3).map((r: unknown) => cleanModelText(String(r || '')))
          : [],
        advice: cleanModelText(String(parsed.advice || '')),
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze message.';
      console.error('Scam check error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  // B. AI Financial Assistant ("Finvora Sahayak") endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const {
        message,
        history = [],
        language = 'en',
        userContext,
      } = req.body as {
        message?: string;
        history?: Array<{ role: 'user' | 'assistant'; text: string }>;
        language?: string;
        userContext?: string;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Please type or speak a question.' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API key is not configured yet. Please check Settings > Secrets.',
        });
        return;
      }

      const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
      const langDirective = buildStrictLanguageDirective(language);

      const systemInstruction =
        `You are Finvora's friendly assistant for rural Indian users. ` +
        `Answer in very simple words and short numbered steps (using ${meta.name} words or numbers without markdown/asterisks/bullets). ` +
        `Cover savings, loans, insurance, UPI, government schemes and scams only. ` +
        `If the user asks about unrelated topics, politely guide them back to these money and safety topics. ` +
        `Never ask for PINs, OTPs or Aadhaar numbers. ` +
        `STRICT LANGUAGE RULE: ${langDirective} ` +
        `End with this exact note in ${meta.scriptName}: "${meta.awarenessNote}"` +
        (userContext ? `\nUser context (translate any values into ${meta.scriptName} words if mentioned): ${userContext}` : '');

      const historyText = history
        .slice(-6)
        .map((h) => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.text}`)
        .join('\n');

      const prompt = historyText
        ? `Previous conversation:\n${historyText}\n\nCurrent question: ${message.trim()}`
        : message.trim();

      const response = await generateWithFallback(ai, {
        contents: prompt,
        config: {
          systemInstruction,
        },
      });

      const reply = cleanModelText(response.text ?? '');
      if (!reply) {
        res.status(502).json({ error: 'No response generated. Please try again.' });
        return;
      }

      res.json({ reply });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Assistant could not reply.';
      console.error('AI chat error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  // C. Smart Savings Suggestion endpoint
  app.post('/api/ai/savings-tip', async (req, res) => {
    try {
      const {
        income = 24000,
        expenses = 15800,
        goals = [],
        language = 'en',
      } = req.body as {
        income?: number;
        expenses?: number;
        goals?: Array<{ title: string; target: number; saved: number }>;
        language?: string;
      };

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API key is not configured yet.',
        });
        return;
      }

      const langDirective = buildStrictLanguageDirective(language);
      const goalsSummary = goals
        .map((g) => `${g.title}: saved ${g.saved} of ${g.target} rupees`)
        .join('; ');

      const response = await generateWithFallback(ai, {
        contents:
          `User Monthly Income: ${income} rupees. Monthly Expenses: ${expenses} rupees. Monthly Surplus: ${Math.max(0, income - expenses)} rupees. ` +
          `Savings Goals: ${goalsSummary || 'Water Pump 15000 rupees'}. ` +
          `Give ONE short, warm, encouraging 1-sentence savings suggestion with an exact amount per month and timeline. Return only that single sentence.`,
        config: {
          systemInstruction:
            `You are a rural Indian financial coach. Respond with exactly one short practical sentence. ${langDirective}`,
        },
      });

      const tip = cleanModelText(response.text ?? '');
      if (!tip) {
        res.status(502).json({ error: 'Could not generate savings tip.' });
        return;
      }

      res.json({ tip });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get savings tip.';
      console.error('Savings tip error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  // D. Gemini Text-to-Speech (TTS) endpoint for native Kannada / Telugu / Hindi / Marathi / Tamil / English audio
  app.post('/api/ai/tts', async (req, res) => {
    try {
      const { text, language = 'en' } = req.body as {
        text?: string;
        language?: string;
      };

      const cleaned = cleanModelText(text || '');
      if (!cleaned) {
        res.status(400).json({ error: 'No text provided for speech.' });
        return;
      }

      const ai = getGeminiClient('v1beta');
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API key is not configured yet.',
        });
        return;
      }

      const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
      const truncated = cleaned.slice(0, 1200);

      let response;
      let usedModel = PRIMARY_TTS_MODEL;

      const generateTts = async (modelId: string) => {
        return ai.models.generateContent({
          model: modelId,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: truncated,
                  speechMetadata: {
                    style: `Warm, slow, clear ${meta.name} voice for a rural elder`,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: 'Kore' },
              },
            },
          },
        });
      };

      try {
        response = await generateTts(PRIMARY_TTS_MODEL);
      } catch (primaryErr) {
        console.warn(`Primary TTS model (${PRIMARY_TTS_MODEL}) failed, falling back to ${FALLBACK_TTS_MODEL}:`, primaryErr);
        usedModel = FALLBACK_TTS_MODEL;
        response = await generateTts(FALLBACK_TTS_MODEL);
      }

      const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
      const base64Audio = inlineData?.data;
      const mimeType = inlineData?.mimeType || 'audio/wav';

      if (!base64Audio) {
        res.status(502).json({ error: 'No audio generated from Gemini TTS.' });
        return;
      }

      const rawBuffer = Buffer.from(base64Audio, 'base64');
      const isRiffWav =
        rawBuffer.length >= 12 &&
        rawBuffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
        rawBuffer.subarray(8, 12).toString('ascii') === 'WAVE';

      const wavBuffer = isRiffWav ? rawBuffer : wrapPcmAsWav(rawBuffer, 24000, 1, 16);

      res.json({
        audioBase64: wavBuffer.toString('base64'),
        mimeType: 'audio/wav',
        sourceMimeType: mimeType,
        model: usedModel,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'TTS generation failed.';
      console.error('Gemini TTS error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  // E. Gemini Audio Transcription endpoint for universal microphone support
  app.post('/api/ai/transcribe', async (req, res) => {
    try {
      const {
        audioBase64,
        mimeType = 'audio/webm',
        language = 'en',
      } = req.body as {
        audioBase64?: string;
        mimeType?: string;
        language?: string;
      };

      if (!audioBase64) {
        res.status(400).json({ error: 'No audio data received.' });
        return;
      }

      const ai = getGeminiClient();
      if (!ai) {
        res.status(503).json({
          error: 'Gemini API key is not configured yet.',
        });
        return;
      }

      const meta = LANGUAGE_META[language] || LANGUAGE_META.en;
      const cleanMime = mimeType.split(';')[0].trim() || 'audio/webm';

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanMime,
                data: audioBase64,
              },
            },
            {
              text:
                language === 'en'
                  ? 'Transcribe the spoken audio accurately into plain English text. Return ONLY the transcribed words, nothing else.'
                  : `Transcribe the spoken audio accurately ONLY in ${meta.scriptName} script. Do not translate to English and do not use Latin letters. Return ONLY the transcribed words.`,
            },
          ],
        },
      });

      const transcript = cleanModelText(response.text ?? '');
      if (!transcript) {
        res.status(422).json({ error: 'Could not detect speech in audio.' });
        return;
      }

      res.json({ transcript });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Audio transcription failed.';
      console.error('Transcribe error:', errorMessage);
      res.status(500).json({ error: errorMessage });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const viteReady = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: {
          middlewareMode: true,
          hmr: process.env.DISABLE_HMR !== 'true',
        },
        appType: 'spa',
      })
    );
    app.use(async (req, res, next) => {
      try {
        const vite = await viteReady;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FINVORA server running at http://localhost:${PORT}`);
  });
}

startServer();
