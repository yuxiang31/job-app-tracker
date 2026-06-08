import { formatDate, getStatusBadgeClasses } from "@/utils/helpers";

export default function ApplicationList({
    isLoading,
    filteredApplications,
    paginatedApplications,
    selectedId,
    syncSelection,
    resumeLookup,
}) {
    return (
        <>
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
                                                <a href={application.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="truncate text-sky-600 decoration-sky-300 underline-offset-4 hover:underline" title={application.url}>
                                                    {application.url}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start justify-end">
                                    <span className={`inline-flex w-fit rounded-full border px-3 py-1 text-sm font-semibold ${getStatusBadgeClasses(statusLabel)}`}>
                                        {statusLabel}
                                    </span>
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </>
    );
}