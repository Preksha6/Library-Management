import React from 'react'
import BookCard from './BookCard'
import RequestBook from '../requestBooks/RequestBook'

const BrowseCollectionBooks = ({ bookData, searchResult }) => {
  const { request_Book } = RequestBook()
  return (
    <div className='row gy-4 mt-1'>
      {bookData.length > 0 ? bookData.map((book, i) => (
        <div className='col-lg-3 col-md-4 col-sm-6 col-6' key={book._id}>
          <BookCard book={book} onRequest={request_Book} animDelay={i * 50} />
        </div>
      )) : (
        <div className='arcana-loading'>
          {searchResult ? 'Loading collection...' : '0 results found for your search'}
        </div>
      )}
    </div>
  )
}
export default BrowseCollectionBooks
