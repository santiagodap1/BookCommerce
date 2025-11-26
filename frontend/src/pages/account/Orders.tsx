import { useEffect, useState } from 'react'
import { ordersApi } from '../../services/api/account'
import type { Order } from '../../services/api/account'

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const load = async () => {
      setLoading(true)
      try {
        const data = await ordersApi.list()
        if (!active) return
        setOrders(data)
        setError(null)
      } catch (err) {
        if (!active) return
        setError((err as Error).message)
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return <p className="status">Loading orders...</p>
  }

  if (error) {
    return <p className="status error">{error}</p>
  }

  if (orders.length === 0) {
    return <p className="empty-state">No purchases yet.</p>
  }

  return (
    <div className="orders">
      {orders.map((order) => (
        <article key={order.id} className="order-card">
          <header>
            <div>
              <span className="account-chip__label">Order</span>
              <strong>#{order.id.slice(0, 8).toUpperCase()}</strong>
            </div>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </header>
          <ul>
            {order.items.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.author}</span>
                </div>
                <div>
                  <span>x{item.quantity}</span>
                  <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                </div>
              </li>
            ))}
          </ul>
          <footer>
            <span>Status: {order.status}</span>
            <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
          </footer>
        </article>
      ))}
    </div>
  )
}
