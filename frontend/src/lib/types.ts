export type Sentiment = 'positive' | 'neutral' | 'negative'
export interface User { id: number; email: string }
export interface TokenResponse { access_token: string; refresh_token: string; token_type: string }
export interface Analysis { id: number; status: 'pending'|'processing'|'completed'|'failed'; summary: string | null; classification: string | null; sentiment: Sentiment | null; key_topics: string[] | null; action_items: string[] | null; confidence: number | null; error: string | null; updated_at: string }
export interface Entry { id: number; text: string; created_at: string; analyses: Analysis[] }
export interface InsightsOverview { sentiment_distribution: Record<string, number>; top_classifications: Array<{classification: string; count: number}>; top_topics: Array<{topic: string; count: number}> }
export interface ConfidenceTrend { day: string; avg_confidence: number }
