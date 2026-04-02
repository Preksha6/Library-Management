import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import './signup.css'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { BsEye, BsEyeSlash } from 'react-icons/bs'

const Signup = () => {
  const API_URL = 'http://localhost:5000/api/v1/signup'
  const refUsername = useRef(null)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [textField, setTextField] = useState({
    username: '', email: '', phone: '', password: '', confirm_password: ''
  })

  const HandleFormSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const emailRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/
      if (!emailRegex.test(textField.email)) {
        setLoading(false)
        return toast('Invalid Email Format', { icon: 'ℹ️' })
      }
      const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      if (!alphanumericRegex.test(textField.password)) {
        setLoading(false)
        return toast('Password must be alphanumeric with at least one special character', { icon: 'ℹ️' })
      }
      if (textField.password !== textField.confirm_password) {
        setLoading(false)
        return toast("Passwords don't match", { icon: 'ℹ️' })
      }
      const loadingToastId = toast.loading('Registering account...', { position: 'top-center' })
      const { username, email, phone, password } = textField
      const response = await axios.post(
  API_URL,
  {
    username,
    email,
    phone, // ✅ JUST SEND VALUE
    password
  },
  {
    withCredentials: true,
    timeout: 10000
  }
)
      toast.dismiss(loadingToastId)
      setTextField({ username: '', email: '', phone: '', password: '', confirm_password: '' })
      setLoading(false)
      if (response.data.GOTO_LOGIN === true) {
        navigate('/login', { replace: true })
        toast('Account already exists. Please log in.', { icon: 'ℹ️' })
      } else if (response.data.ENTER_OTP === true) {

  // ✅ STORE EMAIL FOR OTP PAGE

  navigate('/otp', { replace: true })
  toast(response.data.message, { icon: 'ℹ️' })
}
    } catch (error) {
      console.log(error)
      setLoading(false)
      console.log(error.response?.data)
      toast('Something went wrong. Please try again.', { icon: '❌' })
    }
  }

  const HandleOnChange = (e) => setTextField({ ...textField, [e.target.name]: e.target.value })
  useEffect(() => { refUsername.current?.focus() }, [])

  return (
    <div className='arcana-signup-page'>
      <div className='arcana-signup-card'>
        <div className='arcana-auth-ornament'>✦ ✦ ✦</div>
        <h1 className='arcana-auth-title'>Join the Library</h1>
        <p className='arcana-auth-subtitle'>Create your reader's account</p>

        <form onSubmit={HandleFormSubmit}>
          <div className='arcana-form-row'>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Username</label>
              <input
                type='text' className='arcana-input' placeholder='Your name'
                value={textField.username} onChange={HandleOnChange}
                name='username' autoComplete='off' required
                ref={refUsername} maxLength='20' minLength='5'
              />
            </div>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Email</label>
              <input
                type='email' className='arcana-input' placeholder='user@gmail.com'
                value={textField.email} onChange={HandleOnChange}
                name='email' autoComplete='off' required
              />
            </div>
          </div>

          <div className='arcana-form-group'>
            <label className='arcana-form-label'>Phone Number</label>
            <input
              type='text' className='arcana-input' placeholder='e.g. +91XXXXXXXXXX'
              value={textField.phone} onChange={HandleOnChange}
              name='phone' autoComplete='off' required
              pattern="^\+91\d{10}$" minLength='13' maxLength='13'
            />
          </div>

          <div className='arcana-form-row'>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Password</label>
              <input
                type='password' className='arcana-input' placeholder='Strong password'
                value={textField.password} onChange={HandleOnChange}
                name='password' autoComplete='off' required minLength='5'
              />
            </div>
            <div className='arcana-form-group'>
              <label className='arcana-form-label'>Confirm Password</label>
              <div className='arcana-password-wrap'>
                <input
                  type={showPassword ? 'text' : 'password'} className='arcana-input'
                  placeholder='Repeat password'
                  value={textField.confirm_password} onChange={HandleOnChange}
                  name='confirm_password' autoComplete='off' required minLength='5'
                />
                <button type='button' className='arcana-password-toggle' onClick={() => setShowPassword(p => !p)}>
                  {showPassword ? <BsEye /> : <BsEyeSlash />}
                </button>
              </div>
            </div>
          </div>

          <button type='submit' disabled={loading} className='btn-arcana-primary arcana-auth-submit' style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className='arcana-auth-links' style={{ justifyContent: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Already a member?</span>
          <Link to='/login' className='btn-arcana-secondary' style={{ textDecoration: 'none' }}>Sign In</Link>
        </div>
      </div>
    </div>
  )
}

export default Signup