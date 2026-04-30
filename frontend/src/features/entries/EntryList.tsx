import type { Entry } from '../../lib/types'

function formatStatus(status: string): string {
  if (status === 'pending') return 'Pending'
  if (status === 'processing') return 'Processing'
  if (status === 'completed') return 'Completed'
  if (status === 'failed') return 'Failed'
  return status
}

export default function EntryList({ entries, loading }: { entries: Entry[]; loading?: boolean }) {
  return <section className='card'><h2>Entries</h2>{loading ? <div className='subtle'>Loading entries...</div> : entries.length === 0 ? <div className='subtle'>No entries yet. Submit your first journal note to begin.</div> : <div className='entry-list'>{entries.map((entry) => { const analysis = entry.analyses[0]; return <article key={entry.id} className='entry-item'><p>{entry.text}</p>{analysis ? <div className='analysis-block'><small className={`status-pill status-${analysis.status}`}>Status: {formatStatus(analysis.status)}</small>{analysis.summary && <p><b>Summary:</b> {analysis.summary}</p>}{analysis.classification && <p><b>Class:</b> {analysis.classification}</p>}{analysis.sentiment && <p><b>Sentiment:</b> {analysis.sentiment}</p>}{analysis.status === 'failed' && analysis.error && <p><b>Error:</b> {analysis.error}</p>}</div> : <small>No analysis yet</small>}</article> })}</div>}</section>
}
