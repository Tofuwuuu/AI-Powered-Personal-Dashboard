import { useEffect, useMemo, useState } from 'react'
import AuthForm from './features/auth/AuthForm'
import EntryComposer from './features/entries/EntryComposer'
import EntryList from './features/entries/EntryList'
import InsightsPanel from './features/insights/InsightsPanel'
import { createEntry, getOverview, getTrends, listEntries, login, logout, me, register } from './lib/api'
import type { ConfidenceTrend, Entry, InsightsOverview, User } from './lib/types'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [entries, setEntries] = useState<Entry[]>([])
  const [overview, setOverview] = useState<InsightsOverview | null>(null)
  const [trend, setTrend] = useState<ConfidenceTrend[]>([])
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [error, setError] = useState<string | null>(null)

  async function refreshData() {
    const [entriesData, overviewData, trendData] = await Promise.all([listEntries(), getOverview(), getTrends()])
    setEntries(entriesData)
    setOverview(overviewData)
    setTrend(trendData.confidence_trend)
  }

  useEffect(() => { (async () => { try { const u = await me(); setUser(u); await refreshData() } catch { setUser(null) } })() }, [])
  useEffect(() => { if (!user) return; const id = window.setInterval(() => { refreshData().catch(() => null) }, 5000); return () => window.clearInterval(id) }, [user])

  const title = useMemo(() => (user ? `Welcome ${user.email}` : 'AI Personal Dashboard'), [user])

  return <main className='container'><header className='card row-between'><h1>{title}</h1>{user && <button onClick={() => { logout(); setUser(null) }}>Logout</button>}</header>{error && <section className='card error'>{error}</section>}{!user ? <section className='auth-shell'><div className='auth-hero'><div><p className='auth-hero-eyebrow'>AI Personal Dashboard</p><h2 className='auth-hero-title'>Track your day with smart insights.</h2><p className='auth-hero-copy'>Write quick reflections, monitor confidence trends, and get instant AI analysis in one place.</p></div><div className='auth-hero-art' aria-hidden='true'><span className='orb orb-one' /><span className='orb orb-two' /><span className='orb orb-three' /></div></div><div className='auth-panel'><AuthForm mode={authMode} onModeChange={setAuthMode} onSubmit={async (email, password) => { try { setError(null); if (authMode === 'register') await register(email, password); await login(email, password); const currentUser = await me(); setUser(currentUser); await refreshData() } catch (e) { setError((e as Error).message) } }} /></div></section> : <section className='grid'><EntryComposer onSubmit={async (text) => { try { setError(null); await createEntry(text); await refreshData() } catch (e) { setError((e as Error).message) } }} /><EntryList entries={entries} /><InsightsPanel overview={overview} trend={trend} /></section>}</main>
}

export default App
