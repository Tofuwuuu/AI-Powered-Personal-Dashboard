import SimpleBar from '../../components/charts/SimpleBar'
import type { ConfidenceTrend, InsightsOverview } from '../../lib/types'
export default function InsightsPanel({
  overview,
  trend,
  loading,
  errorMessage,
}: {
  overview: InsightsOverview | null
  trend: ConfidenceTrend[]
  loading?: boolean
  errorMessage?: string | null
}) {
  if (loading && !overview) return <section className='card subtle'>Loading insights...</section>
  if (errorMessage && !overview) return <section className='card subtle'>Insights unavailable right now.</section>
  if (!overview) return <section className='card subtle'>No insights yet. Add entries to generate analytics.</section>

  return <><SimpleBar title='Sentiment distribution' data={Object.entries(overview.sentiment_distribution).map(([label, value]) => ({ label, value }))} /><SimpleBar title='Top classifications' data={overview.top_classifications.map((x) => ({ label: x.classification, value: x.count }))} /><SimpleBar title='Top topics' data={overview.top_topics.map((x) => ({ label: x.topic, value: x.count }))} /><SimpleBar title='Confidence trend' data={trend.map((x) => ({ label: x.day, value: Number(x.avg_confidence.toFixed(2)) }))} /></>
}
