import { useState, useEffect, useRef, useCallback } from 'react';

// Maps language code to BCP 47 recognition language
export const getLangLocale = (code) => {
  switch (code) {
    case 'te':
      return 'te-IN'; // Telugu (India)
    case 'hi':
      return 'hi-IN'; // Hindi (India)
    case 'en':
    default:
      return 'en-US'; // English (US)
  }
};

export const useSpeechRecognition = ({ onResult, language = 'en' } = {}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, []);

  // Update recognition language when target language changes
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = getLangLocale(language);
    }
  }, [language]);

  const startListening = useCallback(() => {
    setError(null);
    if (!recognitionRef.current) {
      setError('Speech recognition not available.');
      return;
    }

    try {
      const recognition = recognitionRef.current;
      recognition.lang = getLangLocale(language);

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let currentInterim = '';
        let finalTranscriptChunk = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const item = event.results[i];
          if (item.isFinal) {
            finalTranscriptChunk += item[0].transcript;
          } else {
            currentInterim += item[0].transcript;
          }
        }

        if (finalTranscriptChunk) {
          setTranscript((prev) => {
            const updated = prev ? `${prev} ${finalTranscriptChunk}` : finalTranscriptChunk;
            if (onResult) onResult(updated);
            return updated;
          });
        }
        setInterimTranscript(currentInterim);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error event:', event.error);
        if (event.error === 'not-allowed') {
          setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          // Normal timeout if user was quiet
        } else if (event.error === 'network') {
          setError('Network error occurred during speech recognition.');
        } else {
          setError(`Recognition error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        setInterimTranscript('');
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      // If already started, toggle off
      if (err.name === 'InvalidStateError') {
        recognitionRef.current.stop();
        setIsListening(false);
      } else {
        setError('Failed to activate microphone. Please try again.');
        setIsListening(false);
      }
    }
  }, [language, onResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
      setInterimTranscript('');
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
    setTranscript,
  };
};
