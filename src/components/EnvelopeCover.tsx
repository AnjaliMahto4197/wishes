import React, { useState } from 'react';
import synth from '../utils/audioSynth';
import type { WishTheme } from '../types/wish';

interface EnvelopeCoverProps {
  to: string;
  from: string;
  theme: WishTheme;
  onOpen: () => void;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({ to, from, theme, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);
  const [isFlapOpen, setIsFlapOpen] = useState(false);
  const [isLetterUp, setIsLetterUp] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play sound
    synth.playThemeSound(theme);

    // 2. Open Flap
    setTimeout(() => {
      setIsFlapOpen(true);
    }, 100);

    // 3. Slide letter up
    setTimeout(() => {
      setIsLetterUp(true);
    }, 700);

    // 4. Complete open
    setTimeout(() => {
      onOpen();
    }, 1500);
  };

  return (
    <div className={`envelope-container ${isOpening ? 'is-active' : ''}`} onClick={handleOpen}>
      <div className={`envelope ${isFlapOpen ? 'flap-open' : ''} ${isLetterUp ? 'letter-up' : ''}`}>
        {/* Envelope Top Flap */}
        <div className="envelope-flap"></div>

        {/* The Pocket Base */}
        <div className="envelope-pocket"></div>

        {/* Letter Inside */}
        <div className="envelope-letter">
          <div className="envelope-letter-content">
            <span className="heart-icon">✉</span>
            <h3>A Special Message</h3>
            <div className="meta-lines">
              <p><strong>To:</strong> {to || 'Dear Friend'}</p>
              <p><strong>From:</strong> {from || 'Someone who cares'}</p>
            </div>
            <div className="open-tap-prompt">Click to reveal your surprise!</div>
          </div>
        </div>

        {/* Wax Seal */}
        <div className="envelope-seal-wrapper">
          <div className="envelope-seal">
            <div className="seal-inner">❤</div>
          </div>
          <span className="pulse-ring"></span>
        </div>
      </div>
      
      <div className="opener-hint">
        <p className="hint-to">Surprise for {to || 'You'}!</p>
        <span className="hint-sub">Click the wax seal to open</span>
      </div>
    </div>
  );
};

export default EnvelopeCover;
