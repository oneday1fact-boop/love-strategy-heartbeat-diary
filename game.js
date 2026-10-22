'use strict';

(() => {
  const SAVE_KEY = 'loveStrategyHeartbeatDiary_v2';
  const app = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  const storyRoot = document.getElementById('story-root');
  const toastRoot = document.getElementById('toast-root');
  const PHASE_NAMES = ['早晨', '午休', '放學後'];
  const ASSET = (name) => `./assets/${name}`;

  const GIRLS = {
    hina: {
      id: 'hina', name: '朝霧陽菜', short: '陽菜', role: '籃球部・球場上的太陽', age: 17,
      art: ASSET('hina-portrait.jpg'), color: '#f29ab6', quote: '如果是你，我就不想輕易認輸。',
      intro: '開朗、直率、好勝的籃球部主力。總是先替別人打氣，卻會把自己的不安藏起來。',
      favorite: '運動飲品', tags: ['籃球', '熱血', '不擅長示弱'], place: '公園／球場',
      messages: '今日練習完，我投進咗最後一球！下次你都要嚟睇呀。'
    },
    mio: {
      id: 'mio', name: '水瀨澪', short: '澪', role: '羽毛球部・安靜的觀察者', age: 16,
      art: ASSET('mio-portrait.jpg'), color: '#7bb8e8', quote: '有你在旁邊，安靜也會變得很舒服。',
      intro: '冷靜、認真、慢熱的羽毛球少女。她不太主動說出心事，但會記住你不經意提過的小事。',
      favorite: '熱牛奶', tags: ['羽毛球', '圖書館', '細心'], place: '書店／圖書館',
      messages: '我在圖書館留了靠窗的位置。如果你有空……要不要一起溫習？'
    },
    koharu: {
      id: 'koharu', name: '藤宮小春', short: '小春', role: '美術部・收集天空的少女', age: 17,
      art: ASSET('koharu-portrait.jpg'), color: '#e7a4b8', quote: '如果你看得懂我的畫，我就很開心。',
      intro: '溫柔、細心、帶點害羞。她用畫畫記下日常，卻很少主動讓別人看見自己真正的作品。',
      favorite: '素描本', tags: ['繪畫', '甜品', '慢慢熟悉'], place: '咖啡店／美術室',
      messages: '今天的天空好漂亮。我畫了一張小小的速寫……第一個想給你看。'
    }
  };

  const NAV_ITEMS = [
    ['campus', '🏫', '校園日常'], ['characters', '♡', '女主角'], ['messages', '✉️', '訊息'],
    ['journal', '📔', '心動日記'], ['gallery', '🖼️', '回憶圖鑑'], ['settings', '⚙️', '設定']
  ];

  const ENDINGS = {
    hina_good: { title: '一起奔向夏天', type: '陽菜・好結局', desc: '球場的燈光漸漸熄下，陽菜把手伸向你。這一次，她不再只說「下次再努力」，而是認真地告訴你：以後每一個重要的瞬間，都想與你分享。', girl: 'hina' },
    hina_normal: { title: '球場邊的約定', type: '陽菜・普通結局', desc: '你們約定下次比賽再見。她仍然笑得很亮，而你知道這段並肩努力的日子，已經成為無可取代的回憶。', girl: 'hina' },
    mio_good: { title: '雨停之後', type: '澪・好結局', desc: '雨聲停了，澪沒有急著收起雨傘。她望著你，輕輕說出一直藏在心底的話。原來最安靜的陪伴，也可以成為最勇敢的告白。', girl: 'mio' },
    mio_normal: { title: '窗邊的座位', type: '澪・普通結局', desc: '圖書館的窗邊仍然留著熟悉的位置。你們沒有急著替未來命名，只珍惜每一次能坐在一起的午後。', girl: 'mio' },
    koharu_good: { title: '把明天畫給你', type: '小春・好結局', desc: '小春把最後一張畫翻過來，背面寫著你的名字。她笑著說，往後想畫的風景，想一直有你在身邊。', girl: 'koharu' },
    koharu_normal: { title: '未完成的畫', type: '小春・普通結局', desc: '那幅畫暫時沒有完成，但你們已經約好下次一起尋找新的風景。青春沒有立刻給出答案，卻留下了繼續前進的理由。', girl: 'koharu' },
    friendship: { title: '屬於自己的夏天', type: '友情・成長結局', desc: '夏日祭典的煙花在夜空綻放。你和朋友們一起笑著回望這段日子，也終於明白，學會珍惜自己與身邊的人，同樣是一種勇敢。', girl: null }
  };

  const MILESTONES = {
    hina: [
      { key: 'hina_practice', min: 18, day: 2, title: '放學後的最後一球', art: 'hina-practice-cg.jpg', lines: [
        ['旁白', '體育館的窗邊染上金色。其他隊員都走了，只有陽菜還抱著球，站在罰球線前。'],
        ['陽菜', '「再投一球就走！」她說得很有精神，卻悄悄揉了揉有點酸的手腕。'],
        ['陽菜', '「……你可以幫我數球嗎？只要你在旁邊，我就覺得一定能投進。」']
      ], choices: [
        { label: '認真替她數球，陪她練到最後', effect: () => changeAffinity('hina', 5), outcome: '陽菜投進最後一球，開心地向你擊掌。她把這份一起努力的回憶收在心裡。' },
        { label: '提醒她休息，明天再繼續', effect: () => { changeAffinity('hina', 4); adjustStat('charm', 1); }, outcome: '陽菜先是愣了一下，之後才笑著點頭。「你有時比教練還嚴格呢。」' }
      ] },
      { key: 'hina_secret', min: 35, day: 7, title: '不想被看見的失落', art: 'hina-cafe-cg.jpg', lines: [
        ['旁白', '練習賽結束後，陽菜坐在空蕩蕩的看台上。她沒有像平常一樣大聲說笑。'],
        ['陽菜', '「我明明練了那麼久，最後還是失誤了。大家都說沒關係，但我自己好不甘心。」'],
        ['陽菜', '她低下頭：「如果有一天我真的做不到，你還會覺得我很厲害嗎？」']
      ], choices: [
        { label: '「我欣賞的是努力的你，不只是得分。」', effect: () => { changeAffinity('hina', 6); adjustStat('courage', 1); }, outcome: '陽菜沉默了一會，眼角微微泛紅。然後她抬起頭，露出比平常更真誠的笑容。' },
        { label: '邀請她明天一起重新練習', effect: () => { changeAffinity('hina', 5); adjustStat('fitness', 1); }, outcome: '「好！明天一定要把那球投進！」陽菜重新站起來，這次她不再是一個人。' }
      ] },
      { key: 'hina_festival', min: 55, day: 14, title: '夕陽下的加油聲', art: 'hina-evening-cg.jpg', lines: [
        ['旁白', '夏季比賽前一天，陽菜約你到球場旁的走廊。夕陽把兩人的影子拉得很長。'],
        ['陽菜', '「我其實有點緊張。明明一直說自己沒問題，但今天特別想聽你說一句加油。」'],
        ['陽菜', '她把一瓶運動飲品遞給你：「比賽完……我有件事想好好跟你說。」']
      ], choices: [
        { label: '約定比賽結束後一起看夕陽', effect: () => { changeAffinity('hina', 7); adjustStat('courage', 2); }, outcome: '陽菜用力點頭，耳尖卻悄悄紅了。這個約定，比任何得分都更令她期待。' },
        { label: '輕輕替她打氣，讓她做自己', effect: () => changeAffinity('hina', 6), outcome: '「嗯，我會努力享受比賽的。」她把你的話牢牢記住，轉身時一直帶著笑。' }
      ] },
      { key: 'hina_confession', min: 75, day: 20, title: '只想讓你知道', art: 'hina-evening-cg.jpg', lines: [
        ['陽菜', '「比起站在球場正中央，我發現自己最近更期待放學後見到你。」'],
        ['陽菜', '她把目光移向窗外：「我未必已經準備好說出所有答案，但我想讓你知道，你對我真的很重要。」']
      ], choices: [
        { label: '坦白說，你也是每天最期待的人', effect: () => { changeAffinity('hina', 7); adjustStat('courage', 2); }, outcome: '陽菜怔住幾秒，接著笑得像剛剛投進了決勝球。你們約好在夏日祭典那天，好好面對自己的心意。' },
        { label: '給她一個安心的微笑，陪她慢慢來', effect: () => changeAffinity('hina', 5), outcome: '陽菜安心地笑了。你們沒有急著把關係定義清楚，但彼此都更靠近了一點。' }
      ] }
    ],
    mio: [
      { key: 'mio_practice', min: 18, day: 2, title: '清晨的羽毛球場', art: 'mio-library-evening-cg.jpg', lines: [
        ['旁白', '清晨的體育館還沒開足燈，澪已經完成了一輪發球練習。她看到你時，手上的球拍停了一下。'],
        ['澪', '「你真的來了。我以為昨天只是隨口一提……謝謝。」'],
        ['澪', '她把備用球拍遞給你：「要不要試一下？我可以慢慢教你。」']
      ], choices: [
        { label: '認真學她示範的動作', effect: () => { changeAffinity('mio', 5); adjustStat('fitness', 1); }, outcome: '澪仔細替你調整握拍姿勢。她話不多，但每一次提醒都很溫柔。' },
        { label: '先問她自己最喜歡哪個動作', effect: () => { changeAffinity('mio', 4); adjustStat('charm', 1); }, outcome: '澪難得主動示範了好幾次。她似乎很高興，你在意的不只是一場比賽。' }
      ] },
      { key: 'mio_secret', min: 35, day: 7, title: '窗邊的空位', art: 'mio-rain-cg.jpg', lines: [
        ['旁白', '圖書館午後很安靜。澪把一本筆記推到你面前，頁邊整齊地寫滿了重點。'],
        ['澪', '「我習慣把想不通的事情寫下來。可是有些事……寫了很多遍，還是沒有答案。」'],
        ['澪', '她小聲補充：「例如，為什麼我每次看到你走進來，都會先抬頭。」']
      ], choices: [
        { label: '笑著說，因為她一直在等你', effect: () => { changeAffinity('mio', 6); adjustStat('courage', 1); }, outcome: '澪的臉一下子紅了。她低頭翻頁，卻把那一頁看了好久都沒有翻過去。' },
        { label: '告訴她，你也會留意她在不在', effect: () => { changeAffinity('mio', 6); adjustStat('charm', 1); }, outcome: '澪輕輕點頭，唇邊露出幾乎看不見、卻很真實的微笑。' }
      ] },
      { key: 'mio_festival', min: 55, day: 14, title: '雨天共傘', art: 'mio-night-cg.jpg', lines: [
        ['旁白', '放學時突然下起雨。澪撐開一把透明雨傘，站在校門口等你。'],
        ['澪', '「天氣預報說會下雨。我想……你可能沒有帶傘。」'],
        ['澪', '兩人肩膀靠得很近。她望著雨滴，輕聲說：「和你一起走的路，好像總是比平常短。」']
      ], choices: [
        { label: '把傘柄握得更穩，陪她慢慢走', effect: () => { changeAffinity('mio', 7); adjustStat('courage', 1); }, outcome: '澪沒有退開。回到家後，你收到她的訊息：「今天的雨聲很好聽。謝謝你一起走。」' },
        { label: '問她夏日祭典想看哪一種煙花', effect: () => changeAffinity('mio', 6), outcome: '澪想了一會，說自己想看藍色的煙花。說完後，她小聲問你那天有沒有空。' }
      ] },
      { key: 'mio_confession', min: 75, day: 20, title: '安靜裡的答案', art: 'mio-night-cg.jpg', lines: [
        ['澪', '「以前我覺得，只要把事情做好，就不需要向別人說太多。」'],
        ['澪', '「可是最近，我會想把看到的天空、聽到的歌，還有每天很普通的小事，第一個告訴你。」']
      ], choices: [
        { label: '告訴她，你也想成為那個第一個的人', effect: () => { changeAffinity('mio', 7); adjustStat('courage', 2); }, outcome: '澪的眼睛微微睜大，然後很輕很輕地笑了。她答應在祭典那天，給你一個認真的答案。' },
        { label: '握住她的手，讓她知道你明白', effect: () => changeAffinity('mio', 6), outcome: '澪沒有說話，只是回握了一下。對她來說，這已經是非常勇敢的一步。' }
      ] }
    ],
    koharu: [
      { key: 'koharu_practice', min: 18, day: 2, title: '美術室的秘密', art: 'koharu-studio-cg.jpg', lines: [
        ['旁白', '美術室裡只剩下畫筆碰到紙面的細聲。小春急忙把畫簿合上，像是被你看見了秘密。'],
        ['小春', '「啊……不是不想給你看，只是還沒有畫好。」'],
        ['小春', '她想了一會，終於把畫簿轉向你：「如果你願意的話，可以先看一小部分。」']
      ], choices: [
        { label: '仔細看畫，說出你最喜歡的細節', effect: () => { changeAffinity('koharu', 5); adjustStat('charm', 1); }, outcome: '小春聽得很專注。你指出的一個小細節，正好是她最在意、卻以為不會有人留意的地方。' },
        { label: '問她畫這幅畫時在想甚麼', effect: () => { changeAffinity('koharu', 5); adjustStat('courage', 1); }, outcome: '小春慢慢說起畫中的故事。她發現，你想了解的不只是完成的作品，還有她的心情。' }
      ] },
      { key: 'koharu_secret', min: 35, day: 7, title: '沒畫完的天空', art: 'koharu-stationery-cg.jpg', lines: [
        ['旁白', '小春邀請你到校園後方找繪畫素材。她一直望著天空，卻遲遲沒有落筆。'],
        ['小春', '「我總覺得，如果畫得不夠好，就不應該讓別人看見。」'],
        ['小春', '「但每次跟你一起找風景時，我都會想……也許不完美的東西，也值得被喜歡。」']
      ], choices: [
        { label: '告訴她，你最喜歡畫裡真實的心情', effect: () => { changeAffinity('koharu', 6); adjustStat('charm', 1); }, outcome: '小春終於開始畫下第一筆。她把這張畫命名為「有人一起看的天空」。' },
        { label: '提議兩個人一起完成這張畫', effect: () => { changeAffinity('koharu', 6); adjustStat('courage', 1); }, outcome: '小春把另一支鉛筆遞給你。兩種筆觸在紙上交會，意外地成為她最喜歡的一部分。' }
      ] },
      { key: 'koharu_festival', min: 55, day: 14, title: '給你的第一張畫', art: 'koharu-park-cg.jpg', lines: [
        ['旁白', '祭典前夕，小春把一幅用淡藍和粉橙色描繪的夕陽交給你。畫裡有一個模糊的身影，正站在她旁邊。'],
        ['小春', '「我本來想畫得很像，但畫到最後，最清楚的反而是那天的感覺。」'],
        ['小春', '「如果你不介意……我想把這幅畫送給你。」']
      ], choices: [
        { label: '珍惜地收下，答應會一直保存', effect: () => { changeAffinity('koharu', 7); adjustStat('courage', 1); }, outcome: '小春的笑容像畫裡的夕陽一樣柔和。她說，祭典當天還有一件事想讓你知道。' },
        { label: '邀請她一起去看真正的夕陽', effect: () => changeAffinity('koharu', 6), outcome: '小春輕輕點頭，已經開始想像那天要帶哪一本畫簿。' }
      ] },
      { key: 'koharu_confession', min: 75, day: 20, title: '畫裡一直有你', art: 'koharu-park-cg.jpg', lines: [
        ['小春', '「我重新翻看最近畫的每一張畫，才發現你總是在某個角落。」'],
        ['小春', '「我想，這大概就是喜歡一個人的樣子吧。無論在甚麼地方，都會不自覺想起他。」']
      ], choices: [
        { label: '告訴她，你也想走進她往後的風景', effect: () => { changeAffinity('koharu', 7); adjustStat('courage', 2); }, outcome: '小春把畫簿抱在胸前，眼眶微微泛紅。她答應在祭典當天，親口告訴你答案。' },
        { label: '輕輕稱讚她的勇氣，陪她慢慢說', effect: () => changeAffinity('koharu', 6), outcome: '小春安心地笑了。她終於明白，不用一次說完所有心事，也可以一步一步靠近。' }
      ] }
    ]
  };

  // Preload all in-game CGs. Fixed geometry + cached images prevents layout jumps on scene changes.
  const PRELOAD_ASSETS = [
    'cover-school.jpg','hina-portrait.jpg','hina-scene.jpg','hina-court-cg.jpg','hina-campus-cg.jpg','hina-sunset-cg.jpg',
    'hina-practice-cg.jpg','hina-cafe-cg.jpg','hina-evening-cg.jpg',
    'mio-portrait.jpg','mio-scene.jpg','mio-library-cg.jpg','mio-library-evening-cg.jpg','mio-rain-cg.jpg','mio-night-cg.jpg',
    'koharu-portrait.jpg','koharu-scene.jpg','koharu-studio-cg.jpg','koharu-stationery-cg.jpg','koharu-park-cg.jpg',
    'classroom-morning-cg.jpg','classroom-window-cg.jpg','hina-court-cg.jpg'
  ];
  const preloadCache = new Map();
  PRELOAD_ASSETS.forEach((name) => { const image = new Image(); image.decoding = 'async'; image.src = ASSET(name); preloadCache.set(name, image); });

  let state = null;
  let activeScene = null;
  let activeMiniGame = null;
  let toastTimer = null;
  let selectedMessageGirl = 'hina';

  function defaultGirlState() {
    return { affinity: 8, chats: 0, gifts: 0, dates: 0, events: {}, notes: [] };
  }

  function createInitialState(name) {
    return {
      schemaVersion: 1,
      playerName: (name || '小晴').trim().slice(0, 12) || '小晴',
      screen: 'game', tab: 'campus', selectedGirl: 'hina',
      day: 1, phase: 0, pendingFinale: false, ending: null,
      stats: { stamina: 86, study: 16, fitness: 16, charm: 16, courage: 12, money: 120 },
      girls: { hina: defaultGirlState(), mio: defaultGirlState(), koharu: defaultGirlState() },
      flags: { introSeen: false, gallerySeen: false },
      inventory: ['手寫便條'],
      diary: [{ day: 1, title: '新學期的天空', text: '青空學園的新學期開始了。你在走廊遇見幾張陌生又期待的面孔，心裡隱約覺得，這個春天會有些不一樣。', tag: '序章' }],
      messages: {
        hina: [{ from: 'hina', text: '新學期開始啦！有空要不要來看我練習？', day: 1 }],
        mio: [{ from: 'mio', text: '如果你想溫習，我通常會在圖書館靠窗的位置。', day: 1 }],
        koharu: [{ from: 'koharu', text: '今天的雲好像棉花糖……好想把它畫下來。', day: 1 }]
      },
      unlockedEndings: [],
      settings: { sound: false, reduceMotion: false, autoText: false, autoPlay: false },
      miniGameBest: { basketball: 0, badminton: 0 },
      totalInteractions: 0,
      lastAction: '剛剛踏入新學期',
      lastDate: '4月12日'
    };
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }
  function gameDate(day = state.day) {
    const date = new Date(2026, 3, 11 + clamp(day, 1, 30));
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }
  function safeSaveExists() {
    try { return !!localStorage.getItem(SAVE_KEY); } catch (_) { return false; }
  }
  function saveGame(showMessage = false) {
    if (!state) return;
    try {
      state.lastDate = gameDate();
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
      if (showMessage) showToast('進度已保存 ✨');
    } catch (error) {
      if (showMessage) showToast('瀏覽器暫時無法保存；關閉頁面前請先不要清除資料。');
    }
  }
  function loadGame() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.schemaVersion !== 1 || !parsed.stats || !parsed.girls) throw new Error('Invalid save');
      const base = createInitialState(parsed.playerName || '小晴');
      state = {
        ...base, ...parsed,
        stats: { ...base.stats, ...(parsed.stats || {}) },
        girls: {
          hina: { ...defaultGirlState(), ...(parsed.girls.hina || {}), events: { ...((parsed.girls.hina || {}).events || {}) } },
          mio: { ...defaultGirlState(), ...(parsed.girls.mio || {}), events: { ...((parsed.girls.mio || {}).events || {}) } },
          koharu: { ...defaultGirlState(), ...(parsed.girls.koharu || {}), events: { ...((parsed.girls.koharu || {}).events || {}) } }
        },
        settings: { ...base.settings, ...(parsed.settings || {}) },
        diary: Array.isArray(parsed.diary) ? parsed.diary : base.diary,
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : base.inventory,
        messages: { ...base.messages, ...(parsed.messages || {}) },
        unlockedEndings: Array.isArray(parsed.unlockedEndings) ? parsed.unlockedEndings : []
      };
      state.screen = 'game';
      if (!NAV_ITEMS.some((item) => item[0] === state.tab)) state.tab = 'campus';
      state.day = clamp(state.day, 1, 30);
      state.phase = clamp(state.phase, 0, 2);
      document.body.classList.toggle('no-motion', !!state.settings.reduceMotion);
      return true;
    } catch (_) {
      try { localStorage.removeItem(SAVE_KEY); } catch (ignored) { /* storage may be disabled */ }
      state = null;
      return false;
    }
  }
  function changeAffinity(id, amount) {
    if (!state?.girls?.[id]) return;
    state.girls[id].affinity = clamp(state.girls[id].affinity + amount, 0, 100);
  }
  function adjustStat(name, amount, max = 100) {
    if (!state?.stats || !(name in state.stats)) return;
    state.stats[name] = clamp(state.stats[name] + amount, 0, max);
  }
  function relationshipStage(value) {
    if (value >= 80) return '心動與信任';
    if (value >= 60) return '曖昧之間';
    if (value >= 40) return '熟悉的朋友';
    if (value >= 20) return '開始熟絡';
    return '剛剛認識';
  }
  function showToast(message) {
    if (!toastRoot) return;
    toastRoot.innerHTML = `<div class="toast">${escapeHtml(message)}</div>`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toastRoot.innerHTML = ''; }, 2700);
  }
  function playBlip() {
    if (!state?.settings?.sound) return;
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine'; oscillator.frequency.value = 620;
      gain.gain.value = 0.035;
      oscillator.connect(gain); gain.connect(context.destination);
      oscillator.start(); oscillator.stop(context.currentTime + 0.055);
      oscillator.onended = () => context.close();
    } catch (_) { /* sound is optional */ }
  }
  function pushDiary(title, text, tag = '日常') {
    if (!state) return;
    state.diary.unshift({ day: state.day, title, text, tag });
    state.diary = state.diary.slice(0, 100);
  }
  function addMessage(id, from, text) {
    if (!state.messages[id]) state.messages[id] = [];
    state.messages[id].push({ from, text, day: state.day });
    state.messages[id] = state.messages[id].slice(-30);
  }
  function getActionLabel() { return `${PHASE_NAMES[state.phase] || '放學後'}行動`; }

  function renderTitle() {
    const hasSave = safeSaveExists();
    app.innerHTML = `
      <main class="title-screen screen">
        <header class="title-nav">
          <div class="logo-lockup"><div class="logo-mark">♡</div><div><p class="logo-name">戀愛大作戰</p><p class="logo-caption">HEARTBEAT DIARY · 青春戀愛養成</p></div></div>
          <div class="nav-right"><button class="btn btn-soft btn-small" data-action="title-gallery">🖼️ 美術圖鑑</button><button class="btn btn-primary btn-small" data-action="title-continue" ${hasSave ? '' : 'disabled'}>↻ 繼續遊戲</button></div>
        </header>
        <section class="hero-wrap">
          <div class="hero-copy">
            <p class="hero-kicker">AOZORA ACADEMY · SPRING TO SUMMER</p>
            <h1 class="game-title">戀愛大作戰<span>心動日記 ♡</span></h1>
            <p class="hero-subtitle">在普通的校園日常裡，遇見不普通的心動。選擇每天的行程、聆聽她們的心事，寫下只屬於你的青春篇章。</p>
            <div class="hero-actions"><button class="btn btn-pink" data-action="title-new">▶ 開始新故事</button><button class="btn btn-soft" data-action="title-continue" ${hasSave ? '' : 'disabled'}>繼續上次的日記</button></div>
            <div class="hero-footnote"><span>♡ 三位原創女主角</span><span>☁ 多分支對話與結局</span><span>✦ 瀏覽器自動存檔</span></div>
          </div>
        </section>
        <section class="title-section">
          <div class="section-heading"><div><span class="eyebrow">MEET THE HEROINES</span><h2>每一次相遇，都值得被記住。</h2></div><p>點選角色，先認識她們的故事。</p></div>
          <div class="heroines-preview">
            ${Object.values(GIRLS).map((girl) => `<article class="heroine-card" data-action="title-heroine" data-girl="${girl.id}" role="button" tabindex="0"><div class="portrait" style="--portrait-bg:url('${girl.art}')"><img src="${girl.art}" alt="${girl.name} 原創 Anime 角色插畫"></div><div class="card-copy"><h3>${girl.name}</h3><div class="role">${girl.role}</div><p>${girl.intro}</p><span class="card-line">查看人物故事 <b>↗</b></span></div></article>`).join('')}
          </div>
          <div class="feature-row">
            <article class="feature-tile"><div class="feature-icon">♡</div><h3>戀愛養成</h3><p>對話、送禮與約會，累積真正的信任。</p></article>
            <article class="feature-tile"><div class="feature-icon">📔</div><h3>心動日記</h3><p>記錄每個重要事件，收藏不一樣的回憶。</p></article>
            <article class="feature-tile"><div class="feature-icon">🏸</div><h3>校園日常</h3><p>讀書、運動、打工，安排自己的每一天。</p></article>
            <article class="feature-tile"><div class="feature-icon">🎮</div><h3>迷你挑戰</h3><p>限時接球與反應練習，讓玩法更多變。</p></article>
          </div>
        </section>
        <footer class="title-footer"><span>《戀愛大作戰：心動日記》 · 原創角色與故事</span><span>純前端 HTML / CSS / JavaScript · GitHub Pages Ready</span></footer>
      </main>`;
  }

  function renderGameFrame() {
    document.body.classList.toggle('no-motion', !!state.settings.reduceMotion);
    const currentDate = gameDate();
    app.innerHTML = `
      <div class="game-screen screen">
        <header class="game-header">
          <div class="header-brand"><div class="logo-mark">♡</div><div><strong>戀愛大作戰：心動日記</strong><small>青空學園 · 第 ${state.day} 天 · ${currentDate}</small></div></div>
          <div class="header-status">
            <span class="status-chip">🕒 <strong>${state.pendingFinale ? '夏日祭典' : PHASE_NAMES[state.phase]}</strong></span>
            <span class="status-chip">⚡ <strong>${state.stats.stamina}</strong></span>
            <span class="status-chip">🪙 <strong>${state.stats.money}</strong></span>
            <button class="btn btn-soft btn-small" data-action="save-now">💾 保存</button>
            <button class="btn btn-soft btn-small" data-action="return-menu">主選單</button>
          </div>
        </header>
        <div class="game-workspace">
          <aside class="sidebar">
            <section class="panel sidebar-profile">
              <div class="player-avatar">${state.playerAvatar ? `<img src="${escapeHtml(state.playerAvatar)}" alt="主角頭像">` : '🌸'}</div>
              <div><h2>${escapeHtml(state.playerName)}</h2><p>青空學園 · 高中生</p></div>
              <div class="stat-list">
                ${renderStat('⚡','體力','stamina',100)}
                ${renderStat('📚','學業','study',100)}
                ${renderStat('🏃','體能','fitness',100)}
                ${renderStat('✨','魅力','charm',100)}
                ${renderStat('💗','勇氣','courage',100,true)}
              </div>
            </section>
            <nav class="panel sidebar-nav" aria-label="遊戲分頁">
              ${NAV_ITEMS.map(([id, icon, label]) => `<button class="nav-button ${state.tab === id ? 'active' : ''}" data-action="go-tab" data-tab="${id}"><span class="nav-icon">${icon}</span><span>${label}</span></button>`).join('')}
            </nav>
          </aside>
          <main class="main-stage" id="main-stage"></main>
          <aside class="right-rail" id="right-rail"></aside>
        </div>
      </div>`;
    renderCurrentTab();
    renderRightRail();
  }

  function renderStat(icon, name, key, max = 100, pink = false) {
    const val = clamp(state.stats[key], 0, max);
    return `<div class="stat-row"><span class="stat-name">${icon} ${name}</span><strong>${val}/${max}</strong><div class="stat-bar ${pink ? 'pink' : ''}"><span style="width:${val / max * 100}%"></span></div></div>`;
  }

  function renderCurrentTab() {
    const stage = document.getElementById('main-stage');
    if (!stage) return;
    const renderers = {
      campus: renderCampus, characters: renderCharacters, messages: renderMessages,
      journal: renderJournal, gallery: renderGallery, settings: renderSettings, ending: renderEnding
    };
    (renderers[state.tab] || renderCampus)(stage);
  }

  function renderRightRail() {
    const rail = document.getElementById('right-rail');
    if (!rail) return;
    const best = Object.values(GIRLS).sort((a, b) => state.girls[b.id].affinity - state.girls[a.id].affinity)[0];
    const nextGoal = state.day < 8 ? '與任意角色交談，了解她的日常。' : state.day < 15 ? '提升一位角色的好感度，解鎖專屬事件。' : state.day < 23 ? '完成約會或特殊事件，準備夏日祭典。' : '整理心情，為最後的選擇做好準備。';
    rail.innerHTML = `
      <section class="panel rail-panel">
        <div class="rail-title"><h3>💗 心動溫度</h3><small>關係進度</small></div>
        <div class="relationship-list">${Object.values(GIRLS).map((girl) => {
          const aff = state.girls[girl.id].affinity;
          return `<button class="relationship-mini" data-action="view-profile" data-girl="${girl.id}"><img src="${girl.art}" alt=""><span><strong>${girl.short}</strong><small>${relationshipStage(aff)} · ${aff}/100</small><span class="affinity-track"><span style="width:${aff}%"></span></span></span></button>`;
        }).join('')}</div>
      </section>
      <section class="panel rail-panel">
        <div class="rail-title"><h3>☁ 今日目標</h3><small>DAY ${String(state.day).padStart(2,'0')}</small></div>
        <div class="goal-item ${state.totalInteractions >= 2 ? 'done' : ''}"><span class="goal-dot">${state.totalInteractions >= 2 ? '✓' : '1'}</span><span>與角色互動，讓關係慢慢熟悉。</span></div>
        <div class="goal-item ${state.stats.study >= 25 ? 'done' : ''}"><span class="goal-dot">${state.stats.study >= 25 ? '✓' : '2'}</span><span>累積學業能力，解鎖校園對話。</span></div>
        <div class="goal-item ${state.diary.length >= 4 ? 'done' : ''}"><span class="goal-dot">${state.diary.length >= 4 ? '✓' : '3'}</span><span>把重要日子寫進心動日記。</span></div>
        <div class="divider"></div><p class="rail-tip">${escapeHtml(nextGoal)}</p>
        <button class="btn btn-soft btn-block btn-small" data-action="go-tab" data-tab="journal">📔 打開日記</button>
      </section>
      <section class="panel rail-panel"><div class="rail-title"><h3>🌸 今日心情</h3><small>${best.short} 的小提示</small></div><p class="rail-tip">「${escapeHtml(best.quote)}」</p><button class="btn btn-pink btn-block btn-small" data-action="start-chat" data-girl="${best.id}">去找${best.short}聊聊 ↗</button></section>`;
  }

  function renderCampus(stage) {
    const actions = [
      { id: 'study', icon: '📚', title: '圖書館溫習', desc: '學業 +5，慢慢累積實力', cost: '體力 −10', tint: '#dff0ff' },
      { id: 'basketball', icon: '🏀', title: '籃球練習', desc: '體能 +4，可能遇見陽菜', cost: '體力 −18', tint: '#ffe6d6' },
      { id: 'badminton', icon: '🏸', title: '羽毛球練習', desc: '體能 +4，可能遇見澪', cost: '體力 −16', tint: '#dff7f0' },
      { id: 'art', icon: '🎨', title: '美術社幫忙', desc: '魅力 +3，可能遇見小春', cost: '體力 −10', tint: '#ffe4ef' },
      { id: 'work', icon: '🪙', title: '便利店打工', desc: '金錢 +80，為約會做準備', cost: '體力 −22', tint: '#fff0cf' },
      { id: 'rest', icon: '☕', title: '休息一下', desc: '體力 +28，整理一下心情', cost: '消耗一個時段', tint: '#eee7ff' },
      { id: 'chat', icon: '💬', title: '找她聊聊天', desc: '聽聽近況，選擇你的回應', cost: '體力 −8', tint: '#e4f0ff' },
      { id: 'gift', icon: '🎁', title: '挑一份小禮物', desc: '找出她真正喜歡的東西', cost: '金錢 −40 起', tint: '#ffe4ef' },
      { id: 'date', icon: '🌷', title: '邀請她約會', desc: '去校園外走走，製造回憶', cost: '好感度 25+ · 金錢 −40', tint: '#e4f8ef' },
      { id: 'minigame', icon: '🎮', title: '限時迷你挑戰', desc: '接球與反應測試，按得越準越好', cost: '體力 −12', tint: '#e6e8ff' }
    ];
    const phaseText = state.phase === 0 ? '清晨的風穿過校園，今天也有新的可能。' : state.phase === 1 ? '午休時間到了。陽光落在走廊，遠處傳來社團練習的聲音。' : '放學鐘聲響起，校園慢慢染上柔和的夕色。';
    stage.innerHTML = `
      <div class="page-heading"><div><span class="eyebrow">AOZORA ACADEMY</span><h1>校園日常</h1><p>每一個普通的選擇，都可能讓某段關係悄悄改變。</p></div><span class="pill">📅 ${gameDate()} · ${PHASE_NAMES[state.phase]}</span></div>
      <section class="campus-hero"><div class="campus-hero-copy"><span class="pill">第 ${state.day} 天 / 青春進行中</span><h2>今天，也有值得期待的事。</h2><p>${phaseText}</p></div></section>
      <div class="overview-strip"><div class="overview-item"><span class="ico">⚡</span><span><strong>體力 ${state.stats.stamina}/100</strong><small>${state.stats.stamina < 20 ? '有點累了，考慮休息' : '狀態還不錯'}</small></span></div><div class="overview-item"><span class="ico">💗</span><span><strong>最接近：${bestGirl().short}</strong><small>${relationshipStage(state.girls[bestGirl().id].affinity)}</small></span></div><div class="overview-item"><span class="ico">📔</span><span><strong>日記 ${state.diary.length} 篇</strong><small>每一段回憶都會被保存</small></span></div></div>
      <div class="action-head"><div><h2>安排這個時段</h2><p>你還有 ${3 - state.phase} 個時段內的行動機會（本日最多 3 次）。</p></div><span class="pill">🕒 ${getActionLabel()}</span></div>
      <div class="actions-grid">${actions.map((action) => `<button class="action-card" style="--tint:${action.tint}" data-action="act" data-key="${action.id}" ${state.pendingFinale || state.ending ? 'disabled' : ''}><span class="action-cost">${action.cost}</span><span class="action-emoji">${action.icon}</span><strong>${action.title}</strong><small>${action.desc}</small></button>`).join('')}</div>
      <div class="daily-quote"><span class="quote-heart">♡</span><p><small>今日寄語 · ${bestGirl().short}</small>${escapeHtml(bestGirl().quote)}</p></div>`;
  }
  function bestGirl() { return Object.values(GIRLS).sort((a, b) => state.girls[b.id].affinity - state.girls[a.id].affinity)[0]; }

  function renderCharacters(stage) {
    const selected = GIRLS[state.selectedGirl] || GIRLS.hina;
    const aff = state.girls[selected.id].affinity;
    stage.innerHTML = `
      <div class="page-heading"><div><span class="eyebrow">CHARACTER STORY</span><h1>女主角檔案</h1><p>先了解她們的喜好，再用你自己的方式拉近距離。</p></div><span class="pill">♡ 三位原創角色</span></div>
      <div class="content-panel">
        <div class="profile-intro"><img src="${selected.art}" alt="${selected.name} 原創角色插畫"><div><span class="eyebrow">${selected.age} YEARS OLD · ${selected.role.split('・')[0]}</span><h2>${selected.name}</h2><div class="role">${selected.role}</div><p>${selected.intro}</p><blockquote>「${escapeHtml(selected.quote)}」</blockquote><div class="chip-row">${selected.tags.map((tag) => `<span class="pill">${tag}</span>`).join('')}</div><div class="profile-values"><div class="value-tile"><strong>♡ ${aff} / 100</strong><small>目前好感度 · ${relationshipStage(aff)}</small></div><div class="value-tile"><strong>🎁 ${escapeHtml(selected.favorite)}</strong><small>她可能喜歡的禮物</small></div></div><div class="character-buttons"><button class="btn btn-primary" data-action="start-chat" data-girl="${selected.id}">💬 聊聊天</button><button class="btn btn-pink" data-action="give-gift" data-girl="${selected.id}">🎁 送禮物</button><button class="btn btn-soft" data-action="start-date" data-girl="${selected.id}">🌷 邀請約會</button><button class="btn btn-soft" data-action="confess" data-girl="${selected.id}" ${aff < 70 || state.day < 15 ? 'disabled' : ''}>💌 挑戰告白</button></div><p class="small-note">告白提示：建議好感度達 80 以上，並完成更多專屬事件，會更容易迎來好結局。</p></div></div>
        <div class="divider"></div><div class="section-heading"><div><span class="eyebrow">CHOOSE A ROUTE</span><h2>選擇想多了解的她</h2></div><p>選擇角色後，上方檔案會更新。</p></div>
        <div class="characters-grid">${Object.values(GIRLS).map((girl) => `<article class="character-large" data-girl="${girl.id}"><div class="character-art" style="--portrait-bg:url('${girl.art}')"><img src="${girl.art}" alt="${girl.name} 插畫"><span class="aff-badge">♡ ${state.girls[girl.id].affinity}/100</span></div><div class="character-info"><h3>${girl.name}</h3><span class="role">${girl.role}</span><p>${girl.intro}</p><div class="chip-row">${girl.tags.map((tag) => `<span class="pill">${tag}</span>`).join('')}</div><div class="character-buttons"><button class="btn btn-primary" data-action="select-girl" data-girl="${girl.id}">查看檔案</button><button class="btn btn-soft" data-action="start-chat" data-girl="${girl.id}">開始聊天</button></div></div></article>`).join('')}</div>
      </div>`;
  }

  function renderMessages(stage) {
    const current = GIRLS[selectedMessageGirl] || GIRLS.hina;
    const items = state.messages[selectedMessageGirl] || [];
    stage.innerHTML = `
      <div class="page-heading"><div><span class="eyebrow">HEARTBEAT MESSAGES</span><h1>手機訊息</h1><p>有些心事不容易當面說出口，訊息裡或許會藏著新的線索。</p></div><span class="pill">✉️ ${Object.values(state.messages).reduce((sum, list) => sum + (list?.length || 0), 0)} 則紀錄</span></div>
      <div class="content-panel"><div class="messages-layout"><div class="message-contacts">${Object.values(GIRLS).map((girl) => `<button class="message-contact ${selectedMessageGirl === girl.id ? 'active' : ''}" data-action="select-message-girl" data-girl="${girl.id}"><img src="${girl.art}" alt=""><span><strong>${girl.short}</strong><small>${(state.messages[girl.id] || []).length} 則訊息</small></span></button>`).join('')}</div><div class="chat-window"><div class="chat-header"><img src="${current.art}" alt=""><span><strong>${current.name}</strong><small>${relationshipStage(state.girls[current.id].affinity)}</small></span></div><div class="chat-messages">${items.map((message) => `<div class="chat-bubble ${message.from === 'me' ? 'me' : ''}">${message.from === 'me' ? '你' : current.short} · 第 ${message.day} 天<br>${escapeHtml(message.text)}</div>`).join('')}</div><div class="chat-actions"><button class="btn btn-primary btn-small" data-action="message-reply" data-girl="${current.id}">回覆訊息 ↗</button><button class="btn btn-soft btn-small" data-action="start-chat" data-girl="${current.id}">當面聊聊</button></div></div></div><p class="small-note">訊息內容會隨你與角色的互動而增加。回覆會消耗一個行動時段，並可能改變好感度。</p></div>`;
  }

  function renderJournal(stage) {
    const entries = state.diary || [];
    stage.innerHTML = `
      <div class="page-heading"><div><span class="eyebrow">MEMORIES IN WORDS</span><h1>心動日記</h1><p>日常不一定轟轟烈烈，但每個讓人記住的瞬間都值得留下。</p></div><span class="pill">📔 已記錄 ${entries.length} 篇</span></div>
      <div class="content-panel"><div class="journal-list">${entries.length ? entries.map((entry) => `<article class="journal-entry"><div class="journal-date">DAY<br>${String(entry.day).padStart(2,'0')}</div><div><h3>${escapeHtml(entry.title)}</h3><p>${escapeHtml(entry.text)}</p></div><span class="entry-tag">${escapeHtml(entry.tag || '日常')}</span></article>`).join('') : '<div class="empty-state">目前還沒有日記。去和角色聊聊天，開始寫下屬於你的故事吧。</div>'}</div></div>`;
  }

  function renderGallery(stage) {
    stage.innerHTML = `
      <div class="page-heading"><div><span class="eyebrow">ILLUSTRATION & ENDINGS</span><h1>回憶圖鑑</h1><p>收藏三位女主角的原始造型、表情與故事片段。結局會在你完成旅程後解鎖。</p></div><span class="pill">🖼️ ${state.unlockedEndings.length} / 7 結局</span></div>
      <div class="content-panel"><div class="section-heading"><div><span class="eyebrow">ORIGINAL HEROINES</span><h2>女主角・心動瞬間</h2></div><p>保留最初角色設計，畫面只調整裁切與展示比例。</p></div><div class="illustration-gallery">
        <article class="illustration-card"><div class="art-frame portrait-frame" style="--art-bg:url('${ASSET('hina-portrait.jpg')}')"><img src="${ASSET('hina-portrait.jpg')}" alt="朝霧陽菜・原始角色立繪" loading="lazy"></div><div class="art-caption"><strong>朝霧陽菜・球場上的太陽</strong><span>開朗的籃球部少女，總是努力把笑容留給大家。</span></div></article>
        <article class="illustration-card"><div class="art-frame portrait-frame" style="--art-bg:url('${ASSET('mio-portrait.jpg')}')"><img src="${ASSET('mio-portrait.jpg')}" alt="水瀨澪・原始角色立繪" loading="lazy"></div><div class="art-caption"><strong>水瀨澪・安靜的心意</strong><span>慢熱而細心，常在安靜時刻說出最真誠的話。</span></div></article>
        <article class="illustration-card"><div class="art-frame portrait-frame" style="--art-bg:url('${ASSET('koharu-portrait.jpg')}')"><img src="${ASSET('koharu-portrait.jpg')}" alt="藤宮小春・原始角色立繪" loading="lazy"></div><div class="art-caption"><strong>藤宮小春・把天空畫下來</strong><span>溫柔的美術少女，想把珍惜的風景分享給你。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('hina-scene.jpg')}')"><img src="${ASSET('hina-scene.jpg')}" alt="陽菜的原始體育館插畫裁圖" loading="lazy"></div><div class="art-caption"><strong>放學後的最後一球</strong><span>一同練習的時光，慢慢成為只屬於你們的回憶。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('mio-scene.jpg')}')"><img src="${ASSET('mio-scene.jpg')}" alt="澪的原始圖書館插畫裁圖" loading="lazy"></div><div class="art-caption"><strong>圖書館靠窗的午後</strong><span>不需要急著說話，也能感受到彼此的陪伴。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('hina-practice-cg.jpg')}')"><img src="${ASSET('hina-practice-cg.jpg')}" alt="陽菜・籃球練習" loading="lazy"></div><div class="art-caption"><strong>陽菜・籃球練習</strong><span>球場上的笑容，來自一起努力的每一刻。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('hina-cafe-cg.jpg')}')"><img src="${ASSET('hina-cafe-cg.jpg')}" alt="陽菜・練習後的飲料" loading="lazy"></div><div class="art-caption"><strong>陽菜・練習後的飲料</strong><span>她把平常的小事，也變成想和你分享的回憶。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('hina-evening-cg.jpg')}')"><img src="${ASSET('hina-evening-cg.jpg')}" alt="陽菜・黃昏約定" loading="lazy"></div><div class="art-caption"><strong>陽菜・黃昏約定</strong><span>比賽前的夕陽，藏著一點點勇氣。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('mio-library-evening-cg.jpg')}')"><img src="${ASSET('mio-library-evening-cg.jpg')}" alt="澪・圖書館午後" loading="lazy"></div><div class="art-caption"><strong>澪・圖書館午後</strong><span>安靜的陪伴，也能成為珍貴的心動。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('mio-rain-cg.jpg')}')"><img src="${ASSET('mio-rain-cg.jpg')}" alt="澪・雨天的相遇" loading="lazy"></div><div class="art-caption"><strong>澪・雨天的相遇</strong><span>有些話，總是在雨聲裡比較容易說出口。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('mio-night-cg.jpg')}')"><img src="${ASSET('mio-night-cg.jpg')}" alt="澪・夜色散步" loading="lazy"></div><div class="art-caption"><strong>澪・夜色散步</strong><span>夜色裡，她終於願意多說一點心事。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('koharu-studio-cg.jpg')}')"><img src="${ASSET('koharu-studio-cg.jpg')}" alt="小春・美術室創作" loading="lazy"></div><div class="art-caption"><strong>小春・美術室創作</strong><span>把最喜歡的顏色，畫成想分享給你的風景。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('koharu-stationery-cg.jpg')}')"><img src="${ASSET('koharu-stationery-cg.jpg')}" alt="小春・文具店挑選畫具" loading="lazy"></div><div class="art-caption"><strong>小春・挑選畫具</strong><span>她開始想像下一幅畫，會不會有你一起入鏡。</span></div></article>
        <article class="illustration-card"><div class="art-frame scene-frame" style="--art-bg:url('${ASSET('koharu-park-cg.jpg')}')"><img src="${ASSET('koharu-park-cg.jpg')}" alt="小春・櫻花公園寫生" loading="lazy"></div><div class="art-caption"><strong>小春・櫻花公園寫生</strong><span>春天的風景裡，藏著她想留給你的訊息。</span></div></article>
      </div><div class="divider"></div><div class="section-heading"><div><span class="eyebrow">ENDING COLLECTION</span><h2>結局收藏</h2></div><p>達成條件後，這裡會記錄已解鎖結局。</p></div><div class="ending-grid">${Object.entries(ENDINGS).map(([id, ending]) => { const unlocked = state.unlockedEndings.includes(id); return `<article class="ending-card ${unlocked ? 'unlocked' : ''}"><strong>${unlocked ? '✦ ' : '🔒 '}${unlocked ? ending.title : '未解鎖的回憶'}</strong><small>${unlocked ? `${ending.type}<br>${ending.desc}` : ending.desc.slice(0, 42) + '……'}</small></article>`; }).join('')}</div></div>`;
  }

  function renderSettings(stage) {
    const settings = state.settings;
    stage.innerHTML = `
      <div class="page-heading"><div><span class="eyebrow">PREFERENCES</span><h1>遊戲設定</h1><p>調整遊戲體驗。所有進度會保存在這個瀏覽器裡。</p></div><span class="pill">💾 LocalStorage</span></div>
      <div class="content-panel">
        ${settingRow('🔔 音效提示', '按鈕操作時播放輕柔提示音。需要瀏覽器允許播放音效。', 'sound', settings.sound)}
        ${settingRow('✨ 減少動畫', '適合偏好較少轉場或對動畫較敏感的玩家。', 'reduceMotion', settings.reduceMotion)}
        ${settingRow('📖 快速文字', '開啟後會跳過逐字動畫，直接顯示完整台詞。', 'autoText', settings.autoText)}
        ${settingRow('⏩ 劇情自動播放', '台詞顯示完成後，自動推進下一句；出現選項時會暫停。', 'autoPlay', settings.autoPlay)}
        <div class="divider"></div><div class="setting-row"><div><strong>💾 保存目前進度</strong><p>將好感度、日記、訊息、能力和結局紀錄保存到本機瀏覽器。</p></div><button class="btn btn-primary btn-small" data-action="save-now">立即保存</button></div>
        <div class="setting-row"><div><strong>↺ 重新開始新故事</strong><p>開始新的校園生活，會覆蓋目前這份存檔。</p></div><button class="btn btn-soft btn-small" data-action="restart-confirm">重新開始</button></div>
        <div class="setting-row"><div><strong>🗑️ 清除所有存檔</strong><p>永久移除這個瀏覽器中本遊戲的進度與結局收藏。</p></div><button class="btn btn-soft btn-small" data-action="clear-confirm">清除資料</button></div>
        <p class="small-note">提示：不同瀏覽器或不同裝置的存檔不會自動同步。使用 GitHub Pages 時，請不要清除瀏覽器網站資料，否則本機存檔會一起刪除。</p>
      </div>`;
  }
  function settingRow(iconTitle, desc, id, on) {
    const parts = iconTitle.split(' ');
    return `<div class="setting-row"><div><strong>${escapeHtml(iconTitle)}</strong><p>${escapeHtml(desc)}</p></div><button class="switch ${on ? 'on' : ''}" role="switch" aria-checked="${!!on}" aria-label="${escapeHtml(iconTitle)}" data-action="toggle-setting" data-setting="${id}"></button></div>`;
  }

  function renderEnding(stage) {
    if (state.ending && ENDINGS[state.ending]) {
      const ending = ENDINGS[state.ending];
      const girl = ending.girl ? GIRLS[ending.girl] : null;
      stage.innerHTML = `
        <div class="page-heading"><div><span class="eyebrow">YOUR SUMMER STORY</span><h1>故事結局</h1><p>你的選擇，寫下了屬於這段青春的答案。</p></div><span class="pill">✦ 已完成</span></div>
        <section class="ending-hero"><div class="ending-hero-copy"><span class="pill">${escapeHtml(ending.type)}</span><h2>${escapeHtml(ending.title)}</h2><p>${escapeHtml(ending.desc)}</p><p>${girl ? `主角：${girl.name} · 最終好感度 ${state.girls[girl.id].affinity}/100` : '主題：友情、成長與勇氣'}</p></div></section>
        <div class="content-panel" style="margin-top:14px"><h2 style="margin:0 0 8px;font-size:17px">這段回憶已經收進日記。</h2><p style="color:var(--muted);font-size:12px;line-height:1.8">你可以留在這裡回看結局，也可以重新開始，試試不同的選擇。已解鎖結局會保留在本機收藏中。</p><div class="hero-actions"><button class="btn btn-pink" data-action="restart-confirm">開始新一輪</button><button class="btn btn-primary" data-action="go-tab" data-tab="gallery">查看結局收藏</button><button class="btn btn-soft" data-action="go-tab" data-tab="journal">重看心動日記</button></div></div>`;
    } else {
      stage.innerHTML = `<div class="page-heading"><div><span class="eyebrow">FINAL CHAPTER</span><h1>夏日祭典與結局</h1><p>每條故事線都由日常小事累積。當你準備好，可以選擇向某個人說出心意。</p></div></div><div class="content-panel"><div class="ending-hero"><div class="ending-hero-copy"><span class="pill">YOUR CHOICE MATTERS</span><h2>想把這個夏天留給誰？</h2><p>完成更多角色事件、提升好感度與勇氣，可以增加迎來好結局的機會。好感度不足時，故事仍會有溫柔的普通結局。</p><button class="btn btn-pink" data-action="finale-now">前往夏日祭典 ↗</button></div></div><div class="ending-grid">${Object.values(GIRLS).map((girl) => `<article class="ending-card"><strong>${girl.name}</strong><small>目前好感度：${state.girls[girl.id].affinity}/100<br>${relationshipStage(state.girls[girl.id].affinity)}</small><button class="btn btn-soft btn-small btn-block" style="margin-top:10px" data-action="confess" data-girl="${girl.id}" ${state.girls[girl.id].affinity < 70 ? 'disabled' : ''}>嘗試告白</button></article>`).join('')}<article class="ending-card"><strong>友情與成長</strong><small>無論戀愛是否有答案，你也可以為這段青春寫下一個自己的結局。</small><button class="btn btn-soft btn-small btn-block" style="margin-top:10px" data-action="friendship-ending">選擇友情結局</button></article></div></div>`;
    }
  }

  function clearSceneTimers(scene = activeScene) {
    if (!scene) return;
    if (scene.typewriterTimer) clearInterval(scene.typewriterTimer);
    if (scene.autoTimer) clearTimeout(scene.autoTimer);
    scene.typewriterTimer = null;
    scene.autoTimer = null;
  }

  function scheduleSceneAutoAdvance() {
    const scene = activeScene;
    if (!scene) return;
    if (scene.autoTimer) { clearTimeout(scene.autoTimer); scene.autoTimer = null; }
    if (!state?.settings?.autoPlay || scene.typing || scene.resolved) return;
    if (scene.index >= scene.lines.length - 1) return; // pause at choices and at the end of a passage
    scene.autoTimer = setTimeout(() => {
      if (activeScene !== scene || scene.typing || scene.resolved) return;
      if (scene.index < scene.lines.length - 1) {
        scene.index += 1;
        startTypingCurrentLine();
      }
    }, 2200);
  }

  function renderSceneModal() {
    if (!activeScene) { storyRoot.hidden = true; return; }
    storyRoot.hidden = false;
    const scene = activeScene;
    const lines = scene.lines || [];
    const line = lines[scene.index] || { speaker: '旁白', text: '' };
    const girl = scene.girlId ? GIRLS[scene.girlId] : null;
    // A missing scene image must never fall back to a tall character portrait as a full-screen CG.
    // Use a wide landscape scene for each heroine; the portrait is only used in the small nameplate.
    const defaultSceneArt = girl
      ? ({ hina: 'hina-practice-cg.jpg', mio: 'mio-library-evening-cg.jpg', koharu: 'koharu-studio-cg.jpg' }[girl.id] || 'cover-school.jpg')
      : 'cover-school.jpg';
    const requestedArt = scene.art || defaultSceneArt;
    const normalizedArt = ({
      'hina-portrait.jpg': 'hina-campus-cg.jpg',
      'hina-scene.jpg': 'hina-practice-cg.jpg',
      'mio-portrait.jpg': 'mio-library-evening-cg.jpg',
      'koharu-portrait.jpg': 'koharu-studio-cg.jpg'
    })[requestedArt] || requestedArt;
    const art = normalizedArt.startsWith('./') ? normalizedArt : ASSET(normalizedArt);
    const isLastLine = scene.index === lines.length - 1;
    const showChoices = isLastLine && !scene.typing && Array.isArray(scene.choices) && scene.choices.length > 0 && !scene.resolved;
    const showClose = isLastLine && !scene.typing && !showChoices;
    const displayedText = scene.visibleText === undefined ? (line.text || '') : scene.visibleText;

    let card = storyRoot.querySelector('[data-story-modal]');
    if (!card) {
      storyRoot.innerHTML = `
        <div class="modal-backdrop story-backdrop" role="presentation">
          <section class="story-modal" data-story-modal role="dialog" aria-modal="true" aria-label="劇情事件">
            <div class="story-scene">
              <div class="story-art" data-story-art-wrap>
                <img data-story-art src="${escapeHtml(art)}" alt="故事場景" decoding="async" fetchpriority="high" onerror="this.onerror=null;this.src='./assets/cover-school.jpg'">
                <div class="story-art-shade" aria-hidden="true"></div>
              </div>
              <div class="story-logo" aria-label="戀愛大作戰：心動日記"><strong>戀愛<span>大作戰♡</span></strong><small>心・動・日・記</small></div>
              <div class="story-controls" aria-label="劇情控制">
                <button type="button" class="story-control" data-action="toggle-story-auto" data-story-auto><span>▶</span><small>AUTO</small></button>
                <button type="button" class="story-control" data-action="scene-skip"><span>⏭</span><small>SKIP</small></button>
                <button type="button" class="story-control" data-action="scene-menu"><span>☷</span><small>MENU</small></button>
                <button type="button" class="story-control" data-action="scene-settings"><span>⚙</span><small>SET</small></button>
              </div>
              <div class="story-quick-settings" data-story-quick-settings hidden>
                <strong>劇情設定</strong>
                <button type="button" data-action="toggle-setting" data-setting="sound">音效開關</button>
                <button type="button" data-action="toggle-setting" data-setting="autoText">快速文字</button>
                <button type="button" data-action="toggle-setting" data-setting="reduceMotion">減少動畫</button>
                <button type="button" data-action="scene-settings-close">關閉</button>
              </div>
              <div class="story-dialogue-layout">
                <img class="story-mini-portrait" data-story-portrait src="${escapeHtml(girl ? girl.art : ASSET('hina-portrait.jpg'))}" alt="角色小頭像" decoding="async">
                <div class="story-dialogue-panel">
                  <div class="story-speaker-tab" data-story-speaker></div>
                  <div class="story-dialogue-main">
                    <p class="dialogue-text" data-story-dialogue></p>
                    <div class="story-choices" data-story-choices hidden></div>
                  </div>
                  <div class="story-dialogue-footer">
                    <small data-story-note></small>
                    <button type="button" class="story-next-arrow" data-action="scene-next" data-story-next aria-label="繼續閱讀">▼</button>
                    <button type="button" class="story-close-line" data-action="scene-close" data-story-close hidden>收進日記　♡</button>
                  </div>
                  <span class="story-scene-count" data-story-count></span>
                </div>
              </div>
            </div>
          </section>
        </div>`;
      card = storyRoot.querySelector('[data-story-modal]');
    }

    // The scene shell stays mounted. Only text, image URL and visible controls update in place.
    const artElement = card.querySelector('[data-story-art]');
    const artWrap = card.querySelector('[data-story-art-wrap]');
    if (artWrap) artWrap.style.setProperty('--scene-blur-image', `url("${art.replace(/["\\]/g, '\\$&')}")`);
    if (artElement && artElement.getAttribute('src') !== art) artElement.setAttribute('src', art);
    if (artElement) {
      artElement.alt = `${girl ? girl.name : '青空學園'} 劇情插畫`;
      artElement.classList.toggle('story-portrait-source', /-portrait\.jpg$/.test(art));
      artElement.classList.toggle('story-cover-source', art.endsWith('cover-school.jpg'));
    }
    const portraitElement = card.querySelector('[data-story-portrait]');
    const portraitSrc = girl ? girl.art : ASSET('hina-portrait.jpg');
    if (portraitElement && portraitElement.getAttribute('src') !== portraitSrc) portraitElement.setAttribute('src', portraitSrc);
    portraitElement.alt = girl ? `${girl.name} 頭像` : '青空學園角色頭像';

    card.setAttribute('aria-label', scene.title || '劇情事件');
    card.querySelector('[data-story-speaker]').textContent = line.speaker || '旁白';
    card.querySelector('[data-story-dialogue]').textContent = displayedText;
    card.querySelector('[data-story-count]').textContent = `${String(scene.index + 1).padStart(2, '0')} / ${String(lines.length).padStart(2, '0')}`;

    const choicesElement = card.querySelector('[data-story-choices]');
    choicesElement.hidden = !showChoices;
    choicesElement.innerHTML = showChoices ? scene.choices.map((choice, index) => {
      const disabled = typeof choice.canChoose === 'function' ? !choice.canChoose() : !!choice.disabled;
      return `<button class="story-choice" data-action="scene-choice" data-index="${index}" ${disabled ? 'disabled' : ''}><span>${escapeHtml(choice.label)}</span><span>↗</span></button>`;
    }).join('') : '';

    card.querySelector('[data-story-note]').textContent = scene.typing ? '文字顯示中……' : (state?.settings?.autoPlay ? '自動播放已開啟' : '每個選擇，都有機會改變你們的距離。');
    const autoButton = card.querySelector('[data-story-auto]');
    autoButton.classList.toggle('is-active', !!state?.settings?.autoPlay);
    autoButton.setAttribute('aria-pressed', String(!!state?.settings?.autoPlay));
    const nextButton = card.querySelector('[data-story-next]');
    nextButton.hidden = !(scene.typing || scene.index < lines.length - 1);
    nextButton.textContent = '▼';
    card.querySelector('[data-story-close]').hidden = !showClose;
    card.querySelector('[data-story-quick-settings]').hidden = !scene.showQuickSettings;
  }

  function startTypingCurrentLine() {
    const scene = activeScene;
    if (!scene) return;
    clearSceneTimers(scene);
    const line = scene.lines?.[scene.index] || { text: '' };
    const fullText = String(line.text || '');
    const instant = !!(state?.settings?.autoText || state?.settings?.reduceMotion || fullText.length === 0);
    scene.visibleText = instant ? fullText : '';
    scene.typing = !instant;
    scene._typingCharacters = Array.from(fullText);
    scene._typingPosition = 0;
    renderSceneModal();
    if (instant) { scheduleSceneAutoAdvance(); return; }
    scene.typewriterTimer = setInterval(() => {
      if (activeScene !== scene) { clearSceneTimers(scene); return; }
      if (!scene.typing) { clearSceneTimers(scene); return; }
      scene._typingPosition = Math.min(scene._typingCharacters.length, scene._typingPosition + 2);
      scene.visibleText = scene._typingCharacters.slice(0, scene._typingPosition).join('');
      const textElement = storyRoot.querySelector ? storyRoot.querySelector('.dialogue-text') : null;
      if (textElement) textElement.textContent = scene.visibleText;
      if (scene._typingPosition >= scene._typingCharacters.length) {
        clearInterval(scene.typewriterTimer);
        scene.typewriterTimer = null;
        scene.typing = false;
        renderSceneModal();
        scheduleSceneAutoAdvance();
      }
    }, 24);
  }

  function finishTyping() {
    if (!activeScene || !activeScene.typing) return false;
    clearSceneTimers(activeScene);
    const line = activeScene.lines?.[activeScene.index] || { text: '' };
    activeScene.visibleText = String(line.text || '');
    activeScene.typing = false;
    renderSceneModal();
    scheduleSceneAutoAdvance();
    return true;
  }

  function showScene(config) {
    if (activeScene) clearSceneTimers(activeScene);
    activeScene = { index: 0, resolved: false, choices: [], ...config };
    if (!Array.isArray(activeScene.lines) || !activeScene.lines.length) activeScene.lines = [{ speaker: '旁白', text: '這段回憶暫時還未寫完。' }];
    playBlip();
    startTypingCurrentLine();
  }

  function closeScene() {
    if (!activeScene) return;
    const scene = activeScene;
    clearSceneTimers(scene);
    activeScene = null;
    storyRoot.hidden = true;
    if (typeof scene.onClose === 'function') scene.onClose();
  }

  function chooseSceneOption(index) {
    if (!activeScene || activeScene.resolved) return;
    if (activeScene.typing) { finishTyping(); return; }
    const choice = activeScene.choices?.[index];
    if (!choice) return;
    if (typeof choice.canChoose === 'function' && !choice.canChoose()) { showToast(choice.disabledMessage || '目前條件未符合。'); return; }
    if (choice.disabled) return;
    try { if (typeof choice.effect === 'function') choice.effect(); } catch (error) { console.error(error); showToast('這個選項暫時未能完成，請選擇其他回應。'); return; }
    if (typeof activeScene.onChoice === 'function') activeScene.onChoice(choice, index);
    activeScene.resolved = true;
    activeScene.choices = [];
    const outcome = typeof choice.outcome === 'function' ? choice.outcome() : choice.outcome;
    activeScene.lines = [{ speaker: choice.outcomeSpeaker || '心動日記', text: outcome || '你們交換了一個微笑，將這段小小的回憶收藏起來。' }];
    activeScene.index = 0;
    activeScene.closeLabel = '繼續';
    startTypingCurrentLine();
    saveGame();
  }

  function openNameModal() {
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal-card" role="dialog" aria-modal="true" aria-label="建立新故事"><button class="modal-close" data-action="modal-close">×</button><div class="name-form"><span class="eyebrow">NEW SCHOOL YEAR</span><h2>建立你的心動日記</h2><p>為主角取一個名字，然後踏入青空學園。名字可以使用中文、英文或日文。</p><form data-form="start-game"><label class="mini-label" for="player-name">主角名稱（最多 12 字）</label><input class="text-input" id="player-name" name="playerName" type="text" maxlength="12" value="小晴" autocomplete="nickname" required><button class="btn btn-pink btn-block" type="submit">開始我的青春　♡</button></form><p>提示：遊戲進度只會保存在這個瀏覽器，不需要建立帳號。</p></div></section></div>`;
    document.getElementById('player-name')?.focus();
  }

  function startNewGame(name) {
    let previousEndings = Array.isArray(state?.unlockedEndings) ? [...state.unlockedEndings] : [];
    if (!previousEndings.length) {
      try { const saved = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); if (Array.isArray(saved?.unlockedEndings)) previousEndings = [...saved.unlockedEndings]; } catch (_) { /* invalid save: start with an empty collection */ }
    }
    state = createInitialState(name);
    state.unlockedEndings = previousEndings.filter((id) => !!ENDINGS[id]);
    selectedMessageGirl = 'hina';
    saveGame();
    renderGameFrame();
    showScene({
      title: '序章・春天的第一陣風', kicker: 'PROLOGUE · DAY 01', art: 'cover-school.jpg',
      lines: [
        { speaker: '旁白', text: '四月的風穿過青空學園，櫻花花瓣落在操場邊。你剛轉進這所學校，還未完全記熟所有走廊。' },
        { speaker: '陽菜', text: '「啊，你是新同學吧？歡迎！如果找不到教室，隨時可以問我！」一名棕色短髮的女生抱著籃球，笑著向你揮手。' },
        { speaker: '旁白', text: '午休時，你又在圖書館看見安靜閱讀的澪；放學後，美術室窗邊的小春正把今天的天空畫進本子裡。這個學期，似乎會比想像中熱鬧。' },
        { speaker: '心動日記', text: '第一個行動，要從甚麼開始？也許你現在還不知道，這些看似微小的選擇，最後會成為最難忘的回憶。' }
      ],
      choices: [
        { label: '主動和陽菜打招呼，約好下次看她練習', effect: () => { changeAffinity('hina', 5); adjustStat('courage', 2); }, outcome: '陽菜很爽快地答應了，還把練習時間寫在你的手帳邊上。第一個約定，就這樣開始。' },
        { label: '先去圖書館，找澪問問學校的規矩', effect: () => { changeAffinity('mio', 5); adjustStat('study', 2); }, outcome: '澪替你列出幾個重要地點，字跡工整得像印刷一樣。她說有不懂的地方，還可以再來問她。' },
        { label: '到美術室看看小春正在畫甚麼', effect: () => { changeAffinity('koharu', 5); adjustStat('charm', 2); }, outcome: '小春有點害羞地讓你看了一眼畫簿。她說下次會試著畫得更完整，再讓你欣賞。' }
      ],
      onChoice: () => { state.flags.introSeen = true; pushDiary('新學期的第一個約定', '你主動選擇認識一位同學。新的故事由一個簡單的打招呼開始。', '序章'); saveGame(); },
      onClose: () => { state.flags.introSeen = true; saveGame(); renderGameFrame(); }
    });
  }

  function continueGame() {
    if (!loadGame()) { showToast('未找到可用存檔，請開始新故事。'); renderTitle(); return; }
    renderGameFrame();
    showToast('歡迎回來，你的日記已經載入。');
    if (state.pendingFinale) setTimeout(() => triggerFinale(), 150);
  }

  function act(key) {
    if (!state || state.pendingFinale || state.ending) return;
    const actions = {
      study: { cost: 10, run: () => { adjustStat('study', 5); adjustStat('charm', 1); state.lastAction = '在圖書館努力溫習'; pushDiary('圖書館的午後', '你整理好課堂筆記，也在安靜的窗邊找到一點喘息的空間。學業能力有所提升。', '學業'); showToast('學業 +5 · 魅力 +1'); } },
      basketball: { cost: 18, run: () => { adjustStat('fitness', 4); adjustStat('stamina', -18); changeAffinity('hina', 2); state.lastAction = '完成籃球練習'; pushDiary('球場上的汗水', '一輪練習讓你更有精神。陽菜看到你認真運動，也忍不住多教了你幾個小技巧。', '社團'); showToast('體能 +4 · 陽菜好感度 +2'); return true; } },
      badminton: { cost: 16, run: () => { adjustStat('fitness', 4); adjustStat('stamina', -16); changeAffinity('mio', 2); state.lastAction = '完成羽毛球練習'; pushDiary('清晨的羽毛球', '反覆練習步伐之後，你終於接到一球漂亮的回擊。澪輕輕點頭，說你進步了。', '社團'); showToast('體能 +4 · 澪好感度 +2'); return true; } },
      art: { cost: 10, run: () => { adjustStat('charm', 3); changeAffinity('koharu', 2); state.lastAction = '幫美術社整理畫具'; pushDiary('美術室的午後', '你替美術社整理畫具，也聽小春分享幾個她喜歡的顏色。今天的心情比想像中平靜。', '社團'); showToast('魅力 +3 · 小春好感度 +2'); } },
      work: { cost: 22, run: () => { adjustStat('money', 80, 99999); state.lastAction = '在便利店完成打工'; pushDiary('放學後的打工', '你完成便利店的班次，存下一筆可以用來買禮物或約會的零用錢。', '生活'); showToast('金錢 +80'); } },
      rest: { cost: 0, run: () => { adjustStat('stamina', 28); state.lastAction = '在長椅上休息了一會'; pushDiary('樹蔭下的休息', '你在校園長椅上休息，聽著樹葉與遠處社團練習的聲音，重新整理好心情。', '日常'); showToast('體力 +28'); } },
      chat: { cost: 8, run: () => startChatPicker() },
      gift: { cost: 0, run: () => openGiftPicker() },
      date: { cost: 0, run: () => openDatePicker() },
      minigame: { cost: 12, run: () => openMiniGamePicker() }
    };
    const action = actions[key];
    if (!action) return;
    if (key === 'rest') { action.run(); advanceTurn(true); renderGameFrame(); saveGame(); afterAction(); return; }
    if (['chat', 'gift', 'date', 'minigame'].includes(key)) { action.run(); return; }
    if (state.stats.stamina < action.cost) { showToast('體力不足！先休息一下，回復體力再行動。'); return; }
    const extraCostHandled = action.run() === true;
    if (!extraCostHandled) adjustStat('stamina', -action.cost);
    advanceTurn(true); renderGameFrame(); saveGame(); afterAction();
  }

  function advanceTurn(deferEvents = true) {
    if (!state) return;
    state.totalInteractions += 1;
    state.phase += 1;
    if (state.phase >= 3) {
      state.phase = 0;
      if (state.day >= 30) {
        state.phase = 2;
        state.pendingFinale = true;
      } else {
        state.day += 1;
        adjustStat('stamina', 24);
        adjustStat('money', 10, 99999);
        pushDiary(`新的一天・${gameDate(state.day)}`, '清晨的鐘聲再次響起。體力恢復了一些，也多了十元零用錢，今天可以安排新的行動。', '日常');
        state.lastAction = '迎接新的一天';
        showToast(`第 ${state.day} 天開始！體力恢復 +24 · 零用錢 +10`);
      }
    }
    saveGame();
    if (!deferEvents) renderGameFrame();
  }

  function afterAction() {
    if (!state) return;
    saveGame();
    renderGameFrame();
    if (state.pendingFinale && !state.ending) { triggerFinale(); return; }
    maybeTriggerMilestone();
  }

  function startChatPicker() {
    showScene({ title: '想和誰聊聊天？', kicker: 'AFTER SCHOOL · CHOOSE A FRIEND', art: 'cover-school.jpg', lines: [{ speaker: '旁白', text: '放學後，三個方向都傳來熟悉的聲音。今天想先了解誰的近況？' }], choices: Object.values(GIRLS).map((girl) => ({ label: `${girl.name} · ${girl.role.split('・')[0]}`, outcome: `${girl.short} 的故事即將開始。`, effect: () => { state.selectedGirl = girl.id; state._pendingChatGirl = girl.id; }, canChoose: () => state.stats.stamina >= 8 })), onChoice: (choice) => { /* the selected girl is stored by each option */ }, onClose: () => { if (state._pendingChatGirl) { const id = state._pendingChatGirl; state._pendingChatGirl = null; startChat(id); } }
    });
  }

  // Each heroine has a curated scene pool; every interaction rotates the CG instead of reusing one image.
  const SCENE_POOLS = {
    // Every heroine has her own CG pool; never borrow another heroine's image for an event.
    hina: ['hina-practice-cg.jpg', 'hina-court-cg.jpg', 'hina-campus-cg.jpg', 'hina-cafe-cg.jpg', 'hina-evening-cg.jpg', 'hina-sunset-cg.jpg'],
    mio: ['mio-library-evening-cg.jpg', 'mio-rain-cg.jpg', 'mio-night-cg.jpg', 'mio-library-cg.jpg', 'mio-scene.jpg'],
    koharu: ['koharu-studio-cg.jpg', 'koharu-stationery-cg.jpg', 'koharu-park-cg.jpg']
  };
  function nextSceneArt(id, offset = 0) {
    const pool = SCENE_POOLS[id] || ['cover-school.jpg'];
    const count = state?.girls?.[id]?.chats || 0;
    return pool[(count + offset) % pool.length];
  }

  function startChat(id) {
    if (!GIRLS[id]) return;
    if (state?.ending) { showToast('這一輪故事已經結束；可以在設定中開始新一輪。'); return; }
    if (state.stats.stamina < 8) { showToast('體力不足，先休息一下再聊天吧。'); return; }
    const girl = GIRLS[id];
    state.selectedGirl = id;
    selectedMessageGirl = id;
    const count = state.girls[id].chats;
    const scripts = {
      hina: [
        [
          ['旁白', '體育館的門還沒有關上。陽菜坐在地板邊整理護膝，看到你便把水瓶放到旁邊。'],
          ['陽菜', '「今日練習有點難，但有一球我終於投進了！你想聽我講細節，還是想直接挑戰一球？」']
        ],
        [
          ['陽菜', '「我本來以為自己最喜歡贏球。後來發現，原來有人願意聽我講那些很小的事，也很開心。」'],
          ['陽菜', '她把球輕輕拋到你手上：「所以，今日換你講吧。最近有沒有甚麼期待的事？」']
        ],
        [
          ['旁白', '陽菜把兩瓶運動飲品放到長椅上，猶豫了半秒，將其中一瓶推到你面前。'],
          ['陽菜', '「我記得你上次說過喜歡這個味道。其實……我有把你講過的小事放在心上啦。」']
        ],
        [
          ['陽菜', '「下星期有一場重要練習賽，我有點緊張。」'],
          ['陽菜', '她深吸一口氣，又笑了：「如果你能來看，我就會把它當成最重要的主場！」']
        ]
      ],
      mio: [
        [
          ['旁白', '圖書館靠窗的位置還有空位。澪合上書本，替你把椅子拉開一點。'],
          ['澪', '「今天的筆記我整理好了。你想一起溫習，還是……先休息幾分鐘再開始？」']
        ],
        [
          ['澪', '「我以前覺得，一天最好的時間就是所有事情都完成的時候。」'],
          ['澪', '她望向窗外：「現在好像多了一個例外。就是明明沒有特別的事，也會期待見到某個人。」']
        ],
        [
          ['旁白', '澪把一本薄薄的詩集放到桌上，書頁間夾著一張小小的書籤。'],
          ['澪', '「這一頁我很喜歡。以前總覺得很難解釋，今天卻突然想讀給你聽。」']
        ],
        [
          ['澪', '「昨晚下雨，我聽了很久。」'],
          ['澪', '她輕輕轉著杯子：「我本來想傳訊息給你，問你有沒有聽見。最後還是等到今天，想親口問。」']
        ]
      ],
      koharu: [
        [
          ['旁白', '小春在美術室的窗邊畫畫，桌上放著幾支不同色調的鉛筆。她把畫簿轉向你一點。'],
          ['小春', '「我今天試著畫學校後面的樹。你覺得，這個顏色會不會太淡？」']
        ],
        [
          ['小春', '「畫畫的時候，我會把不敢直接說的話放進顏色裡。」'],
          ['小春', '她微微笑了：「不過跟你聊天的時候，好像不用每件事都畫出來，也能被理解。」']
        ],
        [
          ['旁白', '小春把幾張速寫攤在桌上，裡面有操場、校門口和一片被風吹起的櫻花。'],
          ['小春', '「我發現自己最近很常畫到同一個背影……你猜猜看，為甚麼？」']
        ],
        [
          ['小春', '「我今天試了新的顏色，畫出來的天空跟平常完全不一樣。」'],
          ['小春', '她把畫紙遞給你：「我想把這種心情分享給你。因為想到你時，顏色好像也會變得柔和。」']
        ]
      ]
    };
    const lines = scripts[id][count % scripts[id].length].map(([speaker, text]) => ({ speaker, text }));
    showScene({
      title: `${girl.short}・放學後的閒聊`, kicker: 'DAILY CONVERSATION', girlId: id, art: nextSceneArt(id), lines,
      choices: chatChoices(id),
      onChoice: (choice) => {
        state.girls[id].chats += 1;
        addMessage(id, 'me', choice.message || choice.label);
        addMessage(id, id, choice.reply || '嗯，和你聊完之後，心情好像明亮了一點。');
        state.selectedGirl = id;
        state.totalInteractions += 0;
        pushDiary(`和${girl.short}聊了聊天`, choice.diary || `你和${girl.short}分享了想法，關係又更熟悉了一點。`, '互動');
        advanceTurn(true);
        saveGame();
      },
      onClose: () => afterAction()
    });
  }

  function chatChoices(id) {
    if (id === 'hina') return [
      { label: '認真聽她講練習的細節，替她打氣', effect: () => { changeAffinity(id, 6); adjustStat('charm', 1); }, outcome: '陽菜的眼睛亮了起來。「你真的有在聽耶！下次比賽也要來看我！」', message: '我有認真聽你講！下次比賽我也會替你加油。', reply: '好！那我一定要打出最好的狀態！', diary: '你聽陽菜分享練習細節，並認真替她打氣。' },
      { label: '提議來一場小小的投籃比賽', effect: () => { changeAffinity(id, 4); adjustStat('fitness', 2); }, outcome: '你們玩到笑得停不下來。陽菜說，輸贏先放一邊，這樣的練習也很有趣。', message: '下次來場投籃比賽吧！', reply: '好呀！輸的人請喝運動飲品！', diary: '你和陽菜在球場上玩了一場友誼投籃。' },
      { label: '問她除了籃球，最近還有甚麼煩惱', effect: () => { changeAffinity(id, 5); adjustStat('courage', 1); }, outcome: '陽菜慢慢說出最近的壓力。她似乎很感激，你沒有只把她當成球場上的主力。', message: '如果有煩惱也可以跟我講。', reply: '謝謝你。我有時真的會想太多……下次再慢慢講給你聽。', diary: '你讓陽菜知道，她不需要每一刻都表現得很堅強。' }
    ];
    if (id === 'mio') return [
      { label: '和她一起整理筆記，互相補充', effect: () => { changeAffinity(id, 6); adjustStat('study', 2); }, outcome: '澪在你的筆記旁寫下一行小小的補充。她說，下次還可以一起溫習。', message: '我整理好筆記了，下次也一起溫習吧。', reply: '好。我會留靠窗的位置給你。', diary: '你與澪一起整理筆記，互相分享各自的學習方法。' },
      { label: '問她為甚麼總是這麼早來練習', effect: () => { changeAffinity(id, 5); adjustStat('courage', 1); }, outcome: '澪說起自己的目標，也坦白承認偶爾會覺得孤單。你發現她比表面上更願意分享。', message: '你為甚麼總是這麼早來練習？', reply: '因為清晨很安靜。不過……有人一起時，也很不錯。', diary: '澪和你分享了自己堅持練習的原因。' },
      { label: '安靜陪她看窗外的雲', effect: () => { changeAffinity(id, 4); adjustStat('charm', 1); }, outcome: '你們沒有說太多話。離開前，澪卻特意問你明天還會不會來。', message: '今天的雲很好看。', reply: '嗯。謝謝你陪我看了一會。', diary: '你和澪一起度過安靜的午後，發現沉默也可以很自在。' }
    ];
    return [
      { label: '仔細聽她說畫裡的故事', effect: () => { changeAffinity(id, 6); adjustStat('charm', 2); }, outcome: '小春談起畫中的顏色和回憶，說話比平常更有精神。她把這次聊天也畫成了一個小小的記號。', message: '我想聽你講這幅畫的故事。', reply: '真的嗎？那我下次帶更多畫給你看！', diary: '你耐心聽小春說明作品背後的故事。' },
      { label: '邀她去找一個新的寫生地點', effect: () => { changeAffinity(id, 5); adjustStat('courage', 1); }, outcome: '小春立刻拿出手帳記下地點。她說，只要能一起找風景，去哪裡都好。', message: '下次一起去找新的寫生地點吧。', reply: '好！我已經想到幾個地方了。', diary: '你和小春約好下一次一起找畫畫素材。' },
      { label: '告訴她，你喜歡她真誠的樣子', effect: () => { changeAffinity(id, 5); adjustStat('courage', 1); }, outcome: '小春一時不知道怎樣回答，最後只是輕輕把畫簿抱緊了一點。她的笑容比剛才更自然。', message: '我喜歡你認真又真誠的樣子。', reply: '謝、謝謝……我會把這句話記下來。', diary: '你向小春表達欣賞，也讓她更有勇氣做自己。' }
    ];
  }

  function openGiftPicker(id = null) {
    if (state?.ending) { showToast('這一輪故事已經結束；可以開始新一輪探索其他結局。'); return; }
    if (id && GIRLS[id]) { openGiftItemPicker(id); return; }
    const targets = Object.values(GIRLS);
    showScene({
      title: '挑選一份小禮物', kicker: 'A LITTLE PRESENT', art: 'cover-school.jpg',
      lines: [{ speaker: '旁白', text: `便利店和文具店就在校門附近。你想為誰挑一份小禮物？她的喜好會影響收到禮物時的反應。` }],
      choices: targets.map((girl) => ({ label: `${girl.name} · 喜歡 ${girl.favorite}`, effect: () => { state._giftTarget = girl.id; }, outcome: `你決定替${girl.short}挑一份禮物。下一步，選擇真正要送出的東西。` })),
      onClose: () => { if (state._giftTarget) { const target = state._giftTarget; state._giftTarget = null; openGiftItemPicker(target); } }
    });
  }

  function openGiftItemPicker(id) {
    const girl = GIRLS[id];
    state.selectedGirl = id;
    selectedMessageGirl = id;
    const gifts = [
      { id: 'drink', label: '運動飲品', price: 45, match: 'hina', emoji: '🥤', desc: '清爽、實用的小心意。', art: 'hina-court-cg.jpg' },
      { id: 'milk', label: '熱牛奶', price: 40, match: 'mio', emoji: '🥛', desc: '適合安靜午後的溫暖。', art: 'mio-library-cg.jpg' },
      { id: 'sketchbook', label: '素描本', price: 60, match: 'koharu', emoji: '📒', desc: '讓靈感可以被留下來。', art: 'koharu-scene.jpg' },
      { id: 'sweets', label: '草莓蛋糕', price: 50, match: 'koharu', emoji: '🍰', desc: '甜甜的，一起分享最好。', art: 'classroom-window-cg.jpg' }
    ];
    showScene({
      title: `送給${girl.short}的禮物`, kicker: 'PICK A PRESENT', girlId: id, art: nextSceneArt(id, state.girls[id].gifts),
      lines: [{ speaker: '旁白', text: `你站在貨架前，想起${girl.short}平日喜歡的東西。選一份禮物送給她吧。每次送禮都會留下不同的反應和回憶。` }],
      choices: gifts.map((gift) => ({
        label: `${gift.emoji} ${gift.label} · ${gift.price} 元`, disabled: state.stats.money < gift.price,
        canChoose: () => state.stats.money >= gift.price,
        disabledMessage: '金錢不足。可以先去打工賺取零用錢。',
        effect: () => {
          state.stats.money = Math.max(0, state.stats.money - gift.price);
          const match = gift.match === id || (gift.id === 'drink' && id === 'hina') || (gift.id === 'milk' && id === 'mio');
          changeAffinity(id, match ? 9 : 4);
          state.girls[id].gifts += 1;
          state.inventory.push(gift.label);
          state.lastAction = `送給${girl.short}${gift.label}`;
          pushDiary(`送給${girl.short}的小禮物`, `你花了 ${gift.price} 元，送給${girl.short}${gift.label}。${match ? '她看起來真的很喜歡。' : '她有禮貌地收下，也感謝你的心意。'}`, '禮物');
          state._giftSent = { id, gift: gift.label, giftId: gift.id, match, art: nextSceneArt(id, state.girls[id].gifts) };
          state.selectedGirl = id;
          advanceTurn(true);
        },
        outcome: () => {
          const sent = state._giftSent;
          if (sent && activeScene) { activeScene.girlId = sent.id; activeScene.art = sent.art || nextSceneArt(sent.id, state.girls[sent.id].gifts); }
          if (!sent) return '你們交換了一個微笑。';
          const reactions = {
            hina: [
              `陽菜把${sent.gift}抱在胸前，眼睛亮了起來：「你竟然特地挑給我！下次練習完，我也要請你喝飲料！」`,
              `陽菜笑著把禮物收好：「我會好好珍惜的。下次比賽，你一定要坐在看台最前面喔！」`,
              `陽菜有點不好意思地別開視線：「收到你的禮物，比我投進決勝球還開心……這句不准告訴隊友！」`,
              `陽菜輕輕碰了碰禮物：「我想把今天記下來。下次換我準備一份驚喜給你！」`
            ],
            mio: [
              `澪用雙手接過${sent.gift}，輕聲說：「你還記得我提過這個……謝謝，我真的很喜歡。」`,
              `澪低頭看著禮物，嘴角露出淡淡的笑：「我本來想等回家再拆，但……可以和你一起看嗎？」`,
              `澪小心地把${sent.gift}收進袋裡：「今天讀書時，我大概會一直想起這份心意。」`,
              `澪的耳尖微微泛紅：「我不太擅長收禮物，不過如果是你送的，我想慢慢學會怎樣好好回應。」`
            ],
            koharu: [
              `小春翻看著${sent.gift}，眼睛亮了起來：「我已經想到可以怎樣用了！第一個想法想先畫給你看。」`,
              `小春把禮物放在畫簿旁邊：「這樣一來，今天也有值得記住的顏色了。謝謝你。」`,
              `小春笑著問：「下次可以陪我一起用這個嗎？我想把那一天也畫進手帳裡。」`,
              `小春把禮物小心收好：「我會珍惜的。其實，比起禮物本身，我更開心你記得我。」`
            ]
          };
          const pool = reactions[sent.id] || reactions.hina;
          const reaction = pool[(Math.max(1, state.girls[sent.id].gifts) - 1) % pool.length];
          return sent.match ? reaction : `${girl.short}微笑著接過${sent.gift}：「謝謝你想到我。這份心意我會好好收下，也想多了解你為甚麼會選它。」`;
        }
      })),
      onClose: () => { state._giftSent = null; afterAction(); }
    });
  }

  function openDatePicker(id = null) {
    if (state?.ending) { showToast('這一輪故事已經結束；可以開始新一輪探索其他結局。'); return; }
    const available = Object.values(GIRLS).filter((girl) => state.girls[girl.id].affinity >= 25);
    if (id) {
      if (state.girls[id].affinity < 25) { showToast('好感度達到 25 後，才適合正式邀請約會。'); return; }
      openDateLocationPicker(id); return;
    }
    if (!available.length) { showToast('先與角色聊天、送禮物或參加社團，讓好感度達到 25 吧。'); return; }
    showScene({ title: '想約誰一起出去？', kicker: 'WEEKEND PLAN', art: 'cover-school.jpg', lines: [{ speaker: '旁白', text: '難得有一段自由時間。你想邀請誰，一起離開校園走走？' }], choices: available.map((girl) => ({ label: `${girl.name} · 好感度 ${state.girls[girl.id].affinity}`, effect: () => { state._dateTarget = girl.id; }, outcome: `你決定邀請${girl.short}。要去哪裡，才會成為適合你們的回憶呢？` })), onClose: () => { if (state._dateTarget) { const target = state._dateTarget; state._dateTarget = null; openDateLocationPicker(target); } }
    });
  }

  function openDateLocationPicker(id) {
    const girl = GIRLS[id];
    state.selectedGirl = id;
    selectedMessageGirl = id;
    const places = [
      { id: 'park', icon: '🌳', name: '河畔公園', price: 40, match: 'hina', art: 'hina-campus-cg.jpg', lines: '你們沿著河畔散步，聊到各自希望在夏天完成的事。風吹過樹梢，陽菜似乎比平日更放鬆。' },
      { id: 'bookstore', icon: '📚', name: '獨立書店', price: 40, match: 'mio', art: 'mio-library-cg.jpg', lines: '你們在書架之間慢慢走。澪把一本自己喜歡的書交給你，說想知道你看完後的想法。' },
      { id: 'cafe', icon: '🍰', name: '街角咖啡店', price: 50, match: 'koharu', art: 'classroom-window-cg.jpg', lines: '小春選了靠窗的位置，兩人一邊分享甜點，一邊看著人來人往。她偷偷替這個下午畫了一張速寫。' },
      { id: 'campus', icon: '☁️', name: '校園後方看夕陽', price: 20, match: null, art: 'hina-sunset-cg.jpg', lines: '你們走到校園後方，看著天空從淺藍變成淡橙色。平常熟悉的校園，今天好像有點不一樣。' }
    ];
    showScene({ title: `邀請${girl.short}約會`, kicker: 'A LITTLE DATE', girlId: id, lines: [{ speaker: '旁白', text: `${girl.short}答應和你一起出去。選擇一個地點，讓這段時間留下特別的回憶。` }], choices: places.map((place) => ({
      label: `${place.icon} ${place.name} · ${place.price} 元`, disabled: state.stats.money < place.price, canChoose: () => state.stats.money >= place.price, disabledMessage: '金錢不足，先去打工吧。',
      effect: () => {
        state.stats.money = Math.max(0, state.stats.money - place.price);
        const match = place.match === id;
        changeAffinity(id, match ? 10 : 6);
        adjustStat('charm', 1);
        state.girls[id].dates += 1;
        state._dateResult = { girl: id, place: place.name, text: `${girl.short}和你${place.name === '獨立書店' ? '慢慢走過書架，分享最近想看的故事。' : place.name === '街角咖啡店' ? '坐在靠窗的位置分享甜點，也聊起各自喜歡的風景。' : place.name === '河畔公園' ? '沿著河畔散步，聊到各自希望在夏天完成的事。' : '並肩看著天空從淺藍變成淡橙色，聊起最近的小心事。'}`, match, art: nextSceneArt(id, state.girls[id].dates) };
        state.selectedGirl = id;
        pushDiary(`與${girl.short}的約會`, `你和${girl.short}去了${place.name}。${place.lines}`, '約會');
        addMessage(id, id, `今天去了${place.name}，我覺得很開心。下次也一起出去吧。`);
        advanceTurn(true);
      },
      outcome: () => {
        const result = state._dateResult;
        if (result && result.art && activeScene) activeScene.art = result.art;
        return result ? `${result.text}${result.match ? `

${girl.short}的心情特別好。你選中了她喜歡的約會地點，好感度提升更多。` : `

${girl.short}很享受這段時間。只要是一起度過的普通日子，也能成為回憶。`}` : '你們一起度過了愉快的時間。'
      }
    })), onClose: () => { state._dateResult = null; afterAction(); } });
  }

  function startConfession(id) {
    if (state?.ending) { showToast('這一輪故事已經結束；可以開始新一輪探索其他結局。'); return; }
    const girl = GIRLS[id];
    if (state.day < 15 || state.girls[id].affinity < 70) { showToast('先多一點相處與回憶吧。建議第 15 天後、好感度 70 以上再考慮告白。'); return; }
    showScene({
      title: `給${girl.short}的答案`, kicker: 'A HEARTBEAT DECISION', girlId: id, art: ASSET(nextSceneArt(id, state.girls[id].dates + state.girls[id].gifts)),
      lines: [
        { speaker: '旁白', text: `黃昏的校園漸漸安靜。你和${girl.short}並肩站在熟悉的地方，最近累積的每一段回憶都浮上心頭。` },
        { speaker: girl.short, text: id === 'hina' ? '「我想知道……對你來說，我是不是也有一點特別？」' : id === 'mio' ? '「如果我說，最近最期待的事情是見到你……你會怎樣回答？」' : '「我畫了很多風景，但每一次回看，總覺得少了你就不完整。」' },
        { speaker: '旁白', text: '這不是一個能靠能力值完全計算的時刻。你可以鼓起勇氣，也可以選擇再累積一點回憶。' }
      ],
      choices: [
        { label: '鼓起勇氣，說出一直藏在心底的心意', effect: () => { finalizeEnding(id); }, outcome: () => { const ending = ENDINGS[state.ending]; return ending ? `${ending.title}

${ending.desc}` : '你們終於認真地說出了心底的話。' } },
        { label: '再多珍惜一段相處時光，暫時不告白', effect: () => { changeAffinity(id, 2); adjustStat('courage', 1); }, outcome: `你決定不急著要答案。${girl.short}露出安心的笑容，你們約好繼續把接下來的日子過好。` }
      ],
      onChoice: (choice) => { if (choice.label.startsWith('再多')) { pushDiary(`與${girl.short}的未完告白`, '你決定再多珍惜一段相處時光，讓感情在日常裡慢慢成長。', '心動'); advanceTurn(true); } else { pushDiary(`向${girl.short}告白`, ENDINGS[state.ending]?.desc || '你終於說出心意。', '結局'); saveGame(); } },
      onClose: () => { if (state.ending) { state.tab = 'ending'; saveGame(); renderGameFrame(); } else afterAction(); }
    });
  }

  function maybeTriggerMilestone() {
    if (!state || state.pendingFinale || state.ending || activeScene || activeMiniGame) return;
    const activeGirlIds = state.selectedGirl && MILESTONES[state.selectedGirl] ? [state.selectedGirl] : Object.keys(MILESTONES);
    for (const girlId of activeGirlIds) {
      const milestones = MILESTONES[girlId];
      for (const event of milestones) {
        const gs = state.girls[girlId];
        if (gs.affinity >= event.min && state.day >= event.day && !gs.events[event.key]) {
          gs.events[event.key] = true;
          pushDiary(event.title, `你與${GIRLS[girlId].short}觸發了專屬事件。這段回憶讓你更了解她的內心。`, '角色事件');
          saveGame();
          showScene({
            title: event.title, kicker: 'SPECIAL MEMORY UNLOCKED', girlId, art: event.art,
            lines: event.lines.map(([speaker, text]) => ({ speaker, text })), choices: event.choices,
            onChoice: () => { saveGame(); },
            onClose: () => { afterAction(); }
          });
          return;
        }
      }
    }
  }

  function triggerFinale() {
    if (!state || !state.pendingFinale || activeScene || activeMiniGame || state.ending) return;
    const eligible = Object.values(GIRLS).filter((girl) => state.girls[girl.id].affinity >= 35);
    const choices = eligible.map((girl) => ({
      label: `向${girl.short}說出心意 · 好感度 ${state.girls[girl.id].affinity}`,
      effect: () => finalizeEnding(girl.id),
      outcome: () => { const ending = ENDINGS[state.ending]; return ending ? `${ending.title}

${ending.desc}` : '你們把這段青春的心意好好說清楚了。'; }
    }));
    choices.push({ label: '把這個夏天留給友情與自己的成長', effect: () => finalizeEnding(null), outcome: () => ENDINGS.friendship.desc });
    showScene({
      title: '夏日祭典・最後的選擇', kicker: 'FINAL CHAPTER · DAY 30', art: 'cover-school.jpg',
      lines: [
        { speaker: '旁白', text: '夏日祭典的燈籠一盞盞亮起，遠處傳來人群的笑聲。這三十天裡，你做過許多小小的決定，也慢慢看清自己珍惜的是甚麼。' },
        { speaker: '旁白', text: '煙花即將升起。是時候替這段青春寫下答案了。請選擇你想留下的結局。' }
      ], choices,
      onChoice: () => { if (state.ending) pushDiary(ENDINGS[state.ending].title, ENDINGS[state.ending].desc, '結局'); saveGame(); },
      onClose: () => { if (state.ending) { state.tab = 'ending'; renderGameFrame(); saveGame(); } else { renderGameFrame(); if (state.pendingFinale) setTimeout(() => triggerFinale(), 120); } }
    });
  }

  function finalizeEnding(id) {
    let endingId = 'friendship';
    if (id && GIRLS[id]) {
      const gs = state.girls[id];
      const eventCount = Object.keys(gs.events || {}).filter((key) => gs.events[key]).length;
      const good = gs.affinity >= 80 && state.stats.courage >= 18 && eventCount >= 2;
      endingId = `${id}_${good ? 'good' : 'normal'}`;
    }
    state.ending = endingId;
    state.pendingFinale = false;
    if (!state.unlockedEndings.includes(endingId)) state.unlockedEndings.push(endingId);
    state.flags.gallerySeen = true;
    saveGame();
  }

  function openMiniGamePicker() {
    if (state.stats.stamina < 12) { showToast('體力不足，休息後再挑戰吧。'); return; }
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal-card modal-simple" role="dialog" aria-modal="true"><button class="modal-close" data-action="modal-close">×</button><span class="eyebrow">MINI CHALLENGE</span><h2>選擇迷你遊戲</h2><p>挑戰會消耗 12 點體力和一個行動時段。分數越高，得到的體能獎勵越多。</p><div class="feature-row" style="grid-template-columns:repeat(2,minmax(0,1fr))"><article class="feature-tile"><div class="feature-icon">🏀</div><h3>限時接球挑戰</h3><p>12 秒內點擊目標，考驗反應和手速。</p><button class="btn btn-primary btn-small btn-block" style="margin-top:12px" data-action="minigame-start" data-kind="basketball">開始接球</button></article><article class="feature-tile"><div class="feature-icon">🏸</div><h3>羽毛球反應</h3><p>快速追蹤目標，按下拍子完成回擊。</p><button class="btn btn-pink btn-small btn-block" style="margin-top:12px" data-action="minigame-start" data-kind="badminton">開始反應測試</button></article></div><p class="small-note">小提示：手機可以直接用手指點擊；桌面可用滑鼠。</p></section></div>`;
  }

  function launchMiniGame(kind) {
    activeMiniGame = { kind, score: 0, seconds: 12, started: false, finished: false, timer: null };
    renderMiniGameModal();
  }
  function renderMiniGameModal() {
    if (!activeMiniGame) { modalRoot.innerHTML = ''; return; }
    const mini = activeMiniGame;
    const isBasketball = mini.kind === 'basketball';
    const name = isBasketball ? '限時接球挑戰' : '羽毛球反應測試';
    const view = mini.finished ? 'finished' : (mini.started ? 'playing' : 'ready');
    let card = modalRoot.querySelector('[data-minigame-modal]');

    if (card && card.dataset.kind === mini.kind && card.dataset.view === view) {
      // In-place update during the countdown and on each hit: no modal teardown, no flash.
      const scoreEl = card.querySelector('[data-mini-score]');
      const secondsEl = card.querySelector('[data-mini-seconds]');
      const bestEl = card.querySelector('[data-mini-best]');
      if (scoreEl) scoreEl.textContent = String(mini.score);
      if (secondsEl) secondsEl.textContent = `${mini.started ? mini.seconds : 12} 秒`;
      if (bestEl) bestEl.textContent = String(state.miniGameBest[mini.kind] || 0);
      const target = card.querySelector('[data-mini-target]');
      if (target && view === 'playing') {
        target.style.left = `${11 + ((mini.score * 23 + 17) % 68)}%`;
        target.style.top = `${12 + ((mini.score * 17 + 19) % 64)}%`;
      }
      return;
    }

    if (mini.finished) {
      modalRoot.innerHTML = `<div class="modal-backdrop modal-static"><section class="minigame-card" data-minigame-modal data-kind="${mini.kind}" data-view="finished" role="dialog" aria-modal="true"><div class="minigame-header"><h2>挑戰完成！</h2><span class="pill">${name}</span></div><div class="minigame-field minigame-result-field"><div class="minigame-result"><div class="result-emoji">${mini.score >= 15 ? '🏆' : '🌸'}</div><h2>${mini.score} 分</h2><p>${mini.score >= 20 ? '反應超級快！今天狀態很好。' : mini.score >= 10 ? '做得不錯，再練習幾次會更好。' : '慢慢來，多練習就會進步。'}</p></div></div><div class="minigame-stats"><div class="minigame-stat"><strong>+${Math.floor(mini.score / 3) + 1}</strong><small>體能獎勵</small></div><div class="minigame-stat"><strong data-mini-best>${Math.max(0, state.miniGameBest[mini.kind] || 0)}</strong><small>最高紀錄</small></div><div class="minigame-stat"><strong>12 秒</strong><small>挑戰長度</small></div></div><div class="minigame-actions"><button class="btn btn-primary" data-action="minigame-close">收下獎勵</button><button class="btn btn-soft" data-action="minigame-retry" data-kind="${mini.kind}">再挑戰一次</button></div></section></div>`;
      return;
    }

    const x = 11 + ((mini.score * 23 + 17) % 68);
    const y = 12 + ((mini.score * 17 + 19) % 64);
    modalRoot.innerHTML = `<div class="modal-backdrop modal-static"><section class="minigame-card" data-minigame-modal data-kind="${mini.kind}" data-view="${view}" role="dialog" aria-modal="true"><div class="minigame-header"><div><span class="eyebrow">QUICK REFLEX</span><h2>${name}</h2></div><button class="btn btn-soft btn-small" data-action="minigame-cancel">暫停</button></div><p class="minigame-instructions">${mini.started ? '快點擊畫面中的目標！每次命中都會增加分數。' : '準備好未？按開始後，盡可能在 12 秒內點擊目標。'}</p><div class="minigame-field">${mini.started ? `<button class="target-button" data-mini-target style="left:${x}%;top:${y}%;transform:translate(-50%,-50%)" data-action="mini-hit" aria-label="點擊目標">${isBasketball ? '🏀' : '🏸'}</button>` : `<div class="minigame-start"><button class="btn btn-pink" data-action="minigame-begin">開始挑戰　▶</button></div>`}</div><div class="minigame-stats"><div class="minigame-stat"><strong data-mini-score>${mini.score}</strong><small>命中次數</small></div><div class="minigame-stat"><strong data-mini-seconds>${mini.started ? mini.seconds : '12'} 秒</strong><small>剩餘時間</small></div><div class="minigame-stat"><strong data-mini-best>${state.miniGameBest[mini.kind] || 0}</strong><small>最佳分數</small></div></div></section></div>`;
  }

  function beginMiniGame() {
    if (!activeMiniGame || activeMiniGame.started) return;
    activeMiniGame.started = true;
    renderMiniGameModal();
    activeMiniGame.timer = setInterval(() => {
      if (!activeMiniGame || activeMiniGame.finished) return;
      activeMiniGame.seconds -= 1;
      if (activeMiniGame.seconds <= 0) finishMiniGame();
      else renderMiniGameModal();
    }, 1000);
  }
  function hitMiniTarget() {
    if (!activeMiniGame?.started || activeMiniGame.finished) return;
    activeMiniGame.score += 1;
    playBlip();
    renderMiniGameModal();
  }
  function finishMiniGame() {
    if (!activeMiniGame || activeMiniGame.finished) return;
    const mini = activeMiniGame;
    clearInterval(mini.timer);
    mini.finished = true;
    state.miniGameBest[mini.kind] = Math.max(state.miniGameBest[mini.kind] || 0, mini.score);
    adjustStat('stamina', -12);
    adjustStat('fitness', Math.floor(mini.score / 3) + 1);
    if (mini.score >= 10) {
      const id = mini.kind === 'basketball' ? 'hina' : 'mio';
      changeAffinity(id, Math.min(5, Math.floor(mini.score / 5)));
    }
    pushDiary(mini.kind === 'basketball' ? '限時接球挑戰' : '羽毛球反應測試', `你在迷你遊戲中得到 ${mini.score} 分，體能增加 ${Math.floor(mini.score / 3) + 1}。`, '迷你遊戲');
    advanceTurn(true);
    saveGame();
    renderMiniGameModal();
  }
  function closeMiniGame() {
    if (!activeMiniGame) return;
    const mini = activeMiniGame;
    clearInterval(mini.timer);
    activeMiniGame = null;
    modalRoot.innerHTML = '';
    renderGameFrame();
    afterAction();
  }
  function cancelMiniGame() {
    if (!activeMiniGame) return;
    clearInterval(activeMiniGame.timer);
    activeMiniGame = null;
    modalRoot.innerHTML = '';
    showToast('挑戰已暫停，這次沒有消耗行動。');
  }

  function openMessageReply(id) {
    if (state?.ending) { showToast('這一輪故事已經結束；可以在回憶圖鑑重看結局。'); return; }
    const girl = GIRLS[id];
    const lines = [
      { speaker: girl.short, text: (state.messages[id] || []).slice(-1)[0]?.text || girl.messages },
      { speaker: '旁白', text: `你看著${girl.short}傳來的訊息，想了想，決定怎樣回覆。` }
    ];
    const choices = [
      { label: '真誠地回覆，告訴她你也很期待見面', effect: () => { changeAffinity(id, 5); addMessage(id, 'me', '我也很期待！下次見面再慢慢聊。'); addMessage(id, id, '太好了，那就約好了。'); }, outcome: `${girl.short}很快回覆了一個開心的表情。你們把下一次見面放進了行程。` },
      { label: '問她今天過得怎樣，先聽她說', effect: () => { changeAffinity(id, 4); addMessage(id, 'me', '你今天過得怎樣？有沒有甚麼想分享的事？'); addMessage(id, id, '今天有些小事想跟你講，謝謝你問我。'); }, outcome: `${girl.short}傳來一段比平常更長的訊息。原來她一直希望有人願意聽自己分享普通的一天。` },
      { label: '約她找時間一起做喜歡的事', effect: () => { changeAffinity(id, 4); addMessage(id, 'me', '下次一起去做你喜歡的事吧！'); addMessage(id, id, '好！我會想想去哪裡，之後再約你。'); }, outcome: `${girl.short}答應之後再約時間。這段對話讓你們多了一個可以期待的小約定。` }
    ];
    showScene({ title: `回覆${girl.short}的訊息`, kicker: 'MESSAGE REPLY', girlId: id, lines, choices,
      onChoice: () => { advanceTurn(true); pushDiary(`回覆${girl.short}的訊息`, `你透過訊息回覆${girl.short}，讓你們有了新的話題。`, '訊息'); saveGame(); },
      onClose: () => afterAction()
    });
  }

  function showGalleryModal() {
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal-card modal-simple heroine-gallery-modal" role="dialog" aria-modal="true" aria-label="女主角圖鑑"><button class="modal-close" data-action="modal-close" aria-label="關閉">×</button><span class="eyebrow">ORIGINAL HEROINES</span><h2>青空學園・女主角圖鑑</h2><p>這裡只展示遊戲最初版本的三位女主角造型；圖片已修正邊緣裁切與顯示比例，不替換角色設計。</p><div class="illustration-gallery gallery-modal-grid"><article class="illustration-card"><div class="art-frame portrait-frame" style="--art-bg:url('${ASSET('hina-portrait.jpg')}')"><img src="${ASSET('hina-portrait.jpg')}" alt="朝霧陽菜"></div><div class="art-caption"><strong>朝霧陽菜</strong><span>籃球部・球場上的太陽</span></div></article><article class="illustration-card"><div class="art-frame portrait-frame" style="--art-bg:url('${ASSET('mio-portrait.jpg')}')"><img src="${ASSET('mio-portrait.jpg')}" alt="水瀨澪"></div><div class="art-caption"><strong>水瀨澪</strong><span>羽毛球部・安靜的觀察者</span></div></article><article class="illustration-card"><div class="art-frame portrait-frame" style="--art-bg:url('${ASSET('koharu-portrait.jpg')}')"><img src="${ASSET('koharu-portrait.jpg')}" alt="藤宮小春"></div><div class="art-caption"><strong>藤宮小春</strong><span>美術部・收集天空的少女</span></div></article></div><div style="display:flex;justify-content:flex-end;margin-top:13px"><button class="btn btn-primary" data-action="modal-close">返回主選單</button></div></section></div>`;
  }

  function showConfirm(title, text, confirmLabel, confirmAction) {
    modalRoot.innerHTML = `<div class="modal-backdrop"><section class="modal-card modal-simple" role="dialog" aria-modal="true"><button class="modal-close" data-action="modal-close">×</button><span class="eyebrow">PLEASE CONFIRM</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p><div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end;margin-top:18px"><button class="btn btn-soft" data-action="modal-close">取消</button><button class="btn btn-pink" data-action="${confirmAction}">${escapeHtml(confirmLabel)}</button></div></section></div>`;
  }

  function handleClick(event) {
    const target = event.target.closest('[data-action]');
    if (!target) return;
    const action = target.dataset.action;
    if (target.disabled) return;
    playBlip();
    switch (action) {
      case 'title-new': openNameModal(); break;
      case 'title-continue': continueGame(); break;
      case 'title-gallery': showGalleryModal(); break;
      case 'title-heroine': {
        const girl = GIRLS[target.dataset.girl];
        if (girl) showScene({ title: girl.name, kicker: 'MEET THE HEROINES', girlId: girl.id, lines: [{ speaker: girl.name, text: `${girl.role}。

${girl.intro}

「${girl.quote}」` }], onClose: () => {} });
        break;
      }
      case 'go-tab': state.tab = target.dataset.tab; if (state.tab === 'messages') selectedMessageGirl = selectedMessageGirl || 'hina'; saveGame(); renderGameFrame(); break;
      case 'act': act(target.dataset.key); break;
      case 'select-girl': state.selectedGirl = target.dataset.girl; selectedMessageGirl = target.dataset.girl; renderGameFrame(); break;
      case 'view-profile': state.selectedGirl = target.dataset.girl; selectedMessageGirl = target.dataset.girl; state.tab = 'characters'; renderGameFrame(); break;
      case 'start-chat': startChat(target.dataset.girl); break;
      case 'give-gift': openGiftPicker(target.dataset.girl); break;
      case 'start-date': openDatePicker(target.dataset.girl); break;
      case 'confess': startConfession(target.dataset.girl); break;
      case 'select-message-girl': selectedMessageGirl = target.dataset.girl; renderGameFrame(); break;
      case 'message-reply': openMessageReply(target.dataset.girl); break;
      case 'toggle-setting': {
        const setting = target.dataset.setting;
        if (setting in state.settings) { state.settings[setting] = !state.settings[setting]; saveGame(); renderGameFrame(); showToast(`${setting === 'sound' ? '音效' : setting === 'reduceMotion' ? '減少動畫' : setting === 'autoPlay' ? '劇情自動播放' : '快速文字'}已${state.settings[setting] ? '開啟' : '關閉'}`); }
        break;
      }
      case 'save-now': saveGame(true); break;
      case 'return-menu': saveGame(); state.screen = 'title'; renderTitle(); break;
      case 'restart-confirm': showConfirm('重新開始新故事？', '目前的日常進度會被新故事覆蓋，但已解鎖的結局收藏會保留。請先確定是否要重新開始。', '重新開始', 'restart-now'); break;
      case 'restart-now': { const name = state?.playerName || '小晴'; modalRoot.innerHTML = ''; startNewGame(name); break; }
      case 'clear-confirm': showConfirm('清除所有存檔？', '這個操作會永久刪除目前瀏覽器保存的遊戲進度與結局紀錄，不能復原。', '永久清除', 'clear-now'); break;
      case 'clear-now': { try { localStorage.removeItem(SAVE_KEY); } catch (_) {} state = null; activeScene = null; storyRoot.hidden = true; modalRoot.innerHTML = ''; renderTitle(); showToast('本機遊戲存檔已清除。'); break; }
      case 'finale-now': state.pendingFinale = true; triggerFinale(); break;
      case 'friendship-ending': finalizeEnding(null); state.tab = 'ending'; saveGame(); renderGameFrame(); break;
      case 'scene-next': if (activeScene) { if (activeScene.typing) finishTyping(); else if (activeScene.index < activeScene.lines.length - 1) { clearSceneTimers(activeScene); activeScene.index++; startTypingCurrentLine(); } else if (!activeScene.choices?.length || activeScene.resolved) closeScene(); } break;
      case 'scene-skip': if (activeScene) { clearSceneTimers(activeScene); activeScene.index = Math.max(0, activeScene.lines.length - 1); activeScene.visibleText = String(activeScene.lines[activeScene.index]?.text || ''); activeScene.typing = false; renderSceneModal(); } break;
      case 'scene-menu': if (activeScene) { saveGame(); closeScene(); } break;
      case 'scene-settings': if (activeScene) { activeScene.showQuickSettings = !activeScene.showQuickSettings; renderSceneModal(); } break;
      case 'scene-settings-close': if (activeScene) { activeScene.showQuickSettings = false; renderSceneModal(); } break;
      case 'toggle-story-auto': if (state?.settings) { state.settings.autoPlay = !state.settings.autoPlay; saveGame(); renderSceneModal(); scheduleSceneAutoAdvance(); showToast(`劇情自動播放已${state.settings.autoPlay ? '開啟' : '關閉'}`); } break;
      case 'scene-choice': chooseSceneOption(Number(target.dataset.index)); break;
      case 'scene-close': closeScene(); break;
      case 'modal-close': if (activeScene) closeScene(); else modalRoot.innerHTML = ''; break;
      case 'minigame-start': launchMiniGame(target.dataset.kind); break;
      case 'minigame-begin': beginMiniGame(); break;
      case 'mini-hit': hitMiniTarget(); break;
      case 'minigame-close': closeMiniGame(); break;
      case 'minigame-cancel': cancelMiniGame(); break;
      case 'minigame-retry': launchMiniGame(target.dataset.kind); break;
    }
  }

  function handleSubmit(event) {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    if (form.dataset.form === 'start-game') {
      const input = form.querySelector('[name="playerName"]');
      const name = (input?.value || '小晴').trim().slice(0, 12) || '小晴';
      modalRoot.innerHTML = '';
      startNewGame(name);
    }
  }

  document.addEventListener('click', handleClick);
  document.addEventListener('submit', handleSubmit);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && (modalRoot.innerHTML || activeScene)) {
      if (activeMiniGame) cancelMiniGame();
      else if (activeScene) closeScene();
      else modalRoot.innerHTML = '';
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches?.('[data-action="title-heroine"]')) {
      event.preventDefault(); event.target.click();
    }
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    const tagName = String(event.target?.tagName || '').toUpperCase();
    const isInteractive = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'A'].includes(tagName);
    if (isActivationKey && activeScene && !isInteractive && !activeMiniGame) {
      event.preventDefault();
      if (activeScene.typing) finishTyping();
      else if (activeScene.index < activeScene.lines.length - 1) { clearSceneTimers(activeScene); activeScene.index += 1; startTypingCurrentLine(); }
      else if (!activeScene.choices?.length || activeScene.resolved) closeScene();
    }
  });

  // Show the title screen first. Players can explicitly choose Continue to restore their local save.
  state = null;
  renderTitle();
})();
