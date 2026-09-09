'use client'

import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Toast from '../ui/Toast'

export function ResetPasswordForm({ onSubmit }: { onSubmit?: (password: string) => Promise<void> | void }) {
  const [complete, setComplete] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const password = String(new FormData(event.currentTarget).get('password')); await onSubmit?.(password); setComplete(true) }
  return complete ? <Toast>Password updated successfully.</Toast> : <form className="space-y-4" onSubmit={submit}><Input id="reset-password" name="password" type="password" label="New password" autoComplete="new-password" minLength={8} required /><Input id="reset-confirm" name="confirm" type="password" label="Confirm password" autoComplete="new-password" minLength={8} required /><Button className="w-full" type="submit">Update password</Button></form>
}

export default ResetPasswordForm