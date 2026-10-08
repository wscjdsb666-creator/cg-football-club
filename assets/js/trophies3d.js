/* ==========================================================================
   CG足球俱乐部 · 年度大奖真实 3D 渲染（WebGL / Three.js）
   - 四个奖杯是真几何体：车削回转体（奖杯）、多面球体（金球）、挤出体（金靴）、
     胶囊体拼合（金手套）
   - 金属材质 = MeshPhysicalMaterial（metalness/roughness/clearcoat）+ 环境反射
   - 影棚环境光（RoomEnvironment）+ ACES 电影级色调映射 + 柔和投影
   - 鼠标按住可以拖着转，停下来后自动旋转
   如果浏览器不支持 WebGL，页面会自动保留原来的 CSS 3D 奖杯（无需处理）。
   ========================================================================== */

import * as THREE from 'three';
import { RoomEnvironment } from './../vendor/three/RoomEnvironment.js';

const TYPES = ['ball', 'boot', 'glove', 'cup'];
const METALS = [
  { color: 0xffd47a, roughness: 0.16, clearcoat: 0.5, spin: 0.30 },  // 金球奖：亮金
  { color: 0xf7c53c, roughness: 0.20, clearcoat: 0.4, spin: 0.42 },  // 金靴奖：足金
  { color: 0xe8a765, roughness: 0.24, clearcoat: 0.35, spin: 0.38 }, // 金手套奖：玫瑰金
  { color: 0xffd75e, roughness: 0.14, clearcoat: 0.6, spin: 0.22 }   // 冠军奖杯：镜面金
];

/* ---------------------------------------------------------------- 材质 */

function metalMat(cfg) {
  return new THREE.MeshPhysicalMaterial({
    color: cfg.color,
    metalness: 1,
    roughness: cfg.roughness,
    clearcoat: cfg.clearcoat,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.35
  });
}

/* ------------------------------------------------------------ 四个模型 */

/* 金球奖：多面金属球（球的缝线用棱线体现）+ 双层底座 */
function buildBall(mat, dark) {
  const g = new THREE.Group();
  const R = 0.74;
  const geo = new THREE.IcosahedronGeometry(R, 1);
  const ball = new THREE.Mesh(geo, mat);
  ball.position.y = R + 0.36;
  ball.castShadow = true;
  g.add(ball);

  /* 面板缝线 */
  const seams = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0x7a5208, transparent: true, opacity: 0.55 })
  );
  seams.position.copy(ball.position);
  g.add(seams);

  /* 底座 */
  const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.46, 0.22, 48), mat);
  base1.position.y = 0.11; base1.castShadow = base1.receiveShadow = true;
  const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.58, 0.14, 48), mat);
  base2.position.y = 0.29; base2.castShadow = base2.receiveShadow = true;
  g.add(base1, base2);
  return { group: g, height: R * 2 + 0.4 };
}

/* 冠军奖杯：车削回转体（杯身中空）+ 杯盖 + 两个杯耳 */
function buildCup(mat) {
  const g = new THREE.Group();
  const P = [
    [0.00, 0.00], [0.62, 0.00], [0.62, 0.07], [0.46, 0.11], [0.34, 0.16],
    [0.26, 0.24], [0.19, 0.36], [0.15, 0.50], [0.14, 0.60], [0.17, 0.68],
    [0.26, 0.76], [0.40, 0.86], [0.50, 0.97], [0.55, 1.10], [0.56, 1.22],
    [0.52, 1.26], [0.48, 1.20], [0.44, 1.06], [0.34, 0.90], [0.22, 0.76],
    [0.14, 0.64], [0.10, 0.52], [0.11, 0.40], [0.15, 0.28], [0.22, 0.19],
    [0.30, 0.12], [0.38, 0.07], [0.38, 0.00], [0.00, 0.00]
  ].map(p => new THREE.Vector2(p[0], p[1]));

  const body = new THREE.Mesh(new THREE.LatheGeometry(P, 96), mat);
  body.castShadow = body.receiveShadow = true;
  g.add(body);

  /* 杯盖 */
  const lidP = [
    [0.00, 0.00], [0.50, 0.00], [0.50, 0.03], [0.44, 0.10], [0.34, 0.18],
    [0.20, 0.24], [0.10, 0.27], [0.09, 0.30], [0.00, 0.33]
  ].map(p => new THREE.Vector2(p[0], p[1]));
  const lid = new THREE.Mesh(new THREE.LatheGeometry(lidP, 96), mat);
  lid.position.y = 1.26;
  lid.castShadow = true;
  g.add(lid);

  /* 顶饰 */
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.11, 40, 28), mat);
  knob.position.y = 1.66; knob.castShadow = true;
  const knobStem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.1, 24), mat);
  knobStem.position.y = 1.56;
  g.add(knob, knobStem);

  /* 杯耳：用管道沿曲线走线，最接近真实奖杯的手工杯耳 */
  [-1, 1].forEach(sign => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(sign * 0.47, 1.06, 0),
      new THREE.Vector3(sign * 0.80, 0.98, 0),
      new THREE.Vector3(sign * 0.84, 0.80, 0),
      new THREE.Vector3(sign * 0.68, 0.68, 0),
      new THREE.Vector3(sign * 0.42, 0.72, 0)
    ]);
    const handle = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, 0.045, 20, false), mat);
    handle.castShadow = true;
    g.add(handle);
  });

  return { group: g, height: 1.8 };
}

