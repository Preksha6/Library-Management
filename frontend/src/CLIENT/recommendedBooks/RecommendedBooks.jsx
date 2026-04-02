import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import BookCard from '../books/BookCard'
import RequestBook from '../requestBooks/RequestBook'

const RecommendedBooks = () => {
  const [books, setBooks] = useState([])
  const { request_Book } = RequestBook()

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/recommendedBooks`)
      .then(res => setBooks(res.data.data))
      .catch(() => {})
  }, [])

  if (books.length === 0) return null

  return (
    <div className='arcana-books-section'>
      <h2 className='arcana-section-title'>Recommended for You</h2>
      <div className='row gy-4 mt-3'>
        {books.map((book, i) => (
          <div className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6' key={book._id}>
            <BookCard book={book} onRequest={request_Book} animDelay={i * 60} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default RecommendedBooks
