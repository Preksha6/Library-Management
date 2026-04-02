import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const AdminLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      localStorage.clear()
      await axios.post(logout_Api_url)
      window.location.href = '/'
    } catch (error) { console.log(error.response) }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-xl)', padding: '3rem 2.5rem', maxWidth: 420, width: '100%', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>Sign Out?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontStyle: 'italic', fontSize: '0.95rem' }}>
          You will be logged out of the admin panel and returned to the main site.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          <button className='btn-arcana-primary' onClick={handleLogout}>Yes, Sign Out</button>
          <button className='btn-arcana-secondary' onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}
export default AdminLogout
