/* i18n.js — 多语言与文化主题系统 (Internationalization & Cultural Themes)
 * 支持语言 / 文化：
 *   zh: 中文 · 中国文化 (功夫/少林/水墨道场/禅意/包子/茶陶)
 *   en: English · Western/US Culture (Wild West/Americana/Diner/Broadway/Cheeseburger/Comics)
 *   ja: 日本語 · 日本文化 (サムライ/和室/富士山/桜/団子/おにぎり/魔法少女)
 *   es: Español · Cultura Hispana/México (Lucha Libre/Fiesta/Papel Picado/Taquería/Tacos/Piñata)
 */
'use strict';

const I18n = {
  SUPPORTED: ['zh', 'en', 'ja', 'es'],
  DEFAULT: 'zh',
  lang: 'zh',

  // 语言显示名称与国旗
  LANGUAGES: {
    zh: { name: '中文', flag: '🇨🇳', label: '中文' },
    en: { name: 'English', flag: '🇺🇸', label: 'English' },
    ja: { name: '日本語', flag: '🇯🇵', label: '日本語' },
    es: { name: 'Español', flag: '🇪🇸', label: 'Español' }
  },

  // UI 字典
  dict: {
    zh: {
      game_title: '节奏之王',
      subtitle: 'THE KING OF RHYTHM',
      hint_start: '跟着音乐节拍，在正确的瞬间按键！',
      btn_start: '开始游戏',
      hint_audio: '（首次点击会开启声音，请调高音量 🔊）',
      btn_sound_check: '🔊 试听音效',
      sound_ready: '🔊 声音已开启！',
      select_level: '选择关卡',
      select_diff: '选择难度',
      btn_retry: '再来一次',
      btn_back: '返回选关',
      btn_diff_back: '返回',
      diff_easy: '简单',
      diff_normal: '普通',
      diff_hard: '困难',
      best_label: '最佳：',
      mode_suffix: '模式',
      acc_label: '命中率',
      max_combo_label: '最大连击',
      hud_tip_default: '空格 / 点击 = 击打 · Esc = 退出',
      key_space: '空格',
      rotate_hint: '建议横屏游玩<br>浏览器不支持横屏也没关系：',
      btn_force_landscape: '强制横屏显示',
      btn_portrait_continue: '竖屏继续玩',

      // 判定浮字与提示
      judge_perfect: 'PERFECT!',
      judge_good: 'GOOD',
      judge_miss: 'MISS',
      judge_whiff: '挥空…',
      judge_wrong_key: '按错了!',
      judge_early: '太早松开!',
      judge_late: '太晚松开!',
      judge_unreleased: '没松开!',
      combo: '连击!',

      // 结算评语
      rank_S: '太出色了！节奏感爆棚！',
      rank_A: '相当不错！',
      rank_B: '还行，再加把劲！',
      rank_C: '嗯……多练练吧。',

      // 通用画布词
      ready: '预备…',
      start: '开始！',
      listen: '仔细听…',
      your_turn: '轮到你了！',
      teacher: '老师',
      you: '你',
      you_arrow: '▼ 你',
      captain: '队长',
      owner: '主人',
      round_info: '第 {r} / {total} 轮',
      on_beat: '正拍',
      off_beat: '反拍',
      march_tip: '跟着全队踩：低「咚」=正拍，高「哒」=反拍！',
      march_rest: '休息！听：接下来是【{mode}】',
      fill_tip: '按住灌油，灯满松开！',
      birds_peck: '突！突！突！',
      birds_stretch: '昂——！',
      birds_tip_peck: '点按空格 = 啄米 ×3',
      birds_tip_stretch: '按住再松开 = 昂首',
      birds_song_tip: '听队长唱歌：「突突突」点按 ×3，「昂——」按住再松开！',
      spaceball_hit: '挥棒！',
      tap_da: '哒',
      sing: '唱！',
      stop: '停！',
      packing_candy: '= 空格',
      packing_bug: '= F',
      monk_count: '{n} 个！',
      monk_word: '禅',
      mahou_tip: '听咒语「pi-ko-pon」：咒停的瞬间按空格，花开！',
      rat_crouch: '蹲！',
      rat_hold: '按住！',
      rat_go: '冲！',
      rat_tip: '听口令：「蹲！」按住蓄力，真哨声松开冲刺！',
      rat_resist: '忍住！',
      bell_hi: '高音=1拍',
      bell_mid: '中音=1.5拍',
      bell_lo: '低音=2拍',
      bell_hi_full: '高音铃 = 1 拍后跳',
      bell_mid_full: '中音铃 = 1.5 拍后跳',
      bell_lo_full: '低音铃 = 2 拍后跳',
      dj_hold: '按住！',
      dj_release: '松开！',
      dj_yo: 'YO!',
      ringside_tri: 'pa-pa-pow!',
      ringside_single: 'pow!',
      ringside_hold: 'hooold-pow!',
      ringside_sub_combo: '三连击！',
      ringside_sub_combo4: '四连击！',
      ringside_sub_single: '单击！',
      ringside_sub_hold: '按住重拳！',
      remix_ready: '全员集结 · 混曲预备…',
      frisbee_count: '心里默数…',
      frisbee_go: '走！',

      // 关卡信息 (1~21)
      lv_karate_name: '第 1 关 · 飞物击打',
      lv_karate_desc: '物品飞到圆圈的一瞬间按【空格】击碎！后半段会出现半拍（八分音符）节奏。',
      lv_karate_hint: '物品到圆圈时按空格！',
      lv_echo_name: '第 2 关 · 节奏模仿',
      lv_echo_desc: '先听老师演奏一段节奏，灯亮结束后【原样】敲出来！注意休止符。',
      lv_pong_name: '第 3 关 · 节奏乒乓',
      lv_pong_desc: '球落到己方球拍时按键回击；间隔 1 拍的是快速球（红色）。',
      lv_march_name: '第 4 关 · 齐步走',
      lv_march_desc: '听队伍踏步声与换拍指令：正拍=低咚，反拍=高哒。',
      lv_fill_name: '第 5 关 · 灌油机器人',
      lv_fill_desc: '按住空格注入能量，灯满时松开！',
      lv_birds_name: '第 6 关 · 蓝鸟合唱团',
      lv_birds_desc: '听队长唱歌做动作：「突突突」点按 ×3，「昂——」按住再松开！',
      lv_clappy_name: '第 7 关 · 拍手三人组',
      lv_clappy_desc: '听前两人拍手节奏，在第三拍准时补齐拍手！',
      lv_spaceball_name: '第 8 关 · 太空棒球',
      lv_spaceball_desc: '听投球声与速度，在球到达击球点时准确挥棒！',
      lv_crop_name: '第 9 关 · 收割庄稼',
      lv_crop_desc: '蔬菜冒头后下一拍按键收割，大南瓜要按住拔起！',
      lv_shooter_name: '第 10 关 · 宇宙射击',
      lv_shooter_desc: '听敌机警报声，到达准星瞬间开火射击！',
      lv_taptrial_name: '第 11 关 · 踢踏舞',
      lv_taptrial_desc: '跟上节奏做踢踏舞步，注意三连音变化！',
      lv_glee_name: '第 12 关 · 合唱团',
      lv_glee_desc: '同伴开口领唱按住，同伴收声松开合唱！',
      lv_monk_name: '第 13 关 · 贪吃和尚',
      lv_monk_desc: '听数吃包子：唱几个音就吃几下（半拍一下）！',
      lv_monk_hint: '空格 / 点击 = 吃 · Esc = 退出',
      lv_packing_name: '第 14 关 · 打包小能手',
      lv_packing_desc: '接住传送带上的糖果（空格），拍走捣乱的小虫（F 键）！',
      lv_mahou_name: '第 15 关 · 魔法使',
      lv_mahou_desc: '听咒语节奏，在咒停的瞬间按键让鲜花盛开！',
      lv_showtime_name: '第 16 关 · 企鹅跳台',
      lv_showtime_desc: '听铃起跳：高音铃 1 拍后跳，低音铃 2 拍后跳！',
      lv_ratrace_name: '第 17 关 · 老鼠冲刺',
      lv_ratrace_desc: '听口令蹲下蓄力，听到真哨声瞬间松开冲刺！',
      lv_dj_name: '第 18 关 · DJ 学校',
      lv_dj_desc: '按住停止唱片，听「YO!」口令准时松开回放！',
      lv_ringside_name: '第 19 关 · 拳击台',
      lv_ringside_desc: '听记者采访口令：连续出拳、重击连招！',
      lv_frisbee_name: '第 20 关 · 小狗飞盘',
      lv_frisbee_desc: '听抛出音高默数拍数起跳，空中咬住飞盘！',
      lv_remix_name: '第 21 关 · 大团圆 Remix',
      lv_remix_desc: '20 种玩法大混曲！段首标题卡告诉你接下来是谁，跟紧别掉链子！',

      // Remix 标题卡
      remix_karate: '空手道！',
      remix_echo: '节奏模仿！',
      remix_pong: '节奏乒乓！',
      remix_marchOn: '齐步走！',
      remix_marchOff: '反拍齐步走！',
      remix_fill: '灌油！',
      remix_birds: '蓝鸟！',
      remix_clappy: '拍手三人组！',
      remix_spaceball: '太空棒球！',
      remix_crop: '收割庄稼！',
      remix_shooter: '宇宙射击！',
      remix_taptrial: '踢踏舞！',
      remix_glee: '合唱团！',
      remix_monk: '吃包子！',
      remix_packing: '打包！',
      remix_mahou: '魔法使！',
      remix_showtime: '企鹅跳台！',
      remix_ratrace: '老鼠冲刺！',
      remix_dj: 'DJ 学校！',
      remix_ringside: '拳击台！',
      remix_finale: '终章！'
    },

    en: {
      game_title: 'RHYTHM KING',
      subtitle: 'THE KING OF RHYTHM',
      hint_start: 'Follow the rhythm and hit the keys at the perfect moment!',
      btn_start: 'START GAME',
      hint_audio: '(First click enables audio, please turn up volume 🔊)',
      btn_sound_check: '🔊 Test Sound',
      sound_ready: '🔊 Sound Ready!',
      select_level: 'Select Level',
      select_diff: 'Select Difficulty',
      btn_retry: 'Play Again',
      btn_back: 'Level Select',
      btn_diff_back: 'Back',
      diff_easy: 'Easy',
      diff_normal: 'Normal',
      diff_hard: 'Hard',
      best_label: 'Best: ',
      mode_suffix: 'Mode',
      acc_label: 'Accuracy',
      max_combo_label: 'Max Combo',
      hud_tip_default: 'Space / Click = Hit · Esc = Exit',
      key_space: 'Space',
      rotate_hint: 'Landscape mode is recommended.<br>Works in portrait too:',
      btn_force_landscape: 'Force Landscape',
      btn_portrait_continue: 'Continue Portrait',

      judge_perfect: 'PERFECT!',
      judge_good: 'GOOD',
      judge_miss: 'MISS',
      judge_whiff: 'WHIFF…',
      judge_wrong_key: 'WRONG KEY!',
      judge_early: 'TOO EARLY!',
      judge_late: 'TOO LATE!',
      judge_unreleased: 'HELD TOO LONG!',
      combo: 'COMBO!',

      rank_S: 'Incredible! Flawless rhythm sense!',
      rank_A: 'Outstanding performance!',
      rank_B: 'Pretty good, keep grooving!',
      rank_C: 'Keep practicing, you got this!',

      ready: 'Ready…',
      start: 'START!',
      listen: 'Listen closely…',
      your_turn: 'Your turn!',
      teacher: 'Teacher',
      you: 'You',
      you_arrow: '▼ You',
      captain: 'Captain',
      owner: 'Owner',
      round_info: 'Round {r} / {total}',
      on_beat: 'On-beat',
      off_beat: 'Off-beat',
      march_tip: 'Step with team: Low "dum" = on-beat, High "ha" = off-beat!',
      march_rest: 'Break! Listen: Next is [{mode}]',
      fill_tip: 'Hold Space to fill energy, release when full!',
      birds_peck: 'Peck! Peck! Peck!',
      birds_stretch: 'Streeeetch!',
      birds_tip_peck: 'Tap Space = Peck ×3',
      birds_tip_stretch: 'Hold & Release = Stretch',
      birds_song_tip: 'Listen to Captain: "Peck-peck-peck" tap ×3, "Streeeetch" hold & release!',
      spaceball_hit: 'Swing!',
      tap_da: 'Tap',
      sing: 'Sing!',
      stop: 'Stop!',
      packing_candy: '= Space',
      packing_bug: '= F',
      monk_count: '{n} burger{s}!',
      monk_word: 'DINER',
      mahou_tip: 'Listen to spell "pi-ko-pon": Hit Space the instant it stops to bloom!',
      rat_crouch: 'Crouch!',
      rat_hold: 'Hold!',
      rat_go: 'GO!',
      rat_tip: 'Listen closely: "Crouch!" to charge, release on the real whistle!',
      rat_resist: 'Wait!',
      bell_hi: 'High=1b',
      bell_mid: 'Mid=1.5b',
      bell_lo: 'Low=2b',
      bell_hi_full: 'High Bell = Jump 1 beat',
      bell_mid_full: 'Mid Bell = Jump 1.5 beats',
      bell_lo_full: 'Low Bell = Jump 2 beats',
      dj_hold: 'HOLD!',
      dj_release: 'RELEASE!',
      dj_yo: 'YO!',
      ringside_tri: 'pa-pa-pow!',
      ringside_single: 'pow!',
      ringside_hold: 'hooold-pow!',
      ringside_sub_combo: 'Triple Punch!',
      ringside_sub_combo4: '4 Punches!',
      ringside_sub_single: 'Single Punch!',
      ringside_sub_hold: 'Hold Heavy Punch!',
      remix_ready: 'All-Stars Ready... Remix!',
      frisbee_count: 'Count in your head…',
      frisbee_go: 'Go!',

      lv_karate_name: 'Lv 1 · Strike Master',
      lv_karate_desc: 'Shatter flying items right when they hit the target circle! Look out for half-beat rhythms.',
      lv_karate_hint: 'Press Space when the item reaches the target circle!',
      lv_echo_name: 'Lv 2 · Rhythm Echo',
      lv_echo_desc: 'Listen to the maestro play a rhythm, then reproduce it note for note! Watch out for rests.',
      lv_pong_name: 'Lv 3 · Rhythm Ping Pong',
      lv_pong_desc: 'Smash the ball when it reaches your paddle. Red balls are high-speed fastballs!',
      lv_march_name: 'Lv 4 · Lockstep March',
      lv_march_desc: 'March in sync with the squad: Low thud = on-beat, high snap = off-beat!',
      lv_fill_name: 'Lv 5 · Energy Fillbots',
      lv_fill_desc: 'Hold Space to inject energy into the robot, release the instant the meter fills!',
      lv_birds_name: 'Lv 6 · Blue Birds Choir',
      lv_birds_desc: 'Follow the captain: "Peck-peck-peck" tap Space 3 times, "Streeetch" hold and release!',
      lv_clappy_name: 'Lv 7 · The Clappy Trio',
      lv_clappy_desc: 'Listen to the first two claps, then land the third clap in perfect tempo!',
      lv_spaceball_name: 'Lv 8 · Space Baseball',
      lv_spaceball_desc: 'Listen to the pitcher pitch: swing right as the ball enters the strike zone!',
      lv_crop_name: 'Lv 9 · Farm Stomp',
      lv_crop_desc: 'Harvest crops on the beat as they pop up; hold and pull giant pumpkins!',
      lv_shooter_name: 'Lv 10 · Space Defender',
      lv_shooter_desc: 'Listen to the radar warning beep and shoot alien invaders at the crosshair!',
      lv_taptrial_name: 'Lv 11 · Tap Trial',
      lv_taptrial_desc: 'Follow the monkeys tap dancing, master triplets and double taps!',
      lv_glee_name: 'Lv 12 · Glee Club',
      lv_glee_desc: 'Open wide and hold when teammates sing, close your mouth when they stop!',
      lv_monk_name: 'Lv 13 · Munchy Diner',
      lv_monk_desc: 'Listen to the bird sing the count, then gobble down burgers on the half-beat!',
      lv_monk_hint: 'Space / Click = Eat · Esc = Exit',
      lv_packing_name: 'Lv 14 · Packing Factory',
      lv_packing_desc: 'Catch candies with Space, swat sneaky bugs away with the F key!',
      lv_mahou_name: 'Lv 15 · Starlight Magic',
      lv_mahou_desc: 'Listen to the spell chant and strike the instant it finishes to bloom roses!',
      lv_showtime_name: 'Lv 16 · Showtime Penguins',
      lv_showtime_desc: 'Listen to bells: High bell jump after 1 beat, Low bell jump after 2 beats!',
      lv_ratrace_name: 'Lv 17 · Rat Race',
      lv_ratrace_desc: 'Crouch and charge on call, then sprint for cheese the instant the real whistle sounds!',
      lv_dj_name: 'Lv 18 · DJ School',
      lv_dj_desc: 'Hold Space to scratch and stop the beat, release on "YO!" to drop the track!',
      lv_ringside_name: 'Lv 19 · Ringside Heavyweight',
      lv_ringside_desc: 'Follow the reporter cues: Pa-pa-pow triple strikes and devastating haymakers!',
      lv_frisbee_name: 'Lv 20 · Frisbee Dog',
      lv_frisbee_desc: 'Count beats in your head based on pitch, leap into the air and catch the flying disc!',
      lv_remix_name: 'Lv 21 · Grand Finale Remix',
      lv_remix_desc: 'The ultimate 20-stage rhythm medley! Title cards flash who is up next—don\'t miss a beat!',

      remix_karate: 'Strike Master!',
      remix_echo: 'Rhythm Echo!',
      remix_pong: 'Rhythm Ping Pong!',
      remix_marchOn: 'Lockstep!',
      remix_marchOff: 'Off-Beat March!',
      remix_fill: 'Energy Fill!',
      remix_birds: 'Blue Birds!',
      remix_clappy: 'Clappy Trio!',
      remix_spaceball: 'Spaceball!',
      remix_crop: 'Farm Stomp!',
      remix_shooter: 'Space Defender!',
      remix_taptrial: 'Tap Trial!',
      remix_glee: 'Glee Club!',
      remix_monk: 'Munchy Diner!',
      remix_packing: 'Packing Factory!',
      remix_mahou: 'Starlight Magic!',
      remix_showtime: 'Showtime!',
      remix_ratrace: 'Rat Race!',
      remix_dj: 'DJ School!',
      remix_ringside: 'Ringside!',
      remix_finale: 'Grand Finale!'
    },

    ja: {
      game_title: 'リズムキング',
      subtitle: 'THE KING OF RHYTHM',
      hint_start: 'リズムに乗って、タイミングよくボタンを押そう！',
      btn_start: 'ゲームスタート',
      hint_audio: '（最初のタップで音が出ます。音量を上げてください 🔊）',
      btn_sound_check: '🔊 サウンドテスト',
      sound_ready: '🔊 音声準備完了！',
      select_level: 'ステージ選択',
      select_diff: '難易度選択',
      btn_retry: 'もう一度',
      btn_back: 'ステージ選択',
      btn_diff_back: 'もどる',
      diff_easy: 'かんたん',
      diff_normal: 'ふつう',
      diff_hard: 'むずかしい',
      best_label: 'ベスト：',
      mode_suffix: 'モード',
      acc_label: '正確さ',
      max_combo_label: '最大コンボ',
      hud_tip_default: 'スペース / タップ = たたく · Esc = やめる',
      key_space: 'スペース',
      rotate_hint: '横画面でのプレイをおすすめします<br>縦画面のままでも遊べます：',
      btn_force_landscape: '強制横画面で遊ぶ',
      btn_portrait_continue: '縦画面で続ける',

      judge_perfect: 'PERFECT!',
      judge_good: 'GOOD',
      judge_miss: 'MISS',
      judge_whiff: '空振り…',
      judge_wrong_key: 'ちがうキー!',
      judge_early: 'はやすぎる!',
      judge_late: 'おそすぎる!',
      judge_unreleased: 'はなしてない!',
      combo: 'コンボ!',

      rank_S: 'パーフェクト！リズム感バツグン！',
      rank_A: 'お見事！素晴らしいノリです！',
      rank_B: 'いいね！あと少しで完璧！',
      rank_C: '練習あるのみ！もう一回やってみよう！',

      ready: '用意…',
      start: 'スタート！',
      listen: 'よく聞いて…',
      your_turn: 'あなたの番！',
      teacher: '師匠',
      you: 'あなた',
      you_arrow: '▼ あなた',
      captain: '隊長',
      owner: '飼い主',
      round_info: '第 {r} / {total} 問',
      on_beat: 'オモテ拍',
      off_beat: 'ウラ拍',
      march_tip: '隊列に合わせよう：低音「ドン」=表、高音「タッ」=裏！',
      march_rest: '休憩！よく聞いて：次は【{mode}】',
      fill_tip: 'スペース長押しでエネルギー注入、満タンで離す！',
      birds_peck: 'ツッ！ツッ！ツッ！',
      birds_stretch: 'グーーッ！',
      birds_tip_peck: 'スペース連打 = つつく ×3',
      birds_tip_stretch: '長押しして離す = のびる',
      birds_song_tip: '隊長の合図：「ツッツッツッ」連打 ×3、「グーーッ」長押しで離す！',
      spaceball_hit: 'かっとばせ！',
      tap_da: 'タッ',
      sing: '歌って！',
      stop: 'ストップ！',
      packing_candy: '= スペース',
      packing_bug: '= F',
      monk_count: '{n} つ！',
      monk_word: '和',
      mahou_tip: '呪文「ピ・コ・ポン」：呪文が終わった瞬間にスペース、桜満開！',
      rat_crouch: 'かがめ！',
      rat_hold: 'ためろ！',
      rat_go: 'GO！',
      rat_tip: '合図を聞こう：「かがめ！」で長押し、本物の笛でダッシュ！',
      rat_resist: '我慢！',
      bell_hi: '高音=1拍',
      bell_mid: '中音=1.5拍',
      bell_lo: '低音=2拍',
      bell_hi_full: '高いベル = 1拍後ジャンプ',
      bell_mid_full: '中間のベル = 1.5拍後ジャンプ',
      bell_lo_full: '低いベル = 2拍後ジャンプ',
      dj_hold: 'ホールド！',
      dj_release: 'はなせ！',
      dj_yo: 'YO!',
      ringside_tri: 'ト・ト・トン！',
      ringside_single: 'ドン！',
      ringside_hold: 'ためて…パンチ！',
      ringside_sub_combo: '3連打！',
      ringside_sub_combo4: '4連打！',
      ringside_sub_single: '単打！',
      ringside_sub_hold: 'ため強パンチ！',
      remix_ready: '全員集合・リミックス準備…',
      frisbee_count: '心の中で数えて…',
      frisbee_go: 'いけ！',

      lv_karate_name: '第 1 关 · 空手猫の一撃',
      lv_karate_desc: 'サークルに物が重なる瞬間にスペース！後半は裏拍のリズムも登場。',
      lv_karate_hint: '物がサークルに届いたらスペース！',
      lv_echo_name: '第 2 关 · リズム真似っこ',
      lv_echo_desc: '師匠の手本を聞いて、光が終わったらそのまま叩き返そう！休符に注意。',
      lv_pong_name: '第 3 关 · リズム卓球',
      lv_pong_desc: '手元にボールが来たら打ち返そう！赤いボールは高速スマッシュ。',
      lv_march_name: '第 4 关 · 行進ウサギ',
      lv_march_desc: '足音と合図を聞いてステップ：表拍は「ドン」、裏拍は「タッ」。',
      lv_fill_name: '第 5 关 · ロボット充填',
      lv_fill_desc: 'スペース長押しで注入、メーターが満タンになった瞬間に離そう！',
      lv_birds_name: '第 6 关 · 青い鳥合唱団',
      lv_birds_desc: '隊長の歌を聞こう：「ツッツッツッ」3回つつく、「グー」でのびる！',
      lv_clappy_name: '第 7 关 · 手拍子三人組',
      lv_clappy_desc: '二人の手拍子に続いて、3拍目に息ぴったりで手を叩こう！',
      lv_spaceball_name: '第 8 关 · 宇宙野球',
      lv_spaceball_desc: '投球音と球速を聞き分けて、ミートポイントで豪快にスイング！',
      lv_crop_name: '第 9 关 · 野菜収穫祭',
      lv_crop_desc: '野菜が顔を出した次の拍で引っこ抜く！大かぼちゃは長押し！',
      lv_shooter_name: '第 10 关 · 宇宙シューティング',
      lv_shooter_desc: '敵の警報音を聞き、照準に捉えた瞬間にビーム発射！',
      lv_taptrial_name: '第 11 关 · タップダンス',
      lv_taptrial_desc: 'お猿さんと一緒にタップダンス！3連符の変化に食らいつけ！',
      lv_glee_name: '第 12 关 · コーラス隊',
      lv_glee_desc: '仲間が歌ったら口を開けて長押し、仲間が止まったら口を閉じよう！',
      lv_monk_name: '第 13 关 · お団子小坊主',
      lv_monk_desc: '鳥が歌った数だけお団子をパクリ！半拍のリズムで食べ尽くそう。',
      lv_monk_hint: 'スペース / タップ = たべる · Esc = やめる',
      lv_packing_name: '第 14 关 · 和菓子パッキング',
      lv_packing_desc: 'スペースで和菓子をキャッチ、Fキーで寄ってくる虫を追い払え！',
      lv_mahou_name: '第 15 关 · 魔法少女',
      lv_mahou_desc: '呪文のリズムを聞いて、唱え終わる瞬間に咲かせよう！',
      lv_showtime_name: '第 16 关 · ペンギンジャンプ',
      lv_showtime_desc: 'ベルの合図：高いベルは1拍後、低いベルは2拍後にジャンプ！',
      lv_ratrace_name: '第 17 关 · ネズミダッシュ',
      lv_ratrace_desc: '合図でかがんでパワーチャージ、本物の笛が鳴ったらチーズへ突撃！',
      lv_dj_name: '第 18 关 · DJ スクール',
      lv_dj_desc: 'スペース長押しでレコードを止め、「YO!」の掛け声でスクラッチ再開！',
      lv_ringside_name: '第 19 关 · リングサイド記者会見',
      lv_ringside_desc: '記者のインタビューに合わせて連打！ためてド迫力のパンチ！',
      lv_frisbee_name: '第 20 关 · フリスビードッグ',
      lv_frisbee_desc: '投げる音の高さで拍数をカウント！宙に舞ってナイスキャッチ！',
      lv_remix_name: '第 21 关 · オールスター Remix',
      lv_remix_desc: '全20ステージが大集合の豪華メドレー！タイトルカードを見逃すな！',

      remix_karate: '空手猫！',
      remix_echo: 'リズム真似っこ！',
      remix_pong: 'リズム卓球！',
      remix_marchOn: '行進ウサギ！',
      remix_marchOff: '裏拍行進！',
      remix_fill: 'エネルギー充填！',
      remix_birds: '青い鳥！',
      remix_clappy: '手拍子三人組！',
      remix_spaceball: '宇宙野球！',
      remix_crop: '野菜収穫！',
      remix_shooter: '宇宙迎撃！',
      remix_taptrial: 'タップダンス！',
      remix_glee: 'コーラス隊！',
      remix_monk: 'お団子小坊主！',
      remix_packing: '和菓子工場！',
      remix_mahou: '魔法少女！',
      remix_showtime: 'ペンギンジャンプ！',
      remix_ratrace: 'ネズミダッシュ！',
      remix_dj: 'DJ スクール！',
      remix_ringside: 'リングサイド！',
      remix_finale: 'グランドフィナーレ！'
    },

    es: {
      game_title: 'EL REY DEL RITMO',
      subtitle: 'THE KING OF RHYTHM',
      hint_start: '¡Sigue el ritmo y pulsa en el momento exacto!',
      btn_start: 'INICIAR JUEGO',
      hint_audio: '(El primer clic activa el sonido, sube el volumen 🔊)',
      btn_sound_check: '🔊 Probar sonido',
      sound_ready: '🔊 ¡Sonido activado!',
      select_level: 'Seleccionar Nivel',
      select_diff: 'Seleccionar Dificultad',
      btn_retry: 'Reintentar',
      btn_back: 'Elegir Nivel',
      btn_diff_back: 'Volver',
      diff_easy: 'Fácil',
      diff_normal: 'Normal',
      diff_hard: 'Difícil',
      best_label: 'Récord: ',
      mode_suffix: 'Modo',
      acc_label: 'Precisión',
      max_combo_label: 'Combo Máximo',
      hud_tip_default: 'Espacio / Clic = Golpear · Esc = Salir',
      key_space: 'Espacio',
      rotate_hint: 'Recomendamos jugar en horizontal.<br>También puedes en vertical:',
      btn_force_landscape: 'Forzar Horizontal',
      btn_portrait_continue: 'Seguir Vertical',

      judge_perfect: '¡PERFECTO!',
      judge_good: '¡BIEN!',
      judge_miss: 'FALLO',
      judge_whiff: '¡AL AIRE…!',
      judge_wrong_key: '¡TECLA MAL!',
      judge_early: '¡MUY PRONTO!',
      judge_late: '¡MUY TARDE!',
      judge_unreleased: '¡NO SOLTASTE!',
      combo: '¡COMBO!',

      rank_S: '¡Increíble! ¡Tienes un ritmo legendario!',
      rank_A: '¡Excelente! ¡Qué gran sabor y ritmo!',
      rank_B: '¡Bastante bien, sigue practicando!',
      rank_C: '¡Ánimo, la práctica hace al maestro!',

      ready: '¡Listos…!',
      start: '¡EMPIEZA!',
      listen: '¡Escucha bien…!',
      your_turn: '¡Te toca a ti!',
      teacher: 'Maestro',
      you: 'Tú',
      you_arrow: '▼ Tú',
      captain: 'Capitán',
      owner: 'Dueño',
      round_info: 'Ronda {r} / {total}',
      on_beat: 'A tiempo',
      off_beat: 'Contratiempo',
      march_tip: '¡Sigue al equipo: "dum" bajo = a tiempo, "ta" alto = contratiempo!',
      march_rest: '¡Pausa! Escucha: ¡Sigue a [{mode}]!',
      fill_tip: '¡Mantén pulsado para llenar, suelta al completarse!',
      birds_peck: '¡Pica! ¡Pica! ¡Pica!',
      birds_stretch: '¡Arriiiiba!',
      birds_tip_peck: 'Espacio = Picar ×3',
      birds_tip_stretch: 'Mantener y soltar = Estirar',
      birds_song_tip: '¡Sigue al Capitán: "Pica-pica-pica" pulsa 3 veces, "Arriba" mantén y suelta!',
      spaceball_hit: '¡Batea!',
      tap_da: '¡Tap!',
      sing: '¡Canta!',
      stop: '¡Alto!',
      packing_candy: '= Espacio',
      packing_bug: '= F',
      monk_count: '¡{n} taco{s}!',
      monk_word: 'TACOS',
      mahou_tip: '¡Escucha el conjuro "pi-ko-pon": pulsa al terminar para florecer!',
      rat_crouch: '¡Abajo!',
      rat_hold: '¡Carga!',
      rat_go: '¡YA!',
      rat_tip: '¡Atento: "¡Abajo!" para cargar, suelta con el silbato real!',
      rat_resist: '¡Espera!',
      bell_hi: 'Agudo=1c',
      bell_mid: 'Medio=1.5c',
      bell_lo: 'Grave=2c',
      bell_hi_full: 'Campana aguda = Salta en 1c',
      bell_mid_full: 'Campana media = Salta en 1.5c',
      bell_lo_full: 'Campana grave = Salta en 2c',
      dj_hold: '¡MANTÉN!',
      dj_release: '¡SUELTA!',
      dj_yo: '¡YO!',
      ringside_tri: '¡pa-pa-pum!',
      ringside_single: '¡pum!',
      ringside_hold: '¡mantén... GOLPE!',
      ringside_sub_combo: '¡Triple golpe!',
      ringside_sub_combo4: '¡4 golpes!',
      ringside_sub_single: '¡Golpe simple!',
      ringside_sub_hold: '¡Mantén fuerte!',
      remix_ready: '¡Todos listos... Remix!',
      frisbee_count: 'Cuenta en tu mente…',
      frisbee_go: '¡Ve!',

      lv_karate_name: 'Nv 1 · El Gato Luchador',
      lv_karate_desc: '¡Rompe piñatas y objetos justo al llegar al círculo! Cuidado con el contratiempo.',
      lv_karate_hint: '¡Pulsa Espacio cuando el objeto entre al círculo!',
      lv_echo_name: 'Nv 2 · Eco Rítmico',
      lv_echo_desc: '¡Escucha el ritmo del mariachi y repítelo con exactitud! Cuidado con los silencios.',
      lv_pong_name: 'Nv 3 · Ping Pong Rítmico',
      lv_pong_desc: '¡Remata la pelota en tu lado! Las bolas rojas vienen a toda velocidad.',
      lv_march_name: 'Nv 4 · Desfile al Compás',
      lv_march_desc: '¡Marcha con el desfile! Golpe grave = a tiempo, chasquido agudo = contratiempo.',
      lv_fill_name: 'Nv 5 · Carga de Energía',
      lv_fill_desc: '¡Mantén pulsado Espacio para inyectar energía y suelta en cuanto se llene!',
      lv_birds_name: 'Nv 6 · Coro de Guacamayas',
      lv_birds_desc: '¡Sigue al líder: "Pica-pica-pica" pulsa 3 veces, "Arriba" mantén y suelta!',
      lv_clappy_name: 'Nv 7 · El Trío de Aplausos',
      lv_clappy_desc: '¡Escucha los dos primeros aplausos y da el tercero en el compás exacto!',
      lv_spaceball_name: 'Nv 8 · Béisbol Espacial',
      lv_spaceball_desc: '¡Escucha el lanzamiento y conecta un jonrón en el punto de contacto!',
      lv_crop_name: 'Nv 9 · Cosecha Picante',
      lv_crop_desc: '¡Cosecha chiles y maíz al compás; mantén pulsado para sacar calabazas gigantes!',
      lv_shooter_name: 'Nv 10 · Defensor Espacial',
      lv_shooter_desc: '¡Escucha la alarma del radar y dispara a los invasores en la mira!',
      lv_taptrial_name: 'Nv 11 · Zapateado Flamenco',
      lv_taptrial_desc: '¡Zapatea con ritmo! Domina los tresillos y redobles de fiesta.',
      lv_glee_name: 'Nv 12 · Coro Alegre',
      lv_glee_desc: '¡Abre la boca y canta con tus compañeros; cierra en cuanto hagan silencio!',
      lv_monk_name: 'Nv 13 · Fiesta de Tacos',
      lv_monk_desc: '¡Escucha el canto y saborea los tacos a medio compás con salsa y limón!',
      lv_monk_hint: 'Espacio / Clic = Comer · Esc = Salir',
      lv_packing_name: 'Nv 14 · Empaque Dulcero',
      lv_packing_desc: '¡Atrapa los dulces con Espacio y espanta los bichos con la tecla F!',
      lv_mahou_name: 'Nv 15 · Magia de Flores',
      lv_mahou_desc: '¡Escucha el conjuro y pulsa al terminar para hacer florecer cempasúchil!',
      lv_showtime_name: 'Nv 16 · Pingüinos de Gala',
      lv_showtime_desc: '¡Sigue las campanas: Campana aguda = salta en 1 compás, grave = en 2 compases!',
      lv_ratrace_name: 'Nv 17 · Carrera de Ratones',
      lv_ratrace_desc: '¡Agáchate a cargar energía y corre hacia el queso al sonar el silbato real!',
      lv_dj_name: 'Nv 18 · Escuela de DJ',
      lv_dj_desc: '¡Mantén Espacio para frenar el vinilo y suelta al oír "YO!" para que suene la fiesta!',
      lv_ringside_name: 'Nv 19 · Noche de Lucha Libre',
      lv_ringside_desc: '¡Sigue a los reporteros: ráfaga de puñetazos triples y golpe fulminante!',
      lv_frisbee_name: 'Nv 20 · Perro y Frisbee',
      lv_frisbee_desc: '¡Calcula los compases por el tono del lanzamiento, salta y atrapa el disco!',
      lv_remix_name: 'Nv 21 · Gran Remix de Fiesta',
      lv_remix_desc: '¡El popurrí definitivo con los 20 minijuegos! ¡Sigue el letrero y no pierdas el ritmo!',

      remix_karate: '¡El Luchador!',
      remix_echo: '¡Eco Rítmico!',
      remix_pong: '¡Ping Pong!',
      remix_marchOn: '¡Desfile!',
      remix_marchOff: '¡Contratiempo!',
      remix_fill: '¡Carga Energía!',
      remix_birds: '¡Guacamayas!',
      remix_clappy: '¡Trío Aplausos!',
      remix_spaceball: '¡Béisbol!',
      remix_crop: '¡Cosecha!',
      remix_shooter: '¡Defensor!',
      remix_taptrial: '¡Zapateado!',
      remix_glee: '¡Coro Alegre!',
      remix_monk: '¡Fiesta Tacos!',
      remix_packing: '¡Empaque Dulcero!',
      remix_mahou: '¡Magia Flores!',
      remix_showtime: '¡Pingüinos!',
      remix_ratrace: '¡Carrera Ratones!',
      remix_dj: '¡Escuela DJ!',
      remix_ringside: '¡Lucha Libre!',
      remix_finale: '¡Gran Final!'
    }
  },

  init() {
    let saved = null;
    try {
      saved = localStorage.getItem('rhythm_king_lang');
    } catch (e) {}
    if (saved && this.SUPPORTED.includes(saved)) {
      this.lang = saved;
    } else {
      const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
      if (nav.startsWith('zh')) this.lang = 'zh';
      else if (nav.startsWith('ja')) this.lang = 'ja';
      else if (nav.startsWith('es')) this.lang = 'es';
      else if (nav.startsWith('en')) this.lang = 'en';
      else this.lang = this.DEFAULT;
    }
    if (document && document.documentElement) {
      document.documentElement.lang = this.lang === 'zh' ? 'zh-CN' : this.lang;
    }
  },

  setLanguage(lang) {
    if (!this.SUPPORTED.includes(lang)) return;
    this.lang = lang;
    try {
      localStorage.setItem('rhythm_king_lang', lang);
    } catch (e) {}
    if (document && document.documentElement) {
      document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
    }

    // 更新 DOM 中所有 [data-i18n]
    this.updateDOM();

    // 通知外部系统
    window.dispatchEvent(new CustomEvent('languagechanged', { detail: { lang } }));
  },

  t(key, params) {
    const d = this.dict[this.lang] || this.dict[this.DEFAULT];
    let str = d[key] != null ? d[key] : (this.dict[this.DEFAULT][key] || key);
    if (params) {
      for (const k in params) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      }
    }
    return str;
  },

  getLevelName(id) {
    return this.t('lv_' + id + '_name');
  },

  getLevelDesc(id) {
    return this.t('lv_' + id + '_desc');
  },

  getLevelHint(id) {
    const k = 'lv_' + id + '_hint';
    const val = (this.dict[this.lang] && this.dict[this.lang][k]) || (this.dict[this.DEFAULT] && this.dict[this.DEFAULT][k]);
    return val || this.t('hud_tip_default');
  },

  getRemixCard(kind) {
    return this.t('remix_' + kind);
  },

  getRankComment(rank) {
    return this.t('rank_' + rank);
  },

  updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const k = el.dataset.i18n;
      if (k) {
        if (el.dataset.i18nHtml === 'true') {
          el.innerHTML = this.t(k);
        } else {
          el.textContent = this.t(k);
        }
      }
    });

    // 更新语言切换按钮的激活样式
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === this.lang);
    });
  }
};

