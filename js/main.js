/* main.js — 启动、屏幕流转（标题 → 选关 → 难度选择 → 游戏 → 结算）、输入绑定
 *
 * 按键映射：
 *   主键（击打/踏步/灌油）：空格 / 回车 / J / 点击画面
 *   副键（双键关专用）：F / K
 *   Esc：退出到选关
 * 难度：easy 简单 / normal 普通 / hard 困难，各关最佳评级按 关卡+模式 分别记录。
 */
'use strict';

const Main = {
  state: 'title',
  canvas: null,
  ctx: null,
  currentLevel: null,
  currentMode: 'easy',
  best: {}, // key: levelId:mode → 最佳评级
  isTouch: ('ontouchstart' in window) || navigator.maxTouchPoints > 0,

  MAIN_KEYS: ['Space', 'Enter', 'KeyJ'],
  ALT_KEYS: ['KeyF', 'KeyK'],
  getModeName(m) {
    return (typeof I18n !== 'undefined') ? I18n.t('diff_' + m) : (m === 'easy' ? '简单' : m === 'normal' ? '普通' : m === 'hard' ? '困难' : '地狱');
  },

  init() {
    // 强制关闭浏览器跨刷新滚动恢复，并重置滚动位置为 (0,0)
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    if (typeof I18n !== 'undefined') I18n.init();
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.classList.toggle('is-touch', this.isTouch);
    this.fitCanvas();
    window.addEventListener('resize', () => this.fitCanvas());
    window.addEventListener('orientationchange', () => setTimeout(() => this.fitCanvas(), 100));
    window.addEventListener('load', () => this.fitCanvas());
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this.fitCanvas());
      const app = document.getElementById('app');
      if (app) ro.observe(app);
    }

    // 语言切换栏监听
    this.setupLanguageSwitcher();

    // 横屏提示的两个选择：强制横屏（CSS 旋转）/ 竖屏继续
    document.getElementById('btn-force-landscape').addEventListener('click', () => {
      document.body.classList.add('force-landscape');
      this.fitCanvas();
    });
    document.getElementById('btn-portrait-continue').addEventListener('click', () => {
      document.body.classList.add('allow-portrait');
      this.fitCanvas();
    });

    // 浏览器自动播放策略：在任何可能的用户手势中解锁并激活 AudioContext
    const unlock = () => { AudioEngine.unlock(); };
    ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      window.addEventListener(evt, unlock, { passive: true });
    });

    document.getElementById('btn-start').addEventListener('click', async () => {
      await AudioEngine.unlock();
      AudioEngine.playUI('start');
      this.showSelect();
    });
    const btnSound = document.getElementById('btn-sound-check');
    if (btnSound) {
      btnSound.addEventListener('click', async () => {
        await AudioEngine.unlock();
        AudioEngine.playUI('start');
        btnSound.textContent = (typeof I18n !== 'undefined') ? I18n.t('sound_ready') : '🔊 声音已开启！';
        btnSound.classList.add('ready');
      });
    }
    document.getElementById('btn-retry').addEventListener('click', () => {
      AudioEngine.unlock();
      AudioEngine.playUI('tap');
      if (this.currentLevel) this.startLevel(this.currentLevel, this.currentMode);
    });
    document.getElementById('btn-back').addEventListener('click', () => {
      AudioEngine.playUI('back');
      this.showSelect();
    });
    document.getElementById('btn-diff-back').addEventListener('click', () => {
      AudioEngine.playUI('back');
      this.showSelect();
    });
    // 难度按钮
    document.querySelectorAll('.btn-diff').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.unlock();
        AudioEngine.playUI('tap');
        this.startLevel(this.currentLevel, btn.dataset.mode);
      });
    });

    // 生成选关卡片
    this.renderLevelCards();
    this.updateLanguageUI();

    // 键盘输入
    window.addEventListener('keydown', async (e) => {
      AudioEngine.unlock();
      if (e.repeat) return;
      if (this.MAIN_KEYS.includes(e.code)) {
        e.preventDefault();
        if (this.state === 'game') Game.press('main');
        else if (this.state === 'title') {
          await AudioEngine.unlock();
          AudioEngine.playUI('start');
          this.showSelect();
        }
      } else if (this.ALT_KEYS.includes(e.code)) {
        e.preventDefault();
        if (this.state === 'game' && Game.level && Game.level.usesAlt) Game.press('alt');
      } else if (e.code === 'Escape') {
        if (this.state === 'game') { Game.stop(); this.showSelect(); }
        else if (this.state === 'diff') this.showSelect();
      }
    });
    window.addEventListener('keyup', (e) => {
      if (this.MAIN_KEYS.includes(e.code) && this.state === 'game') Game.release('main');
    });
    // 触屏 / 鼠标：按 pointerId 跟踪（支持多点触控与长按）
    this.touchKeys = new Map();
    this.canvas.addEventListener('pointerdown', (e) => {
      if (this.state !== 'game') return;
      e.preventDefault();
      let key = 'main';
      // 双键关的触屏分区：左半屏 = 副键(F)，右半屏 = 主键(空格)
      if (this.isTouch && Game.level && Game.level.usesAlt) {
        const rect = this.canvas.getBoundingClientRect();
        if (document.body.classList.contains('force-landscape')) {
          // 画面顺时针旋转 90°：用户看到的"左半屏"对应原始画布的下半部分
          key = (e.clientY - rect.top) > rect.height / 2 ? 'alt' : 'main';
        } else {
          key = (e.clientX - rect.left) < rect.width / 2 ? 'alt' : 'main';
        }
      }
      this.touchKeys.set(e.pointerId, key);
      Game.press(key);
    }, { passive: false });
    const releasePointer = (e) => {
      if (!this.touchKeys.has(e.pointerId)) return;
      const key = this.touchKeys.get(e.pointerId);
      this.touchKeys.delete(e.pointerId);
      if (this.state === 'game' && key === 'main') Game.release('main');
    };
    window.addEventListener('pointerup', releasePointer);
    window.addEventListener('pointercancel', releasePointer); // iOS 长按触发 callout 时会走这里
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

    // 渲染主循环
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (this.state === 'game') {
        Game.update(dt);
        Game.draw(this.ctx);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  },

  fitCanvas() {
    // 采用双重安全回退尺寸，杜绝 DOM 尚未完成计算或被意外折叠为 0 的情况
    const app = document.getElementById('app');
    const w = Math.max(window.innerWidth || 0, app ? app.clientWidth : 0, 320);
    const h = Math.max(window.innerHeight || 0, app ? app.clientHeight : 0, 240);
    const scale = Math.min(w / 960, h / 540) * 0.96;
    if (this.canvas) {
      this.canvas.style.width = Math.max(160, 960 * scale) + 'px';
      this.canvas.style.height = Math.max(90, 540 * scale) + 'px';
    }
  },

  show(id) {
    for (const s of ['screen-title', 'screen-select', 'screen-result', 'screen-diff']) {
      document.getElementById(s).classList.toggle('hidden', s !== id);
    }
    document.getElementById('hud-tip').classList.toggle('hidden', id !== null);
  },

  setupLanguageSwitcher() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        AudioEngine.unlock();
        const lang = btn.dataset.lang;
        if (lang && typeof I18n !== 'undefined') {
          I18n.setLanguage(lang);
          this.updateLanguageUI();
        }
        AudioEngine.playUI('lang', lang);
      });
    });
    window.addEventListener('languagechanged', () => this.updateLanguageUI());
  },

  updateLanguageUI() {
    if (typeof I18n === 'undefined') return;
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === I18n.lang);
    });

    this.renderLevelCards();

    if (this.state === 'diff' && this.currentLevel) {
      document.getElementById('diff-title').textContent = this.currentLevel.name;
      document.getElementById('diff-desc').textContent = this.currentLevel.desc;
      this.updateDiffBest(this.currentLevel);
    }

    if (this.state === 'result' && this._lastStats) {
      this.updateResultUI(this._lastStats);
    }
  },

  renderLevelCards() {
    const list = document.getElementById('level-list');
    list.innerHTML = '';
    for (const lv of Levels) {
      const btn = document.createElement('button');
      btn.className = 'level-card';
      btn.innerHTML =
        '<div class="lv-name">' + lv.name + '</div>' +
        '<div class="lv-desc">' + lv.desc + '</div>' +
        '<div class="lv-best" data-lv="' + lv.id + '"></div>';
      btn.addEventListener('click', () => {
        AudioEngine.unlock();
        AudioEngine.playUI('select');
        this.showDiff(lv);
      });
      list.appendChild(btn);
    }
    this.renderBest();
  },

  showSelect() {
    this.state = 'select';
    this.show('screen-select');
    this.renderBest();
    // 离开游戏时退出全屏
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  },

  // 难度选择
  showDiff(lv) {
    this.currentLevel = lv;
    this.state = 'diff';
    document.getElementById('diff-title').textContent = lv.name;
    document.getElementById('diff-desc').textContent = lv.desc;
    this.updateDiffBest(lv);
    this.show('screen-diff');
  },

  updateDiffBest(lv) {
    const parts = [];
    for (const m of ['easy', 'normal', 'hard', 'hell']) {
      const b = this.best[lv.id + ':' + m];
      parts.push(this.getModeName(m) + ' ' + (b || '—'));
    }
    const prefix = (typeof I18n !== 'undefined') ? I18n.t('best_label') : '最佳：';
    document.getElementById('diff-best').textContent = prefix + parts.join(' · ');
  },

  renderBest() {
    const prefix = (typeof I18n !== 'undefined') ? I18n.t('best_label') : '最佳：';
    for (const lv of Levels) {
      const el = document.querySelector('.lv-best[data-lv="' + lv.id + '"]');
      if (!el) continue;
      const parts = [];
      for (const m of ['easy', 'normal', 'hard', 'hell']) {
        const b = this.best[lv.id + ':' + m];
        if (b) parts.push(this.getModeName(m) + ' ' + b);
      }
      el.textContent = parts.length ? prefix + parts.join(' · ') : '';
    }
  },

  async startLevel(lv, mode) {
    this.currentLevel = lv;
    this.currentMode = mode || 'easy';
    this.state = 'game';
    this.show(null);

    // 1. 优先解锁并唤醒音频引擎（必须在 requestFullscreen 之前，确保手势凭据优先授予 Web Audio）
    await AudioEngine.unlock();

    // 等待 AudioContext 真正进入 running 状态（最多等待 300ms 避免过长阻塞）
    if (AudioEngine.ctx && AudioEngine.ctx.state !== 'running') {
      try {
        await Promise.race([
          AudioEngine.unlock(),
          new Promise(r => setTimeout(r, 300))
        ]);
      } catch (e) {}
    }

    // 每关的操作提示
    document.getElementById('hud-tip').textContent =
      lv.hint || (typeof I18n !== 'undefined' ? I18n.t('hud_tip_default') : '空格 / 点击 = 击打 · Esc = 退出');
    // 触屏：双键关显示左右分区提示
    const zl = document.getElementById('zone-left');
    const zr = document.getElementById('zone-right');
    if (this.isTouch && lv.usesAlt) {
      zl.textContent = lv.altLabel || 'F';
      zr.textContent = lv.mainLabel ? (lv.mainLabel === '空格' && typeof I18n !== 'undefined' ? I18n.t('key_space') : lv.mainLabel) : ((typeof I18n !== 'undefined') ? I18n.t('key_space') : '空格');
      zl.classList.remove('hidden');
      zr.classList.remove('hidden');
    } else {
      zl.classList.add('hidden');
      zr.classList.add('hidden');
    }
    // 2. 触屏设备尝试进入全屏（静默兜底，绝不影响音频与核心循环）
    if (this.isTouch) {
      try {
        const el = document.documentElement;
        if (el.requestFullscreen) {
          el.requestFullscreen().catch(() => {});
        }
        if (screen.orientation && screen.orientation.lock) {
          screen.orientation.lock('landscape').catch(() => {});
        }
      } catch (e) {}
    }

    // 3. 启动关卡核心循环
    Game.start(lv, (stats) => this.showResult(stats), this.currentMode);
  },

  showResult(stats) {
    this.state = 'result';
    this._lastStats = stats;
    const order = ['C', 'B', 'A', 'S'];
    const key = stats.level.id + ':' + this.currentMode;
    const prev = this.best[key];
    if (!prev || order.indexOf(stats.rank) > order.indexOf(prev)) {
      this.best[key] = stats.rank;
    }
    this.updateResultUI(stats);
    this.show('screen-result');
  },

  updateResultUI(stats) {
    const rankEl = document.getElementById('result-rank');
    rankEl.textContent = stats.rank;
    rankEl.className = 'rank-' + stats.rank;
    const suffix = (typeof I18n !== 'undefined') ? (' ' + I18n.t('mode_suffix')) : '模式';
    document.getElementById('result-mode').textContent =
      stats.level.name + ' · ' + this.getModeName(this.currentMode) + suffix;
    document.getElementById('result-comment').textContent = (typeof I18n !== 'undefined') ? I18n.getRankComment(stats.rank) : stats.comment;
    const accLabel = (typeof I18n !== 'undefined') ? I18n.t('acc_label') : '命中率';
    const comboLabel = (typeof I18n !== 'undefined') ? I18n.t('max_combo_label') : '最大连击';
    document.getElementById('result-stats').innerHTML =
      accLabel + ' <b>' + Math.round(stats.acc * 100) + '%</b><br>' +
      'PERFECT <b>' + stats.judges.perfect + '</b> · GOOD <b>' + stats.judges.good + '</b> · MISS <b>' + stats.judges.miss + '</b><br>' +
      comboLabel + ' <b>' + stats.maxCombo + '</b>';
  }
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => Main.init());
} else {
  Main.init();
}
