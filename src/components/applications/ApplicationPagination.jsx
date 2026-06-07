export default function ApplicationPagination({
    safeCurrentPage,
    totalPages,
    setCurrentPage,
}) {
    return (
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
    );
}