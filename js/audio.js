/* audio.js — Web Audio 实时合成与物理建模引擎
 * 包含：基础鼓组/合成器、Karplus-Strong 拨弦物理建模（古筝/吉他/三味线）、
 * 气流呼吸竹笛/尺八、擦弦二胡/提琴、2-Op FM 罗兹电钢琴、民族打击乐（Clave/Bongo/Taiko/Tanggu/Palmas）
 * 以及四大文化动态乐器与调式映射分发器
 */
"use strict";

const AudioEngine = {
  ctx: null,
  master: null,
  comp: null,
  _noiseBuf: null,
  _fill: null,
  _choir: null,

  init() {
    if (this.ctx) return this.ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.55;
      this.comp = this.ctx.createDynamicsCompressor();
      this.master.connect(this.comp);
      this.comp.connect(this.ctx.destination);
    } catch (e) {
      console.warn("AudioContext init failed:", e);
    }
    return this.ctx;
  },

  async resume() {
    await this.unlock();
  },

  async unlock() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    if (this.ctx.state !== "running") {
      try {
        await this.ctx.resume();
      } catch (e) {
        console.warn("AudioContext resume failed:", e);
      }
    }
    // iOS / Safari 强制打通底层硬件音频通道（播放 1 采样无声音频）
    try {
      const buf = this.ctx.createBuffer(1, 1, 22050);
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.connect(this.ctx.destination);
      src.start(0);
    } catch (e) {}
  },

  now() {
    if (!this.ctx) this.init();
    return this.ctx ? this.ctx.currentTime : 0;
  },

  safeTime(t) {
    if (!this.ctx) this.init();
    const cur = this.ctx ? this.ctx.currentTime : 0;
    if (t == null || isNaN(t)) return cur;
    return Math.max(t, cur);
  },

  noiseBuffer() {
    if (!this.ctx) this.init();
    if (!this._noiseBuf && this.ctx) {
      const len = Math.floor(this.ctx.sampleRate * 0.5);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      this._noiseBuf = buf;
    }
    return this._noiseBuf;
  },

  /* ==============================================================
   * 1. 物理建模与高级合成器 (Physical Modeling & Advanced Synths)
   * 移植优化自 MusicTheory 项目
   * ============================================================== */

  /**
   * Karplus-Strong 拨弦物理建模 (古筝 Guzheng / 尼龙吉他 Guitar / 三味线 Shamisen / 竖琴 Harp)
   * 通过 AudioBuffer 内存预计算高精度阻尼平均反馈循环，数学严格收敛，彻底杜绝爆音与失真
   */
  pluck(t, freq, dur = 0.8, gain = 0.22, style = "guzheng") {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    dur = Math.max(0.05, dur);
    const sampleRate = this.ctx.sampleRate;

    const f = Math.max(45, Math.min(2600, freq));
    const period = Math.max(2, Math.round(sampleRate / f));
    const numSamples = Math.max(period * 2, Math.floor(sampleRate * dur));

    const audioBuffer = this.ctx.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    // 初始激励：根据乐器风格定制激励窗口
    for (let i = 0; i < period; i++) {
      let win;
      if (style === "shamisen") {
        win = Math.sin((Math.PI * i) / period) * (1 - (i / period) * 0.4);
      } else if (style === "guitar") {
        // 柔和西班牙尼龙弦：轻柔半正弦窗，消除尖锐打品杂音
        win = Math.sin((Math.PI * i) / period) * 0.65;
      } else if (style === "oud") {
        // 阿拉伯乌德琴：双弦共振，丰满圆润无品木质腔体
        win = Math.sin((Math.PI * i) / period) * 0.8 * (1 + 0.3 * Math.sin((Math.PI * i * 2) / period));
      } else if (style === "sitar") {
        // 印度西塔琴：金属拨子 Mizrab 敲击，高频明亮泛音
        win = Math.sin((Math.PI * i) / period) * (1 + 0.5 * Math.sin((Math.PI * i * 3) / period));
      } else { // guzheng / default
        win = Math.sin((Math.PI * i) / period);
      }
      channelData[i] = (Math.random() * 2 - 1) * win;
    }

    // Karplus-Strong 阻尼循环: y[i] = 0.5 * (y[i - P] + y[i - P - 1]) * decay
    let decayBase = 0.992;
    if (style === "shamisen") decayBase = 0.982;      // 三味线：短促颗粒
    else if (style === "guitar") decayBase = 0.986;    // 尼龙吉他：温润柔和中延音
    else if (style === "oud") decayBase = 0.988;       // 乌德琴：温厚木质衰减
    else if (style === "sitar") decayBase = 0.995;     // 西塔琴：长延音 + 共鸣嗡鸣
    else if (style === "guzheng") decayBase = 0.994;   // 古筝：华丽长余音

    const decayFactor = Math.min(0.996, decayBase + (60 / f) * 0.004);
    for (let i = period; i < numSamples; i++) {
      const p1 = channelData[i - period];
      const p2 = (i - period - 1 >= 0) ? channelData[i - period - 1] : channelData[i - period];
      let val = 0.5 * (p1 + p2) * decayFactor;
      // 西塔琴 Jawari 桥码微妙非线性微嗡鸣 (Subtle bridge buzz)
      if (style === "sitar" && Math.abs(val) > 0.45) {
        val = val > 0 ? val * 0.92 + 0.04 : val * 0.92 - 0.04;
      }
      channelData[i] = val;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = audioBuffer;

    // 西塔琴 Meend 滑音（起奏微微向上滑半音到位，极富印度韵味）
    if (style === "sitar") {
      source.playbackRate.setValueAtTime(0.96, t);
      source.playbackRate.linearRampToValueAtTime(1.0, t + 0.06);
    }

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    // 吉他与乌德琴使用温暖低通滤波，消除刺耳金属声
    if (style === "guitar") {
      filter.frequency.setValueAtTime(2200, t);
    } else if (style === "oud") {
      filter.frequency.setValueAtTime(2600, t);
    } else {
      filter.frequency.setValueAtTime(7000, t);
    }

    const env = this.ctx.createGain();
    const actualGain = gain;
    const tSus = t + dur * 0.75;
    const tEnd = t + dur;

    env.gain.setValueAtTime(actualGain, t);
    if (tSus > t + 0.005) {
      env.gain.setValueAtTime(actualGain, tSus);
    }
    env.gain.linearRampToValueAtTime(0.0001, tEnd);

    source.connect(filter);
    filter.connect(env);
    env.connect(this.master);

    source.start(t);
    source.stop(tEnd + 0.04);
  },

  /**
   * 气流呼吸管乐：竹笛 / 尺八 / 内伊笛 / 班苏里笛 (Flute / Dizi / Shakuhachi / Ney / Bansuri)
   */
  flute(t, freq, dur = 0.8, gain = 0.18, style = "dizi") {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    dur = Math.max(0.05, dur);

    const isShak = style === "shakuhachi" || style === true;
    const isNey = style === "ney";
    const isBansuri = style === "bansuri";

    // 主音正弦波
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, t);

    // 偶次谐波（丰富木管质感）
    const osc2 = this.ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 2, t);
    const osc2Gain = this.ctx.createGain();
    osc2Gain.gain.setValueAtTime(isBansuri ? 0.05 : 0.035, t);
    osc2.connect(osc2Gain);

    // 揉弦/颤音 (Vibrato LFO)
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const lfoSpeed = isShak ? 4.8 : isNey ? 4.5 : isBansuri ? 4.2 : 5.8;
    lfo.frequency.setValueAtTime(lfoSpeed, t);
    lfoGain.gain.setValueAtTime(0, t);
    const tVib = t + Math.min(0.2, dur * 0.4);
    const vibDepth = freq * (isShak ? 0.022 : isBansuri ? 0.025 : 0.015);
    lfoGain.gain.linearRampToValueAtTime(vibDepth, tVib);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // 起吹呼吸声爆破 (Breath noise)
    const noiseDuration = Math.min(isNey ? 0.16 : 0.12, dur * 0.5);
    const bufferSize = Math.max(128, Math.floor(this.ctx.sampleRate * noiseDuration));
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(freq * (isNey ? 1.4 : 1.6), t);
    noiseFilter.Q.setValueAtTime(1.5, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isNey ? 0.026 : 0.018, t);
    noiseGain.gain.linearRampToValueAtTime(0.0001, t + noiseDuration);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    // 低通共鸣滤波
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(3200, freq * 3.5), t);
    filter.Q.setValueAtTime(0.7, t);

    const env = this.ctx.createGain();
    const att = Math.min(0.06, dur * 0.2);
    const rel = Math.min(0.08, dur * 0.25);
    const tAtt = t + att;
    const tRel = Math.max(tAtt + 0.005, t + dur - rel);
    const tEnd = Math.max(tRel + 0.005, t + dur);

    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, tAtt);
    if (tRel > tAtt) {
      env.gain.setValueAtTime(gain * 0.85, tRel);
    }
    env.gain.linearRampToValueAtTime(0.0001, tEnd);

    osc.connect(filter);
    osc2Gain.connect(filter);
    noiseGain.connect(filter);
    filter.connect(env);
    env.connect(this.master);

    osc.start(t); osc2.start(t); lfo.start(t); noise.start(t);
    osc.stop(tEnd); osc2.stop(tEnd); lfo.stop(tEnd); noise.stop(t + noiseDuration);
  },

  /**
   * 擦弦物理共振：二胡 / 小提琴 (Erhu / Violin)
   * 锯齿波 + 弦体谐振低通滤波 + 5.5Hz 揉弦
   */
  bowed(t, freq, dur = 0.8, gain = 0.18) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    dur = Math.max(0.05, dur);

    const osc = this.ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(Math.min(2200, freq * 3.2), t);
    filter.Q.setValueAtTime(0.8, t);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(5.5, t);
    lfoGain.gain.setValueAtTime(0, t);
    lfoGain.gain.linearRampToValueAtTime(freq * 0.012, t + Math.min(0.2, dur * 0.5));
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    const env = this.ctx.createGain();
    const att = Math.min(0.06, dur * 0.2);
    const rel = Math.min(0.08, dur * 0.25);
    const tAtt = t + att;
    const tRel = Math.max(tAtt + 0.005, t + dur - rel);
    const tEnd = Math.max(tRel + 0.005, t + dur);

    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, tAtt);
    if (tRel > tAtt) {
      env.gain.setValueAtTime(gain * 0.8, tRel);
    }
    env.gain.linearRampToValueAtTime(0.0001, tEnd);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.master);

    osc.start(t); lfo.start(t);
    osc.stop(tEnd); lfo.stop(tEnd);
  },

  /**
   * 2-Operator FM 罗兹电钢琴 (FM Rhodes EP)
   * 晶莹剔透的和声打击瞬态 + 温暖 4.5Hz 颤音 (Tremolo)
   */
  rhodes(t, freq, dur = 0.9, gain = 0.18) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    dur = Math.max(0.05, dur);

    const carrier = this.ctx.createOscillator();
    carrier.type = "sine";
    carrier.frequency.setValueAtTime(freq, t);

    // 2:1 纯正八度调制器
    const modulator = this.ctx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.setValueAtTime(freq * 2, t);

    const modGain = this.ctx.createGain();
    modGain.gain.setValueAtTime(freq * 0.35, t);
    modGain.gain.linearRampToValueAtTime(0.01, t + Math.min(0.25, dur * 0.6));

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    const env = this.ctx.createGain();
    const att = Math.min(0.015, dur * 0.1);
    const dec = Math.min(0.18, dur * 0.4);
    const tAtt = t + att;
    const tDec = tAtt + dec;
    const tEnd = Math.max(tDec + 0.01, t + dur);

    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, tAtt);
    env.gain.linearRampToValueAtTime(gain * 0.5, tDec);
    env.gain.linearRampToValueAtTime(0.0001, tEnd);

    carrier.connect(env);
    env.connect(this.master);

    modulator.start(t); carrier.start(t);
    modulator.stop(tEnd); carrier.stop(tEnd);
  },

  /**
   * 真实立式木贝斯 / 暖声低音 (Upright Bass)
   */
  bass(t, freq, dur = 0.6, gain = 0.22, style = "upright") {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    dur = Math.max(0.05, dur);

    const osc = this.ctx.createOscillator();
    osc.type = style === "sub" ? "sine" : "triangle";
    osc.frequency.setValueAtTime(freq, t);

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(style === "sub" ? 160 : 340, t);

    const env = this.ctx.createGain();
    const att = Math.min(0.02, dur * 0.1);
    const tAtt = t + att;
    const tEnd = Math.max(tAtt + 0.01, t + dur);

    env.gain.setValueAtTime(0.0001, t);
    env.gain.linearRampToValueAtTime(gain, tAtt);
    env.gain.linearRampToValueAtTime(0.0001, tEnd);

    osc.connect(filter);
    filter.connect(env);
    env.connect(this.master);

    osc.start(t);
    osc.stop(tEnd);
  },

  /**
   * 民族打击乐器组 (Ethnic Percussion: Clave / Woodblock / Bongo / Taiko / Palmas / Darbuka / Tabla / Riq)
   */
  ethnicDrum(t, type = "clave", velocity = 0.5) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);

    switch (type) {
      case "clave": {
        // 古巴 Clave 响木（高频 2200Hz 短促清脆木质）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(2200, t);
        const g = velocity * 0.18;
        env.gain.setValueAtTime(g, t);
        env.gain.linearRampToValueAtTime(0.0001, t + 0.04);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.045);
        break;
      }
      case "woodblock": {
        // 东方寺庙木鱼 / 拍子木（1100Hz 暖色木质敲击）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1100, t);
        const g = velocity * 0.22;
        env.gain.setValueAtTime(g, t);
        env.gain.linearRampToValueAtTime(0.0001, t + 0.05);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.055);
        break;
      }
      case "bongo": {
        // 拉丁邦戈手鼓（380Hz 滑向 260Hz 饱满击皮声）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(360, t);
        osc.frequency.linearRampToValueAtTime(240, t + 0.08);
        const g = velocity * 0.22;
        env.gain.setValueAtTime(g, t);
        env.gain.linearRampToValueAtTime(0.0001, t + 0.14);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.15);
        break;
      }
      case "taiko":
      case "tanggu": {
        // 日本太鼓 / 中国大堂鼓（低沉震撼 100Hz -> 42Hz 轰鸣）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(type === "taiko" ? 95 : 110, t);
        osc.frequency.exponentialRampToValueAtTime(42, t + 0.18);
        const g = velocity * 0.5;
        env.gain.setValueAtTime(g, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.34);
        break;
      }
      case "palmas": {
        // 弗拉门戈击掌（经柔化带通滤波，消除刺耳高频，仅保留温润肉质击掌声）
        const n = this.ctx.createBufferSource();
        n.buffer = this.noiseBuffer();
        if (!n.buffer) return;
        const f = this.ctx.createBiquadFilter();
        f.type = "bandpass"; f.frequency.value = 1350; f.Q.value = 1.6;
        const env = this.ctx.createGain();
        env.gain.setValueAtTime(velocity * 0.22, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.065);
        n.connect(f); f.connect(env); env.connect(this.master);
        n.start(t); n.stop(t + 0.07);
        break;
      }
      case "darbuka_doum": {
        // 中东达布卡手鼓 Doum（厚重下潜低音：135Hz 滑向 65Hz）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(135, t);
        osc.frequency.exponentialRampToValueAtTime(65, t + 0.15);
        const g = velocity * 0.45;
        env.gain.setValueAtTime(g, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.28);
        break;
      }
      case "darbuka_tek": {
        // 中东达布卡手鼓 Tek（边缘清脆击打：高带通点击）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(1800, t);
        osc.frequency.linearRampToValueAtTime(1200, t + 0.04);
        const g = velocity * 0.24;
        env.gain.setValueAtTime(g, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.05);
        break;
      }
      case "riq": {
        // 阿拉伯铃鼓轻敲打点（带通小金属铃片）
        const n = this.ctx.createBufferSource();
        n.buffer = this.noiseBuffer();
        if (!n.buffer) return;
        const f = this.ctx.createBiquadFilter();
        f.type = "bandpass"; f.frequency.value = 4600; f.Q.value = 2.5;
        const env = this.ctx.createGain();
        env.gain.setValueAtTime(velocity * 0.18, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
        n.connect(f); f.connect(env); env.connect(this.master);
        n.start(t); n.stop(t + 0.05);
        break;
      }
      case "tabla_bayan": {
        // 印度塔布拉左手铜鼓 (Bayan/Dagga)：掌根推膜滑音（92Hz 向上弯向 128Hz 再衰减至 80Hz）
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(92, t);
        osc.frequency.exponentialRampToValueAtTime(128, t + 0.06);
        osc.frequency.exponentialRampToValueAtTime(78, t + 0.26);
        const g = velocity * 0.44;
        env.gain.setValueAtTime(g, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.32);
        break;
      }
      case "tabla_dayan": {
        // 印度塔布拉右手木鼓 (Dayan)：清脆泛音金属共鸣 (Na / Tin: ~330Hz)
        const osc = this.ctx.createOscillator();
        const env = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(330, t);
        const g = velocity * 0.26;
        env.gain.setValueAtTime(g, t);
        env.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
        osc.connect(env); env.connect(this.master);
        osc.start(t); osc.stop(t + 0.2);
        break;
      }
    }
  },

  /* ==============================================================
   * 2. 文化综合分发器 (Cultural Synthesizer Dispatchers)
   * 根据当前文化自动调用对应的物理建模乐器
   * ============================================================== */

  _getCult(cult) {
    return cult || (typeof I18n !== "undefined" ? I18n.lang : "zh") || "zh";
  },

  playCulturalMelody(t, freq, dur = 0.5, cult, gain = 0.2) {
    cult = this._getCult(cult);
    if (cult === "zh") {
      this.pluck(t, freq, dur * 1.2, gain, "guzheng");
    } else if (cult === "ja") {
      this.pluck(t, freq, dur * 0.9, gain, "shamisen");
    } else if (cult === "es") {
      this.pluck(t, freq, dur * 1.1, gain, "guitar");
    } else if (cult === "ar") {
      // 阿拉伯乌德琴 (Oud) 优美无品弹拨
      this.pluck(t, freq, dur * 1.1, gain * 0.9, "oud");
    } else if (cult === "hi") {
      // 印度西塔琴 (Sitar) 经典微滑音与共振
      this.pluck(t, freq, dur * 1.25, gain * 0.88, "sitar");
    } else { // en
      this.rhodes(t, freq, dur, gain);
    }
  },

  playCulturalFlute(t, freq, dur = 0.7, cult, gain = 0.18) {
    cult = this._getCult(cult);
    if (cult === "ja") {
      this.flute(t, freq, dur, gain, "shakuhachi");
    } else if (cult === "ar") {
      this.flute(t, freq, dur, gain, "ney");
    } else if (cult === "hi") {
      this.flute(t, freq, dur, gain, "bansuri");
    } else {
      this.flute(t, freq, dur, gain, "dizi");
    }
  },

  playCulturalBass(t, freq, dur = 0.6, cult, gain = 0.22) {
    cult = this._getCult(cult);
    if (cult === "zh") {
      this.bowed(t, freq, dur, gain * 0.9);
    } else if (cult === "ja") {
      this.bass(t, freq, dur, gain, "upright");
    } else if (cult === "es") {
      // 西语低音：彻底换用温暖深沉的低通木贝斯，音量由 0.22 降为 0.11，不再嘈杂
      this.bass(t, freq, dur, 0.11, "upright");
    } else if (cult === "ar") {
      // 阿拉伯：沉稳乌德琴低音 / 纯净低频
      this.pluck(t, freq, dur * 1.1, 0.15, "oud");
    } else if (cult === "hi") {
      // 印度：坦普拉持续深沉低音
      this.bass(t, freq, dur * 1.4, 0.13, "sub");
    } else { // en
      this.bass(t, freq, dur, gain, "upright");
    }
  },

  playCulturalDrum(t, role = "kick", cult, velocity = 0.5) {
    cult = this._getCult(cult);
    if (role === "kick") {
      if (cult === "zh") {
        this.ethnicDrum(t, "tanggu", velocity * 1.1);
      } else if (cult === "ja") {
        this.ethnicDrum(t, "taiko", velocity * 1.1);
      } else if (cult === "es") {
        // 西语正拍：彻底移除叠加的 bongo 杂音，仅用单一干净的软底大鼓
        this.kick(t);
      } else if (cult === "ar") {
        this.ethnicDrum(t, "darbuka_doum", velocity * 1.1);
      } else if (cult === "hi") {
        this.ethnicDrum(t, "tabla_bayan", velocity * 1.2);
      } else {
        this.kick(t);
      }
    } else if (role === "snare") {
      if (cult === "es") {
        // 西语反拍：使用轻柔无噪点的干净小军鼓，不再使用高频 palmas
        this.snare(t);
      } else if (cult === "ar") {
        this.ethnicDrum(t, "darbuka_tek", velocity * 0.9);
      } else if (cult === "hi") {
        this.ethnicDrum(t, "tabla_dayan", velocity * 0.95);
      } else {
        this.snare(t);
      }
    } else if (role === "clap") {
      if (cult === "es") {
        this.ethnicDrum(t, "palmas", velocity * 0.8);
      } else if (cult === "ar") {
        this.ethnicDrum(t, "riq", velocity * 0.85);
      } else if (cult === "hi") {
        this.ethnicDrum(t, "tabla_dayan", velocity * 0.9);
      } else if (cult === "zh") {
        this.ethnicDrum(t, "woodblock", velocity * 0.7);
        this.clap(t);
      } else {
        this.clap(t);
      }
    } else if (role === "accent" || role === "cue") {
      if (cult === "zh") {
        this.ethnicDrum(t, "woodblock", velocity);
      } else if (cult === "ja") {
        this.ethnicDrum(t, "woodblock", velocity * 1.1);
      } else if (cult === "es") {
        this.ethnicDrum(t, "clave", velocity * 0.5); // 柔和轻巧响木
      } else if (cult === "ar") {
        this.ethnicDrum(t, "darbuka_tek", velocity * 0.85);
      } else if (cult === "hi") {
        this.ethnicDrum(t, "tabla_dayan", velocity * 0.85);
      } else {
        this.blok(t, 1046);
      }
    }
  },

  /* ==============================================================
   * 3. 基础经典打击乐与音效（保持原有接口 100% 兼容）
   * ============================================================== */

  kick(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(160, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.9, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.24);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 0.26);
  },

  snare(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (n.buffer) {
      const f = this.ctx.createBiquadFilter();
      f.type = "bandpass"; f.frequency.value = 1800; f.Q.value = 0.8;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.5, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      n.connect(f); f.connect(g); g.connect(this.master);
      n.start(t); n.stop(t + 0.18);
    }
    const o = this.ctx.createOscillator();
    const g2 = this.ctx.createGain();
    o.type = "triangle"; o.frequency.value = 190;
    g2.gain.setValueAtTime(0.25, t);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g2); g2.connect(this.master);
    o.start(t); o.stop(t + 0.1);
  },

  hihat(t, open) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (!n.buffer) return;
    const f = this.ctx.createBiquadFilter();
    f.type = "highpass"; f.frequency.value = 7500;
    const g = this.ctx.createGain();
    const dur = open ? 0.22 : 0.05;
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    n.connect(f); f.connect(g); g.connect(this.master);
    n.start(t); n.stop(t + dur + 0.02);
  },

  tone(t, freq, dur, type, vol) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    type = type || "square";
    vol = vol == null ? 0.16 : vol;
    dur = dur || 0.1;
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.setValueAtTime(vol, t + Math.max(0.012, dur - 0.05));
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + dur + 0.02);
  },

  blok(t, freq) {
    this.tone(t, freq || 660, 0.13, "sine", 0.32);
    this.tone(t, (freq || 660) * 2, 0.06, "sine", 0.1);
  },

  pon(t, pitch) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(pitch || 1150, t);
    o.frequency.exponentialRampToValueAtTime((pitch || 1150) * 0.8, t + 0.06);
    g.gain.setValueAtTime(0.35, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 0.1);
  },

  sfxSmash() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    const t = this.now();
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (n.buffer) {
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 4200;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      n.connect(f); f.connect(g); g.connect(this.master);
      n.start(t); n.stop(t + 0.22);
    }
    this.tone(t, 220, 0.08, "square", 0.2);
  },

  sfxMiss() {
    const t = this.now();
    this.tone(t, 130, 0.26, "sawtooth", 0.2);
    this.tone(t, 98, 0.3, "sawtooth", 0.16);
  },

  sfxCue(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(500, t);
    o.frequency.exponentialRampToValueAtTime(1400, t + 0.09);
    g.gain.setValueAtTime(0.2, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 0.12);
  },

  sfxWhiff() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    const t = this.now();
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (n.buffer) {
      const f = this.ctx.createBiquadFilter();
      f.type = "bandpass"; f.Q.value = 1.5;
      f.frequency.setValueAtTime(3000, t);
      f.frequency.exponentialRampToValueAtTime(500, t + 0.15);
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.16, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
      n.connect(f); f.connect(g); g.connect(this.master);
      n.start(t); n.stop(t + 0.18);
    }
  },

  fillStart() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    this.fillStop();
    const t = this.now();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(200, t);
    o.frequency.linearRampToValueAtTime(900, t + 3);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.16, t + 0.05);
    o.connect(g); g.connect(this.master);
    o.start(t);
    this._fill = { o, g };
  },

  fillStop() {
    if (!this._fill) return;
    const t = this.now();
    const { o, g } = this._fill;
    try {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(Math.max(0.001, g.gain.value), t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
      o.stop(t + 0.1);
    } catch (e) {}
    this._fill = null;
  },

  squawk(t, kind) {
    if (kind === "alt") {
      this.tone(t, 990, 0.09, "square", 0.2);
      this.tone(t + 0.11, 1320, 0.14, "square", 0.2);
    } else {
      this.tone(t, 320, 0.13, "sawtooth", 0.22);
    }
  },

  marchCue(t) {
    this.blok(t, 1046);
    this.blok(t + 0.09, 1318);
  },

  whistle(t, low) {
    const p = low ? 1318 : 2093;
    this.tone(t, p, 0.12, "sine", 0.28);
    this.tone(t + 0.14, p * 0.75, 0.22, "sine", 0.28);
  },

  clap(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (!n.buffer) return;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass"; f.frequency.value = 1300; f.Q.value = 1.2;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.4, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    n.connect(f); f.connect(g); g.connect(this.master);
    n.start(t); n.stop(t + 0.1);
  },

  tick(t, pitch) {
    this.tone(t, pitch || 1800, 0.04, "square", 0.2);
  },

  chomp(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (n.buffer) {
      const f = this.ctx.createBiquadFilter();
      f.type = "lowpass"; f.frequency.value = 900;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      n.connect(f); f.connect(g); g.connect(this.master);
      n.start(t); n.stop(t + 0.14);
    }
    this.tone(t, 180, 0.1, "sine", 0.2);
  },

  zap(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(1400, t);
    o.frequency.exponentialRampToValueAtTime(180, t + 0.18);
    g.gain.setValueAtTime(0.25, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 0.2);
  },

  boom(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (!n.buffer) return;
    const f = this.ctx.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 500;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    n.connect(f); f.connect(g); g.connect(this.master);
    n.start(t); n.stop(t + 0.42);
  },

  bell(t, pitch) {
    const p = pitch || 1568;
    this.tone(t, p, 0.5, "sine", 0.26);
    this.tone(t, p * 2.01, 0.3, "sine", 0.09);
  },

  sparkle(t) {
    this.tone(t, 1046, 0.08, "sine", 0.2);
    this.tone(t + 0.06, 1318, 0.08, "sine", 0.2);
    this.tone(t + 0.12, 1568, 0.14, "sine", 0.22);
    this.tone(t + 0.18, 2093, 0.2, "sine", 0.18);
  },

  scratch(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (!n.buffer) return;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass"; f.Q.value = 3;
    f.frequency.setValueAtTime(600, t);
    f.frequency.linearRampToValueAtTime(2400, t + 0.12);
    f.frequency.linearRampToValueAtTime(500, t + 0.24);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.22, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
    n.connect(f); f.connect(g); g.connect(this.master);
    n.start(t); n.stop(t + 0.28);
  },

  punch(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(50, t + 0.08);
    g.gain.setValueAtTime(0.55, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    o.connect(g); g.connect(this.master);
    o.start(t); o.stop(t + 0.16);
  },

  swish(t) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    t = this.safeTime(t);
    const n = this.ctx.createBufferSource();
    n.buffer = this.noiseBuffer();
    if (!n.buffer) return;
    const f = this.ctx.createBiquadFilter();
    f.type = "bandpass"; f.Q.value = 1.5;
    f.frequency.setValueAtTime(2500, t);
    f.frequency.exponentialRampToValueAtTime(600, t + 0.12);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.16, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    n.connect(f); f.connect(g); g.connect(this.master);
    n.start(t); n.stop(t + 0.16);
  },

  choirStart() {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    this.choirStop();
    const t = this.now();
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.09, t + 0.2);
    const oscs = [261.63, 329.63, 392].map(fr => {
      const o = this.ctx.createOscillator();
      o.type = "triangle";
      o.frequency.value = fr;
      o.connect(g);
      o.start(t);
      return o;
    });
    g.connect(this.master);
    this._choir = { oscs, g };
  },

  choirStop() {
    if (!this._choir) return;
    const t = this.now();
    const { oscs, g } = this._choir;
    try {
      g.gain.cancelScheduledValues(t);
      g.gain.setValueAtTime(Math.max(0.001, g.gain.value), t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      oscs.forEach(o => o.stop(t + 0.18));
    } catch (e) {}
    this._choir = null;
  },

  /* ---------- UI 交互音效 (支持文化定制) ---------- */

  playUI(kind, cult) {
    if (!this.ctx) this.init();
    if (!this.ctx) return;
    cult = this._getCult(cult);
    const now = this.now();
    if (kind === "start") {
      // 开始游戏：各文化招牌三连音
      if (cult === "zh") {
        this.ethnicDrum(now, "tanggu", 0.8);
        this.pluck(now + 0.04, 523.25, 0.4, 0.25, "guzheng"); // 宫 C5
        this.pluck(now + 0.10, 659.25, 0.4, 0.25, "guzheng"); // 角 E5
        this.pluck(now + 0.16, 783.99, 0.6, 0.28, "guzheng"); // 徵 G5
      } else if (cult === "ja") {
        this.ethnicDrum(now, "taiko", 0.85);
        this.pluck(now + 0.04, 587.33, 0.35, 0.26, "shamisen");
        this.pluck(now + 0.10, 622.25, 0.35, 0.26, "shamisen");
        this.pluck(now + 0.16, 783.99, 0.5, 0.28, "shamisen");
      } else if (cult === "es") {
        // 西班牙：古典吉他三和弦
        this.kick(now);
        this.pluck(now + 0.04, 493.88, 0.35, 0.24, "guitar"); // B4
        this.pluck(now + 0.10, 523.25, 0.35, 0.24, "guitar"); // C5
        this.pluck(now + 0.16, 659.25, 0.5, 0.26, "guitar"); // E5
      } else if (cult === "ar") {
        // 阿拉伯：达布卡手鼓 + 席贾兹调式乌德琴
        this.ethnicDrum(now, "darbuka_doum", 0.85);
        this.pluck(now + 0.04, 293.66, 0.35, 0.22, "oud"); // D4
        this.pluck(now + 0.10, 369.99, 0.35, 0.22, "oud"); // F#4
        this.pluck(now + 0.16, 440.00, 0.55, 0.24, "oud"); // A4
      } else if (cult === "hi") {
        // 印度：塔布拉左手大鼓弯音 + 晨曲拉格西塔琴
        this.ethnicDrum(now, "tabla_bayan", 0.9);
        this.pluck(now + 0.04, 261.63, 0.4, 0.2, "sitar"); // Sa C4
        this.pluck(now + 0.10, 329.63, 0.4, 0.2, "sitar"); // Ga E4
        this.pluck(now + 0.16, 392.00, 0.6, 0.22, "sitar"); // Pa G4
      } else { // en
        this.kick(now);
        this.rhodes(now + 0.04, 523.25, 0.35, 0.24);
        this.rhodes(now + 0.10, 659.25, 0.35, 0.24);
        this.rhodes(now + 0.16, 783.99, 0.55, 0.26);
      }
    } else if (kind === "select") {
      if (cult === "zh") {
        this.pluck(now, 659.25, 0.35, 0.22, "guzheng");
        this.pluck(now + 0.06, 880.00, 0.4, 0.22, "guzheng");
      } else if (cult === "ja") {
        this.pluck(now, 587.33, 0.3, 0.24, "shamisen");
        this.pluck(now + 0.06, 783.99, 0.35, 0.24, "shamisen");
      } else if (cult === "es") {
        this.pluck(now, 659.25, 0.3, 0.22, "guitar");
        this.pluck(now + 0.06, 880.00, 0.35, 0.22, "guitar");
      } else if (cult === "ar") {
        this.pluck(now, 293.66, 0.3, 0.2, "oud");
        this.pluck(now + 0.06, 369.99, 0.35, 0.2, "oud");
      } else if (cult === "hi") {
        this.pluck(now, 261.63, 0.35, 0.2, "sitar");
        this.pluck(now + 0.06, 329.63, 0.4, 0.2, "sitar");
      } else {
        this.rhodes(now, 659.25, 0.3, 0.2);
        this.rhodes(now + 0.06, 880.00, 0.35, 0.2);
      }
    } else if (kind === "lang") {
      if (cult === "zh") {
        this.pluck(now, 783.99, 0.4, 0.24, "guzheng");
        this.pluck(now + 0.05, 1046.5, 0.5, 0.24, "guzheng");
      } else if (cult === "ja") {
        this.pluck(now, 783.99, 0.35, 0.25, "shamisen");
        this.ethnicDrum(now + 0.05, "woodblock", 0.8);
      } else if (cult === "es") {
        this.pluck(now, 659.25, 0.35, 0.24, "guitar");
        this.pluck(now + 0.05, 880.00, 0.4, 0.24, "guitar");
      } else if (cult === "ar") {
        this.ethnicDrum(now, "darbuka_doum", 0.7);
        this.pluck(now + 0.05, 369.99, 0.35, 0.22, "oud");
        this.pluck(now + 0.10, 440.00, 0.45, 0.22, "oud");
      } else if (cult === "hi") {
        this.ethnicDrum(now, "tabla_bayan", 0.8);
        this.pluck(now + 0.05, 329.63, 0.4, 0.22, "sitar");
        this.pluck(now + 0.11, 392.00, 0.5, 0.22, "sitar");
      } else {
        this.rhodes(now, 783.99, 0.3, 0.2);
        this.rhodes(now + 0.05, 1046.5, 0.4, 0.2);
      }
    } else if (kind === "back") {
      this.tone(now, 440, 0.06, "sine", 0.15);
      this.tone(now + 0.04, 330, 0.08, "sine", 0.15);
    } else {
      this.tone(now, 880, 0.04, "sine", 0.14);
    }
  }
};
