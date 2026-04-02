import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backend_server } from '../../main'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AddNewBook = () => {
  const API_URL = `${backend_server}/api/v1/books`
  const API_URL_ALL_BOOK_CATEGORIES = `${backend_server}/api/v1/book_category`
  const navigate = useNavigate()
  const empty_inputfield = { title: '', author: '', description: '', category: '', available: true, featured: false, language: 'ENGLISH' }
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState()
  const [inputvalue, setInputValue] = useState(empty_inputfield)
  const [relatedCategories, setRelatedCategories] = useState([])

  useEffect(() => {
    if (!selectedImage) { setImagePreview(undefined); return }
    const objectUrl = URL.createObjectURL(selectedImage)
    setImagePreview(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedImage])

  const handleOnChange = (e) => setInputValue({ ...inputvalue, [e.target.name]: e.target.value })
  const handleUpperChange = (e) => setInputValue({ ...inputvalue, [e.target.name]: e.target.value.toUpperCase() })
  const handleBoolChange = (e) => setInputValue({ ...inputvalue, [e.target.name]: e.target.value === 'true' })

  const handleCategoryOnChange = async (e) => {
    const value = e.target.value
    setInputValue({ ...inputvalue, category: value.toUpperCase() })
    try {
      const data = await axios.post(API_URL_ALL_BOOK_CATEGORIES, { user_input_category: value })
      setRelatedCategories(data.data.book_category)
    } catch (error) { console.log(error.response) }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData()
    formData.append('image', selectedImage)
    Object.entries(inputvalue).forEach(([k, v]) => formData.append(k, v))
    try {
      await axios.post(API_URL, formData)
      toast.success('New book added successfully!')
      setInputValue(empty_inputfield); setSelectedImage(null)
    } catch (error) { toast.error('Error adding book') }
  }

  const fieldStyle = { display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }
  const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Add New Book</h2>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '800px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Title *</label>
              <input className='arcana-input' type='text' name='title' value={inputvalue.title} onChange={handleOnChange} placeholder='Book title' required autoComplete='off' />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Author *</label>
              <input className='arcana-input' type='text' name='author' value={inputvalue.author} onChange={handleOnChange} placeholder='Author name' required autoComplete='off' />
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Category *</label>
              <input className='arcana-input' type='text' name='category' value={inputvalue.category} onChange={handleCategoryOnChange} placeholder='e.g. FICTION' required autoComplete='off' />
              {relatedCategories.length > 0 && (
                <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-md)', padding: '0.5rem 0', marginTop: '-0.25rem', zIndex: 10, position: 'relative' }}>
                  {relatedCategories.map(cat => (
                    <div key={cat} onClick={() => { setInputValue({ ...inputvalue, category: cat.toUpperCase() }); setRelatedCategories([]) }}
                      style={{ padding: '0.45rem 1rem', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.target.style.background = 'rgba(200,169,110,0.08)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}>
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Language *</label>
              <input className='arcana-input' type='text' name='language' value={inputvalue.language} onChange={handleUpperChange} placeholder='ENGLISH' required autoComplete='off' />
            </div>
          </div>

          <div style={fieldStyle}>
            <label style={labelStyle}>Description / Synopsis *</label>
            <textarea className='arcana-input' name='description' rows={4} value={inputvalue.description} onChange={handleOnChange} placeholder='Brief synopsis of the book…' required autoComplete='off' style={{ resize: 'vertical' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0 1.5rem' }}>
            <div style={fieldStyle}>
              <label style={labelStyle}>Available</label>
              <select className='arcana-select' name='available' value={inputvalue.available.toString()} onChange={handleBoolChange}>
                <option value='true'>Yes</option>
                <option value='false'>No</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Featured</label>
              <select className='arcana-select' name='featured' value={inputvalue.featured.toString()} onChange={handleBoolChange}>
                <option value='false'>No</option>
                <option value='true'>Yes</option>
              </select>
            </div>
            <div style={fieldStyle}>
              <label style={labelStyle}>Cover Image *</label>
              <input type='file' accept='image/*' required onChange={e => setSelectedImage(e.target.files[0])}
                style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', paddingTop: '0.5rem' }} />
            </div>
          </div>

          {imagePreview && (
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Preview</label>
              <img src={imagePreview} alt='Preview' style={{ width: 140, height: 190, objectFit: 'cover', borderRadius: 'var(--radius-md)', display: 'block', marginTop: '0.5rem', border: '1px solid var(--border-gold)' }} />
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type='submit' className='btn-arcana-primary'>Add Book</button>
            <button type='button' className='btn-arcana-secondary' onClick={() => navigate(-1)}>← Go Back</button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddNewBook
