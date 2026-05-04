"use client";
import { useEffect, useState } from "react";
import { smoothScrollTo } from "@/lib/scroll";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 320);
      setProgress(maxScroll > 0 ? scrollY / maxScroll : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => smoothScrollTo(0);

  const r = 26;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      style={{
        transform: visible ? "translateX(0) scale(1)" : "translateX(-24px) scale(0.82)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      className="group fixed left-4 top-1/2 z-50 -translate-y-1/2 flex h-16 items-center overflow-hidden rounded-full border border-[rgba(113,80,171,0.14)] bg-white/85 backdrop-blur-md shadow-[0_8px_28px_rgba(109,63,210,0.2)] transition-all duration-500 hover:shadow-[0_12px_40px_rgba(109,63,210,0.38)]"
    >
      {/* Círculo com anel de progresso */}
      <div className="relative h-16 w-16 flex-shrink-0">
        <svg
          className="absolute inset-0 h-full w-full -rotate-90"
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          <circle
            cx="32" cy="32" r={r}
            fill="none"
            stroke="rgba(177,138,255,0.22)"
            strokeWidth="3"
          />
          <circle
            cx="32" cy="32" r={r}
            fill="none"
            stroke="url(#btt-grad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 100ms linear" }}
          />
          <defs>
            <linearGradient id="btt-grad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6d3fd2" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </svg>

        {/* Ícone de seta */}
        <span className="absolute inset-0 flex items-center justify-center text-violet-900 transition-transform duration-300 group-hover:-translate-y-0.5">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M10 15V5M5 10L10 5L15 10"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>

      {/* Texto que aparece no hover */}
      <span
        className="max-w-0 overflow-hidden whitespace-nowrap text-[11px] font-extrabold uppercase tracking-[0.22em] text-violet-900 transition-all duration-300 ease-out group-hover:max-w-[148px] group-hover:pl-1 group-hover:pr-5"
      >
        Voltar ao topo
      </span>
    </button>
  );
}
