export function formatDate(value) {
    if (!value) {
        return "Not set";
    }
    return value.slice(0, 10);
}

export function getStatusBadgeClasses(status) {
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