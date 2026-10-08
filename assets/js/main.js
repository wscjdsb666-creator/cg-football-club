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
    { type: 'ball', title: '金球奖', sub: '年度最佳球员', who: '王指导（德布劳硕）· 17 号',
      desc: '年度 91 球、31 次助攻，带队打完队史第 100 场。',
      c1: '#fff6cf', c2: '#e8b83c', c3: '#7a520a', spin: 13 },
    { type: 'boot', title: '金靴奖', sub: '年度最佳射手', who: '王指导（德布劳硕）· 17 号',
      desc: '年度 91 球，队史单赛季进球纪录，比第二名多出 60 球。',
      c1: '#ffeeb8', c2: '#e6a41f', c3: '#6f4304', spin: 7 },
    { type: 'glove', title: '金手套奖', sub: '年度最佳门将', who: 'Ooo · 97 号',
      desc: '扑救成功率 71%，杯赛决赛点球大战扑出两个。',
      c1: '#ffe9c9', c2: '#d98b3a', c3: '#6b3a0c', spin: 8 },
    { type: 'cup', title: '冠军奖杯', sub: '2025 赛季联赛冠军', who: 'CG足球俱乐部 · 全队 48 人',
      desc: '联赛决赛 3:1，拿下队史第 5 座奖杯，也是第一次卫冕。',
      c1: '#fff3c4', c2: '#dfae2e', c3: '#6f4a07', spin: 22 }
  ];

  /* 圆台/圆柱部件：n 个带倾角的面片 */
  function cyl(n, w, h, rmid, tilt, py) {
    var out = '<div class="part" style="--py:' + py + 'px">';
    for (var i = 0; i < n; i++) {
      var th = (i / n) * Math.PI * 2;
      var b = (0.78 + 0.38 * Math.max(0, Math.cos(th)) + 0.06 * Math.sin(th * 2)).toFixed(3);
      out += '<i class="p3" style="--i:' + i + ';--n:' + n + ';--w:' + w + 'px;--h:' + h +
        'px;--rmid:' + rmid + 'px;--tilt:' + tilt + 'deg;--b:' + b + '"></i>';
    }
    return out + '</div>';
  }

  /* 球体的经线面片：拼出一个金色足球 */
  function lunes(n, R) {
    var w = 2 * R * Math.sin(Math.PI / n) * 1.22;
    var out = '<div class="part" style="--py:0px">';
    for (var i = 0; i < n; i++) {
      var th = (i / n) * Math.PI * 2;
      var b = (0.72 + 0.44 * Math.max(0, Math.cos(th))).toFixed(3);
      out += '<i class="p3 p3--lune" style="--i:' + i + ';--n:' + n + ';--w:' + w.toFixed(1) +
        'px;--h:' + (R * 2) + 'px;--rmid:' + R + 'px;--tilt:0deg;--b:' + b + '"></i>';
    }
    return out + '</div>';
  }

  /* 杯耳：在竖直平面里用小块围成一个环 */
  function handle(n, r, hx, hy, size) {
    var out = '<div class="handle" style="--hx:' + hx + 'px;--hy:' + hy + 'px">';
    for (var i = 0; i < n; i++) {
      var b = (0.8 + 0.3 * Math.max(0, Math.cos((i / n) * Math.PI * 2))).toFixed(3);
      out += '<i class="p3" style="--i:' + i + ';--n:' + n + ';--hr:' + r + 'px;--b:' + b +
        ';--w:' + size + 'px;--h:' + size + 'px"></i>';
    }
    return out + '</div>';
  }

  function goldGrad(id, a) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0.2" y2="1">' +
      '<stop offset="0" stop-color="' + a.c1 + '"/>' +
      '<stop offset=".45" stop-color="' + a.c2 + '"/>' +
      '<stop offset="1" stop-color="' + a.c3 + '"/></linearGradient>';
  }

  /* 金靴：金色球鞋（分层做出厚度） */
  function bootSVG(a, k) {
    var g = 'bt' + k, gl = 'btl' + k;
    return '' +
      '<svg class="svg-layer" viewBox="0 0 340 240">' +
        '<defs>' + goldGrad(g, a) +
          '<linearGradient id="' + gl + '" x1="0" y1="0" x2="0" y2="1">' +
            '<stop offset="0" stop-color="#ffffff" stop-opacity=".55"/>' +
            '<stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>' +
        '</defs>' +
        /* 鞋钉 */
        '<g fill="' + a.c3 + '">' +
          '<rect x="46" y="196" width="16" height="20" rx="7"/>' +
          '<rect x="88" y="203" width="16" height="20" rx="7"/>' +
          '<rect x="132" y="206" width="16" height="20" rx="7"/>' +
          '<rect x="178" y="206" width="16" height="20" rx="7"/>' +
          '<rect x="224" y="200" width="16" height="20" rx="7"/>' +
          '<rect x="268" y="190" width="16" height="20" rx="7"/>' +
        '</g>' +
        /* 鞋底 */
        '<path d="M28 184C112 197 242 196 322 178l-2 20c-78 18-212 20-296 8z" fill="' + a.c3 + '"/>' +
        /* 鞋面 */
        '<path d="M34 184C28 160 32 136 46 122c14-15 34-23 56-25l28-4c32-4 60 6 82 24 32 26 66 46 94 54 12 3 18 10 16 19-80 12-214 10-288 4z" fill="url(#' + g + ')"/>' +
        '<path d="M34 184C28 160 32 136 46 122c14-15 34-23 56-25l28-4c32-4 60 6 82 24 32 26 66 46 94 54 12 3 18 10 16 19-80 12-214 10-288 4z" fill="url(#' + gl + ')" opacity=".5"/>' +
        /* 鞋口 */
        '<ellipse cx="102" cy="100" rx="44" ry="15" fill="' + a.c3 + '"/>' +
        '<ellipse cx="102" cy="99" rx="34" ry="9" fill="#2a1a03" opacity=".6"/>' +
        /* 鞋带 */
        '<g stroke="' + a.c3 + '" stroke-width="5" stroke-linecap="round" opacity=".7">' +
          '<path d="M120 112 148 106"/>' +
          '<path d="M134 124 162 118"/>' +
          '<path d="M148 136 176 130"/>' +
        '</g>' +
        /* 侧面装饰与高光 */
        '<path d="M96 150C150 138 216 150 276 172" stroke="' + a.c3 + '" stroke-width="7" fill="none" opacity=".5" stroke-linecap="round"/>' +
        '<path d="M40 160C74 138 108 128 142 126" stroke="#ffffff" stroke-width="9" fill="none" opacity=".25" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* 金手套：门将手套 */
  function gloveSVG(a, k) {
    var g = 'gl' + k;
    return '' +
      '<svg class="svg-layer" viewBox="0 0 300 330">' +
        '<defs>' + goldGrad(g, a) + '</defs>' +
        /* 四指 */
        '<rect x="66" y="30" width="40" height="122" rx="20" fill="url(#' + g + ')"/>' +
        '<rect x="112" y="16" width="40" height="136" rx="20" fill="url(#' + g + ')"/>' +
        '<rect x="158" y="22" width="40" height="130" rx="20" fill="url(#' + g + ')"/>' +
        '<rect x="202" y="42" width="38" height="110" rx="19" fill="url(#' + g + ')"/>' +
        /* 大拇指 */
        '<rect x="16" y="168" width="58" height="30" rx="15" fill="url(#' + g + ')" transform="rotate(-24 45 183)"/>' +
        /* 手掌 */
        '<rect x="58" y="118" width="186" height="152" rx="54" fill="url(#' + g + ')"/>' +
        /* 掌纹 */
        '<path d="M96 156C120 178 128 214 122 250" stroke="' + a.c3 + '" stroke-width="7" fill="none" opacity=".5" stroke-linecap="round"/>' +
        '<path d="M150 150C178 180 186 216 178 254" stroke="' + a.c3 + '" stroke-width="7" fill="none" opacity=".45" stroke-linecap="round"/>' +
        /* 手腕带 */
        '<rect x="58" y="252" width="186" height="48" rx="18" fill="' + a.c3 + '"/>' +
        '<rect x="58" y="264" width="186" height="9" fill="' + a.c1 + '" opacity=".55"/>' +
        '<path d="M84 196C112 168 168 162 206 180" stroke="#ffffff" stroke-width="11" fill="none" opacity=".3" stroke-linecap="round"/>' +
      '</svg>';
  }

  /* 四座奖杯各自的立体结构 */
  function trophy3d(a, k) {
    var body = '';

    if (a.type === 'ball') {
      /* 金球奖：金色足球 —— 实心球体（不转，负责球的外形与固定高光）+ 经线面片（负责转动）
         球体的轮廓在任何角度都是圆，所以用固定球体 + 旋转纹路最像真球。 */
      body =
        '<div class="trophy3d-static" style="bottom:calc(44px + 106px)">' +
          '<div class="ball-core" style="--R:62px"></div>' +
        '</div>' +
        '<div class="trophy3d t3d--spin" style="--spin:' + a.spin + 's;--oy:106px">' + lunes(20, 62) + '</div>' +
        '<div class="trophy3d-static">' +
          cyl(16, 22, 18, 44, 16, -9) +
          cyl(16, 18, 26, 33, 10, -31) +
        '</div>';
    } else if (a.type === 'boot') {
      /* 金靴奖：金色球鞋 + 底座 */
      body =
        '<div class="trophy3d t3d--sway" style="--spin:' + a.spin + 's;--oy:88px">' +
          '<div class="svg3d" style="--w:250px">' +
            '<div class="svg-layer-wrap" style="transform:translateZ(-10px);filter:brightness(.7)">' + bootSVG(a, k) + '</div>' +
            '<div class="svg-layer-wrap" style="transform:translateZ(0)">' + bootSVG(a, k) + '</div>' +
            '<div class="svg-layer-wrap" style="transform:translateZ(10px);opacity:.5">' + bootSVG(a, k) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="trophy3d-static">' +
          cyl(16, 18, 22, 46, 12, -11) +
        '</div>';
    } else if (a.type === 'glove') {
      /* 金手套奖：门将手套 + 底座 */
      body =
        '<div class="trophy3d t3d--sway" style="--spin:' + a.spin + 's;--oy:104px">' +
          '<div class="svg3d" style="--w:190px">' +
            '<div class="svg-layer-wrap" style="transform:translateZ(-10px);filter:brightness(.7)">' + gloveSVG(a, k) + '</div>' +
            '<div class="svg-layer-wrap" style="transform:translateZ(0)">' + gloveSVG(a, k) + '</div>' +
            '<div class="svg-layer-wrap" style="transform:translateZ(10px);opacity:.45">' + gloveSVG(a, k) + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="trophy3d-static">' +
          cyl(16, 18, 20, 44, 12, -10) +
        '</div>';
    } else {
      /* 冠军奖杯：双耳大杯（杯身 + 杯盖 + 杯耳 + 杯颈 + 三级底座） */
      body =
        '<div class="trophy3d t3d--spin" style="--spin:' + a.spin + 's;--oy:115px">' +
          cyl(18, 15, 80, 28, -8.5, 13) +        /* 杯身：上宽下窄 */
          cyl(18, 17, 8, 43, 0, 57) +            /* 杯口 */
          cyl(18, 15, 22, 30, 13, 72) +          /* 杯盖（上收） */
          cyl(14, 12, 10, 18, 20, 88) +          /* 盖顶 */
          cyl(12, 10, 12, 9, 0, 99) +            /* 顶饰 */
          handle(16, 21, 49, 13, 7) +            /* 左耳 */
          handle(16, 21, -49, 13, 7) +           /* 右耳 */
          cyl(14, 12, 36, 10, 0, -45) +          /* 杯颈 */
          cyl(18, 18, 20, 26, 12, -73) +         /* 底座上 */
          cyl(20, 20, 12, 36, 10, -89) +         /* 底座中 */
          cyl(22, 22, 10, 44, 8, -100) +         /* 底座下 */
        '</div>' +
        '<div class="trophy3d-static">' + cyl(24, 26, 10, 50, 0, -5) + '</div>';
    }

    return '' +
      '<div class="trophy3d-wrap" style="--c1:' + a.c1 + ';--c2:' + a.c2 + ';--c3:' + a.c3 + '">' +
        '<div class="t3d-glow"></div>' +
        body +
        '<div class="t3d-floor"></div>' +
        '<div class="t3d-flare"></div>' +
      '</div>';
  }

  var bigGrid = document.getElementById('bigAwards');
  if (bigGrid) {
    BIG_AWARDS.forEach(function (a, k) {
      var card = document.createElement('article');
      card.className = 'big-award';
      card.innerHTML =
        '<div class="big-award__stage">' + trophy3d(a, k) + '</div>' +
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
