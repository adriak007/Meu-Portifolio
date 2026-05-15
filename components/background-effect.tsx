'use client';

import { useEffect, useRef } from 'react';

// ─── Ajustes de cor e performance ────────────────────────────────────────────
// Edite aqui sem tocar no resto do código.
const CFG = {
  /** Velocidade da animação — menor = mais etéreo */
  speed: 0.14,
  /** Octaves do FBM — mais = mais detalhe, mais pesado (recomendado: 3) */
  octaves: 3,
  /** Intensidade do mouse — 0 = nenhuma, 0.4 = forte */
  mouseStrength: 0.28,
  /** Suavização do mouse — menor = mais lento/suave (0.02–0.08) */
  mouseEasing: 0.045,
  /** DPR máximo (limita trabalho da GPU; 1.5 é seguro para 60fps) */
  maxDPR: 1.5,
  /** Cores em sRGB linear 0–1. Ajuste aqui para mudar toda a paleta. */
  colors: {
    /** Fundo base — deve bater com --bg do globals.css (#0c0c14) */
    base:   [0.047, 0.047, 0.078] as const,
    /** Camada 1: índigo profundo */
    indigo: [0.036, 0.040, 0.172] as const,
    /** Camada 2: roxo escuro */
    purple: [0.075, 0.028, 0.210] as const,
    /** Destaque: violeta suave — bate com --primary (#a78bfa) */
    accent: [0.655, 0.545, 0.980] as const,
  },
} as const;

// ─── Vertex shader (pass-through quad) ───────────────────────────────────────
const VERT = `
attribute vec2 a_pos;
void main(){gl_Position=vec4(a_pos,0.,1.);}
`;

// ─── Fragment shader: fluído + warping de domínio + reação ao mouse ──────────
function buildFrag(cfg: typeof CFG): string {
  const { colors: c } = cfg;
  return `precision mediump float;

uniform float u_t;
uniform vec2  u_res;
uniform vec2  u_mouse;

// ── Simplex noise 3D (Ashima Arts / MIT) ─────────────────────────────────
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 tiSq(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz),l=1.-g;
  vec3 i1=min(g.xyz,l.zxy),i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.x,x2=x0-i2+C.y,x3=x0-D.y;
  i=mod289(i);
  vec4 p=perm(perm(perm(
    i.z+vec4(0.,i1.z,i2.z,1.))+
    i.y+vec4(0.,i1.y,i2.y,1.))+
    i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z),y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy,y=y_*ns.x+ns.yyyy,h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy),b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.,s1=floor(b1)*2.+1.,sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy,a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x),p1=vec3(a0.zw,h.y),p2=vec3(a1.xy,h.z),p3=vec3(a1.zw,h.w);
  vec4 norm=tiSq(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m*=m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}

// ── FBM (Fractal Brownian Motion) ────────────────────────────────────────────
float fbm(vec3 p){
  float v=0.,a=.5;
  for(int i=0;i<${cfg.octaves};i++){
    v+=a*snoise(p);
    p=p*2.1+vec3(1.7,9.2,3.1);
    a*=.5;
  }
  return v;
}

// ── Paleta de cores ───────────────────────────────────────────────────────────
const vec3 COL_BASE   = vec3(${c.base[0]},${c.base[1]},${c.base[2]});
const vec3 COL_INDIGO = vec3(${c.indigo[0]},${c.indigo[1]},${c.indigo[2]});
const vec3 COL_PURPLE = vec3(${c.purple[0]},${c.purple[1]},${c.purple[2]});
const vec3 COL_ACCENT = vec3(${c.accent[0]},${c.accent[1]},${c.accent[2]});

void main(){
  vec2 uv  = gl_FragCoord.xy / u_res;
  vec2 asp = vec2(u_res.x / u_res.y, 1.0);
  float t  = u_t * ${cfg.speed};

  // ── Influência do mouse ──────────────────────────────────────────────────
  vec2  mdir  = (uv - u_mouse) * asp;
  float md    = length(mdir);
  float mg    = exp(-md * 3.2) * ${cfg.mouseStrength};
  vec2  mdisp = normalize(mdir + 0.0001) * mg;

  // ── Domain warping em dois níveis (fluído orgânico) ──────────────────────
  vec3  p = vec3((uv + mdisp) * 1.75, t);
  float q = fbm(p);
  float f = fbm(p + vec3(q * 1.5, q * 0.9, 0.38));
  f = clamp(f * 0.5 + 0.5, 0.0, 1.0);

  // ── Mapeamento de cores ──────────────────────────────────────────────────
  vec3 col = COL_BASE;
  col = mix(col, COL_INDIGO, smoothstep(0.28, 0.58, f) * 0.88);
  col = mix(col, COL_PURPLE, smoothstep(0.52, 0.80, f) * 0.78);
  col += COL_ACCENT * smoothstep(0.72, 0.94, f) * 0.10;

  // ── Brilho suave onde o mouse está ──────────────────────────────────────
  float glow = exp(-md * 1.9) * 0.22;
  col += COL_ACCENT * glow;

  // ── Vignette radial ──────────────────────────────────────────────────────
  vec2  vc  = uv - 0.5;
  float vig = 1.0 - dot(vc, vc) * 1.6;
  col *= clamp(vig, 0.06, 1.0);

  gl_FragColor = vec4(col, 1.0);
}`;
}

