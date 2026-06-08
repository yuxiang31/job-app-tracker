import { useState, useEffect } from "react";
import { createBlankApplication, normalizeApplication } from "../app/applications/utils";

export function useApplicationForm(applications, setApplications, setNotification, isLoading) {
    const [selectedId, setSelectedId] = useState("");
    const [draft, setDraft] = useState(createBlankApplication());
    const [isSaving, setIsSaving] = useState(false);
    const [initialLoadDone, setInitialLoadDone] = useState(false);

    const selectedApplication = applications.find((app) => app.id === selectedId) || null;
    const hasApplicationSelected = Boolean(selectedApplication || selectedId === "__new__");

    useEffect(() => {
        if (!initialLoadDone && !isLoading) {
            if (applications.length > 0) {
                const newestApp = [...applications].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                })[0];
                setSelectedId(newestApp.id);
            } else {
                setSelectedId("");
                setDraft(createBlankApplication());
            }
            setInitialLoadDone(true);
        }
    }, [applications, isLoading, initialLoadDone]);

    useEffect(() => {
        if (!selectedId || selectedId === "__new__") return undefined;
        
        const selected = applications.find((app) => app.id === selectedId);
        if (!selected) return undefined;

        let isActive = true;

        setDraft((currentDraft) =>
            currentDraft.id === selected.id
                ? { ...selected, notes: currentDraft.notes }
                : { ...selected, notes: "" }
        );

        async function loadNotes() {
            try {
                const response = await fetch(`/api/applications/${selectedId}/notes`, { cache: "no-store" });
                if (!response.ok) throw new Error("Failed to load notes.");
                const note = await response.json();
                
                if (!isActive) return;
                
                setDraft((currentDraft) =>
                    currentDraft.id === selected.id ? { ...selected, notes: note?.content ?? "" } : currentDraft
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
        return () => { isActive = false; };
    }, [applications, selectedId]);

    function syncSelection(nextId) {
        if (applications.find((app) => app.id === nextId)) {
            setSelectedId(nextId);
        }
    }

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setDraft((currentDraft) => ({ ...currentDraft, [name]: value }));
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
            setNotification({ type: "error", message: "Company and role are required before saving." });
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
                if (!updateResponse.ok) throw new Error(updatedData?.error || "Failed to update application.");
                savedApplication = normalizeApplication(updatedData);
            } else {
                const createResponse = await fetch("/api/applications", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                const createdData = await createResponse.json();
                if (!createResponse.ok) throw new Error(createdData?.error || "Failed to create application.");
                savedApplication = normalizeApplication(createdData);
            }

            const notesResponse = await fetch(`/api/applications/${savedApplication.id}/notes`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: draft.notes }),
            });
            const notesData = await notesResponse.json();
            if (!notesResponse.ok) throw new Error(notesData?.error || "Failed to save notes.");

            const nextDraft = { ...savedApplication, notes: notesData?.content ?? draft.notes };

            setApplications((currentApplications) => {
                const exists = currentApplications.some((app) => String(app.id) === String(savedApplication.id));
                if (exists) {
                    return currentApplications.map((app) =>
                        String(app.id) === String(savedApplication.id) ? nextDraft : app
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
            setNotification({ type: "error", message: error?.message || "Failed to save application." });
        } finally {
            setIsSaving(false);
        }
    }

    async function handleDeleteApplication() {
        if (!selectedApplication) {
            setNotification({ type: "error", message: "Select a saved application before deleting." });
            return;
        }

        try {
            setIsSaving(true);
            setNotification(null);

            const response = await fetch(`/api/applications/${selectedApplication.id}`, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) throw new Error(data?.error || "Failed to delete application.");

            setApplications((currentApplications) => {
                const nextApplications = currentApplications.filter((app) => app.id !== selectedApplication.id);
                
                // Sort the array newest-first to match the UI list order
                const sortedApps = [...currentApplications].sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
                const currentIndex = sortedApps.findIndex((app) => app.id === selectedApplication.id);
                const sortedNextApps = sortedApps.filter((app) => app.id !== selectedApplication.id);
                
                // Select the item that takes its place, or the previous one if it was at the very bottom
                const fallbackApplication = sortedNextApps[currentIndex] || sortedNextApps[currentIndex - 1] || null;
                
                if (fallbackApplication) setSelectedId(fallbackApplication.id);
                else { setSelectedId(""); setDraft(createBlankApplication()); }
                
                return nextApplications;
            });

            setNotification({ type: "success", message: "Application deleted." });
        } catch (error) {
            setNotification({ type: "error", message: error?.message || "Failed to delete application." });
        } finally {
            setIsSaving(false);
        }
    }

    return { selectedId, setSelectedId, draft, setDraft, isSaving, selectedApplication, hasApplicationSelected, syncSelection, handleFieldChange, handleAddJob, handleSaveChanges, handleDeleteApplication };
}