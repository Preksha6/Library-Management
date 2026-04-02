import React from 'react'
import BookCard from '../books/BookCard'
import RequestBook from '../requestBooks/RequestBook'

const BookList = ({ books }) => {
  const { request_Book } = RequestBook()
  return (
    <div className='row gy-4'>
      {books.map((book, i) => (
        <div className='col-xxl-3 col-lg-3 col-md-4 col-sm-6 col-6' key={book._id}>
          <BookCard book={book} onRequest={request_Book} animDelay={i * 60} />
        </div>
      ))}
    </div>
  )
}
export default BookList
