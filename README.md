# CG足球俱乐部 · 官方网站（球迷自建站）

一个纯静态网站，不需要安装任何软件、不需要服务器，双击 `index.html` 就能看。

## 目录结构

```
cg-fc/
├─ index.html                 网站首页（所有文案都在这里）
├─ assets/
│  ├─ css/styles.css          配色、排版、动画
│  ├─ js/main.js              巨星图鉴、数字动画、导航、报名表单
│  └─ img/
│     ├─ logo.svg             队徽（绿金盾牌 · 王冠 · CG · 足球）
│     ├─ captain.svg          队长德布劳硕的 10 号战袍插画
│     └─ stars/               ← 放球员照片的文件夹（现在是空的）
└─ README.md
```

## 怎么打开

直接双击 `index.html`。想发布到网上，把整个 `cg-fc` 文件夹上传到任何静态托管服务即可
（GitHub Pages、Vercel、Netlify、阿里云 OSS、腾讯云 COS 都可以）。

## 怎么换球员图片（重点）

站内的球星海报现在是**原创矢量插画**（由代码生成，绿色金色风格统一）。
如果你有自己的球员照片，只要：

1. 把图片命名成对应的 id，放进 `assets/img/stars/`；
2. 文件名必须是 `.jpg`，例如：

```
assets/img/stars/messi.jpg      → 替换梅西那张
assets/img/stars/ronaldo.jpg    → 替换 C罗那张
assets/img/stars/mbappe.jpg     → 替换姆巴佩那张
assets/img/stars/haaland.jpg    → 替换哈兰德那张
assets/img/stars/neymar.jpg     → 替换内马尔那张
assets/img/stars/debruyne.jpg   → 替换德布劳内那张
assets/img/stars/captain10.jpg  → 替换队长那张
```

页面会自动优先显示照片，读不到才用插画。建议竖版图片，比例约 3:4（例如 900×1200）。

## 想要更多球星 / 改文案

- **加球星**：打开 `assets/js/main.js`，在 `PLAYERS` 数组里复制一条，改 `id / name / meta / desc / tags / poster`；
  海报颜色就是 `poster` 里的 `c1`（主色）、`c2`（暗色）、`accent`（号码与描边色）。
- **改俱乐部故事**：全部在 `index.html` 里，搜「传奇战史」就能找到那七个夜晚。
- **改队长经历**：搜「越传奇越好」，那是他的 12 段时间线。
- **改配色**：打开 `assets/css/styles.css` 最上面的 `:root`，改 `--green` 和 `--gold` 两个变量，全站跟着变。
- **报名表单**：现在是纯前端演示（不会真的发送）。想让报名信息真的到你邮箱，把表单接到
  Formspree、金数据、腾讯问卷之类的服务即可。

## 关于真实球队、球员和照片（请务必看一眼）

- 站内「传奇战史」是**原创虚构故事**，页面顶部和页脚都写了创作说明。留一句说明，
  既是给访客看的，也是保护你自己——避免被误解成真实赛事记录或官方信息。
- 真实球员的照片、姓名、肖像涉及**肖像权与版权**。商用或大范围公开传播前，请取得授权，
  或继续使用站内的原创插画。
- 「CG足球俱乐部」这个名称和队徽现在都是原创设计。如果要正式注册，
  记得先查一下商标是否已被占用。
- 与曼城、皇马等球队比赛的桥段属于球迷创作，请勿对外宣传为真实战绩。
