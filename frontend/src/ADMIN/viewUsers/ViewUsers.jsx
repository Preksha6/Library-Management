import React, { useState, useEffect } from 'react'
import useFetch from '../../useFetch'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'

const ViewUsers = () => {
  const fetched_data = useFetch(`${backend_server}/api/v1/users`)
  const [totalUsers, setTotalUsers] = useState([])

  useEffect(() => {
    if (fetched_data.fetched_data.data) setTotalUsers(fetched_data.fetched_data.data)
  }, [fetched_data.fetched_data.data])

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>View Users</h2>
      {totalUsers && totalUsers.length > 0 ? (
        <div className='arcana-table-wrap'>
          <table className='arcana-table'>
            <thead>
              <tr>
                <th>#</th><th>Username</th><th>Email</th><th>Phone</th><th>Books Issued</th><th>Details</th>
              </tr>
            </thead>
            <tbody>
              {totalUsers.map((user, index) => {
                const { _id, username, email, phone, totalAcceptedBooks } = user
                return (
                  <tr key={_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td className='title-cell'>{username}</td>
                    <td>{email}</td>
                    <td>{phone}</td>
                    <td style={{ fontFamily: 'var(--font-mono)' }}>{totalAcceptedBooks}</td>
                    <td>
                      <Link to={`/admin/viewusers/${_id}`}>
                        <button className='btn-arcana-secondary' style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}>
                          View Details
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className='arcana-loading'>No registered users found.</div>
      )}
    </div>
  )
}
export default ViewUsers
