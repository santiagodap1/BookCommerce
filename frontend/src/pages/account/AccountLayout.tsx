import { Outlet } from 'react-router-dom'

import { AccountSidebar } from '../../components/sidebar/AccountSidebar'

import './Account.css'

export const AccountLayout = () => {


  return (
    <div className="app-shell">
      <div className="account-layout">
        <AccountSidebar />
        <section className="account-content">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
