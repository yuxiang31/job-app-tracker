export const statusOptions = ["All", "Applied", "Interview", "Rejected", "Offer"];

export function createBlankApplication() {
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

export function normalizeApplication(row) {
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