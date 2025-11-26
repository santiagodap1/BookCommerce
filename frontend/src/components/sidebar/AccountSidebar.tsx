import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/account/orders', label: 'Purchase history' },
  { to: '/account/addresses', label: 'Saved addresses' },
]

export const AccountSidebar = () => {
  const { user } = useAuth()

  return (
    <aside className="account-sidebar">
      <div className="account-sidebar__card">
        <span className="account-chip__label">Account</span>
        <strong>{user?.name || user?.email}</strong>
        {user?.isAdmin && <span className="badge">Admin</span>}
      </div>
      <nav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
