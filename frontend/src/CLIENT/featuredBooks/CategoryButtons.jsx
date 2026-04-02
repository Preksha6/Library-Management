import React, { useState } from 'react'

const CategoryButtons = ({ filterFunction, categories }) => {
  const [active, setActive] = useState(0)
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
      {categories.map((cat, index) => (
        <button
          key={index}
          onClick={() => { filterFunction(cat); setActive(index) }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '0.35rem 1rem',
            borderRadius: '2px',
            border: active === index ? '1px solid var(--gold)' : '1px solid var(--border)',
            background: active === index ? 'rgba(200,169,110,0.15)' : 'transparent',
            color: active === index ? 'var(--gold)' : 'var(--text-muted)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
export default CategoryButtons
