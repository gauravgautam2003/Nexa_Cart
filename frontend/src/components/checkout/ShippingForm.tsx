import AddressForm from './AddressForm'
import Select from '../ui/Select'

export function ShippingForm() {
  return <section className="space-y-6"><AddressForm /><Select id="shipping-method" label="Delivery method" defaultValue="standard"><option value="standard">Standard delivery (3-5 days)</option><option value="express">Express delivery (1-2 days)</option></Select></section>
}

export default ShippingForm