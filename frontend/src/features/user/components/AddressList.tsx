import Button from '../../../components/ui/Button'
import EmptyState from '../../../components/ui/EmptyState'
import type { Address } from '../user.types'
import { formatAddress } from '../user.utils'

export function AddressList({ addresses, onEdit, onRemove }: { addresses: Address[]; onEdit?: (address: Address) => void; onRemove?: (id: string) => void }) { if (!addresses.length) return <EmptyState title="No saved addresses" description="Add an address during checkout or from your profile." />; return <div className="grid gap-4 sm:grid-cols-2">{addresses.map((address) => <article className="rounded-xl border border-slate-200 p-4" key={address.id}><div className="flex justify-between gap-3"><h3 className="font-bold">{address.label}</h3>{address.isDefault ? <span className="text-xs font-semibold text-emerald-700">Default</span> : null}</div><p className="mt-2 text-sm leading-6 text-slate-600">{formatAddress(address)}</p><div className="mt-4 flex gap-2"><Button variant="secondary" onClick={() => onEdit?.(address)}>Edit</Button><Button variant="ghost" className="text-red-600" onClick={() => onRemove?.(address.id)}>Remove</Button></div></article>)}</div> }
export default AddressList