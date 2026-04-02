import React, { useEffect, useState } from 'react'
import CategoryButtons from './CategoryButtons'
import BookList from './BookList'
import axios from 'axios'
import { backend_server } from '../../main'

const FeaturedBooks = () => {
  const [allFeaturedBooks, setAllFeaturedBooks] = useState([])
  const [bookCategories, setBookCategories] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/featuredBooks`).then(res => {
      const data = res.data.data
      const allCats = ['SHOW ALL', ...new Set(data.map(b => b.category))]
      setBookCategories(allCats)
      setAllFeaturedBooks(data)
      setBooks(data)
    }).catch(console.log)
  }, [])

  const FilterItems = (category) => {
    setBooks(category === 'SHOW ALL' ? allFeaturedBooks : allFeaturedBooks.filter(b => b.category === category))
  }

  return (
    <div className='arcana-books-section'>
      <h2 className='arcana-section-title'>Featured Books</h2>
      {allFeaturedBooks.length > 0 ? (
        <>
          <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
            <CategoryButtons filterFunction={FilterItems} categories={bookCategories} />
          </div>
          <BookList books={books} />
        </>
      ) : (
        <p className='arcana-loading'>Loading featured books...</p>
      )}
    </div>
  )
}
export default FeaturedBooks
