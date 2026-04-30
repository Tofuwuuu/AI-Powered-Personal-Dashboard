import { useState } from 'react'
export default function EntryComposer({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const trimmed = text.trim()

  return <form className='card' onSubmit={async (e) => { e.preventDefault(); if (!trimmed || submitting) return; setSubmitting(true); try { await onSubmit(trimmed); setText('') } finally { setSubmitting(false) } }}><h2>New journal entry</h2><textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder='Write your day, goals, or notes...' /><button type='submit' disabled={!trimmed || submitting}>{submitting ? 'Submitting...' : 'Submit for AI analysis'}</button></form>
}
