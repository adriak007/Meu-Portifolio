"use client";

import { useEffect, useRef } from "react";

// ─── Ajustes de cor e performance ────────────────────────────────────────────
// Edite aqui sem tocar no resto do código.
const CFG = {
  /** Resolução da grade de simulação física (velocidade/pressão). Menor = mais rápido. */
  SIM_RESOLUTION: 96,
  /** Resolução do campo de cor visível. Pode ser maior que SIM_RESOLUTION sem pesar muito. */
  DYE_RESOLUTION: 640,
  /** Quanto tempo o rastro de cor leva para desaparecer (1 = nunca dissipa). */
  DENSITY_DISSIPATION: 0.985,
  /** Quanto tempo o movimento continua após o mouse parar — efeito de viscosidade. */
  VELOCITY_DISSIPATION: 0.992,
  /** Dissipação da pressão entre frames (estabilidade do solver). */
  PRESSURE_DISSIPATION: 0.8,
  /** Iterações do solver de pressão (mais = mais correto, porém mais pesado). */
  PRESSURE_ITERATIONS: 20,
  /** Intensidade dos vórtices/redemoinhos — dá o aspecto orgânico ao movimento. */
  CURL_STRENGTH: 22,
  /** Raio da "pegada" do cursor no fluido. */
  SPLAT_RADIUS: 0.22,
  /** Força ao mover o mouse (empurra o fluido). */
  SPLAT_FORCE: 3600,
  /** Força contínua ao clicar e segurar (atrai/suga o fluido para o cursor). */
  ATTRACT_FORCE: 3000,
  /** Paleta de cores — already alinhada à identidade visual violeta do site. */
  COLOR_PALETTE: [
    [0.486, 0.227, 0.929], // #7c3aed
    [0.655, 0.545, 0.980], // #a78bfa
    [0.388, 0.400, 0.945], // #6366f1
    [0.769, 0.710, 0.992], // #c4b5fd
  ] as const,
  /** Velocidade com que a cor do jato percorre a paleta acima. */
  COLOR_CYCLE_SPEED: 0.1,
  /** Intensidade de cada respingo de cor (mantém o efeito sutil, de fundo). */
  COLOR_INTENSITY: 0.16,
  /** Cor de fundo — deve bater com --bg do globals.css (#0c0c14). */
  BACKGROUND_COLOR: [0.047, 0.047, 0.078] as const,
  /** Limite de pixel ratio (telas retina). */
  MAX_DPR: 1.25,
};

// ─── Shaders ──────────────────────────────────────────────────────────────────
const baseVertexShader = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const splatShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 value;
  uniform vec2 point;
  uniform float radius;
  uniform float radial;
  void main () {
    vec2 p = vUv - point;
    p.x *= aspectRatio;
    float falloff = exp(-dot(p, p) / radius);
    vec2 toCenter = -p / (length(p) + 1e-5);
    vec2 radialForce = toCenter * length(value.xy);
    vec3 finalValue = vec3(mix(value.xy, radialForce, radial), value.z);
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + finalValue * falloff, 1.0);
  }
`;

const advectionShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;
  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    gl_FragColor = dissipation * texture2D(uSource, coord);
  }
`;

const divergenceShader = `
  precision highp float;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`;

const curlShader = `
  precision highp float;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`;

const vorticityShader = `
  precision highp float;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curlStrength;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 1e-5;
    force *= curlStrength * C;
    force.y *= -1.0;
    vec2 vel = texture2D(uVelocity, vUv).xy;
    gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
  }
`;

const pressureShader = `
  precision highp float;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`;

const gradientSubtractShader = `
  precision highp float;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`;

const clearShader = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`;

const displayShader = `
  precision highp float;
  varying vec2 vUv, vL, vR, vT, vB;
  uniform sampler2D uTexture;
  uniform vec3 uBackgroundColor;
  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;

    float lL = dot(texture2D(uTexture, vL).rgb, vec3(0.299, 0.587, 0.114));
    float lR = dot(texture2D(uTexture, vR).rgb, vec3(0.299, 0.587, 0.114));
    float lT = dot(texture2D(uTexture, vT).rgb, vec3(0.299, 0.587, 0.114));
    float lB = dot(texture2D(uTexture, vB).rgb, vec3(0.299, 0.587, 0.114));

    vec3 normal = normalize(vec3(lL - lR, lB - lT, 0.62));
    vec3 lightDir = normalize(vec3(0.35, 0.45, 0.85));
    float diffuse = max(dot(normal, lightDir), 0.0);
    float specular = pow(max(dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0)), 0.0), 26.0);

    vec3 base = mix(uBackgroundColor, c, clamp(length(c) * 1.5, 0.0, 1.0));
    vec3 lit = base * (0.55 + diffuse * 0.7) + vec3(1.0) * specular * 0.85;

    gl_FragColor = vec4(lit, 1.0);
  }
