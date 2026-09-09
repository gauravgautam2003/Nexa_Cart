'use client'

import { useState, type FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { register } from '../auth.api'
import { validateRegister } from '../auth.validation'
import type { RegisterInput } from '../auth.types'

export function RegisterForm({ onSuccess }: { onSuccess?: (result: Awaited<ReturnType<typeof register>>) => void }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget)
    const input: RegisterInput = { name: String(data.get('name')), email: String(data.get('email')), password: String(data.get('password')) }
    const errors = validateRegister(input); if (Object.keys(errors).length) return setError(Object.values(errors)[0] as string)
    setLoading(true); try { onSuccess?.(await register(input)) } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to create account.') } finally { setLoading(false) }
  }
  return <form className="space-y-4" onSubmit={submit}>{error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}<Input id="feature-register-name" name="name" label="Full name" required /><Input id="feature-register-email" name="email" type="email" label="Email" required /><Input id="feature-register-password" name="password" type="password" label="Password" minLength={8} required /><Button className="w-full" type="submit" loading={loading}>Create account</Button></form>
}

export default RegisterForm