import Link from "next/link";
import AppHeader from "@/components/ui/AppHeader";
import SectionCard from "@/components/ui/SectionCard";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.1),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppHeader title="Dashboard" activeTab="dashboard" />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="space-y-6">
            <Dashboard />
          </div>

          <SectionCard
            tone="dark"
            eyebrow="Status Panel"
            title="Applications and dashboard tools are in progress."
            description="The Dashboard and Applications tabs are placeholders for now. Use Resumes to open the working resume manager."
          >
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-slate-300">Dashboard</p>
                <p className="mt-2 text-lg font-semibold text-white">In progress</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-medium text-slate-300">Applications</p>
                <Link
                  href="/applications"
                  className="mt-3 inline-flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-slate-950 transition hover:bg-slate-100"
                >
                  <span className="text-lg font-semibold">Open applications view</span>
                  <span className="ml-4 text-sm font-semibold text-sky-700">Go</span>
                </Link>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <p className="text-sm font-medium text-slate-300">Resumes</p>
                  <Link
                    href="/resumes"
                    className="mt-3 inline-flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-slate-950 transition hover:bg-slate-100"
                  >
                  <span className="text-lg font-semibold">Open the resume page</span>
                  <span className="ml-4 text-sm font-semibold text-sky-700">Go</span>
                </Link>
              </div>
            </div>
          </SectionCard>
        </section>
      </main>
    </div>
  );
}
