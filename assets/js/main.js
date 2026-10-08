/* ==========================================================================
   CG足球俱乐部（济南长清）· 交互脚本
   1) 顶部导航 / 滚动进度 / 回到顶部
   2) 数字增长动画 + 滚动出现动画（?static=1 可关闭动画）
   3) 阵容名单：48 名队员，支持按位置筛选与搜索
   4) 试训报名表单（前端演示，不发送数据）
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- 数据 */

  /**
   * 阵容名单。
   * 换成真实照片：把图片覆盖 assets/img/players/pNN.jpg 即可（编号见 assets/img/players/名单对照.md）。
   */
  var ROSTER = [
    { name: '王指导', nick: '德布劳硕', no: 17, pos: '中场', cap: true, badge: '最佳射手', blurb: '队长 · 中场指挥官，队史第一球和第一次帽子戏法都是他。' },
    { name: 'C罗', no: 91, pos: '前锋', badge: '助攻王', blurb: '左路杀伤力最大的一个，本赛季 18 次助攻。' },
    { name: '迪马利亚', no: 69, pos: '门将', badge: '大漏勺', blurb: '丢球最多，扑救也最多。本届「大漏勺」奖得主。' },
    { name: 'W', no: 5, pos: '后卫' },
    { name: '张浩', no: 88, pos: '中场', badge: '铁人奖', blurb: '100 场出场 96 次，出勤率全队第一。' },
    { name: '董坤秀', no: 23, pos: '后卫' },
    { name: '徐中华', no: 7, pos: '前锋' },
    { name: '邵文龙', no: 44, pos: '后卫', badge: '最佳后卫', blurb: '一对一防守成功率全队最高。' },
    { name: 'Md', no: 11, pos: '前锋' },
    { name: '卢仲恺', no: 33, pos: '中场' },
    { name: '阿扎书', no: 9, pos: '前锋' },
    { name: '张文浩', no: 66, pos: '后卫', badge: '最佳新人', blurb: '今年入队，首秀替补登场 20 分钟送出助攻。' },
    { name: '水长东', no: 21, pos: '中场' },
    { name: 'Z', no: 3, pos: '后卫' },
    { name: '笑笑', no: 12, pos: '中场' },
    { name: '猫哥', no: 55, pos: '后卫' },
    { name: '奥特曼', no: 27, pos: '前锋' },
    { name: '可乐撒…', no: 18, pos: '中场' },
    { name: 'Masta…', no: 4, pos: '后卫' },
    { name: '格里斯…', no: 30, pos: '中场' },
    { name: 'Barcel…', no: 82, pos: '前锋' },
    { name: 'Hope', no: 6, pos: '后卫' },
    { name: 'messi', no: 19, pos: '中场' },
    { name: '王策', no: 14, pos: '后卫' },
    { name: 'Равно…', no: 99, pos: '前锋' },
    { name: '10.', no: 10, pos: '前锋' },
    { name: '见贤思齐', no: 8, pos: '中场' },
    { name: '杨永恒', no: 2, pos: '后卫' },
    { name: '石玉', no: 16, pos: '后卫' },
    { name: '国之栋梁', no: 77, pos: '前锋' },
    { name: 'aoc', no: 13, pos: '中场' },
    { name: 'forest', no: 29, pos: '后卫' },
    { name: '£', no: 71, pos: '前锋' },
    { name: 'Ooo', no: 97, pos: '门将' },
    { name: 'Rura', no: 20, pos: '中场' },
    { name: 'PEDIR', no: 76, pos: '前锋' },
    { name: '拔云云', no: 1, pos: '门将' },
    { name: 'Lir', no: 22, pos: '后卫' },
    { name: '扑朔迷离', no: 24, pos: '中场' },
    { name: '可乐洒…', no: 26, pos: '前锋' },
    { name: 'Ye', no: 15, pos: '中场' },
    { name: '心如止水', no: 31, pos: '后卫' },
    { name: '寒王', no: 68, pos: '中场' },
    { name: '张惠荔', no: 92, pos: '前锋' },
    { name: '刘子扬', no: 40, pos: '后卫' },
    { name: '赵延', no: 46, pos: '门将' },
    { name: '我是个…', no: 58, pos: '后卫' },
    { name: '哲', no: 73, pos: '前锋' }
  ];

  /* -------------------------------------------------------- 阵容名单渲染 */

  var grid = document.getElementById('squadGrid');
  var emptyTip = document.getElementById('squadEmpty');

  function photoName(i) {
    return 'assets/img/players/p' + String(i + 1).padStart(2, '0') + '.jpg';
  }

  function buildPlayer(p, i) {
    var card = document.createElement('article');
    card.className = 'player' + (p.badge ? ' player--star' : '') + (p.cap ? ' player--captain' : '');
    card.dataset.pos = p.pos;
    card.dataset.search = (p.name + ' ' + p.pos + ' ' + p.no + ' ' + (p.nick || '')).toLowerCase();

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

    var badge = '';
    if (p.cap) badge = '<span class="player__badge player__badge--cap">队长</span>';
    else if (p.badge) badge = '<span class="player__badge">' + p.badge + '</span>';

    var body = document.createElement('div');
    body.innerHTML =
      badge +
      '<p class="player__name">' + p.name + (p.nick ? ' <small>(' + p.nick + ')</small>' : '') + '</p>' +
      '<p class="player__pos">' + p.pos + ' · ' + p.no + ' 号</p>' +
      (p.blurb ? '<p class="player__blurb">' + p.blurb + '</p>' : '');

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
  if (search) {
    search.addEventListener('input', applyFilter);
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
