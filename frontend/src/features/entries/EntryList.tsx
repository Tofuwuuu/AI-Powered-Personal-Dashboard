import type { Entry } from '../../lib/types'
export default function EntryList({ entries }: { entries: Entry[] }) {
  return <section className='card'><h2>Entries</h2><div className='entry-list'>{entries.map((entry) => { const analysis = entry.analyses[0]; return <article key={entry.id} className='entry-item'><p>{entry.text}</p>{analysis ? <div className='analysis-block'><small>Status: {analysis.status}</small>{analysis.summary && <p><b>Summary:</b> {analysis.summary}</p>}{analysis.classification && <p><b>Class:</b> {analysis.classification}</p>}{analysis.sentiment && <p><b>Sentiment:</b> {analysis.sentiment}</p>}</div> : <small>No analysis yet</small>}</article> })}</div></section>
}
