import React, { useState } from 'react';
import type { WishData } from '../types/wish';
import CanvasEffects from './CanvasEffects';
import EnvelopeCover from './EnvelopeCover';
import GiftBoxCover from './GiftBoxCover';
import synth from '../utils/audioSynth';

interface WishViewerProps {
  wish: WishData;
}

export const WishViewer: React.FC<WishViewerProps> = ({ wish }) => {
  const [isOpened, setIsOpened] = useState(wish.cover === 'none');

  const handleOpen = () => {
    setIsOpened(true);
  };

  const handleReplayAudio = () => {
    synth.playThemeSound(wish.theme);
  };

  const handleCreateOwn = () => {
    // Navigate back to the creator (clearing URL parameters)
    window.location.href = window.location.origin + window.location.pathname;
  };

  const getThemeClass = (themeName: string) => {
    switch (themeName) {
      case 'birthday': return 'theme-birthday';
      case 'love': return 'theme-love';
      case 'celebration': return 'theme-celebration';
      case 'thanks': return 'theme-thanks';
      case 'apology': return 'theme-apology';
      default: return 'theme-classic';
    }
  };

  return (
    <div 
      className={`viewer-container ${getThemeClass(wish.theme)}`}
      style={{
        backgroundImage: `url('/image/swati%20image.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundBlendMode: 'overlay'
      }}
    >
      {/* Background visual effects */}
      {isOpened && wish.effect !== 'none' && (
        <CanvasEffects effect={wish.effect} />
      )}

      <div className="viewer-content">
        {!isOpened ? (
          <div className="opening-stage">
            {wish.cover === 'envelope' && (
              <EnvelopeCover
                to={wish.to}
                from={wish.from}
                theme={wish.theme}
                onOpen={handleOpen}
              />
            )}
            {wish.cover === 'giftbox' && (
              <GiftBoxCover
                to={wish.to}
                from={wish.from}
                theme={wish.theme}
                onOpen={handleOpen}
              />
            )}
          </div>
        ) : (
          <div className="card-stage animate-fade-in-up">
            <div className={`wish-card glass-card viewer-card ${wish.font}`}>
              <div className="wish-decorations">
                <span className="decor-corner top-left">✨</span>
                <span className="decor-corner top-right">✨</span>
              </div>

              <div className="card-header">
                <p className="to-label">Dearest</p>
                <h2 className="to-name">{wish.to || 'You'}</h2>
              </div>

              <div className="card-body">
                <p className="wish-message">{wish.message}</p>
              </div>

              <div className="card-footer">
                <p className="from-label">With love from,</p>
                <p className="from-name">{wish.from || 'Someone'}</p>
              </div>
            </div>

            <div className="viewer-actions-row">
              <button
                type="button"
                className="action-button secondary-btn audio-btn"
                onClick={handleReplayAudio}
                title="Replay sound effect"
              >
                🎵 Play Sound Again
              </button>
              <button
                type="button"
                className="action-button primary-btn create-own-btn"
                onClick={handleCreateOwn}
              >
                🎁 Create Your Own Surprise
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishViewer;
