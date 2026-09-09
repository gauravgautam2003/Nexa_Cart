'use client'

import { useState, type FormEvent } from 'react'
import CheckoutButton from './CheckoutButton'
import PaymentMethod from './PaymentMethod'
import ShippingForm from './ShippingForm'
import Toast from '../ui/Toast'

export function CheckoutForm({ onSubmit }: { onSubmit?: () => Promise<void> | void }) {
  const [loading, setLoading] = useState(false)
  const [complete, setComplete] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); await onSubmit?.(); setLoading(false); setComplete(true) }
  return <form className="space-y-8" onSubmit={submit}>{complete ? <Toast>Order placed successfully.</Toast> : null}<ShippingForm /><PaymentMethod /><CheckoutButton loading={loading} /></form>
}

export default CheckoutForm