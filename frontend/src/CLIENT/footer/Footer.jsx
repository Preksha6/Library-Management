import React from 'react'
import { Link } from 'react-router-dom'
import './footer.css'

const Footer = () => (
  <footer className='arcana-footer'>
    <div className='arcana-footer-inner'>
      <div className='arcana-footer-grid'>
        <div>
          <div className='arcana-footer-brand-name'>Arcana Library</div>
          <p className='arcana-footer-tagline'>
            A digital sanctuary for curious minds. Discover, request, and explore thousands of titles from our curated collection.
          </p>
        </div>
        <div>
          <h4 className='arcana-footer-heading'>Quick Links</h4>
          <ul className='arcana-footer-list'>
            <li><Link to='/'>Home</Link></li>
            <li><Link to='/books'>Browse Books</Link></li>
            <li><Link to='/menu'>Featured</Link></li>
            <li><Link to='/about'>About Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className='arcana-footer-heading'>Contact</h4>
          <ul className='arcana-footer-list'>
            <li>library.info.books@gmail.com</li>
            <li>+977-9801234568</li>
            <li>Kolkata, West Bengal</li>
          </ul>
          <h4 className='arcana-footer-heading' style={{ marginTop: '1rem' }}>Legal</h4>
          <ul className='arcana-footer-list'>
            <li><Link to='/about'>Privacy Policy</Link></li>
            <li><Link to='/about'>Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className='arcana-footer-bottom'>
        <span className='arcana-footer-copy'>© {new Date().getFullYear()} Arcana Library. All rights reserved.</span>
        <span className='arcana-footer-ornament'>✦ ✦ ✦</span>
      </div>
    </div>
  </footer>
)
export default Footer
