import Spinner from './Spinner'

export function Loader({ label = 'Loading...' }: { label?: string }) {
    return <div className="flex min-h-32 items-center justify-center gap-3 text-sm text-slate-500" role="status"><Spinner />{label}</div>
}

export default Loader