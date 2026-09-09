import type { Address, UserProfile } from './user.types'

export function getDisplayName(user: Pick<UserProfile, 'name' | 'email'>): string { return user.name.trim() || user.email }
export function formatAddress(address: Address): string { return [address.line1, address.city, address.state, address.postalCode, address.country].filter(Boolean).join(', ') }
export function getDefaultAddress(addresses: Address[]): Address | undefined { return addresses.find((address) => address.isDefault) ?? addresses[0] }
