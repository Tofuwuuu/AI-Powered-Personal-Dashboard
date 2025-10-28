const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export async function listTasks(): Promise<Task[]> {
  const res = await fetch(`${API_BASE}/tasks/`);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  return res.json();
}

export async function createTask(data: { title: string; description?: string }): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...data, completed: false })
  });
  if (!res.ok) throw new Error('Failed to create task');
  return res.json();
}

export async function toggleTask(id: number, completed: boolean): Promise<Task> {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  if (!res.ok) throw new Error('Failed to update task');
  return res.json();
}

export async function chat(messages: { role: 'user' | 'assistant' | 'system'; content: string }[]) {
  const res = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}


