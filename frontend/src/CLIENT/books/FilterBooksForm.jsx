import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import './filterbooksform.css'

const FilterBooksForm = ({ setBookData, setSearchResult, setFilterActive }) => {
  const API_URL_FILTER = `${backend_server}/api/v1/filter`
  const API_ALLBOOKS_URL = `${backend_server}/api/v1/books`
  const empty_field = { title: '', category: '', author: '', language: '' }
  const [filterFields, setFilterFields] = useState(empty_field)
  const [categories, setCategories] = useState([])
  const [author, setAuthor] = useState([])
  const [language, setLanguage] = useState([])

  const fetchAllCategories = async () => {
    try {
      const response = await axios.get(API_ALLBOOKS_URL)
      const data = response.data.data
      setCategories([...new Set(data.map(b => b.category))])
      setAuthor([...new Set(data.map(b => b.author))])
      setLanguage([...new Set(data.map(b => b.language))])
    } catch (error) { console.log(error.response) }
  }

  useEffect(() => { fetchAllCategories() }, [])

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    if (JSON.stringify(filterFields) === JSON.stringify(empty_field)) return setFilterActive(false)
    setFilterActive(true)
    try {
      const { title, category, author, language } = filterFields
      const response = await axios.get(API_URL_FILTER, { params: { title, category, author, language } })
      if (response.data.total === 0) setSearchResult(false)
      setBookData(response.data.data)
    } catch (error) { console.log(error) }
  }

  const handleClearFilter = () => {
    setFilterFields(empty_field)
    setCategories([]); setAuthor([]); setLanguage([])
    fetchAllCategories()
  }

  return (
    <div className='arcana-filter-bar'>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Title</label>
        <input className='arcana-input' type='text' autoComplete='off' placeholder='Search by title…'
          name='title' value={filterFields.title}
          onChange={e => setFilterFields({ ...filterFields, title: e.target.value })} />
      </div>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Category</label>
        <select className='arcana-select' value={filterFields.category}
          onChange={e => setFilterFields({ ...filterFields, category: e.target.value })}>
          <option value=''>All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Author</label>
        <select className='arcana-select' value={filterFields.author}
          onChange={e => setFilterFields({ ...filterFields, author: e.target.value })}>
          <option value=''>All Authors</option>
          {author.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>
      <div className='arcana-filter-field'>
        <label className='arcana-filter-label'>Language</label>
        <select className='arcana-select' value={filterFields.language}
          onChange={e => setFilterFields({ ...filterFields, language: e.target.value })}>
          <option value=''>All Languages</option>
          {language.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
        </select>
      </div>
      <div className='arcana-filter-actions'>
        <button type='button' className='btn-arcana-primary' onClick={handleFormSubmit}>Search</button>
        <button type='button' className='btn-arcana-danger' onClick={handleClearFilter}>Clear</button>
      </div>
    </div>
  )
}
export default FilterBooksForm
