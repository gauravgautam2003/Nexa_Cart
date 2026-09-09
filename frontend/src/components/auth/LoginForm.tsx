'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import Button from '../ui/Button'
import Input from '../ui/Input'

export function LoginForm({ onSubmit }: { onSubmit?: (email: string, password: string) => Promise<void> | void }) {
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); const data = new FormData(event.currentTarget); await onSubmit?.(String(data.get('email')), String(data.get('password'))); setLoading(false) }
  return <form className="space-y-4" onSubmit={submit}><Input id="login-email" name="email" type="email" label="Email" autoComplete="email" required /><Input id="login-password" name="password" type="password" label="Password" autoComplete="current-password" required /><div className="flex justify-end"><Link className="text-sm font-semibold text-slate-700 hover:text-slate-950" href="/forgot-password">Forgot password?</Link></div><Button className="w-full" type="submit" loading={loading}>Sign in</Button></form>
}

export default LoginForm