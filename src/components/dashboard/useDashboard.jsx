import { useEffect, useState } from "react";

export function useDashboard() {
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

        const sortedInterviews = [...interviewApps].sort((a, b) => {
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
      } catch (error) {
        console.error("Error calculating metrics:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  const totalPages = Math.max(1, Math.ceil(upcomingInterviews.length / itemsPerPage));
  const paginatedInterviews = upcomingInterviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return {
    metricsData,
    upcomingInterviews,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedInterviews,
  };
}