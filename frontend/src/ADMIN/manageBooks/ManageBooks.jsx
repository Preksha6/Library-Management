import React, { useEffect, useState } from 'react'
import ManageSearchBooks from './ManageSearchBooks'
import axios from 'axios'
import CustomPagination from '../../CLIENT/pagination/CustomPagination'
import { backend_server } from '../../main'
import { Link } from 'react-router-dom'

const ManageBooks = () => {
  const API_URL = `${backend_server}/api/v1/books`
  const API_SKIPFETCH = `${backend_server}/api/v1/book/`
  const [searchResult, setSearchResult] = useState(true)
  const [filterActive, setFilterActive] = useState(false)
  const [allBooks, setAllBooks] = useState([])
  const [categories, setCategories] = useState([])

  const fetchData = async (pageNumber) => {
    try {
      const resp = await axios.get(`${API_SKIPFETCH}/?page=${pageNumber}`)
      setAllBooks(resp.data.data)
    } catch (error) { console.log('Error fetching books', error) }
  }

  const fetchBooks = async () => {
    try {
      const response = await axios.get(API_URL)
      const bookCategories = [...new Set(response.data.data.map(b => b.category))]
      setCategories(bookCategories)
    } catch (error) { console.log(error.response) }
  }

  useEffect(() => { fetchBooks(); fetchData() }, [])

  return (
    <div className='arcana-admin-page'>
      <h2 className='arcana-admin-title'>Manage Books</h2>
      <ManageSearchBooks setAllBooks={setAllBooks} bookCategories={categories} />

      {allBooks.length > 0 ? (
        <>
          <div className='arcana-table-wrap'>
            <table className='arcana-table'>
              <thead>
                <tr><th>#</th><th>Title</th><th>Category</th><th>Featured</th><th>Available</th><th>Action</th></tr>
              </thead>
              <tbody>
                {allBooks.map(({ _id, title, category, featured, available }, index) => (
                  <tr key={_id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>{index + 1}</td>
                    <td className='title-cell'>{title}</td>
                    <td>{category}</td>
                    <td>
                      <span style={{ color: featured ? 'var(--gold)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                        {featured ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: available ? '#6ecece' : 'var(--crimson-light)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}>
                        {available ? 'YES' : 'NO'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/managebooks/${_id}`}>
                        <button className='btn-arcana-secondary' style={{ fontSize: '0.78rem', padding: '0.35rem 0.8rem' }}>
                          Edit / View
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className='d-flex justify-content-center mt-4'>
            <CustomPagination fetchData={fetchData} filterActive={filterActive} />
          </div>
        </>
      ) : (
        <div className='arcana-loading'>No books found.</div>
      )}
    </div>
  )
}
export default ManageBooks
