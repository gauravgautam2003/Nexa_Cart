import Button from './Button'

type PaginationProps = { page: number; totalPages: number; onChange: (page: number) => void }

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
    return <nav className="flex items-center justify-center gap-2" aria-label="Pagination"><Button variant="secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button><span className="px-2 text-sm text-slate-600">Page {page} of {totalPages}</span><Button variant="secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</Button></nav>
}

export default Pagination