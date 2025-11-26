import { useEffect, useState, type FormEvent } from 'react'
import { addressApi, type Address, type AddressInput } from '../../services/api/account'

const EMPTY_FORM: AddressInput = {
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

export const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<AddressInput>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const loadAddresses = async () => {
    setLoading(true)
    try {
      const data = await addressApi.list()
      setAddresses(data)
      setError(null)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadAddresses()
  }, [])

  const handleChange = (field: keyof AddressInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      if (editingId) {
        await addressApi.update(editingId, form)
      } else {
        await addressApi.create(form)
      }
      await loadAddresses()
      resetForm()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (address: Address) => {
    setEditingId(address.id)
    setForm(address)
  }

  const handleDelete = async (id: string) => {
    await addressApi.remove(id)
    await loadAddresses()
    if (editingId === id) {
      resetForm()
    }
  }

  if (loading) {
    return <p className="status">Loading addresses...</p>
  }

  return (
    <div className="addresses">
      {error && <p className="status error">{error}</p>}
      <form className="address-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Label</span>
            <input
              value={form.label}
              onChange={(event) => handleChange('label', event.target.value)}
              required
            />
          </label>
          <label>
            <span>Recipient name</span>
            <input
              value={form.recipientName}
              onChange={(event) => handleChange('recipientName', event.target.value)}
              required
            />
          </label>
          <label className="full">
            <span>Street</span>
            <input
              value={form.street}
              onChange={(event) => handleChange('street', event.target.value)}
              required
            />
          </label>
          <label>
            <span>City</span>
            <input
              value={form.city}
              onChange={(event) => handleChange('city', event.target.value)}
              required
            />
          </label>
          <label>
            <span>State</span>
            <input
              value={form.state}
              onChange={(event) => handleChange('state', event.target.value)}
            />
          </label>
          <label>
            <span>Postal code</span>
            <input
              value={form.postalCode}
              onChange={(event) => handleChange('postalCode', event.target.value)}
              required
            />
          </label>
          <label>
            <span>Country</span>
            <input
              value={form.country}
              onChange={(event) => handleChange('country', event.target.value)}
              required
            />
          </label>
          <label>
            <span>Phone</span>
            <input
              value={form.phone}
              onChange={(event) => handleChange('phone', event.target.value)}
            />
          </label>
          <label className="checkbox">
            <input
              type="checkbox"
              checked={form.isDefault ?? false}
              onChange={(event) => handleChange('isDefault', event.target.checked)}
            />
            <span>Default address</span>
          </label>
        </div>
        <div className="form-actions">
          {editingId && <button onClick={resetForm}>Cancel</button>}
          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? 'Saving...' : editingId ? 'Update address' : 'Add address'}
          </button>
        </div>
      </form>

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <p className="empty-state">No addresses saved.</p>
        ) : (
          addresses.map((address) => (
            <article key={address.id} className={`address-card ${address.isDefault ? 'default' : ''}`}>
              <header>
                <strong>{address.label}</strong>
                {address.isDefault && <span className="badge">Default</span>}
              </header>
              <p>{address.recipientName}</p>
              <p>
                {address.street}, {address.city}
              </p>
              <p>
                {address.postalCode}, {address.country}
              </p>
              {address.phone && <p>{address.phone}</p>}
              <div className="address-card__actions">
                <button className="link" type="button" onClick={() => handleEdit(address)}>
                  Edit
                </button>
                <button className="link" type="button" onClick={() => handleDelete(address.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
