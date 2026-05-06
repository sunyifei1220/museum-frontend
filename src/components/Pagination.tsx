interface PaginationProps {
  page: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, total, pageSize, onPageChange }: PaginationProps) {
  const pageCount = Math.ceil(total / pageSize);
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button
        className="rounded border px-3 py-1 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        上一页
      </button>
      <span className="text-sm text-slate-600">
        {page} / {pageCount || 1}
      </span>
      <button
        className="rounded border px-3 py-1 text-sm hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= pageCount}
      >
        下一页
      </button>
    </div>
  );
}
