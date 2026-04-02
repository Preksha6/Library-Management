import React, { useState, useEffect } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom'
import { useLoginState } from '../../LoginState'

const ArcanaModal = ({ show, onClose, title, children }) => {
  if (!show) return null
  return (
    <div className='arcana-modal-overlay' onClick={onClose}>
      <div className='arcana-modal' onClick={e => e.stopPropagation()}>
        <div className='arcana-modal-header'>
          <h3 className='arcana-modal-title'>{title}</h3>
          <button className='arcana-modal-close' onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}

const ClientDetails = ({ userData }) => {
  const UpdateUser_API_URL = `${backend_server}/api/v1/users`
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const userLoginState = useLoginState()

  const [inputFieldPassword, setInputFieldPassword] = useState({ old_password: '', new_password: '', confirm_password: '' })
  const [inputFieldNormal, setInputFieldNormal] = useState({ username: '', email: '', phone: '' })

  useEffect(() => { setInputFieldNormal({ ...userData }) }, [])

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(inputFieldNormal.email)) return toast.error('Invalid Email Format')
    const loadingId = toast.loading('Updating...', { position: 'top-center' })
    try {
      const { username, email, phone } = inputFieldNormal
      const response = await axios.patch(UpdateUser_API_URL, { username, email, phone })
      toast.dismiss(loadingId)
      if (response.data.ENTER_OTP) {
        toast.success(response.data.message)
        userLoginState.logout()
        navigate('/otp', { replace: true })
      } else { toast.success('Profile updated!') }
    } catch (error) { toast.dismiss(loadingId); console.log(error.response) }
    setShowEditModal(false)
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    const { confirm_password, new_password, old_password } = inputFieldPassword
    if (new_password !== confirm_password) return toast.error("Passwords don't match")
    const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
    if (!alphanumericRegex.test(new_password)) return toast.error('Password must be alphanumeric with special character')
    try {
      await axios.patch(UpdateUser_API_URL, { old_password, new_password })
      toast.success('Password updated!')
      setShowPasswordModal(false)
    } catch (error) { toast.error(error.response?.data?.message || 'Failed') }
  }

  if (!userData) return null

  return (
    <div>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
        My Details
      </h2>

      <div className='arcana-details-card'>
        <div className='arcana-details-row'>
          <span className='arcana-details-label'>Username</span>
          <span className='arcana-details-value'>{userData.username}</span>
        </div>
        <div className='arcana-details-row'>
          <span className='arcana-details-label'>Email</span>
          <span className='arcana-details-value'>{userData.email}</span>
        </div>
        <div className='arcana-details-row'>
          <span className='arcana-details-label'>Phone</span>
          <span className='arcana-details-value'>{userData.phone}</span>
        </div>
        <div className='arcana-details-row'>
          <span className='arcana-details-label'>Books Issued</span>
          <span className='arcana-details-value'>{userData.totalAcceptedBooks}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button className='btn-arcana-primary' onClick={() => setShowEditModal(true)}>Edit Profile</button>
        <button className='btn-arcana-secondary' onClick={() => setShowPasswordModal(true)}>Change Password</button>
      </div>

      {/* Edit Profile Modal */}
      <ArcanaModal show={showEditModal} onClose={() => setShowEditModal(false)} title='Edit Profile'>
        <form onSubmit={handleUpdateProfile}>
          {[{ label: 'Username', name: 'username', type: 'text', minLength: 5 },
            { label: 'Email', name: 'email', type: 'email', readOnly: true },
            { label: 'Phone', name: 'phone', type: 'text', pattern: '9\\d{9}', minLength: 10, maxLength: 10 }
          ].map(field => (
            <div className='arcana-form-group' key={field.name}>
              <label className='arcana-form-label'>{field.label}</label>
              <input className='arcana-input' {...field} value={inputFieldNormal[field.name] || ''}
                onChange={e => setInputFieldNormal({ ...inputFieldNormal, [e.target.name]: e.target.value })}
                required autoComplete='off' />
            </div>
          ))}
          <div className='arcana-modal-footer'>
            <button type='button' className='btn-arcana-secondary' onClick={() => setShowEditModal(false)}>Cancel</button>
            <button type='submit' className='btn-arcana-primary'>Save Changes</button>
          </div>
        </form>
      </ArcanaModal>

      {/* Change Password Modal */}
      <ArcanaModal show={showPasswordModal} onClose={() => setShowPasswordModal(false)} title='Change Password'>
        <form onSubmit={handleUpdatePassword}>
          <div className='arcana-form-group'>
            <label className='arcana-form-label'>Current Password</label>
            <input className='arcana-input' type='password' minLength={5} required placeholder='Current password'
              name='old_password' value={inputFieldPassword.old_password}
              onChange={e => setInputFieldPassword({ ...inputFieldPassword, old_password: e.target.value })} />
          </div>
          <div className='arcana-form-group'>
            <label className='arcana-form-label'>New Password</label>
            <input className='arcana-input' type='password' minLength={5} required placeholder='New password'
              name='new_password' value={inputFieldPassword.new_password}
              onChange={e => setInputFieldPassword({ ...inputFieldPassword, new_password: e.target.value })} />
          </div>
          <div className='arcana-form-group'>
            <label className='arcana-form-label'>Confirm New Password</label>
            <div className='arcana-password-wrap'>
              <input className='arcana-input' type={showPassword ? 'text' : 'password'} minLength={5} required placeholder='Repeat new password'
                name='confirm_password' value={inputFieldPassword.confirm_password}
                onChange={e => setInputFieldPassword({ ...inputFieldPassword, confirm_password: e.target.value })} />
              <button type='button' className='arcana-password-toggle' onClick={() => setShowPassword(p => !p)}>
                {showPassword ? <BsEye /> : <BsEyeSlash />}
              </button>
            </div>
          </div>
          <div className='arcana-modal-footer'>
            <button type='button' className='btn-arcana-secondary' onClick={() => setShowPasswordModal(false)}>Cancel</button>
            <button type='submit' className='btn-arcana-primary'>Update Password</button>
          </div>
        </form>
      </ArcanaModal>
    </div>
  )
}
export default ClientDetails
