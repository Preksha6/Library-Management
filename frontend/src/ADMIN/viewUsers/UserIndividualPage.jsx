import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backend_server } from '../../main'
import useFetch from '../../useFetch'
import { MdVerified } from 'react-icons/md'
import { GoUnverified } from 'react-icons/go'
import { AiOutlineMail } from 'react-icons/ai'
import toast from 'react-hot-toast'
import axios from 'axios'

const UserIndividualPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [userBookData, setUserBookData] = useState([])
  const [userData, setUserData] = useState()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [newEmail, setNewEmail] = useState('')

  const fetched_data = useFetch(`${backend_server}/api/v1/users/${id}`)

  useEffect(() => {
    if (fetched_data.fetched_data.bookData) setUserBookData(fetched_data.fetched_data.bookData)
    if (fetched_data.fetched_data.userData) setUserData(fetched_data.fetched_data.userData)
  }, [fetched_data.fetched_data.bookData, fetched_data.fetched_data.userData])

  const HandleEmailUpdate = async (e) => {
    e.preventDefault()
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(newEmail)) return toast('Invalid Email Format', { icon: 'ℹ️' })
    try {
      const response = await axios.post(`${backend_server}/api/v1/updateUserEmail`, { userId: id, newEmail })
      if (response.data.ENTER_OTP) {
        navigate('/admin/otp', { replace: true })
        toast(response.data.message, { icon: 'ℹ️' })
      }
    } catch (error) { console.log(error) }
  }

  if (!userData?.username) return <div className='arcana-loading'>Loading user data…</div>

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>User Profile</h2>

      {/* User info card */}
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', textAlign: 'center' }}>
          <img src='/clientprofile.png' alt='Profile' style={{ width: 72, height: 72, borderRadius: '50%', border: '2px solid var(--border-gold)', padding: 3, filter: 'sepia(0.2)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginTop: '0.75rem', marginBottom: '0.25rem' }}>{userData.username}</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', fontSize: '0.82rem', color: userData.emailVerified ? '#6ecece' : 'var(--crimson-light)' }}>
            {userData.emailVerified ? <><MdVerified /> Verified</> : <><GoUnverified /> Unverified</>}
          </div>
        </div>
        <div className='arcana-details-card'>
          <div className='arcana-details-row'>
            <span className='arcana-details-label'>Email</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span className='arcana-details-value'>{userData.email}</span>
              <button className='btn-arcana-secondary' style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }} onClick={() => setShowEmailModal(true)}>
                <AiOutlineMail /> Update
              </button>
            </div>
          </div>
          <div className='arcana-details-row'>
            <span className='arcana-details-label'>Phone</span>
            <span className='arcana-details-value'>{userData.phone}</span>
          </div>
          <div className='arcana-details-row'>
            <span className='arcana-details-label'>Books Issued</span>
            <span className='arcana-details-value' style={{ fontFamily: 'var(--font-mono)' }}>{userData.totalAcceptedBooks}</span>
          </div>
        </div>
      </div>

      {/* Email modal */}
      {showEmailModal && (
        <div className='arcana-modal-overlay' onClick={() => setShowEmailModal(false)}>
          <div className='arcana-modal' onClick={e => e.stopPropagation()}>
            <div className='arcana-modal-header'>
              <h3 className='arcana-modal-title'>Update Email</h3>
              <button className='arcana-modal-close' onClick={() => setShowEmailModal(false)}>✕</button>
            </div>
            <form onSubmit={HandleEmailUpdate}>
              <div className='arcana-form-group'>
                <label className='arcana-form-label'>Current Email</label>
                <input className='arcana-input' type='text' value={userData.email} disabled style={{ opacity: 0.5 }} />
              </div>
              <div className='arcana-form-group'>
                <label className='arcana-form-label'>New Email</label>
                <input className='arcana-input' type='email' required autoComplete='off' placeholder='new@gmail.com' value={newEmail} onChange={e => setNewEmail(e.target.value)} />
              </div>
              <div className='arcana-modal-footer'>
                <button type='button' className='btn-arcana-secondary' onClick={() => setShowEmailModal(false)}>Cancel</button>
                <button type='submit' className='btn-arcana-primary'>Update Email</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Book history table */}
      {userBookData.length > 0 && (
        <>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontStyle: 'italic', marginBottom: '1rem' }}>Book History</h3>
          <div className='arcana-table-wrap'>
            <table className='arcana-table'>
              <thead>
                <tr><th>#</th><th>Book Title</th><th>Status</th><th>Issue Date</th><th>Return Due</th><th>Returned</th><th>Charge</th></tr>
              </thead>
              <tbody>
                {userBookData.map(({ bookTitle, _id, issueStatus, isReturned, extraCharge, issueDate, returnDate }, index) => (
                  <tr key={_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td className='title-cell'>{bookTitle}</td>
                    <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em' }}>{issueStatus}</span></td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(issueDate).toDateString()}</td>
                    <td style={{ fontSize: '0.82rem' }}>{returnDate ? new Date(returnDate).toDateString() : '—'}</td>
                    <td style={{ color: isReturned ? '#6ecece' : 'var(--text-muted)', fontSize: '0.82rem' }}>{isReturned ? 'Yes' : 'No'}</td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>Nrs.{extraCharge}/-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      <div style={{ marginTop: '1.5rem' }}>
        <button className='btn-arcana-secondary' onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    </div>
  )
}
export default UserIndividualPage
