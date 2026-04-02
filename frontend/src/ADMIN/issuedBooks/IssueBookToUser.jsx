import React, { useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { FiCopy } from 'react-icons/fi'
import { toast } from 'react-hot-toast'

const IssueBookToUser = () => {
  const API_URL = `${backend_server}/api/v1/filter`
  const IssueBOOK_URL = `${backend_server}/api/v1/requestBooks/issuebook`
  const [filterFields, setFilterFields] = useState({ title: '' })
  const [allBooks, setAllBooks] = useState([])
  const [bookId, setBookId] = useState('')
  const [email, setEmail] = useState('')

  const handleOnChange = async (e) => {
    const { name, value } = e.target
    setFilterFields({ ...filterFields, [name]: value })
    if (!value) { setAllBooks([]); return }
    try {
      const response = await axios.get(API_URL, { params: { title: value } })
      setAllBooks(response.data.data)
    } catch (error) { console.log(error) }
  }

  const handleCopyId = (_id) => {
    navigator.clipboard.writeText(_id)
      .then(() => toast('Book ID copied to clipboard', { icon: 'ℹ️' }))
      .catch(err => console.error('Copy failed:', err))
  }

  const handleBookIssueFormSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(IssueBOOK_URL, { bookId, email })
      toast.success('Book issued successfully')
      setBookId(''); setEmail('')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue book')
    }
  }

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Issue Book to User</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '1.5rem', alignItems: 'start' }}>

        {/* Search panel */}
        <div>
          <div className='arcana-form-group' style={{ marginBottom: '1.25rem' }}>
            <label className='arcana-form-label' style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
              Search Book by Title
            </label>
            <input className='arcana-input' type='text' autoComplete='off' placeholder='Start typing a book title…'
              name='title' value={filterFields.title} onChange={handleOnChange} />
          </div>

          {allBooks.length > 0 ? (
            <div className='arcana-table-wrap'>
              <table className='arcana-table'>
                <thead>
                  <tr><th>#</th><th>Title</th><th>Author</th><th>Book ID</th></tr>
                </thead>
                <tbody>
                  {allBooks.map(({ _id, title, author }, index) => (
                    <tr key={_id}>
                      <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                      <td className='title-cell'>{title}</td>
                      <td style={{ fontSize: '0.88rem' }}>{author}</td>
                      <td>
                        <button className='btn-arcana-secondary' style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                          onClick={() => { handleCopyId(_id); setBookId(_id) }}>
                          <FiCopy size={12} /> Copy ID
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : filterFields.title ? (
            <div className='arcana-loading' style={{ padding: '1.5rem' }}>No matching books found.</div>
          ) : (
            <div style={{ background: 'var(--bg-elevated)', border: '1px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.9rem' }}>
              Search for a book above to find its ID
            </div>
          )}
        </div>

        {/* Issue form */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.25rem', color: 'var(--gold)' }}>Issue Book</h3>
          <form onSubmit={handleBookIssueFormSubmit}>
            <div className='arcana-form-group'>
              <label className='arcana-form-label' style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>Book ID</label>
              <input className='arcana-input' type='text' autoComplete='off' placeholder='Paste or type Book ID' value={bookId} required onChange={e => setBookId(e.target.value)} />
              {bookId && <div style={{ fontSize: '0.72rem', color: 'var(--gold-muted)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{bookId}</div>}
            </div>
            <div className='arcana-form-group'>
              <label className='arcana-form-label' style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>User's Email</label>
              <input className='arcana-input' type='email' autoComplete='off' placeholder='user@gmail.com' value={email} required onChange={e => setEmail(e.target.value)} />
            </div>
            <button type='submit' className='btn-arcana-primary' style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}>
              Issue Book
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
export default IssueBookToUser
