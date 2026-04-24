export default function SimpleBar({ title, data }: { title: string; data: Array<{label: string; value: number}> }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return <section className='card'><h3>{title}</h3><div className='bars'>{data.map((d) => <div key={d.label} className='bar-row'><span>{d.label}</span><div className='bar-wrap'><div className='bar' style={{ width: `${(d.value / max) * 100}%` }} /></div><strong>{d.value}</strong></div>)}</div></section>
}
