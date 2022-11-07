const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const jwtRefreshExpiration = 120

const RefreshTokenSchema = new mongoose.Schema({
  token: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  expiryDate: Date
})

RefreshTokenSchema.statics.createToken = async function (user) {
  const expiredAt = new Date()

  expiredAt.setSeconds(
    expiredAt.getSeconds() + jwtRefreshExpiration
  )

  const _token = uuidv4()

  const _object = new this({
    token: _token,
    user: user._id,
    expiryDate: expiredAt.getTime()
  })

  const refreshToken = await _object.save()

  return refreshToken.token
}

RefreshTokenSchema.statics.verifyExpiration = (token) => {
  return token.expiryDate.getTime() < new Date().getTime()
}

const RefreshToken = mongoose.model('RefreshToken', RefreshTokenSchema)

module.exports = RefreshToken
