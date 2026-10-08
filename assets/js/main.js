/* ==========================================================================
   CG足球俱乐部（济南长清）· 交互脚本
   1) 阵容名单 + 队内年度奖项（48 人，一人一项）
   2) 筛选 / 搜索 / 导航 / 滚动动画 / 报名表单
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- 数据
     每人一项年度奖项：award = 奖项名，awardDesc = 一句话理由。
     改号码、位置、奖项都只改这里，阵容卡片和奖项列表会自动同步。
     换头像：覆盖 assets/img/players/pNN.jpg（编号见 名单对照.md）。
  --------------------------------------------------------------------- */

  var ROSTER = [
    { name: '王指导', nick: '德布劳硕', no: 17, pos: '中场', cap: true,
      award: '最佳射手', awardDesc: '年度 91 球、31 次助攻，进球数全队第一、助攻榜第二。这个奖他让了三年，今年实在让不掉了。' },
    { name: 'C罗', no: 91, pos: '前锋',
      award: '助攻王', awardDesc: '年度 34 次助攻，其中 20 次来自左路传中。他说自己本来是前锋，是被队长喂成了边锋。' },
    { name: '迪马利亚', no: 69, pos: '后卫',
      award: '大漏勺', awardDesc: '漏人次数全队第一，被他盯的前锋基本都进过球；但关键解围同样排在全队第二。领奖时说：「漏一个，我下一场追回来两个。」' },
    { name: 'W', no: 5, pos: '后卫',
      award: '最稳一堵墙', awardDesc: '整个赛季没有被正面过掉一次，后来对手都改走另一侧边路。' },
    { name: '张浩', no: 88, pos: '中场',
      award: '铁人奖', awardDesc: '100 场比赛出场 96 次，出勤率全队第一，其中 3 场是下了夜班直接来踢的。' },
    { name: '董坤秀', no: 23, pos: '后卫',
      award: '冷面铲断', awardDesc: '铲球干净利落，全季没有一次犯规送点，被他放倒的人还会伸手拉他起来。' },
    { name: '徐中华', no: 7, pos: '前锋',
      award: '最快启动', awardDesc: '30 米冲刺全队第一，反击时永远是第一个冲出去的人。' },
    { name: '邵文龙', no: 44, pos: '后卫',
      award: '最佳后卫', awardDesc: '一对一防守成功率全队最高。他说秘诀是「不猜，就跟着跑」。' },
    { name: 'Md', no: 11, pos: '前锋',
      award: '单刀最稳', awardDesc: '一对一面对门将的机会转化率全队第一，年度打进 9 个单刀。' },
    { name: '卢仲恺', no: 33, pos: '中场',
      award: '场上教练', awardDesc: '全场喊位最多的人，队友都叫他「第二教练」，教练说没有他嗓子会省一半。' },
    { name: '阿扎书', no: 9, pos: '前锋',
      award: '搅局奖', awardDesc: '每次替补上场都能把对方后防线搅乱，教练最常派他去打乱节奏。' },
    { name: '张文浩', no: 66, pos: '后卫',
      award: '最佳新人', awardDesc: '今年入队，第一场比赛替补登场 20 分钟就送出一次助攻，从此再没坐过替补席。' },
    { name: '水长东', no: 21, pos: '中场',
      award: '传球艺术家', awardDesc: '年度 3 次脚后跟助攻，全队最爱炫技的人，训练里没人愿意跟他比花活。' },
    { name: 'Z', no: 3, pos: '后卫',
      award: '补位之王', awardDesc: '补位次数全队第一，后防线上哪里有洞就出现在哪里，人称「后场消防员」。' },
    { name: '笑笑', no: 12, pos: '中场',
      award: '更衣室灵魂', awardDesc: '输球后第一个开口讲笑话的人，也是每场最先到场把球网挂好的人。' },
    { name: '猫哥', no: 55, pos: '后卫',
      award: '门线守护', awardDesc: '年度 3 次在门线上把球解围，算下来救回至少 4 分。' },
    { name: '奥特曼', no: 27, pos: '前锋',
      award: '替补杀手', awardDesc: '全部进球里有 7 个是替补上场后打进的，越到下半场越准。' },
    { name: '可乐撒…', no: 18, pos: '中场',
      award: '跑动王', awardDesc: '场均跑动 9.8 公里全队第一，最后十分钟还在回追的人通常是他。' },
    { name: 'Masta…', no: 4, pos: '后卫',
      award: '空中霸主', awardDesc: '争顶成功率 78%，角球防守的第一落点几乎都被他包了。' },
    { name: '格里斯…', no: 30, pos: '中场',
      award: '节奏大师', awardDesc: '落后时能把节奏压下来，领先时能把节奏提上去，全队最会踢「聪明球」的人。' },
    { name: 'Barcel…', no: 82, pos: '前锋',
      award: '花式射门', awardDesc: '年度 2 次借对手身体反弹进球，训练里最爱试倒钩，成功率另说。' },
    { name: 'Hope', no: 6, pos: '后卫',
      award: '铁门槛', awardDesc: '边路一对一成功率全队最高，对手从他那侧突破的成功率最低。' },
    { name: 'messi', no: 19, pos: '中场',
      award: '小快灵', awardDesc: '身高不占优势，但重心低、变向快，队内对抗赛里公认最难防的一个。' },
    { name: '王策', no: 14, pos: '后卫',
      award: '场上发言人', awardDesc: '与裁判沟通次数全队第一。队规「谁吵谁下场」之后，只剩他还敢说话。' },
    { name: 'Равно…', no: 99, pos: '前锋',
      award: '惊喜奖', awardDesc: '平时训练看着一般，一到正式比赛就进球，年度 3 次在关键场次破门。' },
    { name: '10.', no: 10, pos: '前锋',
      award: '号码守护者', awardDesc: '为了穿 10 号，自己练了一个冬天的左脚，现在两个边都能起球。' },
    { name: '见贤思齐', no: 8, pos: '中场',
      award: '复盘王', awardDesc: '每场比赛后都在群里写一段总结，一年写了 60 多篇，教练的战术会都靠他记录。' },
    { name: '杨永恒', no: 2, pos: '后卫',
      award: '稳健先生', awardDesc: '全季没有一次冒失上抢，安全第一，被队友称为「后场定心丸」。' },
    { name: '石玉', no: 16, pos: '后卫',
      award: '大心脏', awardDesc: '两次点球大战都主动第一个上，两次都罚进了。' },
    { name: '国之栋梁', no: 77, pos: '前锋',
      award: '远射炮台', awardDesc: '禁区外打进 5 球，包括对城里那支老牌球队的 25 米世界波。' },
    { name: 'aoc', no: 13, pos: '中场',
      award: '中场发动机', awardDesc: '攻防转换次数全队第一，跑得最多也传得最多，是队里的「永动机」。' },
    { name: 'forest', no: 29, pos: '后卫',
      award: '不怕草根', awardDesc: '场地再差也不抱怨，雨战、雪战、沙土场全勤，一双球鞋能穿两季。' },
    { name: '£', no: 71, pos: '前锋',
      award: '性价比之王', awardDesc: '入队没花一分钱，年度 12 球，队里公认最超值的一笔「引援」。' },
    { name: 'Ooo', no: 97, pos: '门将',
      award: '门神', awardDesc: '年度扑救成功率 71%，五人制邀请赛点球大战扑出 2 个，直接帮球队拿下冠军。' },
    { name: 'Rura', no: 20, pos: '中场',
      award: '隐形贡献奖', awardDesc: '数据不显眼，但统计显示他在场时球队胜率高出两成，属于「看不见的队长」。' },
    { name: 'PEDIR', no: 76, pos: '前锋',
      award: '开局之王', awardDesc: '前 15 分钟打进 6 球，全队最快进入比赛状态的人。' },
    { name: '拔云云', no: 1, pos: '门将',
      award: '一号门将', awardDesc: '联赛出场最多的门将，年度零封 8 场，队里唯一会教别人站位的守门员。' },
    { name: 'Lir', no: 22, pos: '后卫',
      award: '边路剪刀', awardDesc: '边后卫里传中次数最多，年度 7 次助攻全部来自右路下底。' },
    { name: '扑朔迷离', no: 24, pos: '中场',
      award: '假动作大师', awardDesc: '年度制造 14 次犯规，直接为球队换来 4 个任意球进球。' },
    { name: '可乐洒…', no: 26, pos: '前锋',
      award: '庆祝动作奖', awardDesc: '进球后的庆祝动作全队最有创意，教练的评价是「好看，但浪费体力」。' },
    { name: 'Ye', no: 15, pos: '中场',
      award: '队歌领唱', awardDesc: '每场赛前站在中圈带全队唱队歌的人，输球那天他唱得最大声。' },
    { name: '心如止水', no: 31, pos: '后卫',
      award: '冷静先生', awardDesc: '整季只吃过 1 张黄牌，最激烈的比赛里也从不上头。' },
    { name: '寒王', no: 68, pos: '中场',
      award: '冷面刺客', awardDesc: '关键时刻的三脚远射全部打在门框范围内，进了两个，都是扳平或反超的球。' },
    { name: '张惠荔', no: 92, pos: '前锋',
      award: '冲刺榜第一', awardDesc: '队内体测冲刺次数第一，边路突破成功率全队前三。' },
    { name: '刘子扬', no: 40, pos: '后卫',
      award: '硬汉后卫', awardDesc: '身体对抗成功率全队第一，被撞倒之后总是第一个站起来的人。' },
    { name: '赵延', no: 46, pos: '门将',
      award: '扑点专家', awardDesc: '友谊赛与杯赛一共扑出 4 个点球，队内点球大战时大家都希望和他一队。' },
    { name: '我是个…', no: 58, pos: '后卫',
      award: '万能补丁', awardDesc: '后卫、中场、前锋都踢过，谁缺人他就顶谁，位置表上写的是「哪里都行」。' },
    { name: '哲', no: 73, pos: '前锋',
      award: '大场面先生', awardDesc: '决赛一共进过 4 个球，越重要的比赛越能进球，越普通的友谊赛越容易隐身。' }
  ];

  /* -------------------------------------------------------- 阵容名单渲染 */

  var grid = document.getElementById('squadGrid');
  var emptyTip = document.getElementById('squadEmpty');

  function photoName(i) {
    return 'assets/img/players/p' + String(i + 1).padStart(2, '0') + '.jpg';
  }

  function buildPlayer(p, i) {
    var card = document.createElement('article');
    card.className = 'player' + (p.cap ? ' player--captain' : '');
    card.dataset.pos = p.pos;
    card.dataset.search = (p.name + ' ' + p.pos + ' ' + p.no + ' ' + (p.nick || '') + ' ' + p.award).toLowerCase();

    var photo = document.createElement('div');
    photo.className = 'player__photo';
    var img = document.createElement('img');
    img.src = photoName(i);
    img.alt = p.name + ' 头像';
    img.loading = 'lazy';
    img.width = 240; img.height = 240;
    photo.appendChild(img);

    var num = document.createElement('span');
    num.className = 'player__no';
    num.textContent = p.no;
    photo.appendChild(num);

    var body = document.createElement('div');
    body.innerHTML =
      (p.cap ? '<span class="player__badge player__badge--cap">队长</span>' : '') +
      '<span class="player__badge">' + p.award + '</span>' +
      '<p class="player__name">' + p.name + (p.nick ? ' <small>(' + p.nick + ')</small>' : '') + '</p>' +
      '<p class="player__pos">' + p.pos + ' · ' + p.no + ' 号</p>';

    card.appendChild(photo);
    card.appendChild(body);
    return card;
  }

  var cards = [];
  if (grid) {
    ROSTER.forEach(function (p, i) {
      var c = buildPlayer(p, i);
      cards.push(c);
      grid.appendChild(c);
    });
  }

  /* 筛选 + 搜索 */
  var filters = document.getElementById('squadFilters');
  var search = document.getElementById('squadSearch');
  var activeFilter = 'all';

  function applyFilter() {
    var q = (search && search.value || '').trim().toLowerCase();
    var shown = 0;
    cards.forEach(function (card) {
      var okPos = activeFilter === 'all' || card.dataset.pos === activeFilter;
      var okText = !q || card.dataset.search.indexOf(q) !== -1;
      var show = okPos && okText;
      card.style.display = show ? '' : 'none';
      if (show) shown++;
    });
    if (emptyTip) emptyTip.hidden = shown !== 0;
    if (filters) {
      var all = filters.querySelector('[data-filter="all"]');
      if (all) all.textContent = shown === cards.length ? '全部 ' + cards.length : '命中 ' + shown;
    }
  }

  if (filters) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('.chip');
      if (!btn) return;
      [].forEach.call(filters.querySelectorAll('.chip'), function (c) { c.classList.remove('is-active'); });
      btn.classList.add('is-active');
      activeFilter = btn.dataset.filter;
      applyFilter();
    });
  }
  if (search) search.addEventListener('input', applyFilter);

  /* ------------------------------------------------------ 年度奖项渲染
     直接用上面同一份名单生成，保证「每个人必有奖」不会漏。
  ---------------------------------------------------------------- */

  /* ------------------------------------------------ 年度大奖 · 3D 奖杯
     奖杯是用 CSS 立体建模拼出来的（12 面体），会自己转。
     想换颜色：改 c1（高光）/ c2（主色）/ c3（暗部）。
  ---------------------------------------------------------------- */

  var BIG_AWARDS = [
    { title: '金球奖', sub: '年度最佳球员', who: '王指导（德布劳硕）· 17 号', no: 17,
      desc: '年度 91 球、31 次助攻，带队打完队史第 100 场。',
      c1: '#fff3c4', c2: '#e8b83c', c3: '#7f560a' },
    { title: '金靴奖', sub: '年度最佳射手', who: '王指导（德布劳硕）· 17 号', no: 17,
      desc: '年度 91 球，队史单赛季进球纪录，比第二多出 60 球。',
      c1: '#ffe2a6', c2: '#e0951c', c3: '#6f3f04' },
    { title: '金手套奖', sub: '年度最佳门将', who: 'Ooo · 97 号', no: 97,
      desc: '扑救成功率 71%，杯赛决赛点球大战扑出两个。',
      c1: '#ffe8cd', c2: '#d4823a', c3: '#6d3a0c' },
    { title: '金童奖', sub: '年度最佳新人', who: '张文浩 · 66 号', no: 66,
      desc: '首秀替补 20 分钟送出助攻，一年时间坐稳首发。',
      c1: '#f6f9ff', c2: '#b7c4da', c3: '#54607a' }
  ];

  /**
   * 用 N 个带倾角的面片拼出一个立体部件。
   * v = { n 面数, w 面片宽, h 面片高, r 中位半径, tilt 倾角(度，正数=上宽下窄), py 部件中心的纵向位置 }
   */
  function part(cls, v) {
    var out = '<div class="part ' + cls + '" style="--py:' + v.py + 'px">';
    for (var i = 0; i < v.n; i++) {
      /* 面片明暗：朝前的更亮，形成金属反光的分面感 */
      var theta = (i / v.n) * Math.PI * 2;
      var b = (0.8 + 0.34 * Math.max(0, Math.cos(theta)) + 0.06 * Math.sin(theta * 2)).toFixed(3);
      out += '<i style="--i:' + i + ';--n:' + v.n + ';--w:' + v.w + 'px;--h:' + v.h +
        'px;--rmid:' + v.r + 'px;--tilt:' + v.tilt + 'deg;--b:' + b + '"></i>';
    }
    return out + '</div>';
  }

  function trophy3d(a) {
    return '' +
      '<div class="trophy3d-wrap" style="--c1:' + a.c1 + ';--c2:' + a.c2 + ';--c3:' + a.c3 + '">' +
        '<div class="t3d-glow"></div>' +
        '<div class="trophy3d">' +
          /* 杯口 8px / 杯身 100px（上宽下窄的圆台）/ 杯颈 34px / 底座 18px */
          part('part--rim',  { n: 14, w: 19, h: 9,   r: 37, tilt: 0,     py: -156 }) +
          part('part--cup',  { n: 16, w: 16, h: 101, r: 31, tilt: 5.7,   py: -102 }) +
          part('part--stem', { n: 10, w: 7,  h: 34,  r: 8,  tilt: 0,     py: -35  }) +
          part('part--base', { n: 16, w: 16, h: 19,  r: 28, tilt: -12.5, py: -9   }) +
        '</div>' +
        '<div class="t3d-floor"></div>' +
        '<div class="t3d-flare"></div>' +
      '</div>';
  }

  var bigGrid = document.getElementById('bigAwards');
  if (bigGrid) {
    BIG_AWARDS.forEach(function (a) {
      var card = document.createElement('article');
      card.className = 'big-award';
      card.innerHTML =
        '<div class="big-award__stage">' + trophy3d(a) + '</div>' +
        '<div class="big-award__body">' +
          '<p class="big-award__sub">' + a.sub + '</p>' +
          '<h3>' + a.title + '</h3>' +
          '<p class="big-award__who">' + a.who + '</p>' +
          '<p class="big-award__desc">' + a.desc + '</p>' +
        '</div>';
      bigGrid.appendChild(card);
    });
  }

  var awardGrid = document.getElementById('awardsGrid');
  if (awardGrid) {
    var ICONS = ['🥇', '🏆', '⚽', '🛡️', '🧤', '🎯', '⚡', '🔥', '🧱', '🎩', '🚀', '💪', '🧠', '🥄', '🅰️', '🏃'];
    ROSTER.forEach(function (p, i) {
      var el = document.createElement('article');
      el.className = 'award' + (p.cap ? ' award--gold' : (p.award === '大漏勺' ? ' award--fun' : ''));
      el.dataset.search = (p.name + ' ' + p.no + ' ' + p.award).toLowerCase();
      el.innerHTML =
        '<span class="award__icon">' + ICONS[i % ICONS.length] + '</span>' +
        '<h3>' + p.award + '</h3>' +
        '<p class="award__name">' + p.name + ' · ' + p.no + ' 号</p>' +
        '<p class="award__desc">' + p.awardDesc + '</p>';
      awardGrid.appendChild(el);
    });
    [].forEach.call(document.querySelectorAll('[data-award-count]'), function (el) {
      el.textContent = ROSTER.length;
    });
  }

  /* ------------------------------------------------------ 导航 / 交互 */

  var header = document.getElementById('siteHeader');
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');
  var toTop = document.getElementById('toTop');
  var progress = document.getElementById('scrollProgress');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    if (header) header.classList.toggle('is-solid', y > 40);
    if (toTop) toTop.classList.toggle('is-visible', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------- 滚动出现动画 */

  var staticMode = /[?&]static=1/.test(location.search);
  var reveals = document.querySelectorAll('.reveal');

  if (staticMode) {
    [].forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    [].forEach.call(reveals, function (el) { io.observe(el); });
  } else {
    [].forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* -------------------------------------------------------- 数字动画 */

  function animateNumber(el) {
    var target = parseFloat(el.dataset.count);
    var suffix = el.dataset.suffix || '';
    if (!target) return;
    var start = performance.now(), dur = 1400;
    function tick(now) {
      var t = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      var val = Math.round(target * eased);
      el.textContent = (el.dataset.plain ? String(val) : val.toLocaleString('en-US')) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll('[data-count]');
  if (staticMode) {
    [].forEach.call(counters, function (el) {
      var t = parseFloat(el.dataset.count);
      el.textContent = (el.dataset.plain ? String(t) : t.toLocaleString('en-US')) + (el.dataset.suffix || '');
    });
  } else if ('IntersectionObserver' in window && counters.length) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateNumber(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: .5 });
    [].forEach.call(counters, function (el) { cio.observe(el); });
  }

  /* -------------------------------------------------------- 报名表单 */

  var form = document.getElementById('joinForm');
  var tip = document.getElementById('formTip');
  if (form && tip) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get('name') || '').toString().trim();
      var contact = (data.get('contact') || '').toString().trim();
      if (!name || !contact) {
        tip.style.color = '#a8101f';
        tip.textContent = '还差一点：请填上姓名和联系方式。';
        return;
      }
      tip.style.color = '#123a7d';
      tip.textContent = '收到啦，' + name + '！这是演示表单，信息没有真的发出去——想直接报名请发邮件到 1359893879@qq.com。';
      form.reset();
    });
  }

  /* ------------------------------------------------------------ 年份 */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
