import type { AuthResponse, LoginInput, RegisterInput } from './auth.types'

const endpoint = '/api/auth'

async function post<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${endpoint}/${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!response.ok) throw new Error('The request could not be completed.')
  return response.json() as Promise<T>
}

export const login = (input: LoginInput) => post<AuthResponse>('login', input)
export const register = (input: RegisterInput) => post<AuthResponse>('register', input)
export const requestPasswordReset = (email: string) => post<void>('forgot-password', { email })
export const resetPassword = (token: string, password: string) => post<void>('reset-password', { token, password })
