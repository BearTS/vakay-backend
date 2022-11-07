const mongoose = require('mongoose')

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  hotels: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
  places: [{
    days: { type: Number, required: true },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' }
  }],
  image: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Package', PackageSchema)