/* ---------- 文化主题配置 (CultureTheme) ---------- */
const CultureTheme = {
  get() {
    return I18n.lang; // 'zh' | 'en' | 'ja' | 'es'
  },

  is(c) {
    return I18n.lang === c;
  },

  karate: {
    getTheme() {
      switch (I18n.lang) {
        case 'ja':
          return {
            title: '空手猫 · 道場',
            bgSkyTop: '#e66b5b',
            bgSkyBottom: '#fce4a6',
            sunColor: '#fff0db',
            fuji: true,
            torii: true,
            sakura: true,
            catHeadband: '#d32f2f',
            hasKatana: true,
            itemNormal: 'onigiri',
            itemBig: 'rock_shimenawa',
            burstColor: '#ff94b8',
            slashFx: true
          };
        case 'en':
          return {
            title: 'Cowboy Cat · Wild West',
            bgSkyTop: '#d35400',
            bgSkyBottom: '#f39c12',
            sunColor: '#fef5e7',
            canyon: true,
            saloon: true,
            cactus: true,
            catCowboyHat: true,
            catBandana: '#c0392b',
            itemNormal: 'barrel',
            itemBig: 'meteor',
            burstColor: '#f1c40f',
            comicPow: true
          };
        case 'es':
          return {
            title: 'El Gato Luchador · Fiesta',
            bgSkyTop: '#c0392b',
            bgSkyBottom: '#f39c12',
            sunColor: '#fff9e6',
            plaza: true,
            papelPicado: true,
            catMask: true,
            catCape: '#e74c3c',
            itemNormal: 'pinata_star',
            itemBig: 'pinata_gold',
            burstColor: '#00b894',
            confettiFx: true
          };
        default: // zh
          return {
            title: '空手道猫 · 夕阳道场',
            bgSkyTop: '#ff9a56',
            bgSkyBottom: '#ffd93b',
            sunColor: '#fff3c4',
            pagoda: true,
            lanterns: true,
            catKungfuSash: true,
            catHeadband: '#fff',
            itemNormal: 'pot',
            itemBig: 'rock',
            burstColor: '#ffb347',
            shockwaveFx: true
          };
      }
    }
  },

  monk: {
    getTheme() {
      switch (I18n.lang) {
        case 'ja':
          return {
            room: 'washitsu',
            scrollKanji: '和',
            tatami: true,
            food: 'dango',
            bubbleSuffix: ' つ！',
            robeColor: '#2c3e50',
            robeSash: '#7f8c8d',
            birdColor: '#689f38'
          };
        case 'en':
          return {
            room: 'diner',
            signText: 'DINER',
            checkeredFloor: true,
            food: 'burger',
            bubbleSuffix: ' burger{s}!',
            robeColor: '#34495e',
            robeSash: '#e74c3c',
            birdColor: '#2980b9'
          };
        case 'es':
          return {
            room: 'taqueria',
            signText: 'TACOS',
            papelPicado: true,
            food: 'taco',
            bubbleSuffix: ' taco{s}!',
            robeColor: '#d35400',
            robeSash: '#27ae60',
            birdColor: '#e67e22'
          };
        default: // zh
          return {
            room: 'temple',
            scrollKanji: '禅',
            tatami: true,
            food: 'baozi',
            bubbleSuffix: ' 个！',
            robeColor: '#e8862e',
            robeSash: '#c96a1b',
            birdColor: '#7fb069'
          };
      }
    }
  },

  crop: {
    getTheme() {
      switch (I18n.lang) {
        case 'ja':
          return {
            crop1: 'daikon',
            crop2: 'kabocha',
            bgFarm: 'satoyama',
            hat: 'sugegasa'
          };
        case 'en':
          return {
            crop1: 'carrot',
            crop2: 'pumpkin',
            bgFarm: 'barn',
            hat: 'cowboy_straw'
          };
        case 'es':
          return {
            crop1: 'chili',
            crop2: 'maize',
            bgFarm: 'hacienda',
            hat: 'sombrero'
          };
        default: // zh
          return {
            crop1: 'turnip',
            crop2: 'big_pumpkin',
            bgFarm: 'terrace',
            hat: 'straw'
          };
      }
    }
  },

  mahou: {
    getTheme() {
      switch (I18n.lang) {
        case 'ja':
          return { flower: 'sakura', icon: '🌸', color: '#ffb7c5' };
        case 'en':
          return { flower: 'rose', icon: '🌹', color: '#e74c3c' };
        case 'es':
          return { flower: 'marigold', icon: '🌼', color: '#f39c12' };
        default: // zh
          return { flower: 'lotus', icon: '🌸', color: '#ff8fb3' };
      }
    }
  },

  /* --------------------------------------------------------------
   * 民族调式音阶数据 (MusicTheory 调式体系映射)
   * -------------------------------------------------------------- */
  scales: {
    zh: {
      name: '中国五声调式 (宫调/羽调)',
      intervals: [0, 2, 4, 7, 9],       // 1, 2, 3, 5, 6 (宫 商 角 徵 羽)
      rootMidi: 60,                     // C4
      bassMidi: [36, 43, 38, 41]        // C2, G2, D2, F2
    },
    ja: {
      name: '日本平调子 / 阴旋法 (Hirajoshi)',
      intervals: [0, 2, 3, 7, 8],       // 1, 2, b3, 5, b6 (平调子)
      rootMidi: 62,                     // D4
      bassMidi: [38, 45, 39, 43]        // D2, A2, Eb2, G2
    },
    es: {
      name: '西班牙弗拉门戈 (Phrygian Dominant)',
      intervals: [0, 1, 4, 5, 7, 8, 10], // 1, b2, 3, 4, 5, b6, b7
      rootMidi: 64,                     // E4
      bassMidi: [40, 41, 43, 45]        // E2, F2, G2, A2
    },
    en: {
      name: '美式蓝调 / 自然大调 (Blues / Major)',
      intervals: [0, 3, 5, 6, 7, 10],   // 1, b3, 4, b5, 5, b7
      rootMidi: 60,                     // C4
      bassMidi: [36, 41, 38, 43]        // C2, F2, D2, G2
    }
  },

  midiToFreq(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  },

  getScaleFreq(cult, degree, octaveOffset = 0) {
    cult = cult || (typeof I18n !== 'undefined' ? I18n.lang : 'zh') || 'zh';
    const s = this.scales[cult] || this.scales.zh;
    const len = s.intervals.length;
    const oct = Math.floor(degree / len) + octaveOffset;
    const idx = ((degree % len) + len) % len;
    const midi = s.rootMidi + s.intervals[idx] + oct * 12;
    return this.midiToFreq(midi);
  },

  getScaleNotes(cult, count = 5, octaveOffset = 0) {
    const res = [];
    for (let i = 0; i < count; i++) {
      res.push(this.getScaleFreq(cult, i, octaveOffset));
    }
    return res;
  },

  getScaleBass(cult, stepIdx = 0) {
    cult = cult || (typeof I18n !== 'undefined' ? I18n.lang : 'zh') || 'zh';
    const s = this.scales[cult] || this.scales.zh;
    const midi = s.bassMidi[stepIdx % s.bassMidi.length];
    return this.midiToFreq(midi);
  }
};

// 初始化语言
I18n.init();
