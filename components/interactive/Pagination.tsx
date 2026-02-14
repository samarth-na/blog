import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl?: string;
}

export function BlogPagination({ currentPage, totalPages, baseUrl = "/page" }: PaginationProps) {
  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  return (
    <div className="flex gap-4 text-sm">
      {prevPage ? (
        <Link href={`${baseUrl}/${prevPage}`} className="text-muted-foreground hover:text-foreground">
          ← prev
        </Link>
      ) : (
        <span className="text-muted-foreground">← prev</span>
      )}
      <span className="text-xs text-muted-foreground">page {currentPage} of {totalPages}</span>
      {nextPage ? (
        <Link href={`${baseUrl}/${nextPage}`} className="text-muted-foreground hover:text-foreground">
          next →
        </Link>
      ) : (
        <span className="text-muted-foreground">next →</span>
      )}
    </div>
  );
}
