import { useEffect, useMemo, useRef, useState } from "react";

export const statusOptions = ["All", "Applied", "Interview", "Rejected", "Offer"];

function createBlankApplication() {
    return {
        id: "__new__",
        company: "",
        role: "",
        status: "Applied",
        salaryRange: "",
        resumeId: "",
        date: new Date().toISOString().slice(0, 10),
        url: "",
        notes: "",
    };
}

function normalizeApplication(row) {
    return {
        id: row.id,
        company: row.companyName || "",
        role: row.roleTitle || "",
        status: row.status || "Applied",
        salaryRange: row.salaryRange || "",
        resumeId: row.resumeId || "",
        date: row.interviewDate ? row.interviewDate.slice(0, 10) : "",
        url: row.jobUrl || "",
        createdAt: row.createdAt || "",
        notes: "",
    };
}

export function useApplications() {
    const [applications, setApplications] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [resumeFilter, setResumeFilter] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("desc");
    const [currentPage, setCurrentPage] = useState(1);
    
    const ITEMS_PER_PAGE = 5;
    const [draft, setDraft] = useState(createBlankApplication);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const notificationTimeoutRef = useRef(null);

    const resumeLookup = useMemo(
        () =>
            resumes.reduce((lookup, resume) => {
                lookup[resume.id] = resume.name;
                return lookup;
            }, {}),
        [resumes]
    );

    const resumeOptions = useMemo(() => {
        return [
            "All", 
            "Unassigned", 
            ...resumes.map((resume) => resume.name)
        ];
    }, [resumes]);

    const selectedApplication = applications.find((application) => application.id === selectedId) || null;

    const liveApplications = useMemo(
        () =>
            applications.map((application) =>
                application.id === selectedId && selectedApplication && draft.id === application.id
                    ? { ...application, ...draft }
                    : application
            ),
        [applications, draft, selectedApplication, selectedId]
    );

    const filteredApplications = useMemo(
        () =>
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
                    if (sortOrder === "asc") {
                        return dateA - dateB; // Sort ascending (oldest to latest)
                    }
                    return dateB - dateA; // Sort descending (latest to oldest)
                }),
        [liveApplications, statusFilter, resumeFilter, resumeLookup, searchQuery, sortOrder]
    );

    const totalPages = Math.max(1, Math.ceil(filteredApplications.length / ITEMS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    
    const paginatedApplications = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
        return filteredApplications.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredApplications, safeCurrentPage]);

    const hasApplicationSelected = Boolean(selectedApplication || selectedId === "__new__");

    useEffect(() => {
        let isActive = true;

        async function loadApplications() {
            try {
                setIsLoading(true);

                const [applicationsResponse, resumesResponse] = await Promise.all([
                    fetch("/api/applications", { cache: "no-store" }),
                    fetch("/api/resumes", { cache: "no-store" }),
                ]);

                if (!applicationsResponse.ok) {
                    throw new Error("Failed to load applications.");
                }

                if (!resumesResponse.ok) {
                    throw new Error("Failed to load resumes.");
                }

                const [applicationRows, resumeRows] = await Promise.all([
                    applicationsResponse.json(),
                    resumesResponse.json(),
                ]);

                if (!isActive) {
                    return;
                }

                const nextApplications = Array.isArray(applicationRows)
                    ? applicationRows.map(normalizeApplication)
                    : [];

                setApplications(nextApplications);
                setResumes(Array.isArray(resumeRows) ? resumeRows : []);

                if (nextApplications[0]) {
                    setSelectedId(nextApplications[0].id);
                } else {
                    setSelectedId("");
                    setDraft(createBlankApplication());
                }
            } catch (error) {
                if (!isActive) {
                    return;
                }

                setApplications([]);
                setResumes([]);
                setSelectedId("");
                setDraft(createBlankApplication());
                setNotification({
                    type: "error",
                    message: error?.message || "Failed to load application data.",
                });
            } finally {
                if (isActive) {
                    setIsLoading(false);
                }
            }
        }

        loadApplications();

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedId || selectedId === "__new__") {
            return undefined;
        }

        const selected = applications.find((application) => application.id === selectedId);

        if (!selected) {
            return undefined;
        }

        let isActive = true;

        setDraft((currentDraft) =>
            currentDraft.id === selected.id
                ? { ...selected, notes: currentDraft.notes }
                : { ...selected, notes: "" }
        );

        async function loadNotes() {
            try {
                const response = await fetch(`/api/applications/${selectedId}/notes`, {
                    cache: "no-store",
                });

                if (!response.ok) {
                    throw new Error("Failed to load notes.");
                }

                const note = await response.json();

                if (!isActive) {
                    return;
                }

                setDraft((currentDraft) =>
                    currentDraft.id === selected.id
                        ? { ...selected, notes: note?.content ?? "" }
                        : currentDraft
                );
            } catch {
                if (isActive) {
                    setDraft((currentDraft) =>
                        currentDraft.id === selected.id ? { ...selected, notes: "" } : currentDraft
                    );
                }
            }
        }

        loadNotes();

        return () => {
            isActive = false;
        };
    }, [applications, selectedId]);

    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, resumeFilter, searchQuery, sortOrder]);

    useEffect(() => {
        if (!notification) {
            return undefined;
        }

        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, 4000);

        return () => {
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
                notificationTimeoutRef.current = null;
            }
        };
    }, [notification]);

    function syncSelection(nextId) {
        const nextApplication = applications.find((application) => application.id === nextId);

        if (!nextApplication) {
            return;
        }

        setSelectedId(nextId);
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setDraft((currentDraft) => ({
            ...currentDraft,
            [name]: value,
        }));
    }

    function handleAddJob() {
        setSelectedId("__new__");
        setDraft(createBlankApplication());
        setNotification(null);
    }

    async function handleSaveChanges() {
        const companyName = draft.company.trim();
        const roleTitle = draft.role.trim();

        if (!companyName || !roleTitle) {
            setNotification({
                type: "error",
                message: "Company and role are required before saving.",
            });
            return;
        }

        try {
            setIsSaving(true);
            setNotification(null);

            const payload = {
                companyName,
                roleTitle,
                status: draft.status,
                salaryRange: draft.salaryRange || null,
                jobUrl: draft.url || null,
                interviewDate: draft.date ? new Date(draft.date).toISOString() : null,
                resumeId: draft.resumeId || null,
            };

            let savedApplication;

            if (selectedApplication) {
                const updateResponse = await fetch(`/api/applications/${selectedApplication.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const updatedData = await updateResponse.json();

                if (!updateResponse.ok) {
                    throw new Error(updatedData?.error || "Failed to update application.");
                }

                savedApplication = normalizeApplication(updatedData);
            } else {
                const createResponse = await fetch("/api/applications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                const createdData = await createResponse.json();

                if (!createResponse.ok) {
                    throw new Error(createdData?.error || "Failed to create application.");
                }

                savedApplication = normalizeApplication(createdData);
            }

            const notesResponse = await fetch(`/api/applications/${savedApplication.id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: draft.notes }),
            });

            const notesData = await notesResponse.json();

            if (!notesResponse.ok) {
                throw new Error(notesData?.error || "Failed to save notes.");
            }

            const nextDraft = {
                ...savedApplication,
                notes: notesData?.content ?? draft.notes,
            };

            setApplications((currentApplications) => {
                const exists = currentApplications.some(
                    (application) => String(application.id) === String(savedApplication.id)
                );

                if (exists) {
                    return currentApplications.map((application) =>
                        String(application.id) === String(savedApplication.id) ? nextDraft : application
                    );
                }

                return [nextDraft, ...currentApplications];
            });

            setSelectedId(savedApplication.id);
            setDraft(nextDraft);
            setNotification({
                type: "success",
                message: selectedApplication ? "Application updated." : "Application created.",
            });
        } catch (error) {
            setNotification({
                type: "error",
                message: error?.message || "Failed to save application.",
            });
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteApplication() {
        if (!selectedApplication) {
            setNotification({
                type: "error",
                message: "Select a saved application before deleting.",
            });
            return;
        }

        try {
            setIsSaving(true);
            setNotification(null);

            const response = await fetch(`/api/applications/${selectedApplication.id}`, {
                method: "DELETE",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.error || "Failed to delete application.");
            }

            setApplications((currentApplications) => {
                const nextApplications = currentApplications.filter(
                    (application) => application.id !== selectedApplication.id
                );
                const fallbackApplication = nextApplications[0] || null;

                if (fallbackApplication) {
                    setSelectedId(fallbackApplication.id);
                } else {
                    setSelectedId("");
                    setDraft(createBlankApplication());
                }

                return nextApplications;
            });

            setNotification({
                type: "success",
                message: "Application deleted.",
            });
        } catch (error) {
            setNotification({
                type: "error",
                message: error?.message || "Failed to delete application.",
            });
        } finally {
            setIsSaving(false);
        }
    }

    return {
        applications,
        resumes,
        selectedId,
        statusFilter,
        setStatusFilter,
        resumeFilter,
        setResumeFilter,
        searchQuery,
        setSearchQuery,
        sortOrder,
        setSortOrder,
        currentPage,
        setCurrentPage,
        draft,
        isLoading,
        isSaving,
        notification,
        resumeLookup,
        resumeOptions,
        selectedApplication,
        filteredApplications,
        paginatedApplications,
        totalPages,
        safeCurrentPage,
        hasApplicationSelected,
        syncSelection,
        handleFieldChange,
        handleAddJob,
        handleSaveChanges,
        handleDeleteApplication,
    };
}