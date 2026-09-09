'use client'

import { useState, type FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Toast from '../../../components/ui/Toast'
import { requestPasswordReset } from '../auth.api'

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); await requestPasswordReset(String(new FormData(event.currentTarget).get('email'))); setSent(true) }
  if (sent) return <Toast>Check your email for a password reset link.</Toast>
  return <form className="space-y-4" onSubmit={submit}><Input id="feature-forgot-email" name="email" type="email" label="Email" required /><Button className="w-full" type="submit">Send reset link</Button></form>
}

export default ForgotPasswordForm