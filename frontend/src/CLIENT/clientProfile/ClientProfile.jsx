import React, { useState, useEffect } from 'react'
import { useLoginState } from '../../LoginState'
import axios from 'axios'
import { backend_server } from '../../main'
import ClientDashboard from './ClientDashboard'
import ClientDetails from './ClientDetails'
import ClientLogout from '../clientLogout/ClientLogout'
import './clientprofile.css'

const ClientProfile = () => {
  const userLoginState = useLoginState()
  const getSingleUser_API_URL = `${backend_server}/api/v1/users/`
  const [userBookData, setUserBookData] = useState([])
  const [userData, setUserData] = useState(null)
  const [activeTab, setActiveTab] = useState('dashboard')

  const fetchData = async () => {
    try {
      const response = await axios.post(getSingleUser_API_URL, {})
      if (response.data.bookDataAll) setUserBookData(response.data.bookDataAll)
      if (response.data.userData) setUserData(response.data.userData)
    } catch (error) { console.log(error) }
  }

  useEffect(() => { fetchData() }, [])

  const tabs = [
    { id: 'dashboard', label: '📖 Dashboard' },
    { id: 'details', label: '👤 My Details' },
    { id: 'logout', label: '↩ Sign Out' },
  ]

  return (
    <div className='arcana-profile-layout'>
      <aside className='arcana-profile-sidebar'>
        <div className='arcana-profile-avatar'>
          <img src='/clientprofile.png' alt='Profile' />
          {userData && <h5>{userData.username}</h5>}
        </div>
        <nav className='arcana-profile-nav'>
          {tabs.map(tab => (
            <button key={tab.id} className={`arcana-profile-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className='arcana-profile-content'>
        {activeTab === 'dashboard' && <ClientDashboard userBookData={userBookData} />}
        {activeTab === 'details' && userData && <ClientDetails userData={userData} />}
        {activeTab === 'logout' && <ClientLogout />}
      </main>
    </div>
  )
}
export default ClientProfile
