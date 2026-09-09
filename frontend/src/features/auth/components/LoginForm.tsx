'use client'

import { useState, type FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import { login } from '../auth.api'
import { validateLogin } from '../auth.validation'
import type { LoginInput } from '../auth.types'

export function LoginForm({ onSuccess }: { onSuccess?: (result: Awaited<ReturnType<typeof login>>) => void }) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const input: LoginInput = { email: String(data.get('email')), password: String(data.get('password')) }
    const errors = validateLogin(input)
    if (Object.keys(errors).length) return setError(Object.values(errors)[0] as string)
    setLoading(true)
    try { onSuccess?.(await login(input)) } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.') } finally { setLoading(false) }
  }
  return <form className="space-y-4" onSubmit={submit}>{error ? <p className="text-sm text-red-600" role="alert">{error}</p> : null}<Input id="feature-login-email" name="email" type="email" label="Email" required /><Input id="feature-login-password" name="password" type="password" label="Password" required /><Button className="w-full" type="submit" loading={loading}>Sign in</Button></form>
}

export default LoginForm