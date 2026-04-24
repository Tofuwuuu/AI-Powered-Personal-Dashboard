import SimpleBar from '../../components/charts/SimpleBar'
import type { ConfidenceTrend, InsightsOverview } from '../../lib/types'
export default function InsightsPanel({ overview, trend }: { overview: InsightsOverview | null; trend: ConfidenceTrend[] }) {
  if (!overview) return <section className='card'>No insights yet.</section>
  return <><SimpleBar title='Sentiment distribution' data={Object.entries(overview.sentiment_distribution).map(([label, value]) => ({ label, value }))} /><SimpleBar title='Top classifications' data={overview.top_classifications.map((x) => ({ label: x.classification, value: x.count }))} /><SimpleBar title='Top topics' data={overview.top_topics.map((x) => ({ label: x.topic, value: x.count }))} /><SimpleBar title='Confidence trend' data={trend.map((x) => ({ label: x.day, value: Number(x.avg_confidence.toFixed(2)) }))} /></>
}
