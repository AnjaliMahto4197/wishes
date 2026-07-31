class AudioSynth {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, startTime: number, duration: number, type: OscillatorType = 'sine', volume = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gainNode.gain.setValueAtTime(0, startTime);
    // Smooth attack
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.04);
    // Smooth decay/release
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playBirthday() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const tempo = 0.28; // beat duration

    // Happy birthday melody notes
    const notes = [
      { f: 261.63, d: 0.75 }, // C4
      { f: 261.63, d: 0.25 }, // C4
      { f: 293.66, d: 1 },    // D4
      { f: 261.63, d: 1 },    // C4
      { f: 349.23, d: 1 },    // F4
      { f: 329.63, d: 2 },    // E4
    ];

    let current = now + 0.05;
    notes.forEach((note) => {
      this.playTone(note.f, current, note.d * tempo, 'triangle', 0.12);
      this.playTone(note.f * 1.5, current, note.d * tempo, 'sine', 0.04); // Harmony
      current += note.d * tempo + 0.04;
    });
  }

  playLove() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Dreamy harp-like glissando (C Major 7 / F Major 7 blend)
    const freqs = [261.63, 329.63, 392.00, 493.88, 523.25, 659.25, 783.99, 987.77, 1046.50];
    freqs.forEach((f, i) => {
      this.playTone(f, now + i * 0.07, 1.5, 'sine', 0.1);
    });
  }

  playCelebration() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Sparkly chime arpeggio + noise firework bursts
    const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    freqs.forEach((f, i) => {
      this.playTone(f, now + i * 0.05, 0.8, 'sine', 0.08);
    });

    this.playFireworkPop(now + 0.05);
    this.playFireworkPop(now + 0.3);
    this.playFireworkPop(now + 0.65);
  }

  private playFireworkPop(time: number) {
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(380, time);
      filter.frequency.exponentialRampToValueAtTime(10, time + 0.25);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.12, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(time);
      noise.stop(time + 0.35);
    } catch (e) {
      console.warn('Firework audio synthesis unsupported or error:', e);
    }
  }

  playThanks() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Warm Fmaj7 chord: F3, C4, E4, A4
    const chord = [174.61, 261.63, 329.63, 440.00];
    chord.forEach((f) => {
      this.playTone(f, now, 2.8, 'sine', 0.08);
    });
    // Soft melodic resolution
    this.playTone(523.25, now + 0.4, 1.6, 'sine', 0.05); // C5
    this.playTone(659.25, now + 0.9, 1.6, 'sine', 0.05); // E5
  }

  playApology() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Calming, slightly melancholic minor-seventh chord (Am7)
    const chord = [220.00, 329.63, 392.00, 523.25];
    chord.forEach((f) => {
      this.playTone(f, now, 2.8, 'triangle', 0.06);
    });
    this.playTone(440.00, now + 0.7, 1.8, 'sine', 0.04); // A4
  }

  playClassic() {
    this.initCtx();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    // Beautiful clean crystal bell sound
    this.playTone(880.00, now, 1.6, 'sine', 0.15); // A5
    this.playTone(1760.00, now, 0.8, 'sine', 0.04); // A6 (overtone)
  }

  playThemeSound(theme: string) {
    try {
      switch (theme) {
        case 'birthday':
          this.playBirthday();
          break;
        case 'love':
          this.playLove();
          break;
        case 'celebration':
          this.playCelebration();
          break;
        case 'thanks':
          this.playThanks();
          break;
        case 'apology':
          this.playApology();
          break;
        default:
          this.playClassic();
          break;
      }
    } catch (e) {
      console.error('Audio playback failed', e);
    }
  }
}

export const synth = new AudioSynth();
export default synth;
