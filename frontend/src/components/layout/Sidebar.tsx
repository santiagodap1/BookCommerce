import { NavLink } from 'react-router-dom';
import { Home, Info, Mail, Code, BookOpen, X } from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="branding">
            <BookOpen className="logo-icon" size={32} />
            <span className="logo-text">BookShop</span>
          </div>
          <button className="close-sidebar" onClick={onClose} aria-label="Close sidebar">
            <X size={24} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink
            to="/"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Home size={20} />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Info size={20} />
            <span>About Us</span>
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Mail size={20} />
            <span>Contact Us</span>
          </NavLink>

          <NavLink
            to="/api-info"
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={onClose}
          >
            <Code size={20} />
            <span>API Used</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <p>© 2024 BookShop</p>
        </div>
      </aside>
    </>
  );
}
