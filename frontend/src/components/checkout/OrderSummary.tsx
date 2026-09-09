import Card from '../ui/Card'

export type SummaryLine = { label: string; amount: number }
export function OrderSummary({ lines, total, currency = '$' }: { lines: SummaryLine[]; total: number; currency?: string }) {
  return <Card><h2 className="text-lg font-bold text-slate-900">Order summary</h2><dl className="mt-4 space-y-3 text-sm">{lines.map((line) => <div className="flex justify-between" key={line.label}><dt className="text-slate-500">{line.label}</dt><dd>{currency}{line.amount.toFixed(2)}</dd></div>)}<div className="flex justify-between border-t border-slate-200 pt-3 text-base font-bold"><dt>Total</dt><dd>{currency}{total.toFixed(2)}</dd></div></dl></Card>
}

export default OrderSummary