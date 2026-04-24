import { useState } from 'react'
export default function AuthForm({ onSubmit, mode }: { onSubmit: (email: string, password: string) => Promise<void>; mode: 'login' | 'register' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  return <form className='card' onSubmit={async (e) => { e.preventDefault(); await onSubmit(email, password) }}><h2>{mode === 'login' ? 'Login' : 'Create account'}</h2><input placeholder='Email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required /><input placeholder='Password' type='password' minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /><button type='submit'>{mode === 'login' ? 'Login' : 'Register'}</button></form>
}
