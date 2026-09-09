'use client'

import { useState, type FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Toast from '../../../components/ui/Toast'
import { resetPassword } from '../auth.api'

export function ResetPasswordForm({ token }: { token: string }) {
  const [complete, setComplete] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); await resetPassword(token, String(new FormData(event.currentTarget).get('password'))); setComplete(true) }
  return complete ? <Toast>Password updated successfully.</Toast> : <form className="space-y-4" onSubmit={submit}><Input id="feature-reset-password" name="password" type="password" label="New password" minLength={8} required /><Input id="feature-reset-confirm" name="confirm" type="password" label="Confirm password" minLength={8} required /><Button className="w-full" type="submit">Update password</Button></form>
}

export default ResetPasswordForm