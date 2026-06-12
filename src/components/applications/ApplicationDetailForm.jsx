import SectionCard from "@/components/ui/SectionCard";

export default function ApplicationDetailForm({
    hasApplicationSelected,
    detailTitle,
    draft,
    handleFieldChange,
    statusOptions,
    resumes,
    handleSaveChanges,
    isSaving,
    handleDeleteApplication,
    selectedApplication,
}) {
    if (!hasApplicationSelected) {
        return (
            <SectionCard
                tone="dark"
                eyebrow="Selected Application Detail"
                title="Select an application to edit"
                description="Click an application on the left to update its status, salary range, resume, URL, and notes."
                meta="No application selected"
            />
        );
    }

    return (
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
                            {statusOptions.filter((option) => option !== "All").map((option) => (
                                <option key={option} value={option} className="bg-white text-slate-950">{option}</option>
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
                        <select name="resumeId" value={draft.resumeId} autoComplete="off" onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20">
                            <option value="" className="bg-white text-slate-950">Unassigned</option>
                            {resumes.map((resume) => (
                                <option key={resume.id} value={resume.id} className="bg-white text-slate-950">{resume.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span className="mb-2 block text-sm font-medium text-slate-300">Interview Date</span>
                        <input name="date" type="date" value={draft.date} autoComplete="off" onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition [color-scheme:dark] focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20" />
                    </label>
                </div>

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">URL</span>
                    <input name="url" value={draft.url} autoComplete="off" onChange={handleFieldChange} className="w-full rounded-2xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20" />
                </label>

                <label className="block">
                    <span className="mb-2 block text-sm font-medium text-slate-300">Notes</span>
                    <textarea name="notes" value={draft.notes} autoComplete="off" onChange={handleFieldChange} rows={8} className="w-full rounded-3xl border border-white/10 bg-slate-950/75 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-200/20" />
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={handleSaveChanges} disabled={isSaving} className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60">
                        {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={handleDeleteApplication} disabled={isSaving || !selectedApplication} className="inline-flex items-center justify-center rounded-2xl border border-rose-300/40 bg-rose-500/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                        {isSaving ? "Working..." : "Delete"}
                    </button>
                </div>
            </div>
        </SectionCard>
    );
}