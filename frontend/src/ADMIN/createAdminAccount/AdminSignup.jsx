import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

const AdminSignup = () => {
  const API_URL = 'http://localhost:5000/api/v1/signup'
  const refUsername = useRef(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [textField, setTextField] = useState({ username: '', email: '', phone: '', password: '', confirm_password: '' })

  const HandleFormSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)

  try {
    const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
    if (!emailRegex.test(textField.email)) {
      setLoading(false)
      return toast.error('Invalid Email Format')
    }

    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/
    if (!passwordRegex.test(textField.password)) {
      setLoading(false)
      return toast.error('Password must include letter, number & special character')
    }

    if (textField.password !== textField.confirm_password) {
      setLoading(false)
      return toast.error("Passwords don't match")
    }

    const loadingId = toast.loading('Creating admin account…')

    const { username, email, phone, password } = textField

    const response = await axios.post(
  API_URL,
  {
    username,
    email,
    phone: phone.replace("+91", ""), // ✅ backend expects digits
    password,
    userType: 'admin_user' // ✅ explicitly set admin role
  },
  {
    withCredentials: true // ✅ required for OTP cookie
  },{
    timeout: 10000 // ✅ 10 second timeout for backend response
  })

    toast.dismiss(loadingId)
    setLoading(false)

    if (response.data.GOTO_LOGIN) {
      toast('Account already exists.', { icon: 'ℹ️' })
    } else {
      navigate('/admin/otp', { replace: true })
    }

  } catch (error) {
    setLoading(false)

    if (error.code === 'ECONNABORTED') {
      toast.error('Server timeout (backend slow)')
    } else if (error.response) {
      toast.error(error.response.data?.message || 'Server error')
    } else {
      toast.error('Cannot connect to backend')
    }

    console.error(error)
  }
}

  const HandleOnChange = (e) => setTextField({ ...textField, [e.target.name]: e.target.value })
  useEffect(() => { refUsername.current?.focus() }, [])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: 560, background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <div className='arcana-auth-ornament'>⚙ ✦ ⚙</div>
        <h2 className='arcana-auth-title'>Create Admin Account</h2>
        <p className='arcana-auth-subtitle'>Register a new administrator</p>

        <form onSubmit={HandleFormSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Username</label>
              <input className='arcana-input' type='text' name='username' value={textField.username} onChange={HandleOnChange} ref={refUsername} placeholder='Admin username' required autoComplete='off' maxLength='20' minLength='5' />
            </div>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Email</label>
              <input className='arcana-input' type='email' name='email' value={textField.email} onChange={HandleOnChange} placeholder='admin@gmail.com' required autoComplete='off' />
            </div>
          </div>
          <div className='arcana-form-group'>
            <label className='arcana-form-label'>Phone Number</label>
            <input className='arcana-input' type='text' name='phone' value={textField.phone} onChange={HandleOnChange} placeholder='+91XXXXXXXXXX' required autoComplete='off' pattern="^\+91\d{10}$" minLength='13' maxLength='13' />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Password</label>
              <input className='arcana-input' type='password' name='password' value={textField.password} onChange={HandleOnChange} placeholder='Strong password' required autoComplete='off' minLength='5' />
            </div>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Confirm Password</label>
              <div className='arcana-password-wrap'>
                <input className='arcana-input' type={showPassword ? 'text' : 'password'} name='confirm_password' value={textField.confirm_password} onChange={HandleOnChange} placeholder='Repeat password' required autoComplete='off' minLength='5' />
                <button type='button' className='arcana-password-toggle' onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
            </div>
          </div>
          <button type='submit' disabled={loading} className='btn-arcana-primary' style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.5rem' }}>
            {loading ? 'Creating Account…' : 'Create Admin Account'}
          </button>
        </form>
      </div>
    </div>
  )
}
export default AdminSignup
