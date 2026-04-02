import axios from 'axios'
import React, { useState } from 'react'
import { backend_server } from '../../main'

const ManageSearchBooks = ({ setAllBooks, bookCategories }) => {
  const API_URL = `${backend_server}/api/v1/filter`
  const empty_field = { title: '', category: '', featured: '', available: '' }
  const [filterFields, setFilterFields] = useState(empty_field)

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (JSON.stringify(filterFields) === JSON.stringify(empty_field)) return
    const { title, category, featured, available } = filterFields
    try {
      const response = await axios.get(API_URL, { params: { title, category, featured, available } })
      setAllBooks(response.data.data)
    } catch (error) { console.log(error.response) }
  }

  const handleClearFilters = () => {
    setFilterFields(empty_field)
    ;['categorySelect','featuredSelect','availableSelect'].forEach(id => {
      const el = document.getElementById(id)
      if (el) el.selectedIndex = 0
    })
  }

  return (
    <div className='arcana-filter-bar' style={{ marginBottom: '1.5rem' }}>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Title</label>
        <input className='arcana-input' type='text' autoComplete='off' placeholder='Search by title…'
          name='title' value={filterFields.title}
          onChange={e => setFilterFields({ ...filterFields, title: e.target.value })} />
      </div>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Category</label>
        <select id='categorySelect' className='arcana-select'
          onChange={e => setFilterFields({ ...filterFields, category: e.target.value })}>
          <option value=''>All Categories</option>
          {bookCategories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Featured</label>
        <select id='featuredSelect' className='arcana-select'
          onChange={e => setFilterFields({ ...filterFields, featured: e.target.value })}>
          <option value=''>Any</option>
          <option value='true'>Featured</option>
          <option value='false'>Not Featured</option>
        </select>
      </div>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Available</label>
        <select id='availableSelect' className='arcana-select'
          onChange={e => setFilterFields({ ...filterFields, available: e.target.value })}>
          <option value=''>Any</option>
          <option value='true'>Available</option>
          <option value='false'>Out of Stock</option>
        </select>
      </div>
      <div className='arcana-filter-actions'>
        <button type='button' className='btn-arcana-primary' onClick={handleFormSubmit}>Search</button>
        <button type='button' className='btn-arcana-danger' onClick={handleClearFilters}>Clear</button>
      </div>
    </div>
  )
}
export default ManageSearchBooks
