import type { AuthUser } from './auth.types'

export function getInitials(user: Pick<AuthUser, 'name'>): string {
  return user.name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('')
}

export function isAuthenticated(token: string | null | undefined): boolean {
  return Boolean(token)
}
