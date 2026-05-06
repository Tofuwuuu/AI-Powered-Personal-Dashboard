export default function SimpleBar({ title, data }: { title: string; data: Array<{label: string; value: number}> }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <section className='card chart-card'>
      <h3>{title}</h3>
      {data.length === 0 ? (
        <div className='empty-state compact'>No data yet.</div>
      ) : (
        <div className='bars'>
          {data.map((d) => (
            <div key={d.label} className='bar-row'>
              <span title={d.label}>{d.label}</span>
              <div className='bar-wrap'>
                <div className='bar' style={{ width: `${(d.value / max) * 100}%` }} />
              </div>
              <strong>{d.value}</strong>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
