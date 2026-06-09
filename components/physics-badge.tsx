"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

const CORD_LENGTH = 190;   // px — comprimento do cordão
const GRAVITY     = 900;   // px/s² equivalente
const DAMPING     = 0.986; // fator de amortecimento por frame (60 fps)
const MAX_ANGLE   = Math.PI * 0.68;

export function PhysicsBadge() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const badgeRef     = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);

  const state = useRef({
    angle:       0.12,  // ângulo atual (rad da vertical)
    omega:       0,     // velocidade angular (rad/s)
    isDragging:  false,
    prevAngle:   0,
    prevTime:    0,
    pointerOmega: 0,
  });

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    const badge     = badgeRef.current;
    if (!container || !canvas || !badge) return;

    const ctx = canvas.getContext("2d")!;
    let lastTime = performance.now();

    // Ponto de pivô: centro-topo do container
    const pivot = () => ({ x: container.offsetWidth / 2, y: 22 });

    const syncCanvas = () => {
      canvas.width  = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    syncCanvas();

    const ro = new ResizeObserver(syncCanvas);
    ro.observe(container);

    // Converte posição da tela em ângulo relativo ao pivô
    const screenToAngle = (cx: number, cy: number) => {
      const rect = container.getBoundingClientRect();
      const p    = pivot();
      return Math.atan2(cx - (rect.left + p.x), cy - (rect.top + p.y));
    };

    // ── Eventos de ponteiro ──────────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      const bRect = badge.getBoundingClientRect();
      const pad   = 14;
      if (
        e.clientX < bRect.left  - pad ||
        e.clientX > bRect.right + pad ||
        e.clientY < bRect.top   - pad ||
        e.clientY > bRect.bottom + pad
      ) return;

      const s        = state.current;
      s.isDragging   = true;
      s.omega        = 0;
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
      s.isDragging   = false;
      s.omega        = s.pointerOmega * 0.52;
      document.body.style.cursor = "";
      e.preventDefault();
    };

    container.addEventListener("pointerdown",  onPointerDown);
    container.addEventListener("pointermove",  onPointerMove);
    container.addEventListener("pointerup",    onPointerUp);
    container.addEventListener("pointercancel", onPointerUp);

    // ── Loop de física + desenho ─────────────────────────────────────────────
    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      const s = state.current;
      const p = pivot();

      if (!s.isDragging) {
        // Equação do pêndulo simples: α = -(g/L) × sin(θ)
        const alpha = -(GRAVITY / CORD_LENGTH) * Math.sin(s.angle);
        s.omega = (s.omega + alpha * dt) * Math.pow(DAMPING, dt * 60);
        s.angle += s.omega * dt;
        s.angle = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, s.angle));
      }

      // Posição da âncora superior do crachá
      const bx = p.x + Math.sin(s.angle) * CORD_LENGTH;
      const by = p.y + Math.cos(s.angle) * CORD_LENGTH;
      const bw = badge.offsetWidth;

      badge.style.left      = `${bx - bw / 2}px`;
      badge.style.top       = `${by}px`;
      badge.style.transform = `rotate(${s.angle * 0.18}rad)`;

      // ── Desenhar cordão ──────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const sag = 10 + Math.abs(s.angle) * 22;
      const cpx = (p.x + bx) / 2;
      const cpy = (p.y + by) / 2 + sag;

      // Sombra do cordão
      ctx.strokeStyle = "rgba(60, 20, 120, 0.45)";
      ctx.lineWidth   = 4;
      ctx.lineCap     = "round";
      ctx.beginPath();
      ctx.moveTo(p.x, p.y + 1.5);
      ctx.quadraticCurveTo(cpx, cpy + 1.5, bx, by + 1.5);
      ctx.stroke();

      // Cordão principal (gradiente violeta)
      const grad = ctx.createLinearGradient(p.x, p.y, bx, by);
      grad.addColorStop(0, "rgba(196, 181, 253, 0.80)");
      grad.addColorStop(1, "rgba(109,  40, 217, 0.55)");
      ctx.strokeStyle = grad;
      ctx.lineWidth   = 2.5;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(cpx, cpy, bx, by);
      ctx.stroke();

      // Rebite do pivô
      ctx.fillStyle = "rgba(180, 160, 255, 0.28)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(167, 139, 250, 0.65)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(230, 220, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
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
      style={{ height: "480px", touchAction: "none" }}
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
        {/* Presilha do crachá */}
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
              boxShadow: "0 2px 8px rgba(124,58,237,0.5)",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "8px",
                borderRadius: "4px",
                background: "rgba(0,0,0,0.5)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.7)",
              }}
            />
          </div>
        </div>

        {/* Cartão do crachá */}
        <div
          style={{
            background: "linear-gradient(160deg, #1e1c30 0%, #13121e 100%)",
            border: "1px solid rgba(167,139,250,0.20)",
            borderRadius: "14px",
            overflow: "hidden",
            boxShadow:
              "0 30px 80px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04) inset",
          }}
        >
          {/* Barra colorida no topo */}
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
                border: "1px solid rgba(255,255,255,0.07)",
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

          {/* Informações */}
          <div
            style={{
              padding: "4px 12px 14px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "rgba(236,236,244,0.92)",
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
                gap: "6px",
              }}
            >
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: "rgba(167,139,250,0.55)",
                  background: "rgba(167,139,250,0.07)",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  border: "1px solid rgba(167,139,250,0.14)",
                }}
              >
                @adriak007
              </span>
            </div>

            {/* Barcode decorativo */}
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
