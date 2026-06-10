"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

// ── Constantes de física ───────────────────────────────────────────────────────
const CORD_LENGTH  = 200;    // px — comprimento do cordão
const GRAVITY      = 1100;   // px/s²
const PEND_DAMP    = 0.9984; // amortecimento do pêndulo — balança ~10x antes de parar
const BADGE_SPRING = 7;      // rigidez da mola do giro do crachá (baixo = mais solto)
const BADGE_DAMP   = 3;      // amortecimento do giro do crachá
const MAX_ANGLE    = Math.PI * 0.72;
const MAX_OMEGA    = 12;     // rad/s — limite de velocidade

export function PhysicsBadge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const state = useRef({
    // ── Pêndulo (corda) ──────────────────────────────────────
    angle: 0.54,    // ângulo inicial: ~31 graus — visível e dramático
    omega: -0.25,   // pequeno impulso inicial

    // ── Corpo do crachá (grau de liberdade independente) ─────
    // O crachá é atraído para o ângulo da corda por uma mola
    // mas tem inércia própria → wobble realista
    badgeRot:   0.54,  // começa alinhado com a corda
    badgeOmega: -1.4,  // giro inicial — efeito dramático ao carregar a página

    // ── Drag ────────────────────────────────────────────────
    isDragging:   false,
    prevAngle:    0,
    prevTime:     0,
    pointerOmega: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    const badge     = badgeRef.current;
    if (!container || !canvas || !badge) return;

    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    const pivot = () => ({ x: container.offsetWidth / 2, y: 22 });

    const syncCanvas = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    syncCanvas();

    const ro = new ResizeObserver(syncCanvas);
    ro.observe(container);

    // Converte coordenada da tela em ângulo relativo ao pivô
    const screenToAngle = (cx: number, cy: number) => {
      const rect = container.getBoundingClientRect();
      const p    = pivot();
      return Math.atan2(cx - (rect.left + p.x), cy - (rect.top + p.y));
    };

    // ── Eventos de ponteiro ────────────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      const r   = badge.getBoundingClientRect();
      const pad = 16;
      if (
        e.clientX < r.left  - pad || e.clientX > r.right  + pad ||
        e.clientY < r.top   - pad || e.clientY > r.bottom + pad
      ) return;

      const s      = state.current;
      s.isDragging   = true;
      s.omega        = 0;
      s.badgeOmega   = 0;
      s.pointerOmega = 0;
      s.prevAngle    = screenToAngle(e.clientX, e.clientY);
      s.prevTime     = performance.now();
      container.setPointerCapture(e.pointerId);
      document.body.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      const s = state.current;
      if (!s.isDragging) return;

      const now      = performance.now();
      const newAngle = screenToAngle(e.clientX, e.clientY);
      const dt       = (now - s.prevTime) / 1000;

      if (dt > 0.001) {
        let da = newAngle - s.prevAngle;
        if (da >  Math.PI) da -= 2 * Math.PI;
        if (da < -Math.PI) da += 2 * Math.PI;
        s.pointerOmega = da / dt;
      }

      s.angle    = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, newAngle));
      s.prevAngle = newAngle;
      s.prevTime  = now;
      e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      const s = state.current;
      if (!s.isDragging) return;
      s.isDragging = false;

      // Transfere velocidade do drag para o pêndulo e para o giro do crachá
      const clampedOmega = Math.max(-MAX_OMEGA, Math.min(MAX_OMEGA, s.pointerOmega));
      s.omega      = clampedOmega * 0.62;
      s.badgeOmega = clampedOmega * 0.45; // crachá gira em resposta ao arremesso

      document.body.style.cursor = "";
      e.preventDefault();
    };

    container.addEventListener("pointerdown",   onPointerDown);
    container.addEventListener("pointermove",   onPointerMove);
    container.addEventListener("pointerup",     onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    // ── Loop de animação ───────────────────────────────────────────────────────
    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05); // cap em 50ms
      lastTime = now;

      const s = state.current;
      const p = pivot();

      // ── Física do pêndulo ────────────────────────────────────────────────
      if (!s.isDragging) {
        const alpha = -(GRAVITY / CORD_LENGTH) * Math.sin(s.angle);
        s.omega = (s.omega + alpha * dt) * Math.pow(PEND_DAMP, dt * 60);
        s.omega = Math.max(-MAX_OMEGA, Math.min(MAX_OMEGA, s.omega));
        s.angle += s.omega * dt;
        s.angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, s.angle));
      }

      // ── Física do giro do crachá (mola + amortecimento) ─────────────────
      // O crachá é atraído para o ângulo da corda, mas com inércia própria
      // Isso cria o "wobble" realista: o crachá oscila independente da corda
      const springForce = -(s.badgeRot - s.angle) * BADGE_SPRING;
      const dampForce   = -s.badgeOmega * BADGE_DAMP;
      const badgeAlpha  = springForce + dampForce;

      s.badgeOmega += badgeAlpha * dt;
      s.badgeRot   += s.badgeOmega * dt;

      // ── Posição do crachá ────────────────────────────────────────────────
      const bx = p.x + Math.sin(s.angle) * CORD_LENGTH;
      const by = p.y + Math.cos(s.angle) * CORD_LENGTH;
      const bw = badge.offsetWidth;

      badge.style.left      = `${bx - bw / 2}px`;
      badge.style.top       = `${by}px`;
      badge.style.transform = `rotate(${s.badgeRot}rad)`;

      // ── Desenhar cordão ──────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cordão mais tensionado quando rápido, mais flácido quando lento
      const speed = Math.abs(s.omega);
      const sag   = Math.max(3, 14 - speed * 12) + Math.abs(s.angle) * 16;
      const cpx   = (p.x + bx) / 2;
      const cpy   = (p.y + by) / 2 + sag;

      // Sombra do cordão
      ctx.strokeStyle = "rgba(50,15,100,0.45)";
      ctx.lineWidth   = 4.5;
      ctx.lineCap     = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 1.8);
      ctx.quadraticCurveTo(cpx, cpy + 1.8, bx, by + 1.8);
      ctx.stroke();

      // Cordão principal — gradiente violeta
      const grad = ctx.createLinearGradient(p.x, p.y, bx, by);
      grad.addColorStop(0, "rgba(196,181,253,0.85)");
      grad.addColorStop(0.5, "rgba(139,92,246,0.70)");
      grad.addColorStop(1, "rgba(109,40,217,0.52)");
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 2.8;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(cpx, cpy, bx, by);
      ctx.stroke();

      // Rebite do pivô (3 círculos concêntricos)
      ctx.fillStyle = "rgba(167,139,250,0.22)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(167,139,250,0.60)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(235,225,255,0.92)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      container.removeEventListener("pointerdown",   onPointerDown);
      container.removeEventListener("pointermove",   onPointerMove);
      container.removeEventListener("pointerup",     onPointerUp);
      container.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height: "500px", touchAction: "none" }}
    >
      {/* Canvas do cordão */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Crachá */}
      <div
        ref={badgeRef}
        className="absolute cursor-grab active:cursor-grabbing"
        style={{ width: "162px", touchAction: "none", willChange: "transform" }}
      >
        {/* Presilha */}
        <div className="flex justify-center">
          <div
            style={{
              width: "30px",
              height: "18px",
              background: "linear-gradient(135deg, #c4b5fd 0%, #7c3aed 100%)",
              borderRadius: "6px 6px 3px 3px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px rgba(124,58,237,0.55)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "8px",
                borderRadius: "4px",
                background: "rgba(0,0,0,0.5)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.7)",
              }}
            />
          </div>
        </div>

        {/* Cartão */}
        <div
          style={{
            background: "linear-gradient(160deg, #1e1c30 0%, #13121e 100%)",
            border: "1px solid rgba(167,139,250,0.22)",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.78), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          {/* Barra de cor */}
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 50%, #6366f1 100%)",
            }}
          />

          {/* Foto */}
          <div style={{ padding: "10px 10px 6px" }}>
            <div
              style={{
                borderRadius: "9px",
                overflow: "hidden",
                aspectRatio: "1",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Image
                src="/images/foto.jpg"
                alt="Adriano Da Silva Dantas Junior"
                width={142}
                height={142}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            </div>
          </div>

          {/* Info */}
          <div style={{ padding: "4px 12px 14px", textAlign: "center" }}>
            <p
              style={{
                color: "rgba(236,236,244,0.93)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                margin: 0,
                textTransform: "uppercase",
              }}
            >
              Adriano Junior
            </p>
            <p
              style={{
                color: "rgba(167,139,250,0.65)",
                fontSize: "10px",
                margin: "3px 0 0",
              }}
            >
              Frontend Developer
            </p>

            <div
              style={{
                marginTop: "10px",
                paddingTop: "10px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: "rgba(167,139,250,0.55)",
                  background: "rgba(167,139,250,0.07)",
                  padding: "2px 9px",
                  borderRadius: "4px",
                  border: "1px solid rgba(167,139,250,0.14)",
                }}
              >
                @adriak007
              </span>
            </div>

            {/* Código de barras decorativo */}
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "1.5px",
                height: "18px",
                alignItems: "flex-end",
              }}
            >
              {[3,5,2,4,2,5,3,4,2,3,5,4,2,3,5,2,4,3].map((h, i) => (
                <div
                  key={i}
                  style={{
                    width: "2px",
                    height: `${h * 3}px`,
                    background: "rgba(167,139,250,0.25)",
                    borderRadius: "1px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
