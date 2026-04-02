const express = require('express')
const forgotpasswordRouter = express.Router()

const {
  postForgotPassword,
  patchUpdatePassword,
  verifyForgotOtp, // ✅ NEW
} = require('../controller/forgotpasswordController')

forgotpasswordRouter.post('/', postForgotPassword)

// ✅ NEW ROUTE FOR OTP VERIFY
forgotpasswordRouter.post('/verify-otp', verifyForgotOtp)

forgotpasswordRouter.patch('/', patchUpdatePassword)

module.exports = forgotpasswordRouter