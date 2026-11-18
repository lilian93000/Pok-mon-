/* Sons de bataille synthétisés en direct (Web Audio, aucun fichier).
   Le mélange dépend de ce que la caméra voit et entend : plus on est près de la mêlée,
   plus les chocs d'armes et les cris dominent la rumeur lointaine. */
export class BattleAudio {
  constructor() { this.ctx = null; this.vol = 0.8; this.muted = false; this.events = 0; }

  start() {
    if (this.ctx) { this.ctx.resume?.(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain(); this.master.gain.value = this.vol;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    this.master.connect(comp); comp.connect(ctx.destination);
    // bruit blanc partagé
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    // vent
    this.wind = this.loopNoise('bandpass', 420, 0.6);
    this.windLfo = 0;
    // rumeur de la mêlée lointaine
    this.roar = this.loopNoise('bandpass', 600, 0.9);
    this.roarLP = ctx.createBiquadFilter(); this.roarLP.type = 'lowpass'; this.roarLP.frequency.value = 900;
    this.roar.g.disconnect(); this.roar.g.connect(this.roarLP); this.roarLP.connect(this.master);
    // piétinement d'une armée en marche
    this.tramp = this.loopNoise('lowpass', 160, 0.7);
    this.hoofT = 0;
  }
  loopNoise(type, f, q) {
    const ctx = this.ctx;
    const src = ctx.createBufferSource(); src.buffer = this.noise; src.loop = true;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain(); g.gain.value = 0;
    src.connect(fl); fl.connect(g); g.connect(this.master);
    src.start();
    return { src, fl, g };
  }
  setVolume(v) { this.vol = v; if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : v, this.ctx.currentTime, 0.1); }
  setMuted(m) { this.muted = m; this.setVolume(this.vol); }

  // info : { fight, near, march, cav, camH, wind, speed }
  update(dt, info) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const t = this.ctx.currentTime;
    this.windLfo += dt;
    const gust = 0.6 + 0.4 * Math.sin(this.windLfo * 0.37) * Math.sin(this.windLfo * 0.11 + 1);
    this.wind.g.gain.setTargetAtTime(0.05 * info.wind * gust * (0.6 + 0.4 * Math.min(1, info.camH / 400)), t, 0.3);
    this.wind.fl.frequency.setTargetAtTime(300 + 260 * gust, t, 0.5);
    const roar = Math.min(1, info.fight);
    this.roar.g.gain.setTargetAtTime(0.32 * roar, t, 0.4);
    this.roarLP.frequency.setTargetAtTime(400 + 2600 * info.near, t, 0.4);
    this.tramp.g.gain.setTargetAtTime(0.25 * Math.min(1, info.march) * (0.4 + 0.6 * info.near), t, 0.5);
    if (info.speed <= 0) return;
    // événements ponctuels : chocs, cris, sabots
    const rate = Math.min(28, info.fight * info.near * 40 * Math.min(2, info.speed));
    let n = rate * dt;
    while (n > 0) {
      if (n < 1 && Math.random() > n) break; n--;
      const r = Math.random(), when = t + Math.random() * dt, pan = Math.random() * 1.6 - 0.8, vol = 0.25 + 0.75 * info.near;
      if (r < 0.5) this.clang(when, vol * 0.5, pan);
      else if (r < 0.8) this.thud(when, vol * 0.6, pan);
      else this.shout(when, vol * 0.35, pan);
    }
    if (info.cav > 0.05) {
      this.hoofT -= dt * Math.min(2, info.speed);
      if (this.hoofT <= 0) {
        this.hoofT = 0.09 + Math.random() * 0.08;
        this.hoof(t, 0.5 * info.cav, Math.random() * 1.2 - 0.6);
      }
    }
  }
  env(g, when, a, peak, dec) {
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(peak, when + a);
    g.gain.exponentialRampToValueAtTime(0.0001, when + a + dec);
  }
  out(pan) {
    const p = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    const g = this.ctx.createGain();
    if (p) { p.pan.value = pan; g.connect(p); p.connect(this.master); } else g.connect(this.master);
    return g;
  }
  clang(when, vol, pan) {
    const ctx = this.ctx, g = this.out(pan);
    const f0 = 900 + Math.random() * 1800;
    for (const k of [1, 2.76, 5.4]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f0 * k * (0.98 + Math.random() * 0.04);
      const og = ctx.createGain(); this.env(og, when, 0.002, vol / k, 0.12 + Math.random() * 0.25);
      o.connect(og); og.connect(g); o.start(when); o.stop(when + 0.5);
    }
    this.burst(g, when, 'highpass', 2500, vol * 0.5, 0.04);
  }
  thud(when, vol, pan) { this.burst(this.out(pan), when, 'lowpass', 260 + Math.random() * 300, vol, 0.1 + Math.random() * 0.08); }
  hoof(when, vol, pan) {
    const ctx = this.ctx, g = this.out(pan);
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(95, when); o.frequency.exponentialRampToValueAtTime(45, when + 0.08);
    const og = ctx.createGain(); this.env(og, when, 0.003, vol, 0.09);
    o.connect(og); og.connect(g); o.start(when); o.stop(when + 0.15);
    this.burst(g, when, 'lowpass', 500, vol * 0.4, 0.05);
  }
  burst(dest, when, type, f, vol, dur) {
    const ctx = this.ctx;
    const s = ctx.createBufferSource(); s.buffer = this.noise;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f;
    const g = ctx.createGain(); this.env(g, when, 0.002, vol, dur);
    s.connect(fl); fl.connect(g); g.connect(dest);
    s.start(when, Math.random() * 1.5); s.stop(when + dur + 0.05);
  }
  shout(when, vol, pan) {
    const ctx = this.ctx, g = this.out(pan);
    const o = ctx.createOscillator(); o.type = 'sawtooth';
    const f0 = 110 + Math.random() * 120, dur = 0.35 + Math.random() * 0.6;
    o.frequency.setValueAtTime(f0, when);
    o.frequency.linearRampToValueAtTime(f0 * (1.2 + Math.random() * 0.4), when + dur * 0.3);
    o.frequency.linearRampToValueAtTime(f0 * 0.8, when + dur);
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 650 + Math.random() * 250; f1.Q.value = 5;
    const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 1100 + Math.random() * 400; f2.Q.value = 6;
    const og = ctx.createGain(); this.env(og, when, 0.05, vol, dur);
    o.connect(f1); o.connect(f2); f1.connect(og); f2.connect(og); og.connect(g);
    o.start(when); o.stop(when + dur + 0.1);
  }
  volley(vol) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const ctx = this.ctx, t = ctx.currentTime;
    for (let i = 0; i < 4; i++) {
      const s = ctx.createBufferSource(); s.buffer = this.noise;
      const fl = ctx.createBiquadFilter(); fl.type = 'bandpass'; fl.Q.value = 2;
      const w = t + i * 0.06 + Math.random() * 0.1;
      fl.frequency.setValueAtTime(1800, w); fl.frequency.exponentialRampToValueAtTime(500, w + 0.7);
      const g = this.out(Math.random() - 0.5); g.gain.value = 0;
      const eg = ctx.createGain(); this.env(eg, w, 0.15, vol * 0.25, 0.6);
      s.connect(fl); fl.connect(eg); eg.connect(g); s.start(w, Math.random()); s.stop(w + 0.9);
    }
  }
  // signaux : tuba (trompette droite romaine), cornu, carnyx gaulois, éléphant
  horn(kind, vol = 0.5) {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const ctx = this.ctx, t = ctx.currentTime + 0.02;
    const g = this.out((Math.random() - 0.5) * 0.4); g.gain.value = vol;
    const notes = kind === 'tuba' ? [[233, 0.45], [311, 0.3], [233, 0.9]] : kind === 'cornu' ? [[147, 0.7], [196, 1.2]] : kind === 'carnyx' ? [[98, 1.6]] : [[420, 1.1]];
    let w = t;
    for (const [f, d] of notes) {
      const o1 = ctx.createOscillator(), o2 = ctx.createOscillator();
      o1.type = 'sawtooth'; o2.type = kind === 'carnyx' ? 'sawtooth' : 'square';
      o1.frequency.setValueAtTime(f * 0.97, w); o1.frequency.linearRampToValueAtTime(f, w + 0.08);
      o2.frequency.value = f * (kind === 'carnyx' ? 1.505 : 2.003);
      if (kind === 'elephant') { o1.frequency.setValueAtTime(380, w); o1.frequency.linearRampToValueAtTime(900, w + 0.35); o1.frequency.linearRampToValueAtTime(560, w + d); o2.frequency.value = 37; }
      const vib = ctx.createOscillator(), vg = ctx.createGain(); vib.frequency.value = kind === 'carnyx' ? 7 : 5; vg.gain.value = f * 0.012;
      vib.connect(vg); vg.connect(o1.frequency);
      const lp = ctx.createBiquadFilter(); lp.type = kind === 'carnyx' ? 'bandpass' : 'lowpass';
      lp.frequency.setValueAtTime(kind === 'carnyx' ? 700 : 900, w); lp.frequency.linearRampToValueAtTime(kind === 'carnyx' ? 1800 : 2400, w + d * 0.5); lp.Q.value = kind === 'carnyx' ? 3 : 0.8;
      const eg = ctx.createGain(); eg.gain.setValueAtTime(0.0001, w); eg.gain.exponentialRampToValueAtTime(0.5, w + 0.07); eg.gain.setValueAtTime(0.45, w + d - 0.08); eg.gain.exponentialRampToValueAtTime(0.0001, w + d);
      const o2g = ctx.createGain(); o2g.gain.value = kind === 'elephant' ? 0.0 : 0.35;
      o1.connect(lp); o2.connect(o2g); o2g.connect(lp); lp.connect(eg); eg.connect(g);
      for (const o of [o1, o2, vib]) { o.start(w); o.stop(w + d + 0.05); }
      w += d + 0.04;
    }
  }
}
