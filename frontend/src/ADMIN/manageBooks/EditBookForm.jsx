import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { backend_server } from '../../main'

const EditBookForm = () => {
  const API_URL = `${backend_server}/api/v1/books`
  const { id } = useParams()
  const navigate = useNavigate()
  const [bookData, setBookData] = useState({ title: '', category: '', author: '', available: false, featured: false, description: '', language: '' })
  const [imagePath, setImagePath] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState()
  const [confirmDelete, setConfirmDelete] = useState(false)

  const fetchBookData = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`)
      setBookData(response.data.data)
      setImagePath(`${backend_server}/${response.data.data.image}`)
    } catch (error) { console.log('ERROR FETCHING BOOK data') }
  }

  useEffect(() => { fetchBookData() }, [])

  useEffect(() => {
    if (!selectedImage) { setImagePreview(undefined); return }
    const objectUrl = URL.createObjectURL(selectedImage)
    setImagePreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage])

  const handleOnChange = (e) => setBookData({ ...bookData, [e.target.name]: e.target.value })
  const handleUpperChange = (e) => setBookData({ ...bookData, [e.target.name]: e.target.value.toUpperCase() })

  const handleUpdateButton = async () => {
    const { title, category, author, description, language } = bookData
    if (!title || !category || !author || !description || !language) return
    try {
      await axios.patch(`${API_URL}/${id}`, bookData)
      toast.success('Book updated successfully')
      fetchBookData()
    } catch (error) { toast.error('Error updating book') }
  }

  const handleDeleteButton = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      toast.success('Book deleted')
      setTimeout(() => { window.location.href = '/admin/managebooks' }, 800)
    } catch (error) { toast.error('Error deleting book') }
  }

  const handleImageUpdateFormSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('image', selectedImage)
    try {
      await axios.patch(`${API_URL}/updateImage/${id}`, formData)
      toast.success('Image updated successfully')
      fetchBookData(); setSelectedImage(null)
    } catch (error) { toast.error('Error updating image') }
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }
  const toggleStyle = (active) => ({
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer',
    fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600,
    color: active ? 'var(--gold)' : 'var(--text-muted)', transition: 'all 0.2s ease'
  })

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Edit Book</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem' }}>

        {/* Left — Image */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '1rem' }}>
            <img src={imagePath} alt='Book cover' style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
          </div>
          <form onSubmit={handleImageUpdateFormSubmit}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Replace Cover Image</label>
              <input type='file' accept='image/*' required
                style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}
                onChange={e => setSelectedImage(e.target.files[0])} />
            </div>
            {imagePreview && (
              <img src={imagePreview} alt='Preview' style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem', opacity: 0.8 }} />
            )}
            <button type='submit' className='btn-arcana-secondary' style={{ width: '100%', justifyContent: 'center' }}>
              Update Image
            </button>
          </form>
        </div>

        {/* Right — Form */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.25rem' }}>
              {[
                { label: 'Title', name: 'title', handler: handleOnChange },
                { label: 'Author', name: 'author', handler: handleOnChange },
                { label: 'Category', name: 'category', handler: handleUpperChange },
                { label: 'Language', name: 'language', handler: handleUpperChange },
              ].map(f => (
                <div key={f.name} style={fieldStyle}>
                  <label style={labelStyle}>{f.label}</label>
                  <input className='arcana-input' type='text' name={f.name} value={bookData[f.name]} onChange={f.handler} required autoComplete='off' />
                </div>
              ))}
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Description / Synopsis</label>
              <textarea className='arcana-input' name='description' rows={5} value={bookData.description} onChange={handleOnChange} required autoComplete='off' style={{ resize: 'vertical', minHeight: '100px' }} />
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
              <label style={toggleStyle(bookData.available)} onClick={() => setBookData({ ...bookData, available: !bookData.available })}>
                <span style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${bookData.available ? 'var(--gold)' : 'var(--border)'}`, background: bookData.available ? 'rgba(200,169,110,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                  {bookData.available ? '✓' : ''}
                </span>
                Available
              </label>
              <label style={toggleStyle(bookData.featured)} onClick={() => setBookData({ ...bookData, featured: !bookData.featured })}>
                <span style={{ width: 18, height: 18, borderRadius: 3, border: `2px solid ${bookData.featured ? 'var(--gold)' : 'var(--border)'}`, background: bookData.featured ? 'rgba(200,169,110,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>
                  {bookData.featured ? '✓' : ''}
                </span>
                Featured
              </label>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className='btn-arcana-secondary' onClick={() => navigate(-1)}>← Go Back</button>
              <button className='btn-arcana-primary' onClick={handleUpdateButton}>Save Changes</button>
              {!confirmDelete ? (
                <button className='btn-arcana-danger' onClick={() => setConfirmDelete(true)}>Delete Book</button>
              ) : (
                <>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', alignSelf: 'center' }}>Are you sure?</span>
                  <button className='btn-arcana-danger' onClick={handleDeleteButton}>Yes, Delete</button>
                  <button className='btn-arcana-secondary' onClick={() => setConfirmDelete(false)}>Cancel</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default EditBookForm
