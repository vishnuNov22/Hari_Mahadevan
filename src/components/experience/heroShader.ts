/**
 * Hero motif v3 — "the lattice".
 *
 * A sphere carved by a gyroid minimal surface (the reference sculpture):
 *   d = max(sphere, |gyroid| − thickness)
 * Rendered as soft "ice" ceramic with subsurface-like wrap lighting, a magenta
 * rim light, Fresnel studio reflections, soft shadows, ambient occlusion and a
 * contact shadow on the terracotta floor.
 *
 * Scroll drives everything through uniforms (see heroEngine.ts):
 *   uCamPos / uCamTarget — camera position on a Catmull-Rom spline
 *   uMorph   — 0 solid-ish lattice → 1 open, airy lattice
 *   uSpin    — object rotation (scroll-scrubbed, not free-spinning)
 *   uExplode — final beat: the shell expands outward
 *   uHue     — venture tint for the rim light (0..1 across four chapters)
 *
 * Output is premultiplied alpha over the page's CSS backdrop.
 */

export const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;
uniform vec3  uCamPos;
uniform vec3  uCamTarget;
uniform float uMorph;
uniform float uSpin;
uniform float uExplode;
uniform float uHue;
uniform float uQuality;
uniform float uFloor;   // 1 = draw contact shadow on the floor

#define PI 3.14159265

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec3 rimTint(float h) {
  vec3 a = vec3(0.88, 0.27, 0.48);  // magenta
  vec3 b = vec3(0.94, 0.54, 0.66);  // rose
  vec3 c = vec3(0.91, 0.76, 0.61);  // sand
  vec3 d = vec3(0.62, 0.86, 0.78);  // seafoam
  float x = clamp(h, 0.0, 1.0) * 3.0;
  if (x < 1.0) return mix(a, b, x);
  if (x < 2.0) return mix(b, c, x - 1.0);
  return mix(c, d, x - 2.0);
}

vec3 objSpace(vec3 p) {
  p.y -= 0.05 * sin(uTime * 0.6);                  // gentle float
  p.xz *= rot(uSpin + uTime * 0.05 + uPointer.x * 0.25);
  p.yz *= rot(0.35 + uSpin * 0.35 + uPointer.y * 0.15);
  return p;
}

float sdLattice(vec3 p) {
  p = objSpace(p);
  float R = 1.0 + uExplode * 0.35;
  float sphere = length(p) - R;
  float shell = abs(length(p) - (R - 0.14)) - 0.14 - uExplode * 0.04;   // hollow shell
  float f = 6.6 - uMorph * 1.6;                                         // gyroid frequency
  vec3 q = p * f;
  float g = dot(sin(q), cos(q.yzx)) / f;
  float th = mix(0.075, 0.045, uMorph);
  float d = max(max(sphere, shell), abs(g) - th);
  return d * 0.7;
}

vec3 nrm(vec3 p) {
  vec2 e = vec2(0.0015, 0.0);
  return normalize(vec3(sdLattice(p + e.xyy) - sdLattice(p - e.xyy),
                        sdLattice(p + e.yxy) - sdLattice(p - e.yxy),
                        sdLattice(p + e.yyx) - sdLattice(p - e.yyx)));
}

float softShadow(vec3 ro, vec3 rd) {
  float r = 1.0; float t = 0.02;
  for (int i = 0; i < 28; i++) {
    float h = sdLattice(ro + rd * t);
    r = min(r, 8.0 * h / t);
    t += clamp(h, 0.02, 0.2);
    if (r < 0.02 || t > 3.0) break;
  }
  return clamp(r, 0.0, 1.0);
}

float ao(vec3 p, vec3 n) {
  float o = 0.0, s = 1.0;
  for (int i = 1; i <= 5; i++) { float h = 0.04 * float(i); o += (h - sdLattice(p + n * h)) * s; s *= 0.65; }
  return clamp(1.0 - 2.2 * o, 0.0, 1.0);
}

