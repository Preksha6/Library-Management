import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import './adminpanel.css'
import axios from 'axios'
import { GiBookshelf, GiBookPile } from 'react-icons/gi'
import { FaUserFriends } from 'react-icons/fa'
import { FiGitPullRequest } from 'react-icons/fi'
import { BiCategoryAlt } from 'react-icons/bi'
import { BsFillJournalBookmarkFill } from 'react-icons/bs'

const statConfig = [
  { key: 'totalBooks', label: 'Total Books', Icon: GiBookshelf },
  { key: 'totalIssuedBooks', label: 'Issued Books', Icon: GiBookPile },
  { key: 'totalBookRequests', label: 'Book Requests', Icon: FiGitPullRequest },
  { key: 'totalRegisteredUsers', label: 'Registered Users', Icon: FaUserFriends },
  { key: 'totalAuthors', label: 'Authors Listed', Icon: BsFillJournalBookmarkFill },
  { key: 'totalCategories', label: 'Categories', Icon: BiCategoryAlt },
]

const AdminPanel = () => {
  const [homepageData, setHomepageData] = useState({})

  useEffect(() => {
    axios.get(`${backend_server}/api/v1/adminHomePageInfo`)
      .then(res => setHomepageData(res.data.data))
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <h2 className='arcana-admin-title'>Dashboard Overview</h2>
      <div className='arcana-stat-grid'>
        {statConfig.map(({ key, label, Icon }) => (
          <div className='arcana-stat-card' key={key}>
            <div className='arcana-stat-icon'><Icon /></div>
            <div className='arcana-stat-value'>{homepageData[key] ?? '—'}</div>
            <div className='arcana-stat-label'>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default AdminPanel
