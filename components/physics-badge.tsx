"use client";

import Image from "next/image";
import { useRef, useEffect } from "react";

// ── Constantes de física ──────────────────────────────────────────────────────
const SEGMENTS = 12;       // quantos segmentos na corda
const SEG_LEN  = 24;       // comprimento natural de cada segmento (px)
const GRAVITY  = 1800;     // px/s²
const DAMP     = 0.955;    // amortecimento de cada nó da corda
const STIFF    = 0.28;     // rigidez da restrição (< 0.5 = elástica, > 0.7 = dura)
const ITERS    = 10;       // iterações de restrição por frame (mais = mais rígida)
const PAD      = 320;      // espaço extra do canvas além do container

interface Pt { x: number; y: number; ox: number; oy: number }

export function PhysicsBadge() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef  = useRef<HTMLDivElement>(null);
  const rafRef    = useRef<number>(0);
  const pts       = useRef<Pt[]>([]);
  const drag      = useRef({ on: false, offX: 0, offY: 0 });

  useEffect(() => {
    const wrap   = wrapRef.current!;
    const canvas = canvasRef.current!;
    const badge  = badgeRef.current!;
    const ctx    = canvas.getContext("2d")!;

    let lastTime = performance.now();

    // Ponto de ancoragem (topo-centro do container)
    const getPivot = () => ({
      x: wrap.offsetWidth / 2,
      y: 22,
    });

    // ── Redimensionar canvas com padding extra ───────────────────────────────
    const syncCanvas = () => {
      canvas.width  = wrap.offsetWidth  + PAD * 2;
      canvas.height = wrap.offsetHeight + PAD * 2;
      canvas.style.left   = `-${PAD}px`;
      canvas.style.top    = `-${PAD}px`;
      canvas.style.width  = `${wrap.offsetWidth  + PAD * 2}px`;
      canvas.style.height = `${wrap.offsetHeight + PAD * 2}px`;
    };
    syncCanvas();

    // ── Inicializar corda em linha reta para baixo ──────────────────────────
    const initRope = () => {
      const p = getPivot();
      pts.current = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
        const y = p.y + i * SEG_LEN;
        return { x: p.x, y, ox: p.x, oy: y };
      });
      // Impulso inicial — badge começa com velocidade lateral
      const last = pts.current[SEGMENTS];
      last.ox = last.x + 5; // move para a esquerda inicialmente
    };
    initRope();

    const ro = new ResizeObserver(() => {
      syncCanvas();
      // Reancora o pivot sem resetar o resto da corda
      const p = getPivot();
      pts.current[0].x  = p.x;
      pts.current[0].y  = p.y;
      pts.current[0].ox = p.x;
      pts.current[0].oy = p.y;
    });
    ro.observe(wrap);

    // ── Detecção do badge ────────────────────────────────────────────────────
    const onPointerDown = (e: PointerEvent) => {
      const br   = badge.getBoundingClientRect();
      const wr   = wrap.getBoundingClientRect();
      const pad  = 18;
      if (
        e.clientX < br.left  - pad || e.clientX > br.right  + pad ||
        e.clientY < br.top   - pad || e.clientY > br.bottom + pad
      ) return;

      // Offset do cursor em relação ao ponto de ancoragem do badge (último nó)
      const last = pts.current[SEGMENTS];
      drag.current = {
        on:   true,
        offX: (e.clientX - wr.left) - last.x,
        offY: (e.clientY - wr.top)  - last.y,
      };
      wrap.setPointerCapture(e.pointerId);
      document.body.style.cursor = "grabbing";
      e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!drag.current.on) return;
      const wr   = wrap.getBoundingClientRect();
      const last = pts.current[SEGMENTS];
      // Mantém o histórico de posição para que o Verlet calcule a velocidade ao soltar
      last.ox = last.x;
      last.oy = last.y;
      last.x  = (e.clientX - wr.left)  - drag.current.offX;
      last.y  = (e.clientY - wr.top)   - drag.current.offY;
      e.preventDefault();
    };

    const onPointerUp = (e: PointerEvent) => {
      drag.current.on = false;
      document.body.style.cursor = "";
      e.preventDefault();
    };

    wrap.addEventListener("pointerdown",   onPointerDown);
    wrap.addEventListener("pointermove",   onPointerMove);
    wrap.addEventListener("pointerup",     onPointerUp);
    wrap.addEventListener("pointercancel", onPointerUp);

    // ── Loop de física + desenho ─────────────────────────────────────────────
    const tick = (now: number) => {
      const dt  = Math.min((now - lastTime) / 1000, 0.05);
      lastTime  = now;
      const p   = getPivot();
      const ps  = pts.current;
      const isDrag = drag.current.on;

      // ── Integração Verlet ──────────────────────────────────────────────
      for (let i = 1; i <= SEGMENTS; i++) {
        if (i === SEGMENTS && isDrag) continue; // badge controlado pelo mouse
        const n  = ps[i];
        const vx = (n.x - n.ox) * DAMP;
        const vy = (n.y - n.oy) * DAMP;
        n.ox = n.x;
        n.oy = n.y;
        n.x += vx;
        n.y += vy + GRAVITY * dt * dt;
      }

      // ── Restrições de comprimento (relaxação iterativa) ────────────────
      for (let iter = 0; iter < ITERS; iter++) {
        // Ancorar o ponto de origem (parede/teto)
        ps[0].x = p.x; ps[0].y = p.y;
        ps[0].ox = p.x; ps[0].oy = p.y;

        for (let i = 0; i < SEGMENTS; i++) {
          const a  = ps[i];
          const b  = ps[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 0.001) continue;

          const diff  = (d - SEG_LEN) / d * STIFF;
          const isEnd = i === SEGMENTS - 1 && isDrag;

          // Ponto A se move (exceto o pivot)
          if (i > 0) {
            a.x += dx * diff * 0.5;
            a.y += dy * diff * 0.5;
          }
          // Ponto B se move (exceto quando o badge está sendo arrastado)
          if (!isEnd) {
            b.x -= dx * diff * 0.5;
            b.y -= dy * diff * 0.5;
          }
        }
      }

      // ── Posicionar e rotacionar o badge ────────────────────────────────
      const last = ps[SEGMENTS];
      const prev = ps[SEGMENTS - 1];
      const bw   = badge.offsetWidth;
      const segDx = last.x - prev.x;
      const segDy = last.y - prev.y;
      const angle = Math.atan2(segDx, Math.max(segDy, 0.01)); // ângulo da última corda

      badge.style.left      = `${last.x - bw / 2}px`;
      badge.style.top       = `${last.y}px`;
      badge.style.transform = `rotate(${angle}rad)`;

      // ── Desenhar corda ────────────────────────────────────────────────────
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const drawCord = (offsetY: number, style: string | CanvasGradient, width: number) => {
        ctx.strokeStyle = style;
        ctx.lineWidth   = width;
        ctx.lineCap     = "round";
        ctx.lineJoin    = "round";
        ctx.beginPath();
        ctx.moveTo(ps[0].x + PAD, ps[0].y + PAD + offsetY);
        for (let i = 1; i < SEGMENTS; i++) {
          const mx = (ps[i].x + ps[i + 1].x) / 2 + PAD;
          const my = (ps[i].y + ps[i + 1].y) / 2 + PAD + offsetY;
          ctx.quadraticCurveTo(ps[i].x + PAD, ps[i].y + PAD + offsetY, mx, my);
        }
        ctx.lineTo(last.x + PAD, last.y + PAD + offsetY);
        ctx.stroke();
      };

      // Sombra
      drawCord(2, "rgba(40,10,90,0.50)", 5);

      // Cordão principal — gradiente do pivot ao badge
      const grad = ctx.createLinearGradient(
        ps[0].x + PAD, ps[0].y + PAD,
        last.x + PAD,  last.y + PAD,
      );
      grad.addColorStop(0,   "rgba(196,181,253,0.88)");
      grad.addColorStop(0.5, "rgba(139,92,246,0.72)");
      grad.addColorStop(1,   "rgba(109,40,217,0.54)");
      drawCord(0, grad, 3);

      // Rebite do teto
      const cx = ps[0].x + PAD;
      const cy = ps[0].y + PAD;
      ctx.fillStyle = "rgba(167,139,250,0.20)";
      ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(167,139,250,0.60)";
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(235,225,255,0.95)";
      ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, Math.PI * 2); ctx.fill();

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      wrap.removeEventListener("pointerdown",   onPointerDown);
      wrap.removeEventListener("pointermove",   onPointerMove);
      wrap.removeEventListener("pointerup",     onPointerUp);
      wrap.removeEventListener("pointercancel", onPointerUp);
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full select-none"
      style={{ height: "520px", touchAction: "none", overflow: "visible" }}
    >
      {/* Canvas posicionado com padding extra para a corda não cortar */}
      <canvas
        ref={canvasRef}
        className="absolute pointer-events-none"
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
                background: "rgba(0,0,0,0.50)",
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
          <div
            style={{
              height: "3px",
              background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 50%, #6366f1 100%)",
            }}
          />

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
            <p style={{ color: "rgba(167,139,250,0.65)", fontSize: "10px", margin: "3px 0 0" }}>
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
