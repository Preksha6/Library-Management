import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backend_server } from '../../main'

const IssuedBooks = () => {
  const [notReturnedBooks, setNotReturnedBooks] = useState([])

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/requestBooks/notreturnedbooks`)
      .then(res => { if (res.data.data) setNotReturnedBooks(res.data.data) })
      .catch(console.log)
  }, [])

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Issued Books</h2>
      {notReturnedBooks.length > 0 ? (
        <div className='arcana-table-wrap'>
          <table className='arcana-table'>
            <thead>
              <tr><th>#</th><th>Book Title</th><th>User Email</th><th>Issue Date</th><th>Return Due</th><th>Status</th></tr>
            </thead>
            <tbody>
              {notReturnedBooks.map((book, index) => {
                const { _id, userEmail, bookTitle, isReturned, returnDate, issueDate } = book
                return (
                  <tr key={_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td className='title-cell'>{bookTitle}</td>
                    <td>{userEmail}</td>
                    <td style={{ fontSize: '0.82rem' }}>{new Date(issueDate).toDateString()}</td>
                    <td style={{ fontSize: '0.82rem' }}>{returnDate ? new Date(returnDate).toDateString() : '—'}</td>
                    <td>
                      <span style={{
                        background: isReturned ? 'rgba(58,138,138,0.1)' : 'rgba(155,35,53,0.1)',
                        color: isReturned ? '#6ecece' : 'var(--crimson-light)',
                        border: `1px solid ${isReturned ? 'rgba(58,138,138,0.4)' : 'rgba(155,35,53,0.3)'}`,
                        padding: '0.2rem 0.6rem', borderRadius: '2px',
                        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em'
                      }}>
                        {isReturned ? 'RETURNED' : 'ACTIVE'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='arcana-loading'>No issued books found.</div>
      )}
    </div>
  )
}
export default IssuedBooks
