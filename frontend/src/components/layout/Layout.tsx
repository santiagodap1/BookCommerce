import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { AuthModal } from '../ui/AuthModal'
import { useCart } from '../../context/CartContext'
import './Layout.css'

export const Layout = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const { toggleCart } = useCart()

    const handleAuthClick = (mode: 'login' | 'register') => {
        setAuthMode(mode)
        setIsAuthModalOpen(true)
    }

    return (
        <div className="app-layout">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <main className="main-content">
                <Header
                    onToggleCart={() => toggleCart(true)}
                    onAuthClick={handleAuthClick}
                    onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
                <Outlet />
            </main>
            <AuthModal
                isOpen={isAuthModalOpen}
                mode={authMode}
                onClose={() => setIsAuthModalOpen(false)}
                onModeChange={setAuthMode}
            />
        </div>
    )
}
