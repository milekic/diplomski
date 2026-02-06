import { useMemo, useState } from "react";

export default function usePagination(items = [], pageSize = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(items.length / pageSize));
  }, [items.length, pageSize]);

  const pagedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return items.slice(startIndex, startIndex + pageSize);
  }, [items, currentPage, pageSize]);

  const goTo = (page) => {
    const safe = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(safe);
  };

  const next = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const prev = () => setCurrentPage((p) => Math.max(1, p - 1));

  const reset = () => setCurrentPage(1);

  return {
    currentPage,
    totalPages,
    pagedItems,
    setCurrentPage: goTo,
    next,
    prev,
    reset,
  };
}