/* 金靴奖：挤出体做鞋身 + 鞋底 + 鞋钉 */
function buildBoot(mat) {
  const g = new THREE.Group();
  const s = new THREE.Shape();
  /* 侧面轮廓：后跟与脚踝在左（高），鞋尖在右（低） */
  s.moveTo(-0.66, 0.02);                                   // 鞋跟底
  s.lineTo(0.60, 0.02);                                    // 鞋底前沿
  s.quadraticCurveTo(0.76, 0.04, 0.74, 0.15);              // 鞋尖包边
  s.quadraticCurveTo(0.66, 0.27, 0.44, 0.32);              // 脚背
  s.quadraticCurveTo(0.16, 0.37, -0.02, 0.47);             // 脚背上升
  s.quadraticCurveTo(-0.14, 0.56, -0.26, 0.62);            // 脚踝前沿
  s.quadraticCurveTo(-0.40, 0.68, -0.50, 0.62);            // 鞋口后沿
  s.quadraticCurveTo(-0.60, 0.50, -0.62, 0.32);            // 后跟立柱
  s.quadraticCurveTo(-0.64, 0.14, -0.68, 0.03);

  const boot = new THREE.Mesh(
    new THREE.ExtrudeGeometry(s, {
      depth: 0.34, bevelEnabled: true, bevelSize: 0.04,
      bevelThickness: 0.04, bevelSegments: 6, curveSegments: 32
    }),
    mat
  );
  boot.position.set(0, 0.17, -0.17);
  boot.castShadow = boot.receiveShadow = true;
  g.add(boot);

  /* 鞋底 */
  const sole = new THREE.Mesh(new THREE.BoxGeometry(1.30, 0.10, 0.46), mat);
  sole.position.set(-0.04, 0.12, 0);
  sole.castShadow = sole.receiveShadow = true;
  g.add(sole);

  /* 鞋钉 */
  for (let i = 0; i < 6; i++) {
    const stud = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.052, 0.08, 16), mat);
    stud.position.set(-0.52 + i * 0.22, 0.04, i % 2 ? 0.14 : -0.14);
    stud.castShadow = true;
    g.add(stud);
  }

  /* 鞋口（脚踝开口） */
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.038, 14, 40), mat);
  collar.position.set(-0.37, 0.63, 0);
  collar.rotation.x = 1.15;
  collar.rotation.z = -0.18;
  collar.castShadow = true;
  g.add(collar);

  /* 鞋带 */
  [0, 1, 2].forEach(i => {
    const lace = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.30, 12), mat);
    lace.position.set(0.04 + i * 0.14, 0.44 - i * 0.03, 0);
    lace.rotation.x = Math.PI / 2;
    lace.rotation.z = -0.25;
    lace.castShadow = true;
    g.add(lace);
  });

  /* 底座 */
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.74, 0.16, 64), mat);
  base.position.y = 0.0; base.castShadow = base.receiveShadow = true;
  g.add(base);

  return { group: g };
}

/* 金手套奖：胶囊体拼出手套（手掌 + 四指 + 拇指 + 护腕） */
function buildGlove(mat) {
  const g = new THREE.Group();

  const palm = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.44, 12, 32), mat);
  palm.position.set(0, 0.82, 0);
  palm.scale.set(0.92, 1, 0.52);
  palm.castShadow = true;
  g.add(palm);

  const fingerX = [-0.22, -0.075, 0.075, 0.22];
  const fingerLen = [0.34, 0.42, 0.40, 0.30];
  const fingerTilt = [-0.26, -0.08, 0.08, 0.26];
  fingerX.forEach((x, i) => {
    const f = new THREE.Mesh(new THREE.CapsuleGeometry(0.072, fingerLen[i], 10, 24), mat);
    f.position.set(x, 1.30 + fingerLen[i] / 2 - 0.04, 0);
    f.rotation.z = fingerTilt[i];
    f.scale.set(1, 1, 0.78);
    f.castShadow = true;
    g.add(f);
  });

  const thumb = new THREE.Mesh(new THREE.CapsuleGeometry(0.088, 0.32, 10, 24), mat);
  thumb.position.set(-0.42, 0.80, 0);
  thumb.rotation.z = -1.05;
  thumb.scale.set(1, 1, 0.75);
  thumb.castShadow = true;
  g.add(thumb);

  /* 护腕 */
  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.40, 0.42, 0.26, 48), mat);
  cuff.position.y = 0.30;
  cuff.scale.set(1, 1, 0.62);
  cuff.castShadow = cuff.receiveShadow = true;
  g.add(cuff);

  /* 底座 */
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.68, 0.20, 64), mat);
  base.position.y = 0.10; base.castShadow = base.receiveShadow = true;
  g.add(base);

  return { group: g };
}

