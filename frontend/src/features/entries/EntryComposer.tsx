import { useState } from 'react'
export default function EntryComposer({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const trimmed = text.trim()

  return (
    <form
      className='card composer-card'
      onSubmit={async (e) => {
        e.preventDefault()
        if (!trimmed || submitting) return
        setSubmitting(true)
        try {
          await onSubmit(trimmed)
          setText('')
        } finally {
          setSubmitting(false)
        }
      }}
    >
      <div className='section-heading'>
        <div>
          <p className='section-kicker'>Capture</p>
          <h2>New journal entry</h2>
        </div>
        <span className='counter'>{trimmed.length}</span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={9}
        placeholder='What stood out today?'
      />
      <button type='submit' disabled={!trimmed || submitting}>
        {submitting ? 'Submitting...' : 'Analyze entry'}
      </button>
    </form>
  )
}
