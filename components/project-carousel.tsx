"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";

type ProjectCarouselProps = {
  projects: Project[];
};

function getRelativePosition(index: number, activeIndex: number, length: number) {
  let delta = index - activeIndex;

  if (delta > length / 2) {
    delta -= length;
  }

  if (delta < -length / 2) {
    delta += length;
  }

  return delta;
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || projects.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [isPaused, projects.length]);

  const goTo = (index: number) => setActiveIndex(index);
  const goNext = () => setActiveIndex((current) => (current + 1) % projects.length);
  const goPrev = () =>
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);

  return (
    <div
      className="relative mt-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className="relative mx-auto h-[540px] w-full max-w-6xl overflow-hidden sm:h-[600px]">
        {projects.map((project, index) => {
          const position = getRelativePosition(index, activeIndex, projects.length);
          const isActive = position === 0;
          const isNeighbor = Math.abs(position) === 1;

          const desktopX =
            position === 0 ? "0%" : position === -1 ? "-62%" : position === 1 ? "62%" : position < 0 ? "-110%" : "110%";
          const desktopScale = position === 0 ? "1" : position === -1 || position === 1 ? "0.88" : "0.76";
          const desktopOpacity = position === 0 ? "1" : isNeighbor ? "0.58" : "0";

          const mobileX = position === 0 ? "0%" : position < 0 ? "-14%" : "14%";
          const mobileScale = position === 0 ? "1" : "0.92";
          const mobileOpacity = position === 0 ? "1" : "0";

          return (
            <article
              key={project.id}
              className={`group carousel-slide gradient-stroke surface-panel-strong absolute left-1/2 top-0 flex h-[500px] w-[min(100%,22rem)] flex-col overflow-hidden rounded-[2rem] transition-all duration-700 ease-out sm:w-[24rem] lg:w-[30rem] ${
                isActive ? "carousel-card-shadow" : ""
              }`}
              style={{
                zIndex: isActive ? 30 : isNeighbor ? 20 : 10,
                ["--carousel-x" as string]: desktopX,
                ["--carousel-scale" as string]: desktopScale,
                ["--carousel-opacity" as string]: desktopOpacity,
                ["--carousel-mobile-x" as string]: mobileX,
                ["--carousel-mobile-scale" as string]: mobileScale,
                ["--carousel-mobile-opacity" as string]: mobileOpacity,
                pointerEvents: isActive ? "auto" : isNeighbor ? "auto" : "none"
              }}
            >
              <div className={`absolute inset-x-0 top-0 h-48 bg-gradient-to-br ${project.accent}`} />
              <div className="relative mx-4 mt-4 overflow-hidden rounded-[1.5rem] border border-white/40 bg-white/80">
                <Image
                  src={project.image}
                  alt={`Preview do projeto ${project.title}`}
                  width={900}
                  height={620}
                  className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  priority={index === 0}
                />
              </div>

              <div className="relative flex flex-1 flex-col px-6 pb-6 pt-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-violet-500/10 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-violet-950">
                    {project.category}
                  </span>
                  <span className="text-sm font-semibold text-violet-900/70">
                    0{project.id}
                  </span>
                </div>

                <h3 className="font-display mt-5 text-3xl font-bold tracking-[-0.05em] text-slate-950">
                  {project.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-[color:var(--muted)] sm:text-[15px]">
                  {project.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-2 pt-6">
                  {project.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-violet-200/80 bg-white/80 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-700"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goPrev}
            className="surface-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-violet-950 transition hover:-translate-x-0.5 hover:bg-white/90"
            aria-label="Projeto anterior"
          >
            ←
          </button>
          <button
            type="button"
            onClick={goNext}
            className="surface-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold text-violet-950 transition hover:translate-x-0.5 hover:bg-white/90"
            aria-label="Próximo projeto"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(index)}
              className={`h-3 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-10 bg-violet-700"
                  : "w-3 bg-violet-300/80 hover:bg-violet-500/80"
              }`}
              aria-label={`Ir para o projeto ${project.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
