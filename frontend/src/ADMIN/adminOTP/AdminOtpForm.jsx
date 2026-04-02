import React, { useState } from 'react'
import { backend_server } from '../../main'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const AdminOtpForm = () => {
  const OTP_VERIFY_API = `${backend_server}/api/v1/signup/verifyEmail`
  const RESEND_OTP_API = `${backend_server}/api/v1/signup/resendOtp`
  const [otp_code, setOtp_code] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleVerifyFormSubmit = async () => {
    try {
      const response = await axios.post(OTP_VERIFY_API, { otpCode: otp_code })
      toast.success(response.data.message)
      navigate('/admin', { replace: true })
    } catch (error) {
      toast(error.response?.data?.message || 'Verification failed', { icon: 'ℹ️' })
    }
  }

  const handleResendFormSubmit = async () => {
    setLoading(true)
    const id = toast.loading('Resending OTP…', { position: 'top-center' })
    try {
      const response = await axios.post(RESEND_OTP_API, {})
      toast.dismiss(id); toast(response.data.message, { icon: 'ℹ️' })
    } catch (error) { toast.dismiss(id); console.log(error.response) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 400, background: 'var(--bg-card)', border: '1px solid var(--border-gold)', borderRadius: 'var(--radius-xl)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)', textAlign: 'center' }}>
        <div className='arcana-auth-ornament'>✉ ✦ ✉</div>
        <h2 className='arcana-auth-title'>Verify Email</h2>
        <p className='arcana-auth-subtitle'>Enter the OTP code sent to your email</p>
        <div className='arcana-form-group'>
          <input type='text' className='arcana-input' autoComplete='off'
            style={{ textAlign: 'center', fontSize: '1.8rem', letterSpacing: '0.5rem', fontFamily: 'var(--font-mono)' }}
            name='otpCode' value={otp_code} onChange={e => setOtp_code(e.target.value)}
            placeholder='------' maxLength={6} />
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
          <button className='btn-arcana-primary' style={{ flex: 1, justifyContent: 'center', padding: '0.75rem' }} onClick={handleVerifyFormSubmit}>Verify</button>
          <button className='btn-arcana-secondary' style={{ flex: 1, justifyContent: 'center' }} disabled={loading} onClick={handleResendFormSubmit}>
            {loading ? 'Sending…' : 'Resend OTP'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default AdminOtpForm
