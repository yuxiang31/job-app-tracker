"use client";

import { useDashboard } from "./useDashboard";
import SectionCard from "@/components/ui/SectionCard";
import Link from "next/link";

export default function Dashboard() {
  const {
    metricsData,
    upcomingInterviews,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedInterviews,
    selectedNotes,
    handleViewNotes,
    clearSelectedNotes,
  } = useDashboard();

  const metrics = [
    {
      label: "Total Applied",
      value: isLoading ? "..." : `${metricsData.totalApplied} Jobs`,
      detail: "Across active pipelines",
    },
    {
      label: "In Interview",
      value: isLoading ? "..." : `${metricsData.inInterview} Active`,
      detail: "Waiting on next steps",
    },
    {
      label: "Conversion Rate",
      value: isLoading ? "..." : metricsData.conversionRate,
      detail: "Based on recent applications",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <SectionCard
          eyebrow="Metrics Summary"
          title="Track the pipeline at a glance"
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
          eyebrow="Upcoming Interviews & Reminders"
          title="Keep the next conversations visible"
          meta={isLoading ? "..." : `${upcomingInterviews.length} items queued`}
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
              {isLoading ? (
                <div className="px-5 py-6 text-center text-sm text-slate-500">Loading interviews...</div>
              ) : paginatedInterviews.length === 0 ? (
                <div className="px-5 py-6 text-center text-sm text-slate-500">No interviews found</div>
              ) : (
                paginatedInterviews.map((interview) => {
                  const dateObj = interview.interviewDate ? new Date(interview.interviewDate) : null;
                  const dateStr = !dateObj
                    ? "No date"
                    : isNaN(dateObj)
                    ? interview.date
                    : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });

                  return (
                    <div
                      key={interview.id || `${interview.companyName}-${interview.interviewDate}`}
                      className="grid grid-cols-1 gap-3 px-5 py-4 text-sm md:grid-cols-[0.9fr_1.3fr_1fr_0.7fr] md:items-center"
                    >
                      <div className="font-medium text-slate-700">{dateStr}</div>
                      <div className="font-medium text-slate-950">{interview.companyName || "Untitled"}</div>
                      <div className="text-slate-600">{interview.roleTitle || "No role"}</div>
                      <div className="md:text-right">
                        <button
                          type="button"
                          onClick={() => handleViewNotes(interview)}
                          data-view-btn="true"
                          className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Previous
                </button>
                <span className="text-sm font-medium text-slate-500">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </SectionCard>
      </div>

      <div data-notes-panel="true" className="h-full">
        <SectionCard
          tone="dark"
          eyebrow="Status Panel"
          title={selectedNotes ? `${selectedNotes.companyName || "Untitled"} Interview` : "Applications and dashboard tools are in progress."}
          description={selectedNotes ? (selectedNotes.role || selectedNotes.roleTitle) : "The Dashboard and Applications tabs are placeholders for now. Use Resumes to open the working resume manager."}
          className="h-full"
        >
        <div className="space-y-6">
          {selectedNotes ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-300">Notes</p>
              <p className="mt-2 text-sm leading-6 text-white whitespace-pre-wrap">
                {selectedNotes.notes || "No notes available for this application."}
              </p>
            </div>
          ) : (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-300">Dashboard</p>
              <p className="mt-2 text-lg font-semibold text-white">Notes for application will show up here.</p>
            </div>
          )}
          
          <div className="flex items-center gap-4 py-1">
            <div className="h-px flex-1 bg-white/10"></div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Quick Navigation</span>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-300">Applications</p>
              <Link
                href="/applications"
                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-slate-950 transition hover:bg-slate-100"
              >
                <span className="text-sm font-semibold sm:text-base">Open view</span>
                <span className="ml-4 text-sm font-semibold text-sky-700">Go &rarr;</span>
              </Link>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-slate-300">Resumes</p>
              <Link
                href="/resumes"
                className="mt-3 flex w-full items-center justify-between rounded-2xl bg-white px-4 py-3 text-slate-950 transition hover:bg-slate-100"
              >
                <span className="text-sm font-semibold sm:text-base">Open view</span>
                <span className="ml-4 text-sm font-semibold text-sky-700">Go &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
        </SectionCard>
      </div>
    </>
  );
}
