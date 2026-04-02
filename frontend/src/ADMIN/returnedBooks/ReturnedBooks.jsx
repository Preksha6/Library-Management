import React, { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import { backend_server } from '../../main'

const ReturnedBooks = () => {
  const NOT_RETURNED_API = `${backend_server}/api/v1/requestBooks/notreturnedbooks`
  const Update_Return_Status_API = `${backend_server}/api/v1/requestBooks`
  const [notReturnedBooks, setNotReturnedBooks] = useState([])
  const [rowStatus, setRowStatus] = useState({})

  const fetchNotReturnedBooks = async () => {
    try {
      const response = await axios.get(NOT_RETURNED_API)
      if (response.data.data) setNotReturnedBooks(response.data.data)
    } catch (error) { console.log(error) }
  }

  useEffect(() => { fetchNotReturnedBooks() }, [])

  const handleFormUpdate = async (transactionId) => {
    const updateReturnStatus = rowStatus[transactionId] === 'true'
    try {
      await axios.patch(Update_Return_Status_API, { id: transactionId, isReturned: updateReturnStatus })
      toast.success('Return status updated')
      fetchNotReturnedBooks()
    } catch (error) { console.log(error) }
  }

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Return Due Books</h2>
      {notReturnedBooks.length > 0 ? (
        <div className='arcana-table-wrap'>
          <table className='arcana-table'>
            <thead>
              <tr><th>#</th><th>Email</th><th>Book Title</th><th>Return Due</th><th>Status</th><th>Charge</th><th>Update</th></tr>
            </thead>
            <tbody>
              {notReturnedBooks.map((book, index) => {
                const { _id, userEmail, bookTitle, isReturned, returnDate, extraCharge } = book
                return (
                  <tr key={_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td style={{ fontSize: '0.88rem' }}>{userEmail}</td>
                    <td className='title-cell'>{bookTitle}</td>
                    <td style={{ fontSize: '0.82rem' }}>{returnDate ? new Date(returnDate).toDateString() : '—'}</td>
                    <td>
                      <span style={{
                        background: isReturned ? 'rgba(58,138,138,0.1)' : 'rgba(155,35,53,0.1)',
                        color: isReturned ? '#6ecece' : 'var(--crimson-light)',
                        padding: '0.2rem 0.6rem', borderRadius: '2px',
                        fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.06em'
                      }}>
                        {isReturned ? 'RETURNED' : 'NOT RETURNED'}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>₹{extraCharge}/-</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select className='arcana-select' style={{ fontSize: '0.82rem', padding: '0.35rem 1.8rem 0.35rem 0.6rem' }}
                          defaultValue='false'
                          onChange={e => setRowStatus(prev => ({ ...prev, [_id]: e.target.value }))}>
                          <option value='false'>Not Returned</option>
                          <option value='true'>Returned</option>
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
        <div className='arcana-loading'>No pending return books.</div>
      )}
    </div>
  )
}
export default ReturnedBooks
