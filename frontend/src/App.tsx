import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { BookDetails } from './pages/book/BookDetails'
import { CartDrawer } from './components/layout/CartDrawer'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { AccountLayout } from './pages/account/AccountLayout'
import { Orders } from './pages/account/Orders'
import { Addresses } from './pages/account/Addresses'
import { Checkout } from './pages/checkout/Checkout'
import { Layout } from './components/layout/Layout'
import { About } from './pages/about/About'
import { Contact } from './pages/contact/Contact'
import { ApiInfo } from './pages/api-info/ApiInfo'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/api-info" element={<ApiInfo />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <AccountLayout />
              </ProtectedRoute>
            }
          >
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>
      </Routes>
      <CartDrawer />
    </>
  )
}

export default App
