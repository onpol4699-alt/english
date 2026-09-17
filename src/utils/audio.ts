// Web Speech API and Web Audio API synthesizer for English learning and sound effects

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

type AudioStateListener = (isSpeaking: boolean, text?: string) => void;
const audioListeners = new Set<AudioStateListener>();

export function subscribeAudioState(listener: AudioStateListener): () => void {
  audioListeners.add(listener);
  return () => {
    audioListeners.delete(listener);
  };
}

function notifyAudioState(isSpeaking: boolean, text?: string) {
  audioListeners.forEach((fn) => {
    try {
      fn(isSpeaking, text);
    } catch {
      // ignore
    }
  });
}

/**
 * Stop any ongoing SpeechSynthesis playback immediately
 */
export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }
  notifyAudioState(false);
}

/**
 * Check if SpeechSynthesis is currently playing audio
 */
export function isSpeakingNow(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking;
}

export type VoiceGender = 'male' | 'female';

let currentVoiceGender: VoiceGender = 'female';

export function getVoiceGender(): VoiceGender {
  return currentVoiceGender;
}

export function setVoiceGender(gender: VoiceGender): void {
  currentVoiceGender = gender;
}

/**
 * Pronounce English text using native browser SpeechSynthesis.
 * Always cancels any existing audio queue before speaking new text.
 * Voice language is explicitly set to 'en-US' for crystal clear English pronunciation.
 * Supports filtering voices for Male or Female voices for US English.
 */
export function speakEnglish(
  text: string, 
  rate: number = 0.9, 
  gender?: VoiceGender
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      notifyAudioState(false);
      resolve();
      return;
    }

    try {
      // 1. Immediately cancel any queued or in-progress speech to prevent audio queues
      window.speechSynthesis.cancel();

      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      if (!text || !text.trim()) {
        notifyAudioState(false);
        resolve();
        return;
      }

      const activeGender = gender || currentVoiceGender;

      // 2. Create utterance with strict 'en-US' voice language
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = 'en-US';
      utterance.rate = Math.max(0.5, Math.min(2.0, rate));
      utterance.pitch = activeGender === 'male' ? 0.9 : 1.05;

      notifyAudioState(true, text);

      let isFinished = false;
      const handleFinish = () => {
        if (isFinished) return;
        isFinished = true;
        notifyAudioState(false);
        resolve();
      };

      utterance.onend = handleFinish;
      utterance.onerror = () => {
        handleFinish();
      };

      const selectVoiceAndSpeak = () => {
        try {
          // Double-check cancel before dispatching
          window.speechSynthesis.cancel();

          const voices = window.speechSynthesis.getVoices();
          
          // Filter en-US voices first, fallback to any English
          const usVoices = voices.filter(v => v.lang === 'en-US' || v.lang === 'en_US');
          const allEnVoices = usVoices.length > 0 ? usVoices : voices.filter(v => v.lang.toLowerCase().startsWith('en'));

          const maleKeywords = ['male', 'guy', 'david', 'george', 'daniel', 'alex', 'fred', 'tom', 'james', 'mark', 'john', 'aaron'];
          const femaleKeywords = ['female', 'girl', 'zira', 'samantha', 'karen', 'victoria', 'susan', 'jenny', 'linda', 'catherine', 'eva', 'serena'];

          let matchedVoice: SpeechSynthesisVoice | undefined;

          if (activeGender === 'male') {
            matchedVoice = allEnVoices.find(v => {
              const name = v.name.toLowerCase();
              return maleKeywords.some(k => name.includes(k)) && !femaleKeywords.some(fk => name.includes(fk));
            }) || allEnVoices.find(v => {
              const name = v.name.toLowerCase();
              return !femaleKeywords.some(fk => name.includes(fk));
            });
          } else {
            matchedVoice = allEnVoices.find(v => {
              const name = v.name.toLowerCase();
              return femaleKeywords.some(k => name.includes(k));
            }) || allEnVoices.find(v => {
              const name = v.name.toLowerCase();
              return !maleKeywords.some(mk => name.includes(mk));
            });
          }

          if (!matchedVoice && allEnVoices.length > 0) {
            matchedVoice = allEnVoices[0];
          }

          if (matchedVoice) {
            utterance.voice = matchedVoice;
          }

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          console.warn('Speech synthesis trigger error:', err);
          handleFinish();
        }
      };

      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length === 0 && 'onvoiceschanged' in window.speechSynthesis) {
        let voiceTimeoutId: number | null = null;
        const onVoicesReady = () => {
          if (voiceTimeoutId) clearTimeout(voiceTimeoutId);
          window.speechSynthesis.onvoiceschanged = null;
          selectVoiceAndSpeak();
        };

        window.speechSynthesis.onvoiceschanged = onVoicesReady;
        voiceTimeoutId = window.setTimeout(onVoicesReady, 100);
      } else {
        selectVoiceAndSpeak();
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      notifyAudioState(false);
      resolve();
    }
  });
}

/**
 * Play a cheerful, subtle synthesizer tone for correct answers
 */
export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Arpeggio: C5 (523.25Hz) -> E5 (659.25Hz) -> G5 (783.99Hz)
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.16);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch {
    // Graceful fallback if audio is blocked
  }
}

/**
 * Play a gentle low tone for incorrect answers (encouraging, not harsh)
 */
export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(240, now + 0.2);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  } catch {
    // Graceful fallback
  }
}

/**
 * Play a celebratory fanfare for quiz victory or level advancement
 */
export function playFanfareSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const startTime = ctx.currentTime + idx * 0.1;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.3);
    });
  } catch {
    // Graceful fallback
  }
}
