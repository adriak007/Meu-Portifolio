"use client";
import { useEffect } from "react";
import { smoothScrollTo } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest(
        "a[href^='#']"
      ) as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      const id = href.slice(1);

      if (!id || id === "topo") {
        e.preventDefault();
        smoothScrollTo(0);
        return;
      }

      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();
      // 7rem = 112px offset igual ao scroll-margin-top das seções
      const top = el.getBoundingClientRect().top + window.scrollY - 112;
      smoothScrollTo(Math.max(0, top));
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
