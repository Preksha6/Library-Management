import React from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import navbarData from './adminnavbardata'

const AdminNavbar = () => {
  const { navbarTitle, navbarImage } = navbarData
  return (
    <nav className='arcana-admin-navbar'>
      <div className='arcana-admin-navbar-inner'>
        <Link to='/admin' className='arcana-admin-brand'>
          <img src={navbarImage} alt='Logo' />
          <span className='arcana-admin-brand-text'>{navbarTitle}</span>
        </Link>
        <span className='arcana-admin-badge'>Admin Panel</span>
      </div>
    </nav>
  )
}
export default AdminNavbar
