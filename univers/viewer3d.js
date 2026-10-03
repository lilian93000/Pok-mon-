/* =========================================================================
   Atlas cosmique — vues 3D interactives (Three.js r128)
   Chaque type d'astre a sa propre scène. Tout est généré dans le navigateur,
   sauf les textures de la Terre et de la Lune (textures.js).
   ========================================================================= */
(function () {
  "use strict";
  const T = window.THREE;
  const host = document.getElementById("v3d");
  if (!T || !host) { window.Viewer3D = null; return; }

  const canvas = host.querySelector("canvas");
  const loading = document.getElementById("v3d-loading");
  const TEX = window.ATLAS_TEXTURES || {};
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const DEG = Math.PI / 180;

  let renderer = null, scene = null, camera = null, raf = 0, isOpen = false;
  let updaters = [];
  const clock = new T.Clock();
  const U = { px: { value: 400 } };   // échelle des sprites (px par unité à distance 1)

  /* ---------------------------------------------------------------------
     Outils : aléatoire, bruit, couleurs
     --------------------------------------------------------------------- */
  function rng(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const gauss = (r) => Math.sqrt(-2 * Math.log(r() + 1e-9)) * Math.cos(2 * Math.PI * r());
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  function seedOf(s) { let h = 2166136261; for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; }

  const perm = new Uint16Array(512), gval = new Float32Array(256);
  (function () {
    const r = rng(1337), p = [];
    for (let i = 0; i < 256; i++) { p.push(i); gval[i] = r() * 2 - 1; }
    for (let i = 255; i > 0; i--) { const j = (r() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; }
    for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  })();
  function vnoise(x, y, z) {
    const X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
    const fx = x - X, fy = y - Y, fz = z - Z;
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy), w = fz * fz * (3 - 2 * fz);
    const xi = X & 255, yi = Y & 255, zi = Z & 255;
    const a = perm[xi] + yi, b = perm[xi + 1] + yi;
    const aa = perm[a] + zi, ab = perm[a + 1] + zi, ba = perm[b] + zi, bb = perm[b + 1] + zi;
    const x1 = lerp(gval[perm[aa]], gval[perm[ba]], u), x2 = lerp(gval[perm[ab]], gval[perm[bb]], u);
    const x3 = lerp(gval[perm[aa + 1]], gval[perm[ba + 1]], u), x4 = lerp(gval[perm[ab + 1]], gval[perm[bb + 1]], u);
    return lerp(lerp(x1, x2, v), lerp(x3, x4, v), w);
  }
  function fbm(x, y, z, oct) {
    let s = 0, a = 0.5, f = 1;
    for (let i = 0; i < oct; i++) { s += a * vnoise(x * f, y * f, z * f); f *= 2.03; a *= 0.5; }
    return s;
  }
  function hexRGB(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
  const C = [0, 0, 0];
  function mixC(a, b, t) { t = clamp(t, 0, 1); C[0] = lerp(a[0], b[0], t); C[1] = lerp(a[1], b[1], t); C[2] = lerp(a[2], b[2], t); return C; }
  function ramp(stops, t) {   // stops : [[t, [r,g,b]], …] en 0..255
    t = clamp(t, 0, 1);
    for (let i = 1; i < stops.length; i++) {
      if (t <= stops[i][0]) return mixC(stops[i - 1][1], stops[i][1], (t - stops[i - 1][0]) / (stops[i][0] - stops[i - 1][0]));
    }
    return mixC(stops[stops.length - 1][1], stops[stops.length - 1][1], 0);
  }

  /* Texture équirectangulaire : fn(x, y, z, lat, lon) écrit la couleur dans C */
  function sphereTex(W, H, fn) {
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const g = c.getContext("2d"), img = g.createImageData(W, H), d = img.data;
    for (let j = 0; j < H; j++) {
      const lat = (0.5 - (j + 0.5) / H) * Math.PI, cl = Math.cos(lat), sl = Math.sin(lat);
      for (let i = 0; i < W; i++) {
        const lon = (i + 0.5) / W * Math.PI * 2;
        fn(cl * Math.cos(lon), sl, cl * Math.sin(lon), lat, lon);
        const k = (j * W + i) * 4;
        d[k] = C[0]; d[k + 1] = C[1]; d[k + 2] = C[2]; d[k + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return c;
  }
  function craters(c, n, seed, strength) {
    const g = c.getContext("2d"), r = rng(seed), W = c.width, H = c.height;
    for (let i = 0; i < n; i++) {
      const u = r(), v = 0.08 + r() * 0.84, lat = (0.5 - v) * Math.PI;
      const rad = (Math.pow(r(), 3) * 0.05 + 0.004) * H;
      for (const off of [0, -W, W]) {
        g.save();
        g.translate(u * W + off, v * H);
        g.scale(1 / Math.max(0.2, Math.cos(lat)), 1);
        const gr = g.createRadialGradient(0, 0, 0, 0, 0, rad);
        gr.addColorStop(0, `rgba(0,0,0,${0.35 * strength})`);
        gr.addColorStop(0.7, `rgba(0,0,0,${0.15 * strength})`);
        gr.addColorStop(0.86, `rgba(255,255,255,${0.28 * strength})`);
        gr.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = gr;
        g.beginPath(); g.arc(0, 0, rad, 0, Math.PI * 2); g.fill();
        g.restore();
      }
    }
    return c;
  }
  function canvasTex(c) { const t = new T.CanvasTexture(c); t.anisotropy = 4; return t; }
  function imgTex(url) { const t = new T.TextureLoader().load(url); t.anisotropy = 4; return t; }

  const cache = {};
  function cached(key, fn) { return cache[key] || (cache[key] = fn()); }

  const spriteTex = cached("dot", () => {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const g = c.getContext("2d"), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.25, "rgba(255,255,255,0.6)");
    gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return new T.CanvasTexture(c);
  });

  /* ---------------------------------------------------------------------
     GLSL partagé
     --------------------------------------------------------------------- */
  const SNOISE = `
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857; vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }`;

  /* Nuage de points à taille et couleur par sommet */
  function pointsMat(opts = {}) {
    return new T.ShaderMaterial({
      uniforms: { px: U.px, map: { value: spriteTex }, opacity: { value: opts.opacity ?? 1 } },
      vertexShader: `
        attribute float size; attribute vec3 color; varying vec3 vColor;
        uniform float px;
        void main(){
          vColor = color;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = clamp(size * px / -mv.z, 1.0, 180.0);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        uniform sampler2D map; uniform float opacity; varying vec3 vColor;
        void main(){
          vec4 t = texture2D(map, gl_PointCoord);
          gl_FragColor = vec4(vColor * t.a * opacity, ${opts.dark ? "t.a * opacity" : "t.a * opacity"});
        }`,
      transparent: true,
      depthWrite: false,
      blending: opts.dark ? T.NormalBlending : T.AdditiveBlending,
    });
  }
  /* Construit des points à partir d'un générateur f(i, out) -> out = {x,y,z,r,g,b,s} */
  function cloud(n, f, opts) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n);
    const o = { x: 0, y: 0, z: 0, r: 1, g: 1, b: 1, s: 1 };
    for (let i = 0; i < n; i++) {
      f(i, o);
      pos[i * 3] = o.x; pos[i * 3 + 1] = o.y; pos[i * 3 + 2] = o.z;
      col[i * 3] = o.r; col[i * 3 + 1] = o.g; col[i * 3 + 2] = o.b; size[i] = o.s;
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.BufferAttribute(pos, 3));
    g.setAttribute("color", new T.BufferAttribute(col, 3));
    g.setAttribute("size", new T.BufferAttribute(size, 1));
    const p = new T.Points(g, pointsMat(opts));
    p.frustumCulled = false;
    if (opts && opts.dark) p.renderOrder = 2;
    return p;
  }

  function starfield(n = 5000, radius = 600) {
    const r = rng(9);
    return cloud(n, (i, o) => {
      const u = r() * 2 - 1, t = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      o.x = radius * s * Math.cos(t); o.y = radius * u; o.z = radius * s * Math.sin(t);
      const k = r(), b = 0.35 + Math.pow(r(), 4) * 0.9;
      o.r = b * (k < 0.3 ? 1 : 0.8); o.g = b * 0.88; o.b = b * (k > 0.6 ? 1 : 0.75);
      o.s = (1.2 + Math.pow(r(), 6) * 3) * radius / 400;
    });
  }

  function textSprite(text, color = "#f3c27a", scale = 1, fixed = false) {
    const c = document.createElement("canvas"), g = c.getContext("2d");
    const font = "500 40px IBM Plex Sans, system-ui, sans-serif";
    g.font = font;
    const w = Math.ceil(g.measureText(text).width) + 24;
    c.width = w; c.height = 60;
    g.font = font; g.textBaseline = "middle";
    g.fillStyle = "rgba(5,7,13,0.6)"; g.fillText(text, 14, 32);
    g.fillStyle = color; g.fillText(text, 12, 30);
    const m = new T.SpriteMaterial({ map: new T.CanvasTexture(c), depthTest: false, transparent: true, sizeAttenuation: !fixed });
    const s = new T.Sprite(m);
    const k = fixed ? 0.034 : 0.5;
    s.scale.set(w / 60 * k * scale, k * scale, 1);
    s.center.set(0, 0.5);
    s.renderOrder = 10;
    return s;
  }

  function glowSprite(color, size, opacity = 1) {
    const m = new T.SpriteMaterial({ map: spriteTex, color, transparent: true, opacity, blending: T.AdditiveBlending, depthWrite: false });
    const s = new T.Sprite(m); s.scale.set(size, size, 1);
    return s;
  }

  function atmosphere(radius, color, power = 3.0, strength = 1.0, sunDir, base = 1) {
    const k = radius / base, limb = Math.sqrt(1 - 1 / (k * k));
    const mat = new T.ShaderMaterial({
      uniforms: { color: { value: new T.Color(color) }, power: { value: power }, strength: { value: strength }, sunDir: { value: sunDir || new T.Vector3(1, 0, 0) }, limb: { value: limb } },
      vertexShader: `
        varying vec3 vN; varying vec3 vW; varying vec3 vView;
        void main(){
          vec4 w = modelMatrix * vec4(position,1.0);
          vW = normalize(mat3(modelMatrix) * normal);
          vView = normalize(cameraPosition - w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: `
        uniform vec3 color; uniform float power; uniform float strength; uniform vec3 sunDir; uniform float limb;
        varying vec3 vW; varying vec3 vView;
        void main(){
          float d = -dot(normalize(vW), normalize(vView));
          float i = pow(clamp(d / limb, 0.0, 1.0), power * 0.6) * strength;
          float lit = smoothstep(-0.35, 0.4, dot(normalize(vW), normalize(sunDir)));
          gl_FragColor = vec4(color * i * (0.15 + 0.85 * lit), 1.0);
        }`,
      side: T.BackSide, blending: T.AdditiveBlending, transparent: true, depthWrite: false,
    });
    return new T.Mesh(new T.SphereGeometry(radius, 64, 32), mat);
  }

  /* ---------------------------------------------------------------------
     Contrôles : orbite à la souris / au doigt, avec inertie
     --------------------------------------------------------------------- */
  const ctl = {
    theta: 0.6, phi: 1.2, dist: 3, tDist: 3, minD: 1.5, maxD: 10, vT: 0, vP: 0, auto: 0.06,
    target: new T.Vector3(), drag: false, idle: 0,
  };
  const ptrs = new Map();
  let pinch0 = 0, pinchD = 0;
  canvas.addEventListener("pointerdown", (e) => {
    canvas.setPointerCapture(e.pointerId);
    ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY });
    ctl.drag = true; ctl.idle = 0;
    if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch0 = Math.hypot(a.x - b.x, a.y - b.y); pinchD = ctl.tDist; }
  });
  canvas.addEventListener("pointermove", (e) => {
    const p = ptrs.get(e.pointerId); if (!p) return;
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (ptrs.size === 2) {
      const [a, b] = [...ptrs.values()];
      ctl.tDist = clamp(pinchD * pinch0 / Math.max(10, Math.hypot(a.x - b.x, a.y - b.y)), ctl.minD, ctl.maxD);
      return;
    }
    ctl.vT = -dx * 0.006; ctl.vP = -dy * 0.006;
    ctl.theta += ctl.vT; ctl.phi = clamp(ctl.phi + ctl.vP, 0.08, Math.PI - 0.08);
  });
  const endP = (e) => { ptrs.delete(e.pointerId); if (!ptrs.size) ctl.drag = false; };
  canvas.addEventListener("pointerup", endP);
  canvas.addEventListener("pointercancel", endP);
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault(); ctl.idle = 0;
    ctl.tDist = clamp(ctl.tDist * Math.exp(e.deltaY * 0.0012), ctl.minD, ctl.maxD);
  }, { passive: false });

  function updateControls(dt) {
    if (!ctl.drag) {
      ctl.theta += ctl.vT; ctl.phi = clamp(ctl.phi + ctl.vP, 0.08, Math.PI - 0.08);
      ctl.vT *= 0.93; ctl.vP *= 0.93;
      ctl.idle += dt;
      if (!reduceMotion) ctl.theta += ctl.auto * dt * smooth01(ctl.idle / 3);
    }
    ctl.dist += (ctl.tDist - ctl.dist) * Math.min(1, dt * 6);
    const s = Math.sin(ctl.phi);
    camera.position.set(ctl.dist * s * Math.sin(ctl.theta), ctl.dist * Math.cos(ctl.phi), ctl.dist * s * Math.cos(ctl.theta)).add(ctl.target);
    camera.lookAt(ctl.target);
  }
  const smooth01 = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

  /* ---------------------------------------------------------------------
     Étoiles (Soleil compris) : surface animée + couronne
     --------------------------------------------------------------------- */
  function starMaterial(hot, cool, freq, spots) {
    return new T.ShaderMaterial({
      uniforms: { time: { value: 0 }, colA: { value: new T.Color(...hot) }, colB: { value: new T.Color(...cool) }, freq: { value: freq }, spots: { value: spots } },
      vertexShader: `
        varying vec3 vP; varying vec3 vN; varying vec3 vView;
        void main(){
          vP = position;
          vec4 w = modelMatrix * vec4(position,1.0);
          vN = normalize(mat3(modelMatrix) * normal);
          vView = normalize(cameraPosition - w.xyz);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: SNOISE + `
        uniform float time; uniform vec3 colA; uniform vec3 colB; uniform float freq; uniform float spots;
        varying vec3 vP; varying vec3 vN; varying vec3 vView;
        void main(){
          vec3 p = normalize(vP);
          float n = snoise(p*freq + vec3(0.0, time*0.04, 0.0))*0.5
                  + snoise(p*freq*2.4 - vec3(time*0.06))*0.3
                  + snoise(p*freq*6.0 + vec3(time*0.1))*0.2;
          float cells = 1.0 - abs(snoise(p*freq*3.5 + time*0.03));
          float g = clamp(0.5 + 0.55*n + 0.25*(cells-0.5), 0.0, 1.0);
          vec3 col = mix(colB, colA, g);
          float s = snoise(p*1.7 + vec3(time*0.004));
          float pen = smoothstep(0.66, 0.72, s), umb = smoothstep(0.72, 0.8, s);
          col *= 1.0 - spots * (pen * 0.45 + umb * 0.45);
          float fac = snoise(p*9.0 + vec3(time*0.01));
          col += colA * spots * 0.12 * smoothstep(0.5, 0.8, fac);
          float mu = max(dot(normalize(vN), normalize(vView)), 0.0);
          col *= 0.3 + 0.7 * pow(mu, 0.5);
          gl_FragColor = vec4(col * 1.35, 1.0);
        }`,
    });
  }
  function coronaTex(seed, rays) {
    const c = document.createElement("canvas"); c.width = c.height = 512;
    const g = c.getContext("2d"), r = rng(seed);
    const gr = g.createRadialGradient(256, 256, 60, 256, 256, 256);
    gr.addColorStop(0, "rgba(255,255,255,0.9)"); gr.addColorStop(0.2, "rgba(255,255,255,0.35)");
    gr.addColorStop(0.5, "rgba(255,255,255,0.08)"); gr.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
    g.globalCompositeOperation = "lighter";
    for (let i = 0; i < rays; i++) {
      const a = r() * Math.PI * 2, len = 120 + r() * 140, w = 0.02 + r() * 0.05;
      const lg = g.createLinearGradient(256, 256, 256 + Math.cos(a) * len * 1.0, 256 + Math.sin(a) * len);
      lg.addColorStop(0.2, "rgba(255,255,255,0.12)"); lg.addColorStop(1, "rgba(255,255,255,0)");
      g.fillStyle = lg;
      g.beginPath(); g.moveTo(256, 256);
      g.arc(256, 256, len, a - w, a + w); g.closePath(); g.fill();
    }
    return new T.CanvasTexture(c);
  }
  function makeStar(opts) {
    const grp = new T.Group();
    const rgb = hexRGB(opts.color);
    const hot = opts.hot || [Math.min(1, rgb[0] * 1.1 + 0.1), Math.min(1, rgb[1] * 1.05 + 0.08), Math.min(1, rgb[2] + 0.05)];
    const cool = opts.cool || [rgb[0] * 0.85, rgb[1] * 0.45, rgb[2] * 0.25];
    const mat = starMaterial(hot, cool, opts.freq || 4, opts.spots ?? 0.4);
    const mesh = new T.Mesh(new T.SphereGeometry(opts.radius || 1, 96, 64), mat);
    if (opts.oblate) mesh.scale.set(1, opts.oblate, 1);
    grp.add(mesh);
    const ct = coronaTex(opts.seed || 3, opts.rays ?? 70);
    const cm = new T.SpriteMaterial({ map: ct, color: new T.Color(...hot), transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.55 });
    const corona = new T.Sprite(cm);
    const cs = (opts.radius || 1) * (opts.corona || 4.2);
    corona.scale.set(cs, cs, 1);
    grp.add(corona);
    const halo = glowSprite(new T.Color(...hot), (opts.radius || 1) * 5, 0.22);
    grp.add(halo);
    updaters.push((dt, t) => { mat.uniforms.time.value = t * (opts.speed || 1); mesh.rotation.y += dt * (opts.spin || 0.03); cm.rotation += dt * 0.01; });
    grp.userData.mat = mat;
    return grp;
  }
  function prominences(parent, radius, color, n, seed) {
    const r = rng(seed);
    for (let i = 0; i < n; i++) {
      const a = new T.Vector3(gauss(r), gauss(r) * 0.6, gauss(r)).normalize();
      const tangent = new T.Vector3().crossVectors(a, new T.Vector3(0, 1, 0)).normalize();
      const span = 0.12 + r() * 0.25, h = 0.12 + r() * 0.35;
      const p0 = a.clone().applyAxisAngle(tangent.clone().cross(a).normalize(), -span).multiplyScalar(radius * 0.99);
      const p2 = a.clone().applyAxisAngle(tangent.clone().cross(a).normalize(), span).multiplyScalar(radius * 0.99);
      const p1 = a.clone().multiplyScalar(radius * (1 + h * 2));
      const curve = new T.QuadraticBezierCurve3(p0, p1, p2);
      const m = new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.4, blending: T.AdditiveBlending, depthWrite: false });
      const tube = new T.Mesh(new T.TubeGeometry(curve, 40, radius * (0.004 + r() * 0.008), 6, false), m);
      parent.add(tube);
      const ph = r() * 6;
      updaters.push((dt, t) => { m.opacity = 0.25 + 0.2 * Math.sin(t * 0.7 + ph); });
    }
  }

  /* ---------------------------------------------------------------------
     Planètes : textures procédurales
     --------------------------------------------------------------------- */
  const PLANET_TEX = {
    Mercure: () => craters(sphereTex(1024, 512, (x, y, z) => {
      const n = fbm(x * 4, y * 4, z * 4, 6), v = 125 + n * 90;
      C[0] = v * 1.02; C[1] = v * 0.97; C[2] = v * 0.9;
    }), 420, 21, 1),
    Vénus: () => sphereTex(1024, 512, (x, y, z) => {
      const w = fbm(x * 2, y * 2, z * 2, 3);
      const n = fbm(x * 2.5 + w * 1.6, y * 7 + w * 2, z * 2.5 + w, 6);
      ramp([[0, [150, 105, 50]], [0.45, [205, 160, 90]], [0.75, [235, 210, 150]], [1, [250, 238, 200]]], 0.5 + n * 1.1);
    }),
    Mars: () => craters(sphereTex(1024, 512, (x, y, z, lat) => {
      const n = fbm(x * 2.2, y * 2.2, z * 2.2, 7), m = fbm(x * 0.9 + 5, y * 0.9, z * 0.9, 3);
      ramp([[0, [55, 25, 16]], [0.35, [105, 45, 25]], [0.6, [160, 75, 38]], [1, [200, 120, 72]]], 0.5 + n * 1.3 + m * 0.7);
      const cap = Math.abs(y) - (0.9 + fbm(x * 6, y * 6, z * 6, 3) * 0.08);
      if (cap > 0) mixC(C, [245, 240, 235], cap * 30);
    }), 70, 33, 0.3),
    Jupiter: () => sphereTex(1024, 512, (x, y, z, lat, lon) => {
      const w = fbm(x * 3, y * 3, z * 3, 4);
      const l = y + w * 0.035 + fbm(x * 14, y * 14, z * 14, 3) * 0.012;
      const b = 0.5 + 0.5 * Math.sin(l * 23 + Math.sin(l * 7) * 2.2);
      mixC([150, 100, 68], [232, 218, 192], b);
      const belt = Math.sin(l * 11.5 + 0.6);
      if (belt > 0.45) { C[0] *= 0.78; C[1] *= 0.6; C[2] *= 0.46; }
      const ed = fbm(x * 9 + l * 40, y * 30, z * 9, 3);
      C[0] *= 0.92 + ed * 0.35; C[1] *= 0.92 + ed * 0.3; C[2] *= 0.92 + ed * 0.25;
      // Grande Tache rouge
      let dl = lon - 4.2; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
      const e = Math.pow(dl * Math.cos(lat) / 0.17, 2) + Math.pow((lat + 0.39) / 0.075, 2);
      if (e < 1.6) {
        const sw = fbm(x * 20, y * 20, z * 20, 3) * 0.4;
        mixC(C, [195, 85 + sw * 60, 55], (1 - e / 1.6) * 1.4);
      }
    }),
    Saturne: () => sphereTex(1024, 512, (x, y, z) => {
      const w = fbm(x * 3, y * 3, z * 3, 4);
      const l = y + w * 0.02;
      const b = 0.5 + 0.5 * Math.sin(l * 26 + Math.sin(l * 5) * 2);
      mixC([196, 160, 105], [240, 222, 175], b);
      if (Math.abs(y) > 0.9) mixC(C, [150, 160, 150], (Math.abs(y) - 0.9) * 8);
    }),
    Uranus: () => sphereTex(512, 256, (x, y, z) => {
      const b = 0.5 + 0.5 * Math.sin(y * 14 + fbm(x * 3, y * 3, z * 3, 3));
      mixC([140, 205, 215], [175, 228, 232], b * 0.6 + (y > 0.6 ? 0.4 : 0));
    }),
    Neptune: () => sphereTex(1024, 512, (x, y, z, lat, lon) => {
      const w = fbm(x * 3, y * 3, z * 3, 4);
      const b = 0.5 + 0.5 * Math.sin(y * 16 + w * 3);
      mixC([40, 75, 190], [80, 125, 230], b);
      let dl = lon - 2.0; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
      const e = Math.pow(dl * Math.cos(lat) / 0.14, 2) + Math.pow((lat + 0.35) / 0.07, 2);
      if (e < 1) mixC(C, [20, 35, 110], (1 - e) * 1.3);
      const cl = fbm(x * 8, y * 30, z * 8, 4);
      if (cl > 0.32) mixC(C, [235, 240, 255], (cl - 0.32) * 4);
    }),
    Pluton: () => craters(sphereTex(1024, 512, (x, y, z, lat, lon) => {
      const n = fbm(x * 3, y * 3, z * 3, 6);
      ramp([[0, [95, 65, 50]], [0.5, [175, 140, 110]], [1, [225, 205, 180]]], 0.55 + n * 1.2);
      // Tombaugh Regio (le « cœur »)
      let dl = lon - 3.0; dl = Math.atan2(Math.sin(dl), Math.cos(dl));
      const hx = dl / 0.5, hy = (lat - 0.25) / 0.45;
      const heart = Math.pow(hx * hx + hy * hy - 0.6, 3) - hx * hx * hy * hy * hy;
      if (heart < 0.02) mixC(C, [240, 232, 220], 0.85 * clamp(-heart * 40 + 0.8, 0, 1));
      // Cthulhu Macula, sombre
      let dc = lon - 1.6; dc = Math.atan2(Math.sin(dc), Math.cos(dc));
      const cth = clamp((0.22 + n * 0.2 - Math.abs(lat + 0.05)) * 10, 0, 1) * clamp((0.9 - Math.abs(dc)) * 4, 0, 1);
      if (cth > 0) mixC(C, [70, 35, 28], 0.75 * cth);
    }), 60, 44, 0.25),
  };
  const PLANET_INFO = {
    Mercure: { tilt: 0.03, atmo: null },
    Vénus: { tilt: 177, atmo: ["#ffe2a8", 2.2, 1.3] },
    Mars: { tilt: 25.2, atmo: ["#ff9a6a", 3.0, 0.7] },
    Jupiter: { tilt: 3.1, atmo: ["#e8d2b0", 3.0, 0.6], spin: 0.25 },
    Saturne: { tilt: 26.7, atmo: ["#f2dfb0", 3.0, 0.5], spin: 0.22, ring: [1.24, 2.27] },
    Uranus: { tilt: 97.8, atmo: ["#a8f0ff", 2.5, 0.9], ring: [1.6, 2.0], faintRing: true },
    Neptune: { tilt: 28.3, atmo: ["#7aa0ff", 2.5, 1.0] },
    Pluton: { tilt: 120, atmo: ["#c8d8ff", 4.0, 0.25] },
  };

  // Lunes : nom, distance (rayons planétaires), rayon affiché, couleur, période (jours)
  const MOONS = {
    Jupiter: [["Io", 5.9, 0.07, "#e8d070", 1.77], ["Europe", 9.4, 0.06, "#d8cbb0", 3.55], ["Ganymède", 15, 0.09, "#a89a88", 7.15], ["Callisto", 26.4, 0.085, "#7a6e62", 16.7]],
    Saturne: [["Encelade", 3.95, 0.035, "#f4f8ff", 1.37], ["Rhéa", 8.7, 0.045, "#cfc8c0", 4.52], ["Titan", 20.3, 0.1, "#d9a050", 15.9]],
    Mars: [["Phobos", 2.76, 0.03, "#8a7a6a", 0.32], ["Deimos", 6.92, 0.025, "#9a8a7a", 1.26]],
    Neptune: [["Triton", 14.4, 0.08, "#d8c8c0", -5.88]],
    Uranus: [["Miranda", 5.1, 0.03, "#b8b8b8", 1.41], ["Titania", 17.1, 0.05, "#c0b8b0", 8.7]],
  };
  function addMoons(parent, list) {
    list.forEach(([name, d, rad, col, per], i) => {
      parent.add(orbitLine(d, 0x8d97ad, 0.16));
      const piv = new T.Group(); piv.rotation.y = i * 1.9 + 0.6; parent.add(piv);
      const m = miniPlanet(col, i * 13 + 5, rad); m.position.x = d; piv.add(m);
      if (name === "Titan") { const a = atmosphere(rad * 1.25, "#e0a050", 2, 1.2, ctx3.sunDir, rad); a.position.x = d; piv.add(a); }
      const l = textSprite(name, "#d8dce8", 0.75, true); l.position.set(d + rad * 1.3, rad, 0); piv.add(l);
      if (name === "Io") ctx3.ioPivot = piv;
      updaters.push((dt) => { piv.rotation.y += dt * Math.PI * 2 / (per * 20); });
    });
  }

  function saturnRingTex(faint) {
    const c = document.createElement("canvas"); c.width = 1024; c.height = 4;
    const g = c.getContext("2d"), img = g.createImageData(1024, 4), r = rng(77);
    for (let i = 0; i < 1024; i++) {
      const t = i / 1023;
      let a, col;
      if (faint) {
        a = (Math.abs(t - 0.2) < 0.02 || Math.abs(t - 0.55) < 0.015 || Math.abs(t - 0.95) < 0.03) ? 0.5 : 0.03;
        col = [200, 210, 220];
      } else {
        const R = 1.24 + t * 1.03;
        if (R < 1.53) a = 0.15 + 0.1 * r();                    // anneau C
        else if (R < 1.95) a = 0.7 + 0.25 * r();               // anneau B
        else if (R < 2.03) a = 0.05;                           // division de Cassini
        else a = (Math.abs(R - 2.21) < 0.012 ? 0.1 : 0.55 + 0.2 * r()); // anneau A, division d'Encke
        const v = 0.85 + 0.15 * r();
        col = [222 * v, 200 * v, 160 * v];
      }
      for (let j = 0; j < 4; j++) { const k = (j * 1024 + i) * 4; img.data[k] = col[0]; img.data[k + 1] = col[1]; img.data[k + 2] = col[2]; img.data[k + 3] = a * 255; }
    }
    g.putImageData(img, 0, 0);
    return new T.CanvasTexture(c);
  }
  function ring(inner, outer, tex) {
    const geo = new T.RingGeometry(inner, outer, 256, 1);
    const pos = geo.attributes.position, uv = geo.attributes.uv, v = new T.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); uv.setXY(i, (v.length() - inner) / (outer - inner), 0.5); }
    const m = new T.MeshLambertMaterial({ map: tex, emissive: 0x3a3630, emissiveMap: tex, side: T.DoubleSide, transparent: true, depthWrite: false });
    const mesh = new T.Mesh(geo, m);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    return mesh;
  }

  function sunLight(dir) {
    const l = new T.DirectionalLight(0xffffff, 1.55);
    l.position.copy(dir).multiplyScalar(30);
    scene.add(l);
    scene.add(new T.AmbientLight(0x223044, 0.35));
    return l;
  }

  /* ---------------------------------------------------------------------
     Constructeurs de scènes
     --------------------------------------------------------------------- */
  const B = {};

  function liveSun(date) {
    const n = (date - Date.UTC(2000, 0, 1, 12)) / 864e5;
    const L = (280.46 + 0.9856474 * n) * DEG, g = (357.528 + 0.9856003 * n) * DEG;
    const lam = L + (1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * DEG, eps = 23.439 * DEG;
    const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
    const ra = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
    const gmst = (280.46061837 + 360.98564736629 * n) * DEG;
    const lon = ra - gmst;
    return {
      dir: new T.Vector3(Math.cos(dec) * Math.cos(lon), Math.sin(dec), -Math.cos(dec) * Math.sin(lon)),
      lat: dec / DEG, lon: (((lon / DEG) % 360) + 540) % 360 - 180, date,
    };
  }
  const liveEl = document.getElementById("v3d-live");
  function liveBadge(l) {
    if (!liveEl) return;
    const hh = String(l.date.getUTCHours()).padStart(2, "0"), mm = String(l.date.getUTCMinutes()).padStart(2, "0");
    const la = Math.abs(l.lat).toFixed(0) + "° " + (l.lat >= 0 ? "N" : "S"), lo = Math.abs(l.lon).toFixed(0) + "° " + (l.lon >= 0 ? "E" : "O");
    liveEl.textContent = `En direct · ${hh}:${mm} UTC · Soleil au zénith : ${la}, ${lo}`;
    liveEl.hidden = false;
  }
  function every(sec, fn) { let acc = 0; return (dt) => { acc += dt; if (acc >= sec) { acc = 0; fn(); } }; }

  B.earth = function () {
    // Terre en direct : repère terrestre (y = axe des pôles), Soleil à sa vraie position
    const live = liveSun(new Date());
    const sunDir = live.dir.clone();
    const light = sunLight(sunDir);
    const tilt = new T.Group(); scene.add(tilt);
    liveBadge(live);
    updaters.push(every(20, () => {
      const l = liveSun(new Date());
      sunDir.copy(l.dir); light.position.copy(sunDir).multiplyScalar(30); liveBadge(l);
    }));
    const day = cached("earthDay", () => TEX.earthDay ? imgTex(TEX.earthDay) : null);
    let earth;
    if (day) {
      const mat = new T.ShaderMaterial({
        uniforms: {
          dayMap: { value: day },
          nightMap: { value: cached("earthLights", () => imgTex(TEX.earthLights)) },
          specMap: { value: cached("earthSpec", () => imgTex(TEX.earthSpec)) },
          sunDir: { value: sunDir },
        },
        vertexShader: `
          varying vec2 vUv; varying vec3 vN; varying vec3 vView;
          void main(){
            vUv = uv;
            vec4 w = modelMatrix * vec4(position,1.0);
            vN = normalize(mat3(modelMatrix) * normal);
            vView = normalize(cameraPosition - w.xyz);
            gl_Position = projectionMatrix * viewMatrix * w;
          }`,
        fragmentShader: `
          uniform sampler2D dayMap; uniform sampler2D nightMap; uniform sampler2D specMap; uniform vec3 sunDir;
          varying vec2 vUv; varying vec3 vN; varying vec3 vView;
          void main(){
            vec3 N = normalize(vN), L = normalize(sunDir), V = normalize(vView);
            float d = dot(N, L);
            vec3 day = texture2D(dayMap, vUv).rgb;
            vec3 night = texture2D(nightMap, vUv).r * vec3(1.0, 0.78, 0.45) * 1.7;
            float k = smoothstep(-0.18, 0.22, d);
            vec3 col = mix(night, day * (0.08 + 1.05 * max(d, 0.0)), k);
            float spec = texture2D(specMap, vUv).r;
            vec3 R = reflect(-L, N);
            col += spec * pow(max(dot(R, V), 0.0), 28.0) * 0.75 * vec3(1.0, 0.95, 0.85) * k;
            float fres = pow(1.0 - max(dot(N, V), 0.0), 2.6);
            col += vec3(0.28, 0.5, 1.0) * fres * (0.05 + 0.75 * k);
            // crépuscule rougeoyant
            col += vec3(1.0, 0.35, 0.1) * 0.12 * (1.0 - abs(d) * 5.0) * step(abs(d), 0.2);
            gl_FragColor = vec4(col, 1.0);
          }`,
      });
      earth = new T.Mesh(new T.SphereGeometry(1, 128, 64), mat);
      const clouds = new T.Mesh(
        new T.SphereGeometry(1.012, 96, 48),
        new T.MeshLambertMaterial({ color: 0xffffff, alphaMap: cached("earthClouds", () => imgTex(TEX.earthClouds)), transparent: true, depthWrite: false, opacity: 0.95 })
      );
      tilt.add(clouds);
      updaters.push((dt) => { clouds.rotation.y += dt * 0.018; });
    } else {
      earth = new T.Mesh(new T.SphereGeometry(1, 96, 48), new T.MeshStandardMaterial({ color: 0x3366cc }));
    }
    tilt.add(earth);
    tilt.add(atmosphere(1.045, "#5aa0ff", 3.2, 1.3, sunDir));
    // ISS : orbite inclinée de 51,6°, 420 km d'altitude (accélérée)
    const issPlane = new T.Group(); issPlane.rotation.x = 51.6 * DEG; issPlane.rotation.y = 0.7; tilt.add(issPlane);
    const issPiv = new T.Group(); issPlane.add(issPiv);
    issPlane.add(orbitLine(1.066, 0xf3c27a, 0.18));
    const iss = glowSprite(new T.Color(1, 0.95, 0.85), 0.05, 1); iss.position.x = 1.066; issPiv.add(iss);
    const il = textSprite("ISS", "#f3c27a", 0.8, true); il.position.set(1.08, 0.02, 0); issPiv.add(il);
    updaters.push((dt) => { issPiv.rotation.y += dt * Math.PI * 2 / 92.7; });
    // anneau des satellites géostationnaires (35 786 km)
    const r = rng(21);
    tilt.add(cloud(70, (i, p) => { const a = i / 70 * Math.PI * 2 + r() * 0.05; p.x = Math.cos(a) * 6.62; p.z = Math.sin(a) * 6.62; p.y = 0; p.r = 0.8; p.g = 0.85; p.b = 1; p.s = 0.05; }));
    const gl = textSprite("Orbite géostationnaire", "#a8b4d0", 0.7, true); gl.position.set(6.7, 0.1, 0); tilt.add(gl);
    // La Lune, en orbite (distance non à l'échelle)
    const moonPivot = new T.Group(); scene.add(moonPivot);
    const moon = new T.Mesh(new T.SphereGeometry(0.27, 64, 32), moonMaterial());
    moon.position.set(7, 0.4, 0); moonPivot.add(moon);
    const ml = textSprite("Lune", "#c9c9c4", 0.7); ml.position.set(7.35, 0.55, 0); moonPivot.add(ml);
    moonPivot.rotation.y = 2.2;
    updaters.push((dt) => { moonPivot.rotation.y += dt * 0.02; });
    light.intensity = 1.2;
    ctx3.sunDir = sunDir;
    distantSun(sunDir);
    // la caméra regarde la limite jour/nuit
    return { dist: 3.2, minD: 1.25, maxD: 14, theta: Math.atan2(sunDir.x, sunDir.z) - 1.0, phi: Math.PI / 2 - 0.25 };
  };

  function moonMaterial() {
    const t = cached("moonTex", () => TEX.moon ? imgTex(TEX.moon) : canvasTex(craters(sphereTex(512, 256, (x, y, z) => { const v = 140 + fbm(x * 4, y * 4, z * 4, 5) * 80; C[0] = C[1] = C[2] = v; }), 200, 5, 1)));
    return new T.MeshStandardMaterial({ map: t, bumpMap: t, bumpScale: 0.012, roughness: 1, metalness: 0 });
  }

  B.moon = function () {
    const sunDir = new T.Vector3(1, 0.1, 0.3).normalize();
    sunLight(sunDir);
    const moon = new T.Mesh(new T.SphereGeometry(1, 128, 64), moonMaterial());
    scene.add(moon);
    updaters.push((dt) => { moon.rotation.y += dt * 0.01; });
    // La Terre au loin
    if (TEX.earthDay) {
      const e = new T.Mesh(new T.SphereGeometry(1.2, 64, 32), new T.MeshStandardMaterial({ map: cached("earthDay", () => imgTex(TEX.earthDay)), roughness: 0.8 }));
      e.position.set(-18, 4, -26); scene.add(e);
      const a = atmosphere(1.254, "#5aa0ff", 3, 1.3, sunDir, 1.2); a.position.copy(e.position); scene.add(a);
      const l = textSprite("Terre", "#6fa8ff", 1.6); l.position.set(-16.4, 5.4, -26); scene.add(l);
      updaters.push((dt) => { e.rotation.y += dt * 0.05; });
    }
    return { dist: 3.4, minD: 1.3, maxD: 12, theta: -0.2, bloom: [0.35, 0.4, 0.92] };
  };

  B.planet = function (o) {
    const info = PLANET_INFO[o.name] || {};
    const sunDir = (info.ring ? new T.Vector3(1, 0.55, 0.6) : new T.Vector3(1, 0.1, 0.45)).normalize();
    const light = sunLight(sunDir);
    const tilt = new T.Group(); tilt.rotation.z = (info.tilt || 0) * DEG; scene.add(tilt);
    const tex = cached("p-" + o.name, () => canvasTex((PLANET_TEX[o.name] || PLANET_TEX.Mercure)()));
    const rocky = ["Mercure", "Mars", "Pluton"].includes(o.name);
    const mat = new T.MeshStandardMaterial({ map: tex, roughness: rocky ? 1 : 0.85, metalness: 0, bumpMap: rocky ? tex : null, bumpScale: 0.03 });
    const mesh = new T.Mesh(new T.SphereGeometry(1, 128, 64), mat);
    mesh.castShadow = true;
    tilt.add(mesh);
    if (info.atmo) tilt.add(atmosphere(1.035, info.atmo[0], info.atmo[1], info.atmo[2], sunDir));
    if (info.ring) {
      const rg = ring(info.ring[0], info.ring[1], cached("ring-" + o.name, () => saturnRingTex(info.faintRing)));
      tilt.add(rg);
      renderer.shadowMap.enabled = true;
      light.castShadow = true;
      light.shadow.mapSize.set(2048, 2048);
      const sc = light.shadow.camera; sc.left = sc.bottom = -3; sc.right = sc.top = 3; sc.near = 20; sc.far = 40;
    }
    updaters.push((dt) => { mesh.rotation.y += dt * (info.spin || 0.05); });
    Object.assign(ctx3, { sunDir, mesh, tilt });
    if (MOONS[o.name]) addMoons(tilt, MOONS[o.name]);
    distantSun(sunDir);
    return { dist: info.ring ? 5.6 : 3.1, minD: 1.3, maxD: 14, phi: info.ring ? 1.0 : 1.35, theta: -0.35, bloom: [0.55, 0.45, 0.8] };
  };

  B.sun = function () {
    const s = makeStar({ color: "#ffcf70", hot: [1, 0.93, 0.62], cool: [0.95, 0.42, 0.08], freq: 6, spots: 0.55, rays: 90, seed: 7 });
    scene.add(s);
    prominences(s, 1, 0xff7a30, 9, 4);
    ctx3.star = s;
    return { dist: 4.2, minD: 1.4, maxD: 16, bloom: [0.55, 0.4, 0.9] };
  };

  // Paramètres d'étoiles particulières
  function starPreset(o) {
    const giant = /géante|Supergéante/i.test(o.label || "");
    const dwarf = /Naine rouge/i.test(o.label || "");
    return {
      color: o.color,
      freq: /Supergéante rouge/.test(o.label) ? 1.4 : giant ? 2.2 : dwarf ? 4.5 : 4,
      spots: dwarf ? 0.7 : giant ? 0.15 : /blanche|bleu/i.test(o.label || "") ? 0 : 0.35,
      rays: giant ? 40 : 80,
      corona: /Supergéante/.test(o.label) ? 3.2 : 4.2,
      seed: seedOf(o.name) % 1000,
      oblate: o.name === "Altaïr" ? 0.82 : o.name === "Régulus" ? 0.76 : null,
      spin: o.name === "Altaïr" || o.name === "Régulus" ? 0.6 : 0.03,
      speed: giant ? 0.5 : 1,
    };
  }
  function miniPlanet(color, seed, r) {
    const base = hexRGB(color).map((v) => v * 255);
    const tex = canvasTex(sphereTex(256, 128, (x, y, z) => {
      const n = fbm(x * 3 + seed, y * 3, z * 3, 5);
      mixC([base[0] * 0.5, base[1] * 0.5, base[2] * 0.5], base, 0.55 + n * 1.3);
    }));
    return new T.Mesh(new T.SphereGeometry(r, 48, 24), new T.MeshStandardMaterial({ map: tex, roughness: 0.9 }));
  }
  function orbitLine(r, color = 0x8d97ad, op = 0.35) {
    const pts = [];
    for (let i = 0; i <= 128; i++) { const a = i / 128 * Math.PI * 2; pts.push(new T.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); }
    return new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color, transparent: true, opacity: op }));
  }
  function planetSystem(list, starColor) {
    // list : [rayon orbite, rayon planète, couleur, période relative, nom]
    const l = new T.PointLight(new T.Color(starColor), 2.2, 0, 2);
    scene.add(l); scene.add(new T.AmbientLight(0x223044, 0.4));
    list.forEach(([orb, pr, col, per, name], i) => {
      scene.add(orbitLine(orb));
      const piv = new T.Group(); piv.rotation.y = i * 2.1; scene.add(piv);
      const p = miniPlanet(col, i * 7 + 1, pr); p.position.x = orb; piv.add(p);
      if (name) { const s = textSprite(name, "#e8ecf4", 0.6); s.position.set(orb + pr + 0.1, pr + 0.1, 0); piv.add(s); }
      updaters.push((dt) => { piv.rotation.y += dt * 0.25 / per; p.rotation.y += dt * 0.3; });
    });
  }

  B.star = function (o) {
    const P = starPreset(o);
    let view = { dist: 4.4, minD: 1.5, maxD: 30, bloom: [0.55, 0.4, 0.9] };
    if (o.name === "Alpha du Centaure A et B" || o.name === "Capella") {
      const piv = new T.Group(); scene.add(piv);
      const a = makeStar({ ...P, color: o.color, radius: 1 }); a.position.x = -1.9; piv.add(a); ctx3.star = a;
      const b = makeStar({ ...P, color: o.name === "Capella" ? "#ffd27a" : "#ffc080", radius: o.name === "Capella" ? 0.85 : 0.86, seed: P.seed + 9 });
      b.position.x = 2.3; piv.add(b);
      updaters.push((dt) => { piv.rotation.y += dt * 0.08; });
      view = { dist: 9, minD: 3, maxD: 40, phi: 1.3 };
    } else if (o.name === "Sirius") {
      ctx3.star = makeStar({ ...P, radius: 1, hot: [0.9, 0.95, 1], cool: [0.55, 0.65, 0.95] });
      scene.add(ctx3.star);
      const piv = new T.Group(); scene.add(piv);
      const b = makeStar({ color: "#e8f0ff", hot: [1, 1, 1], cool: [0.7, 0.8, 1], radius: 0.12, corona: 6, seed: 51 });
      b.position.x = 4.5; piv.add(b);
      const lb = textSprite("Sirius B (naine blanche)", "#cfe0ff", 0.6); lb.position.set(4.75, 0.25, 0); piv.add(lb);
      scene.add(orbitLine(4.5, 0x8d97ad, 0.25));
      updaters.push((dt) => { piv.rotation.y += dt * 0.05; });
      view = { dist: 9, minD: 2, maxD: 30, phi: 1.2 };
    } else {
      const s = makeStar({ ...P, radius: 1 });
      scene.add(s); ctx3.star = s;
      if (/Naine rouge/.test(o.label)) prominences(s, 1, 0xff5020, 6, P.seed);
    }
    if (o.name === "TRAPPIST-1") {
      planetSystem([[2.2, 0.09, "#c9a27a", 1.5, "b"], [2.8, 0.09, "#b98c6a", 2.4, "c"], [3.5, 0.06, "#a8a090", 4, "d"], [4.3, 0.075, "#7aa0c0", 6.1, "e"], [5.2, 0.085, "#88a8b8", 9.2, "f"], [6.0, 0.09, "#9ab0c8", 12.4, "g"], [7.0, 0.065, "#c0c8d0", 18.8, "h"]], o.color);
      view = { dist: 13, minD: 2, maxD: 40, phi: 1.1 };
    } else if (o.name === "Proxima du Centaure") {
      planetSystem([[3.2, 0.12, "#b07a5a", 1, "Proxima b"]], o.color);
      view = { dist: 8, minD: 2, maxD: 30, phi: 1.2 };
    } else if (o.name === "Kepler-452") {
      planetSystem([[4.5, 0.16, "#6f9ac8", 1, "Kepler-452b"]], o.color);
      view = { dist: 10, minD: 2, maxD: 30, phi: 1.2 };
    } else if (o.name === "Epsilon Eridani" || o.name === "Véga") {
      const r = rng(5);
      scene.add(cloud(9000, (i, p) => {
        const rr = 4 + Math.abs(gauss(r)) * 1.2 + (o.name === "Véga" ? 2 : 0), a = r() * Math.PI * 2;
        p.x = Math.cos(a) * rr; p.z = Math.sin(a) * rr; p.y = gauss(r) * 0.08;
        p.r = 0.55; p.g = 0.45; p.b = 0.35; p.s = 0.05 + r() * 0.05;
      }));
      view = { dist: 11, minD: 2, maxD: 30, phi: 1.15 };
    }
    view.bloom = view.bloom || [0.55, 0.4, 0.9];
    return view;
  };

  /* Trou noir : tracé de rayons dans la métrique de Schwarzschild */
  function blackHoleQuad(opts) {
    const mat = new T.ShaderMaterial({
      uniforms: {
        time: { value: 0 }, camPos: { value: new T.Vector3() }, camWorld: { value: new T.Matrix4() }, projInv: { value: new T.Matrix4() },
        uIn: { value: opts.inner || 3 }, uOut: { value: opts.outer || 11 },
        uHot: { value: new T.Color(...(opts.hot || [1, 0.92, 0.75])) }, uCool: { value: new T.Color(...(opts.cool || [0.9, 0.3, 0.05])) },
        uGain: { value: opts.gain || 1 },
      },
      vertexShader: `varying vec2 vNdc; void main(){ vNdc = position.xy; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: SNOISE + `
        uniform float time; uniform vec3 camPos; uniform mat4 camWorld; uniform mat4 projInv;
        uniform float uIn; uniform float uOut; uniform vec3 uHot; uniform vec3 uCool; uniform float uGain;
        varying vec2 vNdc;
        float hash3(vec3 p){ p = fract(p*0.3183099 + 0.1); p *= 17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
        vec3 sky(vec3 d){
          vec3 col = vec3(0.0);
          for(int k=0;k<2;k++){
            float sc = k==0 ? 70.0 : 150.0;
            vec3 q = d*sc; vec3 id = floor(q); float h = hash3(id);
            if(h > 0.97){
              vec3 f = fract(q) - 0.5;
              float s = smoothstep(0.22, 0.0, length(f));
              col += s * mix(vec3(1.0,0.8,0.6), vec3(0.7,0.8,1.0), hash3(id+3.0)) * (h-0.97) * 40.0;
            }
          }
          float neb = snoise(d*2.2)*0.5+0.5;
          col += vec3(0.05,0.03,0.09) * pow(neb, 3.0) * 2.0;
          return col;
        }
        vec4 disk(vec3 p, vec3 rd){
          float r = length(p.xz);
          float t = clamp((r - uIn)/(uOut - uIn), 0.0, 1.0);
          float ang = atan(p.z, p.x);
          float rot = time * 2.2 / pow(r, 1.5);
          float a2 = ang + rot;
          float n = snoise(vec3(cos(a2)*r*0.55, sin(a2)*r*0.55, r*0.9))*0.5+0.5;
          float n2 = snoise(vec3(cos(a2)*r*2.0, sin(a2)*r*2.0, r*3.0))*0.5+0.5;
          float rings = 0.55 + 0.45*sin(r*5.0 + n*4.0);
          vec3 c = mix(uHot, uCool, pow(t, 0.55));
          float bright = pow(1.0 - t, 1.5) * (0.35 + 0.9*n*rings + 0.3*n2);
          vec3 v = normalize(vec3(-p.z, 0.0, p.x)) * sqrt(0.5/r);
          float dop = 1.0 + 1.6*dot(v, -normalize(rd));
          bright *= pow(max(dop, 0.15), 3.0);
          float edge = smoothstep(0.0, 0.06, t) * smoothstep(1.0, 0.6, t);
          float a = clamp(bright * edge * 1.4, 0.0, 1.0);
          return vec4(c * bright * edge * 2.4 * uGain, a);
        }
        void main(){
          vec4 v = projInv * vec4(vNdc, 1.0, 1.0);
          vec3 rd = normalize((camWorld * vec4(normalize(v.xyz / v.w), 0.0)).xyz);
          vec3 p = camPos;
          vec3 col = vec3(0.0); float trans = 1.0;
          vec3 hv = cross(p, rd); float h2 = dot(hv, hv);
          bool captured = false;
          for(int i=0;i<220;i++){
            float r2 = dot(p,p); float r = sqrt(r2);
            if(r < 1.0){ captured = true; break; }
            if(r > 90.0 && dot(p, rd) > 0.0) break;
            float dt = clamp(0.07*r, 0.015, 2.0);
            vec3 acc = -1.5 * h2 * p / (r2*r2*r);
            vec3 pp = p;
            rd += acc*dt; p += rd*dt;
            if(pp.y * p.y < 0.0){
              vec3 q = mix(pp, p, pp.y/(pp.y - p.y));
              float rr = length(q.xz);
              if(rr > uIn && rr < uOut){ vec4 dc = disk(q, rd); col += trans*dc.rgb; trans *= 1.0 - dc.a; }
            }
            if(trans < 0.02) break;
          }
          if(!captured) col += trans * sky(normalize(rd));
          col = vec3(1.0) - exp(-col*1.25);
          gl_FragColor = vec4(col, 1.0);
        }`,
      depthWrite: false, depthTest: false,
    });
    const quad = new T.Mesh(new T.PlaneGeometry(2, 2), mat);
    quad.frustumCulled = false;
    quad.renderOrder = -1;
    updaters.push((dt, t) => {
      camera.updateMatrixWorld();
      mat.uniforms.time.value = t;
      mat.uniforms.camPos.value.copy(camera.position);
      mat.uniforms.camWorld.value.copy(camera.matrixWorld);
      mat.uniforms.projInv.value.copy(camera.projectionMatrixInverse);
    });
    return quad;
  }
  B.blackhole = function (o) {
    const sgr = o.name === "Sagittarius A*";
    scene.add(blackHoleQuad(sgr ? { hot: [1, 0.9, 0.7], cool: [0.85, 0.28, 0.05] } : { hot: [0.95, 0.95, 1], cool: [1, 0.55, 0.2], outer: 9 }));
    if (!sgr) {
      // Cygnus X-1 : la supergéante bleue compagne
      const s = makeStar({ color: "#9fbfff", hot: [0.85, 0.92, 1], cool: [0.4, 0.55, 1], radius: 3, freq: 3, spots: 0.1, seed: 12 });
      s.position.set(-26, 1, -14); scene.add(s);
    }
    lowRes = true;
    return { dist: 26, minD: 7, maxD: 70, phi: Math.PI / 2 - 0.12, auto: 0.03, stars: false };
  };
  B.quasar = function () {
    scene.add(blackHoleQuad({ hot: [0.8, 0.9, 1], cool: [0.5, 0.6, 1], outer: 14, gain: 1.6 }));
    // jets relativistes
    const N = 5000, r = rng(3);
    const jets = cloud(N, (i, p) => { p.x = 0; p.y = 0; p.z = 0; p.r = 0.45; p.g = 0.6; p.b = 1; p.s = 0.35 + r() * 0.6; });
    const pos = jets.geometry.attributes.position, life = new Float32Array(N).map(() => r());
    const spread = new Float32Array(N * 2).map(() => gauss(r));
    scene.add(jets);
    updaters.push((dt) => {
      for (let i = 0; i < N; i++) {
        life[i] += dt * 0.25; if (life[i] > 1) life[i] -= 1;
        const d = life[i] * 60, sgn = i % 2 ? 1 : -1, w = 0.15 + d * 0.035;
        pos.setXYZ(i, spread[i * 2] * w, sgn * (1.5 + d), spread[i * 2 + 1] * w);
      }
      pos.needsUpdate = true;
    });
    lowRes = true;
    return { dist: 34, minD: 9, maxD: 90, phi: Math.PI / 2 - 0.2, auto: 0.03, stars: false };
  };

  /* Galaxies en particules */
  function buildGalaxyPoints(o, opts) {
    const grp = new T.Group();
    const r = rng(seedOf(o.name));
    const type = opts.type;
    if (type === "spiral") {
      const arms = opts.arms || 2, b = Math.tan((opts.pitch || 14) * DEG), N = opts.n || 70000;
      grp.add(cloud(N, (i, p) => {
        const u = r();
        if (u < 0.17) {
          const rr = Math.abs(gauss(r)) * 1.1;
          const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
          p.x = rr * Math.sin(ph) * Math.cos(th) * (opts.bar ? 1.9 : 1); p.z = rr * Math.sin(ph) * Math.sin(th); p.y = rr * Math.cos(ph) * 0.55;
          p.r = 1; p.g = 0.82; p.b = 0.55; p.s = 0.09;
        } else if (u < 0.8) {
          const rr = 0.9 + Math.pow(r(), 0.85) * 9.5, arm = (r() * arms) | 0;
          const th = Math.log(rr / 0.7) / b + arm * Math.PI * 2 / arms + gauss(r) * 0.2;
          const sp = rr * 0.09 * gauss(r);
          p.x = (rr + sp) * Math.cos(th); p.z = (rr + sp) * Math.sin(th); p.y = gauss(r) * 0.12 * (1.2 - rr / 11);
          const k = r();
          if (k < 0.06) { p.r = 1; p.g = 0.35; p.b = 0.65; p.s = 0.22; }
          else if (k < 0.4) { p.r = 0.6; p.g = 0.75; p.b = 1; p.s = 0.1; }
          else { p.r = 0.85; p.g = 0.85; p.b = 0.9; p.s = 0.07; }
        } else {
          const rr = -Math.log(1 - r() * 0.95) * 3.2, th = r() * Math.PI * 2;
          p.x = rr * Math.cos(th); p.z = rr * Math.sin(th); p.y = gauss(r) * 0.15;
          p.r = 0.9; p.g = 0.8; p.b = 0.7; p.s = 0.06;
        }
        p.r *= 0.85; p.g *= 0.85; p.b *= 0.85;
      }));
      // bandes de poussière
      grp.add(cloud(N / 6 | 0, (i, p) => {
        const rr = 1.6 + Math.pow(r(), 0.9) * 8.5, arm = (r() * arms) | 0;
        const th = Math.log(rr / 0.7) / b + arm * Math.PI * 2 / arms - 0.22 + gauss(r) * 0.07;
        p.x = rr * Math.cos(th); p.z = rr * Math.sin(th); p.y = gauss(r) * 0.05;
        p.r = 0.06; p.g = 0.04; p.b = 0.03; p.s = 0.28;
      }, { dark: true, opacity: 0.35 }));
      grp.add(glowSprite(new T.Color(1, 0.85, 0.6), 5.5, 0.85));
    } else if (type === "ell") {
      const N = opts.n || 50000, ax = opts.axes || [1, 0.75, 0.85];
      grp.add(cloud(N, (i, p) => {
        const rr = Math.pow(r(), 2.2) * 9;
        const th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
        p.x = rr * Math.sin(ph) * Math.cos(th) * ax[0]; p.y = rr * Math.cos(ph) * ax[1]; p.z = rr * Math.sin(ph) * Math.sin(th) * ax[2];
        p.r = 0.55; p.g = 0.45; p.b = 0.32; p.s = 0.09;
      }));
      grp.add(glowSprite(new T.Color(1, 0.85, 0.6), 7, 0.9));
    } else {
      const N = opts.n || 30000, cl = [];
      for (let k = 0; k < 14; k++) cl.push([gauss(r) * 3, gauss(r) * 1.2, gauss(r) * 2.2, 0.4 + r() * 1.2]);
      const red = opts.primitive;
      grp.add(cloud(N, (i, p) => {
        const c = cl[(r() * cl.length) | 0];
        p.x = c[0] + gauss(r) * c[3]; p.y = c[1] + gauss(r) * c[3] * 0.6; p.z = c[2] + gauss(r) * c[3];
        const k = r();
        if (red) { p.r = 0.6; p.g = 0.35; p.b = 0.25; }
        else if (k < 0.1) { p.r = 0.6; p.g = 0.2; p.b = 0.4; } else { p.r = 0.4; p.g = 0.48; p.b = 0.65; }
        p.s = 0.1;
      }));
      if (red) grp.add(glowSprite(new T.Color(1, 0.55, 0.35), 8, 0.6));
    }
    return grp;
  }
  B.galaxy = function (o) {
    let opts = { type: o.gtype || "spiral" };
    if (o.id === "Voie lactée") opts = { type: "spiral", arms: 4, pitch: 13, bar: true, n: 90000 };
    if (o.name === "Galaxie d'Andromède") opts = { type: "spiral", arms: 2, pitch: 10, n: 90000 };
    if (o.name === "Galaxie du Sombrero" || o.name === "Centaurus A") opts = { type: "ell", axes: o.name === "Centaurus A" ? [1, 0.85, 1] : [1, 0.45, 1] };
    if (o.tiny) opts = { type: "irr", primitive: true, n: 20000 };
    const g = buildGalaxyPoints(o, opts);
    if (o.name === "Galaxie du Sombrero" || o.name === "Centaurus A") {
      const r = rng(8), sombrero = o.name === "Galaxie du Sombrero";
      g.add(cloud(14000, (i, p) => {
        const rr = (sombrero ? 6 : 3.5) + gauss(r) * 0.5, a = r() * Math.PI * 2;
        p.x = Math.cos(a) * rr; p.z = Math.sin(a) * rr; p.y = gauss(r) * 0.12;
        p.r = 0.05; p.g = 0.035; p.b = 0.025; p.s = 0.45;
      }, { dark: true, opacity: 0.6 }));
      if (sombrero) g.add(cloud(10000, (i, p) => {
        const rr = 6.6 + gauss(r) * 0.6, a = r() * Math.PI * 2;
        p.x = Math.cos(a) * rr; p.z = Math.sin(a) * rr; p.y = gauss(r) * 0.15;
        p.r = 0.35; p.g = 0.32; p.b = 0.28; p.s = 0.1;
      }));
      if (!sombrero) g.rotation.z = 0.6;
    }
    if (o.id === "Voie lactée") {
      // position du Soleil : 26 700 al du centre (~ 5,3 unités)
      const sp = new T.Vector3(Math.cos(2.3) * 5.4, 0, Math.sin(2.3) * 5.4);
      const m = glowSprite(new T.Color(1, 0.8, 0.45), 0.7, 1); m.position.copy(sp); g.add(m);
      const l = textSprite("Vous êtes ici", "#f3c27a", 0.9); l.position.copy(sp).add(new T.Vector3(0.25, 0.35, 0)); g.add(l);
    }
    if (o.gtype === "spiral" && o.id !== "Voie lactée") g.rotation.x = (1 - (o.tilt || 1)) * 1.2;
    scene.add(g);
    Object.assign(ctx3, { g, gopts: opts });
    updaters.push((dt) => { g.rotation.y += dt * 0.025; });
    const small = opts.type === "irr";
    return { dist: small ? 14 : 27, minD: 3, maxD: 60, phi: 1.05 };
  };

  /* Nébuleuses : gaz en particules */
  const NEB = {
    "Nébuleuse d'Orion": [["#ff6fa0", "#ff9a6a", "#6fb8ff"], 0.9],
    "Nébuleuse du Crabe": [["#6fd0ff", "#ff9a50", "#ffd08a"], 0.6],
    "Piliers de la création": [["#3fc0b0", "#ffb37a", "#ffd890"], 1],
    "Nébuleuse de la Carène": [["#ff7f9a", "#ffa860", "#7fa8ff"], 1.2],
  };
  B.nebula = function (o) {
    const [pal, scale] = NEB[o.name] || [[o.color, "#7fa8ff", "#ff9a6a"], 1];
    const cols = pal.map(hexRGB), r = rng(seedOf(o.name));
    const grp = new T.Group(); scene.add(grp);
    const blobs = [];
    for (let k = 0; k < 9; k++) blobs.push([gauss(r) * 2.6 * scale, gauss(r) * 1.6 * scale, gauss(r) * 1.8 * scale, 0.8 + r() * 1.6]);
    const pillars = o.name === "Piliers de la création";
    const crab = o.name === "Nébuleuse du Crabe";
    grp.add(cloud(pillars ? 1500 : 2200, (i, p) => {
      if (crab) {
        const u = r() * 2 - 1, t = r() * Math.PI * 2, s = Math.sqrt(1 - u * u), rr = 2.5 + gauss(r) * 0.9;
        p.x = rr * s * Math.cos(t) * 1.3; p.y = rr * u; p.z = rr * s * Math.sin(t);
      } else {
        const b = blobs[(r() * blobs.length) | 0];
        const w = fbm(p.x * 0.4, i * 0.001, 0, 2);
        p.x = b[0] + gauss(r) * b[3] + w; p.y = b[1] + gauss(r) * b[3] * 0.7; p.z = b[2] + gauss(r) * b[3];
      }
      const n = 0.5 + fbm(p.x * 0.35, p.y * 0.35, p.z * 0.35, 3) * 1.6;
      const c = n < 0.5 ? cols[0] : n < 0.8 ? cols[1] : cols[2];
      const k = crab ? 0.01 + r() * 0.014 : 0.03 + r() * 0.035;
      p.r = c[0] * k; p.g = c[1] * k; p.b = c[2] * k; p.s = 1.2 + r() * 2.6;
    }));
    if (pillars) {
      // trois colonnes de gaz et de poussière
      [[-1.6, -2.8, 5.2, 0.36], [0.4, -2.8, 3.6, 0.3], [2.2, -2.8, 2.6, 0.26]].forEach(([x, y0, h, w]) => {
        grp.add(cloud(2600, (i, p) => {
          const t = r(), ww = w * (1.15 - t * 0.5);
          p.x = x + gauss(r) * ww + Math.sin(t * 3) * 0.2; p.y = y0 + t * h; p.z = gauss(r) * ww;
          p.r = 0.42; p.g = 0.24; p.b = 0.12; p.s = 0.35 + r() * 0.4;
        }, { dark: true, opacity: 0.13 }));
        grp.add(cloud(900, (i, p) => {
          const t = r(), ww = w * (1.15 - t * 0.5), a = r() * Math.PI * 2;
          p.x = x + Math.cos(a) * ww * 1.1; p.y = y0 + t * h; p.z = Math.sin(a) * ww * 1.1;
          p.r = 0.22; p.g = 0.14; p.b = 0.07; p.s = 0.22;
        }));
      });
    }
    if (crab) {
      ctx3.crab = grp;
      // filaments et pulsar central
      for (let f = 0; f < 70; f++) {
        const d = new T.Vector3(gauss(r), gauss(r), gauss(r)).normalize(), pts = [];
        for (let s = 0; s < 14; s++) pts.push(d.clone().multiplyScalar(0.6 + s * 0.2).add(new T.Vector3(gauss(r), gauss(r), gauss(r)).multiplyScalar(0.12)).multiply(new T.Vector3(1.3, 1, 1)));
        grp.add(new T.Line(new T.BufferGeometry().setFromPoints(new T.CatmullRomCurve3(pts).getPoints(40)), new T.LineBasicMaterial({ color: 0xff9a50, transparent: true, opacity: 0.35, blending: T.AdditiveBlending })));
      }
      const pulsar = glowSprite(new T.Color(0.8, 0.9, 1), 0.9, 1);
      grp.add(pulsar);
      updaters.push((dt, t) => { pulsar.material.opacity = 0.4 + 0.6 * Math.max(0, Math.sin(t * 30 * Math.PI / 3)); });
    }
    // jeunes étoiles
    grp.add(cloud(700, (i, p) => {
      const b = blobs[(r() * blobs.length) | 0];
      p.x = b[0] + gauss(r) * b[3]; p.y = b[1] + gauss(r) * b[3] * 0.7; p.z = b[2] + gauss(r) * b[3];
      const bl = r() < 0.5; p.r = bl ? 0.7 : 1; p.g = bl ? 0.8 : 0.9; p.b = 1; p.s = 0.05 + Math.pow(r(), 8) * 0.4;
    }));
    updaters.push((dt) => { grp.rotation.y += dt * 0.02; });
    return { dist: 13, minD: 3, maxD: 40, phi: 1.4 };
  };

  B.cluster = function (o) {
    const r = rng(seedOf(o.name));
    const grp = new T.Group(); scene.add(grp);
    if (o.name === "Omega du Centaure") {
      grp.add(cloud(45000, (i, p) => {
        const rr = 0.15 + Math.pow(r(), 2.6) * 9, th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
        p.x = rr * Math.sin(ph) * Math.cos(th); p.y = rr * Math.cos(ph); p.z = rr * Math.sin(ph) * Math.sin(th);
        const k = r();
        if (k < 0.04) { p.r = 0.6; p.g = 0.7; p.b = 1; } else if (k < 0.15) { p.r = 1; p.g = 0.6; p.b = 0.35; } else { p.r = 0.9; p.g = 0.8; p.b = 0.6; }
        p.r *= 0.6; p.g *= 0.6; p.b *= 0.6; p.s = 0.07 + Math.pow(r(), 10) * 0.3;
      }));
      grp.add(glowSprite(new T.Color(1, 0.9, 0.7), 6, 0.6));
    } else {
      grp.add(cloud(1200, (i, p) => {
        const rr = Math.abs(gauss(r)) * 3, th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
        p.x = rr * Math.sin(ph) * Math.cos(th); p.y = rr * Math.cos(ph); p.z = rr * Math.sin(ph) * Math.sin(th);
        const bright = i < 9; p.r = bright ? 0.85 : 0.6; p.g = bright ? 0.9 : 0.7; p.b = 1; p.s = bright ? 0.9 : 0.06 + r() * 0.12;
      }));
      // nébulosité bleue par réflexion
      grp.add(cloud(600, (i, p) => {
        p.x = gauss(r) * 2.2; p.y = gauss(r) * 1.5; p.z = gauss(r) * 2.2;
        p.r = 0.025; p.g = 0.05; p.b = 0.12; p.s = 1.5 + r() * 2;
      }));
    }
    updaters.push((dt) => { grp.rotation.y += dt * 0.03; });
    return { dist: 16, minD: 3, maxD: 40, phi: 1.3 };
  };

  /* Toile cosmique, amas et superamas */
  function cosmicWeb(seed, opts = {}) {
    const r = rng(seed), R = opts.R || 10, nodes = [];
    for (let i = 0; i < (opts.nodes || 55); i++) {
      let p;
      do { p = new T.Vector3(gauss(r), gauss(r), gauss(r)).multiplyScalar(R * 0.45); } while (opts.voidR && p.length() < opts.voidR);
      if (opts.flat) p.y *= 0.25, p.x *= 1.6;
      nodes.push({ p, m: Math.pow(r(), 2) });
    }
    const edges = [];
    nodes.forEach((a, i) => {
      const near = nodes.map((b, j) => [a.p.distanceTo(b.p), j]).filter(([d, j]) => j !== i).sort((x, y) => x[0] - y[0]).slice(0, 3);
      near.forEach(([d, j]) => { if (i < j || r() < 0.3) edges.push([a, nodes[j]]); });
    });
    const N = opts.n || 40000, tmp = new T.Vector3();
    const pts = cloud(N, (i, p) => {
      if (r() < 0.35) {
        const nd = nodes[(r() * nodes.length) | 0], s = 0.15 + nd.m * 0.6;
        tmp.set(gauss(r), gauss(r), gauss(r)).multiplyScalar(s).add(nd.p);
        p.r = 0.6; p.g = 0.5; p.b = 0.38; p.s = 0.06 + nd.m * 0.12;
      } else {
        const [a, b] = edges[(r() * edges.length) | 0], t = r();
        tmp.copy(a.p).lerp(b.p, t).add(new T.Vector3(gauss(r), gauss(r), gauss(r)).multiplyScalar(0.12));
        p.r = 0.32; p.g = 0.38; p.b = 0.6; p.s = 0.05;
      }
      if (opts.voidR && tmp.length() < opts.voidR * 0.9) tmp.setLength(opts.voidR * (0.9 + r() * 0.2));
      p.x = tmp.x; p.y = tmp.y; p.z = tmp.z;
    });
    return { pts, nodes };
  }
  B.web = function (o) {
    const grp = new T.Group(); scene.add(grp);
    const isVoid = o.kind === "void", wall = o.name === "Grand Mur de Sloan";
    const { pts } = cosmicWeb(seedOf(o.name), { voidR: isVoid ? 4 : 0, flat: wall, nodes: wall ? 70 : 55 });
    grp.add(pts);
    if (isVoid) {
      const s = new T.Mesh(new T.SphereGeometry(3.7, 32, 16), new T.MeshBasicMaterial({ color: 0x7d8aa8, wireframe: true, transparent: true, opacity: 0.06 }));
      grp.add(s);
      const l = textSprite("≈ 330 millions d'al presque vides", "#a0aac8", 0.8); l.position.set(-2.5, 0, 0); grp.add(l);
    }
    if (o.kind === "super" || o.name === "Grand Attracteur") {
      // les galaxies s'écoulent vers le centre
      const r = rng(4), N = 2500;
      const flow = cloud(N, (i, p) => { p.r = 0.9; p.g = 0.75; p.b = 0.5; p.s = 0.08; });
      const pos = flow.geometry.attributes.position, seeds = [];
      for (let i = 0; i < N; i++) seeds.push([new T.Vector3(gauss(r), gauss(r) * 0.6, gauss(r)).normalize(), r()]);
      grp.add(flow);
      updaters.push((dt) => {
        for (let i = 0; i < N; i++) {
          const s = seeds[i]; s[1] -= dt * 0.06; if (s[1] < 0) s[1] += 1;
          const d = 0.5 + s[1] * 8, sw = s[1] * 2;
          pos.setXYZ(i, s[0].x * d + Math.sin(sw + i) * 0.3, s[0].y * d, s[0].z * d + Math.cos(sw + i) * 0.3);
        }
        pos.needsUpdate = true;
      });
      grp.add(glowSprite(new T.Color(1, 0.8, 0.5), 4, 0.7));
      if (o.kind === "super") {
        const mw = new T.Vector3(7.5, 0.5, 2); const m = glowSprite(new T.Color(1, 0.8, 0.45), 0.5, 1); m.position.copy(mw); grp.add(m);
        const l = textSprite("Voie lactée", "#f3c27a", 0.8); l.position.copy(mw).add(new T.Vector3(0.2, 0.3, 0)); grp.add(l);
      }
    }
    updaters.push((dt) => { grp.rotation.y += dt * 0.02; });
    return { dist: 22, minD: 5, maxD: 50, phi: 1.2 };
  };
  B.gcluster = function (o) {
    if (o.name === "Grand Mur de Sloan" || o.name === "Grand Attracteur") return B.web(o);
    const r = rng(seedOf(o.name));
    const grp = new T.Group(); scene.add(grp);
    // gaz chaud (rayons X)
    grp.add(cloud(450, (i, p) => { p.x = gauss(r) * 2.4; p.y = gauss(r) * 2; p.z = gauss(r) * 2.4; p.r = 0.05; p.g = 0.035; p.b = 0.11; p.s = 2 + r() * 2; }));
    // galaxies membres
    const ell = o.name !== "Superamas de Shapley";
    grp.add(cloud(1500, (i, p) => {
      const rr = Math.pow(r(), 1.6) * 8, th = r() * Math.PI * 2, ph = Math.acos(2 * r() - 1);
      p.x = rr * Math.sin(ph) * Math.cos(th); p.y = rr * Math.cos(ph) * 0.8; p.z = rr * Math.sin(ph) * Math.sin(th);
      const e = r() < (ell ? 0.7 : 0.4);
      p.r = e ? 1 : 0.6; p.g = e ? 0.82 : 0.75; p.b = e ? 0.55 : 1; p.s = 0.12 + Math.pow(r(), 6) * 0.6;
    }));
    grp.add(glowSprite(new T.Color(1, 0.85, 0.6), 2.5, 0.9));
    updaters.push((dt) => { grp.rotation.y += dt * 0.025; });
    return { dist: 18, minD: 4, maxD: 45, phi: 1.25 };
  };
  B.super = B.web;
  B.void = B.web;

  B.cmb = function () {
    const tex = cached("cmb", () => canvasTex(sphereTex(1024, 512, (x, y, z) => {
      const n = fbm(x * 5, y * 5, z * 5, 7) * 0.8 + fbm(x * 18, y * 18, z * 18, 3) * 0.5;
      ramp([[0, [10, 30, 140]], [0.3, [40, 110, 220]], [0.45, [140, 200, 240]], [0.55, [250, 240, 200]], [0.7, [250, 170, 60]], [1, [190, 30, 20]]], 0.5 + n * 1.05);
    })));
    const shell = new T.Mesh(new T.SphereGeometry(6, 128, 64, 0.3, Math.PI * 1.55), new T.MeshBasicMaterial({ map: tex, side: T.DoubleSide }));
    scene.add(shell);
    const { pts } = cosmicWeb(31, { R: 11, n: 30000, nodes: 70 });
    pts.scale.setScalar(0.48);
    scene.add(pts);
    const me = glowSprite(new T.Color(1, 0.8, 0.45), 0.4, 1); scene.add(me);
    const l = textSprite("Nous sommes au centre", "#f3c27a", 0.8); l.position.set(0.2, 0.25, 0); scene.add(l);
    const l2 = textSprite("Lumière émise 380 000 ans après le Big Bang", "#ffb090", 0.8); l2.position.set(-3, -6.8, 0); scene.add(l2);
    updaters.push((dt) => { shell.rotation.y += dt * 0.03; pts.rotation.y += dt * 0.03; });
    return { dist: 17, minD: 3, maxD: 40, phi: 1.3 };
  };

  function sunDot(size = 0.9) {
    const s = glowSprite(new T.Color(1, 0.85, 0.5), size, 1); scene.add(s);
    const s2 = glowSprite(new T.Color(1, 0.7, 0.3), size * 4, 0.35); scene.add(s2);
  }
  B.region = function (o) {
    const r = rng(seedOf(o.name));
    if (o.name === "Ceinture de Kuiper") {
      sunDot(0.6);
      [0.39, 0.72, 1, 1.52, 5.2, 9.5, 19.2, 30.1].forEach((a, i) => scene.add(orbitLine(a / 5, 0x8d97ad, i > 3 ? 0.4 : 0.2)));
      scene.add(cloud(16000, (i, p) => {
        const rr = (30 + Math.abs(gauss(r)) * 9 + r() * 6) / 5, a = r() * Math.PI * 2, inc = gauss(r) * 0.08;
        p.x = Math.cos(a) * rr; p.z = Math.sin(a) * rr; p.y = Math.sin(inc) * rr;
        p.r = 0.55; p.g = 0.62; p.b = 0.8; p.s = 0.05 + r() * 0.05;
      }));
      const pl = textSprite("Pluton", "#cdb8a0", 0.6); pl.position.set(7.9, 0.6, 0); scene.add(pl);
      const pm = glowSprite(new T.Color(0.9, 0.8, 0.7), 0.25, 1); pm.position.set(7.9, 0.5, 0); scene.add(pm);
      const nl = textSprite("Orbite de Neptune", "#8d97ad", 0.55); nl.position.set(0, 0, 6.1); scene.add(nl);
      return { dist: 20, minD: 4, maxD: 45, phi: 1.05 };
    }
    if (o.name === "Nuage d'Oort") {
      sunDot(0.5);
      scene.add(cloud(26000, (i, p) => {
        const inner = r() < 0.25;
        const rr = inner ? 1.5 + r() * 2.5 : 4 + Math.pow(r(), 0.7) * 7;
        const u = r() * 2 - 1, t = r() * Math.PI * 2, s = Math.sqrt(1 - u * u);
        p.x = rr * s * Math.cos(t); p.y = rr * u * (inner ? 0.35 : 1); p.z = rr * s * Math.sin(t);
        p.r = 0.7; p.g = 0.82; p.b = 1; p.s = 0.07 + r() * 0.07;
      }));
      const l1 = textSprite("Système solaire (planètes : point central)", "#f3c27a", 0.6); l1.position.set(0.3, 0.3, 0); scene.add(l1);
      const l2 = textSprite("Nuage de Hills (intérieur)", "#9fb3d9", 0.6); l2.position.set(2.5, 1.2, 0); scene.add(l2);
      return { dist: 26, minD: 4, maxD: 50, phi: 1.2 };
    }
    // Héliopause : bulle du vent solaire
    sunDot(0.5);
    const bubble = (rad, color, stretch, op) => {
      const m = new T.Mesh(new T.SphereGeometry(rad, 96, 48), new T.ShaderMaterial({
        uniforms: { color: { value: new T.Color(color) }, op: { value: op } },
        vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 w = modelMatrix*vec4(position,1.0); vN = normalize(mat3(modelMatrix)*normal); vV = normalize(cameraPosition-w.xyz); gl_Position = projectionMatrix*viewMatrix*w; }`,
        fragmentShader: `uniform vec3 color; uniform float op; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0-abs(dot(normalize(vN),normalize(vV))), 2.5); gl_FragColor = vec4(color*f*op, 1.0); }`,
        transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
      }));
      m.scale.set(1, 1, stretch); m.position.z = rad * (stretch - 1) * 0.5;
      scene.add(m);
      return m;
    };
    bubble(2.6, "#6fb8ff", 1.15, 0.6);
    bubble(3.6, "#f3c27a", 1.7, 0.7);
    const l1 = textSprite("Choc terminal (~90 UA)", "#6fb8ff", 0.6); l1.position.set(0, 2.7, 0); scene.add(l1);
    const l2 = textSprite("Héliopause (~120 UA)", "#f3c27a", 0.6); l2.position.set(0, 3.75, 0); scene.add(l2);
    [["Voyager 1", new T.Vector3(-0.55, 0.5, -1).normalize().multiplyScalar(4.9)], ["Voyager 2", new T.Vector3(-0.7, -0.6, -0.9).normalize().multiplyScalar(4.1)]].forEach(([n, p]) => {
      const line = new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(), p]), new T.LineDashedMaterial({ color: 0xf3c27a, dashSize: 0.12, gapSize: 0.1, transparent: true, opacity: 0.7 }));
      line.computeLineDistances(); scene.add(line);
      const m = glowSprite(new T.Color(1, 0.8, 0.5), 0.3, 1); m.position.copy(p); scene.add(m);
      const l = textSprite(n, "#f3c27a", 0.6); l.position.copy(p).add(new T.Vector3(0.15, 0.15, 0)); scene.add(l);
    });
    // vent solaire (sortant) et vent interstellaire (de face)
    const N = 3000, wind = cloud(N, (i, p) => { p.r = 0.6; p.g = 0.8; p.b = 1; p.s = 0.04; });
    const wpos = wind.geometry.attributes.position, dirs = [], lf = new Float32Array(N).map(() => r());
    for (let i = 0; i < N; i++) { const u = r() * 2 - 1, t = r() * Math.PI * 2, s = Math.sqrt(1 - u * u); dirs.push([s * Math.cos(t), u, s * Math.sin(t)]); }
    scene.add(wind);
    const M = 2500, ism = cloud(M, (i, p) => { p.r = 0.9; p.g = 0.75; p.b = 0.5; p.s = 0.05; });
    const ipos = ism.geometry.attributes.position, iy = new Float32Array(M * 2).map(() => (r() * 2 - 1) * 9), il = new Float32Array(M).map(() => r());
    scene.add(ism);
    updaters.push((dt) => {
      for (let i = 0; i < N; i++) {
        lf[i] += dt * 0.35; if (lf[i] > 1) lf[i] -= 1;
        const d = 0.3 + lf[i] * 2.3; wpos.setXYZ(i, dirs[i][0] * d, dirs[i][1] * d, dirs[i][2] * d);
      }
      for (let i = 0; i < M; i++) {
        il[i] += dt * 0.05; if (il[i] > 1) il[i] -= 1;
        let x = iy[i * 2], y = iy[i * 2 + 1], z = -10 + il[i] * 20;
        // contourne la bulle
        const front = Math.hypot(x, y), R = 3.9 * (z < 0 ? 1 : 1 + z * 0.12);
        if (front < R && z > -6) { const k = R / Math.max(front, 0.01); x *= k; y *= k; }
        ipos.setXYZ(i, x, y, z);
      }
      wpos.needsUpdate = true; ipos.needsUpdate = true;
    });
    return { dist: 14, minD: 4, maxD: 40, phi: 1.2, theta: 2.2 };
  };

  B.probe = function (o) {
    if (o.model === "jwst") return buildJWST();
    const sunDir = new T.Vector3(-0.4, 0.3, 1).normalize();
    const l = sunLight(sunDir); l.intensity = 1.9;
    scene.add(new T.HemisphereLight(0x8899bb, 0x111118, 0.4));
    const v = new T.Group(); scene.add(v);
    const metal = new T.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.6, roughness: 0.4 });
    const white = new T.MeshStandardMaterial({ color: 0xf2f2ee, metalness: 0.1, roughness: 0.6, side: T.DoubleSide });
    const dark = new T.MeshStandardMaterial({ color: 0x2a2a30, metalness: 0.5, roughness: 0.6 });
    const gold = new T.MeshStandardMaterial({ color: 0xd8a940, metalness: 0.9, roughness: 0.3, emissive: 0x3a2808 });
    // corps décagonal
    const bus = new T.Mesh(new T.CylinderGeometry(0.9, 0.9, 0.45, 10), metal); v.add(bus);
    // antenne grand gain (3,7 m)
    const R = 2.6, dish = new T.Mesh(new T.SphereGeometry(R, 64, 16, 0, Math.PI * 2, 0, 0.72), white);
    dish.rotation.x = Math.PI; dish.position.y = R + 0.3; v.add(dish);
    const feed = new T.Mesh(new T.CylinderGeometry(0.08, 0.12, 0.9, 12), metal); feed.position.y = 1.0; v.add(feed);
    for (let i = 0; i < 3; i++) {
      const a = i * Math.PI * 2 / 3, s = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 1.25, 6), metal);
      s.position.set(Math.cos(a) * 0.45, 0.95, Math.sin(a) * 0.45); s.lookAt(0, 1.45, 0); s.rotateX(Math.PI / 2); v.add(s);
    }
    // perche des RTG (générateurs nucléaires)
    const boomR = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, 3.4, 8), metal);
    boomR.rotation.z = Math.PI / 2; boomR.position.set(2.5, -0.1, 0); v.add(boomR);
    for (let i = 0; i < 3; i++) {
      const rtg = new T.Mesh(new T.CylinderGeometry(0.18, 0.18, 0.5, 12), dark);
      rtg.rotation.z = Math.PI / 2; rtg.position.set(2.6 + i * 0.55, -0.1, 0); v.add(rtg);
      for (let f = 0; f < 6; f++) {
        const fin = new T.Mesh(new T.BoxGeometry(0.45, 0.02, 0.5), dark);
        fin.position.copy(rtg.position); fin.rotation.x = f * Math.PI / 6; v.add(fin);
      }
    }
    // perche scientifique et plateforme des caméras
    const boomS = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 2.6, 8), metal);
    boomS.rotation.z = Math.PI / 2; boomS.position.set(-2.1, 0.1, 0.1); v.add(boomS);
    const plat = new T.Mesh(new T.BoxGeometry(0.5, 0.45, 0.45), dark); plat.position.set(-3.4, 0.1, 0.1); v.add(plat);
    const cam1 = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 0.6, 12), metal); cam1.rotation.x = Math.PI / 2; cam1.position.set(-3.4, 0.25, 0.5); v.add(cam1);
    const cam2 = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 0.4, 12), metal); cam2.rotation.x = Math.PI / 2; cam2.position.set(-3.2, -0.05, 0.45); v.add(cam2);
    // magnétomètre (13 m, raccourci)
    const mag = new T.Mesh(new T.CylinderGeometry(0.015, 0.015, 7, 6), metal);
    mag.rotation.z = Math.PI / 2 - 0.25; mag.rotation.y = 0.9; mag.position.set(-1.5, 0.5, -2.6); v.add(mag);
    // antennes radio
    [[0.6, 1.2], [-0.6, 1.6]].forEach(([a, b]) => { const w = new T.Mesh(new T.CylinderGeometry(0.008, 0.008, 6, 4), metal); w.position.set(0, -2.2, 0); w.rotation.set(a * 0.4, 0, b * 0.15); v.add(w); });
    // disque d'or
    const rec = new T.Mesh(new T.CylinderGeometry(0.3, 0.3, 0.03, 40), gold);
    rec.rotation.z = Math.PI / 2; rec.position.set(0.91, 0, 0.3); rec.rotation.y = -0.31; v.add(rec);
    const rl = textSprite("Disque d'or", "#f3c27a", 0.5); rl.position.set(1.05, -0.45, 0.6); v.add(rl);
    // le Soleil, minuscule au loin
    const sun = glowSprite(new T.Color(1, 0.9, 0.7), 3, 1); sun.position.copy(sunDir).multiplyScalar(200); scene.add(sun);
    const sl = textSprite("Soleil (à 23 heures-lumière)", "#ffd88a", 6); sl.position.copy(sun.position).add(new T.Vector3(3, 2, 0)); scene.add(sl);
    v.rotation.set(0.25, 0.4, 0.1);
    ctx3.sunDir = sunDir;
    updaters.push((dt) => { v.rotation.y += dt * 0.04; });
    return { dist: 11, minD: 4, maxD: 30, phi: 1.3 };
  };

  /* Télescope spatial James Webb */
  function buildJWST() {
    const sunDir = new T.Vector3(0.2, -1, 0.35).normalize();
    const l = sunLight(sunDir); l.intensity = 1.6;
    scene.add(new T.HemisphereLight(0x9aa8c8, 0x1a1420, 0.5));
    const fill = new T.DirectionalLight(0xbfd0ff, 0.5); fill.position.set(-5, 8, 10); scene.add(fill);
    const jw = new T.Group(); scene.add(jw);
    const gold = new T.MeshStandardMaterial({ color: 0xf5c451, metalness: 0.35, roughness: 0.28, emissive: 0x6a4300, emissiveIntensity: 0.55 });
    const dark = new T.MeshStandardMaterial({ color: 0x23242c, metalness: 0.6, roughness: 0.5 });
    const strut = new T.MeshStandardMaterial({ color: 0x40424c, metalness: 0.5, roughness: 0.4 });
    // 18 segments hexagonaux de béryllium doré (1,32 m chacun)
    const mirror = new T.Group(); mirror.position.set(0, 2.2, 0); mirror.rotation.x = -0.18; jw.add(mirror);
    const hexR = 0.66, hexGeo = new T.CylinderGeometry(hexR * 0.97, hexR * 0.97, 0.06, 6);
    const cells = [];
    for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) {
      const s3 = -q - r;
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s3)) > 2 || (q === 0 && r === 0)) continue;
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s3)) === 2 && (Math.abs(q) === 2 && Math.abs(r) === 0 || Math.abs(r) === 2 && Math.abs(s3) === 0 || Math.abs(s3) === 2 && Math.abs(q) === 0)) cells.push([q, r]);
      else if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s3)) === 1) cells.push([q, r]);
      else if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s3)) === 2) cells.push([q, r]);
    }
    cells.slice(0, 18).forEach(([q, r]) => {
      const x = hexR * Math.sqrt(3) * (q + r / 2), y = hexR * 1.5 * r;
      const h = new T.Mesh(hexGeo, gold);
      h.rotation.x = Math.PI / 2; h.rotation.y = Math.PI / 6;
      const curv = (x * x + y * y) * 0.03;
      h.position.set(x, y, curv);
      h.lookAt(0, 0, 12);
      h.rotateX(Math.PI / 2);
      mirror.add(h);
    });
    // miroir secondaire sur son trépied
    const sec = new T.Mesh(new T.CylinderGeometry(0.37, 0.37, 0.05, 24), gold); sec.rotation.x = Math.PI / 2; sec.position.set(0, 0, 3.6); mirror.add(sec);
    [[0, 3.1], [-2.6, -1.5], [2.6, -1.5]].forEach(([x, y]) => {
      const a = V(x, y, 0.1), b = V(0, 0, 3.6), len = a.distanceTo(b);
      const m = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, len, 6), strut);
      m.position.copy(a).add(b).multiplyScalar(0.5); m.lookAt(b); m.rotateX(Math.PI / 2); mirror.add(m);
    });
    const back = new T.Mesh(new T.BoxGeometry(1.2, 1.6, 0.6), dark); back.position.set(0, 0, -0.5); mirror.add(back);
    // pare-soleil : 5 couches de Kapton, 21 × 14 m
    const shape = new T.Shape();
    [[-7, 0], [-3.4, 3.3], [3.4, 3.3], [7, 0], [3.4, -3.3], [-3.4, -3.3]].forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
    const shieldGeo = new T.ShapeGeometry(shape);
    for (let i = 0; i < 5; i++) {
      const m = new T.Mesh(shieldGeo, new T.MeshStandardMaterial({ color: i === 0 ? 0xe2cce8 : 0xcbbcd8, metalness: 0.3, roughness: 0.38, side: T.DoubleSide, emissive: 0x1c1024 }));
      m.rotation.x = -Math.PI / 2; m.position.y = -0.2 - i * 0.18; m.scale.set(1 - i * 0.025, 1 - i * 0.03, 1);
      jw.add(m);
    }
    // bus et panneau solaire, côté chaud
    const bus = new T.Mesh(new T.BoxGeometry(1.6, 0.9, 1.6), dark); bus.position.y = -1.6; jw.add(bus);
    const panel = new T.Mesh(new T.BoxGeometry(2.6, 0.04, 1.1), new T.MeshStandardMaterial({ color: 0x1a2a5a, metalness: 0.7, roughness: 0.3, emissive: 0x050a20 }));
    panel.position.set(0, -2.1, -1.9); panel.rotation.x = 0.3; jw.add(panel);
    const tower = new T.Mesh(new T.CylinderGeometry(0.12, 0.12, 2.2, 8), strut); tower.position.y = 0.9; jw.add(tower);
    const lab = textSprite("Miroir primaire · 6,5 m", "#f2c14e", 0.8, true); lab.position.set(2.4, 3.4, 0); jw.add(lab);
    const lab2 = textSprite("Pare-soleil · 5 couches", "#d8c0e8", 0.8, true); lab2.position.set(6, -0.4, 1); jw.add(lab2);
    jw.rotation.set(0.15, 0.6, 0);
    updaters.push((dt) => { jw.rotation.y += dt * 0.05; });
    // Terre et Soleil au loin (L2 : à l'opposé du Soleil)
    const sun = glowSprite(new T.Color(1, 0.92, 0.75), 6, 1); sun.position.copy(sunDir).multiplyScalar(-1).multiplyScalar(-400); scene.add(sun);
    ctx3.sunDir = sunDir;
    return { dist: 19, minD: 7, maxD: 50, phi: 1.2, theta: 0.4, bloom: [0.6, 0.4, 0.7] };
  }

  /* ---------------------------------------------------------------------
     Comparaison des tailles
     --------------------------------------------------------------------- */
  // Rayons en rayons solaires
  const STAR_R = {
    "Proxima du Centaure": 0.154, "Alpha du Centaure A et B": 1.22, "Étoile de Barnard": 0.196, "Wolf 359": 0.16, Sirius: 1.71,
    "Epsilon Eridani": 0.74, "Tau Ceti": 0.79, "Altaïr": 1.8, "Véga": 2.36, Arcturus: 25.4, "TRAPPIST-1": 0.12, Capella: 12,
    "Aldébaran": 44, "Régulus": 3.1, Polaris: 37.5, "Bételgeuse": 764, "Antarès": 680, Rigel: 79, Deneb: 203, "Kepler-452": 1.11,
  };
  const SUN_KM = 696000;
  function sunBall(r) {
    const g = new T.Group();
    g.add(new T.Mesh(new T.SphereGeometry(r, 48, 24), new T.MeshBasicMaterial({ color: 0xffd27a, toneMapped: false })));
    g.add(glowSprite(new T.Color(1, 0.8, 0.45), r * 4, 0.6));
    return g;
  }
  function ghostEarth(r) {
    const t = TEX.earthDay ? cached("earthDay", () => imgTex(TEX.earthDay)) : null;
    return new T.Mesh(new T.SphereGeometry(r, 48, 24), new T.MeshStandardMaterial({ map: t, color: t ? 0xffffff : 0x3366cc, roughness: 0.8 }));
  }
  function ringAt(r, color, label, ang) {
    const g = new T.Group();
    const l = orbitLine(r, color, 0.9); l.material.depthTest = false; l.renderOrder = 9; g.add(l);
    const t = textSprite(label, "#" + new T.Color(color).getHexString(), 0.8, true); t.position.set(r * Math.cos(ang), 0, r * Math.sin(ang)); g.add(t);
    return g;
  }
  // Renvoie { group, extent } ou null
  function buildCompare(o) {
    const g = new T.Group();
    let extent = 3;
    const side = (r, obj, label, color) => {
      obj.position.set(1 + 0.5 + r, 0, 0); g.add(obj);
      const t = textSprite(label, color, 0.85, true); t.position.set(1 + 0.5 + r, -Math.max(r, 0.05) - 0.12, 0); g.add(t);
      extent = Math.max(extent, (1.5 + 2 * r) * 1.4);
    };
    if (o.kind === "planet") {
      const rkm = o.r / (1 / 9.4607e12);
      if (o.name === "Terre") side(1737 / 6371, new T.Mesh(new T.SphereGeometry(1737 / 6371, 48, 24), new T.MeshStandardMaterial({ map: TEX.moon ? cached("moonTex", () => imgTex(TEX.moon)) : null })), "Lune (à l'échelle)", "#c9c9c4");
      else side(6371 / rkm, ghostEarth(6371 / rkm), "Terre (à l'échelle)", "#6fa8ff");
    } else if (o.kind === "sun") {
      g.add(new T.PointLight(0xfff0d0, 2.5, 0, 2)); g.add(new T.AmbientLight(0x404858, 0.5));
      side(6371 / SUN_KM, ghostEarth(6371 / SUN_KM), "Terre", "#6fa8ff");
      const jr = 69911 / SUN_KM, j = miniPlanet("#d9b48a", 2, jr); j.position.set(1.5 + jr, 0.35, 0); g.add(j);
      const jl = textSprite("Jupiter", "#d9b48a", 0.85, true); jl.position.set(1.5 + jr * 2.2, 0.35, 0); g.add(jl);
    } else if (o.kind === "star" && STAR_R[o.name]) {
      const R = STAR_R[o.name], rs = 1 / R;
      if (rs > 0.02) side(rs, sunBall(rs), "Soleil (à l'échelle)", "#ffd27a");
      else {
        const m = glowSprite(new T.Color(1, 0.85, 0.5), 0.06, 1); m.position.set(1.6, 0, 0); g.add(m);
        const t = textSprite(`Soleil : 1/${Math.round(R)} de son rayon, un point`, "#ffd27a", 0.85, true); t.position.set(1.66, 0.04, 0); g.add(t);
      }
      if (R > 100) {
        // orbites planétaires à l'échelle de l'étoile (1 UA = 215 rayons solaires)
        const rings = new T.Group(); rings.rotation.x = 0.75; g.add(rings);
        rings.add(ringAt(215 / R, 0x6fa8ff, "Orbite de la Terre", -0.9));
        rings.add(ringAt(327 / R, 0xe0754a, "Orbite de Mars", 2.3));
        if (1118 / R < 3) rings.add(ringAt(1118 / R, 0xd9b48a, "Orbite de Jupiter", 0.4));
      }
    } else return null;
    scene.add(g);
    return { group: g, extent };
  }

  /* ---------------------------------------------------------------------
     Ciel : bande de la Voie lactée générée, et Soleil lointain
     --------------------------------------------------------------------- */
  let ctx3 = {};
  function skySphere() {
    const tex = cached("sky", () => {
      const pole = new T.Vector3(0.35, 0.86, -0.37).normalize(), core = new T.Vector3(-0.8, 0.3, 0.52).normalize();
      core.addScaledVector(pole, -core.dot(pole)).normalize();
      const d = new T.Vector3();
      return canvasTex(sphereTex(1024, 512, (x, y, z) => {
        d.set(x, y, z);
        const b = d.dot(pole), c = d.dot(core);
        const n = fbm(x * 3 + 7, y * 3, z * 3, 5), dust = fbm(x * 7, y * 7 + 3, z * 7, 4);
        const band = Math.exp(-Math.pow(b / (0.13 + 0.05 * n), 2)) * (0.55 + 0.45 * c * c * (c > 0 ? 1 : 0.4));
        let v = band * (0.55 + 0.6 * n) - Math.max(0, dust + 0.05) * Math.exp(-Math.pow(b / 0.05, 2)) * 1.1;
        v = Math.max(0, v);
        const warm = Math.max(0, c);
        v *= 0.6;
        C[0] = Math.min(255, 3 + v * (120 + 70 * warm)); C[1] = Math.min(255, 4 + v * (105 + 40 * warm)); C[2] = Math.min(255, 9 + v * (130 - 30 * warm));
        // nébuleuses lointaines
        const neb = fbm(x * 1.6 + 2, y * 1.6, z * 1.6 + 9, 4);
        if (neb > 0.2) { const k = (neb - 0.2) * 35; C[0] += k * 0.9; C[2] += k * 0.6; }
      }));
    });
    const m = new T.Mesh(new T.SphereGeometry(900, 64, 32), new T.MeshBasicMaterial({ map: tex, side: T.BackSide, depthWrite: false, toneMapped: false }));
    m.renderOrder = -2;
    return m;
  }
  function distantSun(dir) {
    const p = dir.clone().multiplyScalar(500);
    const a = glowSprite(new T.Color(1, 0.95, 0.85), 14, 1); a.position.copy(p); scene.add(a);
    const b = glowSprite(new T.Color(1, 0.75, 0.45), 60, 0.35); b.position.copy(p); scene.add(b);
  }

  /* ---------------------------------------------------------------------
     Champs magnétiques
     --------------------------------------------------------------------- */
  U.ff = { value: 0 };   // fondu d'apparition du champ
  function fieldMaterial(colA, colB, opts = {}) {
    const m = new T.ShaderMaterial({
      uniforms: {
        time: { value: 0 }, colA: { value: new T.Color(colA) }, colB: { value: new T.Color(colB) },
        speed: { value: opts.speed ?? 1 }, op: { value: opts.opacity ?? 1 }, dens: { value: opts.dens ?? 4 }, ff: U.ff,
      },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `
        uniform float time; uniform vec3 colA; uniform vec3 colB; uniform float speed; uniform float op; uniform float dens; uniform float ff;
        varying vec2 vUv;
        void main(){
          float t = vUv.x, ph = vUv.y;
          float s = fract(t * dens - time * speed * 0.22 + ph);
          float pulse = pow(smoothstep(0.0, 0.9, s) * (1.0 - smoothstep(0.9, 1.0, s)), 4.0);
          vec3 c = mix(colA, colB, abs(t * 2.0 - 1.0));
          float fade = smoothstep(0.0, 0.03, t) * smoothstep(1.0, 0.97, t);
          float reveal = smoothstep(ph * 0.3, ph * 0.3 + 0.7, ff * 1.0);
          gl_FragColor = vec4(c * (0.14 + 1.25 * pulse) * op * fade * reveal, 1.0);
        }`,
      transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
    });
    updaters.push((dt, t) => { m.uniforms.time.value = t; });
    return m;
  }
  function fluxTube(points, radius, mat, phase, segs) {
    const g = new T.TubeGeometry(new T.CatmullRomCurve3(points), segs || Math.min(200, points.length * 2), radius, 5, false);
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setY(i, phase);
    const m = new T.Mesh(g, mat); m.frustumCulled = false;
    return m;
  }
  const V = (x, y, z) => new T.Vector3(x, y, z);
  // Ligne de champ dipolaire r = L cos²λ, axe magnétique = y
  function dipolePts(L, phi, n = 90, rMin = 1) {
    const lm = Math.acos(Math.sqrt(Math.min(1, rMin / L))), pts = [];
    for (let i = 0; i < n; i++) {
      const lam = -lm + 2 * lm * i / (n - 1), r = L * Math.cos(lam) ** 2;
      pts.push(V(r * Math.cos(lam) * Math.cos(phi), r * Math.sin(lam), r * Math.cos(lam) * Math.sin(phi)));
    }
    return pts;
  }
  // Compression côté jour, étirement côté nuit (vent solaire venant de s)
  function windDeform(p, s, k) {
    const d = p.dot(s);
    const nd = d > 0 ? d / (1 + k * d) : d * (1 + 0.55 * k * -d);
    return p.addScaledVector(s, nd - d);
  }
  function fieldCloud(n, f) { const c = cloud(n, f); c.material.uniforms.opacity = U.ff; return c; }

  // Magnétosphère complète : lignes fermées, queue, ceintures, ovale auroral, onde de choc, vent solaire
  function magnetosphere(grp, s, o) {
    const mat = fieldMaterial(o.colA, o.colB, { dens: o.dens || 3, speed: o.speed || 1, opacity: o.opacity ?? 0.85 });
    const tailMat = fieldMaterial(o.colB, o.colA, { dens: 2.5, speed: 1.4, opacity: (o.opacity ?? 0.85) * 0.8 });
    const up = V(0, 1, 0), side = new T.Vector3().crossVectors(up, s).normalize();
    const r = rng(o.seed || 1);
    for (let i = 0; i < o.nPhi; i++) {
      const phi = i / o.nPhi * Math.PI * 2 + 0.11;
      const h = V(Math.cos(phi), 0, Math.sin(phi)), night = h.dot(s);
      o.Ls.forEach((L, j) => {
        if (o.tailFrom && L >= o.tailFrom && night < -0.2) {
          // lignes ouvertes de la queue magnétique
          for (const sg of [1, -1]) {
            const lm = Math.acos(Math.sqrt(1 / L)), pts = [];
            for (let k = 0; k < 14; k++) {
              const lam = sg * (lm - (lm - 0.95) * k / 13), rr = L * Math.cos(lam) ** 2;
              pts.push(windDeform(V(rr * Math.cos(lam) * Math.cos(phi), rr * Math.sin(lam), rr * Math.cos(lam) * Math.sin(phi)), s, o.k));
            }
            const last = pts[pts.length - 1], sc = o.tailScale || 1, lat = h.dot(side);
            [0.25, 0.5, 0.75, 1].forEach((f, k) => {
              const d = o.tailLen * f;
              pts.push(V(0, 0, 0).addScaledVector(s, -(Math.max(0, -last.dot(s)) + d)).addScaledVector(up, sg * (Math.abs(last.y) * (1 - f) + (o.tailH || 2.2) * sc * f)).addScaledVector(side, lat * (o.tailW || 3) * sc * (0.5 + f * 0.6)));
            });
            grp.add(fluxTube(pts, o.radius * 0.8, tailMat, r(), 120));
          }
        } else {
          const pts = dipolePts(L, phi, 90, 1.003).map((p) => windDeform(p, s, o.k));
          grp.add(fluxTube(pts, o.radius * (L > 6 ? 1.1 : 1), mat, (j * 0.37 + i * 0.13) % 1, 140));
        }
      });
    }
    if (o.belts) {
      grp.add(fieldCloud(9000, (i, p) => {
        const inner = i < 3500, L = inner ? 1.25 + Math.abs(gauss(r)) * 0.55 : 3 + Math.abs(gauss(r)) * 1.6;
        const lam = gauss(r) * (inner ? 0.28 : 0.38), phi = r() * Math.PI * 2, rr = L * Math.cos(lam) ** 2;
        const q = windDeform(V(rr * Math.cos(lam) * Math.cos(phi), rr * Math.sin(lam), rr * Math.cos(lam) * Math.sin(phi)), s, o.k);
        p.x = q.x; p.y = q.y; p.z = q.z;
        if (inner) { p.r = 0.1; p.g = 0.045; p.b = 0.03; } else { p.r = 0.03; p.g = 0.08; p.b = 0.16; }
        p.s = 0.16 + r() * 0.18;
      }));
    }
    if (o.aurora) for (const sg of [1, -1]) grp.add(auroraOval(o.aurora.colat, s, sg, o.aurora));
    if (o.shock) bowShock(grp, s, o.shock);
  }

  function auroraOval(colat, s, sign, o) {
    const N = 360, pos = [], uvs = [], night = [], idx = [];
    const nightAz = Math.atan2(-s.z, -s.x);
    for (let i = 0; i <= N; i++) {
      const a = i / N * Math.PI * 2, nf = Math.cos(a - nightAz);
      const c = colat * (1 + 0.28 * nf) + 0.012 * Math.sin(a * 7 + 1) + 0.008 * Math.sin(a * 17);
      const dir = V(Math.sin(c) * Math.cos(a), sign * Math.cos(c), Math.sin(c) * Math.sin(a));
      const h = (o.height || 0.06) * (1 + 0.6 * Math.max(0, nf));
      const b = dir.clone().multiplyScalar(1.008), t = dir.clone().multiplyScalar(1.008 + h);
      pos.push(b.x, b.y, b.z, t.x, t.y, t.z);
      uvs.push(i / N, 0, i / N, 1);
      night.push(nf, nf);
      if (i < N) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
    g.setAttribute("night", new T.Float32BufferAttribute(night, 1));
    g.setIndex(idx);
    const m = new T.ShaderMaterial({
      uniforms: { time: { value: 0 }, low: { value: new T.Color(o.low || "#38ff8a") }, high: { value: new T.Color(o.high || "#d4389a") }, ff: U.ff, gain: { value: o.gain || 1 } },
      vertexShader: `attribute float night; varying vec2 vUv; varying float vN; void main(){ vUv = uv; vN = night; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: SNOISE + `
        uniform float time; uniform vec3 low; uniform vec3 high; uniform float ff; uniform float gain;
        varying vec2 vUv; varying float vN;
        void main(){
          float x = vUv.x, v = vUv.y;
          float n = snoise(vec3(x * 38.0, time * 0.25, 1.0)) * 0.5 + 0.5;
          float rays = pow(snoise(vec3(x * 220.0, time * 0.9, 4.0)) * 0.5 + 0.5, 2.5);
          float fold = snoise(vec3(x * 9.0, time * 0.12, 8.0)) * 0.5 + 0.5;
          vec3 c = mix(low, high, smoothstep(0.3, 1.0, v));
          float a = pow(1.0 - v, 1.4) * smoothstep(0.0, 0.1, v) * (0.35 + 0.9 * n * fold) * (0.45 + 1.2 * rays);
          a *= 0.35 + 0.9 * smoothstep(-0.6, 0.8, vN);
          gl_FragColor = vec4(c * a * 1.8 * gain * ff, 1.0);
        }`,
      transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
    });
    updaters.push((dt, t) => { m.uniforms.time.value = t; });
    return new T.Mesh(g, m);
  }

  function bowShock(grp, s, o) {
    const pts = [];
    for (let i = 0; i <= 40; i++) { const rho = i / 40 * o.width; pts.push(new T.Vector2(rho, o.nose - rho * rho / (2 * o.a))); }
    const m = new T.Mesh(new T.LatheGeometry(pts, 96), new T.ShaderMaterial({
      uniforms: { color: { value: new T.Color(o.color || "#7fc8ff") }, ff: U.ff },
      vertexShader: `varying vec3 vN; varying vec3 vV; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform vec3 color; uniform float ff; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 3.0); gl_FragColor = vec4(color * f * 0.16 * ff, 1.0); }`,
      transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
    }));
    m.quaternion.setFromUnitVectors(V(0, 1, 0), s);
    grp.add(m);
    // particules du vent solaire, déviées par l'onde de choc
    const N = 2200, r = rng(17), e1 = new T.Vector3().crossVectors(s, V(0, 1, 0.001)).normalize(), e2 = new T.Vector3().crossVectors(s, e1);
    const wind = fieldCloud(N, (i, p) => { p.r = 0.55; p.g = 0.45; p.b = 0.25; p.s = 0.14; });
    const pos = wind.geometry.attributes.position, seeds = [];
    for (let i = 0; i < N; i++) seeds.push([Math.sqrt(r()) * o.width * 1.1, r() * Math.PI * 2, r()]);
    grp.add(wind);
    const mp = o.mp, a2 = o.a * 0.8, q = new T.Vector3();
    updaters.push((dt) => {
      for (let i = 0; i < N; i++) {
        const sd = seeds[i]; sd[2] += dt * 0.07; if (sd[2] > 1) sd[2] -= 1;
        const x = o.nose * 2.2 - sd[2] * o.nose * 6;
        let rho = sd[0];
        const xm = mp - rho * rho / (2 * a2);
        if (x < xm) rho = Math.sqrt(Math.max(rho * rho, 2 * a2 * (mp - x)));
        q.copy(s).multiplyScalar(x).addScaledVector(e1, rho * Math.cos(sd[1])).addScaledVector(e2, rho * Math.sin(sd[1]));
        pos.setXYZ(i, q.x, q.y, q.z);
      }
      pos.needsUpdate = true;
    });
  }

  // Petites boucles ancrées à la surface (taches, croûte magnétisée…)
  function surfaceLoop(center, tangent, sep, h, R) {
    const axis = new T.Vector3().crossVectors(center, tangent).normalize(), pts = [];
    for (let i = 0; i <= 28; i++) {
      const t = i / 28, dir = center.clone().applyAxisAngle(axis, (t - 0.5) * sep);
      pts.push(dir.multiplyScalar(R * (1 + h * Math.sin(Math.PI * t))));
    }
    return pts;
  }
  function randDir(r, latMin, latMax, lonMin = 0, lonMax = Math.PI * 2) {
    const lat = (latMin + (latMax - latMin) * r()) * (r() < 0.5 && latMin >= 0 ? -1 : 1), lon = lonMin + (lonMax - lonMin) * r();
    return V(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon));
  }
  function coronalField(grp, R, o) {
    const r = rng(o.seed || 5);
    const loopMat = fieldMaterial(o.colA, o.colB, { dens: 2, speed: 1.6 });
    for (let i = 0; i < o.loops; i++) {
      const c = randDir(r, 0.12, 0.6), tg = new T.Vector3(gauss(r), gauss(r), gauss(r)).cross(c).normalize();
      const nest = 1 + ((r() * 3) | 0);
      const sep0 = 0.06 + r() * 0.22;
      for (let k = 0; k < nest; k++) {
        const sep = sep0 * (1 + k * 0.35);
        grp.add(fluxTube(surfaceLoop(c, tg, sep, sep * (0.9 + r() * 0.8), R * 1.002), R * (0.004 + r() * 0.006), loopMat, r(), 60));
      }
    }
    // grande échelle : casques fermés et lignes ouvertes aux pôles
    const bigMat = fieldMaterial(o.colB, o.colC || o.colB, { dens: 2, speed: 0.8, opacity: 0.7 });
    for (let i = 0; i < 14; i++) {
      const phi = i / 14 * Math.PI * 2;
      [1.6, 2.4, 3.4].forEach((L, j) => {
        const pts = dipolePts(L, phi + j * 0.2, 80, 1).map((p) => p.multiplyScalar(R));
        grp.add(fluxTube(pts, R * 0.006, bigMat, (i * 0.3 + j * 0.2) % 1, 100));
      });
    }
    const openMat = fieldMaterial(o.colB, o.colC || o.colA, { dens: 3, speed: 2, opacity: 0.6 });
    for (let i = 0; i < 26; i++) {
      const sg = i % 2 ? 1 : -1, lat = (0.95 + r() * 0.5) * 1.0, lon = r() * Math.PI * 2, pts = [];
      const colat = Math.PI / 2 - lat * 0.9;
      for (let k = 0; k < 20; k++) {
        const d = 1 + k * 0.28, c = colat * (1 + k * 0.06);
        pts.push(V(Math.sin(c) * Math.cos(lon), sg * Math.cos(c), Math.sin(c) * Math.sin(lon)).multiplyScalar(R * d));
      }
      grp.add(fluxTube(pts, R * 0.005, openMat, r(), 60));
    }
  }

  function helicalJets(grp, o) {
    const mat = fieldMaterial(o.colA, o.colB, { dens: 3, speed: 2.2 });
    const r = rng(3);
    for (let i = 0; i < o.n; i++) {
      const r0 = o.r0 + r() * o.r1, a0 = r() * Math.PI * 2;
      for (const sg of [1, -1]) {
        const pts = [];
        for (let k = 0; k <= 60; k++) {
          const t = k / 60, rad = r0 * (1 - 0.82 * Math.sqrt(t)) + 0.4, ang = a0 + sg * t * o.turns * Math.PI * 2;
          pts.push(V(Math.cos(ang) * rad, sg * (0.2 + t * o.h), Math.sin(ang) * rad));
        }
        grp.add(fluxTube(pts, o.w, mat, r(), 180));
      }
    }
  }

  const FIELD_TXT = {
    Terre: ["Champ magnétique terrestre", "Produit par le fer liquide du noyau (effet dynamo). Il dévie le vent solaire, piège des particules dans les ceintures de Van Allen et dessine les aurores polaires. Côté nuit, il s'étire en une queue de plus d'un million de km."],
    Soleil: ["Champ magnétique solaire", "Le plasma suit les lignes de champ : boucles coronales, casques et lignes ouvertes d'où s'échappe le vent solaire. En se tordant puis en se reconnectant, elles déclenchent les éruptions. Le champ s'inverse tous les 11 ans."],
    Jupiter: ["Magnétosphère de Jupiter", "20 000 fois plus puissante que celle de la Terre. Si on pouvait la voir, elle paraîtrait plus grande que la pleine Lune dans notre ciel. Le volcan Io la remplit de soufre (le tore orange) et laisse une trace dans les aurores."],
    Saturne: ["Magnétosphère de Saturne", "Son axe magnétique est aligné avec l'axe de rotation à moins de 0,1° près, un cas unique. Les geysers d'Encelade alimentent son plasma ; ses aurores brillent surtout en ultraviolet."],
    Uranus: ["Champ magnétique d'Uranus", "Incliné de 59° par rapport à l'axe de rotation et décentré : la magnétosphère culbute à chaque rotation, en 17 heures."],
    Neptune: ["Champ magnétique de Neptune", "Incliné de 47° et décalé de plus de la moitié du rayon : sans doute produit dans une couche d'eau et d'ammoniac, et non dans le noyau."],
    Mercure: ["Champ magnétique de Mercure", "Faible (1 % de celui de la Terre) et décalé vers le nord. Si près du Soleil, la magnétosphère est écrasée à quelques centaines de km du sol côté jour."],
    Mars: ["Magnétisme fossile de Mars", "Mars a perdu son champ global il y a environ 4 milliards d'années. Il reste des roches aimantées dans la croûte de l'hémisphère sud, qui forment de petites « mini-magnétosphères »."],
    Vénus: ["Magnétosphère induite de Vénus", "Vénus n'a pas de champ propre. Le champ du vent solaire s'enroule autour de son atmosphère ionisée et s'étire en queue derrière la planète."],
    "Nébuleuse du Crabe": ["Le pulsar du Crabe", "Une étoile à neutrons de 20 km qui tourne 30 fois par seconde, avec un champ de cent millions de teslas. Ses deux faisceaux balaient l'espace comme un phare (ralenti ici)."],
    "Sagittarius A*": ["Champ autour du trou noir", "Les lignes de champ, entraînées par le disque en rotation, s'enroulent en hélice. Ce mécanisme peut lancer des jets de matière presque à la vitesse de la lumière."],
    "Cygnus X-1": ["Champ autour du trou noir", "Le champ magnétique du disque d'accrétion, tordu par la rotation, canalise des jets de particules au-dessus des pôles."],
    "Quasar 3C 273": ["Jets magnétiques du quasar", "Des lignes de champ enroulées en hélice canalisent des jets qui s'étendent sur des centaines de milliers d'années-lumière."],
    "Voie lactée": ["Champ magnétique galactique", "Quelques microgauss à peine, un million de fois plus faible que celui de la Terre, mais étendu sur toute la galaxie. Il suit les bras spiraux et forme un « X » au-dessus et au-dessous du disque."],
    "Héliopause": ["Spirale de Parker", "Le champ du Soleil, emporté par le vent solaire pendant que le Soleil tourne, s'enroule en spirale jusqu'à l'héliopause. La nappe de courant héliosphérique ondule comme une jupe de ballerine."],
    "Voyager 2": ["Champ interstellaire", "Voyager 2 a franchi l'héliopause en 2018 et mesure toujours le champ magnétique interstellaire, qui s'enroule autour de la bulle du Soleil."],
    "Voyager 1": ["Champ interstellaire", "Voyager 1 mesure le champ magnétique du milieu interstellaire avec son magnétomètre, monté au bout d'une perche de 13 m pour échapper au magnétisme de la sonde."],
  };
  function fieldText(o) {
    if (FIELD_TXT[o.name]) return FIELD_TXT[o.name];
    if (o.kind === "galaxy" && o.gtype === "spiral") return ["Champ magnétique galactique", "Faible mais immense, il suit les bras spiraux et s'échappe du disque en forme de « X »."];
    if (/Naine rouge/.test(o.label || "")) return ["Champ magnétique de " + o.name, "Les naines rouges ont des champs des centaines de fois plus intenses que le Soleil : leurs boucles se rompent en éruptions violentes, un danger pour leurs planètes."];
    return ["Champ magnétique de " + o.name, "Comme le Soleil, cette étoile est entourée de boucles magnétiques et de lignes ouvertes qui guident son vent stellaire."];
  }

  function buildField(o) {
    const grp = new T.Group();
    let dist = null, maxD = null;
    const sunLocal = (g) => { g.updateMatrixWorld(true); return (ctx3.sunDir || V(1, 0, 0)).clone().applyQuaternion(g.getWorldQuaternion(new T.Quaternion()).invert()).normalize(); };
    if (o.name === "Terre") {
      // pôle géomagnétique : 80,7° N, 72,7° O
      const pl = 80.7 * DEG, plo = -72.7 * DEG;
      grp.quaternion.setFromUnitVectors(V(0, 1, 0), V(Math.cos(pl) * Math.cos(plo), Math.sin(pl), -Math.cos(pl) * Math.sin(plo)));
      scene.add(grp);
      magnetosphere(grp, sunLocal(grp), {
        Ls: [1.5, 2.2, 3.1, 4.3, 5.9, 8, 10.5], nPhi: 14, k: 0.075, tailFrom: 8, tailLen: 34, tailH: 2.6, tailW: 4,
        colA: "#2fb8ff", colB: "#7a4dff", radius: 0.016, belts: true, opacity: 0.75,
        aurora: { colat: 0.36, height: 0.07 },
        shock: { nose: 14, a: 11, width: 26, mp: 10 },
      });
      dist = 23; maxD = 80;
    } else if (o.name === "Jupiter" || o.name === "Saturne") {
      const jup = o.name === "Jupiter";
      grp.rotation.z = ctx3.tilt.rotation.z + (jup ? 9.6 : 0) * DEG;
      scene.add(grp);
      const s = sunLocal(grp);
      magnetosphere(grp, s, jup ? {
        Ls: [2, 3.5, 5.9, 9, 14, 22, 32], nPhi: 12, k: 0.018, tailFrom: 22, tailLen: 90, tailH: 8, tailW: 12, tailScale: 1,
        colA: "#c48bff", colB: "#ff6fcf", radius: 0.06, aurora: { colat: 0.27, height: 0.05, low: "#7fb0ff", high: "#d17bff", gain: 1.4 },
        shock: { nose: 60, a: 45, width: 110, mp: 45, color: "#c48bff" },
      } : {
        Ls: [2, 3, 4, 6, 9, 13, 18], nPhi: 12, k: 0.035, tailFrom: 13, tailLen: 60, tailH: 5, tailW: 8,
        colA: "#7fd6ff", colB: "#b08bff", radius: 0.045, aurora: { colat: 0.27, height: 0.05, low: "#ff6fb8", high: "#8f7bff", gain: 1.3 },
        shock: { nose: 27, a: 22, width: 55, mp: 21 },
      });
      const r = rng(9);
      if (jup) {
        // tore de plasma d'Io et tube de flux d'Io
        grp.add(fieldCloud(9000, (i, p) => {
          const a = r() * Math.PI * 2, rr = 5.9 + gauss(r) * 0.25;
          p.x = Math.cos(a) * rr; p.z = Math.sin(a) * rr; p.y = gauss(r) * 0.35;
          const na = r() < 0.3; p.r = 0.35; p.g = na ? 0.25 : 0.12; p.b = na ? 0.05 : 0.08; p.s = 0.35;
        }));
        // tube de flux d'Io : il suit la lune
        const tube = fluxTube(dipolePts(5.9, 0, 90, 1.003), 0.05, fieldMaterial("#ffd060", "#ff8030", { dens: 5, speed: 3 }), 0.1, 140);
        (ctx3.ioPivot || grp).add(tube);
      } else {
        grp.add(fieldCloud(5000, (i, p) => {
          const a = r() * Math.PI * 2, rr = 3.95 + gauss(r) * 0.3;
          p.x = Math.cos(a) * rr; p.z = Math.sin(a) * rr; p.y = gauss(r) * 0.2;
          p.r = 0.08; p.g = 0.14; p.b = 0.26; p.s = 0.3;
        }));
      }
      dist = jup ? 75 : 50; maxD = jup ? 180 : 120;
    } else if (o.name === "Uranus" || o.name === "Neptune") {
      const ur = o.name === "Uranus";
      grp.rotation.z = (ur ? 59 : 47) * DEG; grp.position.y = ur ? -0.3 : -0.55;
      ctx3.mesh.add(grp);
      magnetosphere(grp, V(1, 0, 0), { Ls: [1.6, 2.2, 3, 4.2, 6, 8.5], nPhi: 12, k: 0, colA: "#6ff0e0", colB: "#5f8bff", radius: 0.03, aurora: { colat: 0.4, height: 0.06, low: "#8fffd8", high: "#7f9bff" } });
      dist = 22; maxD = 50;
    } else if (o.name === "Mercure") {
      grp.position.y = 0.2; grp.rotation.z = ctx3.tilt.rotation.z;
      scene.add(grp);
      magnetosphere(grp, sunLocal(grp), { Ls: [1.15, 1.35, 1.6, 1.95, 2.4, 3], nPhi: 12, k: 0.4, tailFrom: 1.95, tailLen: 10, tailH: 0.9, tailW: 1.4, colA: "#ffd27a", colB: "#ff8a5c", radius: 0.012, shock: { nose: 2.2, a: 1.8, width: 5, mp: 1.5, color: "#ffb070" } });
      dist = 9.5; maxD = 25;
    } else if (o.name === "Mars") {
      ctx3.mesh.add(grp);
      const r = rng(4), mat = fieldMaterial("#ff7a9a", "#ffd0a0", { dens: 2, speed: 1.2 });
      for (let i = 0; i < 90; i++) {
        const c = randDir(r, -1.2, -0.45, 2.4, 3.9), tg = V(gauss(r), gauss(r), gauss(r)).cross(c).normalize(), sep = 0.04 + r() * 0.12;
        grp.add(fluxTube(surfaceLoop(c, tg, sep, sep * (0.8 + r()), 1.003), 0.004, mat, r(), 40));
      }
      dist = 3.1;
    } else if (o.name === "Vénus") {
      scene.add(grp);
      const s = ctx3.sunDir.clone(), e = new T.Vector3().crossVectors(s, V(0, 1, 0)).normalize(), up = new T.Vector3().crossVectors(e, s);
      const mat = fieldMaterial("#ffd08a", "#ff7a4a", { dens: 3, speed: 1.4, opacity: 0.45 });
      let ph = 0;
      for (let xi = -6; xi <= 3; xi++) for (let yi = -3; yi <= 3; yi++) {
        const x0 = xi * 1.6, y0 = yi * 0.9, pts = [];
        for (let k = 0; k <= 40; k++) {
          const z = -8 + k * 0.4, rho2 = z * z + y0 * y0;
          const drape = 3.2 * Math.exp(-rho2 / 5) * (x0 < 1 ? 1 + Math.max(0, -x0) * 0.25 : 0.6);
          const x = x0 - drape;
          const p = V(0, 0, 0).addScaledVector(s, x).addScaledVector(up, y0).addScaledVector(e, z);
          if (p.length() < 1.15) p.setLength(1.15);
          pts.push(p);
        }
        grp.add(fluxTube(pts, 0.008, mat, (ph += 0.137) % 1, 80));
      }
      dist = 17; maxD = 40;
    } else if (o.kind === "sun") {
      ctx3.star.add(grp);
      coronalField(grp, 1, { loops: 34, colA: "#ffb050", colB: "#ff5a1a", colC: "#ffd090", seed: 7 });
      dist = 6; maxD = 20;
    } else if (o.kind === "star" && ctx3.star) {
      ctx3.star.add(grp);
      const rgb = hexRGB(o.color), col = "#" + new T.Color(...rgb).getHexString();
      const dwarf = /Naine rouge/.test(o.label || "");
      coronalField(grp, ctx3.star.children[0].geometry.parameters.radius, { loops: dwarf ? 40 : 18, colA: col, colB: dwarf ? "#ff5a2a" : "#8fb8ff", colC: col, seed: seedOf(o.name) });
      dist = null;
    } else if (o.name === "Nébuleuse du Crabe" && ctx3.crab) {
      // pulsar : étoile à neutrons, dipole incliné, faisceaux
      const spin = new T.Group(); ctx3.crab.add(spin); spin.add(grp);
      const ns = new T.Mesh(new T.SphereGeometry(0.08, 32, 16), new T.MeshBasicMaterial({ color: 0xdfe8ff }));
      spin.add(ns);
      grp.rotation.z = 45 * DEG;
      const mat = fieldMaterial("#9fd8ff", "#c08bff", { dens: 3, speed: 3 });
      for (let i = 0; i < 12; i++) [1.6, 3, 5, 8].forEach((L, j) => grp.add(fluxTube(dipolePts(L, i / 12 * Math.PI * 2, 70, 1.01).map((p) => p.multiplyScalar(0.08)), 0.006, mat, (i * 0.17 + j * 0.3) % 1, 90)));
      for (const sg of [1, -1]) {
        const cone = new T.Mesh(new T.ConeGeometry(0.5, 3.5, 48, 1, true), new T.ShaderMaterial({
          uniforms: { ff: U.ff },
          vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
          fragmentShader: `uniform float ff; varying vec2 vUv; void main(){ float a = pow(vUv.y, 2.0) * 0.6; gl_FragColor = vec4(vec3(0.6, 0.8, 1.0) * a * ff, 1.0); }`,
          transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
        }));
        cone.position.y = sg * 1.75; if (sg > 0) cone.rotation.x = Math.PI;
        grp.add(cone);
      }
      updaters.push((dt) => { spin.rotation.y += dt * 2.2; });
      dist = 4; maxD = 40;
    } else if (o.kind === "blackhole" || o.kind === "quasar") {
      scene.add(grp);
      const q = o.kind === "quasar";
      helicalJets(grp, { n: q ? 10 : 8, r0: q ? 5 : 4, r1: 4, h: q ? 40 : 26, turns: 2.5, w: q ? 0.07 : 0.05, colA: q ? "#8fb8ff" : "#c08bff", colB: q ? "#ffffff" : "#ff9ad8" });
      // boucles au-dessus du disque
      const mat = fieldMaterial("#ffb070", "#c08bff", { dens: 2, speed: 1.5, opacity: 0.6 });
      const r = rng(11);
      for (let i = 0; i < 24; i++) {
        const r1 = 3.5 + r() * 6, r2 = r1 + 1 + r() * 2.5, a = r() * Math.PI * 2, pts = [];
        for (let k = 0; k <= 30; k++) { const t = k / 30, rr = r1 + (r2 - r1) * t, ang = a + t * 0.6; pts.push(V(Math.cos(ang) * rr, Math.sin(Math.PI * t) * (r2 - r1) * 0.8, Math.sin(ang) * rr)); }
        grp.add(fluxTube(pts, 0.04, mat, r(), 50));
      }
      dist = q ? 60 : 45; maxD = q ? 120 : 90;
    } else if (o.kind === "galaxy" && ctx3.g && (ctx3.gopts.type === "spiral")) {
      ctx3.g.add(grp);
      const arms = ctx3.gopts.arms || 2, b = Math.tan((ctx3.gopts.pitch || 14) * DEG);
      const mat = fieldMaterial("#7fc8ff", "#c9a0ff", { dens: 2, speed: 0.6, opacity: 0.8 });
      let ph = 0;
      for (let a = 0; a < arms; a++) for (const off of [-0.18, 0, 0.18]) {
        const pts = [];
        for (let k = 0; k <= 80; k++) { const rr = 1.4 + k / 80 * 8.8, th = Math.log(rr / 0.7) / b + a * Math.PI * 2 / arms + off; pts.push(V(rr * Math.cos(th), 0.03, rr * Math.sin(th))); }
        grp.add(fluxTube(pts, 0.03, mat, (ph += 0.21) % 1, 200));
      }
      const xMat = fieldMaterial("#9fd8ff", "#7f8bff", { dens: 2, speed: 0.8, opacity: 0.28 });
      for (let i = 0; i < 10; i++) {
        const ang = i / 10 * Math.PI * 2 + 0.3;
        for (const sg of [1, -1]) {
          const pts = [];
          for (let k = 0; k <= 30; k++) { const t = k / 30, rr = 0.8 + Math.pow(t, 1.6) * 6; pts.push(V(Math.cos(ang + t * 0.8) * rr, sg * (0.1 + Math.pow(t, 0.6) * 4.5), Math.sin(ang + t * 0.8) * rr)); }
          grp.add(fluxTube(pts, 0.02, xMat, (ph += 0.13) % 1, 60));
        }
      }
    } else if (o.name === "Héliopause") {
      scene.add(grp);
      const mat = fieldMaterial("#ffd27a", "#7fc8ff", { dens: 5, speed: 1.6 });
      let ph = 0;
      for (const lat of [-0.6, -0.3, 0, 0.3, 0.6]) for (let i = 0; i < 6; i++) {
        const pts = [], a0 = i / 6 * Math.PI * 2 + lat;
        for (let k = 0; k <= 160; k++) {
          const rr = 0.2 + k / 160 * 3.4, a = a0 - rr * 4.2;
          pts.push(V(Math.cos(a) * rr * Math.cos(lat), rr * Math.sin(lat), Math.sin(a) * rr * Math.cos(lat)));
        }
        grp.add(fluxTube(pts, 0.008, mat, (ph += 0.173) % 1, 320));
      }
      // nappe de courant héliosphérique
      const NR = 60, NA = 180, pos = [], idx = [];
      for (let i = 0; i <= NR; i++) for (let j = 0; j <= NA; j++) {
        const rr = 0.25 + i / NR * 3.3, a = j / NA * Math.PI * 2;
        pos.push(Math.cos(a) * rr, 0.3 * rr / 3.5 * Math.sin(a + rr * 4.2) * 1.4, Math.sin(a) * rr);
        if (i < NR && j < NA) { const k = i * (NA + 1) + j; idx.push(k, k + 1, k + NA + 1, k + 1, k + NA + 2, k + NA + 1); }
      }
      const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
      const sheet = new T.Mesh(g, new T.ShaderMaterial({
        uniforms: { ff: U.ff },
        vertexShader: `varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float ff; varying vec3 vP; void main(){ float r = length(vP.xz); float a = 0.09 * smoothstep(3.6, 1.0, r) * (0.6 + 0.4 * sin(r * 12.0)); gl_FragColor = vec4(vec3(1.0, 0.7, 0.4) * a * ff, 1.0); }`,
        transparent: true, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
      }));
      grp.add(sheet);
      updaters.push((dt) => { grp.rotation.y += dt * 0.05; });
    } else if (o.model === "voyager") {
      scene.add(grp);
      const mat = fieldMaterial("#7fc8ff", "#b08bff", { dens: 3, speed: 0.7, opacity: 0.7 });
      for (let i = 0; i < 18; i++) {
        const y = -6 + (i % 6) * 2.4, z = -8 - Math.floor(i / 6) * 4, pts = [];
        for (let k = 0; k <= 40; k++) { const x = -30 + k * 1.5; pts.push(V(x, y + Math.sin(x * 0.08 + i) * 1.2, z + Math.cos(x * 0.05) * 2)); }
        grp.add(fluxTube(pts, 0.04, mat, i * 0.31 % 1, 80));
      }
    } else {
      return null;
    }
    const [title, text] = fieldText(o);
    return { group: grp, dist, maxD, title, text };
  }

  /* ---------------------------------------------------------------------
     Cycle de vie
     --------------------------------------------------------------------- */
  let lowRes = false, viewInfo = null, composer = null, bloom = null, renderPass = null, field = null, fit = 1;
  let compare = null, compareOn = false, currentObj = null;
  // qualité adaptative : 0 = maximale, 1 = réduite, 2 = économe (sans lueur)
  let quality = 0;
  const compareBtn = document.getElementById("v3d-compare");
  const fieldBtn = document.getElementById("v3d-field");
  const fieldInfo = document.getElementById("v3d-field-info");
  let fieldOn = true;
  try { fieldOn = localStorage.getItem("atlas-field") !== "0"; } catch (e) { /* stockage indisponible */ }

  function ensureRenderer() {
    if (renderer) return true;
    try {
      renderer = new T.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
    } catch (e) {
      renderer = null;
      return false;
    }
    renderer.setClearColor(0x05070d, 1);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    camera = new T.PerspectiveCamera(45, 1, 0.05, 3000);
    // lueur (bloom) si les modules de post-traitement sont chargés
    if (T.EffectComposer && T.RenderPass && T.UnrealBloomPass) {
      try {
        composer = new T.EffectComposer(renderer);
        renderPass = new T.RenderPass(new T.Scene(), camera);
        bloom = new T.UnrealBloomPass(new T.Vector2(window.innerWidth, window.innerHeight), 0.8, 0.5, 0.6);
        composer.addPass(renderPass);
        composer.addPass(bloom);
      } catch (e) { composer = null; }
    }
    window.addEventListener("resize", () => { if (isOpen) resize(); });
    if (fieldBtn) fieldBtn.addEventListener("click", () => setField(!fieldOn, true));
    if (compareBtn) compareBtn.addEventListener("click", () => setCompare(!compareOn));
    return true;
  }
  function resize() {
    const W = window.innerWidth, H = window.innerHeight;
    let pr = lowRes ? Math.min(window.devicePixelRatio || 1, 1) * (W * H > 1.4e6 ? 0.75 : 1) : Math.min(window.devicePixelRatio || 1, 2);
    pr = Math.min(pr, [2, 1, 0.75][quality]);
    renderer.setPixelRatio(pr);
    renderer.setSize(W, H, false);
    if (composer) { composer.setPixelRatio(pr); composer.setSize(W, H); }
    camera.aspect = W / H;
    // décale l'astre pour qu'il ne soit pas caché par la fiche
    const panel = document.getElementById("panel");
    if (W > 760) camera.setViewOffset(W, H, Math.min(180, (panel.offsetWidth + 32) / 2), 0, W, H);
    else camera.setViewOffset(W, H, 0, Math.min(H * 0.22, panel.offsetHeight * 0.45), W, H);
    camera.updateProjectionMatrix();
    U.px.value = H / (2 * Math.tan(camera.fov * DEG / 2)) * pr;
  }

  function setCompare(on) {
    compareOn = on;
    compareBtn.setAttribute("aria-pressed", String(on));
    compareBtn.classList.toggle("on", on);
    if (on && !compare && currentObj) compare = buildCompare(currentObj);
    if (compare) compare.group.visible = on;
    if (on && compare) {
      if (fieldOn && field) setField(false, false, false);
      ctl.tDist = clamp(Math.max(viewInfo.dist || 4, compare.extent) * fit, ctl.minD, ctl.maxD = Math.max(ctl.maxD, compare.extent * 3 * fit));
    } else if (!on) ctl.tDist = clamp((fieldOn && field && field.dist ? field.dist : viewInfo.dist || 4) * fit, ctl.minD, ctl.maxD);
    ctl.idle = 0;
  }

  function setField(on, animate, persist = true) {
    fieldOn = on;
    if (persist) try { localStorage.setItem("atlas-field", on ? "1" : "0"); } catch (e) { /* stockage indisponible */ }
    if (!field) return;
    fieldBtn.setAttribute("aria-pressed", String(on));
    fieldBtn.classList.toggle("on", on);
    fieldInfo.hidden = !on;
    if (on) field.group.visible = true;
    if (on && compareOn) { compareOn = false; compareBtn.setAttribute("aria-pressed", "false"); compareBtn.classList.remove("on"); if (compare) compare.group.visible = false; }
    if (animate) {
      const d = on && field.dist ? field.dist : viewInfo.dist || 4;
      ctl.maxD = Math.max(viewInfo.maxD || 20, on && field.maxD ? field.maxD : 0) * fit;
      ctl.tDist = clamp(d * fit, ctl.minD, ctl.maxD);
      ctl.idle = 0;
    }
  }

  function disposeScene() {
    if (!scene) return;
    const keep = new Set(Object.values(cache));
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => {
          for (const k in m) { const v = m[k]; if (v && v.isTexture && !keep.has(v) && v !== spriteTex) v.dispose(); }
          if (m.uniforms) for (const k in m.uniforms) { const v = m.uniforms[k].value; if (v && v.isTexture && !keep.has(v) && v !== spriteTex) v.dispose(); }
          m.dispose();
        });
      }
    });
    scene = null;
  }

  function builderFor(o) {
    if (o.kind === "planet") return o.name === "Terre" ? B.earth : o.name === "Lune" ? B.moon : B.planet;
    return B[o.kind] || B.star;
  }

  let closeTimer = 0;
  function open(o, opts = {}) {
    if (!ensureRenderer()) return false;
    close(true);
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = 0; disposeScene(); }
    isOpen = true;
    document.body.classList.add("in3d");
    host.hidden = false;
    loading.hidden = false;
    loading.textContent = "Génération de " + o.name + "…";
    fieldBtn.hidden = true; fieldInfo.hidden = true; compareBtn.hidden = true;
    if (liveEl) liveEl.hidden = true;
    currentObj = o; compare = null; compareOn = false;
    compareBtn.setAttribute("aria-pressed", "false"); compareBtn.classList.remove("on");
    requestAnimationFrame(() => host.classList.add("on"));
    // laisse le temps d'afficher le message avant le calcul des textures
    setTimeout(() => {
      if (!isOpen) return;
      scene = new T.Scene();
      updaters = [];
      ctx3 = {};
      lowRes = false;
      renderer.shadowMap.enabled = false;
      viewInfo = builderFor(o)(o) || {};
      if (viewInfo.stars !== false) { scene.add(skySphere()); scene.add(starfield()); }
      // champ magnétique
      U.ff.value = 0;
      field = buildField(o);
      // écran en portrait : on recule pour que l'astre tienne en largeur
      const aspect = window.innerWidth / window.innerHeight;
      fit = aspect < 1 ? Math.min(2.2, 0.85 / aspect) : 1;
      ctl.minD = viewInfo.minD || 1.5; ctl.maxD = (viewInfo.maxD || 20) * fit;
      ctl.tDist = (viewInfo.dist || 4) * fit; ctl.dist = ctl.tDist * 1.6;
      ctl.phi = viewInfo.phi || 1.3; ctl.theta = viewInfo.theta ?? 0.5;
      ctl.vT = 0; ctl.vP = 0; ctl.auto = viewInfo.auto ?? 0.06; ctl.idle = 0;
      if (field) {
        fieldBtn.hidden = false;
        fieldInfo.innerHTML = `<strong>${field.title}</strong><span>${field.text}</span>`;
        const want = opts.field !== undefined ? opts.field : fieldOn;
        if (opts.field !== undefined) fieldOn = want;
        field.group.visible = want;
        setField(want, want, opts.field === undefined);
        if (want) ctl.dist = ctl.tDist * 1.3;
      }
      const canCompare = o.kind === "planet" || o.kind === "sun" || (o.kind === "star" && STAR_R[o.name]);
      compareBtn.hidden = !canCompare;
      if (canCompare && opts.compare) setCompare(true);
      const bl = viewInfo.bloom || [0.75, 0.55, 0.62];
      if (bloom) { bloom.strength = bl[0]; bloom.radius = bl[1]; bloom.threshold = bl[2]; renderPass.scene = scene; }
      resize();
      loading.hidden = true;
      clock.start();
      let t = 0, fpsT = 0, fpsN = 0, warm = 0;
      const loop = () => {
        if (!isOpen) return;
        const raw = clock.getDelta(), dt = Math.min(0.05, raw);
        t += dt;
        // mesure la fluidité et baisse la qualité si besoin
        warm += raw;
        if (warm > 1.5) {
          fpsT += raw; fpsN++;
          if (fpsT > 2.5) {
            const fps = fpsN / fpsT;
            if (fps < 28 && quality < 2 && !window.__atlasFixedQuality) { quality++; resize(); }
            fpsT = 0; fpsN = 0;
          }
        }
        updateControls(dt);
        if (field) {
          const target = fieldOn ? 1 : 0;
          U.ff.value += (target - U.ff.value) * Math.min(1, dt * (fieldOn ? 0.9 : 3));
          if (!fieldOn && U.ff.value < 0.01) field.group.visible = false;
        }
        for (const u of updaters) u(dt, t);
        if (composer && quality < 2) composer.render(dt); else renderer.render(scene, camera);
        raf = requestAnimationFrame(loop);
      };
      loop();
    }, 40);
    return true;
  }

  function close(instant) {
    if (!isOpen) return;
    isOpen = false;
    cancelAnimationFrame(raf);
    document.body.classList.remove("in3d");
    host.classList.remove("on");
    field = null;
    if (liveEl) liveEl.hidden = true;
    const old = scene;
    const done = () => {
      closeTimer = 0;
      if (scene === old) disposeScene();
      if (!isOpen) host.hidden = true;
    };
    clearTimeout(closeTimer);
    if (instant) done(); else closeTimer = setTimeout(done, 350);
  }

  window.Viewer3D = {
    open, close, isOpen: () => isOpen,
    relayout: () => { if (isOpen && renderer) resize(); },
    quality: () => quality,
  };
})();
