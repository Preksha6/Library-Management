import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'

const CustomPagination = ({ fetchData, filterActive }) => {
  const [activePage, setActivePage] = useState(1)
  const [totalPages, setTotalPages] = useState(null)

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/books`)
      .then(res => setTotalPages(Math.ceil(res.data.totalHits / 8)))
      .catch(console.log)
  }, [])

  const handlePageClick = (pageNumber) => {
    setActivePage(pageNumber)
    fetchData(pageNumber)
  }

  if (filterActive || !totalPages || totalPages <= 1) return null

  const pages = []
  const range = 2
  pages.push({ num: 'prev', label: '←', disabled: activePage === 1 })
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= activePage - range && p <= activePage + range)) {
      if (pages.length > 1 && typeof pages[pages.length - 1].num === 'number' && pages[pages.length - 1].num < p - 1) {
        pages.push({ num: '...', label: '…', disabled: true })
      }
      pages.push({ num: p, label: String(p), disabled: false })
    }
  }
  pages.push({ num: 'next', label: '→', disabled: activePage === totalPages })

  return (
    <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
      {pages.map((p, i) => (
        <button
          key={i}
          disabled={p.disabled}
          onClick={() => {
            if (p.num === 'prev') handlePageClick(activePage - 1)
            else if (p.num === 'next') handlePageClick(activePage + 1)
            else if (typeof p.num === 'number') handlePageClick(p.num)
          }}
          style={{
            minWidth: '36px',
            height: '36px',
            padding: '0 0.5rem',
            background: p.num === activePage ? 'rgba(200,169,110,0.15)' : 'transparent',
            color: p.num === activePage ? 'var(--gold)' : p.disabled ? 'var(--text-muted)' : 'var(--text-secondary)',
            border: p.num === activePage ? '1px solid var(--gold-muted)' : '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            cursor: p.disabled ? 'default' : 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.82rem',
            transition: 'all 0.2s ease',
          }}
        >
          {p.label}
        </button>
      ))}
    </div>
  )
}
export default CustomPagination
