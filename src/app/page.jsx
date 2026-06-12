"use client";

import AppHeader from "@/components/ui/AppHeader";
import Dashboard from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.1),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppHeader title="Dashboard" activeTab="dashboard" />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <Dashboard />
        </section>
      </main>
    </div>
  );
}
