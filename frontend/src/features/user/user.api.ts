import type { Address, UserProfile } from './user.types'

const endpoint = '/api/user'
async function request<T>(path: string, options?: RequestInit): Promise<T> { const response = await fetch(`${endpoint}${path}`, options); if (!response.ok) throw new Error('Unable to load account information.'); return response.json() as Promise<T> }
export const getProfile = () => request<UserProfile>('/profile')
export const updateProfile = (profile: Partial<UserProfile>) => request<UserProfile>('/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
export const getAddresses = () => request<Address[]>('/addresses')
export const saveAddress = (address: Omit<Address, 'id'> | Address) => request<Address>('/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(address) })
