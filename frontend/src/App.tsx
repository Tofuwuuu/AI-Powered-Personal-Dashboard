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
  const [authError, setAuthError] = useState<string | null>(null)
  const [entriesError, setEntriesError] = useState<string | null>(null)
  const [insightsError, setInsightsError] = useState<string | null>(null)
  const [composerError, setComposerError] = useState<string | null>(null)
  const [isBootstrapping, setIsBootstrapping] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  async function refreshData(mode: 'bootstrap' | 'silent' = 'silent') {
    if (mode === 'bootstrap') {
      setIsBootstrapping(true)
    } else {
      setIsRefreshing(true)
    }

    const [entriesResult, overviewResult, trendsResult] = await Promise.allSettled([
      listEntries(),
      getOverview(),
      getTrends(),
    ])

    if (entriesResult.status === 'fulfilled') {
      setEntries(entriesResult.value)
      setEntriesError(null)
    } else {
      setEntries([])
      setEntriesError(entriesResult.reason instanceof Error ? entriesResult.reason.message : 'Failed to load entries')
    }

    if (overviewResult.status === 'fulfilled') {
      setOverview(overviewResult.value)
      setInsightsError(null)
    } else {
      setOverview(null)
      setInsightsError(
        overviewResult.reason instanceof Error ? overviewResult.reason.message : 'Failed to load insights',
      )
    }

    if (trendsResult.status === 'fulfilled') {
      setTrend(trendsResult.value.confidence_trend)
      if (overviewResult.status === 'fulfilled') {
        setInsightsError(null)
      }
    } else {
      setTrend([])
      if (overviewResult.status === 'fulfilled') {
        setInsightsError(trendsResult.reason instanceof Error ? trendsResult.reason.message : 'Failed to load trends')
      }
    }

    setIsBootstrapping(false)
    setIsRefreshing(false)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const u = await me()
        setUser(u)
        await refreshData('bootstrap')
      } catch {
        setUser(null)
        setIsBootstrapping(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!user) return
    const id = window.setInterval(() => {
      refreshData('silent').catch(() => null)
    }, 5000)
    return () => window.clearInterval(id)
  }, [user])

  const title = useMemo(() => (user ? `Welcome ${user.email}` : 'AI Personal Dashboard'), [user])
  const completedCount = useMemo(
    () => entries.filter((entry) => entry.analyses[0]?.status === 'completed').length,
    [entries],
  )
  const latestSentiment = useMemo(() => {
    const analysis = entries.find((entry) => entry.analyses[0]?.sentiment)?.analyses[0]
    return analysis?.sentiment ?? 'No signal yet'
  }, [entries])

  return (
    <main className='container'>
      <header className='app-header'>
        <div>
          <p className='app-kicker'>{user ? 'Journal workspace' : 'AI Personal Dashboard'}</p>
          <h1>{title}</h1>
        </div>
        {user && (
          <button
            className='btn-secondary header-action'
            onClick={() => {
              logout()
              setUser(null)
              setEntries([])
              setOverview(null)
              setTrend([])
            }}
          >
            Logout
          </button>
        )}
      </header>

      {authError && <section className='card error'>{authError}</section>}

      {!user ? (
        <section className='auth-shell'>
          <div className='auth-hero'>
            <div>
              <p className='auth-hero-eyebrow'>AI Personal Dashboard</p>
              <h2 className='auth-hero-title'>Track your day with smart insights.</h2>
              <p className='auth-hero-copy'>
                Write quick reflections, monitor confidence trends, and get instant AI analysis in one place.
              </p>
            </div>
            <div className='auth-hero-art' aria-hidden='true'>
              <span className='orb orb-one' />
              <span className='orb orb-two' />
              <span className='orb orb-three' />
            </div>
          </div>
          <div className='auth-panel'>
            <AuthForm
              mode={authMode}
              onModeChange={setAuthMode}
              onSubmit={async (email, password) => {
                try {
                  setAuthError(null)
                  if (authMode === 'register') await register(email, password)
                  await login(email, password)
                  const currentUser = await me()
                  setUser(currentUser)
                  await refreshData('bootstrap')
                } catch (e) {
                  setAuthError((e as Error).message)
                }
              }}
            />
          </div>
        </section>
      ) : (
        <>
          {isBootstrapping && <section className='card subtle'>Loading your dashboard...</section>}
          {isRefreshing && !isBootstrapping && <section className='card subtle'>Refreshing data...</section>}
          {entriesError && <section className='card error'>{entriesError}</section>}
          {insightsError && <section className='card error'>{insightsError}</section>}
          {composerError && <section className='card error'>{composerError}</section>}

          <section className='summary-strip'>
            <div className='metric-card'>
              <span>Total entries</span>
              <strong>{entries.length}</strong>
            </div>
            <div className='metric-card'>
              <span>Analyzed</span>
              <strong>{completedCount}</strong>
            </div>
            <div className='metric-card'>
              <span>Latest mood</span>
              <strong className='metric-text'>{latestSentiment}</strong>
            </div>
          </section>

          <section className='grid'>
            <EntryComposer
              onSubmit={async (text) => {
                try {
                  setComposerError(null)
                  await createEntry(text)
                  await refreshData('silent')
                } catch (e) {
                  setComposerError((e as Error).message)
                }
              }}
            />
            <EntryList entries={entries} loading={isBootstrapping} />
            <InsightsPanel
              overview={overview}
              trend={trend}
              loading={isBootstrapping || isRefreshing}
              errorMessage={insightsError}
            />
          </section>
        </>
      )}
    </main>
  )
}

export default App
