import { useState, useEffect, useRef, useCallback } from 'react';
import { getLangLocale } from './useSpeechRecognition';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState([]);
  const [isSupported, setIsSupported] = useState(false);
  const [activeUtteranceId, setActiveUtteranceId] = useState(null);

  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const available = window.speechSynthesis.getVoices();
        setVoices(available);
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;

      return () => {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      };
    } else {
      setIsSupported(false);
    }
  }, []);

  // Find the most suitable voice for given language
  const findVoiceForLang = useCallback((langCode) => {
    if (!voices || voices.length === 0) return null;
    const targetLocale = getLangLocale(langCode).toLowerCase();
    const prefix = targetLocale.split('-')[0];

    // 1. Exact match on BCP47 (e.g. te-IN or hi-IN)
    let found = voices.find(v => v.lang.toLowerCase() === targetLocale);
    if (found) return found;

    // 2. Prefix match (e.g. te, hi, en)
    found = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    if (found) return found;

    // 3. Name match for Telugu / Hindi
    if (langCode === 'te') {
      found = voices.find(v => v.name.toLowerCase().includes('telugu'));
      if (found) return found;
    }
    if (langCode === 'hi') {
      found = voices.find(v => v.name.toLowerCase().includes('hindi'));
      if (found) return found;
    }

    // Default fallback
    return voices.find(v => v.default) || voices[0] || null;
  }, [voices]);

  const speak = useCallback((text, langCode = 'en', utteranceId = null) => {
    if (!isSupported || !text) return;

    try {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech first

      const utterance = new SpeechSynthesisUtterance(text);
      const voice = findVoiceForLang(langCode);
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = getLangLocale(langCode);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
        setActiveUtteranceId(utteranceId);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveUtteranceId(null);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        setIsSpeaking(false);
        setIsPaused(false);
        setActiveUtteranceId(null);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Error during speech synthesis:', err);
      setIsSpeaking(false);
    }
  }, [isSupported, findVoiceForLang]);

  const stop = useCallback(() => {
    if (isSupported) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
      setIsSpeaking(false);
      setIsPaused(false);
      setActiveUtteranceId(null);
    }
  }, [isSupported]);

  const pause = useCallback(() => {
    if (isSupported && isSpeaking) {
      try {
        window.speechSynthesis.pause();
        setIsPaused(true);
      } catch {
        // ignore
      }
    }
  }, [isSupported, isSpeaking]);

  const resume = useCallback(() => {
    if (isSupported && isPaused) {
      try {
        window.speechSynthesis.resume();
        setIsPaused(false);
      } catch {
        // ignore
      }
    }
  }, [isSupported, isPaused]);

  return {
    isSupported,
    isSpeaking,
    isPaused,
    activeUtteranceId,
    voices,
    speak,
    stop,
    pause,
    resume,
  };
};
