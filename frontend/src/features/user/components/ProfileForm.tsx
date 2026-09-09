'use client'

import { useState, type FormEvent } from 'react'
import Button from '../../../components/ui/Button'
import Input from '../../../components/ui/Input'
import Toast from '../../../components/ui/Toast'
import type { UserProfile } from '../user.types'

export function ProfileForm({ user, onSubmit }: { user: UserProfile; onSubmit?: (profile: Partial<UserProfile>) => Promise<void> | void }) { const [saved, setSaved] = useState(false); const submit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const data = new FormData(event.currentTarget); await onSubmit?.({ name: String(data.get('name')), phone: String(data.get('phone')) }); setSaved(true) }; return <form className="space-y-4" onSubmit={submit}>{saved ? <Toast>Profile saved.</Toast> : null}<Input id="profile-name" name="name" label="Full name" defaultValue={user.name} required /><Input id="profile-email" label="Email" value={user.email} disabled /><Input id="profile-phone" name="phone" label="Phone" defaultValue={user.phone ?? ''} autoComplete="tel" /><Button type="submit">Save changes</Button></form> }
export default ProfileForm