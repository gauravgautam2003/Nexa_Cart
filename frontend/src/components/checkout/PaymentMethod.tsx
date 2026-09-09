'use client'

import Radio from '../ui/Radio'

export function PaymentMethod() {
  return <fieldset className="space-y-3"><legend className="mb-3 text-lg font-bold text-slate-900">Payment method</legend><label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"><Radio id="payment-card" name="payment" value="card" defaultChecked label="Credit or debit card" /></label><label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4"><Radio id="payment-paypal" name="payment" value="paypal" label="PayPal" /></label></fieldset>
}

export default PaymentMethod