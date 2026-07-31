export type WishTheme = 'birthday' | 'love' | 'celebration' | 'thanks' | 'apology' | 'classic';
export type WishEffect = 'none' | 'confetti' | 'hearts' | 'fireworks' | 'leaves' | 'sparkles';
export type WishCover = 'envelope' | 'giftbox' | 'none';
export type WishFont = 'sans' | 'serif' | 'cursive' | 'playful' | 'elegant';

export interface WishData {
  to: string;
  from: string;
  message: string;
  theme: WishTheme;
  effect: WishEffect;
  cover: WishCover;
  font: WishFont;
}
