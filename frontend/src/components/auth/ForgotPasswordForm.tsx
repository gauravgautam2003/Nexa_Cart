'use client'

import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Toast from '../ui/Toast'

export function ForgotPasswordForm({ onSubmit }: { onSubmit?: (email: string) => Promise<void> | void }) {
  const [sent, setSent] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); await onSubmit?.(String(new FormData(event.currentTarget).get('email'))); setSent(true) }
  return sent ? <Toast>Check your email for a password reset link.</Toast> : <form className="space-y-4" onSubmit={submit}><Input id="forgot-email" name="email" type="email" label="Email" autoComplete="email" required /><Button className="w-full" type="submit">Send reset link</Button></form>
}

export default ForgotPasswordForm