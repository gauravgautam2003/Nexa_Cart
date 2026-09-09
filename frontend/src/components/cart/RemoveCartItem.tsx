import Button from '../ui/Button'

export function RemoveCartItem({ onRemove }: { onRemove: () => void }) {
  return <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={onRemove}>Remove</Button>
}

export default RemoveCartItem