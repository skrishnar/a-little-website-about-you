/**
 * ==============================================================================
 * 🎵 AUDIO SYSTEM: PROCEDURAL LOFI CHIME MUSIC & ADORABLE SOUND EFFECTS
 * ==============================================================================
 * Uses the Web Audio API to create a gentle, warm music-box background track
 * and cute sound effects with ZERO external audio dependencies (works 100% offline,
 * zero latency, zero broken links). Also supports a custom audio file if provided!
 * ==============================================================================
 */

class SoundController {
  constructor() {
    this.audioCtx = null;
    this.musicPlaying = false;
    this.sfxEnabled = true;
    this.reducedMotion = false;
    this.musicTimer = null;
    this.customAudio = null;
    this.currentChordIndex = 0;

    // Sweet romantic pentatonic chord progression (Fmaj7 -> Gsus -> Em7 -> Am7)
    this.chords = [
      [174.61, 220.00, 261.63, 329.63, 392.00], // F, A, C, E, G (Fmaj9)
      [196.00, 246.94, 293.66, 392.00, 440.00], // G, B, D, G, A (Gadd9)
      [164.81, 196.00, 246.94, 329.63, 392.00], // E, G, B, E, G (Em7)
      [220.00, 261.63, 329.63, 392.00, 523.25], // A, C, E, G, C (Am7)
    ];

    this.initCustomAudio();
  }

  initContext() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContext();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  initCustomAudio() {
    const customPath = window.STORY_CONFIG?.audio?.customMusicPath;
    if (customPath && customPath.trim() !== '') {
      this.customAudio = new Audio(customPath);
      this.customAudio.loop = true;
      this.customAudio.volume = 0.45;
    }
  }

  toggleMusic() {
    this.initContext();
    if (this.musicPlaying) {
      this.stopMusic();
      return false;
    } else {
      this.startMusic();
      return true;
    }
  }

  startMusic() {
    if (this.musicPlaying) return;
    this.initContext();

    if (this.customAudio) {
      this.customAudio.play().then(() => {
        this.musicPlaying = true;
      }).catch(err => {
        console.log("Custom audio play blocked, falling back to procedural music box:", err);
        this.startProceduralMusic();
      });
      return;
    }

    this.startProceduralMusic();
  }

  startProceduralMusic() {
    this.musicPlaying = true;
    let step = 0;

    const playArpNote = () => {
      if (!this.musicPlaying || !this.audioCtx) return;

      const chord = this.chords[this.currentChordIndex];
      const noteFreq = chord[step % chord.length];

      this.playKalimbaTone(noteFreq, 0.08);

      step++;
      if (step % chord.length === 0) {
        this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
      }

      // Timing varies between 420ms and 500ms for organic gentle lullaby feel
      const delay = (step % 2 === 0) ? 450 : 380;
      this.musicTimer = setTimeout(playArpNote, delay);
    };

    playArpNote();
  }

  stopMusic() {
    this.musicPlaying = false;
    if (this.musicTimer) {
      clearTimeout(this.musicTimer);
      this.musicTimer = null;
    }
    if (this.customAudio) {
      this.customAudio.pause();
    }
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    return this.sfxEnabled;
  }

  /**
   * Procedural Kalimba / Music Box tone
   */
  playKalimbaTone(freq, volume = 0.1) {
    if (!this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;

      // Primary gentle sine oscillator
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Subtle overtone for bell-like music box warmth
      const overtone = this.audioCtx.createOscillator();
      const overtoneGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2.01, now);

      // Soft envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      overtoneGain.gain.setValueAtTime(0.001, now);
      overtoneGain.gain.linearRampToValueAtTime(volume * 0.25, now + 0.015);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

      // Low-pass filter for cozy warm tone
      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      osc.connect(gain);
      overtone.connect(overtoneGain);
      gain.connect(filter);
      overtoneGain.connect(filter);
      filter.connect(this.audioCtx.destination);

      osc.start(now);
      overtone.start(now);
      osc.stop(now + 1.45);
      overtone.stop(now + 0.85);
    } catch (e) {
      // Audio safety catch
    }
  }

  /**
   * Sound effect: Soft tactile Pop (buttons, options)
   */
  playPop() {
    if (!this.sfxEnabled) return;
    this.initContext();
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(650, now + 0.06);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  /**
   * Sound effect: Twinkle / Chime (discoveries, easter eggs, unlocks)
   */
  playChime() {
    if (!this.sfxEnabled) return;
    this.initContext();
    try {
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.audioCtx) return;
          const now = this.audioCtx.currentTime;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

          osc.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc.start(now);
          osc.stop(now + 0.65);
        }, idx * 75);
      });
    } catch (e) {}
  }

  /**
   * Sound effect: Envelope / Paper Unfold
   */
  playPaper() {
    if (!this.sfxEnabled) return;
    this.initContext();
    try {
      const now = this.audioCtx.currentTime;
      const bufferSize = this.audioCtx.sampleRate * 0.2;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.12;
      }

      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.linearRampToValueAtTime(1400, now + 0.18);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(now);
    } catch (e) {}
  }

  /**
   * Sound effect: Heart beat / Warm confession chord
   */
  playHeartbeat() {
    if (!this.sfxEnabled) return;
    this.initContext();
    try {
      const now = this.audioCtx.currentTime;
      // First beat
      this.playKalimbaTone(261.63, 0.14); // C4
      // Second beat shortly after
      setTimeout(() => {
        this.playKalimbaTone(329.63, 0.12); // E4
      }, 160);
    } catch (e) {}
  }
}

// Global sound manager instance
window.soundController = new SoundController();
