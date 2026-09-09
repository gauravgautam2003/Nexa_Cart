import { getInitials } from '../../auth/auth.utils'
import type { UserProfile } from '../user.types'

export function UserAvatar({ user, size = 'md' }: { user: Pick<UserProfile, 'name' | 'avatarUrl'>; size?: 'sm' | 'md' | 'lg' }) { const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-20 text-xl' }; return <div className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 font-bold text-slate-700 ${sizes[size]}`}>{user.avatarUrl ? <img className="size-full object-cover" src={user.avatarUrl} alt={user.name} /> : getInitials(user)}</div> }
export default UserAvatar