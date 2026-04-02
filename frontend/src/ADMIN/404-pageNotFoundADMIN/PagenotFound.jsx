import React from 'react'
import { Link } from 'react-router-dom'
import './pagenotfound.css'

const PagenotFound = () => (
  <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', gap: '1rem' }}>
    <div style={{ fontFamily: 'var(--font-display)', fontSize: '6rem', fontStyle: 'italic', color: 'var(--border)', lineHeight: 1 }}>404</div>
    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontStyle: 'italic', color: 'var(--text-primary)' }}>Page Not Found</h2>
    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>This admin page doesn't exist.</p>
    <Link to='/admin' className='btn-arcana-secondary' style={{ textDecoration: 'none', marginTop: '0.5rem' }}>← Back to Dashboard</Link>
  </div>
)
export default PagenotFound
