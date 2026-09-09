import Button from '../ui/Button'

export function CheckoutButton({ loading = false }: { loading?: boolean }) {
  return <Button className="w-full" type="submit" loading={loading}>Place order</Button>
}

export default CheckoutButton