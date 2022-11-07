const { join } = require('path')
const User = require(join(__dirname, '..', 'models', 'user.model'))
const RefreshToken = require(join(__dirname, '..', 'models', 'token.model'))
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const sendEmail = require(join(__dirname, '..', 'workers', 'sendEmail.worker'))
const createToken = async (user) => {
  const token = await jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
    expiresIn: 60 * 60 * 24
  })
  return token
}

exports.signup = async (req, res) => {
  const { email, password, confirmpass, name } = req.body
  try {
    let user = await User.findOne({ email })
    if (user) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      })
    }
    if (password !== confirmpass) {
      return res.status(422).json({
        success: false,
        error: 'Passwords do not match'
      })
    }
    const verifyhash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    user = await User.create({
      name,
      email,
      password,
      verifyhash
    })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()
    const subject = 'Verify your email'
    const html = `Please verify your email by clicking on the link below:
    http://localhost:3000/api/v1/auth/verify/${user._id}/${verifyhash} Click the link to Verify`
    await sendEmail(user.email, subject, html)
    return res.status(201).json({
      success: true,
      message: 'User created, Check email for verification'
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials or user not found'
      })
    }
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        error: 'User is not verified, Please check email'
      })
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials or user not found'
      })
    }
    const token = await createToken(user)
    const refreshToken = await RefreshToken.createToken(user)

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: {
        accessToken: token,
        refreshToken: refreshToken
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body
  try {
    if (requestToken == null) {
      return res.status(422).json({
        success: false,
        error: '"refreshToken" is required'
      })
    }
    const refreshToken = await RefreshToken.findOne({ token: requestToken })
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      })
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec()
      return res.status(403).json({
        success: false,
        error: 'Refresh token has expired!'
      })
    }
    const newAccessToken = await createToken(refreshToken.user)
    return res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      token: {
        accessToken: newAccessToken,
        refreshToken: requestToken
      }
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message: 'Internal server error'
    })
  }
}

exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, verifyhash: req.params.hash })
    if (!user) {
      return res.status(409).json({
        success: false,
        error: 'User not found'
      })
    }
    if (user.isVerified) {
      return res.status(409).json({
        success: false,
        error: 'User already verified'
      })
    }
    user.isVerified = true
    await user.save()
    return res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    })
  }
}
