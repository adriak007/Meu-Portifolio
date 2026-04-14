type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-3xl ${alignment}`}>
      <span className="inline-flex rounded-full bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-violet-900">
        {eyebrow}
      </span>
      <h2 className="font-display mt-5 text-4xl font-bold tracking-[-0.05em] text-slate-950 sm:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
