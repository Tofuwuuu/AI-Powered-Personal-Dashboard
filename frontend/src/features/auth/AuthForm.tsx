import { useState } from 'react'

type AuthMode = 'login' | 'register'

export default function AuthForm({
  onSubmit,
  mode,
  onModeChange,
}: {
  onSubmit: (email: string, password: string) => Promise<void>
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  return (
    <form
      className='auth-form'
      onSubmit={async (e) => {
        e.preventDefault()
        if (submitting) return
        setSubmitting(true)
        try {
          await onSubmit(email, password)
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <div className='auth-tabs' role='tablist' aria-label='Authentication'>
        <button
          type='button'
          className={`auth-tab ${mode === 'login' ? 'auth-tab-active' : ''}`}
          onClick={() => onModeChange('login')}
          aria-selected={mode === 'login'}
        >
          Login
        </button>
        <button
          type='button'
          className={`auth-tab ${mode === 'register' ? 'auth-tab-active' : ''}`}
          onClick={() => onModeChange('register')}
          aria-selected={mode === 'register'}
        >
          Register
        </button>
      </div>

      <h2 className='auth-title'>{mode === 'login' ? 'Welcome Back...' : 'Create Account'}</h2>
      <p className='auth-subtitle'>
        {mode === 'login'
          ? 'Please enter your email and password'
          : 'Start journaling and unlock AI-powered insights'}
      </p>

      <label className='field-label'>
        Email
        <input
          className='auth-input'
          placeholder='you@example.com'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete='email'
        />
      </label>

      <label className='field-label'>
        Password
        <input
          className='auth-input'
          placeholder='••••••••'
          type='password'
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        />
      </label>

      {mode === 'register' && <div className='auth-hint'>Use at least 6 characters.</div>}

      <button className='btn-submit' type='submit' disabled={submitting}>
        {submitting ? 'Please wait…' : mode === 'login' ? 'Login' : 'Register'}
      </button>
      <p className='auth-bottom-note'>
        {mode === 'login' ? "Don't have an account yet? " : 'Already have an account? '}
        <button
          type='button'
          className='auth-inline-link'
          onClick={() => onModeChange(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Create one' : 'Login'}
        </button>
      </p>
    </form>
  )
}