vec3 env(vec3 d) {
  // terracotta studio: warm red surround, bright overhead softbox, cool fill
  vec3 col = mix(vec3(0.33, 0.09, 0.10), vec3(0.55, 0.20, 0.19), smoothstep(-0.4, 0.5, d.y));
  col += vec3(1.0, 0.96, 0.95) * 2.4 * smoothstep(0.72, 0.9, d.y) * smoothstep(0.7, 0.3, abs(d.x));
  col += vec3(0.62, 0.84, 0.95) * 1.2 * smoothstep(0.08, 0.0, abs(d.x + 0.8)) * smoothstep(-0.2, 0.3, d.y);
  return col;
}

vec3 shade(vec3 p, vec3 rd, vec3 rim) {
  vec3 n = nrm(p);
  vec3 v = -rd;
  vec3 L = normalize(vec3(-0.5, 0.9, 0.55));
  float NoL = dot(n, L);
  float wrap = max((NoL + 0.45) / 1.45, 0.0);              // soft "subsurface" wrap
  float sh = mix(1.0, softShadow(p + n * 0.01, L), 0.85);
  float occ = ao(p, n);
  float NoV = max(dot(n, v), 0.0);
  float F = 0.04 + 0.96 * pow(1.0 - NoV, 5.0);

  vec3 ice = vec3(0.50, 0.70, 0.78);                        // reference ice blue
  vec3 deep = vec3(0.26, 0.12, 0.30);                       // purple in the cavities
  vec3 base = mix(deep, ice, smoothstep(0.15, 0.9, occ));
  vec3 col = base * (0.08 + 0.78 * wrap * sh);
  // bounce light from the red floor
  col += vec3(0.55, 0.12, 0.12) * max(-n.y, 0.0) * 0.45 * occ;
  // specular
  vec3 h = normalize(L + v);
  col += vec3(1.0) * pow(max(dot(n, h), 0.0), 64.0) * 0.7 * sh;
  col += env(reflect(rd, n)) * F * 0.4;
  // magenta / venture rim
  col += rim * pow(1.0 - NoV, 2.2) * 0.9 * occ;
  return col * mix(0.55, 1.0, occ);
}

vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;
  vec3 ro = uCamPos;
  vec3 ww = normalize(uCamTarget - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.9 * ww);
  vec3 rim = rimTint(uHue);

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  // contact shadow on the floor plane y = -1.25 (premultiplied dark)
  if (uFloor > 0.5 && rd.y < 0.0) {
    float tf = (-1.25 - ro.y) / rd.y;
    vec3 pf = ro + rd * tf;
    float r = length(pf.xz);
    float shadow = exp(-r * r * 1.8) * 0.55 * (1.0 - uExplode * 0.6);
    col = vec3(0.12, 0.02, 0.04) * shadow;
    alpha = shadow;
  }

  // raymarch with cone-traced edge coverage
  float t = 0.0; bool hit = false; float dmin = 1e5; float tmin = 0.0;
  float pix = 1.0 / (uRes.y * 1.9);
  int steps = uQuality > 0.5 ? 120 : 70;
  for (int i = 0; i < 120; i++) {
    if (i >= steps) break;
    float d = sdLattice(ro + rd * t);
    float rel = d / max(t, 0.001);
    if (rel < dmin && t > 0.3) { dmin = rel; tmin = t; }
    if (d < 0.0006 * t) { hit = true; break; }
    t += d;
    if (t > 12.0) break;
  }

  if (hit) {
    col = shade(ro + rd * t, rd, rim);
    alpha = 1.0;
  } else if (dmin < 1.5 * pix) {
    float cov = 1.0 - dmin / (1.5 * pix);
    col = mix(col, shade(ro + rd * tmin, rd, rim), cov);
    alpha = max(alpha, cov);
  }

  // soft bloom lift + filmic grade (warm highlights, cool-purple shadows)
  col += max(col - 0.75, 0.0) * 0.5;
  col = aces(col * 0.95);
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col * vec3(0.96, 0.94, 1.06), col * vec3(1.05, 1.0, 0.96), smoothstep(0.25, 0.8, lum));
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.012 * alpha;
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  gl_FragColor = vec4(col * alpha, alpha);
}
`;
