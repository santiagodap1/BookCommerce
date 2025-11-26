import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import {
  addressApi,
  ordersApi,
  type Address,
  type AddressInput,
} from '../../services/api/account'
import './Checkout.css'

const EMPTY_ADDRESS: AddressInput = {
  label: '',
  recipientName: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  phone: '',
  isDefault: false,
}

export const Checkout = () => {
  const navigate = useNavigate()
  const {
    items,
    totalPrice,

    isLoading,
    loadCart,
    updateQuantity,
    removeItem,
  } = useCart()
  const { isAuthenticated } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [addressForm, setAddressForm] = useState<AddressInput>(EMPTY_ADDRESS)
  const [savingAddress, setSavingAddress] = useState(false)

  const loadAddresses = useCallback(async () => {
    try {
      const data = await addressApi.list()
      setAddresses(data)
      const defaultAddress = data.find((address) => address.isDefault)
      setSelectedAddress(defaultAddress?.id ?? data[0]?.id ?? '')
    } catch (err) {
      setError((err as Error).message)
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }

    void loadAddresses()
    void loadCart()
  }, [isAuthenticated, loadAddresses, loadCart, navigate])

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      setError('Please select a shipping address.')
      return
    }

    setPlacingOrder(true)
    try {
      await ordersApi.checkout(selectedAddress)
      await loadCart()
      navigate('/account/orders')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setPlacingOrder(false)
    }
  }

  const handleAddressChange = (
    field: keyof AddressInput,
    value: string | boolean,
  ) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSaveAddress = async (event: FormEvent) => {
    event.preventDefault()
    setSavingAddress(true)
    try {
      await addressApi.create(addressForm)
      await loadAddresses()
      setAddressForm(EMPTY_ADDRESS)
      setShowForm(false)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSavingAddress(false)
    }
  }

  return (
    <div className="app-shell">

      <main className="checkout">
        <section className="checkout__addresses">
          <h2>Shipping address</h2>
          {error && <p className="status error">{error}</p>}
          {addresses.length === 0 ? (
            <p className="empty-state">
              No addresses available. Please add one in your account section.
            </p>
          ) : (
            <ul>
              {addresses.map((address) => (
                <li key={address.id}>
                  <label>
                    <input
                      type="radio"
                      name="address"
                      checked={selectedAddress === address.id}
                      onChange={() => setSelectedAddress(address.id)}
                    />
                    <div>
                      <strong>{address.label}</strong>
                      <p>{address.recipientName}</p>
                      <p>
                        {address.street}, {address.city}
                      </p>
                      <p>
                        {address.postalCode}, {address.country}
                      </p>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
          )}
          <button className="link" type="button" onClick={() => setShowForm((prev) => !prev)}>
            {showForm ? 'Hide form' : 'Add new address'}
          </button>
          {showForm && (
            <form className="inline-form" onSubmit={handleSaveAddress}>
              <div className="form-grid">
                <label>
                  <span>Label</span>
                  <input
                    value={addressForm.label}
                    onChange={(event) => handleAddressChange('label', event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Recipient</span>
                  <input
                    value={addressForm.recipientName}
                    onChange={(event) => handleAddressChange('recipientName', event.target.value)}
                    required
                  />
                </label>
                <label className="full">
                  <span>Street</span>
                  <input
                    value={addressForm.street}
                    onChange={(event) => handleAddressChange('street', event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>City</span>
                  <input
                    value={addressForm.city}
                    onChange={(event) => handleAddressChange('city', event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>State</span>
                  <input
                    value={addressForm.state}
                    onChange={(event) => handleAddressChange('state', event.target.value)}
                  />
                </label>
                <label>
                  <span>Postal code</span>
                  <input
                    value={addressForm.postalCode}
                    onChange={(event) => handleAddressChange('postalCode', event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Country</span>
                  <input
                    value={addressForm.country}
                    onChange={(event) => handleAddressChange('country', event.target.value)}
                    required
                  />
                </label>
                <label>
                  <span>Phone</span>
                  <input
                    value={addressForm.phone}
                    onChange={(event) => handleAddressChange('phone', event.target.value)}
                  />
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={addressForm.isDefault ?? false}
                    onChange={(event) => handleAddressChange('isDefault', event.target.checked)}
                  />
                  <span>Default</span>
                </label>
              </div>
              <button className="primary" type="submit" disabled={savingAddress}>
                {savingAddress ? 'Saving...' : 'Save address'}
              </button>
            </form>
          )}
        </section>

        <section className="checkout__summary">
          <h2>Order summary</h2>
          {isLoading ? (
            <p className="status">Loading cart...</p>
          ) : items.length === 0 ? (
            <p className="empty-state">Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {items.map((item) => (
                  <li key={item.id}>
                    <div className="checkout-item">
                      <img src={item.coverUrl} alt={item.title} />
                      <div>
                        <strong>{item.title}</strong>
                        <span>{item.author}</span>
                        <div className="quantity-selector">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.bookId, Math.max(1, item.quantity - 1))
                            }
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.bookId, item.quantity + 1)}>
                            +
                          </button>
                          <button className="link" type="button" onClick={() => removeItem(item.bookId)}>
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <footer>
                <strong>Total: ${totalPrice.toFixed(2)}</strong>
                <button className="primary" onClick={handlePlaceOrder} disabled={placingOrder}>
                  {placingOrder ? 'Placing order...' : 'Place order'}
                </button>
              </footer>
            </>
          )}
        </section>
      </main>
    </div>
  )
}
