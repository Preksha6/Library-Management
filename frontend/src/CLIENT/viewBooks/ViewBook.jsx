import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { backend_server } from '../../main'
import './viewBooks.css'
import useFetch from '../../useFetch'
import RequestBook from '../requestBooks/RequestBook'
import SimilarBooks from './SimilarBooks'

const ViewBook = () => {
  const { id } = useParams()
  const API_URL = `${backend_server}/api/v1/books/${id}`
  const { request_Book } = RequestBook()
  const navigate = useNavigate()
  const getData = useFetch(API_URL)
  const data = getData.fetched_data.data
  const imageFullPath = getData.imagePath
  const [bookData, setBookData] = useState({})

  useEffect(() => {
    setBookData({ ...data, image: imageFullPath })
    window.scrollTo(0, 0)
  }, [data])

  return (
    <div className='container arcana-view-book'>
      <div className='arcana-view-book-panel'>
        <div className='arcana-view-book-cover'>
          <img src={bookData.image} alt={bookData.title || 'Book cover'} />
        </div>
        <div className='arcana-view-book-info'>
          <h1 className='arcana-view-book-title'>{bookData.title}</h1>
          <p className='arcana-view-book-author'>by {bookData.author}</p>

          <div className='arcana-view-book-meta'>
            <div className='arcana-view-meta-item'><span>Category</span>{bookData.category}</div>
            <div className='arcana-view-meta-item'><span>Language</span>{bookData.language}</div>
            <div className='arcana-view-meta-item'>
              <span>Status</span>
              {bookData.available
                ? <span style={{ color: 'var(--teal)' }}>In Stock</span>
                : <span style={{ color: 'var(--crimson-light)' }}>Out of Stock</span>}
            </div>
          </div>

          <p className='arcana-view-synopsis-label'>Synopsis</p>
          <p className='arcana-view-synopsis'>{bookData.description}</p>

          <div className='arcana-view-book-actions'>
            {bookData.available ? (
              <button className='btn-arcana-primary' onClick={() => request_Book(bookData._id)}>
                Request Book
              </button>
            ) : (
              <button className='btn-arcana-primary' disabled>Out of Stock</button>
            )}
            <button className='btn-arcana-secondary' onClick={() => navigate(-1)}>
              ← Go Back
            </button>
          </div>
        </div>
      </div>
      <SimilarBooks />
    </div>
  )
}
export default ViewBook