// ─── Helpers WebGL ────────────────────────────────────────────────────────────
function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[BackgroundEffect] shader error:', gl.getShaderInfoLog(s));
    }
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertSrc: string,
  fragSrc: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[BackgroundEffect] link error:', gl.getProgramInfoLog(prog));
    }
    gl.deleteProgram(prog);
    return null;
  }
  return prog;
}

// ─── Componente ───────────────────────────────────────────────────────────────
export function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respeita prefers-reduced-motion — não anima
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const gl = (
      canvas.getContext('webgl', { alpha: false, antialias: false }) ??
      (canvas.getContext('experimental-webgl', { alpha: false }) as WebGLRenderingContext | null)
    );
    if (!gl) return; // Graceful degradation: fundo CSS sólido permanece visível

    const prog = createProgram(gl, VERT, buildFrag(CFG));
    if (!prog) return;
    gl.useProgram(prog);

    // Quad que cobre a tela inteira
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uT     = gl.getUniformLocation(prog, 'u_t');
    const uRes   = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    // Posição do mouse com lerp (suavização)
    let mx = 0.5, my = 0.5;
    let tx = 0.5, ty = 0.5;

    const onMouseMove = (e: MouseEvent) => {
      tx = e.clientX / window.innerWidth;
      ty = 1.0 - e.clientY / window.innerHeight; // Y invertido para WebGL
    };
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) return;
      tx = touch.clientX / window.innerWidth;
      ty = 1.0 - touch.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    // Resolução com cap de DPR para performance
    let cw = 0, ch = 0;
    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        isMobile ? 1.0 : CFG.maxDPR,
      );
      cw = Math.round(window.innerWidth  * dpr);
      ch = Math.round(window.innerHeight * dpr);
      canvas.width  = cw;
      canvas.height = ch;
      gl.viewport(0, 0, cw, ch);
    };
    onResize();
    window.addEventListener('resize', onResize, { passive: true });

    // Loop de render
    let rafId = 0;
    const t0   = performance.now();
    const ease = CFG.mouseEasing;

    const tick = () => {
      mx += (tx - mx) * ease;
      my += (ty - my) * ease;

      const elapsed = (performance.now() - t0) / 1000;
      gl.uniform1f(uT,     elapsed);
      gl.uniform2f(uRes,   cw, ch);
      gl.uniform2f(uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      gl.deleteProgram(prog);
      gl.deleteBuffer(buf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
