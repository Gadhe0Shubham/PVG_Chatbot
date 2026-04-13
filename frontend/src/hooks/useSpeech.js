import { useState, useRef, useCallback } from 'react';

// Custom hook for speech recognition
export const useSpeechRecognition = ({ onResult }) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  const listen = useCallback(() => {
    if (!supported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onstart = () => {
      setListening(true);
    };

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognitionRef.current.onend = () => {
      setListening(false);
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setListening(false);
    };

    recognitionRef.current.start();
  }, [onResult, supported]);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    listen,
    listening,
    stop,
    supported
  };
};

// Custom hook for speech synthesis
export const useSpeechSynthesis = () => {
  const speak = useCallback(({ text, voice = null, rate = 1, pitch = 1, volume = 1 }) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error);
    };

    window.speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const getVoices = useCallback(() => {
    if ('speechSynthesis' in window) {
      return window.speechSynthesis.getVoices();
    }
    return [];
  }, []);

  return {
    speak,
    cancel,
    getVoices,
    supported: 'speechSynthesis' in window
  };
};