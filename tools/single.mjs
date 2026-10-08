/* 把整站打包成一个自带全部资源的 HTML 文件（离线也能打开）
   运行：node cg-fc/tools/single.mjs  —— 生成 cg-fc/standalone.html */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TOOLS = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.dirname(TOOLS);          // cg-fc 目录
const read = f => fs.readFile(path.join(ROOT, f), 'utf8');

let html = await read('index.html');
const css = await read(path.join('assets', 'css', 'styles.css'));
const js = await read(path.join('assets', 'js', 'main.js'));
const logo = await read(path.join('assets', 'img', 'logo.svg'));
const captain = await read(path.join('assets', 'img', 'captain.svg'));

const dataUri = svg => 'data:image/svg+xml;base64,' + Buffer.from(svg, 'utf8').toString('base64');

html = html
  .replace(/<link rel="icon"[^>]*>\s*/g, '')
  .replace(/<link rel="apple-touch-icon"[^>]*>\s*/g, '')
  .replace(/<meta property="og:image"[^>]*>\s*/g, '')
  .replace(/<meta name="twitter:image"[^>]*>\s*/g, '')
  .replace(/<link rel="stylesheet"[^>]*>\s*/, `<style>\n${css}\n</style>\n`)
  .replace('<script src="assets/js/main.js"></script>', `<script>\n${js}\n</script>`)
  .replaceAll('assets/img/logo.svg', dataUri(logo))
  .replaceAll('assets/img/captain.svg', dataUri(captain));

const out = path.join(ROOT, 'standalone.html');
await fs.writeFile(out, html, 'utf8');
const st = await fs.stat(out);
console.log(`standalone.html  ${Math.round(st.size / 1024)} KB`);
