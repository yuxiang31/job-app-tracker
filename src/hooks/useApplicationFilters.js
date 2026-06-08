import { useState, useMemo, useEffect } from "react";

export function useApplicationFilters(applications, draft, selectedId, selectedApplication, resumes, onFilterChange) {
    const [statusFilter, setStatusFilter] = useState("All");
    const [resumeFilter, setResumeFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");

    useEffect(() => {
        if (onFilterChange) onFilterChange();
    }, [statusFilter, resumeFilter, searchQuery, sortOrder]);

    const resumeLookup = useMemo(() =>
        resumes.reduce((lookup, resume) => {
            lookup[resume.id] = resume.name;
            return lookup;
        }, {}), [resumes]
    );

    const resumeOptions = useMemo(() => {
        return ["All", "Unassigned", ...resumes.map((resume) => resume.name)];
    }, [resumes]);

    const liveApplications = useMemo(() =>
        applications.map((application) =>
            application.id === selectedId && selectedApplication && draft.id === application.id
                ? { ...application, ...draft }
                : application
        ), [applications, draft, selectedApplication, selectedId]
    );

    const filteredApplications = useMemo(() =>
        liveApplications
            .filter((application) => {
                const matchesStatus = statusFilter === "All" || application.status === statusFilter;
                const resumeLabel = application.resumeId
                    ? resumeLookup[application.resumeId] || "Resume removed"
                    : "Unassigned";
                const matchesResume = resumeFilter === "All" || resumeLabel === resumeFilter;
                
                const searchLower = searchQuery.toLowerCase();
                const matchesSearch = !searchQuery || 
                    (application.company || "").toLowerCase().includes(searchLower) ||
                    (application.role || "").toLowerCase().includes(searchLower);

                return matchesStatus && matchesResume && matchesSearch;
            })
            .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                
                if (sortOrder === "asc") return dateA - dateB;
                return dateB - dateA;
            }),
        [liveApplications, statusFilter, resumeFilter, resumeLookup, searchQuery, sortOrder]
    );

    return {
        statusFilter, setStatusFilter, resumeFilter, setResumeFilter,
        searchQuery, setSearchQuery, sortOrder, setSortOrder,
        resumeLookup, resumeOptions, filteredApplications,
    };
}