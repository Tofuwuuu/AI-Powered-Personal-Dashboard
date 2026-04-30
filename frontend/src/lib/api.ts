import type { Entry, InsightsOverview, TokenResponse, User } from './types'
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
let accessToken: string | null = localStorage.getItem('access_token')
let refreshToken: string | null = localStorage.getItem('refresh_token')
const headers = () => ({ 'Content-Type': 'application/json', ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}) })

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed (${response.status})`
  try {
    const contentType = response.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      const body = await response.json()
      if (typeof body?.detail === 'string') return body.detail
      if (typeof body?.message === 'string') return body.message
    }
    const text = await response.text()
    return text || fallback
  } catch {
    return fallback
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, { ...init, headers: { ...headers(), ...(init?.headers ?? {}) } })
    if (response.status === 401 && refreshToken) {
      if (await refresh()) return request<T>(path, init)
    }
    if (!response.ok) throw new Error(await readErrorMessage(response))
    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Cannot reach the server. Please check if the backend is running.')
    }
    throw error
  }
}
export function setTokens(tokens: TokenResponse | null) { accessToken = tokens?.access_token ?? null; refreshToken = tokens?.refresh_token ?? null; if (tokens) { localStorage.setItem('access_token', tokens.access_token); localStorage.setItem('refresh_token', tokens.refresh_token) } else { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token') } }
export async function register(email: string, password: string) { return request<User>('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) }) }
export async function login(email: string, password: string) { const t = await request<TokenResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }); setTokens(t); return t }
export async function refresh() { if (!refreshToken) return false; try { const t = await fetch(`${API_BASE}/auth/refresh`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ refresh_token: refreshToken }) }).then(async (r) => { if (!r.ok) throw new Error(await readErrorMessage(r)); return r.json() as Promise<TokenResponse> }); setTokens(t); return true } catch { setTokens(null); return false } }
export function logout() { setTokens(null) }
export async function me() { return request<User>('/auth/me') }
export async function createEntry(text: string) { return request<Entry>('/entries', { method: 'POST', body: JSON.stringify({ text }) }) }
export async function listEntries() { return request<Entry[]>('/entries') }
export async function getOverview() { return request<InsightsOverview>('/insights/overview') }
export async function getTrends() { return request<{ confidence_trend: Array<{ day: string; avg_confidence: number }> }>('/insights/trends') }
