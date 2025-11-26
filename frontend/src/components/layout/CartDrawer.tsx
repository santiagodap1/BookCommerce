import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import './CartDrawer.css'

export const CartDrawer = () => {
  const navigate = useNavigate()
  const {
    items,
    isOpen,
    toggleCart,
    updateQuantity,
    removeItem,
    totalPrice,
    isLoading,
  } = useCart()
  const { isAuthenticated } = useAuth()

  return (
    <>
      <div
        className={`cart-backdrop ${isOpen ? 'open' : ''}`}
        onClick={() => toggleCart(false)}
        aria-hidden="true"
      />
      <aside
        className={`cart-drawer ${isOpen ? 'open' : ''}`}
        aria-label="Shopping cart"
      >
        <div className="cart-drawer__header">
          <h3>Your cart</h3>
          <button onClick={() => toggleCart(false)} aria-label="Close cart">
            ×
          </button>
        </div>

        {!isAuthenticated ? (
          <p className="empty-state">Sign in to view and manage your cart.</p>
        ) : isLoading ? (
          <p className="empty-state">Syncing your cart...</p>
        ) : items.length === 0 ? (
          <p className="empty-state">You have not added any books yet.</p>
        ) : (
          <ul className="cart-list">
            {items.map((item) => (
              <li key={item.id}>
                <div>
                  <p className="cart-title">{item.title}</p>
                  <span className="cart-author">{item.author}</span>
                </div>

                <div className="cart-actions">
                  <div className="quantity-selector">
                    <button
                      onClick={() =>
                        updateQuantity(item.bookId, Math.max(1, item.quantity - 1))
                      }
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.bookId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    className="link"
                    onClick={() => removeItem(item.bookId)}
                    aria-label="Remove from cart"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="cart-drawer__footer">
          <div>
            <p>Total</p>
            <strong>${totalPrice.toFixed(2)}</strong>
          </div>
          <button
            className="primary"
            disabled={!isAuthenticated || items.length === 0}
            onClick={() => {
              toggleCart(false)
              if (isAuthenticated && items.length > 0) {
                navigate('/checkout')
              }
            }}
          >
            {isAuthenticated ? 'Proceed to checkout' : 'Login to continue'}
          </button>
        </div>
      </aside>
    </>
  )
}
