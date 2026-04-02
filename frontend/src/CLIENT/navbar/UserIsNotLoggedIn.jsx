import React from 'react'
import { Link } from 'react-router-dom'
import navbarData from './navbardata'

const UserIsNotLoggedIn = () => {
  const { navbarLinksNotAuthenticated } = navbarData
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {navbarLinksNotAuthenticated.map((item, index) => (
        <Link
          key={index}
          to={item.url}
          className={index === navbarLinksNotAuthenticated.length - 1 ? 'btn-arcana-primary' : 'btn-arcana-secondary'}
          style={{ textDecoration: 'none' }}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

export default UserIsNotLoggedIn
