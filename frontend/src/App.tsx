import { useEffect, useState } from 'react'
import './App.css'
import { listTasks, createTask, toggleTask, type Task } from './lib/api'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    listTasks().then(setTasks).catch(() => setTasks([]))
  }, [])

  async function addTask() {
    if (!title.trim()) return
    const t = await createTask({ title })
    setTasks((prev) => [t, ...prev])
    setTitle('')
  }

  async function toggle(id: number, completed: boolean) {
    const updated = await toggleTask(id, completed)
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
  }

  return (
    <div className="container">
      <h1>SmartLife Dashboard (MVP)</h1>
      <div className="add">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New task..." />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <label>
              <input type="checkbox" checked={t.completed} onChange={(e) => toggle(t.id, e.target.checked)} />
              {t.title}
            </label>
          </li>
        ))}
      </ul>
      <p style={{opacity:.7}}>Set `VITE_API_BASE` and run the backend to load tasks.</p>
    </div>
  )
}

export default App
