// Controller for user Signup page

const { randomInt } = require('crypto') // FIX 5: cryptographically secure OTP
const UserModel = require('../models/signUpModel')
const bcrypt = require('bcrypt')
const UserOtpVerificationModel = require('../models/userOtpVerificationModel') // FIX 10: removed double slash
const nodemailer = require('nodemailer')

const OTP_EXPIRY_MS = 1000 * 60 * 5 // FIX 9: 5 minutes instead of 60 seconds

// Masking Email
const maskEmail = async (email) => {
  const atIndex = email.indexOf('@')
  if (atIndex <= 1) {
    return email
  }
  const emailFront = email.substring(0, atIndex)
  const maskedUsername =
    emailFront.substring(0, 1) +
    '*'.repeat(emailFront.length - 3) +
    emailFront.slice(-2)
  const domain = email.substring(atIndex)
  return maskedUsername + domain
}

// OTP Code Hasher
const generateOtp = async (otp_Code) => {
  const hashed_otpCode = await bcrypt.hash(String(otp_Code), 10)
  return hashed_otpCode
}

// Mail SENDER - Create a transporter with Gmail SMTP settings
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Function to send an email
const sendEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to,
      subject: 'Verify Email ! Library Management System',
      html: `<p>Your OTP Code is <strong>${otp}</strong>. This will expire in 5 minutes!</p>`, // FIX 9: updated expiry text
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    console.error('sendEmail error:', error)
  }
}

const postUserSignup = async (req, res) => {
  const { username, email, phone, userType, password } = req.body

  // Alphanumeric password validation with Special character
  const alphanumericRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/

  if (!password.match(alphanumericRegex)) {
    return res.status(400).json({
      success: false,
      message:
        'Password must be alphanumeric and contain at least one special character.',
    })
  }

  const maskedEmail = await maskEmail(email)
  const hashedPassword = await bcrypt.hash(password, 10)

  const otp_Code = randomInt(1000, 10000) // FIX 5: crypto.randomInt instead of Math.random()
  // FIX 4: removed console.log that leaked the plain OTP

  const hashed_otpCode = await generateOtp(otp_Code)

  // Check if user already registered
  const checkPrevUser = await UserModel.findOne({ email }).select('-password')

  if (!checkPrevUser) {
    // --- Brand new user ---
    const result = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      phone,
      userType,
    })

    res.cookie('otp-cookie', userId, {
  path: '/',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  httpOnly: true,
  sameSite: 'None',
  secure: true,
})

    await UserOtpVerificationModel.create({
      userId: result.id,
      userEmail: result.email,
      otpCode: hashed_otpCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS), // FIX 9
    })

    res.status(200).json({
      success: true,
      message: `Verify Email! OTP Verification code sent to ${maskedEmail}`,
      ENTER_OTP: true,
    })

    await sendEmail(email, otp_Code)
    return // FIX 7: explicit return so we don't fall through
  }

  if (checkPrevUser.emailVerified === true) {
    // --- Already verified ---
    return res.status(200).json({
      success: true,
      message: `Account already exists. Go to Login`,
      GOTO_LOGIN: true,
    })
  }

  // --- Registered but not yet verified — resend OTP ---
  res.cookie('otp-cookie', checkPrevUser.id, {
  path: '/',
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
  httpOnly: true,
  sameSite: 'None',
  secure: true,
})

  await UserOtpVerificationModel.findOneAndUpdate(
  { userId: checkPrevUser.id },
  {
    otpCode: hashed_otpCode,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  },
  { upsert: true, new: true }
)

  res.status(200).json({
    success: true,
    message: `Email already exists but not verified. OTP sent to ${maskedEmail}`,
    ENTER_OTP: true,
  })

  await sendEmail(email, otp_Code)
}

const verifyEmail = async (req, res) => {
  const userInputOtp = req.body.otpCode
  const userId = req.cookies['otp-cookie']

  if (!userId || !userInputOtp) {
    return res
      .status(400)
      .json({ success: false, message: 'Please enter your OTP Code' })
  }

  const UserOtpData = await UserOtpVerificationModel.findOne({ userId })

  // FIX 2: null guard — no OTP record found for this user
  if (!UserOtpData) {
    return res.status(400).json({
      success: false,
      message: 'OTP record not found. Please request a new OTP.',
    })
  }

  // FIX 1: check expiry BEFORE bcrypt compare (correct order)
  if (new Date() > UserOtpData.expiresAt) {
    return res
      .status(400)
      .json({ success: false, message: 'OTP Code Expired. Please resend.' })
  }

  const validateOtp = await bcrypt.compare(
    String(userInputOtp),
    UserOtpData.otpCode
  )

  if (!validateOtp) {
    return res
      .status(400)
      .json({ success: false, message: 'Invalid OTP Code' })
  }

  await UserModel.findByIdAndUpdate(userId, { emailVerified: true })

  res.clearCookie('otp-cookie', {
  httpOnly: true,
  sameSite: 'None',
  secure: true,
})

return res.status(200).json({
  success: true,
  message: 'Email Verified Successfully'
})
}

const resendOtpCode = async (req, res) => {
  const userId = req.cookies['otp-cookie']

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: 'No session found. Please sign up again.' })
  }

  const getUserData = await UserModel.findById(userId)

  if (!getUserData) {
    return res
      .status(400)
      .json({ success: false, message: 'User not found.' })
  }

  if (getUserData.emailVerified === true) {
    return res.status(200).json({
      success: true,
      message: 'Email already verified! Go to Login.',
      GOTO_LOGIN: true,
    })
  }

  const getTokenData = await UserOtpVerificationModel.findOne({ userId })

  // FIX 3: null guard — no OTP record exists yet
  if (!getTokenData) {
    return res.status(400).json({
      success: false,
      message: 'No OTP record found. Please sign up again.',
    })
  }

  // OTP hasn't expired yet — don't spam
  if (new Date() < getTokenData.expiresAt) {
    return res.status(200).json({
      success: true,
      message: 'OTP already sent and still valid!',
      ENTER_OTP: true,
    })
  }

  const otp_Code = randomInt(1000, 10000) // FIX 5: crypto.randomInt
  const hashed_otpCode = await generateOtp(otp_Code)

  await UserOtpVerificationModel.findOneAndUpdate(
  { userId },
  {
    otpCode: hashed_otpCode,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
  },
  { upsert: true, new: true }
)

  const { email } = getUserData
  const maskedEmail = await maskEmail(email)

  res.status(200).json({
    success: true,
    message: `OTP resent to ${maskedEmail}`,
    ENTER_OTP: true,
  })

  await sendEmail(email, otp_Code)
}


// signup controller
const createAdmin = async (req, res) => {
  const { email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await User.create({
    email,
    password: hashedPassword,
    userType: "admin_user" // 🔥 force admin
  });

  res.json({ message: "Admin created", admin });
};


module.exports = {
  postUserSignup,
  verifyEmail,
  resendOtpCode,
  sendEmail,
  generateOtp,
  maskEmail,
}