/* ==========================================================================
   CG足球俱乐部 · 交互脚本
   1) 顶部导航 / 滚动进度 / 回到顶部
   2) 数字增长动画 + 滚动出现动画
   3) 巨星图鉴：优先读取真实照片，读不到就用原创风格海报
   4) 试训报名表单（前端演示，不发送数据）
   ========================================================================== */

(function () {
  'use strict';

  /* ---------------------------------------------------------------- 数据 */

  /**
   * 巨星图鉴数据。
   * 想要换成真实球员照片：把图片命名为 <id>.jpg 放进 assets/img/stars/ 即可，
   * 例如 assets/img/stars/messi.jpg —— 页面会自动优先显示照片。
   * 请注意：使用真实球员照片需要自行取得肖像权与版权授权。
   */
  var PLAYERS = [
    {
      id: 'messi',
      name: '梅西',
      en: 'Lionel Messi',
      pos: '前锋',
      meta: '10号 · 阿根廷 · 左脚 · 组织型前锋',
      desc: '他让「小个子」变成了一个褒义词。2019 年那场雨夜，他在第 71 分钟被换下，赛后他说：那是我第一次在球场上感到，传球比跑动更快。',
      tags: ['盘带', '直塞', '任意球'],
      poster: { num: '10', c1: '#8fd2f2', c2: '#2a6ea6', accent: '#ffffff', ink: '#0d3552', stripes: ['#ffffff', 'rgba(255,255,255,.55)'] }
    },
    {
      id: 'ronaldo',
      name: 'C罗',
      en: 'Cristiano Ronaldo',
      pos: '前锋',
      meta: '7号 · 葡萄牙 · 右脚 · 禁区终结者',
      desc: '2021 年雪战结束后，他是唯一一个在零下九度的球场里留下来加练点球的人。我们的门将说：他踢球的样子像是在跟时间吵架。',
      tags: ['头球', '射门', '意志力'],
      poster: { num: '7', c1: '#1b6b4c', c2: '#8c1f2b', accent: '#f6d76b', ink: '#0b2b1e' }
    },
    {
      id: 'mbappe',
      name: '姆巴佩',
      en: 'Kylian Mbappé',
      pos: '前锋',
      meta: '9号 · 法国 · 右脚 · 速度型前锋',
      desc: '2022 年巴黎那晚，我们在第 94 分钟绝杀的时候，他站在中圈笑了。据说他后来跟教练说：这支球队的传球，好像提前知道我要跑到哪里。',
      tags: ['速度', '反击', '单刀'],
      poster: { num: '9', c1: '#2b3f8f', c2: '#0d1b46', accent: '#f2d16b', ink: '#070f2e' }
    },
    {
      id: 'haaland',
      name: '哈兰德',
      en: 'Erling Haaland',
      pos: '前锋',
      meta: '9号 · 挪威 · 左脚 · 强力中锋',
      desc: '伊蒂哈德那场 0:3 领先之后，他还在不停要球。老队员后来回忆：他每一次冲刺都像在提醒我们——比赛还没结束，别高兴。',
      tags: ['冲击力', '抢点', '身体'],
      poster: { num: '9', c1: '#8fd8f0', c2: '#1c4f78', accent: '#ffffff', ink: '#0b2b45' }
    },
    {
      id: 'neymar',
      name: '内马尔',
      en: 'Neymar Jr.',
      pos: '前锋',
      meta: '10号 · 巴西 · 右脚 · 技巧型边锋',
      desc: '他是那种会把球场当成舞台的人。2023 年我们在通道里遇见他，他一边热身一边跟我们的年轻边卫说：过人可以学，想象力学不来。',
      tags: ['花式', '突破', '创造力'],
      poster: { num: '10', c1: '#f2d24b', c2: '#1f7a45', accent: '#ffffff', ink: '#123f22' }
    },
    {
      id: 'debruyne',
      name: '德布劳内',
      en: 'Kevin De Bruyne',
      pos: '中场',
      meta: '17号 · 比利时 · 右脚 · 直塞大师',
      desc: '我们的队长从小看他的录像长大。他说：看别人传球是在学技术，看他传球，是在学「抬头的那一秒钟想什么」。',
      tags: ['外脚背', '传中', '视野'],
      poster: { num: '17', c1: '#9fe0f5', c2: '#12496e', accent: '#ffffff', ink: '#0a2d45' }
    },
    {
      id: 'captain10',
      name: '德布劳硕',
      en: 'C. G. Debruyshuo',
      pos: '我们的人',
      meta: '10号 · 队长 · 23岁 · 我们的「手术刀」',
      desc: '他不是从我们的观众席走进球场的——他是从球场边的那条水泥小路走进来的。23 岁，268 场，214 次助攻，袖标还在他手上。',
      tags: ['外脚背', '队长', '青训47号'],
      poster: { num: '10', c1: '#0f5540', c2: '#04140f', accent: '#e3c261', ink: '#02120d', laurel: true }
    }
  ];

  /* ------------------------------------------------- 原创风格海报（SVG） */

  function posterSVG(p) {
    var o = p.poster;
    var uid = 'pk-' + p.id;
    var stripes = '';
    if (o.stripes) {
      stripes =
        '<g opacity=".16">' +
        '<rect x="0" y="0" width="75" height="800" fill="' + o.stripes[0] + '"/>' +
        '<rect x="150" y="0" width="75" height="800" fill="' + o.stripes[0] + '"/>' +
        '<rect x="300" y="0" width="75" height="800" fill="' + o.stripes[0] + '"/>' +
        '<rect x="450" y="0" width="75" height="800" fill="' + o.stripes[0] + '"/>' +
        '<rect x="600" y="0" width="75" height="800" fill="' + o.stripes[0] + '"/>' +
        '</g>';
    }
    var laurel = o.laurel
      ? '<path d="M300 176c-46 0-84 24-84 24s38 10 84 10 84-10 84-10-38-24-84-24z" fill="' + o.accent + '" opacity=".85"/>'
      : '';

    return '' +
      '<svg viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + p.name + ' 原创风格海报">' +
        '<defs>' +
          '<linearGradient id="bg-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + o.c1 + '"/>' +
            '<stop offset="1" stop-color="' + o.c2 + '"/>' +
          '</linearGradient>' +
          '<radialGradient id="gl-' + uid + '" cx="50%" cy="26%" r="62%">' +
            '<stop offset="0" stop-color="' + o.accent + '" stop-opacity=".5"/>' +
            '<stop offset="1" stop-color="' + o.accent + '" stop-opacity="0"/>' +
          '</radialGradient>' +
          '<linearGradient id="js-' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#ffffff" stop-opacity=".18"/>' +
            '<stop offset="1" stop-color="#000000" stop-opacity=".3"/>' +
          '</linearGradient>' +
        '</defs>' +

        '<rect width="600" height="800" fill="url(#bg-' + uid + ')"/>' +
        stripes +
        '<rect width="600" height="800" fill="url(#gl-' + uid + ')"/>' +

        /* 球场装饰线 */
        '<g stroke="' + o.accent + '" stroke-opacity=".18" fill="none">' +
          '<circle cx="300" cy="360" r="250" stroke-width="2"/>' +
          '<path d="M40 800a260 260 0 0 1 520 0" stroke-width="2"/>' +
        '</g>' +

        /* 巨大号码水印 */
        '<text x="300" y="700" text-anchor="middle" font-family="Arial Black, Impact, sans-serif"' +
          ' font-size="400" font-weight="900" fill="' + o.accent + '" opacity=".13">' + o.num + '</text>' +

        /* 头部剪影 */
        laurel +
        '<circle cx="300" cy="252" r="74" fill="' + o.ink + '"/>' +
        '<path d="M226 258c0-44 33-78 74-78s74 34 74 78c0 6-2 12-4 17-6-26-34-42-70-42s-64 16-70 42c-2-5-4-11-4-17z" fill="' + o.accent + '" opacity=".55"/>' +
        '<rect x="272" y="312" width="56" height="42" rx="14" fill="' + o.ink + '"/>' +

        /* 球衣 */
        '<path d="M182 386c34-26 74-44 118-44s84 18 118 44l84 46-44 104-42-24v170c-62 30-170 30-232 0V512l-42 24-44-104z"' +
          ' fill="url(#js-' + uid + ')" stroke="' + o.accent + '" stroke-opacity=".55" stroke-width="3"/>' +
        '<path d="M262 348l38 44 38-44" fill="none" stroke="' + o.accent + '" stroke-opacity=".8" stroke-width="6" stroke-linecap="round"/>' +
        '<text x="300" y="600" text-anchor="middle" font-family="Arial Black, Impact, sans-serif"' +
          ' font-size="180" font-weight="900" fill="' + o.accent + '">' + o.num + '</text>' +
        '<rect x="112" y="492" width="52" height="30" rx="8" fill="' + o.accent + '" opacity=".9" transform="rotate(-18 138 507)"/>' +

        /* 底部说明条 */
        '<rect x="0" y="742" width="600" height="58" fill="#04120e" opacity=".55"/>' +
        '<text x="300" y="778" text-anchor="middle" font-family="PingFang SC, Microsoft YaHei, sans-serif"' +
          ' font-size="20" letter-spacing="4" fill="#f8e6a0" opacity=".92">原创风格插画 · CG FC</text>' +
      '</svg>';
  }

  /* -------------------------------------------------------- 巨星图鉴渲染 */

  var grid = document.getElementById('starGrid');

  function buildCard(p) {
    var card = document.createElement('article');
    card.className = 'star-card';
    card.dataset.pos = p.pos;

    var media = document.createElement('div');
    media.className = 'star-card__media';
    media.innerHTML = posterSVG(p);

    var badge = document.createElement('span');
    badge.className = 'star-card__no';
    badge.textContent = p.meta.split(' · ')[0] + ' · ' + p.pos;
    media.appendChild(badge);

    /* 如果 assets/img/stars/<id>.jpg 存在，就用真实照片覆盖原创海报（角标保留） */
    var photo = new Image();
    photo.alt = p.name + ' 照片';
    photo.addEventListener('load', function () {
      var svg = media.querySelector('svg');
      if (svg) media.removeChild(svg);
      media.insertBefore(photo, badge);
    });
    photo.src = 'assets/img/stars/' + p.id + '.jpg';

    var body = document.createElement('div');
    body.className = 'star-card__body';
    body.innerHTML =
      '<h3>' + p.name + ' <em>' + p.en + '</em></h3>' +
      '<p class="star-card__meta">' + p.meta + '</p>' +
      '<p>' + p.desc + '</p>' +
      '<div class="star-card__tags">' + p.tags.map(function (t) { return '<span>' + t + '</span>'; }).join('') + '</div>';

    card.appendChild(media);
    card.appendChild(body);
    return card;
  }

  if (grid) {
    PLAYERS.forEach(function (p) { grid.appendChild(buildCard(p)); });

    var filters = document.getElementById('starFilters');
    if (filters) {
      filters.addEventListener('click', function (e) {
        var btn = e.target.closest('.chip');
        if (!btn) return;
        [].forEach.call(filters.querySelectorAll('.chip'), function (c) { c.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var f = btn.dataset.filter;
        [].forEach.call(grid.children, function (card) {
          var show = (f === 'all' || card.dataset.pos === f);
          card.style.display = show ? '' : 'none';
        });
      });
    }
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

  /* ?static=1 时立刻显示所有内容（用于截图、打印或极老的浏览器） */
  var staticMode = /[?&]static=1/.test(location.search);

  var reveals = document.querySelectorAll('.reveal');
  if (staticMode) {
    [].forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
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
        if (en.isIntersecting) {
          animateNumber(en.target);
          cio.unobserve(en.target);
        }
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
        tip.style.color = '#b3472f';
        tip.textContent = '还差一点：请填上姓名和联系方式。';
        return;
      }
      tip.style.color = '#12664b';
      tip.textContent = '收到啦，' + name + '！这是演示表单，数据没有真的发出去——把表单接到你自己的邮箱或表格就能用。';
      form.reset();
    });
  }

  /* ------------------------------------------------------------ 年份 */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
