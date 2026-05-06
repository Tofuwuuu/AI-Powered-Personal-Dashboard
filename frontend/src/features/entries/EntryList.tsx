import type { Entry } from '../../lib/types'

function formatStatus(status: string): string {
  if (status === 'pending') return 'Pending'
  if (status === 'processing') return 'Processing'
  if (status === 'completed') return 'Completed'
  if (status === 'failed') return 'Failed'
  return status
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function cleanError(message: string): string {
  if (message.includes('503 UNAVAILABLE')) {
    return 'Gemini is busy right now. Try again in a few minutes.'
  }
  if (message.includes('OPENAI_API_KEY') || message.includes('ANTHROPIC_API_KEY')) {
    return 'This failed before the AI provider was updated.'
  }
  if (message.includes('GOOGLE_API_KEY')) {
    return 'Google API key is missing in the worker environment.'
  }
  return message.length > 180 ? `${message.slice(0, 180)}...` : message
}

export default function EntryList({ entries, loading }: { entries: Entry[]; loading?: boolean }) {
  return (
    <section className='card entries-card'>
      <div className='section-heading'>
        <div>
          <p className='section-kicker'>Review</p>
          <h2>Entries</h2>
        </div>
        <span className='counter'>{entries.length}</span>
      </div>

      {loading ? (
        <div className='empty-state'>Loading entries...</div>
      ) : entries.length === 0 ? (
        <div className='empty-state'>No entries yet.</div>
      ) : (
        <div className='entry-list'>
          {entries.map((entry) => {
            const analysis = entry.analyses[0]
            return (
              <article key={entry.id} className='entry-item'>
                <div className='entry-meta'>
                  <time>{formatDate(entry.created_at)}</time>
                  {analysis && (
                    <small className={`status-pill status-${analysis.status}`}>{formatStatus(analysis.status)}</small>
                  )}
                </div>
                <p className='entry-text'>{entry.text}</p>
                {analysis ? (
                  <div className={`analysis-block analysis-${analysis.status}`}>
                    {analysis.summary && <p className='analysis-summary'>{analysis.summary}</p>}
                    <div className='analysis-grid'>
                      {analysis.classification && (
                        <span>
                          <b>Class</b>
                          {analysis.classification}
                        </span>
                      )}
                      {analysis.sentiment && (
                        <span>
                          <b>Sentiment</b>
                          {analysis.sentiment}
                        </span>
                      )}
                      {analysis.confidence !== null && analysis.confidence !== undefined && (
                        <span>
                          <b>Confidence</b>
                          {Math.round(analysis.confidence * 100)}%
                        </span>
                      )}
                    </div>
                    {analysis.key_topics && analysis.key_topics.length > 0 && (
                      <div className='topic-list'>
                        {analysis.key_topics.map((topic) => (
                          <span key={topic}>{topic}</span>
                        ))}
                      </div>
                    )}
                    {analysis.status === 'failed' && analysis.error && (
                      <p className='analysis-error'>{cleanError(analysis.error)}</p>
                    )}
                  </div>
                ) : (
                  <div className='analysis-block analysis-pending'>Queued for analysis.</div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}
