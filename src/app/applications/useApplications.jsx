import { useApplicationData } from "../../hooks/useApplicationData";
import { useApplicationForm } from "../../hooks/useApplicationForm";
import { useApplicationFilters } from "../../hooks/useApplicationFilters";
import { usePagination } from "../../hooks/usePagination";
import { statusOptions } from "./utils";

export { statusOptions };

export function useApplications() {
    const { applications, setApplications, resumes, isLoading, notification, setNotification } = useApplicationData();

    const {
        selectedId, draft, isSaving, selectedApplication, hasApplicationSelected, syncSelection,
        handleFieldChange, handleAddJob, handleSaveChanges, handleDeleteApplication,
    } = useApplicationForm(applications, setApplications, setNotification, isLoading);

    let resetPage;

    const {
        statusFilter, setStatusFilter, resumeFilter, setResumeFilter,
        searchQuery, setSearchQuery, sortOrder, setSortOrder,
        resumeLookup, resumeOptions, filteredApplications,
    } = useApplicationFilters(applications, draft, selectedId, selectedApplication, resumes, () => {
        if (resetPage) resetPage();
    });

    const {
        currentPage, setCurrentPage, totalPages, safeCurrentPage, paginatedItems: paginatedApplications,
    } = usePagination(filteredApplications, 5);

    resetPage = () => setCurrentPage(1);

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