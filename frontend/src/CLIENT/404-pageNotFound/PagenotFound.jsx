import React from 'react'
import './pagenotfound.css'
import { Link } from 'react-router-dom'

const PagenotFound = () => (
  <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '2rem', gap: '1rem' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', fontStyle: 'italic', color: 'var(--border)', lineHeight: 1 }}>404</div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>
      Page Not Found
    </h2>
    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: '380px' }}>
      The tome you seek has been lost to the archives. Perhaps it never existed.
    </p>
    <div style={{ marginTop: '1rem' }}>
      <Link to='/' className='btn-arcana-primary' style={{ textDecoration: 'none' }}>Return to Library</Link>
    </div>
  </div>
)
export default PagenotFound
