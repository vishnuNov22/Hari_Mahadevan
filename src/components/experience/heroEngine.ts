import { FRAG, VERT } from "./heroShader";

type V3 = [number, number, number];

export type HeroEngine = {
  setPointer: (x: number, y: number) => void;
  /** 0..1 scroll progress through the pinned 3D story (scrubbed with easing) */
  setProgress: (p: number) => void;
  setHue: (v: number) => void;
  destroy: () => void;
};

export type HeroEngineOptions = {
  /** "story": camera follows the scroll spline. "orbit": fixed framing (chapter stage). */
  mode?: "story" | "orbit";
  floor?: boolean;
};

/* ---------------- camera choreography ----------------
 * Key poses of a Catmull-Rom spline. Scroll progress picks a point on it,
 * so the camera glides — establishing shot → centred → orbit → fly-through.
 */
const CAM_POS: V3[] = [
  [-1.7, 0.35, 5.2], // 0.0  establishing — lattice sits right of the name
  [0.2, 0.8, 4.8], //   0.2  rising
  [0.9, 0.9, 4.4], //   0.4  hold right ("Four worlds.")
  [2.6, 0.3, 3.8], //   0.6  swing round
  [2.9, 0.2, 3.2], //   0.8  hold left ("One mindset.")
  [0.0, 0.05, 0.3], //  1.0  fly into the hollow centre
];
const CAM_TGT: V3[] = [
  [-1.25, 0.05, 0.0],
  [-1.6, 0.0, 0.0],
  [-1.8, -0.05, 0.0],
  [1.6, 0.0, 0.3],
  [1.9, 0.0, 0.3],
  [0.0, 0.0, -1.0],
];

function catmull(points: V3[], u: number): V3 {
  const n = points.length - 1;
  const x = Math.min(0.9999, Math.max(0, u)) * n;
  const i = Math.floor(x);
  const t = x - i;
  const p0 = points[Math.max(0, i - 1)]!;
  const p1 = points[i]!;
  const p2 = points[Math.min(n, i + 1)]!;
  const p3 = points[Math.min(n, i + 2)]!;
  const t2 = t * t;
  const t3 = t2 * t;
  return [0, 1, 2].map(
    (k) =>
      0.5 *
      (2 * p1[k]! + (-p0[k]! + p2[k]!) * t + (2 * p0[k]! - 5 * p1[k]! + 4 * p2[k]! - p3[k]!) * t2 + (-p0[k]! + 3 * p1[k]! - 3 * p2[k]! + p3[k]!) * t3),
  ) as V3;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) throw new Error("shader alloc failed");
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) ?? "compile failed");
  return sh;
}

/**
 * WebGL1 driver. Renders below native resolution (DPR capped), pauses off-screen
 * and in hidden tabs, renders a single frame for reduced motion, and reports
 * context loss so the static fallback takes over. Throws if WebGL is missing.
 */
export function createHeroEngine(canvas: HTMLCanvasElement, onLost: () => void, opts: HeroEngineOptions = {}): HeroEngine {
  const mode = opts.mode ?? "story";
  const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, powerPreference: "high-performance" });
  if (!gl) throw new Error("WebGL unavailable");

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) ?? "link failed");
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n: string) => gl.getUniformLocation(prog, n);
  const u = {
    res: U("uRes"), time: U("uTime"), pointer: U("uPointer"), camPos: U("uCamPos"), camTgt: U("uCamTarget"),
    morph: U("uMorph"), spin: U("uSpin"), explode: U("uExplode"), hue: U("uHue"), quality: U("uQuality"), floor: U("uFloor"),
  };

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const quality = small || lowCores ? 0 : 1;
  const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (quality ? 0.65 : 0.5);

  let tx = 0, ty = 0, px = 0, py = 0;
  let progT = 0, prog_ = 0;   // scrub: progress eases toward target (like ScrollTrigger scrub: 1)
  let hueT = 0, hue = 0;
  let visible = true, raf = 0, lost = false;
  const t0 = performance.now();

  const resize = () => {
    const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
    const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  };

  const draw = (time: number) => {
    resize();
    const p = mode === "story" ? prog_ : 0.36;
    const cam = mode === "story" ? catmull(CAM_POS, p) : ([0, 0.6, 4.4] as V3);
    const tgt = mode === "story" ? catmull(CAM_TGT, p) : ([0, 0, 0] as V3);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(u.res, canvas.width, canvas.height);
    gl.uniform1f(u.time, time);
    gl.uniform2f(u.pointer, px, py);
    gl.uniform3f(u.camPos, cam[0], cam[1], cam[2]);
    gl.uniform3f(u.camTgt, tgt[0], tgt[1], tgt[2]);
    gl.uniform1f(u.morph, smooth(0.0, 0.66, p));
    gl.uniform1f(u.spin, p * Math.PI * 1.4);
    gl.uniform1f(u.explode, smooth(0.7, 1.0, p));
    gl.uniform1f(u.hue, hue);
    gl.uniform1f(u.quality, quality);
    gl.uniform1f(u.floor, opts.floor === false ? 0 : 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = () => {
    raf = 0;
    if (!visible || document.hidden || lost) return;
    px += (tx - px) * 0.05;
    py += (ty - py) * 0.05;
    prog_ += (progT - prog_) * 0.08;
    hue += (hueT - hue) * 0.06;
    draw((performance.now() - t0) / 1000 + 3.0);
    raf = requestAnimationFrame(loop);
  };

  const kick = () => {
    if (lost) return;
    if (reduce) {
      prog_ = progT;
      hue = hueT;
      draw(6.0);
      return;
    }
    if (!raf) raf = requestAnimationFrame(loop);
  };

  const io = new IntersectionObserver(([e]) => {
    visible = Boolean(e?.isIntersecting);
    if (visible) kick();
  });
  io.observe(canvas);
  const onVis = () => !document.hidden && kick();
  const onLostCtx = (e: Event) => {
    e.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    onLost();
  };
  document.addEventListener("visibilitychange", onVis);
  window.addEventListener("resize", kick);
  canvas.addEventListener("webglcontextlost", onLostCtx);
  kick();

  return {
    setPointer(x, y) {
      tx = x;
      ty = y;
      if (!reduce) kick();
    },
    setProgress(p) {
      progT = Math.min(1, Math.max(0, p));
      kick();
    },
    setHue(v) {
      hueT = Math.min(1, Math.max(0, v));
      kick();
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", kick);
      canvas.removeEventListener("webglcontextlost", onLostCtx);
    },
  };
}
