import React, { useState } from 'react';
import synth from '../utils/audioSynth';
import type { WishTheme } from '../types/wish';

interface GiftBoxCoverProps {
  to: string;
  from: string;
  theme: WishTheme;
  onOpen: () => void;
}

export const GiftBoxCover: React.FC<GiftBoxCoverProps> = ({ to, from, theme, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    // 1. Play sound
    synth.playThemeSound(theme);

    // 2. Complete open
    setTimeout(() => {
      onOpen();
    }, 1200);
  };

  return (
    <div className={`gift-container ${isOpening ? 'is-opening' : ''}`} onClick={handleOpen}>
      <div className="gift-box">
        {/* Lid of the gift box */}
        <div className="gift-lid">
          <div className="gift-bow">
            <div className="bow-loop bow-left"></div>
            <div className="bow-loop bow-right"></div>
            <div className="bow-center"></div>
          </div>
          <div className="lid-strap-h"></div>
        </div>

        {/* Strap ribbons on box */}
        <div className="gift-strap-v"></div>
        <div className="gift-strap-h"></div>

        {/* Card peeking out */}
        <div className="gift-card-peek">
          <span>🎁</span>
        </div>

        {/* Box Base */}
        <div className="gift-box-base"></div>
      </div>

      <div className="opener-hint">
        <p className="hint-to">A Gift for {to || 'You'}!</p>
        {from && <p style={{ fontSize: '13px', margin: '2px 0 8px 0', opacity: 0.85, color: '#94a3b8' }}>From: {from}</p>}
        <span className="hint-sub">Click the gift box to unwrap</span>
      </div>
    </div>
  );
};

export default GiftBoxCover;
