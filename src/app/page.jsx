import Link from "next/link";
import AppHeader from "@/components/ui/AppHeader";
import SectionCard from "@/components/ui/SectionCard";

export default function Home() {
  const metrics = [
    {
      label: "Total Applied",
      value: "45 Jobs",
      detail: "Across active pipelines",
    },
    {
      label: "In Interview",
      value: "12 Active",
      detail: "Waiting on next steps",
    },
    {
      label: "Conversion Rate",
      value: "26.6%",
      detail: "Based on recent applications",
    },
  ];

  const reminders = [
    {
      date: "June 10",
      company: "Stark Industries",
      role: "Full-Stack Eng.",
      action: "View",
    },
    {
      date: "June 15",
      company: "Acme Corp",
      role: "Frontend Engineer",
      action: "View",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.1),_transparent_24%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <AppHeader title="Dashboard" activeTab="dashboard" />

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
          <div className="space-y-6">
            <SectionCard
              eyebrow="Metrics Summary"
              title="Track the pipeline at a glance"
              meta="Updated just now"
            >
              <div className="grid gap-4 lg:grid-cols-3">
                {metrics.map((metric) => (
                  <article
                    key={metric.label}
                    className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-5 shadow-sm"
                  >
                    <p className="text-sm font-medium text-slate-500">{metric.label}</p>
                    <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{metric.detail}</p>
                  </article>
                ))}
              </div>
            </SectionCard>

            <SectionCard
              eyebrow="Upcoming Interviews &amp; Reminders"
              title="Keep the next conversations visible"
              meta="2 items queued"
              className="border-amber-200"
            >
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                <div className="grid grid-cols-[0.9fr_1.3fr_1fr_0.7fr] bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                  <div>Date</div>
                  <div>Company</div>
                  <div>Role</div>
                  <div className="text-right">Action</div>
                </div>

                <div className="divide-y divide-slate-200 bg-white">
                  {reminders.map((reminder) => (
                    <div
                      key={`${reminder.company}-${reminder.date}`}
                      className="grid grid-cols-1 gap-3 px-5 py-4 text-sm md:grid-cols-[0.9fr_1.3fr_1fr_0.7fr] md:items-center"
                    >
                      <div className="font-medium text-slate-700">{reminder.date}</div>
                      <div className="font-medium text-slate-950">{reminder.company}</div>
                      <div className="text-slate-600">{reminder.role}</div>
                      <div className="md:text-right">
                        <button
                          type="button"
                          className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
                        >
                          {reminder.action}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
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
                <p className="mt-2 text-lg font-semibold text-white">In progress</p>
              </div>
              <Link
                href="/resumes"
                className="flex items-center justify-between rounded-3xl bg-white px-5 py-4 text-slate-950 transition hover:bg-slate-100"
              >
                <div>
                  <p className="text-sm font-medium text-slate-500">Resumes</p>
                  <p className="mt-1 text-lg font-semibold">Open the resume page</p>
                </div>
                <span className="text-sm font-semibold text-sky-700">Go</span>
              </Link>
            </div>
          </SectionCard>
        </section>
      </main>
    </div>
  );
}