const BUILDERS = { ball: buildBall, boot: buildBoot, glove: buildGlove, cup: buildCup };

/* ------------------------------------------------------------ 场景初始化 */

function initStage(stage, type, index) {
  const cfg = METALS[index % METALS.length];
  const mat = metalMat(cfg);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.className = 't3d-canvas';
  stage.appendChild(renderer.domElement);
  stage.classList.add('is-webgl');

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 1.5, 4.6);
  camera.lookAt(0, 0.85, 0);

  /* 建模型，并按包围盒把模型居中，自动得到真实高度 */
  const model = BUILDERS[type](mat, cfg).group;
  const box = new THREE.Box3().setFromObject(model);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= center.y;
  const H = Math.max(size.y, 0.5);

  const pivot = new THREE.Group();
  pivot.add(model);
  scene.add(pivot);

  /* 灯光：主光负责投影，两盏补光勾出金属边缘 */
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(H * 1.4, H * 2.4, H * 1.7);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.near = 0.2;
  key.shadow.camera.far = H * 8 + 4;
  key.shadow.camera.left = -H * 1.6; key.shadow.camera.right = H * 1.6;
  key.shadow.camera.top = H * 2.2; key.shadow.camera.bottom = -H * 1.4;
  key.shadow.bias = -0.0015;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa9c8ff, 1.1);
  fill.position.set(-H * 2.2, H * 1.1, -H * 1.6);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffd9a0, 0.9);
  rim.position.set(0, -H * 0.6, H * 2.4);
  scene.add(rim);

  /* 承接投影的地面（透明，只留影子），放在模型底部 */
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(H * 8, H * 8),
    new THREE.ShadowMaterial({ opacity: 0.45 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -H / 2 - 0.012;
  floor.receiveShadow = true;
  scene.add(floor);

  /* 相机自适应：同时按高度和宽度取景，保证奖杯完整入画 */
  const fov = camera.fov * Math.PI / 180;
  const halfW = Math.max(size.x, size.z) / 2;
  const halfH = size.y / 2;
  function frame() {
    const tanHalf = Math.tan(fov / 2);
    const distV = halfH / tanHalf;
    const distH = halfW / (tanHalf * Math.max(camera.aspect, 0.2));
    const dist = Math.max(distV, distH) * 1.18 + H * 0.25;
    camera.position.set(0, H * 0.10, dist);
    camera.lookAt(0, 0, 0);
  }
  frame();

  /* 尺寸自适应 */
  function resize() {
    const w = stage.clientWidth || 300;
    const h = stage.clientHeight || 300;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frame();
  }
  resize();
  if (window.ResizeObserver) new ResizeObserver(resize).observe(stage);

  /* 拖动旋转 */
  let dragging = false, lastX = 0, velocity = 0, idle = 0;
  stage.addEventListener('pointerdown', e => {
    dragging = true; lastX = e.clientX; velocity = 0;
    try { stage.setPointerCapture(e.pointerId); } catch { }
    stage.classList.add('is-drag');
  });
  stage.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    pivot.rotation.y += dx * 0.01;
    velocity = dx * 0.01;
    idle = 0;
  });
  const endDrag = () => { dragging = false; stage.classList.remove('is-drag'); };
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  /* 只在可见时渲染 */
  let visible = true;
  if (window.IntersectionObserver) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0.05 })
      .observe(stage);
  }

  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = performance.now();

  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!visible) return;

    if (!dragging) {
      idle += dt;
      pivot.rotation.y += velocity;
      velocity *= 0.94;                       /* 惯性 */
      if (idle > 0.8 && !reduce) pivot.rotation.y += cfg.spin * dt * (stage.matches(':hover') ? 2.2 : 1);
    }
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
}

/* ---------------------------------------------------------------- 启动 */

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch { return false; }
}

function boot() {
  if (!hasWebGL()) return;
  const stages = Array.from(document.querySelectorAll('.big-award__stage'));
  stages.forEach((stage, i) => {
    const type = TYPES[i % TYPES.length];
    if (!BUILDERS[type]) return;
    try { initStage(stage, type, i); }
    catch (err) { console.warn('3D 初始化失败，保留 CSS 奖杯：', type, err); }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();
