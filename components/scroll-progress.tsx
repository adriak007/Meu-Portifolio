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
      className="fixed left-0 top-0 z-[999] h-[3px] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-violet-400"
      style={{
        width: `${width}%`,
        transition: "width 80ms linear",
        boxShadow: width > 0 ? "0 0 10px rgba(109,63,210,0.5), 0 0 4px rgba(217,70,239,0.4)" : "none",
      }}
    />
  );
}
