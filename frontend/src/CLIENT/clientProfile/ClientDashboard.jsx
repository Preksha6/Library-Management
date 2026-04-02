import React from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const statusColor = (status) => {
  const map = {
    PENDING: { bg: 'rgba(200,169,110,0.1)', color: 'var(--gold)', border: 'var(--border-gold)' },
    READY: { bg: 'rgba(58,138,138,0.1)', color: '#6ecece', border: 'rgba(58,138,138,0.4)' },
    ISSUED: { bg: 'rgba(58,138,138,0.15)', color: '#6ecece', border: 'rgba(58,138,138,0.5)' },
    RETURNED: { bg: 'rgba(100,100,100,0.1)', color: 'var(--text-muted)', border: 'var(--border)' },
    CANCELLED: { bg: 'rgba(155,35,53,0.1)', color: 'var(--crimson-light)', border: 'rgba(155,35,53,0.3)' },
  }
  return map[status] || { bg: 'transparent', color: 'var(--text-muted)', border: 'var(--border)' }
}

const ClientDashboard = ({ userBookData }) => {
  const DELETE_BOOK_API = `${backend_server}/api/v1/requestBooks`

  const handleRemoveBook = async (transactionId, issueStatus) => {
    try {
      await axios.patch(DELETE_BOOK_API, { id: transactionId, issueStatus })
      toast.success(issueStatus === 'DELETE' ? 'Request cancelled' : 'Record removed')
    } catch (error) {
      console.log(error)
    }
  }

  if (userBookData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
        No book records found.
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
        My Books
      </h2>
      <div className='arcana-table-wrap'>
        <table className='arcana-table'>
          <thead>
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th>Return Due</th>
              <th>Returned</th>
              <th>Extra Charge</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {userBookData.map((item, index) => {
              const { bookTitle, _id, issueStatus, isReturned, extraCharge, issueDate, returnDate } = item
              const sc = statusColor(issueStatus)
              return (
                <tr key={_id}>
                  <td style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{index + 1}</td>
                  <td className='title-cell'>{bookTitle}</td>
                  <td>
                    <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '0.2rem 0.6rem', borderRadius: '2px', fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                      {issueStatus}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem' }}>{new Date(issueDate).toDateString()}</td>
                  <td style={{ fontSize: '0.82rem' }}>{returnDate ? new Date(returnDate).toDateString() : '—'}</td>
                  <td>
                    <span style={{ color: isReturned ? 'var(--teal)' : 'var(--text-muted)', fontSize: '0.82rem' }}>
                      {isReturned ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>Nrs.{extraCharge}/-</td>
                  <td>
                    {(issueStatus === 'PENDING' || issueStatus === 'READY') && (
                      <button className='btn-arcana-danger' style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
                        onClick={() => handleRemoveBook(_id, 'DELETE')}>Cancel</button>
                    )}
                    {(issueStatus === 'RETURNED' || issueStatus === 'CANCELLED') && (
                      <button className='btn-arcana-secondary' style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem' }}
                        onClick={() => handleRemoveBook(_id, issueStatus === 'RETURNED' ? 'ALREADYRETURNED' : 'ADMINCANCELLED')}>
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default ClientDashboard
