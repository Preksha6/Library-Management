import React, { useEffect, useRef, useState } from 'react'
import './login.css'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { backend_server } from '../../main'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { useLoginState } from '../../LoginState'

const Login = () => {
  const API_URL = `${backend_server}/api/v1/login`
  const navigate = useNavigate()
  const refUsername = useRef(null)
  const [textfield, setTextField] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const userLoginState = useLoginState()

  const HandleSubmit = async (e) => {
    e.preventDefault()
    const loadingToastId = toast.loading('Signing in...', { position: 'top-center' })
    try {
      const { email, password } = textfield
      const response = await axios.post(
        API_URL,
        { email, password },
        { withCredentials: true }  // required so the otp-cookie is received
      )
      const userType = response.data.userType
      toast.dismiss(loadingToastId)
      userLoginState.login(email, userType)
      if (userType === 'normal_user') {
        toast.success('Welcome back!')
        navigate('/', { replace: true })
      } else if (userType === 'admin_user') {
        window.location.href = '/admin'
      }
    } catch (error) {
      toast.dismiss(loadingToastId)
      if (error.response?.data?.ENTER_OTP === true) {
        navigate('/otp', { replace: true })
        toast(error.response.data.message, { icon: 'ℹ️' })
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message)
      }
    }
  }

  const HandleOnChange = (e) => {
    setTextField({ ...textfield, [e.target.name]: e.target.value })
  }

  useEffect(() => { refUsername.current?.focus() }, [])

  return (
    <div className='arcana-auth-page'>
      <div className='arcana-auth-card'>
        <div className='arcana-auth-ornament'>✦ ✦ ✦</div>
        <h1 className='arcana-auth-title'>Welcome Back</h1>
        <p className='arcana-auth-subtitle'>Sign in to your library account</p>

        <form onSubmit={HandleSubmit}>
          <div className='arcana-form-group'>
            <label className='arcana-form-label'>Email Address</label>
            <input
              type='email'
              className='arcana-input'
              placeholder='reader@example.com'
              value={textfield.email}
              onChange={HandleOnChange}
              name='email'
              autoComplete='off'
              required
              ref={refUsername}
            />
          </div>

          <div className='arcana-form-group'>
            <label className='arcana-form-label'>Password</label>
            <div className='arcana-password-wrap'>
              <input
                type={showPassword ? 'text' : 'password'}
                className='arcana-input'
                placeholder='Enter your password'
                value={textfield.password}
                onChange={HandleOnChange}
                name='password'
                autoComplete='off'
                required
              />
              <button
                type='button'
                className='arcana-password-toggle'
                onClick={() => setShowPassword(p => !p)}
              >
                {showPassword ? <BsEye /> : <BsEyeSlash />}
              </button>
            </div>
          </div>

          <button type='submit' className='btn-arcana-primary arcana-auth-submit'>
            Enter the Library
          </button>
        </form>

        <div className='arcana-auth-links'>
          <Link to='/forgotpassword'>Forgot password?</Link>
          <Link to='/signup' className='btn-arcana-secondary' style={{ textDecoration: 'none' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Login