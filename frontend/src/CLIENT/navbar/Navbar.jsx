import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './navbar.css'
import navbarData from './navbardata'
import UserLogin from './UserIsLoggedIn'
import UserSignin from './UserIsNotLoggedIn'
import { useLoginState } from '../../LoginState'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const userLoginState = useLoginState()
  const { navbarLinks, navbarTitle, navbarImage } = navbarData

  return (
    <nav className='arcana-navbar'>
      <div className='arcana-navbar-inner'>
        
        {/* Logo */}
        <Link to='/' className='arcana-nav-logo'>
          <img src={navbarImage} alt='Logo' />
          <span className='arcana-nav-logo-text'>{navbarTitle}</span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className='arcana-nav-links desktop-nav'>
          {navbarLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.url} className='arcana-nav-link'>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth */}
        <div className='arcana-nav-auth desktop-auth'>
          {userLoginState.userLogState ? <UserLogin /> : <UserSignin />}
        </div>

        {/* Hamburger (Mobile only) */}
        <button
          className='arcana-hamburger'
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label='Toggle menu'
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`arcana-nav-collapse ${menuOpen ? 'open' : ''}`}>
        
        {/* Mobile Links */}
        <ul className='arcana-nav-links'>
          {navbarLinks.map((link, index) => (
            <li key={index}>
              <Link
                to={link.url}
                className='arcana-nav-link'
                onClick={() => setMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile Auth */}
        <div className='arcana-nav-auth mobile-auth'>
          {userLoginState.userLogState ? <UserLogin /> : <UserSignin />}
        </div>
      </div>
    </nav>
  )
}

export default Navbar