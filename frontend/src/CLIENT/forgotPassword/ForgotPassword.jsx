import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { backend_server } from '../../main'
import './forgot.css'
import axios from 'axios'
import { toast } from 'react-hot-toast'

const ForgotPassword = () => {
  const SEND_OTP_API = `${backend_server}/api/v1/forgotpassword`
  const RESET_API = `${backend_server}/api/v1/forgotpassword`

  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)

  // ✅ STEP 1: SEND OTP
  const handleSendOtp = async (e) => {
    e.preventDefault()
    try {
      await axios.post(
        SEND_OTP_API,
        { email },
        { withCredentials: true }
      )

      toast.success('OTP sent to your email')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP')
    }
  }

  // ✅ STEP 2: VERIFY OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault()

    try {
      await axios.post(
        `${backend_server}/api/v1/forgotpassword/verify-otp`,
        { otpCode: otp },
        { withCredentials: true }
      )

      toast.success('OTP verified successfully')
      setOtpVerified(true)

    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP')
    }
  }

  // ✅ STEP 3: RESET PASSWORD
  const handlePasswordFormSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setPasswordMatch(false)
      setTimeout(() => setPasswordMatch(true), 3000)
      return
    }

    const alphanumericRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/

    if (!alphanumericRegex.test(password)) {
      return toast('Password must contain letter, number & special character', { icon: 'ℹ️' })
    }

    try {
      const response = await axios.patch(
        RESET_API,
        { newPassword: password },
        { withCredentials: true }
      )

      toast.success(response.data.message)
      navigate('/login', { replace: true })

    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    }
  }

  return (
    <div className='arcana-auth-page'>
      <div className='arcana-auth-card'>
        <div className='arcana-auth-ornament'>✦ ✦ ✦</div>
        <h1 className='arcana-auth-title'>Recover Account</h1>
        <p className='arcana-auth-subtitle'>Verify your email to reset password</p>

        {/* ✅ STEP 1: EMAIL */}
        {!otpVerified && (
          <>
            <form onSubmit={handleSendOtp}>
              <div className='arcana-form-group'>
                <label className='arcana-form-label'>Email Address</label>
                <input
                  type='email'
                  className='arcana-input'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete='off'
                  placeholder='Your registered email'
                />
              </div>

              <button type='submit' className='btn-arcana-primary' style={{ width: '100%', padding: '0.75rem' }}>
                Send OTP
              </button>
            </form>

            {/* ✅ STEP 2: OTP INPUT */}
            <form onSubmit={handleVerifyOtp} style={{ marginTop: '1rem' }}>
              <div className='arcana-form-group'>
                <label className='arcana-form-label'>Enter OTP</label>
                <input
                  type='text'
                  className='arcana-input'
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder='Enter OTP'
                  required
                />
              </div>

              <button type='submit' className='btn-arcana-primary' style={{ width: '100%', padding: '0.75rem' }}>
                Verify OTP
              </button>
            </form>
          </>
        )}

        {/* ✅ STEP 3: RESET PASSWORD */}
        {otpVerified && (
          <>
            <div className='arcana-divider' style={{ margin: '2rem 0 1.5rem' }} />
            <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: 'var(--gold-light)' }}>
              Set New Password
            </h2>

            <form onSubmit={handlePasswordFormSubmit}>
              <div className='arcana-form-group'>
                <label className='arcana-form-label'>New Password</label>
                <input
                  type='password'
                  className='arcana-input'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className='arcana-form-group'>
                <label className='arcana-form-label'>Confirm Password</label>
                <input
                  type='password'
                  className='arcana-input'
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {!passwordMatch && (
                <p style={{ color: 'red', fontSize: '0.85rem' }}>
                  Passwords do not match
                </p>
              )}

              <button type='submit' className='btn-arcana-primary' style={{ width: '100%', padding: '0.75rem' }}>
                Update Password
              </button>
            </form>
          </>
        )}

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button className='btn-arcana-secondary' onClick={() => navigate(-1)}>
            ← Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword