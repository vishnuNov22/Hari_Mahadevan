/**
 * Hero motif — "Four worlds, one form".
 *
 * A single raymarched sculpture: a softly breathing sphere whose surface is
 * displaced by four low-frequency lobes (one per venture). It is shaded with a
 * physically-inspired model: GGX-ish specular from three studio lights, Fresnel
 * environment reflection, and a thin-film iridescence term whose hue drifts
 * through the four venture accents as `uHue` (scroll) moves 0 → 1.
 * A restrained procedural particle field adds depth behind it.
 *
 * Output is premultiplied-alpha over a transparent background so the HTML
 * typography and gradients behind the canvas stay crisp and readable.
 */

export const VERT = /* glsl */ `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

export const FRAG = /* glsl */ `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uPointer;  // -1..1, eased
uniform float uHue;      // 0..1 scroll progress through the four chapters
uniform float uQuality;  // 1 desktop, 0 constrained

#define PI 3.14159265

mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

// venture accents: digital periwinkle, events coral, property sage, financial teal
vec3 ventureTint(float h) {
  vec3 a = vec3(0.56, 0.61, 1.00);
  vec3 b = vec3(1.00, 0.56, 0.42);
  vec3 c = vec3(0.61, 0.78, 0.66);
  vec3 d = vec3(0.38, 0.78, 0.75);
  float x = clamp(h, 0.0, 1.0) * 3.0;
  if (x < 1.0) return mix(a, b, smoothstep(0.0, 1.0, x));
  if (x < 2.0) return mix(b, c, smoothstep(0.0, 1.0, x - 1.0));
  return mix(c, d, smoothstep(0.0, 1.0, x - 2.0));
}

float sdForm(vec3 p) {
  // slow, bounded rotation — never a spin
  p.xz *= rot(uTime * 0.08 + uPointer.x * 0.35);
  p.yz *= rot(0.25 + uPointer.y * 0.2);
  float r = 1.0;
  // four soft lobes on a tetrahedral layout
  float lobes =
      0.2 * exp(-3.2 * (1.0 - dot(normalize(p), normalize(vec3( 1.0,  1.0,  1.0))))) +
      0.2 * exp(-3.2 * (1.0 - dot(normalize(p), normalize(vec3(-1.0, -1.0,  1.0))))) +
      0.2 * exp(-3.2 * (1.0 - dot(normalize(p), normalize(vec3(-1.0,  1.0, -1.0))))) +
      0.2 * exp(-3.2 * (1.0 - dot(normalize(p), normalize(vec3( 1.0, -1.0, -1.0)))));
  float breathe = 0.035 * sin(uTime * 0.7 + p.y * 2.5) + 0.02 * sin(uTime * 0.45 + p.x * 3.1);
  return (length(p) - r - lobes - breathe) * 0.8;
}

vec3 nrm(vec3 p) {
  vec2 e = vec2(0.002, 0.0);
  return normalize(vec3(sdForm(p + e.xyy) - sdForm(p - e.xyy),
                        sdForm(p + e.yxy) - sdForm(p - e.yxy),
                        sdForm(p + e.yyx) - sdForm(p - e.yyx)));
}

// soft studio environment used for reflections
vec3 env(vec3 d) {
  vec3 col = mix(vec3(0.02, 0.025, 0.045), vec3(0.06, 0.07, 0.11), smoothstep(-0.3, 0.6, d.y));
  col += vec3(1.0, 0.97, 0.92) * 1.6 * smoothstep(0.74, 0.9, d.y) * smoothstep(0.75, 0.3, abs(d.x));
  col += vec3(0.80, 0.85, 1.00) * 1.4 * smoothstep(0.06, 0.0, abs(d.x - 0.82)) * smoothstep(-0.3, 0.2, d.y) * smoothstep(0.8, 0.4, d.y);
  col += vec3(1.00, 0.80, 0.65) * 1.0 * smoothstep(0.08, 0.0, abs(d.x + 0.85)) * smoothstep(-0.2, 0.3, d.y) * smoothstep(0.8, 0.4, d.y);
  return col;
}

// thin-film iridescence: interference colour from view angle + film thickness
vec3 thinFilm(float cosTheta, float thickness) {
  float d = thickness * (1.0 - cosTheta * 0.5);
  return 0.5 + 0.5 * cos(6.2831 * (vec3(0.0, 0.33, 0.67) + d));
}

vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

// sparse particle field on three parallax planes
float particles(vec2 uv) {
  float acc = 0.0;
  for (int L = 0; L < 3; L++) {
    float fl = float(L);
    float scale = 7.0 + fl * 6.0;
    vec2 g = uv * scale + vec2(uTime * (0.02 + fl * 0.01), uTime * 0.012) + uPointer * (0.15 + fl * 0.12);
    vec2 id = floor(g); vec2 f = fract(g) - 0.5;
    float h = hash(id + fl * 17.0);
    if (h > 0.82) {
      vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
      float d = length(f - o * 0.6);
      float tw = 0.6 + 0.4 * sin(uTime * (1.0 + h * 2.0) + h * 40.0);
      acc += smoothstep(0.06 / (1.0 + fl), 0.0, d) * tw * (0.35 + 0.25 * fl);
    }
  }
  return acc;
}

// out-of-focus bokeh discs (depth of field on the far particle plane)
float bokeh(vec2 uv) {
  float acc = 0.0;
  vec2 g = uv * 3.2 + vec2(uTime * 0.015, -uTime * 0.01) + uPointer * 0.05;
  vec2 id = floor(g); vec2 f = fract(g) - 0.5;
  float h = hash(id + 91.0);
  if (h > 0.55) {
    vec2 o = (vec2(hash(id + 5.0), hash(id + 9.0)) - 0.5) * 0.5;
    float r = 0.07 + 0.09 * hash(id + 2.0);
    float d = length(f - o);
    float disc = smoothstep(r, r - 0.02, d);
    float ring = smoothstep(0.012, 0.0, abs(d - r + 0.006)) * 0.6;
    acc += (disc * 0.10 + ring * 0.08) * (0.6 + 0.4 * sin(uTime * 0.4 + h * 20.0));
  }
  return acc;
}