`;

// ─── Tipos auxiliares ─────────────────────────────────────────────────────────
interface ProgramInfo {
  program: WebGLProgram;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface FBO {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  attach: (unit: number) => number;
}

interface DoubleFBO {
  width: number;
  height: number;
  read: FBO;
  write: FBO;
  swap: () => void;
}

interface Pointer {
  x: number;
  y: number;
  dx: number;
  dy: number;
  down: boolean;
  moved: boolean;
}

export function FluidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Contexto WebGL + extensões de textura de ponto flutuante ───────────
    function getWebGLContext(canvas: HTMLCanvasElement) {
      const params: WebGLContextAttributes = {
        alpha: false, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false,
      };
      let gl: WebGLRenderingContext | WebGL2RenderingContext | null = canvas.getContext("webgl2", params);
      const isWebGL2 = !!gl;
      if (!isWebGL2) {
        gl = (canvas.getContext("webgl", params) ??
          canvas.getContext("experimental-webgl", params)) as WebGLRenderingContext | null;
      }
      if (!gl) return null;

      let halfFloatTexType: number | null;
      let formatRGBA: number;
      let supportLinearFiltering: boolean;

      if (isWebGL2) {
        const gl2 = gl as WebGL2RenderingContext;
        gl2.getExtension("EXT_color_buffer_float");
        supportLinearFiltering = !!gl2.getExtension("OES_texture_float_linear");
        halfFloatTexType = gl2.HALF_FLOAT;
        formatRGBA = gl2.RGBA16F;
      } else {
        const halfFloat = gl.getExtension("OES_texture_half_float");
        supportLinearFiltering = !!gl.getExtension("OES_texture_half_float_linear");
        halfFloatTexType = halfFloat ? halfFloat.HALF_FLOAT_OES : null;
        formatRGBA = gl.RGBA;
      }
      if (!halfFloatTexType) return null;

      const testTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, testTex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, isWebGL2 ? formatRGBA : gl.RGBA, 4, 4, 0, gl.RGBA, halfFloatTexType, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, testTex, 0);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.deleteFramebuffer(fbo);
      gl.deleteTexture(testTex);
      if (!ok) return null;

      return { gl, isWebGL2, halfFloatTexType, formatRGBA, supportLinearFiltering };
    }

    const webgl = getWebGLContext(canvas);
    if (!webgl) return; // sem suporte — o fundo CSS estático permanece visível
    const { gl, isWebGL2, halfFloatTexType, formatRGBA, supportLinearFiltering } = webgl;
    const texFilter = supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    function applyCanvasSize() {
      const dpr = Math.min(window.devicePixelRatio || 1, CFG.MAX_DPR);
      const w = Math.round(window.innerWidth * dpr);
      const h = Math.round(window.innerHeight * dpr);
      const changed = canvas!.width !== w || canvas!.height !== h;
      canvas!.width = w;
      canvas!.height = h;
      return changed;
    }
    applyCanvasSize();

    // ── Compilação de shaders/programas ─────────────────────────────────────
    function compileShader(type: number, source: string): WebGLShader {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("[FluidBackground] shader error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    }

    function createProgram(vertexSource: string, fragmentSource: string): ProgramInfo {
      const program = gl.createProgram()!;
      gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexSource));
      gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentSource));
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.warn("[FluidBackground] program link error:", gl.getProgramInfoLog(program));
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const name = gl.getActiveUniform(program, i)!.name;
        uniforms[name] = gl.getUniformLocation(program, name);
      }
      return { program, uniforms };
    }

    function useProgram(p: ProgramInfo) {
      gl.useProgram(p.program);
      return p;
    }

    const quadVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    const quadIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, quadIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    function blit(target: FBO | null) {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    }

    const programs = {
      splat: createProgram(baseVertexShader, splatShader),
      advection: createProgram(baseVertexShader, advectionShader),
      divergence: createProgram(baseVertexShader, divergenceShader),
      curl: createProgram(baseVertexShader, curlShader),
      vorticity: createProgram(baseVertexShader, vorticityShader),
      pressure: createProgram(baseVertexShader, pressureShader),
      gradientSubtract: createProgram(baseVertexShader, gradientSubtractShader),
      clear: createProgram(baseVertexShader, clearShader),
      display: createProgram(baseVertexShader, displayShader),
    };

    // ── Framebuffers ─────────────────────────────────────────────────────────
    function createFBO(w: number, h: number): FBO {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texFilter);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, isWebGL2 ? formatRGBA : gl.RGBA, w, h, 0, gl.RGBA, halfFloatTexType!, null);

      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        texture, fbo, width: w, height: h,
        attach(unit: number) {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        },
      };
    }

    function createDoubleFBO(w: number, h: number): DoubleFBO {
      let fbo1 = createFBO(w, h);
      let fbo2 = createFBO(w, h);
      return {
        width: w, height: h,
        get read() { return fbo1; },
        get write() { return fbo2; },
        swap() { const tmp = fbo1; fbo1 = fbo2; fbo2 = tmp; },
      };
    }

    function getResolution(resolution: number) {
      const aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      const a = aspect < 1 ? 1 / aspect : aspect;
      const max = Math.round(resolution * a);
      const min = Math.round(resolution);
      return aspect < 1 ? { width: min, height: max } : { width: max, height: min };
    }

    let simRes = getResolution(CFG.SIM_RESOLUTION);
    let dyeRes = getResolution(CFG.DYE_RESOLUTION);

    let velocity = createDoubleFBO(simRes.width, simRes.height);
    let dye = createDoubleFBO(dyeRes.width, dyeRes.height);
    const divergence = createFBO(simRes.width, simRes.height);
    const curlFBO = createFBO(simRes.width, simRes.height);
    let pressure = createDoubleFBO(simRes.width, simRes.height);

    // ── Entrada do usuário (mouse / toque) — em nível de janela, já que o
    //    canvas tem pointer-events:none para não bloquear o resto do site ──
    const pointers = new Map<number, Pointer>();

    function makePointer(): Pointer {
      return { x: 0, y: 0, dx: 0, dy: 0, down: false, moved: false };
    }

    function getSplatColor(t: number): [number, number, number] {
      const palette = CFG.COLOR_PALETTE;
      const pos = (t * CFG.COLOR_CYCLE_SPEED) % palette.length;
      const i = Math.floor(pos);
      const f = pos - i;
      const a = palette[i];
      const b = palette[(i + 1) % palette.length];
      return [
        (a[0] + (b[0] - a[0]) * f) * CFG.COLOR_INTENSITY,
        (a[1] + (b[1] - a[1]) * f) * CFG.COLOR_INTENSITY,
        (a[2] + (b[2] - a[2]) * f) * CFG.COLOR_INTENSITY,
      ];
    }

    function updatePointer(id: number, clientX: number, clientY: number, isDown?: boolean) {
      const x = clientX / window.innerWidth;
      const y = 1.0 - clientY / window.innerHeight;
      let p = pointers.get(id);
      if (!p) {
        p = makePointer();
        p.x = x; p.y = y;
        pointers.set(id, p);
      }
      p.dx = (x - p.x) * 8.0;
      p.dy = (y - p.y) * 8.0;
      p.x = x; p.y = y;
      p.moved = Math.abs(p.dx) > 0 || Math.abs(p.dy) > 0;
      if (isDown !== undefined) p.down = isDown;
    }

    const onMouseMove = (e: MouseEvent) => updatePointer(1, e.clientX, e.clientY);
    const onMouseDown = (e: MouseEvent) => updatePointer(1, e.clientX, e.clientY, true);
    const onMouseUp = () => { const p = pointers.get(1); if (p) p.down = false; };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updatePointer(1, t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown, { passive: true });
    window.addEventListener("mouseup", onMouseUp, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    // ── Passes de simulação ──────────────────────────────────────────────────
    function splat(target: DoubleFBO, x: number, y: number, dx: number, dy: number, dz: number, radial: boolean) {
      useProgram(programs.splat);
      gl.uniform1i(programs.splat.uniforms.uTarget, target.read.attach(0));
      gl.uniform1f(programs.splat.uniforms.aspectRatio, canvas!.width / canvas!.height);
      gl.uniform2f(programs.splat.uniforms.point, x, y);
      gl.uniform3f(programs.splat.uniforms.value, dx, dy, dz);
      gl.uniform1f(programs.splat.uniforms.radius, CFG.SPLAT_RADIUS / 100.0);
      gl.uniform1f(programs.splat.uniforms.radial, radial ? 1.0 : 0.0);
      blit(target.write);
      target.swap();
    }

    let timeAccum = 0;

    function applyInputs() {
      pointers.forEach((p) => {
        if (p.moved) {
          const color = getSplatColor(timeAccum);
          splat(velocity, p.x, p.y, p.dx * CFG.SPLAT_FORCE, p.dy * CFG.SPLAT_FORCE, 0, false);
          splat(dye, p.x, p.y, color[0], color[1], color[2], false);
          p.moved = false;
        }
        if (p.down) {
          splat(velocity, p.x, p.y, CFG.ATTRACT_FORCE, 0, 0, true);
          const color = getSplatColor(timeAccum);
          splat(dye, p.x, p.y, color[0] * 0.4, color[1] * 0.4, color[2] * 0.4, false);
        }
      });
    }

    function step(dt: number) {
      gl.disable(gl.BLEND);

      useProgram(programs.curl);
      gl.uniform2f(programs.curl.uniforms.texelSize, 1.0 / simRes.width, 1.0 / simRes.height);
      gl.uniform1i(programs.curl.uniforms.uVelocity, velocity.read.attach(0));
      blit(curlFBO);

      useProgram(programs.vorticity);
      gl.uniform2f(programs.vorticity.uniforms.texelSize, 1.0 / simRes.width, 1.0 / simRes.height);
      gl.uniform1i(programs.vorticity.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(programs.vorticity.uniforms.uCurl, curlFBO.attach(1));
      gl.uniform1f(programs.vorticity.uniforms.curlStrength, CFG.CURL_STRENGTH);
      gl.uniform1f(programs.vorticity.uniforms.dt, dt);
      blit(velocity.write);
      velocity.swap();

      useProgram(programs.divergence);
      gl.uniform2f(programs.divergence.uniforms.texelSize, 1.0 / simRes.width, 1.0 / simRes.height);
      gl.uniform1i(programs.divergence.uniforms.uVelocity, velocity.read.attach(0));
      blit(divergence);

      useProgram(programs.clear);
      gl.uniform1i(programs.clear.uniforms.uTexture, pressure.read.attach(0));
      gl.uniform1f(programs.clear.uniforms.value, CFG.PRESSURE_DISSIPATION);
      blit(pressure.write);
      pressure.swap();

      useProgram(programs.pressure);
      gl.uniform2f(programs.pressure.uniforms.texelSize, 1.0 / simRes.width, 1.0 / simRes.height);
      gl.uniform1i(programs.pressure.uniforms.uDivergence, divergence.attach(0));
      for (let i = 0; i < CFG.PRESSURE_ITERATIONS; i++) {
        gl.uniform1i(programs.pressure.uniforms.uPressure, pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      useProgram(programs.gradientSubtract);
      gl.uniform2f(programs.gradientSubtract.uniforms.texelSize, 1.0 / simRes.width, 1.0 / simRes.height);
      gl.uniform1i(programs.gradientSubtract.uniforms.uPressure, pressure.read.attach(0));
      gl.uniform1i(programs.gradientSubtract.uniforms.uVelocity, velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      useProgram(programs.advection);
      gl.uniform2f(programs.advection.uniforms.texelSize, 1.0 / simRes.width, 1.0 / simRes.height);
      gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(programs.advection.uniforms.uSource, velocity.read.attach(0));
      gl.uniform1f(programs.advection.uniforms.dt, dt);
      gl.uniform1f(programs.advection.uniforms.dissipation, CFG.VELOCITY_DISSIPATION);
      blit(velocity.write);
      velocity.swap();

      gl.uniform2f(programs.advection.uniforms.texelSize, 1.0 / dyeRes.width, 1.0 / dyeRes.height);
      gl.uniform1i(programs.advection.uniforms.uVelocity, velocity.read.attach(0));
      gl.uniform1i(programs.advection.uniforms.uSource, dye.read.attach(1));
      gl.uniform1f(programs.advection.uniforms.dissipation, CFG.DENSITY_DISSIPATION);
      blit(dye.write);
      dye.swap();
    }

    function render() {
      useProgram(programs.display);
      gl.uniform1i(programs.display.uniforms.uTexture, dye.read.attach(0));
      gl.uniform3f(programs.display.uniforms.uBackgroundColor, ...CFG.BACKGROUND_COLOR);
      blit(null);
    }

    // ── Redimensionamento ────────────────────────────────────────────────────
    function onResize() {
      if (applyCanvasSize()) {
        dyeRes = getResolution(CFG.DYE_RESOLUTION);
        dye = createDoubleFBO(dyeRes.width, dyeRes.height);
      }
    }
    window.addEventListener("resize", onResize, { passive: true });

    let contextLost = false;
    const onContextLost = (e: Event) => { e.preventDefault(); contextLost = true; };
    const onContextRestored = () => window.location.reload();
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    // ── Loop principal ───────────────────────────────────────────────────────
    let rafId = 0;
    let lastTime = performance.now();

    function loop(now: number) {
      if (contextLost) return;
      const dt = Math.min((now - lastTime) / 1000, 1 / 30);
      lastTime = now;
      timeAccum += dt;

      applyInputs();
      step(dt);
      render();

      rafId = requestAnimationFrame(loop);
    }
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
