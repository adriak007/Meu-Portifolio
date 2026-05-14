"use client";
import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setWidth(maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[999] h-[2px] bg-gradient-to-r from-violet-500 via-purple-400 to-violet-300"
      style={{
        width: `${width}%`,
        transition: "width 80ms linear",
        boxShadow: width > 0 ? "0 0 12px rgba(167,139,250,0.6), 0 0 6px rgba(124,58,237,0.4)" : "none",
      }}
    />
  );
}
