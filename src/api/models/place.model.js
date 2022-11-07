const mongoose = require('mongoose')

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true }
}, { timestamps: true })

module.exports = mongoose.model('Place', PlaceSchema)
