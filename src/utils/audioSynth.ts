class AudioSynth {
  private currentAudio: HTMLAudioElement | null = null;

  playThemeSound(theme: string) {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      }

      // If the theme doesn't match an existing MP3, it will log a warning
      // The user can add more mp3 files for other themes like 'love.mp3', 'celebration.mp3' etc.
      const validThemes = ['birthday', 'love', 'celebration', 'thanks', 'apology', 'classic'];
      const fileTheme = validThemes.includes(theme) ? theme : 'birthday';

      const audioSrc = `/music/${fileTheme}.mp3`;
      this.currentAudio = new Audio(audioSrc);
      
      this.currentAudio.play().catch((e) => {
        console.warn(`Audio playback failed for ${audioSrc}`, e);
      });
    } catch (e) {
      console.error('Audio setup failed', e);
    }
  }
}

export const synth = new AudioSynth();
export default synth;
