import { Link, useNavigate } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

type HeaderProps = {
  onToggleCart: () => void
  onAuthClick: (mode: 'login' | 'register') => void
  onToggleSidebar: () => void
}

export const Header = ({ onToggleCart, onAuthClick, onToggleSidebar }: HeaderProps) => {
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, logout } = useAuth()

  return (
    <header className="header">
      <div className="branding">
        <button
          className="menu-button"
          onClick={onToggleSidebar}
          aria-label="Toggle menu"
        >
          <Menu size={24} />
        </button>
        <Link to="/" className="logo">
          BookCommerce
        </Link>
        <p className="tagline">Your digital book shop always open</p>
      </div>

      <div className="header-actions">
        {user ? (
          <div className="account-chip">
            <div>
              <span className="account-chip__label">Signed in</span>

            </div>
            <div className="account-chip__actions">
              <button className="link" onClick={() => navigate('/account/orders')}>
                Account
              </button>
              <button className="link" onClick={logout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <button className="link" onClick={() => onAuthClick('login')}>
              Login
            </button>
            <button className="link" onClick={() => onAuthClick('register')}>
              Create account
            </button>
          </div>
        )}
        <button className="cart-button" onClick={onToggleCart} aria-label="Open cart">
          <span>Cart</span>
          <span className="cart-bubble">{totalItems}</span>
        </button>
      </div>
    </header>
  )
}
