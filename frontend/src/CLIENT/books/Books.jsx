import React, { useEffect, useState } from 'react'
import axios from 'axios'
import CustomPagination from '../pagination/CustomPagination'
import SmallBanner from '../bannerHome/SmallBanner'
import PopularBooks from './PopularBooks'
import { backend_server } from '../../main'
import BrowseCollectionBooks from './BrowseCollectionBooks'
import FilterBooksForm from './FilterBooksForm'

const Books = () => {
  const API_URL = `${backend_server}/api/v1/book/`
  const [bookData, setBookData] = useState([])
  const [searchResult, setSearchResult] = useState(true)
  const [filterActive, setFilterActive] = useState(false)

  const fetchData = async (pageNumber) => {
    try {
      const resp = await axios.get(`${API_URL}/?page=${pageNumber}`)
      setBookData(resp.data.data)
    } catch (error) { console.log('Error fetching books') }
  }

  useEffect(() => { fetchData() }, [])

  return (
    <div className='container py-4'>
      <div className='arcana-books-section' style={{ paddingTop: 0 }}>
        <h2 className='arcana-section-title'>Popular Books</h2>
        <PopularBooks />
      </div>

      <SmallBanner />

      <div className='arcana-books-section'>
        <h2 className='arcana-section-title'>Browse the Collection</h2>
        <div className='mt-4'>
          <FilterBooksForm setBookData={setBookData} setSearchResult={setSearchResult} setFilterActive={setFilterActive} />
        </div>
        <BrowseCollectionBooks bookData={bookData} searchResult={searchResult} />
        <div className='d-flex justify-content-center mt-4'>
          <CustomPagination fetchData={fetchData} filterActive={filterActive} />
        </div>
      </div>
    </div>
  )
}
export default Books
