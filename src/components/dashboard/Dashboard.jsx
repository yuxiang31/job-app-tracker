"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionCard from "@/components/ui/SectionCard";

export default function Dashboard() {
  const [metricsData, setMetricsData] = useState({
    totalApplied: 0,
    inInterview: 0,
    conversionRate: "0.0%",
  });
  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Adjust this endpoint if your API path differs
        const response = await fetch("/api/applications");
        if (!response.ok) {
          throw new Error("Failed to fetch applications");
        }

        const data = await response.json();
        // Ensure we handle the structure correctly (whether it returns an array directly or an object)
        const applications = Array.isArray(data) ? data : data.applications || [];

        const totalApplied = applications.length;

        // Count applications matching "Interview" in their status
        const interviewApps = applications.filter((app) =>
          app.status && app.status.toLowerCase().includes("interview")
        );

        const inInterview = interviewApps.length;

        const conversionRate = totalApplied > 0 
          ? ((inInterview / totalApplied) * 100).toFixed(1) + "%" 
          : "0.0%";

        setMetricsData({ totalApplied, inInterview, conversionRate });

        // Sort all interview applications by nearest date to today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        console.log(interviewApps)

        const sortedInterviews = [...interviewApps].sort((a, b) => {
          console.log(a, b)
          if (!a.interviewDate && !b.interviewDate) return 0;
          if (!a.interviewDate) return 1;
          if (!b.interviewDate) return -1;
          const dateA = new Date(a.interviewDate);
          const dateB = new Date(b.interviewDate);
          if (isNaN(dateA) && isNaN(dateB)) return 0;
          if (isNaN(dateA)) return 1;
          if (isNaN(dateB)) return -1;
          const diffA = Math.abs(dateA - today);
          const diffB = Math.abs(dateB - today);
          return diffA - diffB;
        });

        setUpcomingInterviews(sortedInterviews);
        console.log(sortedInterviews)
      } catch (error) {
        console.error("Error calculating metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

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

  const totalPages = Math.max(1, Math.ceil(upcomingInterviews.length / itemsPerPage));
  const paginatedInterviews = upcomingInterviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
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
                      <Link
                        href="/applications/"
                        className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-950"
                      >
                        View
                      </Link>
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
    </>
  );
}
