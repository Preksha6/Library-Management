import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import BookCard from '../books/BookCard'
import RequestBook from '../requestBooks/RequestBook'

const SimilarBooks = () => {
  const { id } = useParams()
  const [similarBooks, setSimilarBooks] = useState([])
  const { request_Book } = RequestBook()

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/similarBooks/${id}`)
      .then(res => setSimilarBooks(res.data.data))
      .catch(console.log)
  }, [])

  if (similarBooks.length === 0) return null

  return (
    <div className='arcana-books-section'>
      <h2 className='arcana-section-title'>You May Also Enjoy</h2>
      <div className='row gy-4 mt-2'>
        {similarBooks.map((book, i) => (
          <div className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6' key={book._id}>
            <BookCard book={book} onRequest={request_Book} animDelay={i * 60} />
          </div>
        ))}
      </div>
    </div>
  )
}
export default SimilarBooks
