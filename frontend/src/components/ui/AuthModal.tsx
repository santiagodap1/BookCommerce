import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../../context/AuthContext'
import './AuthModal.css'

export type AuthModalProps = {
  isOpen: boolean
  mode: 'login' | 'register'
  onClose: () => void
  onModeChange: (mode: 'login' | 'register') => void
}

export const AuthModal = ({ isOpen, mode, onClose, onModeChange }: AuthModalProps) => {
  const { login, register } = useAuth()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setForm({ email: '', password: '', name: '' })
      setError(null)
      setSubmitting(false)
    }
  }, [isOpen])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      if (mode === 'login') {
        await login({ email: form.email, password: form.password })
      } else {
        await register({ email: form.email, password: form.password, name: form.name || undefined })
      }
      setForm({ email: '', password: '', name: '' })
      onClose()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal__header">
          <h3>{mode === 'login' ? 'Sign in to continue' : 'Create your account'}</h3>
          <button onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </header>

        <div className="modal__tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            type="button"
            onClick={() => onModeChange('login')}
          >
            Login
          </button>
          <button
            className={mode === 'register' ? 'active' : ''}
            type="button"
            onClick={() => onModeChange('register')}
          >
            Register
          </button>
        </div>

        <form className="modal__body" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              <span>Name</span>
              <input
                type="text"
                value={form.name}
                onChange={(event) => handleChange('name', event.target.value)}
                placeholder="How should we call you?"
              />
            </label>
          )}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              required
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              minLength={8}
              value={form.password}
              onChange={(event) => handleChange('password', event.target.value)}
              required
            />
          </label>

          {error && <p className="status error">{error}</p>}

          <button className="primary" type="submit" disabled={submitting}>
            {submitting ? 'Sending...' : mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  )
}
