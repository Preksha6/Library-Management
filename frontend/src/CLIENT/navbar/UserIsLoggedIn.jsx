import React from 'react'
import { Link } from 'react-router-dom'
import navbarData from './navbardata'

const UserIsLoggedIn = () => {
  const { navbarLinksIsAuthenticated } = navbarData
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {navbarLinksIsAuthenticated.map((item, index) => (
        <Link
          key={index}
          to={item.url}
          className={index === navbarLinksIsAuthenticated.length - 1 ? 'btn-arcana-primary' : 'arcana-nav-link'}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default UserIsLoggedIn
