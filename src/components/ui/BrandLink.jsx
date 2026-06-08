import Link from "next/link";

export default function BrandLink() {
  return (
    <Link
      href="/"
      aria-label="Return to dashboard"
      className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800"
    >
      JT
    </Link>
  );
}