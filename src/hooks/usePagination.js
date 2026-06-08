import { useState, useMemo } from "react";

export function usePagination(items, itemsPerPage = 5) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const paginatedItems = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * itemsPerPage;
        return items.slice(startIndex, startIndex + itemsPerPage);
    }, [items, safeCurrentPage, itemsPerPage]);

    return {
        currentPage,
        setCurrentPage,
        totalPages,
        safeCurrentPage,
        paginatedItems,
    };
}