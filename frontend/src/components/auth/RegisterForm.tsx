'use client'

import { useState, type FormEvent } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'

export function RegisterForm({ onSubmit }: { onSubmit?: (data: { name: string; email: string; password: string }) => Promise<void> | void }) {
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setLoading(true); const data = new FormData(event.currentTarget); await onSubmit?.({ name: String(data.get('name')), email: String(data.get('email')), password: String(data.get('password')) }); setLoading(false) }
  return <form className="space-y-4" onSubmit={submit}><Input id="register-name" name="name" label="Full name" autoComplete="name" required /><Input id="register-email" name="email" type="email" label="Email" autoComplete="email" required /><Input id="register-password" name="password" type="password" label="Password" autoComplete="new-password" minLength={8} required /><Button className="w-full" type="submit" loading={loading}>Create account</Button></form>
}

export default RegisterForm