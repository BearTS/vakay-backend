const mongoose = require('mongoose')

const TripSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  city: { type: mongoose.Schema.Types.ObjectId, ref: 'City', required: true },
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package' },
  hotel: [{
    date: { type: Date, required: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true }
  }],
  planning: [{
    start_date: { type: Date },
    end_date: { type: Date },
    place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' }
  }]
}, { timestamps: true })

module.exports = mongoose.model('Trip', TripSchema)
