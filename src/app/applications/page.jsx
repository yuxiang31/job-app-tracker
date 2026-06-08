"use client";

import { useApplications, statusOptions } from "./useApplications";
import AppHeader from "@/components/ui/AppHeader";
import SectionCard from "@/components/ui/SectionCard";
import ApplicationFilters from "@/components/applications/ApplicationFilters";
import ApplicationList from "@/components/applications/ApplicationList";
import ApplicationPagination from "@/components/applications/ApplicationPagination";
import ApplicationDetailForm from "@/components/applications/ApplicationDetailForm";

export default function ApplicationsPage() {
    const {
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
    } = useApplications();

    const detailTitle = draft.company || draft.role
        ? `${draft.company || "Untitled application"} - ${draft.role || "No role entered"}`
        : "New application draft";

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.16),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.12),_transparent_26%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
                <AppHeader title="Applications" activeTab="applications" />

                <SectionCard
                    eyebrow="Applications Workspace"
                    title="Track every role, resume, and note in one place"
                    description=""
                    meta={`${filteredApplications.length} of ${applications.length} shown`}
                >
                    {notification ? (
                        <div
                            className={`mb-4 rounded-[22px] border px-4 py-3 text-sm font-medium ${
                                notification.type === "success"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-rose-200 bg-rose-50 text-rose-700"
                            }`}
                        >
                            {notification.message}
                        </div>
                    ) : null}

                    <ApplicationFilters
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        statusOptions={statusOptions}
                        resumeFilter={resumeFilter}
                        setResumeFilter={setResumeFilter}
                        resumeOptions={resumeOptions}
                        sortOrder={sortOrder}
                        setSortOrder={setSortOrder}
                        handleAddJob={handleAddJob}
                    />

                    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                            <ApplicationList
                                isLoading={isLoading}
                                filteredApplications={filteredApplications}
                                paginatedApplications={paginatedApplications}
                                selectedId={selectedId}
                                syncSelection={syncSelection}
                                resumeLookup={resumeLookup}
                            />
                            
                            <ApplicationPagination
                                safeCurrentPage={safeCurrentPage}
                                totalPages={totalPages}
                                setCurrentPage={setCurrentPage}
                            />
                        </div>

                        <ApplicationDetailForm
                            hasApplicationSelected={hasApplicationSelected}
                            detailTitle={detailTitle}
                            draft={draft}
                            handleFieldChange={handleFieldChange}
                            statusOptions={statusOptions}
                            resumes={resumes}
                            handleSaveChanges={handleSaveChanges}
                            isSaving={isSaving}
                            handleDeleteApplication={handleDeleteApplication}
                            selectedApplication={selectedApplication}
                        />
                    </div>
                </SectionCard>
            </main>
        </div>
    );
}
