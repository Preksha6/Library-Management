import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { sidebarData } from './sidebarData'
import './sidebar.css'

const Sidebar = () => {
  const location = useLocation()

  const mainItems = sidebarData.filter(item => item.id <= 8)
  const bottomItems = sidebarData.filter(item => item.id > 8)

  return (
    <aside className='arcana-sidebar'>
      <div className='arcana-sidebar-label'>Navigation</div>
      <div className='arcana-sidebar-section'>
        {mainItems.map(item => (
          <Link
            key={item.id}
            to={item.url}
            className={`arcana-sidebar-link ${location.pathname === item.url ? 'active' : ''}`}
            style={location.pathname === item.url ? { color: 'var(--gold)', background: 'rgba(200,169,110,0.1)', borderLeftColor: 'var(--gold)' } : {}}
          >
            {item.title}
          </Link>
        ))}
      </div>
      <div className='arcana-sidebar-divider' />
      <div className='arcana-sidebar-section'>
        {bottomItems.map(item => (
          <Link
            key={item.id}
            to={item.url}
            className={`arcana-sidebar-link ${item.id === 10 ? 'danger' : ''}`}
          >
            {item.title}
          </Link>
        ))}
      </div>
    </aside>
  )
}
export default Sidebar
