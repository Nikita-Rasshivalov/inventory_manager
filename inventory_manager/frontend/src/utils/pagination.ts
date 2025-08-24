export const getPageNumbers = (
  page: number,
  totalPages: number,
  delta = 3
): (number | string)[] => {
  const pages: (number | string)[] = [];

  let start = Math.max(2, page - delta);
  let end = Math.min(totalPages - 1, page + delta);

  if (page - delta <= 2) {
    start = 2;
    end = Math.min(2 * delta + 1, totalPages - 1);
  }

  if (page + delta >= totalPages - 1) {
    start = Math.max(totalPages - 2 * delta, 2);
    end = totalPages - 1;
  }

  pages.push(1);

  if (start > 2) pages.push("...");

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push("...");

  if (totalPages > 1) pages.push(totalPages);

  return pages;
};
