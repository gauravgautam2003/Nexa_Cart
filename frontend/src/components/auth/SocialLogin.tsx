import Button from '../ui/Button'

export function SocialLogin({ onGoogle, onGithub }: { onGoogle?: () => void; onGithub?: () => void }) {
  return <div className="grid gap-3 sm:grid-cols-2"><Button variant="secondary" type="button" onClick={onGoogle}>Continue with Google</Button><Button variant="secondary" type="button" onClick={onGithub}>Continue with GitHub</Button></div>
}

export default SocialLogin