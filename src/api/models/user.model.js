const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    hash: {type: String, default: ''},
    verifyhash: {type: String, default: ''},
    plannedTrip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    }
  },
  { timestamps: true }
)


module.exports = mongoose.model('User', UserSchema)