import { useState } from 'react'
export default function EntryComposer({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [text, setText] = useState('')
  return <form className='card' onSubmit={async (e) => { e.preventDefault(); await onSubmit(text); setText('') }}><h2>New journal entry</h2><textarea value={text} onChange={(e) => setText(e.target.value)} rows={5} placeholder='Write your day, goals, or notes...' /><button type='submit'>Submit for AI analysis</button></form>
}
