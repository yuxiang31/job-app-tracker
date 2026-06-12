import Link from "next/link";
import BrandLink from "./BrandLink";

const navigationItems = [
  { key: "dashboard", label: "Dashboard", href: "/" },
  { key: "applications", label: "Applications", href: "/applications" },
  { key: "resumes", label: "Resumes", href: "/resumes" },
];

function getTabClasses(isActive, isLink) {
  if (isActive) {
    return "border border-slate-950 bg-slate-950 px-4 py-2 text-white";
  }

  if (isLink) {
    return "border border-sky-200 bg-sky-50 px-4 py-2 text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900";
  }

  return "border border-slate-200 bg-slate-50 px-4 py-2 text-slate-500";
}

export default function AppHeader({ title, activeTab }) {
  return (
    <header className="rounded-[28px] border border-slate-200 bg-white/85 px-5 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <BrandLink />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
              JobTracker
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              {title}
            </h1>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 text-sm font-medium text-slate-600">
          {navigationItems.map((item) => {
            const isActive = item.key === activeTab;
            const classes = getTabClasses(isActive, Boolean(item.href));

            if (item.href) {
              return (
                <Link key={item.key} href={item.href} className={classes}>
                  {item.label}
                </Link>
              );
            }

            return (
              <span key={item.key} className={classes}>
                {item.label}
              </span>
            );
          })}
        </nav>
      </div>
    </header>
  );
}