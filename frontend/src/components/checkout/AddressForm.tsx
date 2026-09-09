import Input from '../ui/Input'

export function AddressForm() {
  return <fieldset className="space-y-4"><legend className="mb-3 text-lg font-bold text-slate-900">Shipping address</legend><Input id="address-name" label="Full name" autoComplete="name" required /><Input id="address-line" label="Address" autoComplete="street-address" required /><div className="grid gap-4 sm:grid-cols-2"><Input id="address-city" label="City" autoComplete="address-level2" required /><Input id="address-postal" label="Postal code" autoComplete="postal-code" required /></div><Input id="address-country" label="Country" autoComplete="country-name" required /></fieldset>
}

export default AddressForm