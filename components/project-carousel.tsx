"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Project } from "@/data/projects";

type ProjectCarouselProps = {
  projects: Project[];
};

function getRelativePosition(index: number, activeIndex: number, length: number) {
  let delta = index - activeIndex;
  if (delta > length / 2) delta -= length;
  if (delta < -length / 2) delta += length;
  return delta;
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    if (isPaused || projects.length <= 1) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
      setProgressKey((k) => k + 1);
    }, 4200);

    return () => window.clearInterval(interval);
  }, [isPaused, projects.length]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    setProgressKey((k) => k + 1);
  };
  const goNext = () => {
    setActiveIndex((current) => (current + 1) % projects.length);
    setProgressKey((k) => k + 1);
  };
  const goPrev = () => {
    setActiveIndex((current) => (current - 1 + projects.length) % projects.length);
    setProgressKey((k) => k + 1);
  };

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
            position === 0 ? "0%" :
            position === -1 ? "-62%" :
            position === 1 ? "62%" :
            position < 0 ? "-118%" : "118%";
          const desktopScale = position === 0 ? "1" : Math.abs(position) === 1 ? "0.88" : "0.76";
          const desktopOpacity = position === 0 ? "1" : isNeighbor ? "0.6" : "0";

          const mobileX = position === 0 ? "0%" : position < 0 ? "-14%" : "14%";
          const mobileScale = position === 0 ? "1" : "0.92";
          const mobileOpacity = position === 0 ? "1" : "0";

          return (
            <article
              key={project.id}
              className={`group carousel-slide carousel-transition gradient-stroke surface-panel-strong absolute left-1/2 top-0 flex h-[500px] w-[min(100%,22rem)] flex-col overflow-hidden rounded-[2rem] sm:w-[24rem] lg:w-[30rem] ${
                isActive ? "carousel-card-glow" : ""
              }`}
              style={{
                zIndex: isActive ? 30 : isNeighbor ? 20 : 10,
                ["--carousel-x" as string]: desktopX,
                ["--carousel-scale" as string]: String(desktopScale),
                ["--carousel-opacity" as string]: desktopOpacity,
                ["--carousel-mobile-x" as string]: mobileX,
                ["--carousel-mobile-scale" as string]: String(mobileScale),
                ["--carousel-mobile-opacity" as string]: mobileOpacity,
                pointerEvents: isActive ? "auto" : isNeighbor ? "auto" : "none",
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
            className="surface-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-violet-950 transition-all duration-200 hover:-translate-x-0.5 hover:bg-white/90 hover:shadow-lg"
            aria-label="Projeto anterior"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            className="surface-panel inline-flex h-12 w-12 items-center justify-center rounded-full text-violet-950 transition-all duration-200 hover:translate-x-0.5 hover:bg-white/90 hover:shadow-lg"
            aria-label="Próximo projeto"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {projects.map((project, index) => (
            <button
              key={project.id}
              type="button"
              onClick={() => goTo(index)}
              className={`relative h-3 overflow-hidden rounded-full transition-all duration-500 ${
                index === activeIndex
                  ? "w-12 bg-violet-200"
                  : "w-3 bg-violet-300/60 hover:bg-violet-400/80"
              }`}
              aria-label={`Ir para o projeto ${project.title}`}
            >
              {index === activeIndex && (
                <span
                  key={progressKey}
                  className="carousel-progress absolute inset-y-0 left-0 rounded-full bg-violet-700"
                  style={{ animationPlayState: isPaused ? "paused" : "running" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
