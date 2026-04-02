// Handles forgot password using EMAIL and PHONE
const bcrpyt = require('bcrypt')
const UserModel = require('../models/signUpModel')
const { sendEmail } = require('./signUpController')

// First we check email and phone then call next APi(patchUpdatePassword) that updates password

const postForgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({
    email: email.toLowerCase() // ✅ FIX
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);

  user.otp = otp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;
  await user.save();

  await sendEmail(email, otp);

  res.cookie("otp-cookie", user._id, {
    httpOnly: true,
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
    ENTER_OTP: true,
  });

  
};

const patchUpdatePassword = async (req, res) => {
  const { newPassword } = req.body;

  const userId = req.cookies["otp-cookie"];

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  // ✅ password validation
  const alphanumericRegex =
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/;

  if (!alphanumericRegex.test(newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Password must contain letter, number & special character",
    });
  }

  // ✅ hash password
  const hashedPassword = await bcrpyt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.otp = null;
  user.otpExpiry = null;

  await user.save();

  // ✅ clear cookie
  res.clearCookie("otp-cookie");

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};

const verifyForgotOtp = async (req, res) => {
  const { otpCode } = req.body;

  const userId = req.cookies["otp-cookie"];

  if (!userId || !otpCode) {
    return res.status(400).json({
      success: false,
      message: "OTP required",
    });
  }

  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User not found",
    });
  }

  console.log("DB OTP:", user.otp);
  console.log("User OTP:", otpCode);

  // ✅ FIXED COMPARISON
  if (String(user.otp) !== String(otpCode)) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  if (Date.now() > user.otpExpiry) {
    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
};

module.exports = {
  patchUpdatePassword,
  postForgotPassword,
  verifyForgotOtp
}