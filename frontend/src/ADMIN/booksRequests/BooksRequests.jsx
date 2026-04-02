import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const statusColors = {
  PENDING: 'rgba(200,169,110,0.12)', READY: 'rgba(58,138,138,0.12)',
  ACCEPTED: 'rgba(58,138,138,0.18)', CANCELLED: 'rgba(155,35,53,0.12)'
}
const statusText = {
  PENDING: 'var(--gold)', READY: '#6ecece', ACCEPTED: '#6ecece', CANCELLED: 'var(--crimson-light)'
}

const BooksRequests = () => {
  const Pending_Book_API_Url = `${backend_server}/api/v1/requestBooks`
  const [pendingBooks, setPendingBooks] = useState([])
  const [isAnyBooksPending, setIsAnyBooksPending] = useState(true)
  const [rowStatus, setRowStatus] = useState({})

  const fetchPendingBooks = async () => {
    try {
      const response = await axios.get(Pending_Book_API_Url)
      if (response.data.totalHits === 0) setIsAnyBooksPending(false)
      else { setPendingBooks(response.data.data); setIsAnyBooksPending(true) }
    } catch (error) { console.log(error.response) }
  }

  useEffect(() => { fetchPendingBooks() }, [])

  const handleFormUpdate = async (transactionId) => {
    if (!rowStatus[transactionId]) return
    try {
      await axios.patch(Pending_Book_API_Url, { id: transactionId, issueStatus: rowStatus[transactionId] })
      toast.success('Status updated')
      fetchPendingBooks()
    } catch (error) { console.log(error.response) }
  }

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Book Requests</h2>
      {isAnyBooksPending && pendingBooks.length > 0 ? (
        <div className='arcana-table-wrap'>
          <table className='arcana-table'>
            <thead>
              <tr><th>#</th><th>Username</th><th>Email</th><th>Book Title</th><th>Current Status</th><th>Update Status</th></tr>
            </thead>
            <tbody>
              {pendingBooks.map((book, index) => {
                const { _id, userEmail, bookTitle, issueStatus, username } = book
                const sc = statusColors[issueStatus] || 'transparent'
                const tc = statusText[issueStatus] || 'var(--text-muted)'
                return (
                  <tr key={_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td className='title-cell'>{username}</td>
                    <td style={{ fontSize: '0.88rem' }}>{userEmail}</td>
                    <td className='title-cell'>{bookTitle}</td>
                    <td>
                      <span style={{ background: sc, color: tc, padding: '0.2rem 0.6rem', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                        {issueStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select className='arcana-select' style={{ fontSize: '0.82rem', padding: '0.35rem 1.8rem 0.35rem 0.6rem' }}
                          defaultValue={issueStatus}
                          onChange={e => setRowStatus(prev => ({ ...prev, [_id]: e.target.value }))}>
                          <option value='PENDING'>PENDING</option>
                          <option value='READY'>READY to PICK</option>
                          <option value='ACCEPTED'>ACCEPTED</option>
                          <option value='CANCELLED'>CANCELLED</option>
                        </select>
                        <button className='btn-arcana-primary' style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}
                          onClick={() => handleFormUpdate(_id)}>
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='arcana-loading'>No book requests found.</div>
      )}
    </div>
  )
}
export default BooksRequests