vec3 shadeForm(vec3 p, vec3 rd, vec3 tint) {
    vec3 n = nrm(p);
    vec3 v = -rd;
    float NoV = max(dot(n, v), 0.0);
    float F = 0.04 + 0.96 * pow(1.0 - NoV, 5.0);
    vec3 refl = env(reflect(rd, n));

    // three studio lights, GGX-like lobes (roughness ~0.18)
    vec3 spec = vec3(0.0);
    vec3 L[3]; L[0] = normalize(vec3(-0.6, 0.8, 0.6)); L[1] = normalize(vec3(0.9, 0.2, 0.4)); L[2] = normalize(vec3(0.0, -0.6, -1.0));
    vec3 C[3]; C[0] = vec3(1.0, 0.96, 0.9) * 2.2; C[1] = tint * 1.6; C[2] = vec3(0.6, 0.65, 1.0) * 1.2;
    float a2 = 0.18 * 0.18;
    for (int k = 0; k < 3; k++) {
      vec3 h = normalize(L[k] + v);
      float NoH = max(dot(n, h), 0.0);
      float D = a2 / (PI * pow(NoH * NoH * (a2 - 1.0) + 1.0, 2.0));
      spec += C[k] * D * max(dot(n, L[k]), 0.0) * 0.12;
    }

    vec3 film = thinFilm(NoV, 1.4 + 0.35 * sin(uTime * 0.3) + p.y * 0.4);
    vec3 body = mix(vec3(0.012, 0.015, 0.03), tint * 0.22, 0.45);           // dark tinted glass body
    vec3 iridescent = mix(tint, film, 0.45);
    vec3 surf = body * (0.25 + 0.75 * max(dot(n, L[0]), 0.0)) + refl * iridescent * (0.08 + 0.9 * F) + spec;
    // rim
    surf += mix(tint, film, 0.5) * pow(1.0 - NoV, 2.5) * 1.1;

    return surf;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * uRes) / uRes.y;

  // bounded camera choreography: gentle dolly + parallax
  vec3 ro = vec3(uPointer.x * 0.35, uPointer.y * 0.2, 5.8 - uHue * 0.6);
  vec3 ta = vec3(0.0);
  vec3 ww = normalize(ta - ro);
  vec3 uu = normalize(cross(ww, vec3(0.0, 1.0, 0.0)));
  vec3 vv = cross(uu, ww);
  vec3 rd = normalize(uv.x * uu + uv.y * vv + 1.8 * ww);

  vec3 tint = ventureTint(uHue);

  // atmosphere: soft halo behind the form
  // everything fades to zero before the canvas edge, so no rectangle ever shows
  float edgeMask = smoothstep(0.5, 0.18, max(abs(uv.x) * uRes.y / uRes.x * 1.0, abs(uv.y)) );
  float halo = exp(-length(uv) * 2.2) * edgeMask;
  vec3 col = tint * halo * 0.22;
  float alpha = halo * 0.35;

  // particles
  float pt = particles(uv) * edgeMask;
  col += vec3(0.85, 0.88, 1.0) * pt;
  alpha = max(alpha, pt);

  // raymarch with cone-traced edge coverage (smooth silhouette at low render scale)
  float t = 0.0; bool hit = false;
  float dmin = 1e5; float tmin = 0.0;
  float pixAngle = 1.0 / (uRes.y * 1.8);
  int steps = uQuality > 0.5 ? 90 : 55;
  for (int i = 0; i < 90; i++) {
    if (i >= steps) break;
    float d = sdForm(ro + rd * t);
    float rel = d / max(t, 0.001);
    if (rel < dmin && t > 0.5) { dmin = rel; tmin = t; }
    if (d < 0.0008) { hit = true; break; }
    t += d;
    if (t > 8.0) break;
  }

  if (hit) {
    col = shadeForm(ro + rd * t, rd, tint);
    alpha = 1.0;
  } else if (dmin < 1.5 * pixAngle) {
    float cov = 1.0 - dmin / (1.5 * pixAngle);
    vec3 edge = shadeForm(ro + rd * tmin, rd, tint);
    col = mix(col, edge, cov);
    alpha = max(alpha, cov);
  }

  // ---- lens & atmosphere (screen space) ----
  // volumetric key-light beam falling from the upper left
  vec2 bdir = normalize(vec2(0.55, -1.0));
  float along = dot(uv - vec2(-0.55, 0.62), bdir);
  float across = abs(dot(uv - vec2(-0.55, 0.62), vec2(-bdir.y, bdir.x)));
  float beam = smoothstep(0.0, 0.35, along) * exp(-across * (6.0 - along * 2.5)) * exp(-along * 1.1) * 0.10 * edgeMask;
  col += vec3(0.85, 0.88, 1.0) * beam;
  alpha = max(alpha, beam);

  // bokeh (defocused far plane)
  float bk = bokeh(uv) * edgeMask;
  col += mix(vec3(0.75, 0.8, 1.0), tint, 0.5) * bk;
  alpha = max(alpha, bk);

  // anamorphic streak + glare from the key highlight on the form
  vec3 hn = normalize(normalize(vec3(-0.6, 0.8, 0.6)) + normalize(ro));
  vec3 hp = hn * 1.12;
  vec2 hs = (vec2(dot(hp - ro, uu), dot(hp - ro, vv)) / dot(hp - ro, ww)) * 1.8;
  vec2 dq = uv - hs;
  float streak = exp(-abs(dq.y) * 140.0) * exp(-abs(dq.x) * 3.2) * 0.55;
  float glare = exp(-length(dq) * 22.0) * 0.6;
  vec3 flare = vec3(0.70, 0.76, 1.0) * streak + vec3(1.0, 0.96, 0.9) * glare;
  col += flare * edgeMask;
  alpha = max(alpha, max(streak, glare) * edgeMask);

  // soft bloom approximation: lift bright surface values
  col += max(col - 0.8, 0.0) * 0.6;

  col = aces(col * 1.05);
  // filmic split-tone: cool shadows, warm highlights
  float lum = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(col * vec3(0.94, 0.97, 1.06), col * vec3(1.04, 1.0, 0.95), smoothstep(0.2, 0.8, lum));
  // fine grain
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.0) - 0.5) * 0.01;
  col = pow(max(col, 0.0), vec3(1.0 / 2.2));
  gl_FragColor = vec4(col * alpha, alpha);
}
`;
