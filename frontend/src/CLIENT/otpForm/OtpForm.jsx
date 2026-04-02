import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const VERIFY_URL = 'https://library-management-rzpi.onrender.com/api/v1/signup/verifyEmail'
const RESEND_URL = 'https://library-management-rzpi.onrender.com/api/v1/signup/resendOtp'
const OTP_EXPIRY_SECONDS = 60

const Otp = () => {
  const navigate = useNavigate()
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS)
  const inputRef = useRef(null)

  // Countdown timer — enables resend button after OTP expires
  useEffect(() => {
    inputRef.current?.focus()
    if (countdown <= 0) return
    const timer = setInterval(() => {
      setCountdown(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const handleVerify = async (e) => {
  e.preventDefault()

  if (!otpCode || otpCode.length < 4) {
    return toast('Please enter the 4-digit OTP', { icon: 'ℹ️' })
  }

  try {
    setLoading(true)
    const loadingToastId = toast.loading('Verifying OTP...', { position: 'top-center' })

    const response = await axios.post(
      VERIFY_URL,
      { otpCode }, // ✅ ONLY OTP (NO EMAIL)
      { withCredentials: true } // ✅ cookie is sent
    )

    toast.dismiss(loadingToastId)
    setLoading(false)

    if (response.data.success) {
      toast.success('Email verified! Please log in.')
      navigate('/login', { replace: true })
    }

  } catch (error) {
    setLoading(false)
    console.log(error.response?.data) // ✅ debug
    toast.error(error?.response?.data?.message || 'Invalid or expired OTP')
  }
}

  const handleResend = async () => {
  if (countdown > 0) return

  try {
    setResending(true)

    const response = await axios.post(
      RESEND_URL,
      {}, // ✅ no email needed
      { withCredentials: true }
    )

    setResending(false)
    toast(response.data.message, { icon: 'ℹ️' })

    setCountdown(OTP_EXPIRY_SECONDS)
    setOtpCode('')
    inputRef.current?.focus()

  } catch (error) {
    setResending(false)
    toast.error('Failed to resend OTP. Please try again.')
  }
}

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div className='arcana-signup-page'>
      <div className='arcana-signup-card' style={{ maxWidth: '420px' }}>
        <div className='arcana-auth-ornament'>✦ ✦ ✦</div>
        <h1 className='arcana-auth-title'>Verify Your Email</h1>
        <p className='arcana-auth-subtitle'>
          Enter the 4-digit code sent to your email
        </p>

        <form onSubmit={handleVerify}>
          <div className='arcana-form-group' style={{ marginBottom: '1.25rem' }}>
            <label className='arcana-form-label'>OTP Code</label>
            <input
              ref={inputRef}
              type='text'
              className='arcana-input'
              placeholder='e.g. 4821'
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
              maxLength={4}
              inputMode='numeric'
              autoComplete='one-time-code'
              required
              style={{ letterSpacing: '0.3rem', fontSize: '1.25rem', textAlign: 'center' }}
            />
          </div>

          {/* Countdown */}
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            {countdown > 0
              ? <>Code expires in <strong style={{ color: 'var(--accent)' }}>{formatTime(countdown)}</strong></>
              : <strong style={{ color: '#e05c5c' }}>Code expired — resend a new one</strong>
            }
          </p>

          <button
            type='submit'
            disabled={loading}
            className='btn-arcana-primary arcana-auth-submit'
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        {/* Resend */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className='btn-arcana-secondary'
            style={{ opacity: countdown > 0 ? 0.45 : 1, cursor: countdown > 0 ? 'not-allowed' : 'pointer' }}
          >
            {resending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
          <button
            onClick={() => navigate('/signup', { replace: true })}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline' }}
          >
            ← Back to Signup
          </button>
        </div>
      </div>
    </div>
  )
}

export default Otp