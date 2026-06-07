export default function ApplicationFilters({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    statusOptions,
    resumeFilter,
    setResumeFilter,
    resumeOptions,
    sortOrder,
    setSortOrder,
    handleAddJob,
}) {
    return (
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
                            <option key={option} value={option}>{option}</option>
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
                            <option key={option} value={option}>{option}</option>
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
    );
}