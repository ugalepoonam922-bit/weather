import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, Radio, Pause, Play } from 'lucide-react';
import { generateVoiceBriefingText } from '../services/weatherService';

export default function MausamVaaniVoice({ weather, cityName, persona, unit }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleToggleVoice = () => {
    if (!isSupported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel(); // Reset previous utterances
    const textToSpeak = generateVoiceBriefingText(weather, cityName, persona, unit);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Prefer Indian English or standard natural voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.includes('en-IN') || v.name.includes('India') || v.lang.startsWith('en')
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.rate = 1.0;
    utterance.pitch = 1.05;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <div className={`mausam-vaani-pill ${isPlaying ? 'is-speaking' : ''}`}>
      <button
        className="vaani-action-btn"
        onClick={handleToggleVoice}
        aria-label={isPlaying ? 'Stop Voice Briefing' : 'Listen to Mausam Vaani Voice Briefing'}
        title="Mausam Vaani AI Audio Briefing (MoES Text-to-Speech)"
      >
        <div className="vaani-icon-box">
          {isPlaying ? (
            <Radio size={16} className="text-amber pulse-anim" />
          ) : (
            <Volume2 size={16} className="text-primary" />
          )}
        </div>

        <div className="vaani-text-group">
          <span className="vaani-title">
            मौसम वाणी (Mausam Vaani)
            {isPlaying && <span className="live-audio-badge">SPEAKING</span>}
          </span>
          <span className="vaani-subtitle">
            {isPlaying ? 'Tap to pause audio bulletin' : 'Tap to listen to daily briefing'}
          </span>
        </div>

        <div className="vaani-waveform">
          <span className="wave-bar bar-1"></span>
          <span className="wave-bar bar-2"></span>
          <span className="wave-bar bar-3"></span>
          <span className="wave-bar bar-4"></span>
        </div>
      </button>
    </div>
  );
}
