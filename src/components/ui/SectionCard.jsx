const toneStyles = {
  light: {
    section:
      "border-slate-200 bg-white text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.08)]",
    eyebrow: "text-sky-700",
    title: "text-slate-950",
    description: "text-slate-600",
    meta: "text-slate-500",
  },
  dark: {
    section:
      "border-slate-200 bg-slate-950 text-white shadow-[0_24px_80px_rgba(15,23,42,0.18)]",
    eyebrow: "text-sky-300",
    title: "text-white",
    description: "text-slate-300",
    meta: "text-slate-300",
  },
};

export default function SectionCard({
  tone = "light",
  eyebrow,
  title,
  description,
  meta,
  children,
  className = "",
}) {
  const styles = toneStyles[tone] || toneStyles.light;

  return (
    <section
      className={`rounded-[28px] border p-6 md:p-7 ${styles.section} ${className}`.trim()}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          {eyebrow ? (
            <p className={`text-xs font-semibold uppercase tracking-[0.35em] ${styles.eyebrow}`}>
              {eyebrow}
            </p>
          ) : null}

          {title ? (
            <h2 className={`mt-2 text-2xl font-semibold tracking-tight ${styles.title}`}>
              {title}
            </h2>
          ) : null}

          {description ? (
            <p className={`mt-2 text-sm leading-6 ${styles.description}`}>{description}</p>
          ) : null}
        </div>

        {meta ? <p className={`text-sm ${styles.meta}`}>{meta}</p> : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}