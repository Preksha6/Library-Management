import React from 'react'
import { Link } from 'react-router-dom'
import { backend_server } from '../../main'
import './card.css'

const BookCard = ({ book, onRequest, animDelay = 0 }) => {
  const { _id, title, image, author, available } = book
  const imgSrc = `${backend_server}/${image}`

  return (
    <div className='arcana-book-card fade-in-up' style={{ animationDelay: `${animDelay}ms` }}>
      <div className='arcana-book-img-wrap'>
        <img src={imgSrc} alt={title} />
        <div className='arcana-book-overlay'>
          {available ? (
            <button className='btn-arcana-primary' onClick={() => onRequest?.(_id)}>Request</button>
          ) : (
            <span className='arcana-badge arcana-badge-red'>Out of Stock</span>
          )}
          <Link to={`/books/${_id}`}>
            <button className='btn-arcana-secondary'>View</button>
          </Link>
        </div>
      </div>
      <div className='arcana-book-body'>
        <h5 className='arcana-book-title'>{title}</h5>
        <p className='arcana-book-author'>by {author}</p>
        <div className='arcana-book-actions'>
          {available ? (
            <button className='btn-arcana-primary' onClick={() => onRequest?.(_id)}>Request</button>
          ) : (
            <button className='btn-arcana-primary' disabled>Out of Stock</button>
          )}
          <Link to={`/books/${_id}`} style={{ flex: 1 }}>
            <button className='btn-arcana-secondary' style={{ width: '100%' }}>View</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default BookCard
