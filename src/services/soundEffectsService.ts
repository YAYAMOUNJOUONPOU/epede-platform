// src/services/soundEffectsService.ts
// EPEDE - Web Audio API Synthetic Electrotechnical Sound FX Engine
// Generates realistic substation acoustic feedback in pure code without any external asset dependencies.

class SoundEffectsService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.4;
  private humOscillator: OscillatorNode | null = null;
  private humGainNode: GainNode | null = null;
  private listeners: Array<(muted: boolean, volume: number) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('epede_audio_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('epede_audio_volume');
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.4;
      }
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume().catch(() => {});
    }
    return this.audioCtx;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('epede_audio_muted', String(this.isMuted));
    }
    if (this.isMuted && this.humGainNode) {
      this.humGainNode.gain.setValueAtTime(0, this.audioCtx?.currentTime || 0);
    }
    this.notifyListeners();
    return this.isMuted;
  }

  public setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
    if (typeof window !== 'undefined') {
      localStorage.setItem('epede_audio_volume', String(this.volume));
    }
    this.notifyListeners();
  }

  public subscribe(fn: (muted: boolean, volume: number) => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((l) => l(this.isMuted, this.volume));
  }

  // 1. Tactile Mechanical Switch / Selector Click
  public playSwitchClick(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(this.volume * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // 2. High-Voltage Circuit Breaker Close (52 Close) - Heavy Spring & Contact Thud
  public playBreakerClose(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub-bass thud (mechanism slam)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(45, now + 0.15);
    gain1.gain.setValueAtTime(this.volume * 0.8, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.2);

    // Mechanical latch clack (2nd burst at 40ms)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(850, now + 0.04);
    osc2.frequency.exponentialRampToValueAtTime(200, now + 0.1);
    gain2.gain.setValueAtTime(this.volume * 0.4, now + 0.04);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.04);
    osc2.stop(now + 0.14);
  }

  // 3. High-Voltage Circuit Breaker Open (52 Trip / Open) - Rapid Release & Arc Blast
  public playBreakerOpen(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sharp spring release
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(950, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.09);
    gain.gain.setValueAtTime(this.volume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  // 4. ANSI Protection Relay Trip Sound (Digital IED Trip Chime)
  public playRelayTrip(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'square';
    osc1.frequency.setValueAtTime(1760, now); // A6
    osc1.frequency.setValueAtTime(1318.5, now + 0.05); // E6

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now);

    gain.gain.setValueAtTime(this.volume * 0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.25);
    osc2.stop(now + 0.25);
  }

  // 5. Success / Calculation Verified Chime (C-E-G Harmonic Triad)
  public playSuccessChime(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = now + idx * 0.04;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.45);
    });
  }

  // 6. SCADA Alert / Anomaly Alarm
  public playWarningAlarm(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.setValueAtTime(700, now + 0.08);
    osc.frequency.setValueAtTime(880, now + 0.16);

    gain.gain.setValueAtTime(this.volume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  public playAlarm(): void {
    this.playWarningAlarm();
  }

  public playWarningBuzzer(): void {
    this.playWarningAlarm();
  }

  public playDisconnectorSwitch(): void {
    this.playSwitchClick();
  }

  // 7. Ambient 50 Hz Substation Transformer Magnetostriction Hum
  // 8. Slider Tick – subtle UI feedback for range inputs
  public playSliderTick(): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(3200, now);
    osc.frequency.exponentialRampToValueAtTime(1800, now + 0.015);

    gain.gain.setValueAtTime(this.volume * 0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  // 7. Ambient 50 Hz Substation Transformer Magnetostriction Hum
  public setAmbientHvHum(enable: boolean): void {
    if (this.isMuted || !enable) {
      if (this.humGainNode && this.audioCtx) {
        this.humGainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.1);
      }
      return;
    }

    const ctx = this.getAudioContext();
    if (!ctx) return;

    if (!this.humOscillator) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(100, ctx.currentTime); // 100 Hz 2nd harmonic of 50 Hz power

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.setTargetAtTime(this.volume * 0.08, ctx.currentTime, 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      this.humOscillator = osc;
      this.humGainNode = gain;
    } else if (this.humGainNode) {
      this.humGainNode.gain.setTargetAtTime(this.volume * 0.08, ctx.currentTime, 0.2);
    }
  }
}

export const soundEffects = new SoundEffectsService();
