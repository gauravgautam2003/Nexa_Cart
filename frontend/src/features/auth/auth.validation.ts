import type { LoginInput, RegisterInput } from './auth.types'

export type ValidationErrors<T> = Partial<Record<keyof T, string>>

export function validateLogin(input: LoginInput): ValidationErrors<LoginInput> {
  const errors: ValidationErrors<LoginInput> = {}
  if (!input.email.includes('@')) errors.email = 'Enter a valid email address.'
  if (!input.password) errors.password = 'Password is required.'
  return errors
}

export function validateRegister(input: RegisterInput): ValidationErrors<RegisterInput> {
  const errors: ValidationErrors<RegisterInput> = { ...validateLogin(input) }
  if (!input.name.trim()) errors.name = 'Name is required.'
  if (input.password.length < 8) errors.password = 'Password must be at least 8 characters.'
  return errors
}
