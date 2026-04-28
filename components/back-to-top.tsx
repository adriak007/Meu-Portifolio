"use client";
import { useEffect, useState } from "react";

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const r = 22;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      style={{
        transform: visible ? "translateY(0) scale(1)" : "translateY(18px) scale(0.8)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 transition-all duration-500"
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        viewBox="0 0 56 56"
        aria-hidden="true"
      >
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(177,138,255,0.22)" strokeWidth="3" />
        <circle
          cx="28" cy="28" r={r}
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
      <span className="absolute inset-[5px] flex items-center justify-center rounded-full bg-white/85 text-violet-900 shadow-[0_8px_24px_rgba(109,63,210,0.22)] backdrop-blur-md transition-all duration-200 hover:scale-105 hover:bg-white hover:shadow-[0_10px_32px_rgba(109,63,210,0.38)]">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M9 13V5M5 9L9 5L13 9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </button>
  );
}
