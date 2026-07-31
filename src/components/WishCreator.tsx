import React, { useState, useEffect } from 'react';
import type { WishData, WishTheme, WishEffect, WishCover, WishFont } from '../types/wish';
import { encodeWish } from '../utils/urlEncoder';
import CanvasEffects from './CanvasEffects';
import EnvelopeCover from './EnvelopeCover';
import GiftBoxCover from './GiftBoxCover';

export const WishCreator: React.FC = () => {
  const [wish, setWish] = useState<WishData>({
    to: '',
    from: '',
    message: '',
    theme: 'birthday',
    effect: 'confetti',
    cover: 'envelope',
    font: 'cursive',
  });

  const [previewMode, setPreviewMode] = useState<'cover' | 'card' | 'interactive'>('card');
  const [resetKey, setResetKey] = useState(0); // to reset the interactive view
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Generate URL in real-time or when button is clicked
  const handleGenerate = () => {
    const encoded = encodeWish(wish);
    const url = `${window.location.origin}${window.location.pathname}?w=${encoded}`;
    setGeneratedUrl(url);
    setShowShareModal(true);
    setIsCopied(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(generatedUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }).catch(err => {
      console.error('Failed to copy', err);
    });
  };

  // Reset interactive preview
  const handleResetPreview = () => {
    setResetKey(prev => prev + 1);
  };

  // Keep previewMode synced when cover type changes
  useEffect(() => {
    if (wish.cover === 'none' && previewMode === 'cover') {
      setPreviewMode('card');
    }
  }, [wish.cover, previewMode]);

  const themes: { id: WishTheme; name: string; gradient: string; previewColor: string }[] = [
    { id: 'birthday', name: '🎉 Birthday', gradient: 'theme-birthday', previewColor: '#8a2be2' },
    { id: 'love', name: '💖 Romance', gradient: 'theme-love', previewColor: '#e11d48' },
    { id: 'celebration', name: '✨ Celebrate', gradient: 'theme-celebration', previewColor: '#eab308' },
    { id: 'thanks', name: '🌿 Gratitude', gradient: 'theme-thanks', previewColor: '#81b29a' },
    { id: 'apology', name: '☁ Apology', gradient: 'theme-apology', previewColor: '#475569' },
    { id: 'classic', name: '🤍 Classic', gradient: 'theme-classic', previewColor: '#a1a1aa' },
  ];

  const effects: { id: WishEffect; name: string }[] = [
    { id: 'none', name: '🚫 None' },
    { id: 'confetti', name: '🎊 Confetti' },
    { id: 'hearts', name: '💕 Hearts' },
    { id: 'fireworks', name: '🎆 Fireworks' },
    { id: 'leaves', name: '🍂 Leaves' },
    { id: 'sparkles', name: '⭐ Sparkles' },
  ];

  const covers: { id: WishCover; name: string }[] = [
    { id: 'envelope', name: '✉ Envelope' },
    { id: 'giftbox', name: '🎁 Gift Box' },
    { id: 'none', name: '🔓 Direct Card' },
  ];

  const fonts: { id: WishFont; name: string; style: string }[] = [
    { id: 'sans', name: 'Outfit (Modern)', style: 'font-sans' },
    { id: 'serif', name: 'Playfair (Classic)', style: 'font-serif' },
    { id: 'cursive', name: 'Caveat (Handwritten)', style: 'font-cursive' },
    { id: 'elegant', name: 'Cinzel (Elegant)', style: 'font-elegant' },
    { id: 'playful', name: 'Fredoka (Playful)', style: 'font-playful' },
  ];

  return (
    <div className="creator-layout">
      {/* Sidebar Editor */}
      <aside className="editor-panel">
        <header className="editor-header">
          <div className="logo-badge">🎁 Surprise Wishes</div>
          <h1>Design a Surprise</h1>
          <p>Create a beautiful digital card that unfolds with animations and music. Send the magic link instantly!</p>
        </header>

        <div className="editor-form">
          <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="wish-to">Recipient Name</label>
              <input
                id="wish-to"
                type="text"
                placeholder="e.g. Alex"
                value={wish.to}
                onChange={(e) => setWish({ ...wish, to: e.target.value })}
                maxLength={30}
              />
            </div>
            <div className="form-group">
              <label htmlFor="wish-from">Your Name</label>
              <input
                id="wish-from"
                type="text"
                placeholder="e.g. Jordan"
                value={wish.from}
                onChange={(e) => setWish({ ...wish, from: e.target.value })}
                maxLength={30}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="wish-msg">Surprise Message</label>
            <textarea
              id="wish-msg"
              placeholder="Write a sweet birthday wish, a thank you note, or a loving message..."
              value={wish.message}
              onChange={(e) => setWish({ ...wish, message: e.target.value })}
              maxLength={600}
              rows={4}
            />
            <span className="char-counter">{wish.message.length}/600 characters</span>
          </div>

          <div className="form-group">
            <label>Select Theme</label>
            <div className="grid-selector themes-grid">
              {themes.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`grid-card theme-card ${wish.theme === t.id ? 'active' : ''}`}
                  onClick={() => setWish({ ...wish, theme: t.id })}
                >
                  <span className="theme-color-dot" style={{ backgroundColor: t.previewColor }} />
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group-row">
            <div className="form-group">
              <label>Opening Cover</label>
              <div className="grid-selector compact">
                {covers.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={`grid-card compact-card ${wish.cover === c.id ? 'active' : ''}`}
                    onClick={() => setWish({ ...wish, cover: c.id })}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Visual Effect</label>
              <div className="grid-selector compact">
                {effects.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    className={`grid-card compact-card ${wish.effect === e.id ? 'active' : ''}`}
                    onClick={() => setWish({ ...wish, effect: e.id })}
                  >
                    {e.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Text Typography (Font)</label>
            <div className="grid-selector fonts-grid">
              {fonts.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  className={`grid-card font-card ${f.style} ${wish.font === f.id ? 'active' : ''}`}
                  onClick={() => setWish({ ...wish, font: f.id })}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="action-button primary-btn build-btn" onClick={handleGenerate}>
            ✨ Generate Surprise Link
          </button>
        </div>
      </aside>

      {/* Real-time Preview Area */}
      <main className="preview-panel">
        <div className="preview-toolbar">
          <span className="preview-label">Live Preview</span>
          <div className="toggle-group">
            {wish.cover !== 'none' && (
              <button
                type="button"
                className={`toggle-btn ${previewMode === 'cover' ? 'active' : ''}`}
                onClick={() => setPreviewMode('cover')}
              >
                Cover
              </button>
            )}
            <button
              type="button"
              className={`toggle-btn ${previewMode === 'card' ? 'active' : ''}`}
              onClick={() => setPreviewMode('card')}
            >
              Opened Card
            </button>
            {wish.cover !== 'none' && (
              <button
                type="button"
                className={`toggle-btn ${previewMode === 'interactive' ? 'active' : ''}`}
                onClick={() => {
                  setPreviewMode('interactive');
                  handleResetPreview();
                }}
              >
                Full Reveal Flow 🔄
              </button>
            )}
          </div>
        </div>

        {/* The Preview Frame */}
        <div className={`preview-viewport ${themes.find(t => t.id === wish.theme)?.gradient}`}>
          {/* Static Canvas Effect if previewing Card */}
          {(previewMode === 'card' || previewMode === 'interactive') && wish.effect !== 'none' && (
            <CanvasEffects effect={wish.effect} />
          )}

          <div className="viewport-inner" key={resetKey}>
            {previewMode === 'cover' && (
              <div className="preview-cover-centered">
                {wish.cover === 'envelope' && (
                  <EnvelopeCover
                    to={wish.to}
                    from={wish.from}
                    theme={wish.theme}
                    onOpen={() => setPreviewMode('card')}
                  />
                )}
                {wish.cover === 'giftbox' && (
                  <GiftBoxCover
                    to={wish.to}
                    from={wish.from}
                    theme={wish.theme}
                    onOpen={() => setPreviewMode('card')}
                  />
                )}
              </div>
            )}

            {previewMode === 'card' && (
              <div className="wish-card-outer">
                <div className={`wish-card glass-card ${wish.font}`}>
                  <div className="wish-decorations">
                    <span className="decor-corner top-left">✨</span>
                    <span className="decor-corner top-right">✨</span>
                  </div>
                  
                  <div className="card-header">
                    <p className="to-label">Dearest</p>
                    <h2 className="to-name">{wish.to || 'Your Name'}</h2>
                  </div>

                  <div className="card-body">
                    <p className="wish-message">
                      {wish.message || 'Write something magical. Your surprise message will display here in real-time, matching your selected theme and styling.'}
                    </p>
                  </div>

                  <div className="card-footer">
                    <p className="from-label">With love from,</p>
                    <p className="from-name">{wish.from || 'Your Name'}</p>
                  </div>
                </div>
              </div>
            )}

            {previewMode === 'interactive' && (
              <div className="preview-cover-centered">
                {wish.cover === 'envelope' && (
                  <EnvelopeCover
                    to={wish.to}
                    from={wish.from}
                    theme={wish.theme}
                    onOpen={() => setPreviewMode('card')}
                  />
                )}
                {wish.cover === 'giftbox' && (
                  <GiftBoxCover
                    to={wish.to}
                    from={wish.from}
                    theme={wish.theme}
                    onOpen={() => setPreviewMode('card')}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="modal-overlay" onClick={() => setShowShareModal(false)}>
          <div className="share-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="close-modal-btn" onClick={() => setShowShareModal(false)}>
              ×
            </button>
            <h2>🎉 Surprise Created!</h2>
            <p>Your special link is ready. Send it to <strong>{wish.to || 'your recipient'}</strong> to reveal the surprise!</p>

            <div className="link-box-container">
              <input type="text" readOnly value={generatedUrl} className="share-link-input" />
              <button type="button" className={`action-button copy-btn ${isCopied ? 'success' : ''}`} onClick={handleCopyLink}>
                {isCopied ? '✓ Copied!' : 'Copy Link'}
              </button>
            </div>

            <div className="test-link-container" style={{ marginBottom: '24px' }}>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="test-link"
                style={{
                  color: '#c084fc',
                  textDecoration: 'underline',
                  fontWeight: 600,
                  fontSize: '14.5px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'color 0.2s',
                }}
              >
                👉 Click here to test your surprise link in a new tab
              </a>
            </div>

            <div className="share-shortcuts">
              <span className="share-label">Quick Share:</span>
              <div className="share-buttons-row">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                    `✨ I created a magical surprise wish for you! Tap to open it: \n\n${generatedUrl}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn whatsapp"
                >
                  🟢 WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(generatedUrl)}&text=${encodeURIComponent(
                    `I created a special surprise wish for you! Open it here:`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="share-btn telegram"
                >
                  🔵 Telegram
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    `A special surprise for you!`
                  )}&body=${encodeURIComponent(
                    `Hi!\n\nI have created a special surprise wish for you. Open the link below to unlock it:\n\n${generatedUrl}\n\nEnjoy!`
                  )}`}
                  className="share-btn email"
                >
                  ✉ Email
                </a>
              </div>
            </div>

            <button type="button" className="action-button secondary-btn close-btn" onClick={() => setShowShareModal(false)}>
              Back to Editor
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishCreator;
