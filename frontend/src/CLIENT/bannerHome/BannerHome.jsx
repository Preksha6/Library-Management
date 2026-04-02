import React, { useState, useEffect } from 'react'
import './banner.css'
import bannerData from './bannerdata'
import { Link } from 'react-router-dom'

const BannerHome = () => {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % bannerData.length), 5000)
    return () => clearInterval(timer)
  }, [])

  const current = bannerData[active]

  return (
    <div className='arcana-hero'>
      <div className='arcana-hero-slide'>
        <img src={current.image} alt={current.heading} key={current.id} />
        <div className='arcana-hero-overlay' />
        <div className='arcana-hero-content'>
          <span className='arcana-hero-tag'>Arcana Library</span>
          <h1 className='arcana-hero-heading'>{current.heading}</h1>
          <p className='arcana-hero-para'>{current.paragraph}</p>
          <Link to='/books' className='btn-arcana-primary' style={{ textDecoration: 'none', fontSize: '0.95rem' }}>
            Browse Collection
          </Link>
        </div>
        <div className='arcana-carousel-dots'>
          {bannerData.map((_, i) => (
            <button key={i} className={`arcana-dot ${i === active ? 'active' : ''}`} onClick={() => setActive(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default BannerHome
