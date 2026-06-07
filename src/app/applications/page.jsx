"use client";

import { useApplications, statusOptions } from "./useApplications";
import AppHeader from "@/components/ui/AppHeader";
import SectionCard from "@/components/ui/SectionCard";

function formatDate(value) {
    if (!value) {
        return "Not set";
    }

    return value.slice(0, 10);
}

function getStatusBadgeClasses(status) {
    switch (status) {
        case "Applied":
            return "border-amber-200 bg-amber-100 text-amber-800";
        case "Interview":
            return "border-orange-200 bg-orange-100 text-orange-800";
        case "Rejected":
            return "border-rose-200 bg-rose-100 text-rose-800";
        case "Offer":
            return "border-emerald-200 bg-emerald-100 text-emerald-800";
        case "Saved":
        default:
            return "border-slate-200 bg-slate-100 text-slate-700";
    }
}

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

                    <div className="flex flex-col gap-4 rounded-[24px] border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-end lg:justify-between">
                        <div className="grid w-full gap-3 md:grid-cols-2 lg:grid-cols-4 lg:w-auto lg:flex-1 lg:max-w-4xl">
                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                    Search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Company or role..."
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                    Status
                                </span>
                                <select
                                    value={statusFilter}
                                    onChange={(event) => setStatusFilter(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                    Resume Used
                                </span>
                                <select
                                    value={resumeFilter}
                                    onChange={(event) => setResumeFilter(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                >
                                    {resumeOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="block">
                                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                                    Sort Date
                                </span>
                                <select
                                    value={sortOrder}
                                    onChange={(event) => setSortOrder(event.target.value)}
                                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                                >
                                    <option value="desc">Latest to Oldest</option>
                                    <option value="asc">Oldest to Latest</option>
                                </select>
                            </label>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddJob}
                            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            + Add Job
                        </button>
                    </div>

                    <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
                            <div className="grid grid-cols-[minmax(0,1fr)_auto] border-b border-slate-200 bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-200">
                                <div>Application Details</div>
                                <div>Status</div>
                            </div>

                            <div className="flex flex-col divide-y divide-slate-200">
                                {isLoading ? (
                                    <div className="px-5 py-12 text-sm text-slate-500">Loading applications...</div>
                                ) : filteredApplications.length === 0 ? (
                                    <div className="px-5 py-12 text-sm text-slate-500">
                                        No applications match the current filters.
                                    </div>
                                ) : (
                                    paginatedApplications.map((application) => {
                                        const isSelected = application.id === selectedId;
                                        const resumeLabel = application.resumeId
                                            ? resumeLookup[application.resumeId] || "Resume removed"
                                            : "Unassigned";
                                        const statusLabel = application.status || "Saved";

                                        return (
                                            <button
                                                key={application.id}
                                                type="button"
                                                onClick={() => syncSelection(application.id)}
                                                className={`grid w-full grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 text-left transition hover:bg-slate-50 ${
                                                    isSelected ? "bg-sky-50/70" : "bg-white"
                                                }`}
                                            >
                                                <div className="min-w-0 space-y-3">
                                                    <div>
                                                        <p className="text-base font-semibold text-slate-950">
                                                            {application.company || "Untitled application"}
                                                        </p>
                                                        <p className="mt-0.5 text-sm font-medium text-slate-600">
                                                            {application.role || "No role entered"}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col gap-2.5">
                                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                            <div className="flex items-center gap-1.5" title="Resume Used">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
                                                                <span className="max-w-[140px] truncate font-medium text-slate-700">{resumeLabel}</span>
                                                            </div>
                                                            
                                                            <div className="flex items-center gap-1.5" title="Salary Range">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                                                <span className="font-medium text-slate-700">{application.salaryRange || "Not set"}</span>
                                                            </div>

                                                            <div className="flex items-center gap-1.5" title="Apply Date">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                                                <span className="font-medium text-slate-700">Applied: {formatDate(application.createdAt)}</span>
                                                            </div>

                                                            {application.date && (
                                                                <div className="flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-0.5 text-sky-700 ring-1 ring-inset ring-sky-600/20" title="Interview Date">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                                                                    <span className="font-semibold">Interview: {formatDate(application.date)}</span>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {application.url && (
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-slate-400"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                                                                <a
                                                                    href={application.url}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="truncate text-sky-600 decoration-sky-300 underline-offset-4 hover:underline"
                                                                    title={application.url}
                                                                >
                                                                    {application.url}
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex items-start justify-end">
                                                    <span
                                                        className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-semibold ${getStatusBadgeClasses(statusLabel)}`}
                                                    >
                                                        {statusLabel}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                            
                            {/* Pagination Controls */}
                            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-3">
                                <button
                                    type="button"
                                    disabled={safeCurrentPage === 1}
                                    onClick={() => setCurrentPage(safeCurrentPage - 1)}
                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
                                >
                                    Previous
                                </button>
                                <span className="text-sm font-medium text-slate-500">
                                    Page {safeCurrentPage} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={safeCurrentPage === totalPages}
                                    onClick={() => setCurrentPage(safeCurrentPage + 1)}
                                    className="rounded-lg px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-200 disabled:opacity-50 disabled:hover:bg-transparent"
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {hasApplicationSelected ? (
                            <SectionCard
                                tone="dark"
                                eyebrow="Selected Application Detail"
                                title={detailTitle}
                                description="Edit the selected application, including status, salary range, resume, URL, and notes."
                            >
                                <div className="grid gap-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-300">Company</span>
                                            <input
                                                name="company"
                                                value={draft.company}
                                                autoComplete="off"
                                                onChange={handleFieldChange}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-300">Role</span>
                                            <input
                                                name="role"
                                                value={draft.role}
                                                autoComplete="off"
                                                onChange={handleFieldChange}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-300">Status</span>
                                            <select
                                                name="status"
                                                value={draft.status}
                                                autoComplete="off"
                                                onChange={handleFieldChange}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                            >
                                                {statusOptions
                                                    .filter((option) => option !== "All")
                                                    .map((option) => (
                                                        <option key={option} value={option} className="text-slate-950">
                                                            {option}
                                                        </option>
                                                    ))}
                                            </select>
                                        </label>

                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-300">Salary Range</span>
                                            <input
                                                name="salaryRange"
                                                value={draft.salaryRange}
                                                autoComplete="off"
                                                onChange={handleFieldChange}
                                                placeholder="e.g. $90k - $120k"
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                            />
                                        </label>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-300">Resume</span>
                                            <select
                                                name="resumeId"
                                                value={draft.resumeId}
                                                autoComplete="off"
                                                onChange={handleFieldChange}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                            >
                                                <option value="" className="text-slate-950">
                                                    Unassigned
                                                </option>
                                                {resumes.map((resume) => (
                                                    <option key={resume.id} value={resume.id} className="text-slate-950">
                                                        {resume.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>

                                        <label className="block">
                                            <span className="mb-2 block text-sm font-medium text-slate-300">Interview Date</span>
                                            <input
                                                name="date"
                                                type="date"
                                                value={draft.date}
                                                autoComplete="off"
                                                onChange={handleFieldChange}
                                                className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition [color-scheme:dark] focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                            />
                                        </label>
                                    </div>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-slate-300">URL</span>
                                        <input
                                            name="url"
                                            value={draft.url}
                                            autoComplete="off"
                                            onChange={handleFieldChange}
                                            className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                        />
                                    </label>

                                    <label className="block">
                                        <span className="mb-2 block text-sm font-medium text-slate-300">Notes</span>
                                        <textarea
                                            name="notes"
                                            value={draft.notes}
                                            autoComplete="off"
                                            onChange={handleFieldChange}
                                            rows={8}
                                            className="w-full rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20"
                                        />
                                    </label>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={handleSaveChanges}
                                            disabled={isSaving}
                                            className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDeleteApplication}
                                            disabled={isSaving || !selectedApplication}
                                            className="inline-flex items-center justify-center rounded-2xl border border-rose-300/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSaving ? "Working..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            </SectionCard>
                        ) : (
                            <SectionCard
                                tone="dark"
                                eyebrow="Selected Application Detail"
                                title="Select an application to edit"
                                description="Click an application on the left to update its status, salary range, resume, URL, and notes."
                                meta="No application selected"
                            />
                        )}
                    </div>
                </SectionCard>
            </main>
        </div>
    );
}
