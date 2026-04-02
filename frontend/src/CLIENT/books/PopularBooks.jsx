import React, { useEffect, useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import BookCard from './BookCard'
import RequestBook from '../requestBooks/RequestBook'

const PopularBooks = () => {
  const [popularBooks, setPopularBooks] = useState([])
  const { request_Book } = RequestBook()

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/popularBooks`)
      .then(res => setPopularBooks(res.data.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div className='row gy-4 mt-1'>
      {popularBooks.length > 0 ? popularBooks.map((book, i) => (
        <div className='col-lg-3 col-md-4 col-sm-6 col-6' key={book._id}>
          <BookCard book={book} onRequest={request_Book} animDelay={i * 60} />
        </div>
      )) : <p className='arcana-loading'>Loading popular books...</p>}
    </div>
  )
}
export default PopularBooks
