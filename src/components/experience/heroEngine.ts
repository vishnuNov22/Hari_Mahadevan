import { FRAG, VERT } from "./heroShader";

export type HeroEngine = {
  setPointer: (x: number, y: number) => void;
  setHue: (v: number) => void;
  destroy: () => void;
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
 * Minimal WebGL1 driver for the hero motif.
 * - Renders below native resolution (DPR capped) — raymarching is per pixel.
 * - Pauses when off-screen or the tab is hidden.
 * - Reduced motion: renders one still frame and stops.
 * - Context loss: notifies the caller so the static fallback can take over.
 * Throws if WebGL is unavailable; the caller keeps the static fallback.
 */
export function createHeroEngine(canvas: HTMLCanvasElement, onLost: () => void): HeroEngine {
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
  const uRes = U("uRes"), uTime = U("uTime"), uPointer = U("uPointer"), uHue = U("uHue"), uQuality = U("uQuality");

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const quality = small || lowCores ? 0 : 1;
  const scale = Math.min(window.devicePixelRatio || 1, 1.5) * (quality ? 0.7 : 0.5);

  let tx = 0, ty = 0, px = 0, py = 0, hue = 0, hueTarget = 0;
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
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uTime, time);
    gl.uniform2f(uPointer, px, py);
    gl.uniform1f(uHue, hue);
    gl.uniform1f(uQuality, quality);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const loop = () => {
    raf = 0;
    if (!visible || document.hidden || lost) return;
    px += (tx - px) * 0.04;
    py += (ty - py) * 0.04;
    hue += (hueTarget - hue) * 0.06;
    draw((performance.now() - t0) / 1000 + 3.0);
    raf = requestAnimationFrame(loop);
  };

  const kick = () => {
    if (lost) return;
    if (reduce) {
      hue = hueTarget;
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
    setHue(v) {
      hueTarget = Math.min(1, Math.max(0, v));
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
