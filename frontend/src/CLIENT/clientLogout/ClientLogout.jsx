import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useLoginState } from '../../LoginState'

const ClientLogout = () => {
  const logout_Api_url = `${backend_server}/api/v1/logout`
  const userLoginState = useLoginState()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      userLoginState.logout()
      await axios.post(logout_Api_url)
      navigate('/', { replace: true })
    } catch (error) { console.log(error.response) }
  }

  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>📚</div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontStyle: 'italic', marginBottom: '0.5rem' }}>
        Leaving so soon?
      </h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontStyle: 'italic' }}>
        Your reading history will be waiting when you return.
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        <button className='btn-arcana-primary' onClick={handleLogout}>Yes, Sign Out</button>
        <button className='btn-arcana-secondary' onClick={() => navigate(-1)}>Stay</button>
      </div>
    </div>
  )
}
export default ClientLogout
