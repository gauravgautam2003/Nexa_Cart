import type { ReactNode } from 'react'

type ModalProps = { open: boolean; title: string; onClose: () => void; children: ReactNode }

export function Modal({ open, title, onClose, children }: ModalProps) {
    if (!open) return null
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4" role="dialog" aria-modal="true" aria-label={title}>
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-slate-900">{title}</h2>
                    <button className="rounded-md px-2 py-1 text-xl text-slate-500 hover:bg-slate-100" onClick={onClose} aria-label="Close dialog">&times;</button>
                </div>
                {children}
            </div>
        </div>
    )
}

export default Modal